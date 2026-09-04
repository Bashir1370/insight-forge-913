import type { GdcQuestionGuideConfig } from "./gdc-question-guide-config";

const PRIMARY_SITE_IMAGE_PATH = "/images/gdc/gdc-primary-site.webp";

const PRIMARY_SITE_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="405" height="352" viewBox="0 0 405 352">
  <rect width="405" height="352" rx="8" fill="#ffffff"/>
  <rect x="1" y="1" width="403" height="350" rx="8" fill="none" stroke="#cfd8e3"/>
  <rect x="1" y="1" width="403" height="57" rx="7" fill="#215d82"/>
  <path d="M18 36 l7 -7 l7 7" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  <text x="43" y="37" font-family="Arial, sans-serif" font-size="22" font-weight="700" fill="#ffffff">Primary Site</text>
  <circle cx="318" cy="27" r="6" fill="none" stroke="#ffffff" stroke-width="2"/>
  <line x1="323" y1="32" x2="329" y2="38" stroke="#ffffff" stroke-width="2"/>
  <path d="M344 20 v19 M351 20 v19" stroke="#ffffff" stroke-width="2"/>
  <path d="M373 20 a10 10 0 1 1 -7 17" fill="none" stroke="#ffffff" stroke-width="2.5"/>
  <path d="M366 18 l8 2 l-3 7" fill="none" stroke="#ffffff" stroke-width="2.5"/>

  <line x1="1" y1="93" x2="404" y2="93" stroke="#d9e1e8"/>
  <text x="14" y="84" font-family="Arial, sans-serif" font-size="18" font-weight="700" fill="#215d82">Name</text>
  <path d="M84 76 l6 6 l6 -6" fill="#215d82"/>
  <text x="296" y="84" font-family="Arial, sans-serif" font-size="18" font-weight="700" fill="#215d82">Projects</text>
  <path d="M381 78 l6 6 l6 -6" fill="#215d82"/>

  <g font-family="Arial, sans-serif" font-size="16" fill="#111827">
    <rect x="17" y="108" width="18" height="18" rx="4" fill="#fff" stroke="#8997a5"/>
    <text x="42" y="123">bronchus and lung</text><text x="294" y="123">27 (29.03%)</text>
    <rect x="17" y="135" width="18" height="18" rx="4" fill="#fff" stroke="#8997a5"/>
    <text x="42" y="150">unknown</text><text x="294" y="150">22 (23.66%)</text>
    <rect x="17" y="162" width="18" height="18" rx="4" fill="#fff" stroke="#8997a5"/>
    <text x="42" y="177">breast</text><text x="294" y="177">21 (22.58%)</text>
    <rect x="17" y="189" width="18" height="18" rx="4" fill="#fff" stroke="#8997a5"/>
    <text x="42" y="204">colon</text><text x="294" y="204">21 (22.58%)</text>
    <rect x="17" y="216" width="18" height="18" rx="4" fill="#fff" stroke="#8997a5"/>
    <text x="42" y="231">liver and intrahepatic bile du...</text><text x="294" y="231">18 (19.35%)</text>
    <rect x="17" y="243" width="18" height="18" rx="4" fill="#fff" stroke="#8997a5"/>
    <text x="42" y="258">hematopoietic and reticulo...</text><text x="294" y="258">17 (18.28%)</text>
  </g>

  <line x1="1" y1="282" x2="404" y2="282" stroke="#d9e1e8"/>
  <circle cx="307" cy="317" r="9" fill="#de7046"/>
  <line x1="302" y1="317" x2="312" y2="317" stroke="#fff" stroke-width="2"/>
  <line x1="307" y1="312" x2="307" y2="322" stroke="#fff" stroke-width="2"/>
  <text x="321" y="323" font-family="Arial, sans-serif" font-size="18" font-weight="700" fill="#334155">63 more</text>
</svg>`;

const PRIMARY_SITE_IMAGE = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(PRIMARY_SITE_SVG)}`;

const NEW_PRIMARY_SECTIONS = [
  {
    title: "Primary Site در عمل چه کمکی می‌کند؟",
    body: "در فهرست سمت راست، هر ردیف یک محل اولیه تومور را نشان می‌دهد؛ مثل breast، colon یا bronchus and lung. با انتخاب یک گزینه، GDC فهرست Projectها را به مطالعات مرتبط با همان محل اولیه محدود می‌کند.",
    tone: "neutral" as const,
  },
  {
    title: "عدد و درصد کنار هر گزینه را چطور بخوانیم؟",
    body: "مثلاً breast — 21 (22.58%) یعنی در وضعیت فعلی 21 Project با Primary Site برابر breast مرتبط‌اند و این تعداد 22.58٪ از کل Projectهای فعلی را تشکیل می‌دهد. با تغییر فیلترها، این اعداد هم تغییر می‌کنند.",
    tone: "teal" as const,
  },
  {
    title: "فهرست به همین چند مورد محدود نیست",
    body: "مواردی که در تصویر می‌بینید فقط بخشی از فهرست هستند. با اسکرول کردن یا باز کردن +63 more می‌توانید Primary Siteهای بیشتری را ببینید.",
    tone: "sky" as const,
  },
  {
    title: "Primary Site را با Disease Type یکی نگیرید",
    body: "Primary Site محل اولیه آناتومیکی تومور را نشان می‌دهد؛ Disease Type نوع یا طبقه‌بندی بیماری را توصیف می‌کند. در بخش Disease Type این تفاوت را دقیق‌تر می‌بینیم.",
    tone: "amber" as const,
  },
];

const NEW_EXPERIMENTAL_STRATEGY_SECTIONS = [
  {
    title: "Experimental Strategy در عمل چه چیزی را نشان می‌دهد؟",
    body: "بعد از اینکه با Data Category مشخص کردیم دنبال چه خانواده‌ای از داده هستیم، Experimental Strategy به ما می‌گوید آن داده با چه روش آزمایشی یا فناوری توالی‌یابی تولید شده است. در این فهرست گزینه‌هایی مثل RNA-Seq، WXS، WGS، miRNA-Seq و Methylation Array را می‌بینیم.",
    tone: "neutral" as const,
  },
  {
    title: "چند Strategy مهم را ساده بشناسیم",
    body: "RNA-Seq → بررسی RNA و بیان ژن‌ها\nWXS → توالی‌یابی بخش‌های کدکننده ژنوم یا Exome\nWGS → توالی‌یابی کل ژنوم\nmiRNA-Seq → بررسی microRNAها\nMethylation Array → بررسی الگوهای متیلاسیون DNA\n\nلازم نیست همه روش‌ها را حفظ کنید؛ مهم این است که Strategy انتخابی با سؤال پژوهشی و تحلیل شما هماهنگ باشد.",
    tone: "sky" as const,
  },
  {
    title: "تفاوت Experimental Strategy با Data Category چیست؟",
    body: "Data Category می‌گوید چه خانواده‌ای از داده در Project وجود دارد؛ Experimental Strategy می‌گوید آن داده با چه روش یا فناوری‌ای تولید شده است. مثلاً ممکن است Data Category برابر Transcriptome Profiling باشد و روش تولید داده RNA-Seq باشد.",
    tone: "amber" as const,
  },
  {
    title: "عدد و درصد کنار هر روش را چطور بخوانیم؟",
    body: "مثلاً RNA-Seq — 88 (94.62%) یعنی در وضعیت فعلی 88 Project داده‌ای دارند که با RNA-Seq تولید شده و این Projectها 94.62٪ از Projectهای فعلی را تشکیل می‌دهند. یک Project می‌تواند چند Experimental Strategy داشته باشد؛ بنابراین مجموع درصدها الزاماً 100٪ نمی‌شود.",
    tone: "teal" as const,
  },
  {
    title: "یک مثال از مسیر پژوهش",
    body: "فرض کنید موضوع ما بیان ژن در سرطان پستان است. بعد از پیدا کردن Projectهای مرتبط و انتخاب Data Category = Transcriptome Profiling، با Experimental Strategy = RNA-Seq می‌توانیم Projectهایی را پیدا کنیم که داده مناسب سؤال ما با RNA-Seq تولید شده است. حالا علاوه بر اینکه می‌دانیم چه داده‌ای وجود دارد، می‌دانیم این داده چگونه تولید شده است.",
    tone: "neutral" as const,
  },
];

function looksLikeLegacyPrimarySite(config: GdcQuestionGuideConfig) {
  const primary = config.projects.facets.find((item) => item.id === "primarySite");
  if (!primary) return false;
  return (
    primary.sections[0]?.title === "این لیست همه سرطان‌ها نیست" ||
    primary.sections[1]?.title === "عدد و درصد روبه‌روی هر مورد چیست؟"
  );
}

function looksLikeLegacyExperimentalStrategy(config: GdcQuestionGuideConfig) {
  const experimental = config.projects.facets.find((item) => item.id === "experimentalStrategy");
  if (!experimental) return false;
  return (
    experimental.lensTitle === "Experimental Strategy یعنی چه؟" &&
    (
      experimental.sections[0]?.title === "با Data Category اشتباه نگیرید" ||
      experimental.sections[1]?.title === "عدد و درصد کنار روش‌ها چیست؟"
    )
  );
}

function shouldUseBundledPrimaryImage(value?: string) {
  if (!value) return true;
  if (value.startsWith("hubgene://gdc-primary-site")) return true;
  if (value.includes("/images/gdc/gdc-primary-site")) return true;
  return false;
}

export function upgradeGdcQuestionGuideConfig(config: GdcQuestionGuideConfig): GdcQuestionGuideConfig {
  const next = structuredClone(config);
  const primary = next.projects.facets.find((item) => item.id === "primarySite");

  if (primary) {
    if (shouldUseBundledPrimaryImage(primary.imageUrl)) {
      primary.imageUrl = PRIMARY_SITE_IMAGE;
    }

    if (looksLikeLegacyPrimarySite(config)) {
      primary.lensTitle = "Primary Site را چطور بخوانیم؟";
      primary.lensSubtitle = "محل اولیه‌ای که تومور از آن شروع شده؛ یکی از راه‌های محدود کردن Projectها در GDC";
      primary.sections = NEW_PRIMARY_SECTIONS.map((item) => ({ ...item }));
    }
  }

  const experimental = next.projects.facets.find((item) => item.id === "experimentalStrategy");
  if (experimental && looksLikeLegacyExperimentalStrategy(config)) {
    experimental.lensTitle = "Experimental Strategy را چطور بخوانیم؟";
    experimental.lensSubtitle = "روشی که داده با آن تولید شده است؛ مثل RNA-Seq، WXS یا WGS";
    experimental.sections = NEW_EXPERIMENTAL_STRATEGY_SECTIONS.map((item) => ({ ...item }));
  }

  return next;
}

export function prepareGdcQuestionGuideForDisplay(config: GdcQuestionGuideConfig): GdcQuestionGuideConfig {
  const next = structuredClone(config);
  const primary = next.projects.facets.find((item) => item.id === "primarySite");
  if (primary && shouldUseBundledPrimaryImage(primary.imageUrl)) {
    primary.imageUrl = PRIMARY_SITE_IMAGE;
  }
  return next;
}
