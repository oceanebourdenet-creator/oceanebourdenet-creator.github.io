// Génère .pages.yml (configuration de Pages CMS) à partir des listes uniques du site :
// catégories (src/config/categories.ts) et compétences (src/config/competences.ts).
//   node scripts/pages-cms.mjs            → écrit .pages.yml
//   node scripts/pages-cms.mjs --verifier → échoue si .pages.yml n'est pas à jour (lancé avant chaque build)
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { categories } from '../src/config/categories.ts';
import { competencesTechniques, competencesHumaines } from '../src/config/competences.ts';

const valeurs = (o) => Object.entries(o).map(([name, label]) => ({ name, label }));
const opt = (values, multiple = false) => ({ values, ...(multiple ? { multiple: true } : {}) });
const date = { format: 'yyyy-MM-dd' };

const champsPublication = [
  { name: 'titre', label: 'Titre', type: 'string', required: true },
  { name: 'media', label: 'Média', type: 'string', required: true, description: 'Nom du média, écrit comme dans le CV (ex. TV5MONDE, France-Antilles).' },
  { name: 'date', label: 'Date de publication', type: 'date', required: true, options: date },
  { name: 'url', label: 'Lien de la publication', type: 'string', required: true, description: 'Adresse complète de la publication d’origine (https://…).' },
  { name: 'categorie', label: 'Catégorie', type: 'select', required: true, options: opt(categories.map((c) => ({ name: c.slug, label: c.libelle }))) },
  { name: 'format', label: 'Format', type: 'select', required: true, options: opt([
    { name: 'video', label: 'Vidéo' }, { name: 'article', label: 'Article' }, { name: 'podcast', label: 'Podcast' },
    { name: 'reportage', label: 'Reportage' }, { name: 'enquete', label: 'Enquête' }, { name: 'interview', label: 'Interview' }, { name: 'autre', label: 'Autre' }]) },
  { name: 'accroche', label: 'Accroche', type: 'text', required: true, description: '1 à 2 phrases écrites par vous, pas le chapô du média.' },
  { name: 'coulisses', label: 'Les coulisses', type: 'text', description: 'Ce que vous avez fait pour réaliser le sujet, à la première personne. Pour une liste, commencer chaque ligne par « - ».' },
  { name: 'image', label: 'Image d’aperçu', type: 'image', options: { media: 'publications' }, description: '1200 px de large maximum et moins de 200 Ko. Sans image, un visuel de remplacement est affiché.' },
  { name: 'plateforme', label: 'Plateforme (vidéos)', type: 'select', options: opt([
    { name: 'instagram', label: 'Instagram' }, { name: 'tiktok', label: 'TikTok' }, { name: 'youtube', label: 'YouTube' },
    { name: 'facebook', label: 'Facebook' }, { name: 'x', label: 'X' }, { name: 'autre', label: 'Autre' }]) },
  { name: 'embed', label: 'Identifiant de la vidéo', type: 'string', description: 'Pour afficher la vidéo sur le site. Instagram : le code après /p/ ou /reel/ dans le lien (ex. Dc3_k3gN5kT). YouTube : le code après v= ou /shorts/.' },
  { name: 'vertical', label: 'Vidéo verticale (Short YouTube)', type: 'boolean' },
  { name: 'duree', label: 'Durée', type: 'string', description: 'Ex. « 1 min 36 ». Facultatif.' },
  { name: 'collaboration', label: 'Publication Instagram en collaboration', type: 'boolean', description: 'À cocher si la publication est partagée entre plusieurs comptes.' },
  { name: 'serie', label: 'Série', type: 'string', description: 'Pour regrouper plusieurs vidéos d’un même événement : nom du fichier de la série, sans .yaml (ex. tour-des-yoles-2026).' },
  { name: 'phare', label: 'Position dans les publications phares', type: 'number', description: '1 = première carte de l’accueil. Laisser vide pour ne pas mettre en avant.' },
  { name: 'role', label: 'Mon rôle', type: 'string', description: 'Seulement si différent de « sujet, script, tournage, montage et motion design ».' },
  { name: 'competences', label: 'Compétences mobilisées', type: 'object', fields: [
    { name: 'techniques', label: 'Compétences techniques', type: 'select', options: opt(valeurs(competencesTechniques), true) },
    { name: 'humaines', label: 'Compétences humaines', type: 'select', options: opt(valeurs(competencesHumaines), true) },
  ] },
  { name: 'afficherChiffres', label: 'Afficher les chiffres sur la carte', type: 'boolean' },
  { name: 'vues', label: 'Vues', type: 'number' },
  { name: 'likes', label: 'J’aime', type: 'number' },
  { name: 'commentaires', label: 'Commentaires', type: 'number' },
  { name: 'partages', label: 'Partages', type: 'number' },
  { name: 'dateChiffres', label: 'Date du relevé des chiffres', type: 'date', options: date, description: 'Obligatoire dès qu’un chiffre est renseigné.' },
  { name: 'sourceChiffres', label: 'Source des chiffres', type: 'select', options: opt([{ name: 'public', label: 'Relevés sur la plateforme' }, { name: 'media', label: 'Statistiques du média' }]) },
  { name: 'archive', label: 'Lien archivé (secours)', type: 'string', description: 'Copie de la Wayback Machine, utilisée si le lien d’origine ne marche plus.' },
  { name: 'lienMort', label: 'Le lien d’origine ne fonctionne plus', type: 'boolean' },
];

const periode = [
  { name: 'debut', label: 'Début', type: 'string', required: true, description: 'Format AAAA-MM, ex. 2025-09.' },
  { name: 'fin', label: 'Fin', type: 'string', required: true, description: 'Format AAAA-MM, ou « aujourd\'hui ».' },
];
const logo = { name: 'logo', label: 'Logo', type: 'image', options: { media: 'logos' } };

const champsCV = [
  { name: 'profil', label: 'Profil', type: 'object', fields: [
    { name: 'nom', label: 'Nom', type: 'string', required: true },
    { name: 'titre', label: 'Titre', type: 'string', required: true },
    { name: 'ville', label: 'Ville', type: 'string', required: true },
    { name: 'accroche', label: 'Accroche de l’accueil', type: 'text', required: true },
    { name: 'resume', label: 'Résumé du CV', type: 'text', required: true },
    { name: 'reseaux', label: 'Réseaux', type: 'object', list: true, fields: [
      { name: 'nom', label: 'Nom', type: 'string' }, { name: 'url', label: 'Lien', type: 'string' }] },
    { name: 'photo', label: 'Photo', type: 'image', required: true, options: { media: 'photos' }, description: 'Photo affichée sur l’accueil et le CV. Format portrait conseillé.' },
    { name: 'cadrage', label: 'Cadrage de la photo', type: 'object', fields: [
      { name: 'x', label: 'Position horizontale du visage (%)', type: 'number', description: '0 = bord gauche, 50 = centre, 100 = bord droit.' },
      { name: 'y', label: 'Position verticale du visage (%)', type: 'number', description: '0 = haut, 50 = milieu, 100 = bas.' },
      { name: 'zoom', label: 'Zoom de la vignette ronde sur mobile', type: 'number', description: 'Entre 1 (photo entière) et 6. Ex. 3,5 pour bien voir le visage.' }] },
  ] },
  { name: 'experiences', label: 'Expériences', type: 'object', list: { collapsible: { collapsed: true, summary: '{media} · {poste}' } }, fields: [
    { name: 'media', label: 'Média', type: 'string', required: true }, logo,
    { name: 'pageAuteur', label: 'Page auteur sur le site du média', type: 'string' },
    { name: 'poste', label: 'Poste', type: 'string', required: true },
    { name: 'type', label: 'Type (CDD, stage, alternance…)', type: 'string', required: true },
    { name: 'lieu', label: 'Lieu', type: 'string', required: true }, ...periode,
    { name: 'description', label: 'Description', type: 'text' },
  ] },
  { name: 'formations', label: 'Formations', type: 'object', list: { collapsible: { collapsed: true, summary: '{diplome}' } }, fields: [
    { name: 'diplome', label: 'Diplôme', type: 'string', required: true },
    { name: 'etablissement', label: 'Établissement', type: 'string', required: true },
    { name: 'logos', label: 'Logos', type: 'image', options: { media: 'logos', multiple: true } }, ...periode,
    { name: 'description', label: 'Description', type: 'text' },
    { name: 'echange', label: 'Échange ou séjour pendant la formation', type: 'object', fields: [
      { name: 'titre', label: 'Titre', type: 'string' }, { name: 'etablissement', label: 'Établissement', type: 'string' },
      { name: 'logos', label: 'Logos', type: 'image', options: { media: 'logos', multiple: true } }, ...periode] },
  ] },
  { name: 'competences', label: 'Compétences (page CV)', type: 'object', fields: [
    { name: 'phares', label: 'Compétences phares', type: 'object', list: { max: 3 }, fields: [
      { name: 'titre', label: 'Titre', type: 'string' },
      { name: 'cle', label: 'Compétence reliée', type: 'select', options: opt(valeurs({ ...competencesTechniques, ...competencesHumaines })) },
      { name: 'texte', label: 'Texte', type: 'text' },
      { name: 'exemple', label: 'Exemple', type: 'object', fields: [{ name: 'titre', label: 'Titre', type: 'string' }, { name: 'url', label: 'Lien', type: 'string' }] }] },
    { name: 'groupes', label: 'Groupes', type: 'object', list: { collapsible: { collapsed: true, summary: '{groupe}' } }, fields: [
      { name: 'groupe', label: 'Nom du groupe', type: 'string' },
      { name: 'items', label: 'Compétences', type: 'object', list: true, fields: [
        { name: 'nom', label: 'Libellé affiché', type: 'string' },
        { name: 'cle', label: 'Compétence reliée (pour compter les publications)', type: 'select', options: opt(valeurs({ ...competencesTechniques, ...competencesHumaines })) }] },
      { name: 'materiel', label: 'Matériel', type: 'string', list: true }] },
  ] },
  { name: 'langues', label: 'Langues', type: 'object', list: true, fields: [
    { name: 'langue', label: 'Langue', type: 'string' },
    { name: 'niveau', label: 'Niveau', type: 'select', options: opt(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']) }] },
  { name: 'distinctions', label: 'Distinctions (prix, bourses)', type: 'object', list: true, fields: [
    { name: 'titre', label: 'Titre', type: 'string' }, { name: 'annee', label: 'Année', type: 'string' }, { name: 'description', label: 'Description', type: 'text' }] },
  { name: 'engagement', label: 'Engagement', type: 'object', list: true, fields: [
    { name: 'structure', label: 'Structure', type: 'string' }, logo,
    { name: 'role', label: 'Rôle', type: 'string' }, ...periode,
    { name: 'description', label: 'Description', type: 'text' },
    { name: 'missions', label: 'Missions', type: 'string', list: true },
    { name: 'lien', label: 'Lien', type: 'object', fields: [{ name: 'libelle', label: 'Texte du lien', type: 'string' }, { name: 'url', label: 'Adresse', type: 'string' }] }] },
];

// Textes fixes des pages (src/data/textes.yaml)
const s_ = (name, label, type = 'string') => ({ name, label, type, required: true });
const champsTextes = [
  { name: 'accueil', label: 'Accueil', type: 'object', fields: [
    s_('boutonPublications', 'Bouton « Voir les publications »'),
    s_('medias', 'Texte devant les logos des médias'),
    { name: 'methode', label: '« De l’idée à la publication » (accueil)', type: 'object', fields: [
    { name: 'titre', label: 'Titre', type: 'string' }, { name: 'sousTitre', label: 'Sous-titre', type: 'string' },
    { name: 'intro', label: 'Introduction', type: 'text' },
    { name: 'etapes', label: 'Étapes', type: 'object', list: true, fields: [
      { name: 'titre', label: 'Titre', type: 'string' }, { name: 'texte', label: 'Texte', type: 'text' }, { name: 'outils', label: 'Outils', type: 'string' }] }] },
    { name: 'competencesCles', label: 'Compétences clés (Parcours en bref)', type: 'string', list: true },
    { name: 'phares', label: 'Publications phares', type: 'object', fields: [s_('titre', 'Titre'), s_('intro', 'Introduction', 'text'), s_('lienTout', 'Lien vers toutes les publications')] },
    { name: 'chiffres', label: 'En chiffres', type: 'object', fields: [
      s_('titre', 'Titre'), s_('vues', 'Libellé des vues cumulées'), s_('likes', 'Libellé des j’aime cumulés'),
      s_('annees', 'Libellé des années d’expérience'), s_('redactions', 'Libellé du nombre de rédactions'), s_('note', 'Note sous les chiffres', 'text')] },
    { name: 'parcours', label: 'Parcours en bref', type: 'object', fields: [
      s_('titre', 'Titre'), s_('competencesCles', 'Titre « Compétences clés »'), s_('langues', 'Titre « Langues »'), s_('boutonCV', 'Bouton vers le CV')] },
    { name: 'contact', label: 'Contact', type: 'object', fields: [
      s_('titre', 'Titre'), s_('intro', 'Introduction', 'text'), s_('bouton', 'Bouton d’envoi'),
      s_('note', 'Note sous le formulaire'), s_('noteInactif', 'Note quand le formulaire n’est pas encore relié'),
      s_('envoye', 'Message après un envoi réussi'), s_('erreur', 'Message en cas d’échec de l’envoi'), s_('sujet', 'Objet de l’e-mail reçu')] },
  ] },
  { name: 'publications', label: 'Page Publications', type: 'object', fields: [
    s_('titre', 'Titre'), s_('intro', 'Introduction', 'text'),
    s_('introAuteurs', 'Début de la phrase vers les pages auteur'), s_('descriptionTout', 'Description de l’onglet « Tout »', 'text'),
    s_('aucunResultat', 'Message quand aucun résultat'),
    { name: 'tousArticles', label: 'Bloc « Tous mes articles »', type: 'object', fields: [s_('titre', 'Titre'), s_('texte', 'Texte', 'text')] },
  ] },
  { name: 'cv', label: 'Page CV', type: 'object', fields: [
    s_('competencesIntro', 'Introduction des groupes de compétences', 'text'),
    { name: 'savoirEtre', label: 'Savoir-être', type: 'object', fields: [s_('titre', 'Titre'), s_('texte', 'Texte', 'text')] },
  ] },
  { name: 'mentionsLegales', label: 'Mentions légales', type: 'object', list: true, fields: [s_('titre', 'Titre'), s_('texte', 'Texte', 'text')] },
  { name: 'page404', label: 'Page introuvable (404)', type: 'object', fields: [s_('titre', 'Titre'), s_('texte', 'Texte', 'text')] },
];

const config = {
  media: [
    { name: 'publications', label: 'Images des publications', input: 'src/assets/publications', output: '/publications', categories: ['image'], rename: 'safe' },
    { name: 'logos', label: 'Logos', input: 'src/assets/logos', output: '/logos', categories: ['image'], rename: 'safe' },
    { name: 'photos', label: 'Photos de profil', input: 'src/assets/photos', output: '/photos', categories: ['image'], rename: 'safe' },
  ],
  content: [
    { name: 'publications', label: 'Publications', type: 'collection', path: 'src/content/publications', format: 'yaml',
      exclude: ['_modele.yaml'], filename: { template: '{date}-{titre}.yaml', field: 'create' },
      view: { primary: 'titre', fields: ['titre', 'media', 'date', 'categorie'] }, fields: champsPublication },
    { name: 'series', label: 'Séries de vidéos', type: 'collection', path: 'src/content/series', format: 'yaml',
      filename: { template: '{titre}.yaml', field: 'create' }, view: { primary: 'titre' }, fields: [
        { name: 'titre', label: 'Titre', type: 'string', required: true },
        { name: 'media', label: 'Média', type: 'string', required: true },
        { name: 'categorie', label: 'Catégorie', type: 'select', required: true, options: opt(categories.map((c) => ({ name: c.slug, label: c.libelle }))) },
        { name: 'accroche', label: 'Accroche', type: 'text', required: true },
        { name: 'coulisses', label: 'Les coulisses', type: 'text' },
        { name: 'phare', label: 'Position dans les publications phares', type: 'number' }] },
    { name: 'cv', label: 'CV', type: 'file', path: 'src/data/cv.yaml', format: 'yaml', fields: champsCV },
    { name: 'textes', label: 'Textes du site', type: 'file', path: 'src/data/textes.yaml', format: 'yaml', fields: champsTextes },
  ],
};

// Petit sérialiseur YAML (chaînes entre guillemets doubles, toujours valides)
const q = (v) => (typeof v === 'string' ? JSON.stringify(v) : String(v));
function yaml(v, ind = 0) {
  const pad = ' '.repeat(ind);
  if (Array.isArray(v)) {
    if (v.every((x) => typeof x !== 'object')) return `[${v.map(q).join(', ')}]`;
    return '\n' + v.map((x) => `${pad}- ${yaml(x, ind + 2).replace(/^\n\s*/, '')}`).join('\n');
  }
  if (v && typeof v === 'object') {
    return '\n' + Object.entries(v).map(([k, x]) => {
      const r = yaml(x, ind + 2);
      return `${pad}${k}:${r.startsWith('\n') ? r : ' ' + r}`;
    }).join('\n');
  }
  return q(v);
}
const sortie = `# Configuration de Pages CMS (app.pagescms.org).\n# Fichier généré par « npm run cms » à partir de src/config : ne pas le modifier à la main.\n${yaml(config).trimStart()}\n`;

if (process.argv.includes('--verifier')) {
  const actuel = existsSync('.pages.yml') ? readFileSync('.pages.yml', 'utf8') : '';
  if (actuel !== sortie) {
    console.error('✗ .pages.yml n’est plus à jour avec les catégories ou les compétences. Lancer « npm run cms » puis committer.');
    process.exit(1);
  }
  console.log('✓ .pages.yml à jour');
} else {
  writeFileSync('.pages.yml', sortie);
  console.log('✓ .pages.yml généré');
}
