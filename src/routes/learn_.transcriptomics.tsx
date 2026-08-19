import { createFileRoute } from "@tanstack/react-router";

import {
  getLearningCurriculum,
  getLearningDomain,
} from "@/features/learning/learning-catalog";
import { LearningDomainHome } from "@/features/learning/components/LearningDomainHome";

export const Route = createFileRoute("/learn_/transcriptomics")({
  component: TranscriptomicsLearningHub,
});

function TranscriptomicsLearningHub() {
  const domain = getLearningDomain("transcriptomics");
  const curriculum = getLearningCurriculum("transcriptomics");

  if (!domain || !curriculum) {
    return null;
  }

  return (
    <LearningDomainHome
      domain={domain}
      curriculum={curriculum}
    />
  );
}
