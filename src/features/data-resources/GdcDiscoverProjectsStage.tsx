import { ChevronLeft, ChevronRight, Maximize2, Minimize2 } from "lucide-react";
import { useMemo, useState } from "react";

import {
  GdcHotspotArrow,
  type GdcHotspotArrowSettings,
} from "./GdcHotspotArrow";
import type { GdcQuestionGuideConfig } from "./gdc-question-guide-config";

type HotspotGeometry = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type Props = {
  config: GdcQuestionGuideConfig;
  imageUrl?: string | null | undefined;
  managedHotspots?: unknown[] | undefined;
  onContinue: () => void;
};

type IntroWithProjectsArrow = GdcQuestionGuideConfig["intro"] & {
  projectsArrow?: GdcHotspotArrowSettings;
};

const DEFAULT_IMAGE = "/images/gdc/gdc-home-clean.webp";
const DEFAULT_PROJECTS_HOTSPOT: HotspotGeometry = {
  x: 12.6,
  y: 8.8,
  width: 9,
  height: 7,
};

function toFiniteNumber(value: unknown) {
  const number = typeof value === "number" ? value : Number(value);
  return Number.isFinite(number) ? number : null;
}

function getProjectsHotspot(hotspots?: unknown[]): HotspotGeometry {
  if (!Array.isArray(hotspots)) return DEFAULT_PROJECTS_HOTSPOT;

  const candidate = hotspots.find((item) => {
    if (!item || typeof item !== "object") return false;
    return (item as { key?: unknown }).key === "projects";
  }) as Record<string, unknown> | undefined;

  if (!candidate) return DEFAULT_PROJECTS_HOTSPOT;

  const x = toFiniteNumber(candidate.x);
  const y = toFiniteNumber(candidate.y);
  const width = toFiniteNumber(candidate.width);
  const height = toFiniteNumber(candidate.height);

  if (x === null || y === null || width === null || height === null) {
    return DEFAULT_PROJECTS_HOTSPOT;
  }

  return { x, y, width, height };
}

function ArchitectureMap({ config }: { config: GdcQuestionGuideConfig }) {
  const intro = config.intro;
  return (
    <>
      <p className="mt-4 text-sm leading-7 text-slate-600">{intro.architectureIntro}</p>
      <div className="mt-4 grid grid-cols-2 gap-2" dir="ltr">
        {intro.architectureCards.map((card, index) => (
          <div
            key={`${card.title}-${index}`}
            className={
              index === 1
                ? "rounded-xl border border-teal-300 bg-teal-50 px-3 py-3 text-center"
                : "rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-center"
            }
          >
            <div className={index === 1 ? "text-sm font-black text-teal-800" : "text-sm font-black text-slate-700"}>
              {card.title}
            </div>
            <div className={index === 1 ? "mt-1 text-[11px] text-teal-700" : "mt-1 text-[11px] text-slate-500"}>
              {card.subtitle}
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs leading-6 text-slate-500">{intro.architectureSummary}</p>
    </>
  );
}

export function GdcDiscoverProjectsStage({
  config,
  imageUrl,
  managedHotspots,
  onContinue,
}: Props) {
  const [activeTab, setActiveTab] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const intro = config.intro;
  const introWithArrow = intro as IntroWithProjectsArrow;
  const hotspot = useMemo(() => getProjectsHotspot(managedHotspots), [managedHotspots]);
  const screenshot = imageUrl || DEFAULT_IMAGE;
  const tabLabels = [intro.issueLabel, intro.projectTitle, intro.architectureTitle];
  const arrowSettings = introWithArrow.projectsArrow ?? {};
  const arrowItem = {
    key: "projects",
    label: "Projects",
    ...hotspot,
    ...arrowSettings,
  };

  const zoomCenterX = hotspot.x + hotspot.width / 2;
  const zoomCenterY = hotspot.y + hotspot.height / 2;

  function goNext() {
    if (activeTab < tabLabels.length - 1) {
      setActiveTab((value) => value + 1);
      return;
    }
    onContinue();
  }

  return (
    <div className="mt-5 grid items-start gap-5 xl:grid-cols-[minmax(0,1.9fr)_400px]" dir="ltr">
      <div className="xl:sticky xl:top-5 xl:self-start">
        <div className="relative overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_18px_55px_rgba(15,23,42,0.10)]" dir="ltr">
          <img
            src={screenshot}
            alt="صفحه اصلی GDC"
            className="block h-auto w-full"
            loading="eager"
            decoding="async"
          />

          <GdcHotspotArrow
            item={arrowItem}
            onClick={() => {
              setActiveTab(1);
              setZoomOpen(true);
            }}
          />
        </div>
      </div>

      <aside className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_16px_45px_rgba(15,23,42,0.07)]" dir="rtl">
        <div className="h-1 bg-gradient-to-l from-sky-400 via-teal-400 to-teal-700" />
        <div className="p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <span className="rounded-full border border-teal-100 bg-teal-50 px-3 py-1 text-[10px] font-black text-teal-700">
              مرحله ۱ از {config.stageTitles.length}
            </span>
            <span className="text-[10px] font-bold text-slate-400">سؤال ۱</span>
          </div>

          <h2 className="mt-4 text-2xl font-black leading-9 text-slate-950">{intro.title}</h2>

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

          <div className="mt-4 min-h-[260px] rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
            {activeTab === 0 ? (
              <div>
                <div className="text-xs font-black text-teal-800">{intro.issueLabel}</div>
                <p className="mt-3 text-sm leading-8 text-slate-700">{intro.issueBody}</p>
                <p className="mt-3 text-sm leading-8 text-slate-700">{intro.entryBody}</p>
              </div>
            ) : null}

            {activeTab === 1 ? (
              <div>
                <div className="flex items-center justify-between gap-3">
                  <div className="text-xs font-black text-teal-800">{intro.projectTitle}</div>
                  <button
                    type="button"
                    onClick={() => setZoomOpen((value) => !value)}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-[10px] font-black text-slate-600 hover:border-teal-200 hover:text-teal-700"
                  >
                    {zoomOpen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
                    {zoomOpen ? "بستن نمای نزدیک" : "نمای نزدیک"}
                  </button>
                </div>

                {zoomOpen ? (
                  <div className="mt-3 h-28 overflow-hidden rounded-xl border border-slate-200 bg-white" dir="ltr">
                    <img
                      src={screenshot}
                      alt="نمای نزدیک Projects در GDC"
                      className="h-full w-full object-cover"
                      style={{
                        transform: "scale(4.6)",
                        transformOrigin: `${zoomCenterX}% ${zoomCenterY}%`,
                      }}
                    />
                  </div>
                ) : null}

                <p className="mt-3 text-sm leading-8 text-slate-700">{intro.projectBody}</p>
                <div className="mt-3 rounded-xl border border-teal-100 bg-white px-3 py-3 text-xs leading-6 text-slate-600">
                  {intro.projectCaveat}
                </div>
              </div>
            ) : null}

            {activeTab === 2 ? <ArchitectureMap config={config} /> : null}
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

            <button
              type="button"
              onClick={goNext}
              className="inline-flex items-center gap-1 rounded-xl bg-teal-700 px-4 py-2.5 text-xs font-black text-white shadow-[0_8px_20px_rgba(13,148,136,0.18)] transition hover:bg-teal-800"
            >
              {activeTab === tabLabels.length - 1 ? intro.nextButton || "ورود به Projects" : "بعدی"}
              <ChevronLeft className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
