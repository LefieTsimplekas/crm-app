import { createClient } from '@supabase/supabase-js';

// Δημόσια στοιχεία του project (το «publishable» κλειδί είναι φτιαγμένο για δημόσιες σελίδες· τα δεδομένα τα προστατεύει το RLS).
const url = import.meta.env.VITE_SUPABASE_URL ?? 'https://qyhkdyewdqrbreebmacn.supabase.co';
const key = import.meta.env.VITE_SUPABASE_KEY ?? 'sb_publishable_OvMExg_PKnJfSh7CP8hIsQ_Mg0oowyG';

export const supabase = createClient(url, key);
