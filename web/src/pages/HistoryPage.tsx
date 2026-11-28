import { Anchor, Group, Select, Stack, Text, TextInput } from '@mantine/core';
import { useState } from 'react';
import { DataTable, type Column } from '../components/DataTable';
import { Empty, ErrorView, Loading } from '../components/StateViews';
import { store } from '../data/store';
import { useData } from '../data/useData';
import { listValues } from '../domain/derive';
import { formatDay, norm } from '../domain/text';
import type { Action } from '../domain/types';

const MAX_VISIBLE_ACTIONS = 600;

const textColumn = (label: string, get: (action: Action) => string): Column<Action> => ({
  key: label,
  label,
  render: get,
  sortValue: (action) => get(action) || null,
});

export function HistoryPage({ onOpenCompany }: { onOpenCompany: (code: number) => void }) {
  const { state, error, data, derived } = useData();
  const [year, setYear] = useState<string | null>(null);
  const [handler, setHandler] = useState<string | null>(null);
  const [type, setType] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  if (state === 'loading' || state === 'idle') return <Loading />;
  if (state === 'error') return <ErrorView message={error} onRetry={() => void store.load()} />;

  const years = new Set(listValues(data.lists, 'Χρονιά').map(Number).filter(Boolean));
  derived.leads.forEach((lead) => lead.year && years.add(lead.year));
  derived.actions.forEach((action) => action.year && years.add(action.year));
  const handlers = listValues(data.lists, 'Χειριστής').filter((value) => !value.includes(','));
  const types = listValues(data.lists, 'Τύπος ενέργειας');
  const query = norm(search);
  const handlerQuery = norm(handler);
  const actions = derived.actions
    .filter((action) => {
      const searchText = [action.companyName, action.description, action.type, action.handler, formatDay(action.day)];
      return (
        (!year || action.year === Number(year)) &&
        (!handlerQuery || norm(action.handler).includes(handlerQuery)) &&
        (!type || action.type === type) &&
        (!query || norm(searchText.join(' ')).includes(query))
      );
    })
    .sort((a, b) => b.day - a.day || b.id - a.id);
  const companyAction = (action: Action) =>
    derived.companies.has(action.code) ? () => onOpenCompany(action.code) : undefined;
  const columns: Column<Action>[] = [
    {
      key: 'Ημερομηνία',
      label: 'Ημερομηνία',
      noWrap: true,
      render: (action) => formatDay(action.day),
      sortValue: (action) => action.day || null,
    },
    {
      ...textColumn('Εταιρεία', (action) => action.companyName),
      minWidth: 160,
      render: (action) => {
        const open = companyAction(action);
        return open ? (
          <Anchor component="button" type="button" ta="left" fw={600} onClick={open}>
            {action.companyName}
          </Anchor>
        ) : (
          action.companyName
        );
      },
    },
    {
      key: 'Χρονιά',
      label: 'Χρονιά',
      align: 'right',
      render: (action) => action.year || '',
      sortValue: (action) => action.year || null,
    },
    textColumn('Τύπος', (action) => action.type),
    {
      ...textColumn('Περιγραφή', (action) => action.description),
      minWidth: 220,
      render: (action) => (
        <Text style={{ whiteSpace: 'pre-wrap' }} size="sm">
          {action.description}
        </Text>
      ),
    },
    textColumn('Χειριστής', (action) => action.handler),
  ];

  return (
    <Stack gap="md">
      <Group align="end">
        <Select
          label="Χρονιά lead"
          placeholder="Όλες"
          data={[...years].sort((a, b) => a - b).map(String)}
          value={year}
          onChange={setYear}
          clearable
        />
        <Select
          label="Χειριστής"
          placeholder="Όλοι"
          data={[...new Set(handlers)]}
          value={handler}
          onChange={setHandler}
          clearable
        />
        <Select
          label="Τύπος"
          placeholder="Όλοι"
          data={[...new Set(types)]}
          value={type}
          onChange={setType}
          clearable
        />
        <TextInput
          label="Αναζήτηση"
          type="search"
          placeholder="εταιρεία, περιγραφή, ημερομηνία…"
          value={search}
          onChange={(event) => setSearch(event.currentTarget.value)}
          style={{ flex: 1, minWidth: 200 }}
        />
      </Group>
      <Text size="sm" c="dimmed" aria-live="polite">
        {actions.length} ενέργειες
        {actions.length > MAX_VISIBLE_ACTIONS ? ` · Εμφανίζονται οι ${MAX_VISIBLE_ACTIONS} πιο πρόσφατες` : ''}
      </Text>
      {actions.length ? (
        <DataTable
          id="his"
          caption="Ιστορικό ενεργειών"
          columns={columns}
          rows={actions.slice(0, MAX_VISIBLE_ACTIONS)}
          rowKey={(action) => action.id}
          rowAction={companyAction}
        />
      ) : (
        <Empty title="Καμία ενέργεια με αυτά τα φίλτρα." />
      )}
    </Stack>
  );
}
