import type { VocabWord } from '@/data/vocabulary';

/** Nombre de questions par partie (borné par la taille du pool filtré). */
export const QUIZ_LENGTH = 10;
/** Minimum de mots requis pour fabriquer un QCM à 4 options. */
export const QCM_MIN_POOL = 4;

export type QcmQuestion = {
  word: VocabWord;
  options: string[]; // 4 traductions françaises, ordre déjà mélangé
  correctIndex: number;
};

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * Construit jusqu'à `count` questions QCM depuis un pool. Chaque question = la
 * bonne traduction FR + 3 distracteurs uniques tirés du même pool. Renvoie []
 * si le pool est trop petit pour 4 options.
 */
export function buildQcm(pool: VocabWord[], count: number): QcmQuestion[] {
  if (pool.length < QCM_MIN_POOL) return [];
  const targets = shuffle(pool).slice(0, Math.min(count, pool.length));
  return targets.map((word) => {
    const seen = new Set([word.f]);
    const distractors: string[] = [];
    for (const w of shuffle(pool)) {
      if (distractors.length === 3) break;
      if (!seen.has(w.f)) {
        seen.add(w.f);
        distractors.push(w.f);
      }
    }
    const options = shuffle([word.f, ...distractors]);
    return { word, options, correctIndex: options.indexOf(word.f) };
  });
}

/** Tire jusqu'à `count` mots mélangés pour le Super Quiz (écriture). */
export function buildWriteDeck(pool: VocabWord[], count: number): VocabWord[] {
  return shuffle(pool).slice(0, Math.min(count, pool.length));
}

/** Normalise une saisie allemande pour comparaison (minuscule, espaces compactés). */
export function normalizeGerman(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, ' ');
}

/** Correction stricte : la saisie doit égaler `d` (article + orthographe inclus). */
export function checkWrite(input: string, word: VocabWord): boolean {
  return normalizeGerman(input) === normalizeGerman(word.d);
}
