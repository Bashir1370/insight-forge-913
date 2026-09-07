export const GDC_PROJECT_SUMMARY_CONTENT_KEY = "gdc_project_summary_stage_v1";

export type GdcProjectSummaryHotspot = {
  key: string;
  label: string;
  short: string;
  body: string;
  researchUse: string;
  caution?: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

export type GdcProjectSummaryQuickCheck = {
  title: string;
  body: string;
};

export type GdcProjectSummaryConfig = {
  title: string;
  imageUrl: string;
  mapEyebrow: string;
  mapInstruction: string;
  badge: string;
  intro: string;
  goalTitle: string;
  goalBody: string;
  quickChecksTitle: string;
  quickChecks: GdcProjectSummaryQuickCheck[];
  quizTitle: string;
  quizQuestion: string;
  quizAnswer: string;
  quizButtonLabel: string;
  numbersTitle: string;
  numbersBody: string;
  hotspots: GdcProjectSummaryHotspot[];
};

export const DEFAULT_GDC_PROJECT_SUMMARY_CONFIG: GdcProjectSummaryConfig = {
  title: "خواندن اطلاعات پروژه",
  imageUrl: "/images/gdc/gdc-project-summary-reading.png",
  mapEyebrow: "Project Summary · نقشه خواندن صفحه",
  mapInstruction: "روی بخش‌های تصویر کلیک کنید تا نقش آن‌ها را ببینید.",
  badge: "TCGA-KIRC نمونه آموزشی",
  intro:
    "حالا که Project مناسب را محدود کرده‌ایم، باید خلاصه آن را بخوانیم و بفهمیم چه داده، metadata و مسیر دانلودی واقعاً در اختیار ماست.",
  goalTitle: "این مرحله قرار است چه چیزی را روشن کند؟",
  goalBody:
    "هدف فقط شناخت دکمه‌ها نیست. باید بتوانید از Project Summary جواب بگیرید: «آیا این Project واقعاً داده مناسب سؤال پژوهشی من را دارد؟»",
  quickChecksTitle: "برای ارزیابی سریع یک Project این ترتیب را بخوانید",
  quickChecks: [
    {
      title: "اول نوع داده",
      body: "در Data Category بررسی کنید جنس داده موردنیاز شما وجود دارد.",
    },
    {
      title: "بعد روش تولید",
      body: "در Experimental Strategy مطمئن شوید فناوری مناسب تحلیل شما وجود دارد.",
    },
    {
      title: "بعد metadata",
      body: "Clinical و Biospecimen را برای سازگاری با طراحی مطالعه بررسی کنید.",
    },
  ],
  quizTitle: "یک سؤال کوتاه برای خودآزمایی",
  quizQuestion:
    "برای اینکه مطمئن شویم یک Project برای تحلیل RNA-seq مناسب است، فقط دیدن Transcriptome Profiling کافی است؟",
  quizAnswer:
    "خیر. وجود Transcriptome Profiling نوع کلی داده را نشان می‌دهد؛ باید در Experimental Strategy هم وجود RNA-Seq را تأیید کنید و سپس metadata بالینی/نمونه‌ای را با طراحی مطالعه تطبیق دهید.",
  quizButtonLabel: "پاسخ را ببین",
  numbersTitle: "نکته درباره اعداد تصویر",
  numbersBody:
    "تعداد Cases، Files و Annotations در GDC می‌تواند با releaseهای داده تغییر کند. در آموزش، مفهوم این اعداد مهم‌تر از حفظ مقدار دقیق آن‌هاست.",
  hotspots: [
    {
      key: "save-cohort",
      label: "Save New Cohort",
      short: "ذخیره گروهی از Caseها برای ادامه کار",
      body:
        "این گزینه انتخاب فعلی Caseها را به‌عنوان یک Cohort ذخیره می‌کند تا بتوانید همان گروه را بعداً در بخش‌های دیگر GDC دوباره استفاده کنید. این دکمه فایل داده را دانلود نمی‌کند؛ فقط گروه مطالعه را ذخیره می‌کند.",
      researchUse:
        "وقتی فیلترهای شما گروه مشخصی از بیماران یا نمونه‌ها را ساخته‌اند، Cohort ذخیره‌شده کمک می‌کند همان جمعیت پژوهشی را در مراحل بعدی حفظ کنید.",
      caution:
        "Cohort با Project یکی نیست. Project کل مطالعه است؛ Cohort زیرمجموعه‌ای از Caseهاست که با معیارهای شما انتخاب شده‌اند.",
      x: 5.8,
      y: 16.5,
      width: 10.4,
      height: 5.6,
    },
    {
      key: "biospecimen",
      label: "Biospecimen",
      short: "اطلاعات نمونه‌های زیستی پروژه",
      body:
        "از این بخش می‌توانید metadata مربوط به نمونه‌های زیستی را دریافت کنید؛ اطلاعاتی درباره Sample، Portion، Analyte، Aliquot و سایر سطوحی که منشأ و مسیر آماده‌سازی نمونه را توصیف می‌کنند.",
      researchUse:
        "اگر تحلیل شما به نوع نمونه، منشأ بافت یا تفاوت Tumor و Normal حساس است، قبل از دانلود داده باید Biospecimen metadata را بررسی کنید.",
      caution:
        "وجود فایل مولکولی به‌تنهایی کافی نیست؛ باید مطمئن شوید نمونه‌های متناظر با طراحی مطالعه شما سازگارند.",
      x: 16.4,
      y: 16.5,
      width: 11.5,
      height: 5.6,
    },
    {
      key: "clinical",
      label: "Clinical",
      short: "اطلاعات بالینی Caseهای پروژه",
      body:
        "این گزینه برای دریافت clinical metadata پروژه است؛ متغیرهایی مانند diagnosis، demographic information، stage و سایر اطلاعات بالینی بسته به پروژه می‌توانند در دسترس باشند.",
      researchUse:
        "برای مقایسه گروه‌های بالینی، تحلیل بقا یا ساخت متغیرهای توضیحی باید از همین ابتدا بررسی کنید که اطلاعات بالینی موردنیاز شما وجود دارد یا نه.",
      caution:
        "کامل‌بودن متغیرهای Clinical بین Projectها یکسان نیست. وجود بخش Clinical به معنی کامل بودن همه متغیرها برای همه Caseها نیست.",
      x: 27.8,
      y: 16.5,
      width: 9.1,
      height: 5.6,
    },
    {
      key: "manifest",
      label: "Manifest",
      short: "فهرست فایل‌ها برای دریافت دسته‌ای",
      body:
        "Manifest فهرستی از شناسه فایل‌های داده است که می‌تواند برای دانلود دسته‌ای، از جمله با GDC Data Transfer Tool، استفاده شود. Manifest خودِ داده نیست؛ فهرست فایل‌هایی است که قرار است دریافت شوند.",
      researchUse:
        "وقتی به فایل‌های درست رسیده‌اید و می‌خواهید دانلود را reproducible و قابل پیگیری نگه دارید، Manifest پل بین انتخاب فایل و دریافت واقعی داده است.",
      caution:
        "قبل از ساخت Manifest، Data Category، Experimental Strategy و سطح پردازش فایل‌ها را بررسی کنید تا فایل نامناسب وارد دانلود نشود.",
      x: 37.2,
      y: 16.5,
      width: 7.9,
      height: 5.6,
    },
    {
      key: "project-counts",
      label: "Cases · Files · Annotations",
      short: "اندازه پروژه را در یک نگاه بخوانید",
      body:
        "بالای Project Summary تعداد کل Cases، Files و Annotations نمایش داده می‌شود. Case واحد مورد مطالعه است، در حالی که هر Case می‌تواند چندین فایل داشته باشد؛ بنابراین تعداد Files معمولاً بسیار بیشتر از Cases است.",
      researchUse:
        "این اعداد برای برآورد اولیه اندازه مطالعه مفیدند، اما برای تعیین sample size قابل تحلیل باید بعداً محدودیت‌های نوع داده، نمونه و metadata را هم اعمال کنید.",
      caution:
        "تعداد زیاد Files به معنی تعداد زیاد بیمار نیست. همیشه Case count و File count را جداگانه تفسیر کنید.",
      x: 50.2,
      y: 16.2,
      width: 37.2,
      height: 6,
    },
    {
      key: "data-category",
      label: "Data Category",
      short: "چه جنس داده‌ای در Project وجود دارد؟",
      body:
        "جدول سمت چپ فایل‌ها را بر اساس دسته کلی داده گروه‌بندی می‌کند؛ مثل Clinical، Biospecimen، Transcriptome Profiling، DNA Methylation یا Simple Nucleotide Variation. ستون Cases نشان می‌دهد چند Case حداقل داده‌ای در آن دسته دارند و ستون Files تعداد فایل‌های همان دسته را نشان می‌دهد.",
      researchUse:
        "برای RNA-seq ابتدا باید ببینید دسته مرتبط، یعنی Transcriptome Profiling، در پروژه وجود دارد. برای تحلیل جهش به دسته‌های مربوط به variation نگاه می‌کنید.",
      caution:
        "Data Category روش آزمایشی نیست. این جدول می‌گوید چه نوع داده‌ای دارید، نه اینکه داده دقیقاً با چه فناوری تولید شده است.",
      x: 5.2,
      y: 23.7,
      width: 43.3,
      height: 70.4,
    },
    {
      key: "experimental-strategy",
      label: "Experimental Strategy",
      short: "داده با چه روش یا فناوری تولید شده؟",
      body:
        "جدول سمت راست روش آزمایشی تولید داده را نشان می‌دهد؛ مثل RNA-Seq، WXS، WGS، miRNA-Seq یا Methylation Array. Cases تعداد Caseهایی است که داده حاصل از آن strategy را دارند و Files تعداد فایل‌های مربوط به همان strategy است.",
      researchUse:
        "اگر سؤال شما تحلیل بیان ژن با RNA-seq است، فقط دیدن Transcriptome Profiling کافی نیست؛ باید در این جدول وجود RNA-Seq را هم تأیید کنید.",
      caution:
        "یک Case می‌تواند چند نوع داده و چند Experimental Strategy داشته باشد؛ بنابراین ردیف‌ها لزوماً مجموعه‌های جدا از هم نیستند.",
      x: 49,
      y: 23.7,
      width: 43.8,
      height: 70.4,
    },
  ],
};

function numberOr(value: unknown, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function normalizeHotspot(value: any, index: number): GdcProjectSummaryHotspot {
  const fallback = DEFAULT_GDC_PROJECT_SUMMARY_CONFIG.hotspots[index] ?? {
    key: `hotspot-${index + 1}`,
    label: `Hotspot ${index + 1}`,
    short: "",
    body: "",
    researchUse: "",
    caution: "",
    x: 10,
    y: 10,
    width: 10,
    height: 10,
  };

  return {
    key: typeof value?.key === "string" && value.key ? value.key : fallback.key,
    label: typeof value?.label === "string" ? value.label : fallback.label,
    short: typeof value?.short === "string" ? value.short : fallback.short,
    body: typeof value?.body === "string" ? value.body : fallback.body,
    researchUse:
      typeof value?.researchUse === "string" ? value.researchUse : fallback.researchUse,
    caution: typeof value?.caution === "string" ? value.caution : fallback.caution,
    x: numberOr(value?.x, fallback.x),
    y: numberOr(value?.y, fallback.y),
    width: numberOr(value?.width, fallback.width),
    height: numberOr(value?.height, fallback.height),
  };
}

export function parseGdcProjectSummaryConfig(raw?: string | null): GdcProjectSummaryConfig {
  if (!raw) return structuredClone(DEFAULT_GDC_PROJECT_SUMMARY_CONFIG);

  try {
    const parsed = JSON.parse(raw) as Partial<GdcProjectSummaryConfig>;
    const defaults = DEFAULT_GDC_PROJECT_SUMMARY_CONFIG;

    return {
      ...defaults,
      ...parsed,
      quickChecks: Array.isArray(parsed.quickChecks)
        ? parsed.quickChecks.map((item) => ({
            title: typeof item?.title === "string" ? item.title : "",
            body: typeof item?.body === "string" ? item.body : "",
          }))
        : defaults.quickChecks.map((item) => ({ ...item })),
      hotspots: Array.isArray(parsed.hotspots)
        ? parsed.hotspots.map(normalizeHotspot)
        : defaults.hotspots.map((item) => ({ ...item })),
    };
  } catch {
    return structuredClone(DEFAULT_GDC_PROJECT_SUMMARY_CONFIG);
  }
}

export function getGdcProjectSummaryConfig(
  content: Array<{ key?: string; value?: string }> | null | undefined,
) {
  const raw = content?.find((item) => item.key === GDC_PROJECT_SUMMARY_CONTENT_KEY)?.value;
  return parseGdcProjectSummaryConfig(raw);
}

export function toGdcProjectSummaryContent(config: GdcProjectSummaryConfig) {
  return {
    key: GDC_PROJECT_SUMMARY_CONTENT_KEY,
    label: "GDC project summary reading stage configuration",
    value: JSON.stringify(config),
  };
}
