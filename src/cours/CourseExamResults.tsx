import { StyleSheet, View } from 'react-native';

import { HardShadowBox } from '@/components/ui/HardShadowBox';
import { Icon, type IconName } from '@/components/ui/Icon';
import { Txt } from '@/components/ui/Txt';
import { useTheme } from '@/theme/theme-context';
import { Accent, Border, Shadow, Spacing } from '@/theme/tokens';
import type { CourseExamResult, GradeCourseExamResponse } from '@/lib/api';

/** Marqueur de verdict par question : check correct · partiel · x faux. */
function mark(r: CourseExamResult): { icon: IconName; color: string } {
  if (r.is_correct) return { icon: 'check', color: Accent.green };
  if (r.verdict === 'partial') return { icon: 'partial', color: Accent.yellowDark };
  return { icon: 'x', color: Accent.red };
}

/** Bilan du mini-examen de cours (grade-course-exam). */
export function CourseExamResults({ data }: { data: GradeCourseExamResponse }) {
  const { colors } = useTheme();
  const { score, summary } = data;
  const accent = score.percentage >= 60 ? Accent.green : Accent.red;

  return (
    <View style={styles.wrap}>
      <HardShadowBox background={accent} offset={Shadow.lg} contentStyle={styles.scoreCard}>
        <Icon name="award" size={30} color="#FFFFFF" />
        <Txt font="display" size={46} color="#FFFFFF" tracking={-1}>
          {score.percentage}%
        </Txt>
        <Txt font="monoBold" size={13} color="#FFFFFF" uppercase tracking={1.2}>
          {score.mention} · {score.correct}/{score.total}
        </Txt>
      </HardShadowBox>

      <HardShadowBox background={colors.cream2} offset={Shadow.sm} contentStyle={styles.summary}>
        <Txt font="monoBold" size={11} color={Accent.blue} uppercase tracking={1.2}>
          {summary.verdict}
        </Txt>
        <Txt font="body" size={14} lineHeight={20}>
          {summary.feedback}
        </Txt>
        <View style={styles.nextRow}>
          <Icon name="arrowRight" size="sm" color={colors.ink2} />
          <Txt font="body" size={13} lineHeight={19} tone="ink2" style={styles.flex}>
            {summary.next_action}
          </Txt>
        </View>
      </HardShadowBox>

      {data.results.map((r) => {
        const m = mark(r);
        return (
          <View key={r.question_id} style={[styles.q, { borderColor: colors.ink }]}>
            <View style={styles.qHead}>
              <Icon name={m.icon} size="sm" color={m.color} />
              <Txt font="monoBold" size={12} color={m.color} uppercase tracking={0.8}>
                Question {r.question_id}
              </Txt>
            </View>
            <Txt font="body" size={13} lineHeight={18}>
              {r.question}
            </Txt>
            {!r.is_correct ? (
              <View style={styles.answerRow}>
                <Icon name="arrowRight" size="sm" color={Accent.green} />
                <Txt font="mono" size={12} color={Accent.green} style={styles.flex}>
                  {r.correct_answer}
                </Txt>
              </View>
            ) : null}
            {r.feedback ? (
              <Txt font="body" size={12} tone="ink2" lineHeight={17}>
                {r.feedback}
              </Txt>
            ) : null}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: Spacing.three },
  scoreCard: { padding: Spacing.four, alignItems: 'center', gap: Spacing.two },
  summary: { padding: Spacing.three, gap: Spacing.two },
  nextRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.one },
  q: { borderWidth: Border.base, padding: Spacing.three, gap: Spacing.one },
  qHead: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one },
  answerRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.one },
  flex: { flex: 1 },
});
