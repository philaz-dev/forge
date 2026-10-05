import {
  TODAY,
  ageInMonths,
  diffDays,
  formatShort,
  monthsSince,
  relative,
  type ISODate,
} from "@/lib/dates";
import type { Animal, AnimalRow, AnimalStatus, Owner } from "@/domain/types";
import { isSenior, recommend } from "./recommendations";
import { latestPoint, weightWatch } from "./weight";

export function nextDue(a: Animal, today: ISODate = TODAY) {
  const items: { date: ISODate; label: string }[] = [
    { date: a.nextVaccineDue, label: "Rappel vaccin" },
    { date: a.nextParasiteDue, label: "Antiparasitaire" },
    { date: a.nextControlDue, label: "Contrôle annuel" },
  ];
  if (a.postOp && diffDays(today, a.postOp.followUpDue) >= -7)
    items.push({
      date: a.postOp.followUpDue,
      label: "Contrôle post-opératoire",
    });
  items.sort((x, y) => (x.date < y.date ? -1 : 1));
  return items[0] ?? null;
}

export function statusOf(a: Animal, today: ISODate = TODAY): AnimalStatus {
  if (a.postOp && diffDays(today, a.postOp.followUpDue) >= -7)
    return { key: "suivi", label: "Suivi en cours" };
  const nd = nextDue(a, today);
  const worst = Math.min(
    diffDays(today, a.nextVaccineDue),
    diffDays(today, a.nextParasiteDue),
  );
  if (worst < 0) return { key: "en_retard", label: "En retard" };
  if (worst <= 30 || (nd && diffDays(today, nd.date) <= 14))
    return { key: "bientot", label: "Échéance proche" };
  return { key: "a_jour", label: "À jour" };
}

export function toRow(
  animal: Animal,
  owner: Owner,
  today: ISODate = TODAY,
): AnimalRow {
  const recs = recommend(animal, today);
  const nd = nextDue(animal, today);
  const ageMonths = ageInMonths(animal.birthDate, today);
  const ww = weightWatch(animal.weights, {
    species: animal.species,
    ageMonths,
  });
  const commercial = recs.some(
    (r) => r.estimatedValue > 0 && r.kind !== "post_op",
  );
  return {
    animal,
    owner,
    ageMonths,
    isSenior: isSenior(animal, today),
    weight: latestPoint(animal.weights).kg,
    recs,
    topRec: recs[0] ?? null,
    status: statusOf(animal, today),
    nextDue: nd,
    weightWatch: !!ww,
    needsFollowUp:
      !!animal.pendingControl ||
      (!!animal.postOp && diffDays(today, animal.postOp.followUpDue) >= -7) ||
      !!ww,
    hasOpportunity: commercial,
    vaccineDue: diffDays(today, animal.nextVaccineDue) <= 30,
    monthsSinceVisit: monthsSince(animal.lastVisit, today),
  };
}

export const nextDueLabel = (nd: { date: ISODate; label: string } | null) =>
  nd ? `${nd.label} · ${formatShort(nd.date)}` : "—";
export const nextDueRelative = (nd: { date: ISODate; label: string } | null) =>
  nd ? relative(nd.date) : "";
