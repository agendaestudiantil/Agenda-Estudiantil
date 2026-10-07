-- =============================================================================
-- Agenda Estudiantil — Supabase PostgreSQL schema
-- =============================================================================
-- Run this entire file in the Supabase dashboard SQL Editor (see supabase/README.md).
-- Column names use snake_case and match the TypeScript interfaces in
-- src/types/index.ts exactly.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Extensions
-- -----------------------------------------------------------------------------
-- gen_random_uuid() is provided by pgcrypto (available by default on Supabase).
create extension if not exists pgcrypto;

-- =============================================================================
-- Tables
-- =============================================================================

-- -----------------------------------------------------------------------------
-- profiles — one row per auth user (mirrors UserProfile)
-- -----------------------------------------------------------------------------
create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  name        text        not null default '',
  email       text,
  avatar_url  text,
  role        text        not null default 'Estudiante',
  points      int         not null default 0,
  streak      int         not null default 0,
  created_at  timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- tasks (mirrors Task)
-- -----------------------------------------------------------------------------
create table if not exists public.tasks (
  id                   uuid primary key default gen_random_uuid(),
  user_id              uuid        not null references public.profiles (id) on delete cascade,
  title                text        not null,
  description          text        default '',
  subject              text        default '',
  priority             text        not null check (priority in ('urgente', 'importante', 'tiempo')),
  status               text        not null check (status in ('pendiente', 'en_progreso', 'completada')),
  due_date             date,
  completed_at         timestamptz,
  reminder_days_before int         not null default 2,
  created_at           timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- events (mirrors Event)
-- -----------------------------------------------------------------------------
create table if not exists public.events (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid        not null references public.profiles (id) on delete cascade,
  title       text        not null,
  description text        default '',
  date        date,
  time        text,
  color       text,
  created_at  timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- notes (mirrors Note)
-- -----------------------------------------------------------------------------
create table if not exists public.notes (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid        not null references public.profiles (id) on delete cascade,
  title       text        default '',
  content     text        default '',
  created_at  timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- goals (mirrors Goal)
-- -----------------------------------------------------------------------------
create table if not exists public.goals (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid        not null references public.profiles (id) on delete cascade,
  title       text        not null,
  description text        default '',
  progress    int         not null default 0,
  completed   boolean     not null default false,
  target_date date,
  created_at  timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- reminders (mirrors Reminder)
-- -----------------------------------------------------------------------------
create table if not exists public.reminders (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid        not null references public.profiles (id) on delete cascade,
  task_id     uuid        references public.tasks (id) on delete set null,
  title       text        not null,
  message     text        default '',
  remind_at   timestamptz,
  active       boolean     not null default true,
  created_at  timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- messages (mirrors Message)
-- -----------------------------------------------------------------------------
create table if not exists public.messages (
  id          uuid primary key default gen_random_uuid(),
  sender_id   uuid        not null references public.profiles (id) on delete cascade,
  receiver_id uuid        not null references public.profiles (id) on delete cascade,
  content     text        default '',
  type        text        not null check (type in ('text', 'audio')),
  created_at  timestamptz not null default now()
);

-- =============================================================================
-- Row Level Security (RLS)
-- =============================================================================
-- Enable RLS on every table, then grant per-operation access to the
-- authenticated role so users only ever touch their own rows.

alter table public.profiles  enable row level security;
alter table public.tasks     enable row level security;
alter table public.events    enable row level security;
alter table public.notes     enable row level security;
alter table public.goals     enable row level security;
alter table public.reminders enable row level security;
alter table public.messages  enable row level security;

-- -----------------------------------------------------------------------------
-- profiles policies — a user owns the row whose id equals auth.uid()
-- -----------------------------------------------------------------------------
create policy "profiles_select_own" on public.profiles
  for select to authenticated using (id = auth.uid());
create policy "profiles_insert_own" on public.profiles
  for insert to authenticated with check (id = auth.uid());
create policy "profiles_update_own" on public.profiles
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
create policy "profiles_delete_own" on public.profiles
  for delete to authenticated using (id = auth.uid());

-- -----------------------------------------------------------------------------
-- tasks policies — ownership via user_id
-- -----------------------------------------------------------------------------
create policy "tasks_select_own" on public.tasks
  for select to authenticated using (user_id = auth.uid());
create policy "tasks_insert_own" on public.tasks
  for insert to authenticated with check (user_id = auth.uid());
create policy "tasks_update_own" on public.tasks
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "tasks_delete_own" on public.tasks
  for delete to authenticated using (user_id = auth.uid());

-- -----------------------------------------------------------------------------
-- events policies — ownership via user_id
-- -----------------------------------------------------------------------------
create policy "events_select_own" on public.events
  for select to authenticated using (user_id = auth.uid());
create policy "events_insert_own" on public.events
  for insert to authenticated with check (user_id = auth.uid());
create policy "events_update_own" on public.events
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "events_delete_own" on public.events
  for delete to authenticated using (user_id = auth.uid());

-- -----------------------------------------------------------------------------
-- notes policies — ownership via user_id
-- -----------------------------------------------------------------------------
create policy "notes_select_own" on public.notes
  for select to authenticated using (user_id = auth.uid());
create policy "notes_insert_own" on public.notes
  for insert to authenticated with check (user_id = auth.uid());
create policy "notes_update_own" on public.notes
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "notes_delete_own" on public.notes
  for delete to authenticated using (user_id = auth.uid());

-- -----------------------------------------------------------------------------
-- goals policies — ownership via user_id
-- -----------------------------------------------------------------------------
create policy "goals_select_own" on public.goals
  for select to authenticated using (user_id = auth.uid());
create policy "goals_insert_own" on public.goals
  for insert to authenticated with check (user_id = auth.uid());
create policy "goals_update_own" on public.goals
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "goals_delete_own" on public.goals
  for delete to authenticated using (user_id = auth.uid());

-- -----------------------------------------------------------------------------
-- reminders policies — ownership via user_id
-- -----------------------------------------------------------------------------
create policy "reminders_select_own" on public.reminders
  for select to authenticated using (user_id = auth.uid());
create policy "reminders_insert_own" on public.reminders
  for insert to authenticated with check (user_id = auth.uid());
create policy "reminders_update_own" on public.reminders
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "reminders_delete_own" on public.reminders
  for delete to authenticated using (user_id = auth.uid());

-- -----------------------------------------------------------------------------
-- messages policies — participants can read; only the sender can write
-- -----------------------------------------------------------------------------
create policy "messages_select_participant" on public.messages
  for select to authenticated using (sender_id = auth.uid() or receiver_id = auth.uid());
create policy "messages_insert_sender" on public.messages
  for insert to authenticated with check (sender_id = auth.uid());
create policy "messages_update_sender" on public.messages
  for update to authenticated using (sender_id = auth.uid()) with check (sender_id = auth.uid());
create policy "messages_delete_sender" on public.messages
  for delete to authenticated using (sender_id = auth.uid());

-- =============================================================================
-- Auto-provision a profiles row on signup
-- =============================================================================
-- When a new auth.users row is created, insert the matching profiles row using
-- the name from signup metadata and the account email.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', ''),
    new.email
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
