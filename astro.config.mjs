// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// Site publié à la racine de oceanebourdenet-creator.github.io : pas de `base`.
// Avec un nom de domaine personnalisé, remplacer `site` (et ajouter public/CNAME).
export default defineConfig({
  site: 'https://oceanebourdenet-creator.github.io',
  trailingSlash: 'ignore',
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [sitemap()],
});
