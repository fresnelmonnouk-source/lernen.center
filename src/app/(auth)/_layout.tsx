import { Stack } from 'expo-router';

import { useTheme } from '@/theme/theme-context';

/** Auth group: no header, themed background. Gating lives in the root layout. */
export default function AuthLayout() {
  const { colors } = useTheme();
  return <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.cream } }} />;
}
