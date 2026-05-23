import { StyleSheet } from 'react-native';

import { HardShadowBox } from '@/components/ui/HardShadowBox';
import { Txt } from '@/components/ui/Txt';
import { useTheme } from '@/theme/theme-context';
import { Accent, Spacing } from '@/theme/tokens';

/**
 * Phase 0/1 marker for leaf screens whose business logic (ported from the web
 * modules + Vercel API) lands in Phase 2. Keeps the skeleton honest.
 */
export function PhaseNote({ label }: { label: string }) {
  const { colors } = useTheme();
  return (
    <HardShadowBox background={colors.cream2} contentStyle={styles.box}>
      <Txt font="monoBold" size={10} color={Accent.red} tracking={1.5}>
        PHASE 2
      </Txt>
      <Txt font="body" size={14} lineHeight={20}>
        {label}
      </Txt>
    </HardShadowBox>
  );
}

const styles = StyleSheet.create({
  box: {
    padding: Spacing.four,
    gap: Spacing.two,
  },
});
