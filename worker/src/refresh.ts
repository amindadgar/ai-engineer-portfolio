import { GitHubClient, collectActivity } from "./github";
import { chatCompletion, parseModelList } from "./openrouter";
import { SUMMARY_SCHEMA, assembleSummary, buildSummaryMessages, fallbackSummary, hasActivity, parseSummary } from "./summary";
import type { GitHubSummary } from "./types";

export const SUMMARY_KEY = "github-summary:v1";
// If the LLM fails, keep serving a previous AI summary up to this age rather than downgrading to the fallback.
const KEEP_PREVIOUS_FOR_MS = 7 * 24 * 60 * 60 * 1000;

export type RefreshResult = {
  status: "updated" | "kept-previous";
  aiGenerated: boolean;
  model: string | null;
  highlights: number;
  error?: string;
};

export const refreshGitHubSummary = async (env: Env, now = new Date()): Promise<RefreshResult> => {
  const digest = await collectActivity(
    new GitHubClient(env.GITHUB_TOKEN || undefined),
    env.GITHUB_USERNAME,
    Number(env.SUMMARY_WINDOW_DAYS) || 30,
    now,
  );

  let summary: GitHubSummary | null = null;
  let error: string | undefined;

  if (hasActivity(digest)) {
    try {
      const completion = await chatCompletion(
        env.OPENROUTER_API_KEY,
        parseModelList(env.SUMMARY_MODELS),
        buildSummaryMessages(digest),
        { maxTokens: 1500, temperature: 0.3, schema: SUMMARY_SCHEMA },
      );
      const parsed = parseSummary(completion.content, digest);
      if (parsed) {
        summary = assembleSummary(digest, parsed, {
          aiGenerated: true,
          model: completion.model,
          generatedAt: now.toISOString(),
        });
      } else {
        const { content } = completion;
        const excerpt =
          content.length > 1600 ? `${content.slice(0, 600)}\n[…${content.length - 1200} chars…]\n${content.slice(-600)}` : content;
        error = `Unusable output from ${completion.model} (finish_reason=${completion.finishReason}, ${content.length} chars): ${excerpt}`;
      }
    } catch (e) {
      error = e instanceof Error ? e.message : String(e);
    }
  }

  if (!summary) {
    if (error) console.error("GitHub summary LLM step failed:", error);
    const previous = await env.CACHE.get<GitHubSummary>(SUMMARY_KEY, "json");
    if (previous?.aiGenerated && now.getTime() - Date.parse(previous.generatedAt) < KEEP_PREVIOUS_FOR_MS) {
      return { status: "kept-previous", aiGenerated: true, model: previous.model, highlights: previous.highlights.length, error };
    }
    summary = assembleSummary(digest, fallbackSummary(digest), {
      aiGenerated: false,
      model: null,
      generatedAt: now.toISOString(),
    });
  }

  await env.CACHE.put(SUMMARY_KEY, JSON.stringify(summary));
  return {
    status: "updated",
    aiGenerated: summary.aiGenerated,
    model: summary.model,
    highlights: summary.highlights.length,
    error,
  };
};
