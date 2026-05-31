import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { ButtonPrimary } from '@/components/ui/ButtonPrimary';
import { Chip } from '@/components/ui/Chip';
import { HardShadowBox } from '@/components/ui/HardShadowBox';
import { Input } from '@/components/ui/Input';
import { Txt } from '@/components/ui/Txt';
import { useTheme } from '@/theme/theme-context';
import { Accent, Border, Shadow, Spacing } from '@/theme/tokens';
import { TENSES, TENSE_GLOSS, type Tense } from '@/conjugaison/tenses';
import { api, ApiError, type ConjugateResponse, type Person } from '@/lib/api';

type Phase = 'setup' | 'loading' | 'playing' | 'reveal';

/** Ordre canonique des 6 personnes (même que ConjugateResult). */
const PERSONS: { key: Person; label: string }[] = [
  { key: 'ich', label: 'ich' },
  { key: 'du', label: 'du' },
  { key: 'er_sie_es', label: 'er/sie/es' },
  { key: 'wir', label: 'wir' },
  { key: 'ihr', label: 'ihr' },
  { key: 'sie_Sie', label: 'sie/Sie' },
];

/** Compare strictement : trim + lowercase + espaces compactés. Respecte ß/umlauts. */
function normalize(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, ' ');
}

/**
 * Drill conjugaison assisté par IA.
 *
 * Tu tapes n'importe quel verbe (pas limité aux 98 locaux) + un temps parmi les
 * 9 disponibles → l'IA renvoie les 6 conjugaisons attendues via /api/conjugate.
 * Le drill compare localement (1 seul appel IA par verbe, pas 6).
 */
export function AiDrill() {
  const [phase, setPhase] = useState<Phase>('setup');
  const [verb, setVerb] = useState('');
  const [tense, setTense] = useState<Tense>('Präsens');
  const [data, setData] = useState<ConjugateResponse | null>(null);
  const [answers, setAnswers] = useState<string[]>(['', '', '', '', '', '']);
  const [stats, setStats] = useState({ attempted: 0, perfect: 0 });
  const [error, setError] = useState<string | null>(null);
  const { colors } = useTheme();

  const start = async () => {
    const cleaned = verb.trim();
    setError(null);
    if (!cleaned) {
      setError('Entre un verbe à l’infinitif (ex. gehen).');
      return;
    }
    setPhase('loading');
    try {
      const res = await api.conjugate({ verb: cleaned, tense });
      setData(res);
      setAnswers(['', '', '', '', '', '']);
      setPhase('playing');
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Génération impossible. Réessaie.');
      setPhase('setup');
    }
  };

  const reveal = () => setPhase('reveal');

  const nextAttempt = (countAsPerfect: boolean) => {
    setStats((s) => ({ attempted: s.attempted + 1, perfect: s.perfect + (countAsPerfect ? 1 : 0) }));
    setData(null);
    setAnswers(['', '', '', '', '', '']);
    setPhase('setup');
  };

  const back = () => {
    setStats({ attempted: 0, perfect: 0 });
    setData(null);
    setError(null);
    setPhase('setup');
  };

  const errorBox = error ? (
    <Txt font="mono" size={12} color={Accent.red}>
      {error}
    </Txt>
  ) : null;

  if (phase === 'setup' || phase === 'loading') {
    return (
      <View style={styles.wrap}>
        <Txt font="serifItalic" size={14} tone="ink2" lineHeight={20}>
          Choisis un verbe et un temps. L’IA te donne les 6 conjugaisons à trouver. Tu tapes, on corrige.
        </Txt>

        {stats.attempted > 0 ? (
          <Txt font="monoBold" size={11} color={Accent.purple} uppercase tracking={1.2}>
            Session : {stats.perfect}/{stats.attempted} parfaits
          </Txt>
        ) : null}

        <Input
          label="Verbe (infinitif)"
          value={verb}
          onChangeText={setVerb}
          placeholder="z. B. gehen, anrufen, sein"
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="off"
          returnKeyType="search"
          onSubmitEditing={start}
        />

        <View style={styles.group}>
          <Txt font="monoBold" size={10} tone="ink2" uppercase tracking={1.5}>Temps</Txt>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tenseRow}>
            {TENSES.map((t) => (
              <Chip
                key={t}
                label={t}
                sublabel={TENSE_GLOSS[t]}
                selected={tense === t}
                onPress={() => setTense(t)}
                color={Accent.purple}
              />
            ))}
          </ScrollView>
        </View>

        {errorBox}
        <ButtonPrimary label="Démarrer le drill" onPress={start} loading={phase === 'loading'} color={Accent.purple} />
        <Txt font="serifItalic" size={11} tone="ink2" lineHeight={16}>
          Généré par IA. Vérifie les points critiques avant un examen réel.
        </Txt>
      </View>
    );
  }

  if (!data) return null;

  const expected = PERSONS.map((p) => data.conjugations[p.key] ?? '');
  const correctByRow = expected.map((e, i) => normalize(answers[i]) === normalize(e));
  const perfect = phase === 'reveal' && correctByRow.every(Boolean);
  const isReveal = phase === 'reveal';

  return (
    <View style={styles.wrap}>
      <View style={styles.scoreRow}>
        <Txt font="monoBold" size={11} tone="ink2" uppercase tracking={1.2}>
          {data.tense} · session {stats.perfect}/{stats.attempted}
        </Txt>
      </View>

      <HardShadowBox offset={Shadow.lg} contentStyle={styles.verbCard}>
        <Txt font="display" size={32} tracking={-0.5}>{data.verb}</Txt>
        <View style={styles.tags}>
          <Tag label={data.isIrregular ? 'Verbe fort' : 'Verbe faible'} color={data.isIrregular ? Accent.red : Accent.green} />
          {data.separable ? <Tag label="Séparable" color={Accent.yellow} dark /> : null}
          <Tag label={`Aux. ${data.auxiliary}`} color={Accent.blue} />
        </View>
      </HardShadowBox>

      <View style={styles.formsCol}>
        {PERSONS.map((p, i) => {
          const isOk = isReveal && correctByRow[i];
          const isKo = isReveal && !correctByRow[i];
          return (
            <View key={p.key} style={styles.formRow}>
              <Txt font="mono" size={13} tone="ink2" style={styles.formPerson}>{p.label}</Txt>
              <View style={styles.formInputCol}>
                <Input
                  value={answers[i]}
                  onChangeText={(v) =>
                    setAnswers((prev) => {
                      const next = [...prev];
                      next[i] = v;
                      return next;
                    })
                  }
                  placeholder="—"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="off"
                  editable={!isReveal}
                  error={isKo ? expected[i] : undefined}
                />
                {isOk ? (
                  <Txt font="monoBold" size={11} color={Accent.green} uppercase tracking={1.2}>
                    ✓ correct
                  </Txt>
                ) : null}
              </View>
            </View>
          );
        })}
      </View>

      {data.notes && isReveal ? (
        <HardShadowBox background={colors.cream2} offset={Shadow.sm} contentStyle={styles.notes}>
          <Txt font="monoBold" size={10} color={Accent.blue} tracking={1.5}>NOTE IA</Txt>
          <Txt font="body" size={13} lineHeight={19}>{data.notes}</Txt>
        </HardShadowBox>
      ) : null}

      {isReveal ? (
        <>
          <HardShadowBox
            background={perfect ? Accent.green : Accent.yellow}
            offset={Shadow.md}
            contentStyle={styles.summary}>
            <Txt font="display" size={20} color={perfect ? '#FFFFFF' : '#0A0A0A'} tracking={-0.5}>
              {correctByRow.filter(Boolean).length}/6
            </Txt>
            <Txt font="monoBold" size={11} color={perfect ? '#FFFFFF' : '#0A0A0A'} uppercase tracking={1.2}>
              {perfect ? 'Parfait. 6/6.' : 'Réponses attendues affichées en rouge'}
            </Txt>
          </HardShadowBox>

          <ButtonPrimary label="Autre verbe" onPress={() => nextAttempt(perfect)} color={Accent.purple} />
          <ButtonPrimary label="Recommencer la session" onPress={back} color={colors.ink} />
        </>
      ) : (
        <ButtonPrimary label="Corriger" onPress={reveal} color={Accent.blue} />
      )}
    </View>
  );
}

function Tag({ label, color, dark }: { label: string; color: string; dark?: boolean }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.tag, { backgroundColor: color, borderColor: colors.ink }]}>
      <Txt font="monoBold" size={10} color={dark ? '#0A0A0A' : '#FFFFFF'} uppercase tracking={0.5}>
        {label}
      </Txt>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: Spacing.three },
  group: { gap: Spacing.two },
  tenseRow: { gap: Spacing.two, paddingRight: Spacing.four },
  scoreRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  verbCard: { padding: Spacing.four, alignItems: 'center', gap: Spacing.two },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two, justifyContent: 'center' },
  tag: { borderWidth: Border.base, paddingVertical: 5, paddingHorizontal: Spacing.two },
  formsCol: { gap: Spacing.two },
  formRow: { flexDirection: 'row', gap: Spacing.two, alignItems: 'flex-start' },
  formPerson: { width: 72, paddingTop: Spacing.three + 4 },
  formInputCol: { flex: 1, gap: 2 },
  notes: { padding: Spacing.three, gap: Spacing.two },
  summary: {
    padding: Spacing.three,
    alignItems: 'center',
    gap: Spacing.one,
    borderColor: '#0A0A0A',
    borderWidth: Border.base,
  },
});
