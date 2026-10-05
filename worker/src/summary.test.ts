import { describe, expect, it } from "vitest";
import { dedupeCommits, indexEvents, type ActivityDigest, type RepoActivity } from "./github";
import { assembleSummary, fallbackSummary, hasActivity, parseSummary, renderDigest } from "./summary";
import { isAllowedOrigin } from "./cors";

const digest: ActivityDigest = {
  username: "amindadgar",
  since: "2026-09-05T00:00:00.000Z",
  until: "2026-10-05T00:00:00.000Z",
  repos: [
    {
      name: "amindadgar/torob-mcp",
      url: "https://github.com/amindadgar/torob-mcp",
      description: "MCP server for Torob",
      language: "TypeScript",
      isFork: true,
      commits: [
        { sha: "779cad2", message: "brand filter: send the brand id", date: "2026-10-02T17:05:56Z", url: "u1" },
        { sha: "dafcdbc", message: "search cache: key by brand and city", date: "2026-10-02T17:05:28Z", url: "u2" },
      ],
      commitsCapped: false,
    },
    {
      name: "amindadgar/Sketchbook",
      url: "https://github.com/amindadgar/Sketchbook",
      description: null,
      language: "JavaScript",
      isFork: false,
      commits: [],
      commitsCapped: false,
    },
  ],
  pullRequests: [
    {
      repo: "mmdju/torob-mcp",
      number: 1,
      action: "opened",
      title: "Brand and city filters",
      url: "https://github.com/mmdju/torob-mcp/pull/1",
      merged: false,
    },
  ],
  created: [],
  releases: [],
};

describe("indexEvents", () => {
  const event = (type: string, repo: string, created_at: string, payload: Record<string, unknown> = {}) => ({
    type,
    repo: { name: repo },
    created_at,
    payload,
  });

  it("ranks repos by activity, tracks pushed branches, and ignores old and irrelevant events", () => {
    const index = indexEvents(
      [
        event("PushEvent", "me/a", "2026-10-03T00:00:00Z", { ref: "refs/heads/main" }),
        event("PushEvent", "me/a", "2026-10-02T00:00:00Z", { ref: "refs/heads/feat/x" }),
        event("PullRequestEvent", "other/b", "2026-10-02T00:00:00Z", { number: 4, action: "closed" }),
        event("PullRequestEvent", "other/b", "2026-10-01T00:00:00Z", { number: 4, action: "opened" }),
        event("WatchEvent", "someone/c", "2026-10-01T00:00:00Z"),
        event("PushEvent", "me/old", "2026-08-01T00:00:00Z", { ref: "refs/heads/main" }),
      ],
      Date.parse("2026-09-05T00:00:00Z"),
    );

    expect(index.repos.map((r) => r.name)).toEqual(["other/b", "me/a"]);
    expect(index.repos[1].branches).toEqual(["main", "feat/x"]);
    expect(index.pullRequests).toEqual([{ repo: "other/b", number: 4, action: "closed" }]);
  });
});

describe("dedupeCommits", () => {
  const repo = (name: string, isFork: boolean, shas: string[]): RepoActivity => ({
    name,
    url: `https://github.com/${name}`,
    description: null,
    language: null,
    isFork,
    commits: shas.map((sha) => ({ sha, message: sha, date: "2026-10-01T00:00:00Z", url: sha })),
    commitsCapped: false,
  });

  it("keeps shared commits on the upstream repo and drops the emptied fork", () => {
    const result = dedupeCommits([
      repo("me/tool", true, ["a1", "b2"]),
      repo("org/tool", false, ["a1", "b2"]),
      repo("me/other", false, []),
    ]);
    expect(result.map((r) => r.name)).toEqual(["org/tool", "me/other"]);
  });

  it("keeps a fork's own commits", () => {
    const result = dedupeCommits([repo("me/tool", true, ["a1", "c3"]), repo("org/tool", false, ["a1"])]);
    expect(result.find((r) => r.name === "me/tool")?.commits.map((c) => c.sha)).toEqual(["c3"]);
  });
});

describe("parseSummary", () => {
  it("accepts fenced JSON with thinking blocks and keeps links from the data", () => {
    const text = `<think>planning</think>\n\`\`\`json\n${JSON.stringify({
      headline: "Mostly improving search filters in a Torob MCP server.",
      highlights: [
        {
          title: "Brand filters",
          detail: "Fixed brand filtering.",
          repo: "amindadgar/torob-mcp",
          url: "https://github.com/mmdju/torob-mcp/pull/1",
        },
      ],
      themes: ["MCP", "TypeScript"],
    })}\n\`\`\``;

    const parsed = parseSummary(text, digest);
    expect(parsed?.headline).toBe("Mostly improving search filters in a Torob MCP server.");
    expect(parsed?.highlights[0].url).toBe("https://github.com/mmdju/torob-mcp/pull/1");
    expect(parsed?.themes).toEqual(["MCP", "TypeScript"]);
  });

  it("drops highlights for repos not in the data and replaces invented links", () => {
    const parsed = parseSummary(
      JSON.stringify({
        headline: "A month of work.",
        highlights: [
          { title: "Made up", detail: "Not real.", repo: "amindadgar/imaginary" },
          { title: "Real", detail: "Real work.", repo: "amindadgar/torob-mcp", url: "https://evil.example/x" },
        ],
        themes: [],
      }),
      digest,
    );

    expect(parsed?.highlights).toEqual([
      { title: "Real", detail: "Real work.", repo: "amindadgar/torob-mcp", url: "https://github.com/amindadgar/torob-mcp" },
    ]);
  });

  it("matches repo names written with typographic hyphens or without the owner", () => {
    const parsed = parseSummary(
      JSON.stringify({
        headline: "Work on torob\u2011mcp.",
        highlights: [
          { title: "Filters", detail: "Brand filters.", repo: "amindadgar/torob\u2011mcp", url: null },
          { title: "Scenes", detail: "City scene.", repo: "Sketchbook", url: null },
        ],
        themes: [],
      }),
      digest,
    );
    expect(parsed?.highlights.map((h) => h.repo)).toEqual(["amindadgar/torob-mcp", "amindadgar/Sketchbook"]);
  });

  it("rejects output without a headline or usable highlights", () => {
    expect(parseSummary("not json", digest)).toBeNull();
    expect(parseSummary(JSON.stringify({ headline: "", highlights: [] }), digest)).toBeNull();
    expect(
      parseSummary(JSON.stringify({ headline: "x", highlights: [{ title: "a", detail: "b", repo: "x/y" }] }), digest),
    ).toBeNull();
  });
});

describe("fallback and assembly", () => {
  it("builds a deterministic summary from repos with commits", () => {
    const fallback = fallbackSummary(digest);
    expect(fallback.headline).toBe("Shipped commits to 1 public repository in the last 30 days.");
    expect(fallback.highlights[0]).toMatchObject({ repo: "amindadgar/torob-mcp", title: "torob-mcp" });
    expect(fallback.themes).toEqual(["TypeScript"]);
  });

  it("reports no activity for an empty digest", () => {
    const empty = { ...digest, repos: [], pullRequests: [] };
    expect(hasActivity(empty)).toBe(false);
    expect(fallbackSummary(empty).headline).toBe("No public GitHub activity in this period.");
  });

  it("counts commits only for repos that have them", () => {
    const summary = assembleSummary(digest, fallbackSummary(digest), {
      aiGenerated: false,
      model: null,
      generatedAt: "2026-10-05T05:00:00.000Z",
    });
    expect(summary.repos.map((r) => r.name)).toEqual(["amindadgar/torob-mcp"]);
    expect(summary.totalCommits).toBe(2);
  });

  it("renders a compact digest for the prompt", () => {
    const text = renderDigest(digest);
    expect(text).toContain("Repo amindadgar/torob-mcp (fork, TypeScript): MCP server for Torob");
    expect(text).toContain("opened #1 in mmdju/torob-mcp: Brand and city filters");
  });
});

describe("isAllowedOrigin", () => {
  const list = "https://amindadgar.com,http://localhost:8080";
  it("allows listed origins and this project's Vercel previews only", () => {
    expect(isAllowedOrigin("https://amindadgar.com", list)).toBe(true);
    expect(isAllowedOrigin("https://ai-engineer-portfolio-abc123-amindadgars-projects.vercel.app", list)).toBe(true);
    expect(isAllowedOrigin("https://evil-ai-engineer-portfolio.vercel.app", list)).toBe(false);
    expect(isAllowedOrigin("https://amindadgar.com.evil.com", list)).toBe(false);
    expect(isAllowedOrigin(null, list)).toBe(false);
  });
});
