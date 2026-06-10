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
              I'm an AI Engineer focused on building production AI systems end-to-end — from data
              ingestion and retrieval to user-facing copilots and workflow automation.
            </p>
            <p>
              Currently at <span className="font-medium text-foreground">AXIS</span>, I built an
              AI-powered meeting intelligence platform across React, Chrome Extension (MV3), and
              Supabase Edge Functions — supporting 266 meetings recorded per month.
            </p>
            <p>
              Previously at <span className="font-medium text-foreground">TogetherCrew</span>, I
              developed LLM pipelines to analyze decentralized communities, designed 10+ Airflow
              ETL pipelines, and orchestrated async workflows with Temporal and RabbitMQ.
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
                Co-founder of an AI Community Group hosting weekly meetups on LLMs, RAG, and
                multi-agent systems. Previously co-founded Cassandra AI Group for academic
                workshops.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
