-- Snookeria CMS - post SEO foundation
alter table public.posts
  add column if not exists seo_title text,
  add column if not exists seo_description text,
  add column if not exists focus_keyword text,
  add column if not exists seo_keywords text[] not null default '{}'::text[],
  add column if not exists canonical_url text,
  add column if not exists og_title text,
  add column if not exists og_description text,
  add column if not exists og_image_url text,
  add column if not exists robots_index boolean not null default true,
  add column if not exists robots_follow boolean not null default true,
  add column if not exists schema_type text not null default 'Article'
    check (schema_type in ('Article','NewsArticle','BlogPosting','VideoObject')),
  add column if not exists author_name text not null default 'ایمان گلشنی';

create index if not exists posts_slug_idx on public.posts(slug);
create index if not exists posts_category_status_idx on public.posts(category, status);
