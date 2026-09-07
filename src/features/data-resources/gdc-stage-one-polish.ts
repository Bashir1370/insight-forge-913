import "./gdc-stage-one-cleanup.css";

import type { GdcQuestionGuideConfig } from "./gdc-question-guide-config";

export type GdcStageOneHotspotGeometry = {
  x: number;
  y: number;
  width: number;
  height: number;
};

const LEGACY_STAGE_ONE_ISSUE =
  "فرض کنید موضوع پژوهش ما سرطان پستان است. قبل از انتخاب بیمار، دانلود فایل یا تحلیل، اول باید روشن کنیم: آیا GDC اصلاً داده مناسبی برای این موضوع دارد؟";
const POLISHED_STAGE_ONE_ISSUE =
  "فرض کنید می‌خواهیم داده‌های سرطان پستان را در GDC پیدا کنیم. هنوز وقت انتخاب بیمار یا دانلود فایل نیست؛ سؤال اول این است: «اصلاً چه مطالعه‌ها و چه نوع داده‌ای برای این موضوع در GDC وجود دارد؟»";
const LEGACY_STAGE_ONE_PROJECT_TITLE = "Project در GDC یعنی چه؟";
const POLISHED_STAGE_ONE_PROJECT_TITLE = "چرا Projects نقطه شروع ماست؟";

/**
 * Upgrades bundled / previously polished Stage 1 copy. If an admin has written
 * genuinely custom copy, it is left untouched.
 */
export function prepareGdcStageOnePolish(
  config: GdcQuestionGuideConfig,
): GdcQuestionGuideConfig {
  const next = structuredClone(config);
  const intro = next.intro;

  const isBundledOrPreviousPolish =
    [LEGACY_STAGE_ONE_ISSUE, POLISHED_STAGE_ONE_ISSUE].includes(intro.issueBody.trim()) &&
    [LEGACY_STAGE_ONE_PROJECT_TITLE, POLISHED_STAGE_ONE_PROJECT_TITLE].includes(
      intro.projectTitle.trim(),
    );

  if (!isBundledOrPreviousPolish) return next;

  intro.issueLabel = "سؤال این مرحله";
  intro.issueBody =
    "موضوع پژوهش ما سرطان پستان است. قبل از انتخاب بیمار یا دانلود فایل، باید بفهمیم GDC چه مطالعه‌هایی برای این موضوع دارد و آیا اصلاً مسیر مناسبی برای ادامه پژوهش وجود دارد.";
  intro.entryBody =
    "نقطه شروع ما Projects است؛ جایی که مطالعه‌های موجود را می‌بینیم و از میان آن‌ها مسیر مرتبط با سؤال پژوهشی را پیدا می‌کنیم.";

  intro.projectTitle = "Project را خیلی ساده بشناسیم";
  intro.projectBody =
    "در GDC، Project یک مطالعه مشخص است که Caseها، نمونه‌ها و فایل‌های مرتبط را زیر یک چارچوب مشترک سازمان‌دهی می‌کند.";
  intro.projectCaveat =
    "پس Project را با بیمار، فایل یا نام یک سرطان یکی نگیرید؛ Project ظرفی است که اجزای یک مطالعه را کنار هم نگه می‌دارد.";

  intro.architectureTitle = "نقشه ذهنی GDC";
  intro.architectureIntro =
    "برای گم نشدن در محیط GDC فقط این چهار سطح را در ذهن داشته باشید:";
  intro.architectureCards = [
    { title: "Program", subtitle: "چتر پژوهشی بزرگ‌تر" },
    { title: "Project", subtitle: "مطالعه مشخص" },
    { title: "Cases", subtitle: "موارد مطالعه" },
    { title: "Data / Files", subtitle: "داده‌های مربوط به Cases" },
  ];
  intro.architectureSummary =
    "در این مرحله فقط Project برای ما مهم است. انتخاب Case و فایل در قدم‌های بعدی وارد داستان می‌شود.";

  // Stage 1 no longer needs a separate mission card. These values are kept
  // empty so older persisted configs also render without the block.
  intro.missionTitle = "";
  intro.missionBody = "";
  intro.nextButton = "ورود به Projects";

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
