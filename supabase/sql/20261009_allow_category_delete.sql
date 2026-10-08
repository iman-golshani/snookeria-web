-- Allow CMS authenticated editors to delete categories.
-- Review this policy if your CMS has non-admin authenticated users.
drop policy if exists "Authenticated editors can delete post categories" on public.post_categories;
create policy "Authenticated editors can delete post categories"
on public.post_categories for delete to authenticated using (slug <> 'snookeria');
-- The universal Snookeria category is also protected by a database trigger.
