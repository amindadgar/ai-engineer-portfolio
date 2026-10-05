// Stateless chat sessions: a Turnstile-verified visitor gets an HMAC-signed token bound to their IP hash.

const encoder = new TextEncoder();

const toBase64Url = (bytes: ArrayBuffer | Uint8Array) =>
  btoa(String.fromCharCode(...new Uint8Array(bytes)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

const fromBase64Url = (value: string) =>
  Uint8Array.from(atob(value.replace(/-/g, "+").replace(/_/g, "/")), (c) => c.charCodeAt(0));

const hmacKey = (secret: string) =>
  crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);

const hmac = async (secret: string, data: string) =>
  crypto.subtle.sign("HMAC", await hmacKey(secret), encoder.encode(data));

/** Salted, non-reversible visitor id. Raw IPs are never stored or logged. */
export const hashIp = async (secret: string, ip: string): Promise<string> =>
  [...new Uint8Array(await hmac(secret, `ip:${ip}`))]
    .slice(0, 16)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

export type SessionPayload = {
  /** Conversation id. */
  cid: string;
  /** IP hash the session was issued to. */
  ip: string;
  /** Expiry, epoch milliseconds. */
  exp: number;
};

export const SESSION_TTL_MS = 30 * 60 * 1000;

export const signSession = async (secret: string, payload: SessionPayload): Promise<string> => {
  const body = toBase64Url(encoder.encode(JSON.stringify(payload)));
  return `${body}.${toBase64Url(await hmac(secret, body))}`;
};

export type SessionCheck =
  | { ok: true; session: SessionPayload }
  | { ok: false; reason: "invalid" | "expired" | "ip_mismatch" };

export const verifySession = async (
  secret: string,
  token: string,
  ipHash: string,
  now = Date.now(),
): Promise<SessionCheck> => {
  const [body, signature] = token.split(".");
  if (!body || !signature) return { ok: false, reason: "invalid" };

  let valid = false;
  try {
    valid = await crypto.subtle.verify("HMAC", await hmacKey(secret), fromBase64Url(signature), encoder.encode(body));
  } catch {
    return { ok: false, reason: "invalid" };
  }
  if (!valid) return { ok: false, reason: "invalid" };

  let session: SessionPayload;
  try {
    session = JSON.parse(new TextDecoder().decode(fromBase64Url(body)));
  } catch {
    return { ok: false, reason: "invalid" };
  }
  if (typeof session.exp !== "number" || session.exp < now) return { ok: false, reason: "expired" };
  if (session.ip !== ipHash) return { ok: false, reason: "ip_mismatch" };
  return { ok: true, session };
};

export type TurnstileResult = { success: boolean; errorCodes: string[] };

export const verifyTurnstile = async (secret: string, token: string, ip: string): Promise<TurnstileResult> => {
  if (!secret) return { success: false, errorCodes: ["missing-secret"] };
  if (!token || token.length > 2048) return { success: false, errorCodes: ["invalid-input-response"] };
  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret, response: token, remoteip: ip }),
      signal: AbortSignal.timeout(10_000),
    });
    const result = await response.json<{ success: boolean; "error-codes"?: string[] }>();
    return { success: Boolean(result.success), errorCodes: result["error-codes"] ?? [] };
  } catch {
    return { success: false, errorCodes: ["internal-error"] };
  }
};
