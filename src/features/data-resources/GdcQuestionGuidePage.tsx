import type { CSSProperties } from "react";

import "./gdc-question-guide.css";

import { GdcCohortBuilderFiltersProvider } from "./GdcCohortBuilderFiltersContext";
import { GdcProjectDecisionProvider } from "./GdcProjectDecisionContext";
import { GdcProjectSummaryProvider } from "./GdcProjectSummaryContext";
import {
  GdcQuestionOneGuide,
  type GdcQuestionOneGuideProps,
} from "./GdcQuestionOneGuide";
import { GdcStudyDesignProvider } from "./GdcStudyDesignContext";
import {
  DEFAULT_GDC_COHORT_BUILDER_FILTERS_CONFIG,
  type GdcCohortBuilderFiltersConfig,
} from "./gdc-cohort-builder-filters-config";
import {
  DEFAULT_GDC_COHORT_BUILDER_INTRO_CONFIG,
  type GdcCohortBuilderIntroConfig,
} from "./gdc-cohort-builder-intro-config";
import {
  DEFAULT_GDC_PROJECT_SUMMARY_CONFIG,
  type GdcProjectSummaryConfig,
} from "./gdc-project-summary-config";
import { getGdcProjectDecisionConfig } from "./gdc-project-decision-config";
import { getGdcLensLayout } from "./gdc-lens-layout";
import { getGdcStudyDesignConfig } from "./gdc-study-design-config";

type Props = Omit<GdcQuestionOneGuideProps, "cohortBuilderIntroConfig"> & {
  projectSummaryConfig?: GdcProjectSummaryConfig;
  cohortBuilderIntroConfig?: GdcCohortBuilderIntroConfig;
  cohortBuilderFiltersConfig?: GdcCohortBuilderFiltersConfig;
};

type GuideStyle = CSSProperties & {
  "--gdc-lens-modal-max-width"?: string;
  "--gdc-lens-image-column-width"?: string;
  "--gdc-lens-image-height"?: string;
  "--gdc-lens-image-fit"?: string;
};

function prepareStageTitles(
  config: GdcQuestionOneGuideProps["guideConfig"],
  projectDecisionTitle: string,
  projectSummaryTitle: string,
) {
  const next = structuredClone(config);

  next.stageTitles = [
    next.stageTitles[0] ?? "اول محدوده داده‌ها را پیدا کنیم",
    next.stageTitles[1] ?? "Projects را بخوان",
    next.stageTitles[2] ?? "طراحی مطالعه و اعمال فیلترها",
    projectDecisionTitle,
    projectSummaryTitle,
  ];

  return next;
}

export function GdcQuestionGuidePage({
  projectSummaryConfig = DEFAULT_GDC_PROJECT_SUMMARY_CONFIG,
  cohortBuilderIntroConfig = DEFAULT_GDC_COHORT_BUILDER_INTRO_CONFIG,
  cohortBuilderFiltersConfig = DEFAULT_GDC_COHORT_BUILDER_FILTERS_CONFIG,
  ...props
}: Props) {
  const projectDecision = getGdcProjectDecisionConfig(props.guideConfig);
  const guideConfig = prepareStageTitles(
    props.guideConfig,
    projectDecision.title,
    projectSummaryConfig.title,
  );
  const studyDesign = getGdcStudyDesignConfig(guideConfig);
  const lensLayout = getGdcLensLayout(guideConfig.projects);

  const style: GuideStyle = {
    "--gdc-lens-modal-max-width": `${lensLayout.modalMaxWidth}px`,
    "--gdc-lens-image-column-width": `${lensLayout.imageColumnWidth}px`,
    "--gdc-lens-image-height": lensLayout.imageHeight > 0 ? `${lensLayout.imageHeight}px` : "auto",
    "--gdc-lens-image-fit": lensLayout.imageFit,
  };

  return (
    <GdcStudyDesignProvider config={studyDesign}>
      <GdcProjectDecisionProvider config={projectDecision}>
        <GdcProjectSummaryProvider config={projectSummaryConfig}>
          <GdcCohortBuilderFiltersProvider config={cohortBuilderFiltersConfig}>
            <div className="gdc-question-guide" style={style}>
              <GdcQuestionOneGuide
                {...props}
                guideConfig={guideConfig}
                cohortBuilderIntroConfig={cohortBuilderIntroConfig}
              />
            </div>
          </GdcCohortBuilderFiltersProvider>
        </GdcProjectSummaryProvider>
      </GdcProjectDecisionProvider>
    </GdcStudyDesignProvider>
  );
}
