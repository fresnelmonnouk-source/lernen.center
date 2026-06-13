import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { ButtonPrimary } from '@/components/ui/ButtonPrimary';
import { Chip } from '@/components/ui/Chip';
import { Input } from '@/components/ui/Input';
import { ScreenScaffold } from '@/components/ui/ScreenScaffold';
import { Txt } from '@/components/ui/Txt';
import {
  CATEGORIES,
  LEVELS,
  searchWords,
  wordKey,
  type VocabCategory,
  type VocabWord,
} from '@/data/vocabulary';
import { Flashcard, type FlashDirection } from '@/vocabulaire/Flashcard';
import { useVocabStatus, type StatusFilter } from '@/vocabulaire/status-store';
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

const STATUS_FILTERS: { key: StatusFilter; label: string; color: string }[] = [
  { key: 'all', label: 'Tous', color: Accent.blue },
  { key: 'unseen', label: 'Non vus', color: Accent.purple },
  { key: 'review', label: 'À revoir', color: Accent.red },
  { key: 'known', label: 'Connus', color: Accent.green },
];

/** Module Vocabulaire : 1377 mots locaux, recherche FR↔DE, statut persistant. */
export default function VocabulaireScreen() {
  const [category, setCategory] = useState<VocabCategory>('noms');
  const [level, setLevel] = useState<Level | null>(null);
  const [query, setQuery] = useState('');
  const [direction, setDirection] = useState<FlashDirection>('de-fr');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [shuffleSeed, setShuffleSeed] = useState(0);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const { map: statusMap, setStatus } = useVocabStatus();

  // Le deck final dépend de tous les filtres + d'un mélange optionnel (seed=0 → ordre naturel).
  const deck = useMemo<VocabWord[]>(() => {
    const base = searchWords(category, level, query);
    const filtered = base.filter((w) => {
      if (statusFilter === 'all') return true;
      const s = statusMap[wordKey(category, w)];
      if (statusFilter === 'unseen') return s == null;
      return s === statusFilter;
    });
    return shuffleSeed === 0 ? filtered : shuffled(filtered);
  }, [category, level, query, statusFilter, statusMap, shuffleSeed]);

  // Index dérivé clampé : si le deck rétrécit (filtre, mutation status), on
  // reste dans les bornes sans avoir besoin d'un useEffect+setState (qui
  // déclencherait un re-render en cascade — react-hooks/set-state-in-effect).
  const safeIndex = deck.length === 0 ? 0 : Math.min(index, deck.length - 1);
  const current = deck[safeIndex];

  /** Reset commun appliqué à tout changement de filtre / mode. */
  const resetView = () => {
    setIndex(0);
    setRevealed(false);
  };

  const pickCategory = (c: VocabCategory) => {
    setCategory(c);
    resetView();
  };

  const pickLevel = (l: Level | null) => {
    setLevel(l);
    resetView();
  };

  const pickStatusFilter = (s: StatusFilter) => {
    setStatusFilter(s);
    resetView();
  };

  const onQueryChange = (q: string) => {
    setQuery(q);
    resetView();
  };

  const go = (delta: number) => {
    if (deck.length === 0) return;
    setRevealed(false);
    setIndex((i) => {
      const base = Math.min(i, deck.length - 1);
      return (base + delta + deck.length) % deck.length;
    });
  };

  const shuffle = () => {
    setShuffleSeed((s) => s + 1);
    setIndex(0);
    setRevealed(false);
  };

  const toggleDirection = () => {
    setDirection((d) => (d === 'de-fr' ? 'fr-de' : 'de-fr'));
    setRevealed(false);
  };

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

      <Input
        label="Rechercher (DE ou FR)"
        value={query}
        onChangeText={onQueryChange}
        placeholder="essen, manger, der Hund…"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="off"
      />

      <View style={styles.toggles}>
        <View style={styles.toggleHalf}>
          <Txt font="monoBold" size={10} tone="ink2" uppercase tracking={1.5}>Sens</Txt>
          <Chip
            label={direction === 'de-fr' ? 'DE → FR' : 'FR → DE'}
            selected
            onPress={toggleDirection}
            color={direction === 'de-fr' ? Accent.blue : Accent.green}
            fullWidth
          />
        </View>
        <View style={styles.toggleHalf}>
          <Txt font="monoBold" size={10} tone="ink2" uppercase tracking={1.5}>État</Txt>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
            {STATUS_FILTERS.map((f) => (
              <Chip
                key={f.key}
                label={f.label}
                selected={statusFilter === f.key}
                onPress={() => pickStatusFilter(f.key)}
                color={f.color}
              />
            ))}
          </ScrollView>
        </View>
      </View>

      {!current ? (
        <Txt font="mono" size={13} tone="ink2">
          Aucun mot pour ces filtres.
        </Txt>
      ) : (
        <>
          <Txt font="monoBold" size={11} tone="ink2" uppercase tracking={1.2} style={styles.counter}>
            {safeIndex + 1} / {deck.length}
          </Txt>
          <Flashcard
            word={current}
            revealed={revealed}
            onPress={() => setRevealed((r) => !r)}
            direction={direction}
            status={statusMap[wordKey(category, current)] ?? null}
            onSetStatus={(s) => setStatus(wordKey(category, current), s)}
          />
          <View style={styles.nav}>
            <View style={styles.navBtn}>
              <ButtonPrimary label="Préc." icon="chevronLeft" iconPosition="left" onPress={() => go(-1)} />
            </View>
            <View style={styles.navBtn}>
              <ButtonPrimary label="Suiv." icon="chevronRight" iconPosition="right" onPress={() => go(1)} />
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
  toggles: { flexDirection: 'row', gap: Spacing.two },
  toggleHalf: { flex: 1, gap: Spacing.two },
  counter: { textAlign: 'center' },
  nav: { flexDirection: 'row', gap: Spacing.two },
  navBtn: { flex: 1 },
});
