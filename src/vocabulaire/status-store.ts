import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

/**
 * Persistance locale (AsyncStorage) du statut d'apprentissage de chaque mot :
 * « connu » (l'utilisateur l'a maîtrisé) ou « à revoir » (à retravailler).
 * Sans status = mot non encore évalué.
 *
 * Stockage en une seule clé JSON pour minimiser les I/O (la map fait ~quelques
 * Ko pour 1377 mots si tout est marqué — négligeable). Chargée une fois au
 * mount du hook, mémorisée en RAM, persistée à chaque mutation.
 */
const STORAGE_KEY = 'lernen.vocab.status.v1';

export type WordStatus = 'known' | 'review';
export type StatusMap = Record<string, WordStatus>;

let cachedMap: StatusMap | null = null;
const listeners = new Set<(m: StatusMap) => void>();

async function load(): Promise<StatusMap> {
  if (cachedMap) return cachedMap;
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    cachedMap = raw ? (JSON.parse(raw) as StatusMap) : {};
  } catch {
    cachedMap = {};
  }
  return cachedMap;
}

async function persist(): Promise<void> {
  if (!cachedMap) return;
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(cachedMap));
  } catch {
    /* silent — best-effort, the in-memory map stays authoritative for the session */
  }
}

function notify() {
  if (!cachedMap) return;
  const snapshot = { ...cachedMap };
  listeners.forEach((l) => l(snapshot));
}

/** Hook React qui expose la map et les mutations. Tous les consommateurs sont
 *  synchronisés via un store en mémoire + listeners (pas de remount manuel). */
export function useVocabStatus() {
  const [map, setMap] = useState<StatusMap>(() => cachedMap ?? {});
  const [hydrated, setHydrated] = useState<boolean>(cachedMap !== null);

  useEffect(() => {
    let alive = true;
    load().then((m) => {
      if (!alive) return;
      setMap({ ...m });
      setHydrated(true);
    });
    const listener = (m: StatusMap) => setMap(m);
    listeners.add(listener);
    return () => {
      alive = false;
      listeners.delete(listener);
    };
  }, []);

  const setStatus = useCallback((key: string, status: WordStatus | null) => {
    if (!cachedMap) cachedMap = {};
    if (status === null) {
      delete cachedMap[key];
    } else {
      cachedMap[key] = status;
    }
    notify();
    void persist();
  }, []);

  return { map, hydrated, setStatus };
}

/** Filtre haute-niveau utilisé par les écrans pour combiner status + état actuel. */
export type StatusFilter = 'all' | 'unseen' | 'review' | 'known';
