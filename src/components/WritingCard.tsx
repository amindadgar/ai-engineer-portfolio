import { ArrowUpRight } from "lucide-react";
import { type WritingItem } from "@/data/portfolio";
import { cn } from "@/lib/utils";

const dateFormatter = new Intl.DateTimeFormat("en", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

type WritingCardProps = {
  writing: WritingItem;
  /** Grid-card variant for the homepage: fills its cell and clips the description to three lines. */
  compact?: boolean;
};

const WritingCard = ({ writing, compact = false }: WritingCardProps) => {
  return (
    <a
      href={writing.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn("spotlight group block rounded-lg border border-border bg-card p-6 card-hover", compact && "h-full")}
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
          <p className={cn("text-sm leading-relaxed text-muted-foreground", compact && "line-clamp-3")}>
            {writing.description}
          </p>
        </div>

        <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
      </div>
    </a>
  );
};

export default WritingCard;
