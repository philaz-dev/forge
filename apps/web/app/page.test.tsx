import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import HomePage from "./page";

describe("HomePage", () => {
  it("renders the Forge heading", () => {
    render(<HomePage />);
    expect(
      screen.getByRole("heading", { name: "Forge" }),
    ).toBeInTheDocument();
  });

  it("shows the empty brand state", () => {
    render(<HomePage />);
    expect(screen.getByText("No Brand yet")).toBeInTheDocument();
  });

  it("renders the Create Brand button", () => {
    render(<HomePage />);
    expect(
      screen.getByRole("button", { name: "Create Brand" }),
    ).toBeInTheDocument();
  });
});
