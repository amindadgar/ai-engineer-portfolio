import { useEffect, useRef, useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import ChatMarkdown from "@/components/chat/ChatMarkdown";

// Pre-written from src/data/portfolio.ts and labeled "Sample" on the page, so the hero costs no API calls.
const SAMPLES = [
  {
    question: "Has Amin shipped a production AI product?",
    answer:
      "Yes. **AXIS** is an AI meeting platform he built across a React web app, a Chrome MV3 recording extension, and Supabase Edge Functions, with schema-constrained LLM outputs that turn meetings into tasks.",
  },
  {
    question: "What has he built with RAG?",
    answer:
      "At **TogetherCrew** he built RAG systems with llama-index, adding caching, deduplication, and time-indexed ingestion, which boosted accuracy by 30%. Custom evaluation metrics improved output quality by 40%.",
  },
  {
    question: "Is he a fit for a multi-agent project?",
    answer:
      "He builds **multi-agent systems** with task decomposition, tool use, and context management, and built a CrewAI + Temporal workflow with step-level traceability.",
  },
];

const THINK_MS = 900;
const CHARS_PER_TICK = 3;
const TICK_MS = 30;
const HOLD_MS = 4500;

type Phase = "thinking" | "streaming" | "holding";

/**
 * A looping, typed-out sample conversation for the hero. It pauses while off screen or in a background tab,
 * and shows the first sample statically when the visitor prefers reduced motion.
 */
const HeroChatPreview = () => {
  const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>(reduceMotion ? "holding" : "thinking");
  const [shown, setShown] = useState(reduceMotion ? SAMPLES[0].answer.length : 0);
  const [active, setActive] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  // Run only while the card is on screen and the tab is visible.
  useEffect(() => {
    const el = root.current;
    if (!el || reduceMotion) return;
    let onScreen = false;
    const update = () => setActive(onScreen && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      update();
    });
    observer.observe(el);
    document.addEventListener("visibilitychange", update);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, [reduceMotion]);

  const answer = SAMPLES[index].answer;

  useEffect(() => {
    if (!active) return;
    if (phase === "thinking") {
      const timer = setTimeout(() => setPhase("streaming"), THINK_MS);
      return () => clearTimeout(timer);
    }
    if (phase === "streaming") {
      if (shown >= answer.length) {
        setPhase("holding");
        return;
      }
      const timer = setTimeout(() => setShown((n) => n + CHARS_PER_TICK), TICK_MS);
      return () => clearTimeout(timer);
    }
    const timer = setTimeout(() => {
      setIndex((i) => (i + 1) % SAMPLES.length);
      setShown(0);
      setPhase("thinking");
    }, HOLD_MS);
    return () => clearTimeout(timer);
  }, [active, phase, shown, answer.length]);

  const sample = SAMPLES[index];

  return (
    <div
      ref={root}
      className="flex h-[22rem] flex-col rounded-xl border border-border bg-card/70 shadow-2xl shadow-black/20 backdrop-blur-md"
    >
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
        <p className="inline-flex items-center gap-2 text-sm font-medium text-foreground">
          <Sparkles className="h-4 w-4 text-primary" />
          Amin's AI assistant
        </p>
        <span className="rounded border border-border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          Sample
        </span>
      </div>

      <div className="flex-1 space-y-4 overflow-hidden px-4 py-5" aria-live="off">
        <div className="flex justify-end">
          <p key={index} className="max-w-[85%] rounded-lg bg-secondary px-3.5 py-2 text-sm text-foreground animate-fade-in">
            {sample.question}
          </p>
        </div>
        <div className="text-sm leading-relaxed text-foreground/90">
          {phase === "thinking" ? (
            <span className="inline-flex gap-1 py-1" aria-label="Assistant is typing">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="h-1.5 w-1.5 animate-pulse rounded-full bg-muted-foreground"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </span>
          ) : (
            <ChatMarkdown text={answer.slice(0, shown)} />
          )}
        </div>
      </div>

      <a
        href="#ask"
        className="group flex items-center justify-between border-t border-border px-4 py-3 text-sm font-medium text-foreground transition-colors hover:text-primary"
      >
        Ask your own question
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </a>
    </div>
  );
};

export default HeroChatPreview;
