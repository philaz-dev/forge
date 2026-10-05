import Link from "next/link";
import {
  ArrowUpRight,
  BellRing,
  HeartHandshake,
  LineChart,
  ShieldCheck,
  Smartphone,
  Stethoscope,
} from "lucide-react";
import { BrandMark } from "@/components/shared/brand";
import { Doodle } from "@/components/shared/doodles";
import { PetAvatar } from "@/components/shared/pet-avatar";
import { repository } from "@/data/repository";
import { CLINIC } from "@/data/seed";

const PILLARS = [
  {
    icon: BellRing,
    title: "Rappels intelligents",
    text: "Vaccins, bilans seniors, antiparasitaires, suivis post-opératoires : chaque échéance est détectée et soumise au vétérinaire.",
    tone: "bg-sand",
  },
  {
    icon: HeartHandshake,
    title: "Relation durable",
    text: "Les propriétaires suivent la santé de leur animal dans une application chaleureuse, et reviennent plus souvent.",
    tone: "bg-sand",
  },
  {
    icon: LineChart,
    title: "Revenus pertinents",
    text: "Prévention, nutrition, dentaire : des services utiles à l'animal, proposés au bon moment, sans vente agressive.",
    tone: "bg-sand",
  },
  {
    icon: ShieldCheck,
    title: "Jamais de diagnostic",
    text: "SuperVet détecte des règles et des échéances, puis les soumet au vétérinaire, qui décide toujours.",
    tone: "bg-sand",
  },
];

export default function Home() {
  const oslo = repository.getAnimal("a-oslo")!;
  const nala = repository.getAnimal("a-nala")!;
  return (
    <main className="relative overflow-hidden bg-white">
      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <BrandMark />
        <nav className="hidden items-center gap-1 rounded-full bg-black/[0.04] p-1 text-[13px] font-medium text-ink-soft md:flex">
          <span className="rounded-full bg-white px-4 py-1.5 shadow-soft">
            Accueil
          </span>
          <Link
            href="/clinique"
            className="rounded-full px-4 py-1.5 transition hover:bg-white/70"
          >
            Espace vétérinaire
          </Link>
          <Link
            href="/proprietaire"
            className="rounded-full px-4 py-1.5 transition hover:bg-white/70"
          >
            Espace propriétaire
          </Link>
        </nav>
        <span className="rounded-full bg-mint px-4 py-1.5 text-xs font-medium text-ink">
          Démo · données fictives
        </span>
      </header>

      <section className="relative mx-auto max-w-6xl px-6 pb-10 pt-6 sm:pt-12">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="relative animate-fade-up">
            <p className="mb-5 text-sm font-medium uppercase tracking-[0.18em] text-sage-700">
              {CLINIC.name} · {CLINIC.city}
            </p>
            <h1 className="font-display text-[38px] font-light leading-[1.12] tracking-tight text-ink sm:text-[54px]">
              Transformez les données de votre clinique en{" "}
              <span className="rounded-2xl bg-mint px-2 py-0.5">
                suivi personnalisé
              </span>
              , fidélisation et nouvelles opportunités de revenus
              <span className="text-ink-muted">
                {" "}
                — tout au long de la vie de l’animal.
              </span>
            </h1>
            <p className="mt-6 max-w-lg text-[17px] leading-relaxed text-ink-muted">
              SuperVet s’appuie sur les données de GMVet pour bâtir un CRM fondé
              sur le cycle de vie de chaque animal. Il ne remplace pas votre
              logiciel : il en révèle la valeur.
            </p>
            <Doodle
              kind="arrow"
              className="absolute -bottom-16 right-6 hidden h-20 w-28 text-sage-300 sm:block"
            />
          </div>

          <div className="relative mx-auto h-[440px] w-full max-w-md animate-fade-up [animation-delay:120ms] sm:h-[520px]">
            <div className="absolute inset-x-6 top-0 h-[400px] -rotate-2 overflow-hidden rounded-[44px] sm:h-[470px]">
              <PetAvatar animal={oslo} variant="portrait" />
            </div>
            <div className="absolute -right-2 bottom-6 w-44 rotate-3 animate-float overflow-hidden rounded-[32px] bg-white p-2 shadow-lift [animation-delay:1.4s]">
              <div className="aspect-square overflow-hidden rounded-[26px]">
                <PetAvatar animal={nala} variant="portrait" />
              </div>
              <p className="px-2 pb-1 pt-2 text-[12px] font-medium">
                Nala · rappel vaccin dans 12 jours
              </p>
            </div>
            <div className="absolute bottom-0 left-0 rounded-3xl bg-white px-4 py-3 shadow-lift">
              <p className="text-[11px] text-ink-muted">Oslo · 7 ans</p>
              <p className="text-sm font-medium">Bilan senior recommandé</p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-6xl px-6 pb-14">
        <div className="grid gap-4 md:grid-cols-2">
          <Link
            href="/clinique"
            className="group relative flex min-h-[210px] flex-col justify-between overflow-hidden rounded-[36px] bg-sand p-7 transition hover:-translate-y-0.5 hover:shadow-lift"
          >
            <div className="flex items-start justify-between">
              <Stethoscope size={26} className="text-ink-soft" />
              <span className="grid h-11 w-11 place-items-center rounded-full bg-white ring-1 ring-black/5 transition group-hover:rotate-12">
                <ArrowUpRight size={18} />
              </span>
            </div>
            <div>
              <p className="text-[13px] font-medium uppercase tracking-[0.16em] text-ink-muted">
                Pour la clinique
              </p>
              <p className="mt-1 font-display text-[30px] font-light uppercase leading-tight tracking-wide">
                Espace vétérinaire
              </p>
              <p className="mt-1 text-sm text-ink-muted">
                Dashboard, CRM, campagnes, opportunités
              </p>
            </div>
          </Link>
          <Link
            href="/proprietaire"
            className="group relative flex min-h-[210px] flex-col justify-between overflow-hidden rounded-[36px] bg-sand p-7 transition hover:-translate-y-0.5 hover:shadow-lift"
          >
            <div className="flex items-start justify-between">
              <Smartphone size={26} className="text-ink-soft" />
              <span className="grid h-11 w-11 place-items-center rounded-full bg-white ring-1 ring-black/5 transition group-hover:rotate-12">
                <ArrowUpRight size={18} />
              </span>
            </div>
            <div>
              <p className="text-[13px] font-medium uppercase tracking-[0.16em] text-ink-muted">
                Pour les familles
              </p>
              <p className="mt-1 font-display text-[30px] font-light uppercase leading-tight tracking-wide">
                Espace propriétaire
              </p>
              <p className="mt-1 text-sm text-ink-muted">
                L’application de Sophie et d’Oslo
              </p>
            </div>
            <Doodle
              kind="squiggle"
              className="absolute -bottom-2 right-8 h-14 w-24 text-sage-300"
            />
          </Link>
        </div>
      </section>

      <section className="relative mx-auto max-w-6xl px-6 pb-24">
        <h2 className="mb-6 max-w-2xl font-display text-3xl font-light leading-snug text-ink sm:text-4xl">
          Du simple rappel au suivi de toute une vie, nous accompagnons chaque
          animal.
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((p, i) => (
            <div
              key={p.title}
              className={`flex min-h-[300px] animate-fade-up flex-col justify-between rounded-[32px] p-6 ${p.tone}`}
              style={{ animationDelay: `${200 + i * 90}ms` }}
            >
              <p.icon size={28} strokeWidth={1.4} className="text-ink-soft" />
              <div>
                <h3 className="font-display text-[22px] font-light uppercase leading-tight tracking-wide">
                  {p.title}
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">
                  {p.text}
                </p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-10 text-center text-xs text-ink-faint">
          Données fictives · Aucun message réel n’est envoyé · Fiches de
          démonstration : Oslo, Nala, Marcel, Rio
        </p>
      </section>
    </main>
  );
}
