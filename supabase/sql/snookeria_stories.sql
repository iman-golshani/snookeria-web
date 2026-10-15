-- Run once in the CMS Supabase SQL Editor.
create table if not exists public.snookeria_stories (
 id uuid primary key default gen_random_uuid(),
 media_url text, media_type text not null default 'text' check(media_type in ('text','image','video')),
 title text not null default '', body text not null default '',
 background text not null default '#17253a', link_url text,
 duration_seconds integer not null default 5 check(duration_seconds between 3 and 60),
 status text not null default 'draft' check(status in ('draft','published')),
 published_at timestamptz, expires_at timestamptz,
 sort_order integer not null default 0,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 constraint story_media_valid check(media_type='text' or nullif(media_url,'') is not null)
);
create table if not exists public.snookeria_highlights (
 id uuid primary key default gen_random_uuid(),
 title text not null, cover_url text, sort_order integer not null default 0,
 is_active boolean not null default true, created_at timestamptz not null default now()
);
create table if not exists public.snookeria_highlight_stories (
 highlight_id uuid not null references public.snookeria_highlights(id) on delete cascade,
 story_id uuid not null references public.snookeria_stories(id) on delete cascade,
 sort_order integer not null default 0,
 primary key(highlight_id,story_id)
);
create index if not exists snookeria_stories_live_idx on public.snookeria_stories(status,expires_at,published_at);
alter table public.snookeria_stories enable row level security;
alter table public.snookeria_highlights enable row level security;
alter table public.snookeria_highlight_stories enable row level security;
create policy "Public sees live stories and highlighted stories" on public.snookeria_stories for select to anon using (
 (status='published' and published_at<=now() and expires_at>now())
 or (status='published' and exists(select 1 from public.snookeria_highlight_stories hs join public.snookeria_highlights h on h.id=hs.highlight_id where hs.story_id=id and h.is_active))
);
create policy "Editors manage stories" on public.snookeria_stories for all to authenticated using(true) with check(true);
create policy "Public sees highlights" on public.snookeria_highlights for select to anon using(is_active);
create policy "Editors manage highlights" on public.snookeria_highlights for all to authenticated using(true) with check(true);
create policy "Public sees highlight contents" on public.snookeria_highlight_stories for select to anon using(exists(select 1 from public.snookeria_highlights h where h.id=highlight_id and h.is_active));
create policy "Editors manage highlight contents" on public.snookeria_highlight_stories for all to authenticated using(true) with check(true);
-- Existing public cms-media bucket is used for story uploads. Its existing storage upload policies apply.
