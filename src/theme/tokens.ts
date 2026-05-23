/**
 * Néo-Bauhaus brutalist design tokens — single source of truth.
 * Ported 1:1 from lernen-de-all/reference-design/lernen-bauhaus.html (:root).
 *
 * - `surfaces` invert between light/dark (cream/ink/paper).
 * - `Accent` hues (red/yellow/blue/green) stay identical in both themes.
 * - Hard brutalist shadows are offsets (no blur); rendered via HardShadowBox
 *   (a stacked View), never RN shadow/elevation.
 * - Brutalist = sharp corners. No border-radius on cards/buttons.
 */

export type ThemeColors = {
  cream: string; // page background
  cream2: string;
  cream3: string;
  ink: string; // primary text + borders + shadows
  ink2: string;
  paper: string; // card surface
};

export const lightColors: ThemeColors = {
  cream: '#F4F0E6',
  cream2: '#ECE5D2',
  cream3: '#DDD3B8',
  ink: '#0A0A0A',
  ink2: '#1F1F1F',
  paper: '#FFFFFF',
};

export const darkColors: ThemeColors = {
  cream: '#0A0A0A',
  cream2: '#181818',
  cream3: '#242424',
  ink: '#F4F0E6',
  ink2: '#DDD3B8',
  paper: '#181818',
};

/** Accent hues — fixed in both themes (used for cards, markers, articles). */
export const Accent = {
  red: '#E63946',
  redDark: '#C42937',
  yellow: '#FFD60A',
  yellowDark: '#E8B800',
  blue: '#1E40AF',
  blueDark: '#163382',
  green: '#16A34A',
  greenDark: '#128039',
  purple: '#9333EA',
} as const;

/** German article colors (signature pedagogy): der=blue, die=red, das=green. */
export const ArticleColor = {
  der: Accent.blue,
  die: Accent.red,
  das: Accent.green,
} as const;

/** CECRL level colors. */
export const LevelColor = {
  A1: Accent.green,
  A2: Accent.yellow,
  B1: Accent.red,
  B2: Accent.purple,
} as const;

/** Loaded @expo-google-fonts family names (must match exactly). */
export const Fonts = {
  display: 'BricolageGrotesque_800ExtraBold', // titres, brand, gros chiffres
  bold: 'BricolageGrotesque_700Bold', // titres de carte, boutons
  medium: 'BricolageGrotesque_500Medium',
  body: 'BricolageGrotesque_400Regular',
  serif: 'DMSerifDisplay_400Regular',
  serifItalic: 'DMSerifDisplay_400Regular_Italic', // accents élégants, traductions
  mono: 'JetBrainsMono_400Regular',
  monoMedium: 'JetBrainsMono_500Medium',
  monoBold: 'JetBrainsMono_700Bold', // eyebrows, labels techniques
} as const;

/** Hard-shadow offsets in px (no blur). */
export const Shadow = { sm: 2, md: 4, lg: 6, xl: 8 } as const;

export const Border = { thin: 1.5, base: 2.5 } as const;

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

/** Max content width (the reference app is a 480px centered column). */
export const MaxContentWidth = 480;
