"use client";

import { useCallback, useRef, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  FileSpreadsheet,
  Loader2,
  UploadCloud,
  Wand2,
} from "lucide-react";
import { CLINIC_STATS } from "@/data/clinic";
import { n0 } from "@/lib/format";
import { cn } from "@/lib/cn";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CountUp } from "@/components/ui/count-up";
import { useToast } from "@/components/ui/toast";
import { useDemo } from "@/store/demo-store";

type Step = "idle" | "analyzing" | "preview" | "importing" | "done";

const DETECTED = [
  { label: "propriétaires détectés", value: CLINIC_STATS.owners },
  { label: "animaux détectés", value: CLINIC_STATS.activeAnimals },
  { label: "consultations détectées", value: CLINIC_STATS.consultations },
  { label: "vaccinations détectées", value: CLINIC_STATS.vaccinations },
];

const MAPPING = [
  ["Client · Nom / Prénom", "Propriétaire", "Reconnu"],
  ["Client · Mobile / E-mail", "Coordonnées", "Reconnu"],
  ["Animal · Nom, Espèce, Race", "Animal", "Reconnu"],
  ["Animal · Date de naissance, Sexe", "Animal", "Reconnu"],
  ["Actes · Date, Libellé, Praticien", "Consultations", "Reconnu"],
  ["Vaccins · Date, Produit, Rappel", "Vaccinations", "Reconnu"],
  ["Pesées · Date, Poids", "Courbe de poids", "Reconnu"],
  ["Facturation · Montant", "Documents", "Optionnel"],
];

const fmtSize = (b: number) =>
  b > 1e6
    ? `${(b / 1e6).toFixed(1).replace(".", ",")} Mo`
    : `${Math.max(1, Math.round(b / 1e3))} Ko`;

/** Import GMVet — SIMULATION : aucun fichier n'est lu ni envoyé. */
export function ImportCard() {
  const { state, markImported } = useDemo();
  const toast = useToast();
  const [step, setStep] = useState<Step>(state.imported ? "done" : "idle");
  const [file, setFile] = useState<{ name: string; size: number } | null>(null);
  const [over, setOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const input = useRef<HTMLInputElement>(null);

  const run = useCallback((ms: number, onDone: () => void) => {
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / ms);
      setProgress(p);
      if (p < 1) requestAnimationFrame(tick);
      else onDone();
    };
    requestAnimationFrame(tick);
  }, []);

  const accept = useCallback(
    (f: { name: string; size: number }) => {
      if (!/\.(csv|xlsx|xls)$/i.test(f.name)) {
        setError(
          "Format non pris en charge. Déposez un fichier CSV ou XLSX exporté depuis GMVet.",
        );
        return;
      }
      setError(null);
      setFile(f);
      setStep("analyzing");
      run(1700, () => setStep("preview"));
    },
    [run],
  );

  const reset = () => {
    setStep("idle");
    setFile(null);
    setProgress(0);
    setError(null);
  };

  if (step === "done") {
    return (
      <Card className="border-sage-200 bg-sage-50/50 p-8 text-center">
        <span className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-sage-700 text-white">
          <CheckCircle2 size={28} />
        </span>
        <h3 className="text-xl font-semibold tracking-tight">
          Import simulé avec succès
        </h3>
        <p className="mx-auto mt-1 max-w-md text-sm text-ink-muted">
          {n0(CLINIC_STATS.activeAnimals)} animaux et {n0(CLINIC_STATS.owners)}{" "}
          propriétaires sont prêts. Les recommandations ont été recalculées.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <ButtonLink href="/clinique" iconRight={<ArrowRight size={15} />}>
            Voir le tableau de bord
          </ButtonLink>
          <Button variant="secondary" onClick={reset}>
            Importer un autre fichier
          </Button>
        </div>
        <p className="mt-4 text-xs text-ink-faint">
          Simulation : aucune donnée n’a été modifiée.
        </p>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      {(step === "idle" || step === "analyzing") && (
        <div className="p-5 sm:p-6">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setOver(true);
            }}
            onDragLeave={() => setOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setOver(false);
              const f = e.dataTransfer.files?.[0];
              if (f) accept({ name: f.name, size: f.size });
            }}
            className={cn(
              "relative grid place-items-center rounded-2xl border-2 border-dashed px-6 py-14 text-center transition",
              over ? "border-sage-500 bg-sage-50" : "border-line bg-canvas/50",
              step === "analyzing" && "pointer-events-none",
            )}
          >
            {step === "idle" ? (
              <>
                <span className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-white text-sage-700 shadow-soft">
                  <UploadCloud size={26} />
                </span>
                <p className="text-lg font-semibold tracking-tight">
                  Déposez votre export GMVet ici
                </p>
                <p className="mt-1 text-sm text-ink-muted">
                  Formats acceptés : CSV, XLSX
                </p>
                <div className="mt-5 flex flex-wrap justify-center gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => input.current?.click()}
                  >
                    Parcourir mes fichiers
                  </Button>
                  <Button
                    variant="soft"
                    icon={<Wand2 size={15} />}
                    onClick={() =>
                      accept({
                        name: "export_gmvet_2026-10.xlsx",
                        size: 4_820_000,
                      })
                    }
                  >
                    Utiliser un fichier d’exemple
                  </Button>
                </div>
                <input
                  ref={input}
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  className="sr-only"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) accept({ name: f.name, size: f.size });
                    e.target.value = "";
                  }}
                />
              </>
            ) : (
              <div className="w-full max-w-sm">
                <Loader2
                  size={28}
                  className="mx-auto mb-4 animate-spin text-sage-600"
                />
                <p className="font-semibold">Analyse de {file?.name}…</p>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-black/[0.06]">
                  <div
                    className="h-full rounded-full bg-sage-600"
                    style={{ width: `${progress * 100}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-ink-muted">
                  {progress < 0.4
                    ? "Lecture des colonnes…"
                    : progress < 0.75
                      ? "Rapprochement propriétaires / animaux…"
                      : "Détection des consultations et vaccinations…"}
                </p>
              </div>
            )}
          </div>
          {error && (
            <p
              className="mt-3 flex items-center gap-2 text-sm text-rose-700"
              role="alert"
            >
              <AlertCircle size={15} /> {error}
            </p>
          )}
          <p className="mt-4 text-xs text-ink-faint">
            Démo : le fichier n’est ni lu ni envoyé. Prochainement :
            synchronisation continue via l’API GMVet.
          </p>
        </div>
      )}

      {(step === "preview" || step === "importing") && file && (
        <div className="animate-fade-up">
          <div className="flex items-center gap-3 border-b border-line px-5 py-4 sm:px-6">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-sage-50 text-sage-700">
              <FileSpreadsheet size={19} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{file.name}</p>
              <p className="text-xs text-ink-muted">
                {fmtSize(file.size)} · analyse terminée
              </p>
            </div>
            <button
              onClick={reset}
              disabled={step === "importing"}
              className="text-[13px] text-ink-muted hover:text-ink"
            >
              Changer de fichier
            </button>
          </div>

          <div className="grid grid-cols-2 gap-px bg-line lg:grid-cols-4">
            {DETECTED.map((d, i) => (
              <div
                key={d.label}
                className="animate-fade-up bg-white p-5"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <p className="num text-[30px] font-semibold leading-none tracking-tight sm:text-4xl">
                  <CountUp value={d.value} duration={1100} />
                </p>
                <p className="mt-2 text-[13px] text-ink-muted">{d.label}</p>
              </div>
            ))}
          </div>

          <div className="p-5 sm:p-6">
            <p className="mb-3 text-[13px] font-medium text-ink-soft">
              Correspondance des colonnes
            </p>
            <div className="overflow-hidden rounded-xl border border-line">
              {MAPPING.map(([from, to, st]) => (
                <div
                  key={from}
                  className="flex items-center gap-3 border-b border-line px-4 py-2.5 text-sm last:border-0"
                >
                  <span className="min-w-0 flex-1 truncate text-ink-soft">
                    {from}
                  </span>
                  <ArrowRight size={13} className="shrink-0 text-ink-faint" />
                  <span className="w-32 shrink-0 font-medium">{to}</span>
                  <span
                    className={cn(
                      "hidden w-20 shrink-0 text-right text-xs sm:block",
                      st === "Reconnu" ? "text-sage-700" : "text-ink-faint",
                    )}
                  >
                    {st === "Reconnu" ? "✓ Reconnu" : st}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-3 flex items-center gap-2 text-[13px] text-amber-700">
              <AlertCircle size={14} /> 23 propriétaires sans e-mail ni mobile :
              ils ne pourront pas recevoir de campagnes.
            </p>

            {step === "importing" ? (
              <div className="mt-6">
                <div className="h-2 overflow-hidden rounded-full bg-black/[0.06]">
                  <div
                    className="h-full rounded-full bg-sage-600"
                    style={{ width: `${progress * 100}%` }}
                  />
                </div>
                <p className="num mt-2 text-xs text-ink-muted">
                  Import en cours…{" "}
                  {n0(Math.round(CLINIC_STATS.activeAnimals * progress))} /{" "}
                  {n0(CLINIC_STATS.activeAnimals)} animaux
                </p>
              </div>
            ) : (
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Button
                  size="lg"
                  onClick={() => {
                    setStep("importing");
                    run(2400, () => {
                      markImported();
                      setStep("done");
                      toast({
                        title: "Import simulé terminé",
                        description: "Aucune donnée réelle n'a été modifiée.",
                      });
                    });
                  }}
                >
                  Importer
                </Button>
                <Button variant="ghost" onClick={reset}>
                  Annuler
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}
