import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import App from "@/App";
import { LINKEDIN_PROFILE_URL, allWritings, latestWritings, recommendations } from "@/data/portfolio";

const renderAtRoute = (path: string) => {
  window.history.replaceState({}, "", path);
  return render(<App />);
};

describe("portfolio app", () => {
  it("renders exactly the latest five writings on the homepage", () => {
    renderAtRoute("/");

    const writingsHeading = screen.getByRole("heading", { name: /recent writings/i });
    const writingsSection = writingsHeading.closest("section");

    expect(writingsSection).not.toBeNull();
    expect(within(writingsSection as HTMLElement).getAllByRole("heading", { level: 3 })).toHaveLength(5);

    latestWritings.forEach((writing) => {
      expect(screen.getByText(writing.title)).toBeInTheDocument();
    });

    allWritings.slice(5).forEach((writing) => {
      expect(screen.queryByText(writing.title)).not.toBeInTheDocument();
    });
  });

  it("navigates to the writings archive from the homepage CTA", async () => {
    renderAtRoute("/");

    fireEvent.click(screen.getByRole("link", { name: /view all writings/i }));

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

    expect(await screen.findByRole("heading", { name: /about me/i })).toBeInTheDocument();

    await waitFor(() => {
      expect(window.location.pathname).toBe("/");
      expect(window.location.hash).toBe("#about");
    });
  });

  it("shows the recommendations cards and LinkedIn card links", () => {
    renderAtRoute("/");

    const recommendationsHeading = screen.getByRole("heading", { name: /received recommendations/i });
    const recommendationsSection = recommendationsHeading.closest("section");

    expect(recommendationsSection).not.toBeNull();
    expect(screen.queryByRole("link", { name: /visit linkedin/i })).not.toBeInTheDocument();

    recommendations.forEach((recommendation) => {
      const author = within(recommendationsSection as HTMLElement).getByText(recommendation.author);
      const cardLink = author.closest("a");

      expect(cardLink).not.toBeNull();
      expect(cardLink).toHaveAttribute("href", LINKEDIN_PROFILE_URL);
    });
  });
});
