import { type ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { Border, Palette, Radius, ShadowOffset } from '@/theme/bauhaus';

type Props = {
  children: ReactNode;
  /** Offset of the hard shadow in px (no blur). Defaults to md (4). */
  offset?: number;
  /** Background of the foreground surface. Defaults to paper white. */
  background?: string;
  /** Shadow + border color. Defaults to ink. */
  ink?: string;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
};

/**
 * Brutalist "hard shadow" container.
 *
 * React Native cannot render `box-shadow: 4px 4px 0 #000` (offset, zero blur)
 * with the native shadow/elevation props, so we stack a solid ink View behind
 * the surface and shift the surface up-left by `offset` px. This reproduces the
 * crisp Néo-Bauhaus shadow from the reference design exactly.
 */
export function HardShadowBox({
  children,
  offset = ShadowOffset.md,
  background = Palette.paper,
  ink = Palette.ink,
  style,
  contentStyle,
}: Props) {
  return (
    <View style={style}>
      {/* Solid shadow layer, revealed at the bottom-right by the offset. */}
      <View
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: ink, borderRadius: Radius.sm, transform: [{ translateX: offset }, { translateY: offset }] },
        ]}
      />
      {/* Foreground surface. */}
      <View
        style={[
          {
            backgroundColor: background,
            borderColor: ink,
            borderWidth: Border.base,
            borderRadius: Radius.sm,
          },
          contentStyle,
        ]}>
        {children}
      </View>
    </View>
  );
}
