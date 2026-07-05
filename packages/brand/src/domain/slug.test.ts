import { describe, expect, it } from "vitest";

import { slugify, uniqueSlug } from "./slug";

describe("slugify", () => {
  it("lowercases and hyphenates", () => {
    expect(slugify("My Coffee Brand")).toBe("my-coffee-brand");
  });

  it("collapses punctuation and trims separators", () => {
    expect(slugify("  Acme, Inc.! ")).toBe("acme-inc");
  });

  it("strips diacritics", () => {
    expect(slugify("Café Déjà")).toBe("cafe-deja");
  });

  it("returns empty when there are no alphanumerics", () => {
    expect(slugify("!!!")).toBe("");
  });
});

describe("uniqueSlug", () => {
  it("returns the base when it is free", () => {
    expect(uniqueSlug("acme", new Set())).toBe("acme");
  });

  it("suffixes the next available number when taken", () => {
    expect(uniqueSlug("acme", new Set(["acme"]))).toBe("acme-2");
    expect(uniqueSlug("acme", new Set(["acme", "acme-2"]))).toBe("acme-3");
  });
});
