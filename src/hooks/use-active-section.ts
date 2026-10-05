import { useEffect, useState } from "react";

// A section becomes active once its top passes this fraction of the viewport height.
const ACTIVATION_LINE = 0.35;

type ActiveSectionState = {
  /** Ids of the sections currently in the DOM (some, like GitHub, hide themselves when unavailable). */
  present: string[];
  active: string | null;
};

const sameList = (a: string[], b: string[]) => a.length === b.length && a.every((v, i) => v === b[i]);

/** Scroll-spy over the given section ids, in page order. */
export const useActiveSection = (ids: readonly string[]): ActiveSectionState => {
  const [state, setState] = useState<ActiveSectionState>({ present: [], active: null });

  useEffect(() => {
    let frame = 0;

    const compute = () => {
      frame = 0;
      const elements = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => el !== null);
      const line = window.innerHeight * ACTIVATION_LINE;

      let active: string | null = null;
      for (const el of elements) {
        if (el.getBoundingClientRect().top <= line) active = el.id;
      }
      // Short final sections can never reach the line; at the bottom of the page, the last one wins.
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      if (atBottom && elements.length) active = elements[elements.length - 1].id;

      const present = elements.map((el) => el.id);
      setState((prev) => (prev.active === active && sameList(prev.present, present) ? prev : { present, active }));
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(compute);
    };

    compute();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    // Sections can appear or disappear after async loads, which also shifts positions.
    const observer = new MutationObserver(schedule);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [ids]);

  return state;
};
