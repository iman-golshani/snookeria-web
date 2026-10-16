create table if not exists public.academy_workshops(
 id uuid primary key default gen_random_uuid(),
 title text not null,
 slug text not null unique,
 description text not null default '',
 cover_url text,
 starts_at timestamptz not null,
 ends_at timestamptz not null,
 location text not null,
 capacity integer not null check(capacity between 1 and 500),
 price_toman bigint not null check(price_toman>=0),
 status text not null default 'draft' check(status in ('draft','published','archived')),
 created_at timestamptz not null default now()
);
create table if not exists public.academy_workshop_registrations(
 id uuid primary key default gen_random_uuid(),
 workshop_id uuid not null references public.academy_workshops(id) on delete cascade,
 full_name text not null,
 phone text not null,
 experience text not null,
 status text not null default 'pending' check(status in ('pending','confirmed','cancelled')),
 created_at timestamptz not null default now(),
 unique(workshop_id,phone)
);
alter table public.academy_workshops enable row level security;
alter table public.academy_workshop_registrations enable row level security;
create policy "Public published academy workshops" on public.academy_workshops for select to anon using(status='published');
create policy "Admin read academy workshops" on public.academy_workshops for select to authenticated using(true);
create policy "Admin insert academy workshops" on public.academy_workshops for insert to authenticated with check(true);
create policy "Admin update academy workshops" on public.academy_workshops for update to authenticated using(true) with check(true);
create policy "Admin delete academy workshops" on public.academy_workshops for delete to authenticated using(true);
create policy "Admin read academy registrations" on public.academy_workshop_registrations for select to authenticated using(true);
create policy "Admin update academy registrations" on public.academy_workshop_registrations for update to authenticated using(true) with check(true);
create or replace function public.register_academy_workshop(p_workshop_id uuid,p_full_name text,p_phone text,p_experience text)
returns text language plpgsql security definer set search_path=public as $$
declare v_phone text;v_workshop public.academy_workshops%rowtype;v_count integer;
begin
 v_phone:=translate(trim(p_phone),'۰۱۲۳۴۵۶۷۸۹٠١٢٣٤٥٦٧٨٩','01234567890123456789');
 if length(trim(p_full_name)) not between 2 and 100 or length(trim(p_experience)) not between 1 and 120 or v_phone !~ '^09[0-9]{9}$' then return 'invalid';end if;
 perform pg_advisory_xact_lock(hashtext(p_workshop_id::text));
 select * into v_workshop from public.academy_workshops where id=p_workshop_id and status='published';
 if not found or now()>=v_workshop.starts_at then return 'closed';end if;
 if exists(select 1 from public.academy_workshop_registrations where workshop_id=p_workshop_id and phone=v_phone) then return 'duplicate';end if;
 select count(*) into v_count from public.academy_workshop_registrations where workshop_id=p_workshop_id and status<>'cancelled';
 if v_count>=v_workshop.capacity then return 'full';end if;
 insert into public.academy_workshop_registrations(workshop_id,full_name,phone,experience) values(p_workshop_id,trim(p_full_name),v_phone,trim(p_experience));
 return 'registered';
end;$$;
revoke all on function public.register_academy_workshop(uuid,text,text,text) from public;
grant execute on function public.register_academy_workshop(uuid,text,text,text) to anon,authenticated;
