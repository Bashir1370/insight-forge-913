import type { GdcQuestionGuideConfig } from "./gdc-question-guide-config";

function isLegacyProgramFacet(config: GdcQuestionGuideConfig) {
  const program = config.projects.facets.find((item) => item.id === "program");
  if (!program) return false;

  return (
    program.lensTitle === "Program یعنی چه؟" ||
    program.sections[0]?.title === "این فهرست نام سرطان‌ها نیست" ||
    program.sections[1]?.title === "عدد و درصد کنار Program چیست؟"
  );
}

export function upgradeLegacyProgramFacet(
  config: GdcQuestionGuideConfig,
): GdcQuestionGuideConfig {
  if (!isLegacyProgramFacet(config)) return config;

  const next = structuredClone(config);
  const program = next.projects.facets.find((item) => item.id === "program");
  if (!program) return next;

  program.lensTitle = "Program را چطور بخوانیم؟";
  program.lensSubtitle =
    "چتر پژوهشی بزرگ‌تر در GDC؛ چند Project می‌توانند زیر یک Program سازمان‌دهی شوند";
  program.sections = [
    {
      title: "Program در عمل چه چیزی را نشان می‌دهد؟",
      body: "در این فهرست، نام‌هایی مثل TCGA، MATCH، TARGET و CGCI نام Programهای پژوهشی هستند، نه نام سرطان‌ها. Program را می‌توان یک چتر پژوهشی بزرگ‌تر در GDC در نظر گرفت که چند Project را زیر خود سازمان‌دهی می‌کند. با انتخاب یک Program، فهرست Projectها به پروژه‌های متعلق به همان برنامه محدود می‌شود.",
      tone: "neutral",
    },
    {
      title: "عدد و درصد کنار هر Program را چطور بخوانیم؟",
      body: "مثلاً TCGA — 33 (35.48%) یعنی در وضعیت فعلی 33 Project به Programِ TCGA مربوط‌اند و این تعداد 35.48٪ از کل Projectهای فعلی را تشکیل می‌دهد. با تغییر فیلترهای صفحه، این اعداد هم می‌توانند تغییر کنند.",
      tone: "teal",
    },
    {
      title: "Program و Project چه رابطه‌ای با هم دارند؟",
      body: "Program سطح بزرگ‌تر سازمان‌دهی پژوهش است و Project یک واحد مطالعاتی مشخص‌تر درون آن. یک Program می‌تواند چند Project داشته باشد و هر Project، بسته به طراحی مطالعه، می‌تواند روی یک سرطان یا چند سرطان تمرکز داشته باشد. پس Program، Project و نوع سرطان سه مفهوم یکسان نیستند.",
      tone: "amber",
    },
    {
      title: "فهرست به همین چند Program محدود نیست",
      body: "مواردی که در تصویر می‌بینید فقط بخشی از فهرست هستند. با باز کردن +21 more می‌توانید Programهای بیشتری را ببینید.",
      tone: "sky",
    },
  ];

  return next;
}
