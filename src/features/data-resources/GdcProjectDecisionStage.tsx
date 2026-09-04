import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Target,
} from "lucide-react";
import { useEffect, useState } from "react";

type ProjectId = "TCGA-KIRC" | "TCGA-KIRP" | "TCGA-KICH";
type ResearchGoal = "clear-cell" | "compare" | null;

const FINAL_SCREENSHOT = "/images/gdc/study-design-kidney/step-5.txt";

const PROJECTS: Array<{
  id: ProjectId;
  englishName: string;
  persianName: string;
  rowTop: number;
}> = [
  {
    id: "TCGA-KIRC",
    englishName: "Kidney Renal Clear Cell Carcinoma",
    persianName: "کارسینوم سلول روشن کلیه",
    rowTop: 37.2,
  },
  {
    id: "TCGA-KIRP",
    englishName: "Kidney Renal Papillary Cell Carcinoma",
    persianName: "کارسینوم پاپیلاری کلیه",
    rowTop: 48.7,
  },
  {
    id: "TCGA-KICH",
    englishName: "Kidney Chromophobe",
    persianName: "کارسینوم کروموفوب کلیه",
    rowTop: 60.2,
  },
];

const WHY_OPTIONS = [
  "چون Disease Type در این صفحه می‌تواند چند Project با زیرنوع دقیق متفاوت را در یک رده مشترک نگه دارد.",
  "چون فیلتر Disease Type در مرحله قبل اعمال نشده بود.",
  "چون Program = TCGA باعث می‌شود همه سرطان‌های کلیه بدون توجه به نوع بیماری باقی بمانند.",
] as const;

function useFinalScreenshot() {
  const [src, setSrc] = useState("");

  useEffect(() => {
    let active = true;
    fetch(FINAL_SCREENSHOT)
      .then((response) => {
        if (!response.ok) throw new Error(FINAL_SCREENSHOT);
        return response.text();
      })
      .then((body) => {
        if (active) setSrc(`data:image/webp;base64,${body.trim()}`);
      })
      .catch(() => active && setSrc(""));
    return () => {
      active = false;
    };
  }, []);

  return src;
}

export function GdcProjectDecisionStage({
  title,
  stageNumber,
  stageTotal,
  onPrevious,
  onNext,
}: {
  title: string;
  stageNumber: number;
  stageTotal: number;
  onPrevious: () => void;
  onNext: () => void;
}) {
  const image = useFinalScreenshot();
  const [selectedProject, setSelectedProject] = useState<ProjectId | null>(null);
  const [whyAnswer, setWhyAnswer] = useState<string | null>(null);
  const [goal, setGoal] = useState<ResearchGoal>(null);
  const [decision, setDecision] = useState<string | null>(null);

  const whyCorrect = whyAnswer === WHY_OPTIONS[0];
  const decisionCorrect =
    (goal === "clear-cell" && decision === "TCGA-KIRC") ||
    (goal === "compare" && decision === "all-three");

  const activeProject = PROJECTS.find((project) => project.id === selectedProject);

  function resetDecision(nextGoal: ResearchGoal) {
    setGoal(nextGoal);
    setDecision(null);
  }

  return (
    <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.7fr)_500px]">
      <div className="xl:sticky xl:top-5 xl:self-start">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3" dir="rtl">
            <div>
              <div className="text-xs font-black text-teal-700">از فضای جست‌وجو به تصمیم پژوهشی</div>
              <div className="mt-1 text-sm font-bold text-slate-700">فیلترها کارشان را انجام داده‌اند: حالا فقط ۳ Project بسیار مرتبط باقی مانده است.</div>
            </div>
            <div className="flex items-center gap-2 text-xs font-black" dir="ltr">
              <span className="rounded-full bg-slate-100 px-3 py-1.5 text-slate-500">93</span>
              <span className="text-slate-300">→</span>
              <span className="rounded-full bg-slate-100 px-3 py-1.5 text-slate-500">16</span>
              <span className="text-slate-300">→</span>
              <span className="rounded-full bg-slate-100 px-3 py-1.5 text-slate-500">4</span>
              <span className="text-slate-300">→</span>
              <span className="rounded-full bg-teal-700 px-3 py-1.5 text-white">3 Projects</span>
            </div>
          </div>

          <div className="relative overflow-hidden bg-slate-100" dir="ltr">
            {image ? (
              <img src={image} alt="سه Project باقی‌مانده سرطان کلیه در GDC" className="block w-full" />
            ) : (
              <div className="flex aspect-[1852/830] items-center justify-center text-sm font-bold text-slate-400">در حال بارگذاری نتیجه نهایی فیلترها…</div>
            )}

            {image && activeProject ? (
              <div
                className="pointer-events-none absolute left-[25.7%] h-[11.2%] w-[73%] rounded-md border-[3px] border-teal-400 bg-teal-300/15 shadow-[0_0_0_999px_rgba(15,23,42,.08)] transition-all"
                style={{ top: `${activeProject.rowTop}%` }}
              >
                <span className="absolute left-2 top-2 rounded bg-slate-950/90 px-2 py-1 text-[10px] font-black text-white">{activeProject.id}</span>
              </div>
            ) : null}
          </div>

          <div className="border-t bg-slate-50 p-4" dir="rtl">
            <div className="text-xs font-black text-slate-700">سه Project را با هم مقایسه کن</div>
            <p className="mt-1 text-xs leading-6 text-slate-500">روی هر کارت کلیک کن تا ردیف همان Project در جدول واقعی GDC مشخص شود.</p>
            <div className="mt-3 grid gap-2 md:grid-cols-3" dir="ltr">
              {PROJECTS.map((project) => (
                <button
                  key={project.id}
                  type="button"
                  onClick={() => setSelectedProject(project.id)}
                  className={`rounded-xl border p-3 text-left transition ${selectedProject === project.id ? "border-teal-400 bg-teal-50 shadow-sm" : "border-slate-200 bg-white hover:border-slate-300"}`}
                >
                  <b className="text-sm text-slate-950">{project.id}</b>
                  <div className="mt-1 text-[11px] leading-5 text-slate-500">{project.englishName}</div>
                  <div className="mt-2 text-xs font-bold text-slate-700" dir="rtl">{project.persianName}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <aside className="rounded-2xl border bg-white p-5 shadow-sm sm:p-6" dir="rtl">
        <div className="text-xs font-black text-teal-700">مرحله {stageNumber} از {stageTotal}</div>
        <h2 className="mt-2 text-2xl font-black text-slate-950">{title}</h2>

        <div className="mt-5 rounded-2xl border border-teal-100 bg-teal-50/60 p-4">
          <div className="flex items-center gap-2 text-xs font-black text-teal-800"><CheckCircle2 className="h-4 w-4" /> نتیجه مرحله قبل</div>
          <p className="mt-2 text-sm leading-7 text-teal-950/80">
            ما از ۹۳ Project به ۳ Project رسیدیم. این به معنی ناقص‌بودن فیلترها نیست؛ برعکس، فضای جست‌وجوی بسیار بزرگی به یک مجموعه کوچک و معنادار تبدیل شده است.
          </p>
        </div>

        <div className="mt-4 rounded-2xl border border-slate-200 p-4">
          <div className="text-sm font-black text-slate-900">این سه Project چه تفاوتی دارند؟</div>
          <p className="mt-2 text-xs leading-6 text-slate-600">
            هر سه مربوط به کلیه و Program = TCGA هستند، اما مطالعه‌های متفاوتی برای زیرنوع‌های متفاوت سرطان کلیه‌اند. برای دیدن تفاوت، کارت‌های کنار تصویر را انتخاب کن.
          </p>
          {activeProject ? (
            <div className="mt-3 rounded-xl bg-slate-50 p-3">
              <b dir="ltr" className="text-sm text-slate-950">{activeProject.id}</b>
              <p className="mt-1 text-xs leading-6 text-slate-600">{activeProject.persianName}؛ یک Project مشخص‌تر از دسته کلی‌ای است که با Disease Type برای محدودکردن نتایج استفاده کردیم.</p>
            </div>
          ) : null}
        </div>

        <div className="mt-4 rounded-2xl border border-violet-100 bg-violet-50/50 p-4">
          <div className="flex items-center gap-2 text-sm font-black text-violet-950"><CircleHelp className="h-4 w-4" /> اگر Disease Type را فیلتر کردیم، چرا هنوز سه سرطان متفاوت باقی مانده‌اند؟</div>
          <div className="mt-3 space-y-2">
            {WHY_OPTIONS.map((option) => {
              const chosen = whyAnswer === option;
              const correct = option === WHY_OPTIONS[0];
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => setWhyAnswer(option)}
                  className={`w-full rounded-xl border px-3 py-3 text-right text-xs font-bold leading-6 transition ${chosen && correct ? "border-emerald-300 bg-emerald-50 text-emerald-900" : chosen ? "border-rose-300 bg-rose-50 text-rose-900" : "border-violet-100 bg-white text-slate-700 hover:border-violet-200"}`}
                >
                  {option}
                </button>
              );
            })}
          </div>

          {whyAnswer && !whyCorrect ? (
            <p className="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-xs leading-6 text-rose-900">به نقش Disease Type فکر کن: این فیلتر محدوده بیماری را کوچک می‌کند، اما الزاماً نام دقیق هر Project یا زیرنوع نهایی سرطان را از هم جدا نمی‌کند.</p>
          ) : null}
        </div>

        {whyCorrect ? (
          <div className="mt-4 space-y-3">
            <div className="rounded-2xl border border-sky-100 bg-sky-50/70 p-4">
              <div className="text-xs font-black text-sky-900">این «شکست فیلتر» نیست؛ سطح تفکیک فیلتر است</div>
              <p className="mt-2 text-xs leading-6 text-sky-950/80">
                سرطان می‌تواند هم‌زمان بر اساس محل، رده پاتولوژیک، زیرنوع دقیق و ویژگی‌های مولکولی توصیف شود. Facetهای صفحه Projects برای محدودکردن فضای جست‌وجو طراحی شده‌اند و همیشه قرار نیست همه این سطوح را تا دقیق‌ترین زیرنوع از هم جدا کنند.
              </p>
              <p className="mt-2 text-xs leading-6 text-sky-950/80">
                بنابراین رسیدن از ۹۳ Project به ۳ Project بسیار مرتبط، نتیجه مطلوبی است. از اینجا به بعد جزئیات دقیق سؤال پژوهشی تعیین می‌کند یک Project، چند Project یا هر سه را نگه داریم.
              </p>
            </div>

            <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
              <div className="flex items-center gap-2 text-xs font-black text-amber-900"><Target className="h-4 w-4" /> حالا سؤال پژوهشی را دقیق‌تر کن</div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => resetDecision("clear-cell")}
                  className={`rounded-xl border px-3 py-3 text-xs font-black ${goal === "clear-cell" ? "border-amber-400 bg-white text-amber-950" : "border-amber-200 bg-amber-50 text-amber-900"}`}
                >
                  فقط Clear Cell را بررسی می‌کنم
                </button>
                <button
                  type="button"
                  onClick={() => resetDecision("compare")}
                  className={`rounded-xl border px-3 py-3 text-xs font-black ${goal === "compare" ? "border-amber-400 bg-white text-amber-950" : "border-amber-200 bg-amber-50 text-amber-900"}`}
                >
                  سه زیرنوع را با هم مقایسه می‌کنم
                </button>
              </div>

              {goal === "clear-cell" ? (
                <div className="mt-3">
                  <div className="text-xs font-black text-amber-950">برای مطالعه بیان ژن در Clear Cell Renal Cell Carcinoma کدام Project مناسب است؟</div>
                  <div className="mt-2 grid grid-cols-3 gap-2" dir="ltr">
                    {PROJECTS.map((project) => (
                      <button
                        key={project.id}
                        type="button"
                        onClick={() => setDecision(project.id)}
                        className={`rounded-xl border px-2 py-2 text-[11px] font-black ${decision === project.id && project.id === "TCGA-KIRC" ? "border-emerald-300 bg-emerald-50 text-emerald-900" : decision === project.id ? "border-rose-300 bg-rose-50 text-rose-900" : "border-amber-200 bg-white text-slate-700"}`}
                      >
                        {project.id}
                      </button>
                    ))}
                  </div>
                  {decision && !decisionCorrect ? <p className="mt-2 text-xs leading-6 text-rose-800">نام کامل Projectها را دوباره مقایسه کن؛ Clear Cell مستقیماً در نام KIRC آمده است.</p> : null}
                </div>
              ) : null}

              {goal === "compare" ? (
                <div className="mt-3">
                  <div className="text-xs font-black text-amber-950">اگر هدف مقایسه بیان ژن بین Clear Cell، Papillary و Chromophobe باشد چه می‌کنی؟</div>
                  <div className="mt-2 grid gap-2">
                    <button type="button" onClick={() => setDecision("all-three")} className={`rounded-xl border px-3 py-2 text-xs font-bold ${decision === "all-three" ? "border-emerald-300 bg-emerald-50 text-emerald-900" : "border-amber-200 bg-white text-slate-700"}`}>هر سه Project را برای طراحی مقایسه‌ای نگه می‌دارم</button>
                    <button type="button" onClick={() => setDecision("only-largest")} className={`rounded-xl border px-3 py-2 text-xs font-bold ${decision === "only-largest" ? "border-rose-300 bg-rose-50 text-rose-900" : "border-amber-200 bg-white text-slate-700"}`}>فقط Project با Case بیشتر را نگه می‌دارم</button>
                  </div>
                  {decision === "only-largest" ? <p className="mt-2 text-xs leading-6 text-rose-800">تعداد Case به‌تنهایی تعیین‌کننده نیست. وقتی سؤال مقایسه‌ای است، هر سه زیرنوع می‌توانند بخشی از طراحی مطالعه باشند؛ بعداً باید سازگاری دقیق داده و Caseها را بررسی کنیم.</p> : null}
                </div>
              ) : null}
            </div>
          </div>
        ) : null}

        {decisionCorrect ? (
          <div className="mt-4 rounded-2xl border border-teal-200 bg-teal-50 p-4">
            <div className="flex items-center gap-2 text-sm font-black text-teal-900"><CheckCircle2 className="h-5 w-5" /> تصمیم پژوهشی شکل گرفت</div>
            <p className="mt-2 text-xs leading-6 text-teal-900/80">
              فیلترکردن فضای جست‌وجو را کوچک می‌کند؛ سؤال پژوهشی دقیق است که انتخاب نهایی را تعیین می‌کند. گاهی یک Project مناسب است و گاهی برای یک طراحی مقایسه‌ای باید چند Project را نگه داریم.
            </p>
          </div>
        ) : null}

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button onClick={onPrevious} className="rounded-xl border px-4 py-3 text-sm font-bold"><ChevronRight className="inline h-4 w-4" /> قبلی</button>
          <button
            onClick={onNext}
            disabled={!decisionCorrect}
            className="rounded-xl bg-teal-700 px-4 py-3 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            تصمیم بعدی <ChevronLeft className="inline h-4 w-4" />
          </button>
        </div>
      </aside>
    </div>
  );
}
