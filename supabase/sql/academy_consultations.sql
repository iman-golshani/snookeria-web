-- Run once in Snookeria CMS Supabase SQL Editor
create table if not exists public.academy_consultations (
 id bigint generated always as identity primary key,
 full_name text not null check (char_length(trim(full_name)) between 2 and 100),
 phone text not null check (phone ~ '^09[0-9]{9}$'),
 skill_level text not null check (skill_level in ('beginner','intermediate','advanced')),
 experience text not null default '',
 goal text not null check (goal in ('learning','technique','competition','other')),
 notes text not null default '',
 status text not null default 'new' check (status in ('new','contacted','scheduled','enrolled','closed')),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create index if not exists academy_consultations_created_idx on public.academy_consultations(created_at desc);
alter table public.academy_consultations enable row level security;
revoke all on public.academy_consultations from anon,authenticated;
grant select,update on public.academy_consultations to authenticated;
create policy "academy consultations staff read" on public.academy_consultations for select to authenticated using (true);
create policy "academy consultations staff update" on public.academy_consultations for update to authenticated using (true) with check (true);
create or replace function public.submit_academy_consultation(p_name text,p_phone text,p_level text,p_experience text,p_goal text,p_notes text)
returns void language plpgsql security definer set search_path=public as $$
declare v_phone text;
begin
 v_phone:=translate(coalesce(p_phone,''),'۰۱۲۳۴۵۶۷۸۹٠١٢٣٤٥٦٧٨٩','01234567890123456789');
 if char_length(trim(coalesce(p_name,''))) not between 2 and 100 or v_phone !~ '^09[0-9]{9}$'
 or p_level not in ('beginner','intermediate','advanced') or p_goal not in ('learning','technique','competition','other')
 or char_length(coalesce(p_experience,''))>80 or char_length(coalesce(p_notes,''))>1000 then
 raise exception 'Invalid consultation request';
 end if;
 if exists(select 1 from public.academy_consultations where phone=v_phone and created_at>now()-interval '5 minutes') then
 raise exception 'Please wait before submitting again';
 end if;
 insert into public.academy_consultations(full_name,phone,skill_level,experience,goal,notes)
 values(trim(p_name),v_phone,p_level,left(trim(coalesce(p_experience,'')),80),p_goal,left(trim(coalesce(p_notes,'')),1000));
end $$;
revoke all on function public.submit_academy_consultation(text,text,text,text,text,text) from public;
grant execute on function public.submit_academy_consultation(text,text,text,text,text,text) to anon,authenticated;
