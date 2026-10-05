import { ArrowUpRight } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import { projects } from "@/data/portfolio";

const ProjectsSection = () => {
  return (
    <section id="projects" className="section-padding scroll-mt-24 border-t border-border">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading index="04" kicker="Projects" title="Selected work" />

        <div className="grid gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <a
              key={project.title}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col bg-card p-6 transition-colors duration-200 hover:bg-surface-hover"
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <h3 className="text-base font-semibold text-foreground transition-colors group-hover:text-primary">
                  {project.title}
                </h3>
                <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
              </div>

              <p className="mb-5 flex-1 text-sm leading-relaxed text-muted-foreground">
                {project.description}
              </p>

              <p className="mb-3 font-mono text-xs font-medium text-primary">
                {project.highlight}
              </p>

              <p className="font-mono text-xs text-muted-foreground">
                {project.tags.join(" · ")}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
