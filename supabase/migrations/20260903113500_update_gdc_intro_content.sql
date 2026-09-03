-- Update the GDC resource-learning hero title and introductory bio.
-- Keep GDC as the portal/data infrastructure and TCGA as a major cancer program whose data are available through GDC.

insert into public.resource_tours (slug, title, image_url)
values (
  'gdc',
  'GDC / TCGA Guided Portal Tour',
  '/images/gdc/gdc-home-clean.webp'
)
on conflict (slug) do nothing;

insert into public.resource_content_blocks (resource_id, key, label, value)
select
  resource.id,
  content.key,
  content.label,
  content.value
from public.resource_tours as resource
cross join (
  values
    (
      'title',
      'عنوان صفحه',
      'آموزش پرتال GDC'
    ),
    (
      'description',
      'توضیح صفحه',
      'GDC پرتال داده‌های سرطان NCI است؛ جایی که پژوهشگر می‌تواند داده‌های مولکولی و بالینی پروژه‌های مختلف سرطان را پیدا، فیلتر و بررسی کند. TCGA مخفف The Cancer Genome Atlas است؛ یکی از بزرگ‌ترین برنامه‌های بررسی مولکولی سرطان که داده‌های آن امروز از طریق GDC در دسترس پژوهشگران قرار دارد. در GDC می‌توانید داده‌هایی مانند توالی‌یابی DNA و RNA، بیان ژن، جهش‌ها، اطلاعات بالینی و مشخصات نمونه‌های زیستی را بررسی کنید. در این آموزش یاد می‌گیرید پروژه‌ها، گروه‌های مطالعاتی، نمونه‌ها و فایل‌های مناسب را پیدا و درست انتخاب کنید.'
    )
) as content(key, label, value)
where resource.slug = 'gdc'
on conflict (resource_id, key)
do update set
  label = excluded.label,
  value = excluded.value,
  updated_at = now();
