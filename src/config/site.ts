// Réglages généraux du site.
export const site = {
  nom: "Océane Bourdenet",
  // Rôle par défaut sur une vidéo : la mention « Mon rôle » n'apparaît que si une fiche en précise un autre.
  roleParDefaut: "sujet, script, tournage, montage et motion design",
  // Compétences implicites d'une vidéo réalisée de A à Z : comptées dans le CV et les filtres, sans être répétées sur les cartes.
  competencesParDefaut: ["script", "tournage", "montage", "motion"] as const,
  // Masquer les cartes « lien mort » sans archive au lieu de les afficher non cliquables (brief 5.8).
  masquerLiensMortsSansArchive: false,
  // Formspree : identifiant du formulaire de contact (à créer sur formspree.io).
  formspree: "",
};
