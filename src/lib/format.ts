// Formatage français partagé par tout le site (brief 5.6 : une seule fonction pour les chiffres).
const nf = new Intl.NumberFormat('fr-FR');

/** « 850 vues », « 12 k vues », « 2,4 M de vues » (arrondi vers le bas). */
export function chiffre(n: number, unite: string): string {
  if (n >= 1e6) {
    const v = Math.floor(n / 1e5) / 10;
    return `${nf.format(v)} M ${/^[aeiouéh]/i.test(unite) ? "d'" : 'de '}${unite}`;
  }
  if (n >= 1e4) return `${nf.format(Math.floor(n / 1000))} k ${unite}`;
  return `${nf.format(n)} ${unite}`;
}

/** Total arrondi vers le bas pour les chiffres cumulés : « 8,4 M », « 60 k », « 5 000 ». */
export function plusDe(n: number): string {
  if (n >= 1e6) return `${nf.format(Math.floor(n / 1e5) / 10)} M`;
  if (n >= 1e4) return `${nf.format(Math.floor(n / 1e4) * 10)} k`;
  return nf.format(Math.floor(n / 100) * 100);
}

export const nombre = (n: number) => nf.format(n);

const jourFmt = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
const moisFmt = new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric', timeZone: 'UTC' });
const moisCourtFmt = new Intl.DateTimeFormat('fr-FR', { month: 'short', year: 'numeric', timeZone: 'UTC' });
const jourCourtFmt = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short', timeZone: 'UTC' });

export const dateLongue = (d: Date) => jourFmt.format(d);
export const moisAnnee = (d: Date) => moisFmt.format(d);
export const jourCourt = (d: Date) => jourCourtFmt.format(d);
export const isoDate = (d: Date) => d.toISOString().slice(0, 10);

const depuisMois = (s: string) => new Date(`${s}-01T12:00:00Z`);

/** Période d'une expérience : « sept. 2025 – sept. 2026 », « Depuis septembre 2026 », ou en années (court). */
export function periode(debut: string, fin: string, court = false): string {
  const f = (s: string) => (court ? String(depuisMois(s).getUTCFullYear()) : moisCourtFmt.format(depuisMois(s)));
  if (fin === "aujourd'hui") return court ? `Depuis ${f(debut)}` : `Depuis ${moisFmt.format(depuisMois(debut))}`;
  if (debut === fin) return f(debut);
  const a = f(debut), b = f(fin);
  return a === b ? a : `${a} – ${b}`;
}
export const anneeDebut = (debut: string) => depuisMois(debut).getUTCFullYear();

/** Identifiant d'URL : « L'Orient-Le Jour » → « l-orient-le-jour ». */
export const slug = (s: string) =>
  s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
