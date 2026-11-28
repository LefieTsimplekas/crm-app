import { Alert, Button, Group, NativeSelect, SimpleGrid, Text, Textarea, TextInput } from '@mantine/core';
import { useDeferredValue, useMemo, useState } from 'react';
import { companyNameWords, companySimilarity } from '../domain/companyNames';
import { listValues } from '../domain/derive';
import { todayDay } from '../domain/text';
import type { Company, Dataset } from '../domain/types';
import { CountrySelect } from './CountrySelect';
import { SectorSuggestionButton } from './SectorSuggestionButton';

export function leadDate() {
  return new Date(todayDay() * 86_400_000).toISOString().slice(0, 10);
}

const companyLists = [
  ['sector', 'Κλάδος'],
  ['fgret', 'FG/RET'],
  ['tellody', 'Tellody'],
] as const;

export function NewCompanyFields({
  lists,
  companies,
  disabled,
  onChoose,
}: {
  lists: Dataset['lists'];
  companies: Map<number, Company>;
  disabled: boolean;
  onChoose: (code: number) => void;
}) {
  const [name, setName] = useState('');
  const deferredName = useDeferredValue(name);
  const companyWords = useMemo(
    () => Array.from(companies.values(), (company) => ({ company, words: companyNameWords(company.name) })),
    [companies],
  );
  const matches = useMemo(() => {
    const words = companyNameWords(deferredName);
    if (words.join('').length < 3) return [];
    return companyWords
      .map(({ company, words: candidate }) => ({ company, score: companySimilarity(words, candidate) }))
      .filter(({ score }) => score >= 0.8)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }, [companyWords, deferredName]);
  const [sector, setSector] = useState('');
  return (
    <>
      <TextInput
        name="company_name"
        label="Επωνυμία εταιρείας"
        required
        disabled={disabled}
        value={name}
        onChange={(event) => setName(event.currentTarget.value)}
      />
      {name === deferredName && matches.length > 0 && (
        <Alert color="yellow" title="Παρόμοιες εταιρείες">
          <Group gap="xs">
            {matches.map(({ company }) => (
              <Button variant="default" key={company.code} disabled={disabled} onClick={() => onChoose(company.code)}>
                {company.code} · {company.name}
              </Button>
            ))}
          </Group>
        </Alert>
      )}
      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xs">
        <CountrySelect disabled={disabled} />
        {companyLists.map(([name, label]) => (
          <NativeSelect
            key={name}
            name={name}
            label={label}
            data={[{ value: '', label: '—' }, ...new Set(listValues(lists, label))]}
            {...(name === 'sector'
              ? {
                  value: sector,
                  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => setSector(event.currentTarget.value),
                }
              : {})}
            disabled={disabled}
          />
        ))}
      </SimpleGrid>
      <SectorSuggestionButton
        disabled={disabled}
        sectors={listValues(lists, 'Κλάδος')}
        request={(form) => {
          const data = form && new FormData(form);
          return {
            code: 1,
            name: String(data?.get('company_name') ?? '').trim(),
            country: String(data?.get('country') ?? ''),
            domain: '',
          };
        }}
        onChoose={setSector}
      />
    </>
  );
}

export function FirstLeadActivity({ lists, disabled }: { lists: Dataset['lists']; disabled: boolean }) {
  return (
    <>
      <Text fw={600} size="sm" mt="sm">
        Πρώτη επαφή (προαιρετική)
      </Text>
      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xs">
        <TextInput name="contact_name" label="Ονοματεπώνυμο" disabled={disabled} />
        <TextInput name="contact_role" label="Θέση" disabled={disabled} />
        <TextInput name="contact_phone" label="Τηλέφωνο" type="tel" disabled={disabled} />
        <TextInput name="contact_email" label="Email" inputMode="email" disabled={disabled} />
      </SimpleGrid>
      <Text fw={600} size="sm" mt="sm">
        Πρώτη ενέργεια (προαιρετική)
      </Text>
      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xs">
        <TextInput
          name="action_date"
          label="Ημερομηνία ενέργειας"
          type="date"
          defaultValue={leadDate()}
          max={leadDate()}
          disabled={disabled}
        />
        <NativeSelect
          name="action_type"
          label="Τύπος ενέργειας"
          data={[{ value: '', label: '—' }, ...new Set(listValues(lists, 'Τύπος ενέργειας'))]}
          disabled={disabled}
        />
      </SimpleGrid>
      <Textarea name="action_description" label="Περιγραφή ενέργειας" minRows={2} autosize disabled={disabled} />
    </>
  );
}
