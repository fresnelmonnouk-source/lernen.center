/**
 * Côté client : parties Lesen et tâches Schreiben disponibles par niveau.
 *
 * Reflète strictement les `LESEN_SPECS` et `SCHREIBEN_SPECS` du backend
 * (`lernen-de-all/api/cert-lesen.js` et `cert-schreiben.js`). Évite un
 * round-trip pour découvrir ce qui est disponible — si le backend change,
 * ce fichier doit suivre.
 *
 * Source de vérité : Goethe-Zertifikat (format publiquement documenté).
 */

import type { Level } from '@/lib/api';

export type LesenPartSpec = {
  part: number;
  title: string;
  /** Brève description française du format de la partie. */
  description: string;
  questions: number;
  questionType: 'mcq' | 'true_false' | 'three_way' | 'matching';
};

export type SchreibenTaskSpec = {
  task: number;
  title: string;
  /** Brève description française du format de la tâche. */
  description: string;
  wordCount: { min: number; max: number };
};

export const LESEN_PARTS: Record<Level, LesenPartSpec[]> = {
  A1: [
    { part: 1, title: 'Messages courts', description: 'Cartes postales, SMS, e-mails simples · vrai/faux', questions: 5, questionType: 'true_false' },
    { part: 2, title: 'Annonces', description: 'Petites annonces à associer à un besoin', questions: 5, questionType: 'matching' },
    { part: 3, title: 'Panneaux & étiquettes', description: 'Quotidien · choisir l’option utile', questions: 5, questionType: 'mcq' },
  ],
  A2: [
    { part: 1, title: 'Article court', description: 'Presse simple ou blog · compréhension', questions: 5, questionType: 'mcq' },
    { part: 2, title: 'Annonces variées', description: '5 textes à associer à 7 personnes', questions: 5, questionType: 'matching' },
    { part: 3, title: 'E-mails personnels', description: 'Vrai / faux · 4 affirmations', questions: 4, questionType: 'true_false' },
  ],
  B1: [
    { part: 1, title: 'Article informatif', description: 'Blog, forum ou presse · compréhension globale et détaillée', questions: 6, questionType: 'mcq' },
    { part: 2, title: 'Deux articles', description: 'Identifier qui a quelle opinion', questions: 6, questionType: 'matching' },
    { part: 3, title: 'Texte argumentatif', description: 'Vrai / faux / non mentionné', questions: 7, questionType: 'three_way' },
    { part: 4, title: 'Sept annonces', description: 'À associer à 10 situations', questions: 7, questionType: 'matching' },
  ],
  B2: [
    { part: 1, title: 'Article de presse', description: 'Société, culture, sciences · compréhension fine et inférence', questions: 5, questionType: 'mcq' },
    { part: 2, title: 'Commentaires lecteurs', description: '4 commentaires à associer à des opinions', questions: 6, questionType: 'matching' },
    { part: 3, title: 'Éditorial', description: 'Arguments de l’auteur · vrai / faux / non mentionné', questions: 6, questionType: 'three_way' },
  ],
};

export const SCHREIBEN_TASKS: Record<Level, SchreibenTaskSpec[]> = {
  A1: [
    { task: 1, title: 'Formulaire', description: 'Remplir un formulaire avec des informations personnelles fictives', wordCount: { min: 30, max: 50 } },
    { task: 2, title: 'Court message', description: 'SMS, carte postale ou e-mail très simple', wordCount: { min: 25, max: 40 } },
  ],
  A2: [
    { task: 1, title: 'E-mail personnel', description: 'À un ami ou un proche · invitation, remerciement, récit', wordCount: { min: 30, max: 50 } },
    { task: 2, title: 'E-mail semi-formel', description: 'À un voisin ou collègue · demande, excuse, info', wordCount: { min: 30, max: 50 } },
  ],
  B1: [
    { task: 1, title: 'E-mail formel', description: 'Réservation, plainte, demande d’information', wordCount: { min: 80, max: 120 } },
    { task: 2, title: 'Contribution forum', description: 'Donner son opinion sur un sujet de société', wordCount: { min: 80, max: 120 } },
    { task: 3, title: 'Message privé', description: 'Raconter, s’excuser ou expliquer à un proche', wordCount: { min: 40, max: 60 } },
  ],
  B2: [
    { task: 1, title: 'Texte argumentatif', description: 'Lettre ouverte, blog, tribune · opinion étayée', wordCount: { min: 150, max: 200 } },
    { task: 2, title: 'E-mail très formel', description: 'Administration, employeur, université · registre soutenu', wordCount: { min: 100, max: 150 } },
  ],
};

export const LEVELS: Level[] = ['A1', 'A2', 'B1', 'B2'];

export const GOETHE_DISCLAIMER =
  'Tests inspirés du format Goethe-Zertifikat. Contenus 100% originaux générés par IA. Non affilié au Goethe-Institut.';
