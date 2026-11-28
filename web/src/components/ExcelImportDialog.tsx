import {
  Alert,
  Button,
  Checkbox,
  FileInput,
  Group,
  MultiSelect,
  NativeSelect,
  NumberInput,
  Progress,
  Select,
  SimpleGrid,
  Table,
  Text,
} from '@mantine/core';
import { useState, type SubmitEvent } from 'react';
import { usePref } from '../data/prefs';
import { store } from '../data/store';
import { supabase } from '../data/supabase';
import { useData } from '../data/useData';
import { countryOf } from '../domain/countries';
import { listValues } from '../domain/derive';
import {
  companyImportKey,
  guessImportMapping,
  importFields,
  readImportFile,
  sheetColumns,
  type ImportField,
  type ImportMapping,
  type ImportSheet,
} from '../domain/excelImport';
import { handlerParts, norm } from '../domain/text';
import type { ActionRow, CompanyRow, ContactRow, LeadRow } from '../domain/types';
import { CompanyFormDialog } from './CompanyFormDialog';

type Candidate = {
  company: string;
  line: number;
  fields: Record<ImportField, string>;
  target: string;
  similar?: string;
};
type ImportResult = { company: CompanyRow; lead: LeadRow; contact: ContactRow | null; action: ActionRow | null };
const skip = 'skip';
const newCompany = 'new';

export function ExcelImportDialog({ onClose }: { onClose: () => void }) {
  const { derived, data } = useData();
  const [defaultYear] = usePref('year', 0);
  const [me] = usePref('me', '');
  const [file, setFile] = useState<File | null>(null);
  const [sheets, setSheets] = useState<ImportSheet[]>([]);
  const [sheetIndex, setSheetIndex] = useState(0);
  const [mapping, setMapping] = useState<ImportMapping>({});
  const [year, setYear] = useState<number | string>(defaultYear || new Date().getFullYear());
  const [source, setSource] = useState('');
  const [stage, setStage] = useState(listValues(data.lists, 'Πορεία ενδιαφέροντος')[0] ?? '');
  const [hall, setHall] = useState('');
  const [handlers, setHandlers] = useState(handlerParts(me));
  const [log, setLog] = useState(false);
  const [step, setStep] = useState<'file' | 'mapping' | 'review' | 'results'>('file');
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const [summary, setSummary] = useState({ companies: 0, leads: 0, contacts: 0, skipped: 0 });
  const [failures, setFailures] = useState<string[]>([]);
  const sheet = sheets[sheetIndex];
  const columns = sheet ? sheetColumns(sheet) : { headers: [], rows: [] };
  const options = [
    { value: newCompany, label: 'Νέα εταιρεία + lead' },
    { value: skip, label: 'Παράλειψη' },
    ...Array.from(derived.companies.values(), ({ code, name }) => ({
      value: String(code),
      label: `${code} · ${name}`,
    })),
  ];
  const items = candidates.filter((row) => row.target !== skip);

  async function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setError('');
    if (step === 'results') {
      onClose();
      return;
    }
    if (step === 'file') {
      if (!file) {
        setError('Επιλέξτε αρχείο.');
        return;
      }
      setPending(true);
      try {
        const parsed = await readImportFile(file);
        if (!parsed.length) throw new Error('Το αρχείο δεν έχει διαθέσιμα φύλλα.');
        setSheets(parsed);
        setSheetIndex(0);
        setMapping(guessImportMapping(sheetColumns(parsed[0]).headers));
        setStep('mapping');
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : 'Δεν διαβάστηκε το αρχείο.');
      } finally {
        setPending(false);
      }
      return;
    }
    if (step === 'mapping') {
      if (!mapping.company || !Number.isInteger(Number(year)) || Number(year) < 1) {
        setError('Επιλέξτε στήλη εταιρείας και έγκυρη χρονιά.');
        return;
      }
      if (!columns.rows.length) {
        setError('Το φύλλο δεν έχει γραμμές δεδομένων.');
        return;
      }
      const byName = new Map(Array.from(derived.companies.values(), (company) => [norm(company.name), company.code]));
      const bySimilarName = new Map(
        Array.from(derived.companies.values(), (company) => [companyImportKey(company.name), company.name]),
      );
      setCandidates(
        columns.rows.map(({ cells, line }) => {
          const fields = Object.fromEntries(
            importFields.map(([key]) => [key, mapping[key] ? (cells[Number(mapping[key])]?.trim() ?? '') : '']),
          ) as Record<ImportField, string>;
          const company = fields.company.replace(/\s+/g, ' ');
          const match = byName.get(norm(company));
          const similar = company && !match ? bySimilarName.get(companyImportKey(company)) : undefined;
          return {
            company,
            fields,
            line,
            target: !company ? skip : match ? String(match) : newCompany,
            similar,
          };
        }),
      );
      setStep('review');
      return;
    }

    if (!items.length) {
      setError('Δεν έχει επιλεγεί καμία γραμμή για εισαγωγή.');
      return;
    }
    setPending(true);
    setStep('results');
    const totals = { companies: 0, leads: 0, contacts: 0, skipped: candidates.length - items.length };
    const companyCodes = new Map<string, number>();
    for (const [index, candidate] of items.entries()) {
      try {
        const fields = candidate.fields;
        const key = norm(candidate.company);
        const code = candidate.target === newCompany ? companyCodes.get(key) : Number(candidate.target);
        const company = code ? store.getSnapshot().derived.companies.get(code) : undefined;
        const area = fields.sqm ? Number(fields.sqm.replace(',', '.')) : null;
        if (area !== null && (!Number.isFinite(area) || area < 0)) throw new Error('Τα τετραγωνικά δεν είναι έγκυρα.');
        const contact =
          fields.contact || fields.phone || fields.email
            ? {
                name: fields.contact || 'Γενικά στοιχεία',
                role: fields.role || null,
                phone: fields.phone || null,
                email: fields.email || null,
              }
            : null;
        if (company?.leads.some((lead) => lead.year === Number(year))) {
          if (!contact || company.contacts.some((row) => norm(row.name) === norm(contact.name))) {
            totals.skipped++;
          } else {
            const { data, error } = await supabase
              .from('contacts')
              .insert({
                company_code: company.code,
                ...contact,
                is_primary: company.contacts.length === 0,
              })
              .select()
              .maybeSingle<ContactRow>();
            if (error || !data) throw new Error(error?.message ?? 'Η επαφή δεν αποθηκεύτηκε.');
            store.apply('contacts', 'upsert', { ...data });
            totals.contacts++;
          }
        } else {
          const { data, error } = await supabase.rpc('create_lead_bundle', {
            p_company_code: code ?? null,
            p_company: code
              ? null
              : {
                  name: candidate.company,
                  sector: fields.sector || null,
                  country: (countryOf(fields.country)?.name ?? fields.country) || null,
                },
            p_lead: {
              year: Number(year),
              source: source || null,
              stage: stage || null,
              hall: hall || null,
              handler: handlers.join(', ') || null,
              sqm: area,
              notes: fields.notes || null,
              list_comments: fields.list_comments || null,
            },
            p_contact: contact,
            p_action: log ? { description: `Εισαγωγή από ${file?.name ?? 'Excel'}` } : null,
          });
          const result = data as unknown as ImportResult | null;
          if (error || !result?.company || !result.lead) {
            throw new Error(
              error?.code === 'PGRST202'
                ? 'Λείπει η συνάρτηση create_lead_bundle στο Supabase.'
                : (error?.message ?? 'Το lead δεν αποθηκεύτηκε.'),
            );
          }
          if (!code) companyCodes.set(key, result.company.code);
          store.apply('companies', 'upsert', { ...result.company });
          store.apply('leads', 'upsert', { ...result.lead });
          if (result.contact) {
            store.apply('contacts', 'upsert', { ...result.contact });
            totals.contacts++;
          }
          if (result.action) store.apply('actions', 'upsert', { ...result.action });
          totals.leads++;
          if (!code) totals.companies++;
        }
      } catch (cause) {
        setFailures((previous) => [
          ...previous,
          `Γραμμή ${candidate.line} · ${candidate.company}: ${cause instanceof Error ? cause.message : 'Η γραμμή δεν αποθηκεύτηκε.'}`,
        ]);
      }
      setProgress(index + 1);
      setSummary({ ...totals });
    }
    setPending(false);
  }

  return (
    <CompanyFormDialog
      title="Εισαγωγή Excel / CSV"
      submitLabel={
        {
          file: 'Αντιστοίχιση στηλών',
          mapping: 'Έλεγχος γραμμών',
          review: `Εισαγωγή ${items.length} γραμμών`,
          results: 'Κλείσιμο',
        }[step]
      }
      pending={pending}
      onClose={onClose}
      onSubmit={(event) => void submit(event)}
    >
      {step === 'file' && (
        <FileInput
          label="Αρχείο .xlsx ή .csv"
          placeholder="Επιλέξτε αρχείο"
          accept=".xlsx,.csv"
          value={file}
          onChange={setFile}
          required
        />
      )}
      {step === 'mapping' && (
        <>
          <NativeSelect
            label="Φύλλο"
            value={String(sheetIndex)}
            data={sheets.map((value, index) => ({ value: String(index), label: value.name }))}
            onChange={(event) => {
              const index = Number(event.currentTarget.value);
              setSheetIndex(index);
              setMapping(guessImportMapping(sheetColumns(sheets[index]).headers));
            }}
          />
          <Text size="sm">{columns.rows.length} γραμμές δεδομένων. Επιλέξτε τις αντίστοιχες στήλες.</Text>
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xs">
            {importFields.map(([key, label]) => (
              <NativeSelect
                key={key}
                label={label}
                value={mapping[key] ?? ''}
                data={[
                  { value: '', label: '—' },
                  ...columns.headers.map((value, index) => ({
                    value: String(index),
                    label: value || `Στήλη ${index + 1}`,
                  })),
                ]}
                onChange={(event) => setMapping({ ...mapping, [key]: event.currentTarget.value })}
              />
            ))}
            <NumberInput
              label="Χρονιά νέων leads"
              value={year}
              onChange={setYear}
              allowDecimal={false}
              min={1}
              required
            />
            {(['Προέλευση', 'Πορεία ενδιαφέροντος', 'Hall'] as const).map((label, index) => (
              <NativeSelect
                key={label}
                label={`${label} για νέα leads`}
                value={[source, stage, hall][index]}
                data={[{ value: '', label: '—' }, ...new Set(listValues(data.lists, label))]}
                onChange={(event) => [setSource, setStage, setHall][index](event.currentTarget.value)}
              />
            ))}
          </SimpleGrid>
          <MultiSelect
            label="Χειριστές νέων leads"
            value={handlers}
            onChange={setHandlers}
            searchable
            comboboxProps={{ withinPortal: false }}
            data={[...new Set([...listValues(data.lists, 'Χειριστής').flatMap(handlerParts), ...handlers])]}
          />
          <Checkbox
            label="Καταγραφή πρώτης ενέργειας εισαγωγής"
            checked={log}
            onChange={(event) => setLog(event.currentTarget.checked)}
          />
        </>
      )}
      {step === 'review' && (
        <>
          <Text size="sm">
            Ελέγξτε την αντιστοίχιση. Αν υπάρχει ήδη lead για τη χρονιά, προστίθεται μόνο η επαφή, εφόσον λείπει.
          </Text>
          <Table.ScrollContainer minWidth={490}>
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Γραμμή</Table.Th>
                  <Table.Th>Εταιρεία στο αρχείο</Table.Th>
                  <Table.Th>Ενέργεια</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {candidates.map((row, index) => (
                  <Table.Tr key={row.line}>
                    <Table.Td>{row.line}</Table.Td>
                    <Table.Td>
                      {row.company || '—'}
                      {row.similar && (
                        <Text size="xs" c="dimmed">
                          Παρόμοια επωνυμία · {row.similar}
                        </Text>
                      )}
                    </Table.Td>
                    <Table.Td>
                      <Select
                        aria-label={`Επιλογή για τη γραμμή ${row.line}`}
                        value={row.target}
                        disabled={!row.company}
                        data={options}
                        searchable
                        allowDeselect={false}
                        limit={20}
                        nothingFoundMessage="Δεν βρέθηκε εταιρεία"
                        onChange={(target) => {
                          if (target)
                            setCandidates(candidates.map((item, i) => (i === index ? { ...item, target } : item)));
                        }}
                      />
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        </>
      )}
      {step === 'results' && (
        <>
          <Progress value={items.length ? (100 * progress) / items.length : 0} aria-label="Πρόοδος εισαγωγής" />
          <Text role="status">
            Επεξεργάστηκαν {progress} από {items.length} γραμμές.
          </Text>
          <Text>
            Νέες εταιρείες {summary.companies} · Leads {summary.leads} · Επαφές {summary.contacts} · Παραλείψεις{' '}
            {summary.skipped}
          </Text>
          {failures.length > 0 && (
            <Alert color="red">
              <ul>
                {failures.map((failure) => (
                  <li key={failure}>{failure}</li>
                ))}
              </ul>
            </Alert>
          )}
        </>
      )}
      {(step === 'mapping' || step === 'review') && (
        <Group>
          <Button type="button" variant="default" onClick={() => setStep(step === 'review' ? 'mapping' : 'file')}>
            Πίσω
          </Button>
        </Group>
      )}
      {error && (
        <Alert role="alert" color="red">
          {error}
        </Alert>
      )}
    </CompanyFormDialog>
  );
}
