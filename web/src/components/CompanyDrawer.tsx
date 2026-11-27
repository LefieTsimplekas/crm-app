import { Drawer, Group, Paper, Stack, Text, Title } from '@mantine/core';
import { formatDay } from '../domain/text';
import type { Company } from '../domain/types';
import { Emails } from './Emails';

export function CompanyDrawer({
  opened,
  company,
  onClose,
}: {
  opened: boolean;
  company?: Company;
  onClose: () => void;
}) {
  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      title={company?.name ?? 'Καρτέλα εταιρείας'}
      position="right"
      size="lg"
      closeButtonProps={{ 'aria-label': 'Κλείσιμο καρτέλας εταιρείας' }}
    >
      {company ? (
        <Stack gap="lg">
          <Group gap="sm">
            <Text size="sm">Κωδικός {company.code}</Text>
            {company.row.sector && <Text size="sm">{company.row.sector}</Text>}
            {company.row.country && <Text size="sm">{company.row.country}</Text>}
          </Group>
          <Stack gap="xs">
            <Title order={3} size="h5">
              Επαφές
            </Title>
            {!company.contacts.length && (
              <Text c="dimmed" size="sm">
                Δεν υπάρχουν επαφές.
              </Text>
            )}
            {company.contacts.map((contact) => (
              <Paper withBorder p="sm" key={contact.id}>
                <Text fw={600}>
                  {contact.name}
                  {contact.is_primary ? ' · Κύρια επαφή' : ''}
                </Text>
                {contact.role && <Text size="sm">{contact.role}</Text>}
                {contact.phone && <Text size="sm">{contact.phone}</Text>}
                {contact.email && (
                  <Text size="sm">
                    <Emails value={contact.email} />
                  </Text>
                )}
                {contact.notes && (
                  <Text size="sm" style={{ whiteSpace: 'pre-wrap' }}>
                    {contact.notes}
                  </Text>
                )}
              </Paper>
            ))}
          </Stack>
          <Stack gap="xs">
            <Title order={3} size="h5">
              Leads
            </Title>
            {!company.leads.length && (
              <Text c="dimmed" size="sm">
                Δεν υπάρχουν leads.
              </Text>
            )}
            {[...company.leads]
              .sort((a, b) => b.year - a.year)
              .map((lead) => (
                <Paper withBorder p="sm" key={lead.id}>
                  <Text fw={600}>{[lead.year, lead.stage, lead.sponsor].filter(Boolean).join(' · ')}</Text>
                  <Text size="sm">
                    {[
                      lead.handler,
                      lead.row.hall && `Hall ${lead.row.hall}`,
                      lead.row.stand && `Stand ${lead.row.stand}`,
                      lead.row.sqm && `${lead.row.sqm} τ.μ.`,
                    ]
                      .filter(Boolean)
                      .join(' · ')}
                  </Text>
                  {lead.row.notes && (
                    <Text size="sm" style={{ whiteSpace: 'pre-wrap' }}>
                      {lead.row.notes}
                    </Text>
                  )}
                </Paper>
              ))}
          </Stack>
          <Stack gap="xs">
            <Title order={3} size="h5">
              Ιστορικό ενεργειών
            </Title>
            {!company.actions.length && (
              <Text c="dimmed" size="sm">
                Δεν υπάρχουν ενέργειες.
              </Text>
            )}
            {[...company.actions]
              .sort((a, b) => b.day - a.day || b.id - a.id)
              .map((action) => (
                <Paper withBorder p="sm" key={action.id}>
                  <Text size="sm" fw={600}>
                    {[formatDay(action.day), action.type, action.handler].filter(Boolean).join(' · ')}
                  </Text>
                  <Text size="sm" style={{ whiteSpace: 'pre-wrap' }}>
                    {action.description}
                  </Text>
                </Paper>
              ))}
          </Stack>
        </Stack>
      ) : (
        <Text c="dimmed">Η εταιρεία δεν είναι διαθέσιμη.</Text>
      )}
    </Drawer>
  );
}
