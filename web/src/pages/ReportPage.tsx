import { Button, Group, NativeSelect, Paper, Progress, SimpleGrid, Stack, Text, TextInput, Title } from '@mantine/core';
import { useState, type ReactNode } from 'react';
import { DataTable, type Column } from '../components/DataTable';
import { labelColumn, numberColumn } from '../components/metricColumns';
import { ErrorView, Loading } from '../components/StateViews';
import { usePref } from '../data/prefs';
import { store } from '../data/store';
import { useData } from '../data/useData';
import { listValues } from '../domain/derive';
import { buildReport, reportPeriods, reportRange, type ReportPeriod } from '../domain/report';
import { formatDay } from '../domain/text';
import type { Action, Lead } from '../domain/types';
import classes from './ReportPage.module.css';

const maxOverdue = 60;
const maxActions = 300;
const formatNumber = new Intl.NumberFormat('el-GR', { maximumFractionDigits: 1 });
const conversion = (value: number | null) => (value === null ? '–' : `${value}%`);
const inputDay = (day: number) => new Date(day * 86_400_000).toISOString().slice(0, 10);

function textColumn<T>(label: string, value: (row: T) => string | null): Column<T> {
  return { key: label, label, render: (row) => value(row) ?? '', sortValue: value };
}

function ReportSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Stack component="section" gap="xs">
      <Title order={3} size="h4">
        {title}
      </Title>
      {children}
    </Stack>
  );
}

function ReportCards({ cards }: { cards: { label: string; value: number | string; comparison?: string }[] }) {
  return (
    <SimpleGrid cols={{ base: 2, sm: 3, lg: 5 }} spacing="sm">
      {cards.map(({ label, value, comparison }) => (
        <Paper key={label} p="sm" withBorder className={classes.card}>
          <Text fw={700} fz="xl" ff="heading">
            {value}
          </Text>
          <Text size="xs" c="dimmed">
            {label}
          </Text>
          {comparison && (
            <Text size="xs" c="dimmed">
              {comparison}
            </Text>
          )}
        </Paper>
      ))}
    </SimpleGrid>
  );
}

function printReport(year: number, from: number, to: number) {
  const title = document.title;
  const restore = () => {
    document.title = title;
  };
  document.title = `Αναφορά leads ${year} ${inputDay(from)} έως ${inputDay(to)}`;
  window.addEventListener('afterprint', restore, { once: true });
  window.print();
}

export function ReportPage({ email }: { email: string }) {
  const { state, error, data, derived } = useData();
  const [preferredYear] = usePref('year', 0);
  const [threshold] = usePref('red', 21);
  const [selectedYear, setYear] = useState<number>();
  const [handler, setHandler] = useState('');
  const [period, setPeriod] = useState<ReportPeriod>('7');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  if (state === 'idle' || state === 'loading') return <Loading />;
  if (state === 'error') return <ErrorView message={error} onRetry={() => void store.load()} />;

  const now = new Date();
  const years = new Set(listValues(data.lists, 'Χρονιά').map(Number).filter(Boolean));
  derived.leads.forEach((lead) => lead.year && years.add(lead.year));
  const latest = derived.leads.reduce((value, lead) => Math.max(value, lead.year), 0);
  const year = selectedYear ?? (preferredYear || latest || now.getFullYear());
  years.add(year);
  const defaultRange = reportRange('7', now);
  const range = reportRange(period, now, start, end);
  const report = buildReport(derived, data.lists, { year, handler, ...range, now, threshold });
  const { current, previous, stages, handlers, types, overdue, newLeads, actions } = report;
  const handlerOptions = [...new Set(listValues(data.lists, 'Χειριστής'))].filter((name) => !name.includes(','));
  const stageMax = Math.max(1, ...stages.map((stage) => stage.current));
  const comparison = (value: number | string) => `${year - 1}: ${value}`;

  return (
    <Stack gap="md">
      <SimpleGrid className={classes.controls} cols={{ base: 1, xs: 2, md: 3, xl: 6 }} spacing="sm">
        <NativeSelect
          label="Περίοδος ενεργειών"
          data={Object.entries(reportPeriods).map(([value, label]) => ({ value, label }))}
          value={period}
          onChange={(event) => setPeriod(event.currentTarget.value as ReportPeriod)}
        />
        {period === 'custom' && (
          <>
            <TextInput
              type="date"
              label="Από"
              value={start || inputDay(defaultRange.from)}
              onChange={(event) => setStart(event.currentTarget.value)}
            />
            <TextInput
              type="date"
              label="Έως"
              value={end || inputDay(defaultRange.to)}
              onChange={(event) => setEnd(event.currentTarget.value)}
            />
          </>
        )}
        <NativeSelect
          label="Χρονιά leads"
          data={[...years].sort((a, b) => a - b).map(String)}
          value={year}
          onChange={(event) => setYear(Number(event.currentTarget.value))}
        />
        <NativeSelect
          label="Χειριστής"
          data={[{ value: '', label: 'Όλοι' }, ...handlerOptions]}
          value={handler}
          onChange={(event) => setHandler(event.currentTarget.value)}
        />
        <Group align="flex-end">
          <Button onClick={() => printReport(year, range.from, range.to)}>Αποθήκευση PDF / Εκτύπωση</Button>
        </Group>
      </SimpleGrid>
      <Stack component="article" gap="lg" className={classes.report}>
        <div>
          <Title order={2}>
            Αναφορά leads {year}
            {handler && ` – ${handler}`}
          </Title>
          <Text c="dimmed" size="sm">
            {reportPeriods[period]} · {formatDay(range.from)} – {formatDay(range.to)} · Δημιουργήθηκε{' '}
            {now.toLocaleString('el-GR')}
            {email && ` από ${email}`}
          </Text>
        </div>
        <ReportSection title={`Εικόνα χρονιάς ${year}`}>
          <ReportCards
            cards={[
              { label: 'Leads', value: current.total, comparison: comparison(previous.total) },
              { label: 'Ανοιχτά', value: report.open },
              { label: 'Εκθέτες', value: current.exhibitors, comparison: comparison(previous.exhibitors) },
              { label: 'Χορηγοί', value: current.sponsors, comparison: comparison(previous.sponsors) },
              { label: 'Ακυρώσεις', value: current.cancellations, comparison: comparison(previous.cancellations) },
              {
                label: 'Τ.μ. εκθετών',
                value: formatNumber.format(current.sqm),
                comparison: comparison(formatNumber.format(previous.sqm)),
              },
              {
                label: 'Μετατροπή',
                value: conversion(current.conversion),
                comparison: comparison(conversion(previous.conversion)),
              },
            ]}
          />
        </ReportSection>
        <ReportSection title="Δραστηριότητα περιόδου">
          <ReportCards
            cards={[
              { label: 'Ενέργειες', value: actions.length },
              { label: 'Εταιρείες με επαφή', value: report.contacted },
              { label: 'Νέα leads', value: newLeads.length },
              { label: `Ανοιχτά ${threshold}+ ημ. χωρίς επαφή`, value: overdue.length },
              { label: 'Ανοιχτά χωρίς καμία επαφή', value: report.noContact },
            ]}
          />
          {handlers.length > 0 && (
            <DataTable<(typeof handlers)[number]>
              id="rh"
              caption="Δραστηριότητα ανά χειριστή"
              rows={handlers}
              rowKey={(row) => row.label}
              columns={[
                labelColumn('Χειριστής'),
                numberColumn('actions', 'Ενέργειες', (row) => row.actions),
                numberColumn('companies', 'Εταιρείες', (row) => row.companies),
                ...types.map((type) =>
                  numberColumn<(typeof handlers)[number]>(`type:${type}`, type, (row) => row.byType.get(type) ?? 0),
                ),
                numberColumn('open', 'Ανοιχτά leads', (row) => row.open),
                numberColumn('overdue', 'Καθυστερημένα', (row) => row.overdue),
              ]}
            />
          )}
        </ReportSection>
        <ReportSection title={`Pipeline ${year}`}>
          {stages.length ? (
            <DataTable<(typeof stages)[number]>
              id="report-pipeline"
              caption="Pipeline ανά στάδιο"
              rows={stages}
              rowKey={(row) => row.label}
              columns={[
                {
                  ...labelColumn<(typeof stages)[number]>('Πορεία'),
                  render: (row) => (
                    <Stack gap={4}>
                      <Text size="sm">{row.label}</Text>
                      <Progress value={(100 * row.current) / stageMax} size="xs" aria-label={row.label} />
                    </Stack>
                  ),
                },
                numberColumn('current', String(year), (row) => row.current),
                numberColumn('previous', String(year - 1), (row) => row.previous),
                numberColumn('sqm', 'Τ.μ.', (row) => row.sqm),
              ]}
            />
          ) : (
            <Text size="sm" c="dimmed">
              Δεν έχουν οριστεί στάδια ενδιαφέροντος.
            </Text>
          )}
        </ReportSection>
        <ReportSection title={`Θέλουν επαφή (${overdue.length})`}>
          {overdue.length ? (
            <DataTable<(typeof overdue)[number]>
              id="rl"
              caption="Leads που θέλουν επικοινωνία"
              rows={overdue.slice(0, maxOverdue)}
              rowKey={(row) => row.lead.id}
              columns={[
                textColumn('Εταιρεία', (row) => row.lead.companyName),
                textColumn('Χειριστής', (row) => row.lead.handler),
                textColumn('Πορεία', (row) => row.lead.stage),
                {
                  ...textColumn<(typeof overdue)[number]>(
                    'Τελευταία επαφή',
                    (row) => formatDay(row.lead.lastDay) || 'καμία',
                  ),
                  sortValue: (row) => row.lead.lastDay || null,
                },
                numberColumn('days', 'Ημέρες', (row) => row.days),
                textColumn('Τι έγινε τελευταία', (row) => row.lead.lastDescription),
              ]}
            />
          ) : (
            <Text size="sm" c="dimmed">
              Κανένα ανοιχτό lead δεν έχει μείνει {threshold}+ ημέρες χωρίς επαφή.
            </Text>
          )}
          {overdue.length > maxOverdue && (
            <Text size="xs" c="dimmed">
              …και {overdue.length - maxOverdue} ακόμα στην Παρακολούθηση.
            </Text>
          )}
        </ReportSection>
        {newLeads.length > 0 && (
          <ReportSection title={`Νέα leads περιόδου (${newLeads.length})`}>
            <DataTable<Lead>
              id="rn"
              caption="Νέα leads περιόδου"
              rows={newLeads}
              rowKey={(row) => row.id}
              columns={[
                textColumn('Εταιρεία', (row) => row.companyName),
                numberColumn('year', 'Χρονιά', (row) => row.year),
                textColumn('Προέλευση', (row) => row.row.source),
                textColumn('Χειριστής', (row) => row.handler),
                textColumn('Πορεία', (row) => row.stage),
              ]}
            />
          </ReportSection>
        )}
        <ReportSection title={`Ενέργειες περιόδου (${actions.length})`}>
          {actions.length ? (
            <DataTable<Action>
              id="ra"
              caption="Ενέργειες περιόδου"
              rows={actions.slice(0, maxActions)}
              rowKey={(row) => row.id}
              columns={[
                {
                  ...textColumn<Action>('Ημερομηνία', (row) => formatDay(row.day)),
                  sortValue: (row) => row.day || null,
                },
                textColumn('Εταιρεία', (row) => row.companyName),
                textColumn('Τύπος', (row) => row.type),
                textColumn('Περιγραφή', (row) => row.description),
                textColumn('Χειριστής', (row) => row.handler),
              ]}
            />
          ) : (
            <Text size="sm" c="dimmed">
              Καμία ενέργεια στην περίοδο.
            </Text>
          )}
          {actions.length > maxActions && (
            <Text size="xs" c="dimmed">
              Εμφανίζονται οι {maxActions} πιο πρόσφατες ενέργειες.
            </Text>
          )}
        </ReportSection>
      </Stack>
    </Stack>
  );
}
