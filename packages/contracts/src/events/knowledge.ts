import type { DomainEventBase } from "./base";

/** Emitted when a new knowledge entity has been created. */
export interface KnowledgeEntityCreated extends DomainEventBase {
  type: "knowledge.entity.created";
  entityId: string;
  entityType: string;
  name: string;
  slug: string;
  status: string;
}

/** Emitted when a knowledge entity's attributes have changed. */
export interface KnowledgeEntityUpdated extends DomainEventBase {
  type: "knowledge.entity.updated";
  entityId: string;
  name: string;
  slug: string;
  status: string;
}

/** Emitted when a knowledge entity has been archived. */
export interface KnowledgeEntityArchived extends DomainEventBase {
  type: "knowledge.entity.archived";
  entityId: string;
}
