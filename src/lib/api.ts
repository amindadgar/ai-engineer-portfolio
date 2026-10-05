// Cloudflare Worker backing the dynamic sections (see worker/). Override with VITE_API_URL in .env.local for local dev.
export const API_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? "https://api.amindadgar.com";

// Turnstile site keys are public. For local dev against a local Worker, set VITE_TURNSTILE_SITE_KEY to
// Cloudflare's always-pass test key 1x00000000000000000000AA.
export const TURNSTILE_SITE_KEY =
  (import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined) ?? "0x4AAAAAAFOUJzHbjz-AXetd";
