import { createFileRoute } from "@tanstack/react-router";

import { RnaSeqIntegratedProjectLesson } from "@/features/transcriptomics-learning/rna-seq/integrated-project";

export const Route = createFileRoute(
  "/learn_/transcriptomics_/rna-seq_/integrated-project",
)({
  component: RnaSeqIntegratedProjectLesson,
});
