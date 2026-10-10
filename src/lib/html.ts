// Fragments HTML partagés entre les cartes (rendu serveur) et le lecteur (données JSON).
import { chiffre, moisAnnee } from './format';
import { libelleCompetence, estTechnique } from '../config/competences';

export const esc = (s: unknown) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

const ICON = {
  vues: '<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>',
  likes: '<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7.5-4.6-9.3-9.2C1.6 7.8 3.6 4.5 7 4.5c2 0 3.3 1.1 5 3 1.7-1.9 3-3 5-3 3.4 0 5.4 3.3 4.3 6.3C19.5 15.4 12 20 12 20Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
  commentaires: '<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v11H9l-5 4z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
  partages: '<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path d="M14 5l7 7-7 7M21 12H9a6 6 0 0 0-6 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
};
export const ICON_PLAY = '<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15l13-7.5z" fill="currentColor"/></svg>';

type Chiffres = { vues?: number; likes?: number; commentaires?: number; partages?: number; dateChiffres?: Date };

/** Ligne de chiffres : « 4,1 M de vues · 13 k j'aime · 79 commentaires · octobre 2026 ». */
export function statsHTML(c: Chiffres): string {
  const bits: string[] = [];
  if (c.vues) bits.push(`<span>${ICON.vues}<strong>${esc(chiffre(c.vues, 'vues'))}</strong></span>`);
  if (c.likes) bits.push(`<span>${ICON.likes}<strong>${esc(chiffre(c.likes, "j'aime"))}</strong></span>`);
  if (c.commentaires) bits.push(`<span>${ICON.commentaires}<strong>${esc(chiffre(c.commentaires, c.commentaires > 1 ? 'commentaires' : 'commentaire'))}</strong></span>`);
  if (c.partages) bits.push(`<span>${ICON.partages}<strong>${esc(chiffre(c.partages, 'partages'))}</strong></span>`);
  if (bits.length && c.dateChiffres) bits.push(`<em>${esc(moisAnnee(c.dateChiffres))}</em>`);
  return bits.length ? `<p class="stats">${bits.join('')}</p>` : '';
}

/** Compétences cliquables : chaque compétence mène aux publications qui la mobilisent. */
export function competencesHTML(cles: string[]): string {
  if (!cles.length) return '';
  const li = cles.map((k) => `<li><a class="sk ${estTechnique(k) ? 'sk--t' : 'sk--h'}" href="/publications/?competence=${esc(k)}" data-competence="${esc(k)}">${esc(libelleCompetence(k))}</a></li>`);
  return `<ul class="skills" aria-label="Compétences mobilisées">${li.join('')}</ul>`;
}

/** Bloc « Les coulisses » : un paragraphe ou une liste. */
export function coulissesHTML(c?: string | string[]): string {
  if (!c) return '';
  const corps = Array.isArray(c) ? `<ul>${c.map((l) => `<li>${esc(l)}</li>`).join('')}</ul>` : `<p>${esc(c)}</p>`;
  return `<div class="coulisses"><p class="coulisses-titre">Les coulisses</p>${corps}</div>`;
}
