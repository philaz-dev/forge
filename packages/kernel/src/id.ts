/** Opaque identifier for a domain entity. */
export type Id = string;

/** Generate a new unique identifier. */
export function generateId(): Id {
  return crypto.randomUUID();
}
