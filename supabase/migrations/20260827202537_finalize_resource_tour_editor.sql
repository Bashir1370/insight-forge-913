alter table public.resource_hotspots
  add column if not exists hotspot_key text;

update public.resource_hotspots as hotspot
set hotspot_key = case hotspot.step
  when 1 then 'analysis-center'
  when 2 then 'projects'
  when 3 then 'cohort-builder'
  when 4 then 'repository'
  when 5 then 'search'
  when 6 then 'portal-summary'
  when 7 then 'primary-site-chart'
  else 'step-' || hotspot.step::text
end
from public.resource_tours as resource
where hotspot.resource_id = resource.id
  and resource.slug = 'gdc'
  and hotspot.hotspot_key is null;

update public.resource_hotspots
set hotspot_key = 'step-' || step::text
where hotspot_key is null;

alter table public.resource_hotspots
  alter column hotspot_key set not null;

create unique index if not exists resource_hotspots_resource_key_uidx
  on public.resource_hotspots (resource_id, hotspot_key);

create unique index if not exists resource_content_blocks_resource_key_uidx
  on public.resource_content_blocks (resource_id, key);

create or replace function public.set_resource_tour_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_resource_tours_updated_at on public.resource_tours;
create trigger set_resource_tours_updated_at
before update on public.resource_tours
for each row execute function public.set_resource_tour_updated_at();

drop trigger if exists set_resource_hotspots_updated_at on public.resource_hotspots;
create trigger set_resource_hotspots_updated_at
before update on public.resource_hotspots
for each row execute function public.set_resource_tour_updated_at();

drop trigger if exists set_resource_content_blocks_updated_at on public.resource_content_blocks;
create trigger set_resource_content_blocks_updated_at
before update on public.resource_content_blocks
for each row execute function public.set_resource_tour_updated_at();

drop policy if exists "authenticated manage resource tours" on public.resource_tours;
drop policy if exists "authenticated manage resource hotspots" on public.resource_hotspots;
drop policy if exists "admins manage resource content" on public.resource_content_blocks;

drop policy if exists "admins manage resource tours" on public.resource_tours;
create policy "admins manage resource tours"
on public.resource_tours
for all
to authenticated
using ((select private.has_role('admin'::text)))
with check ((select private.has_role('admin'::text)));

drop policy if exists "admins manage resource hotspots" on public.resource_hotspots;
create policy "admins manage resource hotspots"
on public.resource_hotspots
for all
to authenticated
using ((select private.has_role('admin'::text)))
with check ((select private.has_role('admin'::text)));

create policy "admins manage resource content"
on public.resource_content_blocks
for all
to authenticated
using ((select private.has_role('admin'::text)))
with check ((select private.has_role('admin'::text)));

grant select on public.resource_tours, public.resource_hotspots, public.resource_content_blocks
  to anon, authenticated;
grant insert, update, delete on public.resource_tours, public.resource_hotspots, public.resource_content_blocks
  to authenticated;

insert into public.resource_tours (slug, title, image_url)
values (
  'gdc',
  'GDC / TCGA Guided Portal Tour',
  '/images/gdc/gdc-home-clean.webp'
)
on conflict (slug) do nothing;

insert into public.resource_hotspots
  (resource_id, hotspot_key, step, title, description, action, x, y, width, height)
select resource.id, seed.hotspot_key, seed.step, seed.title, '', '', seed.x, seed.y, seed.width, seed.height
from public.resource_tours as resource
cross join (
  values
    ('analysis-center', 1, 'Analysis Center', 1.2::numeric, 9.6::numeric, 10.5::numeric, 5.5::numeric),
    ('projects', 2, 'Projects', 12.7::numeric, 9.6::numeric, 7.2::numeric, 5.5::numeric),
    ('cohort-builder', 3, 'Cohort Builder', 20.5::numeric, 9.6::numeric, 10.5::numeric, 5.5::numeric),
    ('repository', 4, 'Repository', 31.4::numeric, 9.6::numeric, 8.7::numeric, 5.5::numeric),
    ('search', 5, 'Search', 71.6::numeric, 9.6::numeric, 26.7::numeric, 5.5::numeric),
    ('portal-summary', 6, 'Data Portal Summary', 1.4::numeric, 74.2::numeric, 48.6::numeric, 16.6::numeric),
    ('primary-site-chart', 7, 'Cases by Major Primary Site', 69::numeric, 21.8::numeric, 28.7::numeric, 67::numeric)
) as seed(hotspot_key, step, title, x, y, width, height)
where resource.slug = 'gdc'
on conflict (resource_id, hotspot_key) do nothing;

insert into public.resource_content_blocks (resource_id, key, label, value)
select resource.id, seed.key, seed.label, seed.value
from public.resource_tours as resource
cross join (
  values
    ('title', 'عنوان صفحه', 'GDC / TCGA Guided Portal Tour'),
    ('description', 'توضیح صفحه', 'پورتال اصلی NCI برای جست‌وجو، ساخت cohort، مرور پروژه‌ها، تحلیل و دریافت داده‌های هماهنگ‌شده سرطان؛ از جمله پروژه‌های TCGA.')
) as seed(key, label, value)
where resource.slug = 'gdc'
on conflict (resource_id, key) do nothing;;
