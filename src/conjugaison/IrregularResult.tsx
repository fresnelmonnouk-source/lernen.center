import { StyleSheet, View } from 'react-native';

import { HardShadowBox } from '@/components/ui/HardShadowBox';
import { Txt } from '@/components/ui/Txt';
import { useTheme } from '@/theme/theme-context';
import { Accent, Border, Shadow, Spacing } from '@/theme/tokens';
import type { CheckIrregularResponse } from '@/lib/api';

// Familles de verbes allemandes → libellé pédagogique bilingue.
const TYPE_LABEL: Record<string, string> = {
  schwach: 'Faible · schwach',
  stark: 'Fort · stark',
  gemischt: 'Mixte · gemischt',
  modal: 'Modal',
};

function PartRow({ label, value, top }: { label: string; value: string; top?: boolean }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.row, top && { borderTopWidth: Border.thin, borderTopColor: colors.ink }]}>
      <Txt font="monoBold" size={10} tone="ink2" uppercase tracking={1.2} style={styles.partLabel}>
        {label}
      </Txt>
      <Txt font="bold" size={16} style={styles.partValue}>
        {value}
      </Txt>
    </View>
  );
}

/** Résultat « régulier ou irrégulier ? » : verdict + Stammformen + explication. */
export function IrregularResult({ data }: { data: CheckIrregularResponse }) {
  const { colors } = useTheme();
  const accent = data.isIrregular ? Accent.red : Accent.green;

  return (
    <View style={styles.wrap}>
      <HardShadowBox background={accent} contentStyle={styles.banner}>
        <Txt font="display" size={24} color="#FFFFFF" uppercase tracking={-0.5}>
          {data.isIrregular ? 'Irrégulier' : 'Régulier'}
        </Txt>
        <Txt font="monoBold" size={11} color="#FFFFFF" uppercase tracking={1}>
          {TYPE_LABEL[data.type] ?? data.type}
        </Txt>
      </HardShadowBox>

      {/* Stammformen : les 3 temps principaux (infinitif, prétérit, parfait). */}
      <HardShadowBox contentStyle={styles.parts}>
        <PartRow label="Infinitiv" value={data.principalParts.infinitiv} />
        <PartRow label="Präteritum" value={data.principalParts.präteritum_er} top />
        <PartRow label="Perfekt" value={data.principalParts.perfekt_er} top />
      </HardShadowBox>

      {data.vowelChange ? (
        <View style={styles.vowel}>
          <Txt font="monoBold" size={10} tone="ink2" uppercase tracking={1.2}>
            Changement de voyelle
          </Txt>
          <Txt font="mono" size={15} color={accent}>
            {data.vowelChange}
          </Txt>
        </View>
      ) : null}

      <HardShadowBox background={colors.cream2} offset={Shadow.sm} contentStyle={styles.expl}>
        <Txt font="body" size={14} lineHeight={20}>
          {data.explanation}
        </Txt>
      </HardShadowBox>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: Spacing.three },
  banner: { padding: Spacing.three, gap: 2 },
  parts: { paddingHorizontal: Spacing.three },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.three,
    gap: Spacing.three,
  },
  partLabel: { width: 96 },
  partValue: { flex: 1, textAlign: 'right' },
  vowel: { gap: 2 },
  expl: { padding: Spacing.three },
});
