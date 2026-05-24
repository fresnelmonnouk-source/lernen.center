import type { Session } from '@supabase/supabase-js';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { supabase } from '@/lib/supabase';

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
}

/** Maps raw Supabase auth errors to short French messages for the UI. */
function mapAuthError(raw: string): string {
  const m = raw.toLowerCase();
  if (m.includes('invalid login')) return 'Email ou mot de passe incorrect.';
  if (m.includes('already') && m.includes('regist')) return 'Un compte existe déjà avec cet email.';
  if (m.includes('password') && m.includes('6')) return 'Mot de passe : 6 caractères minimum.';
  if (m.includes('not confirmed') || (m.includes('email') && m.includes('confirm'))) {
    return 'Confirme ton email avant de te connecter.';
  }
  if (m.includes('valid email') || m.includes('invalid email')) return 'Email invalide.';
  return 'Une erreur est survenue. Réessaie.';
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return;
      setSession(data.session);
      if (data.session) setProfile(await fetchProfile(data.session.user.id));
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, next) => {
      setSession(next);
      setProfile(next ? await fetchProfile(next.user.id) : null);
      setLoading(false);
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
