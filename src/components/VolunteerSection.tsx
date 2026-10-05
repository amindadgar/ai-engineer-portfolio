import { ArrowUpRight } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import { volunteerWork } from "@/data/portfolio";

const VolunteerSection = () => {
  return (
    <section id="volunteer" className="section-padding scroll-mt-24 border-t border-border">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading index="08" kicker="Community" title="Volunteer work" />

        <div className="grid gap-4 md:grid-cols-2">
          {volunteerWork.map((item) => (
            <div
              key={item.organization}
              className="rounded-lg border border-border bg-card p-6 card-hover"
            >
              <h3 className="text-base font-semibold text-foreground">
                {item.role}
                <span className="text-muted-foreground"> · </span>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 transition-colors hover:text-primary"
                >
                  {item.organization}
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                </a>
              </h3>

              <p className="mt-1 font-mono text-xs text-muted-foreground">{item.period}</p>

              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>

              <ul className="mt-4 space-y-2.5">
                {item.highlights.map((h, j) => (
                  <li key={j} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                    <span className="mt-[0.6rem] h-px w-3 shrink-0 bg-primary/60" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VolunteerSection;
