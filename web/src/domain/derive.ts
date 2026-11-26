import type { Action, Company, Dataset, Derived, Lead } from './types';
import { dayFromISO } from './text';

/** Τιμή θέσης λίστας (π.χ. Πορεία ενδιαφέροντος θέση 5 = εκθέτης). */
export const listValue = (lists: Dataset['lists'], name: string, pos: number): string => lists[name]?.[pos] ?? '';
export const listValues = (lists: Dataset['lists'], name: string): string[] =>
  (lists[name] ?? []).filter((v) => v.trim() !== '');

/** Οι ειδικές τιμές από τις οποίες μετράνε τα στατιστικά. */
export function specialValues(lists: Dataset['lists']) {
  return {
    win: listValue(lists, 'Πορεία ενδιαφέροντος', 5),
    lost: listValue(lists, 'Πορεία ενδιαφέροντος', 6),
    sponsorOpen: [listValue(lists, 'Χορηγία', 0), listValue(lists, 'Χορηγία', 1)],
    sponsor: listValue(lists, 'Χορηγία', 2),
  };
}

export function derive(ds: Dataset): Derived {
  const companies = new Map<number, Company>();
  for (const row of ds.companies) {
    if (!row.code || !String(row.name ?? '').trim()) continue;
    companies.set(row.code, {
      code: row.code,
      name: row.name,
      row,
      contacts: [],
      leads: [],
      actions: [],
      person: '',
      phone: '',
      email: '',
    });
  }
  for (const c of ds.contacts) companies.get(c.company_code)?.contacts.push(c);
  for (const c of companies.values()) {
    const primary = c.contacts.filter((p) => p.is_primary);
    const src = primary.length ? primary : c.contacts.slice(0, 1);
    const join = (f: (p: (typeof src)[number]) => string | null) => src.map(f).filter(Boolean).join(' / ');
    c.person = join((p) => p.name);
    c.phone = join((p) => p.phone);
    c.email = join((p) => p.email);
  }

  const leads: Lead[] = [];
  const maxYear = new Map<number, number>();
  for (const row of ds.leads) {
    const company = companies.get(row.company_code);
    const lead: Lead = {
      id: row.id,
      code: row.company_code,
      year: Number(row.year) || 0,
      row,
      company,
      companyName: company?.name ?? '?',
      stage: row.stage ?? '',
      sponsor: row.sponsor ?? '',
      handler: row.handler ?? '',
      actions: [],
      lastDay: 0,
      lastDescription: '',
      open: true,
      won: false,
      lost: false,
      prevExhibitor: false,
    };
    leads.push(lead);
    company?.leads.push(lead);
    maxYear.set(lead.code, Math.max(maxYear.get(lead.code) ?? 0, lead.year));
  }
  const byKey = new Map(leads.map((l) => [`${l.code}|${l.year}`, l]));

  // οι ενέργειες με τη σειρά καταχώρησης (= σειρά ιστορικού)
  const actions: Action[] = [];
  for (const row of [...ds.actions].sort((a, b) => a.id - b.id)) {
    const year = Number(row.lead_year) || maxYear.get(row.company_code) || 0;
    const a: Action = {
      id: row.id,
      code: row.company_code,
      year,
      day: dayFromISO(row.action_date),
      type: row.type ?? '',
      description: row.description ?? '',
      handler: row.handler ?? '',
      companyName: companies.get(row.company_code)?.name ?? '?',
    };
    actions.push(a);
    companies.get(a.code)?.actions.push(a);
    const lead = byKey.get(`${a.code}|${year}`);
    if (lead) {
      lead.actions.push(a);
      if (a.day && a.day >= lead.lastDay) {
        lead.lastDay = a.day;
        lead.lastDescription = a.description;
      }
    }
  }

  const sv = specialValues(ds.lists);
  for (const l of leads) {
    const st = l.stage,
      sp = l.sponsor;
    l.open =
      (st === '' && sp === '') ||
      (st !== '' && st !== sv.win && st !== sv.lost) ||
      (sp !== '' && sv.sponsorOpen.includes(sp));
    l.won = st === sv.win;
    l.lost = st === sv.lost;
    const prev = byKey.get(`${l.code}|${l.year - 1}`);
    l.prevExhibitor = !!prev && (prev.stage === sv.win || prev.sponsor === sv.sponsor);
  }
  return { companies, leads, actions };
}
