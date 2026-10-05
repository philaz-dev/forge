import { ageLabel, formatShort } from "@/lib/dates";
import type { AnimalRow, Recommendation } from "@/domain/types";
import { CLINIC } from "@/data/seed";

/** Message pré-rédigé (ton chaleureux, jamais alarmiste) pour une recommandation. */
export function draftMessage(rec: Recommendation, r: AnimalRow): string {
  const hi = `Bonjour ${r.owner.firstName},\n\n`;
  const bye = `\n\nVous pouvez prendre rendez-vous directement auprès de la clinique.\n\nÀ très bientôt,\nL'équipe de ${CLINIC.name}`;
  const n = r.animal.name;
  switch (rec.kind) {
    case "bilan_senior":
      return `${hi}Cela fait plus d'un an qu'aucun bilan de santé n'a été réalisé pour ${n}. À ${ageLabel(r.animal.birthDate)}, un suivi régulier permet de mieux accompagner son évolution.${bye}`;
    case "vaccination":
      return `${hi}Le rappel de vaccination annuel de ${n} est prévu le ${formatShort(r.animal.nextVaccineDue)}. Il permet de maintenir sa protection tout au long de l'année.${bye}`;
    case "antiparasitaire":
      return `${hi}La prochaine protection antiparasitaire de ${n} approche. Nous pouvons vous conseiller le protocole le plus adapté à son mode de vie.${bye}`;
    case "suivi_poids":
      return `${hi}Les dernières pesées de ${n} montrent une évolution que nous souhaitons suivre avec vous. Un court rendez-vous permet de faire le point, sans inquiétude.${bye}`;
    case "controle_dentaire":
      return `${hi}L'hygiène dentaire contribue au confort de ${n} au quotidien. Nous vous proposons un contrôle de la bouche lors de votre prochaine visite.${bye}`;
    case "nutrition":
      return `${hi}Nous serions ravis d'échanger avec vous sur l'alimentation de ${n} : une ration bien adaptée accompagne chaque âge de la vie.${bye}`;
    case "post_op":
      return `${hi}Nous pensons à ${n} et prenons de ses nouvelles après son intervention. Le contrôle est prévu le ${formatShort(r.animal.postOp?.followUpDue ?? r.animal.lastVisit)}. N'hésitez pas à nous appeler si vous avez la moindre question.\n\nÀ très bientôt,\nL'équipe de ${CLINIC.name}`;
    case "controle_recommande":
      return `${hi}Lors de sa dernière consultation, un contrôle (${(r.animal.pendingControl?.label ?? "suivi").toLowerCase()}) avait été recommandé pour ${n}. Nous vous proposons de convenir d'un rendez-vous.${bye}`;
    case "retour_clinique":
      return `${hi}Nous n'avons pas eu le plaisir de voir ${n} depuis un moment. Un point de santé régulier permet de mieux l'accompagner à chaque âge de sa vie.${bye}`;
  }
}
