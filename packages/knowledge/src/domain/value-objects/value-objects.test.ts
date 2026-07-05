import { describe, expect, it } from "vitest";

import { ValidationError } from "@forge/kernel";

import { EntityName } from "./entity-name";
import { KnowledgeSource } from "./knowledge-source";

describe("EntityName", () => {
  it("normalizes internal whitespace", () => {
    expect(EntityName.create("  Acme   Corporation ").value).toBe(
      "Acme Corporation",
    );
  });

  it("rejects an empty name", () => {
    expect(() => EntityName.create("   ")).toThrow(ValidationError);
  });

  it("rejects a name that is too long", () => {
    expect(() => EntityName.create("a".repeat(201))).toThrow(ValidationError);
  });
});

describe("KnowledgeSource", () => {
  it("normalizes to lowercase", () => {
    expect(KnowledgeSource.create("  Manual ").value).toBe("manual");
  });

  it("exposes a manual default", () => {
    expect(KnowledgeSource.manual().value).toBe("manual");
  });

  it("rejects an empty source", () => {
    expect(() => KnowledgeSource.create("")).toThrow(ValidationError);
  });
});
