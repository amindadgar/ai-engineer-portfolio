import { ArrowUpRight } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import { experiences } from "@/data/portfolio";

const ExperienceSection = () => {
  return (
    <section id="experience" className="section-padding scroll-mt-24 border-t border-border">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading index="04" kicker="Experience" title="Where I've worked" />

        <div className="space-y-14">
          {experiences.map((exp) => (
            <article
              key={exp.company}
              className="grid gap-4 md:grid-cols-[200px_1fr] md:gap-10"
            >
              <div className="font-mono text-sm text-muted-foreground">
                <p>{exp.period}</p>
                <p className="mt-1 text-xs">{exp.location}</p>
              </div>

              <div>
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

                <ul className="mt-4 space-y-2.5">
                  {exp.highlights.map((h, j) => (
                    <li key={j} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                      <span className="mt-[0.6rem] h-px w-3 shrink-0 bg-primary/60" />
                      {h}
                    </li>
                  ))}
                </ul>

                <div className="mt-5 flex flex-wrap gap-2">
                  {exp.stack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded border border-border px-2 py-0.5 font-mono text-xs text-muted-foreground"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
