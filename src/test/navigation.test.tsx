import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ThemeProvider } from "next-themes";
import SectionNav from "@/components/SectionNav";
import ThemeToggle from "@/components/ThemeToggle";

describe("ThemeToggle", () => {
  it("switches between dark and light and remembers the choice", async () => {
    localStorage.clear();
    render(
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        <ThemeToggle />
      </ThemeProvider>,
    );

    fireEvent.click(await screen.findByRole("button", { name: /switch to light theme/i }));
    await waitFor(() => expect(document.documentElement).toHaveClass("light"));
    expect(localStorage.getItem("theme")).toBe("light");

    fireEvent.click(screen.getByRole("button", { name: /switch to dark theme/i }));
    await waitFor(() => expect(document.documentElement).toHaveClass("dark"));
  });
});

describe("SectionNav", () => {
  // jsdom reports a zero-height document, which would otherwise read as "scrolled to the bottom".
  beforeEach(() => {
    Object.defineProperty(document.documentElement, "scrollHeight", { configurable: true, value: 10_000 });
  });
  afterEach(() => {
    delete (document.documentElement as unknown as Record<string, unknown>).scrollHeight;
  });

  // Place sections at fixed offsets from the top of the viewport.
  const layout = (tops: Record<string, number>) => {
    for (const [id, top] of Object.entries(tops)) {
      const el = document.getElementById(id)!;
      el.getBoundingClientRect = () => ({ top, bottom: top + 500 }) as DOMRect;
    }
  };

  const renderPage = (ids: string[]) =>
    render(
      <>
        {ids.map((id) => (
          <section key={id} id={id} />
        ))}
        <SectionNav />
      </>,
    );

  it("lists only sections present on the page and highlights the one being read", async () => {
    renderPage(["about", "ask", "experience"]);
    layout({ about: -900, ask: 100, experience: 900 });
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });

    const nav = screen.getByRole("navigation", { name: /on this page/i });
    await waitFor(() => expect(nav.querySelector("[aria-current]")).toHaveTextContent("Ask AI"));
    expect(screen.queryByText("GitHub")).not.toBeInTheDocument();
    expect(screen.getAllByRole("link").map((a) => a.getAttribute("href"))).toEqual(["#about", "#ask", "#experience"]);
  });

  it("stays hidden above the first section", async () => {
    renderPage(["about", "ask"]);
    layout({ about: 700, ask: 1500 });
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });

    const nav = screen.getByRole("navigation", { name: /on this page/i });
    await waitFor(() => expect(nav).toHaveClass("opacity-0"));
    expect(nav.querySelector("[aria-current]")).toBeNull();
  });
});
