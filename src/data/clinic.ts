/**
 * Indicateurs de la clinique pour la maquette (valeurs FICTIVES demandées dans
 * le cahier des charges). Ils représentent la clinique entière ; la base de
 * démonstration navigable (52 animaux) en est un échantillon.
 */
export const CLINIC_STATS = {
  activeAnimals: 2847,
  owners: 1936,
  recommendedActions: 137,
  vaccinesToRenew: 42,
  seniorsWithoutCheckup: 18,
  pendingChecks: 31,
  postOpFollowUps: 16,
  nutritionPreventionOpps: 30,
  revenuePotential: 18450,
  consultations: 12419,
  vaccinations: 2231,
} as const;

/** Taux de retour en clinique (animaux vus dans les 12 derniers mois, en %). */
export const RETURN_RATE_SERIES = [
  { month: "nov.", rate: 71.2 },
  { month: "déc.", rate: 71.9 },
  { month: "janv.", rate: 72.4 },
  { month: "févr.", rate: 73.1 },
  { month: "mars", rate: 73.8 },
  { month: "avr.", rate: 74.6 },
  { month: "mai", rate: 75.2 },
  { month: "juin", rate: 76.1 },
  { month: "juil.", rate: 76.4 },
  { month: "août", rate: 77.3 },
  { month: "sept.", rate: 78.2 },
  { month: "oct.", rate: 79.0 },
] as const;
