"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowDown,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  Cat,
  Dog,
  FilterX,
  Search,
  SearchX,
} from "lucide-react";
import { repository } from "@/data/repository";
import {
  AGE_BANDS,
  DEFAULT_FILTERS,
  activeFilterCount,
  applyFilters,
  type AgeBand,
  type AnimalFilters,
} from "@/domain/engine/filters";
import type { AnimalRow } from "@/domain/types";
import { ageLabel, formatShort, relative } from "@/lib/dates";
import { kg, plural } from "@/lib/format";
import { cn } from "@/lib/cn";
import { Badge, statusTone } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Chip, Segmented, Select } from "@/components/ui/form";
import { Empty } from "@/components/ui/empty";
import { PetAvatar } from "@/components/shared/pet-avatar";

const PAGE_SIZE = 15;

type SortKey =
  "default" | "name" | "owner" | "age" | "weight" | "visit" | "due";

function fromParams(p: URLSearchParams): AnimalFilters {
  const age = p.get("age") as AgeBand | null;
  return {
    ...DEFAULT_FILTERS,
    q: p.get("q") ?? "",
    species:
      p.get("species") === "chien" || p.get("species") === "chat"
        ? (p.get("species") as "chien" | "chat")
        : "all",
    age: age && AGE_BANDS.some((b) => b.key === age) ? age : "all",
    breed: p.get("breed") ?? "all",
    senior: p.get("senior") === "1",
    vaccine: p.get("vaccine") === "1",
    notSeen: Number(p.get("notSeen") ?? 0) || 0,
    weight: p.get("weight") === "1",
    followUp: p.get("followUp") === "1",
    opportunity: p.get("opportunity") === "1",
  };
}

function SortHead({
  label,
  k,
  sort,
  onSort,
  className,
}: {
  label: string;
  k?: SortKey;
  sort: { key: SortKey; dir: 1 | -1 };
  onSort: (k: SortKey) => void;
  className?: string;
}) {
  const active = k && sort.key === k;
  return (
    <th
      scope="col"
      className={cn(
        "whitespace-nowrap px-4 py-3 text-left text-xs font-medium text-ink-muted",
        className,
      )}
      aria-sort={
        active ? (sort.dir === 1 ? "ascending" : "descending") : undefined
      }
    >
      {k ? (
        <button
          onClick={() => onSort(k)}
          className={cn(
            "inline-flex items-center gap-1 hover:text-ink",
            active && "text-ink",
          )}
        >
          {label}
          {active &&
            (sort.dir === 1 ? <ArrowUp size={12} /> : <ArrowDown size={12} />)}
        </button>
      ) : (
        label
      )}
    </th>
  );
}

export function AnimalList() {
  const router = useRouter();
  const params = useSearchParams();
  const paramsKey = params.toString();
  const [filters, setFilters] = useState<AnimalFilters>(() =>
    fromParams(params),
  );
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 }>({
    key: "default",
    dir: 1,
  });
  const [page, setPage] = useState(0);

  // Navigation entrante (dashboard, recherche globale) → recharge les filtres.
  useEffect(() => {
    setFilters(fromParams(new URLSearchParams(paramsKey)));
    setPage(0);
  }, [paramsKey]);

  const all = repository.listRows();
  const set = <K extends keyof AnimalFilters>(k: K, v: AnimalFilters[K]) => {
    setFilters((f) => ({
      ...f,
      [k]: v,
      ...(k === "species" ? { breed: "all" } : {}),
    }));
    setPage(0);
  };

  const breeds = useMemo(
    () =>
      Array.from(
        new Set(
          all
            .filter(
              (r) =>
                filters.species === "all" ||
                r.animal.species === filters.species,
            )
            .map((r) => r.animal.breed),
        ),
      ).sort((a, b) => a.localeCompare(b, "fr")),
    [all, filters.species],
  );

  const rows = useMemo(() => {
    const out = applyFilters(all, filters);
    const get: Record<SortKey, (r: AnimalRow) => string | number> = {
      // Par défaut : patients avec photo d'abord, puis ordre alphabétique.
      default: (r) => `${r.animal.photoUrl ? 0 : 1}${r.animal.name}`,
      name: (r) => r.animal.name,
      owner: (r) => `${r.owner.lastName} ${r.owner.firstName}`,
      age: (r) => r.ageMonths,
      weight: (r) => r.weight,
      visit: (r) => r.animal.lastVisit,
      due: (r) => r.nextDue?.date ?? "9999",
    };
    return [...out].sort((x, y) => {
      const a = get[sort.key](x);
      const b = get[sort.key](y);
      const c =
        typeof a === "number"
          ? a - (b as number)
          : String(a).localeCompare(String(b), "fr");
      return c * sort.dir;
    });
  }, [all, filters, sort]);

  const pages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const current = Math.min(page, pages - 1);
  const slice = rows.slice(current * PAGE_SIZE, (current + 1) * PAGE_SIZE);
  const nFilters = activeFilterCount(filters);

  const count = (pred: (r: AnimalRow) => boolean) => all.filter(pred).length;
  const onSort = (key: SortKey) =>
    setSort((s) =>
      s.key === key ? { key, dir: (s.dir * -1) as 1 | -1 } : { key, dir: 1 },
    );

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[32px] font-semibold tracking-tight">Animaux</h1>
          <p className="mt-1 text-[15px] text-ink-muted">
            Le CRM de cycle de vie : retrouvez chaque patient, son prochain
            rendez-vous et l’action la plus utile.
          </p>
        </div>
        <p className="text-sm text-ink-muted">
          Échantillon de démonstration ·{" "}
          {plural(all.length, "animal", "animaux")}
        </p>
      </div>

      <Card className="space-y-4 p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[240px] flex-1">
            <Search
              size={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint"
            />
            <input
              value={filters.q}
              onChange={(e) => set("q", e.target.value)}
              placeholder="Nom, propriétaire, race, téléphone, puce…"
              aria-label="Rechercher dans la liste"
              className="h-10 w-full rounded-xl border border-line bg-white pl-10 pr-3 text-sm shadow-soft outline-none transition placeholder:text-ink-faint focus:border-sage-400 focus:ring-4 focus:ring-sage-100"
            />
          </div>
          <Segmented
            value={filters.species}
            onChange={(v) => set("species", v)}
            options={[
              { value: "all", label: "Tous" },
              {
                value: "chien",
                label: (
                  <span className="inline-flex items-center gap-1.5">
                    <Dog size={14} />
                    Chiens
                  </span>
                ),
              },
              {
                value: "chat",
                label: (
                  <span className="inline-flex items-center gap-1.5">
                    <Cat size={14} />
                    Chats
                  </span>
                ),
              },
            ]}
          />
          <div className="w-44">
            <Select
              aria-label="Âge"
              value={filters.age}
              onChange={(e) => set("age", e.target.value as AgeBand)}
            >
              {AGE_BANDS.map((b) => (
                <option key={b.key} value={b.key}>
                  {b.label}
                </option>
              ))}
            </Select>
          </div>
          <div className="w-52">
            <Select
              aria-label="Race"
              value={filters.breed}
              onChange={(e) => set("breed", e.target.value)}
            >
              <option value="all">Toutes les races</option>
              {breeds.map((b) => (
                <option key={b}>{b}</option>
              ))}
            </Select>
          </div>
          <div className="w-52">
            <Select
              aria-label="Non vus depuis"
              value={String(filters.notSeen)}
              onChange={(e) => set("notSeen", Number(e.target.value))}
            >
              <option value="0">Dernière visite : tous</option>
              <option value="6">Pas vus depuis 6 mois</option>
              <option value="12">Pas vus depuis 12 mois</option>
              <option value="18">Pas vus depuis 18 mois</option>
              <option value="24">Pas vus depuis 24 mois</option>
            </Select>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Chip
            active={filters.senior}
            onClick={() => set("senior", !filters.senior)}
            count={count((r) => r.isSenior)}
          >
            Animaux seniors
          </Chip>
          <Chip
            active={filters.vaccine}
            onClick={() => set("vaccine", !filters.vaccine)}
            count={count((r) => r.vaccineDue)}
          >
            Vaccination à renouveler
          </Chip>
          <Chip
            active={filters.weight}
            onClick={() => set("weight", !filters.weight)}
            count={count((r) => r.weightWatch)}
          >
            Évolution du poids
          </Chip>
          <Chip
            active={filters.followUp}
            onClick={() => set("followUp", !filters.followUp)}
            count={count((r) => r.needsFollowUp)}
          >
            Suivi nécessaire
          </Chip>
          <Chip
            active={filters.opportunity}
            onClick={() => set("opportunity", !filters.opportunity)}
            count={count((r) => r.hasOpportunity)}
          >
            Opportunité commerciale
          </Chip>
          {nFilters > 0 || filters.q ? (
            <Button
              variant="ghost"
              size="sm"
              icon={<FilterX size={14} />}
              onClick={() => {
                setFilters(DEFAULT_FILTERS);
                setPage(0);
                router.replace("/clinique/animaux");
              }}
            >
              Réinitialiser
            </Button>
          ) : null}
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-line px-5 py-3 text-[13px]">
          <p className="font-medium text-ink">
            {plural(rows.length, "animal", "animaux")}
            {nFilters > 0 && (
              <span className="font-normal text-ink-muted">
                {" "}
                · {plural(nFilters, "filtre")} actif{nFilters > 1 ? "s" : ""}
              </span>
            )}
          </p>
          <p className="text-ink-faint">
            Cliquez sur une ligne pour ouvrir le dossier
          </p>
        </div>
        {rows.length === 0 ? (
          <Empty
            icon={<SearchX size={22} />}
            title="Aucun animal ne correspond"
            action={
              <Button
                variant="soft"
                onClick={() => {
                  setFilters(DEFAULT_FILTERS);
                  router.replace("/clinique/animaux");
                }}
              >
                Effacer les filtres
              </Button>
            }
          >
            Essayez d’élargir votre recherche ou de retirer un filtre.
          </Empty>
        ) : (
          <div className="scroll-thin overflow-x-auto">
            <table className="w-full min-w-[1180px] border-collapse text-sm">
              <thead className="bg-canvas/70">
                <tr className="border-b border-line">
                  <SortHead
                    label="Animal"
                    k="name"
                    sort={sort}
                    onSort={onSort}
                    className="pl-5"
                  />
                  <SortHead
                    label="Propriétaire"
                    k="owner"
                    sort={sort}
                    onSort={onSort}
                  />
                  <SortHead label="Espèce" sort={sort} onSort={onSort} />
                  <SortHead label="Race" sort={sort} onSort={onSort} />
                  <SortHead label="Âge" k="age" sort={sort} onSort={onSort} />
                  <SortHead
                    label="Poids"
                    k="weight"
                    sort={sort}
                    onSort={onSort}
                  />
                  <SortHead
                    label="Dernière consultation"
                    k="visit"
                    sort={sort}
                    onSort={onSort}
                  />
                  <SortHead
                    label="Prochaine échéance"
                    k="due"
                    sort={sort}
                    onSort={onSort}
                  />
                  <SortHead label="Statut" sort={sort} onSort={onSort} />
                  <SortHead
                    label="Action recommandée"
                    sort={sort}
                    onSort={onSort}
                    className="pr-5"
                  />
                </tr>
              </thead>
              <tbody>
                {slice.map((r) => (
                  <tr
                    key={r.animal.id}
                    tabIndex={0}
                    onClick={() =>
                      router.push(`/clinique/animaux/${r.animal.id}`)
                    }
                    onKeyDown={(e) =>
                      e.key === "Enter" &&
                      router.push(`/clinique/animaux/${r.animal.id}`)
                    }
                    className="group cursor-pointer border-b border-line/70 transition-colors last:border-0 hover:bg-sage-50/50 focus-visible:bg-sage-50/50"
                  >
                    <td className="py-3 pl-5 pr-4">
                      <div className="flex items-center gap-3">
                        <PetAvatar animal={r.animal} size={38} />
                        <span className="font-medium text-ink">
                          {r.animal.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-ink-soft">
                      {r.owner.firstName} {r.owner.lastName}
                    </td>
                    <td className="px-4 py-3 text-ink-soft">
                      <span className="inline-flex items-center gap-1.5">
                        {r.animal.species === "chien" ? (
                          <Dog size={14} className="text-ink-faint" />
                        ) : (
                          <Cat size={14} className="text-ink-faint" />
                        )}
                        {r.animal.species === "chien" ? "Chien" : "Chat"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-ink-soft">
                      {r.animal.breed}
                    </td>
                    <td className="num whitespace-nowrap px-4 py-3 text-ink-soft">
                      {ageLabel(r.animal.birthDate)}
                      {r.isSenior && (
                        <span className="ml-1.5 rounded bg-sage-100 px-1 py-px text-[10px] font-medium text-sage-800">
                          Senior
                        </span>
                      )}
                    </td>
                    <td className="num whitespace-nowrap px-4 py-3 text-ink-soft">
                      {kg(r.weight)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span className="block text-ink-soft">
                        {formatShort(r.animal.lastVisit)}
                      </span>
                      <span className="block text-xs text-ink-faint">
                        {relative(r.animal.lastVisit)}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      {r.nextDue && (
                        <>
                          <span className="block text-ink-soft">
                            {r.nextDue.label}
                          </span>
                          <span className="block text-xs text-ink-faint">
                            {relative(r.nextDue.date)}
                          </span>
                        </>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone={statusTone(r.status.key)} dot>
                        {r.status.label}
                      </Badge>
                    </td>
                    <td className="max-w-[230px] py-3 pl-4 pr-5">
                      {r.topRec ? (
                        <span className="line-clamp-2 text-[13px] font-medium leading-snug text-sage-800">
                          {r.topRec.short}
                        </span>
                      ) : (
                        <span className="text-[13px] text-ink-faint">
                          Aucune action
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {rows.length > PAGE_SIZE && (
          <div className="flex items-center justify-between border-t border-line px-5 py-3 text-[13px] text-ink-muted">
            <span>
              {current * PAGE_SIZE + 1}–
              {Math.min(rows.length, (current + 1) * PAGE_SIZE)} sur{" "}
              {rows.length}
            </span>
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant="secondary"
                disabled={current === 0}
                onClick={() => setPage(current - 1)}
                icon={<ChevronLeft size={14} />}
              >
                Précédent
              </Button>
              <span className="px-2">
                Page {current + 1} / {pages}
              </span>
              <Button
                size="sm"
                variant="secondary"
                disabled={current >= pages - 1}
                onClick={() => setPage(current + 1)}
                iconRight={<ChevronRight size={14} />}
              >
                Suivant
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
