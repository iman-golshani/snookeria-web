-- Snookeria private analytics. Run in CMS Supabase SQL Editor.
create table if not exists public.site_analytics_visitors (
 visitor_id uuid primary key,
 first_seen timestamptz not null default now(),
 last_seen timestamptz not null default now(),
 last_path text not null default '/',
 device text not null default 'desktop'
);
create table if not exists public.site_analytics_views (
 id bigint generated always as identity primary key,
 visitor_id uuid not null,
 path text not null,
 device text not null,
 referrer text,
 created_at timestamptz not null default now()
);
create index if not exists site_analytics_views_time on public.site_analytics_views(created_at desc);
create index if not exists site_analytics_views_path on public.site_analytics_views(path,created_at desc);
create index if not exists site_analytics_visitors_online on public.site_analytics_visitors(last_seen desc);
alter table public.site_analytics_visitors enable row level security;
alter table public.site_analytics_views enable row level security;
revoke all on public.site_analytics_visitors from anon, authenticated;
revoke all on public.site_analytics_views from anon, authenticated;
create or replace function public.site_analytics_track(p_visitor uuid,p_path text,p_device text,p_referrer text default null,p_view boolean default true)
returns void language plpgsql security definer set search_path=public as $$
declare v_path text;v_device text;
begin
 if p_visitor is null or length(coalesce(p_path,''))>300 or length(coalesce(p_referrer,''))>200 then return; end if;
 v_path:=split_part(split_part(coalesce(p_path,'/'),'?',1),'#',1);
 if left(v_path,1)<>'/' then return; end if;
 if v_path like '/admin%' or v_path like '/api%' then return; end if;
 v_device:=case when p_device in ('mobile','tablet','desktop') then p_device else 'desktop' end;
 insert into public.site_analytics_visitors(visitor_id,last_seen,last_path,device)
 values(p_visitor,now(),v_path,v_device)
 on conflict(visitor_id) do update set last_seen=now(),last_path=excluded.last_path,device=excluded.device;
 if p_view and not exists (
  select 1 from public.site_analytics_views where visitor_id=p_visitor and path=v_path and created_at>now()-interval '5 seconds'
 ) then
  insert into public.site_analytics_views(visitor_id,path,device,referrer) values(p_visitor,v_path,v_device,left(p_referrer,200));
 end if;
end $$;
revoke all on function public.site_analytics_track(uuid,text,text,text,boolean) from public;
grant execute on function public.site_analytics_track(uuid,text,text,text,boolean) to anon,authenticated;
create or replace function public.site_analytics_report(p_days integer default 7)
returns jsonb language plpgsql stable security definer set search_path=public as $$
declare v_start timestamptz;v_result jsonb;
begin
 if auth.uid() is null then raise exception 'Not authorized'; end if;
 v_start:=now()-make_interval(days=>least(greatest(coalesce(p_days,7),1),90));
 select jsonb_build_object(
 'online',(select count(*) from public.site_analytics_visitors where last_seen>=now()-interval '30 seconds'),
 'today_views',(select count(*) from public.site_analytics_views where created_at>=date_trunc('day',now() at time zone 'Asia/Tehran') at time zone 'Asia/Tehran'),
 'today_visitors',(select count(distinct visitor_id) from public.site_analytics_views where created_at>=date_trunc('day',now() at time zone 'Asia/Tehran') at time zone 'Asia/Tehran'),
 'period_views',(select count(*) from public.site_analytics_views where created_at>=v_start),
 'period_visitors',(select count(distinct visitor_id) from public.site_analytics_views where created_at>=v_start),
 'all_views',(select count(*) from public.site_analytics_views),
 'all_visitors',(select count(*) from public.site_analytics_visitors),
 'daily',(select coalesce(jsonb_agg(jsonb_build_object('day',d.day,'views',d.views,'visitors',d.visitors) order by d.day),'[]'::jsonb) from (select (created_at at time zone 'Asia/Tehran')::date as day,count(*) as views,count(distinct visitor_id) as visitors from public.site_analytics_views where created_at>=v_start group by 1) d),
 'top_pages',(select coalesce(jsonb_agg(jsonb_build_object('path',path,'views',views,'visitors',visitors) order by views desc),'[]'::jsonb) from (select path,count(*) views,count(distinct visitor_id) visitors from public.site_analytics_views where created_at>=v_start group by path order by views desc limit 12) p),
 'devices',(select coalesce(jsonb_agg(jsonb_build_object('device',device,'views',views) order by views desc),'[]'::jsonb) from (select device,count(*) views from public.site_analytics_views where created_at>=v_start group by device) t),
 'referrers',(select coalesce(jsonb_agg(jsonb_build_object('referrer',referrer,'views',views) order by views desc),'[]'::jsonb) from (select coalesce(nullif(referrer,''),'مستقیم / نامشخص') referrer,count(*) views from public.site_analytics_views where created_at>=v_start group by 1 order by views desc limit 8) r)
 ) into v_result;
 return v_result;
end $$;
revoke all on function public.site_analytics_report(integer) from public;
grant execute on function public.site_analytics_report(integer) to authenticated;
