/**
 * Request/response types for the Vercel backend.
 *
 * Source of truth: lernen-de-all/API_ENDPOINTS.md + README.md.
 * Conjugation + Test IA + Certification are fully typed here. The Cours and
 * Profil endpoints (generate-course, grade-course-exam, course-history,
 * course-suggestions, user-profile) are typed in Phase 2 when those screens are
 * built — their exact shapes need reading the handler source.
 */

export type Level = 'A1' | 'A2' | 'B1' | 'B2';
export type Domain = 'vocabulary' | 'grammar' | 'spelling' | 'conjugation';
export type Difficulty = 'easy' | 'medium' | 'hard';

export type Person = 'ich' | 'du' | 'er_sie_es' | 'wir' | 'ihr' | 'sie_Sie';

// ── Conjugaison ────────────────────────────────────────────────────────────

export type ConjugateRequest = { verb: string; tense: string };
export type ConjugateResponse = {
  success: true;
  verb: string;
  tense: string;
  conjugations: Record<Person, string>;
  isIrregular: boolean;
  auxiliary: 'haben' | 'sein' | string;
  separable: boolean;
  notes?: string;
};

export type CheckIrregularRequest = { verb: string };
export type CheckIrregularResponse = {
  success: true;
  verb: string;
  isIrregular: boolean;
  type: 'schwach' | 'stark' | 'gemischt' | string;
  principalParts: { infinitiv: string; präteritum_er: string; perfekt_er: string };
  vowelChange?: string;
  explanation: string;
};

export type CorrectSentenceRequest = { sentence: string; userCorrection?: string };
export type SentenceError = { word: string; correctForm: string; reason?: string };
export type CorrectSentenceAnalyze = {
  success: true;
  mode: 'analyze';
  isCorrect: boolean;
  correctedSentence: string;
  errors: SentenceError[];
  explanation: string;
};
export type CorrectSentenceValidate = {
  success: true;
  mode: 'validate';
  isValid: boolean;
  alternativeForms: string[];
  feedback: string;
};
export type CorrectSentenceResponse = CorrectSentenceAnalyze | CorrectSentenceValidate;

export type ExerciseType = 'conjugate' | 'irregular_or_not' | 'fix_sentence';
export type GenerateExerciseRequest = { type: ExerciseType; level: Level };
export type GenerateExerciseResponse = {
  success: true;
  // Shape varies by exercise type; refined in Phase 2 (conjugaison module).
  exercise: Record<string, unknown> & { type: ExerciseType; level: Level };
};

// ── Test IA ────────────────────────────────────────────────────────────────

export type McqQuestion = {
  id: number;
  type: 'mcq';
  question: string;
  options: string[];
  correct_index: number;
  explanation?: string;
};
export type OpenQuestion = {
  id: number;
  type: 'open';
  question: string;
  expected_answer: string;
  acceptable_variations?: string[];
  explanation?: string;
};
export type TestQuestion = McqQuestion | OpenQuestion;

export type TestData = {
  test_id: string;
  domain: Domain;
  level: Level;
  difficulty: Difficulty;
  question_count: number;
  estimated_duration_minutes: number;
  instructions: string;
  questions: TestQuestion[];
};

export type GenerateTestRequest = {
  domain: Domain;
  level: Level;
  difficulty: Difficulty;
  questionCount: number;
};
export type GenerateTestResponse = {
  success: true;
  test: TestData;
  meta?: { rateLimit?: { remaining: number } };
};

/** QCM answer = chosen option index ; open answer = free text. */
export type TestAnswer = { questionId: number; answer: number | string };
export type GradeTestRequest = { test: TestData; answers: TestAnswer[] };
export type GradeTestResult = {
  question_id: number;
  type: 'mcq' | 'open';
  user_answer: string;
  correct_answer: string;
  is_correct: boolean;
  points: number;
  feedback?: string;
  verdict?: 'correct' | 'partial' | 'incorrect';
};
export type GradeTestResponse = {
  success: true;
  score: { correct: number; total: number; percentage: number; grade: string };
  results: GradeTestResult[];
  overall_feedback: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
};

// ── Cours (génération IA) ────────────────────────────────────────────────────

export type CourseCategory = 'vocabulary' | 'grammar' | 'conjugation' | 'spelling' | 'expression' | 'culture';
export type CourseFormat = 'short' | 'standard' | 'long';

export type CourseSuggestionsRequest = { level: Level; category: CourseCategory };
export type CourseSuggestionsResponse = {
  success: true;
  level: Level;
  category: CourseCategory;
  suggestions: string[];
};

export type CourseExample = { german: string; french: string; commentary: string };
export type CourseSection = {
  section_number: number;
  title: string;
  explanation: string;
  examples: CourseExample[];
  common_mistakes: string[];
};
export type CourseIntro = { objective: string; prerequisites: string; why_important: string };
/** Le mini-examen réutilise le format de questions du Test IA (mcq | open). */
export type CourseMiniExam = { instructions: string; questions: TestQuestion[] };
export type Course = {
  title: string;
  topic: string;
  category: CourseCategory;
  level: Level;
  format: CourseFormat;
  estimated_duration_minutes: number;
  introduction: CourseIntro;
  sections: CourseSection[];
  key_points: string[];
  mini_exam: CourseMiniExam;
  next_topics_suggestions: string[];
};

export type GenerateCourseRequest = { topic: string; category: CourseCategory; level: Level; format: CourseFormat };
export type GenerateCourseResponse = {
  success: true;
  course: Course;
  /** null si la sauvegarde Supabase a échoué — l'examen est alors indisponible. */
  course_id: string | null;
  meta?: unknown;
};

export type GradeCourseExamRequest = { course_id: string; answers: TestAnswer[] };
export type CourseExamResult = {
  question_id: number;
  type: 'mcq' | 'open';
  question: string;
  user_answer: string;
  correct_answer: string;
  is_correct: boolean;
  points: number;
  verdict?: 'correct' | 'partial' | 'incorrect';
  feedback?: string;
};
export type CourseExamSummary = { verdict: string; feedback: string; next_action: string };
export type GradeCourseExamResponse = {
  success: true;
  score: { correct: number; total: number; percentage: number; mention: string; emoji: string; color: string };
  results: CourseExamResult[];
  summary: CourseExamSummary;
  meta?: unknown;
};

// ── Certification Goethe ─────────────────────────────────────────────────────

export type CertLesenRequest = { level: Level; part: number };
export type LesenText = { id: string; title: string; content: string };
export type LesenQuestion = {
  id: number;
  question_text: string;
  type: 'mcq';
  options: string[];
  correct_index: number;
  explanation?: string;
};
export type CertLesenResponse = {
  success: true;
  test: {
    level: Level;
    part: number;
    format_description: string;
    duration_minutes: number;
    instructions: string;
    texts: LesenText[];
    questions: LesenQuestion[];
    passing_score_percentage: number;
  };
  disclaimer: string;
};

export type CertSchreibenRequest = { level: Level; task: number };
export type CertSchreibenResponse = {
  success: true;
  task: {
    level: Level;
    task_number: number;
    task_type: string;
    duration_minutes: number;
    word_count: { min: number; max: number };
    instructions_de: string;
    instructions_fr: string;
    context: { scenario: string; recipient: string; purpose: string };
    elements_to_cover: string[];
    elements_to_cover_fr: string[];
    evaluation_criteria: string[];
    tips: string[];
  };
};

export type GradeSchreibenRequest = { task: CertSchreibenResponse['task']; userText: string };
export type SchreibenCriterion = { points: number; max: number; comment: string };
export type SchreibenError = { type: string; extract: string; issue: string; correction: string };
export type GradeSchreibenResponse = {
  success: true;
  evaluation: {
    word_count: number;
    scores: {
      erfuellung: SchreibenCriterion;
      kohaerenz: SchreibenCriterion;
      wortschatz: SchreibenCriterion;
      strukturen: SchreibenCriterion;
    };
    total_score: number;
    max_score: number;
    mention: string;
    passed: boolean;
    errors: SchreibenError[];
    strengths: string[];
    improvements: string[];
    improved_version: string;
    global_feedback: string;
    next_steps: string[];
  };
};
