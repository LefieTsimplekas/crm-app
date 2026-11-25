-- Εκτίμηση κίνησης (egress) από την εφαρμογή – τρέξτε το μία φορά στο SQL Editor
create table if not exists public.usage_log (
  day        date   not null,
  user_email text   not null,
  bytes      bigint not null default 0,
  primary key (day, user_email)
);
alter table public.usage_log enable row level security;
drop policy if exists team_read on public.usage_log;
create policy team_read on public.usage_log for select to authenticated using (true);
grant select on public.usage_log to authenticated;

-- η εφαρμογή στέλνει κάθε λίγο πόσα bytes κατέβασε· εδώ προστίθενται στο σύνολο της ημέρας του χρήστη
create or replace function public.log_usage(p_bytes bigint)
returns void
language sql
security definer
set search_path = public
as $$
  insert into public.usage_log (day, user_email, bytes)
  values ((now() at time zone 'Europe/Athens')::date,
          coalesce(auth.jwt() ->> 'email', 'άγνωστος'),
          greatest(0, least(p_bytes, 200000000)))
  on conflict (day, user_email) do update set bytes = public.usage_log.bytes + excluded.bytes;
$$;
revoke all on function public.log_usage(bigint) from public, anon;
grant execute on function public.log_usage(bigint) to authenticated;
