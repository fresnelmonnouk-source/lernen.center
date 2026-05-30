import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ButtonPrimary } from '@/components/ui/ButtonPrimary';
import { Chip } from '@/components/ui/Chip';
import { HardShadowBox } from '@/components/ui/HardShadowBox';
import { Input } from '@/components/ui/Input';
import { Txt } from '@/components/ui/Txt';
import { useTheme } from '@/theme/theme-context';
import { Accent, Border, LevelColor, Shadow, Spacing } from '@/theme/tokens';
import {
  ALL_VERBS,
  getVerbs,
  LOCAL_TENSES,
  VERB_PERSONS,
  buildPerfekt,
  type LocalTense,
  type VerbEntry,
} from '@/data/verbs';
import type { Level } from '@/lib/api';

type Phase = 'setup' | 'playing' | 'reveal';

/** Forme attendue d'un verbe pour une personne et un temps donné. */
function getForm(verb: VerbEntry, tense: LocalTense, personIndex: number): string {
  if (tense === 'Präsens') return verb.P[personIndex];
  if (tense === 'Präteritum') return verb.T[personIndex];
  return buildPerfekt(verb)[personIndex];
}

/** Compare strictement (trim + lowercase + espaces compactés). Respecte ß / umlauts. */
function normalize(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, ' ');
}

function pickRandom<T>(arr: readonly T[], exclude?: T): T {
  if (arr.length === 0) throw new Error('pool vide');
  if (arr.length === 1) return arr[0];
  let pick = arr[Math.floor(Math.random() * arr.length)];
  while (pick === exclude) pick = arr[Math.floor(Math.random() * arr.length)];
  return pick;
}

const LEVELS: Level[] = ['A1', 'A2', 'B1', 'B2'];

/**
 * Drill local : tirage aléatoire d'un verbe (filtré par temps + niveau optionnel),
 * 6 inputs pour les 6 personnes, correction stricte locale au tap.
 */
export function LocalDrill() {
  const [phase, setPhase] = useState<Phase>('setup');
  const [tense, setTense] = useState<LocalTense>('Präsens');
  const [level, setLevel] = useState<Level | null>(null);
  const [verb, setVerb] = useState<VerbEntry | null>(null);
  const [answers, setAnswers] = useState<string[]>(['', '', '', '', '', '']);
  const [stats, setStats] = useState({ attempted: 0, perfect: 0 });
  const { colors } = useTheme();

  const pool = useMemo(() => getVerbs({ level }), [level]);

  const start = () => {
    const next = pickRandom(pool);
    setVerb(next);
    setAnswers(['', '', '', '', '', '']);
    setPhase('playing');
  };

  const reveal = () => {
    setPhase('reveal');
  };

  const nextVerb = (countAsPerfect: boolean) => {
    setStats((s) => ({ attempted: s.attempted + 1, perfect: s.perfect + (countAsPerfect ? 1 : 0) }));
    const next = pickRandom(pool, verb ?? undefined);
    setVerb(next);
    setAnswers(['', '', '', '', '', '']);
    setPhase('playing');
  };

  const back = () => {
    setStats({ attempted: 0, perfect: 0 });
    setVerb(null);
    setPhase('setup');
  };

  if (phase === 'setup') {
    return (
      <View style={styles.wrap}>
        <Txt font="serifItalic" size={14} tone="ink2" lineHeight={20}>
          Tirage aléatoire parmi les 98 verbes pré-conjugués. Tape les 6 personnes, correction immédiate
          et 100% hors-ligne.
        </Txt>

        <View style={styles.group}>
          <Txt font="monoBold" size={10} tone="ink2" uppercase tracking={1.5}>Temps</Txt>
          <View style={styles.rowWrap}>
            {LOCAL_TENSES.map((t) => (
              <Chip key={t} label={t} selected={tense === t} onPress={() => setTense(t)} color={Accent.blue} />
            ))}
          </View>
        </View>

        <View style={styles.group}>
          <Txt font="monoBold" size={10} tone="ink2" uppercase tracking={1.5}>Niveau</Txt>
          <View style={styles.rowWrap}>
            <Chip label="Tous" selected={level === null} onPress={() => setLevel(null)} />
            {LEVELS.map((l) => (
              <Chip key={l} label={l} selected={level === l} onPress={() => setLevel(l)} color={LevelColor[l]} />
            ))}
          </View>
        </View>

        <Txt font="mono" size={12} tone="ink2">
          {pool.length} verbe{pool.length > 1 ? 's' : ''} disponible{pool.length > 1 ? 's' : ''} sur {ALL_VERBS.length}.
        </Txt>

        <ButtonPrimary label="Démarrer" onPress={start} disabled={pool.length === 0} color={Accent.green} />
      </View>
    );
  }

  if (!verb) return null;

  const isReveal = phase === 'reveal';
  const expected = VERB_PERSONS.map((_, i) => getForm(verb, tense, i));
  const correctByRow = expected.map((e, i) => normalize(answers[i]) === normalize(e));
  const perfect = isReveal && correctByRow.every(Boolean);

  return (
    <View style={styles.wrap}>
      <View style={styles.scoreRow}>
        <Txt font="monoBold" size={11} tone="ink2" uppercase tracking={1.2}>
          {tense} · niveau {level ?? 'tous'}
        </Txt>
        <Txt font="monoBold" size={11} color={Accent.purple} uppercase tracking={1.2}>
          {stats.perfect}/{stats.attempted} parfaits
        </Txt>
      </View>

      <HardShadowBox offset={Shadow.lg} contentStyle={styles.verbCard}>
        <Txt font="display" size={32} tracking={-0.5}>{verb.v}</Txt>
        <Txt font="serifItalic" size={16} tone="ink2">{verb.f}</Txt>
      </HardShadowBox>

      <View style={styles.formsCol}>
        {VERB_PERSONS.map((p, i) => {
          const isOk = isReveal && correctByRow[i];
          const isKo = isReveal && !correctByRow[i];
          return (
            <View key={p} style={styles.formRow}>
              <Txt font="mono" size={13} tone="ink2" style={styles.formPerson}>{p}</Txt>
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
                  placeholder={tense === 'Perfekt' ? 'hat … / ist …' : '—'}
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
              {perfect ? 'Parfait — Stark !' : 'Réponses attendues affichées en rouge'}
            </Txt>
          </HardShadowBox>

          <ButtonPrimary label="Verbe suivant" onPress={() => nextVerb(perfect)} color={Accent.green} />
          <ButtonPrimary label="Changer les filtres" onPress={back} color={colors.ink} />
        </>
      ) : (
        <ButtonPrimary label="Corriger" onPress={reveal} color={Accent.blue} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: Spacing.three },
  group: { gap: Spacing.two },
  rowWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  scoreRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  verbCard: { padding: Spacing.four, alignItems: 'center', gap: Spacing.two },
  formsCol: { gap: Spacing.two },
  formRow: { flexDirection: 'row', gap: Spacing.two, alignItems: 'flex-start' },
  formPerson: { width: 72, paddingTop: Spacing.three + 4 },
  formInputCol: { flex: 1, gap: 2 },
  summary: {
    padding: Spacing.three,
    alignItems: 'center',
    gap: Spacing.one,
    borderColor: '#0A0A0A',
    borderWidth: Border.base,
  },
});
