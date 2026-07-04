-- R2·OS multi-tenant schema: per-user data + row-level security.
-- Run this in the Supabase SQL editor (or `supabase db push`) once, after
-- creating the project. Safe to re-run: guarded with IF NOT EXISTS / OR REPLACE.

-- ─────────────────────────────────────────────────────────────────────────
-- Tables
-- ─────────────────────────────────────────────────────────────────────────

-- Profile: one row per auth user, auto-created on signup (trigger below).
create table if not exists public.profiles (
  id                uuid primary key references auth.users(id) on delete cascade,
  name              text,
  location          text,
  timezone          text default 'UTC',
  bible_translation text default 'ESV',
  created_at        timestamptz not null default now()
);

-- FIT: one row per workout → derive streak + calories today.
create table if not exists public.workouts (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  occurred_at  timestamptz not null default now(),
  type         text,
  calories     int  not null default 0,
  duration_min int  not null default 0,
  note         text
);

-- SCHOOL (GMBA): one row per assignment → derive "N deadlines this week".
create table if not exists public.assignments (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  title      text not null,
  course     text,
  due_at     timestamptz,
  status     text not null default 'open',   -- 'open' | 'done'
  created_at timestamptz not null default now()
);

-- FINANCE: transactions + monthly budget → derive "left this month".
create table if not exists public.transactions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  occurred_at timestamptz not null default now(),
  amount      numeric(14,2) not null,        -- negative = spend, positive = income
  category    text,
  note        text
);

create table if not exists public.budgets (
  user_id      uuid not null references auth.users(id) on delete cascade,
  month        date not null,                -- first day of the month
  limit_amount numeric(14,2) not null,
  currency     text not null default 'IDR',
  primary key (user_id, month)
);

-- BUILD: commits / shipped tasks → derive "commits today" / "tasks pending".
create table if not exists public.build_events (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  occurred_at timestamptz not null default now(),
  kind        text not null default 'commit',-- 'commit' | 'task'
  message     text,
  status      text                           -- for tasks: 'pending' | 'done'
);

-- Helpful indexes for the per-user, time-bounded reads the summary does.
create index if not exists workouts_user_time     on public.workouts(user_id, occurred_at desc);
create index if not exists assignments_user_due   on public.assignments(user_id, due_at);
create index if not exists transactions_user_time  on public.transactions(user_id, occurred_at desc);
create index if not exists build_events_user_time  on public.build_events(user_id, occurred_at desc);

-- ─────────────────────────────────────────────────────────────────────────
-- Row-Level Security: a user can only touch their own rows.
-- ─────────────────────────────────────────────────────────────────────────

alter table public.profiles     enable row level security;
alter table public.workouts     enable row level security;
alter table public.assignments  enable row level security;
alter table public.transactions enable row level security;
alter table public.budgets      enable row level security;
alter table public.build_events enable row level security;

-- profiles keyed on id (== auth.uid())
drop policy if exists "profiles - select own" on public.profiles;
create policy "profiles - select own" on public.profiles
  for select using (auth.uid() = id);
drop policy if exists "profiles - modify own" on public.profiles;
create policy "profiles - modify own" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

-- Everything else keyed on user_id. One SELECT + one ALL policy each.
do $$
declare t text;
begin
  foreach t in array array['workouts','assignments','transactions','budgets','build_events']
  loop
    execute format('drop policy if exists "%1$s - select own" on public.%1$s;', t);
    execute format('create policy "%1$s - select own" on public.%1$s for select using (auth.uid() = user_id);', t);
    execute format('drop policy if exists "%1$s - modify own" on public.%1$s;', t);
    execute format('create policy "%1$s - modify own" on public.%1$s for all using (auth.uid() = user_id) with check (auth.uid() = user_id);', t);
  end loop;
end $$;

-- ─────────────────────────────────────────────────────────────────────────
-- Auto-create a profile row when a new auth user signs up.
-- ─────────────────────────────────────────────────────────────────────────

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name)
  values (new.id, new.raw_user_meta_data->>'name')
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
