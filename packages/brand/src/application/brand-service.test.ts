import { beforeEach, describe, expect, it } from "vitest";

import { ValidationError } from "@forge/kernel";

import { BrandService } from "./brand-service";

let service: BrandService;

beforeEach(() => {
  service = new BrandService();
});

describe("createBrand", () => {
  it("creates a Draft brand with a generated slug", () => {
    const brand = service.createBrand({
      name: "My Coffee Brand",
      country: "France",
      language: "French",
      businessModel: "Affiliate",
      audience: "Home baristas",
    });

    expect(brand.id).not.toHaveLength(0);
    expect(brand.name).toBe("My Coffee Brand");
    expect(brand.slug).toBe("my-coffee-brand");
    expect(brand.status).toBe("Draft");
    expect(brand.country).toBe("France");
    expect(brand.domain).toBeUndefined();
    expect(brand.createdAt).toBe(brand.updatedAt);
  });

  it("keeps an optional domain when provided", () => {
    const brand = service.createBrand({ name: "Acme", domain: "Acme.com" });
    expect(brand.domain).toBe("acme.com");
  });

  it("requires a name", () => {
    expect(() => service.createBrand({ name: "   " })).toThrow(ValidationError);
  });

  it("rejects a name with no slug-able characters", () => {
    expect(() => service.createBrand({ name: "!!!" })).toThrow(ValidationError);
  });
});

describe("unique slug", () => {
  it("generates distinct slugs for brands with the same name", () => {
    const first = service.createBrand({ name: "Acme" });
    const second = service.createBrand({ name: "Acme" });
    const third = service.createBrand({ name: "Acme" });

    expect(first.slug).toBe("acme");
    expect(second.slug).toBe("acme-2");
    expect(third.slug).toBe("acme-3");
  });
});

describe("archiveBrand", () => {
  it("moves a brand to Archived", () => {
    const brand = service.createBrand({ name: "Acme" });
    const archived = service.archiveBrand(brand.id);
    expect(archived.status).toBe("Archived");
    expect(service.getBrand(brand.id)?.status).toBe("Archived");
  });

  it("cannot archive an already archived brand", () => {
    const brand = service.createBrand({ name: "Acme" });
    service.archiveBrand(brand.id);
    expect(() => service.archiveBrand(brand.id)).toThrow(ValidationError);
  });

  it("cannot update an archived brand", () => {
    const brand = service.createBrand({ name: "Acme" });
    service.archiveBrand(brand.id);
    expect(() => service.updateBrand(brand.id, { audience: "x" })).toThrow(
      ValidationError,
    );
  });

  it("throws when the brand does not exist", () => {
    expect(() => service.archiveBrand("missing")).toThrow(ValidationError);
  });
});

describe("listBrands / getBrand", () => {
  it("lists created brands and looks them up by id", () => {
    const a = service.createBrand({ name: "Alpha" });
    service.createBrand({ name: "Beta" });

    expect(service.listBrands()).toHaveLength(2);
    expect(service.getBrand(a.id)?.name).toBe("Alpha");
    expect(service.getBrand("missing")).toBeNull();
  });

  it("activates a brand through updateBrand", () => {
    const brand = service.createBrand({ name: "Acme" });
    expect(service.updateBrand(brand.id, { status: "Active" }).status).toBe(
      "Active",
    );
  });
});
