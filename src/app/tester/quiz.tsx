import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { ButtonPrimary } from '@/components/ui/ButtonPrimary';
import { Chip } from '@/components/ui/Chip';
import { ScreenScaffold } from '@/components/ui/ScreenScaffold';
import { Txt } from '@/components/ui/Txt';
import { CATEGORIES, getWords, LEVELS, type VocabCategory, type VocabWord } from '@/data/vocabulary';
import { QcmRunner } from '@/tester/QcmRunner';
import { WriteRunner } from '@/tester/WriteRunner';
import { buildQcm, buildWriteDeck, QCM_MIN_POOL, QUIZ_LENGTH, type QcmQuestion } from '@/tester/quiz-engine';
import { Accent, LevelColor, Spacing } from '@/theme/tokens';
import type { Level } from '@/lib/api';

type Mode = 'qcm' | 'write';
type Phase = 'setup' | 'play' | 'done';

const MODES: { key: Mode; label: string }[] = [
  { key: 'qcm', label: 'Quiz rapide' },
  { key: 'write', label: 'Super Quiz' },
];

export default function QuizScreen() {
  const [phase, setPhase] = useState<Phase>('setup');
  const [mode, setMode] = useState<Mode>('qcm');
  const [category, setCategory] = useState<VocabCategory>('noms');
  const [level, setLevel] = useState<Level | null>(null);
  const [questions, setQuestions] = useState<QcmQuestion[]>([]);
  const [deck, setDeck] = useState<VocabWord[]>([]);
  const [result, setResult] = useState<{ score: number; total: number } | null>(null);

  const available = getWords(category, level).length;
  const canStart = mode === 'qcm' ? available >= QCM_MIN_POOL : available >= 1;

  const start = () => {
    const pool = getWords(category, level);
    if (mode === 'qcm') setQuestions(buildQcm(pool, QUIZ_LENGTH));
    else setDeck(buildWriteDeck(pool, QUIZ_LENGTH));
    setResult(null);
    setPhase('play');
  };

  const finish = (score: number, total: number) => {
    setResult({ score, total });
    setPhase('done');
  };

  if (phase === 'play') {
    return (
      <ScreenScaffold eyebrow="TESTER" title="Quiz">
        {mode === 'qcm' ? (
          <QcmRunner questions={questions} onComplete={finish} />
        ) : (
          <WriteRunner words={deck} onComplete={finish} />
        )}
      </ScreenScaffold>
    );
  }

  if (phase === 'done' && result) {
    const pct = Math.round((result.score / result.total) * 100);
    const message = pct >= 80 ? 'Stark ! 💪' : pct >= 50 ? 'Pas mal, continue.' : 'À retravailler.';
    return (
      <ScreenScaffold eyebrow="TESTER" title="Résultat">
        <View style={styles.scoreCard}>
          <Txt font="display" size={56} color={Accent.green} tracking={-1}>
            {result.score}/{result.total}
          </Txt>
          <Txt font="monoBold" size={13} tone="ink2" uppercase tracking={1.2}>
            {pct}% · {message}
          </Txt>
        </View>
        <ButtonPrimary label="Rejouer" onPress={start} color={Accent.yellow} textColor="#0A0A0A" />
        <ButtonPrimary label="Changer de quiz" onPress={() => setPhase('setup')} />
      </ScreenScaffold>
    );
  }

  return (
    <ScreenScaffold eyebrow="TESTER" title="Quiz">
      <View style={styles.group}>
        <Txt font="monoBold" size={10} tone="ink2" uppercase tracking={1.5}>
          Type
        </Txt>
        <View style={styles.modes}>
          {MODES.map((m) => (
            <Chip key={m.key} label={m.label} selected={mode === m.key} onPress={() => setMode(m.key)} color={Accent.yellow} fullWidth />
          ))}
        </View>
        <Txt font="body" size={12} tone="ink2">
          {mode === 'qcm' ? 'QCM : choisis la bonne traduction française.' : 'Écris le mot allemand (article + orthographe).'}
        </Txt>
      </View>

      <View style={styles.group}>
        <Txt font="monoBold" size={10} tone="ink2" uppercase tracking={1.5}>
          Catégorie
        </Txt>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
          {CATEGORIES.map((c) => (
            <Chip key={c.key} label={c.label} selected={category === c.key} onPress={() => setCategory(c.key)} color={Accent.red} />
          ))}
        </ScrollView>
      </View>

      <View style={styles.group}>
        <Txt font="monoBold" size={10} tone="ink2" uppercase tracking={1.5}>
          Niveau
        </Txt>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
          <Chip label="Tous" selected={level === null} onPress={() => setLevel(null)} />
          {LEVELS.map((l) => (
            <Chip key={l} label={l} selected={level === l} onPress={() => setLevel(l)} color={LevelColor[l]} />
          ))}
        </ScrollView>
      </View>

      <Txt font="mono" size={12} tone="ink2">
        {available} mot{available > 1 ? 's' : ''} disponible{available > 1 ? 's' : ''} · {Math.min(QUIZ_LENGTH, available)} question
        {Math.min(QUIZ_LENGTH, available) > 1 ? 's' : ''}
      </Txt>
      {!canStart ? (
        <Txt font="mono" size={12} color={Accent.red}>
          Pas assez de mots pour ce filtre (min. {QCM_MIN_POOL} pour un QCM).
        </Txt>
      ) : null}

      <ButtonPrimary label="Démarrer" onPress={start} disabled={!canStart} color={Accent.green} />
    </ScreenScaffold>
  );
}

const styles = StyleSheet.create({
  group: { gap: Spacing.two },
  modes: { flexDirection: 'row', gap: Spacing.two },
  row: { gap: Spacing.two, paddingRight: Spacing.four },
  scoreCard: { alignItems: 'center', gap: Spacing.two, paddingVertical: Spacing.four },
});
