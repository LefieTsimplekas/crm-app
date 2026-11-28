import { Alert, NativeSelect, SimpleGrid, Textarea, TextInput } from '@mantine/core';
import { useState, type SubmitEvent } from 'react';
import { usePref } from '../data/prefs';
import { store } from '../data/store';
import { supabase } from '../data/supabase';
import { useData } from '../data/useData';
import { listValues } from '../domain/derive';
import { dayFromISO, todayDay } from '../domain/text';
import type { ActionRow, Company } from '../domain/types';
import { CompanyFormDialog } from './CompanyFormDialog';

const currentDate = () => new Date(todayDay() * 86_400_000).toISOString().slice(0, 10);
const optionValues = (values: string[], selected: string) => [...new Set([...values, selected])].filter(Boolean);

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
    if (!description.trim()) {
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
          onChange={(event) => setYear(event.currentTarget.value)}
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
        required
        value={description}
        onChange={(event) => setDescription(event.currentTarget.value)}
        disabled={pending}
      />
      {error && (
        <Alert color="red" role="alert">
          {error}
        </Alert>
      )}
    </CompanyFormDialog>
  );
}
