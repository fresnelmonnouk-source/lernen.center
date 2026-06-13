import { Icon } from '@/components/ui/Icon';
import { IconButton } from '@/components/ui/IconButton';
import { useTheme } from '@/theme/theme-context';

/** Light/dark toggle rendered as an icon button. Shows the TARGET state's icon
 *  (moon in light = "switch to dark", sun in dark = "switch to light"). */
export function ThemeToggle() {
  const { isDark, toggle } = useTheme();
  return (
    <IconButton onPress={toggle} accessibilityLabel={isDark ? 'Passer en mode clair' : 'Passer en mode sombre'}>
      <Icon name={isDark ? 'sun' : 'moon'} size="sm" />
    </IconButton>
  );
}
