import type {
  KnowledgeEntityArchived,
  KnowledgeEntityCreated,
  KnowledgeEntityUpdated,
} from "@forge/contracts";
import { ValidationError } from "@forge/kernel";

import {
  knowledgeEntityArchived,
  knowledgeEntityCreated,
  knowledgeEntityUpdated,
} from "../domain/events";
import {
  archiveEntity,
  createEntity,
  updateEntity,
  type CreateKnowledgeEntityInput,
  type KnowledgeEntity,
  type UpdateKnowledgeEntityChanges,
} from "../domain/knowledge-entity";
import { toSnapshot, type KnowledgeEntitySnapshot } from "../domain/snapshot";
import { Slug } from "../domain/value-objects/slug";

/** The result of a mutation: the new state plus the event to publish. */
export interface KnowledgeMutationResult<TEvent> {
  entity: KnowledgeEntitySnapshot;
  event: TEvent;
}

/** The public API of the Knowledge domain. */
export interface KnowledgeModule {
  createKnowledgeEntity(
    input: CreateKnowledgeEntityInput,
  ): KnowledgeMutationResult<KnowledgeEntityCreated>;
  updateKnowledgeEntity(
    id: string,
    changes: UpdateKnowledgeEntityChanges,
  ): KnowledgeMutationResult<KnowledgeEntityUpdated>;
  archiveKnowledgeEntity(
    id: string,
  ): KnowledgeMutationResult<KnowledgeEntityArchived>;
  findBySlug(slug: string): KnowledgeEntitySnapshot | null;
}

/**
 * Compose the Knowledge domain over an in-memory collection.
 *
 * The collection is an implementation detail: a persistent adapter can replace
 * it later without changing the domain or this API.
 */
export function createKnowledgeModule(): KnowledgeModule {
  const entities = new Map<string, KnowledgeEntity>();

  function requireEntity(id: string): KnowledgeEntity {
    const entity = entities.get(id);
    if (!entity) {
      throw new ValidationError(`Knowledge entity not found: ${id}`);
    }
    return entity;
  }

  return {
    createKnowledgeEntity(input) {
      const entity = createEntity(input);
      entities.set(entity.id, entity);
      return { entity: toSnapshot(entity), event: knowledgeEntityCreated(entity) };
    },

    updateKnowledgeEntity(id, changes) {
      const updated = updateEntity(requireEntity(id), changes);
      entities.set(updated.id, updated);
      return { entity: toSnapshot(updated), event: knowledgeEntityUpdated(updated) };
    },

    archiveKnowledgeEntity(id) {
      const archived = archiveEntity(requireEntity(id));
      entities.set(archived.id, archived);
      return { entity: toSnapshot(archived), event: knowledgeEntityArchived(archived) };
    },

    findBySlug(slug) {
      const target = Slug.create(slug).value;
      for (const entity of entities.values()) {
        if (entity.slug.value === target) {
          return toSnapshot(entity);
        }
      }
      return null;
    },
  };
}
