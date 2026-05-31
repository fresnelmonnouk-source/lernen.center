import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ButtonPrimary } from '@/components/ui/ButtonPrimary';
import { Chip } from '@/components/ui/Chip';
import { ScreenScaffold } from '@/components/ui/ScreenScaffold';
import { Txt } from '@/components/ui/Txt';
import { CERT_DISCLAIMER, LESEN_PARTS, LEVELS } from '@/certification/specs';
import { LesenResults } from '@/certification/LesenResults';
import { LesenRunner, type LesenAnswerMap } from '@/certification/LesenRunner';
import { api, ApiError, type CertLesenResponse, type Level } from '@/lib/api';
import { Accent, LevelColor, Spacing } from '@/theme/tokens';

type Phase = 'setup' | 'playing' | 'done';

export default function LesenScreen() {
  const [phase, setPhase] = useState<Phase>('setup');
  const [level, setLevel] = useState<Level>('B1');
  const [part, setPart] = useState<number>(1);
  const [test, setTest] = useState<CertLesenResponse['test'] | null>(null);
  const [answers, setAnswers] = useState<LesenAnswerMap>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parts = LESEN_PARTS[level];

  /** Force `part` à rester dans les parties valides du niveau sélectionné. */
  const pickLevel = (l: Level) => {
    setLevel(l);
    const validParts = LESEN_PARTS[l].map((p) => p.part);
    if (!validParts.includes(part)) setPart(validParts[0]);
  };

  const generate = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await api.certLesen({ level, part });
      setTest(res.test);
      setAnswers({});
      setPhase('playing');
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Génération impossible. Réessaie.');
    } finally {
      setLoading(false);
    }
  };

  const submit = (filled: LesenAnswerMap) => {
    setAnswers(filled);
    setPhase('done');
  };

  const restart = () => {
    setTest(null);
    setAnswers({});
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
      <ScreenScaffold eyebrow="CERTIFICATION" title="Lesen">
        <LesenRunner test={test} submitting={false} onSubmit={submit} />
        {errorBox}
      </ScreenScaffold>
    );
  }

  if (phase === 'done' && test) {
    return (
      <ScreenScaffold eyebrow="CERTIFICATION" title="Bilan">
        <LesenResults test={test} answers={answers} />
        <ButtonPrimary label="Nouveau test" onPress={restart} color={Accent.blue} />
      </ScreenScaffold>
    );
  }

  return (
    <ScreenScaffold eyebrow="CERTIFICATION" title="Lesen">
      <Txt font="serifItalic" size={14} tone="ink2" lineHeight={20}>
        Compréhension écrite niveau A1 à B2. Chaque test est généré par IA ; la correction est immédiate
        et locale.
      </Txt>

      <View style={styles.group}>
        <Txt font="monoBold" size={10} tone="ink2" uppercase tracking={1.5}>Niveau</Txt>
        <View style={styles.rowWrap}>
          {LEVELS.map((l) => (
            <Chip key={l} label={l} selected={level === l} onPress={() => pickLevel(l)} color={LevelColor[l]} />
          ))}
        </View>
      </View>

      <View style={styles.group}>
        <Txt font="monoBold" size={10} tone="ink2" uppercase tracking={1.5}>Partie</Txt>
        <View style={styles.partsCol}>
          {parts.map((p) => (
            <Chip
              key={p.part}
              label={`Partie ${p.part} · ${p.title}`}
              sublabel={`${p.questions} questions · ${p.description}`}
              selected={part === p.part}
              onPress={() => setPart(p.part)}
              color={Accent.blue}
              fullWidth
            />
          ))}
        </View>
      </View>

      {errorBox}
      <ButtonPrimary label="Générer le test" onPress={generate} loading={loading} color={Accent.blue} />

      <Txt font="serifItalic" size={11} tone="ink2" lineHeight={16}>
        {CERT_DISCLAIMER}
      </Txt>
    </ScreenScaffold>
  );
}

const styles = StyleSheet.create({
  group: { gap: Spacing.two },
  rowWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  partsCol: { gap: Spacing.two },
});
