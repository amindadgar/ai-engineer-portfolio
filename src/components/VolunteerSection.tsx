import { ArrowUpRight } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";

const volunteerWork = [
  {
    role: "Co-Founder",
    organization: "AI Community",
    url: "https://ai-community-gap.vercel.app/",
    description:
      "Co-founded an AI community hosting weekly meetups, talks, and events on LLMs, RAG, multi-agent systems, and cutting-edge AI research. Building a vibrant space for AI enthusiasts, researchers, and innovators to learn and collaborate.",
    highlights: [
      "Organized regular AI Talks series featuring leading researchers and practitioners",
      "Curated events covering machine learning, NLP, and computer vision topics",
      "Growing community of AI enthusiasts exploring the frontiers of artificial intelligence",
    ],
  },
  {
    role: "Co-Founder",
    organization: "Cassandra AI Group",
    url: "https://www.youtube.com/@cassandraai",
    description:
      "Co-founded Cassandra AI Group focused on academic workshops and educational content around artificial intelligence, making AI knowledge accessible through structured learning sessions.",
    highlights: [
      "Produced educational AI content on YouTube",
      "Hosted academic workshops on AI fundamentals and advanced topics",
      "Created a platform for knowledge sharing in the AI space",
    ],
  },
];

const VolunteerSection = () => {
  return (
    <section id="volunteer" className="section-padding scroll-mt-24 border-t border-border">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading index="07" kicker="Community" title="Volunteer work" />

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
