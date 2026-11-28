-- Εγκατάσταση μία φορά στο Supabase SQL Editor πριν από τη δημοσίευση.
begin;

create or replace function public.edit_list_option(
  p_list text, p_position integer, p_expected text, p_operation text, p_argument text
)
returns boolean
language plpgsql
security invoker
set search_path = ''
as $$
declare
  old_value text;
  new_value text := nullif(btrim(regexp_replace(p_argument, '[[:space:]]+', ' ', 'g')), '');
  neighbor integer;
  neighbor_value text;
  direction integer;
  target_table text;
  target_column text;
  list_filter text;
begin
  if p_list is null or p_list = 'Ναι/Όχι' or p_position is null or p_position not between 0 and 24 then
    raise exception 'Η θέση της λίστας δεν είναι διαθέσιμη.';
  end if;

  -- Σειριοποιεί τις αλλαγές θέσεων και ταυτόχρονες προσθήκες από την εφαρμογή.
  lock table public.lists in share row exclusive mode;
  select value into old_value from public.lists where list_name = p_list and position = p_position;
  if nullif(btrim(old_value), '') is null or old_value is distinct from p_expected then
    raise exception 'Η τιμή έχει αλλάξει. Ανανεώστε τη λίστα και δοκιμάστε ξανά.';
  end if;

  if p_operation = 'remove' then
    if (p_list = 'Πορεία ενδιαφέροντος' and p_position in (5, 6)) or
       (p_list = 'Χορηγία' and p_position in (0, 1, 2, 3)) then
      raise exception 'Η τιμή έχει ειδική σημασία για τους δείκτες και δεν αφαιρείται.';
    end if;
    delete from public.lists where list_name = p_list and position = p_position;
    return true;
  end if;

  if p_operation in ('up', 'down') then
    if p_list in ('Πορεία ενδιαφέροντος', 'Χορηγία') then
      raise exception 'Η σειρά αυτής της λίστας χρησιμοποιείται στους δείκτες.';
    end if;
    direction := case when p_operation = 'up' then -1 else 1 end;
    select position, value into neighbor, neighbor_value
    from public.lists
    where list_name = p_list and position between 0 and 24
      and direction * (position - p_position) > 0 and nullif(btrim(value), '') is not null
    order by abs(position - p_position)
    limit 1;
    if neighbor is null then return false; end if;
    update public.lists
    set value = case when position = p_position then neighbor_value else old_value end
    where list_name = p_list and position in (p_position, neighbor);
    return true;
  end if;

  if p_operation is distinct from 'rename' or new_value is null then
    raise exception 'Συμπληρώστε έγκυρη νέα τιμή.';
  end if;
  if new_value = old_value then return true; end if;
  if exists (
    select 1 from public.lists
    where list_name = p_list and position <> p_position
      and lower(btrim(regexp_replace(value, '[[:space:]]+', ' ', 'g'))) = lower(new_value)
  ) then
    raise exception 'Η νέα τιμή υπάρχει ήδη σε αυτή τη λίστα.';
  end if;

  update public.lists set value = new_value where list_name = p_list and position = p_position;

  -- Οι αντιστοιχίσεις πινάκων και στηλών προέρχονται αποκλειστικά από τις παρακάτω σταθερές.
  for target_table, target_column in
    select table_name, column_name
    from (values
      ('Πορεία ενδιαφέροντος', 'leads', 'stage'),
      ('Χορηγία', 'leads', 'sponsor'),
      ('Προέλευση', 'leads', 'source'),
      ('Κλάδος', 'companies', 'sector'),
      ('Hall', 'leads', 'hall'),
      ('FG/RET', 'companies', 'fgret'),
      ('Tellody', 'companies', 'tellody'),
      ('Τύπος ενέργειας', 'actions', 'type'),
      ('Λόγος ακύρωσης', 'leads', 'cancel_reason')
    ) as mappings(list_name, table_name, column_name)
    where list_name = p_list
  loop
    execute format('update public.%I set %I = $2 where %I = $1', target_table, target_column, target_column)
      using old_value, new_value;
  end loop;

  if p_list = 'Χειριστής' then
    for target_table, target_column in
      select * from (values ('leads', 'handler'), ('actions', 'handler'), ('lists', 'value')) as targets(t, c)
    loop
      list_filter := case when target_table = 'lists'
        then ' and list_name = $3 and position <> $4' else '' end;
      execute format($query$
        update public.%1$I
        set %2$I = case when lower(btrim(%2$I)) = lower(btrim($1)) then $2 else (
          select string_agg(case when lower(btrim(part)) = lower(btrim($1)) then $2 else btrim(part) end, ', ' order by ord)
          from regexp_split_to_table(%2$I, ',') with ordinality as parts(part, ord)
          where btrim(part) <> ''
        ) end
        where (lower(btrim(%2$I)) = lower(btrim($1)) or exists (
          select 1 from regexp_split_to_table(%2$I, ',') as parts(part)
          where lower(btrim(part)) = lower(btrim($1))
        ))%3$s
      $query$, target_table, target_column, list_filter)
      using old_value, new_value, p_list, p_position;
    end loop;
  end if;

  return true;
end;
$$;

revoke all on function public.edit_list_option(text, integer, text, text, text) from public, anon;
grant execute on function public.edit_list_option(text, integer, text, text, text) to authenticated;

commit;
