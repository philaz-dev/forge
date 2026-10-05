import {
  TODAY,
  ageInMonths,
  ageLabel,
  diffDays,
  formatShort,
  monthsSince,
  relative,
  type ISODate,
} from "@/lib/dates";
import { signedKg } from "@/lib/format";
import type {
  Animal,
  OppCategory,
  RecKind,
  Recommendation,
  Urgency,
} from "@/domain/types";
import { weightWatch } from "./weight";

/**
 * MOTEUR D'ACTIONS RECOMMANDÉES (« Next best action »).
 *
 * ⚠️ Principe fondateur : le moteur NE POSE AUCUN DIAGNOSTIC.
 * Il applique des règles simples et transparentes (âge, échéances, dates de
 * dernière visite, évolution de pesées) et SOUMET le résultat au vétérinaire,
 * qui décide. Tous les libellés restent factuels : « n'a pas effectué »,
 * « évolution à surveiller », « peut être utile ».
 *
 * Chaque règle est une fonction pure → testable, auditable, et remplaçable
 * par un référentiel configurable par la clinique.
 */

/** Âge (années) à partir duquel un bilan senior est proposé. */
export function seniorAge(a: Pick<Animal, "species" | "size">): number {
  if (a.species === "chat") return 10;
  return a.size === "large" ? 7 : a.size === "medium" ? 9 : 10;
}

export const isSenior = (a: Animal, today: ISODate = TODAY) =>
  ageInMonths(a.birthDate, today) >= seniorAge(a) * 12;

const DENTAL_PREDISPOSED = new Set([
  "Yorkshire Terrier",
  "Teckel",
  "Carlin",
  "Bouledogue français",
  "Shih Tzu",
  "Persan",
  "Chihuahua",
]);

const CATEGORY: Record<RecKind, OppCategory> = {
  bilan_senior: "Senior",
  vaccination: "Prévention",
  antiparasitaire: "Parasites",
  suivi_poids: "Suivi",
  controle_dentaire: "Dentaire",
  nutrition: "Nutrition",
  post_op: "Suivi",
  controle_recommande: "Suivi",
  retour_clinique: "Prévention",
};

/** Valeur estimative fictive par action (maquette). */
const VALUE: Record<RecKind, number> = {
  bilan_senior: 180,
  vaccination: 55,
  antiparasitaire: 40,
  suivi_poids: 35,
  controle_dentaire: 120,
  nutrition: 70,
  post_op: 0,
  controle_recommande: 45,
  retour_clinique: 55,
};

function make(
  a: Animal,
  kind: RecKind,
  priority: number,
  urgency: Urgency,
  fields: Pick<Recommendation, "title" | "short" | "rationale" | "cta"> & {
    dueDate?: ISODate;
  },
): Recommendation {
  return {
    id: `${a.id}:${kind}`,
    animalId: a.id,
    kind,
    category: CATEGORY[kind],
    urgency,
    priority,
    estimatedValue: VALUE[kind],
    ...fields,
  };
}

const plural = (n: number, w: string) => `${n} ${w}${n > 1 ? "s" : ""}`;

export function recommend(a: Animal, today: ISODate = TODAY): Recommendation[] {
  const recs: Recommendation[] = [];
  const senior = isSenior(a, today);
  const age = ageLabel(a.birthDate, today);

  /* 1. Suivi post-opératoire */
  if (a.postOp && diffDays(today, a.postOp.followUpDue) >= -7) {
    const left = diffDays(today, a.postOp.followUpDue);
    recs.push(
      make(a, "post_op", 85, left <= 7 ? "high" : "medium", {
        title: "Suivi post-opératoire",
        short:
          left >= 0
            ? `Contrôle post-op ${relative(a.postOp.followUpDue, today)}`
            : "Contrôle post-op à planifier",
        rationale: `${a.postOp.label} réalisé(e) le ${formatShort(a.postOp.date)}. Un contrôle est prévu ${relative(a.postOp.followUpDue, today)} (${formatShort(a.postOp.followUpDue)}). Prendre des nouvelles de ${a.name} peut rassurer son propriétaire.`,
        cta: "Prendre des nouvelles",
        dueDate: a.postOp.followUpDue,
      }),
    );
  }

  /* 2. Contrôle recommandé non réalisé */
  if (a.pendingControl && diffDays(today, a.pendingControl.due) < 14) {
    recs.push(
      make(a, "controle_recommande", 75, "high", {
        title: `${a.pendingControl.label} recommandé`,
        short: `${a.pendingControl.label} recommandé`,
        rationale: `Lors de la consultation du ${formatShort(a.pendingControl.since)}, un contrôle (${a.pendingControl.label.toLowerCase()}) avait été recommandé. Il n'a pas encore été réalisé : le vétérinaire peut proposer un rendez-vous.`,
        cta: "Proposer un rendez-vous",
        dueDate: a.pendingControl.due,
      }),
    );
  }

  /* 3. Vaccination */
  const vLeft = diffDays(today, a.nextVaccineDue);
  if (vLeft <= 30) {
    const late = vLeft < 0;
    recs.push(
      make(a, "vaccination", late ? 90 : 70, late ? "high" : "medium", {
        title: late
          ? "Rappel de vaccination en retard"
          : "Rappel de vaccination",
        short: late
          ? `Rappel vaccin dépassé de ${plural(-vLeft, "jour")}`
          : `Rappel vaccin ${relative(a.nextVaccineDue, today)}`,
        rationale: late
          ? `Le rappel annuel de ${a.name} était prévu le ${formatShort(a.nextVaccineDue)} : il est dépassé de ${plural(-vLeft, "jour")}. Une consultation permettrait de faire le point.`
          : `Le rappel annuel de ${a.name} est prévu le ${formatShort(a.nextVaccineDue)}, soit ${relative(a.nextVaccineDue, today)}.`,
        cta: "Proposer un rendez-vous",
        dueDate: a.nextVaccineDue,
      }),
    );
  }

  /* 4. Bilan senior */
  if (senior && (!a.lastBilan || monthsSince(a.lastBilan, today) >= 12)) {
    recs.push(
      make(a, "bilan_senior", 80, "high", {
        title: "Bilan senior",
        short: "Bilan senior recommandé",
        rationale: `${a.name} a maintenant ${age} et n'a pas effectué de bilan senior au cours des 12 derniers mois.`,
        cta: "Proposer un rendez-vous",
      }),
    );
  }

  /* 5. Retour en clinique (animal non vu) */
  const since = monthsSince(a.lastVisit, today);
  if (since >= 12) {
    recs.push(
      make(
        a,
        "retour_clinique",
        since >= 18 ? 65 : 55,
        since >= 18 ? "high" : "medium",
        {
          title: "Animal non vu depuis plus d'un an",
          short: `Non vu depuis ${since} mois`,
          rationale: `Aucune consultation n'est enregistrée pour ${a.name} depuis ${since} mois (dernière visite : ${formatShort(a.lastVisit)}). Un point de suivi régulier permet de mieux accompagner son évolution.`,
          cta: "Contacter le propriétaire",
        },
      ),
    );
  }

  /* 6. Évolution du poids (information, pas un diagnostic) */
  const ww = weightWatch(a.weights, {
    species: a.species,
    ageMonths: ageInMonths(a.birthDate, today),
  });
  if (ww) {
    recs.push(
      make(a, "suivi_poids", 60, "medium", {
        title: "Suivi du poids",
        short: `${signedKg(ww.delta)} en ${ww.months} mois`,
        rationale: `Les pesées enregistrées montrent une évolution de ${signedKg(ww.delta)} en ${ww.months} mois (${formatShort(ww.from.date)} → ${formatShort(ww.to.date)}). Évolution à surveiller : le vétérinaire peut décider d'une évaluation.`,
        cta: "Proposer un point poids",
      }),
    );
  }

  /* 7. Antiparasitaire */
  const pLeft = diffDays(today, a.nextParasiteDue);
  if (pLeft <= 21) {
    const late = pLeft < 0;
    recs.push(
      make(a, "antiparasitaire", late ? 72 : 50, late ? "medium" : "low", {
        title: "Renouvellement antiparasitaire",
        short: late
          ? `Antiparasitaire dépassé de ${plural(-pLeft, "jour")}`
          : `Antiparasitaire ${relative(a.nextParasiteDue, today)}`,
        rationale: late
          ? `La prochaine prise antiparasitaire de ${a.name} était prévue le ${formatShort(a.nextParasiteDue)}. Le propriétaire peut être invité à la renouveler.`
          : `La prochaine prise antiparasitaire de ${a.name} est prévue le ${formatShort(a.nextParasiteDue)} (${relative(a.nextParasiteDue, today)}).`,
        cta: "Envoyer un rappel",
        dueDate: a.nextParasiteDue,
      }),
    );
  }

  /* 8. Contrôle dentaire */
  const ageM = ageInMonths(a.birthDate, today);
  const dentalGap = a.lastDental ? monthsSince(a.lastDental, today) : null;
  if (
    ageM >= 36 &&
    (ageM >= 72 || DENTAL_PREDISPOSED.has(a.breed)) &&
    (dentalGap === null || dentalGap >= 18) &&
    !a.postOp
  ) {
    recs.push(
      make(a, "controle_dentaire", 45, "low", {
        title: "Contrôle dentaire",
        short: "Contrôle dentaire conseillé",
        rationale:
          dentalGap === null
            ? `Aucun contrôle dentaire n'est enregistré dans le dossier de ${a.name}. Un examen de la bouche peut être proposé lors de la prochaine visite.`
            : `Le dernier contrôle dentaire de ${a.name} remonte à ${dentalGap} mois. Un examen de la bouche peut être proposé.`,
        cta: "Proposer un contrôle",
      }),
    );
  }

  /* 9. Nutrition */
  if (senior || ww) {
    recs.push(
      make(a, "nutrition", 40, "low", {
        title: "Conseil nutrition",
        short: "Alimentation à adapter ?",
        rationale: senior
          ? `À ${age}, l'alimentation de ${a.name} peut être réévaluée avec le vétérinaire (ration, gamme adaptée à l'âge).`
          : `Compte tenu de l'évolution de poids observée, un échange sur la ration et l'alimentation de ${a.name} peut être utile.`,
        cta: "Proposer un conseil",
      }),
    );
  }

  return recs.sort((x, y) => y.priority - x.priority);
}
