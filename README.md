# Portfolio d'Océane Bourdenet

Site portfolio d'Océane Bourdenet, journaliste vidéo et web : publications (vidéos et articles) et CV en ligne.

**Site en ligne :** https://oceanebourdenet-creator.github.io

## Mettre à jour le site

Tout se fait sans toucher au code, depuis **Pages CMS** (https://app.pagescms.org) ou directement dans les fichiers.
Le mode d'emploi pas à pas est dans [GUIDE.md](GUIDE.md).

## Pour les développeurs

Site statique construit avec [Astro](https://astro.build) et Tailwind CSS, publié sur GitHub Pages à chaque push sur `main`.

```sh
npm install
npm run dev      # site en local sur http://localhost:4321
npm run build    # vérifie les fiches et construit le site dans dist/
npm run cms      # régénère .pages.yml après une modification des catégories ou des compétences
npm run taille   # taille du site et images trop lourdes
```

| Contenu | Emplacement |
|---|---|
| Publications (une fiche par publication) | `src/content/publications/` |
| Séries de vidéos | `src/content/series/` |
| CV | `src/data/cv.yaml` |
| Textes fixes des pages | `src/data/textes.yaml` |
| Catégories, compétences, réglages | `src/config/` |
| Images et logos | `src/assets/` |

## Droits

Contenus, textes et photographies : © Océane Bourdenet, tous droits réservés. Aucune réutilisation sans autorisation.
Les images d'aperçu des publications et les logos appartiennent à leurs médias respectifs.
