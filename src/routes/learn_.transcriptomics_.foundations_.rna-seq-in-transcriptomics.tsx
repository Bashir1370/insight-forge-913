import { createFileRoute } from "@tanstack/react-router";
import { RnaSeqInTranscriptomicsLesson } from "@/features/transcriptomics-learning/foundations/rna-seq-in-transcriptomics";

export const Route = createFileRoute(
  "/learn_/transcriptomics_/foundations_/rna-seq-in-transcriptomics",
)({
  head: () => ({
    meta: [
      {
        title: "نقشه فناوری‌های ترنسکریپتومیکس | مبانی هاب‌ژن",
      },
      {
        name: "description",
        content:
          "پایان مبانی ترنسکریپتومیکس و مقدمه ورود به فناوری‌های تخصصی؛ با نقشه RNA-seq، Microarray، scRNA-seq، Spatial، Long-read و small RNA-seq و مقایسه انیمیشنی RNA-seq و Microarray.",
      },
    ],
  }),

  component: RnaSeqInTranscriptomicsLesson,
});
