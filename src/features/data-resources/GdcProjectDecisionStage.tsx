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
type YesNoAnswer = "yes" | "no" | null;

type ProjectInfo = {
  id: ProjectId;
  englishName: string;
  persianName: string;
  subtype: string;
  studyMeaning: string;
};

const SHARED_DISEASE_TYPE = "Adenomas and Adenocarcinomas";

const PROJECTS: ProjectInfo[] = [
  {
    id: "TCGA-KIRC",
    englishName: "Kidney Renal Clear Cell Carcinoma",
    persianName: "کارسینوم سلول روشن کلیه",
    subtype: "Clear Cell",
    studyMeaning: "پروژه TCGA مربوط به سرطان سلول روشن کلیه",
  },
  {
    id: "TCGA-KIRP",
    englishName: "Kidney Renal Papillary Cell Carcinoma",
    persianName: "کارسینوم پاپیلاری کلیه",
    subtype: "Papillary",
    studyMeaning: "پروژه TCGA مربوط به سرطان پاپیلاری کلیه",
  },
  {
    id: "TCGA-KICH",
    englishName: "Kidney Chromophobe",
    persianName: "کارسینوم کروموفوب کلیه",
    subtype: "Chromophobe",
    studyMeaning: "پروژه TCGA مربوط به سرطان کروموفوب کلیه",
  },
];

const WHY_OPTIONS = [
  "چون هر سه پروژه در نتیجه فعلی GDC مقدار Disease Type = Adenomas and Adenocarcinomas را دارند؛ اما نام هر پروژه یک مطالعه و سرطان مشخص‌تر را نشان می‌دهد.",
  "چون فیلتر Disease Type درست اعمال نشده و باید به مرحله قبل برگردیم.",
  "چون Data Category سه نسخه تکراری از یک پروژه ساخته است.",
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

function resolveTitle(title: string) {
  const legacyTitles = [
    "از ۳ Project مرتبط تا انتخاب پژوهشی",
    "از 3 Project مرتبط تا انتخاب پژوهشی",
    "نوع داده را بررسی کن",
  ];
  return legacyTitles.includes(title.trim()) ? "ارزیابی پروژه یا پروژه‌های نهایی" : title;
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
  const [sharedCategoryAnswer, setSharedCategoryAnswer] = useState<YesNoAnswer>(null);
  const [whyAnswer, setWhyAnswer] = useState<string | null>(null);
  const [scenario, setScenario] = useState<ScenarioId>(null);
  const [selectedProjects, setSelectedProjects] = useState<ProjectId[]>([]);

  const activeInfo = PROJECTS.find((project) => project.id === activeProject) ?? PROJECTS[0];
  const sharedCategoryCorrect = sharedCategoryAnswer === "yes";
  const whyCorrect = whyAnswer === WHY_OPTIONS[0];
  const scenarioConfig = SCENARIOS.find((item) => item.id === scenario);
  const decisionCorrect = Boolean(
    scenarioConfig && sameSelection(selectedProjects, scenarioConfig.expected),
  );
  const allCompared = viewedProjects.length === PROJECTS.length;
  const displayTitle = resolveTitle(title);

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
          <h2 className="mt-2 text-2xl font-black text-slate-950 sm:text-3xl">{displayTitle}</h2>
          <p className="mt-3 max-w-4xl text-sm leading-8 text-slate-600">
            تا اینجا با فیلترها از ۹۳ پروژه به ۳ پروژه بسیار مرتبط رسیده‌ایم. حالا باید روشن کنیم چرا هر سه پروژه از فیلترهای ما عبور کرده‌اند، چه تفاوت واقعی‌ای با هم دارند و بر اساس سؤال پژوهشی دقیق، کدام پروژه یا پروژه‌ها باید انتخاب شوند.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2 text-xs font-black" dir="ltr">
          <span className="rounded-full bg-slate-100 px-3 py-2 text-slate-500">۹۳</span>
          <span className="text-slate-300">→</span>
          <span className="rounded-full bg-slate-100 px-3 py-2 text-slate-500">۱۶</span>
          <span className="text-slate-300">→</span>
          <span className="rounded-full bg-slate-100 px-3 py-2 text-slate-500">۴</span>
          <span className="text-slate-300">→</span>
          <span className="rounded-full bg-teal-700 px-3 py-2 text-white" dir="rtl">۳ پروژه</span>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-teal-100 bg-teal-50/60 p-5">
        <div className="flex items-center gap-2 text-sm font-black text-teal-900">
          <CheckCircle2 className="h-5 w-5" />
          باقی ماندن ۳ پروژه یعنی فیلترها کارشان را درست انجام داده‌اند
        </div>
        <p className="mt-2 text-sm leading-8 text-teal-950/80">
          هدف فیلترها این نیست که همیشه یک پروژه یکتا تحویل بدهند. آن‌ها باید فضای جست‌وجوی بزرگ را به مجموعه‌ای کوچک و مرتبط تبدیل کنند. ما از ۹۳ پروژه به فقط ۳ پروژه رسیده‌ایم؛ از اینجا به بعد، جزئیات دقیق سؤال پژوهشی انتخاب نهایی را تعیین می‌کند.
        </p>
      </div>

      <section className="mt-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="text-xs font-black text-slate-500">بخش ۱</div>
            <h3 className="mt-1 text-xl font-black text-slate-950">اول ببینیم این ۳ پروژه چه چیزهایی را مشترک دارند</h3>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              در نتیجه‌ای که از GDC گرفته‌ایم، هر سه پروژه همه فیلترهای انتخاب‌شده ما را پاس کرده‌اند. مهم‌ترین نکته برای رفع ابهام، مقدار Disease Type است.
            </p>
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {[
            ["Primary Site", "kidney"],
            ["Program", "TCGA"],
            ["Disease Type", SHARED_DISEASE_TYPE],
            ["Data Category", "Transcriptome Profiling"],
            ["Experimental Strategy", "RNA-Seq"],
          ].map(([label, value]) => (
            <div key={label} className={`rounded-2xl border p-4 ${label === "Disease Type" ? "border-violet-200 bg-violet-50" : "border-slate-200 bg-slate-50"}`}>
              <div dir="ltr" className="text-xs font-black text-slate-500">{label}</div>
              <div dir="ltr" className="mt-2 text-sm font-black text-slate-950">{value}</div>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-2xl border border-violet-200 bg-violet-50/60 p-5">
          <div className="text-sm font-black text-violet-950">
            آیا هر سه پروژه باقی‌مانده در نتیجه فعلی GDC مقدار <span dir="ltr">Disease Type = {SHARED_DISEASE_TYPE}</span> را دارند؟
          </div>
          <div className="mt-3 grid max-w-md grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setSharedCategoryAnswer("yes")}
              className={`rounded-xl border px-4 py-3 text-sm font-black ${sharedCategoryAnswer === "yes" ? "border-emerald-300 bg-emerald-50 text-emerald-900" : "border-violet-200 bg-white text-slate-700"}`}
            >
              بله
            </button>
            <button
              type="button"
              onClick={() => setSharedCategoryAnswer("no")}
              className={`rounded-xl border px-4 py-3 text-sm font-black ${sharedCategoryAnswer === "no" ? "border-rose-300 bg-rose-50 text-rose-900" : "border-violet-200 bg-white text-slate-700"}`}
            >
              خیر
            </button>
          </div>

          {sharedCategoryAnswer === "no" ? (
            <p className="mt-3 rounded-xl bg-rose-50 px-4 py-3 text-sm leading-7 text-rose-900">
              به نتیجه نهایی مرحله قبل دقت کن: هر سه ردیف باقی‌مانده در ستون Disease Type مقدار <span dir="ltr">Adenomas and Adenocarcinomas</span> را نشان می‌دهند. پس هر سه با همین فیلتر سازگارند.
            </p>
          ) : null}

          {sharedCategoryCorrect ? (
            <div className="mt-4 rounded-xl border border-emerald-100 bg-white p-4">
              <div className="flex items-center gap-2 text-sm font-black text-emerald-900"><CheckCircle2 className="h-4 w-4" /> دقیقاً همین نکته کلیدی است</div>
              <p className="mt-2 text-sm leading-7 text-slate-700">
                بله. در نتیجه فعلی GDC، هر سه پروژه مقدار <span dir="ltr">Disease Type = Adenomas and Adenocarcinomas</span> را دارند. بنابراین فیلتر Disease Type دلیلی برای حذف هیچ‌کدام از این سه ندارد. اما این به معنی یکسان بودن سرطان‌های آن‌ها نیست؛ این مقدار یک ویژگی مشترک در Facet فعلی است، در حالی که نام و شناسه پروژه‌ها مطالعه‌های مشخص‌تر سرطان کلیه را از هم جدا می‌کنند.
              </p>
            </div>
          ) : null}
        </div>
      </section>

      {sharedCategoryCorrect ? (
        <section className="mt-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="text-xs font-black text-slate-500">بخش ۲</div>
              <h3 className="mt-1 text-xl font-black text-slate-950">حالا تفاوت واقعی ۳ پروژه را ببین</h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                مقدار Disease Type مشترک است؛ چیزی که عوض می‌شود، سرطان مشخصی است که هر مطالعه TCGA روی آن متمرکز شده. هر سه کارت را باز کن تا این تفاوت روشن شود.
              </p>
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
                  <div className="text-xs font-black text-slate-500">سرطان مشخص‌تر در این پروژه</div>
                  <div className="mt-1 text-sm font-black text-slate-900">{project.persianName}</div>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <b dir="ltr" className="text-base text-slate-950">{activeInfo.id}</b>
                <div className="mt-1 text-sm font-bold text-slate-700">{activeInfo.studyMeaning}</div>
              </div>
              <span className="rounded-full bg-white px-3 py-1.5 text-xs font-black text-slate-600">{activeInfo.subtype}</span>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div className="rounded-xl border border-violet-100 bg-white p-3">
                <div className="text-xs font-black text-violet-800">چیزی که مشترک مانده</div>
                <div dir="ltr" className="mt-1 text-xs font-bold text-slate-700">Disease Type = {SHARED_DISEASE_TYPE}</div>
              </div>
              <div className="rounded-xl border border-teal-100 bg-white p-3">
                <div className="text-xs font-black text-teal-800">چیزی که پروژه را مشخص‌تر می‌کند</div>
                <div dir="ltr" className="mt-1 text-xs font-bold text-slate-700">{activeInfo.englishName}</div>
              </div>
            </div>
            <p className="mt-3 text-sm leading-8 text-slate-600">
              پس این سه پروژه «سه نسخه از یک سرطان» نیستند. آن‌ها سه مطالعه TCGA برای سرطان‌های مشخص‌تر کلیه‌اند که در نتیجه فعلی GDC، یک مقدار Disease Type مشترک دارند.
            </p>
          </div>
        </section>
      ) : null}

      <section className={`mt-6 rounded-2xl border p-5 transition ${allCompared ? "border-violet-100 bg-violet-50/50" : "border-slate-200 bg-slate-50 opacity-60"}`}>
        <div className="flex items-center gap-2 text-sm font-black text-violet-950">
          <CircleHelp className="h-5 w-5" />
          بخش ۳ — پس چرا هر سه پروژه از فیلتر Disease Type عبور کردند؟
        </div>
        {!allCompared ? (
          <p className="mt-2 text-sm leading-7 text-slate-500">برای باز شدن این سؤال، ابتدا هر سه پروژه بالا را بررسی کن.</p>
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
                فیلتر خراب نشده است. GDC فقط پروژه‌هایی را نگه داشته که با مقدار انتخاب‌شده در Disease Type سازگارند؛ هر سه پروژه این شرط را دارند.
              </p>
            ) : null}
          </>
        )}
      </section>

      {whyCorrect ? (
        <section className="mt-6 grid gap-4 xl:grid-cols-[1.05fr_.95fr]">
          <div className="rounded-2xl border border-sky-100 bg-sky-50/70 p-5">
            <div className="text-xs font-black text-sky-800">بخش ۴ — سطح اطلاعات را درست تفسیر کنیم</div>
            <h3 className="mt-2 text-lg font-black text-sky-950">Disease Type و نام پروژه دو سؤال متفاوت را جواب می‌دهند</h3>
            <p className="mt-3 text-sm leading-8 text-sky-950/80">
              در همین سناریوی GDC، <span dir="ltr">Disease Type = Adenomas and Adenocarcinomas</span> یک ویژگی مشترک برای هر سه نتیجه است؛ اما شناسه و نام پروژه، گروه مطالعاتی مشخص‌تری را نشان می‌دهد. پس از Facet برای محدود کردن فضای جست‌وجو استفاده می‌کنیم و سپس پروژه‌های باقی‌مانده را با جزئیات سؤال پژوهشی ارزیابی می‌کنیم.
            </p>
            <div className="mt-4 grid gap-2">
              <div className="rounded-xl bg-white p-3"><b dir="ltr" className="text-xs">Primary Site → kidney</b><span className="mr-2 text-xs text-slate-500">محل آناتومیکی</span></div>
              <div className="rounded-xl bg-white p-3"><b dir="ltr" className="text-xs">Disease Type → Adenomas and Adenocarcinomas</b><span className="mr-2 text-xs text-slate-500">ویژگی مشترک در فیلتر فعلی</span></div>
              <div className="rounded-xl bg-white p-3"><b dir="ltr" className="text-xs">TCGA-KIRC / KIRP / KICH</b><span className="mr-2 text-xs text-slate-500">سه پروژه و مطالعه مشخص‌تر</span></div>
            </div>
          </div>

          <div className="rounded-2xl border border-teal-100 bg-teal-50/60 p-5">
            <div className="text-xs font-black text-teal-800">برداشت درست از نتیجه فیلترها</div>
            <p className="mt-2 text-sm leading-8 text-teal-950/80">
              پیچیدگی طبقه‌بندی سرطان باعث می‌شود یک Facet همیشه آخرین سطح جزئیات موردنیاز پژوهش را ارائه نکند. اینجا رسیدن از ۹۳ پروژه به ۳ پروژه بسیار مرتبط یک نتیجه مفید است؛ انتخاب بعدی دیگر باید بر اساس سؤال دقیق پژوهش انجام شود.
            </p>
          </div>
        </section>
      ) : null}

      {whyCorrect ? (
        <section className="mt-6 rounded-2xl border border-amber-100 bg-amber-50 p-5">
          <div className="flex items-center gap-2 text-sm font-black text-amber-950"><Target className="h-5 w-5" /> بخش ۵ — حالا سؤال پژوهشی را دقیق کن</div>
          <p className="mt-2 text-sm leading-7 text-amber-950/80">
            انتخاب نهایی همیشه «یک پروژه» نیست. اول مشخص کن سؤال پژوهشی دقیقاً درباره کدام زیرنوع است یا آیا می‌خواهی چند زیرنوع را با هم مقایسه کنی.
          </p>
          <div className="mt-4 grid gap-2 md:grid-cols-2 xl:grid-cols-4">
            {SCENARIOS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => chooseScenario(item.id)}
                className={`rounded-xl border p-3 text-right ${scenario === item.id ? "border-amber-400 bg-white" : "border-amber-200 bg-amber-50"}`}
              >
                <div className="text-xs font-black text-amber-950">{item.title}</div>
                <div className="mt-1 text-xs leading-6 text-amber-900/70">{item.body}</div>
              </button>
            ))}
          </div>

          {scenarioConfig ? (
            <div className="mt-4 rounded-2xl border border-amber-200 bg-white p-4">
              <div className="text-sm font-black text-slate-900">کدام پروژه یا پروژه‌ها را برای این سؤال نگه می‌داری؟</div>
              <div className="mt-3 grid gap-2 sm:grid-cols-3" dir="ltr">
                {PROJECTS.map((project) => {
                  const selected = selectedProjects.includes(project.id);
                  return (
                    <button
                      key={project.id}
                      type="button"
                      onClick={() => toggleProject(project.id)}
                      className={`rounded-xl border px-3 py-3 text-xs font-black ${selected ? "border-teal-400 bg-teal-50 text-teal-950" : "border-slate-200 bg-white text-slate-700"}`}
                    >
                      {project.id}
                    </button>
                  );
                })}
              </div>

              {selectedProjects.length > 0 && !decisionCorrect ? (
                <p className="mt-3 rounded-xl bg-rose-50 px-4 py-3 text-sm leading-7 text-rose-900">
                  انتخاب فعلی با سناریوی پژوهشی هماهنگ نیست. به نام کامل پروژه‌ها و زیرنوع هدف در سؤال توجه کن.
                </p>
              ) : null}

              {decisionCorrect ? (
                <div className="mt-3 rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                  <div className="flex items-center gap-2 text-sm font-black text-emerald-900"><CheckCircle2 className="h-4 w-4" /> انتخاب پژوهشی منطقی است</div>
                  <p className="mt-2 text-sm leading-7 text-emerald-900/80">
                    فیلترها ۳ پروژه مرتبط را پیدا کردند؛ سؤال پژوهشی دقیق تعیین کرد از میان آن‌ها کدام پروژه یا پروژه‌ها برای طراحی مطالعه ما لازم‌اند.
                  </p>
                </div>
              ) : null}
            </div>
          ) : null}
        </section>
      ) : null}

      <div className="mt-6 grid grid-cols-2 gap-3">
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
