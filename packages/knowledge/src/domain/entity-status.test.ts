import { describe, expect, it } from "vitest";

import { ValidationError } from "@forge/kernel";

import { assertTransition, canTransition } from "./entity-status";

describe("entity-status transitions", () => {
  it("allows publishing and archiving a draft", () => {
    expect(canTransition("DRAFT", "ACTIVE")).toBe(true);
    expect(canTransition("DRAFT", "ARCHIVED")).toBe(true);
  });

  it("allows archiving an active entity", () => {
    expect(canTransition("ACTIVE", "ARCHIVED")).toBe(true);
  });

  it("forbids any transition out of archived", () => {
    expect(canTransition("ARCHIVED", "ACTIVE")).toBe(false);
    expect(canTransition("ARCHIVED", "DRAFT")).toBe(false);
    expect(canTransition("ARCHIVED", "ARCHIVED")).toBe(false);
  });

  it("throws on a forbidden transition", () => {
    expect(() => assertTransition("ARCHIVED", "ACTIVE")).toThrow(ValidationError);
  });
});
