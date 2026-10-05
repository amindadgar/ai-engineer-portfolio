import { describe, expect, it } from "vitest";
import { CONTACT_MARKER, buildSystemPrompt, renderKnowledge } from "./knowledge";
import { createSseParser, interpretChunk } from "./openrouter";
import { hashIp, signSession, verifySession } from "./session";

describe("sessions", () => {
  const secret = "test-secret";

  it("round-trips a valid session", async () => {
    const ip = await hashIp(secret, "203.0.113.7");
    const token = await signSession(secret, { cid: "c1", ip, exp: Date.now() + 60_000 });
    const check = await verifySession(secret, token, ip);
    expect(check).toEqual({ ok: true, session: expect.objectContaining({ cid: "c1" }) });
  });

  it("rejects tampering, expiry, other visitors, and other secrets", async () => {
    const ip = await hashIp(secret, "203.0.113.7");
    const token = await signSession(secret, { cid: "c1", ip, exp: Date.now() + 60_000 });
    const [body, signature] = token.split(".");
    const forgedBody = btoa(JSON.stringify({ cid: "other", ip, exp: Date.now() + 60_000 }))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    expect(await verifySession(secret, `${forgedBody}.${signature}`, ip)).toEqual({ ok: false, reason: "invalid" });
    expect(await verifySession(secret, `${body}.${signature}`, ip, Date.now() + 120_000)).toEqual({
      ok: false,
      reason: "expired",
    });
    expect(await verifySession(secret, token, await hashIp(secret, "198.51.100.1"))).toEqual({
      ok: false,
      reason: "ip_mismatch",
    });
    expect(await verifySession("other-secret", token, ip)).toEqual({ ok: false, reason: "invalid" });
    expect(await verifySession(secret, "garbage", ip)).toEqual({ ok: false, reason: "invalid" });
  });

  it("hashes IPs deterministically without exposing them", async () => {
    const a = await hashIp(secret, "203.0.113.7");
    expect(a).toBe(await hashIp(secret, "203.0.113.7"));
    expect(a).not.toContain("203");
    expect(a).not.toBe(await hashIp("another-secret", "203.0.113.7"));
  });
});

describe("OpenRouter stream parsing", () => {
  it("reassembles data lines split across chunks and skips comments and [DONE]", () => {
    const seen: string[] = [];
    const parse = createSseParser((d) => seen.push(d));
    parse(": OPENROUTER PROCESSING\n\ndata: {\"a\"");
    parse(":1}\r\n\r\ndata: [DONE]\n\n");
    expect(seen).toEqual(['{"a":1}']);
  });

  it("extracts text deltas, finish info with usage, and errors", () => {
    expect(interpretChunk('{"choices":[{"delta":{"content":"Hi"}}]}')).toEqual([{ type: "delta", text: "Hi" }]);
    expect(
      interpretChunk(
        '{"model":"m","choices":[{"delta":{},"finish_reason":"stop"}],"usage":{"prompt_tokens":10,"completion_tokens":2}}',
      ),
    ).toEqual([{ type: "finish", model: "m", finishReason: "stop", promptTokens: 10, completionTokens: 2 }]);
    expect(interpretChunk('{"error":{"message":"overloaded"}}')).toEqual([{ type: "error", message: "overloaded" }]);
    expect(interpretChunk("not json")).toEqual([]);
  });
});

describe("knowledge", () => {
  it("includes the site's data without markdown emphasis markers", () => {
    const text = renderKnowledge(null);
    expect(text).toContain("AI Engineer at TogetherCrew");
    expect(text).toContain("Hivemind Bot");
    expect(text).toContain("dadgaramin96@gmail.com");
    expect(text).toContain("5+ years of experience");
    expect(text).not.toContain("**");
    expect(text).not.toContain("Recent public GitHub activity");
  });

  it("adds the GitHub summary and the contact marker rule", () => {
    const prompt = buildSystemPrompt(
      {
        username: "amindadgar",
        periodStart: "2026-09-05T00:00:00Z",
        periodEnd: "2026-10-05T00:00:00Z",
        generatedAt: "2026-10-05T00:00:00Z",
        aiGenerated: true,
        model: "m",
        headline: "Built an MCP server.",
        highlights: [{ title: "MCP", detail: "Filters.", repo: "a/b", url: "https://github.com/a/b" }],
        themes: [],
        repos: [{ name: "a/b", url: "https://github.com/a/b", description: null, language: null, commits: 15, commitsCapped: true }],
        totalCommits: 15,
      },
      "2026-10-05",
    );
    expect(prompt.content).toContain("Built an MCP server.");
    expect(prompt.content).toContain("a/b (15+ commits)");
    expect(prompt.content).toContain(CONTACT_MARKER);
    expect(prompt.content).toContain("Today is 2026-10-05");
  });
});
