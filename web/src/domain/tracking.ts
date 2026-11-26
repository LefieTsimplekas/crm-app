import type { Lead } from './types';
import { fold, handlerParts, norm } from './text';

export type Signal = 'red' | 'amber' | 'green' | 'closed';
export interface TrackingRow {
  lead: Lead;
  /** ημέρες χωρίς επαφή (null = καμία επαφή) */
  days: number | null;
  signal: Signal;
  label: string;
}
export interface TrackingFilter {
  year: number;
  /** 'Όλοι' | 'Χωρίς χειριστή' | όνομα */
  handler: string;
  showClosed: boolean;
  stage: string;
  query: string;
}
export const ALL = 'Όλοι';
export const NO_HANDLER = 'Χωρίς χειριστή';

export function signalOf(lead: Lead, today: number, orange: number, red: number): Omit<TrackingRow, 'lead'> {
  const days = lead.lastDay ? today - lead.lastDay : null;
  if (!lead.open) return { days, signal: 'closed', label: '✔ Κλειστό' };
  if (days === null) return { days, signal: 'red', label: 'Καμία επαφή' };
  if (days >= red) return { days, signal: 'red', label: `${days} ημ. χωρίς επαφή` };
  if (days >= orange) return { days, signal: 'amber', label: `${days} ημ. χωρίς επαφή` };
  return { days, signal: 'green', label: `πριν ${days} ημ.` };
}

export const matchesHandler = (handler: string, filter: string): boolean =>
  filter === ALL
    ? true
    : filter === NO_HANDLER
      ? handler.trim() === ''
      : handlerParts(handler).some((h) => norm(h) === norm(filter));

function searchText(l: Lead): string {
  const c = l.company;
  return fold(
    [
      l.companyName,
      c?.person,
      c?.phone,
      c?.email,
      c?.row.sector,
      l.handler,
      l.stage,
      l.sponsor,
      l.row.hall,
      l.row.stand,
      l.row.notes,
      l.row.source,
      l.row.cancel_reason,
      l.lastDescription,
    ].join(' '),
  );
}

/** Leads της χρονιάς/χειριστή (χωρίς τα υπόλοιπα φίλτρα) – για το pipeline. */
export const baseLeads = (leads: Lead[], f: Pick<TrackingFilter, 'year' | 'handler'>): Lead[] =>
  leads.filter((l) => l.year === f.year && matchesHandler(l.handler, f.handler));

/** Η λίστα Παρακολούθησης: ανοιχτά πρώτα, με την παλαιότερη επαφή πάνω. */
export function trackingRows(
  leads: Lead[],
  f: TrackingFilter,
  today: number,
  orange: number,
  red: number,
): TrackingRow[] {
  const q = fold(f.query);
  const rows = baseLeads(leads, f)
    .filter((l) => (f.showClosed || l.open) && (!f.stage || l.stage === f.stage) && (!q || searchText(l).includes(q)))
    .map((lead) => ({ lead, ...signalOf(lead, today, orange, red) }));
  const rank = (r: TrackingRow) => (r.lead.open ? 1e6 + r.lead.lastDay : 5e6);
  return rows.sort((a, b) => rank(a) - rank(b) || a.lead.id - b.lead.id);
}

export function kpis(rows: TrackingRow[], orange: number, red: number) {
  const open = rows.filter((r) => r.lead.open);
  return {
    overdue: open.filter((r) => r.days !== null && r.days >= red).length,
    never: open.filter((r) => r.days === null).length,
    soon: open.filter((r) => r.days !== null && r.days >= orange && r.days < red).length,
    recent: open.filter((r) => r.days !== null && r.days < orange).length,
    total: rows.length,
  };
}
