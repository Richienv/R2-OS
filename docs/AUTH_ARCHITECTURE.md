# R2·OS — Multi-Tenant Architecture (Auth + Per-User Data)

**Goal:** every user signs in and sees only their own Fit / School / Finance /
Build data, so R2·OS can be shared with clients, friends, and family.

**Decisions (locked in):**

- **R2·OS owns the data.** Tracking moves _into_ R2·OS with its own database.
  The four sub-apps (`r2-fit`, `r2-school`, `r2-finance`, `r2-build`) stop being
  the source of truth. One codebase → true multi-tenancy is tractable.
- **Supabase** for Auth + Postgres + Row-Level Security (RLS).
- **Email + password** sign-in.

---

## 1. Why the current design can't be "per-user"

Today R2·OS is a **read-only hub with no database and no user concept**. The
home tiles / brief / apps screens all read one endpoint — `/api/aggregate` —
which server-side fetches `/api/summary` from four _separate deployed apps_.
Each of those apps returns **one person's** numbers.

```
                      ┌──────────────────────── TODAY ────────────────────────┐
  Browser ── /api/aggregate ──▶ r2-fit.vercel.app/api/summary   (your data)
                            ├──▶ r2-school.vercel.app/api/summary (your data)
                            ├──▶ r2-finance.vercel.app/api/summary(your data)
                            └──▶ r2-build.vercel.app/api/summary  (your data)
```

Adding a login screen in front of this changes **who can see the page**, not
**whose data it is** — every visitor would still get your numbers. To make data
per-user, the data has to live somewhere R2·OS can scope by user. That's the
database below.

---

## 2. Target architecture

```
                      ┌──────────────────────── TARGET ───────────────────────┐
  Browser ──▶ Next.js middleware (refresh session, gate routes)
                │
                ├── not signed in ──▶ /login · /signup
                │
                └── signed in ──▶ app pages ──▶ /api/summary
                                                     │
                                                     ▼
                                    Supabase Postgres (RLS: user_id = auth.uid())
                                    profiles · workouts · assignments
                                    transactions · budgets · build_events
```

- **Supabase Auth** issues a session (JWT) stored in cookies.
- **Next.js middleware** refreshes that session on every request and redirects
  unauthenticated users to `/login`.
- Every table has **RLS** so the database itself refuses to return another
  user's rows — isolation is enforced at the data layer, not just in app code.
- `/api/summary` computes the same response shape the UI already consumes, but
  from the **signed-in user's** rows. The old federated `/api/aggregate` and the
  sub-app pings are removed.

---

## 3. Data model

`profiles.id` is the same UUID as `auth.users.id` (1:1). Everything else hangs
off `user_id`. Metrics shown on the tiles are **derived** from these rows, not
stored as free text — so the numbers are real and update as the user logs data.

```sql
-- 0001_init.sql (Supabase migration)

-- Profile: one row per auth user, auto-created on signup (trigger below).
create table public.profiles (
  id                uuid primary key references auth.users(id) on delete cascade,
  name              text,
  location          text,
  timezone          text default 'UTC',
  bible_translation text default 'ESV',
  created_at        timestamptz not null default now()
);

-- FIT: one row per workout → derive streak + calories today.
create table public.workouts (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  occurred_at  timestamptz not null default now(),
  type         text,                         -- 'legs', 'pull', 'run', ...
  calories     int  not null default 0,
  duration_min int  not null default 0,
  note         text
);

-- SCHOOL (GMBA): one row per assignment → derive "N deadlines this week".
create table public.assignments (
  id        uuid primary key default gen_random_uuid(),
  user_id   uuid not null references auth.users(id) on delete cascade,
  title     text not null,
  course    text,
  due_at    timestamptz,
  status    text not null default 'open',    -- 'open' | 'done'
  created_at timestamptz not null default now()
);

-- FINANCE: transactions + monthly budget → derive "left this month".
create table public.transactions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  occurred_at timestamptz not null default now(),
  amount      numeric(14,2) not null,        -- negative = spend, positive = income
  category    text,
  note        text
);
create table public.budgets (
  user_id  uuid not null references auth.users(id) on delete cascade,
  month    date not null,                    -- first of month
  limit_amount numeric(14,2) not null,
  primary key (user_id, month)
);

-- BUILD: commits / shipped tasks → derive "commits today" / "tasks pending".
create table public.build_events (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  occurred_at timestamptz not null default now(),
  kind        text not null default 'commit',-- 'commit' | 'task'
  message     text,
  status      text                           -- for tasks: 'pending' | 'done'
);
```

### Row-Level Security (applied to every table)

```sql
alter table public.profiles      enable row level security;
alter table public.workouts      enable row level security;
alter table public.assignments   enable row level security;
alter table public.transactions  enable row level security;
alter table public.budgets       enable row level security;
alter table public.build_events  enable row level security;

-- Pattern repeated per table (profiles keyed on id, others on user_id):
create policy "own rows - select" on public.workouts
  for select using (auth.uid() = user_id);
create policy "own rows - write"  on public.workouts
  for all    using (auth.uid() = user_id) with check (auth.uid() = user_id);
```

### Auto-create profile on signup

```sql
create function public.handle_new_user() returns trigger
  language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, name) values (new.id, new.raw_user_meta_data->>'name');
  return new;
end $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
```

---

## 4. Auth flow (email + password)

1. **Sign up** (`/signup`): email + password + name → `supabase.auth.signUp`.
   Supabase sends a confirmation email; the link hits `/auth/confirm`, which
   exchanges the token and drops the user into the app.
2. **Log in** (`/login`): `supabase.auth.signInWithPassword`.
3. **Session**: stored in cookies via `@supabase/ssr`. `middleware.ts` refreshes
   it on every request so server components and route handlers see a valid user.
4. **Gate**: middleware redirects unauthenticated requests to `/login` for all
   routes except `/login`, `/signup`, `/auth/*`, and static assets.
5. **Sign out**: `supabase.auth.signOut()` from Settings.

Password reset (`/forgot-password` → email → `/auth/reset`) is a fast follow.

---

## 5. Code structure (new + changed files)

```
lib/supabase/
  client.ts            NEW  browser client (createBrowserClient)
  server.ts            NEW  server client bound to cookies (createServerClient)
  middleware.ts        NEW  session-refresh helper
middleware.ts          NEW  route protection (calls the helper)
app/login/page.tsx     NEW
app/signup/page.tsx    NEW
app/auth/confirm/route.ts   NEW  email-confirmation handler
app/api/summary/route.ts    NEW  per-user aggregate (replaces /api/aggregate)
supabase/migrations/0001_init.sql   NEW  schema + RLS + trigger
lib/useOSData.ts       EDIT  fetch /api/summary; drop sub-app pings
app/settings/page.tsx  EDIT  show real profile from `profiles`; add Sign out
app/api/aggregate/route.ts  REMOVE (superseded)
lib/apps.ts            KEEP  ids/urls become nav/labels, not data sources
```

The **visual redesign already shipped stays as-is** — tiles, brief, apps, and
nav don't change. Only their data source moves from "federated fetch" to
"the signed-in user's rows."

---

## 6. Rollout in phases

**Phase 1 — Auth + isolation (unblocks sharing).**
Supabase project, `@supabase/ssr` + `@supabase/supabase-js`, the migration
above, browser/server clients, middleware, `/login` + `/signup` + `/auth/confirm`,
and `/api/summary` returning the current user's derived metrics (empty/zero for
new users). Settings shows the real profile + Sign out. After this, every person
who signs up gets their own isolated (initially empty) R2·OS.

**Phase 2 — Data entry.**
Lightweight "add" screens/sheets so users actually log workouts, assignments,
transactions, and build events — which is what makes the tile metrics move.
Without this, Phase 1 users see zeros.

**Phase 3 — Polish.**
Password reset, optional Google sign-in later, seed/demo data for new accounts,
per-user Bible translation + profile editing, and (optional) importing your
existing personal data as the first account.

---

## 7. Environment & setup (what you provide once)

1. Create a project at supabase.com (free tier is fine).
2. Run `supabase/migrations/0001_init.sql` in the Supabase SQL editor.
3. In Auth → Providers, keep **Email** enabled (email confirmations on).
4. Add to Vercel + local `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon public key>
```

The anon key is safe to expose — RLS is what protects data, and it only ever
returns the caller's own rows. No service-role key ships to the browser.

---

## 8. Open questions for Phase 2+

- Should the tile metrics match today's exact wording (e.g. "12-day streak",
  "Rp 2.4M left this month"), and in what currency/timezone per user?
- Do you want to import your current personal data as the first seeded account?
- Add Google sign-in later for even lower friction, or stay email+password only?
