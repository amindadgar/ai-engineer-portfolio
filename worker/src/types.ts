// Shared with the frontend (type-only import), so keep this file free of Worker runtime types.

export type SummaryHighlight = {
  title: string;
  detail: string;
  repo: string;
  url: string;
};

export type SummaryRepo = {
  name: string;
  url: string;
  description: string | null;
  language: string | null;
  commits: number;
  /** The count hit the collection cap; show it as "N+". */
  commitsCapped: boolean;
};

export type ContributionDay = {
  date: string;
  count: number;
};

export type GitHubSummary = {
  username: string;
  periodStart: string;
  periodEnd: string;
  generatedAt: string;
  /** False when the LLM call failed and the summary was built deterministically from the raw activity. */
  aiGenerated: boolean;
  model: string | null;
  headline: string;
  highlights: SummaryHighlight[];
  themes: string[];
  repos: SummaryRepo[];
  totalCommits: number;
  /** Daily contribution counts from GitHub's contribution calendar; absent without a GitHub token. */
  calendar?: ContributionDay[];
};
