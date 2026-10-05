import type { ContributionDay } from "./types";

// Free Workers allow 50 outbound subrequests per invocation; these caps keep a refresh at ~30.
const MAX_REPOS = 8;
const MAX_BRANCHES_PER_REPO = 2;
const MAX_PR_LOOKUPS = 5;
const MAX_COMMITS_PER_REPO = 15;

type GitHubEvent = {
  type: string;
  created_at: string;
  repo: { name: string };
  // Event payloads vary by type and were slimmed down by GitHub in 2025 (no commit lists, no PR titles).
  payload: Record<string, any>;
};

export type CommitInfo = { sha: string; message: string; date: string; url: string };

export type RepoActivity = {
  name: string;
  url: string;
  description: string | null;
  language: string | null;
  isFork: boolean;
  commits: CommitInfo[];
  /** True when the per-repo commit cap was hit, so the real count is higher. */
  commitsCapped: boolean;
};

export type PullRequestInfo = {
  repo: string;
  number: number;
  action: string;
  title: string | null;
  url: string;
  merged: boolean;
};

export type ActivityDigest = {
  username: string;
  since: string;
  until: string;
  repos: RepoActivity[];
  pullRequests: PullRequestInfo[];
  created: { repo: string; refType: string; ref: string | null }[];
  releases: { repo: string; name: string; url: string }[];
  calendar?: ContributionDay[];
};

export type EventIndex = {
  /** Repos ordered by activity, each with the branches pushed to in the window. */
  repos: { name: string; branches: string[] }[];
  pullRequests: { repo: string; number: number; action: string }[];
  created: { repo: string; refType: string; ref: string | null }[];
  releases: { repo: string; name: string; url: string }[];
};

/** Pure: reduce raw public events to what is worth fetching details for. */
export const indexEvents = (events: GitHubEvent[], sinceMs: number): EventIndex => {
  const scores = new Map<string, number>();
  const branches = new Map<string, Set<string>>();
  const pullRequests: EventIndex["pullRequests"] = [];
  const created: EventIndex["created"] = [];
  const releases: EventIndex["releases"] = [];

  const bump = (repo: string, by: number) => scores.set(repo, (scores.get(repo) ?? 0) + by);

  for (const event of events) {
    if (Date.parse(event.created_at) < sinceMs) continue;
    const repo = event.repo.name;
    const p = event.payload ?? {};

    switch (event.type) {
      case "PushEvent": {
        bump(repo, 1);
        const ref = typeof p.ref === "string" ? p.ref.replace(/^refs\/heads\//, "") : null;
        if (ref) {
          if (!branches.has(repo)) branches.set(repo, new Set());
          branches.get(repo)!.add(ref);
        }
        break;
      }
      case "PullRequestEvent":
        bump(repo, 3);
        if (typeof p.number === "number") {
          pullRequests.push({ repo, number: p.number, action: String(p.action ?? "updated") });
        }
        break;
      case "CreateEvent":
        bump(repo, 1);
        created.push({ repo, refType: String(p.ref_type ?? "repository"), ref: p.ref ?? null });
        break;
      case "ReleaseEvent":
        bump(repo, 3);
        releases.push({
          repo,
          name: String(p.release?.name || p.release?.tag_name || "release"),
          url: String(p.release?.html_url ?? `https://github.com/${repo}/releases`),
        });
        break;
      // Stars, forks of other people's repos, etc. say little about what was built.
      default:
        break;
    }
  }

  const repos = [...scores.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, MAX_REPOS)
    .map(([name]) => ({ name, branches: [...(branches.get(name) ?? [])].slice(0, MAX_BRANCHES_PER_REPO) }));

  // Keep only the latest action per PR (events are newest first).
  const seenPrs = new Set<string>();
  const latestPrs = pullRequests.filter((pr) => {
    const key = `${pr.repo}#${pr.number}`;
    if (seenPrs.has(key)) return false;
    seenPrs.add(key);
    return true;
  });

  return { repos, pullRequests: latestPrs, created, releases };
};

/**
 * Pure: the same commit shows up in a fork and its upstream once a PR is merged.
 * Keep it on the upstream (non-fork) repo and drop forks left with nothing of their own.
 */
export const dedupeCommits = (repos: RepoActivity[]): RepoActivity[] => {
  const seen = new Set<string>();
  const deduped = new Map<string, RepoActivity>();
  for (const repo of [...repos].sort((a, b) => Number(a.isFork) - Number(b.isFork))) {
    const commits = repo.commits.filter((c) => !seen.has(c.sha));
    commits.forEach((c) => seen.add(c.sha));
    if (commits.length === 0 && repo.commits.length > 0) continue;
    deduped.set(repo.name, { ...repo, commits });
  }
  // Preserve the original activity ranking.
  return repos.flatMap((r) => deduped.get(r.name) ?? []);
};

const firstLine = (message: string) => message.split("\n")[0].trim().slice(0, 200);

export class GitHubClient {
  constructor(private readonly token?: string) {}

  private headers(): HeadersInit {
    const headers: Record<string, string> = {
      Accept: "application/vnd.github+json",
      "User-Agent": "amin-api (amindadgar.com)",
      "X-GitHub-Api-Version": "2022-11-28",
    };
    if (this.token) headers.Authorization = `Bearer ${this.token}`;
    return headers;
  }

  async get<T>(path: string): Promise<T> {
    const response = await fetch(`https://api.github.com${path}`, { headers: this.headers() });
    if (!response.ok) {
      throw new Error(`GitHub ${path} failed: ${response.status} ${await response.text().then((t) => t.slice(0, 200))}`);
    }
    return response.json<T>();
  }

  async contributionCalendar(username: string, from: Date, to: Date): Promise<ContributionDay[] | undefined> {
    if (!this.token) return undefined;
    const query = `query($login: String!, $from: DateTime!, $to: DateTime!) {
      user(login: $login) {
        contributionsCollection(from: $from, to: $to) {
          contributionCalendar { weeks { contributionDays { date contributionCount } } }
        }
      }
    }`;
    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: { ...this.headers(), "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables: { login: username, from: from.toISOString(), to: to.toISOString() } }),
    });
    if (!response.ok) return undefined;
    const data = await response.json<any>();
    const weeks = data?.data?.user?.contributionsCollection?.contributionCalendar?.weeks;
    if (!Array.isArray(weeks)) return undefined;
    return weeks.flatMap((week: any) =>
      week.contributionDays.map((day: any) => ({ date: day.date, count: day.contributionCount })),
    );
  }
}

export const collectActivity = async (
  client: GitHubClient,
  username: string,
  windowDays: number,
  now = new Date(),
): Promise<ActivityDigest> => {
  const since = new Date(now.getTime() - windowDays * 24 * 60 * 60 * 1000);
  const events = await client.get<GitHubEvent[]>(`/users/${username}/events/public?per_page=100`);
  const index = indexEvents(events, since.getTime());

  const repoResults = await Promise.allSettled(
    index.repos.map(async ({ name, branches }): Promise<RepoActivity> => {
      const meta = await client.get<any>(`/repos/${name}`);
      // Default branch first, then any other branch pushed to in the window.
      const refs = [null, ...branches.filter((b) => b !== meta.default_branch)].slice(0, MAX_BRANCHES_PER_REPO);
      const commitLists = await Promise.allSettled(
        refs.map((ref) =>
          client.get<any[]>(
            `/repos/${name}/commits?author=${username}&since=${since.toISOString()}&per_page=${MAX_COMMITS_PER_REPO}` +
              (ref ? `&sha=${encodeURIComponent(ref)}` : ""),
          ),
        ),
      );
      const seen = new Set<string>();
      const commits: CommitInfo[] = [];
      let capped = false;
      for (const list of commitLists) {
        if (list.status !== "fulfilled") continue;
        if (list.value.length >= MAX_COMMITS_PER_REPO) capped = true;
        for (const c of list.value) {
          if (seen.has(c.sha)) continue;
          seen.add(c.sha);
          commits.push({
            sha: c.sha.slice(0, 7),
            message: firstLine(c.commit?.message ?? ""),
            date: c.commit?.author?.date ?? "",
            url: c.html_url,
          });
        }
      }
      commits.sort((a, b) => b.date.localeCompare(a.date));
      return {
        name,
        url: meta.html_url ?? `https://github.com/${name}`,
        description: meta.description ?? null,
        language: meta.language ?? null,
        isFork: Boolean(meta.fork),
        commits: commits.slice(0, MAX_COMMITS_PER_REPO),
        commitsCapped: capped || commits.length > MAX_COMMITS_PER_REPO,
      };
    }),
  );

  const prResults = await Promise.allSettled(
    index.pullRequests.slice(0, MAX_PR_LOOKUPS).map(async (pr): Promise<PullRequestInfo> => {
      const data = await client.get<any>(`/repos/${pr.repo}/pulls/${pr.number}`);
      return {
        repo: pr.repo,
        number: pr.number,
        action: pr.action,
        title: data.title ?? null,
        url: data.html_url ?? `https://github.com/${pr.repo}/pull/${pr.number}`,
        merged: Boolean(data.merged),
      };
    }),
  );

  const calendar = await client.contributionCalendar(username, since, now).catch(() => undefined);

  return {
    username,
    since: since.toISOString(),
    until: now.toISOString(),
    repos: dedupeCommits(repoResults.flatMap((r) => (r.status === "fulfilled" ? [r.value] : []))),
    pullRequests: prResults.flatMap((r) => (r.status === "fulfilled" ? [r.value] : [])),
    created: index.created,
    releases: index.releases,
    calendar,
  };
};
