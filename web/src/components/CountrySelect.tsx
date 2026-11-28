import { Select, type OptionsFilter } from '@mantine/core';
import { useState } from 'react';
import { countries, countryOf } from '../domain/countries';
import { fold } from '../domain/text';

const options = countries.map(({ name, label }) => ({ value: name, label }));
const filterCountries: OptionsFilter = ({ options, search, limit }) => {
  const query = fold(search);
  return options
    .filter((option) => {
      if (!('value' in option)) return false;
      const aliases = countryOf(option.value)?.aliases ?? [];
      return [option.label, ...aliases].some((value) => fold(value).includes(query));
    })
    .slice(0, limit);
};

export function CountrySelect({ initial = '', disabled }: { initial?: string; disabled: boolean }) {
  const value = countryOf(initial)?.name ?? initial;
  const [selected, setSelected] = useState(value || null);
  const data = value && !countryOf(value) ? [{ value, label: value }, ...options] : options;

  return (
    <Select
      name="country"
      label="Χώρα"
      data={data}
      value={selected}
      onChange={setSelected}
      filter={filterCountries}
      searchable
      clearable
      limit={25}
      nothingFoundMessage="Δεν βρέθηκε χώρα"
      comboboxProps={{ withinPortal: false }}
      disabled={disabled}
    />
  );
}
