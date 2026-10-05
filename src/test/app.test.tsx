import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import App from "@/App";
import { LINKEDIN_PROFILE_URL, allWritings, latestWritings, recommendations } from "@/data/portfolio";

const renderAtRoute = (path: string) => {
  window.history.replaceState({}, "", path);
  return render(<App />);
};

describe("portfolio app", () => {
  it("renders exactly the latest three writings on the homepage", () => {
    renderAtRoute("/");

    const writingsHeading = screen.getByRole("heading", { name: /recent writings/i });
    const writingsSection = writingsHeading.closest("section");

    expect(writingsSection).not.toBeNull();
    expect(within(writingsSection as HTMLElement).getAllByRole("heading", { level: 3 })).toHaveLength(3);

    latestWritings.forEach((writing) => {
      expect(screen.getByText(writing.title)).toBeInTheDocument();
    });

    allWritings.slice(3).forEach((writing) => {
      expect(screen.queryByText(writing.title)).not.toBeInTheDocument();
    });
  });

  it("navigates to the writings archive from the homepage CTA", async () => {
    renderAtRoute("/");

    fireEvent.click(screen.getByRole("link", { name: /view all \d+ writings/i }));

    expect(await screen.findByRole("heading", { name: /essays, threads, and practical notes on/i })).toBeInTheDocument();
    expect(window.location.pathname).toBe("/writings");
  });

  it("renders the full writings list on the writings route", () => {
    renderAtRoute("/writings");

    allWritings.forEach((writing) => {
      expect(screen.getByText(writing.title)).toBeInTheDocument();
    });
  });

  it("returns to homepage sections from the writings page navbar", async () => {
    renderAtRoute("/writings");

    fireEvent.click(screen.getAllByRole("link", { name: "Writings" })[0]);

    expect(await screen.findByRole("heading", { name: /recent writings/i })).toBeInTheDocument();

    await waitFor(() => {
      expect(window.location.pathname).toBe("/");
      expect(window.location.hash).toBe("#writings");
    });
  });

  it("returns to the about section from the writings page navbar", async () => {
    renderAtRoute("/writings");

    fireEvent.click(screen.getAllByRole("link", { name: "About" })[0]);

    expect(await screen.findByRole("heading", { name: /background/i })).toBeInTheDocument();

    await waitFor(() => {
      expect(window.location.pathname).toBe("/");
      expect(window.location.hash).toBe("#about");
    });
  });

  it("shows every recommendation as a pull quote linking to LinkedIn", () => {
    renderAtRoute("/");

    const recommendationsHeading = screen.getByRole("heading", { name: /what colleagues say/i });
    const recommendationsSection = recommendationsHeading.closest("section");

    expect(recommendationsSection).not.toBeNull();
    expect(screen.queryByRole("link", { name: /visit linkedin/i })).not.toBeInTheDocument();

    // The marquee renders a second, inert copy for the seamless loop; only the first is reachable.
    const quoteLinks = within(recommendationsSection as HTMLElement).getAllByRole("link");
    expect(quoteLinks).toHaveLength(recommendations.length);

    recommendations.forEach((recommendation, i) => {
      expect(recommendation.excerpt).toContain(recommendation.quote);
      expect(quoteLinks[i]).toHaveTextContent(recommendation.author);
      expect(quoteLinks[i]).toHaveTextContent(recommendation.quote);
      expect(quoteLinks[i]).toHaveAttribute("href", LINKEDIN_PROFILE_URL);
    });
  });
});
