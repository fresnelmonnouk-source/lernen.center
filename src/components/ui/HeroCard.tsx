import { StyleSheet, View } from 'react-native';

import { Txt } from '@/components/ui/Txt';
import { useTheme } from '@/theme/theme-context';
import { Accent, Border, Shadow, Spacing } from '@/theme/tokens';

type Props = {
  eyebrow: string;
  /** Big foreground number (e.g. completed count). */
  value: string | number;
  /** Smaller "/ total" shown after the value. */
  total?: string | number;
  /** Serif-italic caption under the number. */
  label: string;
  /** Optional italic-yellow accent appended to the label. */
  labelAccent?: string;
};

/**
 * Decorated hero card (`.hero`): ink surface, cream text, a red circle and a
 * rotated yellow square bleeding off the edges, an eyebrow chip, an oversized
 * number with a DM-Serif slash, and a serif caption.
 */
export function HeroCard({ eyebrow, value, total, label, labelAccent }: Props) {
  const { colors } = useTheme();
  const cream = colors.cream;

  return (
    <View style={styles.wrap}>
      <View style={[styles.shadow, { backgroundColor: colors.ink }]} />
      <View style={[styles.hero, { backgroundColor: colors.ink, borderColor: colors.ink }]}>
        <View style={[styles.circle, { backgroundColor: Accent.red }]} />
        {/* Carré déco en BLEU (pas yellow) : l'accent jaune du label peut passer
            par-dessus → jaune-sur-jaune illisible. Bleu = lisible + 3 primaires Bauhaus. */}
        <View style={[styles.square, { backgroundColor: Accent.blue }]} />

        <View style={styles.content}>
          <View style={[styles.eyebrowChip, { backgroundColor: cream, borderColor: cream }]}>
            <Txt font="monoBold" size={10} color={colors.ink} uppercase tracking={1.2}>
              {eyebrow}
            </Txt>
          </View>

          <View style={styles.numberRow}>
            <Txt font="display" size={88} color={cream} tracking={-4} lineHeight={80}>
              {value}
            </Txt>
            {total != null ? (
              <>
                <Txt font="serifItalic" size={56} color={Accent.yellow} lineHeight={80}>
                  {' '}/{' '}
                </Txt>
                <Txt font="medium" size={32} color={colors.cream3} lineHeight={80}>
                  {total}
                </Txt>
              </>
            ) : null}
          </View>

          <Txt font="serifItalic" size={20} color={cream} lineHeight={24}>
            {label}
            {labelAccent ? (
              <Txt font="serifItalic" size={20} color={Accent.yellow}>
                {' '}
                {labelAccent}
              </Txt>
            ) : null}
          </Txt>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'relative',
  },
  shadow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    transform: [{ translateX: Shadow.lg }, { translateY: Shadow.lg }],
  },
  hero: {
    borderWidth: Border.base,
    paddingTop: 28,
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.four,
    overflow: 'hidden',
  },
  circle: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    top: -60,
    right: -60,
  },
  square: {
    position: 'absolute',
    width: 60,
    height: 60,
    bottom: 20,
    right: 30,
    transform: [{ rotate: '15deg' }],
  },
  content: {
    position: 'relative',
    zIndex: 1,
  },
  eyebrowChip: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderWidth: Border.thin,
    marginBottom: Spacing.four,
  },
  numberRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: Spacing.three,
  },
});
