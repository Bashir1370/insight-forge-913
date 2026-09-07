import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

import type {
  GdcCohortBuilderIntroConfig,
  GdcCohortBuilderIntroHotspot,
} from "./gdc-cohort-builder-intro-config";
import { useGdcCohortBuilderIntroImage } from "./gdc-cohort-builder-intro-image";

function hotspotStyle(item: GdcCohortBuilderIntroHotspot) {
  return {
    left: `${item.x}%`,
    top: `${item.y}%`,
    width: `${item.width}%`,
    height: `${item.height}%`,
  };
}

export function GdcCohortBuilderIntroStage({
  config,
  stageNumber = 1,
  stageTotal = 1,
  onContinue,
}: {
  config: GdcCohortBuilderIntroConfig;
  stageNumber?: number;
  stageTotal?: number;
  onContinue?: () => void;
}) {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedHotspot, setSelectedHotspot] = useState<string>("top-nav");
  const screenshot = useGdcCohortBuilderIntroImage(config.imageUrl);
  const tabLabels = [config.issueLabel, config.cohortTitle, config.entryTitle];
  const hotspots = useMemo(() => config.hotspots ?? [], [config.hotspots]);

  function goNext() {
    if (activeTab < tabLabels.length - 1) {
      setActiveTab((value) => value + 1);
      return;
    }
    onContinue?.();
  }

  return (
    <div className="mt-5 grid items-start gap-5 xl:grid-cols-[minmax(0,1.9fr)_400px]" dir="ltr">
      <div className="xl:sticky xl:top-5 xl:self-start">
        <div className="relative overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_18px_55px_rgba(15,23,42,0.10)]" dir="ltr">
          {screenshot ? (
            <img
              src={screenshot}
              alt="صفحه اصلی GDC و مسیرهای ورود به Cohort Builder"
              className="block h-auto w-full"
              loading="eager"
              decoding="async"
            />
          ) : (
            <div className="flex aspect-[1888/857] items-center justify-center bg-slate-100 text-sm font-bold text-slate-400" dir="rtl">
              در حال بارگذاری اسکرین‌شات Cohort Builder…
            </div>
          )}

          {screenshot
            ? hotspots.map((item) => {
                const selected = selectedHotspot === item.key;
                return (
                  <button
                    key={item.key}
                    type="button"
                    aria-label={`نمایش توضیح ${item.label}`}
                    onClick={() => {
                      setSelectedHotspot(item.key);
                      setActiveTab(2);
                    }}
                    className={`group absolute z-10 rounded-lg border-2 transition focus:outline-none focus:ring-4 focus:ring-teal-200/60 ${
                      selected && activeTab === 2
                        ? "border-teal-400 bg-teal-300/12 shadow-[0_0_0_2px_rgba(255,255,255,.55)]"
                        : "border-teal-300/65 bg-teal-300/5 hover:border-teal-400 hover:bg-teal-300/12"
                    }`}
                    style={hotspotStyle(item)}
                  >
                    <span className="pointer-events-none absolute left-1/2 top-full mt-1 hidden -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-950/90 px-2 py-1 text-[9px] font-black text-white shadow-lg group-hover:block">
                      {item.label}
                    </span>
                  </button>
                );
              })
            : null}
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

          <div className="mt-5 grid grid-cols-3 gap-1 rounded-xl bg-slate-100 p-1">
            {tabLabels.map((label, index) => (
              <button
                key={`${label}-${index}`}
                type="button"
                title={label}
                onClick={() => setActiveTab(index)}
                className={
                  activeTab === index
                    ? "min-w-0 rounded-lg bg-white px-2 py-2 text-[10px] font-black text-teal-700 shadow-sm"
                    : "min-w-0 rounded-lg px-2 py-2 text-[10px] font-bold text-slate-500 transition hover:text-slate-800"
                }
              >
                <span className="block truncate">{label}</span>
              </button>
            ))}
          </div>

          <div className="mt-4 min-h-[300px] rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
            {activeTab === 0 ? (
              <div>
                <div className="text-xs font-black text-teal-800">{config.issueLabel}</div>
                <p className="mt-3 text-sm leading-8 text-slate-700">{config.issueBody}</p>
                <p className="mt-3 text-sm font-bold leading-8 text-teal-800">{config.entryBody}</p>
              </div>
            ) : null}

            {activeTab === 1 ? (
              <div>
                <div className="text-xs font-black text-teal-800">{config.cohortTitle}</div>
                <p className="mt-3 text-sm leading-8 text-slate-700">{config.cohortBody}</p>
                <div className="mt-4 rounded-xl border border-amber-100 bg-amber-50 px-3 py-3 text-xs leading-6 text-amber-950/80">
                  {config.cohortCaveat}
                </div>
              </div>
            ) : null}

            {activeTab === 2 ? (
              <div>
                <div className="text-xs font-black text-teal-800">{config.entryTitle}</div>
                <p className="mt-3 text-sm leading-7 text-slate-700">{config.entryIntro}</p>

                <div className="mt-4 space-y-2">
                  <button
                    type="button"
                    onMouseEnter={() => setSelectedHotspot("top-nav")}
                    onFocus={() => setSelectedHotspot("top-nav")}
                    onClick={() => setSelectedHotspot("top-nav")}
                    className={`w-full rounded-xl border p-3 text-right transition ${
                      selectedHotspot === "top-nav"
                        ? "border-teal-300 bg-teal-50"
                        : "border-slate-200 bg-white hover:border-teal-200"
                    }`}
                  >
                    <div dir="ltr" className="text-left text-xs font-black text-slate-950">{config.topNavTitle}</div>
                    <p className="mt-1 text-xs leading-6 text-slate-500">{config.topNavBody}</p>
                  </button>

                  <button
                    type="button"
                    onMouseEnter={() => setSelectedHotspot("core-tool")}
                    onFocus={() => setSelectedHotspot("core-tool")}
                    onClick={() => setSelectedHotspot("core-tool")}
                    className={`w-full rounded-xl border p-3 text-right transition ${
                      selectedHotspot === "core-tool"
                        ? "border-teal-300 bg-teal-50"
                        : "border-slate-200 bg-white hover:border-teal-200"
                    }`}
                  >
                    <div dir="ltr" className="text-left text-xs font-black text-slate-950">{config.coreToolTitle}</div>
                    <p className="mt-1 text-xs leading-6 text-slate-500">{config.coreToolBody}</p>
                  </button>
                </div>
              </div>
            ) : null}
          </div>

          <div className="mt-4 flex items-center justify-between gap-2">
            <button
              type="button"
              disabled={activeTab === 0}
              onClick={() => setActiveTab((value) => Math.max(0, value - 1))}
              className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-bold text-slate-600 disabled:cursor-default disabled:opacity-35"
            >
              <ChevronRight className="h-4 w-4" />
              قبلی
            </button>

            <div className="text-[10px] font-black text-slate-400">
              {activeTab + 1} / {tabLabels.length}
            </div>

            {activeTab < tabLabels.length - 1 || onContinue ? (
              <button
                type="button"
                onClick={goNext}
                className="inline-flex items-center gap-1 rounded-xl bg-teal-700 px-4 py-2.5 text-xs font-black text-white shadow-[0_8px_20px_rgba(13,148,136,0.18)] transition hover:bg-teal-800"
              >
                {activeTab === tabLabels.length - 1 ? config.nextButton : "بعدی"}
                <ChevronLeft className="h-4 w-4" />
              </button>
            ) : (
              <div className="rounded-xl bg-teal-50 px-3 py-2 text-[10px] font-black text-teal-700">
                نقطه شروع Cohort مشخص شد
              </div>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}
