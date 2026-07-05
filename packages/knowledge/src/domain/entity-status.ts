import { ValidationError } from "@forge/kernel";

/** Lifecycle states of a knowledge entity. */
export const ENTITY_STATUSES = ["DRAFT", "ACTIVE", "ARCHIVED"] as const;

export type EntityStatus = (typeof ENTITY_STATUSES)[number];

const ALLOWED_TRANSITIONS: Record<EntityStatus, readonly EntityStatus[]> = {
  DRAFT: ["ACTIVE", "ARCHIVED"],
  ACTIVE: ["ARCHIVED"],
  ARCHIVED: [],
};

/** Whether a status may move directly from `from` to `to`. */
export function canTransition(from: EntityStatus, to: EntityStatus): boolean {
  return ALLOWED_TRANSITIONS[from].includes(to);
}

/** Enforce a status transition, throwing when it is not allowed. */
export function assertTransition(from: EntityStatus, to: EntityStatus): void {
  if (!canTransition(from, to)) {
    throw new ValidationError(
      `Cannot transition knowledge entity from ${from} to ${to}`,
    );
  }
}
