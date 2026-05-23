import { Link } from 'expo-router';
import { Fragment } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Border, Palette, Radius, ShadowOffset, Spacing } from '@/theme/bauhaus';

export type MenuItem = {
  /** Letter or short glyph shown in the colored square marker. */
  mark: string;
  title: string;
  subtitle?: string;
  /** Marker fill color. Defaults to ink. */
  color?: string;
  href?: string;
  /** Locked items (e.g. V2 features) render greyed and are not pressable. */
  locked?: boolean;
};

/** Vertical list of navigable rows with square colored markers (Bauhaus style). */
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
  const markColor = item.color ?? Palette.ink;
  return (
    <View style={[styles.row, item.locked && styles.rowLocked]}>
      <View style={styles.shadow} />
      <View style={styles.rowSurface}>
        <View style={[styles.mark, { backgroundColor: markColor }]}>
          <Text style={styles.markText}>{item.mark}</Text>
        </View>
        <View style={styles.rowBody}>
          <Text style={styles.rowTitle}>{item.title}</Text>
          {item.subtitle ? <Text style={styles.rowSubtitle}>{item.subtitle}</Text> : null}
        </View>
        <Text style={styles.rowArrow}>{item.locked ? '🔒' : '→'}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: Spacing.three,
  },
  row: {
    position: 'relative',
  },
  rowLocked: {
    opacity: 0.4,
  },
  shadow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Palette.ink,
    borderRadius: Radius.sm,
    transform: [{ translateX: ShadowOffset.sm }, { translateY: ShadowOffset.sm }],
  },
  rowSurface: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    backgroundColor: Palette.paper,
    borderColor: Palette.ink,
    borderWidth: Border.base,
    borderRadius: Radius.sm,
    padding: Spacing.three,
  },
  mark: {
    width: 48,
    height: 48,
    borderRadius: Radius.sm,
    borderColor: Palette.ink,
    borderWidth: Border.thin,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markText: {
    color: Palette.cream,
    fontSize: 20,
    fontWeight: '800',
  },
  rowBody: {
    flex: 1,
  },
  rowTitle: {
    color: Palette.ink,
    fontSize: 15,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  rowSubtitle: {
    color: Palette.ink2,
    fontSize: 10,
    fontFamily: 'monospace',
    marginTop: 2,
  },
  rowArrow: {
    color: Palette.ink,
    fontSize: 22,
    fontWeight: '800',
  },
});
