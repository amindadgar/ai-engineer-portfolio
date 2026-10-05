import { ArrowUpRight } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
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
          description="Words from people I've worked with — managers, teammates, and collaborators."
        />

        <Carousel opts={{ align: "start", loop: false }} className="px-12">
          <CarouselContent>
            {recommendations.map((recommendation) => (
              <CarouselItem key={recommendation.author} className="md:basis-1/2 xl:basis-1/3">
                <a
                  href={recommendation.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-full flex-col rounded-lg border border-border bg-card p-6 card-hover"
                >
                  <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
                    “{recommendation.excerpt}”
                  </p>

                  <div className="mt-6 flex items-center gap-3 border-t border-border pt-5">
                    {recommendation.imageUrl ? (
                      <img
                        src={recommendation.imageUrl}
                        alt={recommendation.author}
                        className="h-10 w-10 shrink-0 rounded-full object-cover ring-1 ring-border"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary font-mono text-xs font-medium text-foreground">
                        {getInitials(recommendation.author)}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                        {recommendation.author}
                        <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
                      </p>
                      <p className="truncate text-xs text-muted-foreground" title={recommendation.role}>
                        {recommendation.role}
                      </p>
                      <p className="mt-0.5 font-mono text-[11px] text-muted-foreground/80">
                        {recommendation.relationship} · {recommendation.dateLabel}
                      </p>
                    </div>
                  </div>
                </a>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-0" />
          <CarouselNext className="right-0" />
        </Carousel>
      </div>
    </section>
  );
};

export default RecommendationsSection;
