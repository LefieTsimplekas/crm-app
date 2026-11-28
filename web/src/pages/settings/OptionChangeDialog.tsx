import { Alert, Text, TextInput } from '@mantine/core';
import { useState, type SubmitEvent } from 'react';
import { CompanyFormDialog } from '../../components/CompanyFormDialog';
import { editListOption, type ListOption } from '../../data/listOptions';

export function OptionChangeDialog({
  list,
  option,
  mode,
  onClose,
  onSaved,
}: {
  list: string;
  option: ListOption;
  mode: 'rename' | 'remove';
  onClose: () => void;
  onSaved: (message: string) => void;
}) {
  const [value, setValue] = useState(option.value);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const remove = mode === 'remove';

  async function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setError('');
    const next = value.trim().replace(/\s+/g, ' ');
    if (!remove && !next) {
      setError('Συμπληρώστε τη νέα τιμή.');
      return;
    }
    setPending(true);
    try {
      await editListOption(list, option, mode, remove ? null : next);
      onSaved(remove ? 'Η τιμή αφαιρέθηκε από τη λίστα.' : 'Η τιμή ενημερώθηκε.');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Η αλλαγή δεν ολοκληρώθηκε. Δοκιμάστε ξανά.');
    } finally {
      setPending(false);
    }
  }

  return (
    <CompanyFormDialog
      title={remove ? 'Αφαίρεση τιμής λίστας' : 'Μετονομασία τιμής λίστας'}
      submitLabel={remove ? 'Αφαίρεση από τη λίστα' : 'Αποθήκευση'}
      danger={remove}
      pending={pending}
      onClose={onClose}
      onSubmit={(event) => void submit(event)}
    >
      {remove ? (
        <Text size="sm">
          Το «{option.value}» θα αφαιρεθεί από τη λίστα «{list}». Οι υπάρχουσες εγγραφές θα διατηρήσουν την τιμή τους.
        </Text>
      ) : (
        <>
          <Text size="sm">Η νέα τιμή θα περάσει και στις σχετικές εγγραφές που χρησιμοποιούν το «{option.value}».</Text>
          <TextInput
            label="Νέα τιμή"
            value={value}
            onChange={(event) => setValue(event.currentTarget.value)}
            data-autofocus
            required
            disabled={pending}
          />
        </>
      )}
      {error && (
        <Alert role="alert" color="red">
          {error}
        </Alert>
      )}
    </CompanyFormDialog>
  );
}
