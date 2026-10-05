"use client";

import { useMemo, useState } from "react";
import { CalendarPlus, Check, PartyPopper } from "lucide-react";
import {
  TODAY,
  addDays,
  formatWeekday,
  formatWeekdayShort,
  toDate,
} from "@/lib/dates";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Chip, Field, Select } from "@/components/ui/form";
import { useToast } from "@/components/ui/toast";
import { useDemo } from "@/store/demo-store";
import { cn } from "@/lib/cn";
import { CLINIC } from "@/data/seed";
import { useOwner } from "./owner-context";

const REASONS = [
  "Rappel de vaccination",
  "Bilan de santé",
  "Contrôle annuel",
  "Point sur le poids",
  "Contrôle dentaire",
  "Antiparasitaire",
  "Autre demande",
];
const SLOTS = [
  "09:00",
  "09:30",
  "10:30",
  "11:15",
  "14:00",
  "15:30",
  "16:45",
  "17:30",
];

/** Rendez-vous FICTIF : l'état est local, la clinique est notifiée dans la démo. */
export function BookingModal({
  onClose,
  initialReason,
}: {
  onClose: () => void;
  initialReason?: string;
}) {
  const { pets, pet } = useOwner();
  const { book, setActivePet } = useDemo();
  const toast = useToast();
  const [petId, setPetId] = useState(pet.animal.id);
  const [reason, setReason] = useState(
    initialReason && REASONS.includes(initialReason)
      ? initialReason
      : "Bilan de santé",
  );
  const [vet, setVet] = useState("Pas de préférence");
  const dates = useMemo(() => {
    const out: string[] = [];
    for (let i = 2; out.length < 7; i++) {
      const d = addDays(TODAY, i);
      if (toDate(d).getUTCDay() !== 0) out.push(d);
    }
    return out;
  }, []);
  const [date, setDate] = useState(dates[1]!);
  const [time, setTime] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  // Disponibilités simulées, déterministes.
  const taken = (d: string, t: string) =>
    (d.charCodeAt(9) + t.charCodeAt(1) + t.charCodeAt(4)) % 4 === 0;
  const animal = pets.find((p) => p.animal.id === petId)!.animal;

  if (done)
    return (
      <Modal open onClose={onClose} title="Rendez-vous demandé" warm>
        <div className="py-4 text-center">
          <span className="mx-auto mb-4 grid h-16 w-16 animate-scale-in place-items-center rounded-full bg-sage-700 text-white">
            <PartyPopper size={28} />
          </span>
          <p className="font-display text-2xl">À très bientôt !</p>
          <p className="mx-auto mt-2 max-w-xs text-sm text-ink-muted">
            {animal.name} · {reason}
            <br />
            <span className="font-medium text-ink">
              {formatWeekday(date)} à {time?.replace(":", "h")}
            </span>
            <br />
            {vet === "Pas de préférence"
              ? "Avec l'un de nos vétérinaires"
              : vet}
          </p>
          <p className="mt-4 text-xs text-ink-faint">
            Démonstration : aucun rendez-vous réel n’a été créé.
          </p>
          <div className="mt-6 flex justify-center gap-2">
            <Button
              variant="secondary"
              onClick={() =>
                toast({
                  title: "Ajouté à votre calendrier (simulé)",
                  tone: "info",
                })
              }
              icon={<CalendarPlus size={15} />}
            >
              Ajouter au calendrier
            </Button>
            <Button onClick={onClose}>Terminer</Button>
          </div>
        </div>
      </Modal>
    );

  return (
    <Modal
      open
      onClose={onClose}
      warm
      title="Prendre rendez-vous"
      description="Choisissez un créneau, la clinique confirme sous quelques heures."
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Annuler
          </Button>
          <Button
            disabled={!time}
            icon={<Check size={15} />}
            onClick={() => {
              const ownerName = `${pet.owner.firstName} ${pet.owner.lastName}`;
              book(
                {
                  animalId: petId,
                  ownerId: pet.owner.id,
                  reason,
                  date,
                  time: time!,
                  vet: vet === "Pas de préférence" ? CLINIC.team[0] : vet,
                  status: "demande",
                  source: "proprietaire",
                },
                {
                  title: "Demande de rendez-vous",
                  body: `${ownerName} souhaite un créneau pour ${animal.name} (${reason.toLowerCase()}) — ${formatWeekdayShort(date)} à ${time!.replace(":", "h")}.`,
                },
              );
              setActivePet(petId);
              setDone(true);
            }}
          >
            Confirmer
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        {pets.length > 1 && (
          <div>
            <p className="mb-2 text-[13px] font-medium text-ink-soft">
              Pour qui ?
            </p>
            <div className="flex gap-2">
              {pets.map((p) => (
                <Chip
                  key={p.animal.id}
                  active={petId === p.animal.id}
                  onClick={() => setPetId(p.animal.id)}
                >
                  {p.animal.name}
                </Chip>
              ))}
            </div>
          </div>
        )}
        <Field label="Motif">
          <Select value={reason} onChange={(e) => setReason(e.target.value)}>
            {REASONS.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </Select>
        </Field>
        <Field label="Vétérinaire">
          <Select value={vet} onChange={(e) => setVet(e.target.value)}>
            <option>Pas de préférence</option>
            {CLINIC.team.slice(0, 3).map((v) => (
              <option key={v}>{v}</option>
            ))}
          </Select>
        </Field>
        <div>
          <p className="mb-2 text-[13px] font-medium text-ink-soft">Jour</p>
          <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
            {dates.map((d) => {
              const [wd, dn] = formatWeekdayShort(d).split(" ");
              const on = d === date;
              return (
                <button
                  key={d}
                  onClick={() => {
                    setDate(d);
                    setTime(null);
                  }}
                  className={cn(
                    "flex w-16 shrink-0 flex-col items-center rounded-2xl border py-2.5 transition",
                    on
                      ? "border-sage-700 bg-sage-700 text-white shadow-soft"
                      : "border-line bg-white hover:border-sage-300",
                  )}
                >
                  <span
                    className={cn(
                      "text-[11px] capitalize",
                      on ? "text-white/70" : "text-ink-muted",
                    )}
                  >
                    {wd}
                  </span>
                  <span className="num text-lg font-semibold">{dn}</span>
                </button>
              );
            })}
          </div>
        </div>
        <div>
          <p className="mb-2 text-[13px] font-medium text-ink-soft">Horaire</p>
          <div className="grid grid-cols-4 gap-2">
            {SLOTS.map((t) => {
              const off = taken(date, t);
              return (
                <button
                  key={t}
                  disabled={off}
                  onClick={() => setTime(t)}
                  className={cn(
                    "num h-10 rounded-xl border text-sm font-medium transition",
                    off &&
                      "border-transparent bg-black/[0.04] text-ink-faint line-through",
                    !off &&
                      time === t &&
                      "border-sage-700 bg-sage-700 text-white",
                    !off &&
                      time !== t &&
                      "border-line bg-white hover:border-sage-300",
                  )}
                >
                  {t.replace(":", "h")}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </Modal>
  );
}
