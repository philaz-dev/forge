"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ExternalLink,
  LayoutDashboard,
  Megaphone,
  Menu,
  PawPrint,
  RotateCcw,
  Settings,
  Sparkles,
  X,
} from "lucide-react";
import { BrandMark } from "@/components/shared/brand";
import { cn } from "@/lib/cn";
import { CLINIC } from "@/data/seed";
import { useDemo } from "@/store/demo-store";
import { useToast } from "@/components/ui/toast";
import { GlobalSearch } from "./global-search";
import { NotificationBell } from "./notification-bell";

const NAV = [
  {
    href: "/clinique",
    label: "Tableau de bord",
    icon: LayoutDashboard,
    exact: true,
  },
  { href: "/clinique/animaux", label: "Animaux", icon: PawPrint },
  { href: "/clinique/campagnes", label: "Campagnes", icon: Megaphone },
  { href: "/clinique/opportunites", label: "Opportunités", icon: Sparkles },
  { href: "/clinique/parametres", label: "Paramètres", icon: Settings },
] as const;

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col gap-0.5">
      {NAV.map((n) => {
        const active =
          "exact" in n && n.exact
            ? pathname === n.href
            : pathname.startsWith(n.href);
        return (
          <Link
            key={n.href}
            href={n.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "group flex items-center gap-3 rounded-full px-4 py-2.5 text-sm font-medium transition",
              active
                ? "bg-mint text-sage-900"
                : "text-ink-muted hover:bg-black/[0.04] hover:text-ink",
            )}
          >
            <n.icon
              size={17}
              className={cn(
                active
                  ? "text-sage-700"
                  : "text-ink-faint group-hover:text-ink-muted",
              )}
            />
            {n.label}
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarFooter() {
  const { reset } = useDemo();
  const toast = useToast();
  return (
    <div className="mt-auto space-y-2 pt-6">
      <Link
        href="/proprietaire"
        className="flex items-center justify-between rounded-[22px] bg-butter px-4 py-3 text-sm font-medium text-ink transition hover:bg-cream-200"
      >
        <span>
          Voir l’espace propriétaire
          <span className="block text-xs font-normal text-ink-muted">
            Sophie &amp; Oslo
          </span>
        </span>
        <ExternalLink size={15} className="text-ink-muted" />
      </Link>
      <button
        onClick={() => {
          reset();
          toast({
            title: "Démo réinitialisée",
            description: "Actions, rendez-vous et campagnes remis à zéro.",
            tone: "info",
          });
        }}
        className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs text-ink-muted transition hover:bg-black/[0.04] hover:text-ink"
      >
        <RotateCcw size={13} /> Réinitialiser la démo
      </button>
    </div>
  );
}

export function ClinicShell({ children }: { children: ReactNode }) {
  const [drawer, setDrawer] = useState(false);
  const pathname = usePathname();

  useEffect(() => setDrawer(false), [pathname]);

  return (
    <div className="min-h-dvh bg-canvas lg:grid lg:grid-cols-[256px_1fr]">
      {/* Sidebar desktop */}
      <aside className="sticky top-0 hidden h-dvh flex-col border-r border-line bg-canvas px-4 py-5 lg:flex">
        <div className="mb-8 px-2">
          <BrandMark href="/clinique" />
        </div>
        <NavList />
        <SidebarFooter />
      </aside>

      {/* Drawer mobile / tablette */}
      {drawer && (
        <div className="fixed inset-0 z-[80] lg:hidden">
          <div
            className="absolute inset-0 animate-fade-in bg-ink/30 backdrop-blur-[2px]"
            onClick={() => setDrawer(false)}
          />
          <aside className="absolute inset-y-0 left-0 flex w-[280px] animate-slide-right flex-col bg-canvas px-4 py-5 shadow-pop">
            <div className="mb-8 flex items-center justify-between px-2">
              <BrandMark href="/clinique" />
              <button
                aria-label="Fermer le menu"
                onClick={() => setDrawer(false)}
                className="rounded-full p-2 hover:bg-black/5"
              >
                <X size={18} />
              </button>
            </div>
            <NavList onNavigate={() => setDrawer(false)} />
            <SidebarFooter />
          </aside>
        </div>
      )}

      <div className="min-w-0">
        <header className="sticky top-0 z-40 border-b border-line/70 bg-canvas/85 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-[1320px] items-center gap-3 px-4 sm:px-6 lg:px-10">
            <button
              aria-label="Ouvrir le menu"
              onClick={() => setDrawer(true)}
              className="grid h-10 w-10 place-items-center rounded-xl border border-line bg-white shadow-soft lg:hidden"
            >
              <Menu size={18} />
            </button>
            <GlobalSearch className="w-full max-w-md" />
            <div className="ml-auto flex items-center gap-3">
              <NotificationBell />
              <div className="hidden items-center gap-2.5 border-l border-line pl-4 sm:flex">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-sage-700 text-xs font-semibold text-white">
                  DV
                </span>
                <span className="leading-tight">
                  <span className="block text-sm font-medium">Dr Vetter</span>
                  <span className="block text-xs text-ink-muted">
                    {CLINIC.shortName}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-[1320px] px-4 pb-16 pt-8 sm:px-6 lg:px-10">
          {children}
        </main>
      </div>
    </div>
  );
}
