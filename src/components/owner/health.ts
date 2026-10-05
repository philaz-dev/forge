import type { VaccineStatus } from "@/domain/types";

export const VACC_LABEL: Record<
  VaccineStatus,
  { label: string; tone: "sage" | "amber" | "rose" | "neutral" }
> = {
  a_jour: { label: "À jour", tone: "sage" },
  bientot: { label: "Rappel à prévoir", tone: "amber" },
  en_retard: { label: "À renouveler", tone: "rose" },
  realise: { label: "Réalisé", tone: "neutral" },
};
