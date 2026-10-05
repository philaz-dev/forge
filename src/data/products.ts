import type { AnimalRow, Product } from "@/domain/types";
import { ageLabel } from "@/lib/dates";

/** Catalogue fictif (aucune marque réelle). Pas de paiement dans cette V1. */
export const PRODUCTS: Product[] = [
  {
    id: "p-food-senior-large",
    name: "Croquettes Senior Grande Race",
    brandLine: "Gamme SuperVet Nutrition",
    category: "Nutrition",
    price: 64.9,
    size: "Sac de 12 kg",
    tagline: "Alimentation adaptée recommandée par votre clinique.",
    why: "Une formule pensée pour les chiens de grande race à partir de 7 ans, avec un apport maîtrisé en calories.",
    forSpecies: ["chien"],
    tone: "sage",
    icon: "bowl",
  },
  {
    id: "p-food-adult",
    name: "Croquettes Adulte Équilibre",
    brandLine: "Gamme SuperVet Nutrition",
    category: "Nutrition",
    price: 42.5,
    size: "Sac de 7 kg",
    tagline: "Une ration équilibrée au quotidien.",
    why: "Une formule complète pour maintenir un poids de forme et un pelage en bonne santé.",
    forSpecies: ["chien"],
    tone: "sage",
    icon: "bowl",
  },
  {
    id: "p-food-cat-sterilised",
    name: "Croquettes Chat Stérilisé",
    brandLine: "Gamme SuperVet Nutrition",
    category: "Nutrition",
    price: 31.9,
    size: "Sac de 4 kg",
    tagline: "Adaptée aux chats stérilisés, pour maîtriser le poids.",
    why: "Une formule à teneur en calories ajustée, adaptée aux chats stérilisés.",
    forSpecies: ["chat"],
    tone: "sage",
    icon: "bowl",
  },
  {
    id: "p-food-cat-senior",
    name: "Croquettes Chat Senior",
    brandLine: "Gamme SuperVet Nutrition",
    category: "Nutrition",
    price: 34.5,
    size: "Sac de 3,5 kg",
    tagline: "Pour accompagner les chats à partir de 10 ans.",
    why: "Une texture et une composition adaptées aux besoins des chats seniors.",
    forSpecies: ["chat"],
    tone: "sage",
    icon: "bowl",
  },
  {
    id: "p-dental-chews",
    name: "Bâtonnets d'hygiène dentaire",
    brandLine: "Soins SuperVet",
    category: "Dentaire",
    price: 14.5,
    size: "Boîte de 14",
    tagline: "Produit recommandé par votre vétérinaire.",
    why: "Une action mécanique douce pour accompagner le brossage et limiter la plaque dentaire.",
    forSpecies: ["chien"],
    tone: "sky",
    icon: "tooth",
  },
  {
    id: "p-dental-gel",
    name: "Gel dentaire enzymatique",
    brandLine: "Soins SuperVet",
    category: "Dentaire",
    price: 12.9,
    size: "Tube de 70 g",
    tagline: "Hygiène bucco-dentaire facile à la maison.",
    why: "Un gel au goût agréable, simple à appliquer, qui complète les contrôles en clinique.",
    forSpecies: ["chat", "chien"],
    tone: "sky",
    icon: "tooth",
  },
  {
    id: "p-parasite-dog",
    name: "Protection antiparasitaire mensuelle",
    brandLine: "Prévention SuperVet",
    category: "Parasites",
    price: 29.9,
    size: "3 pipettes",
    tagline: "Protection antiparasitaire adaptée au poids de votre chien.",
    why: "Une protection régulière contre les puces et les tiques, à renouveler selon le protocole de la clinique.",
    forSpecies: ["chien"],
    tone: "rose",
    icon: "shield",
  },
  {
    id: "p-parasite-cat",
    name: "Protection antiparasitaire chat",
    brandLine: "Prévention SuperVet",
    category: "Parasites",
    price: 24.9,
    size: "3 pipettes",
    tagline: "Une protection douce et régulière.",
    why: "Protection contre les puces, adaptée au poids de votre chat.",
    forSpecies: ["chat"],
    tone: "rose",
    icon: "shield",
  },
  {
    id: "p-joint",
    name: "Complément articulaire",
    brandLine: "Soins SuperVet",
    category: "Senior",
    price: 27.5,
    size: "Cure de 60 jours",
    tagline: "Pour accompagner la mobilité au quotidien.",
    why: "Un complément alimentaire pensé pour le confort articulaire des chiens actifs et seniors.",
    forSpecies: ["chien"],
    tone: "sand",
    icon: "joint",
  },
  {
    id: "p-light",
    name: "Croquettes Équilibre Poids",
    brandLine: "Gamme SuperVet Nutrition",
    category: "Nutrition",
    price: 46.0,
    size: "Sac de 7 kg",
    tagline: "Pour accompagner le suivi du poids.",
    why: "Une formule à teneur en calories adaptée, à utiliser sur conseil de votre vétérinaire.",
    forSpecies: ["chien", "chat"],
    tone: "sage",
    icon: "leaf",
  },
];

export interface ProductPick {
  product: Product;
  /** Courte raison personnalisée. */
  reason: string;
  heading: string;
}

/** Sélection de produits cohérente avec le dossier de l'animal. */
export function productsFor(r: AnimalRow): ProductPick[] {
  const a = r.animal;
  const byId = (id: string) => PRODUCTS.find((p) => p.id === id) as Product;
  const picks: ProductPick[] = [];
  const age = ageLabel(a.birthDate);

  // Nutrition
  const food =
    a.species === "chien" && r.isSenior && a.size === "large"
      ? byId("p-food-senior-large")
      : r.weightWatch
        ? byId("p-light")
        : a.species === "chat"
          ? r.isSenior
            ? byId("p-food-cat-senior")
            : byId("p-food-cat-sterilised")
          : r.isSenior && a.size === "large"
            ? byId("p-food-senior-large")
            : byId("p-food-adult");
  picks.push({
    product: food,
    heading: "Nutrition",
    reason: r.weightWatch
      ? `Votre vétérinaire suit l'évolution du poids de ${a.name}.`
      : `Adaptée à ${a.name}, ${age}.`,
  });

  // Hygiène dentaire
  picks.push({
    product:
      a.species === "chien" ? byId("p-dental-chews") : byId("p-dental-gel"),
    heading: "Hygiène dentaire",
    reason: "Un geste simple pour compléter les contrôles à la clinique.",
  });

  // Prévention
  picks.push({
    product:
      a.species === "chien" ? byId("p-parasite-dog") : byId("p-parasite-cat"),
    heading: "Prévention",
    reason: "Protection antiparasitaire à renouveler régulièrement.",
  });

  if (a.species === "chien" && r.isSenior) {
    picks.push({
      product: byId("p-joint"),
      heading: "Confort",
      reason: `Pour accompagner ${a.name} à ${age}.`,
    });
  }
  return picks;
}
