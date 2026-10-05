import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import WritingCard from "@/components/WritingCard";
import { allWritings, latestWritings } from "@/data/portfolio";

const WritingsSection = () => {
  return (
    <section id="writings" className="section-padding scroll-mt-24 border-t border-border">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          index="07"
          kicker="Writings"
          title="Recent writings"
          description="Thoughts on AI systems, model behavior, and the practical tradeoffs behind building reliable intelligent products."
        />

        <div className="grid gap-4 md:grid-cols-3">
          {latestWritings.map((writing, i) => (
            <Reveal key={writing.title} delay={i * 90}>
              <WritingCard writing={writing} compact />
            </Reveal>
          ))}
        </div>

        <div className="mt-8">
          <Link
            to="/writings"
            className="inline-flex items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-primary"
          >
            View all {allWritings.length} writings
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default WritingsSection;
