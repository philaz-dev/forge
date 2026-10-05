"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BellRing,
  Check,
  CheckCircle2,
  Mail,
  MessageSquare,
  PenLine,
  Rocket,
  Send,
  ShieldAlert,
  Smartphone,
} from "lucide-react";
import {
  CAMPAIGNS,
  CHANNEL_LABEL,
  getCampaign,
  renderTemplate,
} from "@/data/campaigns";
import { repository } from "@/data/repository";
import type { AnimalRow, Channel } from "@/domain/types";
import { ageLabel, formatShort } from "@/lib/dates";
import { n0 } from "@/lib/format";
import { cn } from "@/lib/cn";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Chip, Field, Input, Select, Textarea } from "@/components/ui/form";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import { PetAvatar } from "@/components/shared/pet-avatar";
import { useDemo } from "@/store/demo-store";
import { CAMPAIGN_ICON } from "./campaigns";

const CH_ICON: Record<Channel, typeof Mail> = {
  email: Mail,
  sms: MessageSquare,
  app: Smartphone,
};

function Preview({
  channel,
  subject,
  body,
  row,
}: {
  channel: Channel;
  subject: string;
  body: string;
  row: AnimalRow;
}) {
  if (channel === "email") {
    return (
      <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-soft">
        <div className="border-b border-line bg-canvas/70 px-4 py-3 text-xs text-ink-muted">
          <p>
            <span className="text-ink-faint">De :</span> Clinique des Tilleuls ·{" "}
            <span className="text-ink-faint">À :</span> {row.owner.email}
          </p>
          <p className="mt-1 text-sm font-semibold text-ink">
            {renderTemplate(subject, row)}
          </p>
        </div>
        <p className="whitespace-pre-line px-5 py-5 text-sm leading-relaxed text-ink-soft">
          {renderTemplate(body, row)}
        </p>
        <div className="border-t border-line px-5 py-4">
          <span className="inline-flex h-9 items-center rounded-xl bg-sage-700 px-4 text-sm font-medium text-white">
            Prendre rendez-vous
          </span>
        </div>
      </div>
    );
  }
  if (channel === "sms") {
    return (
      <div className="rounded-2xl bg-canvas p-5">
        <p className="mb-2 text-center text-xs text-ink-faint">
          SMS · {row.owner.phone}
        </p>
        <div className="max-w-[88%] rounded-2xl rounded-bl-md bg-white px-4 py-3 text-sm leading-relaxed shadow-soft">
          {renderTemplate(body, row)}
        </div>
      </div>
    );
  }
  return (
    <div className="rounded-3xl bg-gradient-to-b from-sage-100 to-cream-100 p-5">
      <div className="mx-auto max-w-[340px] rounded-2xl bg-white/90 p-4 shadow-lift backdrop-blur">
        <div className="mb-2 flex items-center gap-2 text-[11px] text-ink-muted">
          <span className="grid h-5 w-5 place-items-center rounded-md bg-sage-700 text-white">
            <BellRing size={11} />
          </span>
          VITA · maintenant
        </div>
        <p className="text-sm font-semibold">{renderTemplate(subject, row)}</p>
        <p className="mt-0.5 text-[13px] leading-snug text-ink-muted">
          {renderTemplate(body, row)}
        </p>
      </div>
    </div>
  );
}

export function CampaignDetail({ id }: { id: string }) {
  const c = getCampaign(id);
  const { state, sendCampaign } = useDemo();
  const toast = useToast();
  const sample = useMemo(
    () => (c ? repository.listRows().filter(c.match) : []),
    [c],
  );
  const [excluded, setExcluded] = useState<string[]>([]);
  const [composing, setComposing] = useState(false);
  const [channels, setChannels] = useState<Channel[]>(
    c?.defaultChannels ?? ["email"],
  );
  const [active, setActive] = useState<Channel>(
    c?.defaultChannels[0] ?? "email",
  );
  const [previewId, setPreviewId] = useState(sample[0]?.animal.id ?? "");
  const [tpl, setTpl] = useState(c?.template);
  const [editing, setEditing] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [sending, setSending] = useState(false);
  const [progress, setProgress] = useState(0);

  if (!c || !tpl) return <p>Campagne introuvable.</p>;
  const Icon = CAMPAIGN_ICON[c.icon];
  const sent = state.campaignsSent[c.id];
  const recipients = Math.max(0, c.count - excluded.length);
  const previewRow =
    sample.find((r) => r.animal.id === previewId) ?? sample[0]!;

  const toggleChannel = (ch: Channel) => {
    setChannels((cur) => {
      const next = cur.includes(ch)
        ? cur.filter((x) => x !== ch)
        : [...cur, ch];
      if (next.length === 0) return cur;
      if (!next.includes(active)) setActive(next[0]!);
      else if (!cur.includes(ch)) setActive(ch);
      return next;
    });
  };

  const channelBody = (ch: Channel) =>
    ch === "email"
      ? tpl.email.body
      : ch === "sms"
        ? tpl.sms.body
        : tpl.app.body;
  const channelSubject = (ch: Channel) =>
    ch === "email" ? tpl.email.subject : tpl.app.title;
  const setBody = (ch: Channel, v: string) =>
    setTpl((t) =>
      !t
        ? t
        : ch === "email"
          ? { ...t, email: { ...t.email, body: v } }
          : ch === "sms"
            ? { ...t, sms: { body: v } }
            : { ...t, app: { ...t.app, body: v } },
    );
  const setSubject = (ch: Channel, v: string) =>
    setTpl((t) =>
      !t
        ? t
        : ch === "email"
          ? { ...t, email: { ...t.email, subject: v } }
          : { ...t, app: { ...t.app, title: v } },
    );

  const launch = () => {
    setConfirm(false);
    setSending(true);
    setProgress(0);
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / 1800);
      setProgress(p);
      if (p < 1) requestAnimationFrame(tick);
      else {
        setSending(false);
        sendCampaign(c.id, recipients, channels);
        toast({
          title: `Campagne « ${c.title} » simulée`,
          description: `${n0(recipients)} propriétaires · ${channels.map((x) => CHANNEL_LABEL[x]).join(", ")}. Aucun message réel n'a été envoyé.`,
        });
      }
    };
    requestAnimationFrame(tick);
  };

  return (
    <div className="space-y-6">
      <Link
        href="/clinique/campagnes"
        className="inline-flex items-center gap-1.5 text-sm text-ink-muted transition hover:text-ink"
      >
        <ArrowLeft size={15} /> Toutes les campagnes
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-sage-50 text-sage-700">
            <Icon size={22} />
          </span>
          <div>
            <h1 className="text-[30px] font-semibold leading-tight tracking-tight">
              {c.title}
            </h1>
            <p className="mt-1 text-[15px] text-ink-muted">{c.description}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="num text-[44px] font-semibold leading-none tracking-tight">
            {n0(c.count)}
          </p>
          <p className="text-[13px] text-ink-muted">animaux concernés</p>
        </div>
      </div>

      <div className="grid items-start gap-5 xl:grid-cols-[1fr_500px]">
        {/* Animaux concernés */}
        <Card className="overflow-hidden">
          <CardHeader
            title="Animaux concernés"
            subtitle={`Extrait de démonstration : ${sample.length} sur ${n0(c.count)} — décochez pour exclure un propriétaire`}
          />
          <ul className="mt-3 divide-y divide-line">
            {sample.map((r) => {
              const off = excluded.includes(r.animal.id);
              return (
                <li
                  key={r.animal.id}
                  className={cn(
                    "flex items-center gap-3 px-5 py-3 transition",
                    off && "opacity-45",
                  )}
                >
                  <button
                    role="checkbox"
                    aria-checked={!off}
                    aria-label={`Inclure ${r.animal.name}`}
                    onClick={() =>
                      setExcluded((x) =>
                        off
                          ? x.filter((i) => i !== r.animal.id)
                          : [...x, r.animal.id],
                      )
                    }
                    className={cn(
                      "grid h-5 w-5 shrink-0 place-items-center rounded-md border transition",
                      off
                        ? "border-line bg-white"
                        : "border-sage-700 bg-sage-700 text-white",
                    )}
                  >
                    {!off && <Check size={13} strokeWidth={3} />}
                  </button>
                  <Link
                    href={`/clinique/animaux/${r.animal.id}`}
                    className="flex min-w-0 flex-1 items-center gap-3"
                  >
                    <PetAvatar animal={r.animal} size={36} />
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium">
                        {r.animal.name}{" "}
                        <span className="font-normal text-ink-muted">
                          · {r.animal.breed} · {ageLabel(r.animal.birthDate)}
                        </span>
                      </span>
                      <span className="block truncate text-[13px] text-ink-muted">
                        {r.owner.firstName} {r.owner.lastName} · dernière visite{" "}
                        {formatShort(r.animal.lastVisit)}
                      </span>
                    </span>
                  </Link>
                  <Badge tone="neutral" className="hidden sm:inline-flex">
                    {CHANNEL_LABEL[r.owner.preferredChannel]}
                  </Badge>
                </li>
              );
            })}
          </ul>
          <p className="border-t border-line bg-canvas/60 px-5 py-3 text-xs text-ink-muted">
            {excluded.length > 0
              ? `${excluded.length} propriétaire(s) exclu(s) → ${n0(recipients)} destinataires.`
              : `Les ${n0(c.count - sample.length)} autres animaux du segment sont inclus par défaut.`}
          </p>
        </Card>

        {/* Composer */}
        <div className="space-y-4 xl:sticky xl:top-24">
          {!composing && !sent && (
            <Card className="p-6 text-center">
              <span className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-sage-50 text-sage-700">
                <Rocket size={22} />
              </span>
              <h2 className="text-lg font-semibold tracking-tight">
                Prêt à prendre des nouvelles ?
              </h2>
              <p className="mx-auto mt-1 max-w-xs text-sm text-ink-muted">
                Choisissez les canaux, personnalisez le message et
                prévisualisez-le avant tout envoi.
              </p>
              <Button
                className="mt-5"
                size="lg"
                icon={<Rocket size={17} />}
                onClick={() => setComposing(true)}
              >
                Créer la campagne
              </Button>
            </Card>
          )}

          {sent && !sending && (
            <Card className="border-sage-200 bg-sage-50/50 p-6 text-center">
              <span className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-sage-700 text-white">
                <CheckCircle2 size={24} />
              </span>
              <h2 className="text-lg font-semibold">
                Campagne envoyée (simulation)
              </h2>
              <p className="mt-1 text-sm text-ink-muted">
                {n0(sent.count)} propriétaires ·{" "}
                {sent.channels.map((x) => CHANNEL_LABEL[x]).join(" + ")}
              </p>
              <p className="mt-3 text-xs text-ink-faint">
                Aucun message réel n’a été envoyé.
              </p>
            </Card>
          )}

          {sending && (
            <Card className="p-6">
              <p className="text-sm font-medium">
                Envoi en cours (simulation)…
              </p>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-black/[0.06]">
                <div
                  className="h-full rounded-full bg-sage-600"
                  style={{ width: `${progress * 100}%` }}
                />
              </div>
              <p className="num mt-2 text-xs text-ink-muted">
                {n0(Math.round(recipients * progress))} / {n0(recipients)}{" "}
                propriétaires
              </p>
            </Card>
          )}

          {composing && !sent && !sending && (
            <Card className="animate-fade-up">
              <CardHeader
                title="Votre campagne"
                subtitle="Canaux, message et aperçu personnalisé"
              />
              <div className="space-y-5 p-5">
                <div>
                  <p className="mb-2 text-[13px] font-medium text-ink-soft">
                    Canaux
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {(["email", "sms", "app"] as Channel[]).map((ch) => {
                      const I = CH_ICON[ch];
                      return (
                        <Chip
                          key={ch}
                          active={channels.includes(ch)}
                          onClick={() => toggleChannel(ch)}
                          icon={<I size={13} />}
                        >
                          {CHANNEL_LABEL[ch]}
                        </Chip>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <p className="text-[13px] font-medium text-ink-soft">
                      Aperçu pour
                    </p>
                    <div className="w-56">
                      <Select
                        aria-label="Animal de l'aperçu"
                        value={previewRow.animal.id}
                        onChange={(e) => setPreviewId(e.target.value)}
                      >
                        {sample.map((r) => (
                          <option key={r.animal.id} value={r.animal.id}>
                            {r.animal.name} — {r.owner.firstName}
                          </option>
                        ))}
                      </Select>
                    </div>
                  </div>
                  <div className="mb-3 flex gap-1 rounded-xl bg-black/[0.045] p-0.5">
                    {channels.map((ch) => (
                      <button
                        key={ch}
                        onClick={() => setActive(ch)}
                        className={cn(
                          "flex-1 rounded-[10px] px-3 py-1.5 text-[13px] font-medium transition",
                          active === ch
                            ? "bg-white shadow-soft"
                            : "text-ink-muted hover:text-ink",
                        )}
                      >
                        {CHANNEL_LABEL[ch]}
                      </button>
                    ))}
                  </div>
                  <Preview
                    channel={active}
                    subject={channelSubject(active)}
                    body={channelBody(active)}
                    row={previewRow}
                  />
                </div>

                <div>
                  <button
                    onClick={() => setEditing((e) => !e)}
                    className="inline-flex items-center gap-1.5 text-[13px] font-medium text-sage-700 hover:underline"
                  >
                    <PenLine size={14} />{" "}
                    {editing ? "Masquer l’éditeur" : "Modifier le message"}
                  </button>
                  {editing && (
                    <div className="mt-3 animate-fade-in space-y-3">
                      {active !== "sms" && (
                        <Field label={active === "email" ? "Objet" : "Titre"}>
                          <Input
                            value={channelSubject(active)}
                            onChange={(e) => setSubject(active, e.target.value)}
                          />
                        </Field>
                      )}
                      <Field
                        label="Message"
                        hint="Variables : {prenom} {animal} {age} {clinique}"
                      >
                        <Textarea
                          className="min-h-[150px]"
                          value={channelBody(active)}
                          onChange={(e) => setBody(active, e.target.value)}
                        />
                      </Field>
                    </div>
                  )}
                </div>
              </div>
              <div className="border-t border-line bg-canvas/60 p-5">
                <Button
                  size="lg"
                  className="w-full"
                  icon={<Send size={16} />}
                  onClick={() => setConfirm(true)}
                >
                  Envoyer à {n0(recipients)} propriétaires
                </Button>
                <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-ink-muted">
                  <ShieldAlert size={13} /> Mode démonstration : aucune
                  communication réelle ne sera envoyée.
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>

      {confirm && (
        <Modal
          open
          onClose={() => setConfirm(false)}
          title="Confirmer l’envoi"
          description="Récapitulatif de la campagne"
          footer={
            <>
              <Button variant="ghost" onClick={() => setConfirm(false)}>
                Retour
              </Button>
              <Button icon={<Send size={15} />} onClick={launch}>
                Lancer la simulation
              </Button>
            </>
          }
        >
          <dl className="divide-y divide-line rounded-2xl border border-line">
            {[
              ["Campagne", c.title],
              ["Destinataires", `${n0(recipients)} propriétaires`],
              ["Canaux", channels.map((x) => CHANNEL_LABEL[x]).join(", ")],
            ].map(([k, v]) => (
              <div
                key={k}
                className="flex justify-between gap-4 px-4 py-3 text-sm"
              >
                <dt className="text-ink-muted">{k}</dt>
                <dd className="text-right font-medium">{v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-[13px] text-amber-700">
            <ShieldAlert size={15} className="mt-0.5 shrink-0" />
            Maquette de démonstration : ce clic ne déclenche aucun e-mail, SMS
            ou notification réels.
          </p>
        </Modal>
      )}
    </div>
  );
}

export const CAMPAIGN_IDS = CAMPAIGNS.map((c) => c.id);
