import {
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  FlaskConical,
  Lightbulb,
  RotateCcw,
  Target,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import type { GdcFacetId } from "./gdc-question-guide-config";

const PROJECT_PARTS = Array.from(
  { length: 7 },
  (_, i) => `/images/gdc/gdc-projects-b64/${String(i + 1).padStart(2, "0")}.txt`,
);

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
};

const STUDY_TASKS: StudyTask[] = [
  {
    id: "program",
    label: "Program",
    cue: "این داده‌ها باید از کدام برنامه پژوهشی بزرگ بیایند؟",
    target: "TCGA",
    options: ["TCGA", "TARGET", "CPTAC"],
    hint: "در سناریو نام برنامه پژوهشی مستقیم آمده است.",
    rationale: "TCGA همان Program پژوهشی موردنظر این طراحی مطالعه است.",
    wrongFeedback: "به Program اشاره‌شده در سناریوی پژوهش برگردید؛ اینجا هدف ما TCGA است.",
  },
  {
    id: "primarySite",
    label: "Primary Site",
    cue: "محل اولیه تومور را روی کدام گزینه محدود می‌کنید؟",
    target: "breast",
    options: ["breast", "colon", "bronchus and lung"],
    hint: "Primary Site درباره محل آناتومیکی شروع تومور است.",
    rationale: "چون سؤال درباره سرطان پستان است، Primary Site باید breast باشد.",
    wrongFeedback: "این فیلتر محل اولیه تومور را می‌پرسد؛ در سناریوی ما محل هدف پستان است.",
  },
  {
    id: "diseaseType",
    label: "Disease Type",
    cue: "برای نوع پاتولوژیک بیماری کدام گزینه با سناریو سازگارتر است؟",
    target: "Ductal and Lobular Neoplasms",
    options: [
      "Ductal and Lobular Neoplasms",
      "Squamous Cell Neoplasms",
      "Adenomas and Adenocarcinomas",
    ],
    hint: "سناریو به تومورهای داکتال و لوبولار پستان اشاره می‌کند؛ این همان سطح Disease Type است.",
    rationale: "Ductal and Lobular Neoplasms ماهیت پاتولوژیک هدف را مشخص می‌کند و با Primary Site = breast یکی نیست.",
    wrongFeedback: "Primary Site را با Disease Type قاطی نکنید؛ اینجا باید نوع پاتولوژیک داکتال/لوبولار را انتخاب کنید.",
  },
  {
    id: "dataCategory",
    label: "Data Category",
    cue: "برای بررسی بیان ژن، کدام خانواده داده مناسب‌تر است؟",
    target: "Transcriptome Profiling",
    options: ["Transcriptome Profiling", "Clinical", "Simple Nucleotide Variation"],
    hint: "بیان ژن به داده‌های RNA و پروفایل ترنسکریپتوم مربوط است.",
    rationale: "Transcriptome Profiling خانواده داده‌ای است که برای سؤال بیان ژن به آن نیاز داریم.",
    wrongFeedback: "انتخاب شما ممکن است مفید باشد، اما به‌تنهایی سؤال اصلی ما درباره بیان ژن را هدف نمی‌گیرد.",
  },
  {
    id: "experimentalStrategy",
    label: "Experimental Strategy",
    cue: "داده موردنظر باید با کدام روش تولید شده باشد؟",
    target: "RNA-Seq",
    options: ["RNA-Seq", "WXS", "WGS"],
    hint: "در سناریو روش تولید داده مشخص شده و با تحلیل بیان ژن هم سازگار است.",
    rationale: "RNA-Seq روش تولید داده‌ای است که در این طراحی برای بررسی بیان ژن می‌خواهیم.",
    wrongFeedback: "WXS و WGS برای سؤال‌های ژنومی مهم‌اند، اما این سناریو مشخصاً داده RNA-Seq می‌خواهد.",
  },
];

const FILTER_BOXES: Record<GdcFacetId, { x: number; y: number; width: number; height: number }> = {
  primarySite: { x: 1, y: 48, width: 20, height: 7 },
  program: { x: 1, y: 55.5, width: 20, height: 7 },
  diseaseType: { x: 1, y: 63, width: 20, height: 7 },
  dataCategory: { x: 1, y: 70.5, width: 20, height: 7 },
  experimentalStrategy: { x: 1, y: 78, width: 20, height: 14 },
};

function useProjectsImage() {
  const [src, setSrc] = useState("");

  useEffect(() => {
    let active = true;
    Promise.all(PROJECT_PARTS.map(async (path) => {
      const response = await fetch(path);
      if (!response.ok) throw new Error(path);
      return response.text();
    }))
      .then((parts) => {
        if (active) setSrc(`data:image/webp;base64,${parts.join("")}`);
      })
      .catch(() => {
        if (active) setSrc("");
      });

    return () => {
      active = false;
    };
  }, []);

  return src;
}

function hotspotStyle(id: GdcFacetId) {
  const box = FILTER_BOXES[id];
  return {
    left: `${box.x}%`,
    top: `${box.y}%`,
    width: `${box.width}%`,
    height: `${box.height}%`,
  };
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
  const src = useProjectsImage();
  const [mode, setMode] = useState<StudyMode>("guided");
  const [answers, setAnswers] = useState<Partial<Record<GdcFacetId, string>>>({});
  const [activeFilter, setActiveFilter] = useState<GdcFacetId>("program");
  const [confidence, setConfidence] = useState<"low" | "medium" | "high" | null>(null);

  const correctCount = useMemo(
    () => STUDY_TASKS.filter((task) => answers[task.id] === task.target).length,
    [answers],
  );
  const complete = correctCount === STUDY_TASKS.length;

  function resetStudy() {
    setAnswers({});
    setActiveFilter("program");
    setConfidence(null);
  }

  return (
    <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.55fr)_500px]">
      <div className="xl:sticky xl:top-5 xl:self-start">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3" dir="rtl">
            <div>
              <div className="text-xs font-black text-teal-700">نمای زنده محل فیلترها</div>
              <div className="mt-1 text-sm font-bold text-slate-700">
                اکنون روی <span dir="ltr" className="font-black text-slate-950">{STUDY_TASKS.find((task) => task.id === activeFilter)?.label}</span> تمرکز کرده‌ایم.
              </div>
            </div>
            <div className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-black text-slate-600">{correctCount} / {STUDY_TASKS.length} فیلتر درست</div>
          </div>

          <div className="relative" dir="ltr">
            {src ? (
              <img src={src} alt="صفحه Projects در GDC برای تمرین طراحی مطالعه" className="block w-full" />
            ) : (
              <div className="flex aspect-[1905/847] items-center justify-center bg-slate-100 text-sm font-bold text-slate-400">
                در حال بارگذاری اسکرین‌شات Projects…
              </div>
            )}

            {src ? STUDY_TASKS.map((task) => {
              const selected = answers[task.id];
              const correct = selected === task.target;
              const active = activeFilter === task.id;
              return (
                <button
                  key={task.id}
                  type="button"
                  aria-label={`تمرکز روی ${task.label}`}
                  onClick={() => setActiveFilter(task.id)}
                  style={hotspotStyle(task.id)}
                  className={`absolute rounded-md border-[3px] transition ${
                    active
                      ? "border-teal-400 bg-teal-300/20 shadow-[0_0_0_999px_rgba(15,23,42,.08)]"
                      : correct
                        ? "border-emerald-400 bg-emerald-300/10"
                        : selected
                          ? "border-rose-300 bg-rose-200/10"
                          : "border-transparent hover:border-sky-300 hover:bg-sky-200/10"
                  }`}
                />
              );
            }) : null}
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-5" dir="rtl">
          {["TCGA", "breast", "Ductal / Lobular", "Gene Expression", "RNA-Seq"].map((chip) => (
            <div key={chip} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-center text-xs font-black text-slate-700 shadow-sm" dir="ltr">
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
            می‌خواهیم <b>بیان ژن</b> را در <b>تومورهای داکتال و لوبولار پستان</b>، با استفاده از داده‌های <b dir="ltr">TCGA</b> و روش <b dir="ltr">RNA-Seq</b> بررسی کنیم.
          </p>
          <p className="mt-2 text-xs leading-6 text-violet-900/75">
            مأموریت شما: سؤال پژوهشی را به پنج فیلتر GDC تبدیل کنید و به Project هدف این تمرین برسید.
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
            const active = activeFilter === task.id;

            return (
              <section
                key={task.id}
                className={`rounded-2xl border p-4 transition ${
                  active ? "border-teal-300 bg-teal-50/40" : "border-slate-200 bg-white"
                }`}
                onClick={() => setActiveFilter(task.id)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-900 text-[11px] font-black text-white">{index + 1}</span>
                      <b dir="ltr" className="text-sm text-slate-950">{task.label}</b>
                    </div>
                    <p className="mt-2 text-xs leading-6 text-slate-600">{task.cue}</p>
                  </div>
                  {isCorrect ? <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" /> : null}
                </div>

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
                          setActiveFilter(task.id);
                          setAnswers((current) => ({ ...current, [task.id]: option }));
                          setConfidence(null);
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

                {mode === "guided" && !selected ? (
                  <div className="mt-3 flex items-start gap-2 rounded-xl bg-amber-50 px-3 py-2 text-xs leading-6 text-amber-900">
                    <Lightbulb className="mt-1 h-4 w-4 shrink-0" />
                    <span><b>Hint:</b> {task.hint}</span>
                  </div>
                ) : null}

                {isCorrect ? (
                  <div className="mt-3 rounded-xl bg-emerald-50 px-3 py-2 text-xs leading-6 text-emerald-900">
                    <b>چرا درست است؟</b> {task.rationale}
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
            <span className="text-xs font-black text-teal-700">{Math.round((correctCount / STUDY_TASKS.length) * 100)}٪</span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
            <div className="h-full rounded-full bg-teal-600 transition-all" style={{ width: `${(correctCount / STUDY_TASKS.length) * 100}%` }} />
          </div>
        </div>

        {complete ? (
          <div className="mt-4 rounded-2xl border border-teal-200 bg-teal-50 p-4">
            <div className="flex items-center gap-2 text-sm font-black text-teal-900"><CheckCircle2 className="h-5 w-5" /> طراحی مطالعه کامل شد</div>
            <div className="mt-3 rounded-xl bg-white p-4">
              <div className="text-xs font-bold text-slate-500">Project هدف این تمرین</div>
              <div className="mt-1 text-xl font-black text-slate-950" dir="ltr">TCGA-BRCA</div>
              <div className="mt-3 grid gap-2 text-xs sm:grid-cols-2">
                {STUDY_TASKS.map((task) => (
                  <div key={task.id} className="rounded-lg bg-slate-50 px-3 py-2">
                    <b dir="ltr">{task.label}</b>
                    <div className="mt-1 text-slate-600" dir="ltr">{task.target}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <div className="text-xs font-black text-teal-900">قبل از ادامه، چقدر به انتخابت مطمئنی؟</div>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {([
                  ["low", "کم"],
                  ["medium", "متوسط"],
                  ["high", "زیاد"],
                ] as const).map(([value, label]) => (
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
                    ? "انتخاب‌ها درست‌اند؛ در مرحله بعد با شواهد Project و نوع داده، اطمینانت را بیشتر می‌کنیم."
                    : confidence === "medium"
                      ? "طراحی درست است؛ مرحله بعد کمک می‌کند سازگاری داده را دقیق‌تر تأیید کنی."
                      : "عالی؛ حالا وقت آن است که Project انتخاب‌شده را از نظر داده واقعی بررسی کنیم."}
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
