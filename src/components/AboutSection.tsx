import { GraduationCap, Users } from "lucide-react";
import Emphasized from "@/components/Emphasized";
import SectionHeading from "@/components/SectionHeading";
import { education, profile } from "@/data/portfolio";

const AboutSection = () => {
  return (
    <section id="about" className="section-padding scroll-mt-24 border-t border-border">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading index="01" kicker="About" title="Background" />

        <div className="grid gap-10 md:grid-cols-2">
          <div className="space-y-4 leading-relaxed text-muted-foreground">
            {profile.about.map((paragraph) => (
              <p key={paragraph}>
                <Emphasized text={paragraph} />
              </p>
            ))}
          </div>

          <div className="space-y-4">
            <div className="rounded-lg border border-border bg-card p-6">
              <div className="mb-4 flex items-center gap-2.5">
                <GraduationCap className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">Education</h3>
              </div>
              <div className="space-y-4">
                {education.map((item) => (
                  <div key={item.degree}>
                    <p className="text-sm font-medium text-foreground">{item.degree}</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {item.school} · {item.detail}
                    </p>
                  </div>
                ))}
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
