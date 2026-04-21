const AboutSection = () => {
  return (
    <section id="about" className="section-padding">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          About <span className="text-gradient">Me</span>
        </h2>
        <div className="h-1 w-16 bg-primary rounded-full mb-8" />

        <div className="grid md:grid-cols-2 gap-10">
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              I'm an AI Engineer focused on building production AI systems end-to-end — from data
              ingestion and retrieval to user-facing copilots and workflow automation.
            </p>
            <p>
              Currently at <span className="text-foreground font-medium">AXIS</span>, I built an
              AI-powered meeting intelligence platform across React, Chrome Extension (MV3), and
              Supabase Edge Functions — supporting 266 meetings recorded per month.
            </p>
            <p>
              Previously at <span className="text-foreground font-medium">TogetherCrew</span>, I
              developed LLM pipelines to analyze decentralized communities, designed 10+ Airflow
              ETL pipelines, and orchestrated async workflows with Temporal and RabbitMQ.
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-5 rounded-xl border border-border bg-card">
              <h3 className="text-sm font-medium text-primary mb-2">Education</h3>
              <p className="text-sm text-foreground font-medium">M.Sc. Artificial Intelligence</p>
              <p className="text-xs text-muted-foreground">University of Isfahan — GPA 3.66/4.0</p>
              <div className="mt-3">
                <p className="text-sm text-foreground font-medium">B.Sc. Computer Engineering</p>
                <p className="text-xs text-muted-foreground">University of Kashan — GPA 3.25/4.0</p>
              </div>
            </div>

            <div className="p-5 rounded-xl border border-border bg-card">
              <h3 className="text-sm font-medium text-primary mb-2">Community</h3>
              <p className="text-sm text-muted-foreground">
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
