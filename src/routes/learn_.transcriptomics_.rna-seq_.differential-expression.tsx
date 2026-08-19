import { createFileRoute } from "@tanstack/react-router";

import { RnaSeqDifferentialExpressionLesson } from "@/features/transcriptomics-learning/rna-seq/differential-expression";

export const Route = createFileRoute(
  "/learn_/transcriptomics_/rna-seq_/differential-expression",
)({
  component: RnaSeqDifferentialExpressionLesson,
});
