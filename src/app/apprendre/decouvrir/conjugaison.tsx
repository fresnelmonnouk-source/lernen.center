import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { ButtonPrimary } from '@/components/ui/ButtonPrimary';
import { Chip } from '@/components/ui/Chip';
import { Input } from '@/components/ui/Input';
import { ScreenScaffold } from '@/components/ui/ScreenScaffold';
import { Txt } from '@/components/ui/Txt';
import { ConjugateResult } from '@/conjugaison/ConjugateResult';
import { IrregularResult } from '@/conjugaison/IrregularResult';
import { LocalDetail } from '@/conjugaison/LocalDetail';
import { LocalDrill } from '@/conjugaison/LocalDrill';
import { LocalLookup } from '@/conjugaison/LocalLookup';
import { TENSES, TENSE_GLOSS, type Tense } from '@/conjugaison/tenses';
import { getVerbs, VERB_TYPES, VERB_TYPE_LABEL, type VerbEntry, type VerbType } from '@/data/verbs';
import { api, ApiError, type CheckIrregularResponse, type ConjugateResponse, type Level } from '@/lib/api';
import { Accent, LevelColor, Spacing } from '@/theme/tokens';

type Mode = 'conjuguer' | 'irregulier' | 'consulter' | 'drill';

const MODES: { key: Mode; label: string; sublabel: string; color: string }[] = [
  { key: 'conjuguer', label: 'Conjuguer', sublabel: 'IA live', color: Accent.blue },
  { key: 'irregulier', label: 'Régulier ?', sublabel: 'IA live', color: Accent.red },
  { key: 'consulter', label: 'Consulter', sublabel: 'Hors-ligne', color: Accent.green },
  { key: 'drill', label: 'Tableau', sublabel: 'Hors-ligne', color: Accent.purple },
];

const LEVELS: Level[] = ['A1', 'A2', 'B1', 'B2'];

/** Module Conjugaison : 2 modes IA live (DeepSeek) + 2 modes offline (98 verbes). */
export default function ConjugaisonScreen() {
  const [mode, setMode] = useState<Mode>('conjuguer');

  // ── IA modes state ──────────────────────────────────────────────────────
  const [verb, setVerb] = useState('');
  const [tense, setTense] = useState<Tense>('Präsens');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conj, setConj] = useState<ConjugateResponse | null>(null);
  const [irr, setIrr] = useState<CheckIrregularResponse | null>(null);

  // ── Local lookup state ──────────────────────────────────────────────────
  const [query, setQuery] = useState('');
  const [level, setLevel] = useState<Level | null>(null);
  const [type, setType] = useState<VerbType | null>(null);
  const [picked, setPicked] = useState<VerbEntry | null>(null);

  const localVerbs = useMemo(() => getVerbs({ query, level, type }), [query, level, type]);

  const switchMode = (next: Mode) => {
    if (next === mode) return;
    setMode(next);
    setError(null);
    setConj(null);
    setIrr(null);
    setPicked(null);
  };

  const submitLive = async () => {
    const cleaned = verb.trim();
    setError(null);
    if (!cleaned) {
      setError('Entre un verbe à l’infinitif (ex. gehen).');
      return;
    }
    setLoading(true);
    try {
      if (mode === 'conjuguer') {
        setConj(await api.conjugate({ verb: cleaned, tense }));
      } else {
        setIrr(await api.checkIrregular({ verb: cleaned }));
      }
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Une erreur est survenue. Réessaie.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenScaffold eyebrow="DÉCOUVRIR" title="Conjugaison">
      <View style={styles.modes}>
        {MODES.map((m) => (
          <Chip
            key={m.key}
            label={m.label}
            sublabel={m.sublabel}
            selected={mode === m.key}
            onPress={() => switchMode(m.key)}
            color={m.color}
          />
        ))}
      </View>

      {mode === 'conjuguer' || mode === 'irregulier' ? (
        <LiveControls
          verb={verb}
          setVerb={setVerb}
          tense={tense}
          setTense={setTense}
          submit={submitLive}
          loading={loading}
          mode={mode}
        />
      ) : null}

      {error ? (
        <Txt font="mono" size={12} color={Accent.red}>
          {error}
        </Txt>
      ) : null}

      {mode === 'conjuguer' && conj ? <ConjugateResult data={conj} /> : null}
      {mode === 'irregulier' && irr ? <IrregularResult data={irr} /> : null}

      {mode === 'consulter' ? (
        picked ? (
          <LocalDetail verb={picked} onBack={() => setPicked(null)} />
        ) : (
          <>
            <Input
              label="Rechercher"
              value={query}
              onChangeText={setQuery}
              placeholder="gehen, manger, sich…"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="off"
            />
            <View style={styles.group}>
              <Txt font="monoBold" size={10} tone="ink2" uppercase tracking={1.5}>Niveau</Txt>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollRow}>
                <Chip label="Tous" selected={level === null} onPress={() => setLevel(null)} />
                {LEVELS.map((l) => (
                  <Chip key={l} label={l} selected={level === l} onPress={() => setLevel(l)} color={LevelColor[l]} />
                ))}
              </ScrollView>
            </View>
            <View style={styles.group}>
              <Txt font="monoBold" size={10} tone="ink2" uppercase tracking={1.5}>Type</Txt>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollRow}>
                <Chip label="Tous" selected={type === null} onPress={() => setType(null)} />
                {VERB_TYPES.map((t) => (
                  <Chip key={t} label={VERB_TYPE_LABEL[t]} selected={type === t} onPress={() => setType(t)} color={Accent.purple} />
                ))}
              </ScrollView>
            </View>
            <Txt font="mono" size={12} tone="ink2">
              {localVerbs.length} verbe{localVerbs.length > 1 ? 's' : ''} sur 98 · 100% hors-ligne
            </Txt>
            <LocalLookup verbs={localVerbs} onPick={setPicked} />
          </>
        )
      ) : null}

      {mode === 'drill' ? <LocalDrill /> : null}
    </ScreenScaffold>
  );
}

function LiveControls({
  verb,
  setVerb,
  tense,
  setTense,
  submit,
  loading,
  mode,
}: {
  verb: string;
  setVerb: (v: string) => void;
  tense: Tense;
  setTense: (t: Tense) => void;
  submit: () => void;
  loading: boolean;
  mode: 'conjuguer' | 'irregulier';
}) {
  const isConjuguer = mode === 'conjuguer';
  return (
    <>
      <Input
        label="Verbe (infinitif)"
        value={verb}
        onChangeText={setVerb}
        placeholder="z. B. gehen, anrufen, sein"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="off"
        returnKeyType="search"
        onSubmitEditing={submit}
      />

      {isConjuguer ? (
        <View style={styles.tenses}>
          <Txt font="monoBold" size={10} tone="ink2" uppercase tracking={1.5}>Temps</Txt>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tenseRow}>
            {TENSES.map((t) => (
              <Chip
                key={t}
                label={t}
                sublabel={TENSE_GLOSS[t]}
                selected={tense === t}
                onPress={() => setTense(t)}
                color={Accent.blue}
              />
            ))}
          </ScrollView>
        </View>
      ) : null}

      <ButtonPrimary
        label={isConjuguer ? 'Conjuguer' : 'Analyser'}
        onPress={submit}
        loading={loading}
        color={isConjuguer ? Accent.blue : Accent.red}
      />
    </>
  );
}

const styles = StyleSheet.create({
  modes: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  tenses: { gap: Spacing.two },
  tenseRow: { gap: Spacing.two, paddingRight: Spacing.four },
  group: { gap: Spacing.two },
  scrollRow: { gap: Spacing.two, paddingRight: Spacing.four },
});
