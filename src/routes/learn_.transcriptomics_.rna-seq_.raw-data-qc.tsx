import { createFileRoute } from "@tanstack/react-router";

import { RnaSeqRawDataQcLesson } from "@/features/transcriptomics-learning/rna-seq/raw-data-qc";

export const Route = createFileRoute(
  "/learn_/transcriptomics_/rna-seq_/raw-data-qc",
)({
  component: RnaSeqRawDataQcLesson,
});
