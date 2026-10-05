"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CalendarCheck,
  Download,
  FileText,
  Pill,
  ShieldCheck,
  Syringe,
} from "lucide-react";
import { formatLong, formatShort, relative } from "@/lib/dates";
import { de } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { useDemo } from "@/store/demo-store";
import { useOwner } from "./owner-context";
import { VACC_LABEL } from "./health";
import {
  LifeTimeline,
  OwnerTitle,
  ProductCard,
  ProductModal,
  UpcomingSection,
  WeightSection,
} from "./sections";
import { repository } from "@/data/repository";
import type { ProductPick } from "@/data/products";
import { ownerHealthSummary } from "@/domain/engine/life";
import { productsFor } from "@/data/products";

export function HealthPage() {
  const { pet } = useOwner();
  const toast = useToast();
  const a = pet.animal;
  const h = ownerHealthSummary(pet);
  const docs = a.documents
    .filter(
      (d) =>
        d.kind === "ordonnance" ||
        d.kind === "certificat" ||
        d.kind === "analyse",
    )
    .slice(0, 4);
  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-4xl font-light tracking-tight">
          Santé {de(a.name)}
        </h1>
        <p className="mt-2 text-ink-muted">
          Tout ce qu’il faut savoir, en un coup d’œil.
        </p>
      </div>

      <div className="flex items-start gap-4 rounded-[32px] bg-mint p-5">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white text-2xl shadow-soft">
          ❤️
        </span>
        <div>
          <p className="text-lg font-semibold leading-tight">{h.label}</p>
          <p className="mt-1 text-sm text-ink-muted">
            Dernière consultation le {formatLong(a.lastVisit)} (
            {relative(a.lastVisit)}).
          </p>
          <p className="mt-2 text-xs text-ink-faint">
            Ces informations viennent de votre clinique. Elles ne remplacent pas
            l’avis de votre vétérinaire.
          </p>
        </div>
      </div>

      <section id="vaccins" className="scroll-mt-24">
        <OwnerTitle sub="Le carnet de vaccination, toujours dans votre poche">
          Vaccins
        </OwnerTitle>
        <div className="divide-y divide-cream-200 rounded-3xl border border-cream-300/60 bg-white shadow-soft">
          {a.vaccinations.slice(0, 5).map((v) => {
            const s = VACC_LABEL[v.status];
            return (
              <div key={v.id} className="flex items-center gap-4 px-5 py-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-sky-50 text-sky-600">
                  <Syringe size={18} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[15px] font-semibold">
                    {v.name.replace(" · ", " — ")}
                  </p>
                  <p className="text-[13px] text-ink-muted">
                    {formatShort(v.date)} · {v.vet}
                  </p>
                </div>
                {v.isLatest ? (
                  <div className="text-right">
                    <Badge tone={s.tone}>{s.label}</Badge>
                    <p className="mt-1 text-[11px] text-ink-faint">
                      Rappel {formatShort(v.nextDue)}
                    </p>
                  </div>
                ) : (
                  <ShieldCheck size={17} className="text-sage-500" />
                )}
              </div>
            );
          })}
        </div>
      </section>

      <WeightSection />

      <section>
        <OwnerTitle sub="Alimentation, traitements et précautions">
          Au quotidien
        </OwnerTitle>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { t: "Alimentation", v: a.diet },
            {
              t: "Traitements",
              v: a.treatments.map((x) => `${x.name} — ${x.detail}`).join(" · "),
            },
            { t: "Allergies", v: a.allergies.join(" · ") },
            { t: "À savoir", v: a.importantInfo },
          ].map((x) => (
            <div
              key={x.t}
              className="rounded-3xl border border-cream-300/60 bg-white p-5 shadow-soft"
            >
              <p className="text-xs font-medium uppercase tracking-wider text-sage-700">
                {x.t}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                {x.v}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <OwnerTitle sub="Retrouvez vos ordonnances et résultats">
          Documents
        </OwnerTitle>
        <div className="divide-y divide-cream-200 rounded-3xl border border-cream-300/60 bg-white shadow-soft">
          {docs.map((d) => (
            <button
              key={d.id}
              onClick={() =>
                toast({
                  title: "Téléchargement simulé",
                  description: d.title,
                  tone: "info",
                })
              }
              className="flex w-full items-center gap-4 px-5 py-4 text-left transition first:rounded-t-3xl last:rounded-b-3xl hover:bg-cream-50"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-cream-100 text-sage-700">
                {d.kind === "ordonnance" ? (
                  <Pill size={18} />
                ) : (
                  <FileText size={18} />
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[15px] font-semibold">
                  {d.title}
                </span>
                <span className="text-[13px] text-ink-muted">
                  {formatShort(d.date)}
                </span>
              </span>
              <Download size={16} className="text-ink-faint" />
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

export function JourneyPage() {
  const { pet } = useOwner();
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-4xl font-light tracking-tight">
          La vie {de(pet.animal.name)}
        </h1>
        <p className="mt-2 max-w-md text-ink-muted">
          Chaque étape compte. Votre clinique accompagne {pet.animal.name}{" "}
          depuis son premier jour.
        </p>
      </div>
      <LifeTimeline />
      <p className="text-center text-sm text-ink-faint">
        … et la suite s’écrit avec vous.
      </p>
    </div>
  );
}

export function RecommendationsPage() {
  const { pet } = useOwner();
  const picks = productsFor(pet);
  const groups = Array.from(new Set(picks.map((p) => p.heading)));
  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-4xl font-light tracking-tight">
          Recommandé pour {pet.animal.name}
        </h1>
        <p className="mt-2 max-w-md text-ink-muted">
          Une sélection choisie par votre clinique, en cohérence avec l’âge, le
          poids et le mode de vie {de(pet.animal.name)}.
        </p>
      </div>
      {groups.map((g) => (
        <div key={g}>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-sage-700">
            {g}
          </p>
          <ProductsSectionFiltered heading={g} />
        </div>
      ))}
      <p className="rounded-2xl bg-cream-100 p-4 text-center text-xs text-ink-muted">
        Fiches produits fictives · pas de paiement dans cette première version.
      </p>
    </div>
  );
}

function ProductsSectionFiltered({ heading }: { heading: string }) {
  const { pet } = useOwner();
  const [open, setOpen] = useState<ProductPick | null>(null);
  const picks = productsFor(pet).filter((p) => p.heading === heading);
  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
        {picks.map((p) => (
          <div key={p.product.id} className="[&>article]:w-auto">
            <ProductCard pick={p} onOpen={() => setOpen(p)} />
          </div>
        ))}
      </div>
      {open && <ProductModal pick={open} onClose={() => setOpen(null)} />}
    </>
  );
}

export function AppointmentsPage() {
  const { pet } = useOwner();
  const { state } = useDemo();
  const { openBooking } = useOwner();
  const mine = state.appointments
    .filter((x) => x.ownerId === pet.owner.id)
    .sort((x, y) => (x.date < y.date ? -1 : 1));
  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-light tracking-tight">
            Rendez-vous
          </h1>
          <p className="mt-2 text-ink-muted">
            Vos prochains rendez-vous à la clinique.
          </p>
        </div>
        <Button
          size="lg"
          icon={<CalendarCheck size={17} />}
          onClick={() => openBooking()}
        >
          Prendre rendez-vous
        </Button>
      </div>
      <div className="space-y-3">
        {mine.map((x) => (
          <div
            key={x.id}
            className="flex items-center gap-4 rounded-3xl border border-cream-300/60 bg-white p-5 shadow-soft"
          >
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-sage-50 text-center leading-none">
              <span>
                <span className="num block text-xl font-semibold text-sage-800">
                  {formatShort(x.date).split(" ")[0]}
                </span>
                <span className="block text-[10px] font-medium uppercase text-sage-700">
                  {formatShort(x.date).split(" ")[1]}
                </span>
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[16px] font-semibold">{x.reason}</p>
              <p className="text-[13px] text-ink-muted">
                {x.time.replace(":", "h")} · {x.vet} ·{" "}
                {repositoryName(x.animalId)}
              </p>
            </div>
            <Badge tone={x.status === "confirme" ? "sage" : "amber"} dot>
              {x.status === "confirme" ? "Confirmé" : "En attente"}
            </Badge>
          </div>
        ))}
      </div>
      <UpcomingSection limit={4} />
      <Link
        href="/proprietaire"
        className="block text-center text-sm text-sage-700 hover:underline"
      >
        Retour à l’accueil
      </Link>
    </div>
  );
}

function repositoryName(id: string) {
  return repository.getAnimal(id)?.name ?? "";
}
