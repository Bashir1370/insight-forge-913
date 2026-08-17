import { createFileRoute } from "@tanstack/react-router";
import { RnaSeqInTranscriptomicsLesson } from "@/features/transcriptomics-learning/foundations/rna-seq-in-transcriptomics";

export const Route = createFileRoute(
  "/learn_/transcriptomics_/foundations_/rna-seq-in-transcriptomics",
)({
  head: () => ({
    meta: [
      {
        title:
          "RNA-seq و Microarray در نقشه ترنسکریپتومیکس | مبانی هاب‌ژن",
      },
      {
        name: "description",
        content:
          "یک درس تعاملی و بصری برای مقایسه RNA-seq و Microarray و فهم تفاوت حوزه ترنسکریپتومیکس، فناوری اندازه‌گیری، FASTQ و ماتریس بیان.",
      },
    ],
  }),

  component: RnaSeqInTranscriptomicsLesson,
});
