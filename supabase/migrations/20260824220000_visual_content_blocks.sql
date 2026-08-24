create table if not exists public.resource_content_blocks (
  id uuid primary key default gen_random_uuid(),
  resource_id uuid references public.resource_tours(id) on delete cascade,
  key text not null,
  label text not null,
  value text not null default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.resource_content_blocks enable row level security;

create policy "resource content readable" on public.resource_content_blocks
for select using (true);

create policy "admins manage resource content" on public.resource_content_blocks
for all using (auth.uid() in (select user_id from public.user_roles where role='admin'));
