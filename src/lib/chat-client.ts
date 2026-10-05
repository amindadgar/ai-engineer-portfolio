import { API_URL } from "@/lib/api";

// Mirrors the Worker limit (worker/src/chat.ts).
export const MAX_MESSAGE_CHARS = 500;

export type ChatSession = { token: string; conversationId: string; expiresAt: number };

export type LimitScope = "burst" | "conversation" | "visitor_daily" | "global_daily";

export class ChatApiError extends Error {
  constructor(
    readonly code: string,
    readonly status: number,
    readonly scope?: LimitScope,
  ) {
    super(code);
  }
}

const post = (path: string, body: unknown, token?: string, signal?: AbortSignal) =>
  fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify(body),
    signal,
  });

const toError = async (response: Response) => {
  const body = await response.json().catch(() => ({}));
  return new ChatApiError(String(body.error ?? "request_failed"), response.status, body.scope);
};

export const createSession = async (turnstileToken: string, page: string, previousToken?: string): Promise<ChatSession> => {
  const response = await post("/chat/session", { turnstileToken, page, previousToken });
  if (!response.ok) throw await toError(response);
  return response.json();
};

/** Streams one assistant reply; resolves with whether the reply asked to show the contact card. */
export const streamReply = async (
  token: string,
  message: string,
  onText: (text: string) => void,
  signal?: AbortSignal,
): Promise<{ contact: boolean }> => {
  const response = await post("/chat", { message }, token, signal);
  if (!response.ok || !response.body) throw await toError(response);

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    let boundary: number;
    while ((boundary = buffer.indexOf("\n\n")) !== -1) {
      const line = buffer.slice(0, boundary).trim();
      buffer = buffer.slice(boundary + 2);
      if (!line.startsWith("data:")) continue;
      const event = JSON.parse(line.slice(5));
      if (event.type === "delta") onText(event.text);
      else if (event.type === "done") return { contact: Boolean(event.contact) };
      else if (event.type === "error") throw new ChatApiError("upstream_error", 502);
    }
  }
  throw new ChatApiError("stream_interrupted", 502);
};

export const recordContactClick = (token: string) => post("/chat/contact-click", {}, token).catch(() => undefined);
