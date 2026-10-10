// Liste unique des catégories (brief 5.7). Ajouter, renommer ou supprimer une catégorie
// se fait uniquement ici ; une fiche avec une catégorie inconnue fait échouer le build.
export const categories = [
  { slug: "enquetes-osint", libelle: "Enquêtes OSINT", description: "Enquêtes en sources ouvertes : images satellites, géolocalisation, vérification d'images." },
  { slug: "tendances", libelle: "Tendances", description: "Ce qui devient viral sur les réseaux sociaux, expliqué et remis en contexte." },
  { slug: "reportages", libelle: "Reportages", description: "Du terrain, en vidéo pour les réseaux sociaux ou à l'écrit." },
  { slug: "mini-documentaires", libelle: "Mini-documentaires", description: "Des formats plus longs pour prendre le temps d'un sujet." },
  { slug: "temoignages", libelle: "Témoignages", description: "Une personne raconte, à la première personne." }
] as const;

export type CategorieSlug = (typeof categories)[number]['slug'];
export const slugsCategories = categories.map((c) => c.slug) as [CategorieSlug, ...CategorieSlug[]];
export const categorieParSlug = Object.fromEntries(categories.map((c) => [c.slug, c])) as Record<CategorieSlug, (typeof categories)[number]>;
