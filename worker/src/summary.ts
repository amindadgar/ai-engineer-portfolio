import type { ActivityDigest } from "./github";
import type { ChatMessage } from "./openrouter";
import type { GitHubSummary, SummaryHighlight, SummaryRepo } from "./types";

const MAX_HIGHLIGHTS = 5;
const MAX_THEMES = 6;

type ParsedSummary = Pick<GitHubSummary, "headline" | "highlights" | "themes">;

const clip = (value: unknown, max: number): string =>
  typeof value === "string" ? value.replace(/\s+/g, " ").trim().slice(0, max) : "";

const day = (iso: string) => iso.slice(0, 10);

// Models often write repo names with typographic hyphens (e.g. U+2011 non-breaking hyphen).
const normalizeRepo = (value: string) =>
  value
    .normalize("NFKC")
    .replace(/[\u2010-\u2015\u2212\uFE63\uFF0D]/g, "-")
    .replace(/^https?:\/\/github\.com\//i, "")
    .replace(/\/+$/, "")
    .trim()
    .toLowerCase();

// Array caps matter: without them Gemini Flash-Lite was seen looping on "themes" until it hit max_tokens.
export const SUMMARY_SCHEMA = {
  name: "github_summary",
  schema: {
    type: "object",
    additionalProperties: false,
    required: ["headline", "highlights", "themes"],
    properties: {
      headline: { type: "string" },
      highlights: {
        type: "array",
        maxItems: MAX_HIGHLIGHTS,
        items: {
          type: "object",
          additionalProperties: false,
          required: ["title", "detail", "repo", "url"],
          properties: {
            title: { type: "string" },
            detail: { type: "string" },
            repo: { type: "string" },
            url: { type: ["string", "null"] },
          },
        },
      },
      themes: { type: "array", maxItems: MAX_THEMES, items: { type: "string" } },
    },
  },
};

export const hasActivity = (digest: ActivityDigest) =>
  digest.repos.some((r) => r.commits.length > 0) ||
  digest.pullRequests.length > 0 ||
  digest.releases.length > 0 ||
  digest.created.length > 0;

/** Compact plain-text view of the activity; cheaper and easier for small models than raw JSON. */
export const renderDigest = (digest: ActivityDigest): string => {
  const lines: string[] = [`Period: ${day(digest.since)} to ${day(digest.until)}`, ""];

  for (const repo of digest.repos) {
    const facts = [repo.isFork ? "fork" : null, repo.language].filter(Boolean).join(", ");
    lines.push(`Repo ${repo.name}${facts ? ` (${facts})` : ""}: ${repo.description ?? "no description"}`);
    lines.push(`  URL: ${repo.url}`);
    if (repo.commits.length === 0) lines.push("  No commits by the author in this period.");
    for (const commit of repo.commits) lines.push(`  - ${day(commit.date)} ${commit.message}`);
    lines.push("");
  }

  if (digest.pullRequests.length) {
    lines.push("Pull requests:");
    for (const pr of digest.pullRequests) {
      const state = pr.merged ? "merged" : pr.action;
      lines.push(`  - ${state} #${pr.number} in ${pr.repo}: ${pr.title ?? "(untitled)"} — ${pr.url}`);
    }
    lines.push("");
  }

  if (digest.releases.length) {
    lines.push("Releases:");
    for (const release of digest.releases) lines.push(`  - ${release.repo}: ${release.name} — ${release.url}`);
    lines.push("");
  }

  if (digest.created.length) {
    lines.push("Created:");
    for (const c of digest.created) lines.push(`  - ${c.refType}${c.ref ? ` ${c.ref}` : ""} in ${c.repo}`);
  }

  return lines.join("\n").trim();
};

export const buildSummaryMessages = (digest: ActivityDigest): ChatMessage[] => [
  {
    role: "system",
    content: [
      "You summarize a software engineer's recent public GitHub activity for the 'Recently on GitHub' card on his portfolio site.",
      "The engineer is Amin (Mohammad Amin Dadgar), a freelance AI engineer. Write about him in the third person.",
      "",
      "Rules:",
      "- Use only facts present in the activity data. Never invent features, metrics, users, or outcomes.",
      "- Group related commits into what was actually built or fixed; do not list commits one by one or mention hashes.",
      "- Be specific and plain. No hype words (e.g. 'revolutionary', 'cutting-edge', 'passionate').",
      "- For forks, describe the work as contributions to that project.",
      "",
      "Reply with a single JSON object and nothing else:",
      "{",
      '  "headline": "one sentence, at most 140 characters, on what the period was mostly about",',
      `  "highlights": [ up to ${MAX_HIGHLIGHTS} items, most significant first: {`,
      '    "title": "at most 60 characters",',
      '    "detail": "one or two sentences, at most 220 characters",',
      '    "repo": "owner/name exactly as given in the data",',
      '    "url": "a pull request or release URL from the data, or null"',
      "  } ],",
      `  "themes": [ 2 to ${MAX_THEMES} short topic tags, at most 24 characters each, e.g. "MCP", "Cloudflare Workers" ]`,
      "}",
    ].join("\n"),
  },
  { role: "user", content: renderDigest(digest) },
];

const extractJson = (text: string): unknown => {
  const withoutThinking = text.replace(/<think>[\s\S]*?<\/think>/gi, "");
  const start = withoutThinking.indexOf("{");
  const end = withoutThinking.lastIndexOf("}");
  if (start === -1 || end <= start) return null;
  try {
    return JSON.parse(withoutThinking.slice(start, end + 1));
  } catch {
    return null;
  }
};

/** Validate model output against the digest: unknown repos are dropped and links must come from the data. */
export const parseSummary = (text: string, digest: ActivityDigest): ParsedSummary | null => {
  const raw = extractJson(text) as Record<string, unknown> | null;
  if (!raw || typeof raw !== "object") return null;

  const headline = clip(raw.headline, 160);
  if (!headline) return null;

  // Canonical repo name and URL, keyed by normalized "owner/name".
  const knownRepos = new Map<string, { name: string; url: string }>();
  for (const r of digest.repos) knownRepos.set(normalizeRepo(r.name), { name: r.name, url: r.url });
  for (const pr of digest.pullRequests) {
    const key = normalizeRepo(pr.repo);
    if (!knownRepos.has(key)) knownRepos.set(key, { name: pr.repo, url: `https://github.com/${pr.repo}` });
  }
  const resolveRepo = (value: string) => {
    const key = normalizeRepo(value);
    if (knownRepos.has(key)) return knownRepos.get(key);
    // Bare repo name without owner: accept only if it is unambiguous.
    const matches = [...knownRepos.entries()].filter(([k]) => k.split("/")[1] === key);
    return matches.length === 1 ? matches[0][1] : undefined;
  };
  const allowedLinks = new Set([...digest.pullRequests.map((p) => p.url), ...digest.releases.map((r) => r.url)]);

  const highlights: SummaryHighlight[] = [];
  for (const item of Array.isArray(raw.highlights) ? raw.highlights : []) {
    if (!item || typeof item !== "object") continue;
    const h = item as Record<string, unknown>;
    const repo = resolveRepo(clip(h.repo, 140));
    const title = clip(h.title, 80);
    const detail = clip(h.detail, 260);
    if (!repo || !title || !detail) continue;
    const link = typeof h.url === "string" && allowedLinks.has(h.url) ? h.url : repo.url;
    highlights.push({ title, detail, repo: repo.name, url: link });
    if (highlights.length === MAX_HIGHLIGHTS) break;
  }
  if (highlights.length === 0) return null;

  const themes = (Array.isArray(raw.themes) ? raw.themes : [])
    .map((t) => clip(t, 24))
    .filter(Boolean)
    .slice(0, MAX_THEMES);

  return { headline, highlights, themes };
};

/** Deterministic summary used when the LLM is unavailable or returns unusable output. */
export const fallbackSummary = (digest: ActivityDigest): ParsedSummary => {
  const active = digest.repos.filter((r) => r.commits.length > 0);
  if (!hasActivity(digest)) {
    return { headline: "No public GitHub activity in this period.", highlights: [], themes: [] };
  }
  return {
    headline: `Shipped commits to ${active.length} public ${active.length === 1 ? "repository" : "repositories"} in the last ${Math.round(
      (Date.parse(digest.until) - Date.parse(digest.since)) / 86_400_000,
    )} days.`,
    highlights: active.slice(0, MAX_HIGHLIGHTS).map((repo) => ({
      title: repo.name.split("/")[1],
      detail: `${repo.commits.length} ${repo.commits.length === 1 ? "commit" : "commits"}, latest: "${repo.commits[0].message}"`,
      repo: repo.name,
      url: repo.url,
    })),
    themes: [...new Set(active.map((r) => r.language).filter((l): l is string => Boolean(l)))].slice(0, MAX_THEMES),
  };
};

export const assembleSummary = (
  digest: ActivityDigest,
  parsed: ParsedSummary,
  meta: { aiGenerated: boolean; model: string | null; generatedAt: string },
): GitHubSummary => {
  const repos: SummaryRepo[] = digest.repos
    .filter((r) => r.commits.length > 0)
    .map((r) => ({
      name: r.name,
      url: r.url,
      description: r.description,
      language: r.language,
      commits: r.commits.length,
      commitsCapped: r.commitsCapped,
    }));

  return {
    username: digest.username,
    periodStart: digest.since,
    periodEnd: digest.until,
    generatedAt: meta.generatedAt,
    aiGenerated: meta.aiGenerated,
    model: meta.model,
    ...parsed,
    repos,
    totalCommits: repos.reduce((sum, r) => sum + r.commits, 0),
    calendar: digest.calendar,
  };
};
