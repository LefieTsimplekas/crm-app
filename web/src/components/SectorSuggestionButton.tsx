import { Button, Group, Text } from '@mantine/core';
import { useState } from 'react';
import { suggestSectors, type SectorCompany, type SectorSuggestion } from '../data/sectorSuggestions';

export function SectorSuggestionButton({
  request,
  sectors,
  onChoose,
  disabled,
}: {
  request: (form: HTMLFormElement | null) => SectorCompany;
  sectors: string[];
  onChoose: (sector: string) => void;
  disabled: boolean;
}) {
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<SectorSuggestion | null>();
  const [error, setError] = useState('');
  async function suggest(form: HTMLFormElement | null) {
    setError('');
    setResult(undefined);
    const company = request(form);
    if (!company.name) {
      setError('Συμπληρώστε πρώτα την επωνυμία.');
      return;
    }
    setPending(true);
    try {
      const [answer] = await suggestSectors([company], sectors);
      setResult(answer ?? null);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Η πρόταση απέτυχε.');
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <Group gap="xs">
        <Button
          type="button"
          variant="default"
          size="xs"
          disabled={disabled}
          loading={pending}
          onClick={(event) => void suggest(event.currentTarget.form)}
        >
          Πρόταση κλάδου με AI
        </Button>
        {result && (
          <>
            <Text size="xs">
              {result.sector} · {Math.round(result.confidence * 100)}% · {result.reason}
            </Text>
            <Button
              type="button"
              size="xs"
              disabled={disabled}
              onClick={() => {
                onChoose(result.sector);
                setResult(undefined);
              }}
            >
              Χρήση πρότασης
            </Button>
          </>
        )}
      </Group>
      <Text size="xs" c="dimmed">
        Η πρόταση στέλνει στο Groq την επωνυμία, τη χώρα και, εφόσον υπάρχει, το domain του εταιρικού email.
      </Text>
      {result === null && (
        <Text size="xs" role="status">
          Δεν βρέθηκε πρόταση.
        </Text>
      )}
      {error && (
        <Text size="xs" role="alert" c="red">
          {error}
        </Text>
      )}
    </>
  );
}
