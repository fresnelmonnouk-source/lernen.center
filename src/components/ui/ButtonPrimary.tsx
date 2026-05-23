import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Txt } from '@/components/ui/Txt';
import { useTheme } from '@/theme/theme-context';
import { Border, Shadow, Spacing } from '@/theme/tokens';

type Props = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  /** Surface color. Defaults to theme ink. */
  color?: string;
  /** Label color. Defaults to theme cream. */
  textColor?: string;
};

/** Full-width brutalist primary button (`.btn-primary`). */
export function ButtonPrimary({ label, onPress, disabled, color, textColor }: Props) {
  const { colors } = useTheme();
  const [pressed, setPressed] = useState(false);
  const offset = Shadow.md;
  const bg = color ?? colors.ink;
  const fg = textColor ?? colors.cream;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={[styles.root, disabled && styles.disabled]}>
      <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.ink, transform: [{ translateX: offset }, { translateY: offset }] }]} />
      <View
        style={[
          styles.face,
          { backgroundColor: bg, borderColor: colors.ink },
          pressed && !disabled && { transform: [{ translateX: offset - 1 }, { translateY: offset - 1 }] },
        ]}>
        <Txt font="display" size={14} color={fg} uppercase tracking={0.6}>
          {label}
        </Txt>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    alignSelf: 'stretch',
  },
  disabled: {
    opacity: 0.4,
  },
  face: {
    borderWidth: Border.base,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
