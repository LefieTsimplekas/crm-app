import { Anchor, Paper, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import { useEffect, useState } from 'react';
import { supabase } from '../../data/supabase';

type Usage = { db_bytes: number; companies: number; leads: number; actions: number; contacts: number };

function isUsage(value: unknown): value is Usage {
  return (
    !!value &&
    typeof value === 'object' &&
    ['db_bytes', 'companies', 'leads', 'actions', 'contacts'].every(
      (key) => typeof (value as Record<string, unknown>)[key] === 'number',
    )
  );
}

export function DatabaseUsage() {
  const [usage, setUsage] = useState<Usage | null>();
  useEffect(() => {
    let active = true;
    async function readUsage() {
      try {
        const { data, error } = await supabase.rpc('db_usage');
        if (active) setUsage(!error && isUsage(data) ? data : null);
      } catch {
        if (active) setUsage(null);
      }
    }
    void readUsage();
    return () => {
      active = false;
    };
  }, []);

  return (
    <Paper component="section" p="md" withBorder>
      <Stack>
        <Title order={2} size="h4">
          Χρήση Supabase
        </Title>
        {usage === undefined ? (
          <Text size="sm" role="status">
            Φόρτωση χρήσης βάσης…
          </Text>
        ) : usage === null ? (
          <Text size="sm" c="dimmed">
            Ο δείκτης μεγέθους βάσης δεν είναι διαθέσιμος.
          </Text>
        ) : (
          <>
            <Text>
              Μέγεθος βάσης · {(usage.db_bytes / 1048576).toLocaleString('el-GR', { maximumFractionDigits: 1 })} MB
            </Text>
            <SimpleGrid cols={{ base: 2, sm: 4 }}>
              {[
                ['Εταιρείες', usage.companies],
                ['Leads', usage.leads],
                ['Ενέργειες', usage.actions],
                ['Επαφές', usage.contacts],
              ].map(([label, count]) => (
                <div key={label}>
                  <Text size="sm" c="dimmed">
                    {label}
                  </Text>
                  <Text fw={700}>{count.toLocaleString('el-GR')}</Text>
                </div>
              ))}
            </SimpleGrid>
          </>
        )}
        <Anchor href="https://supabase.com/dashboard/org/_/usage" target="_blank" rel="noopener noreferrer" size="sm">
          Χρήση και κίνηση στο Supabase
        </Anchor>
      </Stack>
    </Paper>
  );
}
