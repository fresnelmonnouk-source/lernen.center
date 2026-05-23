import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { Palette } from '@/theme/bauhaus';

/**
 * Root Stack navigator.
 *
 * Navigation model (decision A): a drill-down Stack from a card-based home,
 * mirroring the Bauhaus reference. The hierarchy is born at 2 menus
 * (Apprendre / Tester) — the legacy 4-menu web layout is never reproduced.
 */
export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: Palette.cream },
          headerTintColor: Palette.ink,
          headerTitleStyle: { fontWeight: '800' },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: Palette.cream },
        }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />

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
      </Stack>
    </>
  );
}
