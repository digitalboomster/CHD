-- Private bucket for archived PDFs uploaded via CHD API (retention / audit).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'chd-rag-archives',
  'chd-rag-archives',
  false,
  20971520,
  array['application/pdf']::text[]
)
on conflict (id) do update
set
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Authenticated users can read archives (tighten later with folder = auth.uid() if needed).
drop policy if exists "chd_rag_archives_select_authenticated" on storage.objects;

create policy "chd_rag_archives_select_authenticated"
on storage.objects
for select
to authenticated
using (bucket_id = 'chd-rag-archives');

-- Uploads go through the API with service_role (bypasses RLS). No anon write.
