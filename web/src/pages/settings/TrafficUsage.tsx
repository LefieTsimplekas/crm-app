import { Paper, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import { useEffect, useState } from 'react';
import { supabase } from '../../data/supabase';

const formatter = new Intl.NumberFormat('el-GR', { maximumFractionDigits: 2 });
const formatBytes = (bytes: number) =>
  bytes >= 1024 ** 3 ? `${formatter.format(bytes / 1024 ** 3)} GB` : `${formatter.format(bytes / 1024 ** 2)} MB`;

type UsageRow = { bytes: number | string; day: string; user_email: string };

export function TrafficUsage() {
  const [usage, setUsage] = useState<{ total: number; today: number; users: [string, number][] } | null>();
  useEffect(() => {
    let active = true;
    async function load() {
      const date = new Intl.DateTimeFormat('sv-SE', {
        timeZone: 'Europe/Athens',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).format(new Date());
      const first = date.slice(0, 7) + '-01';
      const users = new Map<string, number>();
      let total = 0;
      let today = 0;
      try {
        const pageSize = 1000;
        for (let start = 0; active; start += pageSize) {
          const { data, error } = await supabase
            .from('usage_log')
            .select('day,user_email,bytes')
            .gte('day', first)
            .lte('day', date)
            .order('day')
            .order('user_email')
            .range(start, start + pageSize - 1)
            .returns<UsageRow[]>();
          if (error) throw error;
          for (const row of data) {
            const bytes = Number(row.bytes) || 0;
            total += bytes;
            if (row.day === date) today += bytes;
            users.set(row.user_email, (users.get(row.user_email) ?? 0) + bytes);
          }
          if (data.length < pageSize) break;
        }
        if (active) setUsage({ total, today, users: [...users].sort((a, b) => b[1] - a[1]) });
      } catch {
        if (active) setUsage(null);
      }
    }
    void load();
    return () => {
      active = false;
    };
  }, []);

  return (
    <Paper component="section" withBorder p="md">
      <Stack gap="sm">
        <Title order={2} size="h4">
          Καταγεγραμμένη κίνηση Supabase
        </Title>
        {usage === undefined ? (
          <Text size="sm" role="status">
            Φόρτωση κίνησης…
          </Text>
        ) : usage === null ? (
          <Text size="sm" c="dimmed">
            Η καταγραφή κίνησης δεν είναι διαθέσιμη.
          </Text>
        ) : (
          <>
            <SimpleGrid cols={{ base: 1, xs: 2 }}>
              <Text size="sm">
                Αυτόν τον μήνα · <strong>{formatBytes(usage.total)}</strong>
              </Text>
              <Text size="sm">
                Σήμερα · <strong>{formatBytes(usage.today)}</strong>
              </Text>
            </SimpleGrid>
            {usage.users.length ? (
              <Stack gap={4}>
                {usage.users.map(([email, bytes]) => (
                  <Text key={email} size="sm" style={{ overflowWrap: 'anywhere' }}>
                    {email} · {formatBytes(bytes)}
                  </Text>
                ))}
              </Stack>
            ) : (
              <Text size="sm" c="dimmed">
                Δεν υπάρχει καταγραφή για αυτόν τον μήνα.
              </Text>
            )}
            <Text size="xs" c="dimmed">
              Η μέτρηση αφορά τις εγγραφές του CRM. Τα επίσημα όρια και η συνολική χρήση εμφανίζονται στο Supabase.
            </Text>
          </>
        )}
      </Stack>
    </Paper>
  );
}
