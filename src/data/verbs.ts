import rawData from './verbs.json';
import type { Level } from '@/lib/api';

/**
 * Verbe pré-conjugué (port 1:1 de lernen-de-all/public/verbs-data.js).
 *
 * Format compact :
 * - v : infinitif (peut être pronominal, ex. "sich freuen")
 * - f : traduction française
 * - t : type morphologique
 * - x : auxiliaire de composition (Perfekt)
 * - s : verbe séparable
 * - P : Präsens conjugué pour les 6 personnes
 * - T : Präteritum conjugué pour les 6 personnes
 * - K : Perfekt à la 3ᵉ personne du singulier (ex. "hat gegessen") — sert de
 *       base pour reconstruire les autres personnes (auxiliaire + participe)
 * - l : niveau CECRL minimal recommandé
 * - n : note pédagogique courte (français)
 */
export type VerbType = 'stark' | 'schwach' | 'gemischt' | 'modal';
export type Auxiliary = 'haben' | 'sein';

export type VerbEntry = {
  v: string;
  f: string;
  t: VerbType;
  x: Auxiliary;
  s: boolean;
  P: [string, string, string, string, string, string];
  T: [string, string, string, string, string, string];
  K: string;
  l: Level;
  n: string;
};

const VERBS = rawData as unknown as VerbEntry[];

/** Personnes dans l'ordre canonique (mêmes labels que ConjugateResult.tsx). */
export const VERB_PERSONS: readonly string[] = [
  'ich',
  'du',
  'er/sie/es',
  'wir',
  'ihr',
  'sie/Sie',
];

/** Conjugaison du présent des auxiliaires (utilisée pour reconstruire Perfekt). */
const AUX_PRASENS: Record<Auxiliary, [string, string, string, string, string, string]> = {
  haben: ['habe', 'hast', 'hat', 'haben', 'habt', 'haben'],
  sein: ['bin', 'bist', 'ist', 'sind', 'seid', 'sind'],
};

export type LocalTense = 'Präsens' | 'Präteritum' | 'Perfekt';
export const LOCAL_TENSES: readonly LocalTense[] = ['Präsens', 'Präteritum', 'Perfekt'];

/**
 * Reconstruit le Perfekt complet (auxiliaire + participe) pour les 6 personnes
 * à partir de la er-form `K`. Le participe ne varie pas en allemand, seul
 * l'auxiliaire se conjugue.
 *
 * Ex. K = "hat gegessen" + x = "haben" → ["habe gegessen", "hast gegessen", ...]
 */
export function buildPerfekt(entry: VerbEntry): [string, string, string, string, string, string] {
  const aux = AUX_PRASENS[entry.x];
  // On retire l'auxiliaire er-form de `K` pour ne garder que le participe (+
  // éventuellement le pronom réfléchi placé avant : "hat sich gesetzt").
  const erAux = entry.x === 'haben' ? 'hat' : 'ist';
  const rest = entry.K.startsWith(erAux + ' ') ? entry.K.slice(erAux.length + 1) : entry.K;
  return aux.map((a) => `${a} ${rest}`) as [string, string, string, string, string, string];
}

/** Renvoie les 6 personnes pour un temps local donné. */
export function getForms(entry: VerbEntry, tense: LocalTense): readonly string[] {
  if (tense === 'Präsens') return entry.P;
  if (tense === 'Präteritum') return entry.T;
  return buildPerfekt(entry);
}

export type VerbFilter = { query?: string; level?: Level | null; type?: VerbType | null };

/** Filtre les 98 verbes par recherche texte (infinitif ou traduction) + niveau + type. */
export function getVerbs(filter: VerbFilter = {}): VerbEntry[] {
  const q = filter.query?.trim().toLowerCase() ?? '';
  return VERBS.filter((v) => {
    if (filter.level && v.l !== filter.level) return false;
    if (filter.type && v.t !== filter.type) return false;
    if (!q) return true;
    return v.v.toLowerCase().includes(q) || v.f.toLowerCase().includes(q);
  });
}

export const ALL_VERBS: readonly VerbEntry[] = VERBS;
export const VERB_TYPES: readonly VerbType[] = ['stark', 'schwach', 'gemischt', 'modal'];
export const VERB_TYPE_LABEL: Record<VerbType, string> = {
  stark: 'Fort',
  schwach: 'Faible',
  gemischt: 'Mixte',
  modal: 'Modal',
};
