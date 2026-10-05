import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import ChatMarkdown from "@/components/chat/ChatMarkdown";
import ChatPanel from "@/components/chat/ChatPanel";
import { ChatProvider } from "@/hooks/use-chat";
import { stripMarkers } from "@/lib/chat-text";

vi.mock("@/lib/turnstile", () => ({ getTurnstileToken: vi.fn(() => Promise.resolve("turnstile-token")) }));

const sse = (...events: unknown[]) =>
  new Response(
    new ReadableStream({
      start(controller) {
        for (const event of events) controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify(event)}\n\n`));
        controller.close();
      },
    }),
    { headers: { "Content-Type": "text/event-stream" } },
  );

const session = () =>
  new Response(JSON.stringify({ token: "session-token", conversationId: "c1", expiresAt: Date.now() + 30 * 60_000 }));

const renderChat = () =>
  render(
    <ChatProvider>
      <ChatPanel />
    </ChatProvider>,
  );

const ask = (text: string) => {
  fireEvent.change(screen.getByLabelText(/message amin's ai assistant/i), { target: { value: text } });
  fireEvent.click(screen.getByRole("button", { name: /send message/i }));
};

describe("ChatMarkdown", () => {
  it("renders bold, lists, and safe links only", () => {
    render(
      <ChatMarkdown
        text={"He built **Hivemind**.\n\n- [Projects](#projects)\n- [Repo](https://github.com/x)\n- [Bad](javascript:alert(1))"}
      />,
    );
    expect(screen.getByText("Hivemind").tagName).toBe("STRONG");
    expect(screen.getByRole("link", { name: "Projects" })).toHaveAttribute("href", "#projects");
    expect(screen.getByRole("link", { name: "Repo" })).toHaveAttribute("target", "_blank");
    expect(screen.queryByRole("link", { name: "Bad" })).not.toBeInTheDocument();
    expect(screen.getByText(/Bad/).closest("li")).not.toContainHTML("javascript:");
  });

  it("hides complete and partially streamed contact markers", () => {
    expect(stripMarkers("Let's talk.\n[[contact]]", false)).toBe("Let's talk.");
    expect(stripMarkers("Let's talk.\n[[cont", true)).toBe("Let's talk.");
    expect(stripMarkers("Use [brackets]", true)).toBe("Use [brackets]");
  });
});

describe("chat flow", () => {
  it("verifies, streams a reply, and shows the contact card when asked", async () => {
    const fetchMock = vi.fn((url: string) =>
      Promise.resolve(
        url.endsWith("/chat/session")
          ? session()
          : sse(
              { type: "delta", text: "Amin builds **RAG** systems." },
              { type: "delta", text: "\n[[contact]]" },
              { type: "done", contact: true },
            ),
      ),
    );
    vi.stubGlobal("fetch", fetchMock);

    renderChat();
    ask("Can I hire him for a RAG project?");

    expect(await screen.findByText("RAG")).toBeInTheDocument();
    expect(await screen.findByRole("link", { name: /all contact options/i })).toBeInTheDocument();
    expect(screen.queryByText(/\[\[contact\]\]/)).not.toBeInTheDocument();

    const [sessionCall, chatCall] = fetchMock.mock.calls as unknown as [string, RequestInit][];
    expect(JSON.parse(String(sessionCall[1].body))).toMatchObject({ turnstileToken: "turnstile-token" });
    expect(chatCall[1].headers).toMatchObject({ Authorization: "Bearer session-token" });
    expect(JSON.parse(String(chatCall[1].body))).toEqual({ message: "Can I hire him for a RAG project?" });
  });

  it("explains rate limits and locks the input when the conversation is full", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn((url: string) =>
        Promise.resolve(
          url.endsWith("/chat/session")
            ? session()
            : new Response(JSON.stringify({ error: "rate_limited", scope: "conversation" }), { status: 429 }),
        ),
      ),
    );

    renderChat();
    ask("One more question");

    expect(await screen.findByText(/reached its length limit/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message amin's ai assistant/i)).toBeDisabled();

    fireEvent.click(screen.getByRole("button", { name: /new chat/i }));
    await waitFor(() => expect(screen.getByLabelText(/message amin's ai assistant/i)).not.toBeDisabled());
  });
});
