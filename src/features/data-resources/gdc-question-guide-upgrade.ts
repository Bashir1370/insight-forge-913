import type { GdcQuestionGuideConfig } from "./gdc-question-guide-config";

const PRIMARY_SITE_IMAGE = "/images/gdc/gdc-primary-site.webp";

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

function looksLikeLegacyPrimarySite(config: GdcQuestionGuideConfig) {
  const primary = config.projects.facets.find((item) => item.id === "primarySite");
  if (!primary) return false;
  return (
    primary.sections[0]?.title === "این لیست همه سرطان‌ها نیست" ||
    primary.sections[1]?.title === "عدد و درصد روبه‌روی هر مورد چیست؟"
  );
}

function shouldUseBundledPrimaryImage(value?: string) {
  if (!value) return true;
  if (value.startsWith("hubgene://gdc-primary-site")) return true;
  if (value.startsWith("data:image/")) return true;
  if (value.includes("/images/gdc/gdc-primary-site")) return true;
  return false;
}

export function upgradeGdcQuestionGuideConfig(config: GdcQuestionGuideConfig): GdcQuestionGuideConfig {
  const next = structuredClone(config);
  const primary = next.projects.facets.find((item) => item.id === "primarySite");
  if (!primary) return next;

  if (shouldUseBundledPrimaryImage(primary.imageUrl)) {
    primary.imageUrl = PRIMARY_SITE_IMAGE;
  }

  if (looksLikeLegacyPrimarySite(config)) {
    primary.lensTitle = "Primary Site را چطور بخوانیم؟";
    primary.lensSubtitle = "محل اولیه‌ای که تومور از آن شروع شده؛ یکی از راه‌های محدود کردن Projectها در GDC";
    primary.sections = NEW_PRIMARY_SECTIONS.map((item) => ({ ...item }));
  }

  return next;
}

export function prepareGdcQuestionGuideForDisplay(config: GdcQuestionGuideConfig): GdcQuestionGuideConfig {
  return structuredClone(config);
}
