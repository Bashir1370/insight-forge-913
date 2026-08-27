import {
  ArrowLeft,
  BarChart3,
  BookOpenCheck,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Database,
  ExternalLink,
  FolderKanban,
  GraduationCap,
  Info,
  Search,
  Target,
  TriangleAlert,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";

import {
  dataResources,
  type GuidedPortalStep,
  type PortalHotspot,
} from "@/features/data-resources/resource-catalog";
import { DEFAULT_GDC_HOTSPOTS } from "@/features/data-resources/resource-tour-model";

const GDC_PORTAL_SNAPSHOT_URL = "/images/gdc/gdc-home-clean.webp";

type ManagedHotspot = {
  hotspot_key?: string | null;
  key?: string | null;
  step?: number | string | null;
  title?: string | null;
  persian_label?: string | null;
  description?: string | null;
  why_it_matters?: string | null;
  research_example?: string | null;
  common_mistake?: string | null;
  exercise_question?: string | null;
  exercise_answer?: string | null;
  action?: string | null;
  x?: number | string | null;
  y?: number | string | null;
  width?: number | string | null;
  height?: number | string | null;
};

type LearningStep = GuidedPortalStep & {
  persianLabel?: string;
  researchExample?: string;
  exerciseQuestion?: string;
  exerciseAnswer?: string;
};

type GdcHomeTourProps = {
  imageUrl?: string | null;
  managedHotspots?: ManagedHotspot[];
  pageTitle?: string | null;
  pageDescription?: string | null;
};

const hotspotIcons: Record<string, typeof Database> = {
  "analysis-center": BarChart3,
  projects: FolderKanban,
  "cohort-builder": Users,
  repository: Database,
  search: Search,
  "portal-summary": Info,
  "primary-site-chart": BarChart3,
};

function percentToFraction(value: unknown, fallback: number) {
  const parsed = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(1, Math.max(0, parsed / 100));
}

function PortalFallback() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-white" dir="ltr">
      <div className="h-[15%] border-b border-slate-200 bg-slate-50 px-5 py-4">
        <div className="flex items-center justify-between gap-4 text-xs font-semibold text-slate-600 sm:text-sm">
          <div className="flex items-center gap-3 sm:gap-5">
            <span className="rounded bg-slate-900 px-2 py-1 text-white">NCI · GDC</span>
            <span>Analysis Center</span>
            <span>Projects</span>
            <span>Cohort Builder</span>
            <span>Repository</span>
          </div>
          <div className="hidden rounded-lg border border-slate-200 bg-white px-4 py-2 text-slate-400 lg:block">
            Search projects, genes, cases…
          </div>
        </div>
      </div>

      <div className="absolute left-[3%] top-[21%] w-[55%] text-left">
        <p className="text-sm font-bold uppercase tracking-wide text-slate-400">Harmonized Cancer Datasets</p>
        <h3 className="mt-2 text-2xl font-black text-slate-900 sm:text-4xl">Genomic Data Commons Data Portal</h3>
        <p className="mt-3 max-w-2xl text-xs leading-6 text-slate-500 sm:text-sm">
          A repository and computational platform for cancer researchers who need to understand cancer, its clinical progression, and response to therapy.
        </p>
        <button type="button" className="mt-4 rounded-lg bg-sky-700 px-4 py-2 text-xs font-bold text-white sm:text-sm">
          Explore Our Cancer Datasets
        </button>
      </div>

      <div className="absolute bottom-[7%] left-[3%] w-[55%] rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="text-sm font-black text-slate-800">Data Portal Summary</div>
        <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6">
          {["Projects", "Primary Sites", "Cases", "Files", "Genes", "Mutations"].map((label, index) => (
            <div key={label} className="rounded-lg bg-slate-50 px-2 py-3 text-center">
              <div className="text-sm font-black text-slate-800">{[91, 69, "50K+", "1.2M+", "22K+", "3.3M+"][index]}</div>
              <div className="mt-1 text-[9px] font-semibold text-slate-400 sm:text-[10px]">{label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute right-[3%] top-[22%] h-[67%] w-[34%] rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="text-sm font-black text-slate-800">Cases by Major Primary Site</div>
        <div className="mt-4 flex h-[78%] flex-col justify-between gap-1.5">
          {[82, 58, 92, 64, 75, 50, 68, 42].map((width, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="h-2.5 flex-1 rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-sky-500/70" style={{ width: `${width}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function GdcPortalCanvas({
  hotspots,
  activeHotspotId,
  onHotspotClick,
  imageUrl,
}: {
  hotspots: PortalHotspot[];
  activeHotspotId: string;
  onHotspotClick: (hotspotId: string) => void;
  imageUrl?: string | null;
}) {
  const [snapshotFailed, setSnapshotFailed] = useState(false);

  return (
    <div className="relative aspect-[1911/870] w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <PortalFallback />

      {!snapshotFailed ? (
        <img
          src={imageUrl || GDC_PORTAL_SNAPSHOT_URL}
          alt="نمای تمیز صفحه اصلی GDC Data Portal"
          className="absolute inset-0 z-10 h-full w-full object-contain"
          loading="eager"
          onError={() => setSnapshotFailed(true)}
        />
      ) : null}

      <div className="pointer-events-none absolute inset-0 z-[15] bg-slate-950/[0.01]" />

      {hotspots.map((hotspot, index) => {
        const isActive = hotspot.id === activeHotspotId;
        const Icon = hotspotIcons[hotspot.id] ?? Target;

        return (
          <button
            key={hotspot.id}
            type="button"
            onClick={() => onHotspotClick(hotspot.id)}
            aria-label={hotspot.label}
            title={hotspot.label}
            className={`absolute z-20 rounded-md border-2 transition-all duration-200 ${
              isActive
                ? "border-teal-400 bg-teal-300/20 shadow-[0_0_0_5px_rgba(20,184,166,0.18)]"
                : "border-sky-500/80 bg-sky-300/10 hover:border-teal-400 hover:bg-teal-300/15"
            }`}
            style={{
              left: `${hotspot.x * 100}%`,
              top: `${hotspot.y * 100}%`,
              width: `${hotspot.width * 100}%`,
              height: `${hotspot.height * 100}%`,
            }}
          >
            <span
              className={`absolute -right-2.5 -top-2.5 flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-black text-white shadow-lg ${
                isActive ? "bg-teal-600" : "bg-sky-700"
              }`}
            >
              {isActive ? <Icon className="h-3.5 w-3.5" /> : index + 1}
            </span>
          </button>
        );
      })}

      <div className="absolute bottom-3 right-3 z-30 flex items-center gap-2 rounded-lg bg-slate-950/90 px-3 py-2 text-[10px] font-semibold text-white shadow-lg sm:text-xs">
        <span className={`h-2 w-2 rounded-full ${snapshotFailed ? "bg-amber-400" : "bg-emerald-400"}`} />
        {snapshotFailed ? "نمای جایگزین آموزشی GDC" : "اسکرین‌شات ثابت و تمیز GDC"}
      </div>
    </div>
  );
}

function StepCard({ step, stepNumber, total }: { step: LearningStep; stepNumber: number; total: number }) {
  const [showAnswer, setShowAnswer] = useState(false);

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
      {step.persianLabel ? (
        <div className="mt-2 text-sm font-bold text-teal-700">{step.persianLabel}</div>
      ) : null}

      <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <div className="text-xs font-black text-slate-500">در یک جمله</div>
        <p className="mt-2 text-sm leading-7 text-slate-700">{step.summary}</p>
      </div>

      <div className="mt-3 rounded-xl border border-teal-100 bg-teal-50/70 p-4">
        <div className="flex items-center gap-2 text-sm font-bold text-teal-800">
          <Target className="h-4 w-4" />
          چرا مهم است؟
        </div>
        <p className="mt-2 text-sm leading-7 text-teal-900/80">{step.whyItMatters}</p>
      </div>

      {step.researchExample ? (
        <details className="mt-3 rounded-xl border border-sky-100 bg-sky-50/70 p-4">
          <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-bold text-sky-800">
            <BookOpenCheck className="h-4 w-4" />
            مثال پژوهشی
          </summary>
          <p className="mt-3 text-sm leading-7 text-sky-950/80">{step.researchExample}</p>
        </details>
      ) : null}

      {step.commonMistake ? (
        <div className="mt-3 rounded-xl border border-amber-100 bg-amber-50 p-4">
          <div className="flex items-center gap-2 text-sm font-bold text-amber-800">
            <TriangleAlert className="h-4 w-4" />
            اشتباه رایج
          </div>
          <p className="mt-2 text-sm leading-7 text-amber-900/80">{step.commonMistake}</p>
        </div>
      ) : null}

      {step.exerciseQuestion ? (
        <div className="mt-3 rounded-xl border border-violet-100 bg-violet-50/70 p-4">
          <div className="flex items-center gap-2 text-sm font-bold text-violet-800">
            <GraduationCap className="h-4 w-4" />
            خودت امتحان کن
          </div>
          <p className="mt-2 text-sm leading-7 text-violet-950/80">{step.exerciseQuestion}</p>
          {showAnswer ? (
            <div className="mt-3 rounded-lg border border-violet-200 bg-white/80 p-3 text-sm leading-7 text-violet-950">
              <span className="font-black">پاسخ: </span>
              {step.exerciseAnswer}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowAnswer(true)}
              className="mt-3 rounded-lg border border-violet-200 bg-white px-3 py-2 text-xs font-bold text-violet-800 transition hover:bg-violet-100"
            >
              نمایش پاسخ
            </button>
          )}
        </div>
      ) : null}

      {step.nextAction ? (
        <div className="mt-3 flex items-start gap-2 rounded-xl bg-slate-50 p-4 text-sm leading-7 text-slate-600">
          <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-slate-400" />
          <div>
            <div className="mb-1 text-xs font-black text-slate-500">ارتباط با مرحله بعد</div>
            <span>{step.nextAction}</span>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function GdcHomeTour({
  imageUrl,
  managedHotspots = [],
  pageTitle,
  pageDescription,
}: GdcHomeTourProps = {}) {
  const resource = useMemo(() => dataResources.find((item) => item.id === "gdc"), []);
  const baseScreen = resource?.screens?.[0];
  const baseSteps = resource?.guidedSteps ?? [];
  const task = resource?.guidedTasks?.[0];
  const [stepIndex, setStepIndex] = useState(0);

  const steps = useMemo<LearningStep[]>(
    () =>
      baseSteps.map((step, index) => {
        const fallback = DEFAULT_GDC_HOTSPOTS.find((item) => item.key === step.hotspotId);
        const override = managedHotspots.find(
          (item) =>
            item.hotspot_key === step.hotspotId ||
            item.key === step.hotspotId ||
            Number(item.step) === index + 1,
        );

        return {
          ...step,
          title: override?.title || fallback?.title || step.title,
          persianLabel: override?.persian_label || fallback?.persianLabel,
          summary: override?.description || fallback?.description || step.summary,
          whyItMatters:
            override?.why_it_matters || fallback?.whyItMatters || step.whyItMatters,
          researchExample: override?.research_example || fallback?.researchExample,
          commonMistake:
            override?.common_mistake || fallback?.commonMistake || step.commonMistake,
          exerciseQuestion: override?.exercise_question || fallback?.exerciseQuestion,
          exerciseAnswer: override?.exercise_answer || fallback?.exerciseAnswer,
          nextAction: override?.action || fallback?.action || step.nextAction,
        };
      }),
    [baseSteps, managedHotspots],
  );

  const screen = useMemo(() => {
    if (!baseScreen) return undefined;

    const hotspots = baseScreen.hotspots.map((hotspot, index) => {
      const override = managedHotspots.find(
        (item) =>
          item.hotspot_key === hotspot.id ||
          item.key === hotspot.id ||
          Number(item.step) === index + 1,
      );

      if (!override) return hotspot;

      return {
        ...hotspot,
        label: override.title || hotspot.label,
        x: percentToFraction(override.x, hotspot.x),
        y: percentToFraction(override.y, hotspot.y),
        width: percentToFraction(override.width, hotspot.width),
        height: percentToFraction(override.height, hotspot.height),
      };
    });

    return { ...baseScreen, hotspots };
  }, [baseScreen, managedHotspots]);

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
              <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                {pageTitle || "GDC / TCGA Guided Portal Tour"}
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
                {pageDescription || resource.description}
              </p>
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

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.8fr)_440px]">
          <div>
            <div className="mb-3 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-black text-slate-900">{screen.title}</h2>
                <p className="mt-1 text-sm text-slate-500">روی هر ناحیه کلیک کنید تا آموزش همان بخش باز شود.</p>
              </div>
              {activeHotspot ? (
                <span className="hidden rounded-full bg-sky-50 px-3 py-1 text-xs font-bold text-sky-700 sm:inline-block" dir="ltr">
                  {activeHotspot.label}
                </span>
              ) : null}
            </div>

            <GdcPortalCanvas
              hotspots={screen.hotspots}
              activeHotspotId={currentStep.hotspotId}
              onHotspotClick={selectHotspot}
              imageUrl={imageUrl}
            />
          </div>

          <div className="flex flex-col gap-4">
            <StepCard key={currentStep.id} step={currentStep} stepNumber={stepIndex + 1} total={steps.length} />

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
