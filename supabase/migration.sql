-- =====================================================================
-- KaamSetu: Supabase database setup
-- Paste this whole file into Supabase Dashboard > SQL Editor > New query > Run.
-- Safe to run more than once.
-- =====================================================================

-- ---------- 0. Set aside old tables from earlier attempts ----------
-- If a table with the same name already exists but has a different shape, it is MOVED (not deleted)
-- into the schema "kaamsetu_backup" so nothing is lost and the new tables can be created cleanly.
create schema if not exists kaamsetu_backup;
do $$
declare
  t record;
  missing int;
  stamp text := to_char(clock_timestamp(), 'YYYYMMDD_HH24MISS');
begin
  for t in
    select * from (values
      ('app_users',     array['id','role','name','phone','data','is_verified','updated_at']),
      ('bookings',      array['id','customer_phone','status','worker_id','start_otp','data','updated_at']),
      ('chat_messages', array['id','booking_id','sender','text','created_at'])
    ) as v(tbl, cols)
  loop
    if to_regclass('public.' || t.tbl) is not null then
      select count(*) into missing
      from unnest(t.cols) c
      where not exists (
        select 1 from information_schema.columns ic
        where ic.table_schema = 'public' and ic.table_name = t.tbl and ic.column_name = c
      );
      -- the app uses text ids for users/bookings; an old uuid/int id column also needs replacing
      if missing = 0 and t.tbl <> 'chat_messages' and exists (
        select 1 from information_schema.columns ic
        where ic.table_schema = 'public' and ic.table_name = t.tbl
          and ic.column_name = 'id' and ic.data_type <> 'text'
      ) then
        missing := 1;
      end if;
      if missing > 0 then
        execute format('alter table public.%I rename to %I', t.tbl, t.tbl || '_old_' || stamp);
        execute format('alter table public.%I set schema kaamsetu_backup', t.tbl || '_old_' || stamp);
        raise notice 'Moved old public.% to kaamsetu_backup.%', t.tbl, t.tbl || '_old_' || stamp;
      end if;
    end if;
  end loop;
end $$;

-- ---------- 1. Users (customers + workers) ----------
create table if not exists public.app_users (
  id                           text primary key,
  role                         text not null check (role in ('customer','worker')),
  name                         text,
  phone                        text unique,
  email                        text,
  locality                     text,
  trade                        text,
  trade_label                  text,
  document_name                text,
  document_type                text,
  govt_id_document             text,
  police_clearance_document    text,
  is_verified                  boolean not null default false,
  is_govt_id_verified          boolean not null default false,
  is_police_clearance_verified boolean not null default false,
  avatar                       text,
  data                         jsonb not null default '{}'::jsonb,  -- full app object (no passwords)
  created_at                   timestamptz not null default now(),
  updated_at                   timestamptz not null default now()
);
create index if not exists app_users_role_idx on public.app_users (role);

-- ---------- 2. Bookings (jobs posted by customers, worked by technicians) ----------
create table if not exists public.bookings (
  id                  text primary key,
  customer_phone      text,
  customer_name       text,
  category            text,
  category_name       text,
  title               text,
  description         text,
  address             text,
  urgency             text,
  timing_type         text,                 -- 'immediate' | 'scheduled'
  budget_min          numeric,
  budget_max          numeric,
  quote_amount        numeric,
  status              text not null default 'en_route'
                      check (status in ('bidding','en_route','scheduled','in_progress','completed','cancelled')),
  worker_id           text,
  worker_name         text,
  start_otp           text,
  otp_verified        boolean not null default false,
  eta_mins            integer,
  distance_km         numeric,
  escrow_locked       boolean not null default true,
  cancellation_reason text,
  cancellation_fee    numeric,
  refund_amount       numeric,
  data                jsonb not null default '{}'::jsonb,  -- full booking incl. worker snapshot
  created_at          timestamptz not null default now(),
  otp_verified_at     timestamptz,
  completed_at        timestamptz,
  cancelled_at        timestamptz,
  updated_at          timestamptz not null default now()
);
create index if not exists bookings_status_idx   on public.bookings (status);
create index if not exists bookings_customer_idx on public.bookings (customer_phone);
create index if not exists bookings_worker_idx   on public.bookings (worker_id);
create index if not exists bookings_created_idx  on public.bookings (created_at desc);

-- ---------- 3. Chat messages (customer <-> worker) ----------
create table if not exists public.chat_messages (
  id          bigint generated always as identity primary key,
  booking_id  text,
  sender      text not null check (sender in ('customer','worker','system')),
  text        text not null,
  created_at  timestamptz not null default now()
);
create index if not exists chat_messages_booking_idx on public.chat_messages (booking_id, created_at);

-- ---------- keep updated_at fresh ----------
create or replace function public.touch_updated_at() returns trigger
language plpgsql as $$ begin new.updated_at = now(); return new; end $$;

drop trigger if exists app_users_touch on public.app_users;
create trigger app_users_touch before update on public.app_users
  for each row execute function public.touch_updated_at();

drop trigger if exists bookings_touch on public.bookings;
create trigger bookings_touch before update on public.bookings
  for each row execute function public.touch_updated_at();

-- ---------- 4. Row Level Security ----------
-- DEMO-LEVEL ACCESS: the site has no real login yet (Supabase Auth is not wired in),
-- so the public key may read/insert/update these tables. Nobody can DELETE via the key.
-- Before real customers use this, switch to Supabase Auth and restrict rows to their owner.
alter table public.app_users     enable row level security;
alter table public.bookings      enable row level security;
alter table public.chat_messages enable row level security;

drop policy if exists "public read users"    on public.app_users;
drop policy if exists "public insert users"  on public.app_users;
drop policy if exists "public update users"  on public.app_users;
create policy "public read users"   on public.app_users for select to anon, authenticated using (true);
create policy "public insert users" on public.app_users for insert to anon, authenticated with check (true);
create policy "public update users" on public.app_users for update to anon, authenticated using (true) with check (true);

drop policy if exists "public read bookings"   on public.bookings;
drop policy if exists "public insert bookings" on public.bookings;
drop policy if exists "public update bookings" on public.bookings;
create policy "public read bookings"   on public.bookings for select to anon, authenticated using (true);
create policy "public insert bookings" on public.bookings for insert to anon, authenticated with check (true);
create policy "public update bookings" on public.bookings for update to anon, authenticated using (true) with check (true);

drop policy if exists "public read chat"   on public.chat_messages;
drop policy if exists "public insert chat" on public.chat_messages;
create policy "public read chat"   on public.chat_messages for select to anon, authenticated using (true);
create policy "public insert chat" on public.chat_messages for insert to anon, authenticated with check (true);

grant select, insert, update on public.app_users, public.bookings to anon, authenticated;
grant select, insert on public.chat_messages to anon, authenticated;

-- ---------- 5. Accounts (Supabase Auth) ----------
-- Passwords live only in Supabase Auth (auth.users, bcrypt-hashed). app_users holds the profile
-- and points at the account through auth_user_id.
alter table public.app_users add column if not exists auth_user_id uuid;
do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'app_users_auth_user_id_fkey') then
    alter table public.app_users
      add constraint app_users_auth_user_id_fkey
      foreign key (auth_user_id) references auth.users (id) on delete set null;
  end if;
end $$;
create unique index if not exists app_users_auth_user_id_key on public.app_users (auth_user_id);
