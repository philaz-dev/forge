/**
 * @forge/knowledge — the Knowledge domain.
 *
 * The public surface is the four Knowledge operations, exposed through a module
 * factory that owns the entity collection. Domain internals (entities, value
 * objects, event builders) stay private to keep the boundary small.
 */

export { createKnowledgeModule } from "./application/knowledge-module";
export type {
  KnowledgeModule,
  KnowledgeMutationResult,
} from "./application/knowledge-module";

export type {
  CreateKnowledgeEntityInput,
  UpdateKnowledgeEntityChanges,
} from "./domain/knowledge-entity";
export type { KnowledgeEntitySnapshot } from "./domain/snapshot";
export type { EntityType } from "./domain/entity-type";
export type { EntityStatus } from "./domain/entity-status";
