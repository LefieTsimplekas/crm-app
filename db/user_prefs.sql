-- Προσωπικές ρυθμίσεις κάθε χρήστη (στήλες, ταξινομήσεις, φίλτρα, «Είμαι ο/η», όρια χρωμάτων)
-- Τρέξτε το μία φορά στο SQL Editor
create table if not exists public.user_prefs (
  user_id    uuid primary key default auth.uid() references auth.users(id) on delete cascade,
  prefs      jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.user_prefs enable row level security;
drop policy if exists own_prefs on public.user_prefs;
create policy own_prefs on public.user_prefs for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
grant select, insert, update, delete on public.user_prefs to authenticated;
