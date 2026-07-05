import {
  ValidationError,
  generateId,
  now,
  type Id,
  type IsoTimestamp,
} from "@forge/kernel";

import { assertTransition, type EntityStatus } from "./entity-status";
import { isEntityType, type EntityType } from "./entity-type";
import { EntityName } from "./value-objects/entity-name";
import { KnowledgeSource } from "./value-objects/knowledge-source";
import { Slug } from "./value-objects/slug";

/**
 * A single business entity known by Forge. All knowledge entities share this
 * shape regardless of their type — there is no inheritance.
 */
export interface KnowledgeEntity {
  readonly id: Id;
  readonly type: EntityType;
  readonly name: EntityName;
  readonly slug: Slug;
  readonly aliases: readonly EntityName[];
  readonly source: KnowledgeSource;
  readonly status: EntityStatus;
  readonly createdAt: IsoTimestamp;
  readonly updatedAt: IsoTimestamp;
}

export interface CreateKnowledgeEntityInput {
  type: EntityType;
  name: string;
  /** Optional; derived from `name` when omitted. */
  slug?: string;
  aliases?: string[];
  source: string;
  /** Optional; defaults to `DRAFT`. */
  status?: EntityStatus;
}

export interface UpdateKnowledgeEntityChanges {
  name?: string;
  slug?: string;
  aliases?: string[];
  source?: string;
  status?: EntityStatus;
}

function toAliases(raw: readonly string[]): EntityName[] {
  return raw.map((alias) => EntityName.create(alias));
}

/** Build a valid knowledge entity from raw input. */
export function createEntity(input: CreateKnowledgeEntityInput): KnowledgeEntity {
  if (!isEntityType(input.type)) {
    throw new ValidationError(`Unknown knowledge entity type: ${input.type}`);
  }
  const timestamp = now();
  return {
    id: generateId(),
    type: input.type,
    name: EntityName.create(input.name),
    slug: Slug.create(input.slug ?? input.name),
    aliases: toAliases(input.aliases ?? []),
    source: KnowledgeSource.create(input.source),
    status: input.status ?? "DRAFT",
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

/** Return a copy of the entity with the given changes applied. */
export function updateEntity(
  entity: KnowledgeEntity,
  changes: UpdateKnowledgeEntityChanges,
): KnowledgeEntity {
  if (entity.status === "ARCHIVED") {
    throw new ValidationError("Cannot update an archived knowledge entity");
  }
  const status = changes.status ?? entity.status;
  if (status !== entity.status) {
    assertTransition(entity.status, status);
  }
  return {
    ...entity,
    name: changes.name !== undefined ? EntityName.create(changes.name) : entity.name,
    slug: changes.slug !== undefined ? Slug.create(changes.slug) : entity.slug,
    aliases:
      changes.aliases !== undefined ? toAliases(changes.aliases) : entity.aliases,
    source:
      changes.source !== undefined
        ? KnowledgeSource.create(changes.source)
        : entity.source,
    status,
    updatedAt: now(),
  };
}

/** Return an archived copy of the entity. */
export function archiveEntity(entity: KnowledgeEntity): KnowledgeEntity {
  assertTransition(entity.status, "ARCHIVED");
  return { ...entity, status: "ARCHIVED", updatedAt: now() };
}
