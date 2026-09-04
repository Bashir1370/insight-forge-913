import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Info,
} from "lucide-react";

const FINAL_PROJECT_STAGE_TITLE = "ارزیابی پروژه یا پروژه‌های نهایی";
const SHARED_DISEASE_TYPE = "Adenomas and Adenocarcinomas";

const PROJECTS = [
  {
    id: "TCGA-KIRC",
    code: "KIRC",
    englishName: "Kidney Renal Clear Cell Carcinoma",
    persianName: "کارسینوم سلول روشن کلیه",
    explanation:
      "مطالعه TCGA مربوط به Clear Cell Renal Cell Carcinoma است؛ یعنی زیرنوع سلول روشن سرطان سلول کلیوی.",
  },
  {
    id: "TCGA-KIRP",
    code: "KIRP",
    englishName: "Kidney Renal Papillary Cell Carcinoma",
    persianName: "کارسینوم پاپیلاری کلیه",
    explanation:
      "مطالعه TCGA مربوط به Papillary Renal Cell Carcinoma است؛ یعنی زیرنوع پاپیلاری سرطان سلول کلیوی.",
  },
  {
    id: "TCGA-KICH",
    code: "KICH",
    englishName: "Kidney Chromophobe",
    persianName: "کارسینوم کروموفوب کلیه",
    explanation:
      "مطالعه TCGA مربوط به Chromophobe Renal Cell Carcinoma است؛ یعنی زیرنوع کروموفوب سرطان سلول کلیوی.",
  },
] as const;

const ABBREVIATIONS = [
  ["GDC", "Genomic Data Commons", "سامانه و زیرساختی که این داده‌ها و پروژه‌ها را در آن جست‌وجو می‌کنیم."],
  ["TCGA", "The Cancer Genome Atlas", "نام برنامه پژوهشی بزرگی است که این سه پروژه زیرمجموعه آن هستند."],
  ["KIRC", "Kidney Renal Clear Cell Carcinoma", "کد پروژه سرطان سلول روشن کلیه."],
  ["KIRP", "Kidney Renal Papillary Cell Carcinoma", "کد پروژه سرطان پاپیلاری کلیه."],
  ["KICH", "Kidney Chromophobe", "کد پروژه سرطان کروموفوب کلیه."],
] as const;

export function GdcProjectDecisionStage(props: {
  title: string;
  stageNumber: number;
  stageTotal: number;
  onPrevious: () => void;
  onNext: () => void;
}) {
  const { stageNumber, stageTotal, onPrevious, onNext } = props;

  return (
    <div className="mt-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7" dir="rtl">
      <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="text-xs font-black text-teal-700">مرحله {stageNumber} از {stageTotal}</div>
          <h2 className="mt-2 text-2xl font-black text-slate-950 sm:text-3xl">{FINAL_PROJECT_STAGE_TITLE}</h2>
          <p className="mt-3 max-w-4xl text-sm leading-8 text-slate-600">
            با استفاده از فیلترها، فضای جست‌وجوی GDC را از ۹۳ پروژه به ۳ پروژه مرتبط با سرطان کلیه رسانده‌ایم. حالا لازم نیست دوباره فیلترها را امتحان کنیم؛ باید تفاوت این سه پروژه را بفهمیم و ببینیم کدام‌یک با سؤال پژوهشی ما هماهنگ‌تر است.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2 text-xs font-black" dir="ltr">
          <span className="rounded-full bg-slate-100 px-3 py-2 text-slate-500">۹۳</span>
          <span className="text-slate-300">→</span>
          <span className="rounded-full bg-slate-100 px-3 py-2 text-slate-500">۱۶</span>
          <span className="text-slate-300">→</span>
          <span className="rounded-full bg-slate-100 px-3 py-2 text-slate-500">۴</span>
          <span className="text-slate-300">→</span>
          <span className="rounded-full bg-teal-700 px-3 py-2 text-white" dir="rtl">۳ پروژه مرتبط</span>
        </div>
      </div>

      <section className="mt-6 rounded-2xl border border-violet-100 bg-violet-50/45 p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-violet-700" />
          <div>
            <h3 className="text-lg font-black text-violet-950">این ۳ پروژه سرطان کلیه دقیقاً چه تفاوتی دارند؟</h3>
            <p className="mt-2 text-sm leading-8 text-violet-950/80">
              هر سه پروژه از نظر محل اولیه به کلیه مربوط‌اند و در نتیجه فعلی GDC، هر سه در Facet مربوط به Disease Type زیر مقدار
              <span dir="ltr" className="mx-1 font-black">{SHARED_DISEASE_TYPE}</span>
              دیده می‌شوند. این مقدار یک دسته‌بندی نسبتاً کلی در GDC است و به این معنی نیست که هر سه پروژه یک سرطان یکسان را مطالعه می‌کنند. تفاوت اصلی در زیرنوع دقیق سرطان سلول کلیوی است که هر پروژه روی آن تمرکز دارد.
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-3" dir="ltr">
          {PROJECTS.map((project) => (
            <div key={project.id} className="rounded-2xl border border-violet-100 bg-white p-5 text-left shadow-sm">
              <div className="text-base font-black text-slate-950">{project.id}</div>
              <div className="mt-1 text-sm font-bold leading-6 text-slate-600">{project.englishName}</div>
              <div className="mt-4 rounded-xl bg-slate-50 p-4 text-right" dir="rtl">
                <div className="text-sm font-black text-slate-950">{project.persianName}</div>
                <p className="mt-2 text-xs leading-6 text-slate-600">{project.explanation}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-xl border border-violet-100 bg-white p-4">
          <p className="text-sm leading-8 text-slate-700">
            پس ذهن پژوهشگر باید این تفکیک را نگه دارد: <b>Primary Site</b> می‌گوید محل اولیه «کلیه» است؛ <b>Disease Type</b> در این نتیجه یک رده مشترک و کلی‌تر است؛ اما شناسه و نام پروژه مشخص می‌کند مطالعه دقیقاً روی کدام زیرنوع سرطان کلیه انجام شده است.
          </p>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-sky-100 bg-sky-50/55 p-5 sm:p-6">
        <h3 className="text-lg font-black text-sky-950">اختصاراتی که GDC در این پروژه‌ها استفاده می‌کند</h3>
        <p className="mt-2 text-sm leading-8 text-sky-950/80">
          در شناسه‌هایی مثل <span dir="ltr" className="font-black">TCGA-KIRC</span>، بخش اول برنامه پژوهشی و بخش دوم کد مطالعه یا سرطان مشخص را نشان می‌دهد. بنابراین این کدها فقط اسم کوتاه نیستند؛ کمک می‌کنند سریع بفهمیم هر پروژه متعلق به کدام برنامه و کدام مطالعه است.
        </p>

        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5" dir="ltr">
          {ABBREVIATIONS.map(([abbr, full, meaning]) => (
            <div key={abbr} className="rounded-xl border border-sky-100 bg-white p-4 text-left">
              <div className="text-base font-black text-sky-950">{abbr}</div>
              <div className="mt-1 text-xs font-bold leading-5 text-slate-700">{full}</div>
              <p className="mt-3 text-xs leading-6 text-slate-500" dir="rtl">{meaning}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-xl bg-white p-4 text-center text-sm font-black text-slate-800" dir="ltr">
          TCGA-KIRC = TCGA + KIRC &nbsp;&nbsp; | &nbsp;&nbsp; TCGA-KIRP = TCGA + KIRP &nbsp;&nbsp; | &nbsp;&nbsp; TCGA-KICH = TCGA + KICH
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-teal-100 bg-teal-50/65 p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-teal-700" />
          <div>
            <h3 className="text-lg font-black text-teal-950">از ۹۳ پروژه به ۳ پروژه مرتبط رسیدیم؛ انتخاب نهایی به سؤال پژوهش بستگی دارد</h3>
            <p className="mt-2 text-sm leading-8 text-teal-950/80">
              فیلتر کردن قرار نبود حتماً ما را به یک پروژه برساند؛ کار آن این بود که مجموعه بزرگ اولیه را به چند گزینه مرتبط و قابل ارزیابی کاهش دهد. اکنون تصمیم اینکه فقط یک پروژه یا چند پروژه را وارد مطالعه کنیم، باید بر اساس <b>سؤال پژوهشی، اهداف مطالعه و فرضیات پژوهش</b> گرفته شود.
            </p>
            <div className="mt-4 grid gap-2 md:grid-cols-3">
              <div className="rounded-xl bg-white p-4 text-sm leading-7 text-slate-700">
                اگر سؤال فقط درباره <b>Clear Cell</b> باشد، پروژه <span dir="ltr" className="font-black">TCGA-KIRC</span> هدف مستقیم‌تری است.
              </div>
              <div className="rounded-xl bg-white p-4 text-sm leading-7 text-slate-700">
                اگر سؤال فقط درباره <b>Papillary</b> یا <b>Chromophobe</b> باشد، پروژه متناظر همان زیرنوع انتخاب می‌شود.
              </div>
              <div className="rounded-xl bg-white p-4 text-sm leading-7 text-slate-700">
                اگر هدف مقایسه زیرنوع‌های سرطان کلیه باشد، ممکن است دو یا هر سه پروژه به‌طور هم‌زمان وارد طراحی مطالعه شوند.
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <button onClick={onPrevious} className="rounded-xl border px-4 py-3 text-sm font-bold">
          <ChevronRight className="inline h-4 w-4" /> قبلی
        </button>
        <button onClick={onNext} className="rounded-xl bg-teal-700 px-4 py-3 text-sm font-black text-white">
          تصمیم بعدی <ChevronLeft className="inline h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
