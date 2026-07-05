import { describe, expect, it } from "vitest";

import { OpportunityService } from "./OpportunityService";

describe("OpportunityService", () => {
  const service = new OpportunityService();

  it("returns the mocked analysis card values", () => {
    const result = service.analyze("vegan protein powder");

    expect(result.score.value).toBe(84);
    expect(result.seoDifficulty).toBe("Medium");
    expect(result.commercialIntent).toBe("High");
    expect(result.affiliatePrograms).toBe(12);
    expect(result.estimatedRevenue).toEqual({
      currency: "€",
      min: 8000,
      max: 15000,
      period: "month",
    });
    expect(result.recommendation).toBe("Launch this niche.");
  });

  it("echoes the trimmed query it analyzed", () => {
    expect(service.analyze("  coffee subscriptions  ").query).toBe(
      "coffee subscriptions",
    );
  });

  it("returns the same mocked data regardless of the query", () => {
    expect(service.analyze("a").score.value).toBe(
      service.analyze("b").score.value,
    );
  });
});
