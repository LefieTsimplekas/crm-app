import type { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { supabase } from './supabase';
import { derive } from '../domain/derive';
import type { ActionRow, CompanyRow, ContactRow, Dataset, Derived, LeadRow, ListRow } from '../domain/types';

export type LoadState = 'idle' | 'loading' | 'ready' | 'error';
export interface StoreSnapshot {
  state: LoadState;
  error: string;
  live: boolean;
  data: Dataset;
  derived: Derived;
}

const empty: Dataset = { companies: [], leads: [], actions: [], contacts: [], lists: {} };
type Row = { id?: number; code?: number };
const PK: Record<string, 'id' | 'code'> = { companies: 'code', leads: 'id', actions: 'id', contacts: 'id' };

function friendly(e: unknown): string {
  const m = e instanceof Error ? e.message : String((e as { message?: string })?.message ?? e);
  if (/fetch|network|Failed/i.test(m)) return 'Δεν υπάρχει σύνδεση με τη βάση. Ελέγξτε το internet και ξαναδοκιμάστε.';
  if (/JWT|expired|not authorized|permission/i.test(m)) return 'Η σύνδεσή σας έληξε. Αποσυνδεθείτε και ξανασυνδεθείτε.';
  return 'Σφάλμα βάσης: ' + m;
}

async function fetchAll<T>(table: string, order: string): Promise<T[]> {
  const out: T[] = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .order(order)
      .range(from, from + 999);
    if (error) throw error;
    out.push(...(data as T[]));
    if (data.length < 1000) return out;
  }
}

/** Κρατά τα δεδομένα στη μνήμη και τα ενημερώνει ζωντανά (μόνο η εγγραφή που αλλάζει). */
class DataStore {
  private snap: StoreSnapshot = { state: 'idle', error: '', live: false, data: empty, derived: derive(empty) };
  private listeners = new Set<() => void>();
  private channel: RealtimeChannel | null = null;
  private wasDown = false;

  subscribe = (fn: () => void) => {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  };
  getSnapshot = () => this.snap;

  private set(patch: Partial<StoreSnapshot>, data?: Dataset) {
    const next = { ...this.snap, ...patch };
    if (data) {
      next.data = data;
      next.derived = derive(data);
    }
    this.snap = next;
    this.listeners.forEach((l) => l());
  }

  async load() {
    this.set({ state: this.snap.state === 'ready' ? 'ready' : 'loading', error: '' });
    try {
      const [companies, leads, actions, contacts, listRows] = await Promise.all([
        fetchAll<CompanyRow>('companies', 'code'),
        fetchAll<LeadRow>('leads', 'id'),
        fetchAll<ActionRow>('actions', 'id'),
        fetchAll<ContactRow>('contacts', 'id'),
        fetchAll<ListRow>('lists', 'position'),
      ]);
      const lists: Record<string, string[]> = {};
      for (const r of listRows) (lists[r.list_name] ??= Array<string>(25).fill(''))[r.position] = r.value;
      this.set({ state: 'ready' }, { companies, leads, actions, contacts, lists });
    } catch (e) {
      this.set({ state: 'error', error: friendly(e) });
    }
  }

  /** Εφαρμογή μιας αλλαγής (από realtime ή από δική μας αποθήκευση). */
  apply(table: string, kind: 'upsert' | 'delete', row: Record<string, unknown>) {
    const d = this.snap.data;
    if (table === 'lists') {
      const r = row as unknown as ListRow,
        lists = { ...d.lists };
      const arr = [...(lists[r.list_name] ?? Array<string>(25).fill(''))];
      if (r.position !== undefined) arr[r.position] = kind === 'delete' ? '' : r.value;
      lists[r.list_name] = arr;
      return this.set({}, { ...d, lists });
    }
    const key = table as 'companies' | 'leads' | 'actions' | 'contacts',
      pk = PK[key];
    if (!pk) return;
    const id = (row as Row)[pk];
    if (id === undefined) return;
    let arr = (d[key] as unknown as Row[]).filter((x) => x[pk] !== id);
    if (kind === 'upsert') {
      arr = [...arr, row as Row].sort((a, b) => (a[pk] ?? 0) - (b[pk] ?? 0));
    }
    const next = { ...d, [key]: arr } as Dataset;
    if (key === 'companies' && kind === 'delete') {
      // ό,τι σβήνει η βάση με cascade
      next.leads = next.leads.filter((x) => x.company_code !== id);
      next.actions = next.actions.filter((x) => x.company_code !== id);
      next.contacts = next.contacts.filter((x) => x.company_code !== id);
    }
    this.set({}, next);
  }

  startLive() {
    if (this.channel) return;
    this.channel = supabase
      .channel('crm-live-v2')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public' },
        (p: RealtimePostgresChangesPayload<Record<string, unknown>>) => {
          if (p.eventType === 'DELETE') this.apply(p.table, 'delete', p.old as Record<string, unknown>);
          else this.apply(p.table, 'upsert', p.new);
        },
      )
      .subscribe((status) => {
        this.set({ live: status === 'SUBSCRIBED' });
        if (status === 'SUBSCRIBED' && this.wasDown) {
          this.wasDown = false;
          void this.load();
        }
        if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') this.wasDown = true;
      });
  }

  async stop() {
    if (this.channel) await supabase.removeChannel(this.channel);
    this.channel = null;
    this.set({ state: 'idle', live: false }, empty);
  }
}

export const store = new DataStore();
