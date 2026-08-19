import { createFileRoute } from "@tanstack/react-router";

import { RnaSeqCountMatrixLesson } from "@/features/transcriptomics-learning/rna-seq/count-matrix";

export const Route = createFileRoute(
  "/learn_/transcriptomics_/rna-seq_/count-matrix",
)({
  component: RnaSeqCountMatrixLesson,
});
