import { ChevronLeft, ChevronRight, Info, MousePointer2, Sparkles } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import type {
  GdcCohortFieldGuideConfig,
  GdcCohortFieldGuideField,
  GdcCohortFieldGuidePage,
} from "./gdc-cohort-field-guide-config";

type FieldRef = { pageKey: string; fieldKey: string };

function refKey(pageKey: string, fieldKey: string) {
  return `${pageKey}:${fieldKey}`;
}

function findSpotlight(page: GdcCohortFieldGuidePage) {
  return (
    page.fields.find((item) => item.key === page.spotlightFieldKey) ??
    page.fields[0] ??
    null
  );
}

function DimAround({ field }: { field: GdcCohortFieldGuideField }) {
  const right = Math.max(0, 100 - field.panelX - field.panelWidth);
  const bottom = Math.max(0, 100 - field.panelY - field.panelHeight);

  return (
    <>
      <div className="pointer-events-none absolute left-0 top-0 z-20 w-full bg-slate-950/60 backdrop-blur-[1px] transition-opacity" style={{ height: `${field.panelY}%` }} />
      <div className="pointer-events-none absolute left-0 z-20 bg-slate-950/60 backdrop-blur-[1px]" style={{ top: `${field.panelY}%`, width: `${field.panelX}%`, height: `${field.panelHeight}%` }} />
      <div className="pointer-events-none absolute z-20 bg-slate-950/60 backdrop-blur-[1px]" style={{ top: `${field.panelY}%`, right: 0, width: `${right}%`, height: `${field.panelHeight}%` }} />
      <div className="pointer-events-none absolute bottom-0 left-0 z-20 w-full bg-slate-950/60 backdrop-blur-[1px]" style={{ height: `${bottom}%` }} />
      <div
        className="pointer-events-none absolute z-30 rounded-xl border-2 border-amber-300 shadow-[0_0_0_4px_rgba(255,255,255,.82),0_12px_35px_rgba(15,23,42,.30)]"
        style={{
          left: `${field.panelX}%`,
          top: `${field.panelY}%`,
          width: `${field.panelWidth}%`,
          height: `${field.panelHeight}%`,
        }}
      />
    </>
  );
}

function ScreenshotPage({
  page,
  pageIndex,
  pageCount,
  spotlightFieldKey,
  instruction,
  tooltipHint,
  hoveredKey,
  pinnedKey,
  onHover,
  onPin,
  onInteract,
}: {
  page: GdcCohortFieldGuidePage;
  pageIndex: number;
  pageCount: number;
  spotlightFieldKey: string | null;
  instruction: string;
  tooltipHint: string;
  hoveredKey: string | null;
  pinnedKey: string | null;
  onHover: (key: string | null) => void;
  onPin: (key: string) => void;
  onInteract: () => void;
}) {
  const spotlightField = spotlightFieldKey
    ? page.fields.find((item) => item.key === spotlightFieldKey) ?? null
    : null;

  return (
    <section className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_18px_55px_rgba(15,23,42,0.10)]">
      {pageCount > 1 ? (
        <div className="border-b border-slate-100 bg-white px-4 py-2 text-right text-[11px] font-black text-slate-500" dir="rtl">
          صفحه {pageIndex + 1} از {pageCount}
        </div>
      ) : null}

      <div className="relative" dir="ltr">
        {page.imageUrl ? (
          <img
            src={page.imageUrl}
            alt={`Cohort Builder field guide ${page.key}`}
            className="block h-auto w-full"
            loading="eager"
            decoding="async"
          />
        ) : (
          <div className="flex aspect-[1918/837] items-center justify-center bg-slate-100 px-6 text-center text-sm font-bold leading-7 text-slate-400" dir="rtl">
            برای این تب هنوز اسکرین‌شات تعریف نشده است. تصویر را از GDC Editor اضافه کنید.
          </div>
        )}

        {page.imageUrl && spotlightField ? <DimAround field={spotlightField} /> : null}

        {page.imageUrl && spotlightField ? (
          <div
            className="pointer-events-none absolute z-40 max-w-[360px] -translate-x-1/2 rounded-2xl border border-amber-200 bg-white px-4 py-3 text-center text-xs font-black leading-6 text-slate-800 shadow-2xl"
            style={{
              left: `${Math.min(82, Math.max(18, spotlightField.panelX + spotlightField.panelWidth / 2))}%`,
              top: `${Math.max(3, spotlightField.panelY - 2)}%`,
              transform: "translate(-50%, -100%)",
            }}
            dir="rtl"
          >
            <div className="flex items-center justify-center gap-2 text-amber-700">
              <MousePointer2 className="h-4 w-4" /> راهنمای تعامل
            </div>
            <div className="mt-1">{instruction}</div>
          </div>
        ) : null}

        {page.imageUrl
          ? page.fields.map((field) => {
              const composite = refKey(page.key, field.key);
              const open = hoveredKey === composite || pinnedKey === composite;
              const centerX = Math.min(84, Math.max(16, field.x + field.width / 2));
              const showAbove = field.y > 58;
              const popoverTop = showAbove ? field.y - 1.5 : field.y + field.height + 1.5;

              return (
                <div key={field.key} className="contents">
                  <button
                    type="button"
                    aria-label={`توضیح ${field.label}`}
                    onMouseEnter={() => {
                      onInteract();
                      onHover(composite);
                    }}
                    onMouseLeave={() => onHover(null)}
                    onFocus={() => {
                      onInteract();
                      onHover(composite);
                    }}
                    onBlur={() => onHover(null)}
                    onClick={() => {
                      onInteract();
                      onPin(composite);
                    }}
                    className="absolute z-50 cursor-help rounded-md bg-transparent outline-none transition hover:ring-2 hover:ring-teal-400/70 focus:ring-2 focus:ring-teal-400/80"
                    style={{
                      left: `${field.x}%`,
                      top: `${field.y}%`,
                      width: `${field.width}%`,
                      height: `${field.height}%`,
                    }}
                  >
                    <span className="sr-only">{field.label}</span>
                  </button>

                  {open ? (
                    <div
                      className="pointer-events-none absolute z-[60] w-[min(320px,78%)] rounded-2xl border border-teal-100 bg-white p-4 text-right shadow-[0_18px_50px_rgba(15,23,42,.22)]"
                      style={{
                        left: `${centerX}%`,
                        top: `${popoverTop}%`,
                        transform: showAbove ? "translate(-50%, -100%)" : "translate(-50%, 0)",
                      }}
                      dir="rtl"
                    >
                      <div className="text-[10px] font-black text-teal-600">{tooltipHint}</div>
                      <div className="mt-1 text-sm font-black text-slate-950" dir="ltr">{field.label}</div>
                      <p className="mt-2 text-xs leading-6 text-slate-600">{field.description}</p>
                    </div>
                  ) : null}
                </div>
              );
            })
          : null}
      </div>
    </section>
  );
}

export function GdcCohortFieldGuideStage({
  config,
  stageNumber = 3,
  stageTotal = 3,
  onPrevious,
  onContinue,
}: {
  config: GdcCohortFieldGuideConfig;
  stageNumber?: number;
  stageTotal?: number;
  onPrevious: () => void;
  onContinue?: () => void;
}) {
  const [activeTabKey, setActiveTabKey] = useState(config.tabs[0]?.key ?? "");
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const [pinnedKey, setPinnedKey] = useState<string | null>(null);
  const [spotlight, setSpotlight] = useState<FieldRef | null>(null);
  const introducedTabs = useRef(new Set<string>());

  const activeTab = useMemo(
    () => config.tabs.find((item) => item.key === activeTabKey) ?? config.tabs[0] ?? null,
    [activeTabKey, config.tabs],
  );

  useEffect(() => {
    setHoveredKey(null);
    setPinnedKey(null);
    setSpotlight(null);
    if (!activeTab || introducedTabs.current.has(activeTab.key)) return;

    const firstPage = activeTab.pages.find((page) => page.imageUrl && page.fields.length > 0);
    if (!firstPage) return;
    const target = findSpotlight(firstPage);
    if (!target) return;

    const timer = window.setTimeout(() => {
      setSpotlight({ pageKey: firstPage.key, fieldKey: target.key });
      introducedTabs.current.add(activeTab.key);
    }, 2000);

    return () => window.clearTimeout(timer);
  }, [activeTab]);

  function dismissGuide() {
    setSpotlight(null);
    if (activeTab) introducedTabs.current.add(activeTab.key);
  }

  function togglePinned(key: string) {
    setPinnedKey((current) => (current === key ? null : key));
  }

  return (
    <div className="mt-5 grid items-start gap-5 xl:grid-cols-[minmax(0,1.9fr)_420px]" dir="ltr">
      <div className="space-y-5 xl:sticky xl:top-5 xl:self-start">
        {activeTab?.pages.length ? (
          activeTab.pages.map((page, pageIndex) => (
            <ScreenshotPage
              key={page.key}
              page={page}
              pageIndex={pageIndex}
              pageCount={activeTab.pages.length}
              spotlightFieldKey={spotlight?.pageKey === page.key ? spotlight.fieldKey : null}
              instruction={config.instruction}
              tooltipHint={config.tooltipHint}
              hoveredKey={hoveredKey}
              pinnedKey={pinnedKey}
              onHover={setHoveredKey}
              onPin={togglePinned}
              onInteract={dismissGuide}
            />
          ))
        ) : (
          <div className="rounded-[24px] border border-slate-200 bg-white p-8 text-center text-sm font-bold text-slate-400">
            برای این تب صفحه‌ای تعریف نشده است.
          </div>
        )}
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
          <p className="mt-3 text-sm leading-7 text-slate-600">{config.intro}</p>

          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50/70 p-3">
            <div className="flex items-center gap-2 text-xs font-black text-slate-700">
              <Sparkles className="h-4 w-4 text-teal-600" /> دسته موردنظر را انتخاب کنید
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {config.tabs.map((tab) => {
                const active = activeTab?.key === tab.key;
                const ready = tab.pages.some((page) => page.imageUrl && page.fields.length > 0);
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTabKey(tab.key)}
                    className={`min-h-[58px] rounded-xl border px-3 py-2 text-right transition ${
                      active
                        ? "border-teal-300 bg-white text-teal-800 shadow-sm"
                        : "border-slate-200 bg-white text-slate-600 hover:border-teal-200 hover:bg-teal-50/40"
                    }`}
                  >
                    <div className="truncate text-[11px] font-black" dir="ltr">{tab.label}</div>
                    <div className={`mt-1 text-[9px] font-bold ${ready ? "text-emerald-600" : "text-slate-400"}`}>
                      {ready ? "آماده آموزش" : "تصویر در انتظار تکمیل"}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {activeTab ? (
            <div className="mt-4 rounded-xl border border-teal-100 bg-teal-50/60 p-3">
              <div className="flex items-center gap-2 text-xs font-black text-teal-900">
                <Info className="h-4 w-4" /> <span dir="ltr">{activeTab.label}</span>
              </div>
              <p className="mt-2 text-xs leading-6 text-teal-950/75">{activeTab.helper}</p>
              {activeTab.pages.some((page) => page.fields.length > 0) ? (
                <p className="mt-2 text-[10px] leading-5 text-teal-700">
                  روی عنوان فیلترها در خود اسکرین‌شات بروید؛ توضیح کوتاه همان‌جا باز می‌شود.
                </p>
              ) : null}
            </div>
          ) : null}

          <div className="mt-4 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={onPrevious}
              className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-bold text-slate-600"
            >
              <ChevronRight className="h-4 w-4" /> مرحله قبل
            </button>

            {onContinue ? (
              <button
                type="button"
                onClick={onContinue}
                className="inline-flex items-center gap-1 rounded-xl bg-teal-700 px-4 py-2.5 text-xs font-black text-white shadow-[0_8px_20px_rgba(13,148,136,0.18)] transition hover:bg-teal-800"
              >
                {config.nextButton} <ChevronLeft className="h-4 w-4" />
              </button>
            ) : (
              <div className="rounded-xl bg-teal-50 px-3 py-2 text-[10px] font-black text-teal-700">
                مرحله معرفی فیلترها
              </div>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}
