// npm run taille : affiche la taille du dépôt et du site construit (brief 12.1).
import { execSync } from 'node:child_process';
import { existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

function taille(dossier, ignorer = []) {
  let total = 0;
  for (const nom of readdirSync(dossier)) {
    if (ignorer.includes(nom)) continue;
    const chemin = join(dossier, nom);
    const s = statSync(chemin);
    total += s.isDirectory() ? taille(chemin, ignorer) : s.size;
  }
  return total;
}
const mo = (o) => `${(o / 1024 / 1024).toFixed(1)} Mo`;

const depot = taille('.', ['node_modules', 'dist', '.astro', '.git']);
console.log(`Fichiers du dépôt (hors node_modules, dist) : ${mo(depot)}`);
try {
  const git = execSync('git count-objects -vH', { encoding: 'utf8' }).match(/size-pack: (.+)/)?.[1];
  if (git) console.log(`Historique Git : ${git}`);
} catch {}
if (existsSync('dist')) console.log(`Site construit (dist/) : ${mo(taille('dist'))} (limite GitHub Pages : 1 Go)`);
else console.log('Site construit : lancer « npm run build » d’abord.');

// Images de plus de 200 Ko : à compresser avant de committer
const lourdes = [];
(function chercher(dossier) {
  for (const nom of readdirSync(dossier)) {
    const chemin = join(dossier, nom);
    const s = statSync(chemin);
    if (s.isDirectory()) chercher(chemin);
    else if (/\.(jpe?g|png|webp|gif)$/i.test(nom) && s.size > 200 * 1024) lourdes.push(`${chemin} (${Math.round(s.size / 1024)} Ko)`);
  }
})('src');
console.log(lourdes.length ? `Images de plus de 200 Ko :\n  ${lourdes.join('\n  ')}` : 'Aucune image de plus de 200 Ko dans src/.');
