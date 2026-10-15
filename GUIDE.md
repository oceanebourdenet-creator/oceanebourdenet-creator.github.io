# Guide : mettre à jour le site

Ce guide explique comment ajouter une publication, modifier un texte ou le CV, sans connaissances techniques.
Le site se met à jour tout seul 2 à 3 minutes après chaque enregistrement.

Il y a deux façons de faire, qui modifient exactement les mêmes fichiers. On peut passer de l'une à l'autre à tout moment.

- **Pages CMS** (recommandé) : des formulaires, sans jamais voir de code.
- **Directement dans les fichiers** : sur github.com ou dans un éditeur de code.

---

## 1. Se connecter à Pages CMS

1. Aller sur **https://app.pagescms.org** et cliquer sur **Sign in with GitHub**.
2. Autoriser Pages CMS à accéder au dépôt `oceanebourdenet-creator.github.io` (demandé une seule fois).
3. Choisir le dépôt, puis la branche **main**.

Dans le menu de gauche : **Publications**, **Séries de vidéos**, **CV**, et la médiathèque (images et logos).

---

## 2. Ajouter une publication

1. **Publications → Add an entry** (ajouter une entrée).
2. Remplir au minimum les champs obligatoires :
   - **Titre**
   - **Média** : écrit exactement comme dans le CV (ex. `TV5MONDE`, `France-Antilles`), pour que les liens entre le CV et les publications fonctionnent.
   - **Date de publication**
   - **Lien de la publication** : l'adresse complète, qui commence par `https://`.
   - **Catégorie** et **Format** : à choisir dans la liste.
   - **Accroche** : 1 à 2 phrases écrites par vous, pas le chapô du média.
3. Facultatif, mais conseillé :
   - **Les coulisses** : ce que vous avez fait pour réaliser le sujet. Pour une liste, commencer chaque ligne par `- `.
   - **Image d'aperçu** : envoyer une image de **1200 px de large maximum et moins de 200 Ko**. Sans image, le site affiche un visuel sobre avec le nom du média.
   - **Compétences mobilisées** : techniques et humaines, à choisir dans les listes.
4. Cliquer sur **Save** (enregistrer). C'est tout.

### Pour une vidéo Instagram, YouTube ou TikTok

- **Plateforme** : choisir dans la liste.
- **Identifiant de la vidéo** : pour qu'elle se lise sur le site. Dans le lien
  `https://www.instagram.com/reel/Dc3_k3gN5kT/`, l'identifiant est `Dc3_k3gN5kT`.
  Pour YouTube, c'est le code après `v=` ou après `/shorts/`.
- **Publication Instagram en collaboration** : à cocher si la vidéo est partagée entre plusieurs comptes (le site l'explique alors sous la vidéo).

### Regrouper plusieurs vidéos d'un même événement (série)

1. Créer la série dans **Séries de vidéos** (titre, média, catégorie, accroche, coulisses).
2. Dans chaque vidéo concernée, remplir le champ **Série** avec le nom du fichier de la série, sans `.yaml` (ex. `tour-des-yoles-2026`).

Les vidéos apparaissent alors en une seule carte « Série » sur la page Publications.

---

## 3. Mettre en avant une publication ou masquer ses chiffres

- **Publications phares** (carrousel de l'accueil) : remplir **Position dans les publications phares** avec un nombre (1 = première carte). Laisser vide pour la retirer.
  Le champ existe aussi pour une série.
- **Chiffres** (vues, j'aime, commentaires) :
  - les saisir à la main, avec la **date du relevé** (obligatoire dès qu'un chiffre est rempli) ;
  - cocher **Afficher les chiffres sur la carte** pour les montrer. Décochez-la pour une publication dont les chiffres sont faibles : ils ne compteront pas non plus dans le total de l'accueil.

---

## 4. Modifier le CV

**CV** dans le menu de gauche. Tout y est : profil, expériences, formations, compétences, langues, engagement, et aussi la section « De l'idée à la publication » et les compétences clés de l'accueil.

- Les dates s'écrivent `AAAA-MM` (ex. `2025-09`), ou `aujourd'hui` pour une expérience en cours.
- **Page auteur sur le site du média** : ajoute automatiquement un lien « Voir mes articles sur… » dans le CV et sur la page Publications.
- Le **nom du média** d'une expérience doit être écrit comme dans les publications, pour afficher « Voir mes publications pour… ».

### Changer la photo

**CV → Profil → Photo** : envoyer la nouvelle photo (format portrait conseillé), puis régler **Cadrage de la photo** :

- **Position horizontale / verticale du visage (%)** : où se trouve le visage dans la photo (0 = bord gauche ou haut, 100 = bord droit ou bas). Le site garde ce point visible et le centre dans la vignette ronde sur mobile.
- **Zoom de la vignette ronde sur mobile** : entre 1 (photo entière) et 6. Autour de 3 pour bien voir le visage.

Après l'enregistrement, vérifier le rendu sur téléphone et ajuster de quelques points si besoin.

---

## 5. Quand un article n'est plus en ligne

Dans la publication concernée :

- si une copie existe sur la Wayback Machine (https://web.archive.org), coller son adresse dans **Lien archivé** et cocher **Le lien d'origine ne fonctionne plus** : la carte mènera à la version archivée ;
- sans copie, cocher seulement **Le lien d'origine ne fonctionne plus** : la carte reste affichée avec la mention « Article plus disponible en ligne ».

Si l'article a juste changé d'adresse, mettre à jour le **Lien de la publication**.

---

## 6. Vérifier que le site est à jour

1. Sur github.com, ouvrir le dépôt puis l'onglet **Actions**.
2. Le dernier lancement « Déploiement GitHub Pages » doit avoir une **coche verte** (2 à 3 minutes après l'enregistrement).
3. Recharger le site : https://oceanebourdenet-creator.github.io

**En cas de croix rouge** : rien n'est cassé, la version précédente du site reste en ligne.
Cliquer sur le lancement en erreur, puis sur l'étape **Construire le site** : le message indique en français le fichier et le champ à corriger
(par exemple « Le champ « accroche » est obligatoire » ou « Image introuvable »). Corriger la publication dans Pages CMS et enregistrer à nouveau.

---

## 7. Sans Pages CMS : modifier directement les fichiers

Toujours possible, sur github.com (icône crayon pour modifier, **Add file** pour ajouter) ou dans un éditeur de code.

| Contenu | Fichier |
|---|---|
| Publications | `src/content/publications/` (un fichier `.yaml` par publication) |
| Modèle commenté d'une publication | `src/content/publications/_modele.yaml` |
| Séries de vidéos | `src/content/series/` |
| CV, accueil (méthode, compétences clés) | `src/data/cv.yaml` |
| Images des publications | `src/assets/publications/` (chemin à écrire : `/publications/nom.jpg`) |
| Logos | `src/assets/logos/` (chemin à écrire : `/logos/nom.svg`) |
| Catégories | `src/config/categories.ts` puis lancer `npm run cms` |
| Compétences (libellés) | `src/config/competences.ts` puis lancer `npm run cms` |

Pour ajouter une publication à la main : dupliquer `_modele.yaml`, le renommer `AAAA-MM-JJ-titre-court.yaml` et remplir les champs.

Commandes utiles (sur un ordinateur avec Node.js) :

- `npm run dev` : voir le site en local sur http://localhost:4321, mis à jour à chaque modification ;
- `npm run build` : vérifier que tout est correct avant d'envoyer ;
- `npm run cms` : régénérer la configuration de Pages CMS après avoir modifié les catégories ou les compétences ;
- `npm run taille` : taille du site et images trop lourdes.
