begin;

create or replace function public.save_action_with_lead(
  p_company_code integer,
  p_year integer,
  p_action jsonb,
  p_updates jsonb
)
returns jsonb
language plpgsql
security invoker
set search_path = ''
as $$
declare
  lead_record public.leads;
  action_record public.actions;
  activity_day date := (p_action ->> 'action_date')::date;
  description text := nullif(btrim(p_action ->> 'description'), '');
  area numeric := (p_updates ->> 'sqm')::numeric;
begin
  if area < 0 or (p_action is not null and (
    activity_day is null or activity_day > (now() at time zone 'Europe/Athens')::date or description is null
  )) then
    raise exception using message = 'Ελέγξτε τα τετραγωνικά, την ημερομηνία και την περιγραφή.', errcode = '22023';
  end if;

  perform code from public.companies where code = p_company_code for update;
  if not found then
    raise exception using message = 'Η εταιρεία δεν είναι πλέον διαθέσιμη.', errcode = '22023';
  end if;

  update public.leads set
    stage = coalesce(p_updates ->> 'stage', stage),
    sponsor = coalesce(p_updates ->> 'sponsor', sponsor),
    cancel_reason = coalesce(p_updates ->> 'cancel_reason', cancel_reason),
    hall = coalesce(p_updates ->> 'hall', hall),
    sqm = coalesce(area, sqm),
    handler = coalesce(p_updates ->> 'handler', handler)
  where company_code = p_company_code and year = p_year
  returning * into lead_record;
  if not found then
    raise exception using message = 'Το lead δεν είναι πλέον διαθέσιμο.', errcode = '22023';
  end if;

  if p_action is not null then
    insert into public.actions (company_code, lead_year, action_date, type, description, handler)
    values (p_company_code, p_year, activity_day, coalesce(p_action ->> 'type', 'Σχόλιο'),
      description, p_action ->> 'handler')
    returning * into action_record;
  end if;

  return jsonb_build_object('lead', to_jsonb(lead_record),
    'action', case when action_record.id is not null then to_jsonb(action_record) end);
end;
$$;

revoke all on function public.save_action_with_lead(integer, integer, jsonb, jsonb) from public, anon;
grant execute on function public.save_action_with_lead(integer, integer, jsonb, jsonb) to authenticated;

commit;
