import 'react-native-url-polyfill/auto';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { AppState } from 'react-native';

import { env } from './env';

/**
 * Supabase client for the mobile app.
 *
 * - Session is persisted in AsyncStorage and auto-refreshed (official Expo
 *   pattern). `detectSessionInUrl` is off because there is no browser URL.
 * - The anon key is public by design; row-level security is the real guard.
 * - `supabase.auth.getSession()` yields the access_token used as the Bearer
 *   JWT for the Vercel API (see lib/api/client.ts).
 */
export const supabase = createClient(env.supabaseUrl, env.supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Pause/resume token auto-refresh with app foreground state to avoid
// refreshing while backgrounded (recommended by Supabase for React Native).
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});
