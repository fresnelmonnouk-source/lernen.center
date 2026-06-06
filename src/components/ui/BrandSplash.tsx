import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Svg, { ClipPath, Circle, Defs, G, Path, Rect } from 'react-native-svg';

import { BrandMark } from '@/components/ui/BrandMark';
import { GridBackground } from '@/components/ui/GridBackground';
import { Txt } from '@/components/ui/Txt';
import { useTheme } from '@/theme/theme-context';
import { Accent } from '@/theme/tokens';

/**
 * Branded loading screen (static). Reproduces the validated splash direction
 * (Léo : assets/brand/splash-screen-{light,dark}.svg) as a responsive RN view so
 * it renders crisp at any size and adapts to light/dark via the theme.
 *
 * Shown during the auth/session restore (see app/_layout.tsx). Fonts are already
 * loaded at that point, so the wordmark is faithful. The OS splash
 * (expo-splash-screen) bridges the earlier font-loading frame.
 *
 * No motion by design — animation is deferred (Hugo). `progress` is a static
 * brand element; pass a real value later if a determinate bar is wired.
 */
export function BrandSplash({ progress = 0.55 }: { progress?: number }) {
  const { colors, isDark } = useTheme();
  const { width, height } = useWindowDimensions();

  const markSize = Math.min(width * 0.44, 220);
  const tagline = isDark ? '#8A847A' : '#7A746A'; // muted grey, derived (off-palette decor)
  const barWidth = Math.min(width * 0.56, 320);
  const barFill = isDark ? Accent.yellow : colors.ink;

  return (
    <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.cream }]}>
      <GridBackground />

      {/* Decorative bleed shapes — cover the screen, keep their designed positions. */}
      <Svg
        style={StyleSheet.absoluteFill}
        width="100%"
        height="100%"
        viewBox="0 0 1080 2340"
        preserveAspectRatio="xMidYMid slice"
        pointerEvents="none">
        {/* Top-left circle: pink (light) / maroon (dark). */}
        <Circle cx={60} cy={-40} r={420} fill={isDark ? '#7A2630' : '#F3D4D4'} />
        {/* Bottom-right tilted square bleeding off the edge: pale (light) / vivid yellow (dark). */}
        <G rotation={14} originX={1080} originY={1640}>
          <Rect x={900} y={1480} width={320} height={320} fill={isDark ? Accent.yellow : '#FBE8A6'} />
        </G>
      </Svg>

      {/* Mark + wordmark + tagline, centered. */}
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Mark size={markSize} tile={isDark} />
        <View style={{ height: markSize * 0.22 }} />
        <BrandMark size={Math.min(width * 0.11, 46)} />
        <View style={{ height: 14 }} />
        <Txt font="mono" size={Math.min(width * 0.032, 13)} uppercase tracking={4} color={tagline}>
          Apprends l&apos;allemand
        </Txt>
      </View>

      {/* Static progress bar near the bottom. */}
      <View style={{ position: 'absolute', bottom: height * 0.09, left: 0, right: 0, alignItems: 'center' }}>
        <View style={{ width: barWidth, height: 6, backgroundColor: colors.cream3 }}>
          <View
            style={{
              width: `${Math.round(Math.max(0, Math.min(1, progress)) * 100)}%`,
              height: 6,
              backgroundColor: barFill,
            }}
          />
        </View>
      </View>
    </View>
  );
}

/**
 * The "L" mark. Two faithful forms, matching the validated direction:
 *  - dark (`tile`): the app icon inside a cream squircle (red quarter-circle anchored
 *    to the corner, clipped round) — the blue would sink into ink without the tile.
 *  - light (no tile): shapes directly on the cream page, red as a floating disk
 *    (no corner to anchor to). Mirrors splash-screen-{dark,light}.svg.
 */
function Mark({ size, tile }: { size: number; tile: boolean }) {
  if (tile) {
    return (
      <Svg width={size} height={size} viewBox="0 0 200 200">
        <Defs>
          <ClipPath id="lernenTile">
            <Rect x={0} y={0} width={200} height={200} rx={44} ry={44} />
          </ClipPath>
        </Defs>
        <G clipPath="url(#lernenTile)">
          <Rect x={0} y={0} width={200} height={200} fill="#F4F0E6" />
          <Path d="M200 0 V96 A96 96 0 0 1 104 0 Z" fill={Accent.red} />
          <Rect x={44} y={44} width={40} height={112} fill={Accent.blue} />
          <G rotation={-8} originX={120} originY={132}>
            <Rect x={84} y={112} width={72} height={44} fill={Accent.yellow} />
          </G>
        </G>
      </Svg>
    );
  }
  return (
    <Svg width={size} height={size} viewBox="25 -6 180 180">
      <Circle cx={152} cy={42} r={34} fill={Accent.red} />
      <Rect x={44} y={44} width={40} height={112} fill={Accent.blue} />
      <G rotation={-8} originX={120} originY={132}>
        <Rect x={84} y={112} width={72} height={44} fill={Accent.yellow} />
      </G>
    </Svg>
  );
}
