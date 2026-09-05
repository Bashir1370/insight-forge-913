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
import { useEffect, useMemo, useState } from "react";

type Props = {
  imageUrl?: string | null | undefined;
  managedHotspots?: unknown[] | undefined;
  pageTitle?: string | null | undefined;
  pageDescription?: string | null | undefined;
  onOpenLegacyTour?: (() => void) | undefined;
};

type FacetId = "primarySite" | "program" | "diseaseType" | "dataCategory" | "experimentalStrategy";
type LensId = FacetId | null;

const DEFAULT_IMAGE = "/images/gdc/gdc-home-clean.webp";
const PROGRAM_IMAGE = "/images/gdc/gdc-program.webp";
const PRIMARY_SITE_IMAGE = "/images/gdc/gdc-primary-site.webp";
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
  ["Projects را بخوان", "صفحه Projects چگونه اطلاعات را به ما نشان می‌دهد؟", "فیلترهای سمت چپ سؤال پژوهشی را محدود می‌کنند و جدول سمت راست Projectهای سازگار با معیارهای فعلی را نشان می‌دهد.", "اول نقشه صفحه را می‌خوانیم؛ بعد هر مفهوم را فقط زمانی که به آن نیاز داریم باز می‌کنیم."],
  ["پروژه مرتبط را محدود کن", "چطور ده‌ها پروژه را به پروژه‌های مرتبط با سرطان و نوع داده خودم محدود کنم؟", "Facetها را بر اساس سؤال پژوهشی یکی‌یکی اعمال می‌کنیم.", "به‌جای مرور دستی همه پروژه‌ها، ویژگی‌های سؤال پژوهشی را به فیلترهای GDC تبدیل می‌کنیم."],
  ["نوع داده را بررسی کن", "از کجا بفهمم Project انتخاب‌شده واقعاً داده مناسب تحلیل من را دارد؟", "Experimental Strategy، Data Category و سپس Project Summary را بررسی می‌کنیم.", "نام پروژه کافی نیست؛ داده موجود باید با طراحی تحلیل شما سازگار باشد."],
  ["تصمیم بعدی", "وقتی Project و نوع داده مناسب را پیدا کردم، قدم بعدی چیست؟", "برای انتخاب دقیق Caseها به Cohort Builder و برای رسیدن به فایل‌ها به Repository می‌رویم.", "اینجا جست‌وجوی پروژه به مسیر عملی پژوهش متصل می‌شود."],
] as const;

const facets: Array<{ id: FacetId; title: string; short: string }> = [
  { id: "primarySite", title: "Primary Site", short: "تومور از کدام ناحیه بدن منشأ گرفته؟" },
  { id: "program", title: "Program", short: "داده‌ها متعلق به کدام برنامه پژوهشی بزرگ هستند؟" },
  { id: "diseaseType", title: "Disease Type", short: "بیماری از نظر نوع یا طبقه‌بندی چگونه تعریف شده؟" },
  { id: "dataCategory", title: "Data Category", short: "چه دسته‌ای از داده در Project وجود دارد؟" },
  { id: "experimentalStrategy", title: "Experimental Strategy", short: "داده با چه روش آزمایشی یا توالی‌یابی تولید شده؟" },
];

const facetBoxes: Record<FacetId, string> = {
  primarySite: "top-[48%] h-[7%]",
  program: "top-[55.5%] h-[7%]",
  diseaseType: "top-[63%] h-[7%]",
  dataCategory: "top-[70.5%] h-[7%]",
  experimentalStrategy: "top-[78%] h-[14%]",
};

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

function ProjectsView({ stage, selectedFacet, selectFacet }: { stage: number; selectedFacet: FacetId; selectFacet: (id: FacetId) => void }) {
  const src = useProjectsImage();
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm" dir="ltr">
      {src ? <img src={src} alt="اسکرین‌شات واقعی صفحه Projects در GDC" className="block w-full" /> :
        <div className="flex aspect-[1905/847] items-center justify-center bg-slate-100 text-sm font-bold text-slate-400">در حال بارگذاری اسکرین‌شات Projects…</div>}
      {stage === 1 && src ? <>
        {facets.map((facet) => <button key={facet.id} type="button" aria-label={`نمایش ${facet.title}`} onClick={() => selectFacet(facet.id)} className={`absolute left-[1%] w-[20%] rounded-md border-[3px] transition ${facetBoxes[facet.id]} ${selectedFacet === facet.id ? "border-teal-400 bg-teal-300/15 shadow-[0_0_0_999px_rgba(15,23,42,.10)]" : "border-transparent bg-transparent hover:border-sky-300 hover:bg-sky-200/10"}`} />)}
        <div className="pointer-events-none absolute left-[22%] top-[39%] h-[56%] w-[77%] rounded-lg border-2 border-dashed border-slate-300/80" />
        <div className="pointer-events-none absolute left-[1.2%] top-[39%] rounded-full bg-teal-700 px-3 py-1.5 text-[10px] font-black text-white shadow">Filters · سؤال را محدود می‌کنیم</div>
        <div className="pointer-events-none absolute left-[23%] top-[39%] rounded-full bg-slate-900 px-3 py-1.5 text-[10px] font-black text-white shadow">Projects Table · نتیجه را می‌خوانیم</div>
      </> : null}
      {stage === 2 && src ? <div className="pointer-events-none absolute left-[.7%] top-[36%] h-[59%] w-[20%] rounded-lg border-[3px] border-teal-400 bg-teal-300/10 shadow-[0_0_0_999px_rgba(15,23,42,.10)]" /> : null}
      {stage === 3 && src ? <div className="pointer-events-none absolute left-[75%] top-[40%] h-[55%] w-[24%] rounded-lg border-[3px] border-sky-400 bg-sky-300/10 shadow-[0_0_0_999px_rgba(15,23,42,.08)]" /> : null}
    </div>
  );
}

function LensShell({ close, visual, children }: { close: () => void; visual: React.ReactNode; children: React.ReactNode }) {
  return <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm" dir="rtl">
    <button aria-label="بستن" onClick={close} className="absolute inset-0" />
    <section className="relative z-10 grid max-h-[92vh] w-full max-w-6xl overflow-hidden rounded-3xl bg-white shadow-2xl lg:grid-cols-[420px_minmax(0,1fr)]">
      <div className="overflow-y-auto border-b border-slate-200 bg-slate-50 p-5 lg:border-b-0 lg:border-l">{visual}</div>
      <div className="overflow-y-auto p-6 sm:p-8">{children}</div>
    </section>
  </div>;
}

function ImageVisual({ src, alt }: { src: string; alt: string }) {
  return <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><img src={src} alt={alt} className="block h-auto w-full" /></div>;
}

function FacetMock({ title, rows, more }: { title: string; rows: Array<[string,string]>; more?: string }) {
  return <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm" dir="ltr">
    <div className="flex items-center justify-between bg-[#215d82] px-4 py-3 text-white"><b>{title}</b><Search className="h-4 w-4" /></div>
    <div className="grid grid-cols-[1fr_auto] border-b px-3 py-2 text-xs font-black text-[#215d82]"><span>Name</span><span>Projects</span></div>
    <div className="p-2">{rows.map(([name,count]) => <div key={name} className="grid grid-cols-[1fr_auto] items-center gap-3 px-2 py-1.5 text-xs"><span className="flex min-w-0 items-center gap-2"><span className="h-4 w-4 shrink-0 rounded border border-slate-400" /><span className="truncate">{name}</span></span><b>{count}</b></div>)}</div>
    {more ? <div className="border-t px-4 py-3 text-right text-sm font-black text-slate-700">{more}</div> : null}
  </div>;
}

const diseaseRows: Array<[string,string]> = [
  ["adenomas and adenocarcinomas", "51 (54.84%)"], ["epithelial neoplasms, nos", "30 (32.26%)"], ["squamous cell neoplasms", "29 (31.18%)"], ["cystic, mucinous and serous neoplasms", "22 (23.66%)"], ["ductal and lobular neoplasms", "21 (22.58%)"], ["neoplasms, nos", "21 (22.58%)"],
];
const categoryRows: Array<[string,string]> = [
  ["sequencing reads", "92 (98.92%)"], ["structural variation", "88 (94.62%)"], ["transcriptome profiling", "88 (94.62%)"], ["simple nucleotide variation", "86 (92.47%)"], ["clinical", "75 (80.65%)"], ["biospecimen", "71 (76.34%)"],
];
const strategyRows: Array<[string,string]> = [
  ["RNA-Seq", "88 (94.62%)"], ["WXS", "76 (81.72%)"], ["WGS", "61 (65.59%)"], ["miRNA-Seq", "50 (53.76%)"], ["Methylation Array", "46 (49.46%)"], ["Tissue Slide", "40 (43.01%)"], ["Genotyping Array", "37 (39.78%)"], ["Diagnostic Slide", "32 (34.41%)"], ["Reverse Phase Protein Array", "32 (34.41%)"], ["ATAC-Seq", "23 (24.73%)"], ["Targeted Sequencing", "13 (13.98%)"], ["Expression Array", "4 (4.30%)"], ["scRNA-Seq", "2 (2.15%)"],
];

function LensHeader({ close, eyebrow, title, subtitle }: { close: () => void; eyebrow: string; title: string; subtitle: string }) {
  return <div className="flex items-start justify-between gap-4"><div><div className="text-xs font-black text-teal-700">{eyebrow}</div><h2 className="mt-2 text-2xl font-black">{title}</h2><p className="mt-2 text-sm font-bold text-slate-500">{subtitle}</p></div><button onClick={close} className="rounded-xl border p-2 text-slate-500"><X className="h-5 w-5" /></button></div>;
}

function PrimarySiteLens({ close }: { close: () => void }) {
  return <LensShell close={close} visual={<ImageVisual src={PRIMARY_SITE_IMAGE} alt="Primary Site در صفحه Projects GDC" />}>
    <LensHeader close={close} eyebrow="راهنمای Primary Site" title="Primary Site یعنی چه؟" subtitle="محل آناتومیکی اولیه‌ای که تومور یا بیماری از آن منشأ گرفته است" />
    <div className="mt-6 rounded-2xl border bg-slate-50 p-5"><h3 className="text-sm font-black">این لیست همه سرطان‌ها نیست</h3><p className="mt-2 text-sm leading-7 text-slate-700">Primary Site «نوع سرطان» نیست؛ محل اولیه تومور را دسته‌بندی می‌کند. فهرست GDC قابل اسکرول است و گزینه‌های بیشتری پایین‌تر وجود دارند.</p></div>
    <div className="mt-4 rounded-2xl border border-teal-100 bg-teal-50/70 p-5"><h3 className="text-sm font-black text-teal-900">عدد و درصد روبه‌روی هر مورد چیست؟</h3><p className="mt-2 text-sm leading-7 text-teal-950/80">ستون Projects می‌گوید چند Project از مجموعه فعلی با آن Primary Site مرتبط‌اند و درصد داخل پرانتز سهم آن‌ها از کل Projectهای فعلی است.</p></div>
    <div className="mt-4 rounded-2xl border border-amber-100 bg-amber-50 p-5"><h3 className="text-sm font-black text-amber-900">Primary Site با Disease Type یکی نیست</h3><p className="mt-2 text-sm leading-7 text-amber-950/80">Primary Site محل آناتومیکی اولیه را می‌گوید؛ Disease Type نوع یا طبقه‌بندی بیماری را توصیف می‌کند.</p></div>
    <button onClick={close} className="mt-6 w-full rounded-xl bg-teal-700 px-5 py-3 text-sm font-black text-white">بستن و ادامه مسیر Projects</button>
  </LensShell>;
}

function ProgramLens({ close }: { close: () => void }) {
  return <LensShell close={close} visual={<ImageVisual src={PROGRAM_IMAGE} alt="Program بازشده در صفحه Projects GDC" />}>
    <LensHeader close={close} eyebrow="راهنمای Program" title="Program یعنی چه؟" subtitle="یک برنامه پژوهشی بزرگ که چند Project می‌تواند زیر آن قرار بگیرد" />
    <div className="mt-6 rounded-2xl border bg-slate-50 p-5"><h3 className="text-sm font-black">این فهرست نام سرطان‌ها نیست</h3><p className="mt-2 text-sm leading-7 text-slate-700">Programها مجموعه‌های پژوهشی بزرگ در GDC هستند. برای نمونه TCGA، TARGET و CPTAC هر کدام یک Program هستند و می‌توانند چندین Project و چند نوع بیماری را پوشش دهند.</p></div>
    <div className="mt-4 rounded-2xl border border-teal-100 bg-teal-50/70 p-5"><h3 className="text-sm font-black text-teal-900">عدد و درصد کنار Program چیست؟</h3><p className="mt-2 text-sm leading-7 text-teal-950/80">عدد، تعداد Projectهای مرتبط با آن Program در نتایج فعلی را نشان می‌دهد و درصد، سهم آن Projectها از کل Projectهای فعلی است.</p></div>
    <div className="mt-4 rounded-2xl border border-sky-100 bg-sky-50/70 p-5"><h3 className="text-sm font-black text-sky-900">+21 more یعنی چه؟</h3><p className="mt-2 text-sm leading-7 text-sky-950/80">یعنی Programهای بیشتری در فهرست وجود دارند و با باز کردن ادامه فهرست می‌توانید آن‌ها را ببینید.</p></div>
    <button onClick={close} className="mt-6 w-full rounded-xl bg-teal-700 px-5 py-3 text-sm font-black text-white">بستن و ادامه مسیر Projects</button>
  </LensShell>;
}

function DiseaseTypeLens({ close }: { close: () => void }) {
  return <LensShell close={close} visual={<FacetMock title="Disease Type" rows={diseaseRows} more="+ 42 more" />}>
    <LensHeader close={close} eyebrow="راهنمای Disease Type" title="Disease Type یعنی چه؟" subtitle="نوع یا طبقه‌بندی پاتولوژیک بیماری در Projectها" />
    <div className="mt-6 rounded-2xl border bg-slate-50 p-5"><h3 className="text-sm font-black">با Primary Site فرق دارد</h3><p className="mt-2 text-sm leading-7 text-slate-700">Primary Site محل آناتومیکی اولیه را مشخص می‌کند؛ Disease Type ماهیت یا طبقه‌بندی بیماری را نشان می‌دهد. بنابراین ممکن است یک Primary Site شامل چند Disease Type باشد.</p></div>
    <div className="mt-4 rounded-2xl border border-teal-100 bg-teal-50/70 p-5"><h3 className="text-sm font-black text-teal-900">عدد و درصد چه می‌گویند؟</h3><p className="mt-2 text-sm leading-7 text-teal-950/80">عدد، تعداد Projectهای مرتبط با آن Disease Type در مجموعه فعلی است و درصد سهم آن Projectها از کل نتایج فعلی را نشان می‌دهد.</p><div className="mt-3 rounded-xl border border-teal-200 bg-white p-4 text-sm leading-7"><span dir="ltr" className="font-black">adenomas and adenocarcinomas — 51 (54.84%)</span> یعنی 51 Project از 93 Project فعلی با این دسته بیماری مرتبط‌اند.</div></div>
    <div className="mt-4 rounded-2xl border border-sky-100 bg-sky-50/70 p-5"><h3 className="text-sm font-black text-sky-900">+42 more</h3><p className="mt-2 text-sm leading-7 text-sky-950/80">یعنی Disease Typeهای بیشتری در فهرست وجود دارند و موارد نمایش‌داده‌شده فقط ابتدای لیست هستند.</p></div>
    <button onClick={close} className="mt-6 w-full rounded-xl bg-teal-700 px-5 py-3 text-sm font-black text-white">بستن و ادامه مسیر Projects</button>
  </LensShell>;
}

function DataCategoryLens({ close }: { close: () => void }) {
  return <LensShell close={close} visual={<FacetMock title="Data Category" rows={categoryRows} more="+ 5 more" />}>
    <LensHeader close={close} eyebrow="راهنمای Data Category" title="Data Category یعنی چه؟" subtitle="دسته کلی داده‌ای که در Projectها وجود دارد" />
    <div className="mt-6 rounded-2xl border bg-slate-50 p-5"><h3 className="text-sm font-black">این فیلتر می‌گوید چه جنس داده‌ای دارید</h3><p className="mt-2 text-sm leading-7 text-slate-700">برای مثال Clinical داده‌های بالینی، Biospecimen اطلاعات نمونه، Transcriptome Profiling داده‌های مرتبط با RNA و بیان ژن و Simple Nucleotide Variation داده‌های واریانت‌های کوچک را پوشش می‌دهد.</p></div>
    <div className="mt-4 rounded-2xl border border-teal-100 bg-teal-50/70 p-5"><h3 className="text-sm font-black text-teal-900">عدد و درصد چه معنی دارد؟</h3><p className="mt-2 text-sm leading-7 text-teal-950/80">عدد، تعداد Projectهایی است که آن Data Category را دارند و درصد، سهم آن‌ها از کل Projectهای فعلی را نشان می‌دهد.</p><div className="mt-3 rounded-xl border border-teal-200 bg-white p-4 text-sm leading-7"><span dir="ltr" className="font-black">transcriptome profiling — 88 (94.62%)</span> یعنی 88 Project از 93 Project فعلی این دسته داده را دارند.</div></div>
    <div className="mt-4 rounded-2xl border border-sky-100 bg-sky-50/70 p-5"><h3 className="text-sm font-black text-sky-900">+5 more</h3><p className="mt-2 text-sm leading-7 text-sky-950/80">یعنی دسته‌های داده دیگری هم در ادامه فهرست وجود دارند.</p></div>
    <button onClick={close} className="mt-6 w-full rounded-xl bg-teal-700 px-5 py-3 text-sm font-black text-white">بستن و ادامه مسیر Projects</button>
  </LensShell>;
}

function ExperimentalStrategyLens({ close }: { close: () => void }) {
  return <LensShell close={close} visual={<FacetMock title="Experimental Strategy" rows={strategyRows} more="− show less" />}>
    <LensHeader close={close} eyebrow="راهنمای Experimental Strategy" title="Experimental Strategy یعنی چه؟" subtitle="روش آزمایشی یا فناوری‌ای که برای تولید داده استفاده شده است" />
    <div className="mt-6 rounded-2xl border bg-slate-50 p-5"><h3 className="text-sm font-black">این فیلتر را با Data Category اشتباه نگیرید</h3><p className="mt-2 text-sm leading-7 text-slate-700">Data Category می‌گوید «چه نوع داده‌ای» دارید؛ Experimental Strategy می‌گوید آن داده «با چه روش یا فناوری» تولید شده است، مثل RNA-Seq، WXS، WGS یا scRNA-Seq.</p></div>
    <div className="mt-4 rounded-2xl border border-teal-100 bg-teal-50/70 p-5"><h3 className="text-sm font-black text-teal-900">عدد و درصد کنار روش‌ها چیست؟</h3><p className="mt-2 text-sm leading-7 text-teal-950/80">عدد، تعداد Projectهایی است که آن Experimental Strategy را دارند و درصد، سهم آن‌ها از کل Projectهای فعلی است.</p><div className="mt-3 rounded-xl border border-teal-200 bg-white p-4 text-sm leading-7"><span dir="ltr" className="font-black">RNA-Seq — 88 (94.62%)</span> یعنی 88 Project از 93 Project فعلی داده‌ای با این روش دارند.</div><p className="mt-3 text-xs leading-6 text-teal-950/70">یک Project می‌تواند چند Experimental Strategy داشته باشد؛ بنابراین مجموع درصدهای ردیف‌ها الزاماً 100٪ نیست.</p></div>
    <button onClick={close} className="mt-6 w-full rounded-xl bg-teal-700 px-5 py-3 text-sm font-black text-white">بستن و ادامه مسیر Projects</button>
  </LensShell>;
}

function ProjectsStagePanel({ activeFacet, onSelectFacet, onOpenLens }: { activeFacet: (typeof facets)[number]; onSelectFacet: (id: FacetId) => void; onOpenLens: () => void }) {
  return <>
    <div className="mt-5 rounded-2xl bg-slate-50 p-4">
      <div className="text-xs font-black text-slate-500">اول نقشه صفحه را بخوانیم</div>
      <p className="mt-2 text-sm leading-7 text-slate-700">صفحه <b dir="ltr">Projects</b> دو بخش اصلی دارد: <b>فیلترها در سمت چپ</b> و <b>فهرست Projectها در سمت راست</b>.</p>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <div className="rounded-xl border border-teal-100 bg-teal-50/70 p-3"><div className="text-xs font-black text-teal-800">سمت چپ</div><p className="mt-1 text-xs leading-6 text-teal-950/80">سؤال پژوهشی را به معیارهای قابل فیلتر تبدیل می‌کنیم.</p></div>
        <div className="rounded-xl border border-slate-200 bg-white p-3"><div className="text-xs font-black text-slate-700">سمت راست</div><p className="mt-1 text-xs leading-6 text-slate-600">بعد از هر انتخاب می‌بینیم چه Projectهایی هنوز با معیارهای ما سازگارند.</p></div>
      </div>
    </div>

    <div className="mt-4 rounded-2xl border border-slate-200 p-3">
      <div className="px-1 text-xs font-black text-slate-600">هر فیلتر جواب چه سؤالی را می‌دهد؟</div>
      <p className="mt-2 px-1 text-xs leading-6 text-slate-500">قرار نیست اسم همه گزینه‌ها را حفظ کنیم. روی هر مورد کلیک کنید؛ همان ناحیه روی تصویر مشخص می‌شود و می‌توانید جزئیاتش را باز کنید.</p>
      <div className="mt-3 space-y-2">{facets.map((facet) => <button key={facet.id} type="button" onClick={() => onSelectFacet(facet.id)} className={`w-full rounded-xl border px-3 py-3 text-right transition ${activeFacet.id === facet.id ? "border-teal-300 bg-teal-50" : "border-slate-200 bg-white hover:border-slate-300"}`}><div className="flex items-center justify-between gap-3"><b dir="ltr" className="text-sm">{facet.title}</b><span className="text-xs leading-5 text-slate-500">{facet.short}</span></div></button>)}</div>
    </div>

    <button onClick={onOpenLens} className="mt-4 w-full rounded-xl border border-teal-200 bg-white px-4 py-3 text-sm font-black text-teal-800">{activeFacet.title} را باز کن</button>

    <div className="mt-4 rounded-2xl border border-sky-100 bg-sky-50/70 p-4">
      <div className="text-xs font-black text-sky-800">حالا جدول سمت راست را بخوانیم</div>
      <p className="mt-2 text-sm leading-7 text-sky-950/80">هر ردیف جدول یک <b dir="ltr">Project</b> است و ستون‌ها خلاصه‌ای از دامنه مطالعه و داده‌های آن را نشان می‌دهند.</p>
      <div className="mt-3 space-y-2 text-xs leading-6 text-sky-950/80">
        <div><b>این مطالعه چیست؟</b> <span dir="ltr">→ Project</span></div>
        <div><b>چه مواردی را پوشش می‌دهد؟</b> <span dir="ltr">→ Disease Type / Primary Site / Cases</span></div>
        <div><b>داده چگونه تولید شده؟</b> <span dir="ltr">→ Experimental Strategy</span></div>
      </div>
    </div>

    <div className="mt-4 rounded-2xl border border-amber-100 bg-amber-50 p-4">
      <div className="text-xs font-black text-amber-900">ادامه داستان ما</div>
      <p className="mt-2 text-sm leading-7 text-amber-950/80">سؤال ما درباره سرطان پستان بود. حالا به‌جای خواندن یکی‌یکی همه Projectها، در مرحله بعد یاد می‌گیریم ویژگی سؤال پژوهشی‌مان را به همین فیلترها تبدیل کنیم.</p>
    </div>
  </>;
}

export function GdcQuestionDrivenGuideV3({ imageUrl, pageTitle, pageDescription, onOpenLegacyTour }: Props) {
  const [questionId, setQuestionId] = useState("discover");
  const [stage, setStage] = useState(0);
  const [selectedFacet, setSelectedFacet] = useState<FacetId>("primarySite");
  const [lens, setLens] = useState<LensId>(null);
  const current = stages[stage] ?? stages[0];
  const activeFacet = useMemo(
    () => facets.find((f) => f.id === selectedFacet) ?? facets[0],
    [selectedFacet],
  );

  if (!current || !activeFacet) {
    return null;
  }

  return <main dir="rtl" className="min-h-screen bg-slate-50 text-slate-900">
    <section className="border-b bg-white"><div className="mx-auto max-w-[1500px] px-5 py-7 sm:px-8 lg:px-10">
      <a href="/resources" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500"><ArrowLeft className="h-4 w-4 rotate-180" />بازگشت به منابع داده</a>
      <div className="mt-5 flex flex-col justify-between gap-5 lg:flex-row lg:items-end"><div className="max-w-4xl"><span className="rounded-full bg-teal-100 px-3 py-1 text-xs font-black text-teal-800">آموزش سؤال‌محور GDC</span><h1 className="mt-3 text-3xl font-black sm:text-4xl">{pageTitle || "آموزش پرتال GDC"}</h1><p className="mt-3 text-sm leading-8 text-slate-600 sm:text-base">{pageDescription}</p></div><div className="flex gap-2">{onOpenLegacyTour ? <button onClick={onOpenLegacyTour} className="rounded-xl border bg-white px-4 py-3 text-sm font-bold">تور قبلی</button> : null}<a href="https://portal.gdc.cancer.gov/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-black text-white">GDC واقعی<ExternalLink className="h-4 w-4" /></a></div></div>
    </div></section>

    <section className="mx-auto max-w-[1500px] px-5 py-7 sm:px-8 lg:px-10">
      <div className="rounded-3xl border bg-white p-5 shadow-sm"><div className="flex items-center gap-2 text-sm font-black text-teal-700"><Target className="h-4 w-4" />برای چه کاری وارد GDC شده‌اید؟</div><div className="mt-4 grid gap-3 lg:grid-cols-5">{questions.map(([id,title,short,Icon]) => <button key={id} onClick={() => {setQuestionId(id); setStage(0);}} className={`rounded-2xl border p-4 text-right ${questionId === id ? "border-teal-300 bg-teal-50" : "border-slate-200"}`}><Icon className="h-5 w-5 text-teal-700" /><div className="mt-3 text-sm font-black leading-6">{title}</div><div className="mt-2 text-xs leading-5 text-slate-500">{short}</div></button>)}</div></div>

      {questionId !== "discover" ? <div className="mt-6 rounded-3xl border border-dashed bg-white p-10 text-center"><b>این مسیر در مرحله بعد ساخته می‌شود</b></div> : <>
        <div className="mt-6 flex gap-2 overflow-x-auto pb-2">{stages.map((s,i) => <button key={s[0]} onClick={() => setStage(i)} className={`shrink-0 rounded-full px-4 py-2 text-xs font-black ${stage === i ? "bg-teal-700 text-white" : "bg-white text-slate-500 ring-1 ring-slate-200"}`}>{i+1}. {s[0]}</button>)}</div>
        <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.75fr)_420px]">
          <div className="xl:sticky xl:top-5 xl:self-start">{stage === 0 ? <div className="relative overflow-hidden rounded-2xl border bg-white shadow-sm"><img src={imageUrl || DEFAULT_IMAGE} alt="صفحه اصلی GDC" className="w-full" /><div className="pointer-events-none absolute left-[12.6%] top-[8.8%] h-[7%] w-[9%] rounded-lg border-[3px] border-teal-400 bg-teal-300/20 shadow-[0_0_0_999px_rgba(15,23,42,.18)]" /></div> : <ProjectsView stage={stage} selectedFacet={selectedFacet} selectFacet={setSelectedFacet} />}</div>
          <aside className="rounded-2xl border bg-white p-5 shadow-sm sm:p-6"><div className="text-xs font-black text-teal-700">مرحله {stage+1} از {stages.length}</div><h2 className="mt-2 text-2xl font-black">{stage === 1 ? "صفحه Projects را مثل یک نقشه بخوانیم" : current[0]}</h2>
            {stage === 1 ? <ProjectsStagePanel activeFacet={activeFacet} onSelectFacet={setSelectedFacet} onOpenLens={() => setLens(activeFacet.id)} /> : <>
              <div className="mt-5 rounded-xl bg-slate-50 p-4"><div className="text-xs font-black text-slate-500">سؤال این مرحله</div><p className="mt-2 text-sm font-bold leading-7">{current[1]}</p></div>
              <div className="mt-3 rounded-xl border border-teal-100 bg-teal-50/70 p-4"><div className="text-xs font-black text-teal-800">پاسخ کوتاه</div><p className="mt-2 text-sm leading-7 text-teal-950/80">{current[2]}</p></div>
              <div className="mt-3 rounded-xl border border-sky-100 bg-sky-50/70 p-4"><div className="text-xs font-black text-sky-800">چرا مهم است؟</div><p className="mt-2 text-sm leading-7 text-sky-950/80">{current[3]}</p></div>
            </>}
            <div className="mt-5 grid grid-cols-2 gap-3"><button onClick={() => setStage(Math.max(0,stage-1))} disabled={stage===0} className="rounded-xl border px-4 py-3 text-sm font-bold disabled:opacity-40"><ChevronRight className="inline h-4 w-4" /> قبلی</button><button onClick={() => setStage(Math.min(stages.length-1,stage+1))} disabled={stage===stages.length-1} className="rounded-xl bg-teal-700 px-4 py-3 text-sm font-black text-white disabled:opacity-40">بعدی <ChevronLeft className="inline h-4 w-4" /></button></div>
          </aside>
        </div>
      </>}
    </section>
    {lens === "primarySite" ? <PrimarySiteLens close={() => setLens(null)} /> : null}
    {lens === "program" ? <ProgramLens close={() => setLens(null)} /> : null}
    {lens === "diseaseType" ? <DiseaseTypeLens close={() => setLens(null)} /> : null}
    {lens === "dataCategory" ? <DataCategoryLens close={() => setLens(null)} /> : null}
    {lens === "experimentalStrategy" ? <ExperimentalStrategyLens close={() => setLens(null)} /> : null}
  </main>;
}
