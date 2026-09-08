import {
  AlertTriangle,
  BookOpenCheck,
  ChevronLeft,
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

import {
  GdcHotspotArrow,
  type GdcHotspotArrowSettings,
} from "./GdcHotspotArrow";
import { useGdcProjectSummaryConfig } from "./GdcProjectSummaryContext";
import type {
  GdcProjectSummaryConfig,
  GdcProjectSummaryHotspot,
} from "./gdc-project-summary-config";

type ProjectSummaryWithArrowSettings = GdcProjectSummaryConfig & {
  hotspotArrowSettings?: Record<string, GdcHotspotArrowSettings>;
};

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

function HotspotSlide({ hotspot }: { hotspot: GdcProjectSummaryHotspot }) {
  return (
    <div>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div dir="ltr" className="text-left text-sm font-black text-slate-950">{hotspot.label}</div>
          <div className="mt-1 text-xs font-bold leading-6 text-teal-700">{hotspot.short}</div>
        </div>
        <div className="shrink-0 rounded-xl bg-slate-100 p-2 text-slate-600">
          <HotspotIcon hotspotKey={hotspot.key} />
        </div>
      </div>

      {hotspot.body ? (
        <p className="mt-4 text-sm leading-8 text-slate-700">{hotspot.body}</p>
      ) : null}

      {hotspot.researchUse ? (
        <div className="mt-4 rounded-xl border border-sky-100 bg-sky-50/70 p-3">
          <div className="flex items-center gap-2 text-xs font-black text-sky-900">
            <Info className="h-4 w-4" />
            برای پژوهش من چه کاربردی دارد؟
          </div>
          <p className="mt-2 text-xs leading-6 text-sky-950/80">{hotspot.researchUse}</p>
        </div>
      ) : null}

      {hotspot.caution ? (
        <div className="mt-3 rounded-xl border border-amber-100 bg-amber-50 p-3">
          <div className="flex items-center gap-2 text-xs font-black text-amber-900">
            <AlertTriangle className="h-4 w-4" />
            اشتباه رایج
          </div>
          <p className="mt-2 text-xs leading-6 text-amber-950/80">{hotspot.caution}</p>
        </div>
      ) : null}
    </div>
  );
}

export function GdcProjectSummaryReadingStage({
  config: configProp,
  stageNumber,
  stageTotal,
  onPrevious,
}: {
  config?: GdcProjectSummaryConfig;
  title?: string;
  stageNumber: number;
  stageTotal: number;
  onPrevious: () => void;
}) {
  const managedConfig = useGdcProjectSummaryConfig();
  const config = configProp ?? managedConfig;
  const arrowSettingsMap =
    (config as ProjectSummaryWithArrowSettings).hotspotArrowSettings ?? {};
  const [activeSlide, setActiveSlide] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const slideLabels = useMemo(
    () => ["شروع", ...config.hotspots.map((item) => item.label), "جمع‌بندی"],
    [config.hotspots],
  );

  const finalSlideIndex = slideLabels.length - 1;
  const selected =
    activeSlide > 0 && activeSlide < finalSlideIndex
      ? config.hotspots[activeSlide - 1] ?? null
      : null;

  useEffect(() => {
    if (activeSlide > finalSlideIndex) setActiveSlide(finalSlideIndex);
  }, [activeSlide, finalSlideIndex]);

  useEffect(() => {
    setShowAnswer(false);
  }, [config.quizQuestion, config.quizAnswer]);

  function openHotspot(key: string) {
    const index = config.hotspots.findIndex((item) => item.key === key);
    if (index >= 0) setActiveSlide(index + 1);
  }

  function previousSlide() {
    if (activeSlide > 0) {
      setActiveSlide((value) => value - 1);
      return;
    }
    onPrevious();
  }

  function nextSlide() {
    if (activeSlide < finalSlideIndex) {
      setActiveSlide((value) => value + 1);
    }
  }

  return (
    <div className="mt-5 grid items-start gap-5 xl:grid-cols-[minmax(0,1.9fr)_420px]" dir="ltr">
      <div className="xl:sticky xl:top-5 xl:self-start">
        <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_18px_55px_rgba(15,23,42,0.10)]">
          <div className="border-b border-slate-100 bg-white px-4 py-3" dir="rtl">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-xs font-black text-teal-700">{config.mapEyebrow}</div>
                <div className="mt-1 text-sm font-bold text-slate-600">{config.mapInstruction}</div>
                <div className="mt-1 text-[10px] font-bold text-slate-400">
                  نشانگر را روی بخش موردنظر ببرید؛ فلش همان لحظه ظاهر می‌شود و با کلیک، توضیح آن باز می‌شود.
                </div>
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
                loading="eager"
                decoding="async"
              />
            ) : (
              <div className="flex aspect-[1911/870] items-center justify-center bg-slate-100 text-sm font-bold text-slate-400">
                تصویری برای این مرحله انتخاب نشده است.
              </div>
            )}

            {config.imageUrl
              ? config.hotspots.map((item) => {
                  const directSettings = item as GdcProjectSummaryHotspot & GdcHotspotArrowSettings;
                  const savedSettings = arrowSettingsMap[item.key] ?? {};
                  return (
                    <GdcHotspotArrow
                      key={item.key}
                      item={{
                        key: item.key,
                        label: item.label,
                        x: item.x,
                        y: item.y,
                        width: item.width,
                        height: item.height,
                        arrowDirection:
                          savedSettings.arrowDirection ?? directSettings.arrowDirection,
                        arrowSize: savedSettings.arrowSize ?? directSettings.arrowSize,
                        arrowOffsetX:
                          savedSettings.arrowOffsetX ?? directSettings.arrowOffsetX,
                        arrowOffsetY:
                          savedSettings.arrowOffsetY ?? directSettings.arrowOffsetY,
                      }}
                      revealOnHover
                      onClick={() => openHotspot(item.key)}
                    />
                  );
                })
              : null}
          </div>
        </div>
      </div>

      <aside className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_16px_45px_rgba(15,23,42,0.07)]" dir="rtl">
        <div className="h-1 bg-gradient-to-l from-sky-400 via-teal-400 to-teal-700" />
        <div className="p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <span className="rounded-full border border-teal-100 bg-teal-50 px-3 py-1 text-[10px] font-black text-teal-700">
              مرحله {stageNumber} از {stageTotal}
            </span>
            <span className="text-[10px] font-bold text-slate-400">Project Summary</span>
          </div>

          <h2 className="mt-4 text-2xl font-black leading-9 text-slate-950">{config.title}</h2>

          <div className="mt-5 overflow-x-auto pb-1">
            <div className="flex min-w-max gap-1 rounded-xl bg-slate-100 p-1">
              {slideLabels.map((label, index) => (
                <button
                  key={`${label}-${index}`}
                  type="button"
                  title={label}
                  onClick={() => setActiveSlide(index)}
                  className={
                    activeSlide === index
                      ? "rounded-lg bg-white px-3 py-2 text-[10px] font-black text-teal-700 shadow-sm"
                      : "rounded-lg px-3 py-2 text-[10px] font-bold text-slate-500 transition hover:bg-white/70 hover:text-slate-800"
                  }
                >
                  <span dir={index > 0 && index < finalSlideIndex ? "ltr" : "rtl"}>{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 min-h-[410px] rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
            {activeSlide === 0 ? (
              <div>
                {config.intro ? (
                  <p className="text-sm leading-8 text-slate-700">{config.intro}</p>
                ) : null}

                {(config.goalTitle || config.goalBody) ? (
                  <div className="mt-4 rounded-2xl border border-teal-100 bg-teal-50/70 p-4">
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

                <div className="mt-4 rounded-xl border border-slate-200 bg-white p-3">
                  <div className="text-xs font-black text-slate-700">چطور این صفحه را بخوانیم؟</div>
                  <p className="mt-2 text-xs leading-6 text-slate-500">
                    از خود تصویر استفاده کنید: روی هر بخش بروید تا فلش همان ناحیه ظاهر شود و سپس کلیک کنید تا توضیح همان بخش در این پنل نمایش داده شود.
                  </p>
                </div>
              </div>
            ) : null}

            {selected ? <HotspotSlide hotspot={selected} /> : null}

            {activeSlide === finalSlideIndex ? (
              <div>
                {config.quickChecks.length ? (
                  <div>
                    <div className="text-xs font-black text-slate-800">{config.quickChecksTitle}</div>
                    <div className="mt-3 space-y-2">
                      {config.quickChecks.map((item, index) => (
                        <div
                          key={`${item.title}-${index}`}
                          className="grid grid-cols-[28px_minmax(0,1fr)] gap-3 rounded-xl border border-slate-200 bg-white p-3"
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
                  <div className="mt-4 rounded-xl border border-slate-200 bg-white p-3">
                    {config.numbersTitle ? (
                      <div className="text-xs font-black text-slate-700">{config.numbersTitle}</div>
                    ) : null}
                    {config.numbersBody ? (
                      <p className="mt-2 text-xs leading-6 text-slate-500">{config.numbersBody}</p>
                    ) : null}
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>

          <div className="mt-4 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={previousSlide}
              className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-bold text-slate-600"
            >
              <ChevronRight className="h-4 w-4" />
              {activeSlide === 0 ? "مرحله قبل" : "قبلی"}
            </button>

            <div className="text-[10px] font-black text-slate-400">
              {activeSlide + 1} / {slideLabels.length}
            </div>

            {activeSlide < finalSlideIndex ? (
              <button
                type="button"
                onClick={nextSlide}
                className="inline-flex items-center gap-1 rounded-xl bg-teal-700 px-4 py-2.5 text-xs font-black text-white shadow-[0_8px_20px_rgba(13,148,136,0.18)] transition hover:bg-teal-800"
              >
                بعدی
                <ChevronLeft className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={onPrevious}
                className="inline-flex items-center gap-1 rounded-xl border border-teal-200 bg-teal-50 px-4 py-2.5 text-xs font-black text-teal-800"
              >
                بازگشت به مرحله قبل
                <ChevronRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}
