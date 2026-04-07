-- Tiny read-only row so the app can verify Supabase from the browser (anon key + RLS).
create table if not exists public.chd_health (
  id smallint primary key default 1 constraint chd_health_single_row check (id = 1),
  status text not null default 'ok',
  updated_at timestamptz not null default now()
);

insert into public.chd_health (id, status) values (1, 'ok')
on conflict (id) do update
set status = excluded.status, updated_at = now();

alter table public.chd_health enable row level security;

create policy "chd_health_select_anon"
on public.chd_health
for select
to anon
using (true);

create policy "chd_health_select_authenticated"
on public.chd_health
for select
to authenticated
using (true);
