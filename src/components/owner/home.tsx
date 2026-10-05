"use client";

import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import { PetAvatar } from "@/components/shared/pet-avatar";
import { Doodle, Sunburst } from "@/components/shared/doodles";
import { ageLabel, formatDayMonth, formatWeekdayShort } from "@/lib/dates";
import { de, kg, signedKg } from "@/lib/format";
import { weightDelta } from "@/domain/engine/weight";
import { ownerHealthSummary } from "@/domain/engine/life";
import { cn } from "@/lib/cn";
import { useDemo } from "@/store/demo-store";
import { useOwner } from "./owner-context";
import { ProductsSection, UpcomingSection, WeightSection } from "./sections";
import { VACC_LABEL } from "./health";

export function OwnerHome() {
  const { pet, ownerFirstName, openBooking } = useOwner();
  const { state } = useDemo();
  const a = pet.animal;
  const health = ownerHealthSummary(pet);
  const v = a.vaccinations[0]!;
  const vs = VACC_LABEL[v.status];
  const d12 = weightDelta(a.weights, 12);
  const nextApt = state.appointments
    .filter((x) => x.animalId === a.id)
    .sort((x, y) => (x.date < y.date ? -1 : 1))[0];

  const cards = [
    {
      href: "/proprietaire/sante",
      emoji: "❤️",
      title: "Santé",
      main: health.label,
      sub: health.sub,
      tone: "bg-mint",
    },
    {
      href: "/proprietaire/sante#vaccins",
      emoji: "💉",
      title: "Vaccins",
      main: vs.label,
      sub: `Prochain rappel le ${formatDayMonth(v.nextDue)}`,
      tone: "bg-sky/60",
    },
    {
      href: "/proprietaire/sante#poids",
      emoji: "⚖️",
      title: "Poids",
      main: kg(a.weights[a.weights.length - 1]!.kg),
      sub: d12 ? `${signedKg(d12.delta)} sur 12 mois` : "Stable",
      tone: "bg-butter",
    },
    nextApt
      ? {
          href: "/proprietaire/rendez-vous",
          emoji: "📅",
          title: "Prochain rendez-vous",
          main: `${formatWeekdayShort(nextApt.date)} ${nextApt.time.replace(":", "h")}`,
          sub: `${nextApt.reason}${nextApt.status === "demande" ? " · en attente" : ""}`,
          tone: "bg-lilac",
        }
      : {
          onClick: () => openBooking(),
          emoji: "📅",
          title: "Prochain rendez-vous",
          main: "Aucun prévu",
          sub: "Réserver un créneau",
          tone: "bg-lilac",
        },
  ] as const;

  return (
    <div className="space-y-10">
      <div className="animate-fade-up">
        <h1 className="font-display text-[38px] font-light leading-[1.05] tracking-tight sm:text-5xl">
          Bonjour {ownerFirstName}{" "}
          <span className="inline-block origin-[70%_70%] animate-float">
            👋
          </span>
        </h1>
        <p className="mt-2 font-display text-[26px] font-light italic text-sage-600 sm:text-3xl">
          Comment va {a.name} ?
        </p>
      </div>

      <div className="relative animate-fade-up [animation-delay:80ms]">
        <Sunburst className="absolute -right-3 -top-5 z-10 h-16 w-16 animate-float" />
        <Doodle
          kind="loop"
          className="absolute -left-2 -top-9 hidden h-14 w-24 text-lilac sm:block"
        />
        <div className="relative overflow-hidden rounded-[48px]">
          <div className="aspect-[5/4] sm:aspect-[16/9]">
            <PetAvatar animal={a} variant="portrait" />
          </div>
          <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-3 bg-gradient-to-t from-ink/45 via-ink/10 to-transparent p-5 pt-16 text-white">
            <div>
              <p className="font-display text-3xl font-light">{a.name}</p>
              <p className="text-sm text-white/80">{a.breed}</p>
            </div>
            <div className="flex gap-2">
              <span className="num rounded-full bg-white/90 px-4 py-1.5 text-sm font-semibold text-ink backdrop-blur">
                {ageLabel(a.birthDate)}
              </span>
              <span className="num rounded-full bg-white/90 px-4 py-1.5 text-sm font-semibold text-ink backdrop-blur">
                {kg(a.weights[a.weights.length - 1]!.kg)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {cards.map((c, i) => {
          const body = (
            <>
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-2xl shadow-soft">
                {c.emoji}
              </span>
              <p className="mt-5 text-[13px] font-medium text-ink-muted">
                {c.title}
              </p>
              <p className="mt-0.5 text-[17px] font-semibold leading-tight tracking-tight sm:text-xl">
                {c.main}
              </p>
              <p className="mt-1 text-[13px] leading-snug text-ink-muted">
                {c.sub}
              </p>
              <ArrowRight
                size={16}
                className="absolute right-4 top-4 text-ink-faint transition group-hover:translate-x-0.5 group-hover:text-sage-700"
              />
            </>
          );
          const cls = cn(
            "group relative animate-fade-up rounded-[32px] p-4 text-left shadow-soft transition duration-200 hover:-translate-y-0.5 hover:shadow-lift sm:p-5",
            c.tone,
          );
          const style = { animationDelay: `${140 + i * 60}ms` };
          return "href" in c && c.href ? (
            <Link key={c.title} href={c.href} className={cls} style={style}>
              {body}
            </Link>
          ) : (
            <button
              key={c.title}
              onClick={"onClick" in c ? c.onClick : undefined}
              className={cls}
              style={style}
            >
              {body}
            </button>
          );
        })}
      </div>

      <UpcomingSection limit={3} />
      <WeightSection compact />
      <ProductsSection limit={3} />

      <section>
        <Link
          href="/proprietaire/parcours"
          className="group flex items-center justify-between gap-4 rounded-[36px] bg-lilac p-6 text-ink transition hover:-translate-y-0.5 hover:shadow-lift"
        >
          <div>
            <p className="text-sm text-ink-muted">
              Depuis {ageLabel(a.birthDate)}
            </p>
            <p className="mt-1 font-display text-2xl font-light">
              Revivre la vie {de(a.name)}
            </p>
          </div>
          <span className="grid h-11 w-11 place-items-center rounded-full bg-white transition group-hover:translate-x-1">
            <CalendarDays size={20} />
          </span>
        </Link>
      </section>
    </div>
  );
}
