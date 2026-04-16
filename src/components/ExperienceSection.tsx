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
    <section id="experience" className="section-padding bg-surface">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Work <span className="text-gradient">Experience</span>
        </h2>
        <div className="h-1 w-16 bg-primary rounded-full mb-12" />

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border hidden md:block" />

          <div className="space-y-12">
            {experiences.map((exp, i) => (
              <div key={i} className="relative md:pl-10">
                {/* Dot */}
                <div className="absolute left-0 top-2 w-[15px] h-[15px] rounded-full border-2 border-primary bg-background hidden md:block" />

                <div className="p-6 rounded-xl border border-border bg-card hover:border-glow transition-colors">
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{exp.role}</h3>
                      <p className="text-sm text-primary">
                        {exp.url ? (
                          <a href={exp.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                            {exp.company} ↗
                          </a>
                        ) : (
                          exp.company
                        )}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">{exp.period}</p>
                      <p className="text-xs text-muted-foreground">{exp.location}</p>
                    </div>
                  </div>

                  <ul className="space-y-2 mb-4">
                    {exp.highlights.map((h, j) => (
                      <li key={j} className="text-sm text-muted-foreground flex gap-2">
                        <span className="text-primary mt-1 shrink-0">▹</span>
                        {h}
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap gap-2">
                    {exp.stack.map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 text-xs rounded-md bg-secondary text-secondary-foreground"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
