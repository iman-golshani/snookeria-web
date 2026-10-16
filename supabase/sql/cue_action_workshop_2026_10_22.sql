-- Run once in the CMS Supabase SQL Editor before enabling workshop registration.
create table if not exists public.cue_action_workshop_registrations(
 id uuid primary key default gen_random_uuid(),
 full_name text not null check(char_length(full_name) between 2 and 100),
 phone text not null,
 experience text not null,
 status text not null default 'pending' check(status in ('pending','confirmed','cancelled')),
 created_at timestamptz not null default now(),
 unique(phone)
);
create index if not exists cue_action_workshop_status_idx on public.cue_action_workshop_registrations(status);
alter table public.cue_action_workshop_registrations enable row level security;
drop policy if exists "Admin read workshop registrations" on public.cue_action_workshop_registrations;
create policy "Admin read workshop registrations" on public.cue_action_workshop_registrations for select to authenticated using (true);
drop policy if exists "Admin update workshop registrations" on public.cue_action_workshop_registrations;
create policy "Admin update workshop registrations" on public.cue_action_workshop_registrations for update to authenticated using (true) with check(true);
create or replace function public.register_cue_action_workshop(p_full_name text,p_phone text,p_experience text)
returns text language plpgsql security definer set search_path=public as $$
declare v_phone text;v_count int;
begin
 v_phone:=translate(trim(p_phone),'۰۱۲۳۴۵۶۷۸۹٠١٢٣٤٥٦٧٨٩','01234567890123456789');
 if length(trim(p_full_name))<2 or length(trim(p_full_name))>100 or length(trim(p_experience))<1 or length(trim(p_experience))>120 or v_phone !~ '^09[0-9]{9}$' then return 'invalid';end if;
 -- Workshop starts October 22, 2026 at 12:00 Tehran time.
 if now() >= '2026-10-22 12:00:00+03:30'::timestamptz then return 'closed';end if;
 perform pg_advisory_xact_lock(20261022);
 if exists(select 1 from public.cue_action_workshop_registrations where phone=v_phone) then return 'duplicate';end if;
 select count(*) into v_count from public.cue_action_workshop_registrations where status <> 'cancelled';
 if v_count>=8 then return 'full';end if;
 insert into public.cue_action_workshop_registrations(full_name,phone,experience) values(trim(p_full_name),v_phone,trim(p_experience));
 return 'registered';
end;$$;
revoke all on function public.register_cue_action_workshop(text,text,text) from public;
grant execute on function public.register_cue_action_workshop(text,text,text) to anon,authenticated;
