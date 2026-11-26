import { Anchor, EmptyState } from '@mantine/core';
import { IconHammer } from '@tabler/icons-react';

export function ComingSoon({ title, phase }: { title: string; phase: number }) {
  return (
    <EmptyState
      my="xl"
      icon={<IconHammer size={22} />}
      title={`${title}: έρχεται στη φάση ${phase}`}
      description={
        <>
          Μέχρι τότε χρησιμοποιήστε την <Anchor href="../">παλιά έκδοση</Anchor> – η βάση είναι κοινή.
        </>
      }
    />
  );
}
