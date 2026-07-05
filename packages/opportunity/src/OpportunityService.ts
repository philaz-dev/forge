import type { Opportunity } from "./Opportunity";
import { OpportunityScore } from "./OpportunityScore";

/**
 * Analyzes business opportunities.
 *
 * Sprint 002 MVP: the analysis is entirely mocked — no AI, SEO APIs, scraping,
 * or database. A later sprint replaces the mock with a real analysis pipeline
 * behind this same interface.
 */
export class OpportunityService {
  analyze(query: string): Opportunity {
    return {
      query: query.trim(),
      score: OpportunityScore.create(84),
      seoDifficulty: "Medium",
      commercialIntent: "High",
      affiliatePrograms: 12,
      estimatedRevenue: {
        currency: "€",
        min: 8000,
        max: 15000,
        period: "month",
      },
      recommendation: "Launch this niche.",
    };
  }
}
