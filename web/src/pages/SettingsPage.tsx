import { Button, NativeSelect, NumberInput, Paper, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import { useState, type SubmitEvent } from 'react';
import { ErrorView, Loading } from '../components/StateViews';
import { setPref, usePref } from '../data/prefs';
import { store } from '../data/store';
import { useData } from '../data/useData';
import { listValues } from '../domain/derive';
import { DatabaseUsage } from './settings/DatabaseUsage';
import { OptionList } from './settings/OptionList';
import { PasswordSettings } from './settings/PasswordSettings';

function PersonalSettings({ handlers }: { handlers: string[] }) {
  const [me] = usePref('me', '');
  const [orange] = usePref('orange', 7);
  const [red] = usePref('red', 21);
  const [draft, setDraft] = useState<{ name?: string; warning?: number | string; overdue?: number | string }>({});
  const name = draft.name ?? me;
  const warning = draft.warning ?? orange;
  const overdue = draft.overdue ?? red;
  const options = name && !handlers.includes(name) ? [...handlers, name] : handlers;
  const [saved, setSaved] = useState(false);
  const [validated, setValidated] = useState(false);
  const validWarning = typeof warning === 'number' && Number.isInteger(warning) && warning > 0;
  const validOverdue = typeof overdue === 'number' && Number.isInteger(overdue) && overdue > 0;
  const ordered = !validWarning || !validOverdue || overdue > warning;

  function save(event: SubmitEvent) {
    event.preventDefault();
    setValidated(true);
    if (!validWarning || !validOverdue || !ordered) return;
    setPref('me', name);
    setPref('orange', warning);
    setPref('red', overdue);
    setDraft({});
    setSaved(true);
  }

  return (
    <Paper component="section" withBorder p="md">
      <Stack component="form" onSubmit={save} onChange={() => setSaved(false)}>
        <Title order={2} size="h4">
          Εγώ & όρια χρωμάτων
        </Title>
        <NativeSelect
          label="Είμαι ο/η"
          value={name}
          onChange={(event) => setDraft({ ...draft, name: event.currentTarget.value })}
          data={[{ value: '', label: '—' }, ...options]}
        />
        <SimpleGrid cols={{ base: 1, sm: 2 }}>
          <NumberInput
            label="Πορτοκαλί μετά από (ημέρες)"
            value={warning}
            onChange={(value) => setDraft({ ...draft, warning: value })}
            allowDecimal={false}
            min={1}
            error={validated && !validWarning && 'Βάλτε θετικό ακέραιο αριθμό.'}
          />
          <NumberInput
            label="Κόκκινο μετά από (ημέρες)"
            value={overdue}
            onChange={(value) => setDraft({ ...draft, overdue: value })}
            allowDecimal={false}
            min={1}
            error={
              validated &&
              (!validOverdue
                ? 'Βάλτε θετικό ακέραιο αριθμό.'
                : !ordered && 'Το κόκκινο όριο πρέπει να είναι μεγαλύτερο από το πορτοκαλί.')
            }
          />
        </SimpleGrid>
        <Button type="submit">Αποθήκευση ρυθμίσεων</Button>
        {saved && (
          <Text size="sm" c="green" role="status">
            Οι ρυθμίσεις αποθηκεύτηκαν.
          </Text>
        )}
      </Stack>
    </Paper>
  );
}

export function SettingsPage() {
  const { state, error, data } = useData();

  if (state === 'idle' || state === 'loading') return <Loading />;
  if (state === 'error') return <ErrorView message={error} onRetry={() => void store.load()} />;

  const handlers = [...new Set(listValues(data.lists, 'Χειριστής').filter((name) => !name.includes(',')))];
  const listNames = Object.keys(data.lists).filter((name) => name !== 'Ναι/Όχι' && name !== 'Χειριστής');

  return (
    <Stack gap="lg">
      <SimpleGrid cols={{ base: 1, lg: 2 }}>
        <PersonalSettings handlers={handlers} />
        <Stack>
          <OptionList label="Χειριστής" values={data.lists['Χειριστής'] ?? []} />
          <Text size="sm" c="dimmed">
            Ο λογαριασμός σύνδεσης του χειριστή δημιουργείται ξεχωριστά στο Supabase Authentication.
          </Text>
        </Stack>
        <DatabaseUsage />
        <PasswordSettings />
      </SimpleGrid>
      <Stack gap="sm">
        <Title order={2} size="h4">
          Λίστες επιλογών
        </Title>
        {listNames.length ? (
          <SimpleGrid cols={{ base: 1, sm: 2, xl: 3 }}>
            {listNames.map((name) => (
              <OptionList key={name} label={name} values={data.lists[name]} />
            ))}
          </SimpleGrid>
        ) : (
          <Text size="sm" c="dimmed">
            Δεν υπάρχουν άλλες λίστες επιλογών.
          </Text>
        )}
      </Stack>
    </Stack>
  );
}
