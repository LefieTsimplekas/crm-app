import { NativeSelect, SimpleGrid, Text, Textarea, TextInput } from '@mantine/core';
import { listValues } from '../domain/derive';
import { todayDay } from '../domain/text';
import type { Dataset } from '../domain/types';

export function leadDate() {
  return new Date(todayDay() * 86_400_000).toISOString().slice(0, 10);
}

const companyLists = [
  ['sector', 'Κλάδος'],
  ['fgret', 'FG/RET'],
  ['tellody', 'Tellody'],
] as const;

export function NewCompanyFields({ lists, disabled }: { lists: Dataset['lists']; disabled: boolean }) {
  return (
    <>
      <TextInput name="company_name" label="Επωνυμία εταιρείας" required disabled={disabled} />
      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xs">
        <TextInput name="country" label="Χώρα" disabled={disabled} />
        {companyLists.map(([name, label]) => (
          <NativeSelect
            key={name}
            name={name}
            label={label}
            data={[{ value: '', label: '—' }, ...new Set(listValues(lists, label))]}
            disabled={disabled}
          />
        ))}
      </SimpleGrid>
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
