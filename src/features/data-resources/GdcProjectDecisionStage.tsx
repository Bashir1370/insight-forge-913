import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Info,
} from "lucide-react";

import { useGdcProjectDecisionConfig } from "./GdcProjectDecisionContext";

export function GdcProjectDecisionStage(props: {
  title: string;
  stageNumber: number;
  stageTotal: number;
  onPrevious: () => void;
  onNext: () => void;
}) {
  const { stageNumber, stageTotal, onPrevious, onNext } = props;
  const config = useGdcProjectDecisionConfig();

  return (
    <div className="mt-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7" dir="rtl">
      <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="text-xs font-black text-teal-700">مرحله {stageNumber} از {stageTotal}</div>
          <h2 className="mt-2 text-2xl font-black text-slate-950 sm:text-3xl">{config.title}</h2>
          <p className="mt-3 max-w-4xl text-sm leading-8 text-slate-600">{config.introBody}</p>
        </div>

        <div className="flex shrink-0 items-center gap-2 text-xs font-black" dir="ltr">
          {config.progressSteps.map((step, index) => (
            <div key={`${step}-${index}`} className="contents">
              <span className="rounded-full bg-slate-100 px-3 py-2 text-slate-500">{step}</span>
              <span className="text-slate-300">→</span>
            </div>
          ))}
          <span className="rounded-full bg-teal-700 px-3 py-2 text-white" dir="rtl">{config.progressFinalLabel}</span>
        </div>
      </div>

      <section className="mt-6 rounded-2xl border border-violet-100 bg-violet-50/45 p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-violet-700" />
          <div>
            <h3 className="text-lg font-black text-violet-950">{config.comparisonTitle}</h3>
            <p className="mt-2 text-sm leading-8 text-violet-950/80">{config.comparisonBody}</p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-3" dir="ltr">
          {config.projects.map((project, index) => (
            <div key={`${project.id}-${index}`} className="rounded-2xl border border-violet-100 bg-white p-5 text-left shadow-sm">
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
          <p className="text-sm leading-8 text-slate-700">{config.hierarchySummary}</p>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-sky-100 bg-sky-50/55 p-5 sm:p-6">
        <h3 className="text-lg font-black text-sky-950">{config.abbreviationsTitle}</h3>
        <p className="mt-2 text-sm leading-8 text-sky-950/80">{config.abbreviationsBody}</p>

        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5" dir="ltr">
          {config.abbreviations.map((item, index) => (
            <div key={`${item.abbr}-${index}`} className="rounded-xl border border-sky-100 bg-white p-4 text-left">
              <div className="text-base font-black text-sky-950">{item.abbr}</div>
              <div className="mt-1 text-xs font-bold leading-5 text-slate-700">{item.full}</div>
              <p className="mt-3 text-xs leading-6 text-slate-500" dir="rtl">{item.meaning}</p>
            </div>
          ))}
        </div>

        {config.abbreviationFormula ? (
          <div className="mt-4 rounded-xl bg-white p-4 text-center text-sm font-black text-slate-800" dir="ltr">
            {config.abbreviationFormula}
          </div>
        ) : null}
      </section>

      <section className="mt-6 rounded-2xl border border-teal-100 bg-teal-50/65 p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-teal-700" />
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-black text-teal-950">{config.conclusionTitle}</h3>
            <p className="mt-2 text-sm leading-8 text-teal-950/80">{config.conclusionBody}</p>
            {config.conclusionCards.length ? (
              <div className="mt-4 grid gap-2 md:grid-cols-3">
                {config.conclusionCards.map((card, index) => (
                  <div key={index} className="rounded-xl bg-white p-4 text-sm leading-7 text-slate-700">{card}</div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <button onClick={onPrevious} className="rounded-xl border px-4 py-3 text-sm font-bold">
          <ChevronRight className="inline h-4 w-4" /> {config.previousButton}
        </button>
        <button onClick={onNext} className="rounded-xl bg-teal-700 px-4 py-3 text-sm font-black text-white">
          {config.nextButton} <ChevronLeft className="inline h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
