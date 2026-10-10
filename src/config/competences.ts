// Dictionnaire des compétences utilisées dans les fiches (clé → libellé affiché).
// Les fiches ne peuvent utiliser que ces clés : une clé inconnue fait échouer le build.
export const competencesTechniques = {
  osint: "OSINT",
  satellite: "Images satellites",
  donnees: "Collecte de données",
  archives: "Recherche d'archives",
  carto: "Cartographie",
  verif: "Vérification d'images",
  geoloc: "Géolocalisation",
  tournage: "Tournage",
  mojo: "Mojo",
  montage: "Montage Premiere Pro",
  soustitrage: "Sous-titrage",
  interview: "Interview",
  anglais: "Anglais",
  arabe: "Arabe",
  dataviz: "Data visualisation",
  ecriture: "Écriture web",
  seo: "Référencement SEO",
  script: "Script vidéo",
  motion: "Motion design After Effects",
  incarnation: "Incarnation face caméra",
  photoshop: "Photoshop"
} as const;

export const competencesHumaines = {
  rigueur: "Rigueur",
  tenacite: "Ténacité",
  pedagogie: "Pédagogie",
  synthese: "Esprit de synthèse",
  reactivite: "Réactivité",
  humour: "Sens de l'humour",
  aisance: "Aisance relationnelle",
  ecoute: "Écoute",
  empathie: "Empathie",
  confiance: "Mise en confiance",
  curiosite: "Curiosité",
  adaptabilite: "Adaptabilité",
  organisation: "Organisation",
  sangfroid: "Sang-froid"
} as const;

export type CompetenceTechnique = keyof typeof competencesTechniques;
export type CompetenceHumaine = keyof typeof competencesHumaines;
export const clesTechniques = Object.keys(competencesTechniques) as [CompetenceTechnique, ...CompetenceTechnique[]];
export const clesHumaines = Object.keys(competencesHumaines) as [CompetenceHumaine, ...CompetenceHumaine[]];

export function libelleCompetence(cle: string): string {
  return (competencesTechniques as Record<string, string>)[cle] ?? (competencesHumaines as Record<string, string>)[cle] ?? cle;
}
export const estTechnique = (cle: string) => cle in competencesTechniques;
