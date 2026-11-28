import { listValues, specialValues } from './derive';
import { norm, todayDay } from './text';
import type { Dataset, Derived, Lead } from './types';

export type SourceGrouping = 'full' | 'type' | 'channel';

const sqm = (leads: Lead[]) => leads.reduce((total, lead) => total + (Number(lead.row.sqm) || 0), 0);
const percent = (value: number, total: number) => (total ? Math.round((100 * value) / total) : null);

function sourceKey(lead: Lead, group: SourceGrouping) {
  const source = lead.row.source?.trim();
  if (!source) return '(χωρίς προέλευση)';
  const parts = source.split('·').map((part) => part.trim());
  if (group === 'type') return parts.length > 1 ? parts[0] : '(χωρίς τύπο)';
  return group === 'channel' ? parts[parts.length - 1] : source;
}

export function summarize(derived: Derived, lists: Dataset['lists'], year: number, group: SourceGrouping, now: Date) {
  const { win, lost, sponsor, sponsorOpen } = specialValues(lists);
  const current = derived.leads.filter((lead) => lead.year === year);
  const previous = derived.leads.filter((lead) => lead.year === year - 1);
  const won = (lead: Lead) => !!win && lead.stage === win;
  const cancelled = (lead: Lead) => !!lost && lead.stage === lost;
  const sponsored = (lead: Lead) => !!sponsor && lead.sponsor === sponsor;
  const today = todayDay(now);
  const monthStart = todayDay(new Date(now.getFullYear(), now.getMonth(), 1));
  const recent = derived.actions.filter((action) => action.day >= today - 6 && action.day <= today);
  const thisMonth = derived.actions.filter((action) => action.day >= monthStart && action.day <= today).length;

  function metrics(leads: Lead[], selectedYear: number) {
    const exhibitors = leads.filter(won);
    const cancellations = leads.filter(cancelled).length;
    return {
      total: leads.length,
      open: leads.filter((lead) => lead.stage && !won(lead) && !cancelled(lead)).length,
      exhibitors: exhibitors.length,
      sponsors: leads.filter(sponsored).length,
      sponsorOpen: leads.filter((lead) => lead.sponsor && sponsorOpen.includes(lead.sponsor)).length,
      cancellations,
      returning: leads.filter((lead) => (won(lead) || sponsored(lead)) && lead.prevExhibitor).length,
      sqm: sqm(exhibitors),
      proposedSqm: sqm(leads.filter((lead) => ['Οικονομική πρόταση', 'Αναμονή πρότασης'].includes(lead.stage))),
      conversion: percent(exhibitors.length, exhibitors.length + cancellations),
      actions: derived.actions.filter((action) => action.year === selectedYear).length,
      untouched: leads.filter((lead) => !lead.lastDay).length,
    };
  }

  const stages = [...new Set(listValues(lists, 'Πορεία ενδιαφέροντος'))].map((label) => {
    const leads = current.filter((lead) => lead.stage === label);
    return {
      label,
      current: leads.length,
      previous: previous.filter((lead) => lead.stage === label).length,
      sqm: sqm(leads),
    };
  });
  const handlers = [...new Set(listValues(lists, 'Χειριστής'))]
    .filter((label) => !label.includes(','))
    .map((label) => {
      const matches = (handler: string) => norm(handler).includes(norm(label));
      const leads = current.filter((lead) => matches(lead.handler));
      return {
        label,
        total: leads.length,
        open: leads.filter((lead) => lead.open).length,
        exhibitors: leads.filter(won).length,
        recent: recent.filter((action) => matches(action.handler)).length,
      };
    });

  function groupSources(leads: Lead[]) {
    const groups = new Map<string, Lead[]>();
    for (const lead of leads) {
      const key = sourceKey(lead, group);
      const bucket = groups.get(key);
      if (bucket) bucket.push(lead);
      else groups.set(key, [lead]);
    }
    return groups;
  }

  const currentSources = groupSources(current);
  const previousSources = groupSources(previous);
  const sourceOrder = group === 'full' ? listValues(lists, 'Προέλευση') : [];
  const sources = [...new Set([...sourceOrder, ...currentSources.keys(), ...previousSources.keys()])].flatMap(
    (label) => {
      const leads = currentSources.get(label) ?? [];
      const prev = previousSources.get(label)?.length ?? 0;
      if (!leads.length && !prev) return [];
      const exhibitors = leads.filter(won);
      const cancellations = leads.filter(cancelled).length;
      return [
        {
          label,
          total: leads.length,
          share: percent(leads.length, current.length) ?? 0,
          previous: prev,
          open: leads.filter((lead) => lead.open).length,
          exhibitors: exhibitors.length,
          sponsors: leads.filter(sponsored).length,
          cancellations,
          conversion: percent(exhibitors.length, exhibitors.length + cancellations),
          sqm: sqm(exhibitors),
        },
      ];
    },
  );

  return {
    current: metrics(current, year),
    previous: metrics(previous, year - 1),
    recent: recent.length,
    thisMonth,
    stages,
    handlers,
    sources,
  };
}
