import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from "react";
import { cn } from "@/lib/utils";

// Elements waiting to be revealed. One scroll listener serves them all and detaches when none are left.
const pending = new Set<HTMLElement>();
let frame = 0;

const show = (el: HTMLElement) => {
  el.setAttribute("data-shown", "");
  pending.delete(el);
};

// Reveal everything whose top has reached the lower part of the viewport, including anything already scrolled
// past. Checking position (rather than waiting for an intersection) means jumps such as End or an anchor link
// never leave skipped sections invisible.
const check = () => {
  frame = 0;
  const line = window.innerHeight * 0.92;
  for (const el of pending) if (el.getBoundingClientRect().top < line) show(el);
  if (pending.size === 0) {
    window.removeEventListener("scroll", schedule);
    window.removeEventListener("resize", schedule);
  }
};

function schedule() {
  frame ||= requestAnimationFrame(check);
}

const track = (el: HTMLElement) => {
  if (pending.size === 0) {
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
  }
  pending.add(el);
  schedule();
};

type RevealProps = {
  children: ReactNode;
  /** Element to render, so the reveal can sit directly in a grid or flex row. */
  as?: ElementType;
  className?: string;
  /** Milliseconds to wait after entering the viewport, for staggering a row of cards. */
  delay?: number;
};

/** Fades and lifts its content in the first time it scrolls into view. Styles live in index.css (.reveal). */
const Reveal = ({ children, as: Tag = "div", className, delay = 0 }: RevealProps) => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    track(el);
    return () => {
      pending.delete(el);
    };
  }, []);

  return (
    <Tag ref={ref} className={cn("reveal", className)} style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}>
      {children}
    </Tag>
  );
};

export default Reveal;
