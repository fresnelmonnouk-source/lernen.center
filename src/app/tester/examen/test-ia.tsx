import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { ButtonPrimary } from '@/components/ui/ButtonPrimary';
import { Chip } from '@/components/ui/Chip';
import { ScreenScaffold } from '@/components/ui/ScreenScaffold';
import { Txt } from '@/components/ui/Txt';
import { TestResults } from '@/examen/TestResults';
import { TestRunner } from '@/examen/TestRunner';
import {
  api,
  ApiError,
  type Difficulty,
  type Domain,
  type GradeTestResponse,
  type Level,
  type TestAnswer,
  type TestData,
} from '@/lib/api';
import { Accent, LevelColor, Spacing } from '@/theme/tokens';

type Phase = 'setup' | 'playing' | 'done';

const DOMAINS: { key: Domain; label: string }[] = [
  { key: 'vocabulary', label: 'Vocabulaire' },
  { key: 'grammar', label: 'Grammaire' },
  { key: 'spelling', label: 'Orthographe' },
  { key: 'conjugation', label: 'Conjugaison' },
];
const LEVELS: Level[] = ['A1', 'A2', 'B1', 'B2'];
const DIFFICULTIES: { key: Difficulty; label: string }[] = [
  { key: 'easy', label: 'Facile' },
  { key: 'medium', label: 'Moyen' },
  { key: 'hard', label: 'Difficile' },
];
const COUNTS = [5, 10, 15];

export default function TestIaScreen() {
  const [phase, setPhase] = useState<Phase>('setup');
  const [domain, setDomain] = useState<Domain>('vocabulary');
  const [level, setLevel] = useState<Level>('A1');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [count, setCount] = useState(10);
  const [test, setTest] = useState<TestData | null>(null);
  const [grade, setGrade] = useState<GradeTestResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await api.generateTest({ domain, level, difficulty, questionCount: count });
      setTest(res.test);
      setPhase('playing');
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Génération impossible. Réessaie.');
    } finally {
      setLoading(false);
    }
  };

  const submit = async (answers: TestAnswer[]) => {
    if (!test) return;
    setError(null);
    setLoading(true);
    try {
      const res = await api.gradeTest({ test, answers });
      setGrade(res);
      setPhase('done');
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Correction impossible. Réessaie.');
    } finally {
      setLoading(false);
    }
  };

  const restart = () => {
    setTest(null);
    setGrade(null);
    setError(null);
    setPhase('setup');
  };

  const errorBox = error ? (
    <Txt font="mono" size={12} color={Accent.red}>
      {error}
    </Txt>
  ) : null;

  if (phase === 'playing' && test) {
    return (
      <ScreenScaffold eyebrow="EXAMEN" title="Test IA">
        <TestRunner questions={test.questions} submitting={loading} onSubmit={submit} />
        {errorBox}
      </ScreenScaffold>
    );
  }

  if (phase === 'done' && grade) {
    return (
      <ScreenScaffold eyebrow="EXAMEN" title="Bilan">
        <TestResults data={grade} />
        <ButtonPrimary label="Nouvel examen" onPress={restart} color={Accent.purple} />
      </ScreenScaffold>
    );
  }

  return (
    <ScreenScaffold eyebrow="EXAMEN" title="Test IA">
      <View style={styles.group}>
        <Txt font="monoBold" size={10} tone="ink2" uppercase tracking={1.5}>Domaine</Txt>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
          {DOMAINS.map((d) => (
            <Chip key={d.key} label={d.label} selected={domain === d.key} onPress={() => setDomain(d.key)} color={Accent.purple} />
          ))}
        </ScrollView>
      </View>

      <View style={styles.group}>
        <Txt font="monoBold" size={10} tone="ink2" uppercase tracking={1.5}>Niveau</Txt>
        <View style={styles.rowWrap}>
          {LEVELS.map((l) => (
            <Chip key={l} label={l} selected={level === l} onPress={() => setLevel(l)} color={LevelColor[l]} />
          ))}
        </View>
      </View>

      <View style={styles.group}>
        <Txt font="monoBold" size={10} tone="ink2" uppercase tracking={1.5}>Difficulté</Txt>
        <View style={styles.rowWrap}>
          {DIFFICULTIES.map((d) => (
            <Chip key={d.key} label={d.label} selected={difficulty === d.key} onPress={() => setDifficulty(d.key)} color={Accent.red} />
          ))}
        </View>
      </View>

      <View style={styles.group}>
        <Txt font="monoBold" size={10} tone="ink2" uppercase tracking={1.5}>Questions</Txt>
        <View style={styles.rowWrap}>
          {COUNTS.map((c) => (
            <Chip key={c} label={String(c)} selected={count === c} onPress={() => setCount(c)} color={Accent.blue} />
          ))}
        </View>
      </View>

      <Txt font="body" size={12} tone="ink2">
        Questions générées par IA (~70% QCM, ~30% ouvertes). Bilan détaillé à la fin.
      </Txt>
      {errorBox}
      <ButtonPrimary label="Lancer l’examen" onPress={generate} loading={loading} color={Accent.purple} />
      <Txt font="serifItalic" size={11} tone="ink2" lineHeight={16}>
        Généré par IA. Vérifie les points critiques avant un examen réel.
      </Txt>
    </ScreenScaffold>
  );
}

const styles = StyleSheet.create({
  group: { gap: Spacing.two },
  row: { gap: Spacing.two, paddingRight: Spacing.four },
  rowWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
});
