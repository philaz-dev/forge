"use client";

import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Heart,
  Megaphone,
  Scale,
  ShieldCheck,
  Smile,
  Syringe,
} from "lucide-react";
import { CAMPAIGNS, CHANNEL_LABEL, type CampaignDef } from "@/data/campaigns";
import { repository } from "@/data/repository";
import { Badge } from "@/components/ui/badge";
import { PetAvatar } from "@/components/shared/pet-avatar";
import type { AnimalRow } from "@/domain/types";
import { useDemo } from "@/store/demo-store";
import { n0 } from "@/lib/format";
import { cn } from "@/lib/cn";

export const CAMPAIGN_ICON: Record<CampaignDef["icon"], typeof Syringe> = {
  syringe: Syringe,
  heart: Heart,
  clock: Clock,
  tooth: Smile,
  shield: ShieldCheck,
  scale: Scale,
};

export function CampaignsPage() {
  const { state } = useDemo();
  const rows = repository.listRows();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[32px] font-semibold tracking-tight">Campagnes</h1>
        <p className="mt-1 max-w-2xl text-[15px] text-ink-muted">
          Des segments prêts à l’emploi, construits automatiquement à partir du
          dossier de chaque animal. Choisissez une campagne, vérifiez les
          animaux concernés, personnalisez le message.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {CAMPAIGNS.map((c, i) => {
          const Icon = CAMPAIGN_ICON[c.icon];
          const sent = state.campaignsSent[c.id];
          const sample = rows.filter(c.match).slice(0, 4);
          return (
            <Link
              key={c.id}
              href={`/clinique/campagnes/${c.id}`}
              className="group flex animate-fade-up flex-col rounded-2xl border border-line bg-white p-5 shadow-soft transition duration-200 hover:-translate-y-0.5 hover:shadow-lift"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="flex items-start justify-between">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-sage-50 text-sage-700">
                  <Icon size={19} />
                </span>
                {sent ? (
                  <Badge tone="sage" dot>
                    Envoyée
                  </Badge>
                ) : (
                  <Badge tone="neutral">Brouillon prêt</Badge>
                )}
              </div>
              <h2 className="mt-5 text-[17px] font-semibold tracking-tight">
                {c.title}
              </h2>
              <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-ink-muted">
                {c.description}
              </p>
              <p className="num mt-5 text-[40px] font-semibold leading-none tracking-tight">
                {n0(c.count)}
              </p>
              <p className="mt-1 text-[13px] text-ink-muted">
                animaux concernés
              </p>
              <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
                <div className="flex -space-x-2">
                  {sample.map((r) => (
                    <PetDot key={r.animal.id} row={r} />
                  ))}
                </div>
                <span className="inline-flex items-center gap-1 text-[13px] font-medium text-sage-700">
                  {sent
                    ? `${sent.channels.map((x) => CHANNEL_LABEL[x]).join(" + ")}`
                    : "Ouvrir"}
                  <ArrowRight
                    size={14}
                    className="transition group-hover:translate-x-0.5"
                  />
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      <div
        className={cn(
          "flex items-start gap-3 rounded-2xl border border-dashed border-line bg-white/60 p-5",
        )}
      >
        <Megaphone size={18} className="mt-0.5 text-sage-700" />
        <p className="text-sm text-ink-muted">
          <span className="font-medium text-ink-soft">
            Mode démonstration :
          </span>{" "}
          les canaux Email, SMS et notification application sont simulés. Aucun
          message réel n’est envoyé. Branchement prévu : passerelle d’envoi
          (e-mail / SMS) et système de notifications.
        </p>
      </div>
      {Object.keys(state.campaignsSent).length > 0 && (
        <p className="flex items-center gap-2 text-sm text-sage-700">
          <CheckCircle2 size={16} /> {Object.keys(state.campaignsSent).length}{" "}
          campagne(s) « envoyée(s) » pendant cette démo.
        </p>
      )}
    </div>
  );
}

function PetDot({ row }: { row: AnimalRow }) {
  return (
    <span className="rounded-full ring-2 ring-white">
      <PetAvatar animal={row.animal} size={30} />
    </span>
  );
}
