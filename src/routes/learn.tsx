import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/learn")({
  component: HubGeneLearnPage,
});

type ResearchLine = {
  id: string;
  number: string;
  title: string;
  englishTitle: string;
  question: string;
  description: string;
  concepts: string[];
  status: string;
  href?: string;
  featured?: boolean;
};

const researchLines: ResearchLine[] = [
  {
    id: "rna-seq",
    number: "01",
    title: "ترنسکریپتومیکس و RNA-seq",
    englishTitle: "Bulk Transcriptomics",
    question:
      "از نمونه زیستی تا بیان ژن، تحلیل بیان افتراقی و تفسیر زیستی چه اتفاقی می‌افتد؟",
    description:
      "ساختار یک پروژه RNA-seq را از سؤال پژوهشی و طراحی مطالعه تا FASTQ، کنترل کیفیت، ماتریس بیان، تحلیل بیان افتراقی و تحلیل عملکردی قدم‌به‌قدم بشناسید.",
    concepts: [
      "FASTQ",
      "کنترل کیفیت",
      "ماتریس بیان",
      "PCA",
      "تحلیل بیان افتراقی",
      "GSEA",
    ],
    status: "مسیر تعاملی فعال",
    href: "/learn/rna-seq",
    featured: true,
  },
  {
    id: "public-data",
    number: "02",
    title: "پژوهش با داده‌های عمومی",
    englishTitle: "Public Data Research",
    question:
      "چطور از GEO، SRA و TCGA یک سؤال پژوهشی را به پروژه داده‌محور تبدیل کنیم؟",
    description:
      "یاد بگیرید چگونه از سؤال پژوهشی به جستجوی مجموعه‌داده، بررسی فراداده، ارزیابی تناسب داده، طراحی تحلیل و اعتبارسنجی برسید.",
    concepts: [
      "GEO",
      "SRA",
      "TCGA",
      "فراداده",
      "تناسب مجموعه‌داده",
      "اعتبارسنجی",
    ],
    status: "مسیر بعدی در حال توسعه",
  },
  {
    id: "network-biology",
    number: "03",
    title: "زیست‌شناسی شبکه‌ای و کشف نشانگر زیستی",
    englishTitle: "Network Biology & Biomarker Discovery",
    question:
      "WGCNA، شبکه هم‌بیانی، ژن هاب و نشانگر زیستی چه تفاوتی دارند و چه زمانی لازم‌اند؟",
    description:
      "از تفاوت تحلیل بیان افتراقی و تحلیل شبکه تا هم‌بیانی، ماژول‌ها، ارتباط با ویژگی‌های زیستی، ژن هاب و منطق صحیح انتخاب نشانگر زیستی پیش بروید.",
    concepts: [
      "WGCNA",
      "شبکه هم‌بیانی",
      "ماژول",
      "PPI",
      "ژن هاب",
      "اعتبارسنجی",
    ],
    status: "مسیر پژوهشی در حال توسعه",
  },
  {
    id: "single-cell",
    number: "04",
    title: "ترنسکریپتومیکس تک‌سلولی",
    englishTitle: "Single-cell Transcriptomics",
    question:
      "چگونه از یک بافت به جمعیت‌های سلولی، انواع سلولی و وضعیت‌های سلولی می‌رسیم؟",
    description:
      "ساختار تحلیل تک‌سلولی را از ماتریس سلول × ژن و کنترل کیفیت تا UMAP، خوشه‌بندی، تعیین هویت سلولی، تحلیل بیان و تفسیر زیستی بشناسید.",
    concepts: [
      "ماتریس سلول × ژن",
      "کنترل کیفیت",
      "UMAP",
      "خوشه‌بندی",
      "تعیین هویت سلولی",
      "وضعیت سلولی",
    ],
    status: "مسیر یادگیری در حال توسعه",
  },
  {
    id: "microbiome",
    number: "05",
    title: "میکروبیوم و تحلیل 16S",
    englishTitle: "Microbiome & 16S",
    question:
      "ساختار یک جامعه میکروبی چگونه اندازه‌گیری، مقایسه و تفسیر می‌شود؟",
    description:
      "از FASTQ و ASV تا رده‌بندی زیستی، تنوع درون‌نمونه‌ای، تنوع بین‌نمونه‌ای، فراوانی نسبی و محدودیت‌های تفسیر داده‌های میکروبیوم پیش بروید.",
    concepts: [
      "16S",
      "ASV",
      "رده‌بندی زیستی",
      "تنوع درون‌نمونه‌ای",
      "تنوع بین‌نمونه‌ای",
      "فراوانی نسبی",
    ],
    status: "مسیر یادگیری در حال توسعه",
  },
];

const interestOptions = [
  {
    id: "expression",
    title: "تغییر بیان ژن‌ها",
    description:
      "می‌خواهم بفهمم بیان ژن‌ها میان شرایط مختلف چگونه تغییر می‌کند.",
  },
  {
    id: "public-data",
    title: "استفاده از داده‌های موجود",
    description:
      "می‌خواهم با GEO، SRA، TCGA یا مجموعه‌داده‌های عمومی کار کنم.",
  },
  {
    id: "network",
    title: "ارتباط ژن‌ها و نشانگرهای زیستی",
    description:
      "به WGCNA، شبکه‌های ژنی، ژن‌های هاب یا نشانگرهای زیستی علاقه دارم.",
  },
  {
    id: "single-cell",
    title: "تفاوت میان سلول‌ها",
    description:
      "می‌خواهم انواع و وضعیت‌های مختلف سلولی را جداگانه بررسی کنم.",
  },
  {
    id: "microbiome",
    title: "جامعه میکروبی",
    description:
      "به 16S، میکروبیوم و مقایسه جوامع میکروبی علاقه دارم.",
  },
  {
    id: "not-sure",
    title: "هنوز مطمئن نیستم",
    description:
      "می‌خواهم هاب‌ژن کمک کند نقطه شروع مناسب را پیدا کنم.",
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
      "چون سؤال شما درباره تغییر بیان ژن‌هاست، ترنسکریپتومیکس نقطه مناسبی برای ساختن نقشه ذهنی تحلیل بیان ژن است.",
  },
  "public-data": {
    lineId: "public-data",
    reason:
      "چون می‌خواهید از داده‌های موجود استفاده کنید، بهتر است ابتدا یاد بگیرید چگونه یک سؤال پژوهشی را به مجموعه‌داده مناسب و یک طراحی تحلیل قابل دفاع متصل کنید.",
  },
  network: {
    lineId: "network-biology",
    reason:
      "چون تمرکز شما روی روابط میان ژن‌ها، شبکه‌ها و نشانگرهای زیستی است، مسیر زیست‌شناسی شبکه‌ای مناسب‌ترین نقطه شروع شماست.",
  },
  "single-cell": {
    lineId: "single-cell",
    reason:
      "چون می‌خواهید تفاوت میان جمعیت‌ها و وضعیت‌های سلولی را بررسی کنید، ترنسکریپتومیکس تک‌سلولی مسیر مناسب‌تری برای شماست.",
  },
  microbiome: {
    lineId: "microbiome",
    reason:
      "چون سؤال شما درباره ساختار جامعه میکروبی است، مسیر میکروبیوم و 16S مفاهیم و مراحل اصلی این حوزه را برایتان روشن می‌کند.",
  },
  "not-sure": {
    lineId: "public-data",
    reason:
      "اگر هنوز حوزه مشخصی انتخاب نکرده‌اید، پژوهش با داده‌های عمومی می‌تواند نقطه شروع مناسبی برای آشنایی با تفکر داده‌محور باشد؛ بدون اینکه در ابتدا نیاز به تولید داده شخصی داشته باشید.",
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

              <span>آموزش هاب‌ژن</span>

              <span
                dir="ltr"
                className="border-r border-teal-200 pr-2 text-xs font-semibold text-teal-600"
              >
                HubGene Learn
              </span>
            </div>

            <h1 className="max-w-4xl text-4xl font-bold leading-[1.4] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              زیست‌شناسی محاسباتی را از
              <span className="text-teal-700"> سؤال پژوهشی </span>
              یاد بگیرید، نه از فهرست ابزارها.
            </h1>

            <p className="mt-7 max-w-3xl text-lg leading-9 text-slate-600 sm:text-xl">
              مفاهیم، داده‌ها و مسیر تحلیل را قدم‌به‌قدم بشناسید.
              هاب‌ژن کمک می‌کند بفهمید هر مرحله چرا انجام می‌شود، به
              چه داده‌ای نیاز دارد و چگونه به یک سؤال زیستی پاسخ
              می‌دهد.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a
                href="#path-finder"
                className="inline-flex min-h-12 items-center justify-center rounded-xl bg-slate-950 px-6 py-3 font-semibold text-white transition hover:bg-slate-800"
              >
                مسیر مناسبم را پیدا کنم
              </a>

              <a
                href="#research-lines"
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-800 transition hover:border-teal-400 hover:text-teal-800"
              >
                مشاهده حوزه‌های پژوهشی
              </a>
            </div>

            <div className="mt-12 grid max-w-3xl gap-4 sm:grid-cols-3">
              <HeroStat
                value="۵"
                label="حوزه پژوهشی اصلی"
              />

              <HeroStat
                value="سؤال‌محور"
                label="شروع از مسئله پژوهشی"
                englishValue="Question First"
              />

              <HeroStat
                value="هدایت‌شونده"
                label="مسیر متناسب با نیاز شما"
                englishValue="Guided"
              />
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-3xl">
          <p className="text-sm font-semibold text-teal-700">
            مسیر هاب‌ژن چگونه کار می‌کند؟
          </p>

          <h2 className="mt-2 text-3xl font-bold text-slate-950">
            از فهمیدن تا تصمیم‌گیری پژوهشی
          </h2>

          <p className="mt-4 leading-8 text-slate-600">
            لازم نیست از ابتدا بدانید کدام نرم‌افزار یا روش برای شما
            مناسب است. ابتدا مسئله را می‌فهمیم، سپس داده و مسیر تحلیل
            را می‌شناسیم و در مرحله بعد آن را به پروژه واقعی متصل
            می‌کنیم.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <JourneyCard
            number="01"
            title="بفهم"
            englishTitle="Understand"
            description="مفهوم، سؤال علمی و منطق هر مرحله را به زبان روشن بشناس."
          />

          <JourneyCard
            number="02"
            title="بررسی کن"
            englishTitle="Explore"
            description="مسیر تحلیل، نوع داده و نمونه‌های واقعی را قدم‌به‌قدم ببین."
          />

          <JourneyCard
            number="03"
            title="طراحی کن"
            englishTitle="Design"
            description="وقتی آماده بودی، مفاهیم را روی سؤال و پروژه خودت اعمال کن."
          />

          <JourneyCard
            number="04"
            title="کمک تخصصی بگیر"
            englishTitle="Expert Help"
            description="اگر تصمیم پروژه‌محور پیچیده شد، متخصص در نقطه مناسب وارد مسیر می‌شود."
          />
        </div>
      </section>

      {/* PATH FINDER */}
      <section
        id="path-finder"
        className="scroll-mt-8 border-y border-slate-200 bg-white"
      >
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <div className="sticky top-8">
                <span className="inline-flex rounded-full bg-teal-50 px-3 py-1 text-sm font-semibold text-teal-700">
                  راهنمای انتخاب مسیر
                </span>

                <p
                  dir="ltr"
                  className="mt-2 text-left text-xs font-semibold text-slate-400"
                >
                  Research Path Finder
                </p>

                <h2 className="mt-5 text-3xl font-bold leading-tight text-slate-950">
                  هنوز نمی‌دانید از کدام حوزه شروع کنید؟
                </h2>

                <p className="mt-5 leading-8 text-slate-600">
                  فقط سه سؤال کوتاه پاسخ دهید. هدف این بخش ارزیابی
                  دانش شما نیست؛ فقط کمک می‌کند نقطه شروع مناسب‌تری در
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
              <PathFinderStep
                number="۱"
                title="بیشتر درباره چه چیزی کنجکاوید؟"
                subtitle="لازم نیست نام روش یا نرم‌افزار خاصی را بدانید."
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

              <PathFinderStep
                number="۲"
                title="برای چه چیزی به هاب‌ژن آمده‌اید؟"
                subtitle="این پاسخ تعیین می‌کند یادگیری، پروژه یا راهنمایی تخصصی برای شما اولویت داشته باشد."
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

              <PathFinderStep
                number="۳"
                title="سطح آشنایی فعلی شما چقدر است؟"
                subtitle="سطح شما قرار است عمق توضیحات را تغییر دهد، نه ارزش مسیر یادگیری شما را."
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

                    <h3 className="mt-6 text-2xl font-bold text-slate-950">
                      {recommendedLine.title}
                    </h3>

                    <p
                      dir="ltr"
                      className="mt-1 text-left text-sm font-semibold text-teal-700"
                    >
                      {recommendedLine.englishTitle}
                    </p>

                    <p className="mt-4 leading-8 text-slate-600">
                      {recommendation.reason}
                    </p>

                    <div className="mt-6 flex flex-wrap gap-2">
                      {recommendedLine.concepts
                        .slice(0, 4)
                        .map((concept) => (
                          <span
                            key={concept}
                            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600"
                          >
                            {concept}
                          </span>
                        ))}
                    </div>

                    <div className="mt-7">
                      {recommendedLine.href ? (
                        <a
                          href={recommendedLine.href}
                          className="inline-flex min-h-11 items-center justify-center rounded-xl bg-slate-950 px-5 py-2.5 font-semibold text-white transition hover:bg-slate-800"
                        >
                          شروع این مسیر
                        </a>
                      ) : (
                        <a
                          href={`#${recommendedLine.id}`}
                          className="inline-flex min-h-11 items-center justify-center rounded-xl bg-slate-950 px-5 py-2.5 font-semibold text-white transition hover:bg-slate-800"
                        >
                          آشنایی با این حوزه
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-6">
                  <p className="text-sm leading-7 text-slate-500">
                    بعد از پاسخ به هر سه سؤال، مسیر پیشنهادی شما
                    همین‌جا نمایش داده می‌شود.
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
            پنج حوزه اصلی هاب‌ژن
          </span>

          <p
            dir="ltr"
            className="mt-1 text-left text-xs font-semibold text-slate-400"
          >
            Five Research Lines
          </p>

          <h2 className="mt-3 text-3xl font-bold leading-tight text-slate-950 sm:text-4xl">
            پنج دروازه ورود به زیست‌شناسی محاسباتی
          </h2>

          <p className="mt-5 leading-8 text-slate-600">
            هر مسیر از یک سؤال علمی شروع می‌شود و به‌تدریج شما را با
            ساختار داده، مسیر تحلیل، تصمیم‌های آماری، خطاهای رایج و
            تفسیر زیستی آشنا می‌کند.
          </p>
        </div>

        <div className="mt-12 space-y-6">
          {researchLines.map((line) => (
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
                          line.featured
                            ? "text-teal-300"
                            : "text-teal-700",
                        ].join(" ")}
                      >
                        مسیر پژوهشی {line.number}
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
                        {line.number}
                      </span>
                    </div>

                    <h3 className="mt-8 text-2xl font-bold leading-tight">
                      {line.title}
                    </h3>

                    <p
                      dir="ltr"
                      className={[
                        "mt-2 text-left text-sm font-semibold",
                        line.featured
                          ? "text-teal-300"
                          : "text-slate-500",
                      ].join(" ")}
                    >
                      {line.englishTitle}
                    </p>
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
                          className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-600"
                        >
                          {concept}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 border-t border-slate-100 pt-6">
                    {line.href ? (
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm font-medium text-slate-500">
                          <span>یادگیری</span>
                          <span className="text-teal-500">←</span>
                          <span>بررسی مسیر</span>
                          <span className="text-teal-500">←</span>
                          <span>پروژه واقعی</span>
                        </div>

                        <a
                          href={line.href}
                          className="inline-flex min-h-11 items-center justify-center rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800"
                        >
                          ورود به مسیر RNA-seq
                        </a>
                      </div>
                    ) : (
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm font-medium text-slate-500">
                        <span>آشنایی با مفاهیم</span>
                        <span className="text-teal-500">←</span>
                        <span>نقشه تحلیل</span>
                        <span className="text-teal-500">←</span>
                        <span>پروژه نمونه</span>
                        <span className="text-teal-500">←</span>
                        <span>راهنمای پروژه</span>
                      </div>
                    )}
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
                مسیرهای پژوهشی هاب‌ژن به یکدیگر متصل‌اند.
              </h2>

              <p className="mt-5 leading-8 text-slate-300">
                یک پروژه ممکن است از داده‌های عمومی شروع شود، وارد
                تحلیل RNA-seq شود، برای بررسی روابط ژنی به تحلیل
                شبکه برسد و برای اعتبارسنجی دوباره به یک مجموعه‌داده
                مستقل بازگردد.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <ConnectionCard
                title="داده‌های عمومی ← RNA-seq"
                englishTitle="Public Data → RNA-seq"
                text="یک مجموعه‌داده عمومی می‌تواند ورودی یک پروژه ترنسکریپتومیکس باشد."
              />

              <ConnectionCard
                title="RNA-seq ← تحلیل شبکه"
                englishTitle="RNA-seq → Network Biology"
                text="در صورت مناسب بودن طراحی، ماتریس بیان می‌تواند وارد تحلیل هم‌بیانی و WGCNA شود."
              />

              <ConnectionCard
                title="تحلیل شبکه ← اعتبارسنجی"
                englishTitle="Network → Validation"
                text="ژن‌ها یا نشانگرهای کاندیدا را می‌توان در مجموعه‌داده‌های مستقل بررسی کرد."
              />

              <ConnectionCard
                title="داده عمومی ← تک‌سلولی"
                englishTitle="Public Data → Single-cell"
                text="یک مجموعه‌داده عمومی ممکن است شما را وارد یک پرسش تک‌سلولی و مسیر تحلیلی متفاوت کند."
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
                لازم نیست یادگیری را از برنامه‌نویسی شروع کنید.
              </h2>

              <p className="mt-5 text-lg leading-8 text-slate-600">
                ابتدا بفهمید سؤال پژوهشی چیست، داده چه ساختاری دارد و
                هر مرحله از تحلیل چرا وجود دارد. وقتی نقشه ذهنی شکل
                گرفت، ابزارها و اجرای عملی معنای بسیار روشن‌تری پیدا
                می‌کنند.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a
                  href="/learn/rna-seq"
                  className="inline-flex min-h-12 items-center justify-center rounded-xl bg-teal-700 px-6 py-3 font-semibold text-white transition hover:bg-teal-800"
                >
                  شروع با RNA-seq
                </a>

                <a
                  href="#path-finder"
                  className="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:border-teal-300"
                >
                  هنوز مطمئن نیستم؛ مسیرم را پیدا کنم
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
  englishValue,
}: {
  value: string;
  label: string;
  englishValue?: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur">
      <p className="font-bold text-slate-950">
        {value}
      </p>

      {englishValue && (
        <p
          dir="ltr"
          className="mt-0.5 text-left text-[10px] font-semibold text-teal-600"
        >
          {englishValue}
        </p>
      )}

      <p className="mt-1 text-sm leading-6 text-slate-500">
        {label}
      </p>
    </div>
  );
}

function JourneyCard({
  number,
  title,
  englishTitle,
  description,
}: {
  number: string;
  title: string;
  englishTitle: string;
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
          {englishTitle}
        </span>
      </div>

      <h3 className="mt-6 text-xl font-bold text-slate-950">
        {title}
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
          done
            ? "font-medium text-slate-800"
            : "text-slate-500",
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
          <h3 className="text-xl font-bold text-slate-950">
            {title}
          </h3>

          <p className="mt-1 text-sm leading-6 text-slate-500">
            {subtitle}
          </p>
        </div>
      </div>

      <div className="mt-6">{children}</div>
    </section>
  );
}

function ConnectionCard({
  title,
  englishTitle,
  text,
}: {
  title: string;
  englishTitle: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <p className="font-bold text-white">
        {title}
      </p>

      <p
        dir="ltr"
        className="mt-1 text-left text-[11px] font-semibold text-teal-300"
      >
        {englishTitle}
      </p>

      <p className="mt-4 text-sm leading-7 text-slate-300">
        {text}
      </p>
    </div>
  );
}
