import type {
  KnowledgeEntityArchived,
  KnowledgeEntityCreated,
  KnowledgeEntityUpdated,
} from "@forge/contracts";
import { now } from "@forge/kernel";

import type { KnowledgeEntity } from "./knowledge-entity";

/** Build the contract event emitted when an entity is created. */
export function knowledgeEntityCreated(
  entity: KnowledgeEntity,
): KnowledgeEntityCreated {
  return {
    type: "knowledge.entity.created",
    occurredAt: now(),
    entityId: entity.id,
    entityType: entity.type,
    name: entity.name.value,
    slug: entity.slug.value,
    status: entity.status,
  };
}

/** Build the contract event emitted when an entity is updated. */
export function knowledgeEntityUpdated(
  entity: KnowledgeEntity,
): KnowledgeEntityUpdated {
  return {
    type: "knowledge.entity.updated",
    occurredAt: now(),
    entityId: entity.id,
    name: entity.name.value,
    slug: entity.slug.value,
    status: entity.status,
  };
}

/** Build the contract event emitted when an entity is archived. */
export function knowledgeEntityArchived(
  entity: KnowledgeEntity,
): KnowledgeEntityArchived {
  return {
    type: "knowledge.entity.archived",
    occurredAt: now(),
    entityId: entity.id,
  };
}
