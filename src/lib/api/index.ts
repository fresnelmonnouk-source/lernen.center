/**
 * Typed entry point for the Vercel backend.
 *
 * Every function returns the parsed response or throws an `ApiError` with a
 * French message. All endpoints require auth (Bearer JWT) unless noted.
 *
 * Usage:
 *   import { api } from '@/lib/api';
 *   const res = await api.conjugate({ verb: 'gehen', tense: 'Perfekt' });
 */
import { apiGet, apiPost } from './client';
import type {
  CertLesenRequest,
  CertLesenResponse,
  CertSchreibenRequest,
  CertSchreibenResponse,
  CheckIrregularRequest,
  CheckIrregularResponse,
  ConjugateRequest,
  ConjugateResponse,
  CorrectSentenceRequest,
  CorrectSentenceResponse,
  CourseSuggestionsRequest,
  CourseSuggestionsResponse,
  GenerateCourseRequest,
  GenerateCourseResponse,
  GenerateExerciseRequest,
  GenerateExerciseResponse,
  GenerateTestRequest,
  GenerateTestResponse,
  GradeCourseExamRequest,
  GradeCourseExamResponse,
  GradeSchreibenRequest,
  GradeSchreibenResponse,
  GradeTestRequest,
  GradeTestResponse,
} from './types';

export const api = {
  // Conjugaison
  conjugate: (body: ConjugateRequest) => apiPost<ConjugateResponse>('/api/conjugate', body),
  checkIrregular: (body: CheckIrregularRequest) => apiPost<CheckIrregularResponse>('/api/check-irregular', body),
  correctSentence: (body: CorrectSentenceRequest) => apiPost<CorrectSentenceResponse>('/api/correct-sentence', body),
  generateExercise: (body: GenerateExerciseRequest) => apiPost<GenerateExerciseResponse>('/api/generate-exercise', body),

  // Test IA
  generateTest: (body: GenerateTestRequest) => apiPost<GenerateTestResponse>('/api/generate-test', body),
  gradeTest: (body: GradeTestRequest) => apiPost<GradeTestResponse>('/api/grade-test', body),

  // Cours (génération IA)
  courseSuggestions: (q: CourseSuggestionsRequest) =>
    apiGet<CourseSuggestionsResponse>(`/api/course-suggestions?level=${q.level}&category=${q.category}`, { auth: false }),
  generateCourse: (body: GenerateCourseRequest) => apiPost<GenerateCourseResponse>('/api/generate-course', body),
  gradeCourseExam: (body: GradeCourseExamRequest) => apiPost<GradeCourseExamResponse>('/api/grade-course-exam', body),

  // Certification Goethe
  certLesen: (body: CertLesenRequest) => apiPost<CertLesenResponse>('/api/cert-lesen', body),
  certSchreiben: (body: CertSchreibenRequest) => apiPost<CertSchreibenResponse>('/api/cert-schreiben', body),
  gradeSchreiben: (body: GradeSchreibenRequest) => apiPost<GradeSchreibenResponse>('/api/grade-schreiben', body),
} as const;

export { ApiError } from './errors';
export { apiGet, apiPost } from './client';
export * from './types';
