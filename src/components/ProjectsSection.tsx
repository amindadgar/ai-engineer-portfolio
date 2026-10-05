import { ArrowUpRight } from "lucide-react";
import AskAboutButton from "@/components/chat/AskAboutButton";
import SectionHeading from "@/components/SectionHeading";
import { projects } from "@/data/portfolio";

const ProjectsSection = () => {
  return (
    <section id="projects" className="section-padding scroll-mt-24 border-t border-border">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading index="05" kicker="Projects" title="Selected work" />

        {/* A swipeable row on phones; a ruled grid from md up. */}
        <div className="no-scrollbar -mx-6 flex snap-x snap-mandatory scroll-px-6 gap-3 overflow-x-auto px-6 md:mx-0 md:grid md:grid-cols-2 md:gap-px md:overflow-hidden md:rounded-lg md:border md:border-border md:bg-border md:px-0 lg:grid-cols-3">
          {projects.map((project) => (
            <article
              key={project.title}
              className="group relative flex w-[85%] shrink-0 snap-start flex-col rounded-lg border border-border bg-card p-6 transition-colors duration-200 hover:bg-surface-hover md:w-auto md:rounded-none md:border-0"
            >
              <p className="mb-2 font-mono text-[11px] font-medium uppercase tracking-wider text-primary">
                {project.highlight}
              </p>
              <h3 className="mb-2 text-base font-semibold text-foreground">
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

              <p className="mb-4 flex-1 text-sm leading-relaxed text-muted-foreground">{project.description}</p>

              <p className="mb-4 font-mono text-xs text-muted-foreground">{project.tags.join(" · ")}</p>

              <AskAboutButton
                question={`How does ${project.title} work, and what was Amin's role?`}
                className="relative z-10 self-start"
              />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
