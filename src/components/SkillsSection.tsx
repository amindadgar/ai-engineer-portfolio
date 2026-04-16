const skillCategories = [
  {
    title: "Languages",
    icon: "⟨/⟩",
    skills: ["Python", "TypeScript", "JavaScript", "SQL", "LaTeX"],
  },
  {
    title: "AI / LLM",
    icon: "🧠",
    skills: ["OpenAI API", "llama-index", "LangChain", "CrewAI", "RAG Evaluation"],
  },
  {
    title: "Backend & Data",
    icon: "🗄️",
    skills: ["Supabase", "PostgreSQL", "MongoDB", "Neo4j", "Qdrant"],
  },
  {
    title: "Workflow & Pipelines",
    icon: "⚙️",
    skills: ["Apache Airflow", "Temporal", "RabbitMQ", "AWS S3 / MinIO"],
  },
  {
    title: "Frontend & Product",
    icon: "🎨",
    skills: ["React", "Vite", "Tailwind CSS", "Chrome Extensions (MV3)"],
  },
  {
    title: "Tooling",
    icon: "🔧",
    skills: ["Docker", "Git", "Pytest", "CI/CD"],
  },
];

const SkillsSection = () => {
  return (
    <section id="skills" className="section-padding bg-surface">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Technical <span className="text-gradient">Skills</span>
        </h2>
        <div className="h-1 w-16 bg-primary rounded-full mb-12" />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillCategories.map((cat) => (
            <div
              key={cat.title}
              className="p-6 rounded-xl border border-border bg-card hover:border-glow transition-colors"
            >
              <div className="text-2xl mb-3">{cat.icon}</div>
              <h3 className="text-base font-semibold text-foreground mb-4">{cat.title}</h3>
              <div className="flex flex-wrap gap-2">
                {cat.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 text-sm rounded-lg bg-secondary text-secondary-foreground"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
