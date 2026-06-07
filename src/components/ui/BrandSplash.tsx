import { useEffect } from 'react';
import { AccessibilityInfo, StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  type SharedValue,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, ClipPath, Defs, G, Path, Rect } from 'react-native-svg';

import { GridBackground } from '@/components/ui/GridBackground';
import { Txt } from '@/components/ui/Txt';
import { useTheme } from '@/theme/theme-context';
import { Accent } from '@/theme/tokens';

/**
 * Branded loading screen — ANIMATED.
 *
 * Transposes the validated motion signature (docs/motion-guidelines.md, reference
 * docs/motion/splash-lernen.html) onto the validated s7 visuals (the light/dark
 * mark forms, the real brand fonts, the 2 bleed-shape decor). Driven by a single
 * absolute clock (0 → 4 s, looping) so every piece is a pure function of `t` —
 * deterministic and seekable, exactly like the web reference.
 *
 * Choreography: tile pops in → mark assembles (blue shaft → red corner → yellow
 * foot, easeOutBack snap) → 6-letter LERNEN cascade + ".de" pop → tagline fade →
 * loading bar fills → whole group fades to cream and the loop restarts. The grid
 * and decor live OUTSIDE the fading group (permanent, gentle parallax).
 *
 * Accessibility: prefers-reduced-motion → render the final assembled state, no loop.
 * Shown during auth/session restore (app/_layout.tsx); fonts are already loaded.
 */

const DURATION = 4.0; // total loop length, seconds

// ---- Easings (worklets) — identical formulas to the web reference -----------
// easeOutBack = the brutalist "snap" signature (visible overshoot).
function clampSeg(t: number, a: number, b: number) {
  'worklet';
  if (t <= a) return 0;
  if (t >= b) return 1;
  return (t - a) / (b - a);
}
function eOutCubic(p: number) {
  'worklet';
  const q = p - 1;
  return q * q * q + 1;
}
function eOutBack(p: number) {
  'worklet';
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2);
}
function eInOutCubic(p: number) {
  'worklet';
  return p < 0.5 ? 4 * p * p * p : (p - 1) * (2 * p - 2) * (2 * p - 2) + 1;
}

const AnimatedG = Animated.createAnimatedComponent(G);

export function BrandSplash() {
  const { colors, isDark } = useTheme();
  const { width, height } = useWindowDimensions();

  // Absolute animation clock, 0 → DURATION, looping.
  const clock = useSharedValue(0);

  useEffect(() => {
    let mounted = true;
    // Honor reduced-motion: freeze on the final assembled state (t=3.30, the last
    // instant before the loop fade) instead of animating.
    AccessibilityInfo.isReduceMotionEnabled()
      .then((reduce) => {
        if (!mounted) return;
        if (reduce) {
          clock.value = 3.3;
        } else {
          clock.value = withRepeat(
            withTiming(DURATION, { duration: DURATION * 1000, easing: Easing.linear }),
            -1,
            false,
          );
        }
      })
      .catch(() => {
        if (mounted) {
          clock.value = withRepeat(
            withTiming(DURATION, { duration: DURATION * 1000, easing: Easing.linear }),
            -1,
            false,
          );
        }
      });
    return () => {
      mounted = false;
      cancelAnimation(clock);
    };
  }, [clock]);

  const markSize = Math.min(width * 0.44, 220);
  const wordSize = Math.min(width * 0.11, 46);
  const taglineColor = isDark ? '#8A847A' : '#7A746A'; // muted grey, off-palette decor
  const barWidth = Math.min(width * 0.56, 320);
  const barFill = isDark ? Accent.yellow : colors.ink;

  // ---- The whole splash group fades out 3.30 → 3.62 then the loop restarts ----
  const groupFade = useAnimatedStyle(() => ({
    opacity: 1 - clampSeg(clock.value, 3.3, 3.62),
  }));

  // ---- Loading bar: track fades in, fill scales 0→1 from the left -------------
  const trackStyle = useAnimatedStyle(() => ({
    opacity: clampSeg(clock.value, 1.55, 1.8),
  }));
  const fillStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: eInOutCubic(clampSeg(clock.value, 1.6, 2.95)) }],
  }));

  // ---- Tagline: simple fade once the wordmark is settled ----------------------
  const taglineStyle = useAnimatedStyle(() => ({
    opacity: clampSeg(clock.value, 2.2, 2.65),
  }));

  return (
    <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.cream }]}>
      <GridBackground />

      {/* Permanent decor (parallax), OUTSIDE the fading group. */}
      <Decor clock={clock} isDark={isDark} />

      {/* Everything below fades together on the loop seam. */}
      <Animated.View style={[StyleSheet.absoluteFill, groupFade]}>
        {/* Mark + wordmark + tagline, centered. */}
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <AnimatedMark size={markSize} tile={isDark} clock={clock} />
          <View style={{ height: markSize * 0.22 }} />

          {/* Wordmark: per-letter cascade + ".de" pop. */}
          <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
            {(['L', 'E', 'R', 'N', 'E', 'N'] as const).map((c, i) => (
              <Letter key={i} char={c} index={i} size={wordSize} clock={clock} color={colors.ink} />
            ))}
            <Suffix size={wordSize} clock={clock} />
          </View>

          <View style={{ height: 14 }} />
          <Animated.View style={taglineStyle}>
            <Txt font="mono" size={Math.min(width * 0.032, 13)} uppercase tracking={4} color={taglineColor}>
              Apprends l&apos;allemand
            </Txt>
          </Animated.View>
        </View>

        {/* Loading bar near the bottom. */}
        <View style={{ position: 'absolute', bottom: height * 0.09, left: 0, right: 0, alignItems: 'center' }}>
          <Animated.View style={[{ width: barWidth, height: 6, backgroundColor: colors.cream3, overflow: 'hidden' }, trackStyle]}>
            <Animated.View
              style={[
                { width: barWidth, height: 6, backgroundColor: barFill, transformOrigin: '0% 50%' },
                fillStyle,
              ]}
            />
          </Animated.View>
        </View>
      </Animated.View>
    </View>
  );
}

/**
 * Animated "L" mark. Same two validated forms as the static version:
 *  - dark (`tile`): app icon inside a cream squircle (red quarter-circle anchored
 *    to the top-right corner), shapes clipped round.
 *  - light: shapes on the cream page, red as a floating disk.
 * The tile container handles opacity + entrance scale + a tiny settle bounce; the
 * three shapes assemble inside (blue drops, red grows from its anchor, yellow slides).
 */
function AnimatedMark({ size, tile, clock }: { size: number; tile: boolean; clock: SharedValue<number> }) {
  // Tile container: appear (0.15→0.32) + scale 0.4→1 (easeOutBack) + settle (1.45→1.70).
  const tileStyle = useAnimatedStyle(() => {
    const t = clock.value;
    const settle = 1 + Math.sin(clampSeg(t, 1.45, 1.7) * Math.PI) * 0.03;
    const scale = (0.4 + 0.6 * eOutBack(clampSeg(t, 0.15, 0.58))) * settle;
    return { opacity: clampSeg(t, 0.15, 0.32), transform: [{ scale }] };
  });

  // Blue shaft: drops from the top (easeOutCubic). Offsets in viewBox units.
  const blueProps = useAnimatedProps(() => {
    const t = clock.value;
    const ty = (1 - eOutCubic(clampSeg(t, 0.5, 0.92))) * -180;
    return { translateY: ty, opacity: t >= 0.5 ? 1 : 0 } as any;
  });

  // Red: grows from its anchor (corner for the quarter, center for the disk).
  const redProps = useAnimatedProps(() => {
    const t = clock.value;
    const k = eOutCubic(clampSeg(t, 0.8, 1.2));
    return { scale: k, opacity: k <= 0 ? 0 : 1 } as any;
  });

  // Yellow foot: slides in from the left with an easeOutBack overshoot (the slide
  // wraps the static -8° rotation, so the motion is horizontal like the reference).
  const yellowProps = useAnimatedProps(() => {
    const t = clock.value;
    const tx = (1 - eOutBack(clampSeg(t, 1.05, 1.55))) * -150;
    return { translateX: tx, opacity: t >= 1.05 ? 1 : 0 } as any;
  });

  if (tile) {
    return (
      <Animated.View style={tileStyle}>
        <Svg width={size} height={size} viewBox="0 0 200 200">
          <Defs>
            <ClipPath id="lernenTile">
              <Rect x={0} y={0} width={200} height={200} rx={44} ry={44} />
            </ClipPath>
          </Defs>
          <G clipPath="url(#lernenTile)">
            <Rect x={0} y={0} width={200} height={200} fill="#F4F0E6" />
            {/* Red quarter-circle, grows from the top-right corner (200,0). */}
            <AnimatedG animatedProps={redProps} originX={200} originY={0}>
              <Path d="M200 0 V96 A96 96 0 0 1 104 0 Z" fill={Accent.red} />
            </AnimatedG>
            {/* Blue shaft drops from the top. */}
            <AnimatedG animatedProps={blueProps}>
              <Rect x={44} y={44} width={40} height={112} fill={Accent.blue} />
            </AnimatedG>
            {/* Yellow foot slides from the left (rotation held by inner G). */}
            <AnimatedG animatedProps={yellowProps}>
              <G rotation={-8} originX={120} originY={132}>
                <Rect x={84} y={112} width={72} height={44} fill={Accent.yellow} />
              </G>
            </AnimatedG>
          </G>
        </Svg>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={tileStyle}>
      <Svg width={size} height={size} viewBox="25 -6 180 180">
        {/* Red disk pops from its center. */}
        <AnimatedG animatedProps={redProps} originX={152} originY={42}>
          <Circle cx={152} cy={42} r={34} fill={Accent.red} />
        </AnimatedG>
        <AnimatedG animatedProps={blueProps}>
          <Rect x={44} y={44} width={40} height={112} fill={Accent.blue} />
        </AnimatedG>
        <AnimatedG animatedProps={yellowProps}>
          <G rotation={-8} originX={120} originY={132}>
            <Rect x={84} y={112} width={72} height={44} fill={Accent.yellow} />
          </G>
        </AnimatedG>
      </Svg>
    </Animated.View>
  );
}

/** One wordmark letter: snaps up (easeOutBack), 50 ms cascade offset per index. */
function Letter({
  char,
  index,
  size,
  clock,
  color,
}: {
  char: string;
  index: number;
  size: number;
  clock: SharedValue<number>;
  color: string;
}) {
  const style = useAnimatedStyle(() => {
    const p = eOutBack(clampSeg(clock.value, 1.5 + index * 0.05, 1.8 + index * 0.05));
    return { opacity: p, transform: [{ translateY: (1 - p) * 22 }] };
  });
  return (
    <Animated.View style={style}>
      <Txt font="display" size={size} uppercase tracking={-1.5} color={color}>
        {char}
      </Txt>
    </Animated.View>
  );
}

/** ".de" suffix: pops last (scale 0.4→1, easeOutBack) from its bottom-left. */
function Suffix({ size, clock }: { size: number; clock: SharedValue<number> }) {
  const style = useAnimatedStyle(() => {
    const p = eOutBack(clampSeg(clock.value, 1.88, 2.18));
    return { opacity: p, transform: [{ scale: 0.4 + 0.6 * p }] };
  });
  return (
    <Animated.View style={[{ transformOrigin: '0% 100%' }, style]}>
      <Txt font="serifItalic" size={size * 0.7} color={Accent.red} tracking={-0.5}>
        .de
      </Txt>
    </Animated.View>
  );
}

/**
 * Permanent decor: the two validated bleed shapes, with a slow sinusoidal
 * parallax (counter-phase) for depth. Never affected by the loop fade.
 */
function Decor({ clock, isDark }: { clock: SharedValue<number>; isDark: boolean }) {
  const circleStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: Math.sin(clock.value * 0.7) * 12 }],
  }));
  const squareStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: Math.cos(clock.value * 0.6) * 14 }],
  }));
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Animated.View style={[StyleSheet.absoluteFill, circleStyle]}>
        <Svg style={StyleSheet.absoluteFill} width="100%" height="100%" viewBox="0 0 1080 2340" preserveAspectRatio="xMidYMid slice">
          {/* Top-left circle: pink (light) / maroon (dark). */}
          <Circle cx={60} cy={-40} r={420} fill={isDark ? '#7A2630' : '#F3D4D4'} />
        </Svg>
      </Animated.View>
      <Animated.View style={[StyleSheet.absoluteFill, squareStyle]}>
        <Svg style={StyleSheet.absoluteFill} width="100%" height="100%" viewBox="0 0 1080 2340" preserveAspectRatio="xMidYMid slice">
          {/* Bottom-right tilted square bleeding off the edge. */}
          <G rotation={14} originX={1080} originY={1640}>
            <Rect x={900} y={1480} width={320} height={320} fill={isDark ? Accent.yellow : '#FBE8A6'} />
          </G>
        </Svg>
      </Animated.View>
    </View>
  );
}
