import { createFileRoute } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";

export const Route = createFileRoute("/learn_/rna-seq")({
  component: RnaSeqHubPage,
});

type EntryMode = "learn" | "workflow" | "project" | "problem";

type WorkflowNode = {
  id: string;
  number: string;
  title: string;
  englishTitle: string;
  shortDescription: string;
  explanation: string;
  why: string;
  input: string;
  output: string;
  mistake: string;
  terms: string[];
  category: string;
};

const workflowNodes: WorkflowNode[] = [
  {
    id: "research-question",
    number: "01",
    title: "سؤال پژوهشی",
    englishTitle: "Research Question",
    shortDescription:
      "قبل از انتخاب ابزار، باید بدانیم دقیقاً چه چیزی را می‌خواهیم بفهمیم.",
    explanation:
      "یک پروژه RNA-seq از یک سؤال زیستی روشن شروع می‌شود. مثلاً می‌خواهیم بدانیم تیمار با یک دارو چه تغییری در الگوی بیان ژن سلول‌های سرطانی ایجاد می‌کند.",
    why:
      "سؤال پژوهشی مشخص می‌کند چه گروه‌هایی باید مقایسه شوند، چه نوع داده‌ای نیاز داریم و کدام تحلیل‌ها واقعاً برای پاسخ به سؤال ما مناسب هستند.",
    input: "مسئله یا فرضیه زیستی",
    output: "سؤال پژوهشی قابل تحلیل",
    mistake:
      "شروع پروژه با انتخاب نرم‌افزار یا روش، بدون اینکه سؤال زیستی و مقایسه اصلی مشخص باشد.",
    terms: ["فرضیه", "مقایسه", "طراحی مطالعه"],
    category: "طراحی پژوهش",
  },
  {
    id: "study-design",
    number: "02",
    title: "طراحی مطالعه",
    englishTitle: "Experimental Design",
    shortDescription:
      "گروه‌ها، نمونه‌ها، تکرارهای زیستی و عوامل مداخله‌گر ساختار تحلیل را تعیین می‌کنند.",
    explanation:
      "قبل از توالی‌یابی باید مشخص باشد چند گروه داریم، تکرارهای زیستی چگونه تعریف شده‌اند و آیا عواملی مانند دسته آزمایشی، سن، جنس یا شرایط نمونه‌گیری می‌توانند بر نتیجه اثر بگذارند.",
    why:
      "بسیاری از مشکلات طراحی مطالعه را نمی‌توان بعداً فقط با نرم‌افزار یا تحلیل آماری اصلاح کرد.",
    input: "سؤال پژوهشی + ساختار نمونه‌ها",
    output: "طراحی مطالعه + فراداده",
    mistake:
      "تصور اینکه تعداد کم تکرارهای زیستی را می‌توان بعداً با تحلیل آماری جبران کرد.",
    terms: ["فراداده", "تکرار زیستی", "هم‌متغیر"],
    category: "طراحی پژوهش",
  },
  {
    id: "sequencing",
    number: "03",
    title: "از نمونه تا FASTQ",
    englishTitle: "Sample to Sequencing",
    shortDescription:
      "می‌بینیم چگونه نمونه زیستی در نهایت به داده محاسباتی تبدیل می‌شود.",
    explanation:
      "RNA از نمونه استخراج می‌شود، کتابخانه توالی‌یابی ساخته می‌شود و دستگاه توالی‌یاب میلیون‌ها قطعه توالی را می‌خواند. یکی از خروجی‌های اصلی این مرحله فایل FASTQ است.",
    why:
      "برای تحلیل درست باید بدانیم داده خام از کجا آمده و چه نوع اطلاعاتی در آن وجود دارد.",
    input: "RNA + کتابخانه توالی‌یابی",
    output: "خوانش‌های توالی‌یابی در قالب FASTQ",
    mistake:
      "یکی دانستن نمونه زیستی، فایل FASTQ و ماتریس بیان.",
    terms: ["FASTQ", "خوانش", "توالی‌یابی"],
    category: "داده",
  },
  {
    id: "quality-control",
    number: "04",
    title: "کنترل کیفیت",
    englishTitle: "Quality Control",
    shortDescription:
      "قبل از تحلیل، کیفیت داده خام و الگوهای غیرعادی را بررسی می‌کنیم.",
    explanation:
      "در کنترل کیفیت مواردی مانند کیفیت بازها، توالی‌های اضافی، GC content و سایر الگوهای داده بررسی می‌شوند تا مشکلات احتمالی پیش از مراحل بعدی شناسایی شوند.",
    why:
      "داده نامناسب یا مسئله‌دار می‌تواند تمام مراحل بعدی تحلیل را تحت تأثیر قرار دهد.",
    input: "FASTQ",
    output: "گزارش کنترل کیفیت",
    mistake:
      "تصور اینکه هر هشدار در FastQC الزاماً به معنی خراب بودن نمونه است.",
    terms: ["FastQC", "MultiQC", "GC Content"],
    category: "کنترل داده",
  },
  {
    id: "quantification",
    number: "05",
    title: "کمی‌سازی بیان",
    englishTitle: "Quantification",
    shortDescription:
      "میلیون‌ها خوانش را به اطلاعات قابل استفاده درباره بیان ژن تبدیل می‌کنیم.",
    explanation:
      "در این مرحله خوانش‌ها به ژن‌ها یا رونوشت‌ها مرتبط می‌شوند تا در نهایت برای هر ویژگی، مقداری مرتبط با بیان آن به دست آید.",
    why:
      "تحلیل آماری مراحل بعد به یک نمایش ساختاریافته از میزان بیان ژن‌ها نیاز دارد.",
    input: "خوانش‌های توالی‌یابی",
    output: "مقادیر بیان ژن یا رونوشت",
    mistake:
      "تمرکز روی نام ابزار بدون فهمیدن اینکه این مرحله چه تبدیلی روی داده انجام می‌دهد.",
    terms: ["STAR", "Salmon", "featureCounts"],
    category: "پردازش داده",
  },
  {
    id: "expression-matrix",
    number: "06",
    title: "ماتریس بیان",
    englishTitle: "Expression Matrix",
    shortDescription:
      "به نقطه‌ای می‌رسیم که ژن‌ها و نمونه‌ها در یک ماتریس کنار هم قرار می‌گیرند.",
    explanation:
      "ماتریس بیان جدولی است که معمولاً ژن‌ها در سطرها و نمونه‌ها در ستون‌ها قرار دارند. بخش بزرگی از تحلیل‌های بعدی روی چنین ساختاری انجام می‌شود.",
    why:
      "این ماتریس پلی میان پردازش داده توالی‌یابی و تحلیل آماری و زیستی است.",
    input: "مقادیر کمی‌سازی‌شده بیان",
    output: "ماتریس ژن × نمونه",
    mistake:
      "یکی دانستن شمارش خام، TPM، FPKM و داده‌های نرمال‌سازی‌شده.",
    terms: ["شمارش خام", "TPM", "FPKM"],
    category: "ساختار داده",
  },
  {
    id: "normalization",
    number: "07",
    title: "نرمال‌سازی داده",
    englishTitle: "Normalization",
    shortDescription:
      "داده را برای مقایسه معتبرتر میان نمونه‌ها آماده می‌کنیم.",
    explanation:
      "نمونه‌ها ممکن است از نظر عمق توالی‌یابی و برخی ویژگی‌های فنی با یکدیگر تفاوت داشته باشند. روش‌های نرمال‌سازی کمک می‌کنند بخشی از این تفاوت‌ها برای تحلیل مناسب مدیریت شوند.",
    why:
      "مقایسه مستقیم شمارش‌های خام میان نمونه‌ها همیشه قابل دفاع نیست.",
    input: "ماتریس شمارش یا بیان",
    output: "داده آماده‌تر برای هدف مشخص تحلیل",
    mistake:
      "فرض اینکه یک روش نرمال‌سازی برای تمام تحلیل‌ها و تمام مجموعه‌داده‌ها مناسب است.",
    terms: ["Size Factors", "TMM", "Transformation"],
    category: "آمار و آماده‌سازی",
  },
  {
    id: "sample-exploration",
    number: "08",
    title: "بررسی ساختار نمونه‌ها",
    englishTitle: "Sample Exploration",
    shortDescription:
      "قبل از نتیجه‌گیری درباره ژن‌ها، رفتار کلی نمونه‌ها را بررسی می‌کنیم.",
    explanation:
      "روش‌هایی مانند PCA، همبستگی و خوشه‌بندی کمک می‌کنند شباهت نمونه‌ها، نمونه‌های پرت و اثرهای فنی احتمالی را شناسایی کنیم.",
    why:
      "اگر ساختار نمونه‌ها با انتظار پژوهشگر ناسازگار باشد، باید پیش از تفسیر نتایج علت آن بررسی شود.",
    input: "داده بیان آماده‌شده + فراداده",
    output: "PCA + همبستگی + الگوهای نمونه‌ها",
    mistake:
      "تفسیر PCA به‌عنوان اثبات قطعی تفاوت زیستی میان گروه‌ها.",
    terms: ["PCA", "همبستگی", "خوشه‌بندی", "نمونه پرت"],
    category: "اکتشاف داده",
  },
  {
    id: "differential-expression",
    number: "09",
    title: "تحلیل بیان افتراقی",
    englishTitle: "Differential Expression",
    shortDescription:
      "بررسی می‌کنیم کدام ژن‌ها میان شرایط مختلف تغییر کرده‌اند.",
    explanation:
      "در تحلیل بیان افتراقی اثر شرایط موردنظر بر میزان بیان ژن‌ها بررسی می‌شود و خروجی معمولاً شامل اندازه تغییر و شاخص‌های عدم قطعیت آماری است.",
    why:
      "این مرحله یکی از مسیرهای اصلی برای شناسایی تغییرات مولکولی مرتبط با سؤال پژوهشی است.",
    input: "داده بیان + فراداده + مقایسه آماری",
    output: "جدول نتایج بیان افتراقی",
    mistake:
      "انتخاب ژن فقط به دلیل تغییر بیان زیاد و نادیده گرفتن شواهد آماری.",
    terms: ["DESeq2", "edgeR", "FDR", "log2FC"],
    category: "تحلیل آماری",
  },
  {
    id: "visualization",
    number: "10",
    title: "نمایش نتایج",
    englishTitle: "Visualization",
    shortDescription:
      "نتایج را با نمودارهایی مانند نمودار آتشفشانی و نقشه حرارتی بررسی می‌کنیم.",
    explanation:
      "نمایش داده کمک می‌کند الگوهای نتایج بهتر دیده شوند، اما نمودار جای طراحی مطالعه، تحلیل آماری و تفسیر علمی را نمی‌گیرد.",
    why:
      "نمایش مناسب می‌تواند ساختار نتیجه را روشن کند و به شناسایی الگوهای قابل بررسی کمک کند.",
    input: "نتایج تحلیل",
    output: "نمودارها و نمایش‌های تحلیلی",
    mistake:
      "برابر دانستن نمودار زیبا با یک نتیجه معتبر یا قابل انتشار.",
    terms: ["Volcano Plot", "Heatmap", "MA Plot"],
    category: "نمایش داده",
  },
  {
    id: "functional-analysis",
    number: "11",
    title: "تحلیل عملکردی",
    englishTitle: "Functional Analysis",
    shortDescription:
      "از یک فهرست ژنی به فرآیندها و مسیرهای زیستی حرکت می‌کنیم.",
    explanation:
      "روش‌هایی مانند GO، تحلیل غنی‌سازی و GSEA کمک می‌کنند نتایج از سطح ژن‌های منفرد به الگوهای زیستی گسترده‌تر منتقل شوند.",
    why:
      "پژوهشگر معمولاً فقط دنبال یک فهرست ژن نیست؛ می‌خواهد بفهمد چه فرآیندهای زیستی با نتایج مرتبط هستند.",
    input: "فهرست ژنی یا ژن‌های رتبه‌بندی‌شده",
    output: "فرآیندها و مسیرهای زیستی",
    mistake:
      "تفسیر هر مسیر معنی‌دار به‌عنوان اثبات مستقیم فعال یا مهار شدن آن مسیر.",
    terms: ["GO", "KEGG", "GSEA", "تحلیل غنی‌سازی"],
    category: "تفسیر زیستی",
  },
  {
    id: "interpretation",
    number: "12",
    title: "تفسیر زیستی",
    englishTitle: "Biological Interpretation",
    shortDescription:
      "تمام خروجی‌ها را دوباره به سؤال اولیه پژوهش متصل می‌کنیم.",
    explanation:
      "در این مرحله نتایج بیان افتراقی، مسیرهای زیستی، ساختار نمونه‌ها و محدودیت‌های مطالعه کنار هم قرار می‌گیرند تا یک نتیجه‌گیری علمی متناسب با داده ساخته شود.",
    why:
      "هدف نهایی بیوانفورماتیک تولید جدول و نمودار نیست؛ هدف کمک به پاسخ دادن به یک سؤال زیستی است.",
    input: "تمام نتایج + زمینه زیستی",
    output: "تفسیر زیستی قابل دفاع",
    mistake:
      "تبدیل یک ارتباط آماری به رابطه علّی یا نتیجه‌گیری فراتر از توان داده.",
    terms: ["اعتبارسنجی", "منابع علمی", "محدودیت‌ها"],
    category: "جمع‌بندی پژوهش",
  },
];

const entryModes: {
  id: EntryMode;
  title: string;
  englishTitle: string;
  description: string;
  destination: string;
  action: string;
}[] = [
  {
    id: "learn",
    title: "از صفر یاد بگیرم",
    englishTitle: "Learning Mode",
    description:
      "می‌خواهم بفهمم RNA-seq چیست و هر مرحله از تحلیل چرا وجود دارد.",
    destination: "/learn/rna-seq/navigator",
    action: "شروع مسیر تعاملی RNA-seq",
  },
  {
    id: "workflow",
    title: "مسیر تحلیل را بفهمم",
    englishTitle: "Workflow Explorer",
    description:
      "مفاهیم را می‌شناسم، اما می‌خواهم ببینم همه مراحل چگونه به یکدیگر متصل‌اند.",
    destination: "#workflow",
    action: "مشاهده مسیر تحلیل",
  },
  {
    id: "project",
    title: "پروژه خودم را بررسی کنم",
    englishTitle: "Project Mode",
    description:
      "یک سؤال یا پروژه واقعی دارم و می‌خواهم بدانم این مراحل برای پروژه من چگونه‌اند.",
    destination: "/learn/rna-seq/project",
    action: "بررسی پروژه من",
  },
  {
    id: "problem",
    title: "در تحلیل گیر کرده‌ام",
    englishTitle: "Problem Solver",
    description:
      "تحلیل را شروع کرده‌ام اما در طراحی، کنترل کیفیت، PCA، بیان افتراقی یا تفسیر مشکل دارم.",
    destination: "#problem-solver",
    action: "مشاهده مشکلات رایج",
  },
];

function RnaSeqHubPage() {
  const [entryMode, setEntryMode] = useState<EntryMode>("learn");
  const [selectedNodeId, setSelectedNodeId] =
    useState("research-question");

  const selectedNode =
    workflowNodes.find((node) => node.id === selectedNodeId) ??
    workflowNodes[0];

  const selectedMode =
    entryModes.find((mode) => mode.id === entryMode) ??
    entryModes[0];

  return (
    <main
      dir="rtl"
      className="min-h-screen overflow-hidden bg-slate-50 text-right text-slate-900"
    >
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <a
              href="/learn"
              className="font-semibold text-teal-700 transition hover:text-teal-900"
            >
              آموزش هاب‌ژن
            </a>

            <span className="text-slate-300">/</span>
            <span className="text-slate-500">ترنسکریپتومیکس</span>
            <span className="text-slate-300">/</span>

            <span dir="ltr" className="font-medium text-slate-800">
              RNA-seq
            </span>
          </div>

          <a
            href="/learn"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-teal-300 hover:text-teal-800"
          >
            بازگشت به پنج مسیر
          </a>
        </div>
      </div>

      <section className="relative overflow-hidden border-b border-slate-200 bg-white">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-28 -top-28 h-96 w-96 rounded-full bg-teal-100/70 blur-3xl" />
          <div className="absolute -left-24 top-10 h-80 w-80 rounded-full bg-cyan-100/60 blur-3xl" />
          <div className="absolute bottom-0 right-1/3 h-52 w-52 rounded-full bg-emerald-100/40 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full border border-teal-200 bg-teal-50 px-3 py-1.5 text-sm font-semibold text-teal-800">
                  مسیر پژوهشی ۰۱
                </span>

                <span
                  dir="ltr"
                  className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-600"
                >
                  Bulk Transcriptomics
                </span>
              </div>

              <h1 className="mt-7 max-w-4xl text-4xl font-bold leading-[1.35] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                <span dir="ltr">RNA-seq</span> را به شکل یک
                <span className="text-teal-700"> مسیر پژوهشی </span>
                بفهمید.
              </h1>

              <p className="mt-6 max-w-3xl text-lg leading-9 text-slate-600">
                از سؤال زیستی و طراحی مطالعه تا FASTQ، کنترل کیفیت،
                ماتریس بیان، تحلیل بیان افتراقی، تحلیل عملکردی و تفسیر
                زیستی؛ بدون اینکه مجبور باشید یادگیری را از کدنویسی
                شروع کنید.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a
                  href="/learn/rna-seq/navigator"
                  className="inline-flex min-h-12 items-center justify-center rounded-xl bg-slate-950 px-6 py-3 font-semibold text-white transition hover:bg-slate-800"
                >
                  شروع مسیر یادگیری RNA-seq
                </a>

                <a
                  href="/learn/rna-seq/project"
                  className="inline-flex min-h-12 items-center justify-center rounded-xl border border-teal-300 bg-teal-50 px-6 py-3 font-semibold text-teal-800 transition hover:bg-teal-100"
                >
                  پروژه RNA-seq خودم را بررسی کنم
                </a>
              </div>

              <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-500">
                <HeroPoint text="بدون نیاز به برنامه‌نویسی برای شروع" />
                <HeroPoint text="تمرکز روی منطق پژوهش" />
                <HeroPoint text="از مفهوم تا تصمیم پژوهشی" />
              </div>
            </div>

            <RnaSeqHeroVisual />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <span className="text-sm font-semibold text-teal-700">
              شروع مسیر
            </span>

            <h2 className="mt-3 text-3xl font-bold leading-tight text-slate-950">
              قبل از ابزارها، سؤال اصلی را بفهمیم.
            </h2>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-9">
            <p className="text-xl font-bold leading-9 text-slate-950">
              فرض کنید می‌خواهیم بدانیم یک دارو چه تغییری در فعالیت
              ژن‌های سلول‌های سرطان پستان ایجاد کرده است.
            </p>

            <p className="mt-5 leading-8 text-slate-600">
              RNA-seq می‌تواند به ما کمک کند الگوی بیان هزاران ژن را
              در نمونه‌های مختلف بررسی کنیم. اما خود توالی‌یابی فقط
              بخشی از داستان است؛ کیفیت سؤال، طراحی مطالعه، ساختار
              داده، تحلیل آماری و تفسیر زیستی همگی در نتیجه نهایی نقش
              دارند.
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              <MiniConcept
                title="سؤال زیستی"
                englishTitle="Biological Question"
                description="چه چیزی را می‌خواهیم بفهمیم؟"
              />

              <MiniConcept
                title="داده"
                englishTitle="Data"
                description="چه داده‌ای برای پاسخ لازم داریم؟"
              />

              <MiniConcept
                title="تفسیر"
                englishTitle="Interpretation"
                description="نتیجه واقعاً چه چیزی اجازه می‌دهد بگوییم؟"
              />
            </div>
          </div>
        </div>
      </section>

      <section
        id="choose-path"
        className="scroll-mt-8 border-y border-slate-200 bg-white"
      >
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-sm font-semibold text-teal-700">
              انتخاب مسیر
            </span>

            <h2 className="mt-3 text-3xl font-bold text-slate-950">
              امروز برای چه چیزی وارد بخش RNA-seq شده‌اید؟
            </h2>

            <p className="mt-4 leading-8 text-slate-600">
              یک موضوع علمی می‌تواند برای افراد مختلف نقطه شروع
              متفاوتی داشته باشد. مسیر مناسب را بر اساس نیاز فعلی
              خودتان انتخاب کنید.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {entryModes.map((mode) => (
              <button
                key={mode.id}
                type="button"
                onClick={() => setEntryMode(mode.id)}
                className={[
                  "group rounded-3xl border p-6 text-right transition-all duration-200",
                  entryMode === mode.id
                    ? "border-teal-500 bg-teal-50 shadow-md ring-1 ring-teal-100"
                    : "border-slate-200 bg-white hover:-translate-y-1 hover:border-teal-300 hover:shadow-md",
                ].join(" ")}
              >
                <div className="flex items-center justify-between gap-4">
                  <span
                    className={[
                      "flex h-9 w-9 items-center justify-center rounded-xl border text-sm font-bold",
                      entryMode === mode.id
                        ? "border-teal-600 bg-teal-600 text-white"
                        : "border-slate-200 bg-slate-50 text-slate-500",
                    ].join(" ")}
                  >
                    {entryMode === mode.id ? "✓" : "○"}
                  </span>

                  <span
                    dir="ltr"
                    className="text-xs font-semibold text-slate-400"
                  >
                    {mode.englishTitle}
                  </span>
                </div>

                <h3 className="mt-6 text-xl font-bold text-slate-950">
                  {mode.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {mode.description}
                </p>
              </button>
            ))}
          </div>

          <div className="mt-6 overflow-hidden rounded-3xl border border-teal-200 bg-gradient-to-br from-teal-50 via-white to-cyan-50">
            <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
              <div>
                <p className="text-sm font-semibold text-teal-700">
                  قدم بعدی پیشنهادی
                </p>

                <h3 className="mt-2 text-xl font-bold text-slate-950">
                  {selectedMode.title}
                </h3>

                <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
                  {selectedMode.description}
                </p>
              </div>

              <a
                href={selectedMode.destination}
                className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-xl bg-slate-950 px-5 py-2.5 font-semibold text-white transition hover:bg-slate-800"
              >
                {selectedMode.action}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section
        id="workflow"
        className="mx-auto max-w-7xl scroll-mt-8 px-4 py-20 sm:px-6 lg:px-8"
      >
        <div className="max-w-4xl">
          <span className="text-sm font-semibold text-teal-700">
            نقشه تعاملی RNA-seq
          </span>

          <h2 className="mt-3 text-3xl font-bold leading-tight text-slate-950 sm:text-4xl">
            یک پروژه RNA-seq را از ابتدا تا تفسیر ببینید.
          </h2>

          <p className="mt-5 leading-8 text-slate-600">
            روی هر مرحله کلیک کنید. هاب‌ژن به‌جای شروع با نرم‌افزار،
            ابتدا توضیح می‌دهد آن مرحله چیست، چرا انجام می‌شود، چه
            چیزی وارد آن می‌شود و چه چیزی از آن خارج می‌شود.
          </p>
        </div>

        <div className="mt-12 grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="font-bold text-slate-950">
                  نقشه مسیر تحلیل
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  برای مشاهده جزئیات یک مرحله را انتخاب کنید.
                </p>
              </div>

              <span className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-500">
                ۱۲ مرحله
              </span>
            </div>

            <div className="space-y-2">
              {workflowNodes.map((node, index) => {
                const active = node.id === selectedNodeId;

                return (
                  <div key={node.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedNodeId(node.id)}
                      className={[
                        "w-full rounded-2xl border px-4 py-4 text-right transition",
                        active
                          ? "border-teal-500 bg-teal-50 shadow-sm"
                          : "border-transparent bg-slate-50 hover:border-slate-200 hover:bg-white",
                      ].join(" ")}
                    >
                      <div className="flex items-start gap-4">
                        <span
                          dir="ltr"
                          className={[
                            "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold",
                            active
                              ? "bg-teal-700 text-white"
                              : "border border-slate-200 bg-white text-slate-500",
                          ].join(" ")}
                        >
                          {node.number}
                        </span>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <h3
                              className={[
                                "font-bold",
                                active
                                  ? "text-teal-900"
                                  : "text-slate-900",
                              ].join(" ")}
                            >
                              {node.title}
                            </h3>

                            <span className="rounded-lg bg-white px-2 py-1 text-[11px] font-semibold text-slate-400">
                              {node.category}
                            </span>
                          </div>

                          <p
                            dir="ltr"
                            className="mt-1 text-left text-xs font-medium text-slate-400"
                          >
                            {node.englishTitle}
                          </p>
                        </div>
                      </div>
                    </button>

                    {index < workflowNodes.length - 1 && (
                      <div className="mr-[2.05rem] h-3 border-r border-dashed border-slate-300" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="xl:sticky xl:top-6 xl:self-start">
            <LearningNodeCard node={selectedNode} />
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-950 text-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <span className="text-sm font-semibold text-teal-300">
                مسیر حرکت داده
              </span>

              <h2 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">
                بدانید داده شما در هر لحظه کجای مسیر تحلیل قرار دارد.
              </h2>

              <p className="mt-5 leading-8 text-slate-300">
                تازه‌کارها معمولاً نام فایل‌ها و خروجی‌ها را جدا از
                یکدیگر می‌آموزند. در هاب‌ژن رابطه میان این داده‌ها و
                مراحل تحلیل همیشه قابل مشاهده خواهد بود.
              </p>
            </div>

            <div className="space-y-3">
              <DataFlowRow
                label="FASTQ"
                description="داده خام حاصل از توالی‌یابی"
                position="آغاز پردازش محاسباتی"
              />

              <DataFlowRow
                label="QC Report"
                description="گزارشی از وضعیت کیفیت داده خام"
                position="پیش از کمی‌سازی"
              />

              <DataFlowRow
                label="Count Matrix"
                description="شمارش بیان ژن‌ها در نمونه‌ها"
                position="ورودی مهم تحلیل‌های آماری"
              />

              <DataFlowRow
                label="DE Results"
                description="اندازه تغییر و شواهد آماری"
                position="خروجی تحلیل بیان افتراقی"
              />

              <DataFlowRow
                label="Pathways"
                description="حرکت از ژن‌ها به فرآیندهای زیستی"
                position="مرحله تفسیر زیستی"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <span className="text-sm font-semibold text-teal-700">
            اصول کلیدی
          </span>

          <h2 className="mt-3 text-3xl font-bold text-slate-950">
            اگر فقط چند اصل از این مسیر یادتان بماند...
          </h2>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <PrincipleCard
            number="01"
            title="تحلیل از سؤال شروع می‌شود."
            description="DESeq2، STAR یا هر ابزار دیگری فقط بخشی از مسیر است؛ ابتدا باید بدانیم سؤال علمی چیست."
          />

          <PrincipleCard
            number="02"
            title="طراحی ضعیف را همیشه نمی‌توان نجات داد."
            description="تکرار زیستی، فراداده و عوامل مخدوش‌گر پیش از اجرای تحلیل اهمیت دارند."
          />

          <PrincipleCard
            number="03"
            title="ابزار با تحلیل یکی نیست."
            description="DESeq2 یک ابزار برای بخشی از تحلیل بیان افتراقی است، نه تمام پروژه RNA-seq."
          />

          <PrincipleCard
            number="04"
            title="نمودار زیبا کافی نیست."
            description="PCA، نقشه حرارتی و نمودار آتشفشانی باید در کنار طراحی مطالعه و تحلیل آماری درست تفسیر شوند."
          />

          <PrincipleCard
            number="05"
            title="ژن‌های دارای بیان افتراقی پایان داستان نیستند."
            description="نتایج باید در زمینه مسیرهای زیستی، سؤال اصلی و محدودیت‌های مطالعه بررسی شوند."
          />

          <PrincipleCard
            number="06"
            title="ارتباط آماری با رابطه علّی یکی نیست."
            description="RNA-seq می‌تواند الگوهای ارزشمندی نشان دهد، اما نوع نتیجه‌گیری باید متناسب با طراحی مطالعه باشد."
          />
        </div>
      </section>

      <section
        id="project-mode"
        className="scroll-mt-8 border-y border-slate-200 bg-white"
      >
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
            <div>
              <span className="text-sm font-semibold text-teal-700">
                از یادگیری تا پژوهش
              </span>

              <h2 className="mt-3 text-3xl font-bold leading-tight text-slate-950">
                وقتی مفهوم را فهمیدید، سؤال بعدی این است:
                <span className="text-teal-700">
                  {" "}
                  برای پروژه من چطور؟
                </span>
              </h2>

              <p className="mt-5 leading-8 text-slate-600">
                حالت پروژه همین مسیر عمومی را روی سؤال پژوهشی، گروه‌ها،
                نمونه‌ها، نوع داده و هدف واقعی پروژه شما اعمال می‌کند
                و بر اساس وضعیت پروژه، قدم بعدی مناسب‌تری پیشنهاد
                می‌دهد.
              </p>

              <div className="mt-7 rounded-2xl border border-amber-200 bg-amber-50 p-5">
                <p className="font-bold text-amber-950">
                  قابل اجرا بودن ≠ مناسب بودن
                </p>

                <p className="mt-2 text-sm leading-7 text-amber-900/80">
                  اینکه یک تحلیل از نظر فنی قابل اجرا باشد، به این
                  معنی نیست که برای سؤال پژوهشی، داده و طراحی مطالعه
                  شما انتخاب مناسبی است.
                </p>
              </div>

              <a
                href="/learn/rna-seq/project"
                className="mt-7 inline-flex min-h-12 items-center justify-center rounded-xl bg-slate-950 px-6 py-3 font-bold text-white transition hover:bg-slate-800"
              >
                بررسی پروژه RNA-seq من
              </a>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
              <p className="font-bold text-slate-950">
                در حالت پروژه چه چیزهایی بررسی می‌شوند؟
              </p>

              <div className="mt-6 space-y-3">
                <CheckRow text="ساختار سؤال پژوهشی و مقایسه اصلی" />
                <CheckRow text="مرحله فعلی داده: طراحی، FASTQ، ماتریس شمارش یا داده پردازش‌شده" />
                <CheckRow text="تکرارهای زیستی و محدودیت‌های طراحی مطالعه" />
                <CheckRow text="فراداده و عوامل احتمالی مداخله‌گر" />
                <CheckRow text="هدف واقعی تحلیل: بیان افتراقی، تحلیل عملکردی، WGCNA یا نشانگر زیستی" />
                <CheckRow text="مسیر بعدی مناسب یا نیاز به بازبینی تخصصی" />
              </div>

              <div className="mt-7 rounded-2xl bg-slate-950 p-5 text-white">
                <p className="text-sm font-semibold text-teal-300">
                  خروجی
                </p>

                <p className="mt-2 text-lg font-bold">
                  پیشنهاد اولیه متناسب با پروژه شما
                </p>

                <p className="mt-2 text-sm leading-7 text-slate-300">
                  به‌جای یک دستور ثابت برای همه، مقصد بعدی بر اساس
                  سؤال، داده و هدف پروژه تغییر می‌کند.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="problem-solver"
        className="mx-auto max-w-7xl scroll-mt-8 px-4 py-20 sm:px-6 lg:px-8"
      >
        <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <span className="text-sm font-semibold text-teal-700">
              حل مسئله
            </span>

            <h2 className="mt-3 text-3xl font-bold leading-tight text-slate-950">
              اگر تحلیل را شروع کرده‌اید ولی چیزی درست به نظر
              نمی‌رسد.
            </h2>

            <p className="mt-5 leading-8 text-slate-600">
              در این بخش ابتدا مسئله مشخص می‌شود، سپس هاب‌ژن راهنمای
              آموزشی و بررسی‌های اولیه را پیشنهاد می‌دهد و فقط در
              تصمیم‌های پروژه‌محور، بازبینی تخصصی وارد مسیر می‌شود.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <ProblemCard
              title="PCA عجیب است"
              text="نمونه‌ها مطابق انتظار گروه‌بندی نشده‌اند."
            />

            <ProblemCard
              title="ژن دارای بیان افتراقی پیدا نمی‌کنم"
              text="نتایج تحلیل بیان افتراقی تقریباً خالی است."
            />

            <ProblemCard
              title="تعداد نتایج خیلی زیاد است"
              text="تعداد بسیار زیادی از ژن‌ها از نظر آماری معنی‌دار شده‌اند."
            />

            <ProblemCard
              title="اثر دسته‌ای دارم"
              text="یک عامل فنی ممکن است بر ساختار نمونه‌ها غالب شده باشد."
            />

            <ProblemCard
              title="نوع داده را نمی‌شناسم"
              text="نمی‌دانم فایل من شمارش خام، TPM یا نوع دیگری از داده بیان است."
            />

            <ProblemCard
              title="نتیجه قابل تفسیر نیست"
              text="نمودار و فهرست ژنی دارم، اما روایت زیستی منسجمی شکل نگرفته است."
            />
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-100">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-sm font-semibold text-teal-700">
              ارتباط با مسیرهای دیگر
            </span>

            <h2 className="mt-3 text-3xl font-bold text-slate-950">
              RNA-seq یک جزیره جدا نیست.
            </h2>

            <p className="mt-4 leading-8 text-slate-600">
              وقتی سؤال پژوهشی یا هدف تحلیل تغییر می‌کند، ممکن است از
              این مسیر وارد یکی از حوزه‌های دیگر هاب‌ژن شوید.
            </p>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            <ResearchConnectionCard
              englishTitle="Public Data Research"
              title="پژوهش با داده‌های عمومی"
              question="داده ندارید یا برای اعتبارسنجی به یک گروه مستقل نیاز دارید؟"
              description="در GEO، SRA یا منابع عمومی مجموعه‌داده مناسب پیدا کنید و پیش از تحلیل، تناسب آن را با سؤال پژوهشی بررسی کنید."
              direction="RNA-seq ↔ Public Data"
            />

            <ResearchConnectionCard
              englishTitle="Network Biology"
              title="زیست‌شناسی شبکه‌ای"
              question="می‌خواهید روابط میان ژن‌ها را فراتر از بیان افتراقی بررسی کنید؟"
              description="در صورت مناسب بودن طراحی، ماتریس بیان می‌تواند شما را وارد تحلیل هم‌بیانی و روش‌هایی مانند WGCNA کند."
              direction="RNA-seq → Network"
            />

            <ResearchConnectionCard
              englishTitle="Single-cell Transcriptomics"
              title="ترنسکریپتومیکس تک‌سلولی"
              question="می‌خواهید بدانید تغییر بیان مربوط به کدام جمعیت سلولی است؟"
              description="اگر سؤال شما به ناهمگونی سلولی مربوط باشد، مسیر تک‌سلولی می‌تواند قدم بعدی پژوهش باشد."
              direction="Bulk → Single-cell"
            />
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-[2rem] bg-slate-950 text-white">
            <div className="grid lg:grid-cols-[1fr_0.8fr]">
              <div className="p-8 sm:p-10 lg:p-12">
                <span className="text-sm font-semibold text-teal-300">
                  راهنمای پژوهشی هاب‌ژن
                </span>

                <h2 className="mt-4 max-w-2xl text-3xl font-bold leading-tight sm:text-4xl">
                  هدف فقط تعریف RNA-seq نیست؛ می‌خواهیم کاربر بداند
                  الان کجاست و قدم بعدی‌اش چیست.
                </h2>

                <p className="mt-5 max-w-2xl leading-8 text-slate-300">
                  می‌توانید ابتدا مسیر را یاد بگیرید یا مستقیماً وضعیت
                  پروژه واقعی خودتان را بررسی کنید.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <a
                    href="/learn/rna-seq/navigator"
                    className="inline-flex min-h-12 items-center justify-center rounded-xl bg-teal-500 px-6 py-3 font-bold text-slate-950 transition hover:bg-teal-400"
                  >
                    شروع مسیر یادگیری
                  </a>

                  <a
                    href="/learn/rna-seq/project"
                    className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/20 bg-white/5 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
                  >
                    بررسی پروژه من
                  </a>
                </div>
              </div>

              <div className="border-t border-white/10 bg-white/[0.04] p-8 sm:p-10 lg:border-r lg:border-t-0 lg:p-12">
                <p className="text-sm font-semibold text-slate-400">
                  منطق مسیر هاب‌ژن
                </p>

                <div className="mt-6 space-y-4">
                  <FinalStep number="1" text="سؤال را بفهم" />
                  <FinalStep number="2" text="داده را بشناس" />
                  <FinalStep number="3" text="مسیر تحلیل را طراحی کن" />
                  <FinalStep number="4" text="نتیجه را درست تفسیر کن" />
                </div>

                <div className="mt-8 rounded-2xl border border-teal-400/20 bg-teal-400/10 p-5">
                  <p className="text-sm font-bold text-teal-200">
                    سؤال ← داده ← تحلیل ← تصمیم ← تفسیر
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function RnaSeqHeroVisual() {
  return (
    <div className="relative">
      <div className="absolute -inset-6 rounded-full bg-teal-100/60 blur-3xl" />

      <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-950 p-6 shadow-2xl shadow-slate-200/70 sm:p-8">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-teal-300">
              نقشه پژوهشی RNA-seq
            </p>

            <p
              dir="ltr"
              className="mt-1 text-left text-xs text-slate-400"
            >
              RNA-seq Research Map
            </p>
          </div>

          <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
            <span className="h-3 w-3 rounded-full bg-teal-400 shadow-lg shadow-teal-400/50" />
          </span>
        </div>

        <div className="mt-8 space-y-3">
          <VisualFlowStep
            number="01"
            title="سؤال پژوهشی"
            englishTitle="Research Question"
            subtitle="دقیقاً چه چیزی را می‌خواهیم بفهمیم؟"
            active
          />

          <VisualConnector />

          <VisualFlowStep
            number="02"
            title="طراحی مطالعه"
            englishTitle="Experimental Design"
            subtitle="نمونه‌ها، گروه‌ها و فراداده"
          />

          <VisualConnector />

          <VisualFlowStep
            number="03"
            title="داده‌های RNA-seq"
            englishTitle="RNA-seq Data"
            subtitle="FASTQ ← کنترل کیفیت ← ماتریس بیان"
          />

          <VisualConnector />

          <VisualFlowStep
            number="04"
            title="تحلیل آماری"
            englishTitle="Statistical Analysis"
            subtitle="PCA ← بیان افتراقی ← نمایش نتایج"
          />

          <VisualConnector />

          <VisualFlowStep
            number="05"
            title="تفسیر زیستی"
            englishTitle="Biological Interpretation"
            subtitle="مسیرهای زیستی و نتیجه‌گیری علمی"
          />
        </div>

        <div className="mt-8 grid grid-cols-3 gap-2 border-t border-white/10 pt-6">
          <VisualMetric value="چرا؟" label="منطق مرحله" />
          <VisualMetric value="ورودی" label="داده ورودی" />
          <VisualMetric value="خروجی" label="نتیجه مرحله" />
        </div>
      </div>
    </div>
  );
}

function VisualFlowStep({
  number,
  title,
  englishTitle,
  subtitle,
  active = false,
}: {
  number: string;
  title: string;
  englishTitle: string;
  subtitle: string;
  active?: boolean;
}) {
  return (
    <div
      className={[
        "flex items-center gap-4 rounded-2xl border p-4 text-right",
        active
          ? "border-teal-400/40 bg-teal-400/10"
          : "border-white/10 bg-white/[0.04]",
      ].join(" ")}
    >
      <span
        dir="ltr"
        className={[
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold",
          active
            ? "bg-teal-400 text-slate-950"
            : "bg-white/10 text-slate-300",
        ].join(" ")}
      >
        {number}
      </span>

      <div className="flex-1">
        <p className="font-semibold text-white">{title}</p>

        <p
          dir="ltr"
          className="mt-0.5 text-left text-[11px] font-medium text-teal-200/70"
        >
          {englishTitle}
        </p>

        <p className="mt-1 text-xs text-slate-400">{subtitle}</p>
      </div>
    </div>
  );
}

function VisualConnector() {
  return (
    <div className="mr-[1.15rem] flex h-3 items-center">
      <div className="h-full border-r border-dashed border-teal-400/30" />
    </div>
  );
}

function VisualMetric({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-xl bg-white/[0.04] p-3 text-center">
      <p className="text-xs font-black text-teal-300">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{label}</p>
    </div>
  );
}

function HeroPoint({ text }: { text: string }) {
  return (
    <span className="flex items-center gap-2">
      <span className="h-2 w-2 rounded-full bg-teal-500" />
      {text}
    </span>
  );
}

function MiniConcept({
  title,
  englishTitle,
  description,
}: {
  title: string;
  englishTitle: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-sm font-bold text-slate-900">{title}</p>

      <p
        dir="ltr"
        className="mt-0.5 text-left text-[11px] font-semibold text-slate-400"
      >
        {englishTitle}
      </p>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {description}
      </p>
    </div>
  );
}

function LearningNodeCard({ node }: { node: WorkflowNode }) {
  return (
    <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg shadow-slate-200/50">
      <div className="border-b border-slate-200 bg-gradient-to-l from-teal-50 via-white to-white p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-lg bg-slate-950 px-2.5 py-1.5 text-xs font-bold text-white">
                مرحله {node.number}
              </span>

              <span className="rounded-lg border border-teal-200 bg-teal-50 px-2.5 py-1.5 text-xs font-semibold text-teal-700">
                {node.category}
              </span>
            </div>

            <h3 className="mt-5 text-2xl font-bold text-slate-950">
              {node.title}
            </h3>

            <p
              dir="ltr"
              className="mt-1 text-left text-sm font-semibold text-teal-700"
            >
              {node.englishTitle}
            </p>
          </div>
        </div>

        <p className="mt-5 text-lg leading-8 text-slate-700">
          {node.shortDescription}
        </p>
      </div>

      <div className="space-y-7 p-6 sm:p-8">
        <LearningSection title="این مرحله چیست؟">
          <p>{node.explanation}</p>
        </LearningSection>

        <LearningSection title="چرا اهمیت دارد؟">
          <p>{node.why}</p>
        </LearningSection>

        <div className="grid gap-3 sm:grid-cols-2">
          <IOCard label="ورودی" value={node.input} type="IN" />
          <IOCard label="خروجی" value={node.output} type="OUT" />
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <p className="text-sm font-bold text-amber-950">
            اشتباه رایج
          </p>

          <p className="mt-2 text-sm leading-7 text-amber-900/80">
            {node.mistake}
          </p>
        </div>

        <LearningSection title="اصطلاحات، روش‌ها و ابزارهای مرتبط">
          <div className="flex flex-wrap gap-2">
            {node.terms.map((term) => (
              <span
                key={term}
                className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-600"
              >
                {term}
              </span>
            ))}
          </div>
        </LearningSection>

        <div className="border-t border-slate-100 pt-6">
          <a
            href="/learn/rna-seq/navigator"
            className="inline-flex w-full items-center justify-center rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm font-bold text-teal-800 transition hover:bg-teal-100"
          >
            این مفهوم را در مسیر یادگیری تمرین کنم
          </a>
        </div>
      </div>
    </article>
  );
}

function LearningSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h4 className="text-sm font-bold text-slate-950">{title}</h4>

      <div className="mt-2 text-sm leading-8 text-slate-600">
        {children}
      </div>
    </section>
  );
}

function IOCard({
  label,
  value,
  type,
}: {
  label: string;
  value: string;
  type: "IN" | "OUT";
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-bold text-slate-900">{label}</p>

        <span
          className={[
            "rounded-lg px-2 py-1 text-[10px] font-black",
            type === "IN"
              ? "bg-cyan-100 text-cyan-800"
              : "bg-teal-100 text-teal-800",
          ].join(" ")}
        >
          {type === "IN" ? "ورودی" : "خروجی"}
        </span>
      </div>

      <p className="mt-3 text-sm leading-7 text-slate-600">{value}</p>
    </div>
  );
}

function DataFlowRow({
  label,
  description,
  position,
}: {
  label: string;
  description: string;
  position: string;
}) {
  return (
    <div className="grid gap-3 rounded-2xl border border-white/10 bg-white/[0.05] p-5 sm:grid-cols-[0.55fr_1fr_1fr] sm:items-center">
      <p dir="ltr" className="font-bold text-teal-300">
        {label}
      </p>

      <p className="text-sm text-slate-200">{description}</p>

      <p className="text-sm text-slate-400">{position}</p>
    </div>
  );
}

function PrincipleCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <span
        dir="ltr"
        className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-xs font-bold text-white"
      >
        {number}
      </span>

      <h3 className="mt-6 text-xl font-bold leading-8 text-slate-950">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-7 text-slate-600">
        {description}
      </p>
    </article>
  );
}

function CheckRow({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4">
      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-100 text-xs font-bold text-teal-700">
        ✓
      </span>

      <p className="text-sm leading-7 text-slate-700">{text}</p>
    </div>
  );
}

function ProblemCard({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-teal-300 hover:shadow-md">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-sm font-bold text-rose-600">
        ?
      </div>

      <h3 className="mt-5 font-bold text-slate-950">{title}</h3>

      <p className="mt-2 text-sm leading-7 text-slate-600">{text}</p>

      <div className="mt-4 border-t border-slate-100 pt-4">
        <span className="text-xs font-semibold text-teal-700">
          راهنما ← بررسی ← بازبینی تخصصی
        </span>
      </div>
    </article>
  );
}

function ResearchConnectionCard({
  englishTitle,
  title,
  question,
  description,
  direction,
}: {
  englishTitle: string;
  title: string;
  question: string;
  description: string;
  direction: string;
}) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <span
        dir="ltr"
        className="inline-flex rounded-lg bg-teal-50 px-3 py-1.5 text-xs font-bold text-teal-700"
      >
        {direction}
      </span>

      <h3 className="mt-6 text-lg font-bold text-slate-950">{title}</h3>

      <p
        dir="ltr"
        className="mt-1 text-left text-xs font-semibold text-slate-400"
      >
        {englishTitle}
      </p>

      <p className="mt-4 font-bold leading-7 text-slate-800">
        {question}
      </p>

      <p className="mt-3 text-sm leading-7 text-slate-600">
        {description}
      </p>
    </article>
  );
}

function FinalStep({
  number,
  text,
}: {
  number: string;
  text: string;
}) {
  return (
    <div className="flex items-center gap-4">
      <span
        dir="ltr"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-xs font-bold text-teal-300"
      >
        {number}
      </span>

      <p className="font-semibold text-slate-200">{text}</p>
    </div>
  );
}
