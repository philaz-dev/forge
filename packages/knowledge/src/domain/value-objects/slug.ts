import { ValidationError } from "@forge/kernel";

const MAX_LENGTH = 120;
const COMBINING_MARKS = /[̀-ͯ]/g;
const NON_ALPHANUMERIC = /[^a-z0-9]+/g;
const EDGE_HYPHENS = /^-+|-+$/g;

function normalize(raw: string): string {
  return raw
    .normalize("NFKD")
    .replace(COMBINING_MARKS, "")
    .toLowerCase()
    .trim()
    .replace(NON_ALPHANUMERIC, "-")
    .replace(EDGE_HYPHENS, "");
}

/** A URL-safe, normalized identifier derived from a human-readable name. */
export class Slug {
  private constructor(public readonly value: string) {}

  static create(raw: string): Slug {
    const normalized = normalize(raw);
    if (normalized.length === 0) {
      throw new ValidationError("Slug cannot be empty");
    }
    if (normalized.length > MAX_LENGTH) {
      throw new ValidationError(`Slug cannot exceed ${MAX_LENGTH} characters`);
    }
    return new Slug(normalized);
  }

  equals(other: Slug): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
