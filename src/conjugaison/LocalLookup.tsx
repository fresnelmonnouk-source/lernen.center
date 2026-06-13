import { Pressable, StyleSheet, View } from 'react-native';

import { HardShadowBox } from '@/components/ui/HardShadowBox';
import { Icon } from '@/components/ui/Icon';
import { Txt } from '@/components/ui/Txt';
import { useTheme } from '@/theme/theme-context';
import { Accent, Border, LevelColor, Shadow, Spacing } from '@/theme/tokens';
import type { VerbEntry } from '@/data/verbs';
import { VERB_TYPE_LABEL } from '@/data/verbs';

type Props = { verbs: readonly VerbEntry[]; onPick: (v: VerbEntry) => void };

/** Liste compacte des verbes filtrés. Tap = ouvre le détail local. */
export function LocalLookup({ verbs, onPick }: Props) {
  const { colors } = useTheme();
  if (verbs.length === 0) {
    return (
      <Txt font="mono" size={13} tone="ink2">
        Aucun verbe pour ce filtre.
      </Txt>
    );
  }
  return (
    <View style={styles.list}>
      {verbs.map((v) => {
        const typeColor =
          v.t === 'stark' ? Accent.red : v.t === 'gemischt' ? Accent.purple : v.t === 'modal' ? Accent.blue : Accent.green;
        return (
          <HardShadowBox
            key={v.v}
            background={colors.paper}
            offset={Shadow.sm}
            style={styles.cardWrap}
            contentStyle={styles.card}>
            <View style={styles.head}>
              <Txt font="bold" size={18} color={colors.ink}>
                {v.v}
              </Txt>
              <View style={[styles.levelChip, { backgroundColor: LevelColor[v.l], borderColor: colors.ink }]}>
                <Txt font="monoBold" size={10} color="#0A0A0A" tracking={0.5}>
                  {v.l}
                </Txt>
              </View>
            </View>
            <Txt font="serifItalic" size={14} tone="ink2">
              {v.f}
            </Txt>
            <View style={styles.tagsRow}>
              <Tag label={VERB_TYPE_LABEL[v.t]} color={typeColor} />
              <Tag label={`Aux. ${v.x}`} color={Accent.blue} />
              {v.s ? <Tag label="Séparable" color={Accent.yellow} dark /> : null}
            </View>
            <Pressable style={styles.cta} onPress={() => onPick(v)} accessibilityRole="button" hitSlop={6}>
              <Txt font="monoBold" size={10} color={Accent.blue} uppercase tracking={1.2}>
                Voir conjugaisons
              </Txt>
              <Icon name="arrowRight" size="sm" color={Accent.blue} />
            </Pressable>
          </HardShadowBox>
        );
      })}
    </View>
  );
}

function Tag({ label, color, dark }: { label: string; color: string; dark?: boolean }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.tag, { backgroundColor: color, borderColor: colors.ink }]}>
      <Txt font="monoBold" size={9} color={dark ? '#0A0A0A' : '#FFFFFF'} uppercase tracking={0.5}>
        {label}
      </Txt>
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: Spacing.two },
  cardWrap: {},
  card: { padding: Spacing.three, gap: Spacing.two },
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  levelChip: { borderWidth: Border.base, paddingVertical: 2, paddingHorizontal: Spacing.two },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  tag: { borderWidth: Border.thin, paddingVertical: 3, paddingHorizontal: Spacing.two },
  cta: { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start', marginTop: 2 },
});
