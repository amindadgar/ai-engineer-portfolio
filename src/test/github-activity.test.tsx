import { render, screen, waitFor } from "@testing-library/react";
import GitHubActivitySection from "@/components/GitHubActivitySection";
import type { GitHubSummary } from "@/hooks/use-github-summary";

const summary: GitHubSummary = {
  username: "amindadgar",
  periodStart: "2026-09-05T05:00:00.000Z",
  periodEnd: "2026-10-05T05:00:00.000Z",
  generatedAt: new Date().toISOString(),
  aiGenerated: true,
  model: "google/gemma-4-31b-it:free",
  headline: "Mostly building an MCP server for price comparison.",
  highlights: [
    {
      title: "Brand and city filters",
      detail: "Fixed brand filtering and cache keys.",
      repo: "mmdju/torob-mcp",
      url: "https://github.com/mmdju/torob-mcp/pull/1",
    },
  ],
  themes: ["MCP"],
  repos: [
    {
      name: "mmdju/torob-mcp",
      url: "https://github.com/mmdju/torob-mcp",
      description: null,
      language: "TypeScript",
      commits: 15,
      commitsCapped: true,
    },
  ],
  totalCommits: 15,
};

const mockFetch = (response: Response) => vi.stubGlobal("fetch", vi.fn(() => Promise.resolve(response)));

describe("GitHubActivitySection", () => {
  it("renders the AI summary with links and capped counts", async () => {
    mockFetch(new Response(JSON.stringify(summary)));
    render(<GitHubActivitySection />);

    expect(await screen.findByText(summary.headline)).toBeInTheDocument();
    expect(screen.getByText("AI summary")).toBeInTheDocument();
    expect(screen.getByText(/written by gemma-4-31b-it/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "mmdju/torob-mcp" })).toHaveAttribute(
      "href",
      "https://github.com/mmdju/torob-mcp/pull/1",
    );
    expect(screen.getAllByText("15+")).toHaveLength(2);
  });

  it("hides the section when the API is unavailable", async () => {
    mockFetch(new Response(JSON.stringify({ error: "not_ready" }), { status: 404 }));
    const { container } = render(<GitHubActivitySection />);

    await waitFor(() => expect(container).toBeEmptyDOMElement());
  });
});
