import { ValidationError } from "@forge/kernel";

const MAX_LENGTH = 200;

/** A non-empty, whitespace-normalized display name for a knowledge entity. */
export class EntityName {
  private constructor(public readonly value: string) {}

  static create(raw: string): EntityName {
    const normalized = raw.trim().replace(/\s+/g, " ");
    if (normalized.length === 0) {
      throw new ValidationError("Entity name cannot be empty");
    }
    if (normalized.length > MAX_LENGTH) {
      throw new ValidationError(`Entity name cannot exceed ${MAX_LENGTH} characters`);
    }
    return new EntityName(normalized);
  }

  equals(other: EntityName): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
