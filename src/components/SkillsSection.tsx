import { Braces, Brain, Database, Workflow, LayoutTemplate, Wrench, type LucideIcon } from "lucide-react";
import Marquee from "@/components/ui/marquee";
import { skillCategories, type SkillCategoryId } from "@/data/portfolio";

const categoryIcons: Record<SkillCategoryId, LucideIcon> = {
  languages: Braces,
  ai: Brain,
  backend: Database,
  workflow: Workflow,
  frontend: LayoutTemplate,
  tooling: Wrench,
};

const toItems = (ids: SkillCategoryId[]) =>
  skillCategories
    .filter((category) => ids.includes(category.id))
    .flatMap((category) => category.skills.map((skill) => ({ skill, category })));

// AI on one row, the engineering around it on the other.
const rows = [toItems(["ai"]), toItems(["languages", "backend", "workflow", "tooling", "frontend"])];

/** Compact toolkit strip under the hero; each skill carries its category's icon and name on hover. */
const SkillsSection = () => (
  <section id="skills" aria-label="Technical toolkit" className="scroll-mt-24 space-y-3 py-8">
    {rows.map((items, i) => (
      <Marquee
        key={i}
        reverse={i % 2 === 1}
        duration={i === 0 ? 45 : 55}
        repeat={i === 0 ? 2 : 1}
        label={i === 0 ? "AI and LLM skills" : "Engineering skills"}
        rowClassName="gap-3 pr-3"
      >
        {items.map(({ skill, category }) => {
          const Icon = categoryIcons[category.id];
          return (
            <span
              key={skill}
              title={category.title}
              className="inline-flex items-center gap-2 whitespace-nowrap rounded-md border border-border bg-card/60 px-3 py-1.5 font-mono text-xs text-muted-foreground"
            >
              <Icon className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              {skill}
            </span>
          );
        })}
      </Marquee>
    ))}
  </section>
);

export default SkillsSection;
