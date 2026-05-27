import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { ButtonPrimary } from '@/components/ui/ButtonPrimary';
import { Chip } from '@/components/ui/Chip';
import { Input } from '@/components/ui/Input';
import { ScreenScaffold } from '@/components/ui/ScreenScaffold';
import { Txt } from '@/components/ui/Txt';
import { ConjugateResult } from '@/conjugaison/ConjugateResult';
import { IrregularResult } from '@/conjugaison/IrregularResult';
import { TENSES, TENSE_GLOSS, type Tense } from '@/conjugaison/tenses';
import { api, ApiError, type CheckIrregularResponse, type ConjugateResponse } from '@/lib/api';
import { Accent, Spacing } from '@/theme/tokens';

type Mode = 'conjuguer' | 'irregulier';

/** Module Conjugaison live (DeepSeek) : conjuguer un verbe ou tester sa régularité. */
export default function ConjugaisonScreen() {
  const [mode, setMode] = useState<Mode>('conjuguer');
  const [verb, setVerb] = useState('');
  const [tense, setTense] = useState<Tense>('Präsens');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conj, setConj] = useState<ConjugateResponse | null>(null);
  const [irr, setIrr] = useState<CheckIrregularResponse | null>(null);

  const switchMode = (next: Mode) => {
    if (next === mode) return;
    setMode(next);
    setError(null);
    setConj(null);
    setIrr(null);
  };

  const submit = async () => {
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

  const isConjuguer = mode === 'conjuguer';

  return (
    <ScreenScaffold eyebrow="DÉCOUVRIR" title="Conjugaison">
      <View style={styles.modes}>
        <Chip label="Conjuguer" selected={isConjuguer} onPress={() => switchMode('conjuguer')} color={Accent.blue} fullWidth />
        <Chip label="Régulier ?" selected={!isConjuguer} onPress={() => switchMode('irregulier')} color={Accent.red} fullWidth />
      </View>

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
          <Txt font="monoBold" size={10} tone="ink2" uppercase tracking={1.5}>
            Temps
          </Txt>
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

      {error ? (
        <Txt font="mono" size={12} color={Accent.red}>
          {error}
        </Txt>
      ) : null}

      {isConjuguer && conj ? <ConjugateResult data={conj} /> : null}
      {!isConjuguer && irr ? <IrregularResult data={irr} /> : null}
    </ScreenScaffold>
  );
}

const styles = StyleSheet.create({
  modes: { flexDirection: 'row', gap: Spacing.two },
  tenses: { gap: Spacing.two },
  tenseRow: { gap: Spacing.two, paddingRight: Spacing.four },
});
