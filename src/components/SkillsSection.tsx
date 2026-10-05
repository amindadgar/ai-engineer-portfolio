import { Braces, Brain, Database, Workflow, LayoutTemplate, Wrench, type LucideIcon } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import { skillCategories, type SkillCategoryId } from "@/data/portfolio";

const categoryIcons: Record<SkillCategoryId, LucideIcon> = {
  languages: Braces,
  ai: Brain,
  backend: Database,
  workflow: Workflow,
  frontend: LayoutTemplate,
  tooling: Wrench,
};

const SkillsSection = () => {
  return (
    <section id="skills" className="section-padding scroll-mt-24 border-t border-border">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading index="06" kicker="Skills" title="Technical toolkit" />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {skillCategories.map((cat) => {
            const Icon = categoryIcons[cat.id];
            return (
              <div key={cat.title} className="rounded-lg border border-border bg-card p-6 card-hover">
                <div className="mb-4 flex items-center gap-2.5">
                  <Icon className="h-4 w-4 text-primary" />
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
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
