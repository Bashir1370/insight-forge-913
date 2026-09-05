import type { ComponentProps } from "react";
import { useEffect, useRef } from "react";

import { GdcProjectDecisionProvider } from "./GdcProjectDecisionContext";
import { GdcQuestionDrivenGuideV5 } from "./GdcQuestionDrivenGuideV5";
import { GdcStudyDesignProvider } from "./GdcStudyDesignContext";
import { getGdcProjectDecisionConfig } from "./gdc-project-decision-config";
import { getGdcStudyDesignConfig } from "./gdc-study-design-config";
import {
  HIDDEN_GDC_LENS_IMAGE,
  getGdcLensLayout,
} from "./gdc-lens-layout";

type Props = ComponentProps<typeof GdcQuestionDrivenGuideV5>;
type GuideConfig = Props["guideConfig"];

const PERSIAN_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"] as const;
const FINAL_PROJECT_STAGE_INDEX = 3;
const LEGACY_FINAL_PROJECT_TITLES = [
  "از ۳ Project مرتبط تا انتخاب پژوهشی",
  "از 3 Project مرتبط تا انتخاب پژوهشی",
  "از ۳ پروژه مرتبط تا انتخاب پژوهشی",
];

function toPersianDigits(value: string) {
  return value.replace(/[0-9]/g, (digit) => (PERSIAN_DIGITS[Number(digit)] ?? digit));
}

function transformVisibleText(value: string, finalProjectTitle: string) {
  let next = value;
  for (const legacyTitle of LEGACY_FINAL_PROJECT_TITLES) {
    next = next.replace(legacyTitle, finalProjectTitle);
  }
  return toPersianDigits(next);
}

function localizeTextNode(node: Text, finalProjectTitle: string) {
  const parentTag = node.parentElement?.tagName;
  if (parentTag === "SCRIPT" || parentTag === "STYLE") return;

  const current = node.nodeValue ?? "";
  const localized = transformVisibleText(current, finalProjectTitle);
  if (localized !== current) node.nodeValue = localized;
}

function localizeVisibleNumbers(root: HTMLElement, finalProjectTitle: string) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();
  while (node) {
    localizeTextNode(node as Text, finalProjectTitle);
    node = walker.nextNode();
  }
}

function prepareDisplayGuideConfig(config: GuideConfig, finalProjectTitle: string): GuideConfig {
  const next = structuredClone(config);
  if (next.stageTitles.length > FINAL_PROJECT_STAGE_INDEX) {
    next.stageTitles[FINAL_PROJECT_STAGE_INDEX] = finalProjectTitle;
  }
  return next;
}

export function GdcQuestionDrivenGuideV6(props: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const projectDecision = getGdcProjectDecisionConfig(props.guideConfig);
  const displayGuideConfig = prepareDisplayGuideConfig(props.guideConfig, projectDecision.title);
  const layout = getGdcLensLayout(displayGuideConfig.projects);
  const imageHeight = layout.imageHeight > 0 ? `${layout.imageHeight}px` : "auto";
  const studyDesign = getGdcStudyDesignConfig(displayGuideConfig);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    localizeVisibleNumbers(root, projectDecision.title);

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "characterData") {
          localizeTextNode(mutation.target as Text, projectDecision.title);
          continue;
        }

        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.TEXT_NODE) {
            localizeTextNode(node as Text, projectDecision.title);
          } else if (node instanceof HTMLElement) {
            localizeVisibleNumbers(node, projectDecision.title);
          }
        });
      }
    });

    observer.observe(root, {
      subtree: true,
      childList: true,
      characterData: true,
    });

    return () => observer.disconnect();
  }, [projectDecision.title]);

  return (
    <GdcStudyDesignProvider config={studyDesign}>
      <GdcProjectDecisionProvider config={projectDecision}>
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
      </GdcProjectDecisionProvider>
    </GdcStudyDesignProvider>
  );
}
