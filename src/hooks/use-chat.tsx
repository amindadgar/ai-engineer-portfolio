import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import {
  ChatApiError,
  MAX_MESSAGE_CHARS,
  createSession,
  recordContactClick,
  streamReply,
  type ChatSession,
} from "@/lib/chat-client";
import { getTurnstileToken } from "@/lib/turnstile";
import { profile } from "@/data/portfolio";

export type ChatMessage = {
  id: number;
  role: "user" | "assistant";
  content: string;
  status: "streaming" | "done" | "error";
  /** Show the contact card under this reply. */
  contact?: boolean;
};

type ChatContextValue = {
  messages: ChatMessage[];
  busy: boolean;
  /** Set when the conversation can't continue (turn limit reached); "New chat" clears it. */
  closed: boolean;
  send: (text: string) => Promise<void>;
  reset: () => void;
  contactClicked: () => void;
};

const ChatContext = createContext<ChatContextValue | null>(null);

// Renew a little before expiry so a reply never starts with a dead session.
const SESSION_MARGIN_MS = 60_000;

const limitMessage = (error: ChatApiError): string => {
  switch (error.scope) {
    case "burst":
      return "You're sending messages quickly. Please wait a minute and try again.";
    case "conversation":
      return "This chat has reached its length limit. Start a new chat to keep going, or reach Amin directly.";
    case "visitor_daily":
      return "You've reached today's message limit. Amin would be glad to continue the conversation by email.";
    case "global_daily":
      return "I'm resting for today after a busy day of questions. You can still reach Amin directly.";
    default:
      return `Sorry, I couldn't answer that right now. You can reach Amin at ${profile.email}.`;
  }
};

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [busy, setBusy] = useState(false);
  const [closed, setClosed] = useState(false);
  const session = useRef<ChatSession | null>(null);
  const nextId = useRef(1);
  const turnstileContainer = useRef<HTMLDivElement>(null);

  const ensureSession = useCallback(async (forceNew = false) => {
    const current = session.current;
    if (!forceNew && current && current.expiresAt - Date.now() > SESSION_MARGIN_MS) return current;
    const turnstileToken = await getTurnstileToken(turnstileContainer.current!);
    // Passing the old token lets the server keep the same conversation after expiry.
    session.current = await createSession(turnstileToken, window.location.pathname, current?.token);
    return session.current;
  }, []);

  const updateMessage = (id: number, update: (m: ChatMessage) => ChatMessage) =>
    setMessages((all) => all.map((m) => (m.id === id ? update(m) : m)));

  const send = useCallback(
    async (text: string) => {
      const message = text.trim().slice(0, MAX_MESSAGE_CHARS);
      if (!message || busy || closed) return;

      const userId = nextId.current++;
      const replyId = nextId.current++;
      setMessages((all) => [
        ...all,
        { id: userId, role: "user", content: message, status: "done" },
        { id: replyId, role: "assistant", content: "", status: "streaming" },
      ]);
      setBusy(true);

      const attempt = async (forceNewSession: boolean) => {
        const { token } = await ensureSession(forceNewSession);
        return streamReply(token, message, (delta) =>
          updateMessage(replyId, (m) => ({ ...m, content: m.content + delta })),
        );
      };

      try {
        let result;
        try {
          result = await attempt(false);
        } catch (error) {
          // Session expired or was issued to a different IP (e.g. phone switched networks): verify again once.
          if (error instanceof ChatApiError && error.status === 401) result = await attempt(true);
          else throw error;
        }
        updateMessage(replyId, (m) => ({ ...m, status: "done", contact: result.contact }));
      } catch (error) {
        const content =
          error instanceof ChatApiError && error.status === 429
            ? limitMessage(error)
            : limitMessage(new ChatApiError("failed", 0));
        if (error instanceof ChatApiError && error.scope === "conversation") setClosed(true);
        const showContact = error instanceof ChatApiError && error.status === 429 && error.scope !== "burst";
        updateMessage(replyId, (m) => ({ ...m, content, status: "error", contact: showContact }));
      } finally {
        setBusy(false);
      }
    },
    [busy, closed, ensureSession],
  );

  const reset = useCallback(() => {
    session.current = null;
    setMessages([]);
    setClosed(false);
  }, []);

  const contactClicked = useCallback(() => {
    if (session.current) recordContactClick(session.current.token);
  }, []);

  const value = useMemo(
    () => ({ messages, busy, closed, send, reset, contactClicked }),
    [messages, busy, closed, send, reset, contactClicked],
  );

  return (
    <ChatContext.Provider value={value}>
      {children}
      {/* Turnstile renders here only if Cloudflare needs the visitor to interact. */}
      <div ref={turnstileContainer} className="fixed bottom-4 left-1/2 z-[60] -translate-x-1/2" />
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error("useChat must be used inside ChatProvider");
  return context;
};
