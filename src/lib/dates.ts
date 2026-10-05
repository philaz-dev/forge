/**
 * Utilitaires de dates (ISO `YYYY-MM-DD`, calculs en UTC).
 *
 * La maquette utilise une date de référence FIXE (`TODAY`) afin que les
 * données restent cohérentes d'une démonstration à l'autre et qu'il n'y ait
 * aucun écart d'hydratation entre serveur et navigateur.
 */
export type ISODate = string;

export const TODAY: ISODate = "2026-10-05";

const DAY = 86_400_000;

export const toDate = (iso: ISODate): Date => {
  const full = iso.length === 7 ? `${iso}-15` : iso;
  return new Date(`${full}T00:00:00Z`);
};
export const toISO = (d: Date): ISODate => d.toISOString().slice(0, 10);

export const addDays = (iso: ISODate, n: number): ISODate =>
  toISO(new Date(toDate(iso).getTime() + n * DAY));

export const addMonths = (iso: ISODate, n: number): ISODate => {
  const d = toDate(iso);
  const day = d.getUTCDate();
  d.setUTCDate(1);
  d.setUTCMonth(d.getUTCMonth() + n);
  const last = new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0),
  ).getUTCDate();
  d.setUTCDate(Math.min(day, last));
  return toISO(d);
};

/** Nombre de jours de `a` vers `b` (positif si `b` est postérieur). */
export const diffDays = (a: ISODate, b: ISODate): number =>
  Math.round((toDate(b).getTime() - toDate(a).getTime()) / DAY);

/** Mois écoulés (arrondis) de `a` vers `b`. */
export const monthsBetween = (a: ISODate, b: ISODate): number =>
  Math.round(diffDays(a, b) / 30.4375);

export const monthsSince = (iso: ISODate, today: ISODate = TODAY): number =>
  monthsBetween(iso, today);

export const ageInMonths = (birth: ISODate, today: ISODate = TODAY): number =>
  monthsBetween(toDate(birth).toISOString().slice(0, 10), today);

export const ageInYears = (birth: ISODate, today: ISODate = TODAY): number =>
  Math.floor(ageInMonths(birth, today) / 12);

export const ageLabel = (birth: ISODate, today: ISODate = TODAY): string => {
  const m = ageInMonths(birth, today);
  if (m < 12) return `${m} mois`;
  const y = Math.floor(m / 12);
  const r = m % 12;
  if (y < 3 && r > 0) return `${y} an${y > 1 ? "s" : ""} ${r} mois`;
  return `${y} an${y > 1 ? "s" : ""}`;
};

const fmt = (opts: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("fr-FR", { timeZone: "UTC", ...opts });

const F_LONG = fmt({ day: "numeric", month: "long", year: "numeric" });
const F_SHORT = fmt({ day: "numeric", month: "short", year: "numeric" });
const F_DAYMONTH = fmt({ day: "numeric", month: "short" });
const F_MONTHYEAR = fmt({ month: "long", year: "numeric" });
const F_WEEKDAY = fmt({ weekday: "long", day: "numeric", month: "long" });
const F_WEEKDAY_SHORT = fmt({ weekday: "short", day: "numeric" });

export const formatLong = (iso: ISODate) => F_LONG.format(toDate(iso));
export const formatShort = (iso: ISODate) => F_SHORT.format(toDate(iso));
export const formatDayMonth = (iso: ISODate) => F_DAYMONTH.format(toDate(iso));
export const formatMonthYear = (iso: ISODate) =>
  F_MONTHYEAR.format(toDate(iso));
export const formatWeekday = (iso: ISODate) => F_WEEKDAY.format(toDate(iso));
export const formatWeekdayShort = (iso: ISODate) =>
  F_WEEKDAY_SHORT.format(toDate(iso));
export const year = (iso: ISODate) => toDate(iso).getUTCFullYear();

/** « dans 12 jours », « dans 2 mois », « il y a 3 semaines », « aujourd'hui ». */
export const relative = (iso: ISODate, today: ISODate = TODAY): string => {
  const d = diffDays(today, iso);
  const abs = Math.abs(d);
  if (d === 0) return "aujourd’hui";
  let label: string;
  if (abs < 14) label = `${abs} jour${abs > 1 ? "s" : ""}`;
  else if (abs < 60) label = `${Math.round(abs / 7)} semaines`;
  else if (abs < 700) label = `${Math.round(abs / 30.4375)} mois`;
  else {
    const y = Math.round((abs / 365.25) * 10) / 10;
    label = `${String(y).replace(".", ",")} ans`;
  }
  return d > 0 ? `dans ${label}` : `il y a ${label}`;
};
