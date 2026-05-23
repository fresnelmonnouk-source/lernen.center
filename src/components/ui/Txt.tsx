import { Text, type TextProps } from 'react-native';

import { useTheme } from '@/theme/theme-context';
import { Fonts, type ThemeColors } from '@/theme/tokens';

type Props = TextProps & {
  /** Font family key. Default: body (Bricolage 400). */
  font?: keyof typeof Fonts;
  size?: number;
  /** Theme surface color key, resolved against the active theme. Default ink. */
  tone?: keyof ThemeColors;
  /** Explicit color (wins over `tone`). */
  color?: string;
  uppercase?: boolean;
  /** letterSpacing in px. */
  tracking?: number;
  lineHeight?: number;
};

/**
 * Themed text primitive. Centralizes font family + theme color so no screen
 * hardcodes a Bricolage/DM Serif/JetBrains name or a raw hex.
 */
export function Txt({
  font = 'body',
  size,
  tone = 'ink',
  color,
  uppercase,
  tracking,
  lineHeight,
  style,
  ...rest
}: Props) {
  const { colors } = useTheme();
  return (
    <Text
      {...rest}
      style={[
        {
          fontFamily: Fonts[font],
          color: color ?? colors[tone],
          ...(size != null ? { fontSize: size } : null),
          ...(uppercase ? { textTransform: 'uppercase' } : null),
          ...(tracking != null ? { letterSpacing: tracking } : null),
          ...(lineHeight != null ? { lineHeight } : null),
        },
        style,
      ]}
    />
  );
}
