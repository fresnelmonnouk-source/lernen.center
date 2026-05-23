import { StyleSheet, Text } from 'react-native';

import { HardShadowBox } from '@/components/ui/HardShadowBox';
import { Palette, Spacing } from '@/theme/bauhaus';

/**
 * Phase 0 marker for leaf screens whose business logic (ported from the web
 * modules + Vercel API) lands in Phase 2. Keeps the navigation skeleton
 * honest: every route resolves to a real, labelled screen.
 */
export function PhaseNote({ label }: { label: string }) {
  return (
    <HardShadowBox background={Palette.cream2} contentStyle={styles.box}>
      <Text style={styles.tag}>PHASE 2</Text>
      <Text style={styles.text}>{label}</Text>
    </HardShadowBox>
  );
}

const styles = StyleSheet.create({
  box: {
    padding: Spacing.four,
    gap: Spacing.two,
  },
  tag: {
    fontFamily: 'monospace',
    fontSize: 10,
    letterSpacing: 2,
    color: Palette.red,
  },
  text: {
    fontSize: 14,
    color: Palette.ink,
    lineHeight: 20,
  },
});
