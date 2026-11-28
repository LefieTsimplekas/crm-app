import { Button, Group, Paper, Stack, Text, TextInput, Title } from '@mantine/core';
import { useState, type SubmitEvent } from 'react';
import { store } from '../../data/store';
import { supabase } from '../../data/supabase';
import { norm } from '../../domain/text';

export function OptionList({ label, values }: { label: string; values: string[] }) {
  const [input, setInput] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  async function add(event: SubmitEvent) {
    event.preventDefault();
    if (pending) return;
    setError('');
    setSaved(false);
    const value = input.trim().replace(/\s+/g, ' ');
    if (!value) return setError('Συμπληρώστε μια τιμή.');
    const existing = store.getSnapshot().data.lists[label] ?? [];
    if (existing.some((item) => norm(item) === norm(value))) return setError('Η τιμή υπάρχει ήδη στη λίστα.');
    const position = Array.from({ length: 25 }, (_, index) => index).find((index) => !existing[index]?.trim());
    if (position === undefined) return setError('Η λίστα έχει συμπληρώσει τις 25 διαθέσιμες θέσεις.');

    setPending(true);
    try {
      const row = { list_name: label, position, value };
      const { error } = await supabase.from('lists').insert(row);
      if (error?.code === '23505') {
        await store.load();
        setError('Η θέση χρησιμοποιήθηκε ήδη. Ελέγξτε τη λίστα και δοκιμάστε ξανά.');
        return;
      }
      if (error) {
        setError(error.message);
        return;
      }
      store.apply('lists', 'upsert', row);
      setInput('');
      setSaved(true);
    } catch {
      setError('Η προσθήκη δεν ολοκληρώθηκε. Δοκιμάστε ξανά.');
    } finally {
      setPending(false);
    }
  }

  const items = values.flatMap((value, position) => (value.trim() ? [{ value, position }] : []));
  return (
    <Paper component="section" withBorder p="md">
      <Stack gap="sm">
        <Title order={3} size="h5">
          {label}
        </Title>
        {items.length ? (
          <Text component="ol" size="sm" m={0} ps="md">
            {items.map(({ value, position }) => (
              <li key={position} value={position + 1}>
                {value}
              </li>
            ))}
          </Text>
        ) : (
          <Text size="sm" c="dimmed">
            Καμία τιμή.
          </Text>
        )}
        <Group component="form" align="end" onSubmit={(event) => void add(event)}>
          <TextInput
            label={label === 'Χειριστής' ? 'Νέος χειριστής' : `Νέα τιμή για «${label}»`}
            value={input}
            onChange={(event) => setInput(event.currentTarget.value)}
            style={{ flex: 1 }}
            required
            disabled={pending}
          />
          <Button type="submit" loading={pending}>
            Προσθήκη
          </Button>
        </Group>
        {error && (
          <Text size="sm" c="red" role="alert">
            {error}
          </Text>
        )}
        {saved && (
          <Text size="sm" c="green" role="status">
            Η τιμή προστέθηκε.
          </Text>
        )}
      </Stack>
    </Paper>
  );
}
