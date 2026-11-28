import { Alert, Button, Paper, Stack, Text, Title } from '@mantine/core';
import { useState } from 'react';
import { CompanyFormDialog } from '../../components/CompanyFormDialog';
import { store } from '../../data/store';
import { supabase } from '../../data/supabase';
import { useData } from '../../data/useData';
import { countryOf } from '../../domain/countries';

type CountryChange = { code: number; old_country: string; country: string };

export function CountryCleanup() {
  const { data } = useData();
  const [preview, setPreview] = useState<CountryChange[] | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const changes = data.companies.flatMap(({ code, country }) => {
    if (!country?.trim()) return [];
    const canonical = countryOf(country)?.name;
    return canonical && canonical !== country ? [{ code, old_country: country, country: canonical }] : [];
  });
  const unknown = [
    ...new Set(data.companies.flatMap(({ country }) => (country?.trim() && !countryOf(country) ? [country] : []))),
  ];

  async function normalize() {
    if (pending || !preview?.length) return;
    setPending(true);
    setError('');
    try {
      const { data, error } = await supabase.rpc('normalize_company_countries', { p_changes: preview });
      if (error?.code === 'PGRST202') {
        setError('Η ενοποίηση χωρών χρειάζεται ενεργοποίηση στο Supabase από τον διαχειριστή.');
        return;
      }
      if (error || typeof data !== 'number') {
        await store.load();
        setError(error?.message ?? 'Η ενοποίηση δεν ολοκληρώθηκε.');
        return;
      }
      await store.load();
      setStatus(`Ενημερώθηκαν ${data} εγγραφές.`);
      setPreview(null);
    } catch {
      setError('Η ενοποίηση δεν ολοκληρώθηκε. Δοκιμάστε ξανά.');
    } finally {
      setPending(false);
    }
  }

  const examples = [...new Set((preview ?? []).map((item) => `${item.old_country} → ${item.country}`))].slice(0, 4);
  return (
    <Paper component="section" withBorder p="md">
      <Stack gap="sm">
        <Title order={2} size="h4">
          Χώρες
        </Title>
        <Text size="sm">
          {changes.length
            ? `${changes.length} εγγραφές μπορούν να ενοποιηθούν με τον κατάλογο χωρών.`
            : 'Οι αναγνωρισμένες χώρες είναι γραμμένες ενιαία.'}
        </Text>
        {unknown.length > 0 && (
          <Text size="sm" c="dimmed">
            Χώρες προς έλεγχο: {unknown.join(', ')}
          </Text>
        )}
        {status && (
          <Text size="sm" role="status" c="green">
            {status}
          </Text>
        )}
        {changes.length > 0 && (
          <Button
            onClick={() => {
              setError('');
              setPreview(changes);
            }}
          >
            Ενοποίηση {changes.length} εγγραφών
          </Button>
        )}
      </Stack>
      {preview && (
        <CompanyFormDialog
          title="Ενοποίηση χωρών"
          submitLabel="Ενοποίηση"
          pending={pending}
          onClose={() => setPreview(null)}
          onSubmit={(event) => {
            event.preventDefault();
            void normalize();
          }}
        >
          <Text size="sm">Θα ενημερωθούν {preview.length} εγγραφές βάσει του καταλόγου χωρών.</Text>
          {!!examples.length && (
            <Text size="sm" c="dimmed">
              {examples.join(' · ')}
            </Text>
          )}
          {error && (
            <Alert role="alert" color="red">
              {error}
            </Alert>
          )}
        </CompanyFormDialog>
      )}
    </Paper>
  );
}
