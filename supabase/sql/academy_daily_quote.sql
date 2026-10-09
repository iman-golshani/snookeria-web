-- Run once in the Snookeria CMS Supabase SQL Editor
create table if not exists public.academy_daily_quote (
  id integer primary key default 1 check (id = 1),
  quote text not null default '',
  author text not null default '',
  is_active boolean not null default false,
  updated_at timestamptz not null default now()
);
alter table public.academy_daily_quote enable row level security;
drop policy if exists "Public can read active academy quote" on public.academy_daily_quote;
create policy "Public can read active academy quote" on public.academy_daily_quote
for select to anon using (is_active = true);
drop policy if exists "Authenticated can manage academy quote" on public.academy_daily_quote;
create policy "Authenticated can manage academy quote" on public.academy_daily_quote
for all to authenticated using (true) with check (true);
insert into public.academy_daily_quote(id) values (1) on conflict (id) do nothing;
