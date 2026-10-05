import { Fragment, useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type MarqueeProps = {
  children: ReactNode;
  /** Seconds for one full loop; longer is slower. */
  duration?: number;
  className?: string;
  /** Classes for each copy of the row. Pair a gap with matching right padding (e.g. "gap-4 pr-4") so the seam is even. */
  rowClassName?: string;
  /** Accessible name for the scrolling region. */
  label?: string;
  /** Scroll left-to-right instead. */
  reverse?: boolean;
  /** Repeat the items within each row, so a short list still spans wide screens. */
  repeat?: number;
};

/**
 * Endless horizontal scroller. The row is rendered twice and shifted by half its width, so the loop is seamless.
 * It pauses on hover or keyboard focus. With reduced motion it becomes a static, swipeable row.
 */
const Marquee = ({ children, duration = 40, className, rowClassName, label, reverse = false, repeat = 1 }: MarqueeProps) => {
  const clone = useRef<HTMLDivElement>(null);

  // The copy is decorative: keep it out of the tab order and the accessibility tree.
  useEffect(() => {
    clone.current?.setAttribute("inert", "");
  }, []);

  const row = cn("flex shrink-0 items-stretch", rowClassName);
  // Extra repeats are only needed while scrolling; the static reduced-motion row shows each item once.
  const items = Array.from({ length: repeat }, (_, i) =>
    i === 0 ? (
      <Fragment key={i}>{children}</Fragment>
    ) : (
      <div key={i} aria-hidden="true" className="contents motion-reduce:hidden">
        {children}
      </div>
    ),
  );

  return (
    <div
      role="region"
      aria-label={label}
      className={cn(
        "group relative overflow-hidden motion-reduce:overflow-x-auto",
        "[mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]",
        className,
      )}
    >
      <div
        className="flex w-max animate-marquee group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused] motion-reduce:animate-none"
        style={{ animationDuration: `${duration}s`, animationDirection: reverse ? "reverse" : undefined }}
      >
        <div className={row}>{items}</div>
        <div ref={clone} aria-hidden="true" className={cn(row, "motion-reduce:hidden")}>
          {items}
        </div>
      </div>
    </div>
  );
};

export default Marquee;
