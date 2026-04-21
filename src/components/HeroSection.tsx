import heroBg from "@/assets/hero-bg.jpg";
import type { ReactNode } from "react";
import { AVATAR_URL } from "@/lib/avatar";
import HandwritingName from "@/components/HandwritingName";

const HeroSection = () => {
  const stats: { value: string; label: ReactNode; key: string }[] = [
    { value: "4+", label: "Years Experience", key: "years-experience" },
    {
      value: "266",
      key: "meetings-month-axis",
      label: (
        <>
          Meetings/Month under{" "}
          <a
            href="https://app.tryaxisapp.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            AXIS
          </a>{" "}
          platform
        </>
      ),
    },
    {
      value: "1.27k+",
      key: "contributions-this-year",
      label: "GitHub Contributions this year",
    },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt=""
          width={1920}
          height={1080}
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <div className="mb-6 animate-fade-in">
          <img
            src={AVATAR_URL}
            alt="Mohammad Amin Dadgar"
            className="w-28 h-28 md:w-36 md:h-36 rounded-full border-2 border-primary/40 shadow-lg shadow-primary/20 object-cover mx-auto opacity-100"
          />
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-glow bg-primary/5 mb-8 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-sm text-primary font-medium">AI Engineer</span>
        </div>

        <div className="mb-6 animate-fade-up">
          <HandwritingName />
        </div>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-up" style={{ animationDelay: "0.15s" }}>
          Building production LLM systems, retrieval pipelines, and intelligent workflow automation.
          4+ years turning AI research into real-world products.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 animate-fade-up" style={{ animationDelay: "0.3s" }}>
          <a
            href="#projects"
            className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity glow-sm"
          >
            View Projects
          </a>
          <a
            href="#contact"
            className="px-6 py-3 rounded-lg border border-border text-foreground font-medium hover:bg-secondary transition-colors"
          >
            Get in Touch
          </a>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: "0.45s" }}>
          {stats.map((stat) => (
            <div key={stat.key} className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-gradient">{stat.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
