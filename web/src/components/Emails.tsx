import { UnstyledButton } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { Fragment } from 'react';
import { emailsOf } from '../domain/text';

export async function copyText(text: string, message: string) {
  try {
    await navigator.clipboard.writeText(text);
    notifications.show({ color: 'brand', message });
  } catch {
    notifications.show({ color: 'red', message: 'Δεν έγινε αντιγραφή – ο browser δεν το επέτρεψε.' });
  }
}

/** Τα email ενός κειμένου ως κουμπιά αντιγραφής (κλικ ή Enter). */
export function Emails({ value }: { value: string }) {
  const parts: React.ReactNode[] = [];
  let last = 0;
  for (const m of value.matchAll(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g)) {
    const e = m[0],
      at = m.index ?? 0;
    parts.push(<Fragment key={`t${at}`}>{value.slice(last, at)}</Fragment>);
    parts.push(
      <UnstyledButton
        key={`e${at}`}
        onClick={(ev) => {
          ev.stopPropagation();
          void copyText(e, `Αντιγράφηκε: ${e}`);
        }}
        title="Αντιγραφή"
        style={{ borderBottom: '1px dashed currentColor', cursor: 'copy', overflowWrap: 'anywhere' }}
        fz="inherit"
      >
        {e}
      </UnstyledButton>,
    );
    last = at + e.length;
  }
  parts.push(<Fragment key="end">{value.slice(last)}</Fragment>);
  return emailsOf(value).length ? <>{parts}</> : <>{value}</>;
}
