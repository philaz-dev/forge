import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import BrandsPage from "./page";

describe("BrandsPage", () => {
  it("shows the Brands header and empty state", () => {
    render(<BrandsPage />);
    expect(screen.getByRole("heading", { name: "Brands" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "+ Create Brand" }),
    ).toBeInTheDocument();
    expect(screen.getByText("No brands yet.")).toBeInTheDocument();
  });

  it("creates a brand through the dialog and shows its card", () => {
    render(<BrandsPage />);

    fireEvent.click(screen.getByRole("button", { name: "+ Create Brand" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "My Coffee Brand" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "My Coffee Brand" }),
    ).toBeInTheDocument();
    expect(screen.getByText("/my-coffee-brand")).toBeInTheDocument();
    expect(screen.getByText("Draft")).toBeInTheDocument();
  });

  it("keeps Save disabled until a name is entered", () => {
    render(<BrandsPage />);
    fireEvent.click(screen.getByRole("button", { name: "+ Create Brand" }));
    expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();
  });
});
