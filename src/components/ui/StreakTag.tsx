import { StyleSheet, View } from 'react-native';

import { Txt } from '@/components/ui/Txt';
import { useTheme } from '@/theme/theme-context';
import { Accent, Border, Shadow, Spacing } from '@/theme/tokens';

/** Yellow streak chip, rotated -2° (signature). E.g. 🔥 5j. */
export function StreakTag({ days }: { days: number }) {
  const { colors } = useTheme();
  return (
    <View style={styles.wrap}>
      <View style={[styles.shadow, { backgroundColor: colors.ink }]} />
      <View style={[styles.tag, { backgroundColor: Accent.yellow, borderColor: colors.ink }]}>
        <Txt font="monoBold" size={12} color="#0A0A0A">
          🔥 {days}j
        </Txt>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    transform: [{ rotate: '-2deg' }],
  },
  shadow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    transform: [{ translateX: Shadow.sm }, { translateY: Shadow.sm }],
  },
  tag: {
    paddingVertical: 7,
    paddingHorizontal: Spacing.three,
    borderWidth: Border.base,
  },
});
