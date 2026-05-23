import { type ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme } from '@/theme/theme-context';
import { Border, Shadow } from '@/theme/tokens';

type Props = {
  children: ReactNode;
  /** Hard-shadow offset in px (no blur). Defaults to md (4). */
  offset?: number;
  /** Foreground surface color. Defaults to theme paper. */
  background?: string;
  /** Shadow + border color. Defaults to theme ink. */
  ink?: string;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
};

/**
 * Brutalist hard-shadow container. RN cannot render `box-shadow: 4px 4px 0`
 * (offset, zero blur), so a solid ink View is stacked behind the surface and
 * revealed at the bottom-right by `offset`. Sharp corners (no radius) by design.
 */
export function HardShadowBox({ children, offset = Shadow.md, background, ink, style, contentStyle }: Props) {
  const { colors } = useTheme();
  const shadowColor = ink ?? colors.ink;
  const surfaceColor = background ?? colors.paper;

  return (
    <View style={style}>
      <View
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: shadowColor, transform: [{ translateX: offset }, { translateY: offset }] },
        ]}
      />
      <View style={[{ backgroundColor: surfaceColor, borderColor: shadowColor, borderWidth: Border.base }, contentStyle]}>
        {children}
      </View>
    </View>
  );
}
