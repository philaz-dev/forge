import { ValidationError } from "@forge/kernel";

/** Lifecycle states of a brand. */
export const BRAND_STATUSES = ["Draft", "Active", "Archived"] as const;

export type BrandStatus = (typeof BRAND_STATUSES)[number];

const ALLOWED_TRANSITIONS: Record<BrandStatus, readonly BrandStatus[]> = {
  Draft: ["Active", "Archived"],
  Active: ["Archived"],
  Archived: [],
};

/** Whether a brand may move directly from `from` to `to`. */
export function canTransition(from: BrandStatus, to: BrandStatus): boolean {
  return ALLOWED_TRANSITIONS[from].includes(to);
}

/** Enforce a status transition, throwing when it is not allowed. */
export function assertTransition(from: BrandStatus, to: BrandStatus): void {
  if (!canTransition(from, to)) {
    throw new ValidationError(`Cannot transition brand from ${from} to ${to}`);
  }
}
