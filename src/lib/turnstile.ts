import { TURNSTILE_SITE_KEY } from "@/lib/api";

type TurnstileApi = {
  render: (container: HTMLElement, options: Record<string, unknown>) => string;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const SCRIPT_URL = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
let scriptPromise: Promise<TurnstileApi> | null = null;

// Loaded on first chat use only, so visitors who never chat don't pay for it.
const loadTurnstile = () => {
  scriptPromise ??= new Promise<TurnstileApi>((resolve, reject) => {
    if (window.turnstile) return resolve(window.turnstile);
    const script = document.createElement("script");
    script.src = SCRIPT_URL;
    script.async = true;
    script.onload = () => (window.turnstile ? resolve(window.turnstile) : reject(new Error("Turnstile unavailable")));
    script.onerror = () => {
      scriptPromise = null;
      reject(new Error("Turnstile failed to load"));
    };
    document.head.appendChild(script);
  });
  return scriptPromise;
};

/**
 * Runs an invisible Turnstile check and resolves with a single-use token.
 * The widget only becomes visible (inside `container`) if Cloudflare needs the visitor to interact.
 */
export const getTurnstileToken = async (container: HTMLElement): Promise<string> => {
  if (!TURNSTILE_SITE_KEY) throw new Error("Turnstile site key is not configured");
  const turnstile = await loadTurnstile();
  return new Promise((resolve, reject) => {
    let widgetId = "";
    const cleanup = () => setTimeout(() => widgetId && turnstile.remove(widgetId), 0);
    widgetId = turnstile.render(container, {
      sitekey: TURNSTILE_SITE_KEY,
      action: "chat",
      appearance: "interaction-only",
      callback: (token: string) => {
        cleanup();
        resolve(token);
      },
      "error-callback": () => {
        cleanup();
        reject(new Error("Verification failed"));
      },
      "timeout-callback": () => {
        cleanup();
        reject(new Error("Verification timed out"));
      },
    });
  });
};
