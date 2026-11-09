import { useEffect, useState } from "react";

const VERIFYING_LINES = [
  "Human or polite robot?",
  "Asking Cloudflare for a vouch…",
  "Counting your fingers…",
  "Measuring your curiosity…",
  "Secret handshake time…",
  "Three bots in a trench coat?",
  "Stamping your visitor pass…",
  "Checking your blink rate…",
];

const THINKING_LINES = [
  "Digging through Amin's projects…",
  "Browsing his GitHub commits…",
  "Consulting the RAG pipeline…",
  "Negotiating with the agents…",
  "Retrieving relevant bits…",
  "Brewing an answer…",
  "Untangling embeddings…",
  "Warming up the tokens…",
  "Cross-checking the résumé…",
  "Finding the good stuff…",
];

const ROTATE_MS = 2200;

const shuffled = (lines: string[]) => [...lines].sort(() => Math.random() - 0.5);

/** Rotating playful status text shown while a reply hasn't started streaming yet. */
const LoadingText = ({ phase }: { phase: "verifying" | "thinking" }) => {
  const [order, setOrder] = useState(() => shuffled(phase === "verifying" ? VERIFYING_LINES : THINKING_LINES));
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setOrder(shuffled(phase === "verifying" ? VERIFYING_LINES : THINKING_LINES));
    setIndex(0);
    const timer = setInterval(() => setIndex((i) => i + 1), ROTATE_MS);
    return () => clearInterval(timer);
  }, [phase]);

  return (
    <span className="inline-flex items-center gap-2 py-1 text-muted-foreground" role="status">
      <span className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-primary" aria-hidden />
      <span key={`${phase}-${index}`} className="animate-in fade-in slide-in-from-bottom-1 duration-300">
        {order[index % order.length]}
      </span>
    </span>
  );
};

export default LoadingText;
