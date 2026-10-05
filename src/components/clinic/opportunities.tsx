"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Bug,
  Drumstick,
  Heart,
  HeartHandshake,
  Package,
  ShieldCheck,
  Smile,
  Stethoscope,
} from "lucide-react";
import { OPPORTUNITIES, TOTAL_POTENTIAL } from "@/data/opportunities";
import { repository } from "@/data/repository";
import type { OppCategory } from "@/domain/types";
import { ageLabel } from "@/lib/dates";
import { euro, n0, pct } from "@/lib/format";
import { cn } from "@/lib/cn";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { PetAvatar } from "@/components/shared/pet-avatar";
import { PotentialBars } from "./charts";
import { CountUp } from "@/components/ui/count-up";

const ICONS: Record<OppCategory, typeof Heart> = {
  Prévention: ShieldCheck,
  Nutrition: Drumstick,
  Dentaire: Smile,
  Senior: Heart,
  Parasites: Bug,
  Suivi: Stethoscope,
  Produits: Package,
};

const CAMPAIGN_FOR: Partial<Record<OppCategory, string>> = {
  Prévention: "vaccins",
  Dentaire: "dentaire",
  Senior: "senior",
  Parasites: "parasites",
  Suivi: "poids",
};

function Ring({ value }: { value: number }) {
  const r = 26;
  const c = 2 * Math.PI * r;
  return (
    <svg
      width="68"
      height="68"
      viewBox="0 0 68 68"
      aria-label={`Taux de conversion ${value} %`}
    >
      <circle
        cx="34"
        cy="34"
        r={r}
        fill="none"
        stroke="#ECECE5"
        strokeWidth="6"
      />
      <circle
        cx="34"
        cy="34"
        r={r}
        fill="none"
        stroke="#436C54"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={`${(value / 100) * c} ${c}`}
        transform="rotate(-90 34 34)"
        className="transition-all duration-700"
      />
      <text
        x="34"
        y="39"
        textAnchor="middle"
        className="num fill-ink text-[15px] font-semibold"
      >
        {value}%
      </text>
    </svg>
  );
}

export function OpportunitiesPage() {
  const [selected, setSelected] = useState<OppCategory>("Dentaire");
  const def = OPPORTUNITIES.find((o) => o.category === selected)!;
  const rows = useMemo(
    () => repository.listRows().filter(def.match).slice(0, 8),
    [def],
  );
  const totalAnimals = OPPORTUNITIES.reduce((s, o) => s + o.animals, 0);
  const avgConv = Math.round(
    OPPORTUNITIES.reduce((s, o) => s + o.conversion * o.potential, 0) /
      TOTAL_POTENTIAL,
  );
  const chartData = OPPORTUNITIES.map((o) => ({
    name: o.category,
    value: o.potential,
  }));
  const campaign = CAMPAIGN_FOR[selected];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[32px] font-semibold tracking-tight">
          Opportunités
        </h1>
        <p className="mt-1 max-w-2xl text-[15px] text-ink-muted">
          Les services pertinents pour le suivi de vos patients, repérés dans
          leurs dossiers. Le point de départ est toujours le bien-être de
          l’animal — jamais la vente.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="p-5">
          <p className="text-[13px] text-ink-muted">
            Potentiel estimatif ce mois-ci
          </p>
          <p className="num mt-2 text-4xl font-semibold tracking-tight">
            <CountUp value={TOTAL_POTENTIAL} format={euro} />
          </p>
          <p className="mt-1 text-xs text-ink-faint">
            Estimation fictive · maquette
          </p>
        </Card>
        <Card className="p-5">
          <p className="text-[13px] text-ink-muted">
            Animaux concernés (toutes catégories)
          </p>
          <p className="num mt-2 text-4xl font-semibold tracking-tight">
            <CountUp value={totalAnimals} />
          </p>
          <p className="mt-1 text-xs text-ink-faint">
            Un animal peut apparaître dans plusieurs catégories
          </p>
        </Card>
        <Card className="p-5">
          <p className="text-[13px] text-ink-muted">
            Taux de conversion moyen (fictif)
          </p>
          <p className="num mt-2 text-4xl font-semibold tracking-tight">
            {pct(avgConv)}
          </p>
          <p className="mt-1 text-xs text-ink-faint">
            Pondéré par le potentiel
          </p>
        </Card>
      </div>

      <div className="grid items-start gap-5 xl:grid-cols-[1fr_440px]">
        <div className="space-y-5">
          <Card>
            <CardHeader
              title="Potentiel par catégorie"
              subtitle="Cliquez une barre pour ouvrir le détail"
            />
            <div className="px-3 pb-4 pt-3 sm:px-5">
              <PotentialBars
                data={chartData}
                active={selected}
                onSelect={(n) => setSelected(n as OppCategory)}
              />
            </div>
          </Card>

          <div className="grid gap-3 sm:grid-cols-2">
            {OPPORTUNITIES.map((o) => {
              const Icon = ICONS[o.category];
              const on = o.category === selected;
              return (
                <button
                  key={o.category}
                  onClick={() => setSelected(o.category)}
                  aria-pressed={on}
                  className={cn(
                    "group rounded-2xl border bg-white p-4 text-left shadow-soft transition duration-200 hover:-translate-y-0.5 hover:shadow-lift",
                    on ? "border-sage-600 ring-2 ring-sage-100" : "border-line",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={cn(
                        "grid h-9 w-9 place-items-center rounded-xl",
                        on
                          ? "bg-sage-700 text-white"
                          : "bg-sage-50 text-sage-700",
                      )}
                    >
                      <Icon size={17} />
                    </span>
                    <Badge tone={on ? "sage" : "neutral"}>
                      {pct(o.conversion)} conv.
                    </Badge>
                  </div>
                  <p className="mt-4 text-[15px] font-semibold">{o.category}</p>
                  <div className="mt-2 flex items-end justify-between">
                    <div>
                      <p className="num text-2xl font-semibold leading-none">
                        {n0(o.animals)}
                      </p>
                      <p className="mt-1 text-xs text-ink-muted">
                        animaux concernés
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="num text-lg font-semibold leading-none text-sage-800">
                        {euro(o.potential)}
                      </p>
                      <p className="mt-1 text-xs text-ink-muted">
                        potentiel estimé
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Détail */}
        <Card
          key={selected}
          className="animate-fade-up overflow-hidden xl:sticky xl:top-24"
        >
          <div className="bg-gradient-to-br from-sage-50 to-white p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-sage-700">
                  Catégorie
                </p>
                <h2 className="mt-1 text-2xl font-semibold tracking-tight">
                  {def.category}
                </h2>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
                  {def.blurb}
                </p>
              </div>
              <Ring value={def.conversion} />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-white p-3 ring-1 ring-line">
                <p className="num text-xl font-semibold">{n0(def.animals)}</p>
                <p className="text-xs text-ink-muted">animaux concernés</p>
              </div>
              <div className="rounded-xl bg-white p-3 ring-1 ring-line">
                <p className="num text-xl font-semibold">
                  {euro(def.potential)}
                </p>
                <p className="text-xs text-ink-muted">
                  potentiel estimé (fictif)
                </p>
              </div>
            </div>
          </div>
          <div className="border-t border-line p-5">
            <p className="mb-2 flex items-center gap-1.5 text-[13px] font-medium text-ink-soft">
              <HeartHandshake size={14} className="text-sage-600" /> Services
              pertinents
            </p>
            <ul className="flex flex-wrap gap-2">
              {def.services.map((s) => (
                <li
                  key={s}
                  className="rounded-full bg-canvas px-3 py-1 text-[13px] text-ink-soft ring-1 ring-line"
                >
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <div className="border-t border-line">
            <p className="px-5 pb-1 pt-4 text-[13px] font-medium text-ink-soft">
              Exemples de patients concernés
            </p>
            <ul className="divide-y divide-line">
              {rows.map((r) => (
                <li key={r.animal.id}>
                  <Link
                    href={`/clinique/animaux/${r.animal.id}`}
                    className="flex items-center gap-3 px-5 py-3 transition hover:bg-canvas"
                  >
                    <PetAvatar animal={r.animal} size={34} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">
                        {r.animal.name}{" "}
                        <span className="font-normal text-ink-muted">
                          · {ageLabel(r.animal.birthDate)}
                        </span>
                      </span>
                      <span className="block truncate text-xs text-ink-muted">
                        {def.reasonFor(r)}
                      </span>
                    </span>
                    <ArrowRight size={14} className="text-ink-faint" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {campaign && (
            <div className="border-t border-line bg-canvas/60 p-4">
              <ButtonLink
                href={`/clinique/campagnes/${campaign}`}
                className="w-full"
                iconRight={<ArrowRight size={15} />}
              >
                Préparer une campagne « {def.category} »
              </ButtonLink>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
