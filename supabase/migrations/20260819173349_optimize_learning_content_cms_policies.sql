create index if not exists learning_content_drafts_updated_by_idx
  on public.learning_content_drafts (updated_by);

create index if not exists learning_content_published_published_by_idx
  on public.learning_content_published (published_by);

create index if not exists learning_content_revisions_created_by_idx
  on public.learning_content_revisions (created_by);

drop policy if exists "Admins manage published learning content"
  on public.learning_content_published;
drop policy if exists "Admins can insert published learning content"
  on public.learning_content_published;
drop policy if exists "Admins can update published learning content"
  on public.learning_content_published;
drop policy if exists "Admins can delete published learning content"
  on public.learning_content_published;

create policy "Admins can insert published learning content"
on public.learning_content_published
for insert
to authenticated
with check ((select private.has_role('admin'::text)));

create policy "Admins can update published learning content"
on public.learning_content_published
for update
to authenticated
using ((select private.has_role('admin'::text)))
with check ((select private.has_role('admin'::text)));

create policy "Admins can delete published learning content"
on public.learning_content_published
for delete
to authenticated
using ((select private.has_role('admin'::text)));;
