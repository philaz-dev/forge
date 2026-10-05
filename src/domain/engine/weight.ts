import {
  diffDays,
  addMonths,
  formatMonthYear,
  type ISODate,
} from "@/lib/dates";
import type { WeightPoint } from "@/domain/types";

export interface WeightDelta {
  delta: number;
  pct: number;
  from: WeightPoint;
  to: WeightPoint;
  /** Mois réellement écoulés entre les deux pesées retenues. */
  months: number;
}

export const latestPoint = (w: WeightPoint[]): WeightPoint =>
  w[w.length - 1] as WeightPoint;

/**
 * Variation entre la dernière pesée et la pesée la plus proche de
 * « dernière date − `months` mois ». Retourne `null` si aucune pesée n'est
 * suffisamment proche (tolérance : 40 % de la fenêtre, 4 mois minimum).
 */
export function weightDelta(
  weights: WeightPoint[],
  months: number,
): WeightDelta | null {
  if (weights.length < 2) return null;
  const to = latestPoint(weights);
  const target: ISODate = addMonths(to.date, -months);
  let best: WeightPoint | null = null;
  let bestGap = Infinity;
  for (const p of weights) {
    if (p.date >= to.date) continue;
    const gap = Math.abs(diffDays(target, p.date));
    if (gap < bestGap) {
      best = p;
      bestGap = gap;
    }
  }
  const tolerance = Math.max(4, months * 0.4) * 30.4375;
  if (!best || bestGap > tolerance) return null;
  const delta = Math.round((to.kg - best.kg) * 10) / 10;
  return {
    delta,
    pct: (delta / best.kg) * 100,
    from: best,
    to,
    months: Math.round(diffDays(best.date, to.date) / 30.4375),
  };
}

/** Seuil d'attention : ≥ 5 % d'évolution sur ~18 mois (valeur absolue). */
export const WEIGHT_WATCH_PCT = 5;
export const WEIGHT_WATCH_WINDOW = 18;
/** Variation minimale en kg pour éviter le bruit de pesée (petits gabarits). */
const MIN_KG = { chien: 1.0, chat: 0.7 } as const;

/**
 * Détecte une évolution de poids « à surveiller ». Les animaux de moins de
 * 24 mois sont exclus : la prise de poids y est normale (croissance).
 */
export function weightWatch(
  weights: WeightPoint[],
  ctx: { species: "chien" | "chat"; ageMonths: number },
): WeightDelta | null {
  if (ctx.ageMonths < 24) return null;
  const d = weightDelta(weights, WEIGHT_WATCH_WINDOW);
  if (!d) return null;
  return Math.abs(d.pct) >= WEIGHT_WATCH_PCT &&
    Math.abs(d.delta) >= MIN_KG[ctx.species]
    ? d
    : null;
}

export const sinceLabel = (p: WeightPoint) =>
  `depuis ${formatMonthYear(p.date)}`;
