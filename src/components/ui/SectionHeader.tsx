import { StyleSheet, View } from 'react-native';

import { Txt } from '@/components/ui/Txt';
import { useTheme } from '@/theme/theme-context';
import { Accent, Spacing } from '@/theme/tokens';

type Props = {
  title: string;
  /** Serif-italic red accent appended to the title. */
  accent?: string;
  /** Optional count badge (ink chip, cream text). */
  count?: string | number;
};

/** Section header (`.section-head`): uppercase title + red serif accent + count chip. */
export function SectionHeader({ title, accent, count }: Props) {
  const { colors } = useTheme();
  return (
    <View style={styles.row}>
      <Txt font="display" size={26} uppercase tracking={-0.8} lineHeight={26} style={styles.title}>
        {title}
        {accent ? (
          <Txt font="serifItalic" size={26} color={Accent.red} style={styles.accent}>
            {' '}
            {accent}
          </Txt>
        ) : null}
      </Txt>
      {count != null ? (
        <View style={[styles.count, { backgroundColor: colors.ink }]}>
          <Txt font="monoBold" size={11} color={colors.cream} uppercase tracking={0.8}>
            {count}
          </Txt>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  title: {
    flexShrink: 1,
  },
  accent: {
    textTransform: 'none',
  },
  count: {
    paddingVertical: 4,
    paddingHorizontal: Spacing.two,
  },
});
