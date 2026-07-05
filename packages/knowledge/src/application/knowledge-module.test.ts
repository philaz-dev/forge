import { beforeEach, describe, expect, it } from "vitest";

import { ValidationError } from "@forge/kernel";

import { createKnowledgeModule, type KnowledgeModule } from "./knowledge-module";

let knowledge: KnowledgeModule;

beforeEach(() => {
  knowledge = createKnowledgeModule();
});

describe("createKnowledgeEntity", () => {
  it("creates an entity with a derived slug and default DRAFT status", () => {
    const { entity, event } = knowledge.createKnowledgeEntity({
      type: "COMPANY",
      name: "Acme Corporation",
      source: "manual",
    });

    expect(entity.id).not.toHaveLength(0);
    expect(entity.type).toBe("COMPANY");
    expect(entity.slug).toBe("acme-corporation");
    expect(entity.status).toBe("DRAFT");
    expect(entity.createdAt).toBe(entity.updatedAt);
    expect(event.type).toBe("knowledge.entity.created");
    expect(event.entityId).toBe(entity.id);
  });

  it("keeps aliases and honors an explicit status", () => {
    const { entity } = knowledge.createKnowledgeEntity({
      type: "PRODUCT",
      name: "Widget",
      aliases: ["Widget Pro", "Widget X"],
      source: "manual",
      status: "ACTIVE",
    });

    expect(entity.aliases).toEqual(["Widget Pro", "Widget X"]);
    expect(entity.status).toBe("ACTIVE");
  });

  it("rejects an unknown entity type", () => {
    expect(() =>
      knowledge.createKnowledgeEntity({
        // @ts-expect-error — exercising the runtime guard
        type: "PLANET",
        name: "Mars",
        source: "manual",
      }),
    ).toThrow(ValidationError);
  });

  it("rejects an empty name", () => {
    expect(() =>
      knowledge.createKnowledgeEntity({
        type: "CATEGORY",
        name: "   ",
        source: "manual",
      }),
    ).toThrow(ValidationError);
  });
});

describe("findBySlug", () => {
  it("finds an entity by its normalized slug", () => {
    knowledge.createKnowledgeEntity({
      type: "CATEGORY",
      name: "Home Office",
      source: "manual",
    });

    expect(knowledge.findBySlug("Home Office")?.name).toBe("Home Office");
    expect(knowledge.findBySlug("home-office")?.slug).toBe("home-office");
  });

  it("returns null when nothing matches", () => {
    expect(knowledge.findBySlug("missing")).toBeNull();
  });
});

describe("updateKnowledgeEntity", () => {
  it("updates provided fields and leaves the rest untouched", () => {
    const created = knowledge.createKnowledgeEntity({
      type: "AFFILIATE_PROGRAM",
      name: "Amazon Associates",
      source: "manual",
    });

    const { entity, event } = knowledge.updateKnowledgeEntity(created.entity.id, {
      name: "Amazon Partner Program",
    });

    expect(entity.name).toBe("Amazon Partner Program");
    expect(entity.slug).toBe(created.entity.slug);
    expect(event.type).toBe("knowledge.entity.updated");
  });

  it("applies a valid status transition", () => {
    const created = knowledge.createKnowledgeEntity({
      type: "COMPANY",
      name: "Epsilon",
      source: "manual",
    });

    const { entity } = knowledge.updateKnowledgeEntity(created.entity.id, {
      status: "ACTIVE",
    });

    expect(entity.status).toBe("ACTIVE");
  });

  it("throws when the entity does not exist", () => {
    expect(() =>
      knowledge.updateKnowledgeEntity("nope", { name: "X" }),
    ).toThrow(ValidationError);
  });
});

describe("archiveKnowledgeEntity", () => {
  it("archives an active entity and emits an event", () => {
    const created = knowledge.createKnowledgeEntity({
      type: "COMPANY",
      name: "Acme",
      source: "manual",
      status: "ACTIVE",
    });

    const { entity, event } = knowledge.archiveKnowledgeEntity(created.entity.id);

    expect(entity.status).toBe("ARCHIVED");
    expect(event.type).toBe("knowledge.entity.archived");
  });

  it("archives a draft entity", () => {
    const created = knowledge.createKnowledgeEntity({
      type: "COMPANY",
      name: "Beta",
      source: "manual",
    });

    expect(
      knowledge.archiveKnowledgeEntity(created.entity.id).entity.status,
    ).toBe("ARCHIVED");
  });

  it("cannot archive an already archived entity", () => {
    const created = knowledge.createKnowledgeEntity({
      type: "COMPANY",
      name: "Gamma",
      source: "manual",
    });
    knowledge.archiveKnowledgeEntity(created.entity.id);

    expect(() =>
      knowledge.archiveKnowledgeEntity(created.entity.id),
    ).toThrow(ValidationError);
  });

  it("cannot update an archived entity", () => {
    const created = knowledge.createKnowledgeEntity({
      type: "COMPANY",
      name: "Delta",
      source: "manual",
    });
    knowledge.archiveKnowledgeEntity(created.entity.id);

    expect(() =>
      knowledge.updateKnowledgeEntity(created.entity.id, { name: "Delta 2" }),
    ).toThrow(ValidationError);
  });
});
