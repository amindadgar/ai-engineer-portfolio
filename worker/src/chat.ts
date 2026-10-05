import { CONTACT_MARKER, buildSystemPrompt } from "./knowledge";
import { consumeDailyQuota, type LimitScope } from "./limits";
import { createSseParser, interpretChunk, parseModelList, streamChatCompletion, type ChatMessage } from "./openrouter";
import { SUMMARY_KEY } from "./refresh";
import { SESSION_TTL_MS, hashIp, signSession, verifySession, verifyTurnstile } from "./session";
import type { GitHubSummary } from "./types";

export const MAX_MESSAGE_CHARS = 500;
const HISTORY_MESSAGES = 12;
const MAX_OUTPUT_TOKENS = 700;
// An expired session can be renewed (keeping its conversation) for this long after expiry.
const RENEW_WINDOW_MS = 24 * 60 * 60 * 1000;

type Json = (body: unknown, status?: number, extra?: Record<string, string>) => Response;

const clientIp = (request: Request) => request.headers.get("CF-Connecting-IP") ?? "unknown";

const readJson = async (request: Request): Promise<Record<string, unknown>> => {
  try {
    const body = await request.json();
    return body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  } catch {
    return {};
  }
};

const rateLimited = (json: Json, scope: LimitScope, retryAfterSeconds: number) =>
  json({ error: "rate_limited", scope, retryAfterSeconds }, 429, { "Retry-After": String(retryAfterSeconds) });

/** POST /chat/session — verify Turnstile, then issue a signed session (renewing the conversation if possible). */
export const createChatSession = async (request: Request, env: Env, json: Json): Promise<Response> => {
  const body = await readJson(request);
  const ip = clientIp(request);
  const ipHash = await hashIp(env.SESSION_SECRET, ip);
  const now = Date.now();

  const turnstile = await verifyTurnstile(env.TURNSTILE_SECRET_KEY, String(body.turnstileToken ?? ""), ip);
  if (!turnstile.success) return json({ error: "verification_failed", codes: turnstile.errorCodes }, 403);

  // Reuse the conversation of a recently expired session from the same visitor.
  let conversationId: string | null = null;
  if (typeof body.previousToken === "string") {
    const previous = await verifySession(env.SESSION_SECRET, body.previousToken, ipHash, now - RENEW_WINDOW_MS);
    if (previous.ok) conversationId = previous.session.cid;
  }

  if (!conversationId) {
    conversationId = crypto.randomUUID();
    const page = typeof body.page === "string" && body.page.startsWith("/") ? body.page.slice(0, 120) : null;
    const userAgent = request.headers.get("User-Agent") ?? "";
    await env.DB.prepare(
      "INSERT INTO conversations (id, created_at, country, device, page) VALUES (?1, ?2, ?3, ?4, ?5)",
    )
      .bind(
        conversationId,
        now,
        (request.cf?.country as string | undefined) ?? null,
        /Mobi|Android|iPhone|iPad/i.test(userAgent) ? "mobile" : "desktop",
        page,
      )
      .run();
  }

  const expiresAt = now + SESSION_TTL_MS;
  const token = await signSession(env.SESSION_SECRET, { cid: conversationId, ip: ipHash, exp: expiresAt });
  return json({
    token,
    conversationId,
    expiresAt,
    limits: { maxTurns: Number(env.CHAT_MAX_TURNS), maxMessageChars: MAX_MESSAGE_CHARS },
  });
};

const authenticate = async (request: Request, env: Env) => {
  const header = request.headers.get("Authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  const ipHash = await hashIp(env.SESSION_SECRET, clientIp(request));
  return { ipHash, check: await verifySession(env.SESSION_SECRET, token, ipHash) };
};

const sseEvent = (payload: unknown) => `data: ${JSON.stringify(payload)}\n\n`;

/** POST /chat — one user message in, a streamed assistant reply out. */
export const handleChat = async (request: Request, env: Env, ctx: ExecutionContext, json: Json, cors: Record<string, string>) => {
  const { ipHash, check } = await authenticate(request, env);
  if (!check.ok) return json({ error: check.reason === "expired" ? "session_expired" : "session_invalid" }, 401);
  const conversationId = check.session.cid;

  const body = await readJson(request);
  const message = typeof body.message === "string" ? body.message.trim() : "";
  if (!message) return json({ error: "empty_message" }, 400);
  if (message.length > MAX_MESSAGE_CHARS) return json({ error: "message_too_long", maxMessageChars: MAX_MESSAGE_CHARS }, 400);

  // 1. Burst limit per visitor (in-memory at the edge, no storage cost).
  const burst = await env.CHAT_BURST.limit({ key: ipHash });
  if (!burst.success) return rateLimited(json, "burst", 60);

  // 2. Conversation length; history is server-side so visitors can't forge earlier turns.
  const [conversation, history] = await env.DB.batch<any>([
    env.DB.prepare("SELECT turns FROM conversations WHERE id = ?1").bind(conversationId),
    env.DB.prepare(
      `SELECT role, content FROM messages
       WHERE conversation_id = ?1 AND error IS NULL
       ORDER BY id DESC LIMIT ?2`,
    ).bind(conversationId, HISTORY_MESSAGES),
  ]);
  const turns = conversation.results[0]?.turns;
  if (typeof turns !== "number") return json({ error: "session_invalid" }, 401);
  if (turns >= Number(env.CHAT_MAX_TURNS)) return rateLimited(json, "conversation", 0);

  // 3. Daily quotas per visitor and for the whole site.
  const quota = await consumeDailyQuota(env.DB, ipHash, {
    perVisitor: Number(env.CHAT_DAILY_LIMIT_PER_VISITOR),
    global: Number(env.CHAT_DAILY_LIMIT_GLOBAL),
  });
  if (!quota.ok) return rateLimited(json, quota.scope, quota.retryAfterSeconds);

  const github = await env.CACHE.get<GitHubSummary>(SUMMARY_KEY, "json");
  const messages: ChatMessage[] = [
    buildSystemPrompt(github, new Date().toISOString().slice(0, 10)),
    ...(history.results as ChatMessage[]).reverse(),
    { role: "user", content: message },
  ];

  const startedAt = Date.now();
  const log = (reply: { content: string; model: string | null; promptTokens: number | null; completionTokens: number | null; error: string | null }) =>
    env.DB.batch([
      env.DB.prepare(
        "INSERT INTO messages (conversation_id, role, content, created_at, error) VALUES (?1, 'user', ?2, ?3, ?4)",
      ).bind(conversationId, message, startedAt, reply.error),
      env.DB.prepare(
        `INSERT INTO messages (conversation_id, role, content, created_at, model, latency_ms, prompt_tokens, completion_tokens, error)
         VALUES (?1, 'assistant', ?2, ?3, ?4, ?5, ?6, ?7, ?8)`,
      ).bind(
        conversationId,
        reply.content,
        Date.now(),
        reply.model,
        Date.now() - startedAt,
        reply.promptTokens,
        reply.completionTokens,
        reply.error,
      ),
      env.DB.prepare(
        `UPDATE conversations SET turns = turns + 1, last_message_at = ?2,
         contact_shown = MAX(contact_shown, ?3) WHERE id = ?1`,
      ).bind(conversationId, Date.now(), reply.content.includes(CONTACT_MARKER) ? 1 : 0),
    ]);

  let upstream: ReadableStream<Uint8Array>;
  try {
    upstream = await streamChatCompletion(env.OPENROUTER_API_KEY, parseModelList(env.CHAT_MODELS), messages, {
      maxTokens: MAX_OUTPUT_TOKENS,
      baseUrl: env.OPENROUTER_BASE_URL,
    });
  } catch (e) {
    const error = e instanceof Error ? e.message : String(e);
    console.error("Chat upstream failed:", error);
    ctx.waitUntil(log({ content: "", model: null, promptTokens: null, completionTokens: null, error }));
    return json({ error: "upstream_unavailable" }, 502);
  }

  const { readable, writable } = new TransformStream<Uint8Array, Uint8Array>();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();
  // Writes fail if the visitor closes the tab mid-reply; keep going so the turn is still logged.
  const send = (payload: unknown) => writer.write(encoder.encode(sseEvent(payload))).catch(() => {});

  const pump = async () => {
    const reply = { content: "", model: null as string | null, promptTokens: null as number | null, completionTokens: null as number | null, error: null as string | null };
    const parse = createSseParser((data) => {
      for (const event of interpretChunk(data)) {
        if (event.type === "delta") {
          reply.content += event.text;
          send({ type: "delta", text: event.text });
        } else if (event.type === "finish") {
          reply.model = event.model ?? reply.model;
          reply.promptTokens = event.promptTokens ?? reply.promptTokens;
          reply.completionTokens = event.completionTokens ?? reply.completionTokens;
        } else {
          reply.error = event.message;
        }
      }
    });

    const reader = upstream.getReader();
    const decoder = new TextDecoder();
    try {
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        parse(decoder.decode(value, { stream: true }));
      }
    } catch (e) {
      reply.error = e instanceof Error ? e.message : String(e);
    }

    if (reply.error && !reply.content) {
      await send({ type: "error", message: "The assistant is unavailable right now." });
    } else {
      await send({ type: "done", contact: reply.content.includes(CONTACT_MARKER) });
    }
    await writer.close().catch(() => {});
    await log(reply).catch((e) => console.error("Chat log failed:", e));
  };
  ctx.waitUntil(pump());

  return new Response(readable, {
    headers: {
      ...cors,
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
    },
  });
};

/** POST /chat/contact-click — lead signal when the visitor uses the contact card. */
export const recordContactClick = async (request: Request, env: Env, json: Json) => {
  const { check } = await authenticate(request, env);
  if (!check.ok) return json({ error: "session_invalid" }, 401);
  await env.DB.prepare("UPDATE conversations SET contact_clicked = 1 WHERE id = ?1").bind(check.session.cid).run();
  return json({ ok: true });
};

/** GET /admin/conversations?days=7 — recent conversations with their messages, newest first. */
export const listConversations = async (env: Env, days: number) => {
  const since = Date.now() - Math.min(Math.max(days, 1), 90) * 24 * 60 * 60 * 1000;
  const [conversations, messages] = await env.DB.batch<any>([
    env.DB.prepare(
      `SELECT id, created_at, last_message_at, country, device, page, turns, contact_shown, contact_clicked
       FROM conversations WHERE created_at >= ?1 AND turns > 0 ORDER BY created_at DESC LIMIT 100`,
    ).bind(since),
    env.DB.prepare(
      `SELECT m.conversation_id, m.role, m.content, m.created_at, m.model, m.latency_ms, m.error
       FROM messages m JOIN conversations c ON c.id = m.conversation_id
       WHERE c.created_at >= ?1 ORDER BY m.id`,
    ).bind(since),
  ]);
  const byConversation = new Map<string, any[]>();
  for (const m of messages.results) {
    if (!byConversation.has(m.conversation_id)) byConversation.set(m.conversation_id, []);
    byConversation.get(m.conversation_id)!.push(m);
  }
  return conversations.results.map((c: any) => ({
    ...c,
    created_at: new Date(c.created_at).toISOString(),
    last_message_at: c.last_message_at ? new Date(c.last_message_at).toISOString() : null,
    messages: (byConversation.get(c.id) ?? []).map((m) => ({ ...m, created_at: new Date(m.created_at).toISOString() })),
  }));
};
