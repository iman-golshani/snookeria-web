-- Snookeria CMS categories. Run once in the CMS Supabase SQL Editor.
create table if not exists public.post_categories (
  slug text primary key,
  name text not null,
  image_url text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  constraint post_categories_slug_format check (slug ~ '^[a-z0-9][a-z0-9_-]*$')
);
insert into public.post_categories(slug,name,sort_order)
values ('article','مقاله',10),('story','داستان',20),('news','خبر',30),('video','ویدئو',40),('147','۱۴۷',50)
on conflict (slug) do nothing;
insert into public.post_categories(slug,name,sort_order)
select distinct p.category, p.category, 100
from public.posts p
where p.category is not null and p.category ~ '^[a-z0-9][a-z0-9_-]*$'
on conflict (slug) do nothing;
alter table public.post_categories enable row level security;
drop policy if exists "Public can read active post categories" on public.post_categories;
create policy "Public can read active post categories" on public.post_categories for select to anon,authenticated using (is_active);
drop policy if exists "Authenticated editors can read all post categories" on public.post_categories;
create policy "Authenticated editors can read all post categories" on public.post_categories for select to authenticated using (true);
drop policy if exists "Authenticated editors can insert post categories" on public.post_categories;
create policy "Authenticated editors can insert post categories" on public.post_categories for insert to authenticated with check (true);
drop policy if exists "Authenticated editors can update post categories" on public.post_categories;
create policy "Authenticated editors can update post categories" on public.post_categories for update to authenticated using (true) with check (true);
create index if not exists idx_posts_category on public.posts(category);
