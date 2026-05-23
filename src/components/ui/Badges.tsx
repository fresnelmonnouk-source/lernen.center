import { StyleSheet, View } from 'react-native';

import { HardShadowBox } from '@/components/ui/HardShadowBox';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Txt } from '@/components/ui/Txt';
import { useTheme } from '@/theme/theme-context';
import { Accent, Border, Shadow, Spacing } from '@/theme/tokens';

export type BadgeData = { icon: string; earned?: boolean };

// Earned badges cycle through accent fills (mirrors the CSS nth-child rules).
const EARNED_CYCLE = [Accent.yellow, Accent.red, Accent.blue, Accent.green];

function Badge({ icon, earned, index }: BadgeData & { index: number }) {
  const { colors } = useTheme();
  if (!earned) {
    return (
      <View style={[styles.badge, { backgroundColor: colors.cream2, borderColor: colors.ink, opacity: 0.35 }]}>
        <Txt size={22} style={styles.grayed}>
          {icon}
        </Txt>
      </View>
    );
  }
  const fill = EARNED_CYCLE[index % EARNED_CYCLE.length];
  return (
    <View style={styles.badgeWrap}>
      <View style={[styles.badgeShadow, { backgroundColor: colors.ink }]} />
      <View style={[styles.badge, { backgroundColor: fill, borderColor: colors.ink }]}>
        <Txt size={22}>{icon}</Txt>
      </View>
    </View>
  );
}

/** Achievements panel: 6-per-row grid of earned/locked badges (`.badges`). */
export function BadgesGrid({ badges, count }: { badges: BadgeData[]; count?: string }) {
  return (
    <HardShadowBox contentStyle={styles.panel}>
      <View style={styles.head}>
        <SectionHeader title="Badges" count={count ?? `${badges.filter((b) => b.earned).length}/${badges.length}`} />
      </View>
      <View style={styles.grid}>
        {badges.map((b, i) => (
          <View key={i} style={styles.cell}>
            <Badge {...b} index={i} />
          </View>
        ))}
      </View>
    </HardShadowBox>
  );
}

const styles = StyleSheet.create({
  panel: {
    padding: Spacing.three,
    gap: Spacing.three,
  },
  head: {
    marginBottom: Spacing.one,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -Spacing.one,
  },
  cell: {
    // Exactly 6 per row; the 4px padding forms the inter-badge gutter.
    width: '16.6667%',
    aspectRatio: 1,
    padding: Spacing.one,
  },
  badgeWrap: {
    flex: 1,
    position: 'relative',
  },
  badgeShadow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    transform: [{ translateX: Shadow.sm }, { translateY: Shadow.sm }],
  },
  badge: {
    flex: 1,
    borderWidth: Border.base,
    alignItems: 'center',
    justifyContent: 'center',
  },
  grayed: {
    opacity: 0.6,
  },
});
