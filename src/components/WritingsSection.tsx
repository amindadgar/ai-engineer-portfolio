import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import WritingCard from "@/components/WritingCard";
import { latestWritings } from "@/data/portfolio";

const WritingsSection = () => {
  return (
    <section id="writings" className="section-padding scroll-mt-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12">
          <div>
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Recent <span className="text-gradient">Writings</span>
            </h2>
            <div className="mb-6 h-1 w-16 rounded-full bg-primary" />
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
              A curated snapshot of my latest thoughts on AI systems, model behavior, and the practical
              tradeoffs behind building reliable intelligent products.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {latestWritings.map((writing) => (
            <WritingCard key={writing.title} writing={writing} />
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Button
            asChild
            size="lg"
            variant="outline"
            className="rounded-xl border-primary/20 bg-primary/5 px-6 text-primary hover:bg-primary/10 hover:text-primary"
          >
            <Link to="/writings">
              View all writings
              <ArrowRight />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default WritingsSection;
