import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { ButtonPrimary } from '@/components/ui/ButtonPrimary';
import { HardShadowBox } from '@/components/ui/HardShadowBox';
import { Icon } from '@/components/ui/Icon';
import { ScreenScaffold } from '@/components/ui/ScreenScaffold';
import { StatGrid } from '@/components/ui/Stat';
import { Txt } from '@/components/ui/Txt';
import { CourseExamResults } from '@/cours/CourseExamResults';
import { CourseReader } from '@/cours/CourseReader';
import { TestRunner } from '@/examen/TestRunner';
import {
  api,
  ApiError,
  type Course,
  type CourseCategory,
  type CourseFormat,
  type CourseHistoryItem,
  type CourseHistoryStats,
  type GradeCourseExamResponse,
  type TestAnswer,
} from '@/lib/api';
import { Accent, Border, LevelColor, Shadow, Spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/theme-context';

type Phase = 'list' | 'reading' | 'exam' | 'done';

const CATEGORY_LABEL: Record<CourseCategory, string> = {
  vocabulary: 'Vocabulaire',
  grammar: 'Grammaire',
  conjugation: 'Conjugaison',
  spelling: 'Orthographe',
  expression: 'Expression',
  culture: 'Culture',
};
const FORMAT_LABEL: Record<CourseFormat, string> = { short: 'Court', standard: 'Standard', long: 'Long' };

const ERR_LOAD = 'Impossible de charger ton historique. Réessaie.';

const MONTHS_FR = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];

/** Format de date déterministe (sans Intl, fragile sous Hermes) : « 12 juin 2026 ». */
function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return `${d.getDate()} ${MONTHS_FR[d.getMonth()]} ${d.getFullYear()}`;
}

/** Couleur de pastille selon le score (cohérent avec les seuils de grade-course-exam). */
function scoreColor(score: number): string {
  if (score >= 75) return Accent.green;
  if (score >= 60) return Accent.blue;
  if (score >= 40) return Accent.yellow;
  return Accent.red;
}

/** Recalcule les stats localement (même logique que le backend) après une suppression. */
function computeStats(list: CourseHistoryItem[]): CourseHistoryStats {
  const completedScored = list.filter((c) => c.exam_completed && c.exam_score != null);
  const completed = list.filter((c) => c.exam_completed).length;
  const average_score = completedScored.length
    ? Math.round(completedScored.reduce((s, c) => s + (c.exam_score ?? 0), 0) / completedScored.length)
    : null;
  return { total: list.length, completed, average_score };
}

export default function HistoriqueScreen() {
  const router = useRouter();

  const [phase, setPhase] = useState<Phase>('list');

  // Liste
  const [items, setItems] = useState<CourseHistoryItem[] | null>(null);
  const [stats, setStats] = useState<CourseHistoryStats | null>(null);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);

  // Suppression
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Cours ouvert
  const [openingId, setOpeningId] = useState<string | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [courseId, setCourseId] = useState<string | null>(null);
  const [courseDone, setCourseDone] = useState(false);
  const [courseScore, setCourseScore] = useState<number | null>(null);

  // Mini-examen
  const [grade, setGrade] = useState<GradeCourseExamResponse | null>(null);
  const [examLoading, setExamLoading] = useState(false);

  // Erreur d'action (ouverture / examen / suppression)
  const [actionError, setActionError] = useState<string | null>(null);

  // Chargement initial : fetch inline dans l'effet (flag `ignore` anti-race au
  // démontage). Les setState sont après l'await → pas de cascade synchrone, ce
  // qui satisfait react-hooks/set-state-in-effect. Le spinner est déjà visible
  // via l'état initial (listLoading=true).
  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const res = await api.courseHistory();
        if (ignore) return;
        setItems(res.courses);
        setStats(res.stats);
        setListError(null);
      } catch (e) {
        if (!ignore) setListError(e instanceof ApiError ? e.message : ERR_LOAD);
      } finally {
        if (!ignore) setListLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, []);

  /** Relance le chargement (bouton « Réessayer ») — handler, donc setState synchrone autorisé. */
  const retry = async () => {
    setListLoading(true);
    setListError(null);
    try {
      const res = await api.courseHistory();
      setItems(res.courses);
      setStats(res.stats);
    } catch (e) {
      setListError(e instanceof ApiError ? e.message : ERR_LOAD);
    } finally {
      setListLoading(false);
    }
  };

  const openCourse = async (item: CourseHistoryItem) => {
    setActionError(null);
    setConfirmingId(null);
    setOpeningId(item.id);
    try {
      const res = await api.getCourse(item.id);
      setCourse(res.course.course_data);
      setCourseId(res.course.id);
      setCourseDone(res.course.exam_completed);
      setCourseScore(res.course.exam_score);
      setGrade(null);
      setPhase('reading');
    } catch (e) {
      setActionError(e instanceof ApiError ? e.message : 'Ouverture impossible. Réessaie.');
    } finally {
      setOpeningId(null);
    }
  };

  const submitExam = async (answers: TestAnswer[]) => {
    if (!courseId) return;
    setActionError(null);
    setExamLoading(true);
    try {
      const res = await api.gradeCourseExam({ course_id: courseId, answers });
      setGrade(res);
      // Refléter le nouveau score dans la liste sans recharger.
      setItems((prev) =>
        prev
          ? prev.map((c) =>
              c.id === courseId ? { ...c, exam_completed: true, exam_score: res.score.percentage } : c,
            )
          : prev,
      );
      setPhase('done');
    } catch (e) {
      setActionError(e instanceof ApiError ? e.message : 'Correction impossible. Réessaie.');
    } finally {
      setExamLoading(false);
    }
  };

  const backToList = () => {
    setActionError(null);
    setCourse(null);
    setCourseId(null);
    setGrade(null);
    // Les stats peuvent avoir bougé (examen passé) : on les recalcule depuis la liste à jour.
    setStats((prev) => (items ? computeStats(items) : prev));
    setPhase('list');
  };

  const deleteCourse = async (id: string) => {
    setActionError(null);
    setDeletingId(id);
    try {
      await api.deleteCourse(id);
      setItems((prev) => {
        const next = prev ? prev.filter((c) => c.id !== id) : prev;
        if (next) setStats(computeStats(next));
        return next;
      });
    } catch (e) {
      setActionError(e instanceof ApiError ? e.message : 'Suppression impossible. Réessaie.');
    } finally {
      setDeletingId(null);
      setConfirmingId(null);
    }
  };

  // ── Phase : lecture d'un cours ──────────────────────────────────────────────
  if (phase === 'reading' && course) {
    return (
      <ScreenScaffold eyebrow="HISTORIQUE" title="Cours">
        <CourseReader course={course} />

        {courseDone && courseScore != null ? (
          <HardShadowBox background={scoreColor(courseScore)} offset={Shadow.sm} contentStyle={styles.scoreBanner}>
            <Txt font="monoBold" size={11} color={courseScore >= 40 && courseScore < 75 ? '#0A0A0A' : '#FFFFFF'} uppercase tracking={1}>
              Mini-examen passé
            </Txt>
            <Txt font="display" size={20} color={courseScore >= 40 && courseScore < 75 ? '#0A0A0A' : '#FFFFFF'}>
              {courseScore}/100
            </Txt>
          </HardShadowBox>
        ) : null}

        {courseId ? (
          <ButtonPrimary
            label={courseDone ? 'Refaire le mini-examen' : `Mini-examen (${course.mini_exam.questions.length} questions)`}
            onPress={() => setPhase('exam')}
            color={Accent.purple}
          />
        ) : (
          <Txt font="mono" size={12} tone="ink2">
            Mini-examen indisponible pour ce cours.
          </Txt>
        )}

        {actionError ? (
          <Txt font="mono" size={12} color={Accent.red}>
            {actionError}
          </Txt>
        ) : null}

        <Txt font="serifItalic" size={11} tone="ink2" lineHeight={16}>
          Généré par IA. Vérifie les points critiques avant un examen réel.
        </Txt>
        <ButtonPrimary label="Retour à l’historique" onPress={backToList} />
      </ScreenScaffold>
    );
  }

  // ── Phase : passage du mini-examen ──────────────────────────────────────────
  if (phase === 'exam' && course) {
    return (
      <ScreenScaffold eyebrow="HISTORIQUE" title="Mini-examen">
        <TestRunner questions={course.mini_exam.questions} submitting={examLoading} onSubmit={submitExam} />
        {actionError ? (
          <Txt font="mono" size={12} color={Accent.red}>
            {actionError}
          </Txt>
        ) : null}
      </ScreenScaffold>
    );
  }

  // ── Phase : bilan du mini-examen ────────────────────────────────────────────
  if (phase === 'done' && grade) {
    return (
      <ScreenScaffold eyebrow="HISTORIQUE" title="Bilan">
        <CourseExamResults data={grade} />
        <ButtonPrimary label="Retour à l’historique" onPress={backToList} color={Accent.purple} />
      </ScreenScaffold>
    );
  }

  // ── Phase : liste ───────────────────────────────────────────────────────────
  return (
    <ScreenScaffold eyebrow="APPRENDRE" title="Historique">
      {listLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color={Accent.blue} />
          <Txt font="mono" size={12} tone="ink2">
            Chargement de tes cours…
          </Txt>
        </View>
      ) : listError ? (
        <View style={styles.center}>
          <Txt font="mono" size={13} color={Accent.red} style={styles.centerTxt}>
            {listError}
          </Txt>
          <ButtonPrimary label="Réessayer" onPress={retry} />
        </View>
      ) : items && items.length > 0 ? (
        <>
          {stats ? (
            <StatGrid
              stats={[
                { value: stats.total, label: 'Cours', accent: 'blue' },
                { value: stats.completed, label: 'Examens' },
                { value: stats.average_score != null ? `${stats.average_score}` : '—', label: 'Moyenne', accent: 'yellow' },
              ]}
            />
          ) : null}

          {actionError ? (
            <Txt font="mono" size={12} color={Accent.red}>
              {actionError}
            </Txt>
          ) : null}

          <View style={styles.list}>
            {items.map((item) => (
              <CourseRow
                key={item.id}
                item={item}
                opening={openingId === item.id}
                deleting={deletingId === item.id}
                confirming={confirmingId === item.id}
                onOpen={() => openCourse(item)}
                onAskDelete={() => setConfirmingId(item.id)}
                onCancelDelete={() => setConfirmingId(null)}
                onConfirmDelete={() => deleteCourse(item.id)}
              />
            ))}
          </View>
        </>
      ) : (
        <View style={styles.center}>
          <Txt font="display" size={20} style={styles.centerTxt}>
            Aucun cours pour l’instant
          </Txt>
          <Txt font="body" size={14} tone="ink2" lineHeight={20} style={styles.centerTxt}>
            Génère ton premier cours : il apparaîtra ici, avec ton score au mini-examen.
          </Txt>
          <ButtonPrimary label="Créer un cours" onPress={() => router.replace('/apprendre/cours')} color={Accent.blue} />
        </View>
      )}
    </ScreenScaffold>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

type RowProps = {
  item: CourseHistoryItem;
  opening: boolean;
  deleting: boolean;
  confirming: boolean;
  onOpen: () => void;
  onAskDelete: () => void;
  onCancelDelete: () => void;
  onConfirmDelete: () => void;
};

function CourseRow({ item, opening, deleting, confirming, onOpen, onAskDelete, onCancelDelete, onConfirmDelete }: RowProps) {
  const { colors } = useTheme();
  const busy = opening || deleting;

  return (
    <HardShadowBox background={colors.paper} contentStyle={styles.row}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Ouvrir le cours ${item.title}`}
        disabled={busy || confirming}
        onPress={onOpen}
        style={styles.rowBody}>
        <View style={styles.metaRow}>
          <View style={[styles.levelTag, { backgroundColor: LevelColor[item.level], borderColor: colors.ink }]}>
            <Txt font="monoBold" size={10} color="#0A0A0A" tracking={0.8}>
              {item.level}
            </Txt>
          </View>
          <Txt font="mono" size={10} tone="ink2" uppercase tracking={0.8}>
            {CATEGORY_LABEL[item.category]} · {FORMAT_LABEL[item.format]}
          </Txt>
        </View>

        <Txt font="bold" size={16} lineHeight={20} tracking={-0.2}>
          {item.title}
        </Txt>

        <View style={styles.statusRow}>
          {item.exam_completed && item.exam_score != null ? (
            <View style={[styles.pill, { backgroundColor: scoreColor(item.exam_score), borderColor: colors.ink }]}>
              <Txt font="monoBold" size={10} color={item.exam_score >= 40 && item.exam_score < 75 ? '#0A0A0A' : '#FFFFFF'} tracking={0.5}>
                EXAMEN {item.exam_score}/100
              </Txt>
            </View>
          ) : (
            <View style={[styles.pill, styles.pillMuted, { borderColor: colors.ink2 }]}>
              <Txt font="monoBold" size={10} tone="ink2" tracking={0.5}>
                EXAMEN NON PASSÉ
              </Txt>
            </View>
          )}
          <Txt font="mono" size={10} tone="ink2" tracking={0.5}>
            {formatDate(item.created_at)}
          </Txt>
        </View>

        {opening ? (
          <View style={styles.openingRow}>
            <ActivityIndicator size="small" color={Accent.blue} />
            <Txt font="mono" size={11} tone="ink2">
              Ouverture…
            </Txt>
          </View>
        ) : null}
      </Pressable>

      <View style={[styles.footer, { borderTopColor: colors.cream3 }]}>
        {confirming ? (
          <View style={styles.confirmRow}>
            <Txt font="mono" size={11} tone="ink2" style={styles.flex}>
              {deleting ? 'Suppression…' : 'Supprimer ce cours ?'}
            </Txt>
            <Pressable accessibilityRole="button" disabled={deleting} onPress={onCancelDelete} hitSlop={8} style={styles.footerBtn}>
              <Txt font="monoBold" size={11} uppercase tracking={0.8}>
                Annuler
              </Txt>
            </Pressable>
            <Pressable accessibilityRole="button" disabled={deleting} onPress={onConfirmDelete} hitSlop={8} style={styles.footerBtn}>
              <Txt font="monoBold" size={11} color={Accent.red} uppercase tracking={0.8}>
                Supprimer
              </Txt>
            </Pressable>
          </View>
        ) : (
          <View style={styles.confirmRow}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Ouvrir le cours ${item.title}`}
              disabled={busy}
              onPress={onOpen}
              hitSlop={8}
              style={[styles.footerBtn, styles.footerBtnRow]}>
              <Txt font="monoBold" size={11} color={Accent.blue} uppercase tracking={0.8}>
                Ouvrir
              </Txt>
              <Icon name="arrowRight" size="sm" color={Accent.blue} />
            </Pressable>
            <View style={styles.flex} />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Supprimer le cours ${item.title}`}
              disabled={busy}
              onPress={onAskDelete}
              hitSlop={8}
              style={styles.footerBtn}>
              <Txt font="monoBold" size={11} tone="ink2" uppercase tracking={0.8}>
                Supprimer
              </Txt>
            </Pressable>
          </View>
        )}
      </View>
    </HardShadowBox>
  );
}

const styles = StyleSheet.create({
  center: { gap: Spacing.three, alignItems: 'center', paddingVertical: Spacing.four },
  centerTxt: { textAlign: 'center' },
  list: { gap: Spacing.three },
  scoreBanner: { padding: Spacing.three, gap: Spacing.one, alignItems: 'flex-start' },
  row: { padding: 0 },
  rowBody: { padding: Spacing.three, gap: Spacing.two },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  levelTag: { borderWidth: Border.thin, paddingVertical: 2, paddingHorizontal: Spacing.one },
  statusRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: Spacing.two, flexWrap: 'wrap' },
  pill: { borderWidth: Border.thin, paddingVertical: 3, paddingHorizontal: Spacing.two },
  pillMuted: { backgroundColor: 'transparent' },
  openingRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, marginTop: Spacing.one },
  footer: { borderTopWidth: Border.thin, paddingTop: Spacing.two, paddingHorizontal: Spacing.three, paddingBottom: Spacing.two },
  confirmRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three },
  footerBtn: { paddingVertical: Spacing.one },
  footerBtnRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  flex: { flex: 1 },
});
