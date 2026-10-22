-- IMPORTANT: Run in snookeria-web-cms only, after replacing the admin email below.
-- The Academy now allows public Phone OTP. Authenticated != CMS administrator.
-- This migration protects all known CMS tables, media writes and reels.
-- Keep your existing CMS admin signed in; identify the admin email in Auth > Users.
begin;

create table if not exists public.cms_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.cms_admins enable row level security;
revoke all on public.cms_admins from anon, authenticated;
-- IMPORTANT: replace with the existing CMS admin's exact login email before running:
insert into public.cms_admins(user_id)
select id from auth.users where lower(email) = lower('REPLACE_WITH_CMS_ADMIN_EMAIL')
on conflict do nothing;

do $$
begin
 if not exists (select 1 from public.cms_admins) then
  raise exception 'No CMS admin allowlisted: replace REPLACE_WITH_CMS_ADMIN_EMAIL with the existing admin login email.';
 end if;
end $$;

create or replace function public.is_cms_admin()
returns boolean language sql stable security definer
set search_path = ''
as $fn$
 select exists(select 1 from public.cms_admins a where a.user_id = (select auth.uid()));
$fn$;
revoke all on function public.is_cms_admin() from public;
grant execute on function public.is_cms_admin() to authenticated;

-- Posts and editorial content
drop policy if exists "admin manage posts" on public.posts;
create policy "cms editors manage posts" on public.posts for all to authenticated using(public.is_cms_admin()) with check(public.is_cms_admin());
drop policy if exists "admin manage site settings" on public.site_settings;
create policy "cms editors manage site settings" on public.site_settings for all to authenticated using(public.is_cms_admin()) with check(public.is_cms_admin());
drop policy if exists "admin manage snookeria says" on public.snookeria_says;
create policy "cms editors manage snookeria says" on public.snookeria_says for all to authenticated using(public.is_cms_admin()) with check(public.is_cms_admin());
drop policy if exists "admin manage shots" on public.shots_of_the_day;
create policy "cms editors manage shots" on public.shots_of_the_day for all to authenticated using(public.is_cms_admin()) with check(public.is_cms_admin());
drop policy if exists "admin manage workshops" on public.workshops;
create policy "cms editors manage workshops" on public.workshops for all to authenticated using(public.is_cms_admin()) with check(public.is_cms_admin());

drop policy if exists "admin read registrations" on public.workshop_registrations;
drop policy if exists "admin update registrations" on public.workshop_registrations;
drop policy if exists "admin delete registrations" on public.workshop_registrations;
create policy "cms editors read registrations" on public.workshop_registrations for select to authenticated using(public.is_cms_admin());
create policy "cms editors update registrations" on public.workshop_registrations for update to authenticated using(public.is_cms_admin()) with check(public.is_cms_admin());
create policy "cms editors delete registrations" on public.workshop_registrations for delete to authenticated using(public.is_cms_admin());

drop policy if exists "CMS admins manage post media" on public.post_media;
create policy "cms editors manage post media" on public.post_media for all to authenticated using(public.is_cms_admin()) with check(public.is_cms_admin());

drop policy if exists "Authenticated editors can read all post categories" on public.post_categories;
drop policy if exists "Authenticated editors can insert post categories" on public.post_categories;
drop policy if exists "Authenticated editors can update post categories" on public.post_categories;
create policy "cms editors read categories" on public.post_categories for select to authenticated using(public.is_cms_admin());
create policy "cms editors insert categories" on public.post_categories for insert to authenticated with check(public.is_cms_admin());
create policy "cms editors update categories" on public.post_categories for update to authenticated using(public.is_cms_admin()) with check(public.is_cms_admin());
-- Restrict any legacy delete grants/policies too:
drop policy if exists "Authenticated editors can delete post categories" on public.post_categories;
create policy "cms editors delete categories" on public.post_categories for delete to authenticated using(public.is_cms_admin());

drop policy if exists "Editors read category links" on public.post_category_links;
drop policy if exists "Editors insert category links" on public.post_category_links;
drop policy if exists "Editors delete category links" on public.post_category_links;
create policy "cms editors read category links" on public.post_category_links for select to authenticated using(public.is_cms_admin());
create policy "cms editors insert category links" on public.post_category_links for insert to authenticated with check(public.is_cms_admin());
create policy "cms editors delete category links" on public.post_category_links for delete to authenticated using(public.is_cms_admin());

drop policy if exists "Editors manage stories" on public.snookeria_stories;
drop policy if exists "Editors manage highlights" on public.snookeria_highlights;
drop policy if exists "Editors manage highlight contents" on public.snookeria_highlight_stories;
create policy "cms editors manage stories" on public.snookeria_stories for all to authenticated using(public.is_cms_admin()) with check(public.is_cms_admin());
create policy "cms editors manage highlights" on public.snookeria_highlights for all to authenticated using(public.is_cms_admin()) with check(public.is_cms_admin());
create policy "cms editors manage highlight contents" on public.snookeria_highlight_stories for all to authenticated using(public.is_cms_admin()) with check(public.is_cms_admin());
-- Signed-in academy members should still see public active stories.
drop policy if exists "Public sees live stories and highlighted stories" on public.snookeria_stories;
create policy "Public sees live stories and highlighted stories" on public.snookeria_stories
for select to anon,authenticated using (
 (status='published' and published_at<=now() and expires_at>now())
 or (status='published' and exists(
 select 1 from public.snookeria_highlight_stories hs
 join public.snookeria_highlights h on h.id=hs.highlight_id
 where hs.story_id=id and h.is_active))
);
drop policy if exists "Public sees highlights" on public.snookeria_highlights;
create policy "Public sees highlights" on public.snookeria_highlights for select to anon,authenticated using(is_active);
drop policy if exists "Public sees highlight contents" on public.snookeria_highlight_stories;
create policy "Public sees highlight contents" on public.snookeria_highlight_stories for select to anon,authenticated
using(exists(select 1 from public.snookeria_highlights h where h.id=highlight_id and h.is_active));

-- Members must never upload/update/delete CMS objects.
drop policy if exists "admin upload cms media" on storage.objects;
drop policy if exists "admin update cms media" on storage.objects;
drop policy if exists "admin delete cms media" on storage.objects;
create policy "cms editors upload media" on storage.objects for insert to authenticated with check(bucket_id='cms-media' and public.is_cms_admin());
create policy "cms editors update media" on storage.objects for update to authenticated using(bucket_id='cms-media' and public.is_cms_admin()) with check(bucket_id='cms-media' and public.is_cms_admin());
create policy "cms editors delete media" on storage.objects for delete to authenticated using(bucket_id='cms-media' and public.is_cms_admin());

-- Dedicated Reels table, never modify published posts to fake a reel.
create table if not exists public.snookeria_reels (
 id uuid primary key default gen_random_uuid(),
 title text not null check(length(trim(title)) between 1 and 130),
 caption text,
 video_url text not null check(length(trim(video_url))>0),
 cover_url text,
 status text not null default 'draft' check(status in ('draft','published')),
 published_at timestamptz,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create index if not exists snookeria_reels_feed_idx on public.snookeria_reels(status,published_at desc);
alter table public.snookeria_reels enable row level security;
create policy "public reads published reels" on public.snookeria_reels
for select to anon,authenticated using(status='published');
create policy "cms editors manage reels" on public.snookeria_reels
for all to authenticated using(public.is_cms_admin()) with check(public.is_cms_admin());
grant select,insert,update,delete on public.snookeria_reels to authenticated;
grant select on public.snookeria_reels to anon;

commit;
