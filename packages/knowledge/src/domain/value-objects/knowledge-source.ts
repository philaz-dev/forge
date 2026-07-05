import { ValidationError } from "@forge/kernel";

const MAX_LENGTH = 60;

/** The provenance of a knowledge entity (where Forge learned about it). */
export class KnowledgeSource {
  private constructor(public readonly value: string) {}

  static create(raw: string): KnowledgeSource {
    const normalized = raw.trim().toLowerCase();
    if (normalized.length === 0) {
      throw new ValidationError("Knowledge source cannot be empty");
    }
    if (normalized.length > MAX_LENGTH) {
      throw new ValidationError(`Knowledge source cannot exceed ${MAX_LENGTH} characters`);
    }
    return new KnowledgeSource(normalized);
  }

  /** The default source for entities entered by hand. */
  static manual(): KnowledgeSource {
    return KnowledgeSource.create("manual");
  }

  equals(other: KnowledgeSource): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
