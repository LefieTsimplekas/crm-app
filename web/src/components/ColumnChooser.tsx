import { ActionIcon, Button, Checkbox, Group, Popover, Stack, Text } from '@mantine/core';
import { IconArrowDown, IconArrowUp, IconColumns } from '@tabler/icons-react';

interface Props {
  all: string[];
  selected: string[];
  fixed: string[];
  onChange: (cols: string[]) => void;
  defaults: string[];
}

/** Επιλογή και σειρά στηλών. */
export function ColumnChooser({ all, selected, fixed, onChange, defaults }: Props) {
  const order = [...selected, ...all.filter((c) => !selected.includes(c))];
  const move = (c: string, d: -1 | 1) => {
    const i = selected.indexOf(c),
      j = i + d;
    if (i < 0 || j < 0 || j >= selected.length) return;
    const next = [...selected];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  return (
    <Popover position="bottom-end" shadow="md" width={300} trapFocus>
      <Popover.Target>
        <Button variant="default" leftSection={<IconColumns size={16} />}>
          Στήλες
        </Button>
      </Popover.Target>
      <Popover.Dropdown mah="60vh" style={{ overflowY: 'auto' }}>
        <Text fw={600} size="sm" mb="xs">
          Στήλες λίστας
        </Text>
        <Stack gap={4}>
          {order.map((c) => {
            const on = selected.includes(c);
            return (
              <Group key={c} gap={4} wrap="nowrap">
                <Checkbox
                  style={{ flex: 1 }}
                  label={c}
                  checked={on}
                  disabled={fixed.includes(c)}
                  onChange={(e) =>
                    onChange(e.currentTarget.checked ? [...selected, c] : selected.filter((x) => x !== c))
                  }
                />
                {on && (
                  <>
                    <ActionIcon variant="default" size="sm" aria-label={`${c}: πάνω`} onClick={() => move(c, -1)}>
                      <IconArrowUp size={14} />
                    </ActionIcon>
                    <ActionIcon variant="default" size="sm" aria-label={`${c}: κάτω`} onClick={() => move(c, 1)}>
                      <IconArrowDown size={14} />
                    </ActionIcon>
                  </>
                )}
              </Group>
            );
          })}
        </Stack>
        <Button mt="sm" size="xs" variant="subtle" onClick={() => onChange(defaults)}>
          Προεπιλογή
        </Button>
      </Popover.Dropdown>
    </Popover>
  );
}
