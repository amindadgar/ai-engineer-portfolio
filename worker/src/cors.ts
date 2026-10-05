// Vercel preview deployments of the portfolio project.
const PREVIEW_ORIGIN = /^https:\/\/ai-engineer-portfolio-[a-z0-9-]+\.vercel\.app$/;

export const isAllowedOrigin = (origin: string | null, allowList: string): boolean => {
  if (!origin) return false;
  const allowed = allowList.split(",").map((o) => o.trim());
  return allowed.includes(origin) || PREVIEW_ORIGIN.test(origin);
};

export const corsHeaders = (request: Request, env: Env): Record<string, string> => {
  const origin = request.headers.get("Origin");
  const headers: Record<string, string> = { Vary: "Origin" };
  if (isAllowedOrigin(origin, env.ALLOWED_ORIGINS)) {
    headers["Access-Control-Allow-Origin"] = origin!;
    headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS";
    headers["Access-Control-Allow-Headers"] = "Content-Type";
    headers["Access-Control-Max-Age"] = "86400";
  }
  return headers;
};
