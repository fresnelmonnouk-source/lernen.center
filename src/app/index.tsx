import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@/auth/auth-context';
import { ActionCard } from '@/components/ui/ActionCard';
import { BadgesGrid, type BadgeData } from '@/components/ui/Badges';
import { BrandMark } from '@/components/ui/BrandMark';
import { GridBackground } from '@/components/ui/GridBackground';
import { HeroCard } from '@/components/ui/HeroCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { StatGrid } from '@/components/ui/Stat';
import { StreakTag } from '@/components/ui/StreakTag';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Txt } from '@/components/ui/Txt';
import { useTheme } from '@/theme/theme-context';
import { Accent, MaxContentWidth, Spacing } from '@/theme/tokens';

// Placeholder data — wired to Supabase/profile in Phase 2.
const BADGES: BadgeData[] = [
  { icon: '🌱', earned: true },
  { icon: '🔥', earned: true },
  { icon: '📚' },
  { icon: '🎯' },
  { icon: '⭐' },
  { icon: '🏆' },
  { icon: '💎' },
  { icon: '🚀' },
  { icon: '🧠' },
  { icon: '🇩🇪' },
  { icon: '✍️' },
  { icon: '🎓' },
];

export default function HomeScreen() {
  const { colors } = useTheme();
  const { profile, signOut } = useAuth();
  const level = profile?.current_level ?? 'A1';
  const streak = profile?.streak_days ?? 0;
  return (
    <View style={[styles.root, { backgroundColor: colors.cream }]}>
      <GridBackground />
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.column}>
            <View style={styles.header}>
              <BrandMark />
              <View style={styles.headerRight}>
                <StreakTag days={streak} />
                <ThemeToggle />
              </View>
            </View>

            <HeroCard
              eyebrow={`PROGRESSION · NIVEAU ${level}`}
              value={0}
              total={30}
              label="Commence ton premier"
              labelAccent="cours."
            />

            <StatGrid
              stats={[
                { value: streak, label: 'jours série', accent: 'red' },
                { value: 0, label: 'mots vus', accent: 'yellow' },
                { value: 0, label: 'quiz faits', accent: 'blue' },
              ]}
            />

            <SectionHeader title="Que veux-tu" accent="faire ?" />
            <View style={styles.actions}>
              <ActionCard number="01" title="Apprendre" color={Accent.yellow} href="/apprendre" />
              <ActionCard number="02" title="Tester" color={Accent.red} foreground={colors.paper} href="/tester" />
            </View>

            <BadgesGrid badges={BADGES} />

            <Pressable onPress={signOut} style={styles.logout} accessibilityRole="button">
              <Txt font="monoBold" size={11} tone="ink2" uppercase tracking={1}>
                Se déconnecter
              </Txt>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  safe: {
    flex: 1,
  },
  content: {
    padding: Spacing.four,
    paddingBottom: Spacing.six,
  },
  column: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    gap: Spacing.four,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  logout: {
    alignItems: 'center',
    paddingVertical: Spacing.three,
  },
});
