-- Snookeria Web CMS
-- Run this migration in the dedicated Snookeria Web Supabase project.
-- Live/Tournament data intentionally stays in its own data sources.

create extension if not exists pgcrypto;

create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  body text,
  cover_image_url text,
  category text not null default 'article' check (category in ('article','story','news','video','147')),
  status text not null default 'draft' check (status in ('draft','published','archived')),
  is_featured boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.snookeria_says (
  id uuid primary key default gen_random_uuid(),
  text text not null,
  is_active boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.shots_of_the_day (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  image_url text,
  answer_text text,
  status text not null default 'draft' check (status in ('draft','published','archived')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.workshops (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text,
  cover_image_url text,
  starts_at timestamptz,
  ends_at timestamptz,
  location text,
  capacity integer check (capacity is null or capacity >= 0),
  registration_open boolean not null default false,
  status text not null default 'draft' check (status in ('draft','published','finished','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.workshop_registrations (
  id uuid primary key default gen_random_uuid(),
  workshop_id uuid not null references public.workshops(id) on delete cascade,
  full_name text not null,
  phone text not null,
  note text,
  status text not null default 'pending' check (status in ('pending','confirmed','cancelled')),
  created_at timestamptz not null default now()
);

create index if not exists posts_status_published_at_idx on public.posts(status, published_at desc);
create index if not exists shots_status_published_at_idx on public.shots_of_the_day(status, published_at desc);
create index if not exists workshops_status_starts_at_idx on public.workshops(status, starts_at);
create index if not exists workshop_registrations_workshop_idx on public.workshop_registrations(workshop_id, created_at desc);

alter table public.site_settings enable row level security;
alter table public.posts enable row level security;
alter table public.snookeria_says enable row level security;
alter table public.shots_of_the_day enable row level security;
alter table public.workshops enable row level security;
alter table public.workshop_registrations enable row level security;

-- Public site can only read content that is intended to be public.
create policy "public read published posts" on public.posts for select using (status = 'published');
create policy "public read active snookeria says" on public.snookeria_says for select using (is_active = true);
create policy "public read published shots" on public.shots_of_the_day for select using (status = 'published');
create policy "public read published workshops" on public.workshops for select using (status = 'published');

-- Workshop registration is intentionally allowed only for published workshops with registration enabled.
create policy "public register for open workshops" on public.workshop_registrations
for insert with check (
  exists (
    select 1 from public.workshops w
    where w.id = workshop_id
      and w.status = 'published'
      and w.registration_open = true
  )
);

-- Admin policies: any authenticated account in this dedicated CMS project is treated as an admin.
-- Keep Auth invite-only; do not enable public sign-up.
create policy "admin manage site settings" on public.site_settings for all to authenticated using (true) with check (true);
create policy "admin manage posts" on public.posts for all to authenticated using (true) with check (true);
create policy "admin manage snookeria says" on public.snookeria_says for all to authenticated using (true) with check (true);
create policy "admin manage shots" on public.shots_of_the_day for all to authenticated using (true) with check (true);
create policy "admin manage workshops" on public.workshops for all to authenticated using (true) with check (true);
create policy "admin read registrations" on public.workshop_registrations for select to authenticated using (true);
create policy "admin update registrations" on public.workshop_registrations for update to authenticated using (true) with check (true);
create policy "admin delete registrations" on public.workshop_registrations for delete to authenticated using (true);

-- Public site settings are deliberately not exposed yet. We will add explicit keys/policies when needed.
