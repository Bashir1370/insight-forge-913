import {
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Database,
  ExternalLink,
  FolderKanban,
  Info,
  Search,
  Target,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";

import {
  dataResources,
  type GuidedPortalStep,
  type PortalHotspot,
} from "@/features/data-resources/resource-catalog";

const hotspotIcons: Record<string, typeof Database> = {
  "analysis-center": BarChart3,
  projects: FolderKanban,
  "cohort-builder": Users,
  repository: Database,
  search: Search,
  "portal-summary": Info,
  "primary-site-chart": BarChart3,
};

function GdcPortalMock({
  hotspots,
  activeHotspotId,
  onHotspotClick,
}: {
  hotspots: PortalHotspot[];
  activeHotspotId: string;
  onHotspotClick: (hotspotId: string) => void;
}) {
  return (
    <div className="relative aspect-[16/9] min-h-[420px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-slate-50 to-slate-100" />

      <div className="absolute inset-x-0 top-0 h-[15%] border-b border-slate-200 bg-[#f7f9fc]">
        <div className="flex h-full items-center justify-between gap-4 px-5 text-[11px] font-semibold text-slate-600 sm:text-sm">
          <div className="flex items-center gap-2 sm:gap-5" dir="ltr">
            <span className="rounded-md bg-slate-900 px-2 py-1 text-white">GDC</span>
            <span>Analysis Center</span>
            <span>Projects</span>
            <span>Cohort Builder</span>
            <span>Repository</span>
          </div>
          <div className="hidden w-44 rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-400 lg:block">
            Search projects, genes, cases…
          </div>
        </div>
      </div>

      <div className="absolute left-[3%] top-[20%] w-[58%]">
        <div className="mb-3 text-left text-lg font-bold text-slate-900 sm:text-2xl" dir="ltr">
          GDC Data Portal
        </div>
        <p className="max-w-xl text-left text-xs leading-6 text-slate-500 sm:text-sm" dir="ltr">
          Explore harmonized cancer genomic, clinical and biospecimen data from NCI programs including TCGA.
        </p>
      </div>

      <div className="absolute left-[3%] top-[43%] grid w-[58%] grid-cols-3 gap-3" dir="ltr">
        {[
          ["Projects", "80+"],
          ["Cases", "90K+"],
          ["Files", "3M+"],
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
            <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 sm:text-xs">{label}</div>
            <div className="mt-1 text-lg font-bold text-slate-900 sm:text-2xl">{value}</div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-[8%] left-[3%] h-[20%] w-[58%] rounded-xl border border-slate-200 bg-white p-3 text-left shadow-sm sm:p-4" dir="ltr">
        <div className="text-xs font-bold text-slate-800 sm:text-sm">Data Portal Summary</div>
        <div className="mt-3 grid grid-cols-4 gap-2">
          {[68, 42, 82, 55].map((height, index) => (
            <div key={index} className="flex h-12 items-end rounded bg-slate-100 px-1 sm:h-16">
              <div className="w-full rounded-t bg-teal-500/70" style={{ height: `${height}%` }} />
            </div>
          ))}
        </div>
      </div>

      <div className="absolute right-[3%] top-[20%] h-[67%] w-[29%] rounded-xl border border-slate-200 bg-white p-3 text-left shadow-sm sm:p-4" dir="ltr">
        <div className="text-xs font-bold text-slate-800 sm:text-sm">Cases by Major Primary Site</div>
        <div className="mt-4 flex h-[75%] items-end gap-1.5 sm:gap-2">
          {[72, 94, 58, 80, 49, 68, 38].map((height, index) => (
            <div key={index} className="flex h-full flex-1 items-end rounded bg-slate-50">
              <div className="w-full rounded-t bg-sky-500/65" style={{ height: `${height}%` }} />
            </div>
          ))}
        </div>
      </div>

      {hotspots.map((hotspot, index) => {
        const isActive = hotspot.id === activeHotspotId;
        const Icon = hotspotIcons[hotspot.id] ?? Target;

        return (
          <button
            key={hotspot.id}
            type="button"
            onClick={() => onHotspotClick(hotspot.id)}
            aria-label={hotspot.label}
            className={`absolute z-20 rounded-lg border-2 transition-all duration-200 ${
              isActive
                ? "border-teal-500 bg-teal-400/20 shadow-[0_0_0_4px_rgba(20,184,166,0.14)]"
                : "border-sky-500/70 bg-sky-400/10 hover:border-teal-500 hover:bg-teal-400/15"
            }`}
            style={{
              left: `${hotspot.x * 100}%`,
              top: `${hotspot.y * 100}%`,
              width: `${hotspot.width * 100}%`,
              height: `${hotspot.height * 100}%`,
            }}
          >
            <span
              className={`absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-black text-white shadow-lg ${
                isActive ? "bg-teal-600" : "bg-sky-600"
              }`}
            >
              {isActive ? <Icon className="h-3.5 w-3.5" /> : index + 1}
            </span>
          </button>
        );
      })}

      <div className="absolute bottom-3 right-3 rounded-lg bg-slate-900/90 px-3 py-2 text-[10px] text-white sm:text-xs" dir="rtl">
        نمای آموزشی اولیه — اسکرین‌شات واقعی GDC در مرحله بعد جایگزین می‌شود
      </div>
    </div>
  );
}

function StepCard({ step, stepNumber, total }: { step: GuidedPortalStep; stepNumber: number; total: number }) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-teal-700">
          مرحله {stepNumber} از {total}
        </span>
        <span className="text-xs font-semibold text-slate-400">Guided Tour</span>
      </div>

      <h2 className="mt-5 text-2xl font-black text-slate-950" dir="ltr">
        {step.title}
      </h2>
      <p className="mt-4 text-sm leading-7 text-slate-600">{step.summary}</p>

      <div className="mt-5 rounded-xl border border-teal-100 bg-teal-50/70 p-4">
        <div className="flex items-center gap-2 text-sm font-bold text-teal-800">
          <Target className="h-4 w-4" />
          چرا مهم است؟
        </div>
        <p className="mt-2 text-sm leading-7 text-teal-900/80">{step.whyItMatters}</p>
      </div>

      {step.commonMistake ? (
        <div className="mt-3 rounded-xl border border-amber-100 bg-amber-50 p-4">
          <div className="text-sm font-bold text-amber-800">اشتباه رایج</div>
          <p className="mt-2 text-sm leading-7 text-amber-900/80">{step.commonMistake}</p>
        </div>
      ) : null}

      {step.nextAction ? (
        <div className="mt-3 flex items-start gap-2 rounded-xl bg-slate-50 p-4 text-sm leading-7 text-slate-600">
          <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-slate-400" />
          <span>{step.nextAction}</span>
        </div>
      ) : null}
    </div>
  );
}

export function GdcHomeTour() {
  const resource = useMemo(() => dataResources.find((item) => item.id === "gdc"), []);
  const screen = resource?.screens?.[0];
  const steps = resource?.guidedSteps ?? [];
  const task = resource?.guidedTasks?.[0];
  const [stepIndex, setStepIndex] = useState(0);

  if (!resource || !screen || steps.length === 0) {
    return (
      <section dir="rtl" className="min-h-[70vh] bg-slate-50 px-6 py-16">
        <div className="mx-auto max-w-3xl rounded-2xl border border-rose-100 bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-black text-slate-900">اطلاعات آموزش GDC پیدا نشد</h1>
          <p className="mt-3 text-slate-500">داده‌های Guided Tour در Resource Catalog در دسترس نیست.</p>
        </div>
      </section>
    );
  }

  const currentStep = steps[stepIndex];
  const activeHotspot = screen.hotspots.find((hotspot) => hotspot.id === currentStep.hotspotId);

  const selectHotspot = (hotspotId: string) => {
    const nextIndex = steps.findIndex((step) => step.hotspotId === hotspotId);
    if (nextIndex >= 0) setStepIndex(nextIndex);
  };

  const goPrevious = () => setStepIndex((index) => Math.max(0, index - 1));
  const goNext = () => setStepIndex((index) => Math.min(steps.length - 1, index + 1));

  return (
    <main dir="rtl" className="min-h-screen bg-slate-50 text-slate-900">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-[1450px] px-5 py-7 sm:px-8 lg:px-10">
          <a href="/resources" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-teal-700">
            <ArrowLeft className="h-4 w-4 rotate-180" />
            بازگشت به منابع داده
          </a>

          <div className="mt-5 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-teal-100 px-3 py-1 text-xs font-bold text-teal-800">آموزش تعاملی فعال</span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">NCI</span>
                <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-bold text-sky-700">TCGA</span>
              </div>
              <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">GDC / TCGA Guided Portal Tour</h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">{resource.description}</p>
            </div>

            <a
              href={resource.externalUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-teal-700"
            >
              باز کردن GDC واقعی
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1450px] px-5 py-7 sm:px-8 lg:px-10">
        <div className="mb-5 flex flex-wrap gap-2">
          {steps.map((step, index) => (
            <button
              key={step.id}
              type="button"
              onClick={() => setStepIndex(index)}
              className={`rounded-full px-4 py-2 text-xs font-bold transition sm:text-sm ${
                index === stepIndex
                  ? "bg-teal-700 text-white shadow-sm"
                  : index < stepIndex
                    ? "bg-teal-50 text-teal-800 hover:bg-teal-100"
                    : "bg-white text-slate-500 ring-1 ring-slate-200 hover:text-slate-800"
              }`}
            >
              {index + 1}. {step.title}
            </button>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.8fr)_420px]">
          <div>
            <div className="mb-3 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-black text-slate-900">{screen.title}</h2>
                <p className="mt-1 text-sm text-slate-500">روی هر ناحیه کلیک کنید تا توضیح همان بخش باز شود.</p>
              </div>
              {activeHotspot ? (
                <span className="hidden rounded-full bg-sky-50 px-3 py-1 text-xs font-bold text-sky-700 sm:inline-block" dir="ltr">
                  {activeHotspot.label}
                </span>
              ) : null}
            </div>

            <GdcPortalMock
              hotspots={screen.hotspots}
              activeHotspotId={currentStep.hotspotId}
              onHotspotClick={selectHotspot}
            />
          </div>

          <div className="flex flex-col gap-4">
            <StepCard step={currentStep} stepNumber={stepIndex + 1} total={steps.length} />

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={goPrevious}
                disabled={stepIndex === 0}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4" />
                مرحله قبل
              </button>
              <button
                type="button"
                onClick={goNext}
                disabled={stepIndex === steps.length - 1}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-40"
              >
                مرحله بعد
                <ChevronLeft className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {task ? (
          <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="grid gap-0 lg:grid-cols-[360px_1fr]">
              <div className="bg-slate-950 p-6 text-white sm:p-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-500/20 text-teal-300">
                  <Target className="h-6 w-6" />
                </div>
                <div className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-teal-300">Guided Mission</div>
                <h3 className="mt-2 text-2xl font-black">{task.title}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-300">{task.description}</p>
                <div className="mt-5 rounded-xl border border-white/10 bg-white/5 p-4 text-sm leading-7 text-slate-200">
                  <span className="font-bold text-white">خروجی یادگیری: </span>
                  {task.outcome}
                </div>
              </div>

              <div className="p-6 sm:p-8">
                <h4 className="text-lg font-black text-slate-900">مسیر انجام مأموریت</h4>
                <div className="mt-5 grid gap-3 md:grid-cols-2">
                  {task.steps.map((item, index) => (
                    <div key={item} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-xs font-black text-teal-700 shadow-sm ring-1 ring-slate-200">
                        {index + 1}
                      </span>
                      <p className="text-sm leading-7 text-slate-700">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        ) : null}
      </section>
    </main>
  );
}
