import { Link, type Href } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Icon } from '@/components/ui/Icon';
import { Txt } from '@/components/ui/Txt';
import { useTheme } from '@/theme/theme-context';
import { Border, Shadow, Spacing } from '@/theme/tokens';

type Props = {
  /** Oversized index, e.g. "01". */
  number: string;
  title: string;
  /** Solid fill color of the card (an Accent hue). */
  color: string;
  href: Href;
  /** Number/title color. Defaults to ink. */
  foreground?: string;
};

/**
 * Primary menu action card (reference: `.action-card`): solid fill, 56px number,
 * uppercase title, corner arrow, and a brutalist press effect (the surface sinks
 * into its hard shadow). Sharp corners.
 */
export function ActionCard({ number, title, color, href, foreground }: Props) {
  const { colors } = useTheme();
  const [pressed, setPressed] = useState(false);
  const offset = Shadow.lg;
  const fg = foreground ?? colors.ink;

  return (
    <Link href={href} asChild>
      <Pressable
        style={styles.root}
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}>
        <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.ink, transform: [{ translateX: offset }, { translateY: offset }] }]} />
        <View
          style={[
            styles.card,
            { backgroundColor: color, borderColor: colors.ink },
            pressed && { transform: [{ translateX: offset - 1 }, { translateY: offset - 1 }] },
          ]}>
          <View style={styles.arrow}>
            <Icon name="arrowUpRight" size="md" color={fg} />
          </View>
          <Txt font="display" size={56} color={fg} tracking={-2} lineHeight={52}>
            {number}
          </Txt>
          <Txt font="bold" size={18} color={fg} uppercase style={styles.title}>
            {title}
          </Txt>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  card: {
    borderWidth: Border.base,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    minHeight: 150,
    justifyContent: 'space-between',
  },
  arrow: {
    position: 'absolute',
    top: Spacing.three,
    right: Spacing.three,
  },
  title: {
    marginTop: Spacing.three,
  },
});
