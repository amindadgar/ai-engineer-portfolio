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
    <section id="projects" className="section-padding">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Featured <span className="text-gradient">Projects</span>
        </h2>
        <div className="h-1 w-16 bg-primary rounded-full mb-12" />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <a
              key={project.title}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group p-6 rounded-xl border border-border bg-card hover:border-glow hover:glow-sm transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                <svg
                  className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path d="M7 17L17 7M17 7H7M17 7v10" />
                </svg>
              </div>

              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                {project.description}
              </p>

              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium mb-4">
                ⚡ {project.highlight}
              </div>

              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span key={tag} className="px-2 py-0.5 text-xs rounded bg-secondary text-secondary-foreground">
                    {tag}
                  </span>
                ))}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
