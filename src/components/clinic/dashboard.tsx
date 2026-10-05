"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowUpRight,
  CalendarCheck,
  CheckCircle2,
  Dog,
  Droplets,
  HeartPulse,
  PawPrint,
  Scale,
  ShieldCheck,
  Stethoscope,
  Syringe,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { repository } from "@/data/repository";
import { CLINIC_STATS } from "@/data/clinic";
import { OPPORTUNITIES, TOTAL_POTENTIAL } from "@/data/opportunities";
import { TODAY, ageLabel, formatWeekday } from "@/lib/dates";
import { euro, n0 } from "@/lib/format";
import { cn } from "@/lib/cn";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { CountUp } from "@/components/ui/count-up";
import { PetAvatar } from "@/components/shared/pet-avatar";
import { useDemo } from "@/store/demo-store";
import { RecActionBar } from "./rec-actions";
import { ReturnRateChart } from "./charts";

/** Aplats pastel de la charte, un par carte. */
const KPI_TONES = [
  "bg-mint",
  "bg-sky/70",
  "bg-butter",
  "bg-lilac",
  "bg-blush/70",
  "bg-sand/80",
  "bg-mint",
  "bg-sky/70",
];

const KPIS = [
  {
    label: "Animaux actifs",
    value: CLINIC_STATS.activeAnimals,
    icon: PawPrint,
    href: "/clinique/animaux",
    hint: "+3,1 % sur 12 mois",
  },
  {
    label: "Propriétaires",
    value: CLINIC_STATS.owners,
    icon: Users,
    href: "/clinique/animaux",
    hint: "dont 58 % sur l'app",
  },
  {
    label: "Actions recommandées ce mois-ci",
    value: CLINIC_STATS.recommendedActions,
    icon: Zap,
    href: "/clinique/campagnes",
    hint: "à valider par vous",
    accent: true,
  },
  {
    label: "Vaccins à renouveler",
    value: CLINIC_STATS.vaccinesToRenew,
    icon: Syringe,
    href: "/clinique/animaux?vaccine=1",
    hint: "sous 30 jours",
  },
  {
    label: "Animaux seniors sans bilan récent",
    value: CLINIC_STATS.seniorsWithoutCheckup,
    icon: HeartPulse,
    href: "/clinique/animaux?senior=1",
    hint: "> 12 mois",
  },
  {
    label: "Contrôles recommandés non réalisés",
    value: CLINIC_STATS.pendingChecks,
    icon: AlertCircle,
    href: "/clinique/animaux?followUp=1",
    hint: "à reprogrammer",
  },
  {
    label: "Suivis post-opératoires",
    value: CLINIC_STATS.postOpFollowUps,
    icon: Stethoscope,
    href: "/clinique/animaux?followUp=1",
    hint: "en cours",
  },
  {
    label: "Opportunités nutrition / prévention",
    value: CLINIC_STATS.nutritionPreventionOpps,
    icon: Droplets,
    href: "/clinique/opportunites",
    hint: "pertinentes",
  },
] as const;

/** Fiches « vitrine » épinglées en tête de la liste du jour. */
const PINNED = ["a-oslo", "a-nala", "a-marcel", "a-rio"];

function useTodayItems() {
  return useMemo(() => {
    const rows = repository.listRows().filter((r) => r.topRec);
    const pinned = PINNED.map((id) =>
      rows.find((r) => r.animal.id === id),
    ).filter(Boolean) as typeof rows;
    const rest = rows
      .filter(
        (r) => !PINNED.includes(r.animal.id) && r.topRec!.urgency === "high",
      )
      .sort((a, b) => b.topRec!.priority - a.topRec!.priority)
      .slice(0, 6);
    return [...pinned, ...rest];
  }, []);
}

function TodayList() {
  const { state, restore } = useDemo();
  const items = useTodayItems();
  const visible = items.filter((r) => !state.dismissed.includes(r.topRec!.id));
  const hidden = items.length - visible.length;
  const [showAll, setShowAll] = useState(false);
  const list = showAll ? visible : visible.slice(0, 6);

  return (
    <Card>
      <CardHeader
        title="À faire aujourd’hui"
        subtitle={`${visible.length} animaux méritent une attention · ${formatWeekday(TODAY)}`}
        action={
          <ButtonLink
            href="/clinique/animaux"
            variant="ghost"
            size="sm"
            iconRight={<ArrowUpRight size={14} />}
          >
            Tous les animaux
          </ButtonLink>
        }
      />
      <ul className="mt-3 divide-y divide-line">
        {list.map((r, i) => {
          const rec = r.topRec!;
          return (
            <li
              key={rec.id}
              className="animate-fade-up px-5 py-4"
              style={{ animationDelay: `${Math.min(i, 6) * 50}ms` }}
            >
              <div className="flex gap-4">
                <Link
                  href={`/clinique/animaux/${r.animal.id}`}
                  className="shrink-0"
                >
                  <PetAvatar animal={r.animal} size={48} />
                </Link>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <Link
                      href={`/clinique/animaux/${r.animal.id}`}
                      className="text-[15px] font-semibold tracking-tight hover:text-sage-700"
                    >
                      {r.animal.name}
                    </Link>
                    <span className="text-sm text-ink-muted">
                      {r.animal.breed} · {ageLabel(r.animal.birthDate)}
                    </span>
                    {rec.urgency === "high" && (
                      <Badge tone="rose" dot>
                        Prioritaire
                      </Badge>
                    )}
                  </div>
                  <p className="mt-0.5 text-[15px] text-ink">{rec.short}</p>
                  <p className="mt-0.5 line-clamp-1 text-[13px] text-ink-muted">
                    {rec.rationale}
                  </p>
                  <div className="mt-3">
                    <RecActionBar rec={rec} row={r} />
                  </div>
                </div>
              </div>
            </li>
          );
        })}
        {visible.length === 0 && (
          <li className="flex flex-col items-center gap-2 px-5 py-14 text-center">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-sage-50 text-sage-600">
              <CheckCircle2 size={22} />
            </span>
            <p className="font-semibold">Tout est à jour pour aujourd’hui</p>
            <p className="text-sm text-ink-muted">
              Les actions ignorées peuvent être restaurées ci-dessous.
            </p>
          </li>
        )}
      </ul>
      <div className="flex items-center justify-between border-t border-line px-5 py-3 text-[13px]">
        {visible.length > 6 ? (
          <button
            onClick={() => setShowAll((s) => !s)}
            className="font-medium text-sage-700 hover:underline"
          >
            {showAll
              ? "Réduire la liste"
              : `Voir les ${visible.length - 6} autres`}
          </button>
        ) : (
          <span className="text-ink-faint">
            Liste calculée par le moteur de recommandations
          </span>
        )}
        {hidden > 0 && (
          <button
            onClick={() => items.forEach((r) => restore(r.topRec!.id))}
            className="text-ink-muted hover:text-ink hover:underline"
          >
            Restaurer {hidden} action{hidden > 1 ? "s" : ""} ignorée
            {hidden > 1 ? "s" : ""}
          </button>
        )}
      </div>
    </Card>
  );
}

function PotentialCard() {
  const max = Math.max(...OPPORTUNITIES.map((o) => o.potential));
  return (
    <Card className="relative overflow-hidden rounded-[32px] border-transparent bg-butter lg:col-span-2">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-white/60 blur-3xl"
      />
      <div className="relative p-6 sm:p-7">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-medium text-ink-muted">
            Potentiel de CA à récupérer ce mois-ci
          </p>
          <Badge tone="neutral">Estimation fictive · maquette</Badge>
        </div>
        <div className="mt-3 flex flex-wrap items-end gap-x-6 gap-y-2">
          <p className="num text-[56px] font-semibold leading-none tracking-tight text-ink sm:text-[68px]">
            <CountUp value={TOTAL_POTENTIAL} format={(n) => euro(n)} />
          </p>
          <p className="pb-2 text-sm text-ink-muted">
            soit{" "}
            <span className="font-medium text-ink-soft">
              {CLINIC_STATS.recommendedActions} actions
            </span>{" "}
            recommandées, validées par vos vétérinaires
          </p>
        </div>
        <ul className="mt-6 grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
          {OPPORTUNITIES.map((o) => (
            <li key={o.category}>
              <Link href="/clinique/opportunites" className="group block">
                <div className="mb-1 flex items-center justify-between text-[13px]">
                  <span className="text-ink-soft group-hover:text-ink">
                    {o.category}
                  </span>
                  <span className="num font-medium text-ink">
                    {euro(o.potential)}
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-black/[0.05]">
                  <div
                    className="h-full rounded-full bg-sage-600 transition-all duration-700 group-hover:bg-sage-700"
                    style={{ width: `${(o.potential / max) * 100}%` }}
                  />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}

function ReturnCard() {
  return (
    <Card className="flex flex-col rounded-[32px] border-transparent bg-lilac">
      <CardHeader
        title="Taux de retour en clinique"
        subtitle="Animaux vus dans les 12 derniers mois"
      />
      <div className="px-5 pt-3">
        <p className="num text-4xl font-semibold tracking-tight">79,0 %</p>
        <p className="mt-1 inline-flex items-center gap-1 text-[13px] font-medium text-sage-700">
          <TrendingUp size={14} /> +7,8 pts en 12 mois
        </p>
      </div>
      <div className="mt-auto px-2 pb-3 pt-2">
        <ReturnRateChart />
      </div>
    </Card>
  );
}

function RequestsCard() {
  const { state } = useDemo();
  const items = state.notifications.slice(0, 4);
  return (
    <Card>
      <CardHeader
        title="Demandes des propriétaires"
        subtitle="Reçues depuis l’application Vita"
        action={
          <Badge tone="sage">
            {state.notifications.filter((n) => !n.read).length} nouvelles
          </Badge>
        }
      />
      <ul className="mt-2 divide-y divide-line">
        {items.map((n) => (
          <li key={n.id}>
            <Link
              href={`/clinique/animaux/${n.animalId}`}
              className="flex items-start gap-3 px-5 py-3 transition hover:bg-canvas"
            >
              <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-sage-100 text-sage-700">
                <CalendarCheck size={15} />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-medium">{n.title}</span>
                <span className="block text-[13px] leading-snug text-ink-muted">
                  {n.body}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <p className="border-t border-line px-5 py-3 text-xs text-ink-faint">
        Astuce démo : prenez un rendez-vous dans l’espace propriétaire, il
        apparaît ici instantanément.
      </p>
    </Card>
  );
}

export function Dashboard() {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="animate-fade-up">
          <p className="text-sm capitalize text-ink-muted">
            {formatWeekday(TODAY)}
          </p>
          <h1 className="mt-1 text-[34px] font-semibold leading-tight tracking-tight sm:text-[40px]">
            Bonjour Dr Vetter
          </h1>
          <p className="mt-1 text-[15px] text-ink-muted">
            <span className="font-medium text-ink-soft">
              {CLINIC_STATS.recommendedActions} actions
            </span>{" "}
            pour mieux accompagner vos patients ce mois-ci.
          </p>
        </div>
        <ButtonLink href="/clinique/campagnes" icon={<ShieldCheck size={16} />}>
          Lancer une campagne
        </ButtonLink>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <PotentialCard />
        <ReturnCard />
      </div>

      <section
        aria-label="Indicateurs clés"
        className="grid grid-cols-2 gap-3 lg:grid-cols-4"
      >
        {KPIS.map((k, i) => (
          <Link
            key={k.label}
            href={k.href}
            className={cn(
              "group animate-fade-up rounded-[26px] p-4 transition duration-200 hover:-translate-y-0.5 hover:shadow-lift sm:p-5",
              KPI_TONES[i % KPI_TONES.length],
            )}
            style={{ animationDelay: `${i * 40}ms` }}
          >
            <div className="flex items-center justify-between">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-white/80 text-ink-soft">
                <k.icon size={17} />
              </span>
              <ArrowUpRight
                size={15}
                className="text-ink-faint opacity-0 transition group-hover:opacity-100"
              />
            </div>
            <p className="num mt-4 text-[32px] font-semibold leading-none tracking-tight sm:text-[36px]">
              <CountUp value={k.value} />
            </p>
            <p className="mt-2 text-[13px] font-medium leading-snug text-ink-soft">
              {k.label}
            </p>
            <p className="mt-0.5 text-xs text-ink-faint">{k.hint}</p>
          </Link>
        ))}
      </section>

      <div className="grid items-start gap-4 xl:grid-cols-[1fr_380px]">
        <TodayList />
        <div className="space-y-4">
          <RequestsCard />
          <Card className="p-5">
            <div className="flex items-start gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-sage-50 text-sage-700">
                <Dog size={17} />
              </span>
              <div>
                <p className="text-sm font-semibold">
                  Un moteur de règles, pas un diagnostic
                </p>
                <p className="mt-1 text-[13px] leading-relaxed text-ink-muted">
                  Vita détecte des échéances et des écarts à partir de vos
                  données, puis vous les soumet. La décision médicale reste
                  toujours la vôtre.
                </p>
              </div>
            </div>
          </Card>
          <p className="px-1 text-xs text-ink-faint">
            <Scale size={12} className="mr-1 inline" />
            Base de démonstration navigable : {n0(
              repository.listRows().length,
            )}{" "}
            animaux sur {n0(CLINIC_STATS.activeAnimals)}.
          </p>
        </div>
      </div>
    </div>
  );
}
