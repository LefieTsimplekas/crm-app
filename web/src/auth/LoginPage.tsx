import { useState, type FormEvent } from 'react';
import { Alert, Button, Paper, PasswordInput, Stack, Text, TextInput, Title } from '@mantine/core';
import { supabase } from '../data/supabase';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    const { error: err } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (err) setError(/invalid/i.test(err.message) ? 'Λάθος email ή κωδικός.' : err.message);
  }

  return (
    <main>
      <Stack maw={420} mx="auto" mt="10vh" px="md">
        <Title order={1}>Leads CRM</Title>
        <Text c="dimmed">Μπείτε με το email και τον κωδικό που σας έδωσε ο διαχειριστής.</Text>
        <Paper component="form" onSubmit={submit} withBorder p="lg" radius="md" noValidate>
          <Stack>
            <TextInput
              label="Email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
            />
            <PasswordInput
              label="Κωδικός"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
            />
            {error && (
              <Alert color="red" role="alert">
                {error}
              </Alert>
            )}
            <Button type="submit" loading={busy}>
              Σύνδεση
            </Button>
          </Stack>
        </Paper>
      </Stack>
    </main>
  );
}
