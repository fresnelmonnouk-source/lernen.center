/**
 * Les 9 temps acceptés par POST /api/conjugate (VALID_TENSES côté backend).
 * L'ordre suit la progression pédagogique : présent → passés → futurs → modes.
 * Ne pas réordonner sans raison : le premier élément est le temps par défaut.
 */
export const TENSES = [
  'Präsens',
  'Perfekt',
  'Präteritum',
  'Plusquamperfekt',
  'Futur I',
  'Futur II',
  'Konjunktiv I',
  'Konjunktiv II',
  'Imperativ',
] as const;

export type Tense = (typeof TENSES)[number];

/** Glose française courte affichée sous chaque temps dans le sélecteur. */
export const TENSE_GLOSS: Record<Tense, string> = {
  Präsens: 'Présent',
  Perfekt: 'Passé composé',
  Präteritum: 'Prétérit',
  Plusquamperfekt: 'Plus-que-parfait',
  'Futur I': 'Futur',
  'Futur II': 'Futur antérieur',
  'Konjunktiv I': 'Subjonctif I',
  'Konjunktiv II': 'Conditionnel',
  Imperativ: 'Impératif',
};
