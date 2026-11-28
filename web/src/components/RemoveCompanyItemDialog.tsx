import { Alert, Text } from '@mantine/core';
import { useState, type SubmitEvent } from 'react';
import { store } from '../data/store';
import { supabase } from '../data/supabase';
import { CompanyFormDialog } from './CompanyFormDialog';

export interface CompanyItemToRemove {
  table: 'contacts' | 'actions';
  id: number;
  label: string;
}

export function RemoveCompanyItemDialog({
  companyCode,
  item,
  onClose,
  onSaved,
}: {
  companyCode: number;
  item: CompanyItemToRemove;
  onClose: () => void;
  onSaved: (message: string) => void;
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const isContact = item.table === 'contacts';

  async function remove(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setError('');
    setPending(true);
    try {
      const { data, error } = await supabase
        .from(item.table)
        .delete()
        .eq('id', item.id)
        .eq('company_code', companyCode)
        .select('id')
        .maybeSingle<{ id: number }>();
      if (error || !data) {
        setError(error?.message ?? 'Η εγγραφή δεν είναι πλέον διαθέσιμη ή δεν έχετε πρόσβαση σε αυτή.');
        return;
      }
      store.apply(item.table, 'delete', { id: data.id });
      onSaved(isContact ? 'Η επαφή αφαιρέθηκε.' : 'Η ενέργεια διαγράφηκε.');
    } catch {
      setError('Η διαγραφή δεν ολοκληρώθηκε. Δοκιμάστε ξανά.');
    } finally {
      setPending(false);
    }
  }

  return (
    <CompanyFormDialog
      title={isContact ? 'Αφαίρεση επαφής' : 'Διαγραφή ενέργειας'}
      submitLabel={isContact ? 'Οριστική αφαίρεση' : 'Οριστική διαγραφή'}
      danger
      pending={pending}
      onClose={onClose}
      onSubmit={(event) => void remove(event)}
    >
      <Text size="sm">
        Θα διαγραφεί οριστικά η {isContact ? 'επαφή' : 'ενέργεια'} «{item.label}».
      </Text>
      {error && (
        <Alert color="red" role="alert">
          {error}
        </Alert>
      )}
    </CompanyFormDialog>
  );
}
