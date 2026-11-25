-- Δείκτης ορίων για την εφαρμογή (τρέξτε το μία φορά στο SQL Editor)
create or replace function public.db_usage()
returns json
language sql
security definer
set search_path = public
as $$
  select json_build_object(
    'db_bytes',  pg_database_size(current_database()),
    'companies', (select count(*) from public.companies),
    'leads',     (select count(*) from public.leads),
    'actions',   (select count(*) from public.actions),
    'contacts',  (select count(*) from public.contacts)
  );
$$;
revoke all on function public.db_usage() from public, anon;
grant execute on function public.db_usage() to authenticated;
