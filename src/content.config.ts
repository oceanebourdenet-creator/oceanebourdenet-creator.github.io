// Collections de contenu : publications, séries de vidéos et CV.
// Les schémas valident chaque fiche : un champ manquant ou invalide fait échouer le build
// avec un message en français qui indique le fichier et le champ concernés (brief 11.4).
import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { slugsCategories } from './config/categories';
import { clesTechniques, clesHumaines } from './config/competences';

const liste = (vals: readonly string[]) => vals.join(', ');
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
// Coulisses : un paragraphe, ou une liste de phrases
const coulisses = z.union([z.string(), z.array(z.string())]).optional();
const chiffre = z.number({ error: 'Un chiffre doit être un nombre entier, sans espace ni « k ».' }).int().nonnegative().optional();

const publications = defineCollection({
  // Les fichiers commençant par « _ » (comme _modele.yaml) sont ignorés.
  loader: glob({ base: './src/content/publications', pattern: '**/[^_]*.{yaml,yml,md}' }),
  schema: ({ image }) =>
    z
      .object({
        titre: z.string(obligatoire('titre')),
        media: z.string(obligatoire('media')),
        date: z.coerce.date({ error: 'Date invalide : utiliser le format AAAA-MM-JJ.' }),
        url: z.url({ error: 'Le champ « url » doit être une adresse complète (https://…).' }),
        archive: z.url({ error: 'Le champ « archive » doit être une adresse complète.' }).optional(),
        categorie,
        format: z.enum(['article', 'reportage', 'enquete', 'podcast', 'video', 'interview', 'autre'], {
          error: 'Format inconnu. Choisir parmi : article, reportage, enquete, podcast, video, interview, autre.',
        }),
        thematiques: z.array(z.string()).optional(),
        accroche: z.string(obligatoire('accroche')).min(1, 'L’accroche ne peut pas être vide.'),
        coulisses,
        role: z.string().optional(),
        image: image().optional(),
        phare: z.number().int().positive().optional(),
        lienMort: z.boolean().default(false),
        derniereVerification: z.coerce.date().optional(),
        plateforme: z.enum(['instagram', 'tiktok', 'youtube', 'facebook', 'x', 'autre']).optional(),
        embed: z.string().optional(),
        vertical: z.boolean().default(false),
        duree: z.string().optional(),
        serie: reference('series').optional(),
        collaboration: z.boolean().default(false),
        vues: chiffre,
        likes: chiffre,
        commentaires: chiffre,
        partages: chiffre,
        dateChiffres: z.coerce.date().optional(),
        sourceChiffres: z.enum(['public', 'media']).optional(),
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
    phare: z.number().int().positive().optional(),
  }),
});

const periode = { debut: z.string().regex(/^\d{4}-\d{2}$/, 'Date de début au format AAAA-MM.'), fin: z.string().regex(/^(\d{4}-\d{2}|aujourd'hui)$/, 'Date de fin au format AAAA-MM, ou « aujourd’hui ».') };

const cv = defineCollection({
  loader: glob({ base: './src/data', pattern: 'cv.yaml' }),
  schema: ({ image }) =>
    z.object({
      profil: z.object({
        nom: z.string(),
        titre: z.string(),
        ville: z.string(),
        accroche: z.string(),
        resume: z.string(),
        reseaux: z.array(z.object({ nom: z.string(), url: z.url() })).default([]),
      }),
      experiences: z.array(
        z.object({
          media: z.string(),
          logo: image().optional(),
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
          logos: z.array(image()).optional(),
          diplome: z.string(),
          ...periode,
          description: z.string().optional(),
          echange: z.object({ titre: z.string(), etablissement: z.string(), logos: z.array(image()).optional(), ...periode }).optional(),
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
          logo: image().optional(),
          role: z.string(),
          ...periode,
          description: z.string().optional(),
          missions: z.array(z.string()).optional(),
          lien: z.object({ libelle: z.string(), url: z.url() }).optional(),
        }),
      ),
      distinctions: z.array(z.object({ titre: z.string(), annee: z.string(), description: z.string().optional() })).default([]),
      competencesCles: z.array(z.string()).default([]),
      methode: z.object({
        titre: z.string(),
        sousTitre: z.string().optional(),
        intro: z.string().optional(),
        etapes: z.array(z.object({ titre: z.string(), texte: z.string(), outils: z.string().optional() })),
      }),
    }),
});

export const collections = { publications, series, cv };
