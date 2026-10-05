import type { MouseEvent } from "react";
import { pageSections } from "@/data/sections";
import { useActiveSection } from "@/hooks/use-active-section";
import { cn } from "@/lib/utils";

// Collapsed labels take no width (so nothing invisible covers the page); hover, focus, or a wide screen reveals them.
const reveal =
  "max-w-0 overflow-hidden opacity-0 transition-all duration-200 group-hover:max-w-[12rem] group-hover:opacity-100 group-focus-within:max-w-[12rem] group-focus-within:opacity-100 2xl:max-w-[12rem] 2xl:opacity-100";

const ids = pageSections.map((s) => s.id);

/**
 * "On this page" navigation pinned to the left edge, Notion-style: compact dashes that expand into
 * labels on hover or keyboard focus. On very wide screens the labels are always shown, like a docs sidebar.
 */
const SectionNav = () => {
  const { present, active } = useActiveSection(ids);
  const sections = pageSections.filter((s) => present.includes(s.id));

  const go = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(window.history.state, "", `#${id}`);
  };

  return (
    <nav
      aria-label="On this page"
      className={cn(
        "group fixed left-3 top-1/2 z-30 hidden -translate-y-1/2 rounded-lg border border-transparent p-2 transition-all duration-200 xl:block",
        "hover:border-border hover:bg-card/95 hover:shadow-lg hover:backdrop-blur focus-within:border-border focus-within:bg-card/95",
        "2xl:left-6 2xl:hover:border-transparent 2xl:hover:bg-transparent 2xl:hover:shadow-none 2xl:focus-within:border-transparent 2xl:focus-within:bg-transparent",
        // Hidden over the hero, where nothing is active yet.
        active ? "opacity-100" : "pointer-events-none opacity-0",
      )}
    >
      <p
        className={cn("mb-2 whitespace-nowrap pl-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground", reveal)}
      >
        On this page
      </p>
      <ul className="space-y-0.5">
        {sections.map((section) => {
          const isActive = section.id === active;
          return (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                onClick={(e) => go(e, section.id)}
                aria-current={isActive ? "location" : undefined}
                className="flex items-center rounded py-1 pl-1 pr-1 outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "h-[2px] shrink-0 rounded-full transition-all duration-200",
                    isActive ? "w-5 bg-primary" : "w-3 bg-muted-foreground/40 group-hover:bg-muted-foreground/60",
                  )}
                />
                <span
                  className={cn(
                    "whitespace-nowrap pl-3 text-xs",
                    reveal,
                    isActive ? "font-medium text-foreground" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {section.label}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default SectionNav;
