import { Table, UnstyledButton, VisuallyHidden } from '@mantine/core';
import { IconArrowsSort, IconSortAscending, IconSortDescending } from '@tabler/icons-react';
import {
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from 'react';
import { usePref } from '../data/prefs';
import classes from './DataTable.module.css';

export interface Column<T> {
  key: string;
  label: string;
  render: (row: T) => ReactNode;
  /** τιμή για ταξινόμηση (null = κενό, πάει πάντα στο τέλος) */
  sortValue?: (row: T) => string | number | null;
  align?: 'left' | 'right';
  minWidth?: number;
  maxWidth?: number;
  noWrap?: boolean;
}
interface Props<T> {
  id: string;
  caption: string;
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string | number;
  rowStyle?: (row: T) => CSSProperties | undefined;
  /** στήλη στην αρχή κάθε γραμμής (π.χ. κουμπιά), χωρίς ταξινόμηση */
  leading?: { label: string; render: (row: T) => ReactNode };
}
const collator = new Intl.Collator('el', { numeric: true, sensitivity: 'base' });

/** Πίνακας με ταξινόμηση (κλικ στον τίτλο) και αλλαγή πλάτους (σύρσιμο ή βελάκια στην άκρη του τίτλου). */
export function DataTable<T>({ id, caption, columns, rows, rowKey, rowStyle, leading }: Props<T>) {
  const [sorts, setSorts] = usePref('sorts', {});
  const [widths, setWidths] = usePref('widths', {});
  const [dragW, setDragW] = useState<Record<string, number>>({});
  const drag = useRef<{ key: string; x0: number; w0: number } | null>(null);
  const sort = sorts[id];
  const saved = widths[id] ?? {};
  const widthOf = (k: string) => dragW[k] ?? saved[k];

  const sorted = useMemo(() => {
    const col = sort && columns.find((c) => c.key === sort.key);
    if (!col?.sortValue) return rows;
    const val = col.sortValue;
    return rows
      .map((r, i) => ({ r, i, v: val(r) }))
      .sort((a, b) => {
        if (a.v === null || a.v === '') return b.v === null || b.v === '' ? a.i - b.i : 1;
        if (b.v === null || b.v === '') return -1;
        const c =
          typeof a.v === 'number' && typeof b.v === 'number' ? a.v - b.v : collator.compare(String(a.v), String(b.v));
        return c * sort.dir || a.i - b.i;
      })
      .map((x) => x.r);
  }, [rows, columns, sort]);

  function toggleSort(key: string) {
    const rest = Object.fromEntries(Object.entries(sorts).filter(([k]) => k !== id));
    if (!sort || sort.key !== key) setSorts({ ...rest, [id]: { key, dir: 1 } });
    else if (sort.dir === 1) setSorts({ ...rest, [id]: { key, dir: -1 } });
    else setSorts(rest);
  }
  function saveWidth(key: string, w: number | undefined) {
    const rest = Object.fromEntries(Object.entries(saved).filter(([k]) => k !== key));
    setWidths({ ...widths, [id]: w ? { ...rest, [key]: Math.round(w) } : rest });
  }
  const startDrag = (key: string) => (e: PointerEvent<HTMLButtonElement>) => {
    const th = e.currentTarget.parentElement as HTMLElement;
    drag.current = { key, x0: e.clientX, w0: th.getBoundingClientRect().width };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onDrag = (e: PointerEvent<HTMLButtonElement>) => {
    const d = drag.current;
    if (!d) return;
    setDragW({ [d.key]: Math.max(48, Math.min(900, d.w0 + e.clientX - d.x0)) });
  };
  const endDrag = () => {
    const d = drag.current;
    drag.current = null;
    if (d && dragW[d.key]) saveWidth(d.key, dragW[d.key]);
    setDragW({});
  };
  const onResizeKey = (key: string) => (e: KeyboardEvent<HTMLButtonElement>) => {
    const th = e.currentTarget.parentElement as HTMLElement;
    const w = th.getBoundingClientRect().width;
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      saveWidth(key, Math.min(900, w + 16));
    }
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      saveWidth(key, Math.max(48, w - 16));
    }
    if (e.key === 'Escape' || e.key === 'Delete') {
      e.preventDefault();
      saveWidth(key, undefined);
    }
  };
  const cellStyle = (c: Column<T>): CSSProperties => {
    const w = widthOf(c.key);
    return w
      ? { width: w, minWidth: w, maxWidth: w, overflowWrap: 'anywhere', whiteSpace: 'normal' }
      : { minWidth: c.minWidth, maxWidth: c.maxWidth, whiteSpace: c.noWrap ? 'nowrap' : undefined };
  };

  return (
    <Table.ScrollContainer minWidth={480} className={classes.scroll}>
      <Table stickyHeader highlightOnHover verticalSpacing={6} horizontalSpacing="sm" fz="sm" className={classes.table}>
        <VisuallyHidden component="caption">{caption}</VisuallyHidden>
        <Table.Thead>
          <Table.Tr>
            {leading && (
              <Table.Th>
                <VisuallyHidden>{leading.label}</VisuallyHidden>
              </Table.Th>
            )}
            {columns.map((c) => {
              const active = sort?.key === c.key;
              return (
                <Table.Th
                  key={c.key}
                  style={{ ...cellStyle(c), textAlign: c.align }}
                  className={classes.th}
                  aria-sort={active ? (sort.dir === 1 ? 'ascending' : 'descending') : undefined}
                >
                  {c.sortValue ? (
                    <UnstyledButton onClick={() => toggleSort(c.key)} className={classes.sortBtn} fz="xs" fw={600}>
                      {c.label}
                      {active ? (
                        sort.dir === 1 ? (
                          <IconSortAscending size={14} aria-hidden />
                        ) : (
                          <IconSortDescending size={14} aria-hidden />
                        )
                      ) : (
                        <IconArrowsSort size={13} aria-hidden className={classes.sortIdle} />
                      )}
                    </UnstyledButton>
                  ) : (
                    <span className={classes.label}>{c.label}</span>
                  )}
                  <button
                    type="button"
                    aria-label={`Πλάτος στήλης ${c.label} (βελάκια αριστερά/δεξιά, Delete για αυτόματο)`}
                    title="Σύρετε για πλάτος · διπλό κλικ: αυτόματο"
                    className={classes.resize}
                    onPointerDown={startDrag(c.key)}
                    onPointerMove={onDrag}
                    onPointerUp={endDrag}
                    onPointerCancel={endDrag}
                    onDoubleClick={() => saveWidth(c.key, undefined)}
                    onKeyDown={onResizeKey(c.key)}
                  />
                </Table.Th>
              );
            })}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {sorted.map((r) => (
            <Table.Tr key={rowKey(r)} style={rowStyle?.(r)}>
              {leading && <Table.Td style={{ whiteSpace: 'nowrap' }}>{leading.render(r)}</Table.Td>}
              {columns.map((c) => (
                <Table.Td key={c.key} style={{ ...cellStyle(c), textAlign: c.align }}>
                  {c.render(r)}
                </Table.Td>
              ))}
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
}
