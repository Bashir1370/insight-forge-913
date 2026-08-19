import { createFileRoute } from "@tanstack/react-router";

import { RnaSeqSampleLevelQcLesson } from "@/features/transcriptomics-learning/rna-seq/sample-level-qc";

export const Route = createFileRoute(
  "/learn_/transcriptomics_/rna-seq_/sample-level-qc",
)({
  component: RnaSeqSampleLevelQcLesson,
});
