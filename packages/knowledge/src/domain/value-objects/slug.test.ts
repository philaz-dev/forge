import { describe, expect, it } from "vitest";

import { ValidationError } from "@forge/kernel";

import { Slug } from "./slug";

describe("Slug", () => {
  it("lowercases and hyphenates a name", () => {
    expect(Slug.create("Acme Corporation").value).toBe("acme-corporation");
  });

  it("collapses punctuation and repeated separators", () => {
    expect(Slug.create("Acme,   Inc.").value).toBe("acme-inc");
  });

  it("trims leading and trailing separators", () => {
    expect(Slug.create("  --Hello World--  ").value).toBe("hello-world");
  });

  it("strips diacritics", () => {
    expect(Slug.create("Café Déjà").value).toBe("cafe-deja");
  });

  it("throws when nothing remains after normalization", () => {
    expect(() => Slug.create("!!!")).toThrow(ValidationError);
  });

  it("throws on an empty string", () => {
    expect(() => Slug.create("   ")).toThrow(ValidationError);
  });

  it("compares by value", () => {
    expect(Slug.create("Acme").equals(Slug.create("acme"))).toBe(true);
  });
});
