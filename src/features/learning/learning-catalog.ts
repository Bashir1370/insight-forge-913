export type LearningStatus = "active" | "developing";
export type LessonAvailability = "active" | "planned";

export type FoundationLesson = {
  index: number;
  slug: string;
  title: string;
  summary: string;
  principle: string;
  href: string;
};

export type FoundationGroup = {
  id: string;
  title: string;
  description: string;
  lessons: FoundationLesson[];
};

export type SpecialistLesson = {
  index: number;
  slug: string;
  title: string;
  summary: string;
  principle: string;
  status: LessonAvailability;
  href?: string;
};

export type SpecialistTrack = {
  id: string;
  slug: string;
  title: string;
  description: string;
  guidingQuestion: string;
  status: LearningStatus;
  href?: string;
  topics: string[];
  lessons: SpecialistLesson[];
};

export type LearningDomain = {
  id: string;
  slug: string;
  title: string;
  englishTitle: string;
  description: string;
  guidingQuestion: string;
  status: LearningStatus;
  href?: string;
  topics: string[];
};

export type LearningCurriculum = {
  domainId: string;
  foundationGroups: FoundationGroup[];
  specialistTracks: SpecialistTrack[];
};

export const transcriptomicsFoundationLessons: FoundationLesson[] = [
  {
    index: 1,
    slug: "genome-to-transcriptome",
    title: "از ژنوم تا ترنسکریپتوم",
    summary:
      "تفاوت ژنوم و ترنسکریپتوم و اینکه چرا RNA تصویری پویا از وضعیت سلول به ما می‌دهد.",
    principle: "ژنوم ≠ ترنسکریپتوم",
    href: "/learn/transcriptomics/foundations/genome-to-transcriptome",
  },
  {
    index: 2,
    slug: "what-transcriptomics-measures",
    title: "ترنسکریپتومیکس چه چیزی را اندازه‌گیری می‌کند؟",
    summary:
      "اینکه داده ترنسکریپتومیکس دقیقاً چه چیزی را مشاهده می‌کند و چرا زمینه زیستی اهمیت دارد.",
    principle:
      "ترنسکریپتوم، مجموعه RNAهای مشاهده‌شده در یک زمینه زیستی مشخص است.",
    href: "/learn/transcriptomics/foundations/what-transcriptomics-measures",
  },
  {
    index: 3,
    slug: "gene-expression",
    title: "بیان ژن یعنی چه؟",
    summary:
      "درک بیان ژن به‌عنوان میزان RNA مشاهده‌شده از یک ژن در شرایط مشخص.",
    principle:
      "بیان ژن یعنی میزان RNA مشاهده‌شده از یک ژن در شرایط مشخص.",
    href: "/learn/transcriptomics/foundations/gene-expression",
  },
  {
    index: 4,
    slug: "rna-diversity",
    title: "تنوع RNA و رونوشت‌ها",
    summary:
      "چرا یک ژن می‌تواند به رونوشت‌ها و ایزوفرم‌های متفاوت منجر شود و چرا این موضوع در تحلیل مهم است.",
    principle:
      "یک ژن می‌تواند به بیش از یک رونوشت و ایزوفرم منجر شود.",
    href: "/learn/transcriptomics/foundations/rna-diversity",
  },
  {
    index: 5,
    slug: "transcriptomics-question-fit",
    title: "چه زمانی ترنسکریپتومیکس برای سؤال ما مناسب است؟",
    summary:
      "تشخیص اینکه سؤال پژوهشی واقعاً به اطلاعات RNA نیاز دارد یا باید به سراغ نوع دیگری از داده برویم.",
    principle:
      "فناوری باید از سؤال پژوهشی و نوع اطلاعات موردنیاز انتخاب شود.",
    href: "/learn/transcriptomics/foundations/transcriptomics-question-fit",
  },
  {
    index: 6,
    slug: "bulk-single-cell-spatial",
    title: "توده‌ای، تک‌سلولی یا فضایی؟",
    summary:
      "تفکیک سطح مشاهده از فناوری و انتخاب سطح مناسب بر اساس سؤال پژوهشی.",
    principle: "سطح مشاهده با فناوری اندازه‌گیری یکی نیست.",
    href: "/learn/transcriptomics/foundations/bulk-single-cell-spatial",
  },
  {
    index: 7,
    slug: "rna-seq-in-transcriptomics",
    title: "نقشه فناوری‌های ترنسکریپتومیکس",
    summary:
      "جایگاه RNA-seq، میکروآرایه و سایر فناوری‌ها در نقشه کلی ترنسکریپتومیکس.",
    principle:
      "ترنسکریپتومیکس یک حوزه است؛ فناوری‌ها راه‌های متفاوت اندازه‌گیری آن هستند.",
    href: "/learn/transcriptomics/foundations/rna-seq-in-transcriptomics",
  },
];

export const bulkRnaSeqLessons: SpecialistLesson[] = [
  {
    index: 1,
    slug: "study-design",
    title: "از سؤال پژوهشی تا طراحی مطالعه",
    summary:
      "سؤال، گروه‌های مقایسه، تکرارهای زیستی و فراداده را قبل از ورود به FASTQ مشخص کنید.",
    principle:
      "تحلیل خوب نمی‌تواند یک طراحی زیستی نامناسب را بعداً جبران کند.",
    status: "active",
    href: "/learn/transcriptomics/rna-seq/study-design",
  },
  {
    index: 2,
    slug: "sample-to-rna",
    title: "از نمونه زیستی تا RNA",
    summary:
      "منبع نمونه، نگهداری، استخراج RNA و کیفیت ماده اولیه‌ای را که وارد آزمایش می‌شود بشناسید.",
    principle:
      "کیفیت داده محاسباتی از کیفیت نمونه زیستی جدا نیست.",
    status: "active",
    href: "/learn/transcriptomics/rna-seq/sample-to-rna",
  },
  {
    index: 3,
    slug: "library-preparation",
    title: "آماده‌سازی کتابخانه",
    summary:
      "غنی‌سازی mRNA، حذف rRNA، قطعه‌قطعه‌سازی، cDNA، جهت‌داری و منطق ساخت کتابخانه را بفهمید.",
    principle:
      "طراحی کتابخانه تعیین می‌کند چه بخش‌هایی از RNA فرصت دیده‌شدن پیدا کنند.",
    status: "active",
    href: "/learn/transcriptomics/rna-seq/library-preparation",
  },
  {
    index: 4,
    slug: "sequencing-fastq",
    title: "توالی‌یابی و FASTQ",
    summary:
      "خوانش، توالی‌یابی تک‌انتها و جفت‌انتها، کیفیت بازها و ساختار فایل FASTQ را مرحله‌به‌مرحله بررسی کنید.",
    principle:
      "FASTQ داده خام محاسباتی است، نه خود نمونه زیستی و نه ماتریس بیان.",
    status: "active",
    href: "/learn/transcriptomics/rna-seq/sequencing-fastq",
  },
  {
    index: 5,
    slug: "raw-data-qc",
    title: "کنترل کیفیت داده خام",
    summary:
      "کیفیت بازها، آداپتور، الگوهای غیرعادی و منطق استفاده از گزارش‌های کنترل کیفیت را یاد بگیرید.",
    principle:
      "هشدار کنترل کیفیت باید تفسیر شود؛ هر هشدار به معنی خراب بودن داده نیست.",
    status: "planned",
  },
  {
    index: 6,
    slug: "alignment-quantification",
    title: "هم‌ترازی و کمی‌سازی",
    summary:
      "بفهمید خوانش‌ها چگونه به ژنوم یا رونوشت‌ها مرتبط می‌شوند و مقدار بیان چگونه برآورد می‌شود.",
    principle:
      "نام ابزار مهم‌تر از فهم تبدیلی نیست که روی داده انجام می‌دهد.",
    status: "planned",
  },
  {
    index: 7,
    slug: "count-matrix",
    title: "از خوانش‌ها تا ماتریس شمارش",
    summary:
      "مسیر تبدیل میلیون‌ها خوانش به یک جدول ژن × نمونه را به‌صورت مفهومی دنبال کنید.",
    principle:
      "ماتریس شمارش پل بین پردازش توالی‌یابی و تحلیل آماری است.",
    status: "planned",
  },
  {
    index: 8,
    slug: "sample-level-qc",
    title: "کنترل کیفیت در سطح نمونه",
    summary:
      "اندازه کتابخانه، همبستگی، خوشه‌بندی، PCA و نمونه‌های پرت را در سطح مطالعه بررسی کنید.",
    principle:
      "قبل از تفسیر ژن‌ها باید مطمئن شویم رفتار کلی نمونه‌ها قابل توضیح است.",
    status: "planned",
  },
  {
    index: 9,
    slug: "differential-expression",
    title: "نرمال‌سازی و بیان افتراقی",
    summary:
      "منطق نرمال‌سازی، تغییر بیان، عدم‌قطعیت آماری، مقدار p و نرخ کشف کاذب را بفهمید.",
    principle:
      "تغییر بزرگ و معنی‌داری آماری دو مفهوم متفاوت‌اند.",
    status: "planned",
  },
  {
    index: 10,
    slug: "biological-interpretation",
    title: "تفسیر زیستی",
    summary:
      "از فهرست ژن‌ها به مسیرهای زیستی، غنی‌سازی و یک نتیجه قابل دفاع برسید.",
    principle:
      "معنی‌داری آماری به‌تنهایی معادل اهمیت زیستی نیست.",
    status: "planned",
  },
  {
    index: 11,
    slug: "integrated-project",
    title: "پروژه یکپارچه سرطان پانکراس",
    summary:
      "تمام تصمیم‌های مسیر را در یک سناریوی پژوهشی پیوسته کنار هم قرار دهید.",
    principle:
      "هدف نهایی، ساختن زنجیره‌ای قابل دفاع از سؤال تا تفسیر است.",
    status: "planned",
  },
];

export const transcriptomicsSpecialistTracks: SpecialistTrack[] = [
  {
    id: "bulk-rna-seq",
    slug: "rna-seq",
    title: "RNA-seq توده‌ای",
    description:
      "از طراحی مطالعه و FASTQ تا کنترل کیفیت، کمی‌سازی، بیان افتراقی و تفسیر زیستی.",
    guidingQuestion:
      "چطور یک سؤال پژوهشی را به یک تحلیل RNA-seq توده‌ای قابل دفاع تبدیل کنیم؟",
    status: "active",
    href: "/learn/transcriptomics/rna-seq",
    topics: [
      "طراحی مطالعه",
      "FASTQ",
      "کنترل کیفیت",
      "ماتریس شمارش",
      "بیان افتراقی",
      "تفسیر زیستی",
    ],
    lessons: bulkRnaSeqLessons,
  },
  {
    id: "microarray",
    slug: "microarray",
    title: "میکروآرایه",
    description:
      "از پروب و شدت سیگنال تا نرمال‌سازی، ماتریس بیان و تحلیل مقایسه‌ای.",
    guidingQuestion:
      "چگونه داده مبتنی بر پروب و شدت سیگنال به مقایسه بیان ژن تبدیل می‌شود؟",
    status: "developing",
    topics: ["پروب", "هیبریداسیون", "شدت سیگنال", "نرمال‌سازی"],
    lessons: [],
  },
  {
    id: "single-cell-rna-seq",
    slug: "single-cell-rna-seq",
    title: "RNA-seq تک‌سلولی",
    description:
      "از طراحی نمونه تا ماتریس ژن × سلول، کنترل کیفیت و تحلیل جمعیت‌های سلولی.",
    guidingQuestion:
      "چگونه ناهمگنی سلولی را از داده RNA-seq تک‌سلولی استخراج و تفسیر کنیم؟",
    status: "developing",
    topics: ["سلول", "ماتریس ژن × سلول", "خوشه‌بندی", "هویت سلولی"],
    lessons: [],
  },
  {
    id: "spatial-transcriptomics",
    slug: "spatial-transcriptomics",
    title: "ترنسکریپتومیکس فضایی",
    description:
      "مطالعه بیان RNA همراه با موقعیت در بافت و تفسیر زمینه مکانی.",
    guidingQuestion:
      "چطور بیان RNA را همراه با موقعیت آن در معماری بافت تفسیر کنیم؟",
    status: "developing",
    topics: ["موقعیت", "بافت", "بیان RNA", "تفکیک‌پذیری"],
    lessons: [],
  },
  {
    id: "long-read-transcriptomics",
    slug: "long-read-transcriptomics",
    title: "ترنسکریپتومیکس خوانش‌بلند",
    description:
      "مطالعه ساختار رونوشت، ایزوفرم‌ها و اطلاعاتی که خوانش‌های بلند فراهم می‌کنند.",
    guidingQuestion:
      "خوانش‌های بلند چه اطلاعاتی درباره ساختار رونوشت و ایزوفرم‌ها اضافه می‌کنند؟",
    status: "developing",
    topics: ["رونوشت", "ایزوفرم", "خوانش‌بلند"],
    lessons: [],
  },
  {
    id: "small-rna-seq",
    slug: "small-rna-seq",
    title: "RNA-seq برای RNAهای کوچک",
    description:
      "طراحی و تحلیل مناسب برای miRNA و سایر RNAهای کوچک.",
    guidingQuestion:
      "برای مطالعه RNAهای کوچک چه تفاوت‌هایی در طراحی آزمایش و تحلیل لازم است؟",
    status: "developing",
    topics: ["miRNA", "RNA کوچک", "کتابخانه", "کمی‌سازی"],
    lessons: [],
  },
];

export const learningDomains: LearningDomain[] = [
  {
    id: "transcriptomics",
    slug: "transcriptomics",
    title: "ترنسکریپتومیکس",
    englishTitle: "Transcriptomics",
    description:
      "مطالعه RNA و الگوهای بیان ژن؛ از درک ترنسکریپتوم و طراحی مطالعه تا فناوری‌های اندازه‌گیری و تحلیل داده.",
    guidingQuestion:
      "RNAها در یک نمونه، سلول یا بافت چه چیزی درباره وضعیت زیستی به ما می‌گویند؟",
    status: "active",
    href: "/learn/transcriptomics",
    topics: ["بیان ژن", "RNA-seq", "میکروآرایه", "تک‌سلولی", "فضایی"],
  },
  {
    id: "proteomics",
    slug: "proteomics",
    title: "پروتئومیکس",
    englishTitle: "Proteomics",
    description:
      "مطالعه پروتئین‌ها، فراوانی آن‌ها، تغییرات پساترجمه‌ای و ارتباطشان با وضعیت سلول و بافت.",
    guidingQuestion:
      "کدام پروتئین‌ها حضور دارند، چه مقدارند و چگونه میان شرایط مختلف تغییر می‌کنند؟",
    status: "developing",
    topics: ["پروتئین", "طیف‌سنجی جرمی", "کمی‌سازی", "پروتئوم"],
  },
  {
    id: "genomics",
    slug: "genomics",
    title: "ژنومیکس",
    englishTitle: "Genomics",
    description:
      "مطالعه ساختار و تغییرات ژنوم؛ از انواع واریانت‌ها تا ارتباط تغییرات ژنتیکی با فنوتیپ و بیماری.",
    guidingQuestion:
      "چه تغییراتی در DNA وجود دارد و این تغییرات چه پیامد زیستی یا بالینی دارند؟",
    status: "developing",
    topics: ["ژنوم", "واریانت", "توالی‌یابی DNA", "تفسیر ژنتیکی"],
  },
  {
    id: "epigenomics",
    slug: "epigenomics",
    title: "اپی‌ژنومیکس",
    englishTitle: "Epigenomics",
    description:
      "مطالعه تنظیم ژنوم فراتر از توالی DNA؛ از دسترسی کروماتین تا متیلاسیون و نشانه‌های اپی‌ژنتیکی.",
    guidingQuestion:
      "چگونه وضعیت کروماتین و نشانه‌های اپی‌ژنتیکی فعالیت ژن‌ها را تنظیم می‌کنند؟",
    status: "developing",
    topics: ["کروماتین", "متیلاسیون", "تنظیم ژن", "اپی‌ژنتیک"],
  },
  {
    id: "metabolomics",
    slug: "metabolomics",
    title: "متابولومیکس",
    englishTitle: "Metabolomics",
    description:
      "مطالعه متابولیت‌ها و تغییرات مسیرهای متابولیکی برای فهم وضعیت عملکردی سلول، بافت یا ارگانیسم.",
    guidingQuestion:
      "کدام متابولیت‌ها و مسیرهای متابولیکی میان شرایط مختلف تغییر می‌کنند؟",
    status: "developing",
    topics: ["متابولیت", "مسیر متابولیکی", "کمی‌سازی", "تفسیر زیستی"],
  },
];

export const learningCurricula: Record<string, LearningCurriculum> = {
  transcriptomics: {
    domainId: "transcriptomics",
    foundationGroups: [
      {
        id: "transcriptomics-foundations",
        title: "مبانی ترنسکریپتومیکس",
        description:
          "هفت درس پایه برای ساختن نقشه ذهنی قبل از ورود به فناوری‌ها و تحلیل تخصصی.",
        lessons: transcriptomicsFoundationLessons,
      },
    ],
    specialistTracks: transcriptomicsSpecialistTracks,
  },
};

export function getLearningDomain(id: string) {
  return learningDomains.find((domain) => domain.id === id);
}

export function getLearningCurriculum(domainId: string) {
  return learningCurricula[domainId];
}

export function getTranscriptomicsFoundationLesson(index: number) {
  return transcriptomicsFoundationLessons.find(
    (lesson) => lesson.index === index,
  );
}

export function getSpecialistTrack(
  domainId: string,
  trackId: string,
) {
  return getLearningCurriculum(domainId)?.specialistTracks.find(
    (track) => track.id === trackId,
  );
}

export function getSpecialistLesson(
  domainId: string,
  trackId: string,
  lessonIndex: number,
) {
  return getSpecialistTrack(domainId, trackId)?.lessons.find(
    (lesson) => lesson.index === lessonIndex,
  );
}
