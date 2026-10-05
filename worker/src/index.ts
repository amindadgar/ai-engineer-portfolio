import { createChatSession, handleChat, listConversations, recordContactClick } from "./chat";
import { corsHeaders } from "./cors";
import { pruneExpiredCounters } from "./limits";
import { SUMMARY_KEY, refreshGitHubSummary } from "./refresh";

const jsonResponse = (body: unknown, status = 200, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...headers },
  });

const sha256 = async (value: string) =>
  crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));

const isAdmin = async (request: Request, env: Env): Promise<boolean> => {
  const header = request.headers.get("Authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!env.ADMIN_TOKEN || !token) return false;
  // Hash first so both buffers have equal length for the constant-time comparison.
  const [a, b] = await Promise.all([sha256(token), sha256(env.ADMIN_TOKEN)]);
  return crypto.subtle.timingSafeEqual(a, b);
};

export default {
  async fetch(request, env, ctx): Promise<Response> {
    const url = new URL(request.url);
    const cors = corsHeaders(request, env);
    const json = (body: unknown, status = 200, extra: Record<string, string> = {}) =>
      jsonResponse(body, status, { ...cors, ...extra });
    const route = `${request.method} ${url.pathname}`;

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }

    // Browser-only endpoints: refuse other origins outright rather than relying on CORS alone.
    if (url.pathname.startsWith("/chat") && !cors["Access-Control-Allow-Origin"]) {
      return json({ error: "forbidden_origin" }, 403);
    }

    try {
      switch (route) {
        case "GET /health":
          return json({ ok: true });

        case "GET /github-summary": {
          const summary = await env.CACHE.get(SUMMARY_KEY);
          if (!summary) return json({ error: "not_ready" }, 404);
          return new Response(summary, {
            headers: { ...cors, "Content-Type": "application/json; charset=utf-8", "Cache-Control": "public, max-age=600" },
          });
        }

        case "POST /chat/session":
          return await createChatSession(request, env, json);

        case "POST /chat":
          return await handleChat(request, env, ctx, json, cors);

        case "POST /chat/contact-click":
          return await recordContactClick(request, env, json);

        case "POST /admin/refresh-github-summary":
          if (!(await isAdmin(request, env))) return json({ error: "unauthorized" }, 401);
          return json(await refreshGitHubSummary(env));

        case "GET /admin/conversations":
          if (!(await isAdmin(request, env))) return json({ error: "unauthorized" }, 401);
          return json(await listConversations(env, Number(url.searchParams.get("days") ?? 7)));

        default:
          return json({ error: "not_found" }, 404);
      }
    } catch (e) {
      console.error(`${route} failed:`, e);
      return json({ error: "internal_error" }, 500);
    }
  },

  async scheduled(_controller, env, ctx) {
    ctx.waitUntil(
      refreshGitHubSummary(env).then(
        (result) => console.log("GitHub summary refresh:", JSON.stringify(result)),
        (e) => console.error("GitHub summary refresh failed:", e),
      ),
    );
    ctx.waitUntil(pruneExpiredCounters(env.DB).catch((e) => console.error("Counter cleanup failed:", e)));
  },
} satisfies ExportedHandler<Env>;
