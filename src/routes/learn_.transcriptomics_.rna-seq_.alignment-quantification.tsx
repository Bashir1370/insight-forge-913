import { createFileRoute } from "@tanstack/react-router";

import { RnaSeqAlignmentQuantificationLesson } from "@/features/transcriptomics-learning/rna-seq/alignment-quantification";

export const Route = createFileRoute(
  "/learn_/transcriptomics_/rna-seq_/alignment-quantification",
)({
  component: RnaSeqAlignmentQuantificationLesson,
});
