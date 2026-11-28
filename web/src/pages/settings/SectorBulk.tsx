import { Alert, Button, Checkbox, Group, NativeSelect, Paper, Progress, Stack, Text, Title } from '@mantine/core';
import { useState } from 'react';
import { CompanyFormDialog } from '../../components/CompanyFormDialog';
import { sectorCompany, suggestSectors, type SectorSuggestion } from '../../data/sectorSuggestions';
import { store } from '../../data/store';
import { supabase } from '../../data/supabase';
import { useData } from '../../data/useData';
import { listValues } from '../../domain/derive';
import type { CompanyRow } from '../../domain/types';

type Review = SectorSuggestion & { name: string; checked: boolean };

export function SectorBulk() {
  const { data, derived } = useData();
  const sectors = [...new Set(listValues(data.lists, 'Κλάδος'))];
  const missing = Array.from(derived.companies.values()).filter((company) => !company.row.sector?.trim());
  const [open, setOpen] = useState(false);
  const [review, setReview] = useState<Review[]>([]);
  const [pending, setPending] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');

  async function suggest() {
    setOpen(true);
    setPending(true);
    setReview([]);
    setProgress(0);
    setError('');
    setStatus('');
    try {
      for (let i = 0; i < missing.length; i += 20) {
        const batch = missing.slice(i, i + 20).map(sectorCompany);
        const results = await suggestSectors(batch, sectors);
        setReview((previous) => [
          ...previous,
          ...results.map((result) => ({
            ...result,
            name: batch.find((entry) => entry.code === result.code)?.name ?? String(result.code),
            checked: result.confidence >= 0.6,
          })),
        ]);
        setProgress((100 * Math.min(missing.length, i + 20)) / missing.length);
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Οι προτάσεις δεν ολοκληρώθηκαν.');
    } finally {
      setPending(false);
    }
  }

  async function save() {
    const selected = review.filter((item) => item.checked);
    if (!selected.length) {
      setError('Επιλέξτε τουλάχιστον μία πρόταση.');
      return;
    }
    setPending(true);
    setError('');
    const failures: string[] = [];
    let count = 0;
    for (const item of selected) {
      try {
        const row = store.getSnapshot().derived.companies.get(item.code)?.row;
        if (!row || row.sector?.trim()) throw new Error('Η εταιρεία άλλαξε μετά την πρόταση.');
        const query = supabase.from('companies').update({ sector: item.sector }).eq('code', item.code);
        const { data, error } = await (row.sector === null ? query.is('sector', null) : query.eq('sector', row.sector))
          .select()
          .maybeSingle<CompanyRow>();
        if (error || !data) throw new Error(error?.message ?? 'Η εταιρεία άλλαξε μετά την πρόταση.');
        store.apply('companies', 'upsert', { ...data });
        setReview((previous) => previous.filter((entry) => entry.code !== item.code));
        count++;
      } catch (cause) {
        failures.push(`${item.name}: ${cause instanceof Error ? cause.message : 'Σφάλμα αποθήκευσης.'}`);
      }
    }
    setStatus(`Ενημερώθηκαν ${count} εταιρείες.`);
    if (failures.length) setError(failures.join('\n'));
    else setOpen(false);
    setPending(false);
  }

  return (
    <Paper component="section" p="md" withBorder>
      <Stack gap="sm">
        <Title order={2} size="h4">
          Πρόταση κλάδου με AI
        </Title>
        <Text size="sm">{missing.length} εταιρείες χωρίς κλάδο.</Text>
        <Text size="xs" c="dimmed">
          Το Groq λαμβάνει επωνυμία, χώρα και domain του εταιρικού email. Η αποθήκευση γίνεται μετά την επιλογή σας.
        </Text>
        <Button type="button" disabled={!missing.length || !sectors.length} onClick={() => void suggest()}>
          Εμφάνιση προτάσεων
        </Button>
        {status && (
          <Text size="sm" role="status">
            {status}
          </Text>
        )}
      </Stack>
      {open && (
        <CompanyFormDialog
          title="Προτάσεις κλάδου"
          submitLabel="Αποθήκευση επιλεγμένων"
          pending={pending}
          onClose={() => setOpen(false)}
          onSubmit={(event) => {
            event.preventDefault();
            if (!pending) void save();
          }}
        >
          <Progress value={progress} aria-label="Πρόοδος προτάσεων" />
          {!pending && !review.length && !error && !status && (
            <Text size="sm" role="status">
              Δεν βρέθηκαν προτάσεις.
            </Text>
          )}
          {review.map((item) => (
            <Paper key={item.code} withBorder p="xs">
              <Stack gap={4}>
                <Checkbox
                  label={item.name}
                  checked={item.checked}
                  disabled={pending}
                  onChange={(event) => {
                    const checked = event.currentTarget.checked;
                    setReview(review.map((entry) => (entry.code === item.code ? { ...entry, checked } : entry)));
                  }}
                />
                <Group align="end">
                  <NativeSelect
                    label={`Πρόταση για ${item.name}`}
                    value={item.sector}
                    data={sectors}
                    disabled={pending}
                    onChange={(event) => {
                      const sector = event.currentTarget.value;
                      setReview(
                        review.map((entry) => (entry.code === item.code ? { ...entry, sector, checked: true } : entry)),
                      );
                    }}
                  />
                  <Text size="xs" c="dimmed">
                    {Math.round(item.confidence * 100)}% · {item.reason}
                  </Text>
                </Group>
              </Stack>
            </Paper>
          ))}
          {status && (
            <Text size="sm" role="status">
              {status}
            </Text>
          )}
          {error && (
            <Alert color="red" role="alert" style={{ whiteSpace: 'pre-wrap' }}>
              {error}
            </Alert>
          )}
        </CompanyFormDialog>
      )}
    </Paper>
  );
}
