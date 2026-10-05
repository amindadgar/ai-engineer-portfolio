export type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

export type CompletionResult = {
  content: string;
  /** The model OpenRouter actually routed to (may be a fallback). */
  model: string;
  /** "stop" when the model finished; "length" means it was cut off at max_tokens. */
  finishReason: string | null;
};

export const parseModelList = (value: string | undefined): string[] =>
  (value ?? "")
    .split(",")
    .map((m) => m.trim())
    .filter(Boolean);

export const chatCompletion = async (
  apiKey: string,
  models: string[],
  messages: ChatMessage[],
  options: {
    maxTokens: number;
    temperature?: number;
    /** JSON schema the reply must follow (OpenRouter structured outputs, strict mode). */
    schema?: { name: string; schema: Record<string, unknown> };
  },
): Promise<CompletionResult> => {
  if (!apiKey) throw new Error("OPENROUTER_API_KEY is not set");
  if (models.length === 0) throw new Error("No OpenRouter models configured");

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://amindadgar.com",
      "X-Title": "amindadgar.com",
    },
    body: JSON.stringify({
      model: models[0],
      // OpenRouter tries these in order when the primary is down or rate limited.
      models,
      messages,
      max_tokens: options.maxTokens,
      temperature: options.temperature ?? 0.3,
      ...(options.schema
        ? {
            response_format: { type: "json_schema", json_schema: { ...options.schema, strict: true } },
            // Only route to providers that honor the schema, instead of silently ignoring it.
            provider: { require_parameters: true },
          }
        : {}),
    }),
    signal: AbortSignal.timeout(90_000),
  });

  if (!response.ok) {
    throw new Error(`OpenRouter failed: ${response.status} ${(await response.text()).slice(0, 300)}`);
  }

  const data = await response.json<any>();
  const content = data?.choices?.[0]?.message?.content;
  if (typeof content !== "string" || !content.trim()) {
    throw new Error(`OpenRouter returned no content: ${JSON.stringify(data).slice(0, 300)}`);
  }
  return {
    content,
    model: String(data.model ?? models[0]),
    finishReason: data?.choices?.[0]?.finish_reason ?? null,
  };
};
