import { ChevronLeft, ChevronRight, Info, Lightbulb, TriangleAlert } from "lucide-react";
import { useMemo, useState } from "react";

import type {
  GdcCohortBuilderFiltersConfig,
  GdcCohortBuilderFiltersHotspot,
} from "./gdc-cohort-builder-filters-config";

function hotspotStyle(item: GdcCohortBuilderFiltersHotspot) {
  return {
    left: `${item.x}%`,
    top: `${item.y}%`,
    width: `${item.width}%`,
    height: `${item.height}%`,
  };
}

export function GdcCohortBuilderFiltersStage({
  config,
  stageNumber = 2,
  stageTotal = 2,
  onPrevious,
  onContinue,
}: {
  config: GdcCohortBuilderFiltersConfig;
  stageNumber?: number;
  stageTotal?: number;
  onPrevious: () => void;
  onContinue?: () => void;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const slides = config.slides;
  const activeSlide = slides[activeIndex] ?? slides[0] ?? null;
  const activeHotspot = useMemo(
    () =>
      activeSlide
        ? config.hotspots.find((item) => item.key === activeSlide.hotspotKey) ?? null
        : null,
    [activeSlide, config.hotspots],
  );

  function goNext() {
    if (activeIndex < slides.length - 1) {
      setActiveIndex((value) => value + 1);
      return;
    }
    onContinue?.();
  }

  return (
    <div className="mt-5 grid items-start gap-5 xl:grid-cols-[minmax(0,1.9fr)_400px]" dir="ltr">
      <div className="xl:sticky xl:top-5 xl:self-start">
        <div className="relative overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_18px_55px_rgba(15,23,42,0.10)]" dir="ltr">
          {config.imageUrl ? (
            <img
              src={config.imageUrl}
              alt="Cohort Builder در GDC و دسته‌های فیلتر آن"
              className="block h-auto w-full"
              loading="eager"
              decoding="async"
            />
          ) : (
            <div className="flex aspect-[1905/843] items-center justify-center bg-slate-100 text-sm font-bold text-slate-400" dir="rtl">
              تصویری برای مرحله ۲ سؤال ۲ تعریف نشده است.
            </div>
          )}

          {config.imageUrl && activeHotspot ? (
            <button
              type="button"
              aria-label={`بخش ${activeHotspot.label}`}
              style={hotspotStyle(activeHotspot)}
              className="group absolute z-10 rounded-lg border-2 border-teal-400 bg-teal-300/10 shadow-[0_0_0_2px_rgba(255,255,255,.62)] transition hover:bg-teal-300/20 focus:outline-none focus:ring-4 focus:ring-teal-200/60"
            >
              <span className="pointer-events-none absolute left-full top-1/2 ml-2 hidden -translate-y-1/2 whitespace-nowrap rounded-lg bg-slate-950/90 px-2 py-1 text-[9px] font-black text-white shadow-lg group-hover:block">
                {activeHotspot.label}
              </span>
            </button>
          ) : null}
        </div>
      </div>

      <aside className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_16px_45px_rgba(15,23,42,0.07)]" dir="rtl">
        <div className="h-1 bg-gradient-to-l from-sky-400 via-teal-400 to-teal-700" />
        <div className="p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <span className="rounded-full border border-teal-100 bg-teal-50 px-3 py-1 text-[10px] font-black text-teal-700">
              مرحله {stageNumber} از {stageTotal}
            </span>
            <span className="text-[10px] font-bold text-slate-400">سؤال ۲ · Cohort</span>
          </div>

          <h2 className="mt-4 text-2xl font-black leading-9 text-slate-950">{config.title}</h2>

          <div className="mt-4 rounded-xl border border-teal-100 bg-teal-50/60 px-3 py-3">
            <div className="text-xs font-black text-teal-900">{config.introLabel}</div>
            <p className="mt-1 text-xs leading-6 text-teal-950/75">{config.introBody}</p>
          </div>

          {slides.length ? (
            <>
              <div className="mt-4 overflow-x-auto pb-1">
                <div className="flex min-w-max gap-1 rounded-xl bg-slate-100 p-1">
                  {slides.map((slide, index) => (
                    <button
                      key={slide.key}
                      type="button"
                      title={slide.title}
                      onClick={() => setActiveIndex(index)}
                      className={
                        activeIndex === index
                          ? "rounded-lg bg-white px-3 py-2 text-[10px] font-black text-teal-700 shadow-sm"
                          : "rounded-lg px-3 py-2 text-[10px] font-bold text-slate-500 transition hover:bg-white/70 hover:text-slate-800"
                      }
                    >
                      <span dir="ltr">{slide.tabLabel}</span>
                    </button>
                  ))}
                </div>
              </div>

              {activeSlide ? (
                <div className="mt-3 min-h-[330px] rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                  <div className="flex items-center gap-2 text-xs font-black text-teal-800">
                    <Info className="h-4 w-4" />
                    <span dir="ltr">{activeSlide.tabLabel}</span>
                  </div>
                  <h3 className="mt-3 text-lg font-black leading-8 text-slate-950">{activeSlide.title}</h3>
                  <p className="mt-3 text-sm leading-8 text-slate-700">{activeSlide.body}</p>

                  {activeSlide.researchUse ? (
                    <div className="mt-4 rounded-xl border border-sky-100 bg-sky-50 px-3 py-3">
                      <div className="flex items-center gap-2 text-xs font-black text-sky-900">
                        <Lightbulb className="h-4 w-4" />
                        برای طراحی پژوهش چه کاربردی دارد؟
                      </div>
                      <p className="mt-2 text-xs leading-6 text-sky-950/80">{activeSlide.researchUse}</p>
                    </div>
                  ) : null}

                  {activeSlide.caution ? (
                    <div className="mt-3 rounded-xl border border-amber-100 bg-amber-50 px-3 py-3">
                      <div className="flex items-center gap-2 text-xs font-black text-amber-900">
                        <TriangleAlert className="h-4 w-4" />
                        نکته مهم
                      </div>
                      <p className="mt-2 text-xs leading-6 text-amber-950/80">{activeSlide.caution}</p>
                    </div>
                  ) : null}
                </div>
              ) : null}

              <div className="mt-4 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (activeIndex === 0) onPrevious();
                    else setActiveIndex((value) => Math.max(0, value - 1));
                  }}
                  className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-bold text-slate-600"
                >
                  <ChevronRight className="h-4 w-4" />
                  {activeIndex === 0 ? "مرحله قبل" : "قبلی"}
                </button>

                <div className="text-[10px] font-black text-slate-400">
                  {activeIndex + 1} / {slides.length}
                </div>

                {activeIndex < slides.length - 1 || onContinue ? (
                  <button
                    type="button"
                    onClick={goNext}
                    className="inline-flex items-center gap-1 rounded-xl bg-teal-700 px-4 py-2.5 text-xs font-black text-white shadow-[0_8px_20px_rgba(13,148,136,0.18)] transition hover:bg-teal-800"
                  >
                    {activeIndex === slides.length - 1 ? config.nextButton : "بعدی"}
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                ) : (
                  <div className="rounded-xl bg-teal-50 px-3 py-2 text-[10px] font-black text-teal-700">
                    نقشه فیلترها کامل شد
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm font-bold text-amber-900">
              اسلایدی برای این مرحله تعریف نشده است.
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
