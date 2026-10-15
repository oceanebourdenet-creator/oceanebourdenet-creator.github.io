// Images des fiches et du CV : les fichiers écrivent un chemin « /publications/x.jpg », « /logos/x.svg » ou « /photos/x.jpg »
// (format de Pages CMS), résolu ici vers src/assets/… pour qu'Astro optimise l'image.
import type { ImageMetadata } from 'astro';

const fichiers = import.meta.glob<{ default: ImageMetadata }>('/src/assets/{publications,logos,photos}/*.{jpg,jpeg,png,webp,avif,svg}', { eager: true });

export function image(chemin?: string): ImageMetadata | undefined {
  if (!chemin) return undefined;
  return fichiers[`/src/assets${chemin.startsWith('/') ? '' : '/'}${chemin}`]?.default;
}
