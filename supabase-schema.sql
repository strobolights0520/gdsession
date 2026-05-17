create table if not exists public.app_storage (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.app_storage enable row level security;

drop policy if exists "open_gd_read" on public.app_storage;
drop policy if exists "open_gd_insert" on public.app_storage;
drop policy if exists "open_gd_update" on public.app_storage;
drop policy if exists "open_gd_delete" on public.app_storage;

create policy "open_gd_read"
on public.app_storage
for select
to anon, authenticated
using (true);

create policy "open_gd_insert"
on public.app_storage
for insert
to anon, authenticated
with check (true);

create policy "open_gd_update"
on public.app_storage
for update
to anon, authenticated
using (true)
with check (true);

create policy "open_gd_delete"
on public.app_storage
for delete
to anon, authenticated
using (true);
