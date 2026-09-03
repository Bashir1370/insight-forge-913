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
import { useEffect, useMemo, useState, type ReactNode } from "react";

type Props = {
  imageUrl?: string | null;
  managedHotspots?: unknown[];
  pageTitle?: string | null;
  pageDescription?: string | null;
};

type FacetId = "primarySite" | "program" | "diseaseType" | "dataCategory" | "experimentalStrategy";
type LensId = FacetId | null;

type Stage = {
  title: string;
  question?: string;
  answer?: string;
  why?: string;
};

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

const stages: Stage[] = [
  { title: "اول محدوده داده‌ها را پیدا کنیم" },
  {
    title: "Projects را بخوان",
    question: "در صفحه Projects چه اطلاعاتی برای پیدا کردن داده مناسب مهم هستند؟",
    answer: "در این مرحله معماری صفحه Projects را می‌خوانیم: فیلترهای سمت چپ و جدول پروژه‌ها هر کدام بخشی از پاسخ پژوهشی شما را می‌سازند.",
    why: "به‌جای حفظ کردن همه گزینه‌ها، اول می‌فهمیم هر فیلتر چه مفهومی دارد و بعد هر جا لازم شد وارد جزئیات همان فیلتر می‌شویم.",
  },
  {
    title: "Program و Project",
    question: "Program و Project چه فرقی دارند؟",
    answer: "Program چارچوب پژوهشی بزرگ‌تر است و Project واحد مشخص‌تری برای سازمان‌دهی داده‌هاست.",
    why: "انتخاب عملی داده در ادامه در سطح Project و سپس Case و File دقیق‌تر می‌شود.",
  },
  {
    title: "پروژه مرتبط را محدود کن",
    question: "چطور ده‌ها پروژه را به پروژه‌های مرتبط با سرطان و نوع داده خودم محدود کنم؟",
    answer: "Facetها را بر اساس سؤال پژوهشی یکی‌یکی اعمال می‌کنیم.",
    why: "به‌جای مرور دستی همه پروژه‌ها، ویژگی‌های سؤال پژوهشی را به فیلترهای GDC تبدیل می‌کنیم.",
  },
  {
    title: "نوع داده را بررسی کن",
    question: "از کجا بفهمم Project انتخاب‌شده واقعاً داده مناسب تحلیل من را دارد؟",
    answer: "Experimental Strategy، Data Category و سپس Project Summary را بررسی می‌کنیم.",
    why: "نام پروژه کافی نیست؛ داده موجود باید با طراحی تحلیل شما سازگار باشد.",
  },
  {
    title: "تصمیم بعدی",
    question: "وقتی Project و نوع داده مناسب را پیدا کردم، قدم بعدی چیست؟",
    answer: "برای انتخاب د؂یق Caseها به Cohort Builder و برای رسیدن به فایل‌ها به Repository می‌رویم.",
    why: "اینجا جست‌وجوی پروژه به مسیر عملی پژوهش متصل می‌شود.",
  },
];

const facets: Array<{ id: FacetId; title: string; short: string }> = [
  { id: "primarySite", title: "Primary Site", short: "محل آناتومیکی اولیه تومور یا بیماری" },
  { id: "program", title: "Program", short: "برنامه پژوهشی بزرگ‌تری که Projectها زیر آن سازمان‌دهی می‌شوند" },
  { id: "diseaseType", title: "Disease Type", short: "نوع یا طبقه‌بندی بیماری در پروژه‌ها" },
  { id: "dataCategory", title: "Data Category", short: "دسته کلی داده؛ مثل داده بالینی، بیان ژن یا واریانت‌ها" },
  { id: "experimentalStrategy", title: "Experimental Strategy", short: "روش تولید داده؛ مثل RNA-Seq، WXS یا WGS" },
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
    Promise.all(
      PROJECT_PARTS.map(async (p) => {
        const r = await fetch(p);
        if (!r.ok) throw new Error(p);
        return r.text();
      }),
    )
      .then((parts) => {
        if (active) setSrc(`data:image/webp;base64,${parts.join("")}`);
      })
      .catch(() => active && setSrc(null));
    return () => {
      active = false;
    };
  }, []);
  return src;
}

function ProjectsView({
  stage,
  selectedFacet,
  selectFacet,
}: {
  stage: number;
  selectedFacet: FacetId;
  selectFacet: (id: FacetId) => void;
}) {
  const src = useProjectsImage();
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm" dir="ltr">
      {src ? (
        <img src={src} alt="اسکرین‌شات واقعی صفحه Projects در GDC" className="block w-full" />
      ) : (
        <div className="flex aspect-[1905/847] items-center justify-center bg-slate-100 text-sm font-bold text-slate-400">
          در حال بارگذاری اسکرین‌شات Projects…
        </div>
      )}

      {stage === 1 && src ? (
        <>
          {facets.map((facet) => (
            <button
              key={facet.id}
              type="button"
              aria-label={`نمایش ${facet.title}`}
              onClick={() => selectFacet(facet.id)}
              className={`absolute left-[1%] w-[20%] rounded-md border-[3px] transition ${facetBoxes[facet.id]} ${
                selectedFacet === facet.id
                  ? "border-teal-400 bg-teal-300/15 shadow-[0_0_0_999px_rgba(15,23,42,.10)]"
                  : "border-transparent bg-transparent hover:border-sky-300 hover:bg-sky-200/10"
              }`}
            />
          ))}
          <div className="pointer-events-none absolute left-[22%] top-[39%] h-[56%] w-[77%] rounded-lg border-2 border-dashed border-slate-300/80" />
        </>
      ) : null}

      {stage === 2 && src ? (
        <>
          <div className="pointer-events-none absolute left-[22%] top-[40%] h-[55%] w-[10%] rounded-lg border-[3px] border-teal-400 bg-teal-300/10 shadow-[0_0_0_999px_rgba(15,23,42,.10)]" />
          <div className="pointer-events-none absolute left-[62%] top-[40%] h-[55%] w-[9%] rounded-lg border-[3px] border-sky-400 bg-sky-300/10" />
        </>
      ) : null}
      {stage === 3 && src ? (
        <div className="pointer-events-none absolute left-[.7%] top-[36%] h-[59%] w-[20%] rounded-lg border-[3px] border-teal-400 bg-teal-300/10 shadow-[0_0_0_999px_rgba(15,23,42,.10)]" />
      ) : null}
      {stage === 4 && src ? (
        <div className="pointer-events-none absolute left-[75%] top-[40%] h-[55%] w-[24%] rounded-lg border-[3px] border-sky-400 bg-sky-300/10 shadow-[0_0_0_999px_rgba(15,23,42,.08)]" />
      ) : null}
    </div>
  );
}

function LensShell4{close, visual, children}: { close: () => void; visual: ReactNode; children: ReactNode }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm" dir="rtl">
      <button aria-label="بستن" onClick={close} className="absolute inset-0" />
      <section className="relative z-10 grid max-h-[92vh] w-full max-w-6xl overflow-hidden rounded-3xl bg-white shadow-2xl lg:grid-cols-[420px_minmax(0,1fr)]">
        <div className="overflow-y-auto border-b border-slate-200 bg-slate-50 p-5 lg:border-b-0 lg:border-l">{visual}</div>
        <div className="overflow-y-auto p-6 sm:p-8">{children}</div>
      </section>
    </div>
  );
}

function ImageVisual({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <img src={src} alt={alt} className="block h-auto w-full" />
    </div>
  );
}

function FacetMock({title, rows, more}: { title: string; rows: Array<[string, string]>; more?: string }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm" dir="ltr">
      <div className="flex items-center justify-between bg-[#215d82] px-4 py-3 text-white">
        <b>{title}</b>
        <Search className="h-4 w-4" />
      </div>
      <div className="grid grid-cols-[1fr_auto] border-b px-3 py-2 text-xs font-black text-[#215d82]">
        <span>Name</span>
        <span>Projects</span>
      </div>
      <div className="p-2">
        {rows.map(([name, count]) => (
          <div key={name} className="grid grid-cols-[1fr_auto] items-center gap-3 px-2 py-1.5 text-xs">
            <span className="flex min-w-0 items-center gap-2">
              <span className="h-4 w-4 shrink-0 rounded border border-slate-400" />
              <span className="truncate">{name}</span>
            </span>
            <b>{count}</b>
          </div>
        ))}
      </div>
      {more ? <div className="border-t px-4 py-3 text-right text-sm font-black text-slate-700">{more}</div> : null}
    </div>
  );
}

const diseaseRows: Array<[string, string]> = [
  ["adenomas and adenocarcinomas", "51 (54.84%)"],
  ["epithelial neoplasms, nos", "30 (32.26%)"],
  ["squamous cell neoplasms", "29 (31.18%)"],
  ["cystic, mucinous and serous neoplasms", "22 (23.66%)"],
  ["ductal and lobular neoplasms", "21 (22.58%)"],
  ["neoplasms, nos", "21 (22.58%)"],
];
const categoryRows: Array<[string, string]> = [
  ["sequencing reads", "92 (98.92%)"],
  ["structural variation", "88 (94.62%)"],
  ["transcriptome profiling", "88 (94.62%)"],
  ["simple nucleotide variation", "86 (92.47%)"],
  ["clinical", "75 (80.65%)"],
  ["biospecimen", "71 (76.34%)"],
];
const strategyRows: Array<[string, string]> = [
  ["RNA-Seq", "88 (94.62%)"],
  ["WXS", "76 (81.72%)"],
  ["WGS", "61 (65.59%)"],
  ["miRNA-Seq", "50 (53.76%)"],
  ["Methylation Array", "46 (49.46%)"],
  ["Tissue Slide", "40 (43.01%)"],
  ["Genotyping Array", "37 (39.78%)"],
  ["Diagnostic Slide", "32 (34.41%)"],
  ["Reverse Phase Protein Array", "32 (34.41%)"],
  ["ATAC-Seq", "23 (24.73%)"],
  ["Targeted Sequencing", "13 (13.98%)"],
  ["Expression Array", "4 (4.30%)"],
  ["scRNA-Seq", "2 (2.15%)"],
];

function LensHeader({close, eyebrow, title, subtitle}: { close: () => void; eyebrow: string; title: string; subtitle: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <div className="text-xs font-black text-teal-700">{eyebrow}</div>
        <h2 className="mt-2 text-2xl font-black">{title}</h2>
        <p className="mt-2 text-sm font-bold text-slate-500">{subtitle}</p>
      </div>
      <button onClick={close} className="rounded-xl border p-2 text-slate-500"><X className="h-5 w-5" /></button>
    </div>
  );
}

function PrimarySiteLens({ close }: { close: () => void }) {
  return <LensShell close={close} visual={<ImageVisual src={PRIMARY_SITE_IMAGE} alt="Primary Site در صفحه Projects GDC" />}>
    <LensHeader close={close} eyebrow="راهنمای Primary Site" title="Primary Site یعنی چه؟" subtitle="محل آناتومیکی اولیه تومور یا بیماری از آن منشء گرفته است" />
    <div className="mt-6 rounded-2xl border bg-slate-50 p-5"><h3 className="text-sm font-black">این لیست همه سرطان‌ها 