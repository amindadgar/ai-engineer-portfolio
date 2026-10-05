import { fireEvent, render, screen, within } from "@testing-library/react";
import ChatLauncher from "@/components/chat/ChatLauncher";
import ExperienceSection from "@/components/ExperienceSection";
import { ChatProvider } from "@/hooks/use-chat";
import { experiences } from "@/data/portfolio";

vi.mock("@/lib/turnstile", () => ({ getTurnstileToken: vi.fn(() => Promise.resolve("turnstile-token")) }));

const renderExperience = () =>
  render(
    <ChatProvider>
      <ExperienceSection />
      <ChatLauncher />
    </ChatProvider>,
  );

describe("ExperienceSection", () => {
  it("shows one role at a time and switches with clicks and arrow keys", () => {
    renderExperience();
    const tabs = screen.getAllByRole("tab");
    expect(tabs).toHaveLength(experiences.length);
    expect(tabs[0]).toHaveAttribute("aria-selected", "true");

    const panelFor = (i: number) => document.getElementById(tabs[i].getAttribute("aria-controls")!)!;
    expect(panelFor(0)).not.toHaveClass("invisible");
    expect(panelFor(1)).toHaveClass("invisible");

    fireEvent.click(tabs[2]);
    expect(tabs[2]).toHaveAttribute("aria-selected", "true");
    expect(panelFor(2)).not.toHaveClass("invisible");
    expect(within(panelFor(2)).getByText(experiences[2].highlights[0])).toBeInTheDocument();

    fireEvent.keyDown(tabs[2], { key: "ArrowDown" });
    expect(tabs[3]).toHaveAttribute("aria-selected", "true");
    expect(tabs[3]).toHaveFocus();

    fireEvent.keyDown(tabs[3], { key: "ArrowDown" });
    expect(tabs[0]).toHaveAttribute("aria-selected", "true");
  });

  it("opens the chat with a prepared question from 'Ask AI about this'", async () => {
    const fetchMock = vi.fn(() => new Promise<Response>(() => {}));
    vi.stubGlobal("fetch", fetchMock);
    renderExperience();

    fireEvent.click(screen.getAllByRole("tab")[1]);
    fireEvent.click(within(screen.getByRole("tabpanel", { name: /AXIS/ })).getByRole("button", { name: /ask ai about this/i }));

    const dialog = await screen.findByRole("dialog");
    expect(within(dialog).getByText("What did Amin build at AXIS, and what was the impact?")).toBeInTheDocument();
  });
});
