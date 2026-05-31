import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { Txt } from '@/components/ui/Txt';
import { useTheme } from '@/theme/theme-context';
import { Border, Shadow, Spacing } from '@/theme/tokens';

type Props = {
  label: string;
  /** Smaller line under the label (e.g. a French gloss). */
  sublabel?: string;
  selected: boolean;
  onPress: () => void;
  /** Fill color when selected. Defaults to theme ink. */
  color?: string;
  /** Stretch to fill the parent (for segmented rows). Default: content width. */
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
};

/**
 * Brutalist selectable chip. Raised (hard shadow) + filled when selected, flat
 * paper otherwise. Reused for tense pickers, mode toggles and future filters.
 */
export function Chip({ label, sublabel, selected, onPress, color, fullWidth, style }: Props) {
  const { colors } = useTheme();
  const fill = color ?? colors.ink;
  const fg = selected ? colors.cream : colors.ink;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={`${label}${selected ? ', sélectionné' : ''}`}
      onPress={onPress}
      hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
      style={[fullWidth && styles.full, style]}>
      {selected ? (
        <View
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: colors.ink, transform: [{ translateX: Shadow.sm }, { translateY: Shadow.sm }] },
          ]}
        />
      ) : null}
      <View style={[styles.face, { backgroundColor: selected ? fill : colors.paper, borderColor: colors.ink }]}>
        <Txt font="monoBold" size={12} color={fg} uppercase tracking={0.5} style={styles.center}>
          {label}
        </Txt>
        {sublabel ? (
          <Txt font="body" size={10} color={fg} style={[styles.center, styles.sub]}>
            {sublabel}
          </Txt>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  full: { flex: 1 },
  face: {
    borderWidth: Border.base,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1,
  },
  center: { textAlign: 'center' },
  sub: { opacity: 0.85 },
});
