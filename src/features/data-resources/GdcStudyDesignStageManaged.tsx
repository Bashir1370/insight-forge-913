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

import type { GdcFacetId, GdcGuideHotspot } from "./gdc-question-guide-config";
import type { GdcStudyDesignConfig, GdcStudyTaskConfig } from "./gdc-study-design-config";

const PROJECT_PARTS = Array.from(
  { length: 7 },
  (_, i) => `/images/gdc/gdc-projects-b64/${String(i + 1).padStart(2, "0")}.txt`,
);

const FALLBACK_SCREENSHOT_PATHS: Record<GdcFacetId, string> = {
  primarySite: "/images/gdc/study-design-kidney/step-1.txt",
  program: "/images/gdc/study-design-kidney/step-2.txt",
  diseaseType: "/images/gdc/study-design-kidney/step-3.txt",
  dataCategory: "/images/gdc/study-design-kidney/step-4.txt",
  experimentalStrategy: "/images/gdc/study-design-kidney/step-5.txt",
};

type StudyMode = "guided" | "challenge";
type Confidence = "low" | "medium" | "high";

function hotspotStyle(item: GdcGuideHotspot) {
  return {
    left: `${item.x}%`,
    top: `${item.y}%`,
    width: `${item.width}%`,
    height: `${item.height}%`,
  };
}

function useFallbackImages() {
  const [baseline, setBaseline] = useState("");
  const [steps, setSteps] = useState<Partial<Record<GdcFacetId, string>>>({});

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
      .catch(() => active && setBaseline(""));

    Promise.all(
      (Object.entries(FALLBACK_SCREENSHOT_PATHS) as Array<[GdcFacetId, string]>).map(async ([id, path]) => {
        const response = await fetch(path);
        if (!response.ok) throw new Error(path);
        return [id, `data:image/webp;base64,${(await response.text()).trim()}`] as const;
      }),
    )
      .then((entries) => {
        if (active) setSteps(Object.fromEntries(entries) as Partial<Record<GdcFacetId, string>>);
      })
      .catch(() => active && setSteps({}));

    return () => {
      active = false;
    };
  }, []);

  return { baseline, steps };
}

export function GdcStudyDesignStageManaged({
  title,
  stageNumber,
  stageTotal,
  config,
  onPrevious,
  onNext,
}: {
  title: string;
  stageNumber: number;
  stageTotal: number;
  config: GdcStudyDesignConfig;
  onPrevious: () => void;
  onNext: () => void;
}) {
  const fallback = useFallbackImages();
  const [mode, setMode] = useState<StudyMode>("guided");
  const [answers, setAnswers] = useState<Partial<Record<GdcFacetId, string>>>({});
  const [activeFilter, setActiveFilter] = useState<GdcFacetId | null>(null);
  const [confidence, setConfidence] = useState<Confidence | null>(null);

  const tasks = useMemo(() => config.tasks.filter((task) => task.enabled), [config.tasks]);

  useEffect(() => {
    if (!activeFilter || !tasks.some((task) => task.id === activeFilter)) {
      setActiveFilter(tasks[0]?.id ?? null);
    }
  }, [activeFilter, tasks]);

  const completedPrefix = useMemo(() => {
    let count = 0;
    for (const task of tasks) {
      if (answers[task.id] !== task.target) break;
      count += 1;
    }
    return count;
  }, [answers, tasks]);

  const complete = tasks.length > 0 && completedPrefix === tasks.length;
  const latestTask = completedPrefix > 0 ? tasks[completedPrefix - 1] : null;
  const currentTask = completedPrefix < tasks.length ? tasks[completedPrefix] : tasks[tasks.length - 1] ?? null;
  const currentImage = latestTask
    ? latestTask.imageUrl || fallback.steps[latestTask.id] || config.baselineImageUrl || fallback.baseline
    : config.baselineImageUrl || fallback.baseline;
  const currentHotspots = latestTask?.hotspots ?? config.baselineHotspots;
  const visibleProjectCount = latestTask?.projectCount ?? config.initialProjectCount;

  function resetStudy() {
    setAnswers({});
    setActiveFilter(tasks[0]?.id ?? null);
    setConfidence(null);
  }

  function chooseAnswer(task: GdcStudyTaskConfig, taskIndex: number, option: string) {
    setAnswers((current) => {
      const next = { ...current, [task.id]: option };
      for (const downstream of tasks.slice(taskIndex + 1)) {
        delete next[downstream.id];
      }
      return next;
    });
    setActiveFilter(task.id);
    setConfidence(null);

    if (option === task.target && taskIndex < tasks.length - 1) {
      window.setTimeout(() => setActiveFilter(tasks[taskIndex + 1].id), 180);
    }
  }

  const imageStyle = config.imageHeight > 0
    ? { height: `${config.imageHeight}px`, objectFit: config.imageFit }
    : { objectFit: config.imageFit };

  return (
    <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.65fr)_500px]">
      <div className="xl:sticky xl:top-5 xl:self-start">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3" dir="rtl">
            <div>
              <div className="text-xs font-black text-teal-700">{config.liveTitle}</div>
              <div className="mt-1 text-sm font-bold text-slate-700">
                {latestTask ? latestTask.resultCaption : config.initialCaption}
              </div>
            </div>
            <div className="rounded-full bg-slate-950 px-3 py-1.5 text-xs font-black text-white" dir="ltr">
              {visibleProjectCount} Projects
            </div>
          </div>

          <div className="relative overflow-hidden bg-slate-100" dir="ltr">
            {currentImage ? (
              <img
                key={`${completedPrefix}-${currentImage}`}
                src={currentImage}
                alt={`GDC Projects after ${completedPrefix} study filters`}
                className="block w-full transition-opacity duration-300"
                style={imageStyle}
              />
            ) : (
              <div className="flex aspect-[1905/847] items-center justify-center text-sm font-bold text-slate-400">
                تصویری برای این مرحله تعریف نشده است.
              </div>
            )}

            {currentImage ? currentHotspots.map((hotspot) => (
              <div
                key={hotspot.key}
                className="pointer-events-none absolute rounded-md border-[3px] border-teal-400 bg-teal-300/15 shadow-sm"
                style={hotspotStyle(hotspot)}
              >
                <span className="absolute left-1 top-1 max-w-[90%] rounded bg-slate-950/90 px-2 py-1 text-[10px] font-black text-white shadow">
                  {hotspot.title}
                </span>
              </div>
            )) : null}
          </div>

          <div className="border-t bg-slate-50 px-4 py-3" dir="rtl">
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-black">
              <span className="rounded-full bg-slate-900 px-3 py-1.5 text-white" dir="ltr">{config.initialProjectCount}</span>
              {tasks.map((task, index) => {
                const done = completedPrefix > index;
                return (
                  <div key={task.id} className="flex items-center gap-2">
                    <span className="text-slate-300">←</span>
                    <span className={`rounded-full border px-3 py-1.5 ${done ? "border-teal-300 bg-teal-50 text-teal-800" : "border-slate-200 bg-white text-slate-400"}`}>
                      <span dir="ltr">{task.label}</span> · {task.projectCount}
                    </span>
                  </div>
                );
              })}
            </div>
            {completedPrefix >= Math.min(4, tasks.length) && config.researchNote ? (
              <p className="mt-2 text-xs leading-6 text-slate-600">{config.researchNote}</p>
            ) : null}
          </div>
        </div>

        {config.chips.length ? (
          <div className="mt-4 grid gap-2 sm:grid-cols-5" dir="rtl">
            {config.chips.map((chip, index) => (
              <div key={`${chip}-${index}`} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-center text-[11px] font-black text-slate-700 shadow-sm" dir="ltr">
                {chip}
              </div>
            ))}
          </div>
        ) : null}
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
            <RotateCcw className="h-4 w-4" /> {config.restartLabel}
          </button>
        </div>

        <div className="mt-5 rounded-2xl border border-violet-100 bg-violet-50/70 p-4">
          <div className="flex items-center gap-2 text-xs font-black text-violet-800"><FlaskConical className="h-4 w-4" /> {config.scenarioLabel}</div>
          <p className="mt-2 whitespace-pre-line text-sm font-bold leading-7 text-violet-950">{config.scenarioBody}</p>
          {config.scenarioHelp ? <p className="mt-2 whitespace-pre-line text-xs leading-6 text-violet-900/75">{config.scenarioHelp}</p> : null}
        </div>

        <div className="mt-4 flex rounded-xl bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => setMode("guided")}
            className={`flex-1 rounded-lg px-3 py-2 text-xs font-black ${mode === "guided" ? "bg-white text-teal-800 shadow-sm" : "text-slate-500"}`}
          >
            {config.guidedLabel}
          </button>
          <button
            type="button"
            onClick={() => setMode("challenge")}
            className={`flex-1 rounded-lg px-3 py-2 text-xs font-black ${mode === "challenge" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}
          >
            {config.challengeLabel}
          </button>
        </div>

        {!tasks.length ? (
          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-bold text-amber-900">
            هیچ فیلتر فعالی برای مرحله ۳ تعریف نشده است. از پنل مدیریت حداقل یک فیلتر را فعال کنید.
          </div>
        ) : null}

        <div className="mt-4 space-y-3">
          {tasks.map((task, index) => {
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
                    <p className="mt-2 whitespace-pre-line text-xs leading-6 text-slate-600">{task.cue}</p>
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

                {mode === "guided" && !selected && !locked && task.hint ? (
                  <div className="mt-3 flex items-start gap-2 rounded-xl bg-amber-50 px-3 py-2 text-xs leading-6 text-amber-900">
                    <Lightbulb className="mt-1 h-4 w-4 shrink-0" />
                    <span><b>Hint:</b> {task.hint}</span>
                  </div>
                ) : null}

                {isCorrect && task.rationale ? (
                  <div className="mt-3 rounded-xl bg-emerald-50 px-3 py-2 text-xs leading-6 text-emerald-900">
                    <b>درست.</b> {task.rationale}
                  </div>
                ) : null}

                {isWrong && task.wrongFeedback ? (
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
            <div className="flex items-center gap-2 text-xs font-black text-slate-700"><Target className="h-4 w-4" /> {config.progressTitle}</div>
            <span className="text-xs font-black text-teal-700">{tasks.length ? Math.round((completedPrefix / tasks.length) * 100) : 0}٪</span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
            <div className="h-full rounded-full bg-teal-600 transition-all" style={{ width: `${tasks.length ? (completedPrefix / tasks.length) * 100 : 0}%` }} />
          </div>
        </div>

        {complete ? (
          <div className="mt-4 rounded-2xl border border-teal-200 bg-teal-50 p-4">
            <div className="flex items-center gap-2 text-sm font-black text-teal-900"><CheckCircle2 className="h-5 w-5" /> {config.finalTitle}</div>
            {config.finalBody ? <p className="mt-2 whitespace-pre-line text-xs leading-6 text-teal-900/80">{config.finalBody}</p> : null}

            {config.candidateProjects.length ? (
              <div className="mt-3 grid gap-2 sm:grid-cols-3" dir="ltr">
                {config.candidateProjects.map((project, index) => (
                  <div key={`${project}-${index}`} className="rounded-xl bg-white px-3 py-3 text-center text-sm font-black text-slate-950 shadow-sm">{project}</div>
                ))}
              </div>
            ) : null}

            <div className="mt-4">
              <div className="text-xs font-black text-teal-900">{config.confidenceQuestion}</div>
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
                <p className="mt-2 whitespace-pre-line text-xs leading-6 text-teal-900/75">
                  {confidence === "low"
                    ? config.confidenceLowFeedback
                    : confidence === "medium"
                      ? config.confidenceMediumFeedback
                      : config.confidenceHighFeedback}
                </p>
              ) : null}
            </div>
          </div>
        ) : null}

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button onClick={onPrevious} className="rounded-xl border px-4 py-3 text-sm font-bold">
            <ChevronRight className="inline h-4 w-4" /> {config.previousButton}
          </button>
          <button
            onClick={onNext}
            disabled={!complete}
            className="rounded-xl bg-teal-700 px-4 py-3 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            {config.nextButton} <ChevronLeft className="inline h-4 w-4" />
          </button>
        </div>
      </aside>
    </div>
  );
}
