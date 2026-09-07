import type { GdcQuestionGuideConfig } from "./gdc-question-guide-config";

export type GdcStageOneHotspotGeometry = {
  x: number;
  y: number;
  width: number;
  height: number;
};

const LEGACY_STAGE_ONE_ISSUE =
  "فرض کنید موضوع پژوهش ما سرطان پستان است. قبل از انتخاب بیمار، دانلود فایل یا تحلیل، اول باید روشن کنیم: آیا GDC اصلاً داده مناسبی برای این موضوع دارد؟";
const LEGACY_STAGE_ONE_PROJECT_TITLE = "Project در GDC یعنی چه؟";

/**
 * Upgrades only the original bundled copy. Once an admin changes the stage-one
 * narrative, their copy is left untouched.
 */
export function prepareGdcStageOnePolish(
  config: GdcQuestionGuideConfig,
): GdcQuestionGuideConfig {
  const next = structuredClone(config);
  const intro = next.intro;

  const isLegacyCopy =
    intro.issueBody.trim() === LEGACY_STAGE_ONE_ISSUE &&
    intro.projectTitle.trim() === LEGACY_STAGE_ONE_PROJECT_TITLE;

  if (!isLegacyCopy) return next;

  intro.issueLabel = "سناریوی پژوهشی";
  intro.issueBody =
    "فرض کنید می‌خواهیم داده‌های سرطان پستان را در GDC پیدا کنیم. هنوز وقت انتخاب بیمار یا دانلود فایل نیست؛ سؤال اول این است: «اصلاً چه مطالعه‌ها و چه نوع داده‌ای برای این موضوع در GDC وجود دارد؟»";
  intro.entryBody =
    "برای پاسخ، از Projects شروع می‌کنیم؛ جایی که نقشه مطالعه‌های موجود را می‌بینیم و می‌فهمیم کدام مسیر ارزش ادامه دادن دارد.";

  intro.projectTitle = "چرا Projects نقطه شروع ماست؟";
  intro.projectBody =
    "در GDC داده‌ها داخل Projectها سازمان‌دهی شده‌اند. هر Project یک مطالعه مشخص است که Caseها، نمونه‌ها و فایل‌های مرتبط را زیر یک چارچوب مشترک جمع می‌کند.";
  intro.projectCaveat =
    "پس فعلاً Project را «مطالعه» در نظر بگیرید؛ نه یک بیمار، نه یک فایل و نه صرفاً نام یک سرطان.";

  intro.architectureTitle = "جای Project در معماری GDC";
  intro.architectureIntro =
    "قبل از ورود، فقط این زنجیره ساده را در ذهن نگه دارید:";
  intro.architectureCards = [
    { title: "Program", subtitle: "چتر پژوهشی بزرگ‌تر" },
    { title: "Project", subtitle: "یک مطالعه مشخص" },
    { title: "Cases", subtitle: "موارد مطالعه" },
    { title: "Data / Files", subtitle: "داده‌های مرتبط" },
  ];
  intro.architectureSummary =
    "مسیر ساده این است: Program → Project → Cases → Data / Files. در این مرحله فقط روی Project تمرکز داریم.";

  intro.missionTitle = "ماموریت این مرحله";
  intro.missionBody =
    "در تصویر واقعی GDC، گزینه Projects را پیدا کنید و روی ناحیه مشخص‌شده کلیک کنید. وقتی آن را پیدا کردید، نقطه ورود برای بررسی مطالعه‌های مرتبط با سؤال پژوهشی‌تان روشن شده است.";
  intro.nextButton = "Projects را پیدا کردم؛ ادامه بده";

  return next;
}

function finiteNumber(value: unknown): number | null {
  const number = typeof value === "number" ? value : Number(value);
  return Number.isFinite(number) ? number : null;
}

export function getGdcStageOneProjectHotspot(
  managedHotspots: unknown[] | undefined,
): GdcStageOneHotspotGeometry | null {
  if (!Array.isArray(managedHotspots)) return null;

  const candidate = managedHotspots.find((item) => {
    if (!item || typeof item !== "object") return false;
    return (item as { key?: unknown }).key === "projects";
  }) as Record<string, unknown> | undefined;

  if (!candidate) return null;

  const x = finiteNumber(candidate.x);
  const y = finiteNumber(candidate.y);
  const width = finiteNumber(candidate.width);
  const height = finiteNumber(candidate.height);

  if (x === null || y === null || width === null || height === null) return null;

  return { x, y, width, height };
}
