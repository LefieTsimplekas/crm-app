-- Εκτελέστε μία φορά στο υπάρχον project Supabase πριν από τη δημοσίευση.
begin;
create or replace function public.normalize_company_countries(p_changes jsonb)
returns integer
language plpgsql
security invoker
set search_path = ''
as $$
declare
  updated integer;
begin
  if p_changes is null or jsonb_typeof(p_changes) <> 'array' then
    raise exception 'Δεν δόθηκαν έγκυρες αλλαγές χωρών.';
  end if;
  update public.companies as company
  set country = changes.country
  from jsonb_to_recordset(p_changes) as changes(code integer, old_country text, country text)
  where company.code = changes.code and company.country = changes.old_country
    and nullif(btrim(changes.country), '') is not null and changes.country <> changes.old_country;
  get diagnostics updated = row_count;
  if updated <> jsonb_array_length(p_changes) then
    raise exception 'Κάποια στοιχεία έχουν αλλάξει. Ελέγξτε τη νέα προεπισκόπηση πριν δοκιμάσετε ξανά.';
  end if;
  return updated;
end;
$$;
revoke all on function public.normalize_company_countries(jsonb) from public, anon;
grant execute on function public.normalize_company_countries(jsonb) to authenticated;
commit;
