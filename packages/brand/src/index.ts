/**
 * @forge/brand — the Brand domain.
 *
 * The public surface is the BrandService (the five brand use-cases over an
 * in-memory store) plus the types callers need to drive it.
 */

export { BrandService } from "./application/brand-service";
export type {
  Brand,
  CreateBrandInput,
  UpdateBrandChanges,
} from "./domain/brand";
export type { BrandStatus } from "./domain/brand-status";
