import { Pressable, StyleSheet, View } from 'react-native';

import { HardShadowBox } from '@/components/ui/HardShadowBox';
import { Txt } from '@/components/ui/Txt';
import { useTheme } from '@/theme/theme-context';
import { Accent, ArticleColor, Border, LevelColor, Shadow, Spacing } from '@/theme/tokens';
import type { VocabWord } from '@/data/vocabulary';

type Props = { word: VocabWord; revealed: boolean; onPress: () => void };

/**
 * Flashcard d'un mot. Recto (toujours visible) : allemand coloré selon l'article
 * (der=bleu, die=rouge, das=vert) + emoji + badge niveau. Verso (révélé au tap) :
 * traduction française. Tap = bascule recto/verso.
 */
export function Flashcard({ word, revealed, onPress }: Props) {
  const { colors } = useTheme();
  const articleColor = word.a ? ArticleColor[word.a] : Accent.blue;

  return (
    <Pressable accessibilityRole="button" accessibilityState={{ expanded: revealed }} onPress={onPress}>
      <HardShadowBox offset={Shadow.lg} contentStyle={styles.card}>
        <View style={styles.top}>
          <View style={[styles.level, { backgroundColor: LevelColor[word.l], borderColor: colors.ink }]}>
            <Txt font="monoBold" size={11} color="#0A0A0A" tracking={0.8}>
              {word.l}
            </Txt>
          </View>
          {word.a ? (
            <Txt font="monoBold" size={11} color={articleColor} uppercase tracking={1.2}>
              {word.a}
            </Txt>
          ) : null}
        </View>

        {word.e ? (
          <Txt size={52} style={styles.emoji}>
            {word.e}
          </Txt>
        ) : null}

        <Txt font="display" size={30} color={articleColor} tracking={-0.5} style={styles.de}>
          {word.d}
        </Txt>

        {revealed ? (
          <Txt font="serifItalic" size={22} tone="ink2" style={styles.fr}>
            {word.f}
          </Txt>
        ) : (
          <Txt font="monoBold" size={10} tone="ink2" uppercase tracking={1.5} style={styles.fr}>
            Tap pour la traduction
          </Txt>
        )}
      </HardShadowBox>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 240,
    padding: Spacing.four,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.three,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    justifyContent: 'space-between',
  },
  level: {
    borderWidth: Border.base,
    paddingVertical: 3,
    paddingHorizontal: Spacing.two,
  },
  emoji: { textAlign: 'center' },
  de: { textAlign: 'center' },
  fr: { textAlign: 'center' },
});
