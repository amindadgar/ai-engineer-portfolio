import { ArrowUpRight } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";

const volunteerWork = [
  {
    role: "Co-Founder & Organizer",
    organization: "AI Talks Community",
    url: "https://www.aitalkshub.ir/",
    period: "Nov 2024 – Present",
    description:
      "AI Talks is a volunteer-run, bilingual community that meets weekly to explore practical, applied AI. Sessions and notes are free, public, and published in both English and Persian.",
    highlights: [
      "Help organize, host, and present weekly sessions on production RAG, multi-agent systems, LLM costs, and workflow automation",
      "Grew the initiative to 55+ sessions, 20+ speakers, 20+ topics, and 50+ bilingual session write-ups",
      "Presented or contributed to 10+ sessions since joining as a speaker in Session 16",
    ],
  },
  {
    role: "Co-Founder",
    organization: "Cassandra AI Group",
    url: "https://www.youtube.com/@cassandraai",
    period: "Oct 2021 – Oct 2023",
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
