import { ArrowUpRight } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";

const experiences = [
  {
    role: "AI Engineer",
    company: "AXIS",
    url: "https://tryaxisapp.com/",
    period: "Oct 2025 – Apr 2026",
    location: "Remote",
    highlights: [
      "Built an AI meeting platform across three codebases: Web App (React/TS), Chrome MV3 extension, and Supabase Edge Functions",
      "Implemented schema-constrained LLM outputs for reliable meeting-to-task conversion",
      "Added contextual AI chat on meeting history with session/message persistence and token tracking",
      "Improved production readiness with tenant-scoped data access and secure client/backend boundaries",
    ],
    stack: ["TypeScript", "React", "Supabase", "PostgreSQL", "OpenAI API", "Chrome MV3"],
  },
  {
    role: "AI Engineer",
    company: "TogetherCrew",
    url: "https://github.com/TogetherCrew",
    period: "Oct 2023 – Oct 2025",
    location: "Remote",
    highlights: [
      "Built LLM pipelines to analyze decentralized communities across Telegram, Discord, Discourse, Notion, and more",
      "Developed RAG systems with llama-index, adding caching, deduplication, and time-indexed ingestion — boosting accuracy by 30%",
      "Designed and deployed 10+ Airflow ETL pipelines for embedding, summarization, and transformation tasks",
      "Orchestrated high-reliability async workflows with Temporal and RabbitMQ, enabling 18+ concurrent tasks",
      "Evaluated RAG output via custom metrics improving quality by 40%",
    ],
    stack: ["Python", "MongoDB", "Neo4j", "Airflow", "Temporal", "Docker", "RabbitMQ", "LangChain", "llama-index"],
  },
  {
    role: "DevOps Engineer",
    company: "Hoopad Vision Company",
    period: "Contract",
    location: "On-site",
    highlights: [
      "Dockerized 7+ microservices, accelerating deployment times by ~40%",
      "Enhanced developer workflows for a 10-person team, improving onboarding speed",
      "Led Git adoption and implemented CI pipeline, reducing manual QA by 30–50%",
    ],
    stack: ["Python", "Pytest", "Docker", "Git"],
  },
];

const ExperienceSection = () => {
  return (
    <section id="experience" className="section-padding scroll-mt-24 border-t border-border">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading index="03" kicker="Experience" title="Where I've worked" />

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
