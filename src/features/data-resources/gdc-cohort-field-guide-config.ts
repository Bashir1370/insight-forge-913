export const GDC_COHORT_FIELD_GUIDE_CONTENT_KEY = "gdc_cohort_field_guide_stage_v1";

export type GdcCohortFieldGuideField = {
  key: string;
  label: string;
  description: string;
  x: number;
  y: number;
  width: number;
  height: number;
  panelX: number;
  panelY: number;
  panelWidth: number;
  panelHeight: number;
};

export type GdcCohortFieldGuidePage = {
  key: string;
  imageUrl: string;
  fields: GdcCohortFieldGuideField[];
  spotlightFieldKey: string;
};

export type GdcCohortFieldGuideTab = {
  key: string;
  label: string;
  helper: string;
  pages: GdcCohortFieldGuidePage[];
};

export type GdcCohortFieldGuideConfig = {
  title: string;
  intro: string;
  instruction: string;
  tooltipHint: string;
  nextButton: string;
  tabs: GdcCohortFieldGuideTab[];
};

const field = (
  key: string,
  label: string,
  description: string,
  x: number,
  y: number,
  width: number,
  height: number,
  panelX: number,
  panelY: number,
  panelWidth: number,
  panelHeight: number,
): GdcCohortFieldGuideField => ({
  key,
  label,
  description,
  x,
  y,
  width,
  height,
  panelX,
  panelY,
  panelWidth,
  panelHeight,
});

const emptyTab = (key: string, label: string, helper: string): GdcCohortFieldGuideTab => ({
  key,
  label,
  helper,
  pages: [{ key: `${key}-1`, imageUrl: "", fields: [], spotlightFieldKey: "" }],
});

export const DEFAULT_GDC_COHORT_FIELD_GUIDE_CONFIG: GdcCohortFieldGuideConfig = {
  title: "فیلترهای داخل هر دسته را بشناسیم",
  intro:
    "در مرحله قبل نقشه دسته‌های Cohort Builder را شناختیم. حالا وارد هر دسته می‌شویم و فقط یاد می‌گیریم هر فیلتر چه کاری انجام می‌دهد؛ بدون اینکه هنوز وارد انتخاب مقدارها و ساخت Cohort نهایی شویم.",
  instruction:
    "برای اینکه ببینید هر فیلتر چه کاری انجام می‌دهد، نشانگر ماوس را روی عنوان آن ببرید یا روی عنوان کلیک کنید.",
  tooltipHint: "توضیح کوتاه این فیلتر",
  nextButton: "ادامه ساخت Cohort",
  tabs: [
    {
      key: "general",
      label: "General",
      helper: "فیلترهای پایه برای محدود کردن Caseها و Projectها",
      pages: [
        {
          key: "general-1",
          imageUrl: "/images/gdc/gdc-cohort-builder-filters.webp",
          spotlightFieldKey: "program",
          fields: [
            field(
              "program",
              "Program",
              "چتر پژوهشی بزرگ‌تر در GDC است؛ مثل TCGA یا TARGET. Program چند Project مرتبط را زیر یک برنامه مشترک گروه‌بندی می‌کند.",
              15.7, 31.0, 20.4, 5.0,
              15.2, 29.2, 21.0, 31.9,
            ),
            field(
              "project",
              "Project",
              "یک مطالعه مشخص درون Program است؛ مثل TCGA-KIRC. با این فیلتر می‌توانید Caseها را به مطالعه یا پروژه موردنظر محدود کنید.",
              36.7, 31.0, 20.1, 5.0,
              36.3, 29.2, 20.8, 31.9,
            ),
            field(
              "disease-type",
              "Disease Type",
              "طبقه‌بندی کلی بیماری را نشان می‌دهد. از آن برای محدود کردن Caseها به یک خانواده یا نوع بیماری استفاده می‌کنید.",
              57.7, 31.0, 20.1, 5.0,
              57.4, 29.2, 20.7, 31.9,
            ),
            field(
              "primary-diagnosis",
              "Primary Diagnosis",
              "تشخیص اصلی ثبت‌شده برای Case را مشخص می‌کند و برای ساخت گروهی با تشخیص دقیق‌تر از Disease Type کاربرد دارد.",
              78.4, 31.0, 20.0, 5.0,
              78.1, 29.2, 20.8, 31.9,
            ),
            field(
              "primary-site",
              "Primary Site",
              "محل آناتومیکی اولیه‌ای است که بیماری یا تومور از آن منشأ گرفته؛ مثل kidney، breast یا lung.",
              15.7, 61.3, 20.4, 5.0,
              15.2, 60.9, 21.0, 29.0,
            ),
            field(
              "tissue-origin",
              "Tissue or Organ of Origin",
              "بافت یا اندام مبدأ ثبت‌شده در اطلاعات تشخیصی را نشان می‌دهد و می‌تواند برای محدودسازی دقیق‌تر منشأ بافتی استفاده شود.",
              36.7, 61.3, 20.1, 5.0,
              36.3, 60.9, 20.8, 29.0,
            ),
            field(
              "case-id",
              "Case ID",
              "برای انتخاب مستقیم Caseهای مشخص بر اساس شناسه استفاده می‌شود؛ مناسب وقتی فهرست Caseهای موردنظر را از قبل دارید.",
              57.7, 61.3, 20.1, 5.0,
              57.4, 60.9, 20.7, 29.0,
            ),
          ],
        },
      ],
    },
    emptyTab("demographic", "Demographic", "سن، جنس و سایر ویژگی‌های جمعیت‌شناختی"),
    emptyTab("general-diagnosis", "General Diagnosis", "فیلترهای تشخیصی عمومی"),
    emptyTab("disease-status-history", "Disease Status & History", "وضعیت و تاریخچه بیماری"),
    emptyTab("disease-specific", "Disease Specific", "طبقه‌بندی‌های اختصاصی بیماری"),
    emptyTab("treatment", "Treatment", "اطلاعات و سابقه درمان"),
    emptyTab("exposure", "Exposure", "مواجهه‌ها و عوامل زمینه‌ای"),
    emptyTab("other-clinical", "Other Clinical", "متغیرهای بالینی تکمیلی"),
    emptyTab("biospecimen", "Biospecimen", "ویژگی‌های نمونه‌های زیستی"),
    emptyTab("genomic-filters", "Genomic Filters", "فیلترهای مولکولی و ژنومی"),
    emptyTab("available-data", "Available Data", "در دسترس بودن انواع داده"),
    emptyTab("custom-filters", "Custom Filters", "فیلترهای پیشرفته و سفارشی"),
  ],
};

function stringOr(value: unknown, fallback: string) {
  return typeof value === "string" ? value : fallback;
}

function numberOr(value: unknown, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function normalizeField(value: any, fallback: GdcCohortFieldGuideField): GdcCohortFieldGuideField {
  return {
    key: stringOr(value?.key, fallback.key),
    label: stringOr(value?.label, fallback.label),
    description: stringOr(value?.description, fallback.description),
    x: numberOr(value?.x, fallback.x),
    y: numberOr(value?.y, fallback.y),
    width: numberOr(value?.width, fallback.width),
    height: numberOr(value?.height, fallback.height),
    panelX: numberOr(value?.panelX, fallback.panelX),
    panelY: numberOr(value?.panelY, fallback.panelY),
    panelWidth: numberOr(value?.panelWidth, fallback.panelWidth),
    panelHeight: numberOr(value?.panelHeight, fallback.panelHeight),
  };
}

function genericField(index: number): GdcCohortFieldGuideField {
  return field(`field-${index + 1}`, `Field ${index + 1}`, "", 10, 10, 15, 5, 10, 10, 15, 20);
}

function normalizePage(value: any, fallback: GdcCohortFieldGuidePage): GdcCohortFieldGuidePage {
  const fallbackFields = fallback.fields ?? [];
  const fields = Array.isArray(value?.fields)
    ? value.fields.map((raw: any, index: number) => {
        const matched = fallbackFields.find((item) => item.key === raw?.key) ?? fallbackFields[index] ?? genericField(index);
        return normalizeField(raw, matched);
      })
    : fallbackFields.map((item) => ({ ...item }));

  return {
    key: stringOr(value?.key, fallback.key),
    imageUrl: stringOr(value?.imageUrl, fallback.imageUrl),
    fields,
    spotlightFieldKey: stringOr(value?.spotlightFieldKey, fallback.spotlightFieldKey),
  };
}

function normalizeTab(value: any, fallback: GdcCohortFieldGuideTab): GdcCohortFieldGuideTab {
  const pages = Array.isArray(value?.pages)
    ? value.pages.map((raw: any, index: number) => {
        const matched = fallback.pages.find((item) => item.key === raw?.key) ?? fallback.pages[index] ?? {
          key: `page-${index + 1}`,
          imageUrl: "",
          fields: [],
          spotlightFieldKey: "",
        };
        return normalizePage(raw, matched);
      })
    : fallback.pages.map((item) => ({ ...item, fields: item.fields.map((fieldItem) => ({ ...fieldItem })) }));

  return {
    key: stringOr(value?.key, fallback.key),
    label: stringOr(value?.label, fallback.label),
    helper: stringOr(value?.helper, fallback.helper),
    pages,
  };
}

export function parseGdcCohortFieldGuideConfig(raw?: string | null): GdcCohortFieldGuideConfig {
  const defaults = DEFAULT_GDC_COHORT_FIELD_GUIDE_CONFIG;
  if (!raw) return structuredClone(defaults);

  try {
    const parsed = JSON.parse(raw) as Partial<GdcCohortFieldGuideConfig>;
    const tabs = Array.isArray(parsed.tabs)
      ? parsed.tabs.map((raw: any, index) => {
          const matched = defaults.tabs.find((item) => item.key === raw?.key) ?? defaults.tabs[index] ?? emptyTab(`tab-${index + 1}`, `Tab ${index + 1}`, "");
          return normalizeTab(raw, matched);
        })
      : structuredClone(defaults.tabs);

    return {
      title: stringOr(parsed.title, defaults.title),
      intro: stringOr(parsed.intro, defaults.intro),
      instruction: stringOr(parsed.instruction, defaults.instruction),
      tooltipHint: stringOr(parsed.tooltipHint, defaults.tooltipHint),
      nextButton: stringOr(parsed.nextButton, defaults.nextButton),
      tabs,
    };
  } catch {
    return structuredClone(defaults);
  }
}

export function getGdcCohortFieldGuideConfig(
  content: Array<{ key?: string; value?: string }> | null | undefined,
) {
  const raw = content?.find((item) => item.key === GDC_COHORT_FIELD_GUIDE_CONTENT_KEY)?.value;
  return parseGdcCohortFieldGuideConfig(raw);
}

export function toGdcCohortFieldGuideContent(config: GdcCohortFieldGuideConfig) {
  return {
    key: GDC_COHORT_FIELD_GUIDE_CONTENT_KEY,
    label: "GDC question 2 cohort field guide stage configuration",
    value: JSON.stringify(config),
  };
}
