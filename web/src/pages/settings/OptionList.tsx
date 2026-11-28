import { Button, Group, Paper, Stack, Text, TextInput, Title } from '@mantine/core';
import { useState, type SubmitEvent } from 'react';
import { canMoveList, canRemoveOption, editListOption, type ListOption } from '../../data/listOptions';
import { store } from '../../data/store';
import { supabase } from '../../data/supabase';
import { norm } from '../../domain/text';
import { OptionChangeDialog } from './OptionChangeDialog';

export function OptionList({ label, values }: { label: string; values: string[] }) {
  const [input, setInput] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [editing, setEditing] = useState<{ mode: 'rename' | 'remove'; option: ListOption } | null>(null);

  async function add(event: SubmitEvent) {
    event.preventDefault();
    if (pending) return;
    setError('');
    setStatus('');
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
      setStatus('Η τιμή προστέθηκε.');
    } catch {
      setError('Η προσθήκη δεν ολοκληρώθηκε. Δοκιμάστε ξανά.');
    } finally {
      setPending(false);
    }
  }

  async function move(option: ListOption, direction: 'up' | 'down') {
    if (pending) return;
    setError('');
    setStatus('');
    setPending(true);
    try {
      await editListOption(label, option, direction);
      setStatus('Η σειρά ενημερώθηκε.');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Η αλλαγή σειράς δεν ολοκληρώθηκε.');
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
            {items.map((option, index) => (
              <li key={option.position} value={option.position + 1}>
                <Group justify="space-between" gap="xs" py={4}>
                  <Text component="span" size="sm" style={{ overflowWrap: 'anywhere' }}>
                    {option.value}
                  </Text>
                  <Group gap={4} role="group" aria-label={`Ενέργειες για «${option.value}»`}>
                    {canMoveList(label) && (
                      <>
                        <Button
                          variant="default"
                          size="compact-xs"
                          disabled={pending || index === 0}
                          aria-label={`Μετακίνηση προς τα πάνω: ${option.value}`}
                          onClick={() => void move(option, 'up')}
                        >
                          ↑
                        </Button>
                        <Button
                          variant="default"
                          size="compact-xs"
                          disabled={pending || index === items.length - 1}
                          aria-label={`Μετακίνηση προς τα κάτω: ${option.value}`}
                          onClick={() => void move(option, 'down')}
                        >
                          ↓
                        </Button>
                      </>
                    )}
                    <Button
                      variant="default"
                      size="compact-xs"
                      disabled={pending}
                      onClick={() => {
                        setStatus('');
                        setError('');
                        setEditing({ mode: 'rename', option });
                      }}
                    >
                      Μετονομασία
                    </Button>
                    {canRemoveOption(label, option.position) && (
                      <Button
                        variant="default"
                        size="compact-xs"
                        disabled={pending}
                        onClick={() => {
                          setStatus('');
                          setError('');
                          setEditing({ mode: 'remove', option });
                        }}
                      >
                        Αφαίρεση
                      </Button>
                    )}
                  </Group>
                </Group>
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
        {status && (
          <Text size="sm" c="green" role="status">
            {status}
          </Text>
        )}
      </Stack>
      {editing && (
        <OptionChangeDialog
          list={label}
          option={editing.option}
          mode={editing.mode}
          onClose={() => setEditing(null)}
          onSaved={(message) => {
            setEditing(null);
            setStatus(message);
          }}
        />
      )}
    </Paper>
  );
}
