import { View } from 'react-native';

import { useTheme } from '@/theme/theme-context';

/**
 * Brutalist list bullet: a small filled SQUARE (no radius), never a round dot —
 * the icon system bans circles for chrome (see docs/visual-brand.md §9). Decorative:
 * hidden from the a11y tree (the list text carries the meaning).
 */
export function Bullet({ color, size = 6 }: { color?: string; size?: number }) {
  const { colors } = useTheme();
  return (
    <View
      style={{ width: size, height: size, backgroundColor: color ?? colors.ink }}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    />
  );
}
