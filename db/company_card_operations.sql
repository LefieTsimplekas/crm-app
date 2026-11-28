-- Εκτελέστε μία φορά στο Supabase SQL Editor.
begin;

create or replace function public.delete_company_lead(p_company_code integer, p_lead_id bigint)
returns boolean
language plpgsql
security invoker
set search_path = ''
as $$
declare
  selected_year integer;
  latest_year integer;
begin
  perform 1 from public.companies where code = p_company_code for update;
  if not found then return false; end if;

  select year into selected_year from public.leads
  where company_code = p_company_code and id = p_lead_id for update;
  if not found then return false; end if;

  select max(year) into latest_year from public.leads where company_code = p_company_code;
  delete from public.actions
  where company_code = p_company_code
    and (lead_year = selected_year or (coalesce(lead_year, 0) = 0 and selected_year = latest_year));
  delete from public.leads where company_code = p_company_code and id = p_lead_id;
  if not found then
    raise exception 'Το lead δεν είναι πλέον διαθέσιμο.';
  end if;
  return true;
end;
$$;

create or replace function public.save_sole_primary_contact(
  p_company_code integer, p_contact_id bigint, p_fields jsonb
)
returns boolean
language plpgsql
security invoker
set search_path = ''
as $$
declare
  saved_id bigint;
  contact_name text := nullif(btrim(p_fields ->> 'name'), '');
begin
  perform 1 from public.companies where code = p_company_code for update;
  if not found then raise exception 'Η εταιρεία δεν είναι πλέον διαθέσιμη.'; end if;
  if contact_name is null then raise exception 'Συμπληρώστε το ονοματεπώνυμο.'; end if;
  if exists (
    select 1 from public.contacts
    where company_code = p_company_code and id is distinct from p_contact_id
      and lower(regexp_replace(btrim(name), '[[:space:]]+', ' ', 'g')) =
        lower(regexp_replace(contact_name, '[[:space:]]+', ' ', 'g'))
  ) and not exists (
    select 1 from public.contacts
    where id = p_contact_id and company_code = p_company_code
      and lower(regexp_replace(btrim(name), '[[:space:]]+', ' ', 'g')) =
        lower(regexp_replace(contact_name, '[[:space:]]+', ' ', 'g'))
  ) then
    raise exception 'Υπάρχει ήδη επαφή με αυτό το όνομα στην εταιρεία.';
  end if;

  if p_contact_id is null then
    insert into public.contacts (company_code, name, role, phone, email, notes, is_primary)
    values (p_company_code, contact_name, p_fields ->> 'role', p_fields ->> 'phone',
      p_fields ->> 'email', p_fields ->> 'notes', true)
    returning id into saved_id;
  else
    update public.contacts
    set name = contact_name, role = p_fields ->> 'role', phone = p_fields ->> 'phone',
      email = p_fields ->> 'email', notes = p_fields ->> 'notes', is_primary = true
    where company_code = p_company_code and id = p_contact_id
    returning id into saved_id;
    if not found then raise exception 'Η επαφή δεν είναι πλέον διαθέσιμη.'; end if;
  end if;

  update public.contacts set is_primary = false
  where company_code = p_company_code and id <> saved_id and is_primary;
  return true;
end;
$$;

revoke all on function public.delete_company_lead(integer, bigint) from public, anon;
revoke all on function public.save_sole_primary_contact(integer, bigint, jsonb) from public, anon;
grant execute on function public.delete_company_lead(integer, bigint) to authenticated;
grant execute on function public.save_sole_primary_contact(integer, bigint, jsonb) to authenticated;

commit;
