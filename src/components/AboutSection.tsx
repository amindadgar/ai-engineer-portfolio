import { ArrowUpRight, GraduationCap, Users } from "lucide-react";
import AskAboutButton from "@/components/chat/AskAboutButton";
import Emphasized from "@/components/Emphasized";
import SectionHeading from "@/components/SectionHeading";
import { education, profile, volunteerWork } from "@/data/portfolio";

// The homepage shows the first two paragraphs; the assistant knows the rest.
const SHOWN_PARAGRAPHS = 2;

const AboutSection = () => {
  return (
    <section id="about" className="section-padding scroll-mt-24 border-t border-border">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading index="01" kicker="About" title="Background" />

        <div className="grid gap-10 md:grid-cols-2">
          <div className="space-y-6">
            <div className="space-y-4 leading-relaxed text-muted-foreground">
              {profile.about.slice(0, SHOWN_PARAGRAPHS).map((paragraph) => (
                <p key={paragraph}>
                  <Emphasized text={paragraph} />
                </p>
              ))}
            </div>

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
          </div>

          <div>
            {/* Keeps the old #volunteer anchor alive for shared links and the assistant's section links. */}
            <div id="volunteer" className="scroll-mt-24 rounded-lg border border-border bg-card p-6">
              <div className="mb-4 flex items-center gap-2.5">
                <Users className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">Community</h3>
              </div>
              <ul className="space-y-4">
                {volunteerWork.map((item) => (
                  <li key={item.organization}>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm font-medium text-foreground transition-colors hover:text-primary"
                    >
                      {item.organization}
                      <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground" />
                    </a>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {item.role} · {item.period}
                    </p>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                AI Talks is a volunteer-run community that meets weekly: <span className="text-foreground">55+ sessions</span>,{" "}
                <span className="text-foreground">20+ speakers</span>, and <span className="text-foreground">50+ write-ups</span> in
                English and Persian.
              </p>
              <AskAboutButton question="Tell me about Amin's community work with AI Talks" className="mt-5" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
