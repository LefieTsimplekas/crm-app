import { Anchor, Box, Button, Group, Text, Title, UnstyledButton } from '@mantine/core';
import type { ReactNode } from 'react';
import classes from './AppLayout.module.css';
import { ExportExcelButton } from './ExportExcelButton';

export interface NavItem {
  id: string;
  label: string;
}
interface Props {
  email: string;
  live: boolean;
  items: NavItem[];
  current: string;
  onNavigate: (id: string) => void;
  onLogout: () => void;
  children: ReactNode;
}

export function AppLayout({ email, live, items, current, onNavigate, onLogout, children }: Props) {
  return (
    <>
      <header className={classes.header}>
        <Group justify="space-between" wrap="wrap" gap="sm" className={classes.bar}>
          <Group gap="sm" wrap="nowrap" style={{ minWidth: 0 }}>
            <Title order={1} fz={{ base: 18, sm: 21 }} c="white">
              Leads CRM
            </Title>
            <Text size="xs" className={classes.badge}>
              νέα έκδοση
            </Text>
            <Group gap={6} wrap="nowrap" style={{ minWidth: 0 }}>
              <span
                className={classes.dot}
                data-live={live || undefined}
                role="img"
                aria-label={live ? 'Ζωντανή ενημέρωση ενεργή' : 'Χωρίς ζωντανή ενημέρωση'}
              />
              <Text size="sm" className={classes.email} truncate>
                {email}
              </Text>
            </Group>
          </Group>
          <Group gap="xs">
            <Anchor href="../" className={classes.link} size="sm">
              Παλιά έκδοση
            </Anchor>
            <ExportExcelButton />
            <Button variant="outline" color="gray.0" size="xs" onClick={onLogout}>
              Αποσύνδεση
            </Button>
          </Group>
        </Group>
        <nav aria-label="Κύρια πλοήγηση" className={classes.nav}>
          {items.map((it) => (
            <UnstyledButton
              key={it.id}
              className={classes.tab}
              data-active={it.id === current || undefined}
              aria-current={it.id === current ? 'page' : undefined}
              onClick={() => onNavigate(it.id)}
            >
              {it.label}
            </UnstyledButton>
          ))}
        </nav>
      </header>
      <Box component="main" px={{ base: 'sm', sm: 'lg' }} py="md">
        {children}
      </Box>
    </>
  );
}
