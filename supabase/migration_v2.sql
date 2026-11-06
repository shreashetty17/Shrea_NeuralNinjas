-- =====================================================================
-- KaamSetu v2: workers + service categories live in Supabase
-- Paste into Supabase Dashboard > SQL Editor > New query > Run.
-- Safe to run more than once. Run supabase/migration.sql first if you haven't.
-- The website fills both tables automatically the first time it loads.
-- After that, edit rows here (Table Editor) and the website shows the change.
-- =====================================================================

create table if not exists public.workers (
  id          text primary key,
  sort_order  integer not null default 0,
  data        jsonb not null default '{}'::jsonb,  -- full worker profile
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists workers_sort_idx on public.workers (sort_order);

create table if not exists public.service_categories (
  id          text primary key,
  sort_order  integer not null default 0,
  data        jsonb not null default '{}'::jsonb,  -- name, translations, price range, image
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists service_categories_sort_idx on public.service_categories (sort_order);

drop trigger if exists workers_touch on public.workers;
create trigger workers_touch before update on public.workers
  for each row execute function public.touch_updated_at();

drop trigger if exists service_categories_touch on public.service_categories;
create trigger service_categories_touch before update on public.service_categories
  for each row execute function public.touch_updated_at();

-- DEMO-LEVEL ACCESS (same as the other tables): the public key can read, add and update.
alter table public.workers            enable row level security;
alter table public.service_categories enable row level security;

drop policy if exists "public read workers"   on public.workers;
drop policy if exists "public insert workers" on public.workers;
drop policy if exists "public update workers" on public.workers;
create policy "public read workers"   on public.workers for select to anon, authenticated using (true);
create policy "public insert workers" on public.workers for insert to anon, authenticated with check (true);
create policy "public update workers" on public.workers for update to anon, authenticated using (true) with check (true);

drop policy if exists "public read categories"   on public.service_categories;
drop policy if exists "public insert categories" on public.service_categories;
drop policy if exists "public update categories" on public.service_categories;
create policy "public read categories"   on public.service_categories for select to anon, authenticated using (true);
create policy "public insert categories" on public.service_categories for insert to anon, authenticated with check (true);
create policy "public update categories" on public.service_categories for update to anon, authenticated using (true) with check (true);

grant select, insert, update on public.workers, public.service_categories to anon, authenticated;

-- Tell the API about the new tables right away
notify pgrst, 'reload schema';
