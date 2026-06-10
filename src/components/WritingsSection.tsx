import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import WritingCard from "@/components/WritingCard";
import { latestWritings } from "@/data/portfolio";

const WritingsSection = () => {
  return (
    <section id="writings" className="section-padding scroll-mt-24 border-t border-border">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          index="06"
          kicker="Writings"
          title="Recent writings"
          description="Thoughts on AI systems, model behavior, and the practical tradeoffs behind building reliable intelligent products."
        />

        <div className="space-y-4">
          {latestWritings.map((writing) => (
            <WritingCard key={writing.title} writing={writing} />
          ))}
        </div>

        <div className="mt-8">
          <Link
            to="/writings"
            className="inline-flex items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-primary"
          >
            View all writings
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default WritingsSection;
