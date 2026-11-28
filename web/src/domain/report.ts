import { listValues } from './derive';
import { summarize } from './summary';
import { dayFromISO, handlerParts, norm, todayDay } from './text';
import type { Dataset, Derived } from './types';

export const reportPeriods = {
  '7': 'Τελευταίες 7 ημέρες',
  '30': 'Τελευταίες 30 ημέρες',
  month: 'Τρέχων μήνας',
  previous: 'Προηγούμενος μήνας',
  custom: 'Προσαρμοσμένη περίοδος',
};

export type ReportPeriod = keyof typeof reportPeriods;

export function reportRange(period: ReportPeriod, now: Date, start = '', end = '') {
  const today = todayDay(now);
  const year = now.getFullYear();
  const month = now.getMonth();
  switch (period) {
    case '7':
      return { from: today - 6, to: today };
    case '30':
      return { from: today - 29, to: today };
    case 'month':
      return { from: todayDay(new Date(year, month, 1)), to: today };
    case 'previous':
      return { from: todayDay(new Date(year, month - 1, 1)), to: todayDay(new Date(year, month, 0)) };
    case 'custom': {
      const from = dayFromISO(start) || today - 6;
      const to = dayFromISO(end) || today;
      return { from: Math.min(from, to), to: Math.max(from, to) };
    }
  }
}

export function buildReport(
  derived: Derived,
  lists: Dataset['lists'],
  {
    year,
    handler,
    from,
    to,
    now,
    threshold,
  }: {
    year: number;
    handler: string;
    from: number;
    to: number;
    now: Date;
    threshold: number;
  },
) {
  const selected = norm(handler);
  const matches = (value: string) => !selected || handlerParts(norm(value)).includes(selected);
  const inPeriod = (day: number) => day >= from && day <= to;
  const today = todayDay(now);
  const leads = derived.leads.filter((lead) => matches(lead.handler));
  const actions = derived.actions
    .filter((action) => inPeriod(action.day) && matches(action.handler))
    .sort((a, b) => b.day - a.day || b.id - a.id);
  const { current, previous, stages } = summarize({ ...derived, leads }, lists, year, 'full', now);

  // The HTML report excludes leads imported together from the initial Excel migration.
  const timestampCounts = new Map<string, number>();
  for (const lead of derived.leads) {
    const created = lead.row.created_at;
    if (created) timestampCounts.set(created, (timestampCounts.get(created) ?? 0) + 1);
  }
  const newLeads = leads.filter((lead) => {
    const created = lead.row.created_at;
    if (!created || (timestampCounts.get(created) ?? 0) > 20) return false;
    const date = new Date(created);
    return Number.isFinite(date.getTime()) && inPeriod(todayDay(date));
  });
  const open = leads
    .filter((lead) => lead.year === year && lead.open)
    .map((lead) => ({ lead, days: lead.lastDay ? today - lead.lastDay : null }));
  const overdue = open
    .filter(({ days }) => days === null || days >= threshold)
    .sort((a, b) => (b.days ?? Infinity) - (a.days ?? Infinity));
  const types = [...new Set(listValues(lists, 'Τύπος ενέργειας'))].filter((type) =>
    actions.some((action) => action.type === type),
  );
  const handlers = [...new Set(listValues(lists, 'Χειριστής'))]
    .filter((name) => !name.includes(',') && (!selected || norm(name) === selected))
    .map((name) => {
      const includesName = (value: string) => handlerParts(norm(value)).includes(norm(name));
      const assigned = actions.filter((action) => includesName(action.handler));
      return {
        label: name,
        actions: assigned.length,
        companies: new Set(assigned.map((action) => action.code)).size,
        byType: new Map(types.map((type) => [type, assigned.filter((action) => action.type === type).length])),
        open: open.filter(({ lead }) => includesName(lead.handler)).length,
        overdue: overdue.filter(({ lead }) => includesName(lead.handler)).length,
      };
    });

  return {
    current,
    previous,
    stages,
    actions,
    newLeads,
    overdue,
    handlers,
    types,
    open: open.length,
    noContact: open.filter(({ days }) => days === null).length,
    contacted: new Set(actions.map((action) => action.code)).size,
  };
}
