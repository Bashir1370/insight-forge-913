export const GDC_COHORT_BUILDER_FILTERS_CONTENT_KEY = "gdc_cohort_builder_filters_stage_v1";

export type GdcCohortBuilderFiltersHotspot = {
  key: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  enabled: boolean;
  slideKeys: string[];
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

const slide = (
  key: string,
  tabLabel: string,
  title: string,
  body: string,
  researchUse: string,
  caution: string,
  hotspotKey: string,
): GdcCohortBuilderFiltersSlide => ({
  key,
  tabLabel,
  title,
  body,
  researchUse,
  caution,
  hotspotKey,
});

const hotspot = (
  key: string,
  label: string,
  x: number,
  y: number,
  width: number,
  height: number,
  slideKeys: string[],
): GdcCohortBuilderFiltersHotspot => ({
  key,
  label,
  x,
  y,
  width,
  height,
  enabled: true,
  slideKeys,
});

export const DEFAULT_GDC_COHORT_BUILDER_FILTERS_CONFIG: GdcCohortBuilderFiltersConfig = {
  title: "نقشه فیلترهای Cohort Builder",
  imageUrl: "/images/gdc/gdc-cohort-builder-filters.webp",
  introLabel: "اول ساختار فیلترها را بشناسیم",
  introBody:
    "در Cohort Builder دسته‌های فیلتر در ستون سمت چپ قرار دارند. با انتخاب هر دسته، پنل‌های مرتبط در سمت راست باز می‌شوند. در این مرحله نقش هر دسته را می‌شناسیم تا در مراحل بعدی Cohort را آگاهانه و مرحله‌به‌مرحله محدود کنیم.",
  nextButton: "ادامه ساخت Cohort",
  slides: [
    slide(
      "overview",
      "نقشه کلی",
      "ستون فیلترها، نقشه راه ساخت Cohort است",
      "تمام معیارهای اصلی ساخت Cohort از ستون سمت چپ سازمان‌دهی می‌شوند. هر عنوان یک خانواده از متغیرها را باز می‌کند و پنل‌های میانی گزینه‌های همان خانواده را نشان می‌دهند.",
      "قبل از انتخاب هر فیلتر، مشخص کنید معیار شما مربوط به جمعیت بیمار، تشخیص، نمونه زیستی یا در دسترس بودن داده است؛ سپس وارد دسته مناسب شوید.",
      "همه متغیرها برای همه Projectها کامل نیستند. وجود یک دسته به معنی کامل بودن تمام فیلدهای آن برای همه Caseها نیست.",
      "sidebar",
    ),
    slide(
      "general",
      "General",
      "General: محدوده پایه Cohort را تعیین کنید",
      "General نقطه شروع عمومی است. در تصویر فعلی این بخش پنل‌هایی مانند Program، Project، Disease Type، Primary Diagnosis، Primary Site، Tissue or Organ of Origin و Case ID را در اختیار شما می‌گذارد.",
      "برای ادامه سناریوی سؤال ۱ می‌توانید ابتدا Project منتخب را محدود کنید و سپس با Primary Site یا Disease Type محدوده اولیه جمعیت را بسازید.",
      "Project و Disease Type را یکی در نظر نگیرید؛ Project واحد مطالعه است، در حالی که Disease Type یک ویژگی تشخیصی برای Caseهاست.",
      "general",
    ),
    slide(
      "demographic",
      "Demographic",
      "Demographic: ویژگی‌های جمعیت‌شناختی بیماران",
      "این بخش متغیرهای جمعیت‌شناختی Caseها را در اختیار می‌گذارد؛ مانند سن، جنس، نژاد، قومیت یا سایر ویژگی‌هایی که بسته به داده‌های موجود در GDC قابل فیلتر هستند.",
      "وقتی طراحی مطالعه شما گروه‌های سنی یا جمعیت‌های مشخص را مقایسه می‌کند، معیارهای inclusion و exclusion جمعیت‌شناختی از اینجا وارد Cohort می‌شوند.",
      "وجود متغیر در رابط کاربری تضمین نمی‌کند که برای همه Caseها مقدار ثبت شده باشد؛ Missingness را بعداً بررسی کنید.",
      "demographic",
    ),
    slide(
      "general-diagnosis",
      "General Diagnosis",
      "General Diagnosis: تشخیص کلی را دقیق کنید",
      "این دسته برای محدود کردن Caseها بر اساس ویژگی‌های تشخیصی عمومی استفاده می‌شود؛ اطلاعاتی که کمک می‌کنند مشخص شود کدام تشخیص‌ها واقعاً وارد جمعیت مطالعه شوند.",
      "اگر سؤال شما روی یک تشخیص مشخص یا زیرگروه بیماری متمرکز است، این بخش یکی از اصلی‌ترین نقاط ساخت معیار ورود بیمار است.",
      "Primary Diagnosis، Disease Type و Site مفاهیم متفاوتی هستند. فیلتر درست را بر اساس سؤال پژوهشی انتخاب کنید.",
      "general-diagnosis",
    ),
    slide(
      "disease-status-history",
      "Disease Status & History",
      "Disease Status and History: وضعیت و سیر بیماری",
      "این بخش متغیرهای مرتبط با وضعیت بیماری و تاریخچه بالینی را گروه‌بندی می‌کند؛ بسته به Project می‌تواند اطلاعاتی درباره رخدادها یا وضعیت بیماری در طول مسیر بالینی داشته باشد.",
      "برای مطالعاتی که وضعیت بیماری، عود یا سیر بالینی در تعریف cohort نقش دارد، این دسته نقطه بررسی متغیرهای مرتبط است.",
      "پوشش زمانی و کامل بودن history بین پروژه‌ها یکسان نیست؛ قبل از تحلیل، تعداد Caseهای دارای داده قابل استفاده را بررسی کنید.",
      "disease-status-history",
    ),
    slide(
      "disease-specific",
      "Disease Specific",
      "Disease Specific Classifications: طبقه‌بندی‌های اختصاصی بیماری",
      "اینجا فیلدهایی قرار می‌گیرند که به طبقه‌بندی‌های اختصاصی یک بیماری یا خانواده بیماری مربوط‌اند و لزوماً برای همه سرطان‌ها یکسان نیستند.",
      "اگر طراحی شما به یک classification اختصاصی وابسته است، این بخش کمک می‌کند cohort بر اساس همان چارچوب بیماری محدود شود.",
      "یک classification اختصاصی را بدون توجه به نوع سرطان به همه پروژه‌ها تعمیم ندهید.",
      "disease-specific",
    ),
    slide(
      "treatment",
      "Treatment",
      "Treatment: سابقه درمان را وارد تعریف Cohort کنید",
      "Treatment متغیرهای مربوط به درمان‌های ثبت‌شده را در یک خانواده قرار می‌دهد. نوع و جزئیات درمان در دسترس به Project و کیفیت metadata آن وابسته است.",
      "برای مقایسه پاسخ یا پیامد در گروه‌های درمانی، این بخش می‌تواند بخشی از تعریف جمعیت مطالعه باشد.",
      "نبود یک مقدار درمانی همیشه به معنی «درمان نشده» نیست؛ ممکن است اطلاعات ثبت نشده یا ناقص باشد.",
      "treatment",
    ),
    slide(
      "exposure",
      "Exposure",
      "Exposure: مواجهه‌ها و عوامل زمینه‌ای",
      "این دسته برای متغیرهای مربوط به exposure یا عوامل زمینه‌ای ثبت‌شده در پرونده‌هاست؛ دامنه دقیق متغیرها به پروژه و سرطان مورد مطالعه بستگی دارد.",
      "اگر عامل مواجهه بخشی از فرضیه شماست، از این دسته برای تعریف یا توصیف زیرگروه‌ها استفاده کنید.",
      "Exposure data معمولاً ناهمگون است؛ قبل از استفاده تحلیلی، تعریف متغیر و میزان داده گمشده را بررسی کنید.",
      "exposure",
    ),
    slide(
      "other-clinical",
      "Other Clinical",
      "Other Clinical Attributes: متغیرهای بالینی تکمیلی",
      "متغیرهای بالینی مهمی که در دسته‌های اصلی جا نمی‌گیرند می‌توانند در این بخش قرار داشته باشند. این قسمت برای یافتن معیارهای تکمیلی طراحی مطالعه مفید است.",
      "بعد از تعریف معیارهای اصلی، این بخش را برای متغیرهای تکمیلی که می‌توانند confounder یا covariate باشند بررسی کنید.",
      "به‌دلیل تنوع فیلدها، قبل از فیلتر کردن معنی دقیق هر attribute را در metadata یا مستندات بررسی کنید.",
      "other-clinical",
    ),
    slide(
      "biospecimen",
      "Biospecimen",
      "Biospecimen: از بیمار به نمونه زیستی برسید",
      "Biospecimen برای محدود کردن cohort بر اساس ویژگی‌های نمونه زیستی است؛ مانند نوع نمونه، منبع بافت و سطوح مختلف Sample یا مشتقات آن بسته به داده‌های موجود.",
      "برای جدا کردن Tumor از Normal یا انتخاب نوع نمونه مناسب آزمایش، این بخش نقش کلیدی دارد.",
      "Case و Sample یک چیز نیستند. یک Case می‌تواند چند Sample داشته باشد و انتخاب نمونه می‌تواند تعداد داده‌های قابل تحلیل را تغییر دهد.",
      "biospecimen",
    ),
    slide(
      "genomic-filters",
      "Genomic Filters",
      "Genomic Filters: معیارهای مولکولی را وارد Cohort کنید",
      "این دسته برای محدودسازی بر اساس ویژگی‌های ژنومی قابل پشتیبانی در GDC استفاده می‌شود. فیلدهای دقیق و در دسترس می‌توانند با نوع داده و نسخه پرتال تغییر کنند.",
      "وقتی فرضیه شما به یک ویژگی مولکولی مشخص وابسته است، این بخش می‌تواند تعریف cohort را از سطح بالینی به سطح ژنومی ببرد.",
      "فیلتر ژنومی را فقط زمانی استفاده کنید که داده و تعریف زیستی آن با سؤال پژوهشی شما سازگار باشد.",
      "genomic-filters",
    ),
    slide(
      "available-data",
      "Available Data",
      "Available Data: مطمئن شوید Caseها داده موردنیاز را دارند",
      "این دسته به شما کمک می‌کند جمعیت را بر اساس در دسترس بودن انواع داده محدود کنید تا Caseهایی باقی بمانند که برای مرحله تحلیل واقعاً داده قابل استفاده دارند.",
      "برای مثال، پیش از تحلیل RNA-seq می‌توانید cohort را به Caseهایی محدود کنید که داده مرتبط با تحلیل شما برایشان موجود است.",
      "وجود Case در Project به معنی وجود همه نوع فایل برای آن Case نیست؛ availability را جداگانه کنترل کنید.",
      "available-data",
    ),
    slide(
      "custom-filters",
      "Custom Filters",
      "Custom Filters: وقتی فیلتر آماده کافی نیست",
      "Custom Filters برای ساخت محدودیت‌های پیشرفته‌تر یا استفاده از فیلدهایی است که در میان میانبرهای اصلی رابط کاربری قرار نگرفته‌اند.",
      "اگر معیار inclusion یا exclusion شما در دسته‌های متداول دیده نمی‌شود، این بخش می‌تواند مسیر ساخت فیلتر دقیق‌تر باشد.",
      "فیلتر سفارشی را مستند کنید تا تعریف Cohort شما قابل بازتولید و قابل توضیح باقی بماند.",
      "custom-filters",
    ),
  ],
  hotspots: [
    hotspot("sidebar", "دسته‌های فیلتر Cohort Builder", 0.5, 32.8, 14.7, 63.2, ["overview"]),
    hotspot("general", "General", 0.5, 33.1, 14.7, 4.9, ["general"]),
    hotspot("demographic", "Demographic", 0.5, 38.5, 14.7, 4.8, ["demographic"]),
    hotspot("general-diagnosis", "General Diagnosis", 0.5, 43.8, 14.7, 4.8, ["general-diagnosis"]),
    hotspot("disease-status-history", "Disease Status and History", 0.5, 49.1, 14.7, 4.8, ["disease-status-history"]),
    hotspot("disease-specific", "Disease Specific Classifications", 0.5, 54.4, 14.7, 4.8, ["disease-specific"]),
    hotspot("treatment", "Treatment", 0.5, 59.7, 14.7, 4.7, ["treatment"]),
    hotspot("exposure", "Exposure", 0.5, 64.9, 14.7, 4.7, ["exposure"]),
    hotspot("other-clinical", "Other Clinical Attributes", 0.5, 70.2, 14.7, 4.7, ["other-clinical"]),
    hotspot("biospecimen", "Biospecimen", 0.5, 75.5, 14.7, 4.7, ["biospecimen"]),
    hotspot("genomic-filters", "Genomic Filters", 0.5, 80.8, 14.7, 4.7, ["genomic-filters"]),
    hotspot("available-data", "Available Data", 0.5, 86.1, 14.7, 4.7, ["available-data"]),
    hotspot("custom-filters", "Custom Filters", 0.5, 91.3, 14.7, 4.8, ["custom-filters"]),
  ],
};

function stringOr(value: unknown, fallback: string) {
  return typeof value === "string" ? value : fallback;
}

function numberOr(value: unknown, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function booleanOr(value: unknown, fallback: boolean) {
  return typeof value === "boolean" ? value : fallback;
}

function stringArrayOr(value: unknown, fallback: string[]) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string" && item.length > 0)
    : fallback;
}

function normalizeSlide(
  value: any,
  fallback: GdcCohortBuilderFiltersSlide,
): GdcCohortBuilderFiltersSlide {
  return {
    key: stringOr(value?.key, fallback.key),
    tabLabel: stringOr(value?.tabLabel, fallback.tabLabel),
    title: stringOr(value?.title, fallback.title),
    body: stringOr(value?.body, fallback.body),
    researchUse: stringOr(value?.researchUse, fallback.researchUse),
    caution: stringOr(value?.caution, fallback.caution),
    hotspotKey: stringOr(value?.hotspotKey, fallback.hotspotKey),
  };
}

function normalizeHotspot(
  value: any,
  fallback: GdcCohortBuilderFiltersHotspot,
): GdcCohortBuilderFiltersHotspot {
  return {
    key: stringOr(value?.key, fallback.key),
    label: stringOr(value?.label, fallback.label),
    x: numberOr(value?.x, fallback.x),
    y: numberOr(value?.y, fallback.y),
    width: numberOr(value?.width, fallback.width),
    height: numberOr(value?.height, fallback.height),
    enabled: booleanOr(value?.enabled, fallback.enabled),
    slideKeys: stringArrayOr(value?.slideKeys, fallback.slideKeys),
  };
}

function genericSlide(index: number): GdcCohortBuilderFiltersSlide {
  return slide(
    `slide-${index + 1}`,
    `Slide ${index + 1}`,
    `Slide ${index + 1}`,
    "",
    "",
    "",
    "",
  );
}

function genericHotspot(index: number): GdcCohortBuilderFiltersHotspot {
  return hotspot(`hotspot-${index + 1}`, `Hotspot ${index + 1}`, 5, 5, 12, 6, []);
}

export function parseGdcCohortBuilderFiltersConfig(
  raw?: string | null,
): GdcCohortBuilderFiltersConfig {
  const defaults = DEFAULT_GDC_COHORT_BUILDER_FILTERS_CONFIG;
  if (!raw) return structuredClone(defaults);

  try {
    const parsed = JSON.parse(raw) as Partial<GdcCohortBuilderFiltersConfig>;

    const slides = Array.isArray(parsed.slides)
      ? parsed.slides.map((value: any, index) => {
          const fallback =
            defaults.slides.find((item) => item.key === value?.key) ??
            defaults.slides[index] ??
            genericSlide(index);
          return normalizeSlide(value, fallback);
        })
      : defaults.slides.map((item) => ({ ...item }));

    const hotspots = Array.isArray(parsed.hotspots)
      ? parsed.hotspots.map((value: any, index) => {
          const defaultMatch =
            defaults.hotspots.find((item) => item.key === value?.key) ??
            defaults.hotspots[index] ??
            genericHotspot(index);
          const inferredSlideKeys = slides
            .filter((item) => item.hotspotKey === stringOr(value?.key, defaultMatch.key))
            .map((item) => item.key);
          const fallback = {
            ...defaultMatch,
            slideKeys:
              defaultMatch.slideKeys.length > 0
                ? defaultMatch.slideKeys
                : inferredSlideKeys,
          };
          return normalizeHotspot(value, fallback);
        })
      : defaults.hotspots.map((item) => ({ ...item, slideKeys: [...item.slideKeys] }));

    return {
      title: stringOr(parsed.title, defaults.title),
      imageUrl: stringOr(parsed.imageUrl, defaults.imageUrl),
      introLabel: stringOr(parsed.introLabel, defaults.introLabel),
      introBody: stringOr(parsed.introBody, defaults.introBody),
      nextButton: stringOr(parsed.nextButton, defaults.nextButton),
      slides,
      hotspots,
    };
  } catch {
    return structuredClone(defaults);
  }
}

export function getGdcCohortBuilderFiltersConfig(
  content: Array<{ key?: string; value?: string }> | null | undefined,
) {
  const raw = content?.find(
    (item) => item.key === GDC_COHORT_BUILDER_FILTERS_CONTENT_KEY,
  )?.value;
  return parseGdcCohortBuilderFiltersConfig(raw);
}

export function toGdcCohortBuilderFiltersContent(
  config: GdcCohortBuilderFiltersConfig,
) {
  return {
    key: GDC_COHORT_BUILDER_FILTERS_CONTENT_KEY,
    label: "GDC question 2 cohort builder filters stage configuration",
    value: JSON.stringify(config),
  };
}
