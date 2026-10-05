import type { Animal, AnimalRow, Owner } from "@/domain/types";
import { toRow } from "@/domain/engine/rows";
import { buildAnimals, buildOwners } from "./build";

/**
 * Couche d'accès aux données.
 *
 * Aujourd'hui : jeu de données fictif en mémoire (généré de façon
 * déterministe). Demain : implémentation Supabase / PostgreSQL alimentée par
 * l'import GMVet ou l'API GMVet — il suffira de fournir une autre
 * implémentation de `ClinicRepository`. Voir README.md → « Brancher la suite ».
 */
export interface ClinicRepository {
  listOwners(): Owner[];
  getOwner(id: string): Owner | undefined;
  listAnimals(): Animal[];
  getAnimal(id: string): Animal | undefined;
  listRows(): AnimalRow[];
  getRow(id: string): AnimalRow | undefined;
  rowsForOwner(ownerId: string): AnimalRow[];
}

function createMockRepository(): ClinicRepository {
  const owners = buildOwners();
  const ownerById = new Map(owners.map((o) => [o.id, o]));
  const animals = buildAnimals(owners);
  const rows = animals
    .map((a) => toRow(a, ownerById.get(a.ownerId) as Owner))
    .sort((x, y) => x.animal.name.localeCompare(y.animal.name, "fr"));
  const rowById = new Map(rows.map((r) => [r.animal.id, r]));

  return {
    listOwners: () => owners,
    getOwner: (id) => ownerById.get(id),
    listAnimals: () => animals,
    getAnimal: (id) => rowById.get(id)?.animal,
    listRows: () => rows,
    getRow: (id) => rowById.get(id),
    rowsForOwner: (ownerId) => rows.filter((r) => r.animal.ownerId === ownerId),
  };
}

export const repository: ClinicRepository = createMockRepository();

export const DEMO_OWNER_ID = "o-sophie";
export const FEATURED_ANIMAL_ID = "a-oslo";
