import { StyleSheet, View } from 'react-native';
import Svg, { Defs, Line, Pattern, Rect } from 'react-native-svg';

import { useTheme } from '@/theme/theme-context';

/**
 * Signature Bauhaus background: a very faint 40px grid, fixed behind content.
 * Ports the reference's `repeating-linear-gradient` grid using an SVG pattern
 * (RN has no repeating gradients). Lines use the theme ink at ~2.5% opacity.
 */
export function GridBackground() {
  const { colors, isDark } = useTheme();
  // Lighten slightly more in dark mode so the grid stays perceptible.
  const lineColor = colors.ink;
  const opacity = isDark ? 0.10 : 0.025;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width="100%" height="100%">
        <Defs>
          <Pattern id="grid" width={40} height={40} patternUnits="userSpaceOnUse">
            <Line x1={0} y1={0} x2={40} y2={0} stroke={lineColor} strokeWidth={1} opacity={opacity} />
            <Line x1={0} y1={0} x2={0} y2={40} stroke={lineColor} strokeWidth={1} opacity={opacity} />
          </Pattern>
        </Defs>
        <Rect x={0} y={0} width="100%" height="100%" fill="url(#grid)" />
      </Svg>
    </View>
  );
}
