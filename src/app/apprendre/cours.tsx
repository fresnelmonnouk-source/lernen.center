import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ButtonPrimary } from '@/components/ui/ButtonPrimary';
import { Chip } from '@/components/ui/Chip';
import { Icon } from '@/components/ui/Icon';
import { Input } from '@/components/ui/Input';
import { ScreenScaffold } from '@/components/ui/ScreenScaffold';
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
  type GradeCourseExamResponse,
  type Level,
  type TestAnswer,
} from '@/lib/api';
import { Accent, LevelColor, Spacing } from '@/theme/tokens';

type Phase = 'setup' | 'reading' | 'exam' | 'done';

const CATEGORIES: { key: CourseCategory; label: string }[] = [
  { key: 'vocabulary', label: 'Vocabulaire' },
  { key: 'grammar', label: 'Grammaire' },
  { key: 'conjugation', label: 'Conjugaison' },
  { key: 'spelling', label: 'Orthographe' },
  { key: 'expression', label: 'Expression' },
  { key: 'culture', label: 'Culture' },
];
const LEVELS: Level[] = ['A1', 'A2', 'B1', 'B2'];
const FORMATS: { key: CourseFormat; label: string }[] = [
  { key: 'short', label: 'Court' },
  { key: 'standard', label: 'Standard' },
  { key: 'long', label: 'Long' },
];

export default function CoursScreen() {
  const [phase, setPhase] = useState<Phase>('setup');
  const [category, setCategory] = useState<CourseCategory>('grammar');
  const [level, setLevel] = useState<Level>('A1');
  const [format, setFormat] = useState<CourseFormat>('standard');
  const [topic, setTopic] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [course, setCourse] = useState<Course | null>(null);
  const [courseId, setCourseId] = useState<string | null>(null);
  const [grade, setGrade] = useState<GradeCourseExamResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Idées de sujets (catalogue public). Échec silencieux : la saisie libre reste possible.
  useEffect(() => {
    let cancelled = false;
    api
      .courseSuggestions({ level, category })
      .then((res) => !cancelled && setSuggestions(res.suggestions))
      .catch(() => !cancelled && setSuggestions([]));
    return () => {
      cancelled = true;
    };
  }, [level, category]);

  /** Génère le cours. Sujet optionnel : si vide, on pioche au hasard une suggestion.
   *  Si aucune suggestion n'est encore chargée, on affiche une erreur explicite. */
  const generate = async () => {
    setError(null);
    let t = topic.trim();
    if (t.length === 0) {
      if (suggestions.length === 0) {
        setError('Donne un sujet ou attends que les suggestions se chargent.');
        return;
      }
      t = suggestions[Math.floor(Math.random() * suggestions.length)];
      setTopic(t); // Reflète le choix de l'IA dans l'UI avant le départ.
    } else if (t.length < 3 || t.length > 200) {
      setError('Le sujet doit faire entre 3 et 200 caractères.');
      return;
    }
    setLoading(true);
    try {
      const res = await api.generateCourse({ topic: t, category, level, format });
      setCourse(res.course);
      setCourseId(res.course_id);
      setPhase('reading');
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Génération impossible. Réessaie.');
    } finally {
      setLoading(false);
    }
  };

  /** Tire une suggestion au hasard et la pose dans le champ sujet. */
  const surpriseMe = () => {
    if (suggestions.length === 0) {
      setError('Aucune suggestion pour ces filtres pour l’instant. Réessaie dans un instant ou tape ton propre sujet.');
      return;
    }
    setError(null);
    setTopic(suggestions[Math.floor(Math.random() * suggestions.length)]);
  };

  const submitExam = async (answers: TestAnswer[]) => {
    if (!courseId) return;
    setError(null);
    setLoading(true);
    try {
      const res = await api.gradeCourseExam({ course_id: courseId, answers });
      setGrade(res);
      setPhase('done');
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Correction impossible. Réessaie.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setCourse(null);
    setCourseId(null);
    setGrade(null);
    setError(null);
    setPhase('setup');
  };

  const errorBox = error ? (
    <Txt font="mono" size={12} color={Accent.red}>
      {error}
    </Txt>
  ) : null;

  if (phase === 'reading' && course) {
    return (
      <ScreenScaffold eyebrow="APPRENDRE" title="Cours">
        <CourseReader course={course} />
        {courseId ? (
          <ButtonPrimary
            label={`Mini-examen (${course.mini_exam.questions.length} questions)`}
            onPress={() => setPhase('exam')}
            color={Accent.purple}
          />
        ) : (
          <Txt font="mono" size={12} tone="ink2">
            Mini-examen indisponible (cours non sauvegardé).
          </Txt>
        )}
        <ButtonPrimary label="Nouveau cours" onPress={reset} />
      </ScreenScaffold>
    );
  }

  if (phase === 'exam' && course) {
    return (
      <ScreenScaffold eyebrow="COURS" title="Mini-examen">
        <TestRunner questions={course.mini_exam.questions} submitting={loading} onSubmit={submitExam} />
        {errorBox}
      </ScreenScaffold>
    );
  }

  if (phase === 'done' && grade) {
    return (
      <ScreenScaffold eyebrow="COURS" title="Bilan">
        <CourseExamResults data={grade} />
        <ButtonPrimary label="Nouveau cours" onPress={reset} color={Accent.purple} />
      </ScreenScaffold>
    );
  }

  return (
    <ScreenScaffold eyebrow="APPRENDRE" title="Cours" accent="IA">
      <Link href="/apprendre/historique" asChild>
        <Pressable accessibilityRole="link" hitSlop={8} style={styles.historyLink}>
          <Icon name="arrowRight" size="sm" color={Accent.purple} />
          <Txt font="monoBold" size={11} color={Accent.purple} uppercase tracking={1}>
            Mes cours générés
          </Txt>
        </Pressable>
      </Link>

      <View style={styles.group}>
        <Txt font="monoBold" size={10} tone="ink2" uppercase tracking={1.5}>Catégorie</Txt>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
          {CATEGORIES.map((c) => (
            <Chip key={c.key} label={c.label} selected={category === c.key} onPress={() => setCategory(c.key)} color={Accent.blue} />
          ))}
        </ScrollView>
      </View>

      <View style={styles.group}>
        <Txt font="monoBold" size={10} tone="ink2" uppercase tracking={1.5}>Niveau</Txt>
        <View style={styles.wrapRow}>
          {LEVELS.map((l) => (
            <Chip key={l} label={l} selected={level === l} onPress={() => setLevel(l)} color={LevelColor[l]} />
          ))}
        </View>
      </View>

      <View style={styles.group}>
        <Txt font="monoBold" size={10} tone="ink2" uppercase tracking={1.5}>Format</Txt>
        <View style={styles.wrapRow}>
          {FORMATS.map((f) => (
            <Chip key={f.key} label={f.label} selected={format === f.key} onPress={() => setFormat(f.key)} color={Accent.green} />
          ))}
        </View>
      </View>

      <Input
        label="Sujet du cours (optionnel)"
        value={topic}
        onChangeText={setTopic}
        placeholder="ex. Le datif, les verbes séparables… — ou laisse vide"
        maxLength={200}
        autoCapitalize="none"
      />

      {suggestions.length > 0 ? (
        <View style={styles.group}>
          <Txt font="monoBold" size={10} tone="ink2" uppercase tracking={1.5}>Suggestions</Txt>
          {suggestions.slice(0, 6).map((s) => (
            <Chip key={s} label={s} selected={topic === s} onPress={() => setTopic(s)} color={Accent.blue} fullWidth />
          ))}
        </View>
      ) : null}

      <Txt font="body" size={12} tone="ink2">
        Laisse vide : l’IA pioche dans les suggestions. Ou tape ton propre sujet.
      </Txt>

      {errorBox}
      <View style={styles.actionsRow}>
        <View style={styles.actionFlex}>
          <ButtonPrimary label="Choisir au hasard" onPress={surpriseMe} color={Accent.yellow} textColor="#0A0A0A" />
        </View>
        <View style={styles.actionFlex}>
          <ButtonPrimary label="Générer mon cours" onPress={generate} loading={loading} color={Accent.purple} />
        </View>
      </View>

      <Txt font="serifItalic" size={11} tone="ink2" lineHeight={16}>
        Généré par IA. Vérifie les points critiques avant un examen réel.
      </Txt>
    </ScreenScaffold>
  );
}

const styles = StyleSheet.create({
  historyLink: { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start' },
  group: { gap: Spacing.two },
  row: { gap: Spacing.two, paddingRight: Spacing.four },
  wrapRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  actionsRow: { flexDirection: 'row', gap: Spacing.two },
  actionFlex: { flex: 1 },
});
