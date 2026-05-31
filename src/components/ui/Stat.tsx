import { StyleSheet, View } from 'react-native';

import { Txt } from '@/components/ui/Txt';
import { useTheme } from '@/theme/theme-context';
import { Accent, Border, Shadow, Spacing } from '@/theme/tokens';

export type StatData = {
  value: string | number;
  label: string;
  /** Accent fill. Omit for paper surface. */
  accent?: 'red' | 'yellow' | 'blue';
};

const ACCENT_BG = { red: Accent.red, yellow: Accent.yellow, blue: Accent.blue };

function Stat({ value, label, accent }: StatData) {
  const { colors } = useTheme();
  const bg = accent ? ACCENT_BG[accent] : colors.paper;
  // Hardcodes volontaires : les accents sont des couleurs fixes indépendantes du thème.
  // Sur yellow → toujours noir absolu (contraste). Sur red/blue → toujours blanc.
  // Sur paper → suit le thème (ink dynamique).
  const fg = !accent ? colors.ink : accent === 'yellow' ? '#0A0A0A' : '#FFFFFF';

  return (
    <View style={styles.wrap}>
      <View style={[styles.shadow, { backgroundColor: colors.ink }]} />
      <View style={[styles.stat, { backgroundColor: bg, borderColor: colors.ink }]}>
        <Txt font="display" size={32} color={fg} tracking={-1.2} lineHeight={32}>
          {value}
        </Txt>
        <Txt font="monoBold" size={9} color={fg} uppercase tracking={1.2} style={styles.label}>
          {label}
        </Txt>
      </View>
    </View>
  );
}

/** Row of three stat tiles (`.stat-grid`). */
export function StatGrid({ stats }: { stats: [StatData, StatData, StatData] }) {
  return (
    <View style={styles.grid}>
      {stats.map((s) => (
        <View key={s.label} style={styles.cell}>
          <Stat {...s} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    gap: 10,
  },
  cell: {
    flex: 1,
  },
  wrap: {
    position: 'relative',
    flex: 1,
  },
  shadow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    transform: [{ translateX: Shadow.sm }, { translateY: Shadow.sm }],
  },
  stat: {
    borderWidth: Border.base,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.two,
  },
  label: {
    marginTop: 6,
    opacity: 0.85,
  },
});
