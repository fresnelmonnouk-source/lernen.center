/**
 * Typed, validated access to public runtime config.
 *
 * Expo inlines `EXPO_PUBLIC_*` variables at build time, so they must be read by
 * their static names (no dynamic `process.env[key]`). We validate them once here
 * so a missing value fails fast with a clear message instead of a cryptic crash
 * deep in a network call.
 *
 * SECURITY: only public-by-design values live here (API URL, Supabase URL, anon
 * key). Server secrets (service_role, DeepSeek, Resend) never reach the client.
 */

function required(value: string | undefined, name: string): string {
  if (!value) {
    throw new Error(
      `Variable d'environnement manquante : ${name}. Copie .env.example vers .env et renseigne la valeur.`,
    );
  }
  return value;
}

export const env = {
  /** Base URL of the Vercel backend, without trailing slash. */
  apiBaseUrl: required(process.env.EXPO_PUBLIC_API_BASE_URL, 'EXPO_PUBLIC_API_BASE_URL').replace(/\/+$/, ''),
  supabaseUrl: required(process.env.EXPO_PUBLIC_SUPABASE_URL, 'EXPO_PUBLIC_SUPABASE_URL'),
  supabaseAnonKey: required(process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY, 'EXPO_PUBLIC_SUPABASE_ANON_KEY'),
  /** Dev flag: bypass the (auth) → onboarding gate. See .env.example. */
  devBypassAuth: process.env.EXPO_PUBLIC_DEV_BYPASS_AUTH === 'true',
} as const;
