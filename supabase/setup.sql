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
