import {
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  Filter,
  FolderKanban,
  Focus,
  Search,
  Target,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";

type ManagedHotspot = {
  hotspot_key?: string | null;
  key?: string | null;
  x?: number | string | null;
  y?: number | string | null;
  width?: number | string | null;
  height?: number | string | null;
};

type GdcQuestionDrivenGuideV2Props = {
  imageUrl?: string | null;
  managedHotspots?: ManagedHotspot[];
  pageTitle?: string | null;
  pageDescription?: string | null;
  onOpenLegacyTour?: () => void;
};

type Question = {
  id: string;
  title: string;
  short: string;
  icon: typeof Search;
};

const DEFAULT_IMAGE = "/images/gdc/gdc-home-clean.webp";

const questions: Question[] = [
  {
    id: "discover",
    title: "چه داده‌ای برای موضوع یا سرطان موردنظر من در GDC وجود دارد؟",
    short: "پروژه مناسب را پیدا کن و ببین چه نوع داده‌ای در آن وجود دارد.",
    icon: FolderKanban,
  },
  {
    id: "cohort",
    title: "چطور گروه بیماران یا نمونه‌های مناسب مطالعه‌ام را انتخاب کنم؟",
    short: "از معیارهای پژوهشی به یک Cohort قابل استفاده برس.",
    icon: Users,
  },
  {
    id: "files",
    title: "چطور فایل و نوع داده مناسب برای تحلیل را پیدا و دریافت کنم؟",
    short: "از Cohort به فایل درست و روش دریافت داده برس.",
    icon: Download,
  },
  {
    id: "analysis",
    title: "روی داده‌های گروه مطالعاتی من چه تحلیل‌هایی می‌توانم انجام دهم؟",
    short: "ابزار تحلیلی را بر اساس سؤال پژوهشی انتخاب کن.",
    icon: BarChart3,
  },
  {
    id: "search",
    title: "چطور یک ژن، جهش، پروژه یا شناسه مشخص را سریع پیدا کنم؟",
    short: "وقتی دقیقاً می‌دانی دنبال چه موجودیتی هستی.",
    icon: Search,
  },
];

const primarySites: Array<readonly [string, string]> = [
  ["bronchus and lung", "27 (29.03%)"],
  ["unknown", "22 (23.66%)"],
  ["breast", "21 (22.58%)"],
  ["colon", "21 (22.58%)"],
  ["liver and intrahepatic bile ducts", "18 (19.35%)"],
  ["hematopoietic and reticuloendothelial systems", "17 (18.28%)"],
  ["ovary", "17 (18.28%)"],
  ["connective, subcutaneous and other soft tissues", "16 (17.20%)"],
  ["corpus uteri", "16 (17.20%)"],
  ["kidney", "16 (17.20%)"],
  ["rectum", "16 (17.20%)"],
  ["brain", "15 (16.13%)"],
  ["skin", "15 (16.13%)"],
  ["stomach", "14 (15.05%)"],
  ["pancreas", "13 (13.98%)"],
];

function ProjectsPreview({ onOpenPrimarySite }: { onOpenPrimarySite: () => void }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm" dir="ltr">
      <div className="border-b border-slate-200 bg-white px-5 py-4">
        <div className="flex flex-wrap items-center gap-5 text-sm font-semibold text-slate-600">
          <span>Analysis Center</span>
          <span className="rounded-lg bg-teal-50 px-3 py-2 font-black text-teal-800 ring-1 ring-teal-200">Projects</span>
          <span>Cohort Builder</span>
          <span>Repository</span>
        </div>
      </div>

      <div className="grid min-h-[520px] lg:grid-cols-[310px_minmax(0,1fr)]">
        <aside className="border-r border-slate-200 bg-slate-50 p-4">
          <div className="mb-4 flex items-center gap-2 font-black text-slate-800">
            <Filter className="h-4 w-4" /> Filters
          </div>
          <button
            type="button"
            onClick={onOpenPrimarySite}
            className="w-full rounded-xl bg-[#215d82] px-4 py-4 text-left text-base font-black text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-center justify-between gap-3">
              <span>Primary Site</span>
              <span className="rounded-full bg-white/15 px-2 py-1 text-[10px]">کلیک برای توضیح</span>
            </div>
          </button>
          {['Program', 'Disease Type', 'Data Category', 'Experimental Strategy'].map((item) => (
            <button
              key={item}
              type="button"
              className="mt-3 w-full rounded-xl bg-[#215d82] px-4 py-4 text-left text-sm font-bold text-white/95"
            >
              {item}
            </button>
          ))}
          <div className="mt-5 rounded-xl border border-teal-200 bg-teal-50 p-4 text-right" dir="rtl">
            <div className="text-xs font-black text-teal-800">راهنمای این مرحله</div>
            <p className="mt-2 text-xs leading-6 text-teal-900/80">
              روی Primary Site کلیک کن. مفهوم لازم بدون خروج از مسیر اصلی در یک پنل موقت باز می‌شود.
            </p>
          </div>
        </aside>

        <div className="overflow-x-auto p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="text-lg font-black text-slate-900">TOTAL OF 93 PROJECTS</div>
            <div className="rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-400">Search</div>
          </div>
          <table className="w-full min-w-[760px] border-collapse text-sm">
            <thead>
              <tr className="border-y border-slate-200 bg-slate-50 text-left text-xs font-black text-slate-700">
                <th className="px-3 py-3">Project</th>
                <th className="px-3 py-3">Disease Type</th>
                <th className="px-3 py-3">Primary Site</th>
                <th className="px-3 py-3">Program</th>
                <th className="px-3 py-3">Cases</th>
                <th className="px-3 py-3">Experimental Strategy</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['FM-AD', '23 Disease Types', '42 Primary Sites', 'FM', '18,004', 'Targeted Sequencing'],
                ['CCDI-MCI', '14 Disease Types', '49 Primary Sites', 'CCDI', '3,076', 'Methylation Array, WXS'],
                ['TARGET-AML', '2 Disease Types', '2 Primary Sites', 'TARGET', '2,492', 'RNA-Seq, WGS, WXS'],
                ['CPTAC-3', '12 Disease Types', '23 Primary Sites', 'CPTAC', '1,866', 'RNA-Seq, scRNA-Seq, WGS, WXS'],
                ['TARGET-ALL-P2', 'Lymphoid Leukemias', 'Hematopoietic systems', 'TARGET', '1,587', 'RNA-Seq, WGS, WXS'],
                ['MP2PRT-ALL', '2 Disease Types', 'Hematopoietic systems', 'MP2PRT', '1,510', 'RNA-Seq, WGS, WXS'],
              ].map((row) => (
                <tr key={row[0]} className="border-b border-slate-200 text-slate-700">
                  {row.map((cell, index) => (
                    <td key={`${row[0]}-${index}`} className={`px-3 py-3 ${index === 0 ? 'font-bold text-sky-800 underline' : ''}`}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function PrimarySiteLens({ onClose }: { onClose: () => void }) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm" dir="rtl">
      <button type="button" aria-label="بستن" onClick={onClose} className="absolute inset-0" />
      <section className="relative z-10 grid max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl lg:grid-cols-[390px_minmax(0,1fr)]">
        <div className="overflow-y-auto border-b border-slate-200 bg-slate-50 p-5 lg:border-b-0 lg:border-l">
          <div className="overflow-hidden rounded-xl border border-slate-300 bg-white shadow-sm" dir="ltr">
            <div className="flex items-center justify-between bg-[#215d82] px-4 py-3 text-white">
              <span className="text-lg font-black">Primary Site</span>
              <Search className="h-4 w-4" />
            </div>
            <div className="grid grid-cols-[1fr_auto] border-b border-slate-200 px-3 py-2 text-xs font-black text-[#215d82]">
              <span>Name</span><span>Projects</span>
            </div>
            <div className="max-h-[440px] overflow-y-auto p-2">
              {primarySites.map(([name, count]) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => setSelected(name)}
                  className={`grid w-full grid-cols-[1fr_auto] items-center gap-3 rounded-lg px-2 py-1.5 text-left text-xs transition ${
                    selected === name ? 'bg-teal-100 ring-1 ring-teal-300' : 'hover:bg-slate-50'
                  }`}
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <span className="h-4 w-4 shrink-0 rounded border border-slate-400 bg-white" />
                    <span className="truncate">{name}</span>
                  </span>
                  <span className="font-semibold text-slate-700">{count}</span>
                </button>
              ))}
            </div>
          </div>
          <p className="mt-3 text-center text-[11px] leading-5 text-slate-400">
            نمای آموزشی بازشده Primary Site بر اساس اسکرین‌شات فعلی GDC
          </p>
        </div>

        <div className="overflow-y-auto p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-xs font-black uppercase tracking-[0.18em] text-teal-700">Context Lens</div>
              <h2 className="mt-2 text-2xl font-black text-slate-950">Primary Site یعنی چه؟</h2>
              <p className="mt-2 text-sm font-bold text-slate-500">محل اولیه یا آناتومیکی تومور</p>
            </div>
            <button type="button" onClick={onClose} className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-50">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="text-xs font-black text-slate-500">این فیلتر چه سؤالی را جواب می‌دهد؟</div>
            <p className="mt-2 text-base font-bold leading-8 text-slate-800">
              «سرطان یا نمونه موردنظر من از نظر محل اولیه تومور در کدام ناحیه آناتومیکی قرار می‌گیرد؟»
            </p>
          </div>

          <div className="mt-4 rounded-2xl border border-teal-100 bg-teal-50/70 p-5">
            <div className="text-sm font-black text-teal-900">چرا برای سؤال مادر مهم است؟</div>
            <p className="mt-2 text-sm leading-7 text-teal-950/80">
              وقتی هنوز بین ده‌ها Project جست‌وجو می‌کنید، Primary Site کمک می‌کند پروژه‌ها را از نظر محل اولیه تومور محدود کنید. عدد ستون Projects نشان می‌دهد چند پروژه با آن Primary Site مرتبط هستند.
            </p>
          </div>

          <div className="mt-4 rounded-2xl border border-amber-100 bg-amber-50 p-5">
            <div className="text-sm font-black text-amber-900">نکته مفهومی مهم</div>
            <p className="mt-2 text-sm leading-7 text-amber-950/80">
              Primary Site را با Disease Type یکی ندانید. Primary Site به محل آناتومیکی اولیه اشاره دارد؛ Disease Type طبقه‌بندی بیماری را توصیف می‌کند. هر دو برای محدود کردن پروژه‌ها مفیدند، اما یک سؤال را جواب نمی‌دهند.
            </p>
          </div>

          <div className="mt-4 rounded-2xl border border-sky-100 bg-sky-50/70 p-5">
            <div className="text-sm font-black text-sky-900">یک تصمیم کوچک بگیر</div>
            <p className="mt-2 text-sm leading-7 text-sky-950/80">
              فرض کن سؤال پژوهشی تو درباره سرطان پستان است. در لیست سمت چپ روی <span className="font-black" dir="ltr">breast</span> کلیک کن.
            </p>
            {selected === 'breast' ? (
              <div className="mt-3 flex items-center gap-2 rounded-xl bg-white p-3 text-sm font-bold text-teal-800 ring-1 ring-teal-200">
                <CheckCircle2 className="h-4 w-4" />
                درست است. حالا می‌توانیم ببینیم Disease Type چه اطلاعات متفاوتی به این انتخاب اضافه می‌کند.
              </div>
            ) : selected ? (
              <div className="mt-3 rounded-xl bg-white p-3 text-sm text-slate-600 ring-1 ring-slate-200">
                این گزینه یک Primary Site معتبر است، اما برای مثال سرطان پستان دنبال <span className="font-bold" dir="ltr">breast</span> هستیم.
              </div>
            ) : null}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 py-3 text-sm font-black text-white transition hover:bg-teal-800"
          >
            فهمیدم، ادامه مسیر Projects
            <ChevronLeft className="h-4 w-4" />
          </button>
        </div>
      </section>
    </div>
  );
}

export function GdcQuestionDrivenGuideV2({
  imageUrl,
  pageTitle,
  pageDescription,
  onOpenLegacyTour,
}: GdcQuestionDrivenGuideV2Props) {
  const [questionId, setQuestionId] = useState('discover');
  const [stageIndex, setStageIndex] = useState(0);
  const [showPrimarySite, setShowPrimarySite] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const selectedQuestion = questions.find((item) => item.id === questionId) ?? questions[0];

  if (!selectedQuestion) {
    throw new Error("GDC V2 requires at least one research question.");
  }

  const stages = [
    {
      title: 'از کجا شروع کنم؟',
      question: 'اگر می‌خواهم بفهمم برای سرطان یا موضوع پژوهشی من چه داده‌ای وجود دارد، از کدام بخش GDC شروع کنم؟',
      answer: 'برای دیدن داده‌ها در سطح پروژه از Projects شروع می‌کنیم.',
      why: 'قبل از ساخت Cohort یا انتخاب فایل باید بدانیم پروژه مرتبط و نوع داده موردنیاز اصلاً وجود دارد یا نه.',
    },
    {
      title: 'Projects را بخوان',
      question: 'در صفحه Projects چه اطلاعاتی برای پیدا کردن داده مناسب مهم هستند؟',
      answer: 'جدول پروژه‌ها و فیلترهای Primary Site، Program، Disease Type، Data Category و Experimental Strategy نقشه اصلی جست‌وجوی ما هستند.',
      why: 'هر کدام یک بخش از سؤال پژوهشی را به یک معیار قابل فیلتر در GDC تبدیل می‌کنند.',
    },
    {
      title: 'Program و Project',
      question: 'Program و Project چه فرقی دارند؟',
      answer: 'Program چارچوب پژوهشی بزرگ‌تر است و Project واحد مشخص‌تری برای سازمان‌دهی داده‌هاست.',
      why: 'برای انتخاب عملی داده باید بدانیم در کدام Project کار می‌کنیم و آن Project متعلق به چه Programی است.',
    },
    {
      title: 'پروژه مرتبط را محدود کن',
      question: 'چطور ده‌ها پروژه را به پروژه‌های مرتبط با سرطان و نوع داده خودم محدود کنم؟',
      answer: 'Facetها را بر اساس سؤال پژوهشی یکی‌یکی اعمال می‌کنیم؛ نه اینکه همه گزینه‌ها را از ابتدا یاد بگیریم.',
      why: 'فیلتر باید از سؤال پژوهشی بیاید؛ نه از کنجکاوی درباره رابط کاربری.',
    },
    {
      title: 'نوع داده را بررسی کن',
      question: 'از کجا بفهمم Project انتخاب‌شده واقعاً داده مناسب تحلیل من را دارد؟',
      answer: 'Experimental Strategy، Data Category و سپس Project Summary را بررسی می‌کنیم.',
      why: 'نام پروژه کافی نیست؛ داده موجود باید با طراحی تحلیل شما سازگار باشد.',
    },
    {
      title: 'تصمیم بعدی',
      question: 'وقتی Project و نوع داده مناسب را پیدا کردم، قدم بعدی چیست؟',
      answer: 'برای انتخاب دقیق Caseها به Cohort Builder و برای رسیدن به فایل‌ها به Repository می‌رویم.',
      why: 'اینجا جست‌وجوی پروژه به مسیر عملی پژوهش متصل می‌شود.',
    },
  ];

  const current = stages[Math.min(stageIndex, stages.length - 1)] ?? stages[0];

  if (!current) {
    throw new Error("GDC V2 requires at least one discovery stage.");
  }
  const discoveryActive = selectedQuestion.id === 'discover';

  function chooseQuestion(id: string) {
    setQuestionId(id);
    setStageIndex(0);
    setZoomed(false);
  }

  return (
    <main dir="rtl" className="min-h-screen bg-slate-50 text-slate-900">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-[1500px] px-5 py-7 sm:px-8 lg:px-10">
          <a href="/resources" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-teal-700">
            <ArrowLeft className="h-4 w-4 rotate-180" /> بازگشت به منابع داده
          </a>
          <div className="mt-5 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div className="max-w-4xl">
              <div className="mb-3 inline-flex rounded-full bg-teal-100 px-3 py-1 text-xs font-black text-teal-800">آموزش سؤال‌محور GDC</div>
              <h1 className="text-3xl font-black text-slate-950 sm:text-4xl">{pageTitle || 'آموزش پرتال GDC'}</h1>
              <p className="mt-3 text-sm leading-8 text-slate-600 sm:text-base">{pageDescription}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {onOpenLegacyTour ? (
                <button type="button" onClick={onOpenLegacyTour} className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-600">تور ۷ بخش قبلی</button>
              ) : null}
              <a href="https://portal.gdc.cancer.gov/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-black text-white hover:bg-teal-700">
                GDC واقعی <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1500px] px-5 py-7 sm:px-8 lg:px-10">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-2 text-sm font-black text-teal-700"><Target className="h-4 w-4" /> برای چه کاری وارد GDC شده‌اید؟</div>
          <div className="mt-4 grid gap-3 lg:grid-cols-5">
            {questions.map((item) => {
              const Icon = item.icon;
              const active = item.id === questionId;
              return (
                <button key={item.id} type="button" onClick={() => chooseQuestion(item.id)} className={`rounded-2xl border p-4 text-right transition ${active ? 'border-teal-300 bg-teal-50 shadow-sm' : 'border-slate-200 hover:border-slate-300'}`}>
                  <Icon className={`h-5 w-5 ${active ? 'text-teal-700' : 'text-slate-400'}`} />
                  <div className="mt-3 text-sm font-black leading-6 text-slate-900">{item.title}</div>
                  <div className="mt-2 text-xs leading-5 text-slate-500">{item.short}</div>
                </button>
              );
            })}
          </div>
        </div>

        {!discoveryActive ? (
          <div className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <div className="text-lg font-black text-slate-900">این مسیر در مرحله بعد ساخته می‌شود</div>
            <p className="mt-2 text-sm text-slate-500">فعلاً موتور سؤال‌محور را با سؤال مادر اول کامل می‌کنیم.</p>
          </div>
        ) : (
          <>
            <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
              {stages.map((stage, index) => (
                <button key={stage.title} type="button" onClick={() => { setStageIndex(index); setZoomed(false); }} className={`shrink-0 rounded-full px-4 py-2 text-xs font-black ${index === stageIndex ? 'bg-teal-700 text-white' : 'bg-white text-slate-500 ring-1 ring-slate-200'}`}>
                  {index + 1}. {stage.title}
                </button>
              ))}
            </div>

            <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.75fr)_420px]">
              <div className="xl:sticky xl:top-5 xl:self-start">
                {stageIndex === 0 ? (
                  <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <img src={imageUrl || DEFAULT_IMAGE} alt="صفحه اصلی GDC" className={`w-full transition duration-500 ${zoomed ? 'scale-[1.16] origin-top-left' : 'scale-100'}`} />
                    <div className="pointer-events-none absolute inset-0 bg-slate-950/20" />
                    <div className="absolute left-[12.6%] top-[8.8%] h-[7%] w-[9%] rounded-lg border-[3px] border-teal-400 bg-teal-300/20 shadow-[0_0_0_999px_rgba(15,23,42,0.18)]" />
                    <button type="button" onClick={() => setZoomed((v) => !v)} className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2 text-xs font-black text-white"><Focus className="h-4 w-4" /> {zoomed ? 'بازگشت' : 'زوم روی Projects'}</button>
                  </div>
                ) : (
                  <ProjectsPreview onOpenPrimarySite={() => setShowPrimarySite(true)} />
                )}
              </div>

              <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="text-xs font-black text-teal-700">مرحله {stageIndex + 1} از {stages.length}</div>
                <h2 className="mt-2 text-2xl font-black text-slate-950">{current.title}</h2>
                <div className="mt-5 rounded-xl bg-slate-50 p-4">
                  <div className="text-xs font-black text-slate-500">سؤال این مرحله</div>
                  <p className="mt-2 text-sm font-bold leading-7 text-slate-800">{current.question}</p>
                </div>
                <div className="mt-3 rounded-xl border border-teal-100 bg-teal-50/70 p-4">
                  <div className="text-xs font-black text-teal-800">پاسخ کوتاه</div>
                  <p className="mt-2 text-sm leading-7 text-teal-950/80">{current.answer}</p>
                </div>
                <div className="mt-3 rounded-xl border border-sky-100 bg-sky-50/70 p-4">
                  <div className="text-xs font-black text-sky-800">چرا مهم است؟</div>
                  <p className="mt-2 text-sm leading-7 text-sky-950/80">{current.why}</p>
                </div>

                {stageIndex >= 1 && stageIndex <= 3 ? (
                  <button type="button" onClick={() => setShowPrimarySite(true)} className="mt-4 w-full rounded-xl border border-teal-200 bg-white px-4 py-3 text-sm font-black text-teal-800 transition hover:bg-teal-50">
                    Primary Site را داخل همین مرحله بررسی کن
                  </button>
                ) : null}

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <button type="button" onClick={() => setStageIndex((i) => Math.max(0, i - 1))} disabled={stageIndex === 0} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 disabled:opacity-40"><ChevronRight className="h-4 w-4" /> قبلی</button>
                  <button type="button" onClick={() => setStageIndex((i) => Math.min(stages.length - 1, i + 1))} disabled={stageIndex === stages.length - 1} className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-700 px-4 py-3 text-sm font-black text-white disabled:opacity-40">بعدی <ChevronLeft className="h-4 w-4" /></button>
                </div>
              </aside>
            </div>
          </>
        )}
      </section>

      {showPrimarySite ? <PrimarySiteLens onClose={() => setShowPrimarySite(false)} /> : null}
    </main>
  );
}
