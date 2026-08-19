export type CanonicalLearningTerm = {
  english: string;
  canonical: string;
  firstUse?: string;
  note?: string;
};

export const canonicalLearningTerms: CanonicalLearningTerm[] = [
  { english: "library preparation", canonical: "آماده‌سازی کتابخانه" },
  { english: "poly(A) selection", canonical: "غنی‌سازی RNAهای دارای poly(A)" },
  { english: "rRNA depletion", canonical: "حذف rRNA" },
  { english: "Polymerase Chain Reaction", canonical: "واکنش زنجیره‌ای پلیمراز" },
  { english: "reverse transcriptase", canonical: "آنزیم رونویس معکوس" },
  { english: "reverse transcription", canonical: "رونویسی معکوس" },
  { english: "adapter read-through", canonical: "ورود خوانش به آداپتور" },
  { english: "per-base sequence quality", canonical: "کیفیت بر حسب موقعیت خوانش" },
  { english: "per-base sequence content", canonical: "ترکیب بازها بر حسب موقعیت" },
  { english: "overrepresented sequences", canonical: "توالی‌های بیش‌ازحد پرتکرار" },
  { english: "probabilistic assignment", canonical: "تخصیص احتمالی شواهد" },
  { english: "splice-aware alignment", canonical: "هم‌ترازی آگاه از پیرایش" },
  { english: "selective alignment", canonical: "هم‌ترازی گزینشی" },
  { english: "reference transcriptome", canonical: "ترنسکریپتوم مرجع" },
  { english: "reference genome", canonical: "ژنوم مرجع" },
  { english: "biological replicate", canonical: "تکرار زیستی" },
  { english: "technical replicate", canonical: "تکرار فنی" },
  { english: "experimental unit", canonical: "واحد مستقل زیستی" },
  { english: "duplicate reads", canonical: "خوانش‌های تکراری" },
  { english: "ambiguous read", canonical: "خوانش مبهم" },
  { english: "PCR duplicate", canonical: "نسخه تکراری ناشی از PCR" },
  { english: "PCR artifact", canonical: "اثر مصنوعی ناشی از PCR" },
  { english: "batch effect", canonical: "اثر دسته‌ای" },
  { english: "sample index", canonical: "شاخص نمونه" },
  { english: "base calling", canonical: "تشخیص باز" },
  { english: "quality score", canonical: "امتیاز کیفیت" },
  { english: "splice junction", canonical: "محل اتصال اگزون‌ها" },
  { english: "pseudoalignment", canonical: "شبه‌هم‌ترازی" },
  { english: "multi-mapping", canonical: "نگاشت چندمکانی" },
  { english: "GC content", canonical: "درصد GC" },
  { english: "fragmentation", canonical: "قطعه‌قطعه‌سازی" },
  { english: "demultiplexing", canonical: "جداسازی نمونه‌ها بر پایه شاخص" },
  { english: "preprocessing", canonical: "پیش‌پردازش" },
  { english: "quantification", canonical: "کمی‌سازی" },
  { english: "confounding", canonical: "درهم‌آمیختگی اثرها" },
  { english: "strandedness", canonical: "جهت‌داری کتابخانه" },
  { english: "single-end", canonical: "تک‌انتها" },
  { english: "paired-end", canonical: "جفت‌انتها" },
  { english: "trimming", canonical: "پیرایش" },
  { english: "pooling", canonical: "تجمیع کتابخانه‌ها" },
  { english: "annotation", canonical: "حاشیه‌نویسی ژنومی" },
  { english: "alignment", canonical: "هم‌ترازی" },
  { english: "mapping", canonical: "نگاشت" },
  { english: "metadata", canonical: "فراداده" },
  { english: "dataset", canonical: "مجموعه‌داده" },
  { english: "pipeline", canonical: "مسیر تحلیل" },
  { english: "library", canonical: "کتابخانه" },
  { english: "transcript", canonical: "رونوشت" },
  { english: "isoform", canonical: "ایزوفرم" },
  { english: "adapter", canonical: "آداپتور" },
  { english: "reference", canonical: "مرجع" },
  { english: "fragment", canonical: "قطعه" },
  { english: "reads", canonical: "خوانش‌ها" },
  { english: "read", canonical: "خوانش", note: "در متن عمومی از read استفاده نشود." },
  { english: "batch", canonical: "دسته آزمایشی" },
  { english: "QC", canonical: "کنترل کیفیت" },
  {
    english: "Phred",
    canonical: "Phred",
    note: "نام مقیاس است و ترجمه نمی‌شود؛ همیشه در اولین کاربرد توضیح داده شود.",
  },
];

export function getCanonicalLearningTerm(english: string) {
  return canonicalLearningTerms.find(
    (term) => term.english.toLowerCase() === english.toLowerCase(),
  );
}

const replacementTerms = [...canonicalLearningTerms]
  .filter((term) => term.canonical !== term.english)
  .sort((a, b) => b.english.length - a.english.length);

export function normalizeLearningText(text: string) {
  return replacementTerms.reduce((current, term) => {
    const escaped = escapeRegExp(term.english);
    const startsWithWord = /^[A-Za-z0-9]/.test(term.english);
    const endsWithWord = /[A-Za-z0-9]$/.test(term.english);
    const pattern = new RegExp(
      `${startsWithWord ? "\\b" : ""}${escaped}${endsWithWord ? "\\b" : ""}`,
      "gi",
    );

    return current.replace(pattern, term.canonical);
  }, text);
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
