import { describe, expect, it } from 'vitest';
import { derive } from './derive';
import { fixture } from './fixtures';
import { dayFromISO, emailsOf, fold, formatDay, parseCode } from './text';
import { ALL, NO_HANDLER, kpis, signalOf, trackingRows } from './tracking';

const today = dayFromISO('2026-11-27');
function must<T>(v: T | undefined): T {
  if (v === undefined) throw new Error('λείπει');
  return v;
}

describe('κείμενο και ημερομηνίες', () => {
  it('κωδικός από «12 · Όνομα»', () => {
    expect(parseCode('12 · GOODWE')).toBe(12);
    expect(parseCode(7)).toBe(7);
    expect(parseCode('GOODWE')).toBe(0);
  });
  it('ημερομηνίες', () => {
    expect(formatDay(dayFromISO('2026-03-01'))).toBe('01/03/2026');
    expect(dayFromISO('')).toBe(0);
  });
  it('αναζήτηση χωρίς τόνους', () => expect(fold('Ζεστό Ενδιαφέρον')).toBe('ζεστο ενδιαφερον'));
  it('email από κείμενο', () => expect(emailsOf('a@b.gr / c.d@e-f.com')).toEqual(['a@b.gr', 'c.d@e-f.com']));
});

describe('υπολογισμοί (όπως οι τύποι του Excel)', () => {
  const d = derive(fixture());
  const lead = (id: number) => must(d.leads.find((l) => l.id === id));

  it('κύρια επαφή στις λίστες', () => {
    expect(must(d.companies.get(1)).person).toBe('Anna');
    expect(must(d.companies.get(2)).person).toBe('Γιώργος'); // χωρίς κύρια → η πρώτη
  });
  it('τελευταία ενέργεια: η τελευταία καταχωρημένη της πιο πρόσφατης μέρας', () => {
    expect(formatDay(lead(11).lastDay)).toBe('20/11/2026');
    expect(lead(11).lastDescription).toBe('τρίτο ίδια μέρα');
  });
  it('ενέργεια χωρίς χρονιά πάει στο τελευταίο lead', () => expect(lead(11).actions).toHaveLength(3));
  it('ανοιχτό / κλειστό / εκθέτης προηγ. χρονιάς', () => {
    expect(lead(10).open).toBe(false);
    expect(lead(10).won).toBe(true);
    expect(lead(13).lost).toBe(true);
    expect(lead(11).open).toBe(true);
    expect(lead(11).prevExhibitor).toBe(true);
    expect(lead(12).prevExhibitor).toBe(false);
  });
});

describe('Παρακολούθηση', () => {
  const d = derive(fixture());
  const f = { year: 2027, handler: ALL, showClosed: false, stage: '', query: '' };

  it('χρώματα κατάστασης', () => {
    expect(signalOf(must(d.leads.find((l) => l.id === 12)), today, 7, 21)).toMatchObject({
      signal: 'red',
      label: 'Καμία επαφή',
    });
    expect(signalOf(must(d.leads.find((l) => l.id === 11)), today, 7, 21)).toMatchObject({ signal: 'amber', days: 7 });
    expect(signalOf(must(d.leads.find((l) => l.id === 11)), today, 8, 21).signal).toBe('green');
  });
  it('ταξινόμηση: πρώτα όσα δεν έχουν καμία επαφή', () => {
    expect(trackingRows(d.leads, f, today, 7, 21).map((r) => r.lead.id)).toEqual([12, 11]);
  });
  it('φίλτρο χειριστή: κοινός χειρισμός μετράει και στους δύο', () => {
    expect(trackingRows(d.leads, { ...f, handler: 'Katerina Benaki' }, today, 7, 21).map((r) => r.lead.id)).toEqual([
      11,
    ]);
    expect(
      trackingRows(d.leads, { ...f, year: 2026, handler: NO_HANDLER, showClosed: true }, today, 7, 21).map(
        (r) => r.lead.id,
      ),
    ).toEqual([13]);
  });
  it('αναζήτηση σε επαφή και σημειώσεις', () => {
    expect(trackingRows(d.leads, { ...f, query: 'ANNA' }, today, 7, 21)).toHaveLength(1);
    expect(trackingRows(d.leads, { ...f, query: 'σημειωση' }, today, 7, 21)).toHaveLength(1);
  });
  it('μετρητές', () => {
    expect(kpis(trackingRows(d.leads, f, today, 7, 21), 7, 21)).toEqual({
      overdue: 0,
      never: 1,
      soon: 1,
      recent: 0,
      total: 2,
    });
  });
});
