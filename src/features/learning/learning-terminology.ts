export type CanonicalLearningTerm = {
  english: string;
  canonical: string;
  firstUse?: string;
  note?: string;
};

export const canonicalLearningTerms: CanonicalLearningTerm[] = [
  { english: "read", canonical: "خوانش", note: "در متن عمومی از read استفاده نشود." },
  { english: "reads", canonical: "خوانش‌ها" },
  { english: "preprocessing", canonical: "پیش‌پردازش" },
  { english: "pipeline", canonical: "مسیر تحلیل" },
  { english: "metadata", canonical: "فراداده" },
  { english: "dataset", canonical: "مجموعه‌داده" },
  { english: "library", canonical: "کتابخانه" },
  { english: "biological replicate", canonical: "تکرار زیستی" },
  { english: "technical replicate", canonical: "تکرار فنی" },
  { english: "batch", canonical: "دسته آزمایشی", firstUse: "دسته آزمایشی (batch)" },
  { english: "batch effect", canonical: "اثر دسته‌ای", firstUse: "اثر دسته‌ای (batch effect)" },
  { english: "confounding", canonical: "درهم‌آمیختگی اثرها", firstUse: "درهم‌آمیختگی اثرها (confounding)" },
  { english: "adapter", canonical: "آداپتور" },
  { english: "sample index", canonical: "شاخص نمونه" },
  { english: "pooling", canonical: "تجمیع کتابخانه‌ها", firstUse: "تجمیع کتابخانه‌ها (pooling)" },
  { english: "demultiplexing", canonical: "جداسازی نمونه‌ها بر پایه شاخص", firstUse: "جداسازی نمونه‌ها بر پایه شاخص (demultiplexing)" },
  { english: "base calling", canonical: "تشخیص باز", firstUse: "تشخیص باز (base calling)" },
  { english: "quality score", canonical: "امتیاز کیفیت" },
  { english: "Phred", canonical: "Phred", note: "نام مقیاس است و ترجمه نمی‌شود؛ همیشه در اولین کاربرد توضیح داده شود." },
  { english: "trimming", canonical: "پیرایش", firstUse: "پیرایش (trimming)" },
  { english: "duplicate reads", canonical: "خوانش‌های تکراری" },
  { english: "PCR artifact", canonical: "اثر مصنوعی ناشی از PCR", firstUse: "اثر مصنوعی ناشی از PCR (PCR artifact)" },
  { english: "overrepresented sequences", canonical: "توالی‌های بیش‌ازحد پرتکرار" },
  { english: "alignment", canonical: "هم‌ترازی" },
  { english: "mapping", canonical: "نگاشت" },
  { english: "reference", canonical: "مرجع" },
  { english: "annotation", canonical: "حاشیه‌نویسی ژنومی", firstUse: "حاشیه‌نویسی ژنومی (annotation)" },
  { english: "splice junction", canonical: "محل اتصال اگزون‌ها", firstUse: "محل اتصال اگزون‌ها (splice junction)" },
  { english: "pseudoalignment", canonical: "شبه‌هم‌ترازی", firstUse: "شبه‌هم‌ترازی (pseudoalignment)" },
  { english: "selective alignment", canonical: "هم‌ترازی گزینشی", firstUse: "هم‌ترازی گزینشی (selective alignment)" },
  { english: "isoform", canonical: "ایزوفرم" },
  { english: "transcript", canonical: "رونوشت" },
  { english: "strandedness", canonical: "جهت‌داری کتابخانه" },
  { english: "fragment", canonical: "قطعه" },
  { english: "single-end", canonical: "تک‌انتها", firstUse: "توالی‌یابی تک‌انتها (single-end)" },
  { english: "paired-end", canonical: "جفت‌انتها", firstUse: "توالی‌یابی جفت‌انتها (paired-end)" },
];

export function getCanonicalLearningTerm(english: string) {
  return canonicalLearningTerms.find(
    (term) => term.english.toLowerCase() === english.toLowerCase(),
  );
}
