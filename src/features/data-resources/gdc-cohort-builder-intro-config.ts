export const GDC_COHORT_BUILDER_INTRO_CONTENT_KEY = "gdc_cohort_builder_intro_stage_v1";

export type GdcCohortBuilderIntroHotspot = {
  key: "top-nav" | "core-tool" | string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

export type GdcCohortBuilderIntroConfig = {
  title: string;
  imageUrl: string;
  issueLabel: string;
  issueBody: string;
  entryBody: string;
  cohortTitle: string;
  cohortBody: string;
  cohortCaveat: string;
  entryTitle: string;
  entryIntro: string;
  topNavTitle: string;
  topNavBody: string;
  coreToolTitle: string;
  coreToolBody: string;
  nextButton: string;
  hotspots: GdcCohortBuilderIntroHotspot[];
};

export const DEFAULT_GDC_COHORT_BUILDER_INTRO_CONFIG: GdcCohortBuilderIntroConfig = {
  title: "از Project به Cohort Builder برویم",
  imageUrl: "",
  issueLabel: "حالا سؤال پژوهشی یک لایه دقیق‌تر می‌شود",
  issueBody:
    "در سؤال ۱ Project مناسب را پیدا کردیم و فهمیدیم چه داده‌هایی در آن وجود دارد. حالا دیگر سؤال ما «کدام Project؟» نیست؛ باید مشخص کنیم کدام Caseها و نمونه‌ها واقعاً وارد مطالعه ما شوند.",
  entryBody:
    "برای ساختن این جمعیت پژوهشی، ابزار اصلی ما در GDC بخش Cohort Builder است.",
  cohortTitle: "Cohort Builder دقیقاً چه کاری انجام می‌دهد؟",
  cohortBody:
    "Cohort Builder محیطی برای ساخت و محدود کردن یک گروه پژوهشی از Caseها و نمونه‌هاست. اینجا معیارهای بالینی و Biospecimen را مرحله‌به‌مرحله اعمال می‌کنیم تا از کل داده‌های GDC به جمعیتی برسیم که با طراحی مطالعه ما سازگار است.",
  cohortCaveat:
    "Cohort با Project یکی نیست. Project یک مطالعه کامل است؛ Cohort گروهی از Caseها یا نمونه‌هاست که با معیارهای پژوهشی شما از یک یا چند مجموعه داده انتخاب شده‌اند.",
  entryTitle: "از کجا وارد Cohort Builder شویم؟",
  entryIntro:
    "در صفحه اصلی GDC دو ورودی واضح برای این ابزار می‌بینید. هر دو شما را به همان فضای ساخت Cohort هدایت می‌کنند.",
  topNavTitle: "Cohort Builder در نوار بالای GDC",
  topNavBody:
    "این مسیر سریع‌ترین ورودی هنگام کار در پرتال است و از بیشتر صفحات اصلی GDC در دسترس می‌ماند.",
  coreToolTitle: "Cohort Builder در بخش Core Tools",
  coreToolBody:
    "کارت Cohort Builder در صفحه اصلی هم همان ابزار را معرفی می‌کند و به‌وضوح توضیح می‌دهد که برای ساخت Cohort از ویژگی‌های Clinical و Biospecimen استفاده می‌شود.",
  nextButton: "وارد Cohort Builder شویم",
  hotspots: [
    {
      key: "top-nav",
      label: "Cohort Builder · نوار بالا",
      x: 18.7,
      y: 8.2,
      width: 11.6,
      height: 10.8,
    },
    {
      key: "core-tool",
      label: "Cohort Builder · Core Tools",
      x: 28,
      y: 38.9,
      width: 26.2,
      height: 14.4,
    },
  ],
};

function numberOr(value: unknown, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function normalizeHotspot(value: any, index: number): GdcCohortBuilderIntroHotspot {
  const fallback = DEFAULT_GDC_COHORT_BUILDER_INTRO_CONFIG.hotspots[index] ?? {
    key: `hotspot-${index + 1}`,
    label: `Hotspot ${index + 1}`,
    x: 10,
    y: 10,
    width: 12,
    height: 8,
  };

  return {
    key: typeof value?.key === "string" && value.key ? value.key : fallback.key,
    label: typeof value?.label === "string" ? value.label : fallback.label,
    x: numberOr(value?.x, fallback.x),
    y: numberOr(value?.y, fallback.y),
    width: numberOr(value?.width, fallback.width),
    height: numberOr(value?.height, fallback.height),
  };
}

export function parseGdcCohortBuilderIntroConfig(raw?: string | null): GdcCohortBuilderIntroConfig {
  if (!raw) return structuredClone(DEFAULT_GDC_COHORT_BUILDER_INTRO_CONFIG);

  try {
    const parsed = JSON.parse(raw) as Partial<GdcCohortBuilderIntroConfig>;
    const defaults = DEFAULT_GDC_COHORT_BUILDER_INTRO_CONFIG;
    return {
      ...defaults,
      ...parsed,
      hotspots: Array.isArray(parsed.hotspots)
        ? parsed.hotspots.map(normalizeHotspot)
        : defaults.hotspots.map((item) => ({ ...item })),
    };
  } catch {
    return structuredClone(DEFAULT_GDC_COHORT_BUILDER_INTRO_CONFIG);
  }
}

export function getGdcCohortBuilderIntroConfig(
  content: Array<{ key?: string; value?: string }> | null | undefined,
) {
  const raw = content?.find((item) => item.key === GDC_COHORT_BUILDER_INTRO_CONTENT_KEY)?.value;
  return parseGdcCohortBuilderIntroConfig(raw);
}

export function toGdcCohortBuilderIntroContent(config: GdcCohortBuilderIntroConfig) {
  return {
    key: GDC_COHORT_BUILDER_INTRO_CONTENT_KEY,
    label: "GDC question 2 cohort builder intro stage configuration",
    value: JSON.stringify(config),
  };
}
