-- Refine the GDC learning-page bio to clarify that TCGA is one of multiple programs represented in GDC.

update public.resource_content_blocks as content
set
  value = 'GDC (Genomic Data Commons) پرتال داده‌های سرطان NCI است که داده‌های حاصل از برنامه‌ها و پروژه‌های متعدد سرطان را در یک زیرساخت مشترک گردآوری و استانداردسازی می‌کند. TCGA (The Cancer Genome Atlas) فقط یکی از این برنامه‌هاست؛ در کنار برنامه‌هایی مانند TARGET، CPTAC و HCMI. در GDC می‌توانید داده‌های ژنومی و ترنسکریپتومی، جهش‌ها، بیان ژن، اطلاعات بالینی و مشخصات نمونه‌های زیستی را بر اساس Program، Project، Case، Sample و File جست‌وجو و فیلتر کنید. در این آموزش یاد می‌گیرید ساختار GDC را بشناسید و برای سؤال پژوهشی خود، برنامه، گروه مطالعاتی و فایل‌های مناسب را درست پیدا و انتخاب کنید.',
  updated_at = now()
from public.resource_tours as resource
where content.resource_id = resource.id
  and resource.slug = 'gdc'
  and content.key = 'description';
