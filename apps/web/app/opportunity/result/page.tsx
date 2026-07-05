import { OpportunityService } from "@forge/opportunity";

function formatRevenue(revenue: {
  currency: string;
  min: number;
  max: number;
  period: string;
}): string {
  const amount = (value: number) => `${revenue.currency}${value.toLocaleString("en-US")}`;
  return `${amount(revenue.min)} - ${amount(revenue.max)} / ${revenue.period}`;
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium">{value}</dd>
    </div>
  );
}

export default async function OpportunityResultPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const opportunity = new OpportunityService().analyze(q ?? "");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <section className="w-full max-w-md rounded-lg border border-border bg-background p-6 shadow-sm">
        <h1 className="text-xl font-semibold tracking-tight">
          Opportunity analysis
        </h1>
        {opportunity.query ? (
          <p className="mt-1 text-sm text-muted-foreground">
            for “{opportunity.query}”
          </p>
        ) : null}

        <dl className="mt-6 flex flex-col gap-3">
          <Metric
            label="Opportunity Score"
            value={String(opportunity.score.value)}
          />
          <Metric label="SEO Difficulty" value={opportunity.seoDifficulty} />
          <Metric
            label="Commercial Intent"
            value={opportunity.commercialIntent}
          />
          <Metric
            label="Affiliate Programs"
            value={String(opportunity.affiliatePrograms)}
          />
          <Metric
            label="Estimated Revenue"
            value={formatRevenue(opportunity.estimatedRevenue)}
          />
        </dl>

        <div className="mt-6 border-t border-border pt-4">
          <p className="text-sm text-muted-foreground">Recommendation</p>
          <p className="mt-1 text-base font-semibold">
            {opportunity.recommendation}
          </p>
        </div>
      </section>
    </main>
  );
}
