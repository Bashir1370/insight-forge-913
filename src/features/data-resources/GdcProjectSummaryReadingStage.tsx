import {
  AlertTriangle,
  BookOpenCheck,
  ChevronRight,
  Database,
  FileDown,
  Files,
  FlaskConical,
  Info,
  Microscope,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";

type SummaryHotspotId =
  | "save-cohort"
  | "biospecimen"
  | "clinical"
  | "manifest"
  | "project-counts"
  | "data-category"
  | "experimental-strategy";

type SummaryHotspot = {
  id: SummaryHotspotId;
  label: string;
  short: string;
  body: string;
  researchUse: string;
  caution?: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

const IMAGE_URL = "/images/gdc/gdc-project-summary-reading.png";

const HOTSPOTS: SummaryHotspot[] = [
  {
    id: "save-cohort",
    label: "Save New Cohort",
    short: "ذخیره گروهی از Caseها برای ادامه کار",
    body:
      "این گزینه انتخاب فعلی Caseها را به‌عنوان یک Cohort ذخیره می‌کند تا بتوانید همان گروه را بعداً در بخش‌های دیگر GDC دوباره استفاده کنید. این دکمه فایل داده را دانلود نمی‌کند؛ فقط گروه مطالعه را ذخیره می‌کند.",
    researchUse:
      "وقتی فیلترهای شما گروه مشخصی از بیماران یا نمونه‌ها را ساخته‌اند، Cohort ذخیره‌شده کمک می‌کند همان جمعیت پژوهشی را در مراحل بعدی حفظ کنید.",
    caution:
      "Cohort با Project یکی نیست. Project کل مطالعه است؛ Cohort زیرمجموعه‌ای از Caseهاست که با معیارهای شما انتخاب شده‌اند.",
    x: 5.8,
    y: 16.5,
    width: 10.4,
    height: 5.6,
  },
  {
    id: "biospecimen",
    label: "Biospecimen",
    short: "اطلاعات نمونه‌های زیستی پروژه",
    body:
      "از این بخش می‌توانید metadata مربوط به نمونه‌های زیستی را دریافت کنید؛ اطلاعاتی درباره Sample، Portion، Analyte، Aliquot و سایر سطوحی که منشأ و مسیر آماده‌سازی نمونه را توصیف می‌کنند.",
    researchUse:
      "اگر تحلیل شما به نوع نمونه، منشأ بافت یا تفاوت Tumor و Normal حساس است، قبل از دانلود داده باید Biospecimen metadata را بررسی کنید.",
    caution:
      "وجود فایل مولکولی به‌تنهایی کافی نیست؛ باید مطمئن شوید نمونه‌های متناظر با طراحی مطالعه شما سازگارند.",
    x: 16.4,
    y: 16.5,
    width: 11.5,
    height: 5.6,
  },
  {
    id: "clinical",
    label: "Clinical",
    short: "اطلاعات بالینی Caseهای پروژه",
    body:
      "این گزینه برای دریافت clinical metadata پروژه است؛ متغیرهایی مانند diagnosis، demographic information، stage و سایر اطلاعات بالینی بسته به پروژه می‌توانند در دسترس باشند.",
    researchUse:
      "برای مقایسه گروه‌های بالینی، تحلیل بقا یا ساخت متغیرهای توضیحی باید از همین ابتدا بررسی کنید که اطلاعات بالینی موردنیاز شما وجود دارد یا نه.",
    caution:
      "کامل‌بودن متغیرهای Clinical بین Projectها یکسان نیست. وجود بخش Clinical به معنی کامل بودن همه متغیرها برای همه Caseها نیست.",
    x: 27.8,
    y: 16.5,
    width: 9.1,
    height: 5.6,
  },
  {
    id: "manifest",
    label: "Manifest",
    short: "فهرست فایل‌ها برای دریافت دسته‌ای",
    body:
      "Manifest فهرستی از شناسه فایل‌های داده است که می‌تواند برای دانلود دسته‌ای، از جمله با GDC Data Transfer Tool، استفاده شود. Manifest خودِ داده نیست؛ فهرست فایل‌هایی است که قرار است دریافت شوند.",
    researchUse:
      "وقتی به فایل‌های درست رسیده‌اید و می‌خواهید دانلود را reproducible و قابل پیگیری نگه دارید، Manifest پل بین انتخاب فایل و دریافت واقعی داده است.",
    caution:
      "قبل از ساخت Manifest، Data Category، Experimental Strategy و سطح پردازش فایل‌ها را بررسی کنید تا فایل نامناسب وارد دانلود نشود.",
    x: 37.2,
    y: 16.5,
    width: 7.9,
    height: 5.6,
  },
  {
    id: "project-counts",
    label: "Cases · Files · Annotations",
    short: "اندازه پروژه را در یک نگاه بخوانید",
    body:
      "بالای Project Summary تعداد کل Cases، Files و Annotations نمایش داده می‌شود. Case واحد مورد مطالعه است، در حالی که هر Case می‌تواند چندین فایل داشته باشد؛ بنابراین تعداد Files معمولاً بسیار بیشتر از Cases است.",
    researchUse:
      "این اعداد برای برآورد اولیه اندازه مطالعه مفیدند، اما برای تعیین sample size قابل تحلیل باید بعداً محدودیت‌های نوع داده، نمونه و metadata را هم اعمال کنید.",
    caution:
      "تعداد زیاد Files به معنی تعداد زیاد بیمار نیست. همیشه Case count و File count را جداگانه تفسیر کنید.",
    x: 50.2,
    y: 16.2,
    width: 37.2,
    height: 6.0,
  },
  {
    id: "data-category",
    label: "Data Category",
    short: "چه جنس داده‌ای در Project وجود دارد؟",
    body:
      "جدول سمت چپ فایل‌ها را بر اساس دسته کلی داده گروه‌بندی می‌کند؛ مثل Clinical، Biospecimen، Transcriptome Profiling، DNA Methylation یا Simple Nucleotide Variation. ستون Cases نشان می‌دهد چند Case حداقل داده‌ای در آن دسته دارند و ستون Files تعداد فایل‌های همان دسته را نشان می‌دهد.",
    researchUse:
      "برای RNA-seq ابتدا باید ببینید دسته مرتبط، یعنی Transcriptome Profiling، در پروژه وجود دارد. برای تحلیل جهش به دسته‌های مربوط به variation نگاه می‌کنید.",
    caution:
      "Data Category روش آزمایشی نیست. این جدول می‌گوید چه نوع داده‌ای دارید، نه اینکه داده دقیقاً با چه فناوری تولید شده است.",
    x: 5.2,
    y: 23.7,
    width: 43.3,
    height: 70.4,
  },
  {
    id: "experimental-strategy",
    label: "Experimental Strategy",
    short: "داده با چه روش یا فناوری تولید شده؟",
    body:
      "جدول سمت راست روش آزمایشی تولید داده را نشان می‌دهد؛ مثل RNA-Seq، WXS، WGS، miRNA-Seq یا Methylation Array. Cases تعداد Caseهایی است که داده حاصل از آن strategy را دارند و Files تعداد فایل‌های مربوط به همان strategy است.",
    researchUse:
      "اگر سؤال شما تحلیل بیان ژن با RNA-seq است، فقط دیدن Transcriptome Profiling کافی نیست؛ باید در این جدول وجود RNA-Seq را هم تأیید کنید.",
    caution:
      "یک Case می‌تواند چند نوع داده و چند Experimental Strategy داشته باشد؛ بنابراین ردیف‌ها لزوماً مجموعه‌های جدا از هم نیستند.",
    x: 49.0,
    y: 23.7,
    width: 43.8,
    height: 70.4,
  },
];

const quickChecks = [
  {
    title: "اول نوع داده",
    body: "در Data Category بررسی کنید جنس داده موردنیاز شما وجود دارد.",
  },
  {
    title: "بعد روش تولید",
    body: "در Experimental Strategy مطمئن شوید فناوری مناسب تحلیل شما وجود دارد.",
  },
  {
    title: "بعد metadata",
    body: "Clinical و Biospecimen را برای سازگاری با طراحی مطالعه بررسی کنید.",
  },
];

function hotspotStyle(item: SummaryHotspot) {
  return {
    left: `${item.x}%`,
    top: `${item.y}%`,
    width: `${item.width}%`,
    height: `${item.height}%`,
  };
}

export function GdcProjectSummaryReadingStage({
  title,
  stageNumber,
  stageTotal,
  onPrevious,
}: {
  title: string;
  stageNumber: number;
  stageTotal: number;
  onPrevious: () => void;
}) {
  const [selectedId, setSelectedId] =
    useState<SummaryHotspotId>("data-category");
  const [showAnswer, setShowAnswer] = useState(false);

  const selected = useMemo(
    () => HOTSPOTS.find((item) => item.id === selectedId) ?? HOTSPOTS[0],
    [selectedId],
  );

  if (!selected) return null;

  return (
    <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.75fr)_420px]">
      <div className="xl:sticky xl:top-5 xl:self-start">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 bg-white px-4 py-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-xs font-black text-teal-700">
                  Project Summary · نقشه خواندن صفحه
                </div>
                <div className="mt-1 text-sm font-bold text-slate-600">
                  روی بخش‌های تصویر کلیک کنید تا نقش آن‌ها را ببینید.
                </div>
              </div>
              <div className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold text-slate-500">
                TCGA-KIRC نمونه آموزشی
              </div>
            </div>
          </div>

          <div className="relative" dir="ltr">
            <img
              src={IMAGE_URL}
              alt="Project Summary در GDC با دکمه‌های Cohort، Biospecimen، Clinical، Manifest و جدول‌های Data Category و Experimental Strategy"
              className="block w-full"
            />

            {HOTSPOTS.map((item) => {
              const active = item.id === selected.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-label={`توضیح ${item.label}`}
                  aria-pressed={active}
                  onClick={() => setSelectedId(item.id)}
                  style={hotspotStyle(item)}
                  className={`absolute rounded-lg border-[3px] transition ${
                    active
                      ? "z-20 border-teal-400 bg-teal-300/15 shadow-[0_0_0_999px_rgba(15,23,42,.10)]"
                      : "z-10 border-transparent bg-transparent hover:border-sky-300 hover:bg-sky-200/10"
                  }`}
                >
                  <span className="sr-only">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2" dir="rtl">
          {HOTSPOTS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedId(item.id)}
              className={`rounded-full px-3 py-2 text-[11px] font-black transition ${
                selected.id === item.id
                  ? "bg-teal-700 text-white"
                  : "bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-teal-200"
              }`}
            >
              <span dir="ltr">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      <aside className="rounded-2xl border bg-white p-5 shadow-sm sm:p-6">
        <div className="text-xs font-black text-teal-700">
          مرحله {stageNumber} از {stageTotal}
        </div>
        <h2 className="mt-2 text-2xl font-black">{title}</h2>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          حالا که Project مناسب را محدود کرده‌ایم، باید خلاصه آن را بخوانیم و
          بفهمیم چه داده، metadata و مسیر دانلودی واقعاً در اختیار ماست.
        </p>

        <div className="mt-5 rounded-2xl border border-teal-100 bg-teal-50/70 p-4">
          <div className="flex items-center gap-2 text-xs font-black text-teal-900">
            <BookOpenCheck className="h-4 w-4" />
            این مرحله قرار است چه چیزی را روشن کند؟
          </div>
          <p className="mt-2 text-sm leading-7 text-teal-950/80">
            هدف فقط شناخت دکمه‌ها نیست. باید بتوانید از Project Summary جواب
            بگیرید: «آیا این Project واقعاً داده مناسب سؤال پژوهشی من را دارد؟»
          </p>
        </div>

        <div className="mt-4 rounded-2xl border border-slate-200 p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div dir="ltr" className="text-sm font-black text-slate-950">
                {selected.label}
              </div>
              <div className="mt-1 text-xs font-bold leading-6 text-teal-700">
                {selected.short}
              </div>
            </div>
            <div className="shrink-0 rounded-xl bg-slate-100 p-2 text-slate-600">
              {selected.id === "save-cohort" ? (
                <Users className="h-5 w-5" />
              ) : selected.id === "biospecimen" ? (
                <Microscope className="h-5 w-5" />
              ) : selected.id === "clinical" ? (
                <Database className="h-5 w-5" />
              ) : selected.id === "manifest" ? (
                <FileDown className="h-5 w-5" />
              ) : selected.id === "project-counts" ? (
                <Files className="h-5 w-5" />
              ) : selected.id === "data-category" ? (
                <Database className="h-5 w-5" />
              ) : (
                <FlaskConical className="h-5 w-5" />
              )}
            </div>
          </div>

          <p className="mt-3 text-sm leading-7 text-slate-700">
            {selected.body}
          </p>

          <div className="mt-3 rounded-xl bg-sky-50 p-3">
            <div className="flex items-center gap-2 text-xs font-black text-sky-900">
              <Info className="h-4 w-4" />
              برای پژوهش من چه کاربردی دارد؟
            </div>
            <p className="mt-2 text-xs leading-6 text-sky-950/80">
              {selected.researchUse}
            </p>
          </div>

          {selected.caution ? (
            <div className="mt-3 rounded-xl border border-amber-100 bg-amber-50 p-3">
              <div className="flex items-center gap-2 text-xs font-black text-amber-900">
                <AlertTriangle className="h-4 w-4" />
                اشتباه رایج
              </div>
              <p className="mt-2 text-xs leading-6 text-amber-950/80">
                {selected.caution}
              </p>
            </div>
          ) : null}
        </div>

        <div className="mt-4 rounded-2xl border border-slate-200 p-4">
          <div className="text-xs font-black text-slate-700">
            برای ارزیابی سریع یک Project این ترتیب را بخوانید
          </div>
          <div className="mt-3 space-y-2">
            {quickChecks.map((item, index) => (
              <div
                key={item.title}
                className="grid grid-cols-[28px_minmax(0,1fr)] gap-3 rounded-xl bg-slate-50 p-3"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-teal-100 text-xs font-black text-teal-800">
                  {index + 1}
                </div>
                <div>
                  <div className="text-xs font-black text-slate-800">
                    {item.title}
                  </div>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    {item.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-violet-100 bg-violet-50/60 p-4">
          <div className="text-xs font-black text-violet-900">
            یک سؤال کوتاه برای خودآزمایی
          </div>
          <p className="mt-2 text-sm font-bold leading-7 text-violet-950">
            برای اینکه مطمئن شویم یک Project برای تحلیل RNA-seq مناسب است، فقط
            دیدن Transcriptome Profiling کافی است؟
          </p>

          {showAnswer ? (
            <div className="mt-3 rounded-xl bg-white p-3 text-xs leading-6 text-violet-950/80">
              خیر. وجود <b dir="ltr">Transcriptome Profiling</b> نوع کلی داده را
              نشان می‌دهد؛ باید در <b dir="ltr">Experimental Strategy</b> هم
              وجود <b dir="ltr">RNA-Seq</b> را تأیید کنید و سپس metadata
              بالینی/نمونه‌ای را با طراحی مطالعه تطبیق دهید.
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowAnswer(true)}
              className="mt-3 w-full rounded-xl border border-violet-200 bg-white px-4 py-2.5 text-xs font-black text-violet-800"
            >
              پاسخ را ببین
            </button>
          )}
        </div>

        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="text-xs font-black text-slate-700">
            نکته درباره اعداد تصویر
          </div>
          <p className="mt-2 text-xs leading-6 text-slate-500">
            تعداد Cases، Files و Annotations در GDC می‌تواند با releaseهای
            داده تغییر کند. در آموزش، مفهوم این اعداد مهم‌تر از حفظ مقدار دقیق
            آن‌هاست.
          </p>
        </div>

        <button
          type="button"
          onClick={onPrevious}
          className="mt-5 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700"
        >
          <ChevronRight className="inline h-4 w-4" /> بازگشت به مرحله قبل
        </button>
      </aside>
    </div>
  );
}
