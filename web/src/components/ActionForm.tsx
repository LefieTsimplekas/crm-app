import { Alert, Collapse, MultiSelect, NativeSelect, Switch, SimpleGrid, Textarea, TextInput } from '@mantine/core';
import { useState, type SubmitEvent } from 'react';
import { usePref } from '../data/prefs';
import { store } from '../data/store';
import { supabase } from '../data/supabase';
import { useData } from '../data/useData';
import { listValues } from '../domain/derive';
import { dayFromISO, handlerParts, todayDay } from '../domain/text';
import type { ActionRow, Company, LeadRow } from '../domain/types';
import { CompanyFormDialog } from './CompanyFormDialog';

const currentDate = () => new Date(todayDay() * 86_400_000).toISOString().slice(0, 10);
const optionValues = (values: string[], selected: string) => [...new Set([...values, selected])].filter(Boolean);

const leadFields = [
  ['stage', 'Πορεία ενδιαφέροντος'],
  ['sponsor', 'Χορηγία'],
  ['cancel_reason', 'Λόγος ακύρωσης'],
  ['hall', 'Hall'],
] as const;

export function ActionForm({
  company,
  action,
  leadYear,
  onClose,
  onSaved,
}: {
  company: Company;
  action?: ActionRow;
  leadYear?: number;
  onClose: () => void;
  onSaved: (message: string) => void;
}) {
  const { data } = useData();
  const [me] = usePref('me', '');
  const years = [...new Set(company.leads.map((lead) => lead.year).filter(Boolean))].sort((a, b) => b - a);
  const [year, setYear] = useState(String(action ? (action.lead_year ?? '') : (leadYear ?? years[0] ?? '')));
  const [date, setDate] = useState(action?.action_date ?? currentDate);
  const [type, setType] = useState(action?.type ?? '');
  const [handler, setHandler] = useState(action ? (action.handler ?? '') : me);
  const [description, setDescription] = useState(action?.description ?? '');
  const [updateLead, setUpdateLead] = useState(false);
  const [leadHandlers, setLeadHandlers] = useState<string[]>([]);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const selectedLead = company.leads.find((lead) => lead.year === Number(year));
  const validYears = optionValues(years.map(String), year);
  const handlers = listValues(data.lists, 'Χειριστής').filter((value) => !value.includes(','));

  async function save(event: SubmitEvent) {
    event.preventDefault();
    if (pending) return;
    setError('');
    const latest = store.getSnapshot().derived.companies.get(company.code);
    const lead = latest?.leads.find((lead) => lead.year === Number(year));
    if (!latest || (!lead && (!action || year !== String(action.lead_year ?? '')))) {
      setError('Επιλέξτε υπάρχον lead της εταιρείας.');
      return;
    }
    if (!dayFromISO(date) || dayFromISO(date) > todayDay()) {
      setError('Επιλέξτε ημερομηνία έως και σήμερα.');
      return;
    }
    const form = new FormData(event.currentTarget as HTMLFormElement);
    const updates = updateLead
      ? Object.fromEntries(
          [...leadFields.map(([key]) => key), 'sqm', 'handler']
            .map((key) => [key, key === 'handler' ? leadHandlers.join(', ') : String(form.get(key) ?? '').trim()])
            .filter(([, value]) => value !== ''),
        )
      : {};
    const hasUpdates = Object.keys(updates).length > 0;
    if (!description.trim() && (action || type || !hasUpdates)) {
      setError('Συμπληρώστε την περιγραφή της ενέργειας.');
      return;
    }
    const fields = {
      lead_year: year ? Number(year) : null,
      action_date: date,
      type: type || 'Σχόλιο',
      description: description.trim(),
      handler: handler || (action ? null : lead?.handler || null),
    };
    setPending(true);
    try {
      if (hasUpdates && lead && !action) {
        const { data, error } = await supabase.rpc('save_action_with_lead', {
          p_company_code: company.code,
          p_year: lead.year,
          p_action: fields.description ? fields : null,
          p_updates: updates,
        });
        const result = data as unknown as { lead: LeadRow; action: ActionRow | null } | null;
        if (error || !result?.lead) {
          setError(
            error?.code === 'PGRST202'
              ? 'Η ενημέρωση lead από αυτή τη φόρμα χρειάζεται ενεργοποίηση στη βάση.'
              : (error?.message ?? 'Η αποθήκευση δεν ολοκληρώθηκε.'),
          );
          return;
        }
        store.apply('leads', 'upsert', { ...result.lead });
        if (result.action) store.apply('actions', 'upsert', { ...result.action });
        onSaved(result.action ? 'Η ενέργεια αποθηκεύτηκε και το lead ενημερώθηκε.' : 'Το lead ενημερώθηκε.');
        return;
      }
      const write = action
        ? supabase.from('actions').update(fields).eq('id', action.id).eq('company_code', company.code)
        : supabase.from('actions').insert({ company_code: company.code, ...fields });
      const { data, error } = await write.select().maybeSingle<ActionRow>();
      if (error || !data) {
        setError(error?.message ?? 'Η ενέργεια δεν είναι πλέον διαθέσιμη.');
        return;
      }
      store.apply('actions', 'upsert', { ...data });
      onSaved(action ? 'Η ενέργεια ενημερώθηκε.' : 'Η ενέργεια αποθηκεύτηκε.');
    } catch {
      setError('Η αποθήκευση δεν ολοκληρώθηκε. Δοκιμάστε ξανά.');
    } finally {
      setPending(false);
    }
  }

  return (
    <CompanyFormDialog
      title={action ? 'Επεξεργασία ενέργειας' : 'Νέα ενέργεια / σχόλιο'}
      submitLabel="Αποθήκευση"
      pending={pending}
      onClose={onClose}
      onSubmit={(event) => void save(event)}
    >
      <TextInput label="Εταιρεία" required readOnly value={`${company.code} · ${company.name}`} />
      {!action && !years.length && <Alert color="yellow">Η εταιρεία χρειάζεται lead πριν καταχωριστεί ενέργεια.</Alert>}
      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xs">
        <NativeSelect
          label="Χρονιά lead"
          value={year}
          onChange={(event) => {
            setYear(event.currentTarget.value);
            setUpdateLead(false);
            setLeadHandlers([]);
          }}
          data={[{ value: '', label: '—' }, ...validYears]}
          required={!action}
          disabled={pending || (!action && !years.length)}
        />
        <TextInput
          label="Ημερομηνία"
          type="date"
          required
          max={currentDate()}
          value={date}
          onChange={(event) => setDate(event.currentTarget.value)}
          disabled={pending}
        />
        <NativeSelect
          label="Τύπος ενέργειας"
          value={type}
          onChange={(event) => setType(event.currentTarget.value)}
          data={[
            { value: '', label: 'Σχόλιο (προεπιλογή)' },
            ...optionValues(listValues(data.lists, 'Τύπος ενέργειας'), type),
          ]}
          disabled={pending}
        />
        <NativeSelect
          label="Χειριστής"
          value={handler}
          onChange={(event) => setHandler(event.currentTarget.value)}
          data={[{ value: '', label: action ? '—' : selectedLead?.handler || '—' }, ...optionValues(handlers, handler)]}
          disabled={pending}
        />
      </SimpleGrid>
      <Textarea
        label="Περιγραφή"
        data-autofocus
        minRows={3}
        autosize
        required={!!action || !updateLead}
        value={description}
        onChange={(event) => setDescription(event.currentTarget.value)}
        disabled={pending}
      />
      {!action && selectedLead && (
        <>
          <Switch
            label="Ενημέρωση lead"
            checked={updateLead}
            onChange={(event) => setUpdateLead(event.currentTarget.checked)}
            disabled={pending}
          />
          <Collapse expanded={updateLead}>
            {updateLead && (
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xs">
                {leadFields.map(([key, label]) => (
                  <NativeSelect
                    key={key}
                    name={key}
                    label={label}
                    data={[{ value: '', label: 'Διατήρηση τιμής' }, ...listValues(data.lists, label).filter(Boolean)]}
                    disabled={pending}
                  />
                ))}
                <TextInput label="Τ.μ." name="sqm" type="number" min={0} step="any" disabled={pending} />
                <MultiSelect
                  label="Χειριστές lead"
                  placeholder="Διατήρηση τιμής"
                  data={[...new Set(listValues(data.lists, 'Χειριστής').flatMap(handlerParts))]}
                  value={leadHandlers}
                  onChange={setLeadHandlers}
                  disabled={pending}
                />
              </SimpleGrid>
            )}
          </Collapse>
        </>
      )}
      {error && (
        <Alert color="red" role="alert">
          {error}
        </Alert>
      )}
    </CompanyFormDialog>
  );
}
