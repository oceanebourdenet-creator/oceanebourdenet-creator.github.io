// Accès aux publications et règles communes (compétences implicites, séries, coulisses).
import { getCollection, type CollectionEntry } from 'astro:content';
import { site } from '../config/site';

export type Publication = CollectionEntry<'publications'>;
export type Serie = CollectionEntry<'series'>;

export const FORMATS: Record<string, string> = {
  article: 'Article', reportage: 'Reportage', enquete: 'Enquête', podcast: 'Podcast', video: 'Vidéo', interview: 'Interview', autre: 'Autre',
};
export const PLATEFORMES: Record<string, string> = {
  youtube: 'YouTube', tiktok: 'TikTok', instagram: 'Instagram', facebook: 'Facebook', x: 'X', autre: 'Autre',
};

/** Toutes les publications, de la plus récente à la plus ancienne. */
export async function publications(): Promise<Publication[]> {
  const toutes = await getCollection('publications', ({ data }) => !(data.lienMort && !data.archive && site.masquerLiensMortsSansArchive));
  return toutes.sort((a, b) => b.data.date.getTime() - a.data.date.getTime() || a.id.localeCompare(b.id));
}

export async function series(): Promise<Map<string, Serie>> {
  return new Map((await getCollection('series')).map((s) => [s.id, s]));
}

/** Compétences explicites + implicites d'une vidéo réalisée de A à Z (sans rôle spécifique). */
export function toutesCompetences(p: Publication): string[] {
  const d = p.data;
  return [...new Set([
    ...d.competences.techniques,
    ...d.competences.humaines,
    ...(d.format === 'video' && !d.role ? site.competencesParDefaut : []),
  ])];
}

/** Texte « Les coulisses » : celui de la fiche, sinon celui de sa série. */
export function coulissesDe(p: Publication, toutesSeries: Map<string, Serie>) {
  return p.data.coulisses ?? (p.data.serie ? toutesSeries.get(p.data.serie.id)?.data.coulisses : undefined);
}

/** Lien de la carte : archive si le lien d'origine est mort (brief 5.8). */
export function lienDe(p: Publication): { href?: string; archive: boolean } {
  if (!p.data.lienMort) return { href: p.data.url, archive: false };
  return p.data.archive ? { href: p.data.archive, archive: true } : { archive: false };
}

/** Audience pour le tri « Plus vues » : uniquement les vues renseignées et affichées. */
export const audience = (p: Publication) => (p.data.afficherChiffres && p.data.vues ? p.data.vues : 0);

export type Entree =
  | { type: 'publication'; p: Publication; date: Date }
  | { type: 'serie'; serie: Serie; episodes: Publication[]; date: Date };

/** Regroupe les vidéos d'une même série en une seule entrée (date = dernier épisode). */
export function entrees(liste: Publication[], toutesSeries: Map<string, Serie>): Entree[] {
  const out: Entree[] = [];
  const vues = new Set<string>();
  for (const p of liste) {
    const id = p.data.serie?.id;
    if (!id || !toutesSeries.has(id)) { out.push({ type: 'publication', p, date: p.data.date }); continue; }
    if (vues.has(id)) continue;
    vues.add(id);
    const episodes = liste.filter((q) => q.data.serie?.id === id).sort((a, b) => a.data.date.getTime() - b.data.date.getTime());
    out.push({ type: 'serie', serie: toutesSeries.get(id)!, episodes, date: episodes[episodes.length - 1].data.date });
  }
  return out;
}
