import type { DomainEventBase } from "./base";

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
