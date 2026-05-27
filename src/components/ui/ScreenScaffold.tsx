import { type ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GridBackground } from '@/components/ui/GridBackground';
import { Txt } from '@/components/ui/Txt';
import { useTheme } from '@/theme/theme-context';
import { Accent, MaxContentWidth, Spacing } from '@/theme/tokens';

type Props = {
  /** Small monospace eyebrow above the title. */
  eyebrow?: string;
  title: string;
  /** Serif-italic accent appended to the title (e.g. "l'allemand"). */
  accent?: string;
  children: ReactNode;
};

/** Shared page chrome: themed background + signature grid, eyebrow + big title. */
export function ScreenScaffold({ eyebrow, title, accent, children }: Props) {
  const { colors } = useTheme();
  return (
    <View style={[styles.root, { backgroundColor: colors.cream }]}>
      <GridBackground />
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.column}>
            <View style={styles.header}>
              {eyebrow ? (
                <Txt font="monoBold" size={10} tone="ink2" uppercase tracking={1.5}>
                  {eyebrow}
                </Txt>
              ) : null}
              <Txt font="display" size={34} uppercase tracking={-1} lineHeight={36}>
                {title}
                {accent ? (
                  <Txt font="serifItalic" size={30} color={Accent.red} style={styles.accent}>
                    {' '}
                    {accent}
                  </Txt>
                ) : null}
              </Txt>
            </View>
            {children}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  safe: {
    flex: 1,
  },
  content: {
    padding: Spacing.four,
    paddingBottom: Spacing.six,
  },
  column: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    gap: Spacing.four,
  },
  header: {
    gap: Spacing.one,
  },
  accent: {
    textTransform: 'none',
  },
});
