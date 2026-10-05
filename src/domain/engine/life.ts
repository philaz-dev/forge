import {
  TODAY,
  ageLabel,
  diffDays,
  formatShort,
  relative,
  year,
  type ISODate,
} from "@/lib/dates";
import type { Animal, AnimalRow, Appointment, RecKind } from "@/domain/types";

export interface LifeItem {
  id: string;
  date: ISODate;
  year: number;
  title: string;
  text: string;
  kind:
    "birth" | "consult" | "vaccine" | "check" | "analysis" | "surgery" | "last";
}

/**
 * « La vie d'Oslo » : une sélection de moments marquants, formulés pour le
 * propriétaire (naissance, première visite, vaccins clés, bilans…).
 */
export function lifeTimeline(a: Animal): LifeItem[] {
  const items: LifeItem[] = [
    {
      id: "birth",
      date: a.birthDate,
      year: year(a.birthDate),
      title: "Naissance",
      text: `${a.name} vient au monde.`,
      kind: "birth",
    },
  ];
  const hist = [...a.history].sort((x, y) => (x.date < y.date ? -1 : 1));
  const add = (i: Omit<LifeItem, "year">) => {
    if (!items.some((x) => x.id === i.id))
      items.push({ ...i, year: year(i.date) });
  };

  const first = hist.find((e) => e.title === "Première consultation");
  if (first)
    add({
      id: first.id,
      date: first.date,
      title: "Première consultation",
      text: `${a.name} fait connaissance avec la clinique.`,
      kind: "consult",
    });

  const annual = [...a.vaccinations]
    .reverse()
    .find((v) => !v.name.includes("primo"));
  if (annual)
    add({
      id: annual.id,
      date: annual.date,
      title: "Vaccination",
      text: "Premier rappel annuel : la protection suit son rythme.",
      kind: "vaccine",
    });

  const control = hist.find(
    (e) => e.type === "controle" && !/dentaire/i.test(e.title),
  );
  if (control)
    add({
      id: control.id,
      date: control.date,
      title: "Contrôle annuel",
      text: "Un point complet pour s'assurer que tout va bien.",
      kind: "check",
    });

  for (const e of hist.filter((h) => h.type === "analyse"))
    add({
      id: e.id,
      date: e.date,
      title: "Analyse sanguine",
      text: "Un bilan complet pour faire le point en profondeur.",
      kind: "analysis",
    });

  for (const e of hist.filter(
    (h) =>
      h.type === "intervention" && !/castration|stérilisation/i.test(h.title),
  ))
    add({
      id: e.id,
      date: e.date,
      title: e.title,
      text: "Une intervention, un suivi attentif de toute l'équipe.",
      kind: "surgery",
    });

  const lastV = a.vaccinations[0];
  if (lastV && lastV.id !== annual?.id)
    add({
      id: lastV.id,
      date: lastV.date,
      title: "Vaccination",
      text: "La protection est à jour.",
      kind: "vaccine",
    });

  const last = [...hist]
    .reverse()
    .find((e) => e.type === "consultation" || e.type === "controle");
  if (last && last.date >= (lastV?.date ?? "0000"))
    add({
      id: last.id,
      date: last.date,
      title: "Dernière consultation",
      text: "Notre dernière rencontre.",
      kind: "last",
    });

  return items.sort((x, y) => (x.date < y.date ? -1 : x.date > y.date ? 1 : 0));
}

export interface UpcomingItem {
  id: string;
  date: ISODate;
  when: string;
  title: string;
  text: string;
  kind: "parasite" | "vaccine" | "check" | "appointment" | "postop";
}

export function upcoming(
  row: AnimalRow,
  appointments: Appointment[],
  limit = 4,
): UpcomingItem[] {
  const a = row.animal;
  const out: UpcomingItem[] = [
    {
      id: "par",
      date: a.nextParasiteDue,
      when: "",
      title: "Antiparasitaire",
      text: "Renouvelez la protection de " + a.name + ".",
      kind: "parasite",
    },
    {
      id: "vac",
      date: a.nextVaccineDue,
      when: "",
      title: "Vaccination",
      text: "Rappel annuel à la clinique.",
      kind: "vaccine",
    },
    {
      id: "ctl",
      date: a.nextControlDue,
      when: "",
      title: "Bilan annuel",
      text: "Un point complet avec votre vétérinaire.",
      kind: "check",
    },
  ];
  if (a.postOp)
    out.push({
      id: "post",
      date: a.postOp.followUpDue,
      when: "",
      title: "Contrôle post-opératoire",
      text: a.postOp.label,
      kind: "postop",
    });
  for (const p of appointments.filter((x) => x.animalId === a.id))
    out.push({
      id: p.id,
      date: p.date,
      when: "",
      title: `Rendez-vous${p.status === "demande" ? " demandé" : ""}`,
      text: `${p.reason} · ${p.time} · ${p.vet}`,
      kind: "appointment",
    });
  return out
    .filter((i) => diffDays(TODAY, i.date) >= -30)
    .sort((x, y) => (x.date < y.date ? -1 : 1))
    .slice(0, limit)
    .map((i) => ({ ...i, when: relative(i.date) }));
}

const FRIENDLY: Partial<Record<RecKind, string>> = {
  bilan_senior: "Un bilan senior est conseillé",
  vaccination: "Un rappel de vaccin approche",
  post_op: "Suivi après l'intervention",
  controle_recommande: "Un contrôle est conseillé",
  retour_clinique: "Une visite de contrôle est conseillée",
};

export function ownerHealthSummary(row: AnimalRow): {
  label: string;
  sub: string;
  ok: boolean;
} {
  const rec = row.recs.find((r) => FRIENDLY[r.kind]);
  if (rec)
    return {
      label: FRIENDLY[rec.kind]!,
      sub: `${row.animal.name} · ${ageLabel(row.animal.birthDate)}`,
      ok: false,
    };
  return {
    label: "Tout est en ordre",
    sub: `Dernière visite le ${formatShort(row.animal.lastVisit)}`,
    ok: true,
  };
}
