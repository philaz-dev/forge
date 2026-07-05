/** The kinds of business entity the Knowledge domain can own. */
export const ENTITY_TYPES = [
  "COMPANY",
  "PRODUCT",
  "CATEGORY",
  "AFFILIATE_PROGRAM",
] as const;

export type EntityType = (typeof ENTITY_TYPES)[number];

/** Type guard for untyped input (e.g. deserialized payloads). */
export function isEntityType(value: string): value is EntityType {
  return (ENTITY_TYPES as readonly string[]).includes(value);
}
