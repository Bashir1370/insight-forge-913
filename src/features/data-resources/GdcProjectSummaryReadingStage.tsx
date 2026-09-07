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
import { useEffect, useMemo, useState } from "react";

import type {
  GdcProjectSummaryConfig,
  GdcProjectSummaryHotspot,
} from "./gdc-project-summary-config";

function hotspotStyle(item: GdcProjectSummaryHotspot) {
  return {
    left: `${item.x}%`,
    top: `${item.y}%`,
    width: `${item.width}%`,
    height: `${item.height}%`,
  };
}

function HotspotIcon({ hotspotKey }: { hotspotKey: string }) {
  if (hotspotKey === "save-cohort") return <Users className="h-5 w-5" />;
  if (hotspotKey === "biospecimen") return <Microscope className="h-5 w-5" />;
  if (hotspotKey === "clinical") return <Database className="h-5 w-5" />;
  if (hotspotKey === "manifest") return <FileDown className="h-5 w-5" />;
  if (hotspotKey === "project-counts") return <Files className="h-5 w-5" />;
  if (hotspotKey === "data-category") return <Database className="h-5 w-5" />;
  if (hotspotKey === "experimental-strategy") return <FlaskConical className="h-5 w-5" />;
  return <Info className="h-5 w-5" />;
}

export function GdcProjectSummaryReadingStage({
  config,
  stageNumber,
  stageTotal,
  onPrevious,
}: {
  config: GdcProjectSummaryConfig;
  stageNumber: number;
  stageTotal: number;
  onPrevious: () => void;
}) {
  const [selectedKey, setSelectedKey] = useState<string>(() => {
    if (config.hotspots.some((item) => item.key === "data-category")) return "data-category";
    return config.hotspots[0]?.key ?? "";
  });
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    if (!config.hotspots.some((item) => item.key === selectedKey)) {
      setSelectedKey(config.hotspots[0]?.key ?? "");
    }
  }, [config.hotspots, selectedKey]);

  useEffect(() => {
    setShowAnswer(false);
  }, [config.quizQuestion, config.quizAnswer]);

  const selected = useMemo(
    () => config.hotspots.find((item) => item.key === selectedKey) ?? config.hotspots[0] ?? null,
    [config.hotspots, selectedKey],
  );

  return (
    <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.75fr)_420px]">
      <div className="xl:sticky xl:top-5 xl:self-start">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 bg-white px-4 py-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-xs font-black text-teal-700">{config.mapEyebrow}</div>
                <div className="mt-1 text-sm font-bold text-slate-600">{config.mapInstruction}</div>
              </div>
              {config.badge ? (
                <div className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold text-slate-500">
                  {config.badge}
                </div>
              ) : null}
            </div>
          </div>

          <div className="relative" dir="ltr">
            {config.imageUrl ? (
              <img
                src={config.imageUrl}
                alt="Project Summary در GDC"
                className="block w-full"
              />
            ) : (
              <div className="flex aspect-[1911/870] items-center justify-center bg-slate-100 text-sm font-bold text-slate-400">
                تصویری برای این مرحله انتخاب نشده است.
              </div>
            )}

            {config.imageUrl
              ? config.hotspots.map((item) => {
                  const active = selected?.key === item.key;
                  return (
                    <button
                      key={item.key}
                      type="button"
                      aria-label={`توضیح ${item.label}`}
                      aria-pressed={active}
                      onClick={() => setSelectedKey(item.key)}
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
                })
              : null}
          </div>
        </div>

        {config.hotspots.length ? (
          <div className="mt-3 flex flex-wrap gap-2" dir="rtl">
            {config.hotspots.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setSelectedKey(item.key)}
                className={`rounded-full px-3 py-2 text-[11px] font-black transition ${
                  selected?.key === item.key
                    ? "bg-teal-700 text-white"
                    : "bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-teal-200"
                }`}
              >
                <span dir="ltr">{item.label}</span>
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <aside className="rounded-2xl border bg-white p-5 shadow-sm sm:p-6">
        <div className="text-xs font-black text-teal-700">
          مرحله {stageNumber} از {stageTotal}
        </div>
        <h2 className="mt-2 text-2xl font-black">{config.title}</h2>
        {config.intro ? (
          <p className="mt-3 text-sm leading-7 text-slate-600">{config.intro}</p>
        ) : null}

        {(config.goalTitle || config.goalBody) ? (
          <div className="mt-5 rounded-2xl border border-teal-100 bg-teal-50/70 p-4">
            {config.goalTitle ? (
              <div className="flex items-center gap-2 text-xs font-black text-teal-900">
                <BookOpenCheck className="h-4 w-4" />
                {config.goalTitle}
              </div>
            ) : null}
            {config.goalBody ? (
              <p className="mt-2 text-sm leading-7 text-teal-950/80">{config.goalBody}</p>
            ) : null}
          </div>
        ) : null}

        {selected ? (
          <div className="mt-4 rounded-2xl border border-slate-200 p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div dir="ltr" className="text-sm font-black text-slate-950">{selected.label}</div>
                <div className="mt-1 text-xs font-bold leading-6 text-teal-700">{selected.short}</div>
              </div>
              <div className="shrink-0 rounded-xl bg-slate-100 p-2 text-slate-600">
                <HotspotIcon hotspotKey={selected.key} />
              </div>
            </div>

            {selected.body ? (
              <p className="mt-3 text-sm leading-7 text-slate-700">{selected.body}</p>
            ) : null}

            {selected.researchUse ? (
              <div className="mt-3 rounded-xl bg-sky-50 p-3">
                <div className="flex items-center gap-2 text-xs font-black text-sky-900">
                  <Info className="h-4 w-4" />
                  برای پژوهش من چه کاربردی دارد؟
                </div>
                <p className="mt-2 text-xs leading-6 text-sky-950/80">{selected.researchUse}</p>
              </div>
            ) : null}

            {selected.caution ? (
              <div className="mt-3 rounded-xl border border-amber-100 bg-amber-50 p-3">
                <div className="flex items-center gap-2 text-xs font-black text-amber-900">
                  <AlertTriangle className="h-4 w-4" />
                  اشتباه رایج
                </div>
                <p className="mt-2 text-xs leading-6 text-amber-950/80">{selected.caution}</p>
              </div>
            ) : null}
          </div>
        ) : null}

        {config.quickChecks.length ? (
          <div className="mt-4 rounded-2xl border border-slate-200 p-4">
            <div className="text-xs font-black text-slate-700">{config.quickChecksTitle}</div>
            <div className="mt-3 space-y-2">
              {config.quickChecks.map((item, index) => (
                <div
                  key={`${item.title}-${index}`}
                  className="grid grid-cols-[28px_minmax(0,1fr)] gap-3 rounded-xl bg-slate-50 p-3"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-teal-100 text-xs font-black text-teal-800">
                    {index + 1}
                  </div>
                  <div>
                    <div className="text-xs font-black text-slate-800">{item.title}</div>
                    <p className="mt-1 text-xs leading-5 text-slate-500">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {(config.quizTitle || config.quizQuestion) ? (
          <div className="mt-4 rounded-2xl border border-violet-100 bg-violet-50/60 p-4">
            {config.quizTitle ? (
              <div className="text-xs font-black text-violet-900">{config.quizTitle}</div>
            ) : null}
            {config.quizQuestion ? (
              <p className="mt-2 text-sm font-bold leading-7 text-violet-950">{config.quizQuestion}</p>
            ) : null}

            {showAnswer ? (
              <div className="mt-3 rounded-xl bg-white p-3 text-xs leading-6 text-violet-950/80">
                {config.quizAnswer}
              </div>
            ) : config.quizAnswer ? (
              <button
                type="button"
                onClick={() => setShowAnswer(true)}
                className="mt-3 w-full rounded-xl border border-violet-200 bg-white px-4 py-2.5 text-xs font-black text-violet-800"
              >
                {config.quizButtonLabel || "پاسخ را ببین"}
              </button>
            ) : null}
          </div>
        ) : null}

        {(config.numbersTitle || config.numbersBody) ? (
          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            {config.numbersTitle ? (
              <div className="text-xs font-black text-slate-700">{config.numbersTitle}</div>
            ) : null}
            {config.numbersBody ? (
              <p className="mt-2 text-xs leading-6 text-slate-500">{config.numbersBody}</p>
            ) : null}
          </div>
        ) : null}

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
