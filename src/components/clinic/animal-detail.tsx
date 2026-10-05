"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  CalendarClock,
  Check,
  ClipboardCheck,
  Cpu,
  Download,
  FileText,
  FlaskConical,
  Info,
  Mail,
  Phone,
  Pill,
  Plus,
  Receipt,
  ShieldCheck,
  Stethoscope,
  Syringe,
  Sparkles,
  Tablets,
  Wheat,
} from "lucide-react";
import { repository } from "@/data/repository";
import { CLINIC } from "@/data/seed";
import type {
  AnimalDocument,
  AnimalRow,
  EventType,
  Recommendation,
  VaccineStatus,
} from "@/domain/types";
import { weightDelta } from "@/domain/engine/weight";
import {
  addMonths,
  ageLabel,
  formatLong,
  formatMonthYear,
  formatShort,
  relative,
} from "@/lib/dates";
import { kg, signedKg } from "@/lib/format";
import { cn } from "@/lib/cn";
import { Badge, statusTone, type Tone } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Chip, Segmented } from "@/components/ui/form";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import { PetAvatar } from "@/components/shared/pet-avatar";
import { useDemo } from "@/store/demo-store";
import { ContactModal, RecActionBar } from "./rec-actions";
import { WeightChart } from "./charts";

const TABS = [
  { key: "overview", label: "Vue d’ensemble" },
  { key: "weight", label: "Poids" },
  { key: "vaccines", label: "Vaccinations" },
  { key: "history", label: "Historique" },
  { key: "documents", label: "Documents" },
] as const;
type TabKey = (typeof TABS)[number]["key"];

const EVENT_META: Record<
  EventType,
  { label: string; icon: typeof Stethoscope; tone: Tone }
> = {
  consultation: { label: "Consultation", icon: Stethoscope, tone: "sage" },
  vaccination: { label: "Vaccination", icon: Syringe, tone: "sky" },
  analyse: { label: "Analyse", icon: FlaskConical, tone: "amber" },
  intervention: { label: "Intervention", icon: Activity, tone: "rose" },
  prescription: { label: "Prescription", icon: Pill, tone: "neutral" },
  controle: { label: "Contrôle", icon: ClipboardCheck, tone: "sage" },
};

const VACC_STATUS: Record<VaccineStatus, { label: string; tone: Tone }> = {
  a_jour: { label: "À jour", tone: "sage" },
  bientot: { label: "À renouveler bientôt", tone: "amber" },
  en_retard: { label: "En retard", tone: "rose" },
  realise: { label: "Réalisé", tone: "neutral" },
};

const DOC_META: Record<
  AnimalDocument["kind"],
  { label: string; icon: typeof FileText }
> = {
  ordonnance: { label: "Ordonnance", icon: Pill },
  analyse: { label: "Analyses", icon: FlaskConical },
  facture: { label: "Facture", icon: Receipt },
  "compte-rendu": { label: "Compte rendu", icon: FileText },
  certificat: { label: "Certificat", icon: ShieldCheck },
};

function Tile({
  icon: Icon,
  label,
  children,
  className,
}: {
  icon: typeof Info;
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-line bg-white p-4 shadow-soft",
        className,
      )}
    >
      <p className="mb-2 flex items-center gap-2 text-xs font-medium text-ink-muted">
        <Icon size={14} className="text-sage-600" /> {label}
      </p>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------------ */

function RecommendedActions({ row }: { row: AnimalRow }) {
  const { state } = useDemo();
  const [expanded, setExpanded] = useState(false);
  const active = row.recs.filter((r) => !state.dismissed.includes(r.id));
  const shown = expanded ? active : active.slice(0, 3);
  const ignored = row.recs.length - active.length;

  return (
    <Card className="overflow-hidden border-sage-200">
      <div className="flex items-start justify-between gap-3 bg-gradient-to-br from-sage-50 to-white px-5 py-4">
        <div className="flex items-start gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-sage-700 text-white">
            <Sparkles size={17} />
          </span>
          <div>
            <h2 className="text-[17px] font-semibold tracking-tight">
              Actions recommandées
            </h2>
            <p className="text-[13px] text-ink-muted">
              {active.length > 0
                ? `${active.length} suggestion${active.length > 1 ? "s" : ""} pour le suivi de ${row.animal.name}`
                : `Aucune action en attente pour ${row.animal.name}`}
            </p>
          </div>
        </div>
        {ignored > 0 && (
          <Badge tone="neutral">
            {ignored} ignorée{ignored > 1 ? "s" : ""}
          </Badge>
        )}
      </div>

      {active.length === 0 ? (
        <p className="px-5 py-8 text-center text-sm text-ink-muted">
          Le dossier est à jour. Le moteur surveille les prochaines échéances.
        </p>
      ) : (
        <ul className="divide-y divide-line">
          {shown.map((rec) => (
            <li key={rec.id} className="px-5 py-4">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-[15px] font-semibold">{rec.title}</h3>
                <Badge
                  tone={
                    rec.urgency === "high"
                      ? "rose"
                      : rec.urgency === "medium"
                        ? "amber"
                        : "neutral"
                  }
                >
                  {rec.urgency === "high"
                    ? "Prioritaire"
                    : rec.urgency === "medium"
                      ? "À planifier"
                      : "Suggestion"}
                </Badge>
                <Badge tone="sage">{rec.category}</Badge>
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                {rec.rationale}
              </p>
              <div className="mt-3">
                <RecActionBar
                  rec={rec}
                  row={row}
                  showDossier={false}
                  primaryLabel={rec.cta}
                />
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line bg-canvas/60 px-5 py-3">
        <p className="flex items-center gap-1.5 text-xs text-ink-muted">
          <Info size={13} /> Suggestions issues de règles et d’échéances — elles
          ne constituent pas un diagnostic. Le vétérinaire décide.
        </p>
        {active.length > 3 && (
          <button
            onClick={() => setExpanded((e) => !e)}
            className="text-[13px] font-medium text-sage-700 hover:underline"
          >
            {expanded ? "Réduire" : `Voir les ${active.length - 3} autres`}
          </button>
        )}
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------------ */

function Overview({ row }: { row: AnimalRow }) {
  const a = row.animal;
  const v = a.vaccinations[0]!;
  const vs = VACC_STATUS[v.status];
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      <Tile icon={CalendarClock} label="Âge">
        <p className="num text-2xl font-semibold">{ageLabel(a.birthDate)}</p>
        <p className="text-[13px] text-ink-muted">
          Né(e) en {formatMonthYear(a.birthDate)}
          {row.isSenior ? " · senior" : ""}
        </p>
      </Tile>
      <Tile icon={Activity} label="Poids actuel">
        <p className="num text-2xl font-semibold">{kg(row.weight)}</p>
        <p className="text-[13px] text-ink-muted">
          Pesée du {formatShort(a.weights[a.weights.length - 1]!.date)}
        </p>
      </Tile>
      <Tile icon={Syringe} label="Statut vaccination">
        <Badge tone={vs.tone} dot>
          {vs.label}
        </Badge>
        <p className="mt-2 text-[13px] text-ink-muted">
          Prochain rappel : {formatShort(v.nextDue)}{" "}
          <span className="text-ink-faint">({relative(v.nextDue)})</span>
        </p>
      </Tile>
      <Tile icon={Tablets} label="Traitements en cours">
        <ul className="space-y-2">
          {a.treatments.map((t) => (
            <li key={t.name}>
              <p className="text-sm font-medium">{t.name}</p>
              <p className="text-[13px] text-ink-muted">{t.detail}</p>
            </li>
          ))}
        </ul>
      </Tile>
      <Tile icon={Stethoscope} label="Dernière consultation">
        <p className="text-lg font-semibold">{formatLong(a.lastVisit)}</p>
        <p className="text-[13px] text-ink-muted">{relative(a.lastVisit)}</p>
      </Tile>
      <Tile icon={CalendarClock} label="Prochaine échéance">
        {row.nextDue && (
          <>
            <p className="text-lg font-semibold">{row.nextDue.label}</p>
            <p className="text-[13px] text-ink-muted">
              {formatLong(row.nextDue.date)} · {relative(row.nextDue.date)}
            </p>
          </>
        )}
      </Tile>
      <Tile icon={Wheat} label="Alimentation">
        <p className="text-sm leading-relaxed text-ink-soft">{a.diet}</p>
      </Tile>
      <Tile icon={AlertTriangle} label="Allergies & intolérances">
        <ul className="space-y-1">
          {a.allergies.map((x) => (
            <li key={x} className="text-sm text-ink-soft">
              {x}
            </li>
          ))}
        </ul>
      </Tile>
      <Tile
        icon={Info}
        label="Informations importantes"
        className="border-amber-100 bg-amber-50/60 sm:col-span-2 xl:col-span-1"
      >
        <p className="text-sm leading-relaxed text-ink-soft">
          {a.importantInfo}
        </p>
      </Tile>
    </div>
  );
}

/* ------------------------------------------------------------------------ */

function WeightTab({ row }: { row: AnimalRow }) {
  const a = row.animal;
  const [range, setRange] = useState<"1" | "3" | "all">("all");
  const last = a.weights[a.weights.length - 1]!;
  const points = useMemo(() => {
    if (range === "all") return a.weights;
    const from = addMonths(last.date, -(Number(range) * 12));
    const f = a.weights.filter((p) => p.date >= from);
    return f.length >= 2 ? f : a.weights.slice(-2);
  }, [a.weights, range, last.date]);

  const d12 = weightDelta(a.weights, 12);
  const d24 = weightDelta(a.weights, 24);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <Tile icon={Activity} label="Poids actuel">
          <p className="num text-3xl font-semibold">{kg(last.kg)}</p>
          <p className="text-[13px] text-ink-muted">{formatShort(last.date)}</p>
        </Tile>
        {d24 && (
          <Tile icon={Activity} label="Évolution">
            <p className="num text-3xl font-semibold">{signedKg(d24.delta)}</p>
            <p className="text-[13px] text-ink-muted">
              depuis {formatMonthYear(d24.from.date)}
            </p>
          </Tile>
        )}
        {d12 && (
          <Tile icon={Activity} label="Sur 12 mois">
            <p className="num text-3xl font-semibold">{signedKg(d12.delta)}</p>
            <p className="text-[13px] text-ink-muted">{`${d12.pct >= 0 ? "+" : "−"}${Math.abs(d12.pct).toFixed(1).replace(".", ",")} %`}</p>
          </Tile>
        )}
      </div>

      <Card>
        <CardHeader
          title="Courbe de poids"
          subtitle={`${a.weights.length} pesées enregistrées`}
          action={
            <Segmented
              value={range}
              onChange={setRange}
              options={[
                { value: "1", label: "1 an" },
                { value: "3", label: "3 ans" },
                { value: "all", label: "Tout" },
              ]}
            />
          }
        />
        <div className="px-3 pb-4 pt-2 sm:px-5">
          <WeightChart points={points} />
        </div>
        <div className="flex flex-wrap items-center gap-3 border-t border-line px-5 py-3">
          {row.weightWatch && (
            <Badge tone="amber" dot>
              Évolution à surveiller
            </Badge>
          )}
          <p className="text-xs text-ink-muted">
            Information calculée à partir des pesées enregistrées. Ce n’est pas
            un diagnostic : l’interprétation revient au vétérinaire.
          </p>
        </div>
      </Card>
    </div>
  );
}

/* ------------------------------------------------------------------------ */

function VaccinesTab({ row }: { row: AnimalRow }) {
  const a = row.animal;
  const latest = a.vaccinations[0]!;
  const s = VACC_STATUS[latest.status];
  return (
    <div className="space-y-4">
      <Card className="flex flex-wrap items-center justify-between gap-4 p-5">
        <div className="flex items-center gap-4">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-sage-50 text-sage-700">
            <ShieldCheck size={22} />
          </span>
          <div>
            <p className="text-sm text-ink-muted">Prochain rappel</p>
            <p className="text-xl font-semibold tracking-tight">
              {formatLong(latest.nextDue)}
            </p>
            <p className="text-[13px] text-ink-muted">
              {relative(latest.nextDue)}
            </p>
          </div>
        </div>
        <Badge tone={s.tone} dot className="text-[13px]">
          {s.label}
        </Badge>
      </Card>
      <Card className="p-5">
        <ol className="relative space-y-6 before:absolute before:bottom-2 before:left-[11px] before:top-2 before:w-px before:bg-line">
          {a.vaccinations.map((v) => {
            const st = VACC_STATUS[v.status];
            return (
              <li key={v.id} className="relative pl-10">
                <span
                  className={cn(
                    "absolute left-0 top-0.5 grid h-6 w-6 place-items-center rounded-full ring-4 ring-white",
                    v.isLatest
                      ? "bg-sage-700 text-white"
                      : "bg-sage-100 text-sage-700",
                  )}
                >
                  <Check size={13} strokeWidth={3} />
                </span>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-medium">{v.name}</p>
                    <p className="text-[13px] text-ink-muted">
                      {formatLong(v.date)} · {v.vet} · lot {v.batch}
                    </p>
                    <p className="mt-0.5 text-[13px] text-ink-muted">
                      Prochaine échéance : {formatShort(v.nextDue)}
                    </p>
                  </div>
                  <Badge tone={st.tone}>{st.label}</Badge>
                </div>
              </li>
            );
          })}
        </ol>
      </Card>
    </div>
  );
}

/* ------------------------------------------------------------------------ */

function HistoryTab({ row }: { row: AnimalRow }) {
  const [type, setType] = useState<EventType | "all">("all");
  const events = row.animal.history.filter(
    (e) => type === "all" || e.type === type,
  );
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Chip
          active={type === "all"}
          onClick={() => setType("all")}
          count={row.animal.history.length}
        >
          Tout
        </Chip>
        {(Object.keys(EVENT_META) as EventType[]).map((t) => {
          const n = row.animal.history.filter((e) => e.type === t).length;
          return n ? (
            <Chip
              key={t}
              active={type === t}
              onClick={() => setType(t)}
              count={n}
            >
              {EVENT_META[t].label}
            </Chip>
          ) : null;
        })}
      </div>
      <Card className="p-5">
        <ol className="relative space-y-5 before:absolute before:bottom-2 before:left-[15px] before:top-2 before:w-px before:bg-line">
          {events.map((e) => {
            const m = EVENT_META[e.type];
            return (
              <li key={e.id} className="relative pl-12">
                <span className="absolute left-0 top-0 grid h-8 w-8 place-items-center rounded-full bg-sage-50 text-sage-700 ring-4 ring-white">
                  <m.icon size={15} />
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone={m.tone}>{m.label}</Badge>
                  <span className="text-[13px] text-ink-muted">
                    {formatLong(e.date)}
                  </span>
                </div>
                <p className="mt-1 font-medium">{e.title}</p>
                <p className="text-[13px] leading-relaxed text-ink-muted">
                  {e.detail}
                </p>
                <p className="mt-0.5 text-xs text-ink-faint">{e.vet}</p>
              </li>
            );
          })}
        </ol>
      </Card>
    </div>
  );
}

/* ------------------------------------------------------------------------ */

function DocumentsTab({ row }: { row: AnimalRow }) {
  const toast = useToast();
  const [open, setOpen] = useState<AnimalDocument | null>(null);
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink-muted">
          {row.animal.documents.length} documents dans le dossier
        </p>
        <Button
          variant="secondary"
          size="sm"
          icon={<Plus size={14} />}
          onClick={() =>
            toast({
              title: "Import de document (démo)",
              description:
                "Dans la version connectée, les documents GMVet sont rattachés automatiquement.",
              tone: "info",
            })
          }
        >
          Ajouter un document
        </Button>
      </div>
      <Card className="divide-y divide-line">
        {row.animal.documents.map((d) => {
          const m = DOC_META[d.kind];
          return (
            <button
              key={d.id}
              onClick={() => setOpen(d)}
              className="flex w-full items-center gap-4 px-5 py-4 text-left transition first:rounded-t-2xl last:rounded-b-2xl hover:bg-canvas"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-sage-50 text-sage-700">
                <m.icon size={18} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium">
                  {d.title}
                </span>
                <span className="block text-[13px] text-ink-muted">
                  {m.label} · {formatShort(d.date)} · PDF {d.sizeKb} Ko
                </span>
              </span>
              <Download size={16} className="text-ink-faint" />
            </button>
          );
        })}
      </Card>
      {open && (
        <Modal
          open
          onClose={() => setOpen(null)}
          title={open.title}
          description={`${DOC_META[open.kind].label} · ${formatLong(open.date)}`}
          footer={
            <>
              <Button variant="ghost" onClick={() => setOpen(null)}>
                Fermer
              </Button>
              <Button
                icon={<Download size={15} />}
                onClick={() => {
                  toast({
                    title: "Téléchargement simulé",
                    description: "Aucun fichier réel dans la maquette.",
                  });
                  setOpen(null);
                }}
              >
                Télécharger
              </Button>
            </>
          }
        >
          <div className="rounded-2xl border border-line bg-canvas p-6">
            <p className="font-display text-xl">{CLINIC.name}</p>
            <p className="text-xs text-ink-muted">
              {CLINIC.address} · {CLINIC.postalCode} {CLINIC.city}
            </p>
            <hr className="my-4 border-line" />
            <p className="text-sm">
              <strong>Patient :</strong> {row.animal.name} — {row.animal.breed}
              <br />
              <strong>Propriétaire :</strong> {row.owner.firstName}{" "}
              {row.owner.lastName}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-ink-soft">
              {open.summary}
            </p>
            <div className="mt-6 space-y-2" aria-hidden>
              {[90, 75, 82, 60].map((w, i) => (
                <div
                  key={i}
                  className="h-2 rounded-full bg-black/[0.06]"
                  style={{ width: `${w}%` }}
                />
              ))}
            </div>
            <p className="mt-6 text-xs text-ink-faint">
              Document fictif généré pour la démonstration.
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------------ */

export function AnimalDetail({ id }: { id: string }) {
  const row = repository.getRow(id);
  const [tab, setTab] = useState<TabKey>("overview");
  const [contact, setContact] = useState(false);
  const toast = useToast();
  if (!row) return <p>Animal introuvable.</p>;
  const a = row.animal;
  const o = row.owner;

  const fallback: Recommendation = row.topRec ?? {
    id: `${a.id}:contact`,
    animalId: a.id,
    kind: "retour_clinique",
    category: "Prévention",
    urgency: "low",
    priority: 0,
    title: "Prendre des nouvelles",
    short: "Prendre des nouvelles",
    rationale: "",
    cta: "Contacter",
    estimatedValue: 0,
  };

  return (
    <div className="space-y-6">
      <Link
        href="/clinique/animaux"
        className="inline-flex items-center gap-1.5 text-sm text-ink-muted transition hover:text-ink"
      >
        <ArrowLeft size={15} /> Tous les animaux
      </Link>

      {/* Hero */}
      <Card className="overflow-hidden">
        <div className="grid md:grid-cols-[300px_1fr]">
          <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[300px]">
            <PetAvatar animal={a} variant="portrait" />
            {!a.photoUrl && (
              <span className="absolute left-4 top-4 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-medium text-ink-muted backdrop-blur">
                Illustration · photo à importer
              </span>
            )}
          </div>
          <div className="flex flex-col p-6 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm text-ink-muted">
                  {a.species === "chien" ? "Chien" : "Chat"}
                </p>
                <h1 className="text-[40px] font-semibold uppercase leading-none tracking-tight sm:text-5xl">
                  {a.name}
                </h1>
                <p className="mt-2 text-lg text-ink-soft">{a.breed}</p>
              </div>
              <Badge
                tone={statusTone(row.status.key)}
                dot
                className="text-[13px]"
              >
                {row.status.label}
              </Badge>
            </div>

            <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
              {[
                { k: "Âge", v: ageLabel(a.birthDate) },
                {
                  k: "Sexe",
                  v: (
                    <span>
                      {a.sex === "M" ? "Mâle" : "Femelle"}
                      {a.neutered ? " · stérilisé(e)" : ""}
                    </span>
                  ),
                },
                { k: "Poids", v: kg(row.weight) },
                {
                  k: "Identification",
                  v: (
                    <span className="inline-flex items-center gap-1.5 text-sm">
                      <Cpu size={14} />
                      {a.microchip.slice(0, 13)}…
                    </span>
                  ),
                },
              ].map((x) => (
                <div key={x.k}>
                  <dt className="text-xs text-ink-muted">{x.k}</dt>
                  <dd className="num mt-0.5 text-[17px] font-medium">{x.v}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-6 flex flex-wrap items-center gap-4 rounded-2xl bg-canvas p-4">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-sage-100 text-sm font-semibold text-sage-800">
                {o.firstName[0]}
                {o.lastName[0]}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-ink-muted">Propriétaire</p>
                <p className="font-semibold">
                  {o.firstName} {o.lastName}
                </p>
                <p className="text-[13px] text-ink-muted">
                  {o.phone} · {o.email}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  icon={<Phone size={14} />}
                  onClick={() =>
                    toast({
                      title: `Appel de ${o.firstName} (simulé)`,
                      description: o.phone,
                      tone: "info",
                    })
                  }
                >
                  Appeler
                </Button>
                <Button
                  size="sm"
                  variant="soft"
                  icon={<Mail size={14} />}
                  onClick={() => setContact(true)}
                >
                  Écrire
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <RecommendedActions row={row} />

      {/* Onglets */}
      <div>
        <div
          role="tablist"
          className="no-scrollbar mb-5 flex gap-1 overflow-x-auto border-b border-line"
        >
          {TABS.map((t) => (
            <button
              key={t.key}
              role="tab"
              aria-selected={tab === t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                "relative whitespace-nowrap px-4 py-3 text-sm font-medium transition",
                tab === t.key ? "text-ink" : "text-ink-muted hover:text-ink",
              )}
            >
              {t.label}
              {tab === t.key && (
                <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-sage-700" />
              )}
            </button>
          ))}
        </div>
        <div key={tab} className="animate-fade-up">
          {tab === "overview" && <Overview row={row} />}
          {tab === "weight" && <WeightTab row={row} />}
          {tab === "vaccines" && <VaccinesTab row={row} />}
          {tab === "history" && <HistoryTab row={row} />}
          {tab === "documents" && <DocumentsTab row={row} />}
        </div>
      </div>

      {contact && (
        <ContactModal
          open
          onClose={() => setContact(false)}
          rec={fallback}
          row={row}
        />
      )}
    </div>
  );
}
