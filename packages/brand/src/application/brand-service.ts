import { ValidationError, generateId, now } from "@forge/kernel";

import {
  archiveBrandEntity,
  createBrandEntity,
  normalizeName,
  updateBrandEntity,
  type Brand,
  type CreateBrandInput,
  type UpdateBrandChanges,
} from "../domain/brand";
import { slugify, uniqueSlug } from "../domain/slug";

/**
 * In-memory application service for the Brand domain.
 *
 * Sprint 003 MVP: no database, API, or persistence — brands live in a Map for
 * the lifetime of the instance. A persistent adapter can replace the store
 * later behind this same interface.
 */
export class BrandService {
  private readonly brands = new Map<string, Brand>();

  createBrand(input: CreateBrandInput): Brand {
    const name = normalizeName(input.name);
    const base = slugify(name);
    if (base.length === 0) {
      throw new ValidationError("Brand name must contain letters or numbers");
    }
    const slug = uniqueSlug(base, this.slugsInUse());
    const brand = createBrandEntity(
      { ...input, name },
      { id: generateId(), slug, timestamp: now() },
    );
    this.brands.set(brand.id, brand);
    return brand;
  }

  updateBrand(id: string, changes: UpdateBrandChanges): Brand {
    const updated = updateBrandEntity(this.requireBrand(id), changes, now());
    this.brands.set(updated.id, updated);
    return updated;
  }

  archiveBrand(id: string): Brand {
    const archived = archiveBrandEntity(this.requireBrand(id), now());
    this.brands.set(archived.id, archived);
    return archived;
  }

  getBrand(id: string): Brand | null {
    return this.brands.get(id) ?? null;
  }

  listBrands(): Brand[] {
    return [...this.brands.values()];
  }

  private requireBrand(id: string): Brand {
    const brand = this.brands.get(id);
    if (!brand) {
      throw new ValidationError(`Brand not found: ${id}`);
    }
    return brand;
  }

  private slugsInUse(): Set<string> {
    return new Set([...this.brands.values()].map((brand) => brand.slug));
  }
}
