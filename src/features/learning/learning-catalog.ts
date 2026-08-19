export type LearningStatus = "active" | "developing";

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

export type FoundationLesson = {
  index: number;
  slug: string;
  title: string;
  summary: string;
  principle: string;
  href: string;
};

export type SpecialistTrack = {
  id: string;
  title: string;
  description: string;
  status: LearningStatus;
  href?: string;
};

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
    topics: [
      "بیان ژن",
      "RNA-seq",
      "میکروآرایه",
      "تک‌سلولی",
      "فضایی",
    ],
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
    topics: [
      "پروتئین",
      "طیف‌سنجی جرمی",
      "کمی‌سازی",
      "پروتئوم",
    ],
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
    topics: [
      "ژنوم",
      "واریانت",
      "توالی‌یابی DNA",
      "تفسیر ژنتیکی",
    ],
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
    topics: [
      "کروماتین",
      "متیلاسیون",
      "تنظیم ژن",
      "اپی‌ژنتیک",
    ],
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
    topics: [
      "متابولیت",
      "مسیر متابولیکی",
      "کمی‌سازی",
      "تفسیر زیستی",
    ],
  },
];

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
      "درک بیان ژن به‌عنوان میزان RNA مشاهده‌شده از یک ژن در یک شرایط مشخص.",
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
    principle:
      "سطح مشاهده با فناوری اندازه‌گیری یکی نیست.",
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

export const transcriptomicsSpecialistTracks: SpecialistTrack[] = [
  {
    id: "bulk-rna-seq",
    title: "RNA-seq توده‌ای",
    description:
      "از طراحی مطالعه و FASTQ تا کنترل کیفیت، کمی‌سازی، بیان افتراقی و تفسیر زیستی.",
    status: "active",
    href: "/learn/rna-seq",
  },
  {
    id: "microarray",
    title: "میکروآرایه",
    description:
      "از پروب و شدت سیگنال تا نرمال‌سازی، ماتریس بیان و تحلیل مقایسه‌ای.",
    status: "developing",
  },
  {
    id: "single-cell-rna-seq",
    title: "RNA-seq تک‌سلولی",
    description:
      "از طراحی نمونه تا ماتریس ژن × سلول، کنترل کیفیت و تحلیل جمعیت‌های سلولی.",
    status: "developing",
  },
  {
    id: "spatial-transcriptomics",
    title: "ترنسکریپتومیکس فضایی",
    description:
      "مطالعه بیان RNA همراه با موقعیت در بافت و تفسیر زمینه مکانی.",
    status: "developing",
  },
  {
    id: "long-read-transcriptomics",
    title: "ترنسکریپتومیکس خوانش‌بلند",
    description:
      "مطالعه ساختار رونوشت، ایزوفرم‌ها و اطلاعاتی که خوانش‌های بلند فراهم می‌کنند.",
    status: "developing",
  },
  {
    id: "small-rna-seq",
    title: "RNA-seq برای RNAهای کوچک",
    description:
      "طراحی و تحلیل مناسب برای miRNA و سایر RNAهای کوچک.",
    status: "developing",
  },
];

export function getLearningDomain(id: string) {
  return learningDomains.find((domain) => domain.id === id);
}

export function getTranscriptomicsFoundationLesson(index: number) {
  return transcriptomicsFoundationLessons.find(
    (lesson) => lesson.index === index,
  );
}
