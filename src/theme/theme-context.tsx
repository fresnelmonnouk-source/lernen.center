import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';

import { darkColors, lightColors, type ThemeColors } from './tokens';

type Mode = 'light' | 'dark';

type ThemeContextValue = {
  colors: ThemeColors;
  mode: Mode;
  isDark: boolean;
  /** Toggle and persist the user's explicit override. */
  toggle: () => void;
};

const STORAGE_KEY = 'lernen.theme';

const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * Theme provider. Defaults to the OS color scheme, but a user toggle overrides
 * it and is persisted. The stored preference wins on next launch.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const system = useColorScheme();
  const [override, setOverride] = useState<Mode | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (stored === 'light' || stored === 'dark') setOverride(stored);
      })
      .finally(() => setHydrated(true));
  }, []);

  const mode: Mode = override ?? (system === 'dark' ? 'dark' : 'light');

  const value = useMemo<ThemeContextValue>(
    () => ({
      colors: mode === 'dark' ? darkColors : lightColors,
      mode,
      isDark: mode === 'dark',
      toggle: () => {
        const next: Mode = mode === 'dark' ? 'light' : 'dark';
        setOverride(next);
        void AsyncStorage.setItem(STORAGE_KEY, next);
      },
    }),
    [mode],
  );

  // Avoid a theme flash: render nothing until the stored preference is read.
  if (!hydrated) return null;

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
}
