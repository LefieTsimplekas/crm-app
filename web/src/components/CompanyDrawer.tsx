import { Anchor, Badge, Button, Drawer, Group } from '@mantine/core';
import { useState, type ReactNode } from 'react';
import { notifications } from '@mantine/notifications';
import { store } from '../data/store';
import { formatDay } from '../domain/text';
import type { ActionRow, Company, ContactRow } from '../domain/types';
import { ActionForm } from './ActionForm';
import classes from './CompanyDrawer.module.css';
import { ContactForm } from './ContactForm';
import { Emails } from './Emails';

type Editor =
  | { code: number; kind: 'contact'; contact?: ContactRow }
  | { code: number; kind: 'action'; action?: ActionRow; year?: number };

function Field({ label, children, full }: { label: string; children: ReactNode; full?: boolean }) {
  return (
    <div className={full ? classes.full : undefined}>
      <dt>{label}</dt>
      <dd>{children ?? '—'}</dd>
    </div>
  );
}

export function CompanyDrawer({
  opened,
  company,
  onClose,
}: {
  opened: boolean;
  company?: Company;
  onClose: () => void;
}) {
  const [editing, setEditing] = useState<Editor | null>(null);
  const activeEditor = opened && company && editing?.code === company.code ? editing : null;
  const link = company?.row.files_link;
  const leads = [...(company?.leads ?? [])].sort((a, b) => b.year - a.year);
  const actions = [...(company?.actions ?? [])].sort((a, b) => b.day - a.day || b.id - a.id);

  const closeForm = () => setEditing(null);
  function saved(message: string) {
    closeForm();
    notifications.show({ message, color: 'green' });
  }

  return (
    <>
      <Drawer.Root
        opened={opened}
        onClose={() => {
          setEditing(null);
          onClose();
        }}
        trapFocus={!activeEditor}
        closeOnEscape={!activeEditor}
        closeOnClickOutside={!activeEditor}
        position="right"
        size="min(640px, 100vw)"
        classNames={{
          content: classes.content,
          header: classes.header,
          title: classes.title,
          body: classes.body,
          close: classes.close,
        }}
      >
        <Drawer.Overlay />
        <Drawer.Content>
          <Drawer.Header>
            <div className={classes.heading}>
              <Drawer.Title>
                {company && <span className={classes.code}>Κωδ. {company.code}</span>}
                {company?.name ?? 'Καρτέλα εταιρείας'}
              </Drawer.Title>
              {company && (
                <Group gap="xs" className={classes.drawerActions}>
                  <Button
                    size="compact-sm"
                    className={classes.addAction}
                    onClick={() => setEditing({ code: company.code, kind: 'action' })}
                  >
                    + Ενέργεια
                  </Button>
                  <Button
                    size="compact-sm"
                    variant="outline"
                    className={classes.addContact}
                    onClick={() => setEditing({ code: company.code, kind: 'contact' })}
                  >
                    + Επαφή
                  </Button>
                </Group>
              )}
            </div>
            <Drawer.CloseButton aria-label="Κλείσιμο καρτέλας εταιρείας" />
          </Drawer.Header>
          <Drawer.Body>
            {company ? (
              <>
                <section className={classes.section}>
                  <h3>Στοιχεία</h3>
                  <dl className={classes.grid}>
                    <Field label="Κλάδος">{company.row.sector || '—'}</Field>
                    <Field label="Χώρα">{company.row.country || '—'}</Field>
                    <Field label="FG/RET">{company.row.fgret || '—'}</Field>
                    <Field label="Tellody">{company.row.tellody || '—'}</Field>
                    <Field label="Αναγνωριστικό List">{company.row.list_id || '—'}</Field>
                    <Field label="Σύνδεσμος αρχείων">
                      {link?.startsWith('https://') ? (
                        <Anchor href={link} target="_blank" rel="noopener noreferrer" fz="inherit">
                          Άνοιγμα
                        </Anchor>
                      ) : (
                        link || '—'
                      )}
                    </Field>
                  </dl>
                </section>
                <CompanyContacts
                  company={company}
                  onEdit={(contact) => setEditing({ code: company.code, kind: 'contact', contact })}
                />
                <section className={classes.section}>
                  <h3>Leads</h3>
                  {!leads.length && <p className={classes.muted}>Κανένα lead.</p>}
                  {leads.map((lead) => (
                    <article className={classes.card} key={lead.id}>
                      <div className={classes.cardHeader}>
                        <strong className={classes.year}>{lead.year || '—'}</strong>
                        <span className={classes.stage}>
                          <span className={classes.dot} data-open={lead.open} />
                          {lead.stage || '—'}
                        </span>
                        <Button
                          ml="auto"
                          variant="default"
                          size="compact-sm"
                          onClick={() => setEditing({ code: company.code, kind: 'action', year: lead.year })}
                        >
                          + Ενέργεια
                        </Button>
                      </div>
                      <dl className={classes.grid}>
                        <Field label="Χειριστής">{lead.handler || '—'}</Field>
                        <Field label="Χορηγία">{lead.sponsor || '—'}</Field>
                        <Field label="Προέλευση">{lead.row.source || '—'}</Field>
                        <Field label="Hall / Stand">
                          {[lead.row.hall, lead.row.stand].filter(Boolean).join(' · ') || '—'}
                        </Field>
                        <Field label="Τ.μ.">{lead.row.sqm === '' ? '—' : lead.row.sqm}</Field>
                        <Field label="Τελευταία επαφή">{formatDay(lead.lastDay) || 'καμία'}</Field>
                        <Field label="Εκθέτης προηγ. χρονιάς">{lead.prevExhibitor ? 'Ναι' : 'Όχι'}</Field>
                        {lead.row.cancel_reason && <Field label="Λόγος ακύρωσης">{lead.row.cancel_reason}</Field>}
                        {lead.row.notes && (
                          <Field label="Σημειώσεις" full>
                            {lead.row.notes}
                          </Field>
                        )}
                        {lead.row.list_comments && (
                          <Field label="Αρχικά σχόλια List" full>
                            {lead.row.list_comments}
                          </Field>
                        )}
                      </dl>
                    </article>
                  ))}
                </section>
                <section className={classes.section}>
                  <h3>Ιστορικό ενεργειών ({actions.length})</h3>
                  {actions.length ? (
                    <ol className={classes.timeline}>
                      {actions.map((action) => (
                        <li key={action.id}>
                          <Button
                            className={classes.editAction}
                            variant="default"
                            size="compact-sm"
                            aria-label={`Αλλαγή ενέργειας ${formatDay(action.day)} – ${action.type || 'Σχόλιο'} (${action.id})`}
                            onClick={() => {
                              const row = store.getSnapshot().data.actions.find((item) => item.id === action.id);
                              if (row) setEditing({ code: company.code, kind: 'action', action: row });
                            }}
                          >
                            Αλλαγή
                          </Button>
                          <div className={classes.muted}>
                            {[formatDay(action.day), action.year, action.handler].filter(Boolean).join(' · ')}
                          </div>
                          <div>
                            {action.type && (
                              <>
                                <strong>{action.type}</strong> ·{' '}
                              </>
                            )}
                            {action.description}
                          </div>
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <p className={classes.muted}>Καμία ενέργεια.</p>
                  )}
                </section>
              </>
            ) : (
              <p className={classes.muted}>Η εταιρεία δεν είναι διαθέσιμη.</p>
            )}
          </Drawer.Body>
        </Drawer.Content>
      </Drawer.Root>
      {company && activeEditor?.kind === 'contact' && (
        <ContactForm company={company} contact={activeEditor.contact} onClose={closeForm} onSaved={saved} />
      )}
      {company && activeEditor?.kind === 'action' && (
        <ActionForm
          company={company}
          action={activeEditor.action}
          leadYear={activeEditor.year}
          onClose={closeForm}
          onSaved={saved}
        />
      )}
    </>
  );
}

function CompanyContacts({ company, onEdit }: { company: Company; onEdit: (contact: ContactRow) => void }) {
  return (
    <section className={classes.section}>
      <h3>Επαφές ({company.contacts.length})</h3>
      {!company.contacts.length && <p className={classes.muted}>Καμία επαφή.</p>}
      {company.contacts.map((contact) => (
        <article className={classes.card} key={contact.id}>
          <div className={classes.cardHeader}>
            <strong>{contact.name}</strong>
            {contact.is_primary && (
              <Badge variant="light" size="sm">
                Κύρια
              </Badge>
            )}
            <Button
              ml="auto"
              variant="default"
              size="compact-sm"
              aria-label={`Επεξεργασία επαφής ${contact.name}`}
              onClick={() => onEdit(contact)}
            >
              Επεξεργασία
            </Button>
          </div>
          <dl className={classes.grid}>
            {contact.role && <Field label="Θέση">{contact.role}</Field>}
            {contact.phone && <Field label="Τηλέφωνο">{contact.phone}</Field>}
            {contact.email && (
              <Field label="Email">
                <Emails value={contact.email} />
              </Field>
            )}
            {contact.notes && (
              <Field label="Σημειώσεις" full>
                {contact.notes}
              </Field>
            )}
          </dl>
        </article>
      ))}
    </section>
  );
}
