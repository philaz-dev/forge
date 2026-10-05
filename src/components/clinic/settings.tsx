"use client";

import { useState } from "react";
import {
  Building2,
  Check,
  MapPin,
  Database,
  CreditCard,
  CalendarCheck,
  KeyRound,
  BellRing,
  Plug,
} from "lucide-react";
import { CLINIC } from "@/data/seed";
import { Badge, type Tone } from "@/components/ui/badge";
import { Card, CardHeader } from "@/components/ui/card";
import { Switch } from "@/components/ui/form";
import { ImportCard } from "./import-card";

const INTEGRATIONS: {
  icon: typeof Plug;
  name: string;
  text: string;
  badge: string;
  tone: Tone;
}[] = [
  {
    icon: Plug,
    name: "GMVet — import CSV / Excel",
    text: "Import ponctuel des exports du logiciel métier.",
    badge: "Disponible",
    tone: "sage",
  },
  {
    icon: Plug,
    name: "GMVet — synchronisation API",
    text: "Synchronisation continue des dossiers.",
    badge: "Bientôt",
    tone: "neutral",
  },
  {
    icon: Database,
    name: "Supabase / PostgreSQL",
    text: "Stockage multi-cliniques et sécurisé.",
    badge: "Bientôt",
    tone: "neutral",
  },
  {
    icon: KeyRound,
    name: "Authentification",
    text: "Comptes vétérinaires et propriétaires.",
    badge: "Bientôt",
    tone: "neutral",
  },
  {
    icon: BellRing,
    name: "Notifications",
    text: "E-mail, SMS et notifications application.",
    badge: "Simulé",
    tone: "amber",
  },
  {
    icon: CalendarCheck,
    name: "Prise de rendez-vous",
    text: "Créneaux en ligne synchronisés avec l'agenda.",
    badge: "Simulé",
    tone: "amber",
  },
  {
    icon: CreditCard,
    name: "Stripe",
    text: "Paiement des produits et acomptes.",
    badge: "Bientôt",
    tone: "neutral",
  },
];

const RULES = [
  {
    key: "senior",
    label: "Bilan senior",
    text: "Chat ≥ 10 ans · chien grande race ≥ 7 ans · moyenne ≥ 9 ans · petite ≥ 10 ans, sans bilan depuis 12 mois.",
  },
  {
    key: "vacc",
    label: "Rappel de vaccination",
    text: "Échéance dans moins de 30 jours ou dépassée.",
  },
  {
    key: "para",
    label: "Antiparasitaire",
    text: "Prochaine prise dans moins de 21 jours ou dépassée.",
  },
  {
    key: "weight",
    label: "Évolution du poids",
    text: "Variation ≥ 5 % sur 18 mois (hors animaux en croissance).",
  },
  {
    key: "dental",
    label: "Contrôle dentaire",
    text: "Aucun contrôle depuis 18 mois, selon l'âge et la race.",
  },
  {
    key: "seen",
    label: "Animal non vu",
    text: "Aucune consultation depuis 12 mois (18 mois pour une campagne).",
  },
];

export function SettingsPage() {
  const [rules, setRules] = useState<Record<string, boolean>>(
    Object.fromEntries(RULES.map((r) => [r.key, true])),
  );
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-[32px] font-semibold tracking-tight">Paramètres</h1>
        <p className="mt-1 text-[15px] text-ink-muted">
          Données, connexions et règles de recommandation de la clinique.
        </p>
      </div>

      <section id="import" className="scroll-mt-24">
        <div className="mb-3">
          <h2 className="text-xl font-semibold tracking-tight">
            Importer mes données
          </h2>
          <p className="mt-0.5 text-sm text-ink-muted">
            Vita complète GMVet : exportez vos fiches depuis votre logiciel
            métier et déposez-les ici.
          </p>
        </div>
        <ImportCard />
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader
            title="Clinique"
            subtitle="Informations affichées aux propriétaires"
          />
          <div className="space-y-3 p-5">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-sage-50 text-sage-700">
                <Building2 size={20} />
              </span>
              <div>
                <p className="font-semibold">{CLINIC.name}</p>
                <p className="text-[13px] text-ink-muted">
                  {CLINIC.address} · {CLINIC.postalCode} {CLINIC.city}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {CLINIC.team.map((v) => (
                <Badge key={v} tone="neutral">
                  {v}
                </Badge>
              ))}
            </div>
            <p className="flex items-center gap-1.5 text-[13px] text-ink-muted">
              <MapPin size={14} /> {CLINIC.city} · horaires à renseigner
            </p>
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Règles de recommandation"
            subtitle="Transparentes et modifiables — jamais de diagnostic"
          />
          <ul className="divide-y divide-line">
            {RULES.map((r) => (
              <li key={r.key} className="flex items-start gap-3 px-5 py-3.5">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{r.label}</p>
                  <p className="text-[13px] leading-snug text-ink-muted">
                    {r.text}
                  </p>
                </div>
                <Switch
                  label={r.label}
                  checked={rules[r.key]!}
                  onChange={(v) => setRules((s) => ({ ...s, [r.key]: v }))}
                />
              </li>
            ))}
          </ul>
        </Card>
      </section>

      <section>
        <div className="mb-3">
          <h2 className="text-xl font-semibold tracking-tight">Connexions</h2>
          <p className="mt-0.5 text-sm text-ink-muted">
            L’architecture est prête à accueillir ces services.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {INTEGRATIONS.map((i) => (
            <Card key={i.name} className="flex gap-3 p-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-sage-50 text-sage-700">
                <i.icon size={18} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold leading-snug">{i.name}</p>
                  <Badge tone={i.tone}>
                    {i.tone === "sage" && <Check size={11} />}
                    {i.badge}
                  </Badge>
                </div>
                <p className="mt-1 text-[13px] leading-snug text-ink-muted">
                  {i.text}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
