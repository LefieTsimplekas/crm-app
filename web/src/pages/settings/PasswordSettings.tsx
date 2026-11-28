import { Alert, Button, Paper, PasswordInput, Stack, Title } from '@mantine/core';
import { useState, type SubmitEvent } from 'react';
import { supabase } from '../../data/supabase';

export function PasswordSettings() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  async function submit(event: SubmitEvent) {
    event.preventDefault();
    if (pending) return;
    setSaved(false);
    setError('');
    if (password.length < 8) return setError('Ο κωδικός πρέπει να έχει τουλάχιστον 8 χαρακτήρες.');
    if (password !== confirm) return setError('Οι δύο κωδικοί δεν ταιριάζουν.');
    setPending(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        setError(error.message);
        return;
      }
      setPassword('');
      setConfirm('');
      setSaved(true);
    } catch {
      setError('Η αλλαγή του κωδικού δεν ολοκληρώθηκε. Δοκιμάστε ξανά.');
    } finally {
      setPending(false);
    }
  }

  return (
    <Paper component="section" p="md" withBorder>
      <Stack component="form" onSubmit={(event) => void submit(event)}>
        <Title order={2} size="h4">
          Αλλαγή κωδικού
        </Title>
        <PasswordInput
          label="Νέος κωδικός"
          visibilityToggleButtonProps={{ 'aria-label': 'Εμφάνιση ή απόκρυψη νέου κωδικού' }}
          autoComplete="new-password"
          required
          value={password}
          onChange={(event) => setPassword(event.currentTarget.value)}
          disabled={pending}
        />
        <PasswordInput
          label="Επιβεβαίωση κωδικού"
          visibilityToggleButtonProps={{ 'aria-label': 'Εμφάνιση ή απόκρυψη επιβεβαίωσης κωδικού' }}
          autoComplete="new-password"
          required
          value={confirm}
          onChange={(event) => setConfirm(event.currentTarget.value)}
          disabled={pending}
        />
        {error && (
          <Alert color="red" role="alert">
            {error}
          </Alert>
        )}
        {saved && (
          <Alert color="green" role="status">
            Ο κωδικός άλλαξε.
          </Alert>
        )}
        <Button type="submit" loading={pending}>
          Αλλαγή κωδικού
        </Button>
      </Stack>
    </Paper>
  );
}
