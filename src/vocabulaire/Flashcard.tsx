import { Pressable, StyleSheet, View } from 'react-native';

import { HardShadowBox } from '@/components/ui/HardShadowBox';
import { Txt } from '@/components/ui/Txt';
import { useTheme } from '@/theme/theme-context';
import { Accent, ArticleColor, Border, LevelColor, Shadow, Spacing } from '@/theme/tokens';
import type { VocabWord } from '@/data/vocabulary';
import type { WordStatus } from '@/vocabulaire/status-store';

export type FlashDirection = 'de-fr' | 'fr-de';

type Props = {
  word: VocabWord;
  revealed: boolean;
  onPress: () => void;
  /** Sens de la flashcard. 'de-fr' (défaut) montre l'allemand, révèle le FR ;
   *  'fr-de' montre le FR (avec emoji), révèle l'allemand coloré. */
  direction?: FlashDirection;
  /** Status actuel du mot (connu / à revoir / null = non vu). */
  status?: WordStatus | null;
  /** Mutation du status. Si fourni, les boutons « ✓ Connu / ↺ À revoir » s'affichent
   *  une fois la carte révélée. Passe `null` pour réinitialiser. */
  onSetStatus?: (s: WordStatus | null) => void;
};

/**
 * Flashcard d'un mot. Recto = la face « question », verso = la face « réponse ».
 * Sens DE→FR : recto allemand coloré + emoji + badge niveau ; verso traduction FR.
 * Sens FR→DE : recto français + emoji + niveau ; verso allemand coloré.
 * Tap = bascule recto/verso. Boutons status visibles uniquement après révélation.
 */
export function Flashcard({ word, revealed, onPress, direction = 'de-fr', status, onSetStatus }: Props) {
  const { colors } = useTheme();
  const articleColor = word.a ? ArticleColor[word.a] : Accent.blue;
  const showDeFront = direction === 'de-fr';

  return (
    <View style={styles.stack}>
      <Pressable accessibilityRole="button" accessibilityState={{ expanded: revealed }} onPress={onPress}>
        <HardShadowBox offset={Shadow.lg} contentStyle={styles.card}>
          <View style={styles.top}>
            <View style={[styles.level, { backgroundColor: LevelColor[word.l], borderColor: colors.ink }]}>
              <Txt font="monoBold" size={11} color="#0A0A0A" tracking={0.8}>
                {word.l}
              </Txt>
            </View>
            <View style={styles.topRight}>
              {status === 'known' ? <StatusBadge label="Connu" color={Accent.green} /> : null}
              {status === 'review' ? <StatusBadge label="À revoir" color={Accent.red} /> : null}
              {word.a ? (
                <Txt font="monoBold" size={11} color={articleColor} uppercase tracking={1.2}>
                  {word.a}
                </Txt>
              ) : null}
            </View>
          </View>

          {word.e ? (
            <Txt size={52} style={styles.emoji}>
              {word.e}
            </Txt>
          ) : null}

          {showDeFront ? (
            <>
              <Txt font="display" size={30} color={articleColor} tracking={-0.5} style={styles.center}>
                {word.d}
              </Txt>
              {revealed ? (
                <Txt font="serifItalic" size={22} tone="ink2" style={styles.center}>
                  {word.f}
                </Txt>
              ) : (
                <Txt font="monoBold" size={10} tone="ink2" uppercase tracking={1.5} style={styles.center}>
                  Toucher pour traduire
                </Txt>
              )}
            </>
          ) : (
            <>
              <Txt font="display" size={28} style={[styles.center, { color: colors.ink }]}>
                {word.f}
              </Txt>
              {revealed ? (
                <Txt font="display" size={26} color={articleColor} tracking={-0.5} style={styles.center}>
                  {word.d}
                </Txt>
              ) : (
                <Txt font="monoBold" size={10} tone="ink2" uppercase tracking={1.5} style={styles.center}>
                  Toucher pour révéler
                </Txt>
              )}
            </>
          )}
        </HardShadowBox>
      </Pressable>

      {revealed && onSetStatus ? (
        <View style={styles.statusRow}>
          <StatusButton
            label="✓ Connu"
            color={Accent.green}
            active={status === 'known'}
            onPress={() => onSetStatus(status === 'known' ? null : 'known')}
          />
          <StatusButton
            label="↺ À revoir"
            color={Accent.red}
            active={status === 'review'}
            onPress={() => onSetStatus(status === 'review' ? null : 'review')}
          />
        </View>
      ) : null}
    </View>
  );
}

function StatusBadge({ label, color }: { label: string; color: string }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.statusBadge, { backgroundColor: color, borderColor: colors.ink }]}>
      <Txt font="monoBold" size={9} color="#FFFFFF" uppercase tracking={0.5}>
        {label}
      </Txt>
    </View>
  );
}

function StatusButton({
  label,
  color,
  active,
  onPress,
}: {
  label: string;
  color: string;
  active: boolean;
  onPress: () => void;
}) {
  const { colors } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={styles.statusBtnWrap}>
      <View
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: colors.ink, transform: [{ translateX: Shadow.sm }, { translateY: Shadow.sm }] },
        ]}
      />
      <View
        style={[
          styles.statusBtn,
          { backgroundColor: active ? color : colors.paper, borderColor: colors.ink },
        ]}>
        <Txt font="monoBold" size={11} color={active ? '#FFFFFF' : colors.ink} uppercase tracking={0.5}>
          {label}
        </Txt>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  stack: { gap: Spacing.two },
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
  topRight: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  level: { borderWidth: Border.base, paddingVertical: 3, paddingHorizontal: Spacing.two },
  statusBadge: { borderWidth: Border.thin, paddingVertical: 2, paddingHorizontal: Spacing.two },
  emoji: { textAlign: 'center' },
  center: { textAlign: 'center' },
  statusRow: { flexDirection: 'row', gap: Spacing.two },
  statusBtnWrap: { flex: 1, position: 'relative' },
  statusBtn: {
    borderWidth: Border.base,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.two,
    alignItems: 'center',
  },
});
