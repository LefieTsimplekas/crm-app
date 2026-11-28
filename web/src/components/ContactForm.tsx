import { Alert, NativeSelect, SimpleGrid, Textarea, TextInput } from '@mantine/core';
import { useRef, useState, type SubmitEvent } from 'react';
import { store } from '../data/store';
import { supabase } from '../data/supabase';
import { norm } from '../domain/text';
import type { Company, ContactRow } from '../domain/types';
import { CompanyFormDialog } from './CompanyFormDialog';

export function ContactForm({
  company,
  contact,
  onClose,
  onSaved,
}: {
  company: Company;
  contact?: ContactRow;
  onClose: () => void;
  onSaved: (message: string) => void;
}) {
  const [name, setName] = useState(contact?.name ?? '');
  const [role, setRole] = useState(contact?.role ?? '');
  const [phone, setPhone] = useState(contact?.phone ?? '');
  const [email, setEmail] = useState(contact?.email ?? '');
  const [notes, setNotes] = useState(contact?.notes ?? '');
  const [primary, setPrimary] = useState(contact?.is_primary ?? company.contacts.length === 0);
  const [pending, setPending] = useState(false);
  const [nameError, setNameError] = useState('');
  const [error, setError] = useState('');
  const nameInput = useRef<HTMLInputElement>(null);

  async function save(event: SubmitEvent) {
    event.preventDefault();
    if (pending) return;
    const trimmed = name.trim();
    setNameError('');
    setError('');
    if (!trimmed) {
      setNameError('Συμπληρώστε το ονοματεπώνυμο.');
      nameInput.current?.focus();
      return;
    }
    const latest = store.getSnapshot().derived.companies.get(company.code);
    if (!latest) {
      setError('Η εταιρεία δεν είναι πλέον διαθέσιμη.');
      return;
    }
    const nameChanged = !contact || norm(contact.name) !== norm(trimmed);
    if (nameChanged && latest.contacts.some((item) => item.id !== contact?.id && norm(item.name) === norm(trimmed))) {
      setNameError('Υπάρχει ήδη επαφή με αυτό το όνομα στην εταιρεία.');
      nameInput.current?.focus();
      return;
    }

    setPending(true);
    try {
      const fields = {
        name: trimmed,
        role: role.trim() || null,
        phone: phone.trim() || null,
        email: email.trim() || null,
        notes: notes.trim() || null,
        is_primary: primary,
      };
      const query = contact
        ? supabase.from('contacts').update(fields).eq('id', contact.id).eq('company_code', company.code)
        : supabase.from('contacts').insert({ company_code: company.code, ...fields });
      const { data, error } = await query.select().maybeSingle<ContactRow>();
      if (error) {
        setError(error.message);
        return;
      }
      if (!data) {
        setError('Η επαφή δεν αποθηκεύτηκε. Ελέγξτε αν είναι ακόμη διαθέσιμη.');
        return;
      }

      store.apply('contacts', 'upsert', { ...data });
      onSaved(contact ? 'Η επαφή ενημερώθηκε.' : 'Η επαφή προστέθηκε.');
    } catch {
      setError('Η αποθήκευση δεν ολοκληρώθηκε. Δοκιμάστε ξανά.');
    } finally {
      setPending(false);
    }
  }

  return (
    <CompanyFormDialog
      title={contact ? 'Επεξεργασία επαφής' : 'Νέα επαφή'}
      submitLabel={contact ? 'Αποθήκευση' : 'Προσθήκη'}
      pending={pending}
      onClose={onClose}
      onSubmit={(event) => void save(event)}
    >
      <TextInput label="Εταιρεία" required readOnly value={`${company.code} · ${company.name}`} />
      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xs">
        <TextInput
          ref={nameInput}
          data-autofocus
          label="Ονοματεπώνυμο"
          required
          value={name}
          onChange={(event) => setName(event.currentTarget.value)}
          error={nameError}
          disabled={pending}
        />
        <TextInput
          label="Θέση"
          value={role}
          onChange={(event) => setRole(event.currentTarget.value)}
          disabled={pending}
        />
        <TextInput
          label="Τηλέφωνο"
          type="tel"
          value={phone}
          onChange={(event) => setPhone(event.currentTarget.value)}
          disabled={pending}
        />
        <TextInput
          label="Email"
          inputMode="email"
          value={email}
          onChange={(event) => setEmail(event.currentTarget.value)}
          disabled={pending}
        />
        <NativeSelect
          label="Κύρια επαφή"
          data={[
            { value: 'no', label: 'Όχι' },
            { value: 'yes', label: 'Ναι' },
          ]}
          value={primary ? 'yes' : 'no'}
          onChange={(event) => setPrimary(event.currentTarget.value === 'yes')}
          disabled={pending}
        />
      </SimpleGrid>
      <Textarea
        label="Σημειώσεις"
        minRows={2}
        autosize
        value={notes}
        onChange={(event) => setNotes(event.currentTarget.value)}
        disabled={pending}
      />
      {error && (
        <Alert color="red" role="alert">
          {error}
        </Alert>
      )}
    </CompanyFormDialog>
  );
}
