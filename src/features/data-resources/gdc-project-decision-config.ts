import type { GdcQuestionGuideConfig } from "./gdc-question-guide-config";

export type GdcProjectDecisionProject = {
  id: string;
  code: string;
  englishName: string;
  persianName: string;
  explanation: string;
};

export type GdcProjectDecisionAbbreviation = {
  abbr: string;
  full: string;
  meaning: string;
};

export type GdcProjectDecisionConfig = {
  title: string;
  introBody: string;
  progressSteps: string[];
  progressFinalLabel: string;
  comparisonTitle: string;
  comparisonBody: string;
  sharedDiseaseType: string;
  hierarchySummary: string;
  projects: GdcProjectDecisionProject[];
  abbreviationsTitle: string;
  abbreviationsBody: string;
  abbreviations: GdcProjectDecisionAbbreviation[];
  abbreviationFormula: string;
  conclusionTitle: string;
  conclusionBody: string;
  conclusionCards: string[];
  previousButton: string;
  nextButton: string;
};

export const DEFAULT_GDC_PROJECT_DECISION_CONFIG: GdcProjectDecisionConfig = {
  title: "ارزیابی پروژه یا پروژه‌های نهایی",
  introBody:
    "با استفاده از فیلترها، فضای جست‌وجوی GDC را از ۹۳ پروژه به ۳ پروژه مرتبط با سرطان کلیه رسانده‌ایم. حالا لازم نیست دوباره فیلترها را امتحان کنیم؛ باید تفاوت این سه پروژه را بفهمیم و ببینیم کدام‌یک با سؤال پژوهشی ما هماهنگ‌تر است.",
  progressSteps: ["۹۳", "۱۶", "۴"],
  progressFinalLabel: "۳ پروژه مرتبط",
  comparisonTitle: "این ۳ پروژه سرطان کلیه دقیقاً چه تفاوتی دارند؟",
  comparisonBody:
    "هر سه پروژه از نظر محل اولیه به کلیه مربوط‌اند و در نتیجه فعلی GDC، هر سه در Facet مربوط به Disease Type زیر مقدار Adenomas and Adenocarcinomas دیده می‌شوند. این مقدار یک دسته‌بندی نسبتاً کلی در GDC است و به این معنی نیست که هر سه پروژه یک سرطان یکسان را مطالعه می‌کنند. تفاوت اصلی در زیرنوع دقیق سرطان سلول کلیوی است که هر پروژه روی آن تمرکز دارد.",
  sharedDiseaseType: "Adenomas and Adenocarcinomas",
  hierarchySummary:
    "پس ذهن پژوهشگر باید این تفکیک را نگه دارد: Primary Site می‌گوید محل اولیه «کلیه» است؛ Disease Type در این نتیجه یک رده مشترک و کلی‌تر است؛ اما شناسه و نام پروژه مشخص می‌کند مطالعه دقیقاً روی کدام زیرنوع سرطان کلیه انجام شده است.",
  projects: [
    {
      id: "TCGA-KIRC",
      code: "KIRC",
      englishName: "Kidney Renal Clear Cell Carcinoma",
      persianName: "کارسینوم سلول روشن کلیه",
      explanation:
        "مطالعه TCGA مربوط به Clear Cell Renal Cell Carcinoma است؛ یعنی زیرنوع سلول روشن سرطان سلول کلیوی.",
    },
    {
      id: "TCGA-KIRP",
      code: "KIRP",
      englishName: "Kidney Renal Papillary Cell Carcinoma",
      persianName: "کارسینوم پاپیلاری کلیه",
      explanation:
        "مطالعه TCGA مربوط به Papillary Renal Cell Carcinoma است؛ یعنی زیرنوع پاپیلاری سرطان سلول کلیوی.",
    },
    {
      id: "TCGA-KICH",
      code: "KICH",
      englishName: "Kidney Chromophobe",
      persianName: "کارسینوم کروموفوب کلیه",
      explanation:
        "مطالعه TCGA مربوط به Chromophobe Renal Cell Carcinoma است؛ یعنی زیرنوع کروموفوب سرطان سلول کلیوی.",
    },
  ],
  abbreviationsTitle: "اختصاراتی که GDC در این پروژه‌ها استفاده می‌کند",
  abbreviationsBody:
    "در شناسه‌هایی مثل TCGA-KIRC، بخش اول برنامه پژوهشی و بخش دوم کد مطالعه یا سرطان مشخص را نشان می‌دهد. بنابراین این کدها فقط اسم کوتاه نیستند؛ کمک می‌کنند سریع بفهمیم هر پروژه متعلق به کدام برنامه و کدام مطالعه است.",
  abbreviations: [
    { abbr: "GDC", full: "Genomic Data Commons", meaning: "سامانه و زیرساختی که این داده‌ها و پروژه‌ها را در آن جست‌وجو می‌کنیم." },
    { abbr: "TCGA", full: "The Cancer Genome Atlas", meaning: "نام برنامه پژوهشی بزرگی است که این سه پروژه زیرمجموعه آن هستند." },
    { abbr: "KIRC", full: "Kidney Renal Clear Cell Carcinoma", meaning: "کد پروژه سرطان سلول روشن کلیه." },
    { abbr: "KIRP", full: "Kidney Renal Papillary Cell Carcinoma", meaning: "کد پروژه سرطان پاپیلاری کلیه." },
    { abbr: "KICH", full: "Kidney Chromophobe", meaning: "کد پروژه سرطان کروموفوب کلیه." },
  ],
  abbreviationFormula:
    "TCGA-KIRC = TCGA + KIRC  |  TCGA-KIRP = TCGA + KIRP  |  TCGA-KICH = TCGA + KICH",
  conclusionTitle: "از ۹۳ پروژه به ۳ پروژه مرتبط رسیدیم؛ انتخاب نهایی به سؤال پژوهش بستگی دارد",
  conclusionBody:
    "فیلتر کردن قرار نبود حتماً ما را به یک پروژه برساند؛ کار آن این بود که مجموعه بزرگ اولیه را به چند گزینه مرتبط و قابل ارزیابی کاهش دهد. اکنون تصمیم اینکه فقط یک پروژه یا چند پروژه را وارد مطالعه کنیم، باید بر اساس سؤال پژوهشی، اهداف مطالعه و فرضیات پژوهش گرفته شود.",
  conclusionCards: [
    "اگر سؤال فقط درباره Clear Cell باشد، پروژه TCGA-KIRC هدف مستقیم‌تری است.",
    "اگر سؤال فقط درباره Papillary یا Chromophobe باشد، پروژه متناظر همان زیرنوع انتخاب می‌شود.",
    "اگر هدف مقایسه زیرنوع‌های سرطان کلیه باشد، ممکن است دو یا هر سه پروژه به‌طور هم‌زمان وارد طراحی مطالعه شوند.",
  ],
  previousButton: "قبلی",
  nextButton: "تصمیم بعدی",
};

type GuideWithProjectDecision = GdcQuestionGuideConfig & {
  projectDecision?: Partial<GdcProjectDecisionConfig>;
};

export function getGdcProjectDecisionConfig(config: GdcQuestionGuideConfig): GdcProjectDecisionConfig {
  const incoming = (config as GuideWithProjectDecision).projectDecision;
  const defaults = DEFAULT_GDC_PROJECT_DECISION_CONFIG;
  if (!incoming) return structuredClone(defaults);

  return {
    ...defaults,
    ...incoming,
    progressSteps: Array.isArray(incoming.progressSteps) && incoming.progressSteps.length
      ? incoming.progressSteps.map(String)
      : [...defaults.progressSteps],
    projects: Array.isArray(incoming.projects) && incoming.projects.length
      ? incoming.projects.map((item) => ({ ...item })) as GdcProjectDecisionProject[]
      : defaults.projects.map((item) => ({ ...item })),
    abbreviations: Array.isArray(incoming.abbreviations) && incoming.abbreviations.length
      ? incoming.abbreviations.map((item) => ({ ...item })) as GdcProjectDecisionAbbreviation[]
      : defaults.abbreviations.map((item) => ({ ...item })),
    conclusionCards: Array.isArray(incoming.conclusionCards) && incoming.conclusionCards.length
      ? incoming.conclusionCards.map(String)
      : [...defaults.conclusionCards],
  };
}

export function withGdcProjectDecisionConfig(
  config: GdcQuestionGuideConfig,
  projectDecision: GdcProjectDecisionConfig,
): GdcQuestionGuideConfig {
  return {
    ...config,
    projectDecision: structuredClone(projectDecision),
  } as GdcQuestionGuideConfig;
}
