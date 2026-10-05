import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { ArrowUp, Mail, RotateCcw, Sparkles } from "lucide-react";
import ChatMarkdown from "@/components/chat/ChatMarkdown";
import { stripMarkers } from "@/lib/chat-text";
import { useChat, type ChatMessage } from "@/hooks/use-chat";
import { MAX_MESSAGE_CHARS } from "@/lib/chat-client";
import { profile } from "@/data/portfolio";
import { cn } from "@/lib/utils";

const STARTER_QUESTIONS = [
  "What are Amin's strongest skills?",
  "Tell me about his RAG and multi-agent work",
  "What has he shipped on GitHub lately?",
  "Is he a fit for a voice-agent project?",
];

const TypingDots = () => (
  <span className="inline-flex gap-1 py-1" aria-label="Assistant is typing">
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        className="h-1.5 w-1.5 animate-pulse rounded-full bg-muted-foreground"
        style={{ animationDelay: `${i * 0.15}s` }}
      />
    ))}
  </span>
);

const ContactCard = ({ onClick, onLinkClick }: { onClick: () => void; onLinkClick?: () => void }) => (
  <div className="mt-3 rounded-md border border-primary/30 bg-primary/5 p-3">
    <p className="text-xs text-muted-foreground">Talk to Amin directly</p>
    <div className="mt-2 flex flex-wrap gap-2">
      <a
        href={`mailto:${profile.email}`}
        onClick={onClick}
        className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90"
      >
        <Mail className="h-3.5 w-3.5" />
        {profile.email}
      </a>
      <a
        href="#contact"
        onClick={() => {
          onClick();
          onLinkClick?.();
        }}
        className="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-secondary"
      >
        All contact options
      </a>
    </div>
  </div>
);

const MessageView = ({
  message,
  onContactClick,
  onLinkClick,
}: {
  message: ChatMessage;
  onContactClick: () => void;
  onLinkClick?: () => void;
}) => {
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <p dir="auto" className="max-w-[85%] whitespace-pre-wrap rounded-lg bg-secondary px-3.5 py-2 text-sm text-foreground">
          {message.content}
        </p>
      </div>
    );
  }

  const text = stripMarkers(message.content, message.status === "streaming");
  return (
    <div className="max-w-[92%]">
      <div
        dir="auto"
        className={cn(
          "text-sm leading-relaxed",
          message.status === "error" ? "text-muted-foreground" : "text-foreground/90",
        )}
      >
        {text ? <ChatMarkdown text={text} onLinkClick={onLinkClick} /> : <TypingDots />}
      </div>
      {message.contact && message.status !== "streaming" && (
        <ContactCard onClick={onContactClick} onLinkClick={onLinkClick} />
      )}
    </div>
  );
};

type ChatPanelProps = {
  className?: string;
  /** Called when an in-page link is followed, e.g. to close a surrounding sheet. */
  onLinkClick?: () => void;
};

const ChatPanel = ({ className, onLinkClick }: ChatPanelProps) => {
  const { messages, busy, closed, send, reset, contactClicked } = useChat();
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Keep the newest text in view while a reply streams in.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  // Grow the input with its content, up to ~4 lines.
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 112)}px`;
  }, [draft]);

  const submit = (text: string) => {
    if (!text.trim() || busy || closed) return;
    setDraft("");
    void send(text);
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    submit(draft);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      submit(draft);
    }
  };

  return (
    <div className={cn("flex min-h-0 flex-col rounded-lg border border-border bg-card", className)}>
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
        <p className="inline-flex items-center gap-2 text-sm font-medium text-foreground">
          <Sparkles className="h-4 w-4 text-primary" />
          Amin's AI assistant
        </p>
        {messages.length > 0 && (
          <button
            type="button"
            onClick={reset}
            disabled={busy}
            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 font-mono text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:opacity-50"
          >
            <RotateCcw className="h-3 w-3" />
            New chat
          </button>
        )}
      </div>

      <div ref={scrollRef} className="min-h-0 flex-1 space-y-5 overflow-y-auto px-4 py-5" aria-live="polite">
        {messages.length === 0 ? (
          <div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Ask about Amin's experience, projects, writing, or what he's been building lately. Answers come from
              this site's content and his public GitHub activity.
            </p>
            <div className="mt-5 flex flex-col items-start gap-2">
              {STARTER_QUESTIONS.map((question) => (
                <button
                  key={question}
                  type="button"
                  onClick={() => submit(question)}
                  className="rounded-md border border-border px-3 py-1.5 text-left text-sm text-foreground transition-colors hover:border-primary/50 hover:bg-secondary"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <MessageView key={message.id} message={message} onContactClick={contactClicked} onLinkClick={onLinkClick} />
          ))
        )}
      </div>

      <form onSubmit={onSubmit} className="border-t border-border p-3">
        <div className="flex items-end gap-2 rounded-md border border-border bg-background px-3 py-2 focus-within:border-primary/50">
          <textarea
            ref={inputRef}
            dir="auto"
            rows={1}
            value={draft}
            maxLength={MAX_MESSAGE_CHARS}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={onKeyDown}
            disabled={closed}
            placeholder={closed ? "Start a new chat to continue" : "Ask about Amin's work…"}
            aria-label="Message Amin's AI assistant"
            className="max-h-28 min-h-[1.5rem] flex-1 resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={!draft.trim() || busy || closed}
            aria-label="Send message"
            className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-2 flex justify-between gap-3 px-1 text-[11px] text-muted-foreground">
          <span>AI answers can be wrong. Questions are logged anonymously.</span>
          {draft.length > MAX_MESSAGE_CHARS - 100 && (
            <span className="font-mono">
              {draft.length}/{MAX_MESSAGE_CHARS}
            </span>
          )}
        </div>
      </form>
    </div>
  );
};

export default ChatPanel;
