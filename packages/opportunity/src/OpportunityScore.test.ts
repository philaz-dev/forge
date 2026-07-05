import { describe, expect, it } from "vitest";

import { ValidationError } from "@forge/kernel";

import { OpportunityScore } from "./OpportunityScore";

describe("OpportunityScore", () => {
  it("accepts a value within 0–100", () => {
    expect(OpportunityScore.create(84).value).toBe(84);
    expect(OpportunityScore.create(0).value).toBe(0);
    expect(OpportunityScore.create(100).value).toBe(100);
  });

  it("rejects values below 0", () => {
    expect(() => OpportunityScore.create(-1)).toThrow(ValidationError);
  });

  it("rejects values above 100", () => {
    expect(() => OpportunityScore.create(101)).toThrow(ValidationError);
  });

  it("rejects non-integers", () => {
    expect(() => OpportunityScore.create(84.5)).toThrow(ValidationError);
  });

  it("compares by value", () => {
    expect(OpportunityScore.create(84).equals(OpportunityScore.create(84))).toBe(
      true,
    );
    expect(OpportunityScore.create(84).equals(OpportunityScore.create(50))).toBe(
      false,
    );
  });
});
