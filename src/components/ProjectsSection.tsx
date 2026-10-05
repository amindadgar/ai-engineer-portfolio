import { ArrowUpRight } from "lucide-react";
import AskAboutButton from "@/components/chat/AskAboutButton";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { projects } from "@/data/portfolio";
import { cn } from "@/lib/utils";

const ProjectsSection = () => {
  return (
    <section id="projects" className="section-padding scroll-mt-24 border-t border-border">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading index="05" kicker="Projects" title="Selected work" />

        {/* A swipeable row on phones; from md up, a grid where featured projects take a double-width tile. */}
        <div className="no-scrollbar -mx-6 flex snap-x snap-mandatory scroll-px-6 gap-3 overflow-x-auto px-6 md:mx-0 md:grid md:grid-cols-2 md:gap-4 md:overflow-visible md:px-0 lg:grid-cols-4">
          {projects.map((project, i) => (
            <Reveal
              key={project.title}
              as="article"
              delay={(i % 4) * 80}
              className={cn(
                "spotlight group isolate flex w-[85%] shrink-0 snap-start flex-col rounded-lg border border-border bg-card p-6 hover:bg-surface-hover md:w-auto",
                project.featured && "md:col-span-2 md:p-8",
              )}
            >
              {project.featured && (
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 -z-10 rounded-[inherit] bg-[radial-gradient(ellipse_at_top_right,hsl(var(--primary)/0.12),transparent_60%)]"
                />
              )}

              {/* The card isolates its stacking context, so the -z-10 decoration sits above the card background
                  but below this content, and the stretched link still covers the whole card. */}
              <div className="flex flex-1 flex-col">
                <p className="mb-2 font-mono text-[11px] font-medium uppercase tracking-wider text-primary">
                  {project.highlight}
                </p>
                <h3
                  className={cn(
                    "mb-2 font-semibold text-foreground",
                    project.featured ? "text-xl md:text-2xl" : "text-base",
                  )}
                >
                  {/* The stretched link makes the whole card clickable while the Ask button stays its own control. */}
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-start gap-2 transition-colors after:absolute after:inset-0 group-hover:text-primary"
                  >
                    {project.title}
                    <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
                  </a>
                </h3>

                <p
                  className={cn(
                    "mb-4 flex-1 leading-relaxed text-muted-foreground",
                    project.featured ? "text-sm md:max-w-xl md:text-base" : "text-sm",
                  )}
                >
                  {project.description}
                </p>

                <p className="mb-4 font-mono text-xs text-muted-foreground">{project.tags.join(" · ")}</p>

                <AskAboutButton
                  question={`How does ${project.title} work, and what was Amin's role?`}
                  className="relative z-10 self-start"
                />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
