import { Alert, MultiSelect, NativeSelect, Select, SimpleGrid, Textarea, TextInput } from '@mantine/core';
import { useState, type SubmitEvent } from 'react';
import { usePref } from '../data/prefs';
import { store } from '../data/store';
import { supabase } from '../data/supabase';
import { useData } from '../data/useData';
import { listValues } from '../domain/derive';
import { handlerParts } from '../domain/text';
import type { ActionRow, Company, CompanyRow, ContactRow, LeadRow } from '../domain/types';
import { CompanyFormDialog } from './CompanyFormDialog';
import { FirstLeadActivity, NewCompanyFields } from './NewLeadDetails';

const selectFields = [
  ['source', 'Προέλευση'],
  ['stage', 'Πορεία ενδιαφέροντος'],
  ['sponsor', 'Χορηγία'],
  ['cancel_reason', 'Λόγος ακύρωσης'],
  ['hall', 'Hall'],
] as const;

export function LeadForm({
  company,
  lead,
  onClose,
  onSaved,
}: {
  company?: Company;
  lead?: LeadRow;
  onClose: () => void;
  onSaved: (message: string, companyCode?: number) => void;
}) {
  const { data, derived } = useData();
  const [companyMode, setCompanyMode] = useState<'existing' | 'new'>('existing');
  const [companyCode, setCompanyCode] = useState<string | null>(null);
  const bundle = !company;
  const selectedCompany = company ?? (companyCode ? derived.companies.get(Number(companyCode)) : undefined);
  const existingCompany = bundle && companyMode === 'new' ? undefined : selectedCompany;
  const [preferredYear] = usePref('year', 0);
  const [me] = usePref('me', '');
  const calendarYear = new Date().getFullYear();
  const years = [
    ...new Set([calendarYear, calendarYear + 1, preferredYear, ...listValues(data.lists, 'Χρονιά').map(Number)]),
  ]
    .filter((year) => Number.isInteger(year) && year > 0 && !existingCompany?.leads.some((item) => item.year === year))
    .sort((a, b) => b - a);
  const defaultYear = [preferredYear, calendarYear, ...years].find((year) => years.includes(year));
  const [handlers, setHandlers] = useState(() => handlerParts(lead?.handler ?? (lead ? '' : me)));
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const handlerOptions = [...new Set([...listValues(data.lists, 'Χειριστής').flatMap(handlerParts), ...handlers])];

  async function save(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setError('');
    const form = new FormData(event.currentTarget);
    const field = (name: string) => String(form.get(name) ?? '').trim() || null;
    const companyName = field('company_name')?.replace(/\s+/g, ' ');
    if (!existingCompany && !(bundle && companyMode === 'new' && companyName)) {
      setError('Επιλέξτε εταιρεία ή συμπληρώστε την επωνυμία της νέας εταιρείας.');
      return;
    }
    const year = lead?.year ?? Number(field('year'));
    const sqm = field('sqm');
    const area = sqm === null ? null : Number(sqm);
    if (!lead && !years.includes(year)) {
      setError('Επιλέξτε διαθέσιμη χρονιά για την εταιρεία.');
      return;
    }
    if (area !== null && (!Number.isFinite(area) || area < 0)) {
      setError('Συμπληρώστε έγκυρη επιφάνεια σε τετραγωνικά μέτρα.');
      return;
    }
    const fields = {
      source: field('source'),
      stage: field('stage'),
      sponsor: field('sponsor'),
      cancel_reason: field('cancel_reason'),
      hall: field('hall'),
      stand: field('stand'),
      sqm: area,
      handler: handlers.join(', ') || null,
      notes: field('notes'),
      list_comments: field('list_comments'),
    };
    setPending(true);
    try {
      if (bundle) {
        const contact = {
          name: field('contact_name'),
          role: field('contact_role'),
          phone: field('contact_phone'),
          email: field('contact_email'),
        };
        const action = {
          action_date: field('action_date'),
          type: field('action_type'),
          description: field('action_description'),
        };
        const { data, error } = await supabase.rpc('create_lead_bundle', {
          p_company_code: existingCompany?.code ?? null,
          p_company: existingCompany
            ? null
            : {
                name: companyName,
                country: field('country'),
                sector: field('sector'),
                fgret: field('fgret'),
                tellody: field('tellody'),
              },
          p_lead: { year, ...fields },
          p_contact: Object.values(contact).some(Boolean) ? contact : null,
          p_action: action.type || action.description ? action : null,
        });
        const result = data as unknown as {
          company: CompanyRow;
          lead: LeadRow;
          contact: ContactRow | null;
          action: ActionRow | null;
        } | null;
        if (error || !result?.company || !result.lead) {
          setError(
            error?.code === 'PGRST202'
              ? 'Η ενιαία καταχώριση χρειάζεται ενεργοποίηση στο Supabase. Ενημερώστε τον διαχειριστή.'
              : (error?.message ?? 'Η καταχώριση δεν αποθηκεύτηκε.'),
          );
          return;
        }
        store.apply('companies', 'upsert', { ...result.company });
        store.apply('leads', 'upsert', { ...result.lead });
        if (result.contact) store.apply('contacts', 'upsert', { ...result.contact });
        if (result.action) store.apply('actions', 'upsert', { ...result.action });
        onSaved(`Το lead για το ${year} αποθηκεύτηκε.`, result.company.code);
        return;
      }
      if (!company) return;
      const changed =
        lead &&
        Object.fromEntries(
          Object.entries(fields).filter(([key, value]) => {
            const original = lead[key as keyof typeof fields];
            return key === 'sqm'
              ? value !== (original === null || original === '' ? null : Number(original))
              : value !== (String(original ?? '').trim() || null);
          }),
        );
      if (changed && !Object.keys(changed).length) {
        onClose();
        return;
      }
      const write = lead
        ? supabase
            .from('leads')
            .update(changed ?? fields)
            .eq('id', lead.id)
            .eq('company_code', company.code)
        : supabase.from('leads').insert({ company_code: company.code, year, ...fields });
      const { data, error } = await write.select().maybeSingle<LeadRow>();
      if (error?.code === '23505' && !lead) {
        setError(`Υπάρχει ήδη lead για την εταιρεία το ${year}.`);
        return;
      }
      if (error || !data) {
        setError(error?.message ?? 'Το lead δεν είναι πλέον διαθέσιμο.');
        return;
      }
      store.apply('leads', 'upsert', { ...data });
      onSaved(lead ? 'Το lead ενημερώθηκε.' : `Το lead για το ${year} αποθηκεύτηκε.`);
    } catch {
      setError('Η αποθήκευση δεν ολοκληρώθηκε. Δοκιμάστε ξανά.');
    } finally {
      setPending(false);
    }
  }

  return (
    <CompanyFormDialog
      title={bundle ? 'Νέο lead / νέα εταιρεία' : lead ? 'Επεξεργασία lead' : 'Lead νέας χρονιάς'}
      submitLabel="Αποθήκευση"
      pending={pending}
      onClose={onClose}
      onSubmit={(event) => void save(event)}
    >
      {company ? (
        <TextInput label="Εταιρεία" readOnly value={`${company.code} · ${company.name}`} />
      ) : (
        <>
          <NativeSelect
            label="Καταχώριση για"
            data-autofocus
            data={[
              { value: 'existing', label: 'Υπάρχουσα εταιρεία' },
              { value: 'new', label: 'Νέα εταιρεία' },
            ]}
            value={companyMode}
            onChange={(event) => setCompanyMode(event.currentTarget.value === 'new' ? 'new' : 'existing')}
            disabled={pending}
          />
          {companyMode === 'new' ? (
            <NewCompanyFields lists={data.lists} disabled={pending} />
          ) : (
            <Select
              label="Εταιρεία"
              required
              searchable
              limit={20}
              nothingFoundMessage="Δεν βρέθηκε εταιρεία"
              comboboxProps={{ withinPortal: false }}
              data={[...derived.companies.values()].map(({ code, name }) => ({
                value: String(code),
                label: `${code} · ${name}`,
              }))}
              value={companyCode}
              onChange={setCompanyCode}
              disabled={pending}
            />
          )}
        </>
      )}
      {!lead && !years.length && <Alert color="yellow">Υπάρχει ήδη lead για όλες τις διαθέσιμες χρονιές.</Alert>}
      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xs">
        {lead ? (
          <TextInput label="Χρονιά" readOnly value={lead.year} />
        ) : (
          <NativeSelect
            key={existingCompany?.code ?? companyMode}
            label="Χρονιά"
            name="year"
            data={[{ value: '', label: 'Επιλέξτε χρονιά' }, ...years.map(String)]}
            defaultValue={String(defaultYear ?? '')}
            required
            data-autofocus={company ? true : undefined}
            disabled={pending || !years.length}
          />
        )}
        {selectFields.map(([key, label]) => {
          const value = lead?.[key] ?? '';
          const options = [...new Set([...listValues(data.lists, label), value])].filter(Boolean);
          return (
            <NativeSelect
              key={key}
              name={key}
              label={label}
              data={[{ value: '', label: '—' }, ...options]}
              defaultValue={value}
              data-autofocus={lead && key === 'source' ? true : undefined}
              disabled={pending}
            />
          );
        })}
        <TextInput label="Αριθμός Stand" name="stand" defaultValue={lead?.stand ?? ''} disabled={pending} />
        <TextInput
          label="Τ.μ."
          name="sqm"
          type="number"
          min={0}
          step="any"
          defaultValue={lead?.sqm ?? ''}
          disabled={pending}
        />
      </SimpleGrid>
      <MultiSelect
        label="Χειριστής"
        data={handlerOptions}
        value={handlers}
        onChange={setHandlers}
        searchable
        comboboxProps={{ withinPortal: false }}
        disabled={pending}
      />
      <Textarea
        label="Σημειώσεις"
        name="notes"
        minRows={2}
        autosize
        defaultValue={lead?.notes ?? ''}
        disabled={pending}
      />
      <Textarea
        label="Αρχικά σχόλια List"
        name="list_comments"
        minRows={2}
        autosize
        defaultValue={lead?.list_comments ?? ''}
        disabled={pending}
      />
      {bundle && <FirstLeadActivity lists={data.lists} disabled={pending} />}
      {error && (
        <Alert color="red" role="alert">
          {error}
        </Alert>
      )}
    </CompanyFormDialog>
  );
}
