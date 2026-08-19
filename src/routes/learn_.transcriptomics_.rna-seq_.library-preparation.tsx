import { createFileRoute } from "@tanstack/react-router";

import { RnaSeqLibraryPreparationLesson } from "@/features/transcriptomics-learning/rna-seq/library-preparation";

export const Route = createFileRoute(
  "/learn_/transcriptomics_/rna-seq_/library-preparation",
)({
  component: RnaSeqLibraryPreparationLesson,
});
