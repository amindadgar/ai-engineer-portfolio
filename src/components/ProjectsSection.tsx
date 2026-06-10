import { ArrowUpRight } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";

const projects = [
  {
    title: "AXIS",
    description:
      "AI meeting intelligence app that turns recorded meetings into transcripts and actionable tasks. Built with React/TypeScript + Supabase with AI-powered processing.",
    url: "https://tryaxisapp.com/",
    tags: ["TypeScript", "React", "Supabase", "OpenAI", "Chrome MV3"],
    highlight: "266 meetings/month",
  },
  {
    title: "Hivemind Bot",
    description:
      "Message-driven LLM assistant utilizing a RAG pipeline, integrating with FastAPI, RabbitMQ, and Temporal for scalable community analytics.",
    url: "https://github.com/TogetherCrew/hivemind-bot",
    tags: ["Python", "RAG", "llama-index", "RabbitMQ", "Temporal"],
    highlight: "Multi-interface LLM",
  },
  {
    title: "Airflow DAGs",
    description:
      "Orchestrated analyzer pipelines, data vectorization with ETL (embedding cache, deduplication, streaming), platform data extraction, and violation-detection classification.",
    url: "https://github.com/TogetherCrew/airflow-dags",
    tags: ["Python", "Airflow", "ETL", "Embeddings"],
    highlight: "10+ pipelines",
  },
  {
    title: "Temporal Worker",
    description:
      "Temporal workflows in Python to orchestrate ETL pipelines (website & MediaWiki ingestion) and generate summaries using MongoDB, Qdrant, Redis, and PostgreSQL.",
    url: "https://github.com/TogetherCrew/temporal-worker-python",
    tags: ["Python", "Temporal", "MongoDB", "Qdrant", "Redis"],
    highlight: "Fault-tolerant ETL",
  },
  {
    title: "Agents Workflow",
    description:
      "CrewAI-based workflow system with Temporal integration, MongoDB persistence for step-level audit trails, Redis-backed chat history, and RAG pipelines.",
    url: "https://github.com/TogetherCrew/agents-workflow",
    tags: ["Python", "CrewAI", "Temporal", "MongoDB", "RAG"],
    highlight: "200+ communities",
  },
  {
    title: "TC Analyzer Lib",
    description:
      "Core analytics library for community analysis, providing graph-based metrics and behavioral insights at scale.",
    url: "https://github.com/TogetherCrew/tc_analyzer_lib",
    tags: ["Python", "Neo4j", "Analytics", "Graph DB"],
    highlight: "Open source",
  },
];

const ProjectsSection = () => {
  return (
    <section id="projects" className="section-padding scroll-mt-24 border-t border-border">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading index="04" kicker="Projects" title="Selected work" />

        <div className="grid gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <a
              key={project.title}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col bg-card p-6 transition-colors duration-200 hover:bg-surface-hover"
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <h3 className="text-base font-semibold text-foreground transition-colors group-hover:text-primary">
                  {project.title}
                </h3>
                <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
              </div>

              <p className="mb-5 flex-1 text-sm leading-relaxed text-muted-foreground">
                {project.description}
              </p>

              <p className="mb-3 font-mono text-xs font-medium text-primary">
                {project.highlight}
              </p>

              <p className="font-mono text-xs text-muted-foreground">
                {project.tags.join(" · ")}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
