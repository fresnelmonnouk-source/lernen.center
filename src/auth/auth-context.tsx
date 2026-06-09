import type { Session } from '@supabase/supabase-js';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { withTimeout } from '@/lib/async';
import { supabase } from '@/lib/supabase';

/**
 * Bounds for the initial auth resolution. `getSession()` can hang while
 * refreshing an expired token on a flaky network — without a cap the app stays
 * on the splash forever. On timeout we treat the user as signed-out so the gate
 * routes to login (recoverable) instead of an infinite splash.
 */
const SESSION_TIMEOUT_MS = 10_000;
const PROFILE_TIMEOUT_MS = 12_000;

export type Profile = {
  id: string;
  display_name: string | null;
  current_level: string | null;
  onboarding_completed: boolean;
  streak_days: number;
  total_xp: number;
};

type AuthContextValue = {
  session: Session | null;
  profile: Profile | null;
  /** True until the initial session (and profile, if any) is resolved. */
  loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  /** Returns whether email confirmation is required before login. */
  signUpWithEmail: (email: string, password: string) => Promise<{ needsConfirmation: boolean }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

async function fetchProfile(userId: string): Promise<Profile | null> {
  // Wrapped in withTimeout so a wedged query resolves to null instead of holding
  // the caller (and, at startup, the loading gate) open indefinitely.
  return withTimeout(
    (async () => {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, display_name, current_level, onboarding_completed, streak_days, total_xp')
        .eq('id', userId)
        .maybeSingle();
      if (error) {
        console.warn('fetchProfile:', error.message);
        return null;
      }
      return (data as Profile) ?? null;
    })(),
    PROFILE_TIMEOUT_MS,
    null,
  );
}

/** Maps raw Supabase auth errors to short French messages for the UI. */
function mapAuthError(raw: string): string {
  const m = raw.toLowerCase();
  if (m.includes('invalid login')) return 'Email ou mot de passe incorrect.';
  if (m.includes('already') && m.includes('regist')) return 'Cet email a déjà un compte. Connecte-toi.';
  if (m.includes('password') && m.includes('6')) return 'Mot de passe trop court (6 caractères min.).';
  if (m.includes('not confirmed') || (m.includes('email') && m.includes('confirm'))) {
    return 'Email pas encore confirmé. Vérifie ta boîte mail.';
  }
  if (m.includes('valid email') || m.includes('invalid email')) return 'Email invalide.';
  return 'Connexion impossible. Réessaie dans un instant.';
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    void (async () => {
      // Bounded session read (see SESSION_TIMEOUT_MS): never let the splash hang.
      const initial = await withTimeout(
        supabase.auth.getSession().then((r) => r.data.session),
        SESSION_TIMEOUT_MS,
        null,
      );
      if (!active) return;
      setSession(initial);
      setLoading(false); // unblock the gate as soon as the session is known…
      if (initial) {
        // …then load the profile without gating navigation on it.
        const next = await fetchProfile(initial.user.id);
        if (active) setProfile(next);
      }
    })();

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, next) => {
      setSession(next);
      setLoading(false);
      setProfile(next ? await fetchProfile(next.user.id) : null);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      profile,
      loading,
      signInWithEmail: async (email, password) => {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (error) throw new Error(mapAuthError(error.message));
      },
      signUpWithEmail: async (email, password) => {
        const { data, error } = await supabase.auth.signUp({ email: email.trim(), password });
        if (error) throw new Error(mapAuthError(error.message));
        return { needsConfirmation: !data.session };
      },
      signOut: async () => {
        await supabase.auth.signOut();
      },
      refreshProfile: async () => {
        if (session) setProfile(await fetchProfile(session.user.id));
      },
    }),
    [session, profile, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
