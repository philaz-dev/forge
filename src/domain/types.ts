import type { ISODate } from "@/lib/dates";

export type Species = "chien" | "chat";
export type Sex = "M" | "F";
export type Size = "small" | "medium" | "large";
export type Channel = "email" | "sms" | "app";

export type CoatKey =
  | "cream"
  | "golden"
  | "tan"
  | "black"
  | "white"
  | "brindle"
  | "grey"
  | "chocolate"
  | "tabby"
  | "ginger"
  | "siamese"
  | "bicolor"
  | "blue"
  | "tricolor";

export interface Owner {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  city: string;
  clientSince: ISODate;
  preferredChannel: Channel;
  hasApp: boolean;
}

export interface WeightPoint {
  date: ISODate;
  kg: number;
}

export type VaccineStatus = "a_jour" | "bientot" | "en_retard" | "realise";

export interface Vaccination {
  id: string;
  name: string;
  date: ISODate;
  vet: string;
  nextDue: ISODate;
  batch: string;
  /** Statut calculé au moment de la lecture (voir engine/status). */
  status: VaccineStatus;
  isLatest: boolean;
}

export type EventType =
  | "consultation"
  | "vaccination"
  | "analyse"
  | "intervention"
  | "prescription"
  | "controle";

export interface HistoryEvent {
  id: string;
  date: ISODate;
  type: EventType;
  title: string;
  detail: string;
  vet: string;
}

export type DocumentKind =
  "ordonnance" | "analyse" | "facture" | "compte-rendu" | "certificat";

export interface AnimalDocument {
  id: string;
  kind: DocumentKind;
  title: string;
  date: ISODate;
  sizeKb: number;
  summary: string;
}

export interface Treatment {
  name: string;
  detail: string;
}

export interface PostOp {
  label: string;
  date: ISODate;
  followUpDue: ISODate;
}

export interface PendingControl {
  label: string;
  /** Consultation à l'origine de la recommandation. */
  since: ISODate;
  due: ISODate;
}

export interface Animal {
  id: string;
  name: string;
  species: Species;
  breed: string;
  sex: Sex;
  neutered: boolean;
  birthDate: ISODate;
  ownerId: string;
  coat: CoatKey;
  size: Size;
  microchip: string;
  /** URL d'une vraie photo (optionnelle). Sinon : illustration générée. */
  photoUrl?: string;
  weights: WeightPoint[];
  vaccinations: Vaccination[];
  history: HistoryEvent[];
  documents: AnimalDocument[];
  treatments: Treatment[];
  diet: string;
  allergies: string[];
  importantInfo: string;
  lastVisit: ISODate;
  lastBilan: ISODate | null;
  lastDental: ISODate | null;
  nextVaccineDue: ISODate;
  nextParasiteDue: ISODate;
  nextControlDue: ISODate;
  postOp?: PostOp;
  pendingControl?: PendingControl;
}

/* -------------------------------------------------------------------------- */
/* Recommandations (« Next best action »)                                      */
/* -------------------------------------------------------------------------- */

export type OppCategory =
  | "Prévention"
  | "Nutrition"
  | "Dentaire"
  | "Senior"
  | "Parasites"
  | "Suivi"
  | "Produits";

export type RecKind =
  | "bilan_senior"
  | "vaccination"
  | "antiparasitaire"
  | "suivi_poids"
  | "controle_dentaire"
  | "nutrition"
  | "post_op"
  | "controle_recommande"
  | "retour_clinique";

export type Urgency = "high" | "medium" | "low";

export interface Recommendation {
  id: string;
  animalId: string;
  kind: RecKind;
  category: OppCategory;
  urgency: Urgency;
  /** Score de tri (plus haut = plus prioritaire). */
  priority: number;
  title: string;
  /** Libellé court pour les listes. */
  short: string;
  /** Explication factuelle — jamais un diagnostic. */
  rationale: string;
  dueDate?: ISODate;
  /** Libellé du bouton principal. */
  cta: string;
  /** Estimation fictive du potentiel (€) pour la maquette. */
  estimatedValue: number;
}

export type StatusKey = "a_jour" | "bientot" | "en_retard" | "suivi";
export interface AnimalStatus {
  key: StatusKey;
  label: string;
}

export interface AnimalRow {
  animal: Animal;
  owner: Owner;
  ageMonths: number;
  isSenior: boolean;
  weight: number;
  recs: Recommendation[];
  topRec: Recommendation | null;
  status: AnimalStatus;
  nextDue: { date: ISODate; label: string } | null;
  weightWatch: boolean;
  needsFollowUp: boolean;
  hasOpportunity: boolean;
  vaccineDue: boolean;
  monthsSinceVisit: number;
}

/* -------------------------------------------------------------------------- */
/* Rendez-vous / notifications (état de démonstration)                         */
/* -------------------------------------------------------------------------- */

export interface Appointment {
  id: string;
  animalId: string;
  ownerId: string;
  reason: string;
  date: ISODate;
  time: string;
  vet: string;
  status: "confirme" | "demande";
  source: "clinique" | "proprietaire";
}

export interface ClinicNotification {
  id: string;
  at: string;
  kind: "rdv" | "conseil" | "produit";
  title: string;
  body: string;
  animalId: string;
  read: boolean;
}

export interface Product {
  id: string;
  name: string;
  brandLine: string;
  category: OppCategory;
  price: number;
  size: string;
  tagline: string;
  why: string;
  forSpecies: Species[];
  tone: "sage" | "sand" | "sky" | "rose";
  icon: "bowl" | "tooth" | "shield" | "joint" | "drop" | "leaf" | "bone";
}
