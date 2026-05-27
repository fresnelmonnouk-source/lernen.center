import { StyleSheet, View } from 'react-native';

import { HardShadowBox } from '@/components/ui/HardShadowBox';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Txt } from '@/components/ui/Txt';
import { useTheme } from '@/theme/theme-context';
import { Accent, Border, Shadow, Spacing } from '@/theme/tokens';
import type { ConjugateResponse, Person } from '@/lib/api';

// Ordre canonique des personnes + libellés d'affichage (er_sie_es → er/sie/es).
const PERSONS: { key: Person; label: string }[] = [
  { key: 'ich', label: 'ich' },
  { key: 'du', label: 'du' },
  { key: 'er_sie_es', label: 'er/sie/es' },
  { key: 'wir', label: 'wir' },
  { key: 'ihr', label: 'ihr' },
  { key: 'sie_Sie', label: 'sie/Sie' },
];

function Tag({ label, color, dark }: { label: string; color: string; dark?: boolean }) {
  const { colors } = useTheme();
  return (
    <View style={styles.tagWrap}>
      <View
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: colors.ink, transform: [{ translateX: Shadow.sm }, { translateY: Shadow.sm }] },
        ]}
      />
      <View style={[styles.tag, { backgroundColor: color, borderColor: colors.ink }]}>
        <Txt font="monoBold" size={10} color={dark ? '#0A0A0A' : '#FFFFFF'} uppercase tracking={0.5}>
          {label}
        </Txt>
      </View>
    </View>
  );
}

/** Résultat d'une conjugaison IA : badges + table des 6 personnes + notes. */
export function ConjugateResult({ data }: { data: ConjugateResponse }) {
  const { colors } = useTheme();
  return (
    <View style={styles.wrap}>
      <SectionHeader title={data.verb} accent={data.tense} />

      <View style={styles.tags}>
        <Tag
          label={data.isIrregular ? 'Verbe fort' : 'Verbe faible'}
          color={data.isIrregular ? Accent.red : Accent.green}
        />
        {data.separable ? <Tag label="Séparable" color={Accent.yellow} dark /> : null}
        <Tag label={`Aux. ${data.auxiliary}`} color={Accent.blue} />
      </View>

      <HardShadowBox contentStyle={styles.table}>
        {PERSONS.map((p, i) => (
          <View
            key={p.key}
            style={[styles.row, i > 0 && { borderTopWidth: Border.thin, borderTopColor: colors.ink }]}>
            <Txt font="mono" size={13} tone="ink2" style={styles.person}>
              {p.label}
            </Txt>
            <Txt font="bold" size={16} style={styles.form}>
              {data.conjugations[p.key]}
            </Txt>
          </View>
        ))}
      </HardShadowBox>

      {data.notes ? (
        <HardShadowBox background={colors.cream2} offset={Shadow.sm} contentStyle={styles.notes}>
          <Txt font="monoBold" size={10} color={Accent.blue} tracking={1.5}>
            NOTE
          </Txt>
          <Txt font="body" size={13} lineHeight={19}>
            {data.notes}
          </Txt>
        </HardShadowBox>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: Spacing.three },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  tagWrap: { position: 'relative' },
  tag: { borderWidth: Border.base, paddingVertical: 5, paddingHorizontal: Spacing.two },
  table: { paddingHorizontal: Spacing.three },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.three,
    gap: Spacing.three,
  },
  person: { width: 84 },
  form: { flex: 1, textAlign: 'right' },
  notes: { padding: Spacing.three, gap: Spacing.two },
});
