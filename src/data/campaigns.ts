import { ageLabel } from "@/lib/dates";
import type { AnimalRow, Channel, RecKind } from "@/domain/types";
import { CLINIC } from "./seed";

export interface MessageTemplate {
  email: { subject: string; body: string };
  sms: { body: string };
  app: { title: string; body: string };
}

export interface CampaignDef {
  id: string;
  title: string;
  description: string;
  /** Nombre d'animaux concernés dans la clinique (fictif). */
  count: number;
  icon: "syringe" | "heart" | "clock" | "tooth" | "shield" | "scale";
  match: (r: AnimalRow) => boolean;
  defaultChannels: Channel[];
  template: MessageTemplate;
}

const hasKind = (r: AnimalRow, k: RecKind) => r.recs.some((x) => x.kind === k);

const SIGN = "À très bientôt,\nL'équipe de {clinique}";
const CTA =
  "Vous pouvez prendre rendez-vous directement auprès de la clinique.";

export const CAMPAIGNS: CampaignDef[] = [
  {
    id: "vaccins",
    title: "Vaccins arrivant à échéance",
    description:
      "Animaux dont le rappel annuel arrive dans moins de 30 jours ou est dépassé.",
    count: 42,
    icon: "syringe",
    match: (r) => hasKind(r, "vaccination"),
    defaultChannels: ["email", "sms"],
    template: {
      email: {
        subject: "Le rappel de vaccination de {animal} approche",
        body: `Bonjour {prenom},\n\nLe rappel de vaccination annuel de {animal} arrive à échéance prochainement. Il permet de maintenir sa protection tout au long de l'année.\n\n${CTA}\n\n${SIGN}`,
      },
      sms: {
        body: "{clinique} : le rappel vaccin de {animal} approche. Prenez rendez-vous quand vous le souhaitez. À bientôt !",
      },
      app: {
        title: "Rappel vaccin pour {animal}",
        body: "L'échéance approche : réservez un créneau en un geste depuis l'application.",
      },
    },
  },
  {
    id: "senior",
    title: "Bilan senior",
    description:
      "Animaux seniors sans bilan de santé enregistré depuis plus de 12 mois.",
    count: 18,
    icon: "heart",
    match: (r) => hasKind(r, "bilan_senior"),
    defaultChannels: ["email", "app"],
    template: {
      email: {
        subject: "Prendre soin de {animal} : le bilan senior",
        body: `Bonjour {prenom},\n\nCela fait plus d'un an qu'aucun bilan de santé n'a été réalisé pour {animal}. À {age}, un suivi régulier permet de mieux accompagner son évolution.\n\n${CTA}\n\n${SIGN}`,
      },
      sms: {
        body: "{clinique} : {animal} a {age}, un bilan senior est conseillé. Prenez rendez-vous auprès de la clinique.",
      },
      app: {
        title: "Bilan senior pour {animal}",
        body: "À {age}, un bilan régulier aide à mieux l'accompagner. Choisissez votre créneau.",
      },
    },
  },
  {
    id: "inactifs",
    title: "Animaux non vus depuis 18 mois",
    description:
      "Animaux sans consultation enregistrée depuis au moins 18 mois.",
    count: 126,
    icon: "clock",
    match: (r) => r.monthsSinceVisit >= 18,
    defaultChannels: ["email"],
    template: {
      email: {
        subject: "Des nouvelles de {animal} ?",
        body: `Bonjour {prenom},\n\nNous n'avons pas eu le plaisir de voir {animal} depuis un moment. Un point de santé régulier permet de mieux l'accompagner à chaque âge de sa vie.\n\n${CTA}\n\n${SIGN}`,
      },
      sms: {
        body: "{clinique} : nous n'avons pas vu {animal} depuis un moment. Un petit point santé ? Prenez rendez-vous quand vous voulez.",
      },
      app: {
        title: "On pense à {animal} 🐾",
        body: "Un point santé régulier, ça compte. Réservez un créneau quand vous voulez.",
      },
    },
  },
  {
    id: "dentaire",
    title: "Prévention dentaire",
    description:
      "Animaux sans contrôle dentaire récent, selon l'âge et la race.",
    count: 73,
    icon: "tooth",
    match: (r) => hasKind(r, "controle_dentaire"),
    defaultChannels: ["email", "app"],
    template: {
      email: {
        subject: "L'hygiène dentaire de {animal}",
        body: `Bonjour {prenom},\n\nL'hygiène dentaire contribue au confort de {animal} au quotidien. Lors de votre prochaine visite, nous vous proposons un contrôle de la bouche et quelques conseils simples à appliquer à la maison.\n\n${CTA}\n\n${SIGN}`,
      },
      sms: {
        body: "{clinique} : un contrôle dentaire est conseillé pour {animal}. Prenez rendez-vous quand vous le souhaitez.",
      },
      app: {
        title: "Contrôle dentaire pour {animal}",
        body: "Un petit examen de la bouche et des conseils d'hygiène. Choisissez votre créneau.",
      },
    },
  },
  {
    id: "parasites",
    title: "Protection antiparasitaire",
    description:
      "Animaux dont le prochain antiparasitaire est à renouveler dans les 3 semaines.",
    count: 64,
    icon: "shield",
    match: (r) => hasKind(r, "antiparasitaire"),
    defaultChannels: ["sms", "app"],
    template: {
      email: {
        subject: "La protection antiparasitaire de {animal}",
        body: `Bonjour {prenom},\n\nLa prochaine prise antiparasitaire de {animal} approche. La clinique peut vous conseiller le protocole le plus adapté à son mode de vie.\n\n${CTA}\n\n${SIGN}`,
      },
      sms: {
        body: "{clinique} : la protection antiparasitaire de {animal} est à renouveler. Passez à la clinique, on vous conseille.",
      },
      app: {
        title: "Antiparasitaire : bientôt le moment",
        body: "Le renouvellement de {animal} approche. Demandez conseil à la clinique.",
      },
    },
  },
  {
    id: "poids",
    title: "Suivi du poids",
    description: "Animaux dont les pesées montrent une évolution à surveiller.",
    count: 29,
    icon: "scale",
    match: (r) => r.weightWatch,
    defaultChannels: ["email"],
    template: {
      email: {
        subject: "Un point poids pour {animal} ?",
        body: `Bonjour {prenom},\n\nLes dernières pesées de {animal} montrent une évolution que le vétérinaire souhaite suivre. Un court rendez-vous permet de faire le point ensemble, sans inquiétude.\n\n${CTA}\n\n${SIGN}`,
      },
      sms: {
        body: "{clinique} : un petit point poids pour {animal} ? Prenez rendez-vous quand vous le souhaitez.",
      },
      app: {
        title: "Point poids pour {animal}",
        body: "Votre vétérinaire propose de suivre son évolution. Demandez conseil en un geste.",
      },
    },
  },
];

export const getCampaign = (id: string) => CAMPAIGNS.find((c) => c.id === id);

/** Remplace les variables {prenom}, {animal}, {age}, {clinique}. */
export function renderTemplate(tpl: string, r: AnimalRow): string {
  return tpl
    .replaceAll("{prenom}", r.owner.firstName)
    .replaceAll("{animal}", r.animal.name)
    .replaceAll("{age}", ageLabel(r.animal.birthDate))
    .replaceAll("{clinique}", CLINIC.name);
}

export const CHANNEL_LABEL: Record<Channel, string> = {
  email: "Email",
  sms: "SMS",
  app: "Notification application",
};
