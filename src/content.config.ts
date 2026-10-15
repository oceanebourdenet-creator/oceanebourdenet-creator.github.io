// Collections de contenu : publications, séries de vidéos et CV.
// Les schémas valident chaque fiche : un champ manquant ou invalide fait échouer le build
// avec un message en français qui indique le fichier et le champ concernés (brief 11.4).
import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { slugsCategories } from './config/categories';
import { clesTechniques, clesHumaines } from './config/competences';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const liste = (vals: readonly string[]) => vals.join(', ');
// Un champ laissé vide dans le CMS peut être enregistré "" ou null : on le traite comme absent.
const vide = (v: unknown) => (v === '' || v === null ? undefined : v);
const facultatif = <T extends z.ZodType>(s: T) => z.preprocess(vide, s.optional());
const obligatoire = (champ: string) => ({ error: `Le champ « ${champ} » est obligatoire.` });

const categorie = z.enum(slugsCategories, {
  error: `Catégorie inconnue. Choisir parmi : ${liste(slugsCategories)} (liste dans src/config/categories.ts).`,
});
const competences = z
  .object({
    techniques: z.array(z.enum(clesTechniques, { error: `Compétence technique inconnue. Clés possibles : ${liste(clesTechniques)} (src/config/competences.ts).` })).default([]),
    humaines: z.array(z.enum(clesHumaines, { error: `Compétence humaine inconnue. Clés possibles : ${liste(clesHumaines)} (src/config/competences.ts).` })).default([]),
  })
  .default({ techniques: [], humaines: [] });
// Coulisses : un paragraphe, ou une liste (chaque ligne commençant par « - »)
const coulisses = facultatif(z.string());

// Image : chemin « /publications/fichier.jpg » ou « /logos/fichier.svg », fichier présent dans src/assets
const cheminImage = (dossier: 'publications' | 'logos' | 'photos') =>
  z
    .string()
    .regex(new RegExp(`^/${dossier}/[^/]+\\.(jpe?g|png|webp|avif|svg)$`, 'i'), `L’image doit être un chemin du type « /${dossier}/nom-du-fichier.jpg ».`)
    .refine((p) => existsSync(join(process.cwd(), 'src/assets', p)), { error: (iss) => `Image introuvable : src/assets${iss.input} n’existe pas.` });
const chiffre = facultatif(z.number({ error: 'Un chiffre doit être un nombre entier, sans espace ni « k ».' }).int().nonnegative());

const publications = defineCollection({
  // Les fichiers commençant par « _ » (comme _modele.yaml) sont ignorés.
  loader: glob({ base: './src/content/publications', pattern: '**/[^_]*.{yaml,yml,md}' }),
  schema: z
      .object({
        titre: z.string(obligatoire('titre')),
        media: z.string(obligatoire('media')),
        date: z.coerce.date({ error: 'Date invalide : utiliser le format AAAA-MM-JJ.' }),
        url: z.url({ error: 'Le champ « url » doit être une adresse complète (https://…).' }),
        archive: facultatif(z.url({ error: 'Le champ « archive » doit être une adresse complète.' })),
        categorie,
        format: z.enum(['article', 'reportage', 'enquete', 'podcast', 'video', 'interview', 'autre'], {
          error: 'Format inconnu. Choisir parmi : article, reportage, enquete, podcast, video, interview, autre.',
        }),
        thematiques: facultatif(z.array(z.string())),
        accroche: z.string(obligatoire('accroche')).min(1, 'L’accroche ne peut pas être vide.'),
        coulisses,
        role: facultatif(z.string()),
        image: facultatif(cheminImage('publications')),
        phare: facultatif(z.number().int().positive()),
        lienMort: z.boolean().default(false),
        derniereVerification: facultatif(z.coerce.date()),
        plateforme: facultatif(z.enum(['instagram', 'tiktok', 'youtube', 'facebook', 'x', 'autre'])),
        embed: facultatif(z.string()),
        vertical: z.boolean().default(false),
        duree: facultatif(z.string()),
        serie: facultatif(reference('series')),
        collaboration: z.boolean().default(false),
        vues: chiffre,
        likes: chiffre,
        commentaires: chiffre,
        partages: chiffre,
        dateChiffres: facultatif(z.coerce.date()),
        sourceChiffres: facultatif(z.enum(['public', 'media'])),
        afficherChiffres: z.boolean().default(false),
        competences,
      })
      .refine((d) => !(d.vues || d.likes || d.commentaires || d.partages) || d.dateChiffres, {
        error: 'Le champ « dateChiffres » est obligatoire dès qu’un chiffre (vues, likes…) est renseigné.',
        path: ['dateChiffres'],
      })
      .refine((d) => !d.embed || d.plateforme, {
        error: 'Une vidéo intégrée (« embed ») doit préciser sa « plateforme ».',
        path: ['plateforme'],
      }),
});

const series = defineCollection({
  loader: glob({ base: './src/content/series', pattern: '**/[^_]*.{yaml,yml}' }),
  schema: z.object({
    titre: z.string(obligatoire('titre')),
    media: z.string(obligatoire('media')),
    categorie,
    accroche: z.string(obligatoire('accroche')),
    coulisses,
    phare: facultatif(z.number().int().positive()),
  }),
});

const periode = { debut: z.string().regex(/^\d{4}-\d{2}$/, 'Date de début au format AAAA-MM.'), fin: z.string().regex(/^(\d{4}-\d{2}|aujourd'hui)$/, 'Date de fin au format AAAA-MM, ou « aujourd’hui ».') };

const cv = defineCollection({
  loader: glob({ base: './src/data', pattern: 'cv.yaml' }),
  schema: z.object({
      profil: z.object({
        nom: z.string(),
        titre: z.string(),
        ville: z.string(),
        accroche: z.string(),
        resume: z.string(),
        reseaux: z.array(z.object({ nom: z.string(), url: z.url() })).default([]),
        photo: cheminImage('photos'),
        // Cadrage : point à garder visible (en % de la largeur et de la hauteur) et zoom de la vignette ronde sur mobile
        cadrage: z.object({
          x: z.number().min(0).max(100).default(50),
          y: z.number().min(0).max(100).default(40),
          zoom: z.number().min(1).max(6).default(2.5),
        }).default({ x: 50, y: 40, zoom: 2.5 }),
      }),
      experiences: z.array(
        z.object({
          media: z.string(),
          logo: cheminImage('logos').optional(),
          pageAuteur: z.url().optional(),
          poste: z.string(),
          type: z.string(),
          lieu: z.string(),
          ...periode,
          description: z.string().optional(),
        }),
      ),
      formations: z.array(
        z.object({
          etablissement: z.string(),
          logos: z.array(cheminImage('logos')).optional(),
          diplome: z.string(),
          ...periode,
          description: z.string().optional(),
          echange: z.object({ titre: z.string(), etablissement: z.string(), logos: z.array(cheminImage('logos')).optional(), ...periode }).optional(),
        }),
      ),
      competences: z.object({
        phares: z.array(z.object({ titre: z.string(), cle: z.string(), texte: z.string(), exemple: z.object({ titre: z.string(), url: z.url() }) })),
        groupes: z.array(z.object({ groupe: z.string(), items: z.array(z.object({ nom: z.string(), cle: z.string().optional() })), materiel: z.array(z.string()).optional() })),
      }),
      langues: z.array(z.object({ langue: z.string(), niveau: z.enum(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']) })),
      engagement: z.array(
        z.object({
          structure: z.string(),
          logo: cheminImage('logos').optional(),
          role: z.string(),
          ...periode,
          description: z.string().optional(),
          missions: z.array(z.string()).optional(),
          lien: z.object({ libelle: z.string(), url: z.url() }).optional(),
        }),
      ),
      distinctions: z.array(z.object({ titre: z.string(), annee: z.string(), description: z.string().optional() })).default([]),
    }),
});

const t = z.string();
const textes = defineCollection({
  loader: glob({ base: './src/data', pattern: 'textes.yaml' }),
  schema: z.object({
    accueil: z.object({
      boutonPublications: t, medias: t,
      competencesCles: z.array(z.string()).default([]),
      methode: z.object({
        titre: t,
        sousTitre: z.string().optional(),
        intro: z.string().optional(),
        etapes: z.array(z.object({ titre: t, texte: t, outils: z.string().optional() })),
      }),
      phares: z.object({ titre: t, intro: t, lienTout: t }),
      chiffres: z.object({ titre: t, vues: t, likes: t, annees: t, redactions: t, note: t }),
      parcours: z.object({ titre: t, competencesCles: t, langues: t, boutonCV: t }),
      contact: z.object({ titre: t, intro: t, bouton: t, note: t, noteInactif: t, envoye: t, erreur: t, sujet: t }),
    }),
    publications: z.object({
      titre: t, intro: t, introAuteurs: t, descriptionTout: t, aucunResultat: t,
      tousArticles: z.object({ titre: t, texte: t }),
    }),
    cv: z.object({ competencesIntro: t, savoirEtre: z.object({ titre: t, texte: t }) }),
    mentionsLegales: z.array(z.object({ titre: t, texte: t })),
    page404: z.object({ titre: t, texte: t }),
  }),
});

export const collections = { publications, series, cv, textes };
