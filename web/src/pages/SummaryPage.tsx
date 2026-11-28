import { Group, NativeSelect, Paper, Progress, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import { useState } from 'react';
import { DataTable, type Column } from '../components/DataTable';
import { Empty, ErrorView, Loading } from '../components/StateViews';
import { usePref } from '../data/prefs';
import { store } from '../data/store';
import { useData } from '../data/useData';
import { listValues } from '../domain/derive';
import { summarize, type SourceGrouping } from '../domain/summary';

const metricLabels = {
  total: 'Σύνολο leads',
  open: 'Ανοιχτά leads περιπτέρου',
  exhibitors: 'Εκθέτες (περίπτερο)',
  sponsors: 'Χορηγοί (κλεισμένοι)',
  sponsorOpen: 'Χορηγίες σε εξέλιξη',
  cancellations: 'Ακυρώσεις (περίπτερο)',
  returning: 'Εκθέτες/χορηγοί και την προηγ. χρονιά',
  sqm: 'Τ.μ. εκθετών',
  proposedSqm: 'Τ.μ. σε ανοιχτές προτάσεις',
  conversion: 'Ποσοστό μετατροπής (εκθέτες / κλειστά)',
  actions: 'Ενέργειες',
  untouched: 'Leads χωρίς καμία ενέργεια',
};

const groups: { value: SourceGrouping; label: string }[] = [
  { value: 'full', label: 'Πλήρης προέλευση' },
  { value: 'type', label: 'Τύπος' },
  { value: 'channel', label: 'Κανάλι' },
];

function labelColumn<T extends { label: string }>(label: string): Column<T> {
  return { key: 'label', label, render: (row) => row.label, sortValue: (row) => row.label };
}

function numberColumn<T>(key: string, label: string, value: (row: T) => number | null, suffix = ''): Column<T> {
  return {
    key,
    label,
    align: 'right',
    noWrap: true,
    sortValue: value,
    render: (row) => {
      const n = value(row);
      return n === null ? '–' : `${n}${suffix}`;
    },
  };
}

export function SummaryPage() {
  const { state, error, data, derived } = useData();
  const [trackingYear] = usePref('year', 0);
  const [selectedYear, setYear] = useState<number>();
  const [group, setGroup] = useState<SourceGrouping>('full');

  if (state === 'idle' || state === 'loading') return <Loading />;
  if (state === 'error') return <ErrorView message={error} onRetry={() => void store.load()} />;

  const now = new Date();
  const years = new Set(listValues(data.lists, 'Χρονιά').map(Number).filter(Boolean));
  derived.leads.forEach((lead) => lead.year && years.add(lead.year));
  const latestLeadYear = derived.leads.reduce((latest, lead) => Math.max(latest, lead.year), 0);
  const year = selectedYear ?? (trackingYear || latestLeadYear || now.getFullYear());
  years.add(year);
  const { current, previous, stages, handlers, sources, recent, thisMonth } = summarize(
    derived,
    data.lists,
    year,
    group,
    now,
  );
  const maxStage = Math.max(1, ...stages.map((stage) => stage.current));
  const metrics = (Object.keys(metricLabels) as (keyof typeof metricLabels)[]).map((key) => ({
    key,
    label: metricLabels[key],
    current: current[key],
    previous: previous[key],
  }));
  const kpis = [
    { label: `Leads ${year}`, value: current.total },
    { label: 'Εκθέτες', value: current.exhibitors },
    { label: 'Χορηγοί', value: current.sponsors },
    { label: 'Τ.μ. εκθετών', value: current.sqm },
    { label: 'Ενέργειες τελευταίες 7 ημέρες', value: recent },
    { label: 'Ενέργειες τρέχοντος μήνα', value: thisMonth },
  ];
  const metricColumn = (key: 'current' | 'previous', label: string): Column<(typeof metrics)[number]> => ({
    ...numberColumn(key, label, (row) => row[key]),
    render: (row) => {
      const value = row[key];
      return value === null ? '–' : row.key === 'conversion' ? `${value}%` : value;
    },
  });

  return (
    <Stack gap="md">
      <Group>
        <NativeSelect
          label="Χρονιά"
          data={[...years].sort((a, b) => a - b).map(String)}
          value={year}
          onChange={(event) => setYear(Number(event.currentTarget.value))}
        />
      </Group>
      <SimpleGrid cols={{ base: 2, sm: 3, lg: 6 }} spacing="sm">
        {kpis.map(({ label, value }) => (
          <Paper key={label} withBorder p="sm">
            <Text fz="xl" fw={700} ff="heading">
              {value}
            </Text>
            <Text size="xs" c="dimmed">
              {label}
            </Text>
          </Paper>
        ))}
      </SimpleGrid>
      <SimpleGrid cols={{ base: 1, xl: 2 }} spacing="lg">
        <Stack gap="xs" miw={0}>
          <Title order={2} size="h4">
            Δείκτες
          </Title>
          <DataTable<(typeof metrics)[number]>
            id="sumi"
            caption="Σύγκριση δεικτών ανά χρονιά"
            rows={metrics}
            rowKey={(row) => row.key}
            columns={[
              labelColumn('Δείκτης'),
              metricColumn('current', String(year)),
              metricColumn('previous', String(year - 1)),
            ]}
          />
        </Stack>
        <Stack gap="md" miw={0}>
          <Stack gap="xs">
            <Title order={2} size="h4">
              Πορεία ενδιαφέροντος {year}
            </Title>
            {stages.length ? (
              <DataTable<(typeof stages)[number]>
                id="sumstage"
                caption="Πορεία ενδιαφέροντος"
                rows={stages}
                rowKey={(row) => row.label}
                columns={[
                  {
                    ...labelColumn<(typeof stages)[number]>('Πορεία'),
                    minWidth: 145,
                    render: (row) => (
                      <Stack gap={4}>
                        <Text size="sm">{row.label}</Text>
                        <Progress value={(100 * row.current) / maxStage} aria-label={row.label} size="xs" />
                      </Stack>
                    ),
                  },
                  numberColumn('current', String(year), (row) => row.current),
                  numberColumn('previous', String(year - 1), (row) => row.previous),
                  numberColumn('sqm', 'Τ.μ.', (row) => row.sqm),
                ]}
              />
            ) : (
              <Empty title="Δεν έχουν οριστεί στάδια ενδιαφέροντος" />
            )}
          </Stack>
          <Stack gap="xs">
            <Title order={2} size="h4">
              Ανά χειριστή ({year})
            </Title>
            {handlers.length ? (
              <DataTable<(typeof handlers)[number]>
                id="sumh"
                caption="Δείκτες ανά χειριστή"
                rows={handlers}
                rowKey={(row) => row.label}
                columns={[
                  labelColumn('Χειριστής'),
                  numberColumn('total', 'Leads', (row) => row.total),
                  numberColumn('open', 'Ανοιχτά', (row) => row.open),
                  numberColumn('exhibitors', 'Εκθέτες', (row) => row.exhibitors),
                  numberColumn('recent', 'Ενέργειες 7 ημ.', (row) => row.recent),
                ]}
              />
            ) : (
              <Empty title="Δεν έχουν οριστεί χειριστές" />
            )}
          </Stack>
        </Stack>
      </SimpleGrid>
      <Stack gap="xs">
        <Group justify="space-between" align="end">
          <Title order={2} size="h4">
            Ανά προέλευση ({year})
          </Title>
          <NativeSelect
            label="Ομαδοποίηση"
            data={groups}
            value={group}
            onChange={(event) => {
              const next = groups.find(({ value }) => value === event.currentTarget.value);
              if (next) setGroup(next.value);
            }}
          />
        </Group>
        {sources.length ? (
          <>
            <DataTable<(typeof sources)[number]>
              id="src"
              caption="Δείκτες ανά προέλευση"
              rows={sources}
              rowKey={(row) => row.label}
              columns={[
                labelColumn('Προέλευση'),
                numberColumn('total', `Leads ${year}`, (row) => row.total),
                numberColumn('share', '% του συνόλου', (row) => row.share, '%'),
                numberColumn('previous', `Leads ${year - 1}`, (row) => row.previous),
                numberColumn('open', 'Ανοιχτά', (row) => row.open),
                numberColumn('exhibitors', 'Εκθέτες', (row) => row.exhibitors),
                numberColumn('sponsors', 'Χορηγοί', (row) => row.sponsors),
                numberColumn('cancellations', 'Ακυρώσεις', (row) => row.cancellations),
                numberColumn('conversion', 'Μετατροπή', (row) => row.conversion, '%'),
                numberColumn('sqm', 'Τ.μ. εκθετών', (row) => row.sqm),
              ]}
            />
            <Text size="xs" c="dimmed">
              Μετατροπή = εκθέτες / (εκθέτες + ακυρώσεις).
            </Text>
          </>
        ) : (
          <Empty title={`Κανένα lead για ${year} ή ${year - 1}`} />
        )}
      </Stack>
    </Stack>
  );
}
