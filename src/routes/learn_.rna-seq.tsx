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
  tools: string[];
  category: string;
};

const workflowNodes: WorkflowNode[] = [
  {
    id: "research-question",
    number: "01",
    title: "سؤال پژوهشی",
    englishTitle: "Research Question",
    shortDescription: "قبل از انتخاب ابزار، باید بدانیم دقیقاً چه چیزی را می‌خواهیم بفهمیم.",
    explanation:
      "یک پروژه RNA-seq از یک سؤال زیستی روشن شروع می‌شود. مثلاً می‌خواهیم بدانیم درمان با یک دارو چه تغییری در الگوی بیان ژن سلول‌های سرطانی ایجاد می‌کند.",
    why:
      "سؤال پژوهشی مشخص می‌کند چه گروه‌هایی باید مقایسه شوند، چه نوع داده‌ای نیاز داریم و کدام تحلیل‌ها واقعاً معنی‌دار هستند.",
    input: "مسئله یا فرضیه زیستی",
    output: "سؤال قابل تحلیل و مقایسه مشخص",
    mistake:
      "شروع پروژه با انتخاب نرم‌افزار یا روش، بدون مشخص بودن سؤال زیستی.",
    tools: ["Study Design", "Biological Reasoning"],
    category: "Design",
  },
  {
    id: "study-design",
    number: "02",
    title: "طراحی مطالعه",
    englishTitle: "Experimental Design",
    shortDescription: "گروه‌ها، نمونه‌ها، Replicateها و عوامل مداخله‌گر را درست تعریف می‌کنیم.",
    explanation:
      "قبل از sequencing باید مشخص باشد چند گروه داریم، Biological Replicateها چگونه تعریف شده‌اند و آیا عواملی مثل Batch، سن، جنس یا شرایط آزمایش می‌توانند روی نتیجه اثر بگذارند.",
    why:
      "بسیاری از مشکلات طراحی مطالعه را نمی‌توان بعداً فقط با نرم‌افزار اصلاح کرد.",
    input: "سؤال پژوهشی + ساختار نمونه‌ها",
    output: "طرح مقایسه و Metadata موردنیاز",
    mistake:
      "تصور اینکه تعداد کم Biological Replicate را می‌توان بعداً با تحلیل آماری جبران کرد.",
    tools: ["Metadata", "Replicates", "Covariates"],
    category: "Design",
  },
  {
    id: "sequencing",
    number: "03",
    title: "از نمونه تا Sequencing",
    englishTitle: "Sample to Sequencing",
    shortDescription: "می‌بینیم چگونه نمونه زیستی در نهایت به داده محاسباتی تبدیل می‌شود.",
    explanation:
      "RNA از نمونه استخراج می‌شود، Library ساخته می‌شود و دستگاه sequencing میلیون‌ها قطعه توالی را می‌خواند. خروجی خام محاسباتی معمولاً به شکل فایل‌های FASTQ در اختیار تحلیل‌گر قرار می‌گیرد.",
    why:
      "برای تحلیل درست باید بدانیم داده خام از کجا آمده و چه نوع اطلاعاتی در آن وجود دارد.",
    input: "RNA و Library",
    output: "Sequencing Reads / FASTQ",
    mistake:
      "یکی دانستن نمونه زیستی، فایل FASTQ و Expression Matrix.",
    tools: ["FASTQ", "Sequencing"],
    category: "Data",
  },
  {
    id: "quality-control",
    number: "04",
    title: "کنترل کیفیت",
    englishTitle: "Quality Control",
    shortDescription: "قبل از تحلیل، کیفیت داده خام و الگوهای غیرعادی را بررسی می‌کنیم.",
    explanation:
      "در QC مواردی مثل کیفیت Baseها، Adapter content، GC content و سایر الگوهای داده بررسی می‌شوند تا مشکلات احتمالی قبل از مراحل بعدی شناسایی شوند.",
    why:
      "داده نامناسب یا مشکل‌دار می‌تواند تمام مراحل پایین‌دستی را تحت تأثیر قرار دهد.",
    input: "FASTQ",
    output: "QC Report",
    mistake:
      "تصور اینکه هر Warning در FastQC الزاماً به معنی خراب بودن نمونه است.",
    tools: ["FastQC", "MultiQC"],
    category: "Data",
  },
  {
    id: "quantification",
    number: "05",
    title: "شمارش و Quantification",
    englishTitle: "Quantification",
    shortDescription: "میلیون‌ها Read را به اطلاعات قابل استفاده درباره بیان ژن تبدیل می‌کنیم.",
    explanation:
      "در این مرحله Reads به ژن‌ها یا Transcriptها مرتبط می‌شوند و در نهایت برای هر Feature مقدار بیان به دست می‌آید.",
    why:
      "تحلیل آماری پایین‌دستی به یک نمایش ساختاریافته از میزان بیان ژن‌ها نیاز دارد.",
    input: "Sequencing Reads",
    output: "Gene / Transcript Quantification",
    mistake:
      "تمرکز روی نام ابزار بدون فهمیدن اینکه این مرحله چه تبدیل مفهومی روی داده انجام می‌دهد.",
    tools: ["STAR", "Salmon", "featureCounts"],
    category: "Processing",
  },
  {
    id: "expression-matrix",
    number: "06",
    title: "ماتریس بیان ژن",
    englishTitle: "Expression Matrix",
    shortDescription: "به نقطه‌ای می‌رسیم که ژن‌ها و نمونه‌ها در یک ماتریس کنار هم قرار می‌گیرند.",
    explanation:
      "Expression Matrix جدولی است که معمولاً Featureها در سطرها و Sampleها در ستون‌ها قرار دارند. بخش بزرگی از تحلیل‌های downstream روی چنین ساختاری انجام می‌شود.",
    why:
      "این ماتریس پلی میان پردازش داده sequencing و تحلیل آماری و زیستی است.",
    input: "Quantified expression",
    output: "Gene × Sample Matrix",
    mistake:
      "یکی دانستن Raw Counts، TPM، FPKM و مقادیر Normalized.",
    tools: ["Counts", "TPM", "Metadata"],
    category: "Processing",
  },
  {
    id: "normalization",
    number: "07",
    title: "Normalization",
    englishTitle: "Normalization",
    shortDescription: "داده را برای مقایسه معتبرتر میان Sampleها آماده می‌کنیم.",
    explanation:
      "Sampleها ممکن است از نظر sequencing depth و سایر ویژگی‌های فنی تفاوت داشته باشند. روش‌های Normalization تلاش می‌کنند اثر برخی از این تفاوت‌ها را برای تحلیل مناسب مدیریت کنند.",
    why:
      "مقایسه ساده Raw Countها میان Sampleها همیشه قابل دفاع نیست.",
    input: "Count / Expression Matrix",
    output: "Data suitable for downstream comparisons",
    mistake:
      "فرض اینکه یک نوع Normalization برای تمام تحلیل‌ها و تمام Datasetها مناسب است.",
    tools: ["DESeq2 size factors", "TMM", "Transformations"],
    category: "Statistics",
  },
  {
    id: "sample-exploration",
    number: "08",
    title: "بررسی ساختار Sampleها",
    englishTitle: "Sample Exploration",
    shortDescription: "قبل از نتیجه‌گیری درباره ژن‌ها، رفتار کلی Sampleها را می‌بینیم.",
    explanation:
      "روش‌هایی مثل PCA، Sample Correlation و Clustering کمک می‌کنند شباهت Sampleها، Outlierهای احتمالی و اثر Batch یا سایر ساختارهای مهم داده دیده شوند.",
    why:
      "اگر ساختار Sampleها با انتظار پژوهشگر ناسازگار باشد، باید قبل از تفسیر نتایج آن را بررسی کرد.",
    input: "Prepared Expression Data",
    output: "PCA / Correlation / Sample-level patterns",
    mistake:
      "تفسیر PCA به‌عنوان اثبات قطعی تفاوت زیستی بین گروه‌ها.",
    tools: ["PCA", "Correlation", "Clustering"],
    category: "Statistics",
  },
  {
    id: "differential-expression",
    number: "09",
    title: "بیان افتراقی",
    englishTitle: "Differential Expression",
    shortDescription: "بررسی می‌کنیم کدام ژن‌ها بین شرایط مختلف تغییر کرده‌اند.",
    explanation:
      "در Differential Expression اثر شرایط موردنظر بر بیان ژن‌ها بررسی می‌شود و خروجی معمولاً شامل اندازه تغییر و شاخص‌های عدم قطعیت آماری است.",
    why:
      "این مرحله یکی از مسیرهای اصلی برای شناسایی تغییرات transcriptional مرتبط با سؤال پژوهشی است.",
    input: "Expression Data + Metadata + Contrast",
    output: "Differential Expression Results",
    mistake:
      "انتخاب ژن فقط به دلیل Fold Change بالا و نادیده گرفتن شواهد آماری و طراحی مطالعه.",
    tools: ["DESeq2", "edgeR", "limma-voom"],
    category: "Analysis",
  },
  {
    id: "visualization",
    number: "10",
    title: "نمایش و خواندن نتایج",
    englishTitle: "Visualization",
    shortDescription: "نتایج آماری را با نمودارهایی مثل Volcano و Heatmap بررسی می‌کنیم.",
    explanation:
      "Visualization کمک می‌کند الگوهای نتایج بهتر دیده شوند، اما نمودار جای تحلیل آماری، طراحی صحیح و تفسیر علمی را نمی‌گیرد.",
    why:
      "نمایش مناسب می‌تواند ساختار نتیجه را روشن کند و به کشف الگوهای قابل بررسی کمک کند.",
    input: "Statistical Results",
    output: "Volcano Plot / Heatmap / MA Plot",
    mistake:
      "برابر دانستن نمودار زیبا با نتیجه معتبر یا قابل انتشار.",
    tools: ["Volcano Plot", "Heatmap", "MA Plot"],
    category: "Analysis",
  },
  {
    id: "functional-analysis",
    number: "11",
    title: "تحلیل عملکردی",
    englishTitle: "Functional Analysis",
    shortDescription: "از یک لیست ژن به فرآیندها، Pathwayها و معنی زیستی حرکت می‌کنیم.",
    explanation:
      "روش‌هایی مثل GO، pathway enrichment و GSEA کمک می‌کنند نتایج از سطح ژن‌های منفرد به الگوهای زیستی گسترده‌تر منتقل شوند.",
    why:
      "پژوهشگر معمولاً فقط دنبال فهرست ژن نیست؛ می‌خواهد بفهمد چه فرآیندهای زیستی تحت تأثیر قرار گرفته‌اند.",
    input: "Gene List or Ranked Genes",
    output: "Biological Processes / Pathways",
    mistake:
      "تفسیر هر Pathway معنی‌دار به‌عنوان اثبات مستقیم فعال یا غیرفعال شدن یک فرآیند.",
    tools: ["GO", "KEGG", "GSEA"],
    category: "Interpretation",
  },
  {
    id: "interpretation",
    number: "12",
    title: "تفسیر زیستی",
    englishTitle: "Biological Interpretation",
    shortDescription: "تمام خروجی‌ها را دوباره به سؤال اولیه پژوهش متصل می‌کنیم.",
    explanation:
      "در این مرحله DEGها، Pathwayها، الگوهای Sampleها و محدودیت‌های مطالعه کنار هم قرار می‌گیرند تا یک نتیجه‌گیری علمی متناسب با داده ساخته شود.",
    why:
      "هدف نهایی Bioinformatics تولید جدول و نمودار نیست؛ کمک به پاسخ دادن به یک سؤال زیستی است.",
    input: "All analytical results + biological context",
    output: "Defensible Biological Story",
    mistake:
      "تبدیل Association آماری به ادعای Causality یا نتیجه‌گیری فراتر از توان داده.",
    tools: ["Biological Context", "Literature", "Validation"],
    category: "Interpretation",
  },
];

const entryModes: {
  id: EntryMode;
  title: string;
  english: string;
  description: string;
  destination: string;
  action: string;
}[] = [
  {
    id: "learn",
    title: "از صفر یاد بگیرم",
    english: "Learning Mode",
    description:
      "می‌خواهم بفهمم RNA-seq چیست و هر مرحله از تحلیل چرا وجود دارد.",
    destination: "#workflow",
    action: "شروع از نقشه تحلیل",
  },
  {
    id: "workflow",
    title: "Workflow را بفهمم",
    english: "Workflow Explorer",
    description:
      "مفاهیم را می‌شناسم ولی می‌خواهم ببینم همه مراحل چگونه به هم متصل‌اند.",
    destination: "#workflow",
    action: "مشاهده Workflow",
  },
  {
    id: "project",
    title: "برای پروژه خودم بررسی کنم",
    english: "Project Mode",
    description:
      "یک سؤال یا پروژه واقعی دارم و می‌خواهم بدانم این مراحل برای من چگونه‌اند.",
    destination: "#project-mode",
    action: "بررسی مسیر پروژه",
  },
  {
    id: "problem",
    title: "در تحلیل گیر کرده‌ام",
    english: "Problem Solver",
    description:
      "تحلیل را شروع کرده‌ام اما در طراحی، QC، PCA، DEG یا تفسیر مشکل دارم.",
    destination: "#problem-solver",
    action: "مشاهده مشکلات رایج",
  },
];

function RnaSeqHubPage() {
  const [entryMode, setEntryMode] = useState<EntryMode>("learn");
  const [selectedNodeId, setSelectedNodeId] = useState("research-question");

  const selectedNode =
    workflowNodes.find((node) => node.id === selectedNodeId) ?? workflowNodes[0];

  const selectedMode =
    entryModes.find((mode) => mode.id === entryMode) ?? entryModes[0];

  return (
    <main
      dir="rtl"
      className="min-h-screen overflow-hidden bg-slate-50 text-right text-slate-900"
    >
      {/* TOP BAR */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <a
              href="/learn"
              className="font-semibold text-teal-700 transition hover:text-teal-900"
            >
              HubGene Learn
            </a>
            <span className="text-slate-300">/</span>
            <span className="text-slate-500">Bulk Transcriptomics</span>
            <span className="text-slate-300">/</span>
            <span className="font-medium text-slate-800">RNA-seq</span>
          </div>

          <a
            href="/learn"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-teal-300 hover:text-teal-800"
          >
            بازگشت به پنج مسیر
          </a>
        </div>
      </div>

      {/* HERO */}
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
                  Research Line 01
                </span>
                <span
                  dir="ltr"
                  className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-600"
                >
                  Bulk Transcriptomics
                </span>
              </div>

              <h1 className="mt-7 max-w-4xl text-4xl font-bold leading-[1.35] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                RNA-seq را به شکل یک
                <span className="text-teal-700"> مسیر پژوهشی </span>
                بفهمید.
              </h1>

              <p className="mt-6 max-w-3xl text-lg leading-9 text-slate-600">
                از سؤال زیستی و طراحی مطالعه تا FASTQ، کنترل کیفیت، ماتریس
                بیان ژن، Differential Expression، تحلیل عملکردی و تفسیر
                زیستی؛ بدون اینکه مجبور باشید یادگیری را از کدنویسی شروع کنید.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a
                  href="#choose-path"
                  className="inline-flex min-h-12 items-center justify-center rounded-xl bg-slate-950 px-6 py-3 font-semibold text-white transition hover:bg-slate-800"
                >
                  مسیر مناسبم را انتخاب کنم
                </a>

                <a
                  href="#workflow"
                  className="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-800 transition hover:border-teal-400 hover:text-teal-800"
                >
                  Workflow کامل را ببینم
                </a>
              </div>

              <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-500">
                <HeroPoint text="بدون نیاز به برنامه‌نویسی برای شروع" />
                <HeroPoint text="تمرکز روی منطق پژوهش" />
                <HeroPoint text="از Concept تا Biological Story" />
              </div>
            </div>

            <RnaSeqHeroVisual />
          </div>
        </div>
      </section>

      {/* WHAT IS RNA-SEQ */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <span className="text-sm font-semibold text-teal-700">
              Start Here
            </span>
            <h2 className="mt-3 text-3xl font-bold leading-tight text-slate-950">
              قبل از ابزارها، سؤال اصلی را بفهمیم.
            </h2>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-9">
            <p className="text-xl font-bold leading-9 text-slate-950">
              فرض کنید می‌خواهیم بدانیم یک دارو چه تغییری در فعالیت ژن‌های
              سلول‌های سرطان پستان ایجاد کرده است.
            </p>

            <p className="mt-5 leading-8 text-slate-600">
              RNA-seq می‌تواند به ما کمک کند الگوی بیان هزاران ژن را در
              نمونه‌های مختلف بررسی کنیم. اما خود sequencing فقط بخشی از
              داستان است؛ کیفیت سؤال، طراحی مطالعه، ساختار داده، تحلیل آماری و
              تفسیر زیستی همگی در نتیجه نهایی نقش دارند.
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              <MiniConcept
                title="Biological Question"
                description="چه چیزی را می‌خواهیم بفهمیم؟"
              />
              <MiniConcept
                title="Data"
                description="چه داده‌ای برای پاسخ لازم داریم؟"
              />
              <MiniConcept
                title="Interpretation"
                description="نتیجه واقعاً چه چیزی اجازه می‌دهد بگوییم؟"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ENTRY MODE */}
      <section
        id="choose-path"
        className="scroll-mt-8 border-y border-slate-200 bg-white"
      >
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-sm font-semibold text-teal-700">
              Choose Your Mode
            </span>
            <h2 className="mt-3 text-3xl font-bold text-slate-950">
              امروز برای چه چیزی وارد RNA-seq Hub شده‌اید؟
            </h2>
            <p className="mt-4 leading-8 text-slate-600">
              یک موضوع علمی می‌تواند برای افراد مختلف نقطه شروع متفاوتی داشته
              باشد. مسیر مناسب را بر اساس نیاز فعلی خودتان انتخاب کنید.
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
                    className="text-xs font-semibold tracking-wide text-slate-400"
                  >
                    {mode.english}
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

      {/* WORKFLOW */}
      <section
        id="workflow"
        className="mx-auto max-w-7xl scroll-mt-8 px-4 py-20 sm:px-6 lg:px-8"
      >
        <div className="max-w-4xl">
          <span className="text-sm font-semibold text-teal-700">
            RNA-seq Workflow Explorer
          </span>

          <h2 className="mt-3 text-3xl font-bold leading-tight text-slate-950 sm:text-4xl">
            یک پروژه RNA-seq را از ابتدا تا تفسیر ببینید.
          </h2>

          <p className="mt-5 leading-8 text-slate-600">
            روی هر مرحله کلیک کنید. هاب‌ژن به‌جای شروع با نرم‌افزار، ابتدا
            توضیح می‌دهد آن مرحله چیست، چرا انجام می‌شود، چه چیزی وارد آن
            می‌شود و چه چیزی از آن خارج می‌شود.
          </p>
        </div>

        <div className="mt-12 grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
          {/* WORKFLOW NAV */}
          <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="font-bold text-slate-950">نقشه مسیر</p>
                <p className="mt-1 text-sm text-slate-500">
                  برای مشاهده جزئیات یک مرحله را انتخاب کنید.
                </p>
              </div>

              <span
                dir="ltr"
                className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-500"
              >
                12 Nodes
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

          {/* ACTIVE LEARNING CARD */}
          <div className="xl:sticky xl:top-6 xl:self-start">
            <LearningNodeCard node={selectedNode} />
          </div>
        </div>
      </section>

      {/* DATA FLOW */}
      <section className="border-y border-slate-200 bg-slate-950 text-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <span className="text-sm font-semibold text-teal-300">
                Follow the Data
              </span>

              <h2 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">
                یکی از مهم‌ترین مهارت‌ها این است که بدانید داده شما الان کجای
                مسیر قرار دارد.
              </h2>

              <p className="mt-5 leading-8 text-slate-300">
                تازه‌کارها معمولاً اسم فایل‌ها و خروجی‌ها را جدا از هم
                می‌آموزند. در هاب‌ژن می‌خواهیم همیشه رابطه میان آن‌ها قابل
                مشاهده باشد.
              </p>
            </div>

            <div className="space-y-3">
              <DataFlowRow
                label="FASTQ"
                description="داده خام Sequencing"
                position="شروع پردازش محاسباتی"
              />
              <DataFlowRow
                label="QC Report"
                description="تصویری از کیفیت داده خام"
                position="قبل از Quantification"
              />
              <DataFlowRow
                label="Count Matrix"
                description="مقادیر بیان ژن‌ها در Sampleها"
                position="ورودی مهم تحلیل Downstream"
              />
              <DataFlowRow
                label="DE Results"
                description="اندازه تغییر و شواهد آماری"
                position="خروجی مقایسه گروه‌ها"
              />
              <DataFlowRow
                label="Pathways"
                description="حرکت از Gene List به Biological Processes"
                position="مرحله تفسیر"
              />
            </div>
          </div>
        </div>
      </section>

      {/* AHA MOMENTS */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <span className="text-sm font-semibold text-teal-700">
            Core Ideas
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
            description="Biological Replication، Metadata و Confounderها قبل از اجرای تحلیل اهمیت دارند."
          />
          <PrincipleCard
            number="03"
            title="Tool با Analysis یکی نیست."
            description="مثلاً DESeq2 یک ابزار برای بخشی از تحلیل Differential Expression است، نه کل پروژه RNA-seq."
          />
          <PrincipleCard
            number="04"
            title="نمودار زیبا کافی نیست."
            description="PCA، Heatmap و Volcano Plot باید در کنار طراحی مطالعه و تحلیل آماری درست تفسیر شوند."
          />
          <PrincipleCard
            number="05"
            title="DEG پایان داستان نیست."
            description="فهرست ژن‌ها باید در زمینه Pathwayها، عملکرد زیستی، سؤال اصلی و محدودیت‌های مطالعه دیده شود."
          />
          <PrincipleCard
            number="06"
            title="Association را با Causation اشتباه نکنید."
            description="RNA-seq می‌تواند الگوهای بسیار ارزشمندی نشان دهد، اما نوع نتیجه‌گیری باید متناسب با طراحی مطالعه باشد."
          />
        </div>
      </section>

      {/* PROJECT MODE */}
      <section
        id="project-mode"
        className="scroll-mt-8 border-y border-slate-200 bg-white"
      >
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
            <div>
              <span className="text-sm font-semibold text-teal-700">
                From Learning to Research
              </span>

              <h2 className="mt-3 text-3xl font-bold leading-tight text-slate-950">
                وقتی مفهوم را فهمیدید، سؤال بعدی این است:
                <span className="text-teal-700"> برای پروژه من چطور؟</span>
              </h2>

              <p className="mt-5 leading-8 text-slate-600">
                Project Mode قرار است همین Workflow را از حالت عمومی خارج کند
                و روی Research Question، گروه‌ها، Sampleها، نوع داده و اهداف
                واقعی پروژه شما اعمال کند.
              </p>

              <div className="mt-7 rounded-2xl border border-amber-200 bg-amber-50 p-5">
                <p className="font-bold text-amber-950">
                  یک اصل مهم هاب‌ژن
                </p>
                <p className="mt-2 text-sm leading-7 text-amber-900/80">
                  هر تحلیلی که از نظر فنی قابل اجرا باشد، الزاماً تحلیل مناسبی
                  برای سؤال یا طراحی شما نیست.
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
              <p className="font-bold text-slate-950">
                Project Mode در ادامه چه چیزهایی را بررسی می‌کند؟
              </p>

              <div className="mt-6 space-y-3">
                <CheckRow text="سؤال زیستی و Comparison اصلی" />
                <CheckRow text="تعداد گروه‌ها و Biological Replicateها" />
                <CheckRow text="وضعیت داده: قبل از Sequencing، FASTQ یا Count Matrix" />
                <CheckRow text="Metadata، Batch و Covariateهای احتمالی" />
                <CheckRow text="هدف DEG، Pathway، Network یا Validation" />
                <CheckRow text="مراحل مناسب و مراحلی که نیاز به Review دارند" />
              </div>

              <div className="mt-7 rounded-2xl bg-slate-950 p-5 text-white">
                <p className="text-sm font-semibold text-teal-300">
                  خروجی آینده
                </p>
                <p className="mt-2 text-lg font-bold">
                  Your RNA-seq Project Roadmap
                </p>
                <p className="mt-2 text-sm leading-7 text-slate-300">
                  نقشه‌ای متناسب با وضعیت واقعی پروژه، نه یک Pipeline ثابت برای
                  همه.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM SOLVER */}
      <section
        id="problem-solver"
        className="mx-auto max-w-7xl scroll-mt-8 px-4 py-20 sm:px-6 lg:px-8"
      >
        <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <span className="text-sm font-semibold text-teal-700">
              Problem Solver
            </span>

            <h2 className="mt-3 text-3xl font-bold leading-tight text-slate-950">
              اگر تحلیل را شروع کرده‌اید ولی چیزی درست به نظر نمی‌رسد.
            </h2>

            <p className="mt-5 leading-8 text-slate-600">
              در نسخه کامل، کاربر ابتدا مشکلش را انتخاب می‌کند، هاب‌ژن منابع
              آموزشی و بررسی‌های اولیه را پیشنهاد می‌دهد و فقط در مسائل
              پروژه‌محور Expert Review وارد می‌شود.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <ProblemCard
              title="PCA عجیب است"
              text="Sampleها طبق انتظار گروه‌بندی نشده‌اند."
            />
            <ProblemCard
              title="DEG پیدا نمی‌کنم"
              text="نتایج Differential Expression تقریباً خالی است."
            />
            <ProblemCard
              title="DEG خیلی زیاد است"
              text="تعداد بسیار بزرگی از ژن‌ها Significant شده‌اند."
            />
            <ProblemCard
              title="Batch Effect دارم"
              text="ساختار فنی ممکن است بر گروه‌بندی Sampleها غالب شده باشد."
            />
            <ProblemCard
              title="نوع داده را نمی‌شناسم"
              text="نمی‌دانم فایل من Raw Count، TPM یا چیز دیگری است."
            />
            <ProblemCard
              title="نتیجه قابل تفسیر نیست"
              text="نمودار و Gene List دارم ولی Biological Story شکل نگرفته است."
            />
          </div>
        </div>
      </section>

      {/* CONNECTIONS */}
      <section className="border-y border-slate-200 bg-slate-100">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-sm font-semibold text-teal-700">
              Research Connections
            </span>

            <h2 className="mt-3 text-3xl font-bold text-slate-950">
              RNA-seq یک جزیره جدا نیست.
            </h2>

            <p className="mt-4 leading-8 text-slate-600">
              وقتی سؤال پژوهشی تغییر می‌کند، ممکن است از این Hub وارد یکی از
              مسیرهای دیگر هاب‌ژن شوید.
            </p>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            <ResearchConnectionCard
              label="Public Data Research"
              question="داده ندارید یا برای Validation به Cohort مستقل نیاز دارید؟"
              description="از GEO، SRA یا منابع عمومی Dataset مناسب پیدا کنید و قبل از تحلیل آن را ارزیابی کنید."
              direction="RNA-seq ↔ Public Data"
            />

            <ResearchConnectionCard
              label="Network Biology"
              question="می‌خواهید روابط بین ژن‌ها را فراتر از DEG بررسی کنید؟"
              description="در صورت مناسب بودن طراحی، Expression Matrix می‌تواند شما را وارد WGCNA و Network Analysis کند."
              direction="RNA-seq → Network"
            />

            <ResearchConnectionCard
              label="Single-cell"
              question="می‌خواهید بدانید تغییر بیان مربوط به کدام Cell Population است؟"
              description="اگر سؤال به heterogeneity سلولی مربوط باشد، Single-cell می‌تواند Research Line بعدی شما باشد."
              direction="Bulk → Single-cell"
            />
          </div>
        </div>
      </section>

      {/* NEXT STAGE */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-[2rem] bg-slate-950 text-white">
            <div className="grid lg:grid-cols-[1fr_0.8fr]">
              <div className="p-8 sm:p-10 lg:p-12">
                <span className="text-sm font-semibold text-teal-300">
                  HubGene Research Guidance
                </span>

                <h2 className="mt-4 max-w-2xl text-3xl font-bold leading-tight sm:text-4xl">
                  هدف این نیست که فقط RNA-seq را تعریف کنیم؛ می‌خواهیم کاربر
                  بداند الان کجاست و قدم بعدی‌اش چیست.
                </h2>

                <p className="mt-5 max-w-2xl leading-8 text-slate-300">
                  مرحله بعدی توسعه همین صفحه، ساخت Navigator تعاملی کامل است:
                  Nodeها، Checkpointها، سطح توضیح، Progress و Learning Summary.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <a
                    href="#workflow"
                    className="inline-flex min-h-12 items-center justify-center rounded-xl bg-teal-500 px-6 py-3 font-bold text-slate-950 transition hover:bg-teal-400"
                  >
                    Workflow را مرور کنم
                  </a>

                  <a
                    href="/consultation"
                    className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/20 bg-white/5 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
                  >
                    مشاوره پروژه واقعی
                  </a>
                </div>
              </div>

              <div className="border-t border-white/10 bg-white/[0.04] p-8 sm:p-10 lg:border-r lg:border-t-0 lg:p-12">
                <p className="text-sm font-semibold text-slate-400">
                  منطق هاب‌ژن
                </p>

                <div className="mt-6 space-y-4">
                  <FinalStep number="1" text="سؤال را بفهم" />
                  <FinalStep number="2" text="داده را بشناس" />
                  <FinalStep number="3" text="Workflow را طراحی کن" />
                  <FinalStep number="4" text="نتیجه را درست تفسیر کن" />
                </div>

                <div className="mt-8 rounded-2xl border border-teal-400/20 bg-teal-400/10 p-5">
                  <p
                    dir="ltr"
                    className="text-sm font-bold tracking-wide text-teal-200"
                  >
                    QUESTION → DATA → ANALYSIS → INTERPRETATION
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
              RNA-seq Research Map
            </p>
            <p className="mt-1 text-xs text-slate-400">
              From biological question to interpretation
            </p>
          </div>

          <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
            <span className="h-3 w-3 rounded-full bg-teal-400 shadow-lg shadow-teal-400/50" />
          </span>
        </div>

        <div className="mt-8 space-y-3">
          <VisualFlowStep
            number="01"
            title="Research Question"
            subtitle="What do we want to know?"
            active
          />
          <VisualConnector />
          <VisualFlowStep
            number="02"
            title="Study Design"
            subtitle="Samples, groups & metadata"
          />
          <VisualConnector />
          <VisualFlowStep
            number="03"
            title="RNA-seq Data"
            subtitle="FASTQ → QC → Expression"
          />
          <VisualConnector />
          <VisualFlowStep
            number="04"
            title="Statistical Analysis"
            subtitle="PCA → DEG → Visualization"
          />
          <VisualConnector />
          <VisualFlowStep
            number="05"
            title="Biological Story"
            subtitle="Pathways → Interpretation"
          />
        </div>

        <div className="mt-8 grid grid-cols-3 gap-2 border-t border-white/10 pt-6">
          <VisualMetric value="WHY?" label="منطق مرحله" />
          <VisualMetric value="IN" label="ورودی" />
          <VisualMetric value="OUT" label="خروجی" />
        </div>
      </div>
    </div>
  );
}

function VisualFlowStep({
  number,
  title,
  subtitle,
  active = false,
}: {
  number: string;
  title: string;
  subtitle: string;
  active?: boolean;
}) {
  return (
    <div
      dir="ltr"
      className={[
        "flex items-center gap-4 rounded-2xl border p-4",
        active
          ? "border-teal-400/40 bg-teal-400/10"
          : "border-white/10 bg-white/[0.04]",
      ].join(" ")}
    >
      <span
        className={[
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold",
          active
            ? "bg-teal-400 text-slate-950"
            : "bg-white/10 text-slate-300",
        ].join(" ")}
      >
        {number}
      </span>

      <div>
        <p className="font-semibold text-white">{title}</p>
        <p className="mt-1 text-xs text-slate-400">{subtitle}</p>
      </div>
    </div>
  );
}

function VisualConnector() {
  return (
    <div dir="ltr" className="ml-[1.15rem] flex h-3 items-center">
      <div className="h-full border-l border-dashed border-teal-400/30" />
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
      <p dir="ltr" className="text-xs font-black text-teal-300">
        {value}
      </p>
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
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p dir="ltr" className="text-sm font-bold text-slate-900">
        {title}
      </p>
      <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
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
              <span
                dir="ltr"
                className="rounded-lg bg-slate-950 px-2.5 py-1.5 text-xs font-bold text-white"
              >
                NODE {node.number}
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
        <LearningSection title="این چیست؟">
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
          <p className="text-sm font-bold text-amber-950">اشتباه رایج</p>
          <p className="mt-2 text-sm leading-7 text-amber-900/80">
            {node.mistake}
          </p>
        </div>

        <LearningSection title="ابزارها و مفاهیم مرتبط">
          <div className="flex flex-wrap gap-2">
            {node.tools.map((tool) => (
              <span
                key={tool}
                dir="ltr"
                className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-600"
              >
                {tool}
              </span>
            ))}
          </div>
        </LearningSection>

        <div className="border-t border-slate-100 pt-6">
          <button
            type="button"
            className="w-full rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm font-bold text-teal-800 transition hover:bg-teal-100"
          >
            برای پروژه من این مرحله چگونه است؟
          </button>

          <p className="mt-3 text-center text-xs leading-6 text-slate-400">
            اتصال این دکمه به Project Mode در فاز بعد انجام می‌شود.
          </p>
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
      <div className="mt-2 text-sm leading-8 text-slate-600">{children}</div>
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
          dir="ltr"
          className={[
            "rounded-lg px-2 py-1 text-[10px] font-black",
            type === "IN"
              ? "bg-cyan-100 text-cyan-800"
              : "bg-teal-100 text-teal-800",
          ].join(" ")}
        >
          {type}
        </span>
      </div>

      <p dir="ltr" className="mt-3 text-left text-sm text-slate-600">
        {value}
      </p>
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
          Guide → Check → Expert Review
        </span>
      </div>
    </article>
  );
}

function ResearchConnectionCard({
  label,
  question,
  description,
  direction,
}: {
  label: string;
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

      <p
        dir="ltr"
        className="mt-6 text-sm font-semibold text-slate-400"
      >
        {label}
      </p>

      <h3 className="mt-2 text-lg font-bold leading-8 text-slate-950">
        {question}
      </h3>

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
