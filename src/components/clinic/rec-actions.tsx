"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BellPlus,
  CheckCheck,
  EyeOff,
  Mail,
  MessageSquare,
  Send,
  Smartphone,
  FolderOpen,
} from "lucide-react";
import type { AnimalRow, Channel, Recommendation } from "@/domain/types";
import { draftMessage } from "@/domain/engine/messages";
import {
  TODAY,
  addDays,
  addMonths,
  formatLong,
  formatDayMonth,
} from "@/lib/dates";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Chip, Field, Input, Textarea } from "@/components/ui/form";
import { useToast } from "@/components/ui/toast";
import { useDemo } from "@/store/demo-store";
import { CHANNEL_LABEL } from "@/data/campaigns";
import { cn } from "@/lib/cn";

const CH_ICON: Record<Channel, typeof Mail> = {
  email: Mail,
  sms: MessageSquare,
  app: Smartphone,
};

export function ContactModal({
  open,
  onClose,
  rec,
  row,
}: {
  open: boolean;
  onClose: () => void;
  rec: Recommendation;
  row: AnimalRow;
}) {
  const { contact } = useDemo();
  const toast = useToast();
  const [channel, setChannel] = useState<Channel>(row.owner.preferredChannel);
  const [text, setText] = useState(() => draftMessage(rec, row));

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title={`Contacter ${row.owner.firstName} ${row.owner.lastName}`}
      description={`À propos de ${row.animal.name} · ${rec.title}`}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Annuler
          </Button>
          <Button
            icon={<Send size={15} />}
            onClick={() => {
              contact(rec.id, channel);
              toast({
                title: "Message prêt (envoi simulé)",
                description: `${CHANNEL_LABEL[channel]} à ${row.owner.firstName} — aucune communication réelle n'est envoyée dans la maquette.`,
              });
              onClose();
            }}
          >
            Envoyer
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {(["email", "sms", "app"] as Channel[]).map((c) => {
            const Icon = CH_ICON[c];
            return (
              <Chip
                key={c}
                active={channel === c}
                onClick={() => setChannel(c)}
                icon={<Icon size={13} />}
              >
                {CHANNEL_LABEL[c]}
              </Chip>
            );
          })}
        </div>
        <p className="text-xs text-ink-muted">
          {channel === "email" && `À : ${row.owner.email}`}
          {channel === "sms" && `À : ${row.owner.phone}`}
          {channel === "app" &&
            (row.owner.hasApp
              ? "Notification dans l'application Vita de la propriétaire"
              : "Ce propriétaire n'a pas encore l'application — la notification sera mise en attente.")}
        </p>
        <Field label="Message">
          <Textarea
            className="min-h-[220px]"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </Field>
      </div>
    </Modal>
  );
}

export function ReminderModal({
  open,
  onClose,
  rec,
  row,
}: {
  open: boolean;
  onClose: () => void;
  rec: Recommendation;
  row: AnimalRow;
}) {
  const { remind } = useDemo();
  const toast = useToast();
  const presets = [
    { label: "Demain", date: addDays(TODAY, 1) },
    { label: "Dans 1 semaine", date: addDays(TODAY, 7) },
    { label: "Dans 1 mois", date: addMonths(TODAY, 1) },
    { label: "Dans 3 mois", date: addMonths(TODAY, 3) },
  ];
  const [date, setDate] = useState(presets[1]!.date);
  const [note, setNote] = useState("");

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Programmer un rappel"
      description={`${row.animal.name} · ${rec.title}`}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Annuler
          </Button>
          <Button
            icon={<BellPlus size={15} />}
            onClick={() => {
              remind(rec.id, date, note);
              toast({
                title: "Rappel programmé",
                description: `${row.animal.name} réapparaîtra le ${formatLong(date)}.`,
              });
              onClose();
            }}
          >
            Programmer
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {presets.map((p) => (
            <Chip
              key={p.label}
              active={date === p.date}
              onClick={() => setDate(p.date)}
            >
              {p.label}
            </Chip>
          ))}
        </div>
        <Field label="Date du rappel">
          <Input
            type="date"
            value={date}
            min={TODAY}
            onChange={(e) => setDate(e.target.value)}
          />
        </Field>
        <Field label="Note interne (facultatif)">
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Ex. : rappeler en fin de journée, privilégier un créneau calme…"
          />
        </Field>
      </div>
    </Modal>
  );
}

/** Barre d'actions d'une recommandation (dashboard & fiche animal). */
export function RecActionBar({
  rec,
  row,
  showDossier = true,
  primaryLabel,
}: {
  rec: Recommendation;
  row: AnimalRow;
  showDossier?: boolean;
  primaryLabel?: string;
}) {
  const { state, dismiss, restore } = useDemo();
  const toast = useToast();
  const [contactOpen, setContactOpen] = useState(false);
  const [remindOpen, setRemindOpen] = useState(false);
  const contacted = state.contacted[rec.id];
  const reminder = state.reminders[rec.id];

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        {showDossier && (
          <Link
            href={`/clinique/animaux/${row.animal.id}`}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-line bg-white px-3 text-[13px] font-medium shadow-soft transition hover:bg-canvas"
          >
            <FolderOpen size={14} /> Voir le dossier
          </Link>
        )}
        <Button
          size="sm"
          variant={primaryLabel ? "primary" : "soft"}
          icon={<Send size={14} />}
          onClick={() => setContactOpen(true)}
        >
          {primaryLabel ?? "Contacter"}
        </Button>
        <Button
          size="sm"
          variant="secondary"
          icon={<BellPlus size={14} />}
          onClick={() => setRemindOpen(true)}
        >
          Programmer un rappel
        </Button>
        <Button
          size="sm"
          variant="ghost"
          icon={<EyeOff size={14} />}
          onClick={() => {
            dismiss(rec.id);
            toast({
              title: "Action ignorée",
              description: `${row.animal.name} · ${rec.title}`,
              tone: "info",
              action: { label: "Annuler", onClick: () => restore(rec.id) },
            });
          }}
        >
          Ignorer
        </Button>
        {contacted && (
          <span
            className={cn(
              "inline-flex items-center gap-1 text-xs font-medium text-sage-700",
            )}
          >
            <CheckCheck size={14} /> Contacté (
            {CHANNEL_LABEL[contacted.channel].toLowerCase()})
          </span>
        )}
        {reminder && (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700">
            <BellPlus size={13} /> Rappel le {formatDayMonth(reminder.date)}
          </span>
        )}
      </div>
      {contactOpen && (
        <ContactModal
          open
          onClose={() => setContactOpen(false)}
          rec={rec}
          row={row}
        />
      )}
      {remindOpen && (
        <ReminderModal
          open
          onClose={() => setRemindOpen(false)}
          rec={rec}
          row={row}
        />
      )}
    </>
  );
}
