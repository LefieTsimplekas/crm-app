import { describe, expect, it } from 'vitest';
import { derive } from './derive';
import { fixture } from './fixtures';
import { summarize } from './summary';

const now = new Date(2026, 10, 20);

describe('summary', () => {
  it('compares exhibition years and counts recent activity by action date', () => {
    const data = fixture();
    const summary = summarize(derive(data), data.lists, 2027, 'full', now);
    expect(summary.current).toMatchObject({ total: 2, open: 1, exhibitors: 0, conversion: null, actions: 3 });
    expect(summary.previous).toMatchObject({ total: 2, exhibitors: 1, cancellations: 1, sqm: 16, conversion: 50 });
    expect(summary.recent).toBe(2);
    expect(summary.thisMonth).toBe(3);
  });

  it('groups by channel and keeps sources from the previous year', () => {
    const data = fixture();
    data.leads[0].source = 'Παλαιός εκθέτης · Τηλέφωνο';
    data.leads[1].source = 'Παλαιός εκθέτης · Email';
    data.leads[2].source = 'Νέο lead · Email';
    const summary = summarize(derive(data), data.lists, 2027, 'channel', now);
    expect(summary.sources).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ label: 'Email', total: 2, share: 100 }),
        expect.objectContaining({ label: 'Τηλέφωνο', total: 0, previous: 1 }),
      ]),
    );
  });
});
