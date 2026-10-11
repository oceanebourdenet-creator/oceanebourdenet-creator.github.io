// Textes fixes du site (src/data/textes.yaml, modifiables dans Pages CMS).
import { getEntry } from 'astro:content';
export async function textes() {
  return (await getEntry('textes', 'textes'))!.data;
}
