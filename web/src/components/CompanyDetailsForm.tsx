import { Alert, NativeSelect, SimpleGrid, TextInput } from '@mantine/core';
import { useState, type SubmitEvent } from 'react';
import { store } from '../data/store';
import { supabase } from '../data/supabase';
import { useData } from '../data/useData';
import { listValues } from '../domain/derive';
import type { CompanyRow } from '../domain/types';
import { CompanyFormDialog } from './CompanyFormDialog';
import { CountrySelect } from './CountrySelect';

const selectFields = [
  ['sector', 'Κλάδος'],
  ['fgret', 'FG/RET'],
  ['tellody', 'Tellody'],
] as const;

export function CompanyDetailsForm({
  company,
  rename,
  onClose,
  onSaved,
}: {
  company: CompanyRow;
  rename: boolean;
  onClose: () => void;
  onSaved: (message: string) => void;
}) {
  const { data } = useData();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');

  async function save(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setError('');
    const form = new FormData(event.currentTarget);
    const field = (name: string) => String(form.get(name) ?? '').trim() || null;
    const name = field('name')?.replace(/\s+/g, ' ');
    if (rename && !name) {
      setError('Συμπληρώστε την επωνυμία της εταιρείας.');
      return;
    }
    const values = rename
      ? { name }
      : {
          sector: field('sector'),
          country: field('country'),
          fgret: field('fgret'),
          tellody: field('tellody'),
          files_link: field('files_link'),
          list_id: field('list_id'),
        };
    const changed = Object.fromEntries(
      Object.entries(values).filter(
        ([key, value]) => value !== (String(company[key as keyof CompanyRow] ?? '').trim() || null),
      ),
    );
    if (!Object.keys(changed).length) {
      onClose();
      return;
    }

    setPending(true);
    try {
      const { data, error } = await supabase
        .from('companies')
        .update(changed)
        .eq('code', company.code)
        .select()
        .maybeSingle<CompanyRow>();
      if (error?.code === '23505' && rename) {
        setError('Υπάρχει ήδη εταιρεία με αυτή την επωνυμία.');
        return;
      }
      if (error || !data) {
        setError(error?.message ?? 'Η εταιρεία δεν είναι πλέον διαθέσιμη.');
        return;
      }
      store.apply('companies', 'upsert', { ...data });
      onSaved(rename ? 'Η εταιρεία μετονομάστηκε.' : 'Τα στοιχεία της εταιρείας ενημερώθηκαν.');
    } catch {
      setError('Η αποθήκευση δεν ολοκληρώθηκε. Δοκιμάστε ξανά.');
    } finally {
      setPending(false);
    }
  }

  return (
    <CompanyFormDialog
      title={rename ? 'Μετονομασία εταιρείας' : 'Στοιχεία εταιρείας'}
      submitLabel="Αποθήκευση"
      pending={pending}
      onClose={onClose}
      onSubmit={(event) => void save(event)}
    >
      <TextInput label="Εταιρεία" readOnly value={`${company.code} · ${company.name}`} />
      {rename ? (
        <TextInput
          label="Νέα επωνυμία"
          name="name"
          defaultValue={company.name}
          data-autofocus
          required
          disabled={pending}
        />
      ) : (
        <>
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xs">
            {selectFields.map(([key, label]) => {
              const value = company[key] ?? '';
              return (
                <NativeSelect
                  key={key}
                  name={key}
                  label={label}
                  data={[
                    { value: '', label: '—' },
                    ...new Set([...listValues(data.lists, label), value].filter(Boolean)),
                  ]}
                  defaultValue={value}
                  data-autofocus={key === 'sector' ? true : undefined}
                  disabled={pending}
                />
              );
            })}
            <CountrySelect initial={company.country ?? ''} disabled={pending} />
            <TextInput
              label="Αναγνωριστικό List"
              name="list_id"
              defaultValue={company.list_id ?? ''}
              disabled={pending}
            />
          </SimpleGrid>
          <TextInput
            label="Σύνδεσμος αρχείων"
            name="files_link"
            defaultValue={company.files_link ?? ''}
            disabled={pending}
          />
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
