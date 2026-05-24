import { Link, type Href } from 'expo-router';
import { Fragment } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Txt } from '@/components/ui/Txt';
import { useTheme } from '@/theme/theme-context';
import { Accent, Border, Shadow, Spacing } from '@/theme/tokens';

export type MenuItem = {
  /** Letter or short glyph for the colored square marker. */
  mark: string;
  title: string;
  subtitle?: string;
  /** Marker fill (an Accent hue). Defaults to ink. */
  color?: string;
  href?: Href;
  /** Locked (V2) items render greyed and non-pressable. */
  locked?: boolean;
};

/** Vertical list of navigable rows with square colored markers (`.list-item`). */
export function MenuList({ items }: { items: MenuItem[] }) {
  return (
    <View style={styles.list}>
      {items.map((item) => (
        <Fragment key={item.title}>
          {item.href && !item.locked ? (
            <Link href={item.href} asChild>
              <Pressable>
                <Row item={item} />
              </Pressable>
            </Link>
          ) : (
            <Row item={item} />
          )}
        </Fragment>
      ))}
    </View>
  );
}

function Row({ item }: { item: MenuItem }) {
  const { colors } = useTheme();
  const markColor = item.color ?? colors.ink;
  // Marker text contrasts with its fill: dark text on yellow, else cream.
  const markText = markColor === Accent.yellow ? colors.ink : '#F4F0E6';

  return (
    <View style={[styles.row, item.locked && styles.rowLocked]}>
      <View style={[styles.shadow, { backgroundColor: colors.ink }]} />
      <View style={[styles.surface, { backgroundColor: colors.paper, borderColor: colors.ink }]}>
        <View style={[styles.mark, { backgroundColor: markColor, borderColor: colors.ink }]}>
          <Txt font="display" size={18} color={markText}>
            {item.mark}
          </Txt>
        </View>
        <View style={styles.body}>
          <Txt font="bold" size={17} uppercase tracking={-0.2}>
            {item.title}
          </Txt>
          {item.subtitle ? (
            <Txt font="mono" size={10} tone="ink2" tracking={0.5} style={styles.subtitle}>
              {item.subtitle}
            </Txt>
          ) : null}
        </View>
        <Txt font="display" size={22}>
          {item.locked ? '🔒' : '→'}
        </Txt>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: Spacing.two,
  },
  row: {
    position: 'relative',
  },
  rowLocked: {
    opacity: 0.45,
  },
  shadow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    transform: [{ translateX: Shadow.sm }, { translateY: Shadow.sm }],
  },
  surface: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    borderWidth: Border.base,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.three,
  },
  mark: {
    width: 48,
    height: 48,
    borderWidth: Border.base,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
  },
  subtitle: {
    marginTop: 2,
    opacity: 0.7,
  },
});
