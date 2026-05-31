import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { ButtonPrimary } from '@/components/ui/ButtonPrimary';
import { Chip } from '@/components/ui/Chip';
import { HardShadowBox } from '@/components/ui/HardShadowBox';
import { ScreenScaffold } from '@/components/ui/ScreenScaffold';
import { Txt } from '@/components/ui/Txt';
import { CATEGORIES, getWords, LEVELS, type VocabCategory, type VocabWord } from '@/data/vocabulary';
import { QcmRunner } from '@/tester/QcmRunner';
import { WriteRunner } from '@/tester/WriteRunner';
import { useDailyRecord } from '@/tester/daily-store';
import { buildQcm, buildWriteDeck, QCM_MIN_POOL, QUIZ_LENGTH, type QcmQuestion } from '@/tester/quiz-engine';
import { Accent, LevelColor, Shadow, Spacing } from '@/theme/tokens';
import type { Level } from '@/lib/api';

type Mode = 'qcm' | 'write' | 'daily';
type Phase = 'setup' | 'play' | 'done';

const MODES: { key: Mode; label: string }[] = [
  { key: 'qcm', label: 'Quiz rapide' },
  { key: 'write', label: 'Super Quiz' },
  { key: 'daily', label: 'Quotidien' },
];

/** Pool « tout vocabulaire confondu » utilisé par le Quiz quotidien. */
function allWords(): VocabWord[] {
  return CATEGORIES.flatMap((c) => getWords(c.key, null));
}

export default function QuizScreen() {
  const [phase, setPhase] = useState<Phase>('setup');
  const [mode, setMode] = useState<Mode>('qcm');
  const [category, setCategory] = useState<VocabCategory>('noms');
  const [level, setLevel] = useState<Level | null>(null);
  const [questions, setQuestions] = useState<QcmQuestion[]>([]);
  const [deck, setDeck] = useState<VocabWord[]>([]);
  const [result, setResult] = useState<{ score: number; total: number } | null>(null);
  const { record, playedToday, recordToday } = useDailyRecord();

  const isDaily = mode === 'daily';
  const available = isDaily ? allWords().length : getWords(category, level).length;
  const canStart = isDaily
    ? !playedToday && available >= QCM_MIN_POOL
    : mode === 'qcm'
    ? available >= QCM_MIN_POOL
    : available >= 1;

  const start = () => {
    if (isDaily) {
      setQuestions(buildQcm(allWords(), QUIZ_LENGTH));
    } else {
      const pool = getWords(category, level);
      if (mode === 'qcm') setQuestions(buildQcm(pool, QUIZ_LENGTH));
      else setDeck(buildWriteDeck(pool, QUIZ_LENGTH));
    }
    setResult(null);
    setPhase('play');
  };

  const finish = async (score: number, total: number) => {
    setResult({ score, total });
    if (isDaily) await recordToday(score, total);
    setPhase('done');
  };

  if (phase === 'play') {
    return (
      <ScreenScaffold eyebrow="TESTER" title="Quiz">
        {mode === 'write' ? (
          <WriteRunner words={deck} onComplete={finish} />
        ) : (
          <QcmRunner questions={questions} onComplete={finish} />
        )}
      </ScreenScaffold>
    );
  }

  if (phase === 'done' && result) {
    const pct = Math.round((result.score / result.total) * 100);
    const message = pct >= 80 ? 'Excellent. Tu maîtrises.' : pct >= 50 ? 'Correct. À consolider.' : 'À reprendre — relance un quiz.';
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
        {isDaily ? (
          <Txt font="serifItalic" size={14} tone="ink2" style={styles.center}>
            Reviens demain pour un nouveau Quiz quotidien.
          </Txt>
        ) : (
          <ButtonPrimary label="Rejouer" onPress={start} color={Accent.yellow} textColor="#0A0A0A" />
        )}
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
          {mode === 'qcm'
            ? 'QCM : choisis la bonne traduction française.'
            : mode === 'write'
            ? 'Écris le mot allemand (article + orthographe).'
            : '10 QCM mix toutes catégories et tous niveaux. 1 essai par jour.'}
        </Txt>
      </View>

      {isDaily ? (
        <DailyPanel
          playedToday={playedToday}
          lastDate={record?.date ?? null}
          lastScore={record ? `${record.score}/${record.total}` : null}
        />
      ) : (
        <>
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
        </>
      )}

      <Txt font="mono" size={12} tone="ink2">
        {available} mot{available > 1 ? 's' : ''} disponible{available > 1 ? 's' : ''} ·{' '}
        {Math.min(QUIZ_LENGTH, available)} question
        {Math.min(QUIZ_LENGTH, available) > 1 ? 's' : ''}
      </Txt>
      {!canStart && !isDaily ? (
        <Txt font="mono" size={12} color={Accent.red}>
          Pas assez de mots pour ce filtre (min. {QCM_MIN_POOL} pour un QCM).
        </Txt>
      ) : null}

      <ButtonPrimary
        label={isDaily && playedToday ? 'Déjà joué aujourd’hui' : 'Démarrer'}
        onPress={start}
        disabled={!canStart}
        color={Accent.green}
      />
    </ScreenScaffold>
  );
}

function DailyPanel({
  playedToday,
  lastDate,
  lastScore,
}: {
  playedToday: boolean;
  lastDate: string | null;
  lastScore: string | null;
}) {
  if (!playedToday) {
    return (
      <HardShadowBox offset={Shadow.sm} contentStyle={styles.dailyCard}>
        <Txt font="monoBold" size={11} color={Accent.green} uppercase tracking={1.2}>
          Disponible
        </Txt>
        <Txt font="body" size={13} lineHeight={19}>
          {lastDate
            ? `Dernier essai : ${lastDate}${lastScore ? ` · ${lastScore}` : ''}.`
            : 'Premier essai aujourd’hui. Tu n’auras qu’une chance.'}
        </Txt>
      </HardShadowBox>
    );
  }
  return (
    <HardShadowBox offset={Shadow.sm} contentStyle={styles.dailyCard}>
      <Txt font="monoBold" size={11} color={Accent.red} uppercase tracking={1.2}>
        Déjà joué aujourd’hui
      </Txt>
      {lastScore ? (
        <Txt font="display" size={28} tracking={-0.5}>
          {lastScore}
        </Txt>
      ) : null}
      <Txt font="body" size={13} lineHeight={19} tone="ink2">
        Le Quiz quotidien se remet à zéro chaque jour à minuit (heure locale).
      </Txt>
    </HardShadowBox>
  );
}

const styles = StyleSheet.create({
  group: { gap: Spacing.two },
  modes: { flexDirection: 'row', gap: Spacing.two },
  row: { gap: Spacing.two, paddingRight: Spacing.four },
  scoreCard: { alignItems: 'center', gap: Spacing.two, paddingVertical: Spacing.four },
  center: { textAlign: 'center' },
  dailyCard: { padding: Spacing.three, gap: Spacing.two },
});
