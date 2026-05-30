import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ButtonPrimary } from '@/components/ui/ButtonPrimary';
import { HardShadowBox } from '@/components/ui/HardShadowBox';
import { Txt } from '@/components/ui/Txt';
import { useTheme } from '@/theme/theme-context';
import { Accent, Border, Shadow, Spacing } from '@/theme/tokens';
import type { CertLesenResponse, LesenQuestion, LesenText } from '@/lib/api';

export type LesenAnswerMap = Record<number, number>;

type Props = {
  test: CertLesenResponse['test'];
  submitting: boolean;
  /** Appelée avec la map question_id → index choisi. Grading local côté écran. */
  onSubmit: (answers: LesenAnswerMap) => void;
};

/**
 * Déroule un test Lesen : lecture des textes (toujours visibles, repliables)
 * puis QCM séquentiel. Aucune correction réseau — chaque question contient
 * déjà son `correct_index` et son `explanation` (cf. cert-lesen.js).
 */
export function LesenRunner({ test, submitting, onSubmit }: Props) {
  const { colors } = useTheme();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<LesenAnswerMap>({});
  const [expandedTextId, setExpandedTextId] = useState<string | null>(test.texts[0]?.id ?? null);

  const q = test.questions[index];
  const isLast = index === test.questions.length - 1;
  const answeredCount = test.questions.filter((qq) => answers[qq.id] != null).length;
  const allAnswered = answeredCount === test.questions.length;

  const setAnswer = (optionIndex: number) =>
    setAnswers((prev) => ({ ...prev, [q.id]: optionIndex }));

  return (
    <View style={styles.wrap}>
      <View style={styles.texts}>
        {test.texts.map((t) => (
          <TextCard
            key={t.id}
            text={t}
            expanded={expandedTextId === t.id}
            onToggle={() => setExpandedTextId((cur) => (cur === t.id ? null : t.id))}
          />
        ))}
      </View>

      <View style={styles.head}>
        <Txt font="monoBold" size={11} tone="ink2" uppercase tracking={1.2}>
          Question {index + 1} / {test.questions.length}
        </Txt>
        <Txt font="monoBold" size={11} color={Accent.blue} uppercase tracking={1.2}>
          {answeredCount}/{test.questions.length} répondu
        </Txt>
      </View>

      <HardShadowBox contentStyle={styles.prompt}>
        <Txt font="bold" size={18} lineHeight={24}>
          {q.question_text}
        </Txt>
      </HardShadowBox>

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
                { backgroundColor: selected ? Accent.blue : colors.paper, borderColor: colors.ink },
              ]}>
              <Txt font="medium" size={15} color={selected ? '#FFFFFF' : colors.ink}>
                {formatOptionLabel(q, i)}
              </Txt>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.nav}>
        <View style={styles.navBtn}>
          <ButtonPrimary label="‹ Préc." onPress={() => setIndex((n) => n - 1)} disabled={index === 0} />
        </View>
        <View style={styles.navBtn}>
          <ButtonPrimary label="Suiv. ›" onPress={() => setIndex((n) => n + 1)} disabled={isLast} />
        </View>
      </View>

      <ButtonPrimary
        label="Terminer & corriger"
        onPress={() => onSubmit(answers)}
        loading={submitting}
        disabled={!allAnswered}
        color={Accent.green}
      />
    </View>
  );
}

function TextCard({
  text,
  expanded,
  onToggle,
}: {
  text: LesenText;
  expanded: boolean;
  onToggle: () => void;
}) {
  const { colors } = useTheme();
  return (
    <HardShadowBox background={colors.cream2} offset={Shadow.sm} contentStyle={styles.textCard}>
      <Pressable accessibilityRole="button" onPress={onToggle} style={styles.textHead}>
        <Txt font="monoBold" size={11} tone="ink2" uppercase tracking={1.2} style={styles.textTitle}>
          {text.title}
        </Txt>
        <Txt font="monoBold" size={14} tone="ink2">
          {expanded ? '−' : '+'}
        </Txt>
      </Pressable>
      {expanded ? (
        <Txt font="body" size={14} lineHeight={22} style={styles.textBody}>
          {text.content}
        </Txt>
      ) : null}
    </HardShadowBox>
  );
}

/** Préfixe « A. / B. / … » pour les MCQ longs ; verbatim pour true_false / three_way. */
function formatOptionLabel(q: LesenQuestion, i: number): string {
  if (q.type === 'true_false' || q.type === 'three_way') return q.options[i];
  const prefix = String.fromCharCode(65 + i);
  return `${prefix}.  ${q.options[i]}`;
}

const styles = StyleSheet.create({
  wrap: { gap: Spacing.three },
  texts: { gap: Spacing.two },
  textCard: { padding: Spacing.three, gap: Spacing.two },
  textHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  textTitle: { flex: 1, paddingRight: Spacing.two },
  textBody: { marginTop: Spacing.one },
  head: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  prompt: { padding: Spacing.three },
  options: { gap: Spacing.two },
  option: { borderWidth: Border.base, paddingVertical: Spacing.three, paddingHorizontal: Spacing.three },
  nav: { flexDirection: 'row', gap: Spacing.two },
  navBtn: { flex: 1 },
});
