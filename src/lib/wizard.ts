export type WizardOption = { value: string; label: string; hint?: string };
export type WizardStep = {
  key: "stage" | "field" | "organism" | "dataType" | "goal";
  title: string;
  description: string;
  options: WizardOption[];
};

export const wizardSteps: WizardStep[] = [
  {
    key: "stage",
    title: "در کدام مرحله پژوهش هستید؟",
    description: "نقطه شروع، مسیر پیشنهادی تحلیل را تعیین می‌کند.",
    options: [
      { value: "idea", label: "ایده پژوهشی دارم", hint: "هنوز داده‌ای تولید نشده است" },
      { value: "data", label: "داده آزمایشگاهی دارم", hint: "داده خام یا پردازش‌شده موجود است" },
      { value: "analysis", label: "به تحلیل بیوانفورماتیک نیاز دارم", hint: "طراحی مشخص است" },
      { value: "public", label: "می‌خواهم داده عمومی تحلیل کنم", hint: "GEO، SRA یا TCGA" },
    ],
  },
  {
    key: "field",
    title: "حوزه پژوهشی شما چیست؟",
    description: "برای انتخاب پایگاه‌های دانش و مسیرهای زیستی مرتبط.",
    options: [
      { value: "cancer", label: "سرطان" },
      { value: "neuro", label: "علوم اعصاب" },
      { value: "immuno", label: "ایمونولوژی" },
      { value: "pharma", label: "فارماکولوژی" },
      { value: "micro", label: "میکروبیولوژی" },
      { value: "genetics", label: "ژنتیک" },
      { value: "other", label: "سایر" },
    ],
  },
  {
    key: "organism",
    title: "ارگانیسم یا مدل مطالعاتی",
    description: "ژنوم مرجع و پایگاه حاشیه‌نویسی بر همین اساس انتخاب می‌شود.",
    options: [
      { value: "human", label: "انسان" },
      { value: "mouse", label: "موش" },
      { value: "rat", label: "رت" },
      { value: "cellline", label: "رده سلولی" },
      { value: "organoid", label: "ارگانوئید" },
      { value: "plant", label: "گیاه" },
      { value: "microbe", label: "میکروارگانیسم" },
    ],
  },
  {
    key: "dataType",
    title: "نوع داده شما",
    description: "اگر مطمئن نیستید، گزینه آخر را انتخاب کنید؛ در بررسی اولیه کمک می‌کنیم.",
    options: [
      { value: "bulk", label: "Bulk RNA-seq" },
      { value: "sc", label: "Single-cell RNA-seq" },
      { value: "wes", label: "WES/WGS" },
      { value: "microbiome", label: "میکروبیوم" },
      { value: "public", label: "دیتاست عمومی" },
      { value: "unsure", label: "مطمئن نیستم" },
    ],
  },
  {
    key: "goal",
    title: "هدف اصلی پژوهش",
    description: "خروجی نهایی پروژه بر پایه این هدف تعریف می‌شود.",
    options: [
      { value: "deg", label: "یافتن ژن‌های بیان‌متفاوت" },
      { value: "pathway", label: "کشف مسیرهای زیستی" },
      { value: "biomarker", label: "شناسایی بیومارکر" },
      { value: "target", label: "یافتن اهداف درمانی" },
      { value: "cells", label: "شناسایی جمعیت‌های سلولی" },
      { value: "validate", label: "اعتبارسنجی یافته‌ها" },
      { value: "figures", label: "تولید شکل‌های مقاله" },
    ],
  },
];

export type WizardAnswers = Partial<Record<WizardStep["key"], string>>;

export function labelFor(key: WizardStep["key"], value?: string) {
  const step = wizardSteps.find((s) => s.key === key);
  return step?.options.find((o) => o.value === value)?.label ?? "—";
}

export function recommendation(a: WizardAnswers) {
  const services: string[] = [];
  const notes: string[] = [];

  if (a.dataType === "bulk") services.push("تحلیل Bulk RNA-seq");
  if (a.dataType === "sc") services.push("تحلیل Single-cell RNA-seq");
  if (a.dataType === "wes") services.push("تحلیل ژنومیکس (WES/WGS)");
  if (a.dataType === "microbiome") services.push("تحلیل میکروبیوم");
  if (a.dataType === "public" || a.stage === "public") services.push("تحلیل دیتاست‌های عمومی");
  if (a.dataType === "unsure") notes.push("انتخاب نوع داده در جلسه بررسی اولیه نهایی می‌شود.");

  if (a.goal === "pathway" || a.goal === "deg") services.push("تحلیل عملکردی و مسیرها");
  if (a.goal === "biomarker") services.push("کشف بیومارکر");
  if (a.goal === "target") services.push("زیست‌شناسی شبکه");
  if (a.goal === "cells") services.push("تحلیل Single-cell RNA-seq");
  if (a.goal === "figures") services.push("مصورسازی علمی");
  if (a.stage === "idea") services.unshift("پشتیبانی طراحی پژوهش");

  const nextStep =
    a.stage === "idea"
      ? "مشاوره تخصصی طراحی پژوهش و تدوین Study Plan"
      : a.dataType === "unsure"
        ? "بررسی اولیه رایگان برای تعیین نوع داده و مسیر تحلیل"
        : "مشاوره با متخصص بیوانفورماتیک برای نهایی‌سازی پایپ‌لاین";

  const pipeline =
    a.dataType === "sc" || a.goal === "cells"
      ? ["کنترل کیفیت", "ادغام نمونه‌ها", "خوشه‌بندی", "حاشیه‌نویسی سلولی", "تحلیل افتراقی", "تفسیر زیستی"]
      : a.dataType === "wes"
        ? ["کنترل کیفیت", "هم‌ترازسازی", "فراخوانی واریانت", "حاشیه‌نویسی", "اولویت‌بندی واریانت"]
        : a.dataType === "microbiome"
          ? ["پردازش ASV", "تخصیص تاکسونومی", "تحلیل تنوع", "تاکسون‌های افتراقی", "پیش‌بینی عملکرد"]
          : ["کنترل کیفیت", "نرمال‌سازی", "تحلیل بیان افتراقی", "غنی‌سازی مسیرها", "مصورسازی نتایج"];

  return {
    services: Array.from(new Set(services)).slice(0, 4),
    notes,
    nextStep,
    pipeline,
  };
}
