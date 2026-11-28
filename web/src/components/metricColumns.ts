import type { Column } from './DataTable';

export function labelColumn<T extends { label: string }>(label: string): Column<T> {
  return { key: 'label', label, render: (row) => row.label, sortValue: (row) => row.label };
}

export function numberColumn<T>(key: string, label: string, value: (row: T) => number | null, suffix = ''): Column<T> {
  return {
    key,
    label,
    align: 'right',
    noWrap: true,
    sortValue: value,
    render: (row) => {
      const n = value(row);
      return n === null ? '–' : `${n}${suffix}`;
    },
  };
}
