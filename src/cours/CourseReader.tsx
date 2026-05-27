import { StyleSheet, View } from 'react-native';

import { HardShadowBox } from '@/components/ui/HardShadowBox';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Txt } from '@/components/ui/Txt';
import { useTheme } from '@/theme/theme-context';
import { Accent, Border, LevelColor, Shadow, Spacing } from '@/theme/tokens';
import type { Course, CourseExample } from '@/lib/api';

function Example({ ex }: { ex: CourseExample }) {
  const { colors } = useTheme();
  return (
    <HardShadowBox background={colors.cream2} offset={Shadow.sm} contentStyle={styles.ex}>
      <Txt font="bold" size={15} color={Accent.blue}>
        {ex.german}
      </Txt>
      <Txt font="serifItalic" size={14} tone="ink2">
        {ex.french}
      </Txt>
      <Txt font="body" size={12} lineHeight={18}>
        {ex.commentary}
      </Txt>
    </HardShadowBox>
  );
}

/** Affiche un cours généré : en-tête, intro, sections (exemples + erreurs), points clés. */
export function CourseReader({ course }: { course: Course }) {
  const { colors } = useTheme();
  return (
    <View style={styles.wrap}>
      <View style={styles.headRow}>
        <View style={[styles.level, { backgroundColor: LevelColor[course.level], borderColor: colors.ink }]}>
          <Txt font="monoBold" size={11} color="#0A0A0A" tracking={0.8}>
            {course.level}
          </Txt>
        </View>
        <Txt font="mono" size={10} tone="ink2" uppercase tracking={1}>
          {course.estimated_duration_minutes} min
        </Txt>
      </View>
      <Txt font="display" size={26} tracking={-0.6} lineHeight={30}>
        {course.title}
      </Txt>

      <HardShadowBox background={colors.cream2} contentStyle={styles.intro}>
        <Txt font="body" size={14} lineHeight={20}>
          {course.introduction.objective}
        </Txt>
        <Txt font="mono" size={11} tone="ink2">
          Prérequis : {course.introduction.prerequisites}
        </Txt>
        <Txt font="body" size={13} lineHeight={19} tone="ink2">
          {course.introduction.why_important}
        </Txt>
      </HardShadowBox>

      {course.sections.map((s) => (
        <View key={s.section_number} style={styles.section}>
          <SectionHeader title={`${s.section_number}. ${s.title}`} />
          <Txt font="body" size={14} lineHeight={21}>
            {s.explanation}
          </Txt>
          {s.examples.map((ex, i) => (
            <Example key={i} ex={ex} />
          ))}
          {s.common_mistakes.map((m, i) => (
            <View key={i} style={styles.mistake}>
              <Txt font="monoBold" size={13} color={Accent.red}>
                ⚠
              </Txt>
              <Txt font="body" size={13} lineHeight={19} style={styles.flex}>
                {m}
              </Txt>
            </View>
          ))}
        </View>
      ))}

      <HardShadowBox background={Accent.yellow} contentStyle={styles.keys}>
        <Txt font="monoBold" size={11} color="#0A0A0A" uppercase tracking={1.2}>
          À retenir
        </Txt>
        {course.key_points.map((k, i) => (
          <Txt key={i} font="medium" size={14} color="#0A0A0A" lineHeight={20}>
            • {k}
          </Txt>
        ))}
      </HardShadowBox>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: Spacing.three },
  headRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  level: { borderWidth: Border.base, paddingVertical: 3, paddingHorizontal: Spacing.two },
  intro: { padding: Spacing.three, gap: Spacing.two },
  section: { gap: Spacing.two },
  ex: { padding: Spacing.three, gap: Spacing.one },
  mistake: { flexDirection: 'row', gap: Spacing.two, alignItems: 'flex-start' },
  flex: { flex: 1 },
  keys: { padding: Spacing.three, gap: Spacing.two },
});
