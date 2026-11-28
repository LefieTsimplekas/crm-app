import { describe, expect, it } from 'vitest';
import { derive } from './derive';
import { fixture } from './fixtures';
import { buildReport, reportRange } from './report';
import { dayFromISO } from './text';

const now = new Date(2026, 10, 20);

describe('report', () => {
  it('includes both endpoints and normalizes reversed custom dates', () => {
    expect(reportRange('custom', now, '2026-11-20', '2026-11-01')).toEqual({
      from: dayFromISO('2026-11-01'),
      to: dayFromISO('2026-11-20'),
    });
    expect(reportRange('previous', new Date(2027, 0, 5))).toEqual({
      from: dayFromISO('2026-12-01'),
      to: dayFromISO('2026-12-31'),
    });
  });

  it('counts actions by date and matches a handler inside a shared lead', () => {
    const data = fixture();
    const report = buildReport(derive(data), data.lists, {
      year: 2027,
      handler: 'Katerina Benaki',
      ...reportRange('7', now),
      now,
      threshold: 21,
    });
    expect(report.current.total).toBe(1);
    expect(report.previous.exhibitors).toBe(1);
    expect(report.actions.map(({ id }) => id)).toEqual([102, 101]);
    expect(report.contacted).toBe(1);
    expect(report.overdue).toHaveLength(0);
  });

  it('lists open leads with no contact and excludes the original bulk import', () => {
    const data = fixture();
    const imported = '2026-11-18T12:00:00Z';
    data.leads[2].created_at = '2026-11-19T12:00:00Z';
    data.leads.push(
      ...Array.from({ length: 21 }, (_, index) => ({ ...data.leads[0], id: 200 + index, created_at: imported })),
    );
    const report = buildReport(derive(data), data.lists, {
      year: 2027,
      handler: '',
      ...reportRange('7', now),
      now,
      threshold: 21,
    });
    expect(report.overdue.map(({ lead }) => lead.id)).toEqual([12]);
    expect(report.noContact).toBe(1);
    expect(report.newLeads.map(({ id }) => id)).toEqual([12]);
  });
});
