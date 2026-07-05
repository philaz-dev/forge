"use client";

import { useMemo, useState, type FormEvent } from "react";

import { BrandService, type Brand, type CreateBrandInput } from "@forge/brand";
import { Button } from "@forge/ui";

const EMPTY_FORM: CreateBrandInput = {
  name: "",
  country: "",
  language: "",
  audience: "",
  businessModel: "",
  domain: "",
};

export default function BrandsPage() {
  const service = useMemo(() => new BrandService(), []);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isDialogOpen, setDialogOpen] = useState(false);

  function handleCreate(input: CreateBrandInput) {
    service.createBrand(input);
    setBrands(service.listBrands());
    setDialogOpen(false);
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-8 p-8">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Brands</h1>
        <Button onClick={() => setDialogOpen(true)}>+ Create Brand</Button>
      </header>

      {brands.length === 0 ? (
        <p className="text-sm text-muted-foreground">No brands yet.</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {brands.map((brand) => (
            <li key={brand.id}>
              <BrandCard brand={brand} />
            </li>
          ))}
        </ul>
      )}

      {isDialogOpen ? (
        <CreateBrandDialog
          onCancel={() => setDialogOpen(false)}
          onSave={handleCreate}
        />
      ) : null}
    </main>
  );
}

function BrandCard({ brand }: { brand: Brand }) {
  return (
    <article className="rounded-lg border border-border bg-background p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold">{brand.name}</h2>
        <span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">
          {brand.status}
        </span>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">/{brand.slug}</p>
      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <Detail label="Country" value={brand.country} />
        <Detail label="Language" value={brand.language} />
        <Detail label="Audience" value={brand.audience} />
        <Detail label="Business Model" value={brand.businessModel} />
        {brand.domain ? <Detail label="Domain" value={brand.domain} /> : null}
      </dl>
    </article>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium">{value || "—"}</dd>
    </div>
  );
}

function CreateBrandDialog({
  onCancel,
  onSave,
}: {
  onCancel: () => void;
  onSave: (input: CreateBrandInput) => void;
}) {
  const [form, setForm] = useState<CreateBrandInput>(EMPTY_FORM);
  const canSave = (form.name ?? "").trim().length > 0;

  function setField(field: keyof CreateBrandInput, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!canSave) return;
    onSave(form);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Create Brand"
    >
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-md flex-col gap-4 rounded-lg border border-border bg-background p-6 shadow-lg"
      >
        <h2 className="text-lg font-semibold">Create Brand</h2>
        <Field
          label="Name"
          value={form.name ?? ""}
          onChange={(value) => setField("name", value)}
          required
        />
        <Field
          label="Country"
          value={form.country ?? ""}
          onChange={(value) => setField("country", value)}
        />
        <Field
          label="Language"
          value={form.language ?? ""}
          onChange={(value) => setField("language", value)}
        />
        <Field
          label="Audience"
          value={form.audience ?? ""}
          onChange={(value) => setField("audience", value)}
        />
        <Field
          label="Business Model"
          value={form.businessModel ?? ""}
          onChange={(value) => setField("businessModel", value)}
        />
        <Field
          label="Domain (optional)"
          value={form.domain ?? ""}
          onChange={(value) => setField("domain", value)}
        />
        <div className="mt-2 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={!canSave}>
            Save
          </Button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <input
        type="text"
        value={value}
        required={required}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
    </label>
  );
}
