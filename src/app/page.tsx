import Link from "next/link";
import {
  ArrowRight,
  BellRing,
  HeartHandshake,
  LineChart,
  ShieldCheck,
  Smartphone,
  Stethoscope,
} from "lucide-react";
import { BrandMark } from "@/components/shared/brand";
import { PetAvatar } from "@/components/shared/pet-avatar";
import { repository } from "@/data/repository";

const PILLARS = [
  {
    icon: BellRing,
    title: "Des rappels intelligents",
    text: "Vaccins, bilans seniors, antiparasitaires, suivis post-opératoires : chaque échéance est détectée et soumise au vétérinaire.",
  },
  {
    icon: HeartHandshake,
    title: "Une relation qui dure",
    text: "Les propriétaires suivent la santé de leur animal dans une application chaleureuse, et reviennent plus souvent.",
  },
  {
    icon: LineChart,
    title: "Des revenus pertinents",
    text: "Prévention, nutrition, dentaire : des services utiles à l'animal, proposés au bon moment, sans vente agressive.",
  },
];

export default function Home() {
  const oslo = repository.getAnimal("a-oslo")!;
  const nala = repository.getAnimal("a-nala")!;
  const marcel = repository.getAnimal("a-marcel")!;
  return (
    <main className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[640px] bg-[radial-gradient(60%_60%_at_70%_0%,#E4EDE7_0%,transparent_70%),radial-gradient(40%_50%_at_0%_20%,#F3ECDD_0%,transparent_70%)]"
      />
      <header className="relative mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <BrandMark />
        <span className="hidden rounded-full border border-line bg-white/70 px-3 py-1 text-xs font-medium text-ink-muted backdrop-blur sm:block">
          Maquette de démonstration · données fictives
        </span>
      </header>

      <section className="relative mx-auto max-w-6xl px-6 pb-10 pt-10 sm:pt-16">
        <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="animate-fade-up">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full bg-sage-100 px-3 py-1 text-xs font-medium text-sage-800">
              <span className="h-1.5 w-1.5 rounded-full bg-sage-600" />
              Le complément intelligent de votre logiciel métier
            </p>
            <h1 className="font-display text-[34px] font-medium leading-[1.1] tracking-tight text-ink sm:text-[46px]">
              Transformez les données de votre clinique en{" "}
              <em className="not-italic text-sage-700">suivi personnalisé</em>,
              fidélisation et nouvelles opportunités de revenus
              <span className="text-ink-muted">
                {" "}
                — tout au long de la vie de l’animal.
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-muted">
              Vita s’appuie sur les données de GMVet (import CSV / Excel
              aujourd’hui, API demain) pour bâtir un CRM fondé sur le cycle de
              vie de chaque animal. Il ne remplace pas votre logiciel : il en
              révèle la valeur.
            </p>

            <div className="mt-9 grid gap-3 sm:grid-cols-2">
              <Link
                href="/clinique"
                className="group relative overflow-hidden rounded-3xl bg-sage-700 p-6 text-white shadow-lift transition hover:bg-sage-800"
              >
                <Stethoscope className="mb-8 opacity-90" size={24} />
                <p className="text-xl font-semibold tracking-tight">
                  Espace vétérinaire
                </p>
                <p className="mt-1 text-sm text-white/70">
                  Dashboard, CRM, campagnes, opportunités
                </p>
                <ArrowRight
                  className="absolute right-5 top-5 transition group-hover:translate-x-1"
                  size={20}
                />
              </Link>
              <Link
                href="/proprietaire"
                className="group relative overflow-hidden rounded-3xl border border-line bg-cream-50 p-6 shadow-soft transition hover:shadow-lift"
              >
                <Smartphone className="mb-8 text-sage-700" size={24} />
                <p className="text-xl font-semibold tracking-tight text-ink">
                  Espace propriétaire
                </p>
                <p className="mt-1 text-sm text-ink-muted">
                  L’application de Sophie et d’Oslo
                </p>
                <ArrowRight
                  className="absolute right-5 top-5 text-sage-700 transition group-hover:translate-x-1"
                  size={20}
                />
              </Link>
            </div>
            <p className="mt-5 flex items-center gap-2 text-[13px] text-ink-muted">
              <ShieldCheck size={15} className="text-sage-600" />
              Vita ne pose jamais de diagnostic : il détecte des règles et des
              échéances, et les soumet au vétérinaire.
            </p>
          </div>

          <div className="relative mx-auto hidden h-[460px] w-full max-w-md animate-fade-up [animation-delay:120ms] lg:block">
            <div className="absolute left-0 top-6 h-64 w-64 -rotate-6 animate-float overflow-hidden rounded-[36px] border border-white bg-white shadow-lift">
              <PetAvatar animal={oslo} variant="portrait" />
              <div className="absolute inset-x-3 bottom-3 rounded-2xl bg-white/90 p-3 backdrop-blur">
                <p className="text-xs text-ink-muted">Oslo · 7 ans</p>
                <p className="text-sm font-medium">Bilan senior recommandé</p>
              </div>
            </div>
            <div className="absolute right-0 top-32 h-56 w-56 rotate-6 animate-float overflow-hidden rounded-[36px] border border-white bg-white shadow-lift [animation-delay:1.2s]">
              <PetAvatar animal={nala} variant="portrait" />
              <div className="absolute inset-x-3 bottom-3 rounded-2xl bg-white/90 p-3 backdrop-blur">
                <p className="text-xs text-ink-muted">Nala · 4 ans</p>
                <p className="text-sm font-medium">
                  Rappel vaccin dans 12 jours
                </p>
              </div>
            </div>
            <div className="absolute bottom-0 left-16 h-44 w-44 -rotate-3 animate-float overflow-hidden rounded-[32px] border border-white bg-white shadow-lift [animation-delay:2.4s]">
              <PetAvatar animal={marcel} variant="portrait" />
            </div>
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-6xl px-6 pb-24 pt-10">
        <div className="grid gap-4 md:grid-cols-3">
          {PILLARS.map((p, i) => (
            <div
              key={p.title}
              className="animate-fade-up rounded-3xl border border-line bg-white/80 p-6 shadow-soft backdrop-blur"
              style={{ animationDelay: `${200 + i * 90}ms` }}
            >
              <span className="mb-5 grid h-10 w-10 place-items-center rounded-xl bg-sage-50 text-sage-700">
                <p.icon size={19} />
              </span>
              <h3 className="text-[17px] font-semibold tracking-tight">
                {p.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
                {p.text}
              </p>
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
