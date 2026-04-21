import { ArrowUpRight } from "lucide-react";
import { type WritingItem } from "@/data/portfolio";

const dateFormatter = new Intl.DateTimeFormat("en", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

type WritingCardProps = {
  writing: WritingItem;
};

const WritingCard = ({ writing }: WritingCardProps) => {
  return (
    <a
      href={writing.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-glow hover:glow-sm"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-block rounded-md bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
              {writing.tag}
            </span>
            <span className="inline-block rounded-md bg-secondary px-2.5 py-0.5 text-xs text-secondary-foreground">
              {writing.platform}
            </span>
            <span className="text-xs text-muted-foreground">
              {dateFormatter.format(new Date(writing.publishedAt))}
            </span>
          </div>

          <div>
            <h3 className="mb-2 text-lg font-semibold text-foreground transition-colors group-hover:text-primary">
              {writing.title}
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{writing.description}</p>
          </div>
        </div>

        <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
      </div>
    </a>
  );
};

export default WritingCard;
