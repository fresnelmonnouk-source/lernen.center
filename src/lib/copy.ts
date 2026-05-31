/**
 * Microcopy library — un seul endroit pour faire évoluer le ton.
 *
 * Règles voix : tutoiement systématique, ton adulte/brutal, anti-gamification.
 * Pas d'emojis, pas d'exclamations puériles, formulations courtes et directes.
 *
 * Source : audit Marcus (2026-05-31).
 */

export const COPY = {
  // CTAs récurrents
  retry: 'Réessayer',
  continue: 'Continuer',
  back: 'Retour',
  next: 'Suivant',
  prev: 'Précédent',
  finish: 'Terminer',
  cancel: 'Annuler',
  validate: 'Valider',

  // Actions de jeu
  start: 'Commencer',
  startAgain: 'Recommencer',
  newRound: 'Nouveau tour',
  showAnswer: 'Voir la réponse',
  correct: 'Correct',
  incorrect: 'Incorrect',

  // États
  loadingShort: 'Chargement…',
  loadingAi: 'L’IA réfléchit…',
  loadingGrade: 'Correction en cours…',
  emptyFilter: 'Aucun résultat. Élargis tes filtres.',

  // Erreurs
  errGeneric: 'Une erreur est survenue. Réessaie dans un instant.',
  errNetwork: 'Pas de connexion. Vérifie ton réseau et réessaie.',
  errSession: 'Ta session a expiré. Reconnecte-toi pour continuer.',
  errGenerate: 'Génération impossible. Réessaie.',
  errGrade: 'Correction impossible. Réessaie.',

  // Disclaimers
  aiDisclaimer: 'Généré par IA. Vérifie les points critiques avant un examen réel.',
} as const;
