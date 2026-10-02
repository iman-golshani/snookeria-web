-- Run once in the snookeria-web-cms SQL editor.
create table if not exists public.post_media (
 id uuid primary key default gen_random_uuid(),
 post_id uuid not null references public.posts(id) on delete cascade,
 media_url text not null,
 media_type text not null default 'image' check (media_type in ('image','video')),
 alt_text text,
 sort_order integer not null default 0,
 created_at timestamptz not null default now()
);
create index if not exists post_media_post_order_idx on public.post_media(post_id,sort_order);
alter table public.post_media enable row level security;
create policy "Anyone can read published post media" on public.post_media
 for select to anon,authenticated using (
 exists (select 1 from public.posts p where p.id=post_id and p.status='published')
 );
create policy "CMS admins manage post media" on public.post_media
 for all to authenticated using (true) with check (true);
