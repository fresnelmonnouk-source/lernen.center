import { useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { useTheme } from '@/theme/theme-context';
import { Border, Shadow } from '@/theme/tokens';

type Props = {
  onPress: () => void;
  children: ReactNode;
  accessibilityLabel: string;
};

/** Square 38px paper button with hard shadow + brutalist press (`.icon-btn`). */
export function IconButton({ onPress, children, accessibilityLabel }: Props) {
  const { colors } = useTheme();
  const [pressed, setPressed] = useState(false);
  const offset = Shadow.sm;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={styles.root}>
      <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.ink, transform: [{ translateX: offset }, { translateY: offset }] }]} />
      <View
        style={[
          styles.face,
          { backgroundColor: colors.paper, borderColor: colors.ink },
          pressed && { transform: [{ translateX: offset }, { translateY: offset }] },
        ]}>
        {children}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    width: 38,
    height: 38,
  },
  face: {
    width: 38,
    height: 38,
    borderWidth: Border.base,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
