import { useCallback, useSyncExternalStore } from 'react';
import { supabase } from './supabase';

/**
 * Προσωπικές ρυθμίσεις: στον browser και στον πίνακα user_prefs (αν υπάρχει), κάτω από το κλειδί «v2»,
 * ώστε να μη συγκρούονται με τις ρυθμίσεις της παλιάς έκδοσης στην ίδια εγγραφή.
 */
export interface Prefs {
  cols?: string[];
  sorts?: Record<string, { key: string; dir: 1 | -1 }>;
  widths?: Record<string, Record<string, number>>;
  year?: number;
  handler?: string;
  me?: string;
  orange?: number;
  red?: number;
}
const LS_KEY = 'leadscrm:v2';
let prefs: Prefs = read();
let serverAll: Record<string, unknown> = {};
let uid = '';
let syncOn = false;
let timer: ReturnType<typeof setTimeout> | undefined;
const listeners = new Set<() => void>();

function read(): Prefs {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) ?? '{}') as Prefs;
  } catch {
    return {};
  }
}
/** Από την παλιά έκδοση: στήλες και πλάτη της Παρακολούθησης, ώστε να μη χαθούν. */
function legacy(all: Record<string, unknown>): Prefs {
  const out: Prefs = {};
  const get = (k: string): unknown => {
    if (k in all) return all[k];
    try {
      const v = localStorage.getItem('leadscrm:' + k);
      return v ? JSON.parse(v) : undefined;
    } catch {
      return undefined;
    }
  };
  const cols = get('cols');
  if (Array.isArray(cols)) out.cols = cols.filter((c): c is string => typeof c === 'string');
  const w = get('widths') as Record<string, Record<string, number>> | undefined;
  if (w?.trk) out.widths = { trk: w.trk };
  for (const k of ['year', 'handler', 'me', 'orange', 'red'] as const) {
    const v = get(k);
    if (v !== undefined) (out as Record<string, unknown>)[k] = v;
  }
  return out;
}
function emit() {
  listeners.forEach((l) => l());
}
function persist() {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(prefs));
  } catch {
    /* ιδιωτική περιήγηση: μόνο στη μνήμη */
  }
  if (!syncOn) return;
  clearTimeout(timer);
  timer = setTimeout(() => void flushPrefs(), 1200);
}
export async function flushPrefs() {
  clearTimeout(timer);
  if (!syncOn || !uid) return;
  const { data } = await supabase.from('user_prefs').select('prefs').eq('user_id', uid).maybeSingle();
  serverAll = { ...((data?.prefs as Record<string, unknown> | undefined) ?? serverAll), v2: prefs };
  await supabase.from('user_prefs').upsert({ user_id: uid, prefs: serverAll, updated_at: new Date().toISOString() });
}
export async function loadPrefs(userId: string) {
  uid = userId;
  syncOn = false;
  const { data, error } = await supabase.from('user_prefs').select('prefs').eq('user_id', userId).maybeSingle();
  if (error) {
    if (!Object.keys(prefs).length) prefs = legacy({});
    emit();
    return;
  } // ο πίνακας δεν υπάρχει: μόνο τοπικά
  serverAll = (data?.prefs as Record<string, unknown>) ?? {};
  const v2 = serverAll.v2 as Prefs | undefined;
  prefs = v2 && Object.keys(v2).length ? v2 : { ...legacy(serverAll), ...prefs };
  syncOn = true;
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(prefs));
  } catch {
    /* */
  }
  emit();
  if (!v2) await flushPrefs();
}
export function setPref<K extends keyof Prefs>(k: K, v: Prefs[K]) {
  prefs = { ...prefs, [k]: v };
  persist();
  emit();
}
export const prefsSynced = () => syncOn;
const subscribe = (fn: () => void) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};
const snapshot = () => prefs;

export function usePref<K extends keyof Prefs>(
  k: K,
  fallback: NonNullable<Prefs[K]>,
): [NonNullable<Prefs[K]>, (v: NonNullable<Prefs[K]>) => void] {
  const all = useSyncExternalStore(subscribe, snapshot);
  const set = useCallback((v: NonNullable<Prefs[K]>) => setPref(k, v), [k]);
  return [(all[k] ?? fallback) as NonNullable<Prefs[K]>, set];
}
