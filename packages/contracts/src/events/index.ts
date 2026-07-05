/**
 * Domain event contracts shared across Forge domains.
 *
 * These are placeholder examples for the foundation. Concrete events are added
 * as each domain is implemented.
 */

/** Fields carried by every domain event envelope. */
export interface DomainEventBase {
  /** ISO-8601 timestamp of when the event occurred. */
  occurredAt: string;
}

/** Emitted when a new brand has been created. */
export interface BrandCreated extends DomainEventBase {
  type: "brand.created";
  brandId: string;
  name: string;
}

/** Emitted when an existing brand has been updated. */
export interface BrandUpdated extends DomainEventBase {
  type: "brand.updated";
  brandId: string;
  name: string;
}

/** Union of all known domain events. */
export type DomainEvent = BrandCreated | BrandUpdated;
