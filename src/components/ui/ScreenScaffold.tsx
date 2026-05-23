import { type ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Palette, Spacing } from '@/theme/bauhaus';

type Props = {
  /** Small monospace eyebrow above the title. */
  eyebrow?: string;
  title: string;
  /** Optional serif-italic accent appended to the title. */
  accent?: string;
  children: ReactNode;
};

/** Shared page chrome: cream background, mono eyebrow, big title, scroll body. */
export function ScreenScaffold({ eyebrow, title, accent, children }: Props) {
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
          <Text style={styles.title}>
            {title}
            {accent ? <Text style={styles.accent}> {accent}</Text> : null}
          </Text>
        </View>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Palette.cream,
  },
  content: {
    padding: Spacing.four,
    gap: Spacing.four,
    paddingBottom: Spacing.six,
  },
  header: {
    gap: Spacing.one,
  },
  eyebrow: {
    fontFamily: 'monospace',
    fontSize: 10,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: Palette.ink2,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    textTransform: 'uppercase',
    color: Palette.ink,
    letterSpacing: -0.5,
  },
  accent: {
    fontWeight: '400',
    fontStyle: 'italic',
    textTransform: 'none',
    color: Palette.red,
  },
});
