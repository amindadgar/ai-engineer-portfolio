import { useEffect } from "react";

/**
 * One delegated pointer listener drives the glow on every `.spotlight` card: it writes the pointer position
 * into the hovered card's CSS variables, and parks the glow off-card when the pointer leaves.
 */
export const useSpotlight = () => {
  useEffect(() => {
    let current: HTMLElement | null = null;

    const park = (el: HTMLElement) => {
      el.style.removeProperty("--spot-x");
      el.style.removeProperty("--spot-y");
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const card = (event.target as Element | null)?.closest?.<HTMLElement>(".spotlight") ?? null;
      if (current && current !== card) park(current);
      current = card;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
      card.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
    };

    const onLeave = () => {
      if (current) park(current);
      current = null;
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);
};
