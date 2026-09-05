import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CircleHelp,
  ExternalLink,
  MousePointer2,
  TriangleAlert,
} from "lucide-react";

import type {
  GuidedPortalStep,
  PortalHotspot,
  PortalScreen,
} from "@/features/data-resources/resource-catalog";

interface GuidedPortalTourProps {
  resourceTitle: string;
  externalUrl: string;
  screen: PortalScreen;
  steps: GuidedPortalStep[];
}

export function GuidedPortalTour({
  resourceTitle,
  externalUrl,
  screen,
  steps,
}: GuidedPortalTourProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const currentStep = steps[currentStepIndex];

  const stepByHotspotId = useMemo(
    () => new Map(steps.map((step, index) => [step.hotspotId, index])),
    [steps],
  );

  if (!currentStep) {
    return null;
  }

  const activeHotspot = screen.hotspots.find(
    (hotspot) => hotspot.id === currentStep.hotspotId,
  );

  const goPrevious = () => {
    setCurrentStepIndex((index) => Math.max(0, index - 1));
  };

  const goNext = () => {
    setCurrentStepIndex((index) => Math.min(steps.length - 1, index + 1));
  };

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-5 sm:px-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700">
              Guided interface tour
            </p>
            <h2 className="mt-2 text-2xl font-black text-slate-950">
              {screen.title}
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">
              {screen.description}
            </p>
          </div>

          <a
            href={externalUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 text-sm font-bold text-slate-700 transition hover:border-teal-400 hover:text-teal-800"
          >
            باز کردن سایت واقعی
            <ExternalLink className="size-4" />
          </a>
        </div>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.65fr)]">
        <div className="border-b border-slate-200 bg-slate-100 p-3 sm:p-5 lg:border-b-0 lg:border-l">
          <div className="mb-3 flex items-center justify-between gap-3 px-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              <MousePointer2 className="size-4 text-teal-700" />
              روی بخش‌های مشخص‌شده کلیک کنید
            </div>
            <span className="text-xs text-slate-500">
              {currentStepIndex + 1} از {steps.length}
            </span>
          </div>

          <PortalCanvas
            screen={screen}
            {...(activeHotspot ? { activeHotspot } : {})}
            onSelectHotspot={(hotspotId) => {
              const index = stepByHotspotId.get(hotspotId);
              if (index !== undefined) setCurrentStepIndex(index);
            }}
          />

          {!screen.imageSrc ? (
            <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-6 text-amber-900">
              این نسخه، موتور تعاملی و مختصات Hotspotها را آزمایش می‌کند. تصویر مرجع رسمی هر صفحه
              به‌صورت asset محتوایی به همین Screen متصل می‌شود؛ موتور به تصویر خاصی وابسته نیست.
            </p>
          ) : null}
        </div>

        <aside className="flex min-h-[420px] flex-col p-6 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="inline-flex rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-teal-800">
                مرحله {currentStepIndex + 1}
              </span>
              <h3 className="mt-4 text-2xl font-black text-slate-950">
                {currentStep.title}
              </h3>
            </div>
            <CircleHelp className="mt-1 size-6 shrink-0 text-teal-700" />
          </div>

          <p className="mt-5 text-sm leading-8 text-slate-700">
            {currentStep.summary}
          </p>

          <div className="mt-6 rounded-2xl border border-teal-100 bg-teal-50/60 p-4">
            <p className="text-xs font-black text-teal-900">چرا مهم است؟</p>
            <p className="mt-2 text-sm leading-7 text-teal-950/80">
              {currentStep.whyItMatters}
            </p>
          </div>

          {currentStep.commonMistake ? (
            <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <div className="flex items-center gap-2 text-xs font-black text-amber-900">
                <TriangleAlert className="size-4" />
                اشتباه رایج
              </div>
              <p className="mt-2 text-sm leading-7 text-amber-950/80">
                {currentStep.commonMistake}
              </p>
            </div>
          ) : null}

          {currentStep.nextAction ? (
            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-black text-slate-700">قدم بعدی</p>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                {currentStep.nextAction}
              </p>
            </div>
          ) : null}

          <div className="mt-auto pt-7">
            <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-teal-600 transition-[width] duration-300"
                style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={goPrevious}
                disabled={currentStepIndex === 0}
                className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 text-sm font-bold text-slate-700 transition hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ArrowRight className="size-4" />
                قبلی
              </button>
              <button
                type="button"
                onClick={goNext}
                disabled={currentStepIndex === steps.length - 1}
                className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
              >
                بعدی
                <ArrowLeft className="size-4" />
              </button>
            </div>
          </div>
        </aside>
      </div>

      <div className="border-t border-slate-200 bg-slate-50 px-5 py-3 text-xs leading-6 text-slate-500 sm:px-7">
        این تور برای آموزش {resourceTitle} در هاب‌ژن ساخته شده است و جایگزین پورتال اصلی یا
        مستندات رسمی آن نیست.
      </div>
    </section>
  );
}

function PortalCanvas({
  screen,
  activeHotspot,
  onSelectHotspot,
}: {
  screen: PortalScreen;
  activeHotspot?: PortalHotspot;
  onSelectHotspot: (hotspotId: string) => void;
}) {
  return (
    <div
      dir="ltr"
      className="relative aspect-[1912/877] w-full overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-inner"
    >
      {screen.imageSrc ? (
        <img
          src={screen.imageSrc}
          alt={screen.imageAlt}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <PortalWireframe />
      )}

      {screen.hotspots.map((hotspot) => {
        const active = hotspot.id === activeHotspot?.id;
        return (
          <button
            key={hotspot.id}
            type="button"
            aria-label={`توضیح ${hotspot.label}`}
            onClick={() => onSelectHotspot(hotspot.id)}
            className={[
              "absolute rounded-md border-2 transition-all",
              "focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1",
              active
                ? "z-20 border-teal-500 bg-teal-400/20 shadow-[0_0_0_3px_rgba(20,184,166,0.14)]"
                : "z-10 border-sky-500/70 bg-sky-300/10 hover:border-teal-500 hover:bg-teal-300/15",
            ].join(" ")}
            style={{
              left: `${hotspot.x * 100}%`,
              top: `${hotspot.y * 100}%`,
              width: `${hotspot.width * 100}%`,
              height: `${hotspot.height * 100}%`,
            }}
          >
            <span className="sr-only">{hotspot.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function PortalWireframe() {
  return (
    <div className="absolute inset-0 bg-gradient-to-b from-white via-slate-50 to-sky-50">
      <div className="flex h-[9%] items-center gap-2 border-b border-slate-200 px-3">
        <div className="h-5 w-12 rounded bg-slate-700" />
        <div className="h-2.5 w-28 rounded bg-slate-300" />
        <div className="ml-auto flex gap-2">
          <div className="h-2.5 w-14 rounded bg-slate-200" />
          <div className="h-2.5 w-14 rounded bg-slate-200" />
          <div className="h-2.5 w-14 rounded bg-slate-200" />
        </div>
      </div>
      <div className="flex h-[8%] items-center gap-5 border-b border-slate-200 px-4">
        <div className="h-3 w-24 rounded bg-sky-200" />
        <div className="h-3 w-16 rounded bg-sky-200" />
        <div className="h-3 w-24 rounded bg-sky-200" />
        <div className="h-3 w-20 rounded bg-sky-200" />
        <div className="ml-auto h-7 w-[27%] rounded border border-slate-300 bg-white" />
      </div>
      <div className="relative h-[83%] overflow-hidden bg-sky-100/60 p-5">
        <div className="w-[48%] space-y-3 pt-6">
          <div className="h-5 w-2/3 rounded bg-sky-900/70" />
          <div className="h-4 w-1/2 rounded bg-sky-900/60" />
          <div className="mt-8 h-3 w-2/5 rounded bg-slate-500/50" />
          <div className="h-3 w-4/5 rounded bg-slate-400/40" />
          <div className="h-3 w-3/4 rounded bg-slate-400/40" />
          <div className="mt-6 h-8 w-36 rounded bg-sky-700/60" />
          <div className="mt-10 h-20 w-full rounded-xl border border-white/70 bg-white/80" />
        </div>
        <div className="absolute bottom-[10%] left-[52%] h-[64%] w-[12%] rounded-[45%] border border-slate-300 bg-white/80" />
        <div className="absolute bottom-[12%] right-[4%] h-[60%] w-[27%] rounded-xl border border-slate-200 bg-white/45 p-3">
          <div className="flex h-full items-end gap-1">
            {[42, 18, 32, 60, 25, 74, 34, 48, 68, 30, 55].map((height, index) => (
              <div
                key={`${height}-${index}`}
                className="flex-1 rounded-t bg-sky-400/60"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
