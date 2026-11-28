import { Button, Group, Modal, Stack } from '@mantine/core';
import type { ReactNode, SubmitEventHandler } from 'react';
import classes from './CompanyFormDialog.module.css';

export function CompanyFormDialog({
  title,
  submitLabel,
  pending,
  onClose,
  onSubmit,
  children,
}: {
  title: string;
  submitLabel: string;
  pending: boolean;
  onClose: () => void;
  onSubmit: SubmitEventHandler<HTMLFormElement>;
  children: ReactNode;
}) {
  return (
    <Modal
      opened
      onClose={() => {
        if (!pending) onClose();
      }}
      title={title}
      centered
      size={720}
      zIndex={300}
      radius="lg"
      overlayProps={{ backgroundOpacity: 0.65 }}
      closeOnClickOutside={false}
      closeOnEscape={!pending}
      closeButtonProps={{ 'aria-label': 'Κλείσιμο φόρμας', disabled: pending }}
      classNames={{ content: classes.content, header: classes.header, title: classes.title, body: classes.body }}
    >
      <form onSubmit={onSubmit}>
        <Stack gap="xs" className={classes.fields}>
          {children}
        </Stack>
        <Group justify="flex-end" gap="xs" className={classes.footer}>
          <Button type="button" variant="default" onClick={onClose} disabled={pending}>
            Άκυρο
          </Button>
          <Button type="submit" loading={pending}>
            {submitLabel}
          </Button>
        </Group>
      </form>
    </Modal>
  );
}
