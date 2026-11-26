import { Alert, Button, Center, EmptyState, Group, Loader, Text } from '@mantine/core';
import { IconAlertTriangle, IconInbox } from '@tabler/icons-react';

export function Loading({ label = 'Φόρτωση δεδομένων…' }: { label?: string }) {
  return (
    <Center py="xl" role="status" aria-live="polite">
      <Group gap="sm">
        <Loader size="sm" />
        <Text c="dimmed">{label}</Text>
      </Group>
    </Center>
  );
}
export function ErrorView({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <Alert color="red" icon={<IconAlertTriangle size={18} />} title="Κάτι πήγε στραβά" role="alert" my="md">
      <Text size="sm">{message}</Text>
      {onRetry && (
        <Button mt="sm" size="xs" variant="light" color="red" onClick={onRetry}>
          Ξαναδοκιμή
        </Button>
      )}
    </Alert>
  );
}
export function Empty({ title, description }: { title: string; description?: string }) {
  return <EmptyState my="xl" icon={<IconInbox size={22} />} title={title} description={description} />;
}
