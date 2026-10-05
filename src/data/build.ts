import {
  TODAY,
  addDays,
  addMonths,
  diffDays,
  formatLong,
  formatShort,
  type ISODate,
} from "@/lib/dates";
import { norm } from "@/lib/format";
import type {
  Animal,
  AnimalDocument,
  EventType,
  HistoryEvent,
  Owner,
  Size,
  Vaccination,
  WeightPoint,
} from "@/domain/types";
import { PET_PHOTOS } from "./photos";
import { ANIMAL_SEEDS, CLINIC, OWNER_SEEDS, type AnimalSeed } from "./seed";

/* ---------------------------- PRNG déterministe ---------------------------- */

function hash(str: string): number {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const pick = <T>(rng: () => number, arr: readonly T[]): T =>
  arr[Math.floor(rng() * arr.length)] as T;

/* --------------------------------- Races ---------------------------------- */

const SIZE_BY_BREED: Record<string, Size> = {
  "Labrador Retriever": "large",
  "Golden Retriever": "large",
  "Berger Allemand": "large",
  "Berger Belge Malinois": "large",
  "Berger Blanc Suisse": "large",
  "Bouvier Bernois": "large",
  Boxer: "large",
  "Husky Sibérien": "large",
  "Border Collie": "medium",
  "Berger Australien": "medium",
  Beagle: "medium",
  "Cocker Spaniel": "medium",
  "Staffordshire Bull Terrier": "medium",
  "Bouledogue français": "small",
  "Cavalier King Charles": "small",
  "Jack Russell": "small",
  "Yorkshire Terrier": "small",
  "Bichon Frisé": "small",
  Teckel: "small",
  Carlin: "small",
  "Shih Tzu": "small",
  "Spitz Nain": "small",
};

const VETS = CLINIC.team;

/* -------------------------------- Propriétaires --------------------------- */

export function buildOwners(): Owner[] {
  return OWNER_SEEDS.map((s, i) => {
    const rng = mulberry32(hash(`owner-${i}`));
    const p = () => String(Math.floor(rng() * 90) + 10);
    return {
      id: i === 0 ? "o-sophie" : `o-${String(i + 1).padStart(2, "0")}`,
      firstName: s.first,
      lastName: s.last,
      phone: `06 ${p()} ${p()} ${p()} ${p()}`,
      email: `${norm(s.first)}.${norm(s.last)}@example.com`,
      city: s.city,
      clientSince: addMonths(TODAY, -(14 + Math.floor(rng() * 90))),
      preferredChannel: s.channel,
      hasApp: s.app,
    };
  });
}

/* --------------------------------- Animaux -------------------------------- */

const CONSULT_TITLES = [
  ["Consultation de routine", "Examen général, auscultation, palpation. RAS."],
  [
    "Consultation — troubles digestifs passagers",
    "Régime digestif conseillé 5 jours. Évolution favorable.",
  ],
  [
    "Consultation — otite externe",
    "Nettoyage et traitement local. Contrôle non nécessaire.",
  ],
  [
    "Consultation — boiterie légère",
    "Examen locomoteur, repos conseillé 10 jours.",
  ],
  [
    "Consultation — prurit",
    "Examen cutané, traitement symptomatique prescrit.",
  ],
  [
    "Consultation — petite plaie",
    "Nettoyage, pansement et surveillance à domicile.",
  ],
  [
    "Consultation — conseils alimentaires",
    "Mise au point sur la ration et les friandises.",
  ],
] as const;

const NOTES = [
  "Préfère être manipulé calmement, avec des friandises.",
  "Peut être craintif lors des soins : prévoir un temps d'adaptation.",
  "Très sociable avec l'équipe, aucun point d'attention particulier.",
  "Le propriétaire souhaite être appelé avant tout acte important.",
  "Voyage régulièrement : penser aux protocoles antiparasitaires adaptés.",
  "Vit en appartement, sorties quotidiennes régulières.",
  "Vit avec un autre animal : coordonner les rappels des deux dossiers.",
];

function vaccinesFor(seed: AnimalSeed, rng: () => number): Vaccination[] {
  const nextDue = addDays(TODAY, seed.vd);
  const lastDate = addMonths(nextDue, -12);
  const birth = `${seed.birth}-15`;
  const name =
    seed.species === "chien"
      ? "CHPPi + Leptospirose"
      : "Typhus-Coryza + Leucose (TCL)";

  const dates: ISODate[] = [];
  for (let k = 0; ; k++) {
    const d = addMonths(lastDate, -12 * k);
    if (diffDays(birth, d) < 300) break;
    dates.push(d);
  }
  const firstConsult = addDays(birth, 55 + Math.floor(rng() * 14));
  const earliest = dates[dates.length - 1] ?? lastDate;
  const records: { date: ISODate; label: string }[] = dates.map((d) => ({
    date: d,
    label: name,
  }));
  if (diffDays(firstConsult, earliest) > 120) {
    records.push({
      date: addDays(firstConsult, 30),
      label: `${name} · primo-vaccination 2/2`,
    });
    records.push({
      date: firstConsult,
      label: `${name} · primo-vaccination 1/2`,
    });
  }
  records.sort((a, b) => (a.date < b.date ? 1 : -1)); // récent → ancien

  return records.map((r, i) => {
    const isLatest = i === 0;
    const next = isLatest
      ? nextDue
      : (records[i - 1]?.date ?? addMonths(r.date, 12));
    const left = diffDays(TODAY, next);
    const status = !isLatest
      ? "realise"
      : left < 0
        ? "en_retard"
        : left <= 30
          ? "bientot"
          : "a_jour";
    return {
      id: `${seed.slug}-vax-${i}`,
      name: r.label,
      date: r.date,
      vet: pick(rng, VETS),
      nextDue: next,
      batch: `LOT-${Math.floor(rng() * 9000 + 1000)}${String.fromCharCode(65 + Math.floor(rng() * 26))}`,
      status,
      isLatest,
    } satisfies Vaccination;
  });
}

function weightsFor(
  seed: AnimalSeed,
  lastVisit: ISODate,
  rng: () => number,
): WeightPoint[] {
  if (seed.weights) return seed.weights.map(([date, kg]) => ({ date, kg }));
  const birth = `${seed.birth}-15`;
  const ageM = Math.max(3, Math.round(diffDays(birth, lastVisit) / 30.4375));
  const young = ageM < 24;
  const step = young ? 3 : 6;
  const n = Math.min(young ? 6 : 10, Math.floor(ageM / step));
  const trend = seed.trend ?? 0;
  const pts: WeightPoint[] = [];
  for (let k = 0; k <= n; k++) {
    const date = addMonths(lastVisit, -k * step);
    let kgVal: number;
    if (k === 0) kgVal = seed.kg;
    else if (young) kgVal = seed.kg * Math.max(0.25, 1 - 0.14 * k);
    else
      kgVal =
        seed.kg - trend * ((k * step) / 12) + (rng() - 0.5) * seed.kg * 0.018;
    pts.push({ date, kg: Math.round(kgVal * 10) / 10 });
  }
  return pts.reverse();
}

export function buildAnimals(owners: Owner[]): Animal[] {
  return ANIMAL_SEEDS.map((seed, idx) => {
    const rng = mulberry32(hash(seed.slug));
    const owner = owners[seed.owner] as Owner;
    const birth = `${seed.birth}-15`;
    const lastVisit = seed.visitDate ?? addDays(TODAY, -seed.visit);
    const nextVaccineDue = addDays(TODAY, seed.vd);
    const nextParasiteDue = addDays(TODAY, seed.pd);
    const lastBilan =
      seed.bilanDate ??
      (seed.bilan != null ? addMonths(TODAY, -seed.bilan) : null);
    const lastDental =
      seed.dental != null ? addMonths(TODAY, -seed.dental) : null;
    const nextControlDue =
      seed.ctrlDays != null
        ? addDays(TODAY, seed.ctrlDays)
        : addMonths(lastVisit, 12);
    const size: Size =
      seed.species === "chat"
        ? "small"
        : (SIZE_BY_BREED[seed.breed] ?? "medium");

    const vaccinations = vaccinesFor(seed, rng);
    const weights = weightsFor(seed, lastVisit, rng);

    /* ------------------------------ Historique ------------------------------ */
    const events: HistoryEvent[] = [];
    let n = 0;
    const add = (
      date: ISODate,
      type: EventType,
      title: string,
      detail: string,
      vet?: string,
    ) =>
      events.push({
        id: `${seed.slug}-ev-${n++}`,
        date,
        type,
        title,
        detail,
        vet: vet ?? pick(rng, VETS),
      });

    const firstConsult = addDays(birth, 55 + Math.floor(rng() * 14));
    add(
      firstConsult,
      "consultation",
      "Première consultation",
      "Identification (puce), examen général et conseils d'accueil.",
    );
    vaccinations.forEach((v) =>
      add(
        v.date,
        "vaccination",
        `Vaccination — ${v.name}`,
        `Lot ${v.batch}. Prochain rappel le ${formatLong(v.nextDue)}.`,
        v.vet,
      ),
    );

    if (seed.neutered) {
      add(
        addMonths(birth, 9 + Math.floor(rng() * 4)),
        "intervention",
        seed.sex === "M" ? "Castration" : "Stérilisation",
        "Intervention programmée, sortie le jour même. Suites simples.",
      );
    }

    if (seed.slug === "oslo") {
      add(
        "2022-03-11",
        "controle",
        "Contrôle annuel",
        "Examen général complet. Poids stable.",
        "Dr Vetter",
      );
      add(
        "2023-06-20",
        "consultation",
        "Consultation — boiterie légère",
        "Examen locomoteur, repos conseillé 10 jours.",
        "Dr Vetter",
      );
      add(
        "2023-06-20",
        "prescription",
        "Ordonnance — anti-inflammatoire",
        "Traitement de 5 jours, observance confirmée au rappel.",
        "Dr Vetter",
      );
      add(
        "2026-03-18",
        "consultation",
        "Consultation de suivi",
        "Pesée et examen général. Bilan senior à programmer.",
        "Dr Vetter",
      );
    } else {
      let d = lastVisit;
      for (let k = 0; k < 4; k++) {
        if (diffDays(firstConsult, d) < 150) break;
        const [title, detail] =
          k === 0 && seed.pending
            ? [
                "Consultation — problème cutané",
                "Examen cutané, traitement local. Contrôle à 3 mois recommandé.",
              ]
            : pick(rng, CONSULT_TITLES);
        add(
          d,
          k % 2 === 1 ? "controle" : "consultation",
          k === 0 && !seed.pending ? "Dernière consultation" : title,
          detail,
        );
        if (rng() < 0.35)
          add(
            d,
            "prescription",
            "Ordonnance — traitement symptomatique",
            "Durée 7 jours, délivrée en clinique.",
          );
        d = addMonths(d, -(11 + Math.floor(rng() * 5)));
      }
    }

    if (lastBilan) {
      add(
        lastBilan,
        "analyse",
        "Bilan sanguin",
        "Prélèvement et analyses. Résultats commentés au propriétaire.",
        "Dr Vetter",
      );
    }
    if (lastDental) {
      add(
        lastDental,
        "controle",
        "Contrôle dentaire",
        "Examen de la cavité buccale, conseils d'hygiène.",
      );
    }
    if (seed.postOp) {
      add(
        seed.postOp.date,
        "intervention",
        seed.postOp.label,
        "Intervention sous anesthésie, hospitalisation de jour.",
        "Dr Vetter",
      );
      add(
        seed.postOp.date,
        "prescription",
        "Ordonnance post-opératoire",
        "Antalgique et protocole de soins à domicile.",
        "Dr Vetter",
      );
    }

    events.sort((a, b) => (a.date === b.date ? 0 : a.date < b.date ? 1 : -1));

    /* ------------------------------- Documents ------------------------------ */
    const documents: AnimalDocument[] = [];
    let dn = 0;
    const doc = (
      kind: AnimalDocument["kind"],
      title: string,
      date: ISODate,
      summary: string,
    ) =>
      documents.push({
        id: `${seed.slug}-doc-${dn++}`,
        kind,
        title,
        date,
        sizeKb: 90 + Math.floor(rng() * 420),
        summary,
      });
    const latestV = vaccinations[0];
    if (latestV)
      doc(
        "certificat",
        "Certificat de vaccination",
        latestV.date,
        `${latestV.name} — valable jusqu'au ${formatShort(latestV.nextDue)}.`,
      );
    doc(
      "facture",
      `Facture — consultation du ${formatShort(lastVisit)}`,
      lastVisit,
      "Consultation et actes associés. Réglée sur place.",
    );
    events
      .filter((e) => e.type === "prescription")
      .slice(0, 2)
      .forEach((e) =>
        doc(
          "ordonnance",
          `Ordonnance du ${formatShort(e.date)}`,
          e.date,
          e.title.replace("Ordonnance — ", ""),
        ),
      );
    if (lastBilan)
      doc(
        "analyse",
        `Résultats d'analyses — ${formatShort(lastBilan)}`,
        lastBilan,
        "Bilan sanguin complet, valeurs transmises au propriétaire.",
      );
    if (seed.postOp)
      doc(
        "compte-rendu",
        `Compte rendu opératoire — ${seed.postOp.label}`,
        seed.postOp.date,
        "Intervention, consignes de suivi et date de contrôle.",
      );
    documents.sort((a, b) => (a.date < b.date ? 1 : -1));

    /* ------------------------------- Divers --------------------------------- */
    const ageM = Math.round(diffDays(birth, TODAY) / 30.4375);
    const diet =
      seed.diet ??
      (seed.species === "chat"
        ? ageM < 12
          ? "Croquettes chaton — 4 repas / jour"
          : ageM >= 120
            ? "Croquettes chat senior — 3 repas / jour"
            : seed.neutered
              ? "Croquettes chat stérilisé — 3 repas / jour"
              : "Croquettes adulte — 3 repas / jour"
        : ageM < 14
          ? "Croquettes croissance — 3 repas / jour"
          : size === "small"
            ? "Croquettes adulte petite race — 2 repas / jour"
            : size === "large"
              ? "Croquettes adulte grande race — 2 repas / jour"
              : "Croquettes adulte moyenne race — 2 repas / jour");

    const allergies =
      seed.allergies ??
      (idx % 7 === 3
        ? ["Sensibilité digestive : transition alimentaire progressive"]
        : ["Aucune allergie connue"]);

    const treatments = seed.treatments ?? [
      {
        name: "Antiparasitaire externe & interne",
        detail: `Prochaine prise le ${formatShort(nextParasiteDue)}`,
      },
    ];

    return {
      id: `a-${seed.slug}`,
      name: seed.name,
      species: seed.species,
      breed: seed.breed,
      sex: seed.sex,
      neutered: seed.neutered,
      birthDate: birth,
      ownerId: owner.id,
      coat: seed.coat,
      photoUrl: PET_PHOTOS[`a-${seed.slug}`],
      size,
      microchip:
        `250 26${String(Math.floor(rng() * 1e10)).padStart(10, "0")}`.slice(
          0,
          20,
        ),
      weights,
      vaccinations,
      history: events,
      documents,
      treatments,
      diet,
      allergies,
      importantInfo: seed.info ?? pick(rng, NOTES),
      lastVisit,
      lastBilan,
      lastDental,
      nextVaccineDue,
      nextParasiteDue,
      nextControlDue,
      postOp: seed.postOp
        ? {
            label: seed.postOp.label,
            date: seed.postOp.date,
            followUpDue: seed.postOp.follow,
          }
        : undefined,
      pendingControl: seed.pending,
    } satisfies Animal;
  });
}
