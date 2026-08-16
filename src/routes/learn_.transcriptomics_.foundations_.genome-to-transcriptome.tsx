import { createFileRoute } from "@tanstack/react-router";
import { GenomeToTranscriptomeLesson } from "@/features/transcriptomics-learning/foundations/genome-to-transcriptome";

export const Route = createFileRoute(
  "/learn_/transcriptomics_/foundations_/genome-to-transcriptome",
)({
  head: () => ({
    meta: [
      {
        title:
          "از ژنوم تا ترنسکریپتوم | مبانی ترنسکریپتومیکس هاب‌ژن",
      },
      {
        name: "description",
        content:
          "یک درس تعاملی برای فهم تفاوت Genome، Transcriptome و Gene Expression در هاب‌ژن.",
      },
    ],
  }),

  component:
    GenomeToTranscriptomeLesson,
});
