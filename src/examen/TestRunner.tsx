import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ButtonPrimary } from '@/components/ui/ButtonPrimary';
import { HardShadowBox } from '@/components/ui/HardShadowBox';
import { Input } from '@/components/ui/Input';
import { Txt } from '@/components/ui/Txt';
import { useTheme } from '@/theme/theme-context';
import { Accent, Border, Spacing } from '@/theme/tokens';
import type { TestAnswer, TestQuestion } from '@/lib/api';

type Props = { questions: TestQuestion[]; submitting: boolean; onSubmit: (answers: TestAnswer[]) => void };

type AnswerMap = Record<number, number | string>;

function isAnswered(q: TestQuestion, answers: AnswerMap): boolean {
  const a = answers[q.id];
  if (q.type === 'mcq') return typeof a === 'number';
  return typeof a === 'string' && a.trim().length > 0;
}

/** Déroule un examen IA : QCM (sélection) ou question ouverte (saisie). Aucune
 *  correction locale — les réponses sont collectées puis envoyées à grade-test. */
export function TestRunner({ questions, submitting, onSubmit }: Props) {
  const { colors } = useTheme();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});

  const q = questions[index];
  const isLast = index === questions.length - 1;
  const answeredCount = questions.filter((qq) => isAnswered(qq, answers)).length;
  const allAnswered = answeredCount === questions.length;

  const setAnswer = (value: number | string) => setAnswers((prev) => ({ ...prev, [q.id]: value }));

  const submit = () =>
    onSubmit(questions.map((qq) => ({ questionId: qq.id, answer: answers[qq.id] })));

  return (
    <View style={styles.wrap}>
      <View style={styles.head}>
        <Txt font="monoBold" size={11} tone="ink2" uppercase tracking={1.2}>
          Question {index + 1} / {questions.length}
        </Txt>
        <Txt font="monoBold" size={11} color={Accent.purple} uppercase tracking={1.2}>
          {answeredCount}/{questions.length} répondu
        </Txt>
      </View>

      <HardShadowBox contentStyle={styles.prompt}>
        <Txt font="bold" size={18} lineHeight={24}>
          {q.question}
        </Txt>
      </HardShadowBox>

      {q.type === 'mcq' ? (
        <View style={styles.options}>
          {q.options.map((opt, i) => {
            const selected = answers[q.id] === i;
            return (
              <Pressable
                key={i}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => setAnswer(i)}
                style={[
                  styles.option,
                  { backgroundColor: selected ? Accent.purple : colors.paper, borderColor: colors.ink },
                ]}>
                <Txt font="medium" size={15} color={selected ? '#FFFFFF' : colors.ink}>
                  {opt}
                </Txt>
              </Pressable>
            );
          })}
        </View>
      ) : (
        <Input
          label="Ta réponse"
          value={(answers[q.id] as string) ?? ''}
          onChangeText={setAnswer}
          placeholder="Écris ta réponse…"
          autoCapitalize="none"
          multiline
        />
      )}

      <View style={styles.nav}>
        <View style={styles.navBtn}>
          <ButtonPrimary label="Préc." icon="chevronLeft" iconPosition="left" onPress={() => setIndex((n) => n - 1)} disabled={index === 0} />
        </View>
        <View style={styles.navBtn}>
          <ButtonPrimary label="Suiv." icon="chevronRight" iconPosition="right" onPress={() => setIndex((n) => n + 1)} disabled={isLast} />
        </View>
      </View>

      <ButtonPrimary
        label="Terminer & corriger"
        onPress={submit}
        loading={submitting}
        disabled={!allAnswered}
        color={Accent.green}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: Spacing.three },
  head: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  prompt: { padding: Spacing.three },
  options: { gap: Spacing.two },
  option: { borderWidth: Border.base, paddingVertical: Spacing.three, paddingHorizontal: Spacing.three },
  nav: { flexDirection: 'row', gap: Spacing.two },
  navBtn: { flex: 1 },
});
