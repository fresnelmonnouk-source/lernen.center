import { StyleSheet, View } from 'react-native';

import { HardShadowBox } from '@/components/ui/HardShadowBox';
import { Txt } from '@/components/ui/Txt';
import { useTheme } from '@/theme/theme-context';
import { Accent, Border, Shadow, Spacing } from '@/theme/tokens';
import type { GradeTestResponse } from '@/lib/api';

function InsightList({ title, items, color }: { title: string; items: string[]; color: string }) {
  const { colors } = useTheme();
  if (items.length === 0) return null;
  return (
    <View style={styles.insight}>
      <Txt font="monoBold" size={11} color={color} uppercase tracking={1.2}>
        {title}
      </Txt>
      {items.map((it, i) => (
        <View key={i} style={styles.bulletRow}>
          <View style={[styles.bullet, { backgroundColor: color, borderColor: colors.ink }]} />
          <Txt font="body" size={14} lineHeight={20} style={styles.bulletTxt}>
            {it}
          </Txt>
        </View>
      ))}
    </View>
  );
}

/** Bilan d'un examen IA corrigé par grade-test. */
export function TestResults({ data }: { data: GradeTestResponse }) {
  const { colors } = useTheme();
  const { score } = data;
  const accent = score.percentage >= 60 ? Accent.green : Accent.red;

  return (
    <View style={styles.wrap}>
      <HardShadowBox background={accent} offset={Shadow.lg} contentStyle={styles.scoreCard}>
        <Txt font="display" size={52} color="#FFFFFF" tracking={-1}>
          {score.percentage}%
        </Txt>
        <Txt font="monoBold" size={13} color="#FFFFFF" uppercase tracking={1.2}>
          Note {score.grade} · {score.correct}/{score.total}
        </Txt>
      </HardShadowBox>

      <HardShadowBox background={colors.cream2} offset={Shadow.sm} contentStyle={styles.feedback}>
        <Txt font="body" size={14} lineHeight={20}>
          {data.overall_feedback}
        </Txt>
      </HardShadowBox>

      <InsightList title="Points forts" items={data.strengths} color={Accent.green} />
      <InsightList title="À améliorer" items={data.weaknesses} color={Accent.red} />
      <InsightList title="Recommandations" items={data.recommendations} color={Accent.blue} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: Spacing.three },
  scoreCard: { padding: Spacing.four, alignItems: 'center', gap: Spacing.two },
  feedback: { padding: Spacing.three },
  insight: { gap: Spacing.two },
  bulletRow: { flexDirection: 'row', gap: Spacing.two, alignItems: 'flex-start' },
  bullet: { width: 10, height: 10, borderWidth: Border.thin, marginTop: 5 },
  bulletTxt: { flex: 1 },
});
