-- Refine the GDC learning-page bio: introduce GDC programs generically first,
-- then mention TCGA as one of the best-known large programs without framing it as the portal itself.

update public.resource_content_blocks as content
set
  value = 'GDC (Genomic Data Commons) پرتال داده‌های سرطان NCI است که داده‌های حاصل از مجموعه‌ای از برنامه‌های پژوهشی سرطان را در یک زیرساخت مشترک گردآوری، استانداردسازی و قابل جست‌وجو می‌کند. هر برنامه می‌تواند شامل چندین پروژه باشد و روی نوع خاصی از سرطان، جمعیت بیماران، فناوری‌های مولکولی یا هدف پژوهشی مشخص تمرکز داشته باشد. در میان این برنامه‌ها، TCGA (The Cancer Genome Atlas) یکی از بزرگ‌ترین و شناخته‌شده‌ترین مجموعه‌های GDC است. در GDC می‌توانید داده‌هایی مانند توالی‌یابی DNA و RNA، بیان ژن، جهش‌ها، اطلاعات بالینی و مشخصات نمونه‌های زیستی را بررسی و فیلتر کنید. در این آموزش یاد می‌گیرید ساختار GDC را بشناسید و برای سؤال پژوهشی خود، پروژه، گروه مطالعاتی و فایل‌های مناسب را به‌درستی پیدا و انتخاب کنید.',
  updated_at = now()
from public.resource_tours as resource
where content.resource_id = resource.id
  and resource.slug = 'gdc'
  and content.key = 'description';
