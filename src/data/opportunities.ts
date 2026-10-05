import type { AnimalRow, OppCategory } from "@/domain/types";

export interface OpportunityDef {
  category: OppCategory;
  blurb: string;
  /** Services pertinents pour le suivi de l'animal. */
  services: string[];
  animals: number;
  potential: number;
  conversion: number;
  match: (r: AnimalRow) => boolean;
  /** Phrase affichée sur la fiche d'un animal concerné. */
  reasonFor: (r: AnimalRow) => string;
}

const has = (r: AnimalRow, cat: OppCategory) =>
  r.recs.some((x) => x.category === cat);

/**
 * Chiffres FICTIFS (cohérents avec le potentiel global de 18 450 € du
 * dashboard : 2 900 + 3 150 + 4 380 + 3 240 + 2 320 + 1 240 + 1 220).
 */
export const OPPORTUNITIES: OpportunityDef[] = [
  {
    category: "Prévention",
    blurb:
      "Rappels de vaccination et visites annuelles pour garder les carnets à jour.",
    services: [
      "Rappel de vaccination",
      "Visite annuelle",
      "Protocole de prévention voyage",
    ],
    animals: 64,
    potential: 2900,
    conversion: 38,
    match: (r) => has(r, "Prévention"),
    reasonFor: (r) =>
      `${r.animal.name} a une échéance de prévention à planifier.`,
  },
  {
    category: "Nutrition",
    blurb:
      "Une alimentation adaptée à l'âge, au poids et au mode de vie de l'animal.",
    services: [
      "Consultation nutrition",
      "Gamme adaptée à l'âge",
      "Plan de ration personnalisé",
    ],
    animals: 47,
    potential: 3150,
    conversion: 29,
    match: (r) => has(r, "Nutrition"),
    reasonFor: (r) =>
      `L'alimentation de ${r.animal.name} peut être réévaluée avec le vétérinaire.`,
  },
  {
    category: "Dentaire",
    blurb:
      "Un suivi bucco-dentaire régulier contribue au confort au quotidien.",
    services: [
      "Contrôle dentaire",
      "Détartrage",
      "Hygiène dentaire à domicile",
    ],
    animals: 73,
    potential: 4380,
    conversion: 41,
    match: (r) => has(r, "Dentaire"),
    reasonFor: (r) => `Aucun contrôle dentaire récent pour ${r.animal.name}.`,
  },
  {
    category: "Senior",
    blurb: "Un bilan de santé régulier pour accompagner les animaux âgés.",
    services: [
      "Bilan senior",
      "Suivi du confort articulaire",
      "Contrôle annuel renforcé",
    ],
    animals: 18,
    potential: 3240,
    conversion: 52,
    match: (r) => has(r, "Senior"),
    reasonFor: (r) =>
      `${r.animal.name} n'a pas fait de bilan senior ces 12 derniers mois.`,
  },
  {
    category: "Parasites",
    blurb: "Protection antiparasitaire adaptée à la saison et au mode de vie.",
    services: [
      "Protocole antiparasitaire",
      "Rappel automatique",
      "Conseils voyage",
    ],
    animals: 58,
    potential: 2320,
    conversion: 61,
    match: (r) => has(r, "Parasites"),
    reasonFor: (r) =>
      `La protection antiparasitaire de ${r.animal.name} arrive à échéance.`,
  },
  {
    category: "Suivi",
    blurb: "Contrôles recommandés, suivis post-opératoires et suivis de poids.",
    services: [
      "Contrôle post-opératoire",
      "Point poids",
      "Contrôle recommandé non réalisé",
    ],
    animals: 31,
    potential: 1240,
    conversion: 57,
    match: (r) => has(r, "Suivi"),
    reasonFor: (r) => `Un suivi est à planifier pour ${r.animal.name}.`,
  },
  {
    category: "Produits",
    blurb:
      "Produits conseillés par la clinique, en cohérence avec le suivi de l'animal.",
    services: ["Alimentation adaptée", "Hygiène dentaire", "Antiparasitaires"],
    animals: 39,
    potential: 1220,
    conversion: 22,
    match: (r) =>
      has(r, "Nutrition") || has(r, "Dentaire") || has(r, "Parasites"),
    reasonFor: (r) =>
      `Des produits adaptés à ${r.animal.name} peuvent lui être recommandés.`,
  },
];

export const TOTAL_POTENTIAL = OPPORTUNITIES.reduce(
  (s, o) => s + o.potential,
  0,
);
