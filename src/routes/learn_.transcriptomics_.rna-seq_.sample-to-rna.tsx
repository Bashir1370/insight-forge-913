import { createFileRoute } from "@tanstack/react-router";

import { RnaSeqSampleToRnaLesson } from "@/features/transcriptomics-learning/rna-seq/sample-to-rna";

export const Route = createFileRoute(
  "/learn_/transcriptomics_/rna-seq_/sample-to-rna",
)({
  component: RnaSeqSampleToRnaLesson,
});
