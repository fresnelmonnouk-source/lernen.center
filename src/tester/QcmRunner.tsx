import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ButtonPrimary } from '@/components/ui/ButtonPrimary';
import { HardShadowBox } from '@/components/ui/HardShadowBox';
import { Txt } from '@/components/ui/Txt';
import { useTheme } from '@/theme/theme-context';
import { Accent, ArticleColor, Border, LevelColor, Shadow, Spacing } from '@/theme/tokens';
import type { QcmQuestion } from '@/tester/quiz-engine';

type Props = { questions: QcmQuestion[]; onComplete: (score: number, total: number) => void };

/** Couleur d'une option selon l'état de la réponse. */
function optionColors(i: number, selected: number | null, correctIndex: number, paper: string, ink: string) {
  if (selected === null) return { bg: paper, fg: ink, dim: false };
  if (i === correctIndex) return { bg: Accent.green, fg: '#FFFFFF', dim: false };
  if (i === selected) return { bg: Accent.red, fg: '#FFFFFF', dim: false };
  return { bg: paper, fg: ink, dim: true };
}

/** Déroule un QCM question par question avec correction immédiate. */
export function QcmRunner({ questions, onComplete }: Props) {
  const { colors } = useTheme();
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  const q = questions[index];
  const isLast = index === questions.length - 1;
  const articleColor = q.word.a ? ArticleColor[q.word.a] : Accent.blue;

  const pick = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    if (i === q.correctIndex) setScore((s) => s + 1);
  };

  const next = () => {
    if (isLast) {
      onComplete(score, questions.length);
      return;
    }
    setIndex((n) => n + 1);
    setSelected(null);
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.head}>
        <Txt font="monoBold" size={11} tone="ink2" uppercase tracking={1.2}>
          Question {index + 1} / {questions.length}
        </Txt>
        <Txt font="monoBold" size={11} color={Accent.green} uppercase tracking={1.2}>
          Score {score}
        </Txt>
      </View>

      <HardShadowBox offset={Shadow.lg} contentStyle={styles.prompt}>
        <View style={[styles.level, { backgroundColor: LevelColor[q.word.l], borderColor: colors.ink }]}>
          <Txt font="monoBold" size={11} color="#0A0A0A" tracking={0.8}>
            {q.word.l}
          </Txt>
        </View>
        {q.word.e ? <Txt size={44}>{q.word.e}</Txt> : null}
        <Txt font="display" size={28} color={articleColor} tracking={-0.5} style={styles.center}>
          {q.word.d}
        </Txt>
        <Txt font="mono" size={10} tone="ink2" uppercase tracking={1.5}>
          Quelle traduction ?
        </Txt>
      </HardShadowBox>

      <View style={styles.options}>
        {q.options.map((opt, i) => {
          const c = optionColors(i, selected, q.correctIndex, colors.paper, colors.ink);
          return (
            <Pressable
              key={i}
              accessibilityRole="button"
              disabled={selected !== null}
              onPress={() => pick(i)}
              style={[styles.option, { backgroundColor: c.bg, borderColor: colors.ink, opacity: c.dim ? 0.45 : 1 }]}>
              <Txt font="medium" size={15} color={c.fg}>
                {opt}
              </Txt>
            </Pressable>
          );
        })}
      </View>

      {selected !== null ? (
        <ButtonPrimary
          label={isLast ? 'Voir le score' : 'Suivant'}
          icon={isLast ? undefined : 'chevronRight'}
          onPress={next}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: Spacing.three },
  head: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  prompt: { minHeight: 180, padding: Spacing.four, alignItems: 'center', justifyContent: 'center', gap: Spacing.two },
  level: { position: 'absolute', top: Spacing.two, right: Spacing.two, borderWidth: Border.base, paddingVertical: 3, paddingHorizontal: Spacing.two },
  center: { textAlign: 'center' },
  options: { gap: Spacing.two },
  option: { borderWidth: Border.base, paddingVertical: Spacing.three, paddingHorizontal: Spacing.three },
});
