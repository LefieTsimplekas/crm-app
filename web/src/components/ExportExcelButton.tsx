import { Button } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useState } from 'react';
import { store } from '../data/store';
import { useData } from '../data/useData';
import { exportSheets } from '../domain/excelExport';

export function ExportExcelButton() {
  const { state } = useData();
  const [pending, setPending] = useState(false);

  async function download() {
    const { state, data, derived } = store.getSnapshot();
    if (pending || state !== 'ready') return;
    setPending(true);
    try {
      const { default: writeExcelFile } = await import('write-excel-file/browser');
      const date = new Date().toLocaleDateString('sv-SE');
      await writeExcelFile(exportSheets(data, derived)).toFile(`Leads CRM ${date}.xlsx`);
      notifications.show({ message: 'Το αρχείο Excel δημιουργήθηκε.', color: 'green' });
    } catch {
      notifications.show({ message: 'Η εξαγωγή Excel δεν ολοκληρώθηκε. Δοκιμάστε ξανά.', color: 'red' });
    } finally {
      setPending(false);
    }
  }

  return (
    <Button
      variant="outline"
      color="gray.0"
      size="xs"
      onClick={() => void download()}
      loading={pending}
      disabled={state !== 'ready'}
    >
      Εξαγωγή σε Excel
    </Button>
  );
}
