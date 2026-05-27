import rawData from './vocabulary.json';
import type { Level } from '@/lib/api';

export type Article = 'der' | 'die' | 'das';

/**
 * Un mot de vocabulaire (format compact porté de lernen-de-all/public/data.js).
 * f = français · d = allemand (article inclus) · l = niveau CECRL · e = emoji ·
 * a = article (noms uniquement) · i = id Unsplash (optionnel, non utilisé en V1).
 */
export type VocabWord = {
  f: string;
  d: string;
  l: Level;
  e?: string;
  a?: Article;
  i?: string;
};

export type VocabCategory = 'noms' | 'verbes' | 'adjectifs' | 'prepositions' | 'expressions';

// Le JSON s'importe avec un typage large (string) ; on le rétrécit ici une fois.
const VOCAB = rawData as unknown as Record<VocabCategory, VocabWord[]>;

/** Ordre d'affichage + libellés FR des catégories. */
export const CATEGORIES: { key: VocabCategory; label: string }[] = [
  { key: 'noms', label: 'Noms' },
  { key: 'verbes', label: 'Verbes' },
  { key: 'adjectifs', label: 'Adjectifs' },
  { key: 'prepositions', label: 'Prépositions' },
  { key: 'expressions', label: 'Expressions' },
];

export const LEVELS: Level[] = ['A1', 'A2', 'B1', 'B2'];

/** Mots d'une catégorie, optionnellement filtrés par niveau CECRL. */
export function getWords(category: VocabCategory, level: Level | null): VocabWord[] {
  const all = VOCAB[category] ?? [];
  return level ? all.filter((w) => w.l === level) : all;
}
