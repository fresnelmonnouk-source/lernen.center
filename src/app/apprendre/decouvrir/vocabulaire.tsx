import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { ButtonPrimary } from '@/components/ui/ButtonPrimary';
import { Chip } from '@/components/ui/Chip';
import { ScreenScaffold } from '@/components/ui/ScreenScaffold';
import { Txt } from '@/components/ui/Txt';
import { CATEGORIES, getWords, LEVELS, type VocabCategory, type VocabWord } from '@/data/vocabulary';
import { Flashcard } from '@/vocabulaire/Flashcard';
import { Accent, LevelColor, Spacing } from '@/theme/tokens';
import type { Level } from '@/lib/api';

/** Mélange Fisher-Yates sur une copie (ne mute pas l'entrée). */
function shuffled<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Module Vocabulaire : flashcards 100 % locales, filtrables par catégorie + niveau. */
export default function VocabulaireScreen() {
  const [category, setCategory] = useState<VocabCategory>('noms');
  const [level, setLevel] = useState<Level | null>(null);
  // deck = liste affichée (ordre naturel ou mélangé) ; current = deck[index].
  const [deck, setDeck] = useState<VocabWord[]>(() => getWords('noms', null));
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const load = (cat: VocabCategory, lvl: Level | null) => {
    setDeck(getWords(cat, lvl));
    setIndex(0);
    setRevealed(false);
  };

  const pickCategory = (cat: VocabCategory) => {
    if (cat === category) return;
    setCategory(cat);
    load(cat, level);
  };

  const pickLevel = (lvl: Level | null) => {
    if (lvl === level) return;
    setLevel(lvl);
    load(category, lvl);
  };

  const go = (delta: number) => {
    if (deck.length === 0) return;
    setRevealed(false);
    setIndex((i) => (i + delta + deck.length) % deck.length);
  };

  const shuffle = () => {
    setDeck((d) => shuffled(d));
    setIndex(0);
    setRevealed(false);
  };

  const current = deck[index];

  return (
    <ScreenScaffold eyebrow="DÉCOUVRIR" title="Vocabulaire">
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {CATEGORIES.map((c) => (
          <Chip key={c.key} label={c.label} selected={category === c.key} onPress={() => pickCategory(c.key)} color={Accent.red} />
        ))}
      </ScrollView>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        <Chip label="Tous" selected={level === null} onPress={() => pickLevel(null)} />
        {LEVELS.map((l) => (
          <Chip key={l} label={l} selected={level === l} onPress={() => pickLevel(l)} color={LevelColor[l]} />
        ))}
      </ScrollView>

      {!current ? (
        <Txt font="mono" size={13} tone="ink2">
          Aucun mot pour ce filtre.
        </Txt>
      ) : (
        <>
          <Txt font="monoBold" size={11} tone="ink2" uppercase tracking={1.2} style={styles.counter}>
            {index + 1} / {deck.length}
          </Txt>
          <Flashcard word={current} revealed={revealed} onPress={() => setRevealed((r) => !r)} />
          <View style={styles.nav}>
            <View style={styles.navBtn}>
              <ButtonPrimary label="‹ Préc." onPress={() => go(-1)} />
            </View>
            <View style={styles.navBtn}>
              <ButtonPrimary label="Suiv. ›" onPress={() => go(1)} />
            </View>
          </View>
          <ButtonPrimary label="Mélanger" onPress={shuffle} color={Accent.yellow} textColor="#0A0A0A" />
        </>
      )}
    </ScreenScaffold>
  );
}

const styles = StyleSheet.create({
  row: { gap: Spacing.two, paddingRight: Spacing.four },
  counter: { textAlign: 'center' },
  nav: { flexDirection: 'row', gap: Spacing.two },
  navBtn: { flex: 1 },
});
