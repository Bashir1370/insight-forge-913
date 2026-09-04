import {
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  FlaskConical,
  Lightbulb,
  LockKeyhole,
  RotateCcw,
  Target,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import type { GdcFacetId } from "./gdc-question-guide-config";

const PROJECT_PARTS = Array.from(
  { length: 7 },
  (_, i) => `/images/gdc/gdc-projects-b64/${String(i + 1).padStart(2, "0")}.txt`,
);

const STUDY_SCREENSHOTS = Array.from(
  { length: 5 },
  (_, i) => `/images/gdc/study-design-kidney/step-${i + 1}.txt`,
);

const PROJECT_COUNTS = [93, 16, 4, 3, 3, 3] as const;

type StudyMode = "guided" | "challenge";

type StudyTask = {
  id: GdcFacetId;
  label: string;
  cue: string;
  target: string;
  options: string[];
  hint: string;
  rationale: string;
  wrongFeedback: string;
  resultCaption: string;
};

const STUDY_TASKS: StudyTask[] = [
  {
    id: "primarySite",
    label: "Primary Site",
    cue: "محل اولیه تومور را روی کدام گزینه محدود می‌کنید؟",
    target: "kidney",
    options: ["kidney", "breast", "colon"],
    hint: "Primary Site محل آناتومیکی شروع تومور را می‌پرسد.",
    rationale: "برای سناریوی این تمرین، محل اولیه کلیه است؛ پس Primary Site = kidney انتخاب می‌شود.",
    wrongFeedback: "اینجا باید محل اولیه تومور را انتخاب کنید؛ در این سناریو هدف kidney است.",
    resultCaption: "با انتخاب Primary Site = kidney، جدول از 93 Project به 16 Project محدود شد.",
  },
  {
    id: "program",
    label: "Program",
    cue: "از میان Projectهای کلیه، کدام Program پژوهشی را می‌خواهیم؟",
    target: "TCGA",
    options: ["TCGA", "TARGET", "CPTAC"],
    hint: "در سؤال پژوهشی، منبع مطالعه را TCGA در نظر گرفته‌ایم.",
    rationale: "اعمال Program = TCGA فقط Projectهای متعلق به TCGA را در این محدوده نگه می‌دارد.",
    wrongFeedback: "به Program موردنظر سناریو برگردید؛ در این تمرین هدف TCGA است.",
    resultCaption: "با اضافه شدن Program = TCGA، تعداد Projectها از 16 به 4 رسید.",
  },
  {
    id: "diseaseType",
    label: "Disease Type",
    cue: "برای نوع پاتولوژیک بیماری کدام گزینه را انتخاب می‌کنید؟",
    target: "Adenomas and Adenocarcinomas",
    options: [
      "Adenomas and Adenocarcinomas",
      "Squamous Cell Neoplasms",
      "Ductal and Lobular Neoplasms",
    ],
    hint: "در اسکرین‌شات‌های این سناریو، Projectهای کلیوی هدف با Adenomas and Adenocarcinomas مشخص شده‌اند.",
    rationale: "Disease Type ماهیت بیماری را محدود می‌کند؛ پس با این انتخاب، فقط Projectهای سازگار با این طبقه‌بندی باقی می‌مانند.",
    wrongFeedback: "Primary Site محل را مشخص کرده است؛ اینجا باید نوع بیماریِ هدف را انتخاب کنید.",
    resultCaption: "Disease Type = Adenomas and Adenocarcinomas یک Project دیگر را حذف کرد و 3 Project باقی ماند.",
  },
  {
    id: "dataCategory",
    label: "Data Category",
    cue: "برای بررسی بیان ژن، کدام خانواده داده مناسب‌تر است؟",
    target: "Transcriptome Profiling",
    options: ["Transcriptome Profiling", "Clinical", "Simple Nucleotide Variation"],
    hint: "بیان ژن به داده‌های RNA و پروفایل ترنسکریپتوم مربوط است.",
    rationale: "Transcriptome Profiling خانواده داده‌ای است که برای سؤال بیان ژن به آن نیاز داریم.",
    wrongFeedback: "این گزینه ممکن است داده مفیدی بدهد، اما مستقیماً سؤال ما درباره بیان ژن را هدف نمی‌گیرد.",
    resultCaption: "Data Category = Transcriptome Profiling تعداد را از 3 کمتر نکرد؛ یعنی هر سه Project این دسته داده را دارند.",
  },
  {
    id: "experimentalStrategy",
    label: "Experimental Strategy",
    cue: "داده موردنظر باید با کدام روش تولید شده باشد؟",
    target: "RNA-Seq",
    options: ["RNA-Seq", "WXS", "WGS"],
    hint: "برای این سناریوی بیان ژن، روش هدف RNA-Seq است.",
    rationale: "RNA-Seq روش تولید داده موردنیاز برای این طراحی است و در هر سه Project باقی‌مانده وجود دارد.",
    wrongFeedback: "WXS و WGS برای سؤال‌های ژنومی مهم‌اند؛ اینجا روش هدف RNA-Seq است.",
    resultCaption: "با RNA-Seq هم 3 Project باقی ماند؛ این فیلتر اینجا بیشتر سازگاری داده را تأیید می‌کند تا تعداد Projectها را کاهش دهد.",
  },
];

function useStudyImages() {
  const [baseline, setBaseline] = useState("");
  const [steps, setSteps] = useState<string[]>([]);

  useEffect(() => {
    let active = true;

    Promise.all(PROJECT_PARTS.map(async (path) => {
      const response = await fetch(path);
      if (!response.ok) throw new Error(path);
      return response.text();
    }))
      .then((parts) => {
        if (active) setBaseline(`data:image/webp;base64,${parts.join("")}`);
      })
      .catch(() => {
        if (active) setBaseline("");
      });

    Promise.all(STUDY_SCREENSHOTS.map(async (path) => {
      const response = await fetch(path);
      if (!response.ok) throw new Error(path);
      const value = (await response.text()).trim();
      return `data:image/webp;base64,${value}`;
    }))
      .then((images) => {
        if (active) setSteps(images);
      })
      .catch(() => {
        if (active) setSteps([]);
      });

    return () => {
      active = false;
    };
  }, []);

  return { baseline, steps };
}

export function GdcStudyDesignStage({
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
  const { baseline, steps } = useStudyImages();
  const [mode, setMode] = useState<StudyMode>("guided");
  const [answers, setAnswers] = useState<Partial<Record<GdcFacetId, string>>>({});
  const [activeFilter, setActiveFilter] = useState<GdcFacetId>("primarySite");
  const [confidence, setConfidence] = useState<"low" | "medium" | "high" | null>(null);

  const completedPrefix = useMemo(() => {
    let count = 0;
    for (const task of STUDY_TASKS) {
      if (answers[task.id] !== task.target) break;
      count += 1;
    }
    return count;
  }, [answers]);

  const complete = completedPrefix === STUDY_TASKS.length;
  const displayedSrc = completedPrefix > 0 ? (steps[completedPrefix - 1] || baseline) : baseline;
  const visibleProjectCount = PROJECT_COUNTS[completedPrefix];
  const latestTask = completedPrefix > 0 ? STUDY_TASKS[completedPrefix - 1] : null;

  function resetStudy() {
    setAnswers({});
    setActiveFilter("primarySite");
    setConfidence(null);
  }

  function chooseAnswer(task: StudyTask, taskIndex: number, option: string) {
    setAnswers((current) => {
      const next = { ...current, [task.id]: option };
      for (const downstream of STUDY_TASKS.slice(taskIndex + 1)) {
        delete next[downstream.id];
      }
      return next;
    });
    setActiveFilter(task.id);
    setConfidence(null);

    if (option === task.target && taskIndex < STUDY_TASKS.length - 1) {
      window.setTimeout(() => setActiveFilter(STUDY_TASKS[taskIndex + 1].id), 180);
    }
  }

  return (
    <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.65fr)_500px]">
      <div className="xl:sticky xl:top-5 xl:self-start">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3" dir="rtl">
            <div>
              <div className="text-xs font-black text-teal-700">نتیجه واقعی اعمال فیلترها در GDC</div>
              <div className="mt-1 text-sm font-bold text-slate-700">
                {completedPrefix === 0
                  ? "هنوز فیلتری اعمال نشده؛ اولین تصمیم را از Primary Site شروع کنید."
                  : latestTask?.resultCaption}
              </div>
            </div>
            <div className="rounded-full bg-slate-950 px-3 py-1.5 text-xs font-black text-white" dir="ltr">
              {visibleProjectCount} Projects
            </div>
          </div>

          <div className="relative overflow-hidden bg-slate-100" dir="ltr">
            {displayedSrc ? (
              <img
                key={`study-screen-${completedPrefix}`}
                src={displayedSrc}
                alt={`GDC Projects after ${completedPrefix} study filters`}
                className="block w-full animate-[fadeIn_.28s_ease-out]"
              />
            ) : (
              <div className="flex aspect-[1905/847] items-center justify-center text-sm font-bold text-slate-400">
                در حال بارگذاری اسکرین‌شات واقعی GDC…
              </div>
            )}
          </div>

          <div className="border-t bg-slate-50 px-4 py-3" dir="rtl">
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-black">
              <span className="rounded-full bg-slate-900 px-3 py-1.5 text-white" dir="ltr">93</span>
              {STUDY_TASKS.map((task, index) => {
                const done = completedPrefix > index;
                return (
                  <div key={task.id} className="flex items-center gap-2">
                    <span className="text-slate-300">←</span>
                    <span className={`rounded-full border px-3 py-1.5 ${done ? "border-teal-300 bg-teal-50 text-teal-800" : "border-slate-200 bg-white text-slate-400"}`}>
                      <span dir="ltr">{task.label}</span> · {PROJECT_COUNTS[index + 1]}
                    </span>
                  </div>
                );
              })}
            </div>
            {completedPrefix >= 4 ? (
              <p className="mt-2 text-xs leading-6 text-slate-600">
                نکته پژوهشی: هر فیلتر الزاماً تعداد Projectها را کمتر نمی‌کند. اگر تعداد ثابت بماند، یعنی Projectهای باقی‌مانده همگی آن شرط داده‌ای را دارند؛ با این حال فیلتر هنوز برای تأیید سازگاری طراحی مطالعه مهم است.
              </p>
            ) : null}
          </div>
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-5" dir="rtl">
          {["kidney", "TCGA", "Adenomas / Adenocarcinomas", "Transcriptome Profiling", "RNA-Seq"].map((chip) => (
            <div key={chip} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-center text-[11px] font-black text-slate-700 shadow-sm" dir="ltr">
              {chip}
            </div>
          ))}
        </div>
      </div>

      <aside className="rounded-2xl border bg-white p-5 shadow-sm sm:p-6" dir="rtl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-xs font-black text-teal-700">مرحله {stageNumber} از {stageTotal}</div>
            <h2 className="mt-2 text-2xl font-black text-slate-950">{title}</h2>
          </div>
          <button
            type="button"
            onClick={resetStudy}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-black text-slate-600 hover:border-teal-300 hover:text-teal-700"
          >
            <RotateCcw className="h-4 w-4" /> شروع دوباره
          </button>
        </div>

        <div className="mt-5 rounded-2xl border border-violet-100 bg-violet-50/70 p-4">
          <div className="flex items-center gap-2 text-xs font-black text-violet-800"><FlaskConical className="h-4 w-4" /> سناریوی پژوهش</div>
          <p className="mt-2 text-sm font-bold leading-7 text-violet-950">
            می‌خواهیم <b>بیان ژن</b> را در سرطان‌های مرتبط با <b>کلیه</b> بررسی کنیم؛ مطالعه باید از <b dir="ltr">TCGA</b> باشد، Disease Type موردنظر <b dir="ltr">Adenomas and Adenocarcinomas</b> باشد و داده <b dir="ltr">Transcriptome Profiling</b> با روش <b dir="ltr">RNA-Seq</b> در دسترس باشد.
          </p>
          <p className="mt-2 text-xs leading-6 text-violet-900/75">
            هر پاسخ درست، اسکرین‌شات واقعی همان مرحله را جایگزین می‌کند؛ تغییر جدول سمت راست را دنبال کنید.
          </p>
        </div>

        <div className="mt-4 flex rounded-xl bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => setMode("guided")}
            className={`flex-1 rounded-lg px-3 py-2 text-xs font-black ${mode === "guided" ? "bg-white text-teal-800 shadow-sm" : "text-slate-500"}`}
          >
            راهنمایی‌شده
          </button>
          <button
            type="button"
            onClick={() => setMode("challenge")}
            className={`flex-1 rounded-lg px-3 py-2 text-xs font-black ${mode === "challenge" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}
          >
            حالت چالش
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {STUDY_TASKS.map((task, index) => {
            const selected = answers[task.id];
            const isCorrect = selected === task.target;
            const isWrong = Boolean(selected) && !isCorrect;
            const locked = index > completedPrefix;
            const active = activeFilter === task.id && !locked;

            return (
              <section
                key={task.id}
                className={`rounded-2xl border p-4 transition ${
                  locked
                    ? "border-slate-100 bg-slate-50 opacity-60"
                    : active
                      ? "border-teal-300 bg-teal-50/40"
                      : "border-slate-200 bg-white"
                }`}
                onClick={() => !locked && setActiveFilter(task.id)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-black ${isCorrect ? "bg-emerald-600 text-white" : "bg-slate-900 text-white"}`}>{index + 1}</span>
                      <b dir="ltr" className="text-sm text-slate-950">{task.label}</b>
                    </div>
                    <p className="mt-2 text-xs leading-6 text-slate-600">{task.cue}</p>
                  </div>
                  {isCorrect ? <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" /> : locked ? <LockKeyhole className="h-4 w-4 shrink-0 text-slate-400" /> : null}
                </div>

                {!locked ? (
                  <div className="mt-3 grid gap-2">
                    {task.options.map((option) => {
                      const chosen = selected === option;
                      const correctOption = option === task.target;
                      const revealCorrect = mode === "guided" && Boolean(selected);
                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            chooseAnswer(task, index, option);
                          }}
                          className={`flex items-center justify-between gap-3 rounded-xl border px-3 py-2.5 text-right text-xs font-bold transition ${
                            chosen && correctOption
                              ? "border-emerald-300 bg-emerald-50 text-emerald-900"
                              : chosen
                                ? "border-rose-300 bg-rose-50 text-rose-900"
                                : revealCorrect && correctOption
                                  ? "border-emerald-200 bg-emerald-50/40 text-emerald-800"
                                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                          }`}
                          dir="ltr"
                        >
                          <span>{option}</span>
                          {chosen ? <Check className="h-4 w-4 shrink-0" /> : null}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <p className="mt-3 text-[11px] font-bold text-slate-400">ابتدا فیلتر مرحله قبل را درست انتخاب کنید.</p>
                )}

                {mode === "guided" && !selected && !locked ? (
                  <div className="mt-3 flex items-start gap-2 rounded-xl bg-amber-50 px-3 py-2 text-xs leading-6 text-amber-900">
                    <Lightbulb className="mt-1 h-4 w-4 shrink-0" />
                    <span><b>Hint:</b> {task.hint}</span>
                  </div>
                ) : null}

                {isCorrect ? (
                  <div className="mt-3 rounded-xl bg-emerald-50 px-3 py-2 text-xs leading-6 text-emerald-900">
                    <b>درست.</b> {task.rationale}
                  </div>
                ) : null}

                {isWrong ? (
                  <div className="mt-3 flex items-start gap-2 rounded-xl bg-rose-50 px-3 py-2 text-xs leading-6 text-rose-900">
                    <CircleHelp className="mt-1 h-4 w-4 shrink-0" />
                    <span>{task.wrongFeedback}</span>
                  </div>
                ) : null}
              </section>
            );
          })}
        </div>

        <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-black text-slate-700"><Target className="h-4 w-4" /> پیشرفت طراحی مطالعه</div>
            <span className="text-xs font-black text-teal-700">{Math.round((completedPrefix / STUDY_TASKS.length) * 100)}٪</span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
            <div className="h-full rounded-full bg-teal-600 transition-all" style={{ width: `${(completedPrefix / STUDY_TASKS.length) * 100}%` }} />
          </div>
        </div>

        {complete ? (
          <div className="mt-4 rounded-2xl border border-teal-200 bg-teal-50 p-4">
            <div className="flex items-center gap-2 text-sm font-black text-teal-900"><CheckCircle2 className="h-5 w-5" /> طراحی مطالعه کامل شد</div>
            <p className="mt-2 text-xs leading-6 text-teal-900/80">
              نتیجه مهم این تمرین این است که فیلترها همیشه ما را به یک Project یکتا نمی‌رسانند. با این طراحی، سه Project سازگار باقی مانده‌اند و باید در قدم بعد ویژگی‌های آن‌ها و داده موجود را مقایسه کنیم.
            </p>
            <div className="mt-3 grid gap-2 sm:grid-cols-3" dir="ltr">
              {["TCGA-KIRC", "TCGA-KIRP", "TCGA-KICH"].map((project) => (
                <div key={project} className="rounded-xl bg-white px-3 py-3 text-center text-sm font-black text-slate-950 shadow-sm">{project}</div>
              ))}
            </div>

            <div className="mt-4">
              <div className="text-xs font-black text-teal-900">قبل از ادامه، چقدر به طراحی خودت مطمئنی؟</div>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {([[
                  "low",
                  "کم",
                ], ["medium", "متوسط"], ["high", "زیاد"]] as const).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setConfidence(value)}
                    className={`rounded-xl border px-3 py-2 text-xs font-black ${confidence === value ? "border-teal-500 bg-white text-teal-800" : "border-teal-200 bg-teal-50 text-teal-700"}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              {confidence ? (
                <p className="mt-2 text-xs leading-6 text-teal-900/75">
                  {confidence === "low"
                    ? "انتخاب‌ها درست‌اند؛ مرحله بعد کمک می‌کند با بررسی داده واقعی، اطمینانت بیشتر شود."
                    : confidence === "medium"
                      ? "طراحی درست است؛ حالا باید سه Project باقی‌مانده را دقیق‌تر مقایسه کنی."
                      : "خوب؛ حالا وقت بررسی سازگاری داده و انتخاب نهایی بین Projectهای باقی‌مانده است."}
                </p>
              ) : null}
            </div>
          </div>
        ) : null}

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button onClick={onPrevious} className="rounded-xl border px-4 py-3 text-sm font-bold">
            <ChevronRight className="inline h-4 w-4" /> قبلی
          </button>
          <button
            onClick={onNext}
            disabled={!complete}
            className="rounded-xl bg-teal-700 px-4 py-3 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            بررسی نوع داده <ChevronLeft className="inline h-4 w-4" />
          </button>
        </div>
      </aside>
    </div>
  );
}
