create table if not exists public.resource_tours (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  image_url text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.resource_hotspots (
  id uuid primary key default gen_random_uuid(),
  resource_id uuid references public.resource_tours(id) on delete cascade,
  step integer not null,
  title text not null,
  description text default '',
  x numeric not null default 0,
  y numeric not null default 0,
  width numeric not null default 10,
  height numeric not null default 10,
  action text default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.resource_tours enable row level security;
alter table public.resource_hotspots enable row level security;

create policy "public read resource tours" on public.resource_tours for select using (true);
create policy "public read resource hotspots" on public.resource_hotspots for select using (true);
create policy "authenticated manage resource tours" on public.resource_tours for all to authenticated using (true) with check (true);
create policy "authenticated manage resource hotspots" on public.resource_hotspots for all to authenticated using (true) with check (true);;
