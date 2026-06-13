import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { Icon, type IconName } from '@/components/ui/Icon';
import { Txt } from '@/components/ui/Txt';
import { useTheme } from '@/theme/theme-context';
import { Border, Shadow, Spacing } from '@/theme/tokens';

type Props = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  /** Shows a spinner and blocks presses. */
  loading?: boolean;
  /** Surface color. Defaults to theme ink. */
  color?: string;
  /** Label color. Defaults to theme cream. */
  textColor?: string;
  /** Optional leading/trailing icon (same color as the label). */
  icon?: IconName;
  iconPosition?: 'left' | 'right';
};

/** Full-width brutalist primary button (`.btn-primary`). */
export function ButtonPrimary({ label, onPress, disabled, loading, color, textColor, icon, iconPosition = 'right' }: Props) {
  const { colors } = useTheme();
  const [pressed, setPressed] = useState(false);
  const offset = Shadow.md;
  const isDisabled = disabled || loading;
  const bg = color ?? colors.ink;
  const fg = textColor ?? colors.cream;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={[styles.root, isDisabled && styles.disabled]}>
      <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.ink, transform: [{ translateX: offset }, { translateY: offset }] }]} />
      <View
        style={[
          styles.face,
          { backgroundColor: bg, borderColor: colors.ink },
          pressed && !isDisabled && { transform: [{ translateX: offset - 1 }, { translateY: offset - 1 }] },
        ]}>
        {loading ? (
          <ActivityIndicator color={fg} />
        ) : (
          <View style={styles.content}>
            {icon && iconPosition === 'left' ? <Icon name={icon} size="sm" color={fg} /> : null}
            <Txt font="display" size={14} color={fg} uppercase tracking={0.6}>
              {label}
            </Txt>
            {icon && iconPosition === 'right' ? <Icon name={icon} size="sm" color={fg} /> : null}
          </View>
        )}
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
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
});

