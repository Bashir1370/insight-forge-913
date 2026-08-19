import { createFileRoute } from "@tanstack/react-router";

import { RnaSeqBiologicalInterpretationLesson } from "@/features/transcriptomics-learning/rna-seq/biological-interpretation";

export const Route = createFileRoute(
  "/learn_/transcriptomics_/rna-seq_/biological-interpretation",
)({
  component: RnaSeqBiologicalInterpretationLesson,
});
