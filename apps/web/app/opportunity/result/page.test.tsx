import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import OpportunityResultPage from "./page";

describe("OpportunityResultPage", () => {
  it("renders the mocked analysis card", async () => {
    const ui = await OpportunityResultPage({
      searchParams: Promise.resolve({ q: "vegan protein" }),
    });
    render(ui);

    expect(screen.getByText("Opportunity analysis")).toBeInTheDocument();
    expect(screen.getByText("84")).toBeInTheDocument();
    expect(screen.getByText("Medium")).toBeInTheDocument();
    expect(screen.getByText("High")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();
    expect(
      screen.getByText("€8,000 - €15,000 / month"),
    ).toBeInTheDocument();
    expect(screen.getByText("Launch this niche.")).toBeInTheDocument();
  });
});
