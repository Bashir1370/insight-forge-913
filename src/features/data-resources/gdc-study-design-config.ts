import type { GdcFacetId, GdcGuideHotspot, GdcQuestionGuideConfig } from "./gdc-question-guide-config";

export type GdcStudyImageFit = "contain" | "cover" | "fill";

export type GdcStudyTaskConfig = {
  id: GdcFacetId;
  enabled: boolean;
  label: string;
  cue: string;
  target: string;
  options: string[];
  hint: string;
  rationale: string;
  wrongFeedback: string;
  resultCaption: string;
  projectCount: number;
  imageUrl: string;
  hotspots: GdcGuideHotspot[];
};

export type GdcStudyDesignConfig = {
  version: 1;
  liveTitle: string;
  initialCaption: string;
  scenarioLabel: string;
  scenarioBody: string;
  scenarioHelp: string;
  guidedLabel: string;
  challengeLabel: string;
  restartLabel: string;
  progressTitle: string;
  researchNote: string;
  finalTitle: string;
  finalBody: string;
  confidenceQuestion: string;
  confidenceLowFeedback: string;
  confidenceMediumFeedback: string;
  confidenceHighFeedback: string;
  previousButton: string;
  nextButton: string;
  initialProjectCount: number;
  baselineImageUrl: string;
  baselineHotspots: GdcGuideHotspot[];
  imageHeight: number;
  imageFit: GdcStudyImageFit;
  chips: string[];
  candidateProjects: string[];
  tasks: GdcStudyTaskConfig[];
};

export const DEFAULT_GDC_STUDY_DESIGN: GdcStudyDesignConfig = {
  version: 1,
  liveTitle: "نتیجه واقعی اعمال فیلترها در GDC",
  initialCaption: "هنوز فیلتری اعمال نشده؛ اولین تصمیم را از Primary Site شروع کنید.",
  scenarioLabel: "سناریوی پژوهش",
  scenarioBody: "می‌خواهیم بیان ژن را در سرطان‌های مرتبط با کلیه بررسی کنیم؛ مطالعه باید از TCGA باشد، Disease Type موردنظر Adenomas and Adenocarcinomas باشد و داده Transcriptome Profiling با روش RNA-Seq در دسترس باشد.",
  scenarioHelp: "هر پاسخ درست، اسکرین‌شات واقعی همان مرحله را جایگزین می‌کند؛ تغییر جدول سمت راست را دنبال کنید.",
  guidedLabel: "راهنمایی‌شده",
  challengeLabel: "حالت چالش",
  restartLabel: "شروع دوباره",
  progressTitle: "پیشرفت طراحی مطالعه",
  researchNote: "نکته پژوهشی: هر فیلتر الزاماً تعداد Projectها را کمتر نمی‌کند. اگر تعداد ثابت بماند، یعنی Projectهای باقی‌مانده همگی آن شرط داده‌ای را دارند؛ با این حال فیلتر هنوز برای تأیید سازگاری طراحی مطالعه مهم است.",
  finalTitle: "طراحی مطالعه کامل شد",
  finalBody: "فیلترها همیشه ما را به یک Project یکتا نمی‌رسانند. با این طراحی، چند Project سازگار باقی مانده‌اند و باید در قدم بعد ویژگی‌های آن‌ها و داده موجود را مقایسه کنیم.",
  confidenceQuestion: "قبل از ادامه، چقدر به طراحی خودت مطمئنی؟",
  confidenceLowFeedback: "انتخاب‌ها درست‌اند؛ مرحله بعد کمک می‌کند با بررسی داده واقعی، اطمینانت بیشتر شود.",
  confidenceMediumFeedback: "طراحی درست است؛ حالا باید Projectهای باقی‌مانده را دقیق‌تر مقایسه کنی.",
  confidenceHighFeedback: "خوب؛ حالا وقت بررسی سازگاری داده و انتخاب نهایی بین Projectهای باقی‌مانده است.",
  previousButton: "قبلی",
  nextButton: "بررسی نوع داده",
  initialProjectCount: 93,
  baselineImageUrl: "",
  baselineHotspots: [],
  imageHeight: 0,
  imageFit: "contain",
  chips: ["kidney", "TCGA", "Adenomas / Adenocarcinomas", "Transcriptome Profiling", "RNA-Seq"],
  candidateProjects: ["TCGA-KIRC", "TCGA-KIRP", "TCGA-KICH"],
  tasks: [
    {
      id: "primarySite",
      enabled: true,
      label: "Primary Site",
      cue: "محل اولیه تومور را روی کدام گزینه محدود می‌کنید؟",
      target: "kidney",
      options: ["kidney", "breast", "colon"],
      hint: "Primary Site محل آناتومیکی شروع تومور را می‌پرسد.",
      rationale: "برای سناریوی این تمرین، محل اولیه کلیه است؛ پس Primary Site = kidney انتخاب می‌شود.",
      wrongFeedback: "اینجا باید محل اولیه تومور را انتخاب کنید؛ در این سناریو هدف kidney است.",
      resultCaption: "با انتخاب Primary Site = kidney، جدول از 93 Project به 16 Project محدود شد.",
      projectCount: 16,
      imageUrl: "",
      hotspots: [],
    },
    {
      id: "program",
      enabled: true,
      label: "Program",
      cue: "از میان Projectهای کلیه، کدام Program پژوهشی را می‌خواهیم؟",
      target: "TCGA",
      options: ["TCGA", "TARGET", "CPTAC"],
      hint: "در سؤال پژوهشی، منبع مطالعه را TCGA در نظر گرفته‌ایم.",
      rationale: "اعمال Program = TCGA فقط Projectهای متعلق به TCGA را در این محدوده نگه می‌دارد.",
      wrongFeedback: "به Program موردنظر سناریو برگردید؛ در این تمرین هدف TCGA است.",
      resultCaption: "با اضافه شدن Program = TCGA، تعداد Projectها از 16 به 4 رسید.",
      projectCount: 4,
      imageUrl: "",
      hotspots: [],
    },
    {
      id: "diseaseType",
      enabled: true,
      label: "Disease Type",
      cue: "برای نوع پاتولوژیک بیماری کدام گزینه را انتخاب می‌کنید؟",
      target: "Adenomas and Adenocarcinomas",
      options: ["Adenomas and Adenocarcinomas", "Squamous Cell Neoplasms", "Ductal and Lobular Neoplasms"],
      hint: "در این سناریو Projectهای کلیوی هدف با Adenomas and Adenocarcinomas مشخص شده‌اند.",
      rationale: "Disease Type ماهیت بیماری را محدود می‌کند؛ پس فقط Projectهای سازگار با این طبقه‌بندی باقی می‌مانند.",
      wrongFeedback: "Primary Site محل را مشخص کرده است؛ اینجا باید نوع بیماری هدف را انتخاب کنید.",
      resultCaption: "Disease Type = Adenomas and Adenocarcinomas یک Project دیگر را حذف کرد و 3 Project باقی ماند.",
      projectCount: 3,
      imageUrl: "",
      hotspots: [],
    },
    {
      id: "dataCategory",
      enabled: true,
      label: "Data Category",
      cue: "برای بررسی بیان ژن، کدام خانواده داده مناسب‌تر است؟",
      target: "Transcriptome Profiling",
      options: ["Transcriptome Profiling", "Clinical", "Simple Nucleotide Variation"],
      hint: "بیان ژن به داده‌های RNA و پروفایل ترنسکریپتوم مربوط است.",
      rationale: "Transcriptome Profiling خانواده داده‌ای است که برای سؤال بیان ژن به آن نیاز داریم.",
      wrongFeedback: "این گزینه ممکن است داده مفیدی بدهد، اما مستقیماً سؤال ما درباره بیان ژن را هدف نمی‌گیرد.",
      resultCaption: "Data Category = Transcriptome Profiling تعداد را از 3 کمتر نکرد؛ یعنی هر سه Project این دسته داده را دارند.",
      projectCount: 3,
      imageUrl: "",
      hotspots: [],
    },
    {
      id: "experimentalStrategy",
      enabled: true,
      label: "Experimental Strategy",
      cue: "داده موردنظر باید با کدام روش تولید شده باشد؟",
      target: "RNA-Seq",
      options: ["RNA-Seq", "WXS", "WGS"],
      hint: "برای این سناریوی بیان ژن، روش هدف RNA-Seq است.",
      rationale: "RNA-Seq روش تولید داده موردنیاز برای این طراحی است و در Projectهای باقی‌مانده وجود دارد.",
      wrongFeedback: "WXS و WGS برای سؤال‌های ژنومی مهم‌اند؛ اینجا روش هدف RNA-Seq است.",
      resultCaption: "با RNA-Seq هم 3 Project باقی ماند؛ این فیلتر اینجا بیشتر سازگاری داده را تأیید می‌کند تا تعداد Projectها را کاهش دهد.",
      projectCount: 3,
      imageUrl: "",
      hotspots: [],
    },
  ],
};

function cleanHotspots(value: unknown, fallback: GdcGuideHotspot[]) {
  if (!Array.isArray(value)) return fallback.map((item) => ({ ...item }));
  return value
    .filter((item): item is GdcGuideHotspot => Boolean(item && typeof item === "object"))
    .map((item, index) => ({
      key: String((item as any).key || `hotspot-${index + 1}`),
      title: String((item as any).title || `Hotspot ${index + 1}`),
      x: Number.isFinite(Number((item as any).x)) ? Number((item as any).x) : 10,
      y: Number.isFinite(Number((item as any).y)) ? Number((item as any).y) : 10,
      width: Number.isFinite(Number((item as any).width)) ? Number((item as any).width) : 20,
      height: Number.isFinite(Number((item as any).height)) ? Number((item as any).height) : 12,
    }));
}

export function getGdcStudyDesignConfig(config: GdcQuestionGuideConfig): GdcStudyDesignConfig {
  const incoming = (config as GdcQuestionGuideConfig & { studyDesign?: Partial<GdcStudyDesignConfig> }).studyDesign;
  const defaults = DEFAULT_GDC_STUDY_DESIGN;
  if (!incoming) return structuredClone(defaults);

  const tasks = defaults.tasks.map((fallback) => {
    const found = Array.isArray(incoming.tasks)
      ? incoming.tasks.find((item) => item?.id === fallback.id)
      : undefined;
    if (!found) return structuredClone(fallback);
    return {
      ...fallback,
      ...found,
      options: Array.isArray(found.options) && found.options.length ? found.options.map(String) : [...fallback.options],
      hotspots: cleanHotspots(found.hotspots, fallback.hotspots),
    };
  });

  return {
    ...defaults,
    ...incoming,
    chips: Array.isArray(incoming.chips) ? incoming.chips.map(String) : [...defaults.chips],
    candidateProjects: Array.isArray(incoming.candidateProjects) ? incoming.candidateProjects.map(String) : [...defaults.candidateProjects],
    baselineHotspots: cleanHotspots(incoming.baselineHotspots, defaults.baselineHotspots),
    tasks,
  };
}

export function withGdcStudyDesignConfig(
  config: GdcQuestionGuideConfig,
  studyDesign: GdcStudyDesignConfig,
): GdcQuestionGuideConfig {
  return { ...config, studyDesign } as GdcQuestionGuideConfig;
}
