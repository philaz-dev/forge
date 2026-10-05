import { describe, expect, it } from "vitest";
import { repository } from "@/data/repository";
import { CAMPAIGNS } from "@/data/campaigns";
import { OPPORTUNITIES, TOTAL_POTENTIAL } from "@/data/opportunities";
import { applyFilters, DEFAULT_FILTERS } from "./filters";
import { weightDelta } from "./weight";

const row = (id: string) => {
  const r = repository.getRow(id);
  if (!r) throw new Error(`missing ${id}`);
  return r;
};

describe("jeu de données fictif", () => {
  it("contient au moins 30 propriétaires et 50 animaux, chiens et chats", () => {
    expect(repository.listOwners().length).toBeGreaterThanOrEqual(30);
    const animals = repository.listAnimals();
    expect(animals.length).toBeGreaterThanOrEqual(50);
    expect(
      animals.every((a) => a.species === "chien" || a.species === "chat"),
    ).toBe(true);
    // chaque propriétaire a au moins un animal
    const owned = new Set(animals.map((a) => a.ownerId));
    expect(owned.size).toBe(repository.listOwners().length);
  });

  it("est déterministe", () => {
    expect(row("a-oslo").animal.microchip).toBe(row("a-oslo").animal.microchip);
  });
});

describe("fiche Oslo (scénario de démonstration)", () => {
  const oslo = row("a-oslo");

  it("reproduit la courbe de poids du cahier des charges", () => {
    const w = oslo.animal.weights;
    expect(oslo.weight).toBe(34.2);
    expect(weightDelta(w, 24)?.delta).toBe(3.2); // depuis janvier 2024
    expect(weightDelta(w, 24)?.from.date.startsWith("2024-01")).toBe(true);
    expect(weightDelta(w, 12)?.delta).toBe(1.8); // sur 12 mois
  });

  it("recommande en premier un bilan senior", () => {
    expect(oslo.isSenior).toBe(true);
    expect(oslo.topRec?.kind).toBe("bilan_senior");
    expect(oslo.topRec?.rationale).toContain(
      "n'a pas effectué de bilan senior",
    );
  });
});

describe("moteur d'actions recommandées", () => {
  it("Nala : rappel vaccin dans 12 jours", () => {
    expect(row("a-nala").topRec?.short).toBe("Rappel vaccin dans 12 jours");
  });
  it("Marcel : contrôle dermatologique recommandé", () => {
    expect(row("a-marcel").topRec?.short).toBe(
      "Contrôle dermatologique recommandé",
    );
  });
  it("Rio : +3,2 kg en 18 mois", () => {
    expect(row("a-rio").topRec?.short).toBe("+3,2 kg en 18 mois");
  });
  it("ne formule jamais de diagnostic", () => {
    const banned = /diagnostic|atteint de|souffre|maladie|obés|diabèt|arthros/i;
    for (const r of repository.listRows())
      for (const rec of r.recs)
        expect(rec.rationale + rec.title).not.toMatch(banned);
  });
  it("trie les recommandations par priorité décroissante", () => {
    for (const r of repository.listRows())
      for (let i = 1; i < r.recs.length; i++)
        expect(r.recs[i - 1]!.priority).toBeGreaterThanOrEqual(
          r.recs[i]!.priority,
        );
  });
});

describe("filtres et campagnes", () => {
  const rows = repository.listRows();
  it("filtre par espèce, séniors et recherche", () => {
    const dogs = applyFilters(rows, { ...DEFAULT_FILTERS, species: "chien" });
    expect(dogs.every((r) => r.animal.species === "chien")).toBe(true);
    expect(
      applyFilters(rows, { ...DEFAULT_FILTERS, senior: true }).length,
    ).toBeGreaterThan(8);
    expect(
      applyFilters(rows, { ...DEFAULT_FILTERS, q: "sophie martin" }).map(
        (r) => r.animal.name,
      ),
    ).toEqual(expect.arrayContaining(["Oslo", "Mochi"]));
    expect(applyFilters(rows, { ...DEFAULT_FILTERS, q: "ELEC" })).toEqual([]);
  });
  it("chaque filtre produit des résultats non vides", () => {
    for (const patch of [
      { vaccine: true },
      { weight: true },
      { followUp: true },
      { opportunity: true },
      { notSeen: 12 },
      { notSeen: 18 },
    ])
      expect(
        applyFilters(rows, { ...DEFAULT_FILTERS, ...patch }).length,
      ).toBeGreaterThan(2);
  });
  it("chaque campagne et opportunité a un échantillon à afficher", () => {
    for (const c of CAMPAIGNS)
      expect(rows.filter(c.match).length).toBeGreaterThan(2);
    for (const o of OPPORTUNITIES)
      expect(rows.filter(o.match).length).toBeGreaterThan(2);
  });
  it("le potentiel par catégorie totalise 18 450 €", () => {
    expect(TOTAL_POTENTIAL).toBe(18450);
  });
});
