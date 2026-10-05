import { Database, ShieldCheck, Zap } from "lucide-react";
import ChatPanel from "@/components/chat/ChatPanel";
import SectionHeading from "@/components/SectionHeading";

const notes = [
  {
    icon: Database,
    title: "Grounded",
    text: "Answers come only from this site's data and my latest GitHub activity, the same source that renders this page.",
  },
  {
    icon: ShieldCheck,
    title: "Guarded",
    text: "Bot verification, per-visitor and daily rate limits, and server-side conversation history.",
  },
  {
    icon: Zap,
    title: "Built on",
    text: "Cloudflare Workers, D1, and OpenRouter, streamed token by token.",
  },
];

const AskSection = () => (
  <section id="ask" className="section-padding scroll-mt-24 border-t border-border">
    <div className="mx-auto max-w-6xl px-6">
      <SectionHeading
        index="02"
        kicker="Ask AI"
        title="Ask my AI assistant"
        description="Curious whether I'm a fit for your project? Ask the assistant I built about my experience, projects, writing, and recent work."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <ChatPanel className="h-[34rem]" />

        <ul className="space-y-5">
          {notes.map((note) => (
            <li key={note.title} className="flex gap-3">
              <note.icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <div>
                <p className="text-sm font-medium text-foreground">{note.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{note.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </section>
);

export default AskSection;
