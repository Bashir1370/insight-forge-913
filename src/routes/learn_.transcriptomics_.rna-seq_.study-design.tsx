import { createFileRoute } from "@tanstack/react-router";

import { RnaSeqStudyDesignLesson } from "@/features/transcriptomics-learning/rna-seq/study-design";

export const Route = createFileRoute(
  "/learn_/transcriptomics_/rna-seq_/study-design",
)({
  component: RnaSeqStudyDesignLesson,
});
