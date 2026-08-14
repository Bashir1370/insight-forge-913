import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/learn")({
  component: HubGeneLearnPage,
});

type ResearchLine = {
  id: string;
  eyebrow: string;
  title: string;
  englishTitle: string;
  question: string;
  description: string;
  concepts: string[];
  status: string;
  featured?: boolean;
};

const researchLines: ResearchLine[] = [
  {
    id: "rna-seq",
    eyebrow: "مسیر ۱",
    title: "ترنسکریپتومیکس و RNA-seq",
    englishTitle: "Bulk Transcriptomics",
    question:
      "از نمونه زیستی تا بیان ژن، Differential Expression و تفسیر زیستی چه اتفاقی می‌افتد؟",
    description:
      "ساختار یک پروژه RNA-seq را از سؤال پژوهشی و طراحی مطالعه تا FASTQ، QC، Expression Matrix، DEG و تحلیل عملکردی قدم‌به‌قدم بشناسید.",
    concepts: ["FASTQ", "QC", "Expression Matrix", "PCA", "DEG", "GSEA"],
    status: "اولین Navigator کامل هاب‌ژن",
    featured: true,
  },
  {
    id: "public-data",
    eyebrow: "مسیر ۲",
    title: "پژوهش با داده‌های عمومی",
    englishTitle: "Public Data Research",
    question:
      "چطور از GEO، SRA و TCGA یک سؤال پژوهشی را به پروژه داده‌محور تبدیل کنیم؟",
    description:
      "یاد بگیرید چگونه از سؤال پژوهشی به جستجوی Dataset، بررسی Metadata، ارزیابی کیفیت داده، طراحی تحلیل و Validation برسید.",
    concepts: ["GEO", "SRA", "TCGA", "Metadata", "Dataset Fit", "Validation"],
    status: "Research Navigator اختصاصی",
  },
  {
    id: "network-biology",
    eyebrow: "مسیر ۳",
    title: "زیست‌شناسی شبکه و کشف Biomarker",
    englishTitle: "Network Biology & Biomarker Discovery",
    question:
      "WGCNA، PPI، Hub Gene و Biomarker دقیقاً چه تفاوتی دارند و چه زمانی لازم‌اند؟",
    description:
      "از تفاوت DEG و شبکه تا Co-expression، Module، Trait Association، Hub Gene، PPI و منطق صحیح Candidate Biomarker پیش بروید.",
    concepts: ["WGCNA", "Modules", "PPI", "Hub Gene", "Biomarker", "Validation"],
    status: "Strategy & Readiness Navigator",
  },
  {
    id: "single-cell",
    eyebrow: "مسیر ۴",
    title: "ترنسکریپتومیکس تک‌سلولی",
    englishTitle: "Single-cell Transcriptomics",
    question:
      "چگونه از یک بافت به Cell Population، Cell Type و Cell State می‌رسیم؟",
    description:
      "ساختار scRNA-seq را از Cell-by-Gene Matrix و QC تا UMAP، Clustering، Annotation، Differential Expression و تفسیر زیستی بشناسید.",
    concepts: ["Cell Matrix", "QC", "UMAP", "Clustering", "Annotation", "Cell State"],
    status: "Single-cell Learning Navigator",
  },
  {
    id: "microbiome",
    eyebrow: "مسیر ۵",
    title: "میکروبیوم و تحلیل 16S",
    englishTitle: "Microbiome & 16S",
    question:
      "ساختار یک جامعه میکروبی چگونه اندازه‌گیری، مقایسه و تفسیر می‌شود؟",
    description:
      "از FASTQ و ASV تا Taxonomy، Alpha Diversity، Beta Diversity، Differential Abundance و محدودیت‌های تفسیر داده‌های میکروبیوم پیش بروید.",
    concepts: [
      "16S",
      "ASV",
      "Taxonomy",
      "Alpha Diversity",
      "Beta Diversity",
      "Relative Abundance",
    ],
    status: "Microbiome Learning Navigator",
  },
];

const interestOptions = [
  {
    id: "expression",
    title: "تغییر بیان ژن‌ها",
    description: "می‌خواهم بفهمم ژن‌ها بین شرایط مختلف چگونه تغییر می‌کنند.",
  },
  {
    id: "public-data",
    title: "استفاده از داده‌های موجود",
    description: "می‌خواهم با GEO، SRA، TCGA یا Datasetهای عمومی کار کنم.",
  },
  {
    id: "network",
    title: "ارتباط ژن‌ها و Biomarker",
    description: "به WGCNA، شبکه‌های ژنی، Hub Gene یا Biomarker علاقه دارم.",
  },
  {
    id: "single-cell",
    title: "تفاوت میان سلول‌ها",
    description: "می‌خواهم Cell Typeها و Cell Stateها را جداگانه بررسی کنم.",
  },
  {
    id: "microbiome",
    title: "جامعه میکروبی",
    description: "به 16S، Microbiome و مقایسه جوامع میکروبی علاقه دارم.",
  },
  {
    id: "not-sure",
    title: "هنوز مطمئن نیستم",
    description: "می‌خواهم هاب‌ژن کمک کند نقطه شروع مناسب را پیدا کنم.",
  },
];

const purposeOptions = [
  {
    id: "learn",
    title: "فقط می‌خواهم یاد بگیرم",
  },
  {
    id: "project",
    title: "برای پایان‌نامه یا پروژه آمده‌ام",
  },
  {
    id: "data",
    title: "داده دارم ولی نمی‌دانم از کجا شروع کنم",
  },
  {
    id: "problem",
    title: "در یک تحلیل به مشکل خورده‌ام",
  },
];

const levelOptions = [
  {
    id: "beginner",
    title: "تقریباً از صفر",
  },
  {
    id: "developing",
    title: "کمی آشنا هستم",
  },
  {
    id: "experienced",
    title: "قبلاً تجربه داشته‌ام",
  },
];

const recommendations: Record<
  string,
  {
    lineId: string;
    reason: string;
  }
> = {
  expression: {
    lineId: "rna-seq",
    reason:
      "چون سؤال شما حول تغییر بیان ژن‌هاست، Bulk Transcriptomics بهترین نقطه برای ساختن نقشه ذهنی تحلیل بیان ژن است.",
  },
  "public-data": {
    lineId: "public-data",
    reason:
      "چون می‌خواهید از داده‌های موجود استفاده کنید، بهتر است ابتدا یاد بگیرید چگونه یک سؤال پژوهشی را به Dataset مناسب و یک طراحی تحلیل قابل دفاع متصل کنید.",
  },
  network: {
    lineId: "network-biology",
    reason:
      "چون تمرکز شما روی روابط بین ژن‌ها، شبکه‌ها و Candidate Biomarker است، مسیر Network Biology مناسب‌ترین نقطه شروع شماست.",
  },
  "single-cell": {
    lineId: "single-cell",
    reason:
      "چون می‌خواهید تفاوت میان جمعیت‌ها و وضعیت‌های سلولی را بررسی کنید، Single-cell Transcriptomics مسیر مناسب‌تری برای شماست.",
  },
  microbiome: {
    lineId: "microbiome",
    reason:
      "چون سؤال شما درباره ساختار جامعه میکروبی است، مسیر Microbiome & 16S مفاهیم و Workflow اصلی این حوزه را برایتان روشن می‌کند.",
  },
  "not-sure": {
    lineId: "public-data",
    reason:
      "اگر هنوز حوزه مشخصی انتخاب نکرده‌اید، Public Data Research یک نقطه شروع مناسب برای آشنایی با تفکر داده‌محور است؛ بدون اینکه ابتدا نیاز به تولید داده شخصی داشته باشید.",
  },
};

function HubGeneLearnPage() {
  const [interest, setInterest] = useState("");
  const [purpose, setPurpose] = useState("");
  const [level, setLevel] = useState("");

  const recommendation =
    interest && purpose && level ? recommendations[interest] : null;

  const recommendedLine = recommendation
    ? researchLines.find((line) => line.id === recommendation.lineId)
    : null;

  const optionClass = (active: boolean) =>
    [
      "w-full rounded-2xl border px-4 py-4 text-right transition-all duration-200",
      "focus:outline-none focus:ring-2 focus:ring-teal-500/30",
      active
        ? "border-teal-500 bg-teal-50 shadow-sm"
        : "border-slate-200 bg-white hover:border-teal-300 hover:bg-slate-50",
    ].join(" ");

  return (
    <main
      dir="rtl"
      className="min-h-screen overflow-hidden bg-slate-50 text-right text-slate-900"
    >
      {/* HERO */}
      <section className="relative border-b border-slate-200 bg-white">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-teal-100/70 blur-3xl" />
          <div className="absolute -left-20 top-24 h-72 w-72 rounded-full bg-cyan-100/50 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="max-w-4xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-4 py-2 text-sm font-medium text-teal-800">
              <span className="h-2 w-2 rounded-full bg-teal-500" />
              HubGene Learn
            </div>

            <h1 className="max-w-4xl text-4xl font-bold leading-[1.4] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              زیست‌شناسی محاسباتی را از
              <span className="text-teal-700"> سؤال پژوهشی </span>
              یاد بگیرید، نه از لیست ابزارها.
            </h1>

            <p className="mt-7 max-w-3xl text-lg leading-9 text-slate-600 sm:text-xl">
              مفاهیم، داده‌ها و ساختار تحلیل را قدم‌به‌قدم بشناسید. هاب‌ژن
              کمک می‌کند بفهمید هر تحلیل چرا انجام می‌شود، به چه داده‌ای نیاز
              دارد و چگونه به یک سؤال زیستی پاسخ می‌دهد.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a
                href="#path-finder"
                className="inline-flex min-h-12 items-center justify-center rounded-xl bg-slate-950 px-6 py-3 font-semibold text-white transition hover:bg-slate-800"
              >
                از کجا شروع کنم؟
              </a>

              <a
                href="#research-lines"
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-800 transition hover:border-teal-400 hover:text-teal-800"
              >
                مشاهده مسیرهای پژوهشی
              </a>
            </div>

            <div className="mt-12 grid max-w-3xl gap-4 sm:grid-cols-3">
              <HeroStat value="۵" label="مسیر پژوهشی اصلی" />
              <HeroStat value="Question First" label="شروع از سؤال، نه ابزار" />
              <HeroStat value="Adaptive" label="مسیر متناسب با نیاز شما" />
            </div>
          </div>
        </div>
      </section>

      {/* CORE PHILOSOPHY */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-3xl">
          <p className="text-sm font-semibold text-teal-700">
            مسیر هاب‌ژن چگونه کار می‌کند؟
          </p>
          <h2 className="mt-2 text-3xl font-bold text-slate-950">
            از فهمیدن تا تصمیم‌گیری پژوهشی
          </h2>
          <p className="mt-4 leading-8 text-slate-600">
            شما لازم نیست از ابتدا بدانید کدام نرم‌افزار یا روش مناسب است.
            ابتدا مسئله را می‌فهمیم، سپس داده و Workflow را می‌شناسیم و در
            مرحله بعد آن را به پروژه واقعی متصل می‌کنیم.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <JourneyCard
            number="01"
            title="Understand"
            persianTitle="بفهم"
            description="مفهوم، سؤال علمی و منطق هر مرحله را به زبان روشن بشناس."
          />
          <JourneyCard
            number="02"
            title="Explore"
            persianTitle="بررسی کن"
            description="Workflow، نوع داده و نمونه‌های واقعی را قدم‌به‌قدم ببین."
          />
          <JourneyCard
            number="03"
            title="Design"
            persianTitle="طراحی کن"
            description="وقتی آماده بودی، مفاهیم را روی سؤال و پروژه خودت اعمال کن."
          />
          <JourneyCard
            number="04"
            title="Expert Help"
            persianTitle="کمک تخصصی بگیر"
            description="اگر تصمیم پروژه‌محور پیچیده شد، متخصص در نقطه مناسب وارد مسیر می‌شود."
          />
        </div>
      </section>

      {/* PATH FINDER */}
      <section
        id="path-finder"
        className="border-y border-slate-200 bg-white scroll-mt-8"
      >
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <div className="sticky top-8">
                <span className="inline-flex rounded-full bg-teal-50 px-3 py-1 text-sm font-semibold text-teal-700">
                  Research Path Finder
                </span>

                <h2 className="mt-5 text-3xl font-bold leading-tight text-slate-950">
                  هنوز نمی‌دانید از کدام حوزه شروع کنید؟
                </h2>

                <p className="mt-5 leading-8 text-slate-600">
                  فقط سه سؤال کوتاه جواب دهید. این ابزار قرار نیست درباره
                  دانش شما قضاوت کند؛ فقط کمک می‌کند نقطه شروع مناسب‌تری در
                  هاب‌ژن پیدا کنید.
                </p>

                <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <p className="font-semibold text-slate-900">
                    وضعیت مسیر شما
                  </p>

                  <div className="mt-4 space-y-3">
                    <ProgressRow
                      done={Boolean(interest)}
                      label="موضوع مورد علاقه"
                    />
                    <ProgressRow
                      done={Boolean(purpose)}
                      label="هدف از ورود به هاب‌ژن"
                    />
                    <ProgressRow
                      done={Boolean(level)}
                      label="سطح آشنایی فعلی"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              {/* STEP 1 */}
              <PathFinderStep
                number="۱"
                title="بیشتر درباره چه چیزی کنجکاوید؟"
                subtitle="لازم نیست اسم روش یا نرم‌افزار خاصی را بدانید."
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  {interestOptions.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setInterest(option.id)}
                      className={optionClass(interest === option.id)}
                    >
                      <span className="block font-semibold text-slate-900">
                        {option.title}
                      </span>
                      <span className="mt-1 block text-sm leading-6 text-slate-500">
                        {option.description}
                      </span>
                    </button>
                  ))}
                </div>
              </PathFinderStep>

              {/* STEP 2 */}
              <PathFinderStep
                number="۲"
                title="برای چه چیزی به هاب‌ژن آمده‌اید؟"
                subtitle="این پاسخ در ادامه تعیین می‌کند آموزش، پروژه یا راهنمایی تخصصی برای شما اولویت داشته باشد."
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  {purposeOptions.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setPurpose(option.id)}
                      className={optionClass(purpose === option.id)}
                    >
                      <span className="font-semibold text-slate-900">
                        {option.title}
                      </span>
                    </button>
                  ))}
                </div>
              </PathFinderStep>

              {/* STEP 3 */}
              <PathFinderStep
                number="۳"
                title="سطح آشنایی فعلی شما چقدر است؟"
                subtitle="سطح شما قرار است عمق توضیحات را تغییر دهد، نه ارزش یا اعتبار مسیر شما را."
              >
                <div className="grid gap-3 sm:grid-cols-3">
                  {levelOptions.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setLevel(option.id)}
                      className={optionClass(level === option.id)}
                    >
                      <span className="font-semibold text-slate-900">
                        {option.title}
                      </span>
                    </button>
                  ))}
                </div>
              </PathFinderStep>

              {/* RESULT */}
              {recommendation && recommendedLine ? (
                <div className="overflow-hidden rounded-3xl border border-teal-200 bg-gradient-to-br from-teal-50 via-white to-cyan-50 shadow-sm">
                  <div className="p-6 sm:p-8">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-teal-700 px-3 py-1 text-xs font-bold text-white">
                        مسیر پیشنهادی هاب‌ژن
                      </span>
                      <span className="rounded-full border border-teal-200 bg-white px-3 py-1 text-xs font-medium text-teal-800">
                        پیشنهاد اولیه، نه تصمیم نهایی
                      </span>
                    </div>

                    <p className="mt-6 text-sm font-semibold text-teal-700">
                      {recommendedLine.englishTitle}
                    </p>

                    <h3 className="mt-2 text-2xl font-bold text-slate-950">
                      {recommendedLine.title}
                    </h3>

                    <p className="mt-4 leading-8 text-slate-600">
                      {recommendation.reason}
                    </p>

                    <div className="mt-6 flex flex-wrap gap-2">
                      {recommendedLine.concepts.slice(0, 4).map((concept) => (
                        <span
                          key={concept}
                          dir="ltr"
                          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600"
                        >
                          {concept}
                        </span>
                      ))}
                    </div>

                    <div className="mt-7">
                      <a
                        href={`#${recommendedLine.id}`}
                        className="inline-flex min-h-11 items-center justify-center rounded-xl bg-slate-950 px-5 py-2.5 font-semibold text-white transition hover:bg-slate-800"
                      >
                        مشاهده این مسیر
                      </a>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-6">
                  <p className="text-sm leading-7 text-slate-500">
                    بعد از پاسخ به هر سه سؤال، مسیر پیشنهادی شما همین‌جا نمایش
                    داده می‌شود.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* RESEARCH LINES */}
      <section
        id="research-lines"
        className="mx-auto max-w-7xl scroll-mt-8 px-4 py-20 sm:px-6 lg:px-8"
      >
        <div className="max-w-3xl">
          <span className="text-sm font-semibold text-teal-700">
            پنج Research Line هاب‌ژن
          </span>

          <h2 className="mt-2 text-3xl font-bold leading-tight text-slate-950 sm:text-4xl">
            پنج دروازه ورود به زیست‌شناسی محاسباتی
          </h2>

          <p className="mt-5 leading-8 text-slate-600">
            هر مسیر از یک سؤال علمی شروع می‌شود و به‌تدریج شما را با Workflow،
            داده، تصمیم‌های تحلیلی، خطاهای رایج و تفسیر زیستی آشنا می‌کند.
          </p>
        </div>

        <div className="mt-12 space-y-6">
          {researchLines.map((line, index) => (
            <article
              key={line.id}
              id={line.id}
              className={[
                "scroll-mt-8 overflow-hidden rounded-3xl border bg-white shadow-sm transition",
                line.featured
                  ? "border-teal-300 ring-1 ring-teal-100"
                  : "border-slate-200 hover:border-slate-300",
              ].join(" ")}
            >
              <div className="grid lg:grid-cols-[0.75fr_1.25fr]">
                <div
                  className={[
                    "relative flex min-h-64 flex-col justify-between p-7 sm:p-8",
                    line.featured
                      ? "bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 text-white"
                      : "bg-slate-100 text-slate-950",
                  ].join(" ")}
                >
                  <div>
                    <div className="flex items-center justify-between gap-4">
                      <span
                        className={[
                          "text-sm font-semibold",
                          line.featured ? "text-teal-300" : "text-teal-700",
                        ].join(" ")}
                      >
                        {line.eyebrow}
                      </span>

                      <span
                        dir="ltr"
                        className={[
                          "text-5xl font-black tracking-tighter",
                          line.featured
                            ? "text-white/10"
                            : "text-slate-300",
                        ].join(" ")}
                      >
                        0{index + 1}
                      </span>
                    </div>

                    <p
                      dir="ltr"
                      className={[
                        "mt-8 text-sm font-semibold",
                        line.featured ? "text-teal-300" : "text-slate-500",
                      ].join(" ")}
                    >
                      {line.englishTitle}
                    </p>

                    <h3 className="mt-2 text-2xl font-bold leading-tight">
                      {line.title}
                    </h3>
                  </div>

                  <div className="mt-8">
                    <span
                      className={[
                        "inline-flex rounded-full px-3 py-1.5 text-xs font-semibold",
                        line.featured
                          ? "bg-white/10 text-white"
                          : "border border-slate-200 bg-white text-slate-600",
                      ].join(" ")}
                    >
                      {line.status}
                    </span>
                  </div>
                </div>

                <div className="p-7 sm:p-8 lg:p-10">
                  <p className="text-xl font-bold leading-9 text-slate-950">
                    {line.question}
                  </p>

                  <p className="mt-4 leading-8 text-slate-600">
                    {line.description}
                  </p>

                  <div className="mt-7">
                    <p className="text-sm font-semibold text-slate-500">
                      مفاهیمی که در این مسیر به هم متصل می‌شوند
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {line.concepts.map((concept) => (
                        <span
                          key={concept}
                          dir="ltr"
                          className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-600"
                        >
                          {concept}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 border-t border-slate-100 pt-6">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm font-medium text-slate-500">
                      <span>Start Here</span>
                      <span className="text-teal-500">←</span>
                      <span>Navigator</span>
                      <span className="text-teal-500">←</span>
                      <span>Demo</span>
                      <span className="text-teal-500">←</span>
                      <span>Project Mode</span>
                      <span className="text-teal-500">←</span>
                      <span>Expert Help</span>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ECOSYSTEM */}
      <section className="border-y border-slate-200 bg-slate-950 text-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <span className="text-sm font-semibold text-teal-300">
                یک زیست‌بوم، نه پنج جزیره
              </span>

              <h2 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">
                مسیرهای هاب‌ژن به یکدیگر متصل‌اند.
              </h2>

              <p className="mt-5 leading-8 text-slate-300">
                یک پروژه ممکن است از Public Data شروع شود، وارد RNA-seq شود،
                برای تحلیل شبکه به WGCNA برسد و برای Validation دوباره به یک
                Dataset مستقل برگردد. هدف HubGene Learn این است که این ارتباط
                را برای کاربر قابل مشاهده کند.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <ConnectionCard
                from="Public Data"
                to="RNA-seq"
                text="Dataset عمومی می‌تواند ورودی یک تحلیل Transcriptomics باشد."
              />

              <ConnectionCard
                from="RNA-seq"
                to="Network Biology"
                text="Expression Matrix می‌تواند در صورت مناسب بودن طراحی وارد تحلیل شبکه شود."
              />

              <ConnectionCard
                from="Network"
                to="Public Data"
                text="Candidateها می‌توانند در یک Dataset مستقل برای Validation بررسی شوند."
              />

              <ConnectionCard
                from="Public Data"
                to="Single-cell"
                text="یک Dataset عمومی ممکن است شما را وارد مسیر Single-cell کند."
              />
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-teal-50 via-white to-cyan-50 p-8 sm:p-12">
            <div className="max-w-3xl">
              <span className="text-sm font-semibold text-teal-700">
                مسیر یادگیری شما
              </span>

              <h2 className="mt-3 text-3xl font-bold leading-tight text-slate-950">
                لازم نیست از برنامه‌نویسی شروع کنید.
              </h2>

              <p className="mt-5 text-lg leading-8 text-slate-600">
                ابتدا بفهمید سؤال پژوهشی چیست، داده چه ساختاری دارد و هر مرحله
                از تحلیل چرا وجود دارد. وقتی نقشه ذهنی شکل گرفت، ابزارها و
                اجرای عملی معنای بسیار روشن‌تری خواهند داشت.
              </p>

              <div className="mt-7">
                <a
                  href="#path-finder"
                  className="inline-flex min-h-12 items-center justify-center rounded-xl bg-teal-700 px-6 py-3 font-semibold text-white transition hover:bg-teal-800"
                >
                  مسیر مناسبم را پیدا کنم
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function HeroStat({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur">
      <p dir="ltr" className="font-bold text-slate-950">
        {value}
      </p>
      <p className="mt-1 text-sm leading-6 text-slate-500">{label}</p>
    </div>
  );
}

function JourneyCard({
  number,
  title,
  persianTitle,
  description,
}: {
  number: string;
  title: string;
  persianTitle: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <span
          dir="ltr"
          className="text-xs font-bold tracking-widest text-teal-700"
        >
          {number}
        </span>
        <span
          dir="ltr"
          className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500"
        >
          {title}
        </span>
      </div>

      <h3 className="mt-6 text-xl font-bold text-slate-950">
        {persianTitle}
      </h3>

      <p className="mt-3 text-sm leading-7 text-slate-600">
        {description}
      </p>
    </div>
  );
}

function ProgressRow({
  done,
  label,
}: {
  done: boolean;
  label: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={[
          "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold",
          done
            ? "border-teal-600 bg-teal-600 text-white"
            : "border-slate-300 bg-white text-transparent",
        ].join(" ")}
      >
        ✓
      </span>

      <span
        className={[
          "text-sm",
          done ? "font-medium text-slate-800" : "text-slate-500",
        ].join(" ")}
      >
        {label}
      </span>
    </div>
  );
}

function PathFinderStep({
  number,
  title,
  subtitle,
  children,
}: {
  number: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex items-start gap-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-950 font-bold text-white">
          {number}
        </span>

        <div>
          <h3 className="text-xl font-bold text-slate-950">{title}</h3>
          <p className="mt-1 text-sm leading-6 text-slate-500">{subtitle}</p>
        </div>
      </div>

      <div className="mt-6">{children}</div>
    </section>
  );
}

function ConnectionCard({
  from,
  to,
  text,
}: {
  from: string;
  to: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div
        dir="ltr"
        className="flex flex-wrap items-center gap-2 text-sm font-semibold"
      >
        <span className="rounded-lg bg-white/10 px-2.5 py-1.5 text-slate-200">
          {from}
        </span>

        <span className="text-teal-300">→</span>

        <span className="rounded-lg bg-teal-400/10 px-2.5 py-1.5 text-teal-200">
          {to}
        </span>
      </div>

      <p className="mt-4 text-sm leading-7 text-slate-300">{text}</p>
    </div>
  );
}
