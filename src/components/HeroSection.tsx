import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { AVATAR_URL } from "@/lib/avatar";

const stats: { value: string; label: ReactNode; key: string }[] = [
  { value: "5+", label: "Years of experience", key: "years-experience" },
  {
    value: "E2E",
    key: "llm-lifecycle",
    label: "LLM systems lifecycle",
  },
  {
    value: "55+",
    key: "ai-talks-sessions",
    label: "Volunteer AI Talks sessions · AI Community founder",
  },
];

const HeroSection = () => {
  return (
    <section className="relative flex min-h-screen items-center">
      {/* Subtle backdrop */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 60% 50% at 50% -10%, hsl(var(--primary) / 0.08), transparent)",
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-16 pt-32">
        <div className="mb-8 flex items-center gap-4 animate-fade-in">
          <img
            src={AVATAR_URL}
            alt="Mohammad Amin Dadgar"
            className="h-14 w-14 rounded-full border border-border object-cover"
          />
          <div>
            <p className="label-mono">Freelance AI Engineer</p>
            <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Available for freelance projects
            </p>
          </div>
        </div>

        <h1 className="max-w-3xl text-4xl font-semibold leading-[1.1] tracking-tight text-foreground animate-fade-up md:text-6xl">
          Mohammad Amin Dadgar
        </h1>

        <p
          className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground animate-fade-up md:text-xl"
          style={{ animationDelay: "0.15s" }}
        >
          I design, build, evaluate, and maintain production LLM systems, multi-agent
          architectures, and hybrid RAG pipelines.
        </p>

        <div
          className="mt-10 flex flex-wrap items-center gap-4 animate-fade-up"
          style={{ animationDelay: "0.3s" }}
        >
          <a
            href="#projects"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            View projects
            <ArrowRight className="h-4 w-4" />
          </a>
          <a
            href="#contact"
            className="rounded-md border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-foreground/30 hover:bg-secondary"
          >
            Get in touch
          </a>
        </div>

        {/* Stats */}
        <div
          className="mt-20 grid max-w-3xl grid-cols-1 gap-8 border-t border-border pt-8 sm:grid-cols-3 animate-fade-up"
          style={{ animationDelay: "0.45s" }}
        >
          {stats.map((stat) => (
            <div key={stat.key}>
              <div className="font-mono text-2xl font-medium text-foreground md:text-3xl">
                {stat.value}
              </div>
              <div className="mt-1.5 text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
