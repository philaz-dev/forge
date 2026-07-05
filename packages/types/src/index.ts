/**
 * Shared TypeScript types for the Forge platform.
 *
 * Concrete domain types are added in later sprints; this package establishes
 * the shared vocabulary used across apps and packages.
 */

/** Opaque identifier for a persisted entity. */
export type Id = string;

/** Standard audit timestamps carried by persisted entities. */
export interface Timestamps {
  createdAt: Date;
  updatedAt: Date;
}
