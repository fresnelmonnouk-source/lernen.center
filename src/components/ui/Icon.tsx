import {
  ArrowLeft,
  ArrowLeftRight,
  ArrowRight,
  ArrowUpRight,
  Award,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Lock,
  Minus,
  Moon,
  RotateCcw,
  Sun,
  TriangleAlert,
  X,
} from 'lucide-react-native';

import { useTheme } from '@/theme/theme-context';
import { IconSize, IconStroke } from '@/theme/tokens';

/**
 * Central icon registry (Néo-Bauhaus icon system — see docs/visual-brand.md §9).
 * Screens import THIS wrapper, never `lucide-react-native` directly: that keeps the
 * stroke weight, sizing and a11y rules consistent everywhere.
 */
const REGISTRY = {
  arrowRight: ArrowRight, // liens / CTA / navigation
  arrowLeft: ArrowLeft, // retour
  chevronLeft: ChevronLeft, // pager précédent
  chevronRight: ChevronRight, // pager suivant
  chevronDown: ChevronDown, // déplier (collapsible fermé)
  chevronUp: ChevronUp, // replier (collapsible ouvert)
  arrowUpRight: ArrowUpRight, // carte cliquable (coin) / "ouvre vers"
  check: Check, // succès / connu / correct
  x: X, // erreur / incorrect
  partial: Minus, // réponse partielle (mi-correcte)
  rotateCcw: RotateCcw, // à revoir / refaire
  swap: ArrowLeftRight, // bascule de sens (DE↔FR)
  sun: Sun, // thème clair
  moon: Moon, // thème sombre
  warning: TriangleAlert, // avertissement
  lock: Lock, // verrouillé (V2)
  award: Award, // note d'examen (couleur = score)
} as const;

export type IconName = keyof typeof REGISTRY;
type SizeKey = keyof typeof IconSize; // 'sm' | 'md' | 'lg'

type Props = {
  name: IconName;
  /** Token ('sm' 18 / 'md' 20 / 'lg' 24) or explicit px. Default 'md'. */
  size?: SizeKey | number;
  /** Stroke color. Default = theme ink. On accent backgrounds pass accentForeground(bg). */
  color?: string;
  /** Accessible label. When omitted, the icon is hidden from the a11y tree (decorative). */
  label?: string;
};

/** Stroke for an arbitrary px size (keeps the line from clogging at small sizes). */
function strokeForPx(px: number): number {
  if (px <= 18) return IconStroke.sm;
  if (px <= 20) return IconStroke.md;
  return IconStroke.lg;
}

/** Brutalist icon wrapper. The ONLY sanctioned way to render a lucide icon. */
export function Icon({ name, size = 'md', color, label }: Props) {
  const { colors } = useTheme();
  const px = typeof size === 'number' ? size : IconSize[size];
  const stroke = typeof size === 'number' ? strokeForPx(px) : IconStroke[size];
  const Glyph = REGISTRY[name];

  return (
    <Glyph
      size={px}
      color={color ?? colors.ink}
      strokeWidth={stroke}
      accessible={!!label}
      accessibilityLabel={label}
      accessibilityElementsHidden={!label}
      importantForAccessibility={label ? 'yes' : 'no-hide-descendants'}
    />
  );
}
