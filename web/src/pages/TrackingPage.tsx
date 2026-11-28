import {
  Anchor,
  Button,
  Chip,
  Group,
  Paper,
  SegmentedControl,
  Select,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconCopy, IconSearch } from '@tabler/icons-react';
import { useMemo, useState } from 'react';
import { ColumnChooser } from '../components/ColumnChooser';
import { DataTable } from '../components/DataTable';
import { copyText } from '../components/Emails';
import { Empty, ErrorView, Loading } from '../components/StateViews';
import { usePref } from '../data/prefs';
import { store } from '../data/store';
import { useData } from '../data/useData';
import { listValues } from '../domain/derive';
import { emailsOf, todayDay } from '../domain/text';
import { ALL, NO_HANDLER, baseLeads, kpis, trackingRows, type TrackingRow } from '../domain/tracking';
import { DEFAULT_COLUMNS, FIXED_COLUMNS, TRACKING_COLUMNS } from './trackingColumns';

const rowBg = { red: 'var(--crm-red-bg)', amber: 'var(--crm-amber-bg)', green: undefined, closed: undefined } as const;

function Kpi({ value, label, tone }: { value: number; label: string; tone?: 'red' | 'amber' | 'green' }) {
  const color = tone ? `var(--crm-${tone})` : undefined;
  return (
    <Paper withBorder p="sm" radius="md" style={tone === 'red' ? { borderColor: color } : undefined}>
      <Text fz={26} fw={700} lh={1.1} ff="heading" style={{ color }}>
        {value}
      </Text>
      <Text size="xs" c="dimmed">
        {label}
      </Text>
    </Paper>
  );
}

export function TrackingPage({
  onOpenCompany,
  onQuickAction,
}: {
  onOpenCompany: (code: number) => void;
  onQuickAction: (code: number, year: number) => void;
}) {
  const { state, error, data, derived } = useData();
  const [cols, setCols] = usePref('cols', DEFAULT_COLUMNS);
  const [prefYear, setYear] = usePref('year', 0);
  const [handler, setHandler] = usePref('handler', ALL);
  const [orange] = usePref('orange', 7);
  const [red] = usePref('red', 21);
  const [show, setShow] = useState<'open' | 'all'>('open');
  const [stage, setStage] = useState('');
  const [query, setQuery] = useState('');

  const years = useMemo(() => {
    const s = new Set<number>(listValues(data.lists, 'Χρονιά').map(Number).filter(Boolean));
    derived.leads.forEach((l) => l.year && s.add(l.year));
    return [...s].sort();
  }, [data.lists, derived.leads]);
  const latestWithLeads = derived.leads.reduce((mx, l) => Math.max(mx, l.year), 0);
  const year = prefYear || latestWithLeads || new Date().getFullYear();
  const handlers = [ALL, NO_HANDLER, ...listValues(data.lists, 'Χειριστής').filter((h) => !h.includes(','))];
  const stages = listValues(data.lists, 'Πορεία ενδιαφέροντος');
  const today = todayDay();

  const rows = useMemo(
    () => trackingRows(derived.leads, { year, handler, showClosed: show === 'all', stage, query }, today, orange, red),
    [derived.leads, year, handler, show, stage, query, today, orange, red],
  );
  const base = useMemo(() => baseLeads(derived.leads, { year, handler }), [derived.leads, year, handler]);
  const k = kpis(rows, orange, red);
  const columns = useMemo(
    () =>
      cols
        .map((c) => TRACKING_COLUMNS.find((x) => x.key === c))
        .filter((c): c is (typeof TRACKING_COLUMNS)[number] => !!c)
        .map((c) =>
          c.key === 'Εταιρεία'
            ? {
                ...c,
                render: (r: TrackingRow) =>
                  r.lead.company ? (
                    <Anchor
                      component="button"
                      type="button"
                      ta="left"
                      fw={600}
                      onClick={() => onOpenCompany(r.lead.code)}
                    >
                      {r.lead.companyName}
                    </Anchor>
                  ) : (
                    c.render(r)
                  ),
              }
            : c,
        ),
    [cols, onOpenCompany],
  );

  function copyAll() {
    const seen = new Set<string>(),
      out: string[] = [];
    for (const r of rows)
      for (const e of emailsOf(r.lead.company?.email))
        if (!seen.has(e.toLowerCase())) {
          seen.add(e.toLowerCase());
          out.push(e);
        }
    if (!out.length)
      return void notifications.show({ color: 'red', message: 'Δεν υπάρχουν email στη λίστα που βλέπετε.' });
    void copyText(out.join('; '), `Αντιγράφηκαν ${out.length} email (χωρισμένα με «;» – για Bcc στο Outlook).`);
  }

  if (state === 'loading' || state === 'idle') return <Loading />;
  if (state === 'error') return <ErrorView message={error} onRetry={() => void store.load()} />;

  return (
    <Stack gap="md">
      <SimpleGrid cols={{ base: 1, xs: 2, md: 4 }} spacing="sm">
        <Select
          label="Χρονιά"
          data={years.map(String)}
          value={String(year)}
          onChange={(v) => v && setYear(Number(v))}
          allowDeselect={false}
        />
        <Select
          label="Χειριστής"
          data={handlers}
          value={handler}
          onChange={(v) => v && setHandler(v)}
          allowDeselect={false}
        />
        <div>
          <Text component="span" size="sm" fw={500} id="show-label">
            Εμφάνιση
          </Text>
          <SegmentedControl
            fullWidth
            aria-labelledby="show-label"
            value={show}
            onChange={(v) => setShow(v as 'open' | 'all')}
            data={[
              { value: 'open', label: 'Μόνο ανοιχτά' },
              { value: 'all', label: 'Όλα' },
            ]}
          />
        </div>
        <TextInput
          label="Αναζήτηση"
          type="search"
          placeholder="εταιρεία, επαφή, τηλέφωνο, σημείωση…"
          leftSection={<IconSearch size={16} />}
          value={query}
          onChange={(e) => setQuery(e.currentTarget.value)}
        />
      </SimpleGrid>

      <SimpleGrid cols={{ base: 2, sm: 3, lg: 5 }} spacing="sm">
        <Kpi value={k.overdue} label={`${red}+ ημ. χωρίς επαφή`} tone="red" />
        <Kpi value={k.never} label="Καμία επαφή ακόμα" tone="red" />
        <Kpi value={k.soon} label={`Θέλουν επαφή σύντομα (${orange}+ ημ.)`} tone="amber" />
        <Kpi value={k.recent} label="Πρόσφατη επαφή" tone="green" />
        <Kpi value={k.total} label="Σύνολο στη λίστα" />
      </SimpleGrid>

      <Group gap={6} align="center">
        <Text size="sm" c="dimmed" id="pipe-label">
          Pipeline {year}:
        </Text>
        <Chip.Group value={stage} onChange={(v) => setStage(typeof v === 'string' ? v : '')}>
          <Group gap={6} role="group" aria-labelledby="pipe-label">
            {stages.map((s) => (
              <Chip key={s} value={s} size="xs" variant="outline" onClick={() => stage === s && setStage('')}>
                {s} · {base.filter((l) => l.stage === s).length}
              </Chip>
            ))}
          </Group>
        </Chip.Group>
      </Group>

      <Group justify="space-between" wrap="wrap" gap="sm">
        <Text size="sm" c="dimmed" aria-live="polite">
          {rows.length} leads
        </Text>
        <Group gap="sm">
          <ColumnChooser
            all={TRACKING_COLUMNS.map((c) => c.key)}
            selected={cols}
            fixed={FIXED_COLUMNS}
            defaults={DEFAULT_COLUMNS}
            onChange={setCols}
          />
          <Button variant="default" leftSection={<IconCopy size={16} />} onClick={copyAll}>
            Αντιγραφή email
          </Button>
        </Group>
      </Group>

      {rows.length === 0 ? (
        <Empty
          title="Δεν υπάρχουν leads με αυτά τα φίλτρα"
          description="Αλλάξτε χρονιά, χειριστή ή «Εμφάνιση: Όλα», ή καθαρίστε την αναζήτηση."
        />
      ) : (
        <DataTable<TrackingRow>
          id="trk"
          caption={`Παρακολούθηση leads ${year}`}
          columns={columns}
          rows={rows}
          rowKey={(r) => r.lead.id}
          leading={{
            label: 'Νέα ενέργεια',
            render: ({ lead }) =>
              lead.company && (
                <Button
                  variant="default"
                  size="compact-xs"
                  aria-label={`Νέα ενέργεια για ${lead.companyName}, ${lead.year}`}
                  onClick={() => onQuickAction(lead.code, lead.year)}
                >
                  + Ενέργεια
                </Button>
              ),
          }}
          rowAction={(r) => (r.lead.company ? () => onOpenCompany(r.lead.code) : undefined)}
          rowStyle={(r) => (r.lead.open && rowBg[r.signal] ? { background: rowBg[r.signal] } : undefined)}
        />
      )}
    </Stack>
  );
}
