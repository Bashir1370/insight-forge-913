export const GDC_COHORT_BUILDER_FILTERS_CONTENT_KEY = "gdc_cohort_builder_filters_stage_v1";

export type GdcCohortBuilderFiltersHotspot = {
  key: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

export type GdcCohortBuilderFiltersSlide = {
  key: string;
  tabLabel: string;
  title: string;
  body: string;
  researchUse: string;
  caution: string;
  hotspotKey: string;
};

export type GdcCohortBuilderFiltersConfig = {
  title: string;
  imageUrl: string;
  introLabel: string;
  introBody: string;
  nextButton: string;
  slides: GdcCohortBuilderFiltersSlide[];
  hotspots: GdcCohortBuilderFiltersHotspot[];
};

export const DEFAULT_GDC_COHORT_BUILDER_FILTERS_CONFIG: GdcCohortBuilderFiltersConfig = {
  title: "نقشه فیلترهای Cohort Builder",
  imageUrl: "",
  introLabel: "اول ساختار فیلترها را بشناسیم",
  introBody:
    "در Cohort Builder دسته‌های فیلتر در ستون سمت چپ قرار دارند. با انتخاب هر دسته، پنل‌های مرتبط در سمت راست باز می‌شوند. در این مرحله نقش هر دسته را می‌شناسیم تا در مراحل بعدی Cohort را آگاهانه و مرحله‌به‌مرحله محدود کنیم.",
  nextButton: "ادامه ساخت Cohort",
  slides: [
    { key: "overview", tabLabel: "نقشه کلی", title: "ستون فیلترها، نقشه راه ساخت Cohort است", body: "تمام معیارهای اصلی ساخت Cohort از ستون سمت چپ سازمان‌دهی می‌شوند. هر عنوان یک خانواده از متغیرها را باز می‌کند و پنل‌های میانی گزینه‌های همان خانواده را نشان می‌دهند.", researchUse: "قبل از انتخاب هر فیلتر، مشخص کنید معیار شما مربوط به جمعیت بیمار، تشخیص، نمونه زیستی یا در دسترس بودن داده است؛ سپس وارد دسته مناسب شوید.", caution: "همه متغیرها برای همه Projectها کامل نیستند. وجود یک دسته به معنی کامل بودن تمام فیلدهای آن برای همه Caseها نیست.", hotspotKey: "sidebar" },
    { key: "general", tabLabel: "General", title: "General: محدوده پایه Cohort را تعیین کنید", body: "General نقطه شروع عمومی است. در تصویر فعلی این بخش پنل‌هایی مانند Program، Project، Disease Type، Primary Diagnosis، Primary Site، Tissue or Organ of Origin و Case ID را در اختیار شما می‌گذارد.", researchUse: "برای ادامه سناریوی سؤال ۱ می‌توانید ابتدا Project منتخب را محدود کنید و سپس با Primary Site یا Disease Type محدوده اولیه جمعیت را بسازید.", caution: "Project و Disease Type را یکی در نظر نگیرید؛ Project واحد مطالعه است، در حالی که Disease Type یک ویژگی تشخیصی برای Caseهاست.", hotspotKey: "general" },
    { key: "demographic", tabLabel: "Demographic", title: "Demographic: ویژگی‌های جمعیت‌شناختی بیماران", body: "این بخش متغیرهای جمعیت‌شناختی Caseها را در اختیار می‌گذارد؛ مانند سن، جنس، نژاد، قومیت یا سایر ویژگی‌هایی که بسته به داده‌های موجود در GDC قابل فیلتر هستند.", researchUse: "وقتی طراحی مطالعه شما گروه‌های سنی یا جمعیت‌های مشخص را مقایسه می‌کند، معیارهای inclusion و exclusion جمعیت‌شناختی از اینجا وارد Cohort می‌شوند.", caution: "وجود متغیر در رابط کاربری تضمین نمی‌کند که برای همه Caseها مقدار ثبت شده باشد؛ Missingness را بعداً بررسی کنید.", hotspotKey: "demographic" },
    { key: "general-diagnosis", tabLabel: "General Diagnosis", title: "General Diagnosis: تشخیص کلی را دقیق کنید", body: "این دسته برای محدود کردن Caseها بر اساس ویژگی‌های تشخیصی عمومی استفاده می‌شود؛ اطلاعاتی که کمک می‌کنند مشخص شود کدام تشخیص‌ها واقعاً وارد جمعیت مطالعه شوند.", researchUse: "اگر سؤال شما روی یک تشخیص مشخص یا زیرگروه بیماری متمرکز است، این بخش یکی از اصلی‌ترین نقاط ساخت معیار ورود بیمار است.", caution: "Primary Diagnosis، Disease Type و Site مفاهیم متفاوتی هستند. فیلتر درست را بر اساس سؤال پژوهشی انتخاب کنید.", hotspotKey: "general-diagnosis" },
    { key: "disease-status-history", tabLabel: "Disease Status & History", title: "Disease Status and History: وضعیت و سیر بیماری", body: "این بخش متغیرهای مرتبط با وضعیت بیماری و تاریخچه بالینی را گروه‌بندی می‌کند؛ بسته به Project می‌تواند اطلاعاتی درباره رخدادها یا وضعیت بیماری در طول مسیر بالینی داشته باشد.", researchUse: "برای مطالعاتی که وضعیت بیماری، عود یا سیر بالینی در تعریف cohort نقش دارد، این دسته نقطه بررسی متغیرهای مرتبط است.", caution: "پوشش زمانی و کامل بودن history بین پروژه‌ها یکسان نیست؛ قبل از تحلیل، تعداد Caseهای دارای داده قابل استفاده را بررسی کنید.", hotspotKey: "disease-status-history" },
    { key: "disease-specific", tabLabel: "Disease Specific", title: "Disease Specific Classifications: طبقه‌بندی‌های اختصاصی بیماری", body: "اینجا فیلدهایی قرار می‌گیرند که به طبقه‌بندی‌های اختصاصی یک بیماری یا خانواده بیماری مربوط‌اند و لزوماً برای همه سرطان‌ها یکسان نیستند.", researchUse: "اگر طراحی شما به یک classification اختصاصی وابسته است، این بخش کمک می‌کند cohort بر اساس همان چارچوب بیماری محدود شود.", caution: "یک classification اختصاصی را بدون توجه به نوع سرطان به همه پروژه‌ها تعمیم ندهید.", hotspotKey: "disease-specific" },
    { key: "treatment", tabLabel: "Treatment", title: "Treatment: سابقه درمان را وارد تعریف Cohort کنید", body: "Treatment متغیرهای مربوط به درمان‌های ثبت‌شده را در یک خانواده قرار می‌دهد. نوع و جزئیات درمان در دسترس به Project و کیفیت metadata آن وابسته است.", researchUse: "برای مقایسه پاسخ یا پیامد در گروه‌های درمانی، این بخش می‌تواند بخشی از تعریف جمعیت مطالعه باشد.", caution: "نبود یک مقدار درمانی همیشه به معنی «درمان نشده» نیست؛ ممکن است اطلاعات ثبت نشده یا ناقص باشد.", hotspotKey: "treatment" },
    { key: "exposure", tabLabel: "Exposure", title: "Exposure: مواجهه‌ها و عوامل زمینه‌ای", body: "این دسته برای متغیرهای مربوط به exposure یا عوامل زمینه‌ای ثبت‌شده در پرونده‌هاست؛ دامنه دقیق متغیرها به پروژه و سرطان مورد مطالعه بستگی دارد.", researchUse: "اگر عامل مواجهه بخشی از فرضیه شماست، از این دسته برای تعریف یا توصیف زیرگروه‌ها استفاده کنید.", caution: "Exposure data معمولاً ناهمگون است؛ قبل از استفاده تحلیلی، تعریف متغیر و میزان داده گمشده را بررسی کنید.", hotspotKey: "exposure" },
    { key: "other-clinical", tabLabel: "Other Clinical", title: "Other Clinical Attributes: متغیرهای بالینی تکمیلی", body: "متغیرهای بالینی مهمی که در دسته‌های اصلی جا نمی‌گیرند می‌توانند در این بخش قرار داشته باشند. این قسمت برای یافتن معیارهای تکمیلی طراحی مطالعه مفید است.", researchUse: "بعد از تعریف معیارهای اصلی، این بخش را برای متغیرهای تکمیلی که می‌توانند confounder یا covariate باشند بررسی کنید.", caution: "به‌دلیل تنوع فیلدها، قبل از فیلتر کردن معنی دقیق هر attribute را در metadata یا مستندات بررسی کنید.", hotspotKey: "other-clinical" },
    { key: "biospecimen", tabLabel: "Biospecimen", title: "Biospecimen: از بیمار به نمونه زیستی برسید", body: "Biospecimen برای محدود کردن cohort بر اساس ویژگی‌های نمونه زیستی است؛ مانند نوع نمونه، منبع بافت و سطوح مختلف Sample یا مشتقات آن بسته به داده‌های موجود.", researchUse: "برای جدا کردن Tumor از Normal یا انتخاب نوع نمونه مناسب آزمایش، این بخش نقش کلیدی دارد.", caution: "Case و Sample یک چیز نیستند. یک Case می‌تواند چند Sample داشته باشد و انتخاب نمونه می‌تواند تعداد داده‌های قابل تحلیل را تغییر دهد.", hotspotKey: "biospecimen" },
    { key: "genomic-filters", tabLabel: "Genomic Filters", title: "Genomic Filters: معیارهای مولکولی را وارد Cohort کنید", body: "این دسته برای محدودسازی بر اساس ویژگی‌های ژنومی قابل پشتیبانی در GDC استفاده می‌شود. فیلدهای دقیق و در دسترس می‌توانند با نوع داده و نسخه پرتال تغییر کنند.", researchUse: "وقتی فرضیه شما به یک ویژگی مولکولی مشخص وابسته است، این بخش می‌تواند تعریف cohort را از سطح بالینی به سطح ژنومی ببرد.", caution: "فیلتر ژنومی را فقط زمانی استفاده کنید که داده و تعریف زیستی آن با سؤال پژوهشی شما سازگار باشد.", hotspotKey: "genomic-filters" },
    { key: "available-data", tabLabel: "Available Data", title: "Available Data: مطمئن شوید Caseها داده موردنیاز را دارند", body: "این دسته به شما کمک می‌کند جمعیت را بر اساس در دسترس بودن انواع داده محدود کنید تا Caseهایی باقی بمانند که برای مرحله تحلیل واقعاً داده قابل استفاده دارند.", researchUse: "برای مثال، پیش از تحلیل RNA-seq می‌توانید cohort را به Caseهایی محدود کنید که داده مرتبط با تحلیل شما برایشان موجود است.", caution: "وجود Case در Project به معنی وجود همه نوع فایل برای آن Case نیست؛ availability را جداگانه کنترل کنید.", hotspotKey: "available-data" },
    { key: "custom-filters", tabLabel: "Custom Filters", title: "Custom Filters: وقتی فیلتر آماده کافی نیست", body: "Custom Filters برای ساخت محدودیت‌های پیشرفته‌تر یا استفاده از فیلدهایی است که در میان میانبرهای اصلی رابط کاربری قرار نگرفته‌اند.", researchUse: "اگر معیار inclusion یا exclusion شما در دسته‌های متداول دیده نمی‌شود، این بخش می‌تواند مسیر ساخت فیلتر دقیق‌تر باشد.", caution: "فیلتر سفارشی را مستند کنید تا تعریف Cohort شما قابل بازتولید و قابل توضیح باقی بماند.", hotspotKey: "custom-filters" },
  ],
  hotspots: [
    { key: "sidebar", label: "دسته‌های فیلتر Cohort Builder", x: 0.5, y: 32.8, width: 14.7, height: 63.2 },
    { key: "general", label: "General", x: 0.5, y: 33.1, width: 14.7, height: 4.9 },
    { key: "demographic", label: "Demographic", x: 0.5, y: 38.5, width: 14.7, height: 4.8 },
    { key: "general-diagnosis", label: "General Diagnosis", x: 0.5, y: 43.8, width: 14.7, height: 4.8 },
    { key: "disease-status-history", label: "Disease Status and History", x: 0.5, y: 49.1, width: 14.7, height: 4.8 },
    { key: "disease-specific", label: "Disease Specific Classifications", x: 0.5, y: 54.4, width: 14.7, height: 4.8 },
    { key: "treatment", label: "Treatment", x: 0.5, y: 59.7, width: 14.7, height: 4.7 },
    { key: "exposure", label: "Exposure", x: 0.5, y: 64.9, width: 14.7, height: 4.7 },
    { key: "other-clinical", label: "Other Clinical Attributes", x: 0.5, y: 70.2, width: 14.7, height: 4.7 },
    { key: "biospecimen", label: "Biospecimen", x: 0.5, y: 75.5, width: 14.7, height: 4.7 },
    { key: "genomic-filters", label: "Genomic Filters", x: 0.5, y: 80.8, width: 14.7, height: 4.7 },
    { key: "available-data", label: "Available Data", x: 0.5, y: 86.1, width: 14.7, height: 4.7 },
    { key: "custom-filters", label: "Custom Filters", x: 0.5, y: 91.3, width: 14.7, height: 4.8 },
  ],
};

function stringOr(value: unknown, fallback: string) { return typeof value === "string" ? value : fallback; }
function numberOr(value: unknown, fallback: number) { return typeof value === "number" && Number.isFinite(value) ? value : fallback; }

function normalizeSlide(value: any, fallback: GdcCohortBuilderFiltersSlide): GdcCohortBuilderFiltersSlide {
  return { key: stringOr(value?.key, fallback.key), tabLabel: stringOr(value?.tabLabel, fallback.tabLabel), title: stringOr(value?.title, fallback.title), body: stringOr(value?.body, fallback.body), researchUse: stringOr(value?.researchUse, fallback.researchUse), caution: stringOr(value?.caution, fallback.caution), hotspotKey: stringOr(value?.hotspotKey, fallback.hotspotKey) };
}
function normalizeHotspot(value: any, fallback: GdcCohortBuilderFiltersHotspot): GdcCohortBuilderFiltersHotspot {
  return { key: stringOr(value?.key, fallback.key), label: stringOr(value?.label, fallback.label), x: numberOr(value?.x, fallback.x), y: numberOr(value?.y, fallback.y), width: numberOr(value?.width, fallback.width), height: numberOr(value?.height, fallback.height) };
}

export function parseGdcCohortBuilderFiltersConfig(raw?: string | null): GdcCohortBuilderFiltersConfig {
  const defaults = DEFAULT_GDC_COHORT_BUILDER_FILTERS_CONFIG;
  if (!raw) return structuredClone(defaults);
  try {
    const parsed = JSON.parse(raw) as Partial<GdcCohortBuilderFiltersConfig>;
    return {
      title: stringOr(parsed.title, defaults.title), imageUrl: stringOr(parsed.imageUrl, defaults.imageUrl), introLabel: stringOr(parsed.introLabel, defaults.introLabel), introBody: stringOr(parsed.introBody, defaults.introBody), nextButton: stringOr(parsed.nextButton, defaults.nextButton),
      slides: defaults.slides.map((fallback) => normalizeSlide(Array.isArray(parsed.slides) ? parsed.slides.find((item) => item?.key === fallback.key) : null, fallback)),
      hotspots: defaults.hotspots.map((fallback) => normalizeHotspot(Array.isArray(parsed.hotspots) ? parsed.hotspots.find((item) => item?.key === fallback.key) : null, fallback)),
    };
  } catch { return structuredClone(defaults); }
}

export function getGdcCohortBuilderFiltersConfig(content: Array<{ key?: string; value?: string }> | null | undefined) {
  const raw = content?.find((item) => item.key === GDC_COHORT_BUILDER_FILTERS_CONTENT_KEY)?.value;
  return parseGdcCohortBuilderFiltersConfig(raw);
}

export function toGdcCohortBuilderFiltersContent(config: GdcCohortBuilderFiltersConfig) {
  return { key: GDC_COHORT_BUILDER_FILTERS_CONTENT_KEY, label: "GDC question 2 cohort builder filters stage configuration", value: JSON.stringify(config) };
}
