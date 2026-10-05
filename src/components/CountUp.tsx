import { useEffect, useState } from "react";

type CountUpProps = {
  /** Display value such as "55+". Values without a leading number (e.g. "E2E") are shown as they are. */
  value: string;
  /** Milliseconds before counting starts, to line up with an entrance animation. */
  delay?: number;
  duration?: number;
};

const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;

/** Counts a stat up from zero once on mount. Screen readers get the final value straight away. */
const CountUp = ({ value, delay = 0, duration = 1200 }: CountUpProps) => {
  const match = /^(\d+)(.*)$/.exec(value);
  const numeric = match !== null;
  const target = match ? Number(match[1]) : 0;
  const reduceMotion =
    typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const [current, setCurrent] = useState(match && !reduceMotion ? 0 : target);

  useEffect(() => {
    if (!numeric || reduceMotion) return;
    let frame = 0;
    let start = 0;
    const tick = (now: number) => {
      start ||= now;
      const progress = Math.min((now - start) / duration, 1);
      setCurrent(Math.round(easeOutCubic(progress) * target));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    const timer = setTimeout(() => (frame = requestAnimationFrame(tick)), delay);
    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(frame);
    };
  }, [numeric, reduceMotion, target, delay, duration]);

  if (!match) return <>{value}</>;
  return (
    <>
      <span aria-hidden="true">
        {current}
        {match[2]}
      </span>
      <span className="sr-only">{value}</span>
    </>
  );
};

export default CountUp;
