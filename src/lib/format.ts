const nf0 = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 });
const nf1 = new Intl.NumberFormat("fr-FR", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});
const eur = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});
const eur2 = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
});

export const n0 = (n: number) => nf0.format(n);
export const kg = (n: number) => `${nf1.format(n)} kg`;
export const signedKg = (n: number) =>
  `${n >= 0 ? "+" : "−"}${nf1.format(Math.abs(n))} kg`;
export const euro = (n: number) => eur.format(n);
export const euro2 = (n: number) => eur2.format(n);
export const pct = (n: number) => `${nf0.format(Math.round(n))} %`;

export const plural = (n: number, one: string, many = `${one}s`) =>
  `${n0(n)} ${n > 1 ? many : one}`;

export const initials = (first: string, last: string) =>
  `${first[0] ?? ""}${last[0] ?? ""}`.toUpperCase();

export const norm = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

/** « de Nala » / « d’Oslo » — élision devant une voyelle. */
export const de = (name: string) =>
  /^[aeiouyàâäéèêëîïôöûü]/i.test(name) ? `d’${name}` : `de ${name}`;
