import { GraduationCap, Users } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";

const AboutSection = () => {
  return (
    <section id="about" className="section-padding scroll-mt-24 border-t border-border">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading index="01" kicker="About" title="Background" />

        <div className="grid gap-10 md:grid-cols-2">
          <div className="space-y-4 leading-relaxed text-muted-foreground">
            <p>
              I'm a freelance AI engineer with <span className="font-medium text-foreground">5+ years of experience</span>,
              specializing in the full lifecycle of LLM systems — from architecture and design to
              development, deployment, evaluation, and ongoing maintenance.
            </p>
            <p>
              I build reliable <span className="font-medium text-foreground">multi-agent systems</span> and{" "}
              <span className="font-medium text-foreground">hybrid RAG pipelines</span>, with hands-on
              expertise in open-source LLMs including GLM-5.2, Gemma 4, and gpt-oss-120b. I also
              specialize in evaluation and traceability across retrieval, generation, agents, and
              tool execution.
            </p>
            <p>
              Previous work includes <span className="font-medium text-foreground">AXIS</span>, an AI
              meeting intelligence product spanning a React web app, recording extension, and
              serverless AI workflows. I can also ship frontend applications through AI-assisted
              and vibe-coding workflows, although AI and backend systems are my primary expertise.
            </p>
          </div>

          <div className="space-y-4">
            <div className="rounded-lg border border-border bg-card p-6">
              <div className="mb-4 flex items-center gap-2.5">
                <GraduationCap className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">Education</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-foreground">M.Sc. Artificial Intelligence</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    University of Isfahan · GPA 3.66/4.0
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">B.Sc. Computer Engineering</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    University of Kashan · GPA 3.25/4.0
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card p-6">
              <div className="mb-4 flex items-center gap-2.5">
                <Users className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">Community</h3>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Co-founder and organizer of{" "}
                <a
                  href="https://www.aitalkshub.ir/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-foreground transition-colors hover:text-primary"
                >
                  AI Talks
                </a>, a volunteer-run bilingual community with 55+ applied AI sessions. Previously
                co-founded Cassandra AI Group for academic workshops.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
