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

const DEFAULT_BASE_URL = "https://openrouter.ai/api/v1";

const headers = (apiKey: string) => ({
  Authorization: `Bearer ${apiKey}`,
  "Content-Type": "application/json",
  "HTTP-Referer": "https://amindadgar.com",
  "X-Title": "amindadgar.com",
});

/**
 * Incremental SSE parser for OpenRouter streams: feed it decoded text chunks, get each `data:` payload back.
 * Comment lines (": OPENROUTER PROCESSING") and the final "[DONE]" are skipped.
 */
export const createSseParser = (onData: (data: string) => void) => {
  let buffer = "";
  return (chunk: string) => {
    buffer += chunk;
    let newline: number;
    while ((newline = buffer.indexOf("\n")) !== -1) {
      const line = buffer.slice(0, newline).replace(/\r$/, "");
      buffer = buffer.slice(newline + 1);
      if (!line.startsWith("data:")) continue;
      const data = line.slice(5).trim();
      if (data && data !== "[DONE]") onData(data);
    }
  };
};

export type StreamEvent =
  | { type: "delta"; text: string }
  | { type: "finish"; model: string | null; finishReason: string | null; promptTokens: number | null; completionTokens: number | null }
  | { type: "error"; message: string };

/** Map one OpenRouter stream chunk to the events we care about. */
export const interpretChunk = (data: string): StreamEvent[] => {
  let chunk: any;
  try {
    chunk = JSON.parse(data);
  } catch {
    return [];
  }
  if (chunk.error) return [{ type: "error", message: String(chunk.error.message ?? "Upstream error") }];

  const events: StreamEvent[] = [];
  const choice = chunk.choices?.[0];
  const text = choice?.delta?.content;
  if (typeof text === "string" && text) events.push({ type: "delta", text });
  if (choice?.finish_reason || chunk.usage) {
    events.push({
      type: "finish",
      model: chunk.model ?? null,
      finishReason: choice?.finish_reason ?? null,
      promptTokens: chunk.usage?.prompt_tokens ?? null,
      completionTokens: chunk.usage?.completion_tokens ?? null,
    });
  }
  return events;
};

/** Starts a streaming completion and returns the raw SSE response body. */
export const streamChatCompletion = async (
  apiKey: string,
  models: string[],
  messages: ChatMessage[],
  options: { maxTokens: number; temperature?: number; baseUrl?: string },
): Promise<ReadableStream<Uint8Array>> => {
  if (!apiKey) throw new Error("OPENROUTER_API_KEY is not set");
  if (models.length === 0) throw new Error("No OpenRouter models configured");

  const response = await fetch(`${options.baseUrl || DEFAULT_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: headers(apiKey),
    body: JSON.stringify({
      model: models[0],
      models,
      messages,
      stream: true,
      max_tokens: options.maxTokens,
      temperature: options.temperature ?? 0.4,
      usage: { include: true },
    }),
    signal: AbortSignal.timeout(60_000),
  });
  if (!response.ok || !response.body) {
    throw new Error(`OpenRouter failed: ${response.status} ${(await response.text()).slice(0, 300)}`);
  }
  return response.body;
};

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

  const response = await fetch(`${DEFAULT_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: headers(apiKey),
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
