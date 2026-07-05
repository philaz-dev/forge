import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { pushMock } = vi.hoisted(() => ({ pushMock: vi.fn() }));
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

import HomePage from "./page";

beforeEach(() => {
  pushMock.mockClear();
});

describe("HomePage (opportunity scanner)", () => {
  it("asks what opportunity to explore", () => {
    render(<HomePage />);
    expect(
      screen.getByRole("heading", {
        name: "What business opportunity do you want to explore?",
      }),
    ).toBeInTheDocument();
  });

  it("disables Scan until text is entered", () => {
    render(<HomePage />);
    expect(screen.getByRole("button", { name: "Scan" })).toBeDisabled();
  });

  it("navigates to the result page on scan", () => {
    render(<HomePage />);
    fireEvent.change(screen.getByLabelText("Business opportunity"), {
      target: { value: "vegan protein" },
    });
    const scan = screen.getByRole("button", { name: "Scan" });
    expect(scan).toBeEnabled();
    fireEvent.click(scan);
    expect(pushMock).toHaveBeenCalledWith(
      "/opportunity/result?q=vegan%20protein",
    );
  });

  it("does not navigate for whitespace-only input", () => {
    render(<HomePage />);
    fireEvent.change(screen.getByLabelText("Business opportunity"), {
      target: { value: "   " },
    });
    fireEvent.click(screen.getByRole("button", { name: "Scan" }));
    expect(pushMock).not.toHaveBeenCalled();
  });
});
