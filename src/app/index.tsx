import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ActionCard } from '@/components/ui/ActionCard';
import { Palette, Spacing } from '@/theme/bauhaus';

/** Accueil : marque, hero de progression, et les 2 menus principaux. */
export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.brand}>
          LERNEN<Text style={styles.brandDot}>.de</Text>
        </Text>

        {/* Hero card — placeholder de progression (données réelles en Phase 2). */}
        <View style={styles.hero}>
          <View style={styles.heroCircle} />
          <View style={styles.heroSquare} />
          <Text style={styles.heroEyebrow}>TON ALLEMAND · NIVEAU A1</Text>
          <Text style={styles.heroNumber}>
            0<Text style={styles.heroSlash}>/</Text>
            <Text style={styles.heroTotal}>30</Text>
          </Text>
          <Text style={styles.heroCaption}>cours complétés cette saison</Text>
        </View>

        <View style={styles.cards}>
          <ActionCard number="01" title="Apprendre" color={Palette.yellow} href="/apprendre" />
          <ActionCard number="02" title="Tester" color={Palette.red} foreground={Palette.cream} href="/tester" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Palette.cream,
  },
  content: {
    padding: Spacing.four,
    gap: Spacing.four,
    paddingBottom: Spacing.six,
  },
  brand: {
    fontSize: 30,
    fontWeight: '800',
    color: Palette.ink,
    letterSpacing: -1,
  },
  brandDot: {
    fontStyle: 'italic',
    fontWeight: '400',
    color: Palette.red,
  },
  hero: {
    backgroundColor: Palette.ink,
    borderRadius: 4,
    padding: Spacing.four,
    overflow: 'hidden',
    minHeight: 180,
    justifyContent: 'flex-end',
  },
  heroCircle: {
    position: 'absolute',
    top: -60,
    right: -40,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: Palette.red,
  },
  heroSquare: {
    position: 'absolute',
    bottom: 16,
    right: 24,
    width: 60,
    height: 60,
    backgroundColor: Palette.yellow,
    transform: [{ rotate: '15deg' }],
  },
  heroEyebrow: {
    fontFamily: 'monospace',
    fontSize: 10,
    letterSpacing: 2,
    color: Palette.cream,
    marginBottom: Spacing.two,
  },
  heroNumber: {
    fontSize: 88,
    fontWeight: '800',
    color: Palette.cream,
    lineHeight: 88,
  },
  heroSlash: {
    fontStyle: 'italic',
    fontWeight: '400',
    color: Palette.yellow,
  },
  heroTotal: {
    color: Palette.cream3,
  },
  heroCaption: {
    fontSize: 12,
    color: Palette.cream2,
    marginTop: Spacing.one,
  },
  cards: {
    gap: Spacing.four,
  },
});
