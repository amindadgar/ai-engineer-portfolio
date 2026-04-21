import { ExternalLink, Quote } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
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
    <section id="recommendations" className="section-padding scroll-mt-24 bg-surface">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12">
          <div>
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Received <span className="text-gradient">Recommendations</span>
            </h2>
            <div className="h-1 w-16 rounded-full bg-primary" />
          </div>
        </div>

        <div className="rounded-[2rem] border border-border bg-card/80 p-6 shadow-[0_24px_80px_-40px_rgba(17,205,190,0.35)] backdrop-blur-xl md:p-8">
          <div className="mb-8 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Quote className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground">Voices from people I have worked with</h3>
              </div>
          </div>

          <Carousel opts={{ align: "start", loop: false }} className="px-12">
            <CarouselContent>
              {recommendations.map((recommendation) => (
                <CarouselItem key={recommendation.author} className="md:basis-1/2 xl:basis-1/3">
                  <a
                    href={recommendation.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex h-full flex-col rounded-3xl border border-border bg-background/60 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-glow hover:glow-sm"
                  >
                    <div className="mb-5 flex min-h-[10.5rem] items-start gap-4">
                      {recommendation.imageUrl ? (
                        <img
                          src={recommendation.imageUrl}
                          alt={recommendation.author}
                          className="h-14 w-14 shrink-0 rounded-2xl object-cover ring-1 ring-border"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent text-sm font-semibold text-primary">
                          {getInitials(recommendation.author)}
                        </div>
                      )}
                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="mb-1 flex items-start justify-between gap-3">
                          <div>
                            <p className="font-semibold text-foreground">{recommendation.author}</p>
                            <p className="min-h-[4.75rem] text-sm leading-snug text-muted-foreground">
                              {recommendation.role}
                            </p>
                          </div>
                          <ExternalLink className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
                        </div>
                        <p className="text-xs uppercase tracking-[0.18em] text-primary/80">{recommendation.dateLabel}</p>
                      </div>
                    </div>

                    <div className="mb-5 rounded-2xl border border-border bg-card px-3.5 py-2.5">
                      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Context</p>
                      <p className="mt-1.5 min-h-[3.5rem] text-xs leading-relaxed text-muted-foreground">
                        {recommendation.relationship}
                      </p>
                    </div>

                    <p className="text-sm leading-relaxed text-muted-foreground">{recommendation.excerpt}</p>
                  </a>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-0" />
            <CarouselNext className="right-0" />
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default RecommendationsSection;
