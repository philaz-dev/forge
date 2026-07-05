import type { OpportunityScore } from "./OpportunityScore";

export type SeoDifficulty = "Low" | "Medium" | "High";
export type CommercialIntent = "Low" | "Medium" | "High";

/** A monthly revenue estimate expressed as a range. */
export interface EstimatedRevenue {
  currency: string;
  min: number;
  max: number;
  period: string;
}

/** The result of analyzing a business opportunity. */
export interface Opportunity {
  query: string;
  score: OpportunityScore;
  seoDifficulty: SeoDifficulty;
  commercialIntent: CommercialIntent;
  affiliatePrograms: number;
  estimatedRevenue: EstimatedRevenue;
  recommendation: string;
}
