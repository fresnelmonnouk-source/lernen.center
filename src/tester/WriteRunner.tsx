import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ButtonPrimary } from '@/components/ui/ButtonPrimary';
import { HardShadowBox } from '@/components/ui/HardShadowBox';
import { Input } from '@/components/ui/Input';
import { Txt } from '@/components/ui/Txt';
import { useTheme } from '@/theme/theme-context';
import { Accent, LevelColor, Border, Shadow, Spacing } from '@/theme/tokens';
import { checkWrite } from '@/tester/quiz-engine';
import type { VocabWord } from '@/data/vocabulary';

type Props = { words: VocabWord[]; onComplete: (score: number, total: number) => void };

/** Super Quiz écriture : on montre le français, l'utilisateur tape l'allemand
 *  (article + orthographe). Correction stricte, on révèle la réponse attendue. */
export function WriteRunner({ words, onComplete }: Props) {
  const { colors } = useTheme();
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState('');
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [score, setScore] = useState(0);

  const word = words[index];
  const isLast = index === words.length - 1;

  const verify = () => {
    if (checked || !input.trim()) return;
    const ok = checkWrite(input, word);
    setChecked(true);
    setCorrect(ok);
    if (ok) setScore((s) => s + 1);
  };

  const next = () => {
    if (isLast) {
      onComplete(score, words.length);
      return;
    }
    setIndex((n) => n + 1);
    setInput('');
    setChecked(false);
    setCorrect(false);
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.head}>
        <Txt font="monoBold" size={11} tone="ink2" uppercase tracking={1.2}>
          Mot {index + 1} / {words.length}
        </Txt>
        <Txt font="monoBold" size={11} color={Accent.green} uppercase tracking={1.2}>
          Score {score}
        </Txt>
      </View>

      <HardShadowBox offset={Shadow.lg} contentStyle={styles.prompt}>
        <View style={[styles.level, { backgroundColor: LevelColor[word.l], borderColor: colors.ink }]}>
          <Txt font="monoBold" size={11} color="#0A0A0A" tracking={0.8}>
            {word.l}
          </Txt>
        </View>
        {word.e ? <Txt size={44}>{word.e}</Txt> : null}
        <Txt font="serifItalic" size={26} style={styles.center}>
          {word.f}
        </Txt>
        <Txt font="mono" size={10} tone="ink2" uppercase tracking={1.5}>
          Tape le mot allemand avec son article (der/die/das)
        </Txt>
      </HardShadowBox>

      <Input
        value={input}
        onChangeText={setInput}
        editable={!checked}
        placeholder="z. B. der Vater"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="off"
        returnKeyType="done"
        onSubmitEditing={verify}
      />

      {checked ? (
        <HardShadowBox background={correct ? Accent.green : Accent.red} offset={Shadow.sm} contentStyle={styles.feedback}>
          <Txt font="monoBold" size={12} color="#FFFFFF" uppercase tracking={1}>
            {correct ? 'Correct' : 'Incorrect'}
          </Txt>
          {!correct ? (
            <Txt font="bold" size={16} color="#FFFFFF">
              {word.d}
            </Txt>
          ) : null}
        </HardShadowBox>
      ) : null}

      {checked ? (
        <ButtonPrimary label={isLast ? 'Voir le score' : 'Suivant'} icon={isLast ? undefined : 'chevronRight'} onPress={next} />
      ) : (
        <ButtonPrimary label="Vérifier" onPress={verify} disabled={!input.trim()} color={Accent.blue} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: Spacing.three },
  head: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  prompt: { minHeight: 160, padding: Spacing.four, alignItems: 'center', justifyContent: 'center', gap: Spacing.two },
  level: { position: 'absolute', top: Spacing.two, right: Spacing.two, borderWidth: Border.base, paddingVertical: 3, paddingHorizontal: Spacing.two },
  center: { textAlign: 'center' },
  feedback: { padding: Spacing.three, gap: 2, alignItems: 'flex-start' },
});
