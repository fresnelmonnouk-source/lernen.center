import { StyleSheet, View } from 'react-native';

import { ButtonPrimary } from '@/components/ui/ButtonPrimary';
import { HardShadowBox } from '@/components/ui/HardShadowBox';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Txt } from '@/components/ui/Txt';
import { useTheme } from '@/theme/theme-context';
import { Accent, Border, Shadow, Spacing } from '@/theme/tokens';
import {
  getForms,
  LOCAL_TENSES,
  VERB_PERSONS,
  VERB_TYPE_LABEL,
  type VerbEntry,
} from '@/data/verbs';

type Props = { verb: VerbEntry; onBack: () => void };

/** Détail offline d'un verbe : 3 tables de temps + badges + note pédagogique. */
export function LocalDetail({ verb, onBack }: Props) {
  const { colors } = useTheme();
  const typeColor =
    verb.t === 'stark' ? Accent.red : verb.t === 'gemischt' ? Accent.purple : verb.t === 'modal' ? Accent.blue : Accent.green;

  return (
    <View style={styles.wrap}>
      <SectionHeader title={verb.v} accent={verb.f} />

      <View style={styles.tagsRow}>
        <Tag label={VERB_TYPE_LABEL[verb.t]} color={typeColor} />
        <Tag label={`Aux. ${verb.x}`} color={Accent.blue} />
        {verb.s ? <Tag label="Séparable" color={Accent.yellow} dark /> : null}
        <Tag label={verb.l} color={Accent.purple} />
      </View>

      {LOCAL_TENSES.map((tense) => {
        const forms = getForms(verb, tense);
        return (
          <View key={tense} style={styles.tenseBlock}>
            <Txt font="monoBold" size={11} color={Accent.blue} uppercase tracking={1.2}>
              {tense}
            </Txt>
            <HardShadowBox contentStyle={styles.table}>
              {VERB_PERSONS.map((p, i) => (
                <View
                  key={p}
                  style={[styles.row, i > 0 && { borderTopWidth: Border.thin, borderTopColor: colors.ink }]}>
                  <Txt font="mono" size={13} tone="ink2" style={styles.person}>
                    {p}
                  </Txt>
                  <Txt font="bold" size={16} style={styles.form}>
                    {forms[i]}
                  </Txt>
                </View>
              ))}
            </HardShadowBox>
          </View>
        );
      })}

      <HardShadowBox background={colors.cream2} offset={Shadow.sm} contentStyle={styles.notes}>
        <Txt font="monoBold" size={10} color={Accent.blue} tracking={1.5}>
          NOTE
        </Txt>
        <Txt font="body" size={13} lineHeight={19}>
          {verb.n}
        </Txt>
      </HardShadowBox>

      <ButtonPrimary label="Retour à la liste" icon="arrowLeft" iconPosition="left" onPress={onBack} color={Accent.blue} />
    </View>
  );
}

function Tag({ label, color, dark }: { label: string; color: string; dark?: boolean }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.tag, { backgroundColor: color, borderColor: colors.ink }]}>
      <Txt font="monoBold" size={10} color={dark ? '#0A0A0A' : '#FFFFFF'} uppercase tracking={0.5}>
        {label}
      </Txt>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: Spacing.three },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  tag: { borderWidth: Border.base, paddingVertical: 5, paddingHorizontal: Spacing.two },
  tenseBlock: { gap: Spacing.two },
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
