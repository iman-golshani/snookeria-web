-- Snookeria CMS media storage
insert into storage.buckets (id, name, public)
values ('cms-media', 'cms-media', true)
on conflict (id) do update set public = true;

create policy "public read cms media"
on storage.objects for select
using (bucket_id = 'cms-media');

create policy "admin upload cms media"
on storage.objects for insert
to authenticated
with check (bucket_id = 'cms-media');

create policy "admin update cms media"
on storage.objects for update
to authenticated
using (bucket_id = 'cms-media')
with check (bucket_id = 'cms-media');

create policy "admin delete cms media"
on storage.objects for delete
to authenticated
using (bucket_id = 'cms-media');
