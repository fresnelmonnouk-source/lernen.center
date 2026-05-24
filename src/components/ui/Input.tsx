import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { Txt } from '@/components/ui/Txt';
import { useTheme } from '@/theme/theme-context';
import { Accent, Border, Fonts, Shadow, Spacing } from '@/theme/tokens';

type Props = TextInputProps & {
  /** Monospace eyebrow label above the field. */
  label?: string;
  /** Red error message shown below; also reddens the border. */
  error?: string;
};

/** Brutalist labelled text field: paper surface, hard shadow, sharp border. */
export function Input({ label, error, style, ...rest }: Props) {
  const { colors } = useTheme();
  return (
    <View style={styles.wrap}>
      {label ? (
        <Txt font="monoBold" size={10} tone="ink2" uppercase tracking={1.5}>
          {label}
        </Txt>
      ) : null}
      <View>
        <View
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: colors.ink, transform: [{ translateX: Shadow.sm }, { translateY: Shadow.sm }] },
          ]}
        />
        <TextInput
          {...rest}
          placeholderTextColor={colors.ink2}
          style={[
            {
              backgroundColor: colors.paper,
              borderColor: error ? Accent.red : colors.ink,
              borderWidth: Border.base,
              color: colors.ink,
              fontFamily: Fonts.body,
              fontSize: 16,
              paddingVertical: Spacing.three,
              paddingHorizontal: Spacing.three,
            },
            style,
          ]}
        />
      </View>
      {error ? (
        <Txt font="mono" size={10} color={Accent.red} uppercase tracking={0.5}>
          {error}
        </Txt>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: Spacing.one },
});
