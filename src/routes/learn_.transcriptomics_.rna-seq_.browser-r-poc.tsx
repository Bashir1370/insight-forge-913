import { createFileRoute } from "@tanstack/react-router";

import { BrowserRnaSeqPoc } from "@/features/transcriptomics-learning/rna-seq/BrowserRnaSeqPoc";

export const Route = createFileRoute(
  "/learn_/transcriptomics_/rna-seq_/browser-r-poc",
)({
  ssr: false,
  component: BrowserRnaSeqPoc,
});
