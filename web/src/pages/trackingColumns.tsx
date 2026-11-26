import { Group, Text } from '@mantine/core';
import type { Column } from '../components/DataTable';
import { Emails } from '../components/Emails';
import { formatDay } from '../domain/text';
import type { TrackingRow } from '../domain/tracking';

const dotColor = {
  red: 'var(--crm-red)',
  amber: 'var(--crm-amber)',
  green: 'var(--crm-green)',
  closed: 'var(--crm-closed)',
} as const;
const text = (v: unknown) => String(v ?? '');
const col = (
  key: string,
  get: (r: TrackingRow) => string | number | null | undefined,
  o: Partial<Column<TrackingRow>> = {},
): Column<TrackingRow> => ({
  key,
  label: key,
  render: (r) => text(get(r)),
  sortValue: (r) => {
    const v = get(r);
    return v === undefined || v === '' ? null : v;
  },
  ...o,
});

/** Όλες οι διαθέσιμες στήλες της Παρακολούθησης (ίδια ονόματα με την παλιά έκδοση, για να κρατηθούν οι επιλογές). */
export const TRACKING_COLUMNS: Column<TrackingRow>[] = [
  {
    key: 'Κατάσταση',
    label: 'Κατάσταση',
    noWrap: true,
    sortValue: (r) => (r.lead.open ? (r.days ?? 1e9) : 2e9),
    render: (r) => (
      <Group gap={6} wrap="nowrap">
        <span
          aria-hidden
          style={{ width: 10, height: 10, borderRadius: 5, background: dotColor[r.signal], flex: 'none' }}
        />
        <Text fz="sm" fw={500}>
          {r.label}
        </Text>
      </Group>
    ),
  },
  col('Εταιρεία', (r) => r.lead.companyName, {
    minWidth: 190,
    maxWidth: 300,
    render: (r) => (
      <Text fz="sm" fw={600}>
        {r.lead.companyName}
      </Text>
    ),
  }),
  col('Χειριστής', (r) => r.lead.handler, { minWidth: 130, maxWidth: 220 }),
  col('Πορεία', (r) => r.lead.stage, { minWidth: 130, maxWidth: 220 }),
  col('Χορηγία', (r) => r.lead.sponsor, { minWidth: 110 }),
  col('Τελευταία επαφή', (r) => r.lead.lastDay || null, { noWrap: true, render: (r) => formatDay(r.lead.lastDay) }),
  col('Τι έγινε τελευταία', (r) => r.lead.lastDescription, { minWidth: 220, maxWidth: 420 }),
  col('Επαφή', (r) => r.lead.company?.person, { minWidth: 130, maxWidth: 220 }),
  col('Τηλέφωνο', (r) => r.lead.company?.phone, { minWidth: 120, maxWidth: 170 }),
  col('Email', (r) => r.lead.company?.email, {
    minWidth: 170,
    maxWidth: 240,
    render: (r) => <Emails value={r.lead.company?.email ?? ''} />,
  }),
  col('Προέλευση', (r) => r.lead.row.source, { minWidth: 130, maxWidth: 220 }),
  col('Τ.μ.', (r) => (r.lead.row.sqm === null || r.lead.row.sqm === '' ? null : Number(r.lead.row.sqm)), {
    align: 'right',
    noWrap: true,
  }),
  col('Χρονιά', (r) => r.lead.year, { align: 'right' }),
  col('Κλάδος', (r) => r.lead.company?.row.sector, { minWidth: 130 }),
  col('Λόγος ακύρωσης', (r) => r.lead.row.cancel_reason, { minWidth: 130 }),
  col('Hall', (r) => r.lead.row.hall, { noWrap: true }),
  col('Αριθμός Stand', (r) => r.lead.row.stand, { noWrap: true }),
  col('Εκθέτης προηγ. χρονιάς', (r) => (r.lead.prevExhibitor ? 'Ναι' : 'Όχι')),
  col('Σημειώσεις', (r) => r.lead.row.notes, { minWidth: 220, maxWidth: 420 }),
  {
    ...col('Ιστορικό ενεργειών', () => null),
    sortValue: undefined,
    minWidth: 280,
    render: (r) => (
      <Text fz="sm" style={{ whiteSpace: 'pre-line' }}>
        {r.lead.actions.map((a) => `${formatDay(a.day)} ${a.type ? `[${a.type}] ` : ''}${a.description}`).join('\n')}
      </Text>
    ),
  },
  col('Αρχικά σχόλια List', (r) => r.lead.row.list_comments, { minWidth: 200 }),
];
export const DEFAULT_COLUMNS = [
  'Κατάσταση',
  'Εταιρεία',
  'Χειριστής',
  'Πορεία',
  'Χορηγία',
  'Τελευταία επαφή',
  'Τι έγινε τελευταία',
  'Επαφή',
  'Τηλέφωνο',
  'Email',
  'Προέλευση',
  'Τ.μ.',
];
export const FIXED_COLUMNS = ['Κατάσταση', 'Εταιρεία'];
