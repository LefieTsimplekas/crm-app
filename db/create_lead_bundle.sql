-- Εγκατάσταση μία φορά στο Supabase SQL Editor πριν από τη δημοσίευση της νέας φόρμας.
-- Η συνάρτηση γράφει όλες τις εγγραφές στην ίδια συναλλαγή, με τα δικαιώματα του χρήστη.
begin;

create or replace function public.create_lead_bundle(
  p_company_code integer,
  p_company jsonb,
  p_lead jsonb,
  p_contact jsonb,
  p_action jsonb
)
returns jsonb
language plpgsql
security invoker
set search_path = ''
as $$
declare
  company_record public.companies;
  lead_record public.leads;
  contact_record public.contacts;
  action_record public.actions;
  company_name text := nullif(btrim(p_company ->> 'name'), '');
  lead_year integer := (p_lead ->> 'year')::integer;
  area numeric := (p_lead ->> 'sqm')::numeric;
  activity_day date := coalesce((p_action ->> 'action_date')::date, (now() at time zone 'Europe/Athens')::date);
begin
  if lead_year is null or lead_year < 1 or area < 0 then
    raise exception using message = 'Ελέγξτε τη χρονιά και τα τετραγωνικά του lead.', errcode = '22023';
  end if;
  if p_action is not null and activity_day > (now() at time zone 'Europe/Athens')::date then
    raise exception using message = 'Η ημερομηνία της ενέργειας πρέπει να είναι έως και σήμερα.', errcode = '22023';
  end if;

  if p_company_code is null then
    if company_name is null then
      raise exception using message = 'Συμπληρώστε την επωνυμία της εταιρείας.', errcode = '22023';
    end if;
    insert into public.companies (name, sector, country, fgret, tellody)
    values (company_name, p_company ->> 'sector', p_company ->> 'country', p_company ->> 'fgret', p_company ->> 'tellody')
    on conflict (lower(btrim(name))) do nothing
    returning * into company_record;
    if not found then
      raise exception using message = 'Η εταιρεία υπάρχει ήδη. Επιλέξτε την από τη λίστα.', errcode = '23505';
    end if;
  else
    select * into company_record from public.companies where code = p_company_code for update;
    if not found then
      raise exception using message = 'Η εταιρεία δεν είναι πλέον διαθέσιμη.', errcode = '22023';
    end if;
  end if;

  insert into public.leads (company_code, year, source, handler, stage, sponsor, cancel_reason, hall, stand, sqm, notes, list_comments)
  values (company_record.code, lead_year, p_lead ->> 'source', p_lead ->> 'handler', p_lead ->> 'stage',
    p_lead ->> 'sponsor', p_lead ->> 'cancel_reason', p_lead ->> 'hall', p_lead ->> 'stand', area, p_lead ->> 'notes', p_lead ->> 'list_comments')
  on conflict (company_code, year) do nothing
  returning * into lead_record;
  if not found then
    raise exception using message = 'Υπάρχει ήδη lead για την εταιρεία αυτή τη χρονιά.', errcode = '23505';
  end if;

  if p_contact is not null and not exists (
    select 1 from public.contacts
    where company_code = company_record.code
      and lower(btrim(name)) = lower(nullif(btrim(p_contact ->> 'name'), ''))
  ) then
    insert into public.contacts (company_code, name, role, phone, email, is_primary)
    values (company_record.code, coalesce(nullif(btrim(p_contact ->> 'name'), ''), 'Γενικά στοιχεία'),
      p_contact ->> 'role', p_contact ->> 'phone', p_contact ->> 'email',
      not exists (select 1 from public.contacts where company_code = company_record.code))
    returning * into contact_record;
  end if;
  if p_action is not null then
    insert into public.actions (company_code, lead_year, action_date, type, description, handler)
    values (company_record.code, lead_year, activity_day, coalesce(p_action ->> 'type', 'Σχόλιο'),
      coalesce(p_action ->> 'description', 'Νέο lead'), lead_record.handler)
    returning * into action_record;
  end if;

  return jsonb_build_object(
    'company', to_jsonb(company_record),
    'lead', to_jsonb(lead_record),
    'contact', case when contact_record.id is not null then to_jsonb(contact_record) end,
    'action', case when action_record.id is not null then to_jsonb(action_record) end
  );
end;
$$;

revoke all on function public.create_lead_bundle(integer, jsonb, jsonb, jsonb, jsonb) from public, anon;
grant execute on function public.create_lead_bundle(integer, jsonb, jsonb, jsonb, jsonb) to authenticated;

commit;
