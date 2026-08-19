import { createFileRoute } from "@tanstack/react-router";

import { RnaSeqSequencingFastqLesson } from "@/features/transcriptomics-learning/rna-seq/sequencing-fastq";

export const Route = createFileRoute(
  "/learn_/transcriptomics_/rna-seq_/sequencing-fastq",
)({
  component: RnaSeqSequencingFastqLesson,
});
