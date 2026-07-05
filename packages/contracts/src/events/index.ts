/**
 * Domain event contracts shared across Forge domains.
 *
 * Each domain contributes its event definitions here so producers and
 * consumers share a single source of truth. The `DomainEvent` union is the
 * registry of every known event.
 */

import type { BrandCreated, BrandUpdated } from "./brand";
import type {
  KnowledgeEntityArchived,
  KnowledgeEntityCreated,
  KnowledgeEntityUpdated,
} from "./knowledge";

export * from "./base";
export * from "./brand";
export * from "./knowledge";

/** Union of all known domain events. */
export type DomainEvent =
  | BrandCreated
  | BrandUpdated
  | KnowledgeEntityCreated
  | KnowledgeEntityUpdated
  | KnowledgeEntityArchived;
