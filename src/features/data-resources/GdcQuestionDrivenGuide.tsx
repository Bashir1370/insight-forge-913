import {
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Database,
  Download,
  ExternalLink,
  Focus,
  FolderKanban,
  Search,
  Target,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";

type ManagedHotspot = {
  hotspot_key?: string | null;
  key?: string | null;
  x?: number | string | null;
  y?: number | string | null;
  width?: number | string | null;
  height?: number | string | null;
};

type GdcQuestionDrivenGuideProps = {
  imageUrl?: string | null;
  managedHotspots?: ManagedHotspot[];
  pageTitle?: string | null;
  pageDescription?: string | null;
  onOpenLegacyTour?: () => void;
};

type ResearchQuestion = {
  id: string;
  title: string;
  short: string;
  route: string[];
  icon: typeof Database;
};

type DiscoveryStage = {
  title: string;
  question: string;
  answer: string;
  why: string;
  focus: string;
  hasVisual: boolean;
};

const DEFAULT_IMAGE = "/images/gdc/gdc-home-clean.webp";

const researchQuestions: ResearchQuestion[] = [
  {
    id: "discover-data",
    title: "چه داده‌ای برای موضوع یا سرطان موردنظر من در GDC وجود دارد؟",
    short: "پیدا کردن پروژه‌ها و فهمیدن اینکه چه نوع داده‌ای در آن‌ها موجود است.",
    route: ["Projects", "Project Summary", "نوع داده", "تصمیم پژوهشی"],
    icon: FolderKanban,
  },
  {
    id: "build-cohort",
    title: "چطور گروه بیماران یا نمونه‌های مناسب مطالعه‌ام را انتخاب کنم؟",
    short: "تبدیل سؤال پژوهشی به معیارهای انتخاب Case و ساخت Cohort.",
    route: ["Cohort Builder", "Clinical filters", "Biospecimen", "Cohort"],
    icon: Users,
  },
  {
    id: "find-files",
    title: "چطور فایل و نوع داده مناسب برای تحلیل را پیدا و دریافت کنم؟",
    short: "رسیدن از Cohort به فایل درست و شناخت فیلترهای سطح فایل.",
    route: ["Repository", "Experimental Strategy", "Data Type", "Download"],
    icon: Download,
  },
  {
    id: "analyze-cohort",
    title: "روی داده‌های گروه مطالعاتی من چه تحلیل‌هایی می‌توانم انجام دهم؟",
    short: "انتخاب ابزار تحلیلی بر اساس سؤال پژوهشی، نه بر اساس اسم ابزار.",
    route: ["Analysis Center", "سؤال پژوهشی", "انتخاب ابزار", "تفسیر خروجی"],
    icon: BarChart3,
  },
  {
    id: "direct-search",
    title: "چطور یک ژن، جهش، پروژه یا شناسه مشخص را سریع پیدا کنم؟",
    short: "وقتی از قبل می‌دانید دقیقاً دنبال چه موجودیتی هستید.",
    route: ["Global Search", "Entity", "نتیجه", "ادامه مسیر"],
    icon: Search,
  },
];

const discoveryStages: DiscoveryStage[] = [
  {
    title: "از کجا شروع کنم؟",
    question: "اگر می‌خواهم بفهمم برای سرطان یا موضوع پژوهشی من چه داده‌ای وجود دارد، از کدام بخش GDC شروع کنم؟",
    answer:
      "برای دیدن داده‌های GDC در سطح پروژه، از Projects شروع می‌کنیم. این بخش نمای کلی پروژه‌ها را می‌دهد و نقطه خوبی برای پیدا کردن پروژه‌های مرتبط با سؤال شماست.",
    why:
      "قبل از ساخت Cohort یا انتخاب فایل باید مطمئن شوید پروژه مناسب و نوع داده موردنیاز شما اصلاً در GDC وجود دارد.",
    focus: "Projects",
    hasVisual: true,
  },
  {
    title: "Projects چه چیزی نشان می‌دهد؟",
    question: "بعد از ورود به Projects، دقیقاً باید دنبال چه اطلاعاتی بگردم؟",
    answer:
      "Projects داده‌های هماهنگ‌شده GDC را بر اساس پروژه سازمان می‌دهد و اطلاعاتی مانند Program، Disease Type، Primary Site، تعداد Cases و Experimental Strategy را کنار هم قرار می‌دهد.",
    why:
      "این صفحه به شما کمک می‌کند قبل از ورود به جزئیات، پروژه‌های نامرتبط را کنار بگذارید و دامنه جست‌وجو را علمی‌تر محدود کنید.",
    focus: "Projects overview",
    hasVisual: false,
  },
  {
    title: "Program و Project",
    question: "Program و Project چه فرقی دارند و این تفاوت در انتخاب داده چه کمکی می‌کند؟",
    answer:
      "Program چارچوب پژوهشی بزرگ‌تر است و می‌تواند چند Project داشته باشد. Project واحد مشخص‌تری است که معمولاً داده‌های مرتبط با یک تلاش پژوهشی یا حوزه سرطان را سازمان‌دهی می‌کند.",
    why:
      "کاربر باید بداند نام Program به‌تنهایی مجموعه داده نهایی او نیست؛ انتخاب عملی داده معمولاً در سطح Project و بعد Case/File دقیق‌تر می‌شود.",
    focus: "Program + Project",
    hasVisual: false,
  },
  {
    title: "پروژه مرتبط را پیدا کن",
    question: "چطور پروژه‌های مرتبط با سرطان و نوع داده موردنیازم را از بین همه پروژه‌ها جدا کنم؟",
    answer:
      "از Facetهای Projects مثل Primary Site، Program، Disease Type، Data Category و Experimental Strategy استفاده می‌کنیم تا جدول فقط پروژه‌های مرتبط را نشان دهد.",
    why:
      "فیلتر پروژه باید از سؤال پژوهشی بیاید؛ مثلاً نیاز به RNA-Seq یا WXS یک تصمیم علمی است، نه صرفاً یک انتخاب رابط کاربری.",
    focus: "Projects facets",
    hasVisual: false,
  },
  {
    title: "نوع داده را بررسی کن",
    question: "از کجا بفهمم پروژه انتخاب‌شده واقعاً داده مناسب تحلیل من را دارد؟",
    answer:
      "Project Summary و اطلاعات پروژه را بررسی می‌کنیم تا ببینیم چه Experimental Strategy و Data Categoryهایی در پروژه وجود دارد و چه تعداد Case/File در دسترس است.",
    why:
      "نام یک پروژه به‌تنهایی کافی نیست؛ پروژه باید داده‌ای داشته باشد که با طراحی تحلیل شما سازگار باشد.",
    focus: "Project Summary",
    hasVisual: false,
  },
  {
    title: "تصمیم بعدی",
    question: "وقتی پروژه و نوع داده مناسب را پیدا کردم، قدم بعدی چیست؟",
    answer:
      "اگر باید افراد یا Caseهای مناسب را دقیق‌تر انتخاب کنید، وارد Cohort Builder شوید. اگر Cohort مشخص است و دنبال فایل هستید، مسیر بعدی Repository است.",
    why:
      "اینجا جست‌وجوی پروژه به یک تصمیم واقعی پژوهشی تبدیل می‌شود و آموزش به مسیر بعدی متصل می‌شود.",
    focus: "Cohort Builder / Repository",
    hasVisual: false,
  },
];

function numericPercent(value: unknown, fallback: number) {
  const parsed = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return parsed <= 1 ? parsed * 100 : parsed;
}

export function GdcQuestionDrivenGuide({
  imageUrl,
  managedHotspots = [],
  pageTitle,
  pageDescription,
  onOpenLegacyTour,
}: GdcQuestionDrivenGuideProps) {
  const [questionId, setQuestionId] = useState("discover-data");
  const [stageIndex, setStageIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  const selectedQuestion =
    researchQuestions.find((item) => item.id === questionId) ?? researchQuestions[0];
  const currentStage = discoveryStages[stageIndex];

  const projectsBox = useMemo(() => {
    const managed = managedHotspots.find(
      (item) => item.hotspot_key === "projects" || item.key === "projects",
    );

    return {
      x: numericPercent(managed?.x, 12.7),
      y: numericPercent(managed?.y, 9.6),
      width: numericPercent(managed?.width, 7.2),
      height: numericPercent(managed?.height, 5.5),
    };
  }, [managedHotspots]);

  function selectQuestion(id: string) {
    setQuestionId(id);
    setStageIndex(0);
    setZoomed(false);
  }

  const canUseDiscoveryStages = selectedQuestion.id === "discover-data";

  return (
    <main dir="rtl" className="min-h-screen bg-slate-50 text-slate-900">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-[1500px] px-5 py-7 sm:px-8 lg:px-10">
          <a
            href="/resources"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-teal-700"
          >
            <ArrowLeft className="h-4 w-4 rotate-180" />
            بازگشت به منابع داده
          </a>

          <div className="mt-5 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div className="max-w-4xl">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-teal-100 px-3 py-1 text-xs font-bold text-teal-800">
                  آموزش سؤال‌محور GDC
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">NCI</span>
              </div>
              <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                {pageTitle || "آموزش پرتال GDC"}
              </h1>
              <p className="mt-3 text-sm leading-8 text-slate-600 sm:text-base">
                {pageDescription ||
                  "GDC را از روی سؤال پژوهشی یاد می‌گیریم؛ ابتدا مشخص می‌کنیم دنبال چه چیزی هستید و بعد فقط بخش‌ها و ابزارهایی را باز می‌کنیم که برای رسیدن به پاسخ لازم‌اند."}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {onOpenLegacyTour ? (
                <button
                  type="button"
                  onClick={onOpenLegacyTour}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
                >
                  مشاهده تور ۷ بخش قبلی
                </button>
              ) : null}
              <a
                href="https://portal.gdc.cancer.gov/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-teal-700"
              >
                باز کردن GDC واقعی
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1500px] px-5 py-7 sm:px-8 lg:px-10">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="max-w-3xl">
            <div className="text-xs font-black uppercase tracking-[0.16em] text-teal-700">از نیاز پژوهشی شروع کن</div>
            <h2 className="mt-2 text-2xl font-black text-slate-950">برای چه کاری وارد GDC شده‌اید؟</h2>
            <p className="mt-2 text-sm leading-7 text-slate-500">
              به‌جای حفظ کردن منوها، نزدیک‌ترین سؤال به هدف پژوهشی خود را انتخاب کنید. HubGene مسیر مناسب داخل GDC را قدم‌به‌قدم باز می‌کند.
            </p>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            {researchQuestions.map((question, index) => {
              const Icon = question.icon;
              const active = question.id === selectedQuestion.id;
              return (
                <button
                  key={question.id}
                  type="button"
                  onClick={() => selectQuestion(question.id)}
                  className={`group rounded-2xl border p-4 text-right transition ${
                    active
                      ? "border-teal-300 bg-teal-50 shadow-sm ring-2 ring-teal-100"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${active ? "bg-teal-700 text-white" : "bg-slate-100 text-slate-500"}`}>
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="text-xs font-black text-slate-300">0{index + 1}</span>
                  </div>
                  <div className="mt-4 text-sm font-black leading-7 text-slate-900">{question.title}</div>
                  <p className="mt-2 text-xs leading-6 text-slate-500">{question.short}</p>
                </button>
              );
            })}
          </div>
        </div>

        {!canUseDiscoveryStages ? (
          <section className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-white p-7 shadow-sm">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="text-xs font-black text-teal-700">نقشه این مسیر</div>
                <h3 className="mt-2 text-xl font-black text-slate-950">{selectedQuestion.title}</h3>
                <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-500">
                  چهارچوب این مسیر مشخص شده است؛ بعد از تثبیت مسیر اول، همین الگوی سؤال → تصویر → Highlight → تصمیم برای این مسیر پیاده می‌شود.
                </p>
              </div>
              <div className="flex flex-wrap gap-2" dir="ltr">
                {selectedQuestion.route.map((item, index) => (
                  <span key={item} className="rounded-full bg-slate-100 px-3 py-2 text-xs font-bold text-slate-600">
                    {index + 1}. {item}
                  </span>
                ))}
              </div>
            </div>
          </section>
        ) : (
          <section className="mt-6">
            <div className="mb-5 flex flex-wrap gap-2">
              {discoveryStages.map((stage, index) => (
                <button
                  key={stage.title}
                  type="button"
                  onClick={() => {
                    setStageIndex(index);
                    setZoomed(false);
                  }}
                  className={`rounded-full px-4 py-2 text-xs font-bold transition sm:text-sm ${
                    index === stageIndex
                      ? "bg-teal-700 text-white shadow-sm"
                      : index < stageIndex
                        ? "bg-teal-50 text-teal-800"
                        : "bg-white text-slate-500 ring-1 ring-slate-200 hover:text-slate-800"
                  }`}
                >
                  {index + 1}. {stage.title}
                </button>
              ))}
            </div>

            <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.65fr)_420px]">
              <div className="lg:sticky lg:top-24">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-bold text-slate-400">مسیر ۱ · کشف داده</div>
                    <h3 className="mt-1 text-lg font-black text-slate-950">{currentStage.focus}</h3>
                  </div>
                  {currentStage.hasVisual ? (
                    <button
                      type="button"
                      onClick={() => setZoomed((value) => !value)}
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 transition hover:border-teal-200 hover:text-teal-700"
                    >
                      <Focus className="h-4 w-4" />
                      {zoomed ? "نمای کامل" : "زوم روی بخش مهم"}
                    </button>
                  ) : null}
                </div>

                {currentStage.hasVisual ? (
                  <div className="relative aspect-[1911/870] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div
                      className="absolute inset-0 transition-transform duration-500 ease-out"
                      style={{
                        transform: zoomed ? "scale(1.55)" : "scale(1)",
                        transformOrigin: "17% 12%",
                      }}
                    >
                      <img
                        src={imageUrl || DEFAULT_IMAGE}
                        alt="صفحه اصلی GDC با تاکید روی Projects"
                        className="absolute inset-0 h-full w-full object-contain"
                      />
                      <div
                        className="absolute rounded-md border-[3px] border-teal-400 bg-teal-300/20 shadow-[0_0_0_6px_rgba(20,184,166,0.18)]"
                        style={{
                          left: `${projectsBox.x}%`,
                          top: `${projectsBox.y}%`,
                          width: `${projectsBox.width}%`,
                          height: `${projectsBox.height}%`,
                        }}
                      >
                        <span className="absolute -right-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full bg-teal-700 text-xs font-black text-white shadow-lg">
                          1
                        </span>
                      </div>
                    </div>
                    <div className="absolute bottom-3 right-3 rounded-lg bg-slate-950/90 px-3 py-2 text-[11px] font-bold text-white shadow-lg">
                      فقط بخش لازم برای این سؤال Highlight شده است
                    </div>
                  </div>
                ) : (
                  <div className="flex aspect-[1911/870] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-100/70 p-8 text-center">
                    <div className="max-w-lg">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-teal-700 shadow-sm ring-1 ring-slate-200">
                        <Target className="h-6 w-6" />
                      </div>
                      <h4 className="mt-4 text-lg font-black text-slate-900">جای اسکرین‌شات مرحله {stageIndex + 1}</h4>
                      <p className="mt-2 text-sm leading-7 text-slate-500">
                        چهارچوب آموزشی آماده است. برای این مرحله باید اسکرین‌شات تمیز و به‌روز GDC ثبت شود تا Facet، جدول یا Project Summary موردنظر دقیقاً روی تصویر Highlight و در صورت نیاز Zoom شود.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <aside className="rounded-2xl border border-slate-200 bg-white shadow-sm lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto">
                <div className="border-b border-slate-100 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-black text-teal-700">
                      مرحله {stageIndex + 1} از {discoveryStages.length}
                    </span>
                    <span className="text-xs font-bold text-slate-400">Question-driven</span>
                  </div>
                  <h3 className="mt-4 text-xl font-black leading-8 text-slate-950">{currentStage.question}</h3>
                </div>

                <div className="space-y-4 p-5">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="text-xs font-black text-slate-500">پاسخ کوتاه</div>
                    <p className="mt-2 text-sm leading-8 text-slate-700">{currentStage.answer}</p>
                  </div>

                  <div className="rounded-xl border border-teal-100 bg-teal-50/70 p-4">
                    <div className="flex items-center gap-2 text-sm font-black text-teal-800">
                      <Target className="h-4 w-4" />
                      چرا این مرحله مهم است؟
                    </div>
                    <p className="mt-2 text-sm leading-8 text-teal-950/80">{currentStage.why}</p>
                  </div>

                  {stageIndex === 0 ? (
                    <div className="rounded-xl border border-sky-100 bg-sky-50/70 p-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-sky-700" />
                        <div>
                          <div className="text-sm font-black text-sky-900">کاری که همین حالا انجام می‌دهیم</div>
                          <p className="mt-1 text-sm leading-7 text-sky-950/75">
                            در تصویر فقط Projects را برجسته کرده‌ایم؛ کاربر هنوز لازم نیست Cohort Builder، Repository یا ابزارهای تحلیل را یاد بگیرد.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>

                <div className="grid grid-cols-2 gap-3 border-t border-slate-100 p-5">
                  <button
                    type="button"
                    onClick={() => {
                      setStageIndex((index) => Math.max(0, index - 1));
                      setZoomed(false);
                    }}
                    disabled={stageIndex === 0}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-bold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronRight className="h-4 w-4" />
                    قبلی
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setStageIndex((index) => Math.min(discoveryStages.length - 1, index + 1));
                      setZoomed(false);
                    }}
                    disabled={stageIndex === discoveryStages.length - 1}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-700 px-3 py-3 text-sm font-bold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    مرحله بعد
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                </div>
              </aside>
            </div>
          </section>
        )}
      </section>
    </main>
  );
}
