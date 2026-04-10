-- Supabase SQL: profiles + trigger. Run in Dashboard → SQL.
--
-- New project: run the whole file once.
-- If `profiles` already exists with a different shape, drop it in development only:
--   drop trigger if exists on_auth_user_created on auth.users;
--   drop function if exists public.handle_new_user();
--   drop table if exists public.profiles cascade;
-- then run this file again.

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null,
  email text not null,
  phone text not null,
  gender text not null,
  birthday date not null,
  created_at timestamptz not null default now(),
  constraint profiles_gender_check check (
    gender in ('female', 'male', 'other', 'prefer_not_to_say')
  )
);

alter table public.profiles enable row level security;

drop policy if exists "Users can read own profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;

create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Inserts one row per auth user from signUp(..., { data: { full_name, phone, gender, birthday } })
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  meta jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
begin
  insert into public.profiles (id, email, full_name, phone, gender, birthday)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(meta->>'full_name', ''),
    coalesce(meta->>'phone', ''),
    coalesce(meta->>'gender', ''),
    (meta->>'birthday')::date
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─────────────────────────────────────────────
-- ActiveTogether: sports, events, participations tables
-- Run this section after the profiles section above.
-- ─────────────────────────────────────────────

create table if not exists public.sports (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  type        text not null,
  max_players int  not null,
  constraint sports_type_check check (type in ('team', 'individual', 'outdoor'))
);

-- Seed common sports (safe to run multiple times)
insert into public.sports (name, type, max_players) values
  ('Football',   'team',       22),
  ('Basketball', 'team',       10),
  ('Handball',   'team',       14),
  ('Volleyball', 'team',       12),
  ('Tennis',     'individual',  4),
  ('Padel',      'individual',  4),
  ('Running',    'individual', 50),
  ('Hiking',     'outdoor',    30)
on conflict do nothing;

create table if not exists public.events (
  id               uuid        primary key default gen_random_uuid(),
  name             text        not null,
  type             text        not null default 'sport',
  sport_id         uuid        references public.sports(id),
  location_name    text        not null,
  location_url     text,
  description      text        not null,
  gender           text        not null default 'mixed',
  price            int         not null default 0,
  max_participants int,
  created_by       uuid        not null references auth.users(id) on delete cascade,
  created_at       timestamptz not null default now(),
  constraint events_type_check   check (type   in ('sport', 'hike')),
  constraint events_gender_check check (gender in ('male', 'female', 'mixed'))
);

-- If the table already exists, add the column (safe to run multiple times)
alter table public.events add column if not exists max_participants int;

alter table public.events enable row level security;

drop policy if exists "Anyone can read events"               on public.events;
drop policy if exists "Authenticated users can create events" on public.events;
drop policy if exists "Creators can update events"           on public.events;
drop policy if exists "Creators can delete events"           on public.events;

create policy "Anyone can read events"
  on public.events for select using (true);

create policy "Authenticated users can create events"
  on public.events for insert
  with check (auth.uid() = created_by);

create policy "Creators can update events"
  on public.events for update
  using (auth.uid() = created_by);

create policy "Creators can delete events"
  on public.events for delete
  using (auth.uid() = created_by);

create table if not exists public.participations (
  id         uuid        primary key default gen_random_uuid(),
  event_id   uuid        not null references public.events(id) on delete cascade,
  user_id    uuid        not null references auth.users(id)    on delete cascade,
  full_name  text        not null,
  phone      text        not null,
  message    text,
  created_at timestamptz not null default now(),
  unique (event_id, user_id)
);

alter table public.participations enable row level security;

drop policy if exists "Anyone can read participations" on public.participations;
drop policy if exists "Users can join events"          on public.participations;
drop policy if exists "Users can cancel participation" on public.participations;

create policy "Anyone can read participations"
  on public.participations for select using (true);

create policy "Users can join events"
  on public.participations for insert
  with check (auth.uid() = user_id);

create policy "Users can cancel participation"
  on public.participations for delete
  using (auth.uid() = user_id);
