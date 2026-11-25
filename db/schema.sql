-- =====================================================================
--  Leads CRM – στήσιμο βάσης στο Supabase
--  Τρέξτε ΟΛΟ το αρχείο μία φορά: Supabase → SQL Editor → New query → Run
-- =====================================================================

create table public.companies (
  code        serial primary key,              -- «Κωδ.»
  name        text not null,                   -- «Εταιρεία»
  sector      text,                            -- «Κλάδος»
  country     text,                            -- «Χώρα»
  fgret       text,                            -- «FG/RET»
  tellody     text,
  files_link  text,                            -- «Σύνδεσμος αρχείων»
  list_id     text,                            -- «Αναγνωριστικό List»
  created_at  timestamptz not null default now()
);
create unique index companies_name_uq on public.companies (lower(btrim(name)));

create table public.leads (
  id            bigserial primary key,
  company_code  int not null references public.companies(code) on delete cascade,
  year          int not null,                  -- «Χρονιά»
  source        text,                          -- «Προέλευση»
  handler       text,                          -- «Χειριστής»
  stage         text,                          -- «Πορεία ενδιαφέροντος»
  sponsor       text,                          -- «Χορηγία»
  cancel_reason text,                          -- «Λόγος ακύρωσης»
  hall          text,
  stand         text,                          -- «Αριθμός Stand»
  sqm           numeric,                       -- «Τ.μ.»
  notes         text,                          -- «Σημειώσεις»
  list_comments text,                          -- «Αρχικά σχόλια List»
  created_at    timestamptz not null default now(),
  unique (company_code, year)                  -- ένα lead ανά εταιρεία και χρονιά
);

create table public.actions (
  id            bigserial primary key,         -- η σειρά = η σειρά του ιστορικού
  company_code  int not null references public.companies(code) on delete cascade,
  lead_year     int,                           -- «Χρονιά lead» (κενό = τελευταία)
  action_date   date not null,                 -- «Ημερομηνία»
  type          text,                          -- «Τύπος ενέργειας»
  description   text,                          -- «Περιγραφή»
  handler       text,                          -- «Χειριστής»
  created_at    timestamptz not null default now()
);
create index actions_company_idx on public.actions (company_code, lead_year);

create table public.contacts (
  id            bigserial primary key,
  company_code  int not null references public.companies(code) on delete cascade,
  name          text not null,                 -- «Ονοματεπώνυμο»
  role          text,                          -- «Θέση»
  phone         text,
  email         text,
  is_primary    boolean not null default false,-- «Κύρια επαφή»
  notes         text,
  created_at    timestamptz not null default now()
);
create index contacts_company_idx on public.contacts (company_code);

-- λίστες επιλογών (ό,τι ήταν το φύλλο «Ρυθμίσεις»). Η θέση μετράει:
-- Πορεία ενδιαφέροντος: θέση 5 = επιτυχία (εκθέτης), 6 = απώλεια (ακύρωση)
-- Χορηγία: 0–1 = σε εξέλιξη, 2 = χορηγός, 3 = δεν προχώρησε
create table public.lists (
  list_name text not null,
  position  int  not null,
  value     text not null,
  primary key (list_name, position)
);

-- ---------- ασφάλεια: μόνο συνδεδεμένοι χρήστες της ομάδας ----------
alter table public.companies enable row level security;
alter table public.leads     enable row level security;
alter table public.actions   enable row level security;
alter table public.contacts  enable row level security;
alter table public.lists     enable row level security;

create policy team_all on public.companies for all to authenticated using (true) with check (true);
create policy team_all on public.leads     for all to authenticated using (true) with check (true);
create policy team_all on public.actions   for all to authenticated using (true) with check (true);
create policy team_all on public.contacts  for all to authenticated using (true) with check (true);
create policy team_all on public.lists     for all to authenticated using (true) with check (true);

grant select, insert, update, delete on all tables in schema public to authenticated;
grant usage, select on all sequences in schema public to authenticated;

-- ---------- ζωντανές ενημερώσεις ανάμεσα στους χρήστες ----------
do $$ begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    alter publication supabase_realtime add table public.companies, public.leads, public.actions, public.contacts, public.lists;
  end if;
end $$;
