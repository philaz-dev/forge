import { norm } from "@/lib/format";
import type { AnimalRow, Species } from "@/domain/types";

export type AgeBand = "all" | "junior" | "adult" | "mature" | "senior";

export interface AnimalFilters {
  q: string;
  species: "all" | Species;
  age: AgeBand;
  breed: string; // "all" ou nom de race
  senior: boolean;
  vaccine: boolean;
  /** Non vus depuis X mois (0 = désactivé) */
  notSeen: number;
  weight: boolean;
  followUp: boolean;
  opportunity: boolean;
}

export const DEFAULT_FILTERS: AnimalFilters = {
  q: "",
  species: "all",
  age: "all",
  breed: "all",
  senior: false,
  vaccine: false,
  notSeen: 0,
  weight: false,
  followUp: false,
  opportunity: false,
};

export const AGE_BANDS: {
  key: AgeBand;
  label: string;
  test: (months: number) => boolean;
}[] = [
  { key: "all", label: "Tous les âges", test: () => true },
  { key: "junior", label: "Moins de 2 ans", test: (m) => m < 24 },
  { key: "adult", label: "2 à 6 ans", test: (m) => m >= 24 && m < 84 },
  { key: "mature", label: "7 à 9 ans", test: (m) => m >= 84 && m < 120 },
  { key: "senior", label: "10 ans et plus", test: (m) => m >= 120 },
];

export function applyFilters(rows: AnimalRow[], f: AnimalFilters): AnimalRow[] {
  const q = norm(f.q.trim());
  const band = AGE_BANDS.find((b) => b.key === f.age) ?? AGE_BANDS[0]!;
  return rows.filter((r) => {
    const a = r.animal;
    if (f.species !== "all" && a.species !== f.species) return false;
    if (f.breed !== "all" && a.breed !== f.breed) return false;
    if (!band.test(r.ageMonths)) return false;
    if (f.senior && !r.isSenior) return false;
    if (f.vaccine && !r.vaccineDue) return false;
    if (f.notSeen && r.monthsSinceVisit < f.notSeen) return false;
    if (f.weight && !r.weightWatch) return false;
    if (f.followUp && !r.needsFollowUp) return false;
    if (f.opportunity && !r.hasOpportunity) return false;
    if (q) {
      const hay = norm(
        `${a.name} ${a.breed} ${a.species} ${r.owner.firstName} ${r.owner.lastName} ${r.owner.phone} ${r.owner.email} ${a.microchip}`,
      );
      if (!q.split(/\s+/).every((t) => hay.includes(t))) return false;
    }
    return true;
  });
}

export const activeFilterCount = (f: AnimalFilters) =>
  (f.species !== "all" ? 1 : 0) +
  (f.age !== "all" ? 1 : 0) +
  (f.breed !== "all" ? 1 : 0) +
  (f.senior ? 1 : 0) +
  (f.vaccine ? 1 : 0) +
  (f.notSeen ? 1 : 0) +
  (f.weight ? 1 : 0) +
  (f.followUp ? 1 : 0) +
  (f.opportunity ? 1 : 0);
