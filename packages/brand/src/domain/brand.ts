import { ValidationError, type Id, type IsoTimestamp } from "@forge/kernel";

import { assertTransition, type BrandStatus } from "./brand-status";

/**
 * A content brand owned by a Forge user. All fields are plain values; the
 * brand is the first business object created after validating an opportunity.
 */
export interface Brand {
  readonly id: Id;
  readonly name: string;
  readonly slug: string;
  readonly domain?: string;
  readonly country: string;
  readonly language: string;
  readonly businessModel: string;
  readonly audience: string;
  readonly status: BrandStatus;
  readonly createdAt: IsoTimestamp;
  readonly updatedAt: IsoTimestamp;
}

export interface CreateBrandInput {
  name: string;
  domain?: string;
  country?: string;
  language?: string;
  businessModel?: string;
  audience?: string;
}

export interface UpdateBrandChanges {
  name?: string;
  domain?: string;
  country?: string;
  language?: string;
  businessModel?: string;
  audience?: string;
  status?: BrandStatus;
}

function normalizeText(value: string | undefined): string {
  return value?.trim().replace(/\s+/g, " ") ?? "";
}

function normalizeDomain(value: string | undefined): string | undefined {
  const trimmed = value?.trim().toLowerCase();
  return trimmed && trimmed.length > 0 ? trimmed : undefined;
}

/** Validate and normalize a brand name (the only required field). */
export function normalizeName(name: string): string {
  const normalized = normalizeText(name);
  if (normalized.length === 0) {
    throw new ValidationError("Brand name is required");
  }
  return normalized;
}

/** Assemble a new brand. The slug is resolved by the service (uniqueness). */
export function createBrandEntity(
  input: CreateBrandInput,
  meta: { id: Id; slug: string; timestamp: IsoTimestamp },
): Brand {
  return {
    id: meta.id,
    name: normalizeName(input.name),
    slug: meta.slug,
    domain: normalizeDomain(input.domain),
    country: normalizeText(input.country),
    language: normalizeText(input.language),
    businessModel: normalizeText(input.businessModel),
    audience: normalizeText(input.audience),
    status: "Draft",
    createdAt: meta.timestamp,
    updatedAt: meta.timestamp,
  };
}

/** Return a copy of the brand with the given changes applied. */
export function updateBrandEntity(
  brand: Brand,
  changes: UpdateBrandChanges,
  timestamp: IsoTimestamp,
): Brand {
  if (brand.status === "Archived") {
    throw new ValidationError("Cannot update an archived brand");
  }
  const status = changes.status ?? brand.status;
  if (status !== brand.status) {
    assertTransition(brand.status, status);
  }
  return {
    ...brand,
    name: changes.name !== undefined ? normalizeName(changes.name) : brand.name,
    domain:
      changes.domain !== undefined ? normalizeDomain(changes.domain) : brand.domain,
    country:
      changes.country !== undefined ? normalizeText(changes.country) : brand.country,
    language:
      changes.language !== undefined
        ? normalizeText(changes.language)
        : brand.language,
    businessModel:
      changes.businessModel !== undefined
        ? normalizeText(changes.businessModel)
        : brand.businessModel,
    audience:
      changes.audience !== undefined
        ? normalizeText(changes.audience)
        : brand.audience,
    status,
    updatedAt: timestamp,
  };
}

/** Return an archived copy of the brand. */
export function archiveBrandEntity(brand: Brand, timestamp: IsoTimestamp): Brand {
  assertTransition(brand.status, "Archived");
  return { ...brand, status: "Archived", updatedAt: timestamp };
}
