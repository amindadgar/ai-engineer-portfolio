import { ArrowUpRight } from "lucide-react";
import Marquee from "@/components/ui/marquee";
import SectionHeading from "@/components/SectionHeading";
import { recommendations } from "@/data/portfolio";

const getInitials = (name: string) =>
  name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

const RecommendationsSection = () => {
  return (
    <section id="recommendations" className="section-padding scroll-mt-24 border-t border-border">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          index="03"
          kicker="Recommendations"
          title="What colleagues say"
          description="Managers, teammates, and classmates on LinkedIn. Hover to pause, click a card for the full recommendation."
        />

        <Marquee label="Recommendations" duration={70} rowClassName="gap-4 pr-4">
          {recommendations.map((recommendation) => (
            <a
              key={recommendation.author}
              href={recommendation.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              title={recommendation.excerpt}
              className="group flex w-80 shrink-0 flex-col rounded-lg border border-border bg-card p-5 card-hover"
            >
              <p className="flex-1 text-sm leading-relaxed text-foreground/85">“{recommendation.quote}”</p>

              <div className="mt-5 flex items-center gap-3">
                {recommendation.imageUrl ? (
                  <img
                    src={recommendation.imageUrl}
                    alt=""
                    className="h-9 w-9 shrink-0 rounded-full object-cover ring-1 ring-border"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary font-mono text-xs font-medium text-foreground">
                    {getInitials(recommendation.author)}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                    {recommendation.author}
                    <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
                  </p>
                  <p className="truncate font-mono text-[11px] text-muted-foreground">{recommendation.relationship}</p>
                </div>
              </div>
            </a>
          ))}
        </Marquee>
      </div>
    </section>
  );
};

export default RecommendationsSection;
