import {
  ArrowLeft,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  FolderKanban,
  Search,
  Target,
  Users,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
  imageUrl?: string | null;
  managedHotspots?: unknown[];
  pageTitle?: string | null;
  pageDescription?: string | null;
  onOpenLegacyTour?: () => void;
};

const DEFAULT_IMAGE = "/images/gdc/gdc-home-clean.webp";
const PROJECT_PARTS = Array.from(
  { length: 7 },
  (_, i) => `/images/gdc/gdc-projects-b64/${String(i + 1).padStart(2, "0")}.txt`,
);

const questions = [
  ["discover", "چه داده‌ای برای موضوع یا سرطان موردنظر من در GDC وجود دارد؟", "پروژه مناسب را پیدا کن و ببین چه داده‌ای در آن وجود دارد.", FolderKanban],
  ["cohort", "چطور گروه بیماران یا نمونه‌های مناسب مطالعه‌ام را انتخاب کنم؟", "از معیارهای پژوهشی به Cohort مناسب برس.", Users],
  ["files", "چطور فایل و نوع داده مناسب برای تحلیل را پیدا و دریافت کنم؟", "از Cohort به فایل درست و روش دریافت داده برس.", Download],
  ["analysis", "روی داده‌های گروه مطالعاتی من چه تحلیل‌هایی می‌توانم انجام دهم؟", "ابزار را بر اساس سؤال پژوهشی انتخاب کن.", BarChart3],
  ["search", "چطور یک ژن، جهش، پروژه یا شناسه مشخص را سریع پیدا کنم؟", "وقتی دقیقاً می‌دانی دنبال چه چیزی هستی.", Search],
] as const;

const stages = [
  ["از کجا شروع کنم؟", "اگر می‌خواهم بفهمم برای سرطان یا موضوع پژوهشی من چه داده‌ای وجود دارد، از کدام بخش GDC شروع کنم؟", "برای دیدن داده‌ها در سطح پروژه از Projects شروع می‌کنیم.", "قبل از ساخت Cohort یا انتخاب فایل باید بدانیم پروژه مرتبط و نوع داده موردنیاز اصلاً وجود دارد یا نه."],
  ["Projects را بخوان", "در صفحه Projects چه اطلاعاتی برای پیدا کردن داده مناسب مهم هستند؟", "جدول پروژه‌ها و فیلترهای Primary Site، Program، Disease Type، Data Category و Experimental Strategy نقشه اصلی جست‌وجوی ما هستند.", "لازم نیست همه فیلترها را یک‌جا یاد بگیرید؛ هر مفهوم را زمانی باز می‌کنیم که برای تصمیم پژوهشی لازم شود."],
  ["Program و Project", "Program و Project چه فرقی دارند؟", "Program چارچوب پژوهشی بزرگ‌تر است و Project واحد مشخص‌تری برای سازمان‌دهی داده‌هاست.", "انتخاب عملی داده در ادامه در سطح Project و سپس Case و File دقیق‌تر می‌شود."],
  ["پروژه مرتبط را محدود کن", "چطور ده‌ها پروژه را به پروژه‌های مرتبط با سرطان و نوع داده خودم محدود کنم؟", "Facetها را بر اساس سؤال پژوهشی یکی‌یکی اعمال می‌کنیم؛ Primary Site یکی از فیلترهای مفید برای محدود کردن پروژه‌هاست.", "به‌جای مرور دستی همه پروژه‌ها، ویژگی‌های سؤال پژوهشی را به فیلترهای GDC تبدیل می‌کنیم."],
  ["نوع داده را بررسی کن", "از کجا بفهمم Project انتخاب‌شده واقعاً داده مناسب تحلیل من را دارد؟", "Experimental Strategy، Data Category و سپس Project Summary را بررسی می‌کنیم.", "نام پروژه کافی نیست؛ داده موجود باید با طراحی تحلیل شما سازگار باشد."],
  ["تصمیم بعدی", "وقتی Project و نوع داده مناسب را پیدا کردم، قدم بعدی چیست؟", "برای انتخاب دقیق Caseها به Cohort Builder و برای رسیدن به فایل‌ها به Repository می‌رویم.", "اینجا جست‌وجوی پروژه به مسیر عملی پژوهش متصل می‌شود."],
] as const;

const primarySites = [
  ["bronchus and lung", "27 (29.03%)"], ["unknown", "22 (23.66%)"],
  ["breast", "21 (22.58%)"], ["colon", "21 (22.58%)"],
  ["liver and intrahepatic bile ducts", "18 (19.35%)"],
  ["hematopoietic and reticuloendothelial systems", "17 (18.28%)"],
  ["ovary", "17 (18.28%)"], ["connective, subcutaneous and other soft tissues", "16 (17.20%)"],
  ["corpus uteri", "16 (17.20%)"], ["kidney", "16 (17.20%)"],
  ["rectum", "16 (17.20%)"], ["brain", "15 (16.13%)"],
  ["skin", "15 (16.13%)"], ["stomach", "14 (15.05%)"], ["pancreas", "13 (13.98%)"],
] as const;

function useProjectsImage() {
  const [src, setSrc] = useState<string | null>(null);
  useEffect(() => {
    let active = true;
    Promise.all(PROJECT_PARTS.map(async (p) => {
      const r = await fetch(p);
      if (!r.ok) throw new Error(p);
      return r.text();
    })).then((parts) => {
      if (active) setSrc(`data:image/webp;base64,${parts.join("")}`);
    }).catch(() => active && setSrc(null));
    return () => { active = false; };
  }, []);
  return src;
}

function ProjectsView({ stage, openLens }: { stage: number; openLens: () => void }) {
  const src = useProjectsImage();
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm" dir="ltr">
      {src ? <img src={src} alt="اسکرین‌شات واقعی صفحه Projects در GDC" className="block w-full" /> :
        <div className="flex aspect-[1905/847] items-center justify-center bg-slate-100 text-sm font-bold text-slate-400">در حال بارگذاری اسکرین‌شات Projects…</div>}
      {stage === 1 && src ? <>
        <button aria-label="راهنمای Primary Site" onClick={openLens}
          className="absolute left-[1%] top-[48%] h-[7%] w-[20%] rounded-md border-[3px] border-teal-400 bg-teal-300/10 shadow-[0_0_0_999px_rgba(15,23,42,.10)] hover:bg-teal-300/20" />
        <button onClick={openLens} dir="rtl"
          className="absolute left-[2%] top-[41%] rounded-full bg-slate-950/90 px-3 py-2 text-[11px] font-black text-white shadow-lg">
          Primary Site را باز کن
        </button>
      </> : null}
      {stage === 2 && src ? <>
        <div className="pointer-events-none absolute left-[22%] top-[40%] h-[55%] w-[10%] rounded-lg border-[3px] border-teal-400 bg-teal-300/10 shadow-[0_0_0_999px_rgba(15,23,42,.10)]" />
        <div className="pointer-events-none absolute left-[62%] top-[40%] h-[55%] w-[9%] rounded-lg border-[3px] border-sky-400 bg-sky-300/10" />
      </> : null}
      {stage === 3 && src ? <div className="pointer-events-none absolute left-[.7%] top-[36%] h-[59%] w-[20%] rounded-lg border-[3px] border-teal-400 bg-teal-300/10 shadow-[0_0_0_999px_rgba(15,23,42,.10)]" /> : null}
      {stage === 4 && src ? <div className="pointer-events-none absolute left-[75%] top-[40%] h-[55%] w-[24%] rounded-lg border-[3px] border-sky-400 bg-sky-300/10 shadow-[0_0_0_999px_rgba(15,23,42,.08)]" /> : null}
    </div>
  );
}

function PrimarySiteLens({ close }: { close: () => void }) {
  return <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm" dir="rtl">
    <button aria-label="بستن" onClick={close} className="absolute inset-0" />
    <section className="relative z-10 grid max-h-[92vh] w-full max-w-6xl overflow-hidden rounded-3xl bg-white shadow-2xl lg:grid-cols-[390px_minmax(0,1fr)]">
      <div className="overflow-y-auto border-b border-slate-200 bg-slate-50 p-5 lg:border-b-0 lg:border-l">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm" dir="ltr">
          <div className="flex items-center justify-between bg-[#215d82] px-4 py-3 text-white"><b>Primary Site</b><Search className="h-4 w-4" /></div>
          <div className="grid grid-cols-[1fr_auto] border-b px-3 py-2 text-xs font-black text-[#215d82]"><span>Name</span><span>Projects</span></div>
          <div className="max-h-[520px] overflow-y-auto p-2">
            {primarySites.map(([name, count]) => <div key={name} className="grid grid-cols-[1fr_auto] items-center gap-3 px-2 py-1.5 text-xs hover:bg-slate-50">
              <span className="flex min-w-0 items-center gap-2"><span className="h-4 w-4 shrink-0 rounded border border-slate-400" /><span className="truncate">{name}</span></span>
              <b className="text-slate-700">{count}</b>
            </div>)}
          </div>
        </div>
        <p className="mt-3 text-center text-xs leading-6 text-slate-500">این فقط بخشی از فهرست است؛ داخل GDC در همین پنل به پایین اسکرول کنید تا Primary Siteهای بیشتری ببینید.</p>
      </div>
      <div className="overflow-y-auto p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div><div className="text-xs font-black text-teal-700">راهنمای Primary Site</div><h2 className="mt-2 text-2xl font-black">Primary Site یعنی چه؟</h2><p className="mt-2 text-sm font-bold text-slate-500">محل آناتومیکی اولیه‌ای که تومور یا بیماری از آن منشأ گرفته است</p></div>
          <button onClick={close} className="rounded-xl border p-2 text-slate-500"><X className="h-5 w-5" /></button>
        </div>
        <div className="mt-6 rounded-2xl border bg-slate-50 p-5">
          <h3 className="text-sm font-black">این لیست همه سرطان‌ها نیست</h3>
          <p className="mt-2 text-sm leading-7 text-slate-700">Primary Site «نوع سرطان» نیست؛ محل اولیه تومور را دسته‌بندی می‌کند. مواردی که الان می‌بینید فقط بخشی از فهرست قابل اسکرول GDC هستند و گزینه‌های بیشتری پایین‌تر وجود دارد.</p>
        </div>
        <div className="mt-4 rounded-2xl border border-teal-100 bg-teal-50/70 p-5">
          <h3 className="text-sm font-black text-teal-900">عدد و درصد روبه‌روی هر مورد چیست؟</h3>
          <p className="mt-2 text-sm leading-7 text-teal-950/80">ستون Projects می‌گوید چند Project از مجموعه فعلی با آن Primary Site مرتبط‌اند. عدد داخل پرانتز سهم همان Projectها از کل Projectهای فعلی است.</p>
          <div className="mt-3 rounded-xl border border-teal-200 bg-white p-4 text-sm leading-7"><span dir="ltr" className="font-black">breast — 21 (22.58%)</span> یعنی در نمای فعلی 93 پروژه، 21 Project با breast مرتبط‌اند و 21÷93 تقریباً 22.58٪ است.</div>
          <p className="mt-3 text-xs leading-6 text-teal-950/70">با اعمال فیلترهای دیگر، کل نتایج و در نتیجه تعداد و درصدها تغییر می‌کند. یک Project هم می‌تواند با بیش از یک Primary Site مرتبط باشد؛ بنابراین درصد ردیف‌ها لزوماً جمعاً 100٪ نمی‌شود.</p>
        </div>
        <div className="mt-4 rounded-2xl border border-amber-100 bg-amber-50 p-5">
          <h3 className="text-sm font-black text-amber-900">Primary Site با Disease Type یکی نیست</h3>
          <p className="mt-2 text-sm leading-7 text-amber-950/80">Primary Site محل آناتومیکی اولیه را می‌گوید؛ Disease Type نوع یا طبقه‌بندی بیماری را توصیف می‌کند. برای محدود کردن پروژه‌ها ممکن است به هر دو نیاز داشته باشید.</p>
        </div>
        <div className="mt-4 rounded-2xl border border-sky-100 bg-sky-50/70 p-5">
          <h3 className="text-sm font-black text-sky-900">مثال کاربردی</h3>
          <p className="mt-2 text-sm leading-7 text-sky-950/80">اگر موضوع شما سرطان پستان است، در Primary Site سراغ <b dir="ltr">breast</b> می‌روید. بعد با Disease Type و نوع داده، نتایج را دقیق‌تر می‌کنیم.</p>
        </div>
        <button onClick={close} className="mt-6 w-full rounded-xl bg-teal-700 px-5 py-3 text-sm font-black text-white">بستن و ادامه مسیر Projects</button>
      </div>
    </section>
  </div>;
}

export function GdcQuestionDrivenGuideV3({ imageUrl, pageTitle, pageDescription, onOpenLegacyTour }: Props) {
  const [questionId, setQuestionId] = useState("discover");
  const [stage, setStage] = useState(0);
  const [lens, setLens] = useState(false);
  const current = stages[stage];
  return <main dir="rtl" className="min-h-screen bg-slate-50 text-slate-900">
    <section className="border-b bg-white"><div className="mx-auto max-w-[1500px] px-5 py-7 sm:px-8 lg:px-10">
      <a href="/resources" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500"><ArrowLeft className="h-4 w-4 rotate-180" />بازگشت به منابع داده</a>
      <div className="mt-5 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div className="max-w-4xl"><span className="rounded-full bg-teal-100 px-3 py-1 text-xs font-black text-teal-800">آموزش سؤال‌محور GDC</span><h1 className="mt-3 text-3xl font-black sm:text-4xl">{pageTitle || "آموزش پرتال GDC"}</h1><p className="mt-3 text-sm leading-8 text-slate-600 sm:text-base">{pageDescription}</p></div>
        <div className="flex gap-2">{onOpenLegacyTour ? <button onClick={onOpenLegacyTour} className="rounded-xl border bg-white px-4 py-3 text-sm font-bold">تور قبلی</button> : null}<a href="https://portal.gdc.cancer.gov/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-black text-white">GDC واقعی<ExternalLink className="h-4 w-4" /></a></div>
      </div>
    </div></section>

    <section className="mx-auto max-w-[1500px] px-5 py-7 sm:px-8 lg:px-10">
      <div className="rounded-3xl border bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-black text-teal-700"><Target className="h-4 w-4" />برای چه کاری وارد GDC شده‌اید؟</div>
        <div className="mt-4 grid gap-3 lg:grid-cols-5">{questions.map(([id,title,short,Icon]) => <button key={id} onClick={() => {setQuestionId(id); setStage(0);}} className={`rounded-2xl border p-4 text-right ${questionId === id ? "border-teal-300 bg-teal-50" : "border-slate-200"}`}><Icon className="h-5 w-5 text-teal-700" /><div className="mt-3 text-sm font-black leading-6">{title}</div><div className="mt-2 text-xs leading-5 text-slate-500">{short}</div></button>)}</div>
      </div>

      {questionId !== "discover" ? <div className="mt-6 rounded-3xl border border-dashed bg-white p-10 text-center"><b>این مسیر در مرحله بعد ساخته می‌شود</b></div> :
      <>
        <div className="mt-6 flex gap-2 overflow-x-auto pb-2">{stages.map((s,i) => <button key={s[0]} onClick={() => setStage(i)} className={`shrink-0 rounded-full px-4 py-2 text-xs font-black ${stage === i ? "bg-teal-700 text-white" : "bg-white text-slate-500 ring-1 ring-slate-200"}`}>{i+1}. {s[0]}</button>)}</div>
        <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.75fr)_420px]">
          <div className="xl:sticky xl:top-5 xl:self-start">{stage === 0 ? <div className="relative overflow-hidden rounded-2xl border bg-white shadow-sm"><img src={imageUrl || DEFAULT_IMAGE} alt="صفحه اصلی GDC" className="w-full" /><div className="pointer-events-none absolute left-[12.6%] top-[8.8%] h-[7%] w-[9%] rounded-lg border-[3px] border-teal-400 bg-teal-300/20 shadow-[0_0_0_999px_rgba(15,23,42,.18)]" /></div> : <ProjectsView stage={stage} openLens={() => setLens(true)} />}</div>
          <aside className="rounded-2xl border bg-white p-5 shadow-sm sm:p-6"><div className="text-xs font-black text-teal-700">مرحله {stage+1} از {stages.length}</div><h2 className="mt-2 text-2xl font-black">{current[0]}</h2>
            <div className="mt-5 rounded-xl bg-slate-50 p-4"><div className="text-xs font-black text-slate-500">سؤال این مرحله</div><p className="mt-2 text-sm font-bold leading-7">{current[1]}</p></div>
            <div className="mt-3 rounded-xl border border-teal-100 bg-teal-50/70 p-4"><div className="text-xs font-black text-teal-800">پاسخ کوتاه</div><p className="mt-2 text-sm leading-7 text-teal-950/80">{current[2]}</p></div>
            <div className="mt-3 rounded-xl border border-sky-100 bg-sky-50/70 p-4"><div className="text-xs font-black text-sky-800">چرا مهم است؟</div><p className="mt-2 text-sm leading-7 text-sky-950/80">{current[3]}</p></div>
            {stage >= 1 && stage <= 3 ? <button onClick={() => setLens(true)} className="mt-4 w-full rounded-xl border border-teal-200 bg-white px-4 py-3 text-sm font-black text-teal-800">Primary Site را در همین صفحه باز کن</button> : null}
            <div className="mt-5 grid grid-cols-2 gap-3"><button onClick={() => setStage(Math.max(0,stage-1))} disabled={stage===0} className="rounded-xl border px-4 py-3 text-sm font-bold disabled:opacity-40"><ChevronRight className="inline h-4 w-4" /> قبلی</button><button onClick={() => setStage(Math.min(stages.length-1,stage+1))} disabled={stage===stages.length-1} className="rounded-xl bg-teal-700 px-4 py-3 text-sm font-black text-white disabled:opacity-40">بعدی <ChevronLeft className="inline h-4 w-4" /></button></div>
          </aside>
        </div>
      </>}
    </section>
    {lens ? <PrimarySiteLens close={() => setLens(false)} /> : null}
  </main>;
}
