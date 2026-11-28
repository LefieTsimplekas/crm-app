import { Alert, Text } from '@mantine/core';
import { useState, type SubmitEvent } from 'react';
import { store } from '../data/store';
import { supabase } from '../data/supabase';
import { CompanyFormDialog } from './CompanyFormDialog';

export type CompanyItemToRemove =
  | { table: 'contacts' | 'actions' | 'companies'; id: number; label: string }
  | { table: 'leads'; id: number; label: string; year: number };

const copy = {
  contacts: { title: 'Αφαίρεση επαφής', success: 'Η επαφή αφαιρέθηκε.' },
  actions: { title: 'Διαγραφή ενέργειας', success: 'Η ενέργεια διαγράφηκε.' },
  leads: { title: 'Διαγραφή lead', success: 'Το lead και οι ενέργειές του διαγράφηκαν.' },
  companies: { title: 'Διαγραφή εταιρείας', success: 'Η εταιρεία διαγράφηκε.' },
};

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
  const { title, success } = copy[item.table];

  async function remove(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setError('');
    setPending(true);
    try {
      if (item.table === 'leads') {
        const { data, error } = await supabase.rpc('delete_company_lead', {
          p_company_code: companyCode,
          p_lead_id: item.id,
        });
        if (error?.code === 'PGRST202') {
          setError('Η διαγραφή lead χρειάζεται ενεργοποίηση στο Supabase. Ενημερώστε τον διαχειριστή.');
          return;
        }
        if (error || data !== true) {
          setError(error?.message ?? 'Το lead δεν είναι πλέον διαθέσιμο.');
          return;
        }
        await store.load();
      } else if (item.table === 'companies') {
        const { data, error } = await supabase
          .from('companies')
          .delete()
          .eq('code', companyCode)
          .select('code')
          .maybeSingle();
        if (error || !data) {
          setError(error?.message ?? 'Η εταιρεία δεν είναι πλέον διαθέσιμη.');
          return;
        }
        store.apply('companies', 'delete', { code: companyCode });
      } else {
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
      }
      onSaved(success);
    } catch {
      setError('Η διαγραφή δεν ολοκληρώθηκε. Δοκιμάστε ξανά.');
    } finally {
      setPending(false);
    }
  }

  return (
    <CompanyFormDialog
      title={title}
      submitLabel={item.table === 'contacts' ? 'Οριστική αφαίρεση' : 'Οριστική διαγραφή'}
      danger
      pending={pending}
      onClose={onClose}
      onSubmit={(event) => void remove(event)}
    >
      <Text size="sm">Πρόκειται να διαγράψετε οριστικά «{item.label}».</Text>
      {item.table === 'leads' && <Text size="sm">Θα διαγραφεί το lead του {item.year} μαζί με τις ενέργειές του.</Text>}
      {item.table === 'companies' && (
        <Alert color="red">Θα διαγραφούν επίσης όλα τα leads, οι ενέργειες και οι επαφές της εταιρείας.</Alert>
      )}
      {error && (
        <Alert color="red" role="alert">
          {error}
        </Alert>
      )}
    </CompanyFormDialog>
  );
}
