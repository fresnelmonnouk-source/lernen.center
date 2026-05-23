/**
 * Néo-Bauhaus brutalist design tokens.
 * Source of truth: lernen-de-all/reference-design/lernen-bauhaus.html
 *
 * Phase 0 note: only the core palette + scale are ported here to give the
 * navigation skeleton an on-brand look. The full component system (decorated
 * hero, badges grid, streak tag, dark mode) is Phase 1.
 */

export const Palette = {
  cream: '#F4F0E6', // fond principal
  cream2: '#ECE5D2',
  cream3: '#DDD3B8',
  ink: '#0A0A0A', // noir principal
  ink2: '#1F1F1F',
  paper: '#FFFFFF',
  red: '#E63946',
  yellow: '#FFD60A',
  blue: '#1E40AF',
  green: '#16A34A',
  purple: '#9333EA',
} as const;

/** Couleurs des articles allemands (signature pédagogique). */
export const ArticleColor = {
  der: Palette.blue, // masculin
  die: Palette.red, // féminin
  das: Palette.green, // neutre
} as const;

/** Couleurs par niveau CECRL. */
export const LevelColor = {
  A1: Palette.green,
  A2: Palette.yellow,
  B1: Palette.red,
  B2: Palette.purple,
} as const;

/**
 * Ombres brutalistes : décalées, nettes, JAMAIS de blur.
 * En React Native, l'offset net se rend via une View décalée
 * (voir components/ui/HardShadowBox), pas via les props shadow / elevation.
 */
export const ShadowOffset = {
  sm: 2,
  md: 4,
  lg: 6,
  xl: 8,
} as const;

export const Border = {
  thin: 1.5,
  base: 2.5,
} as const;

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const Radius = {
  none: 0,
  sm: 4,
} as const;
