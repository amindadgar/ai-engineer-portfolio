import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import CountUp from "@/components/CountUp";
import Reveal from "@/components/Reveal";

const placeAt = (el: HTMLElement, top: number) => {
  el.getBoundingClientRect = () => ({ top, bottom: top + 100 }) as DOMRect;
};

describe("Reveal", () => {
  it("shows content once it reaches the viewport, including sections skipped by a jump", async () => {
    render(
      <>
        <Reveal>Passed</Reveal>
        <Reveal>Below</Reveal>
      </>,
    );
    const passed = screen.getByText("Passed");
    const below = screen.getByText("Below");
    // As if the visitor jumped straight past the first section: it is above the viewport, never seen on screen.
    placeAt(passed, -2000);
    placeAt(below, 3000);

    act(() => {
      fireEvent.scroll(window);
    });
    await waitFor(() => expect(passed).toHaveAttribute("data-shown"));
    expect(below).not.toHaveAttribute("data-shown");

    placeAt(below, 200);
    act(() => {
      fireEvent.scroll(window);
    });
    await waitFor(() => expect(below).toHaveAttribute("data-shown"));
  });
});

describe("CountUp", () => {
  it("counts up to the final value and gives screen readers the final value immediately", async () => {
    render(<CountUp value="55+" duration={50} />);
    expect(screen.getByText("55+", { selector: ".sr-only" })).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText("55+", { selector: "[aria-hidden]" })).toBeInTheDocument());
  });

  it("leaves non-numeric values as they are", () => {
    render(<CountUp value="E2E" />);
    expect(screen.getByText("E2E")).toBeInTheDocument();
  });
});
