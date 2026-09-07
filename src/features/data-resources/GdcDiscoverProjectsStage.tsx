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
    <div className="mt-4 border-t border-slate-100 pt-4">
      <div className="mb-2 text-[10px] font-black text-slate-400">{config.intro.architectureTitle}</div>
      <div className="flex items-center gap-1 overflow-x-auto pb-1" dir="ltr">
        {cards.map((card, index) => (
          <div key={`${card.title}-${index}`} className="flex min-w-0 flex-1 items-center gap-1">
            <div
              className={
                index === 1
                  ? "min-w-[72px] flex-1 rounded-lg border border-teal-300 bg-teal-50 px-2 py-2 text-center"
                  : "min-w-[72px] flex-1 rounded-lg border border-slate-200 bg-slate-50 px-2 py-2 text-center"
              }
            >
              <div className={index === 1 ? "text-[10px] font-black text-teal-800" : "text-[10px] font-black text-slate-600"}>
                {card.title}
              </div>
              <div className={index === 1 ? "mt-0.5 text-[8px] leading-3 text-teal-700" : "mt-0.5 text-[8px] leading-3 text-slate-400"}>
                {card.subtitle}
              </div>
            </div>
            {index < cards.length - 1 ? <span className="shrink-0 text-[10px] font-black text-slate-300">→</span> : null}
          </div>
        ))}
      </div>
    </div>
  );
}

function InspectorContent({ config }: { config: GdcQuestionGuideConfig }) {
  const intro = config.intro;

  return (
    <>
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-teal-500 shadow-[0_0_0_5px_rgba(45,212,191,.13)]" />
        <span className="text-[10px] font-black uppercase tracking-[0.14em] text-teal-700">Projects</span>
      </div>

      <h3 className="mt-4 text-lg font-black leading-7 text-slate-950">{intro.projectTitle}</h3>
      <p className="mt-2 text-sm leading-7 text-slate-700">{intro.projectBody}</p>

      <div className="mt-4 rounded-xl border border-teal-100 bg-teal-50/60 px-3 py-3">
        <div className="text-[10px] font-black text-teal-800">{intro.issueLabel}</div>
        <p className="mt-1.5 text-xs leading-6 text-slate-600">{intro.issueBody}</p>
        <p className="mt-1 text-xs font-bold leading-6 text-teal-800">{intro.entryBody}</p>
      </div>

      <div className="mt-3 border-r-2 border-amber-300 pr-3 text-xs leading-6 text-slate-500">
        {intro.projectCaveat}
      </div>

      <ArchitectureRail config={config} />
    </>
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

  const canvasRef = useRef<HTMLDivElement>(null);
  const hotspotRef = useRef<HTMLButtonElement>(null);
  const inspectorRef = useRef<HTMLDivElement>(null);
  const [connector, setConnector] = useState<ConnectorGeometry>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const hotspotElement = hotspotRef.current;
    const inspector = inspectorRef.current;
    if (!canvas || !hotspotElement || !inspector) return;

    const updateConnector = () => {
      if (window.innerWidth < 1280) {
        setConnector(null);
        return;
      }

      const canvasRect = canvas.getBoundingClientRect();
      const hotspotRect = hotspotElement.getBoundingClientRect();
      const inspectorRect = inspector.getBoundingClientRect();

      setConnector({
        width: canvasRect.width,
        height: canvasRect.height,
        startX: hotspotRect.right - canvasRect.left,
        startY: hotspotRect.top + hotspotRect.height / 2 - canvasRect.top,
        endX: inspectorRect.left - canvasRect.left,
        endY: inspectorRect.top + 88 - canvasRect.top,
      });
    };

    updateConnector();
    const resizeObserver = new ResizeObserver(updateConnector);
    resizeObserver.observe(canvas);
    resizeObserver.observe(hotspotElement);
    resizeObserver.observe(inspector);
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
    ? Math.min(
        connector.endX - 28,
        Math.max(connector.startX + 72, connector.startX + (connector.endX - connector.startX) * 0.62),
      )
    : 0;

  return (
    <div className="mt-5" dir="rtl">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3 px-1">
        <div>
          <div className="text-[10px] font-black text-teal-700">مرحله ۱ از {config.stageTitles.length} · سؤال ۱</div>
          <h2 className="mt-1 text-2xl font-black leading-9 text-slate-950">{intro.title}</h2>
        </div>
        <div className="text-xs font-bold text-slate-400">روی بخش مشخص‌شده تمرکز کنید</div>
      </div>

      <div
        ref={canvasRef}
        className="relative overflow-hidden rounded-[26px] border border-slate-200 bg-slate-950 shadow-[0_22px_70px_rgba(15,23,42,0.14)]"
        dir="ltr"
      >
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
          aria-describedby="gdc-stage-one-projects-inspector"
          className="absolute z-30 rounded-lg border-2 border-teal-300 bg-teal-300/10 shadow-[0_0_0_9999px_rgba(15,23,42,.48),0_0_0_3px_rgba(255,255,255,.82),0_0_24px_rgba(45,212,191,.34)] transition hover:border-teal-200 hover:bg-teal-300/18 focus:outline-none focus:ring-4 focus:ring-teal-200/60"
          style={hotspotStyle}
        />

        {connector ? (
          <svg
            className="pointer-events-none absolute inset-0 z-40 hidden overflow-visible xl:block"
            width={connector.width}
            height={connector.height}
            viewBox={`0 0 ${connector.width} ${connector.height}`}
            aria-hidden="true"
          >
            <path
              d={`M ${connector.startX} ${connector.startY} H ${elbowX} Q ${elbowX + 16} ${connector.startY} ${elbowX + 16} ${connector.startY + 16} V ${connector.endY - 16} Q ${elbowX + 16} ${connector.endY} ${elbowX + 32} ${connector.endY} H ${connector.endX}`}
              fill="none"
              stroke="rgba(94,234,212,.95)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx={connector.startX} cy={connector.startY} r="4" fill="rgb(45 212 191)" />
            <circle cx={connector.endX} cy={connector.endY} r="3.5" fill="rgb(45 212 191)" />
          </svg>
        ) : null}

        <div
          ref={inspectorRef}
          id="gdc-stage-one-projects-inspector"
          className="absolute right-5 top-5 z-50 hidden w-[360px] max-w-[34%] overflow-hidden rounded-[22px] border border-white/70 bg-white/95 shadow-[0_24px_70px_rgba(15,23,42,.30)] backdrop-blur-xl xl:block"
          dir="rtl"
        >
          <div className="h-1 bg-gradient-to-l from-sky-400 via-teal-400 to-teal-700" />
          <div className="max-h-[min(70vh,560px)] overflow-y-auto p-5">
            <InspectorContent config={config} />
          </div>
        </div>
      </div>

      <div className="mt-4 xl:hidden">
        <div className="overflow-hidden rounded-[22px] border border-teal-100 bg-white shadow-sm">
          <div className="h-1 bg-gradient-to-l from-sky-400 via-teal-400 to-teal-700" />
          <div className="p-5">
            <InspectorContent config={config} />
          </div>
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
    </div>
  );
}
