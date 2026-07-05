import type { Id, IsoTimestamp } from "@forge/kernel";

import type { EntityStatus } from "./entity-status";
import type { EntityType } from "./entity-type";
import type { KnowledgeEntity } from "./knowledge-entity";

/**
 * A plain, serializable view of a knowledge entity. Value objects are unwrapped
 * to primitives so the entity can safely cross the package boundary.
 */
export interface KnowledgeEntitySnapshot {
  id: Id;
  type: EntityType;
  name: string;
  slug: string;
  aliases: string[];
  source: string;
  status: EntityStatus;
  createdAt: IsoTimestamp;
  updatedAt: IsoTimestamp;
}

export function toSnapshot(entity: KnowledgeEntity): KnowledgeEntitySnapshot {
  return {
    id: entity.id,
    type: entity.type,
    name: entity.name.value,
    slug: entity.slug.value,
    aliases: entity.aliases.map((alias) => alias.value),
    source: entity.source.value,
    status: entity.status,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
  };
}
