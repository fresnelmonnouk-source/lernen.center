import { StyleSheet, View } from 'react-native';

import { HardShadowBox } from '@/components/ui/HardShadowBox';
import { Icon } from '@/components/ui/Icon';
import { Txt } from '@/components/ui/Txt';
import { useTheme } from '@/theme/theme-context';
import { Accent, Border, Shadow, Spacing } from '@/theme/tokens';
import type { CertLesenResponse, LesenQuestion } from '@/lib/api';
import type { LesenAnswerMap } from '@/certification/LesenRunner';

type Props = {
  test: CertLesenResponse['test'];
  answers: LesenAnswerMap;
};

type Stats = { correct: number; total: number; percentage: number; passed: boolean };

function computeStats(test: CertLesenResponse['test'], answers: LesenAnswerMap): Stats {
  const total = test.questions.length;
  const correct = test.questions.reduce(
    (acc, q) => acc + (answers[q.id] === q.correct_index ? 1 : 0),
    0,
  );
  const percentage = total === 0 ? 0 : Math.round((correct / total) * 100);
  return { correct, total, percentage, passed: percentage >= test.passing_score_percentage };
}

/**
 * Bilan d'un test Lesen — corrigé localement. Le backend renvoie déjà
 * `correct_index` et `explanation` pour chaque question (cf. cert-lesen.js).
 */
export function LesenResults({ test, answers }: Props) {
  const stats = computeStats(test, answers);
  const accent = stats.passed ? Accent.green : Accent.red;

  return (
    <View style={styles.wrap}>
      <HardShadowBox background={accent} offset={Shadow.lg} contentStyle={styles.scoreCard}>
        <Txt font="display" size={52} color="#FFFFFF" tracking={-1}>
          {stats.percentage}%
        </Txt>
        <Txt font="monoBold" size={13} color="#FFFFFF" uppercase tracking={1.2}>
          {stats.correct}/{stats.total} bonnes réponses
        </Txt>
        <Txt font="serifItalic" size={16} color="#FFFFFF">
          {stats.passed ? 'Admis' : 'Non admis'} · seuil {test.passing_score_percentage}%
        </Txt>
      </HardShadowBox>

      <View style={styles.list}>
        {test.questions.map((q, i) => (
          <QuestionReview key={q.id} index={i} q={q} userAnswer={answers[q.id]} />
        ))}
      </View>
    </View>
  );
}

function QuestionReview({
  index,
  q,
  userAnswer,
}: {
  index: number;
  q: LesenQuestion;
  userAnswer: number | undefined;
}) {
  const { colors } = useTheme();
  const isCorrect = userAnswer === q.correct_index;
  const accent = isCorrect ? Accent.green : Accent.red;
  const userLabel = userAnswer != null ? q.options[userAnswer] : '—';
  const correctLabel = q.options[q.correct_index];

  return (
    <HardShadowBox background={colors.cream2} offset={Shadow.sm} contentStyle={styles.qCard}>
      <View style={styles.qHead}>
        <View style={[styles.badge, { backgroundColor: accent, borderColor: colors.ink }]}>
          <Icon name={isCorrect ? 'check' : 'x'} size="sm" color="#FFFFFF" />
          <Txt font="monoBold" size={11} color="#FFFFFF" uppercase tracking={0.5}>
            Q{index + 1}
          </Txt>
        </View>
        <Txt font="bold" size={14} lineHeight={20} style={styles.qPrompt}>
          {q.question_text}
        </Txt>
      </View>

      <View style={styles.row}>
        <Txt font="monoBold" size={10} tone="ink2" uppercase tracking={1.2}>
          Ta réponse
        </Txt>
        <Txt font="body" size={13} color={isCorrect ? Accent.green : Accent.red}>
          {userLabel}
        </Txt>
      </View>

      {!isCorrect ? (
        <View style={styles.row}>
          <Txt font="monoBold" size={10} tone="ink2" uppercase tracking={1.2}>
            Réponse attendue
          </Txt>
          <Txt font="body" size={13} color={Accent.green}>
            {correctLabel}
          </Txt>
        </View>
      ) : null}

      {q.explanation ? (
        <View style={styles.row}>
          <Txt font="monoBold" size={10} tone="ink2" uppercase tracking={1.2}>
            Explication
          </Txt>
          <Txt font="body" size={13} lineHeight={18}>
            {q.explanation}
          </Txt>
        </View>
      ) : null}
    </HardShadowBox>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: Spacing.three },
  scoreCard: { padding: Spacing.four, alignItems: 'center', gap: Spacing.two },
  list: { gap: Spacing.two },
  qCard: { padding: Spacing.three, gap: Spacing.two },
  qHead: { flexDirection: 'row', gap: Spacing.two, alignItems: 'flex-start' },
  qPrompt: { flex: 1 },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 4, borderWidth: Border.thin, paddingHorizontal: Spacing.two, paddingVertical: 3 },
  row: { gap: 2 },
});
