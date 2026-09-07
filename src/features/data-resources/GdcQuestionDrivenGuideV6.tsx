import type { ComponentProps } from "react";
import { useEffect, useRef } from "react";

import { GdcProjectDecisionProvider } from "./GdcProjectDecisionContext";
import { GdcProjectSummaryProvider } from "./GdcProjectSummaryContext";
import { GdcQuestionDrivenGuideV5 } from "./GdcQuestionDrivenGuideV5";
import { GdcStudyDesignProvider } from "./GdcStudyDesignContext";
import {
  DEFAULT_GDC_PROJECT_SUMMARY_CONFIG,
  type GdcProjectSummaryConfig,
} from "./gdc-project-summary-config";
import { getGdcProjectDecisionConfig } from "./gdc-project-decision-config";
import {
  getGdcStageOneProjectHotspot,
  prepareGdcStageOnePolish,
  type GdcStageOneHotspotGeometry,
} from "./gdc-stage-one-polish";
import { getGdcStudyDesignConfig } from "./gdc-study-design-config";
import {
  HIDDEN_GDC_LENS_IMAGE,
  getGdcLensLayout,
} from "./gdc-lens-layout";

type BaseProps = ComponentProps<typeof GdcQuestionDrivenGuideV5>;
type Props = BaseProps & {
  projectSummaryConfig?: GdcProjectSummaryConfig;
};
type GuideConfig = BaseProps["guideConfig"];

const PERSIAN_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"] as const;
const FINAL_PROJECT_STAGE_INDEX = 3;
const PROJECT_SUMMARY_STAGE_INDEX = 4;
const LEGACY_FINAL_PROJECT_TITLES = [
  "از ۳ Project مرتبط تا انتخاب پژوهشی",
  "از 3 Project مرتبط تا انتخاب پژوهشی",
  "از ۳ پروژه مرتبط تا انتخاب پژوهشی",
];
const LEGACY_PROJECT_SUMMARY_TITLES = ["خواندن اطلاعات پروژه"];

function toPersianDigits(value: string) {
  return value.replace(/[0-9]/g, (digit) => (PERSIAN_DIGITS[Number(digit)] ?? digit));
}

function transformVisibleText(
  value: string,
  finalProjectTitle: string,
  projectSummaryTitle: string,
) {
  let next = value;
  for (const legacyTitle of LEGACY_FINAL_PROJECT_TITLES) {
    next = next.replace(legacyTitle, finalProjectTitle);
  }
  for (const legacyTitle of LEGACY_PROJECT_SUMMARY_TITLES) {
    next = next.replace(legacyTitle, projectSummaryTitle);
  }
  return toPersianDigits(next);
}

function localizeTextNode(
  node: Text,
  finalProjectTitle: string,
  projectSummaryTitle: string,
) {
  const parentTag = node.parentElement?.tagName;
  if (parentTag === "SCRIPT" || parentTag === "STYLE") return;

  const current = node.nodeValue ?? "";
  const localized = transformVisibleText(
    current,
    finalProjectTitle,
    projectSummaryTitle,
  );
  if (localized !== current) node.nodeValue = localized;
}

function localizeVisibleNumbers(
  root: HTMLElement,
  finalProjectTitle: string,
  projectSummaryTitle: string,
) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();
  while (node) {
    localizeTextNode(node as Text, finalProjectTitle, projectSummaryTitle);
    node = walker.nextNode();
  }
}

function prepareDisplayGuideConfig(
  config: GuideConfig,
  finalProjectTitle: string,
  projectSummaryTitle: string,
): GuideConfig {
  const next = structuredClone(config);
  if (next.stageTitles.length > FINAL_PROJECT_STAGE_INDEX) {
    next.stageTitles[FINAL_PROJECT_STAGE_INDEX] = finalProjectTitle;
  }
  if (next.stageTitles.length > PROJECT_SUMMARY_STAGE_INDEX) {
    next.stageTitles[PROJECT_SUMMARY_STAGE_INDEX] = projectSummaryTitle;
  }
  return next;
}

function applyStageOneGeometry(
  element: HTMLElement,
  geometry: GdcStageOneHotspotGeometry | null,
) {
  if (!geometry) return;
  element.style.left = `${geometry.x}%`;
  element.style.top = `${geometry.y}%`;
  element.style.width = `${geometry.width}%`;
  element.style.height = `${geometry.height}%`;
}

function enhanceStageOne(
  root: HTMLElement,
  geometry: GdcStageOneHotspotGeometry | null,
) {
  const image = root.querySelector<HTMLImageElement>('img[alt="صفحه اصلی GDC"]');
  if (!image) return;

  const canvas = image.parentElement;
  const layout = canvas?.closest<HTMLElement>(".mt-5.grid.gap-5");
  const panel = layout?.querySelector<HTMLElement>(":scope > aside");
  const hotspot = image.nextElementSibling as HTMLElement | null;

  layout?.classList.add("gdc-stage-one-layout");
  canvas?.classList.add("gdc-stage-one-canvas");
  panel?.classList.add("gdc-stage-one-panel");

  image.setAttribute("fetchpriority", "high");
  image.setAttribute("decoding", "async");

  if (!hotspot) return;

  hotspot.classList.add("gdc-stage-one-hotspot");
  hotspot.classList.remove("pointer-events-none");
  hotspot.setAttribute("role", "button");
  hotspot.setAttribute("tabindex", "0");
  hotspot.setAttribute("aria-label", "Projects را در محیط واقعی GDC پیدا کردم");
  applyStageOneGeometry(hotspot, geometry);

  if (hotspot.dataset.stageOneEnhanced === "true") return;
  hotspot.dataset.stageOneEnhanced = "true";

  const markFound = () => {
    root.classList.add("gdc-stage-one-found");
    hotspot.setAttribute("aria-pressed", "true");
  };

  hotspot.addEventListener("click", markFound);
  hotspot.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      markFound();
    }
  });
}

export function GdcQuestionDrivenGuideV6({
  projectSummaryConfig = DEFAULT_GDC_PROJECT_SUMMARY_CONFIG,
  ...props
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const projectDecision = getGdcProjectDecisionConfig(props.guideConfig);
  const stagedGuideConfig = prepareDisplayGuideConfig(
    props.guideConfig,
    projectDecision.title,
    projectSummaryConfig.title,
  );
  const displayGuideConfig = prepareGdcStageOnePolish(stagedGuideConfig);
  const layout = getGdcLensLayout(displayGuideConfig.projects);
  const imageHeight = layout.imageHeight > 0 ? `${layout.imageHeight}px` : "auto";
  const studyDesign = getGdcStudyDesignConfig(displayGuideConfig);
  const stageOneProjectHotspot = getGdcStageOneProjectHotspot(props.managedHotspots);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const syncStageOne = () => enhanceStageOne(root, stageOneProjectHotspot);

    localizeVisibleNumbers(
      root,
      projectDecision.title,
      projectSummaryConfig.title,
    );
    syncStageOne();

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "characterData") {
          localizeTextNode(
            mutation.target as Text,
            projectDecision.title,
            projectSummaryConfig.title,
          );
          continue;
        }

        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.TEXT_NODE) {
            localizeTextNode(
              node as Text,
              projectDecision.title,
              projectSummaryConfig.title,
            );
          } else if (node instanceof HTMLElement) {
            localizeVisibleNumbers(
              node,
              projectDecision.title,
              projectSummaryConfig.title,
            );
          }
        });
      }

      syncStageOne();
    });

    observer.observe(root, {
      subtree: true,
      childList: true,
      characterData: true,
    });

    return () => observer.disconnect();
  }, [
    projectDecision.title,
    projectSummaryConfig.title,
    stageOneProjectHotspot?.x,
    stageOneProjectHotspot?.y,
    stageOneProjectHotspot?.width,
    stageOneProjectHotspot?.height,
  ]);

  return (
    <GdcStudyDesignProvider config={studyDesign}>
      <GdcProjectDecisionProvider config={projectDecision}>
        <GdcProjectSummaryProvider config={projectSummaryConfig}>
          <div ref={rootRef} className="gdc-guide-v6">
            <style>{`
              .gdc-guide-v6 p {
                text-align: justify !important;
                text-align-last: right;
                text-justify: inter-word;
              }

              .gdc-guide-v6 .mt-5.grid.gap-5 {
                direction: ltr;
              }

              .gdc-guide-v6 .mt-5.grid.gap-5 > aside {
                direction: rtl;
              }

              /* Stage 1 — turn the real GDC screenshot into a guided learning canvas. */
              .gdc-guide-v6 .gdc-stage-one-layout {
                gap: 24px !important;
                align-items: start;
              }

              @media (min-width: 1280px) {
                .gdc-guide-v6 .gdc-stage-one-layout {
                  grid-template-columns: minmax(0, 1.65fr) 440px !important;
                }
              }

              .gdc-guide-v6 .gdc-stage-one-canvas {
                isolation: isolate;
                position: relative;
                overflow: hidden;
                border: 1px solid rgba(148, 163, 184, .42) !important;
                border-radius: 26px !important;
                background: #fff;
                box-shadow:
                  0 24px 70px rgba(15, 23, 42, .11),
                  0 2px 8px rgba(15, 23, 42, .05) !important;
              }

              .gdc-guide-v6 .gdc-stage-one-canvas::before {
                content: "محیط واقعی GDC";
                position: absolute;
                left: 14px;
                top: 14px;
                z-index: 35;
                border: 1px solid rgba(255,255,255,.72);
                border-radius: 999px;
                background: rgba(15, 23, 42, .78);
                color: white;
                padding: 7px 11px;
                font-size: 10px;
                font-weight: 900;
                letter-spacing: -.01em;
                box-shadow: 0 8px 24px rgba(15,23,42,.16);
                backdrop-filter: blur(10px);
                pointer-events: none;
              }

              .gdc-guide-v6 .gdc-stage-one-canvas > img[alt="صفحه اصلی GDC"] {
                display: block;
                width: 100% !important;
                height: auto !important;
                image-rendering: auto;
                filter: saturate(1.035) contrast(1.025) brightness(1.01);
                transform: translateZ(0);
                backface-visibility: hidden;
              }

              .gdc-guide-v6 .gdc-stage-one-hotspot {
                pointer-events: auto !important;
                cursor: pointer;
                z-index: 30 !important;
                border: 3px solid rgb(45 212 191) !important;
                border-radius: 10px !important;
                background: rgba(45, 212, 191, .13) !important;
                box-shadow:
                  0 0 0 999px rgba(15, 23, 42, .20),
                  0 0 0 4px rgba(45, 212, 191, .12),
                  0 10px 30px rgba(13, 148, 136, .24) !important;
                transition:
                  border-color .22s ease,
                  background .22s ease,
                  box-shadow .22s ease,
                  transform .22s ease;
              }

              .gdc-guide-v6 .gdc-stage-one-hotspot:hover,
              .gdc-guide-v6 .gdc-stage-one-hotspot:focus-visible {
                transform: scale(1.035);
                outline: none;
                border-color: rgb(20 184 166) !important;
                background: rgba(45, 212, 191, .22) !important;
              }

              .gdc-guide-v6 .gdc-stage-one-hotspot::before {
                content: "۱";
                position: absolute;
                left: -15px;
                top: -17px;
                display: grid;
                place-items: center;
                width: 30px;
                height: 30px;
                border: 3px solid white;
                border-radius: 999px;
                background: rgb(13 148 136);
                color: white;
                font-size: 12px;
                font-weight: 950;
                box-shadow: 0 7px 20px rgba(13, 148, 136, .35);
                animation: gdc-stage-one-marker 1.9s ease-in-out infinite;
              }

              .gdc-guide-v6 .gdc-stage-one-hotspot::after {
                content: "Projects  ·  از اینجا شروع کن";
                position: absolute;
                left: -2px;
                top: calc(100% + 10px);
                width: max-content;
                max-width: 180px;
                border: 1px solid rgba(153, 246, 228, .75);
                border-radius: 10px;
                background: rgba(255,255,255,.96);
                color: rgb(15 118 110);
                padding: 7px 10px;
                font-size: 10px;
                font-weight: 900;
                line-height: 1.5;
                box-shadow: 0 10px 26px rgba(15,23,42,.14);
                backdrop-filter: blur(8px);
                white-space: nowrap;
              }

              .gdc-guide-v6.gdc-stage-one-found .gdc-stage-one-hotspot {
                border-color: rgb(16 185 129) !important;
                background: rgba(16, 185, 129, .18) !important;
                box-shadow:
                  0 0 0 999px rgba(15, 23, 42, .09),
                  0 0 0 4px rgba(16, 185, 129, .12),
                  0 12px 34px rgba(5, 150, 105, .23) !important;
              }

              .gdc-guide-v6.gdc-stage-one-found .gdc-stage-one-hotspot::before {
                content: "✓";
                background: rgb(5 150 105);
                animation: none;
              }

              .gdc-guide-v6.gdc-stage-one-found .gdc-stage-one-hotspot::after {
                content: "Projects پیدا شد  ✓";
                color: rgb(4 120 87);
                border-color: rgba(167, 243, 208, .9);
              }

              @keyframes gdc-stage-one-marker {
                0%, 100% {
                  transform: scale(1);
                  box-shadow: 0 7px 20px rgba(13,148,136,.35), 0 0 0 0 rgba(45,212,191,.28);
                }
                50% {
                  transform: scale(1.08);
                  box-shadow: 0 7px 20px rgba(13,148,136,.35), 0 0 0 9px rgba(45,212,191,0);
                }
              }

              .gdc-guide-v6 .gdc-stage-one-panel {
                position: relative;
                overflow: hidden;
                border: 1px solid rgba(148, 163, 184, .34) !important;
                border-radius: 26px !important;
                padding: 24px !important;
                box-shadow:
                  0 24px 70px rgba(15, 23, 42, .08),
                  0 2px 8px rgba(15,23,42,.04) !important;
              }

              .gdc-guide-v6 .gdc-stage-one-panel::before {
                content: "";
                position: absolute;
                inset: 0 0 auto 0;
                height: 4px;
                background: linear-gradient(90deg, rgb(13 148 136), rgb(45 212 191), rgb(56 189 248));
              }

              .gdc-guide-v6 .gdc-stage-one-panel > div:first-child {
                display: inline-flex;
                align-items: center;
                border: 1px solid rgb(204 251 241);
                border-radius: 999px;
                background: rgb(240 253 250);
                padding: 6px 10px;
                color: rgb(15 118 110) !important;
                font-size: 10px !important;
              }

              .gdc-guide-v6 .gdc-stage-one-panel > h2 {
                margin-top: 12px !important;
                font-size: 1.65rem !important;
                line-height: 1.35 !important;
                letter-spacing: -.02em;
              }

              .gdc-guide-v6 .gdc-stage-one-panel > .mt-5.space-y-3 {
                margin-top: 20px !important;
              }

              .gdc-guide-v6 .gdc-stage-one-panel > .mt-5.space-y-3 > :not([hidden]) ~ :not([hidden]) {
                margin-top: 12px !important;
              }

              .gdc-guide-v6 .gdc-stage-one-panel > .mt-5.space-y-3 > div {
                position: relative;
                border-radius: 18px !important;
                padding: 16px !important;
                transition: transform .2s ease, box-shadow .2s ease, border-color .2s ease;
              }

              .gdc-guide-v6 .gdc-stage-one-panel > .mt-5.space-y-3 > div:hover {
                transform: translateY(-1px);
              }

              .gdc-guide-v6 .gdc-stage-one-panel > .mt-5.space-y-3 > div:nth-child(1) {
                border: 1px solid rgb(226 232 240);
                background: linear-gradient(145deg, rgb(248 250 252), white);
              }

              .gdc-guide-v6 .gdc-stage-one-panel > .mt-5.space-y-3 > div:nth-child(2) {
                border: 1px solid rgb(153 246 228) !important;
                background: linear-gradient(145deg, rgba(240,253,250,.96), rgba(236,254,255,.78)) !important;
                box-shadow: inset 0 0 0 1px rgba(255,255,255,.68);
              }

              .gdc-guide-v6 .gdc-stage-one-panel > .mt-5.space-y-3 > div:nth-child(3) {
                border: 1px solid rgb(226 232 240) !important;
                background: white;
              }

              .gdc-guide-v6 .gdc-stage-one-panel > .mt-5.space-y-3 > div:nth-child(4) {
                border: 1px solid rgb(254 215 170) !important;
                background: linear-gradient(145deg, rgb(255 251 235), rgb(255 247 237)) !important;
              }

              .gdc-guide-v6.gdc-stage-one-found .gdc-stage-one-panel > .mt-5.space-y-3 > div:nth-child(4) {
                border-color: rgb(167 243 208) !important;
                background: linear-gradient(145deg, rgb(236 253 245), rgb(240 253 250)) !important;
                box-shadow: 0 8px 24px rgba(5,150,105,.08);
              }

              .gdc-guide-v6.gdc-stage-one-found .gdc-stage-one-panel > .mt-5.space-y-3 > div:nth-child(4)::after {
                content: "✓  نقطه شروع پیدا شد";
                display: inline-flex;
                margin-top: 10px;
                border-radius: 999px;
                background: rgb(209 250 229);
                color: rgb(4 120 87);
                padding: 5px 9px;
                font-size: 10px;
                font-weight: 900;
              }

              .gdc-guide-v6 .gdc-stage-one-panel > .mt-5.space-y-3 > div:nth-child(3) > .mt-3.grid {
                gap: 14px !important;
              }

              .gdc-guide-v6 .gdc-stage-one-panel > .mt-5.space-y-3 > div:nth-child(3) > .mt-3.grid > div {
                position: relative;
                min-height: 72px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                border-radius: 14px !important;
                border: 1px solid rgb(226 232 240);
                background: rgb(248 250 252) !important;
                padding: 10px 8px !important;
              }

              .gdc-guide-v6 .gdc-stage-one-panel > .mt-5.space-y-3 > div:nth-child(3) > .mt-3.grid > div:nth-child(2) {
                border-color: rgb(94 234 212) !important;
                background: rgb(240 253 250) !important;
                color: rgb(15 118 110) !important;
                box-shadow: 0 7px 20px rgba(13,148,136,.08);
              }

              @media (min-width: 640px) {
                .gdc-guide-v6 .gdc-stage-one-panel > .mt-5.space-y-3 > div:nth-child(3) > .mt-3.grid > div:not(:last-child)::after {
                  content: "→";
                  position: absolute;
                  right: -12px;
                  top: 50%;
                  z-index: 4;
                  transform: translateY(-50%);
                  color: rgb(148 163 184);
                  font-size: 15px;
                  font-weight: 900;
                }
              }

              .gdc-guide-v6 .gdc-stage-one-panel > .mt-5.grid.grid-cols-2 {
                gap: 10px !important;
              }

              .gdc-guide-v6 .gdc-stage-one-panel > .mt-5.grid.grid-cols-2 > button:last-child {
                border: 1px solid rgb(13 148 136);
                background: linear-gradient(135deg, rgb(15 118 110), rgb(13 148 136)) !important;
                box-shadow: 0 10px 28px rgba(13,148,136,.22);
                transition: transform .18s ease, box-shadow .18s ease;
              }

              .gdc-guide-v6 .gdc-stage-one-panel > .mt-5.grid.grid-cols-2 > button:last-child:hover {
                transform: translateY(-1px);
                box-shadow: 0 14px 34px rgba(13,148,136,.27);
              }

              @media (max-width: 639px) {
                .gdc-guide-v6 .gdc-stage-one-canvas::before {
                  left: 9px;
                  top: 9px;
                  padding: 5px 8px;
                  font-size: 9px;
                }

                .gdc-guide-v6 .gdc-stage-one-hotspot::after {
                  font-size: 9px;
                  max-width: 150px;
                  white-space: normal;
                }

                .gdc-guide-v6 .gdc-stage-one-panel {
                  padding: 18px !important;
                }
              }

              @media (prefers-reduced-motion: reduce) {
                .gdc-guide-v6 .gdc-stage-one-hotspot::before {
                  animation: none !important;
                }

                .gdc-guide-v6 .gdc-stage-one-panel > .mt-5.space-y-3 > div,
                .gdc-guide-v6 .gdc-stage-one-panel > .mt-5.grid.grid-cols-2 > button:last-child,
                .gdc-guide-v6 .gdc-stage-one-hotspot {
                  transition: none !important;
                }
              }

              .gdc-guide-v6 .fixed.inset-0 > section {
                width: min(96vw, ${layout.modalMaxWidth}px) !important;
                max-width: ${layout.modalMaxWidth}px !important;
                max-height: 96vh !important;
                direction: ltr !important;
              }

              .gdc-guide-v6 .fixed.inset-0 > section > div:last-of-type {
                direction: rtl !important;
              }

              @media (min-width: 1024px) {
                .gdc-guide-v6 .fixed.inset-0 > section {
                  grid-template-columns: ${layout.imageColumnWidth}px minmax(0, 1fr) !important;
                }

                .gdc-guide-v6 .fixed.inset-0 > section:has(img[src="${HIDDEN_GDC_LENS_IMAGE}"]) {
                  grid-template-columns: minmax(0, 1fr) !important;
                }
              }

              .gdc-guide-v6 .fixed.inset-0 > section > div:first-of-type {
                padding: 16px !important;
              }

              .gdc-guide-v6 .fixed.inset-0 > section > div:first-of-type:has(img[src="${HIDDEN_GDC_LENS_IMAGE}"]) {
                display: none !important;
              }

              .gdc-guide-v6 .fixed.inset-0 > section > div:first-of-type img {
                width: 100% !important;
                height: ${imageHeight} !important;
                max-height: min(78vh, 1000px) !important;
                object-fit: ${layout.imageFit} !important;
                display: block !important;
              }

              .gdc-guide-v6 .fixed.inset-0 > section > div:last-of-type {
                padding: 20px 24px !important;
              }

              .gdc-guide-v6 .fixed.inset-0 > section > div:last-of-type > .mt-6 {
                margin-top: 16px !important;
              }

              .gdc-guide-v6 .fixed.inset-0 > section > div:last-of-type .space-y-4 > :not([hidden]) ~ :not([hidden]) {
                margin-top: 12px !important;
              }

              .gdc-guide-v6 .fixed.inset-0 > section > div:last-of-type [class*="rounded-2xl border p-5"] {
                padding: 16px !important;
              }

              .gdc-guide-v6 .fixed.inset-0 > section > div:last-of-type p.leading-7 {
                line-height: 1.75rem !important;
              }

              @media (max-width: 1023px) {
                .gdc-guide-v6 .fixed.inset-0 {
                  padding: 8px !important;
                }

                .gdc-guide-v6 .fixed.inset-0 > section {
                  width: 98vw !important;
                  max-height: 98vh !important;
                }
              }
            `}</style>
            <GdcQuestionDrivenGuideV5 {...props} guideConfig={displayGuideConfig} />
          </div>
        </GdcProjectSummaryProvider>
      </GdcProjectDecisionProvider>
    </GdcStudyDesignProvider>
  );
}
