import { ValidationError } from "@forge/kernel";

const MIN_SCORE = 0;
const MAX_SCORE = 100;

/** A value object for an opportunity score, constrained to 0–100. */
export class OpportunityScore {
  private constructor(public readonly value: number) {}

  static create(value: number): OpportunityScore {
    if (!Number.isInteger(value)) {
      throw new ValidationError("Opportunity score must be an integer");
    }
    if (value < MIN_SCORE || value > MAX_SCORE) {
      throw new ValidationError(
        `Opportunity score must be between ${MIN_SCORE} and ${MAX_SCORE}`,
      );
    }
    return new OpportunityScore(value);
  }

  equals(other: OpportunityScore): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return String(this.value);
  }
}
