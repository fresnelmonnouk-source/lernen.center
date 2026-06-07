// Import per-weight subpaths (not the package root) so Metro bundles only the
// 9 font files we use, instead of every weight/italic in each family.
import { BricolageGrotesque_400Regular } from '@expo-google-fonts/bricolage-grotesque/400Regular';
import { BricolageGrotesque_500Medium } from '@expo-google-fonts/bricolage-grotesque/500Medium';
import { BricolageGrotesque_700Bold } from '@expo-google-fonts/bricolage-grotesque/700Bold';
import { BricolageGrotesque_800ExtraBold } from '@expo-google-fonts/bricolage-grotesque/800ExtraBold';
import { DMSerifDisplay_400Regular } from '@expo-google-fonts/dm-serif-display/400Regular';
import { DMSerifDisplay_400Regular_Italic } from '@expo-google-fonts/dm-serif-display/400Regular_Italic';
import { JetBrainsMono_400Regular } from '@expo-google-fonts/jetbrains-mono/400Regular';
import { JetBrainsMono_500Medium } from '@expo-google-fonts/jetbrains-mono/500Medium';
import { JetBrainsMono_700Bold } from '@expo-google-fonts/jetbrains-mono/700Bold';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View } from 'react-native';

import { AuthProvider, useAuth } from '@/auth/auth-context';
import { BrandSplash } from '@/components/ui/BrandSplash';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { env } from '@/lib/env';
import { ThemeProvider, useTheme } from '@/theme/theme-context';
import { Accent, Fonts } from '@/theme/tokens';
import { Txt } from '@/components/ui/Txt';

SplashScreen.preventAutoHideAsync();

/**
 * Root layout: load the 3 Bauhaus font families (gate the UI behind the splash
 * until ready), then provide the theme and a themed drill-down Stack. The
 * hierarchy is born at 2 menus (Apprendre / Tester).
 */
export default function RootLayout() {
  const [loaded, error] = useFonts({
    BricolageGrotesque_400Regular,
    BricolageGrotesque_500Medium,
    BricolageGrotesque_700Bold,
    BricolageGrotesque_800ExtraBold,
    DMSerifDisplay_400Regular,
    DMSerifDisplay_400Regular_Italic,
    JetBrainsMono_400Regular,
    JetBrainsMono_500Medium,
    JetBrainsMono_700Bold,
  });

  useEffect(() => {
    if (loaded || error) SplashScreen.hideAsync();
  }, [loaded, error]);

  if (!loaded && !error) return null;

  return (
    <ThemeProvider>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </ThemeProvider>
  );
}

function RootNavigator() {
  const { colors, isDark } = useTheme();
  const { session, profile, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  // Session gate: route between (auth) → onboarding → app.
  // DEV bypass : when EXPO_PUBLIC_DEV_BYPASS_AUTH=true, skip the gate entirely
  // so screens can be inspected without a Supabase session. Any code path that
  // calls Supabase or the backend will still fail (no token) — by design.
  useEffect(() => {
    if (env.devBypassAuth) {
      const inAuth = segments[0] === '(auth)';
      const inOnboarding = segments[0] === 'onboarding';
      if (inAuth || inOnboarding) router.replace('/');
      return;
    }
    if (loading) return;
    const inAuth = segments[0] === '(auth)';
    const inOnboarding = segments[0] === 'onboarding';
    const onboarded = profile?.onboarding_completed === true;
    if (!session && !inAuth) {
      router.replace('/login');
    } else if (session && !onboarded && !inOnboarding) {
      router.replace('/onboarding');
    } else if (session && onboarded && (inAuth || inOnboarding)) {
      router.replace('/');
    }
  }, [loading, session, profile, segments, router]);

  if (loading && !env.devBypassAuth) {
    return <BrandSplash />;
  }

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      {env.devBypassAuth ? (
        <View
          style={{
            backgroundColor: Accent.yellow,
            paddingVertical: 4,
            alignItems: 'center',
          }}>
          <Txt font="monoBold" size={10} color="#0A0A0A" uppercase tracking={1.5}>
            DEV · auth bypassée
          </Txt>
        </View>
      ) : null}
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.cream },
          headerTintColor: colors.ink,
          headerTitleStyle: { fontFamily: Fonts.display, color: colors.ink },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: colors.cream },
          headerRight: () => (
            <View style={{ marginRight: 4 }}>
              <ThemeToggle />
            </View>
          ),
        }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />

        {/* APPRENDRE */}
        <Stack.Screen name="apprendre/index" options={{ title: 'APPRENDRE' }} />
        <Stack.Screen name="apprendre/cours" options={{ title: 'COURS' }} />
        <Stack.Screen name="apprendre/decouvrir/index" options={{ title: 'DÉCOUVRIR' }} />
        <Stack.Screen name="apprendre/decouvrir/vocabulaire" options={{ title: 'VOCABULAIRE' }} />
        <Stack.Screen name="apprendre/decouvrir/conjugaison" options={{ title: 'CONJUGAISON' }} />

        {/* TESTER */}
        <Stack.Screen name="tester/index" options={{ title: 'TESTER' }} />
        <Stack.Screen name="tester/quiz" options={{ title: 'QUIZ' }} />
        <Stack.Screen name="tester/examen/index" options={{ title: 'EXAMEN' }} />
        <Stack.Screen name="tester/examen/test-ia" options={{ title: 'TEST IA' }} />
        <Stack.Screen name="tester/examen/certification/index" options={{ title: 'CERTIFICATION' }} />
        <Stack.Screen name="tester/examen/certification/lesen" options={{ title: 'LESEN' }} />
        <Stack.Screen name="tester/examen/certification/schreiben" options={{ title: 'SCHREIBEN' }} />

        {/* COMPTE */}
        <Stack.Screen name="profil" options={{ title: 'PROFIL' }} />
        <Stack.Screen name="legal/index" options={{ title: 'LÉGAL' }} />
      </Stack>
    </>
  );
}
