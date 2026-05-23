import { Link } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Border, Palette, Radius, ShadowOffset, Spacing } from '@/theme/bauhaus';

type Props = {
  /** Two-digit index shown big on the left, e.g. "01". */
  number: string;
  title: string;
  /** Solid fill color of the card (yellow/red/blue/green). */
  color: string;
  href: string;
  /** Title/number color. Defaults to ink. */
  foreground?: string;
};

/**
 * Primary menu "action card" from the Bauhaus reference: solid color fill,
 * oversized number, uppercase title, corner arrow, and a brutalist press
 * effect (the surface sinks into its hard shadow when pressed).
 */
export function ActionCard({ number, title, color, href, foreground = Palette.ink }: Props) {
  const [pressed, setPressed] = useState(false);
  const offset = ShadowOffset.lg;

  return (
    <Link href={href} asChild>
      <Pressable onPressIn={() => setPressed(true)} onPressOut={() => setPressed(false)}>
        <View>
          {/* Hard shadow layer. */}
          <View
            style={[
              StyleSheet.absoluteFill,
              {
                backgroundColor: Palette.ink,
                borderRadius: Radius.sm,
                transform: [{ translateX: offset }, { translateY: offset }],
              },
            ]}
          />
          {/* Card surface — sinks toward the shadow when pressed. */}
          <View
            style={[
              styles.card,
              { backgroundColor: color },
              pressed && { transform: [{ translateX: offset - 1 }, { translateY: offset - 1 }] },
            ]}>
            <Text style={[styles.arrow, { color: foreground }]}>↗</Text>
            <Text style={[styles.number, { color: foreground }]}>{number}</Text>
            <Text style={[styles.title, { color: foreground }]}>{title}</Text>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    borderColor: Palette.ink,
    borderWidth: Border.base,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.four,
    minHeight: 150,
    justifyContent: 'flex-end',
  },
  arrow: {
    position: 'absolute',
    top: Spacing.three,
    right: Spacing.three,
    fontSize: 22,
    fontWeight: '800',
  },
  number: {
    fontSize: 56,
    fontWeight: '800',
    lineHeight: 58,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
