import { ChevronLeft } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import type { GdcQuestionGuideConfig } from "./gdc-question-guide-config";

type HotspotGeometry = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type ConnectorGeometry = {
  width: number;
  height: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
} | null;

type Props = {
  config: GdcQuestionGuideConfig;
  imageUrl?: string | null | undefined;
  managedHotspots?: unknown[] | undefined;
  onContinue: () => void;
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

function ArchitectureRail({ config }: { config: GdcQuestionGuideConfig }) {
  const cards = config.intro.architectureCards;

  return (
    <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50/80 p-3">
      <div className="mb-2 text-[10px] font-black text-slate-500">{config.intro.architectureTitle}</div>
      <div className="flex items-stretch gap-1 overflow-x-auto" dir="ltr">
        {cards.map((card, index) => (
          <div key={`${card.title}-${index}`} className="flex min-w-0 flex-1 items-center gap-1">
            <div
              className={
                index === 1
                  ? "min-w-[82px] flex-1 rounded-xl border border-teal-300 bg-teal-50 px-2 py-2 text-center"
                  : "min-w-[82px] flex-1 rounded-xl border border-slate-200 bg-white px-2 py-2 text-center"
              }
            >
              <div className={index === 1 ? "text-[11px] font-black text-teal-800" : "text-[11px] font-black text-slate-700"}>
                {card.title}
              </div>
              <div className={index === 1 ? "mt-0.5 text-[9px] leading-4 text-teal-700" : "mt-0.5 text-[9px] leading-4 text-slate-400"}>
                {card.subtitle}
              </div>
            </div>
            {index < cards.length - 1 ? <span className="shrink-0 text-xs font-black text-slate-300">→</span> : null}
          </div>
        ))}
      </div>
    </div>
  );
}

export function GdcDiscoverProjectsStage({
  config,
  imageUrl,
  managedHotspots,
  onContinue,
}: Props) {
  const intro = config.intro;
  const hotspot = useMemo(() => getProjectsHotspot(managedHotspots), [managedHotspots]);
  const screenshot = imageUrl || DEFAULT_IMAGE;

  const layoutRef = useRef<HTMLDivElement>(null);
  const hotspotRef = useRef<HTMLButtonElement>(null);
  const calloutAnchorRef = useRef<HTMLDivElement>(null);
  const [connector, setConnector] = useState<ConnectorGeometry>(null);

  useEffect(() => {
    const layout = layoutRef.current;
    const hotspotElement = hotspotRef.current;
    const calloutAnchor = calloutAnchorRef.current;
    if (!layout || !hotspotElement || !calloutAnchor) return;

    const updateConnector = () => {
      if (window.innerWidth < 1280) {
        setConnector(null);
        return;
      }

      const layoutRect = layout.getBoundingClientRect();
      const hotspotRect = hotspotElement.getBoundingClientRect();
      const anchorRect = calloutAnchor.getBoundingClientRect();

      setConnector({
        width: layoutRect.width,
        height: layoutRect.height,
        startX: hotspotRect.right - layoutRect.left,
        startY: hotspotRect.top + hotspotRect.height / 2 - layoutRect.top,
        endX: anchorRect.left - layoutRect.left,
        endY: anchorRect.top + anchorRect.height / 2 - layoutRect.top,
      });
    };

    updateConnector();
    const resizeObserver = new ResizeObserver(updateConnector);
    resizeObserver.observe(layout);
    resizeObserver.observe(hotspotElement);
    resizeObserver.observe(calloutAnchor);
    window.addEventListener("resize", updateConnector);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateConnector);
    };
  }, [hotspot.x, hotspot.y, hotspot.width, hotspot.height, screenshot]);

  const hotspotStyle = {
    left: `${hotspot.x}%`,
    top: `${hotspot.y}%`,
    width: `${hotspot.width}%`,
    height: `${hotspot.height}%`,
  };

  const elbowX = connector
    ? Math.max(connector.startX + 36, connector.endX - 64)
    : 0;

  return (
    <div ref={layoutRef} className="relative mt-5 grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_380px]" dir="ltr">
      {connector ? (
        <svg
          className="pointer-events-none absolute inset-0 z-20 hidden overflow-visible xl:block"
          width={connector.width}
          height={connector.height}
          viewBox={`0 0 ${connector.width} ${connector.height}`}
          aria-hidden="true"
        >
          <path
            d={`M ${connector.startX} ${connector.startY} H ${elbowX} V ${connector.endY} H ${connector.endX}`}
            fill="none"
            stroke="rgba(13,148,136,.72)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx={connector.startX} cy={connector.startY} r="4" fill="rgb(13 148 136)" />
          <circle cx={connector.startX} cy={connector.startY} r="8" fill="none" stroke="rgba(45,212,191,.38)" strokeWidth="2" />
          <circle cx={connector.endX} cy={connector.endY} r="3" fill="rgb(13 148 136)" />
        </svg>
      ) : null}

      <div className="relative z-10 xl:sticky xl:top-5 xl:self-start">
        <div className="relative overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_18px_55px_rgba(15,23,42,0.10)]" dir="ltr">
          <img
            src={screenshot}
            alt="صفحه اصلی GDC"
            className="block h-auto w-full"
            loading="eager"
            decoding="async"
          />

          <button
            ref={hotspotRef}
            type="button"
            aria-label="بخش Projects در صفحه اصلی GDC"
            className="absolute z-10 rounded-lg border-2 border-teal-400 bg-teal-300/10 shadow-[0_0_0_2px_rgba(255,255,255,0.55)] transition hover:border-teal-500 hover:bg-teal-300/18 focus:outline-none focus:ring-4 focus:ring-teal-200/60"
            style={hotspotStyle}
          />
        </div>
      </div>

      <aside className="relative z-30" dir="rtl">
        <div className="mb-3 flex items-center justify-between gap-3 px-1">
          <span className="rounded-full border border-teal-100 bg-teal-50 px-3 py-1 text-[10px] font-black text-teal-700">
            مرحله ۱ از {config.stageTitles.length}
          </span>
          <span className="text-[10px] font-bold text-slate-400">سؤال ۱</span>
        </div>

        <h2 className="px-1 text-2xl font-black leading-9 text-slate-950">{intro.title}</h2>

        <div
          ref={calloutAnchorRef}
          className="relative mt-5 overflow-hidden rounded-[22px] border border-teal-200 bg-white shadow-[0_16px_45px_rgba(15,23,42,0.08)]"
        >
          <div className="h-1 bg-gradient-to-l from-sky-400 via-teal-400 to-teal-700" />
          <div className="p-5">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-teal-500 shadow-[0_0_0_5px_rgba(45,212,191,.12)]" />
              <div className="text-[10px] font-black uppercase tracking-wide text-teal-700">Projects</div>
            </div>

            <h3 className="mt-4 text-lg font-black leading-7 text-slate-950">{intro.projectTitle}</h3>
            <p className="mt-3 text-sm leading-8 text-slate-700">{intro.projectBody}</p>

            <div className="mt-4 rounded-xl border border-teal-100 bg-teal-50/55 px-3 py-3">
              <div className="text-[10px] font-black text-teal-800">{intro.issueLabel}</div>
              <p className="mt-1.5 text-xs leading-6 text-slate-600">{intro.issueBody}</p>
              <p className="mt-1 text-xs font-bold leading-6 text-teal-800">{intro.entryBody}</p>
            </div>

            <div className="mt-3 rounded-xl border border-amber-100 bg-amber-50/70 px-3 py-3 text-xs leading-6 text-amber-950/75">
              {intro.projectCaveat}
            </div>

            <ArchitectureRail config={config} />
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={onContinue}
            className="inline-flex items-center gap-1 rounded-xl bg-teal-700 px-5 py-3 text-xs font-black text-white shadow-[0_8px_20px_rgba(13,148,136,0.18)] transition hover:bg-teal-800"
          >
            {intro.nextButton || "ورود به Projects"}
            <ChevronLeft className="h-4 w-4" />
          </button>
        </div>
      </aside>
    </div>
  );
}
