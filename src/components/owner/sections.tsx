"use client";

import { useState } from "react";
import {
  Apple,
  Bone,
  Bug,
  CalendarCheck,
  Droplets,
  Leaf,
  MessageCircleHeart,
  Pill,
  Salad,
  ShieldCheck,
  Smile,
  Sparkles,
  Syringe,
  Heart,
  Baby,
  Scissors,
  Stethoscope,
  FlaskConical,
  ClipboardCheck,
  ArrowRight,
} from "lucide-react";
import type { Product } from "@/domain/types";
import { productsFor, type ProductPick } from "@/data/products";
import {
  lifeTimeline,
  upcoming,
  type LifeItem,
  type UpcomingItem,
} from "@/domain/engine/life";
import { weightDelta } from "@/domain/engine/weight";
import { formatDayMonth, formatMonthYear } from "@/lib/dates";
import { de, euro2, kg, signedKg } from "@/lib/format";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import { useDemo } from "@/store/demo-store";
import { WeightChart } from "@/components/clinic/charts";
import { useOwner } from "./owner-context";

export function OwnerTitle({
  children,
  sub,
  action,
}: {
  children: React.ReactNode;
  sub?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex items-end justify-between gap-3">
      <div>
        <h2 className="font-display text-[24px] font-light uppercase leading-tight tracking-wide text-ink">
          {children}
        </h2>
        {sub && <p className="mt-0.5 text-sm text-ink-muted">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

/* ------------------------------ À venir ---------------------------------- */

const UP_ICON: Record<UpcomingItem["kind"], typeof Bug> = {
  parasite: Bug,
  vaccine: Syringe,
  check: ClipboardCheck,
  appointment: CalendarCheck,
  postop: Stethoscope,
};

export function UpcomingSection({
  limit = 4,
  title = true,
}: {
  limit?: number;
  title?: boolean;
}) {
  const { pet, openBooking } = useOwner();
  const { state } = useDemo();
  const items = upcoming(pet, state.appointments, limit);
  return (
    <section>
      {title && (
        <OwnerTitle sub="Pour que rien ne vous échappe">
          À venir pour {pet.animal.name}
        </OwnerTitle>
      )}
      <div className="rounded-[32px] border border-cream-300/60 bg-white p-2 shadow-soft">
        <ol className="relative">
          {items.map((i, idx) => {
            const Icon = UP_ICON[i.kind];
            return (
              <li
                key={i.id}
                className={cn(
                  "flex items-center gap-4 rounded-2xl px-3 py-3.5",
                  i.kind === "appointment" && "bg-sage-50",
                )}
              >
                <span className="relative grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-cream-100 text-sage-700">
                  <Icon size={19} />
                  {idx === 0 && (
                    <span className="absolute -right-0.5 -top-0.5 h-3 w-3 animate-pulse-ring rounded-full bg-sage-500 ring-2 ring-white" />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-sage-700 first-letter:uppercase">
                    {i.when}
                  </p>
                  <p className="text-[16px] font-semibold leading-tight">
                    {i.title}
                  </p>
                  <p className="truncate text-[13px] text-ink-muted">
                    {formatDayMonth(i.date)} · {i.text}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
        <div className="p-2 pt-1">
          <Button
            className="w-full"
            size="lg"
            onClick={() => openBooking()}
            icon={<CalendarCheck size={17} />}
          >
            Prendre rendez-vous
          </Button>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ Poids ------------------------------------ */

export function WeightSection({ compact }: { compact?: boolean }) {
  const { pet, openAdvice } = useOwner();
  const a = pet.animal;
  const d12 = weightDelta(a.weights, 12);
  const last = a.weights[a.weights.length - 1]!;
  return (
    <section id="poids" className="scroll-mt-24">
      <OwnerTitle sub="Courbe simple, pesée après pesée">
        Le poids {de(a.name)}
      </OwnerTitle>
      <div className="rounded-[32px] border border-cream-300/60 bg-white p-5 shadow-soft">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="num font-display text-[48px] font-light leading-none tracking-tight">
              {kg(last.kg)}
            </p>
            <p className="mt-1 text-sm text-ink-muted">
              aujourd’hui · dernière pesée le {formatDayMonth(last.date)}
            </p>
          </div>
          {d12 && (
            <div className="rounded-2xl bg-cream-100 px-4 py-2.5 text-right">
              <p className="num text-xl font-semibold">{signedKg(d12.delta)}</p>
              <p className="text-xs text-ink-muted">sur 12 mois</p>
            </div>
          )}
        </div>
        <div className="-mx-2 mt-4">
          <WeightChart
            points={a.weights.slice(compact ? -6 : 0)}
            height={compact ? 170 : 220}
            simple
          />
        </div>
        {pet.weightWatch ? (
          <div className="mt-3 flex items-start gap-3 rounded-2xl bg-sage-50 p-4">
            <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white text-sage-700">
              <MessageCircleHeart size={16} />
            </span>
            <div className="flex-1">
              <p className="text-sm leading-relaxed text-ink-soft">
                Votre vétérinaire recommande de surveiller l’évolution du poids{" "}
                {de(a.name)}.
              </p>
              <Button
                className="mt-3"
                variant="primary"
                size="sm"
                onClick={() => openAdvice("poids")}
              >
                Demander conseil
              </Button>
            </div>
          </div>
        ) : (
          <p className="mt-3 rounded-2xl bg-sage-50 p-4 text-sm text-ink-soft">
            Le poids de {a.name} est stable. Une question ?{" "}
            <button
              className="font-medium text-sage-700 underline-offset-2 hover:underline"
              onClick={() => openAdvice()}
            >
              Demander conseil
            </button>
          </p>
        )}
      </div>
    </section>
  );
}

/* ------------------------------ Timeline --------------------------------- */

const LIFE_ICON: Record<LifeItem["kind"], typeof Heart> = {
  birth: Baby,
  consult: Stethoscope,
  vaccine: Syringe,
  check: ClipboardCheck,
  analysis: FlaskConical,
  surgery: Scissors,
  last: Heart,
};

const TL_TONES = [
  "bg-mint",
  "bg-butter",
  "bg-lilac",
  "bg-sky/60",
  "bg-blush/60",
  "bg-sand/70",
];

export function LifeTimeline() {
  const { pet } = useOwner();
  const items = lifeTimeline(pet.animal);
  return (
    <ol className="relative ml-1 space-y-2">
      <span
        aria-hidden
        className="absolute bottom-6 left-[27px] top-6 w-px bg-gradient-to-b from-sage-200 via-sage-300 to-sage-200"
      />
      {items.map((i, idx) => {
        const Icon = LIFE_ICON[i.kind];
        const last = idx === items.length - 1;
        return (
          <li
            key={i.id}
            className="relative flex animate-fade-up gap-4"
            style={{ animationDelay: `${idx * 70}ms` }}
          >
            <span
              className={cn(
                "z-10 mt-3 grid h-[54px] w-[54px] shrink-0 place-items-center rounded-full border-4 border-white",
                last
                  ? "bg-sun text-white shadow-lift"
                  : "bg-white text-sage-700 shadow-soft ring-1 ring-black/5",
              )}
            >
              <Icon size={20} />
            </span>
            <div
              className={cn(
                "mb-1 flex-1 rounded-[32px] px-5 py-4",
                TL_TONES[idx % TL_TONES.length],
              )}
            >
              <p className="num font-display text-[22px] font-light leading-none text-sage-700">
                {i.year}
              </p>
              <p className="mt-1.5 text-[16px] font-semibold leading-tight">
                {i.title}
              </p>
              <p className="mt-0.5 text-[13px] leading-snug text-ink-muted">
                {i.text}
              </p>
              {i.kind !== "birth" && (
                <p className="mt-1 text-[11px] capitalize text-ink-faint">
                  {formatMonthYear(i.date)}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/* ------------------------------ Produits --------------------------------- */

const PRODUCT_ICON: Record<Product["icon"], typeof Apple> = {
  bowl: Salad,
  tooth: Smile,
  shield: ShieldCheck,
  joint: Bone,
  drop: Droplets,
  leaf: Leaf,
  bone: Bone,
};
const TONE_BG: Record<Product["tone"], string> = {
  sage: "from-sage-100 to-sage-50 text-sage-700",
  sand: "from-cream-200 to-cream-100 text-amber-700",
  sky: "from-sky-100 to-sky-50 text-sky-600",
  rose: "from-rose-100 to-rose-50 text-rose-600",
};

export function ProductImage({
  product,
  className,
}: {
  product: Product;
  className?: string;
}) {
  const Icon = PRODUCT_ICON[product.icon];
  return (
    <div
      className={cn(
        "relative grid place-items-center overflow-hidden bg-gradient-to-br",
        TONE_BG[product.tone],
        className,
      )}
    >
      <div
        aria-hidden
        className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/50"
      />
      <div
        aria-hidden
        className="absolute -bottom-8 -left-4 h-24 w-24 rounded-full bg-white/40"
      />
      <Icon size={44} strokeWidth={1.5} className="relative" />
      <span className="absolute bottom-2 right-3 text-[10px] font-medium uppercase tracking-wider opacity-50">
        Photo produit
      </span>
    </div>
  );
}

export function ProductCard({
  pick,
  onOpen,
}: {
  pick: ProductPick;
  onOpen: () => void;
}) {
  const p = pick.product;
  return (
    <article className="flex w-[260px] shrink-0 snap-start flex-col overflow-hidden rounded-[32px] border border-cream-300/60 bg-white shadow-soft transition hover:shadow-lift sm:w-auto">
      <ProductImage product={p} className="h-36" />
      <div className="flex flex-1 flex-col p-4">
        <p className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-sage-700">
          <Sparkles size={11} /> Recommandé par votre clinique
        </p>
        <h3 className="mt-1.5 text-[16px] font-semibold leading-snug">
          {p.name}
        </h3>
        <p className="mt-0.5 text-[13px] text-ink-muted">{p.size}</p>
        <p className="mt-2 line-clamp-2 text-[13px] leading-snug text-ink-soft">
          {pick.reason}
        </p>
        <div className="mt-auto flex items-center justify-between pt-4">
          <p className="num text-lg font-semibold">{euro2(p.price)}</p>
          <Button
            size="sm"
            variant="soft"
            onClick={onOpen}
            iconRight={<ArrowRight size={14} />}
          >
            Voir le produit
          </Button>
        </div>
      </div>
    </article>
  );
}

export function ProductModal({
  pick,
  onClose,
}: {
  pick: ProductPick;
  onClose: () => void;
}) {
  const { pet } = useOwner();
  const { notify } = useDemo();
  const toast = useToast();
  const p = pick.product;
  return (
    <Modal
      open
      warm
      size="md"
      onClose={onClose}
      title={p.name}
      description={`${p.brandLine} · ${p.size}`}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Fermer
          </Button>
          <Button
            icon={<Pill size={15} />}
            onClick={() => {
              notify({
                kind: "produit",
                title: "Intérêt pour un produit",
                body: `${pet.owner.firstName} ${pet.owner.lastName} souhaite en savoir plus sur « ${p.name} » pour ${pet.animal.name}.`,
                animalId: pet.animal.id,
              });
              toast({
                title: "La clinique est prévenue",
                description:
                  "Vous pourrez le récupérer à votre prochaine visite. Pas de paiement dans cette version.",
              });
              onClose();
            }}
          >
            Demander à la clinique
          </Button>
        </>
      }
    >
      <ProductImage product={p} className="h-48 rounded-2xl" />
      <div className="mt-4 flex items-baseline justify-between">
        <p className="num font-display text-3xl font-light">{euro2(p.price)}</p>
        <span className="rounded-full bg-sage-100 px-3 py-1 text-xs font-medium text-sage-800">
          Recommandé par votre clinique
        </span>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-ink-soft">{p.why}</p>
      <div className="mt-4 rounded-2xl bg-sage-50 p-4">
        <p className="text-[13px] font-medium text-sage-800">
          Pourquoi pour {pet.animal.name} ?
        </p>
        <p className="mt-1 text-sm text-ink-soft">{pick.reason}</p>
      </div>
      <p className="mt-4 text-xs text-ink-faint">
        Fiche produit fictive · aucun paiement réel dans cette première version.
      </p>
    </Modal>
  );
}

export function ProductsSection({
  limit,
  title = true,
}: {
  limit?: number;
  title?: boolean;
}) {
  const { pet } = useOwner();
  const [open, setOpen] = useState<ProductPick | null>(null);
  const picks = productsFor(pet).slice(0, limit);
  return (
    <section>
      {title && (
        <OwnerTitle sub="Sélectionné avec votre vétérinaire">
          Recommandé pour {pet.animal.name}
        </OwnerTitle>
      )}
      <div className="no-scrollbar -mx-5 flex snap-x gap-3 overflow-x-auto px-5 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 md:grid-cols-3">
        {picks.map((p) => (
          <ProductCard key={p.product.id} pick={p} onOpen={() => setOpen(p)} />
        ))}
      </div>
      {open && <ProductModal pick={open} onClose={() => setOpen(null)} />}
    </section>
  );
}
