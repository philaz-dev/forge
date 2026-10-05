"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CornerDownLeft, Search, User } from "lucide-react";
import { repository } from "@/data/repository";
import { norm } from "@/lib/format";
import { cn } from "@/lib/cn";
import { PetAvatar } from "@/components/shared/pet-avatar";

/** Barre de recherche globale (⌘K / Ctrl+K) : animaux, propriétaires, race, téléphone, puce. */
export function GlobalSearch({ className }: { className?: string }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [cursor, setCursor] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const wrap = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    const t = norm(q.trim());
    if (!t) return [];
    const terms = t.split(/\s+/);
    return repository
      .listRows()
      .filter((r) => {
        const hay = norm(
          `${r.animal.name} ${r.animal.breed} ${r.owner.firstName} ${r.owner.lastName} ${r.owner.phone} ${r.animal.microchip}`,
        );
        return terms.every((x) => hay.includes(x));
      })
      .slice(0, 7);
  }, [q]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        input.current?.focus();
        setOpen(true);
      }
    };
    const onClick = (e: MouseEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, []);

  const go = (href: string) => {
    setOpen(false);
    setQ("");
    input.current?.blur();
    router.push(href);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursor((c) => Math.min(c + 1, results.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor((c) => Math.max(c - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const r = results[cursor];
      if (r) go(`/clinique/animaux/${r.animal.id}`);
      else if (q.trim())
        go(`/clinique/animaux?q=${encodeURIComponent(q.trim())}`);
    } else if (e.key === "Escape") {
      setOpen(false);
      input.current?.blur();
    }
  };

  return (
    <div ref={wrap} className={cn("relative", className)}>
      <Search
        size={16}
        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint"
      />
      <input
        ref={input}
        value={q}
        onChange={(e) => {
          setQ(e.target.value);
          setCursor(0);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        placeholder="Rechercher un animal, un propriétaire…"
        aria-label="Recherche globale"
        className="h-10 w-full rounded-xl border border-line bg-white pl-10 pr-14 text-sm shadow-soft outline-none transition placeholder:text-ink-faint focus:border-sage-400 focus:ring-4 focus:ring-sage-100"
      />
      <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-md border border-line bg-canvas px-1.5 py-0.5 text-[11px] font-medium text-ink-muted sm:block">
        ⌘K
      </kbd>

      {open && q.trim() && (
        <div className="absolute left-0 right-0 top-12 z-50 animate-scale-in overflow-hidden rounded-2xl border border-line bg-white p-1.5 shadow-pop">
          {results.length === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-ink-muted">
              Aucun résultat pour « {q} »
            </p>
          ) : (
            <>
              <p className="px-3 pb-1 pt-2 text-[11px] font-medium uppercase tracking-wider text-ink-faint">
                Animaux
              </p>
              {results.map((r, i) => (
                <button
                  key={r.animal.id}
                  onMouseEnter={() => setCursor(i)}
                  onClick={() => go(`/clinique/animaux/${r.animal.id}`)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left",
                    cursor === i ? "bg-sage-50" : "hover:bg-canvas",
                  )}
                >
                  <PetAvatar animal={r.animal} size={34} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-ink">
                      {r.animal.name}
                    </span>
                    <span className="block truncate text-xs text-ink-muted">
                      {r.animal.breed} · {r.owner.firstName} {r.owner.lastName}
                    </span>
                  </span>
                  {cursor === i && (
                    <CornerDownLeft size={14} className="text-ink-faint" />
                  )}
                </button>
              ))}
              <button
                onMouseEnter={() => setCursor(results.length)}
                onClick={() =>
                  go(`/clinique/animaux?q=${encodeURIComponent(q.trim())}`)
                }
                className={cn(
                  "mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm text-ink-soft",
                  cursor === results.length ? "bg-sage-50" : "hover:bg-canvas",
                )}
              >
                <User size={15} className="text-ink-faint" />
                Voir tous les résultats dans la liste des animaux
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
