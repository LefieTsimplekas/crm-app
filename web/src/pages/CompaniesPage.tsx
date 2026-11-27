import { Anchor, Stack, Text, TextInput } from '@mantine/core';
import { useState } from 'react';
import { DataTable, type Column } from '../components/DataTable';
import { Emails } from '../components/Emails';
import { Empty, ErrorView, Loading } from '../components/StateViews';
import { store } from '../data/store';
import { useData } from '../data/useData';
import type { Company } from '../domain/types';

export function CompaniesPage({ onOpen }: { onOpen: (code: number) => void }) {
  const { state, error, derived } = useData();
  const [query, setQuery] = useState('');
  const needle = query.trim().toLocaleLowerCase('el');
  const rows = [...derived.companies.values()]
    .filter((c) =>
      [c.code, c.name, c.row.sector, c.row.country, c.person, c.phone, c.email].some((v) =>
        String(v ?? '')
          .toLocaleLowerCase('el')
          .includes(needle),
      ),
    )
    .sort((a, b) => a.name.localeCompare(b.name, 'el'));
  const columns: Column<Company>[] = [
    {
      key: 'name',
      label: 'Εταιρεία',
      sortValue: (c) => c.name,
      render: (c) => (
        <Anchor component="button" type="button" ta="left" onClick={() => onOpen(c.code)}>
          {c.name}
        </Anchor>
      ),
    },
    { key: 'code', label: 'Κωδικός', sortValue: (c) => c.code, render: (c) => c.code },
    { key: 'sector', label: 'Κλάδος', sortValue: (c) => c.row.sector, render: (c) => c.row.sector },
    { key: 'country', label: 'Χώρα', sortValue: (c) => c.row.country, render: (c) => c.row.country },
    { key: 'contact', label: 'Επαφή', sortValue: (c) => c.person, render: (c) => c.person },
    { key: 'email', label: 'Email', sortValue: (c) => c.email, render: (c) => <Emails value={c.email} /> },
  ];

  if (state === 'loading' || state === 'idle') return <Loading />;
  if (state === 'error') return <ErrorView message={error} onRetry={() => void store.load()} />;

  return (
    <Stack>
      <TextInput label="Αναζήτηση εταιρειών" value={query} onChange={(event) => setQuery(event.currentTarget.value)} />
      <Text size="sm" c="dimmed" aria-live="polite">
        Εταιρείες: {rows.length}
      </Text>
      {rows.length ? (
        <DataTable
          id="companies"
          caption="Εταιρείες"
          columns={columns}
          rows={rows}
          rowKey={(c) => c.code}
          rowAction={(c) => () => onOpen(c.code)}
        />
      ) : (
        <Empty title={needle ? 'Δεν βρέθηκαν εταιρείες με αυτή την αναζήτηση' : 'Δεν υπάρχουν διαθέσιμες εταιρείες'} />
      )}
    </Stack>
  );
}
