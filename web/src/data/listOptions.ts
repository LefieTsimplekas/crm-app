import { store } from './store';
import { supabase } from './supabase';

export type ListOption = { value: string; position: number };

export function canMoveList(name: string) {
  return name !== 'Πορεία ενδιαφέροντος' && name !== 'Χορηγία';
}

export function canRemoveOption(name: string, position: number) {
  if (name === 'Πορεία ενδιαφέροντος') return position !== 5 && position !== 6;
  if (name === 'Χορηγία') return position > 3;
  return true;
}

export async function editListOption(
  list: string,
  option: ListOption,
  operation: 'rename' | 'remove' | 'up' | 'down',
  value: string | null = null,
) {
  const { data, error } = await supabase.rpc('edit_list_option', {
    p_list: list,
    p_position: option.position,
    p_expected: option.value,
    p_operation: operation,
    p_argument: value,
  });

  if (error?.code === 'PGRST202') {
    throw new Error('Η επεξεργασία λιστών χρειάζεται ενεργοποίηση στο Supabase. Ενημερώστε τον διαχειριστή.');
  }
  if (error || data !== true) {
    if (error && !error.message.includes('Ανανεώστε τη λίστα')) throw new Error(error.message);
    await store.load();
    throw new Error(error?.message ?? 'Η θέση δεν είναι πλέον διαθέσιμη.');
  }
  await store.load();
}
