import { Braces, Brain, Database, Workflow, LayoutTemplate, Wrench, type LucideIcon } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";

const skillCategories: { title: string; icon: LucideIcon; skills: string[] }[] = [
  {
    title: "Languages",
    icon: Braces,
    skills: ["Python", "TypeScript", "JavaScript", "SQL", "LaTeX"],
  },
  {
    title: "AI / LLM",
    icon: Brain,
    skills: [
      "Open-source LLMs",
      "GLM-5.2",
      "Gemma 4",
      "gpt-oss-120b",
      "Hybrid RAG",
      "Multi-Agent Systems",
      "LLM Evaluation",
      "Traceability",
      "OpenAI API",
      "llama-index",
      "LangChain",
      "CrewAI",
    ],
  },
  {
    title: "Backend & Data",
    icon: Database,
    skills: ["Supabase", "PostgreSQL", "MongoDB", "Neo4j", "Qdrant"],
  },
  {
    title: "Workflow & Pipelines",
    icon: Workflow,
    skills: ["Apache Airflow", "Temporal", "RabbitMQ", "AWS S3 / MinIO"],
  },
  {
    title: "Frontend & Product (Secondary)",
    icon: LayoutTemplate,
    skills: ["React", "Vite", "Tailwind CSS", "Chrome Extensions (MV3)", "AI-assisted Development"],
  },
  {
    title: "Tooling",
    icon: Wrench,
    skills: ["Docker", "Git", "Pytest", "CI/CD"],
  },
];

const SkillsSection = () => {
  return (
    <section id="skills" className="section-padding scroll-mt-24 border-t border-border">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading index="05" kicker="Skills" title="Technical toolkit" />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {skillCategories.map((cat) => (
            <div
              key={cat.title}
              className="rounded-lg border border-border bg-card p-6 card-hover"
            >
              <div className="mb-4 flex items-center gap-2.5">
                <cat.icon className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">{cat.title}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {cat.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded border border-border px-2.5 py-1 font-mono text-xs text-muted-foreground"
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
