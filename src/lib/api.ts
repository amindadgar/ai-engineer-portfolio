// Cloudflare Worker backing the dynamic sections (see worker/). Override with VITE_API_URL in .env.local for local dev.
export const API_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? "https://api.amindadgar.com";
