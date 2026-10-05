import { corsHeaders } from "./cors";
import { SUMMARY_KEY, refreshGitHubSummary } from "./refresh";

const json = (body: unknown, init: ResponseInit & { headers?: Record<string, string> } = {}) =>
  new Response(JSON.stringify(body), {
    ...init,
    headers: { "Content-Type": "application/json; charset=utf-8", ...init.headers },
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
  async fetch(request, env): Promise<Response> {
    const url = new URL(request.url);
    const cors = corsHeaders(request, env);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }

    if (request.method === "GET" && url.pathname === "/health") {
      return json({ ok: true }, { headers: cors });
    }

    if (request.method === "GET" && url.pathname === "/github-summary") {
      const summary = await env.CACHE.get(SUMMARY_KEY);
      if (!summary) return json({ error: "not_ready" }, { status: 404, headers: cors });
      return new Response(summary, {
        headers: {
          ...cors,
          "Content-Type": "application/json; charset=utf-8",
          "Cache-Control": "public, max-age=600",
        },
      });
    }

    if (request.method === "POST" && url.pathname === "/admin/refresh-github-summary") {
      if (!(await isAdmin(request, env))) return json({ error: "unauthorized" }, { status: 401 });
      try {
        return json(await refreshGitHubSummary(env));
      } catch (e) {
        return json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 });
      }
    }

    return json({ error: "not_found" }, { status: 404, headers: cors });
  },

  async scheduled(_controller, env, ctx) {
    ctx.waitUntil(
      refreshGitHubSummary(env).then(
        (result) => console.log("GitHub summary refresh:", JSON.stringify(result)),
        (e) => console.error("GitHub summary refresh failed:", e),
      ),
    );
  },
} satisfies ExportedHandler<Env>;
