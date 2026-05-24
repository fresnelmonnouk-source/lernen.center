import { type ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrandMark } from '@/components/ui/BrandMark';
import { GridBackground } from '@/components/ui/GridBackground';
import { Txt } from '@/components/ui/Txt';
import { useTheme } from '@/theme/theme-context';
import { MaxContentWidth, Spacing } from '@/theme/tokens';

type Props = {
  eyebrow: string;
  title: string;
  children: ReactNode;
};

/** Centered, branded form chrome shared by login / signup / onboarding. */
export function AuthScaffold({ eyebrow, title, children }: Props) {
  const { colors } = useTheme();
  return (
    <View style={[styles.root, { backgroundColor: colors.cream }]}>
      <GridBackground />
      <SafeAreaView style={styles.flex}>
        <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
            <View style={styles.col}>
              <BrandMark />
              <View style={styles.head}>
                <Txt font="monoBold" size={10} tone="ink2" uppercase tracking={1.5}>
                  {eyebrow}
                </Txt>
                <Txt font="display" size={36} uppercase tracking={-1} lineHeight={38}>
                  {title}
                </Txt>
              </View>
              {children}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  flex: { flex: 1 },
  content: { padding: Spacing.four, gap: Spacing.four, flexGrow: 1, justifyContent: 'center' },
  col: { width: '100%', maxWidth: MaxContentWidth, alignSelf: 'center', gap: Spacing.four },
  head: { gap: Spacing.one },
});
