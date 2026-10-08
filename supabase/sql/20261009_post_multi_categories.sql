-- Run in Snookeria CMS Supabase SQL Editor BEFORE deploying multi-category UI.
insert into public.post_categories(slug,name,sort_order,is_active)
values ('snookeria','اسنوکریا',0,true)
on conflict (slug) do update set name='اسنوکریا',is_active=true;
create table if not exists public.post_category_links (
 post_id uuid not null references public.posts(id) on delete cascade,
 category_slug text not null references public.post_categories(slug) on delete cascade,
 primary key(post_id,category_slug)
);
create index if not exists idx_post_category_links_slug on public.post_category_links(category_slug,post_id);
insert into public.post_category_links(post_id,category_slug)
select id,'snookeria' from public.posts on conflict do nothing;
insert into public.post_category_links(post_id,category_slug)
select p.id,p.category from public.posts p join public.post_categories c on c.slug=p.category
where p.category<>'snookeria' on conflict do nothing;
alter table public.post_category_links enable row level security;
drop policy if exists "Read published post category links" on public.post_category_links;
create policy "Read published post category links" on public.post_category_links for select to anon,authenticated
using (exists(select 1 from public.posts p where p.id=post_id and p.status='published'));
drop policy if exists "Editors read category links" on public.post_category_links;
create policy "Editors read category links" on public.post_category_links for select to authenticated using (true);
drop policy if exists "Editors insert category links" on public.post_category_links;
create policy "Editors insert category links" on public.post_category_links for insert to authenticated with check (true);
drop policy if exists "Editors delete category links" on public.post_category_links;
create policy "Editors delete category links" on public.post_category_links for delete to authenticated using (true);
-- Every new post automatically belongs to Snookeria, even if inserted elsewhere.
create or replace function public.snookeria_default_category() returns trigger language plpgsql security definer set search_path=public as $$
begin
 insert into public.post_category_links(post_id,category_slug) values(new.id,'snookeria') on conflict do nothing;
 return new;
end $$;
drop trigger if exists snookeria_default_category_trigger on public.posts;
create trigger snookeria_default_category_trigger after insert on public.posts for each row execute function public.snookeria_default_category();
-- Protect the universal category against accidental deletion.
create or replace function public.prevent_snookeria_category_delete() returns trigger language plpgsql as $$
begin
 if old.slug='snookeria' then raise exception 'The Snookeria category cannot be deleted'; end if;
 return old;
end $$;
drop trigger if exists prevent_snookeria_category_delete_trigger on public.post_categories;
create trigger prevent_snookeria_category_delete_trigger before delete on public.post_categories for each row execute function public.prevent_snookeria_category_delete();
