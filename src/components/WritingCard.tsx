import { ArrowUpRight } from "lucide-react";
import { type WritingItem } from "@/data/portfolio";

const dateFormatter = new Intl.DateTimeFormat("en", {
  year: "numeric",
  month: "short",
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
      className="group block rounded-lg border border-border bg-card p-6 card-hover"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="mb-2 font-mono text-xs text-muted-foreground">
            <span className="text-primary">{writing.tag}</span>
            {" · "}
            {writing.platform}
            {" · "}
            {dateFormatter.format(new Date(writing.publishedAt))}
          </p>

          <h3 className="mb-2 text-base font-semibold text-foreground transition-colors group-hover:text-primary">
            {writing.title}
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground">{writing.description}</p>
        </div>

        <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
      </div>
    </a>
  );
};

export default WritingCard;
