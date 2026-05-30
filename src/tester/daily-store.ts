import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

/**
 * Persistance du Quiz quotidien : 1 essai par jour calendaire (local).
 *
 * On stocke la date du dernier essai (YYYY-MM-DD local) + le score. Pas de seed
 * du jour : chaque utilisateur tire un échantillon aléatoire de l'ensemble du
 * vocabulaire au moment où il joue. Conséquence : pas de « tous le même quiz »,
 * mais pas non plus de besoin de synchroniser une seed serveur (offline-first).
 */
const STORAGE_KEY = 'lernen.daily.v1';

export type DailyRecord = { date: string; score: number; total: number };

let cached: DailyRecord | null | undefined; // undefined = pas encore lu

/** Date locale au format YYYY-MM-DD. */
export function todayKey(now: Date = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

async function load(): Promise<DailyRecord | null> {
  if (cached !== undefined) return cached;
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    cached = raw ? (JSON.parse(raw) as DailyRecord) : null;
  } catch {
    cached = null;
  }
  return cached;
}

async function persist(record: DailyRecord | null): Promise<void> {
  cached = record;
  try {
    if (record) await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(record));
    else await AsyncStorage.removeItem(STORAGE_KEY);
  } catch {
    /* silent */
  }
}

/** Hook React : expose le dernier essai connu + une mutation `recordToday`. */
export function useDailyRecord() {
  const [record, setRecord] = useState<DailyRecord | null>(cached ?? null);
  const [hydrated, setHydrated] = useState<boolean>(cached !== undefined);

  useEffect(() => {
    let alive = true;
    load().then((r) => {
      if (!alive) return;
      setRecord(r);
      setHydrated(true);
    });
    return () => {
      alive = false;
    };
  }, []);

  const recordToday = useCallback(async (score: number, total: number) => {
    const next: DailyRecord = { date: todayKey(), score, total };
    await persist(next);
    setRecord(next);
  }, []);

  const playedToday = hydrated && record !== null && record.date === todayKey();
  return { record, hydrated, playedToday, recordToday };
}
