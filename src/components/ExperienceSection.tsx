import { useRef, useState, type KeyboardEvent } from "react";
import { ArrowUpRight } from "lucide-react";
import AskAboutButton from "@/components/chat/AskAboutButton";
import SectionHeading from "@/components/SectionHeading";
import { experiences } from "@/data/portfolio";
import { cn } from "@/lib/utils";

const tabId = (i: number) => `experience-tab-${i}`;
const panelId = (i: number) => `experience-panel-${i}`;

const askQuestion = (company: string) =>
  company === "Independent"
    ? "What kind of freelance AI work does Amin take on?"
    : `What did Amin build at ${company}, and what was the impact?`;

/** One role at a time: companies on the left (a scrollable row on phones), the selected role on the right. */
const ExperienceSection = () => {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  // Arrow keys (either axis, since the list is vertical on desktop and horizontal on phones), Home and End.
  const onKeyDown = (event: KeyboardEvent) => {
    const last = experiences.length - 1;
    const targets: Record<string, number> = {
      ArrowDown: active === last ? 0 : active + 1,
      ArrowRight: active === last ? 0 : active + 1,
      ArrowUp: active === 0 ? last : active - 1,
      ArrowLeft: active === 0 ? last : active - 1,
      Home: 0,
      End: last,
    };
    const target = targets[event.key];
    if (target === undefined) return;
    event.preventDefault();
    setActive(target);
    tabs.current[target]?.focus();
  };

  return (
    <section id="experience" className="section-padding scroll-mt-24 border-t border-border">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading index="04" kicker="Experience" title="Where I've worked" />

        <div className="grid gap-6 md:grid-cols-[220px_1fr] md:gap-10">
          <div
            role="tablist"
            aria-label="Roles"
            onKeyDown={onKeyDown}
            className="no-scrollbar -mx-6 flex gap-1 overflow-x-auto px-6 md:mx-0 md:flex-col md:overflow-visible md:border-l md:border-border md:px-0"
          >
            {experiences.map((exp, i) => (
              <button
                key={exp.company}
                ref={(el) => (tabs.current[i] = el)}
                id={tabId(i)}
                role="tab"
                type="button"
                aria-selected={active === i}
                aria-controls={panelId(i)}
                tabIndex={active === i ? 0 : -1}
                onClick={() => setActive(i)}
                className={cn(
                  "shrink-0 whitespace-nowrap rounded-md px-3 py-2 text-left transition-colors md:-ml-px md:rounded-none md:border-l-2 md:px-4",
                  active === i
                    ? "bg-secondary text-foreground md:border-primary md:bg-transparent"
                    : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground md:border-transparent md:hover:bg-transparent",
                )}
              >
                <span className="block text-sm font-medium">{exp.company}</span>
                <span className="mt-0.5 block font-mono text-[11px] text-muted-foreground">{exp.period}</span>
              </button>
            ))}
          </div>

          {/* All panels share one grid cell, so the section keeps the tallest role's height and never jumps.
              Inactive panels are visibility:hidden, which also removes them from the tab order and screen readers. */}
          <div className="grid">
            {experiences.map((exp, i) => (
              <article
                key={exp.company}
                id={panelId(i)}
                role="tabpanel"
                aria-labelledby={tabId(i)}
                className={cn(
                  "[grid-area:1/1] transition-opacity duration-200",
                  active === i ? "opacity-100" : "invisible opacity-0",
                )}
              >
                <h3 className="text-lg font-semibold text-foreground">
                  {exp.role}
                  <span className="text-muted-foreground"> · </span>
                  {exp.url ? (
                    <a
                      href={exp.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-foreground transition-colors hover:text-primary"
                    >
                      {exp.company}
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                    </a>
                  ) : (
                    exp.company
                  )}
                </h3>
                <p className="mt-1 font-mono text-xs text-muted-foreground">
                  {exp.period} · {exp.location}
                </p>

                <ul className="mt-5 space-y-2.5">
                  {exp.highlights.map((h) => (
                    <li key={h} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                      <span className="mt-[0.6rem] h-px w-3 shrink-0 bg-primary/60" />
                      {h}
                    </li>
                  ))}
                </ul>

                <div className="mt-5 flex flex-wrap items-center gap-2">
                  {exp.stack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded border border-border px-2 py-0.5 font-mono text-xs text-muted-foreground"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <AskAboutButton question={askQuestion(exp.company)} className="mt-6" />
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
