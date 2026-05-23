import { IconButton } from '@/components/ui/IconButton';
import { Txt } from '@/components/ui/Txt';
import { useTheme } from '@/theme/theme-context';

/** Light/dark toggle rendered as an icon button (sun ↔ moon). */
export function ThemeToggle() {
  const { isDark, toggle } = useTheme();
  return (
    <IconButton onPress={toggle} accessibilityLabel={isDark ? 'Passer en mode clair' : 'Passer en mode sombre'}>
      <Txt size={18}>{isDark ? '☀' : '☾'}</Txt>
    </IconButton>
  );
}
