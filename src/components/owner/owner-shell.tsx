"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  Gift,
  HeartPulse,
  Home,
  Route,
  Stethoscope,
} from "lucide-react";
import { BrandMark } from "@/components/shared/brand";
import { PetAvatar } from "@/components/shared/pet-avatar";
import { cn } from "@/lib/cn";
import { useDemo } from "@/store/demo-store";
import { OwnerProvider, useOwner } from "./owner-context";

function Shell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { pets, pet } = useOwner();
  const { setActivePet } = useDemo();
  const nav = [
    { href: "/proprietaire", label: "Accueil", icon: Home, exact: true },
    { href: "/proprietaire/sante", label: "Santé", icon: HeartPulse },
    { href: "/proprietaire/parcours", label: "Parcours", icon: Route },
    {
      href: "/proprietaire/recommandations",
      label: `Pour ${pet.animal.name}`,
      icon: Gift,
    },
    {
      href: "/proprietaire/rendez-vous",
      label: "Rendez-vous",
      icon: CalendarDays,
    },
  ];
  const isActive = (n: (typeof nav)[number]) =>
    "exact" in n && n.exact ? pathname === n.href : pathname.startsWith(n.href);

  return (
    <div className="min-h-dvh bg-white pb-24 md:pb-0">
      <header className="sticky top-0 z-40 border-b border-black/5 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-4xl items-center gap-4 px-5">
          <BrandMark href="/proprietaire" />
          <nav className="ml-6 hidden items-center gap-1 md:flex">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                aria-current={isActive(n) ? "page" : undefined}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition",
                  isActive(n)
                    ? "bg-sage-700 text-white"
                    : "text-ink-muted hover:bg-cream-200/70 hover:text-ink",
                )}
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            {pets.length > 1 &&
              pets.map((p) => (
                <button
                  key={p.animal.id}
                  onClick={() => setActivePet(p.animal.id)}
                  aria-label={`Voir ${p.animal.name}`}
                  aria-pressed={p.animal.id === pet.animal.id}
                  className={cn(
                    "rounded-full p-0.5 transition",
                    p.animal.id === pet.animal.id
                      ? "ring-2 ring-sage-600 ring-offset-2 ring-offset-cream-50"
                      : "opacity-60 hover:opacity-100",
                  )}
                >
                  <PetAvatar animal={p.animal} size={34} />
                </button>
              ))}
            <Link
              href="/clinique"
              className="ml-2 hidden items-center gap-1.5 rounded-full border border-cream-300 bg-white/70 px-3 py-1.5 text-xs font-medium text-ink-muted transition hover:text-ink sm:inline-flex"
            >
              <Stethoscope size={13} /> Espace clinique
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-5 pb-12 pt-6 md:pt-10">
        {children}
      </main>

      <nav
        aria-label="Navigation principale"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-cream-300/60 bg-white/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden"
      >
        <ul className="mx-auto grid max-w-md grid-cols-5">
          {nav.map((n) => (
            <li key={n.href}>
              <Link
                href={n.href}
                aria-current={isActive(n) ? "page" : undefined}
                className={cn(
                  "flex flex-col items-center gap-1 px-1 pb-2 pt-2.5 text-[10.5px] font-medium transition",
                  isActive(n) ? "text-sage-700" : "text-ink-faint",
                )}
              >
                <span
                  className={cn(
                    "grid h-7 w-12 place-items-center rounded-full transition",
                    isActive(n) && "bg-mint",
                  )}
                >
                  <n.icon size={19} strokeWidth={isActive(n) ? 2.4 : 2} />
                </span>
                <span className="max-w-full truncate">{n.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export function OwnerShell({ children }: { children: ReactNode }) {
  return (
    <OwnerProvider>
      <Shell>{children}</Shell>
    </OwnerProvider>
  );
}
