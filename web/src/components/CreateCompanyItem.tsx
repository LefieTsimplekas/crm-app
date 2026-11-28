import { Select } from '@mantine/core';
import { useState } from 'react';
import { useData } from '../data/useData';
import { ActionForm } from './ActionForm';
import { CompanyFormDialog } from './CompanyFormDialog';
import { ContactForm } from './ContactForm';

export type CompanyItemRequest = { kind: 'action' | 'contact'; companyCode?: number; year?: number };

export function CreateCompanyItem({
  request,
  onClose,
  onSaved,
}: {
  request: CompanyItemRequest;
  onClose: () => void;
  onSaved: (message: string) => void;
}) {
  const { derived } = useData();
  const [choice, setChoice] = useState<string | null>(null);
  const [companyCode, setCompanyCode] = useState(request.companyCode);
  const company = companyCode === undefined ? undefined : derived.companies.get(companyCode);
  if (company) {
    return request.kind === 'action' ? (
      <ActionForm company={company} leadYear={request.year} onClose={onClose} onSaved={onSaved} />
    ) : (
      <ContactForm company={company} onClose={onClose} onSaved={onSaved} />
    );
  }

  const options = Array.from(derived.companies.values())
    .filter((row) => request.kind === 'contact' || row.leads.some((lead) => lead.year > 0))
    .map(({ code, name }) => ({ value: String(code), label: `${code} · ${name}` }));

  return (
    <CompanyFormDialog
      title={request.kind === 'action' ? 'Επιλογή εταιρείας για νέα ενέργεια' : 'Επιλογή εταιρείας για νέα επαφή'}
      submitLabel="Συνέχεια"
      pending={false}
      onClose={onClose}
      onSubmit={(event) => {
        event.preventDefault();
        if (choice) setCompanyCode(Number(choice));
      }}
    >
      <Select
        label="Εταιρεία"
        data={options}
        value={choice}
        onChange={setChoice}
        data-autofocus
        required
        searchable
        limit={25}
        nothingFoundMessage="Δεν βρέθηκε διαθέσιμη εταιρεία"
        comboboxProps={{ withinPortal: false }}
      />
    </CompanyFormDialog>
  );
}
