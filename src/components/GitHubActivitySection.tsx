import { formatDistanceToNow } from "date-fns";
import { ArrowUpRight, Sparkles } from "lucide-react";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { Skeleton } from "@/components/ui/skeleton";
import { useGitHubSummary, type GitHubSummary } from "@/hooks/use-github-summary";
import { profile } from "@/data/portfolio";

// "google/gemma-4-31b-it:free" -> "gemma-4-31b-it"
const shortModelName = (model: string) => model.split("/").pop()!.replace(/:free$/, "");

const formatCount = (count: number, capped: boolean) => `${count}${capped ? "+" : ""}`;

const ContributionStrip = ({ calendar }: { calendar: NonNullable<GitHubSummary["calendar"]> }) => {
  const max = Math.max(1, ...calendar.map((d) => d.count));
  return (
    <div className="flex flex-wrap gap-1" aria-label="Daily contributions over the period">
      {calendar.map((day) => (
        <span
          key={day.date}
          title={`${day.date}: ${day.count} contribution${day.count === 1 ? "" : "s"}`}
          className="h-3 w-3 rounded-[2px] border border-border"
          style={{
            backgroundColor: day.count ? `hsl(var(--primary) / ${0.2 + 0.8 * (day.count / max)})` : "transparent",
          }}
        />
      ))}
    </div>
  );
};

const SummaryCard = ({ summary }: { summary: GitHubSummary }) => {
  const anyCapped = summary.repos.some((r) => r.commitsCapped);
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
      <Reveal className="spotlight rounded-lg border border-border bg-card p-6 md:p-8">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <p className="inline-flex items-center gap-2 font-mono text-xs text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            {summary.aiGenerated ? "AI summary" : "Activity digest"}
          </p>
          <p className="font-mono text-xs text-muted-foreground">
            Updated {formatDistanceToNow(new Date(summary.generatedAt), { addSuffix: true })}
          </p>
        </div>

        <p className="text-lg font-medium leading-snug text-foreground md:text-xl">{summary.headline}</p>

        {summary.highlights.length > 0 && (
          <ul className="mt-6 space-y-5">
            {summary.highlights.map((h) => (
              <li key={`${h.repo}-${h.title}`} className="flex gap-3">
                <span className="mt-[0.7rem] h-px w-3 shrink-0 bg-primary/60" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {h.title}
                    <a
                      href={h.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 inline-flex items-center gap-0.5 font-mono text-xs font-normal text-muted-foreground transition-colors hover:text-primary"
                    >
                      {h.repo}
                      <ArrowUpRight className="h-3 w-3" />
                    </a>
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{h.detail}</p>
                </div>
              </li>
            ))}
          </ul>
        )}

        {summary.themes.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {summary.themes.map((theme) => (
              <span
                key={theme}
                className="rounded border border-border px-2 py-0.5 font-mono text-xs text-muted-foreground"
              >
                {theme}
              </span>
            ))}
          </div>
        )}

        <p className="mt-6 border-t border-border pt-4 text-xs text-muted-foreground">
          {summary.aiGenerated && summary.model
            ? `Written by ${shortModelName(summary.model)} from public commits, pull requests, and releases. Refreshed daily.`
            : "Built from public commits, pull requests, and releases. Refreshed daily."}
        </p>
      </Reveal>

      <Reveal delay={120} className="space-y-4">
        <div className="spotlight rounded-lg border border-border bg-card p-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="font-mono text-2xl font-medium text-foreground">
                {formatCount(summary.totalCommits, anyCapped)}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">Public commits</div>
            </div>
            <div>
              <div className="font-mono text-2xl font-medium text-foreground">{summary.repos.length}</div>
              <div className="mt-1 text-xs text-muted-foreground">Repositories</div>
            </div>
          </div>
          {summary.calendar && summary.calendar.length > 0 && (
            <div className="mt-5">
              <ContributionStrip calendar={summary.calendar} />
            </div>
          )}
          <p className="mt-4 font-mono text-xs text-muted-foreground">Last 30 days</p>
        </div>

        {summary.repos.length > 0 && (
          <div className="spotlight rounded-lg border border-border bg-card p-6">
            <ul className="space-y-3">
              {summary.repos.map((repo) => (
                <li key={repo.name}>
                  <a
                    href={repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-baseline justify-between gap-3"
                  >
                    <span className="truncate font-mono text-xs text-foreground transition-colors group-hover:text-primary">
                      {repo.name}
                    </span>
                    <span className="shrink-0 font-mono text-xs text-muted-foreground">
                      {formatCount(repo.commits, repo.commitsCapped)}
                    </span>
                  </a>
                  {repo.language && <p className="mt-0.5 text-xs text-muted-foreground">{repo.language}</p>}
                </li>
              ))}
            </ul>
          </div>
        )}

        <a
          href={`https://github.com/${profile.githubUsername}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-primary"
        >
          View GitHub profile
          <ArrowUpRight className="h-4 w-4" />
        </a>
      </Reveal>
    </div>
  );
};

const GitHubActivitySection = () => {
  const state = useGitHubSummary();

  // The section is an enhancement: if the API is unreachable, leave it out rather than show an error.
  if (state.status === "unavailable") return null;

  return (
    <section id="github" className="section-padding scroll-mt-24 border-t border-border">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          index="06"
          kicker="GitHub"
          title="Recently on GitHub"
          description="A daily, AI-written digest of what I've been building in public over the last 30 days."
        />

        {state.status === "loading" ? (
          <div className="grid gap-4 lg:grid-cols-[1fr_300px]" aria-busy="true">
            <Skeleton className="h-72 rounded-lg" />
            <Skeleton className="h-72 rounded-lg" />
          </div>
        ) : (
          <SummaryCard summary={state.summary} />
        )}
      </div>
    </section>
  );
};

export default GitHubActivitySection;
