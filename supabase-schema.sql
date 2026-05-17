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
drop policy if exists "open_gd_admin_read_all" on public.app_storage;
drop policy if exists "open_gd_admin_insert_all" on public.app_storage;
drop policy if exists "open_gd_admin_update_all" on public.app_storage;
drop policy if exists "open_gd_admin_delete_all" on public.app_storage;
drop policy if exists "open_gd_student_read_sessions" on public.app_storage;
drop policy if exists "open_gd_student_read_results" on public.app_storage;
drop policy if exists "open_gd_student_read_mypage" on public.app_storage;
drop policy if exists "open_gd_student_join_sessions" on public.app_storage;
drop policy if exists "open_gd_student_write_evaluations" on public.app_storage;
drop policy if exists "open_gd_student_update_evaluations" on public.app_storage;

create policy "open_gd_admin_read_all"
on public.app_storage
for select
to authenticated
using (true);

create policy "open_gd_admin_insert_all"
on public.app_storage
for insert
to authenticated
with check (true);

create policy "open_gd_admin_update_all"
on public.app_storage
for update
to authenticated
using (true)
with check (true);

create policy "open_gd_admin_delete_all"
on public.app_storage
for delete
to authenticated
using (true);

create policy "open_gd_student_read_sessions"
on public.app_storage
for select
to anon
using (key like 'session:%');

create policy "open_gd_student_read_results"
on public.app_storage
for select
to anon
using (key like 'evals:%');

create policy "open_gd_student_read_mypage"
on public.app_storage
for select
to anon
using (key like 'student:%');

create policy "open_gd_student_join_sessions"
on public.app_storage
for update
to anon
using (key like 'session:%')
with check (key like 'session:%');

create policy "open_gd_student_write_evaluations"
on public.app_storage
for insert
to anon
with check (key like 'evals:%' or key like 'submitted:%');

create policy "open_gd_student_update_evaluations"
on public.app_storage
for update
to anon
using (key like 'evals:%' or key like 'submitted:%')
with check (key like 'evals:%' or key like 'submitted:%');
