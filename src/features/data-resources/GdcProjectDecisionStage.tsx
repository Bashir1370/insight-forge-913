import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Target,
} from "lucide-react";
import { useMemo, useState } from "react";

type ProjectId = "TCGA-KIRC" | "TCGA-KIRP" | "TCGA-KICH";
type ScenarioId = "clear-cell" | "papillary" | "chromophobe" | "compare" | null;

type ProjectInfo = {
  id: ProjectId;
  englishName: string;
  persianName: string;
  subtype: string;
  shortMeaning: string;
};

const PROJECTS: ProjectInfo[] = [
  {
    id: "TCGA-KIRC",
    englishName: "Kidney Renal Clear Cell Carcinoma",
    persianName: "کارسینوم سلول روشن کلیه",
    subtype: "Clear Cell",
    shortMeaning: "Project مربوط به زیرنوع Clear Cell سرطان کلیه",
  },
  {
    id: "TCGA-KIRP",
    englishName: "Kidney Renal Papillary Cell Carcinoma",
    persianName: "کارسینوم پاپیلاری کلیه",
    subtype: "Papillary",
    shortMeaning: "Project مربوط به زیرنوع Papillary سرطان کلیه",
  },
  {
    id: "TCGA-KICH",
    englishName: "Kidney Chromophobe",
    persianName: "کارسینوم کروموفوب کلیه",
    subtype: "Chromophobe",
    shortMeaning: "Project مربوط به زیرنوع Chromophobe سرطان کلیه",
  },
];

const WHY_OPTIONS = [
  "چون Disease Type در این مرحله یک رده نسبتاً کلی‌تر از بیماری را محدود کرده و چند Project با زیرنوع دقیق‌تر می‌توانند در همان رده باقی بمانند.",
  "چون فیلتر Disease Type درست اعمال نشده و باید دوباره به مرحله قبل برگردیم.",
  "چون Data Category باعث شده یک سرطان به چند Project تکراری تبدیل شود.",
] as const;

const SCENARIOS: Array<{
  id: Exclude<ScenarioId, null>;
  title: string;
  body: string;
  expected: ProjectId[];
}> = [
  {
    id: "clear-cell",
    title: "فقط Clear Cell",
    body: "سؤال پژوهشی من مشخصاً درباره Clear Cell Renal Cell Carcinoma است.",
    expected: ["TCGA-KIRC"],
  },
  {
    id: "papillary",
    title: "فقط Papillary",
    body: "سؤال پژوهشی من مشخصاً درباره Papillary Renal Cell Carcinoma است.",
    expected: ["TCGA-KIRP"],
  },
  {
    id: "chromophobe",
    title: "فقط Chromophobe",
    body: "سؤال پژوهشی من مشخصاً درباره Chromophobe Kidney Cancer است.",
    expected: ["TCGA-KICH"],
  },
  {
    id: "compare",
    title: "مقایسه سه زیرنوع",
    body: "می‌خواهم بیان ژن را بین Clear Cell، Papillary و Chromophobe مقایسه کنم.",
    expected: ["TCGA-KIRC", "TCGA-KIRP", "TCGA-KICH"],
  },
];

function sameSelection(selected: ProjectId[], expected: ProjectId[]) {
  if (selected.length !== expected.length) return false;
  return expected.every((id) => selected.includes(id));
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
  const [activeProject, setActiveProject] = useState<ProjectId>("TCGA-KIRC");
  const [viewedProjects, setViewedProjects] = useState<ProjectId[]>([]);
  const [whyAnswer, setWhyAnswer] = useState<string | null>(null);
  const [scenario, setScenario] = useState<ScenarioId>(null);
  const [selectedProjects, setSelectedProjects] = useState<ProjectId[]>([]);

  const activeInfo = PROJECTS.find((project) => project.id === activeProject) ?? PROJECTS[0];
  const whyCorrect = whyAnswer === WHY_OPTIONS[0];
  const scenarioConfig = SCENARIOS.find((item) => item.id === scenario);
  const decisionCorrect = Boolean(
    scenarioConfig && sameSelection(selectedProjects, scenarioConfig.expected),
  );
  const allCompared = viewedProjects.length === PROJECTS.length;

  const comparisonProgress = useMemo(
    () => PROJECTS.map((project) => ({ ...project, viewed: viewedProjects.includes(project.id) })),
    [viewedProjects],
  );

  function inspectProject(id: ProjectId) {
    setActiveProject(id);
    setViewedProjects((current) => current.includes(id) ? current : [...current, id]);
  }

  function chooseScenario(nextScenario: Exclude<ScenarioId, null>) {
    setScenario(nextScenario);
    setSelectedProjects([]);
  }

  function toggleProject(id: ProjectId) {
    setSelectedProjects((current) => current.includes(id)
      ? current.filter((item) => item !== id)
      : [...current, id]);
  }

  return (
    <div className="mt-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7" dir="rtl">
      <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="text-xs font-black text-teal-700">مرحله {stageNumber} از {stageTotal}</div>
          <h2 className="mt-2 text-2xl font-black text-slate-950 sm:text-3xl">{title}</h2>
          <p className="mt-3 max-w-4xl text-sm leading-8 text-slate-600">
            تا اینجا فیلترها فضای جست‌وجو را از ۹۳ Project به ۳ Project بسیار مرتبط رسانده‌اند. حالا باید بفهمیم این سه Project چه تفاوتی دارند، چرا هر سه باقی مانده‌اند و سؤال پژوهشی دقیق ما کدام‌یک یا کدام‌ها را لازم دارد.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2 text-xs font-black" dir="ltr">
          <span className="rounded-full bg-slate-100 px-3 py-2 text-slate-500">۹۳</span>
          <span className="text-slate-300">→</span>
          <span className="rounded-full bg-slate-100 px-3 py-2 text-slate-500">۱۶</span>
          <span className="text-slate-300">→</span>
          <span className="rounded-full bg-slate-100 px-3 py-2 text-slate-500">۴</span>
          <span className="text-slate-300">→</span>
          <span className="rounded-full bg-teal-700 px-3 py-2 text-white">۳ Project</span>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-teal-100 bg-teal-50/60 p-5">
        <div className="flex items-center gap-2 text-sm font-black text-teal-900">
          <CheckCircle2 className="h-5 w-5" />
          اول یک نکته مهم: باقی ماندن ۳ Project یعنی فیلترها موفق بوده‌اند
        </div>
        <p className="mt-2 text-sm leading-8 text-teal-950/80">
          هدف فیلترها این نیست که همیشه ما را به یک Project یکتا برسانند. فیلترها باید مجموعه بزرگ اولیه را به یک فضای کوچک، مرتبط و قابل‌بررسی تبدیل کنند. از این نقطه به بعد، جزئیات دقیق سؤال پژوهشی وارد تصمیم می‌شود.
        </p>
      </div>

      <section className="mt-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="text-xs font-black text-slate-500">بخش ۱</div>
            <h3 className="mt-1 text-xl font-black text-slate-950">این سه سرطان کلیه دقیقاً چه تفاوتی دارند؟</h3>
            <p className="mt-2 text-sm leading-7 text-slate-600">هر سه کارت را باز کن. تفاوت اصلی‌ای که در این مرحله برای ما مهم است، زیرنوع دقیق سرطانی است که هر Project مطالعه می‌کند.</p>
          </div>
          <div className="rounded-full bg-slate-100 px-3 py-2 text-xs font-black text-slate-600">{viewedProjects.length} از ۳ بررسی شده</div>
        </div>

        <div className="mt-4 grid gap-3 lg:grid-cols-3" dir="ltr">
          {comparisonProgress.map((project) => (
            <button
              key={project.id}
              type="button"
              onClick={() => inspectProject(project.id)}
              className={`rounded-2xl border p-5 text-left transition ${activeProject === project.id ? "border-teal-400 bg-teal-50 shadow-sm" : "border-slate-200 bg-white hover:border-slate-300"}`}
            >
              <div className="flex items-center justify-between gap-3">
                <b className="text-base text-slate-950">{project.id}</b>
                {project.viewed ? <CheckCircle2 className="h-5 w-5 text-teal-600" /> : <span className="h-5 w-5 rounded-full border-2 border-slate-200" />}
              </div>
              <div className="mt-2 text-sm font-bold leading-6 text-slate-700">{project.englishName}</div>
              <div className="mt-4 rounded-xl bg-white/80 p-3 text-right" dir="rtl">
                <div className="text-xs font-black text-slate-500">زیرنوع مورد مطالعه</div>
                <div className="mt-1 text-sm font-black text-slate-900">{project.persianName}</div>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <b dir="ltr" className="text-base text-slate-950">{activeInfo.id}</b>
              <div className="mt-1 text-sm font-bold text-slate-700">{activeInfo.shortMeaning}</div>
            </div>
            <span className="rounded-full bg-white px-3 py-1.5 text-xs font-black text-slate-600">{activeInfo.subtype}</span>
          </div>
          <p className="mt-3 text-sm leading-8 text-slate-600">
            نکته اینجاست که «کلیه» و حتی رده Disease Type انتخاب‌شده هنوز می‌توانند بیش از یک زیرنوع مشخص سرطان را پوشش دهند. Project نام مطالعه مشخص‌تر را به ما نشان می‌دهد.
          </p>
        </div>
      </section>

      <section className={`mt-6 rounded-2xl border p-5 transition ${allCompared ? "border-violet-100 bg-violet-50/50" : "border-slate-200 bg-slate-50 opacity-60"}`}>
        <div className="flex items-center gap-2 text-sm font-black text-violet-950">
          <CircleHelp className="h-5 w-5" />
          بخش ۲ — پس چرا با وجود فیلتر Disease Type هر سه باقی ماندند؟
        </div>
        {!allCompared ? (
          <p className="mt-2 text-sm leading-7 text-slate-500">برای باز شدن این سؤال، اول هر سه Project بالا را بررسی کن.</p>
        ) : (
          <>
            <div className="mt-4 grid gap-2">
              {WHY_OPTIONS.map((option) => {
                const chosen = whyAnswer === option;
                const correct = option === WHY_OPTIONS[0];
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setWhyAnswer(option)}
                    className={`rounded-xl border px-4 py-3 text-right text-sm font-bold leading-7 transition ${chosen && correct ? "border-emerald-300 bg-emerald-50 text-emerald-900" : chosen ? "border-rose-300 bg-rose-50 text-rose-900" : "border-violet-100 bg-white text-slate-700 hover:border-violet-200"}`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
            {whyAnswer && !whyCorrect ? (
              <p className="mt-3 rounded-xl bg-rose-50 px-4 py-3 text-sm leading-7 text-rose-900">
                اینجا مسئله خراب بودن فیلتر نیست. به تفاوت «رده‌ای که Facet محدود می‌کند» و «زیرنوع دقیق‌تری که Project نمایندگی می‌کند» فکر کن.
              </p>
            ) : null}
          </>
        )}
      </section>

      {whyCorrect ? (
        <section className="mt-6 grid gap-4 xl:grid-cols-[1.1fr_.9fr]">
          <div className="rounded-2xl border border-sky-100 bg-sky-50/70 p-5">
            <div className="text-xs font-black text-sky-800">بخش ۳ — سطح تفکیک فیلترها را درست تفسیر کنیم</div>
            <h3 className="mt-2 text-lg font-black text-sky-950">Disease Type پایان طبقه‌بندی سرطان نیست</h3>
            <p className="mt-3 text-sm leading-8 text-sky-950/80">
              سرطان‌ها را می‌توان در چند سطح توصیف کرد: محل اولیه، رده بیماری، زیرنوع پاتولوژیک و حتی ویژگی‌های مولکولی. Facetهای صفحه Projects برای محدودکردن فضای جست‌وجو طراحی شده‌اند؛ نه اینکه الزاماً همه این سطوح را تا دقیق‌ترین رزولوشن از هم جدا کنند.
            </p>
            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              <div className="rounded-xl bg-white p-3 text-center">
                <div className="text-[11px] font-black text-slate-500">Primary Site</div>
                <div className="mt-1 text-sm font-black">Kidney</div>
              </div>
              <div className="rounded-xl bg-white p-3 text-center">
                <div className="text-[11px] font-black text-slate-500">Disease Type</div>
                <div className="mt-1 text-sm font-black">Adenomas and Adenocarcinomas</div>
              </div>
              <div className="rounded-xl bg-white p-3 text-center">
                <div className="text-[11px] font-black text-slate-500">Project level</div>
                <div className="mt-1 text-sm font-black">۳ زیرنوع مشخص‌تر</div>
              </div>
            </div>
            <p className="mt-4 rounded-xl border border-sky-200 bg-white px-4 py-3 text-sm font-bold leading-7 text-sky-950">
              نتیجه مهم: فیلترکردن، فضای جست‌وجو را کوچک می‌کند؛ سؤال پژوهشی دقیق است که انتخاب نهایی را تعیین می‌کند.
            </p>
          </div>

          <div className="rounded-2xl border border-amber-100 bg-amber-50 p-5">
            <div className="flex items-center gap-2 text-xs font-black text-amber-900">
              <Target className="h-4 w-4" />
              چرا ۹۳ → ۳ نتیجه خوبی است؟
            </div>
            <p className="mt-3 text-sm leading-8 text-amber-950/80">
              در بیماری پیچیده‌ای مثل سرطان، همیشه مطلوب نیست یک Facet خیلی زود همه تنوع زیستی را به یک گزینه فروبکاهد. این سطح از فیلترکردن به ما اجازه داده از ۹۳ مطالعه به فقط ۳ مطالعه بسیار مرتبط برسیم و سپس تصمیم دقیق‌تر را بر اساس هدف واقعی پژوهش بگیریم.
            </p>
          </div>
        </section>
      ) : null}

      {whyCorrect ? (
        <section className="mt-6 rounded-2xl border border-amber-100 bg-amber-50/60 p-5">
          <div className="text-xs font-black text-amber-900">بخش ۴ — حالا تصمیم پژوهشی بگیر</div>
          <h3 className="mt-2 text-xl font-black text-slate-950">سؤال دقیق تو کدام Project یا Projectها را لازم دارد؟</h3>
          <p className="mt-2 text-sm leading-7 text-slate-600">یک سناریو انتخاب کن و بعد Projectهای مناسب همان سؤال را انتخاب کن.</p>

          <div className="mt-4 grid gap-2 md:grid-cols-2 xl:grid-cols-4">
            {SCENARIOS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => chooseScenario(item.id)}
                className={`rounded-xl border p-4 text-right transition ${scenario === item.id ? "border-amber-400 bg-white shadow-sm" : "border-amber-200 bg-amber-50 hover:bg-white"}`}
              >
                <div className="text-sm font-black text-amber-950">{item.title}</div>
                <p className="mt-2 text-xs leading-6 text-slate-600">{item.body}</p>
              </button>
            ))}
          </div>

          {scenarioConfig ? (
            <div className="mt-4 rounded-2xl bg-white p-4">
              <div className="text-sm font-black text-slate-900">برای این سؤال، کدام Projectها را نگه می‌داری؟</div>
              <div className="mt-3 grid gap-2 sm:grid-cols-3" dir="ltr">
                {PROJECTS.map((project) => {
                  const selected = selectedProjects.includes(project.id);
                  return (
                    <button
                      key={project.id}
                      type="button"
                      onClick={() => toggleProject(project.id)}
                      className={`rounded-xl border px-3 py-3 text-sm font-black transition ${selected ? "border-teal-400 bg-teal-50 text-teal-950" : "border-slate-200 bg-white text-slate-700"}`}
                    >
                      {project.id}
                    </button>
                  );
                })}
              </div>

              {selectedProjects.length > 0 && !decisionCorrect ? (
                <p className="mt-3 rounded-xl bg-rose-50 px-4 py-3 text-sm leading-7 text-rose-900">
                  هنوز انتخابت دقیقاً با سؤال پژوهشی هماهنگ نیست. نام کامل زیرنوع‌ها و هدف سناریویی که انتخاب کردی را دوباره کنار هم بگذار.
                </p>
              ) : null}

              {decisionCorrect ? (
                <div className="mt-3 rounded-xl border border-teal-200 bg-teal-50 p-4">
                  <div className="flex items-center gap-2 text-sm font-black text-teal-900"><CheckCircle2 className="h-5 w-5" /> انتخاب پژوهشی منطقی است</div>
                  <p className="mt-2 text-sm leading-7 text-teal-900/80">
                    این همان نقطه‌ای است که تصمیم از «فیلتر رابط کاربری» به «طراحی مطالعه» تبدیل می‌شود. بسته به سؤال، ممکن است فقط یک Project یا چند Project برای تحلیل مناسب باشند.
                  </p>
                </div>
              ) : null}
            </div>
          ) : null}
        </section>
      ) : null}

      <div className="mt-6 grid grid-cols-2 gap-3 sm:max-w-xl">
        <button onClick={onPrevious} className="rounded-xl border px-4 py-3 text-sm font-bold"><ChevronRight className="inline h-4 w-4" /> قبلی</button>
        <button
          onClick={onNext}
          disabled={!decisionCorrect}
          className="rounded-xl bg-teal-700 px-4 py-3 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          تصمیم بعدی <ChevronLeft className="inline h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
