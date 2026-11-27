import { Anchor, Badge, Drawer } from '@mantine/core';
import type { ReactNode } from 'react';
import { formatDay } from '../domain/text';
import type { Company } from '../domain/types';
import classes from './CompanyDrawer.module.css';
import { Emails } from './Emails';

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
  const link = company?.row.files_link;
  const leads = [...(company?.leads ?? [])].sort((a, b) => b.year - a.year);
  const actions = [...(company?.actions ?? [])].sort((a, b) => b.day - a.day || b.id - a.id);

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      title={
        <>
          {company && <span className={classes.code}>Κωδ. {company.code}</span>}
          {company?.name ?? 'Καρτέλα εταιρείας'}
        </>
      }
      position="right"
      size="min(640px, 100vw)"
      classNames={{
        content: classes.content,
        header: classes.header,
        title: classes.title,
        body: classes.body,
        close: classes.close,
      }}
      closeButtonProps={{ 'aria-label': 'Κλείσιμο καρτέλας εταιρείας' }}
    >
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
    </Drawer>
  );
}
