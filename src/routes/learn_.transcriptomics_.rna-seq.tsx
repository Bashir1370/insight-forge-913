import { createFileRoute } from "@tanstack/react-router";

import {
  getLearningDomain,
  getSpecialistTrack,
} from "@/features/learning/learning-catalog";
import { SpecialistTrackHome } from "@/features/learning/components/SpecialistTrackHome";

export const Route = createFileRoute(
  "/learn_/transcriptomics_/rna-seq",
)({
  component: BulkRnaSeqTrackPage,
});

function BulkRnaSeqTrackPage() {
  const domain = getLearningDomain("transcriptomics");
  const track = getSpecialistTrack(
    "transcriptomics",
    "bulk-rna-seq",
  );

  if (!domain || !track) {
    return null;
  }

  return (
    <SpecialistTrackHome
      domain={domain}
      track={track}
    />
  );
}
