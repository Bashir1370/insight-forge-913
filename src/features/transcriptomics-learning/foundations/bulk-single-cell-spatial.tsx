import { createFileRoute } from "@tanstack/react-router";
import { RnaSeqInTranscriptomicsLesson } from "@/features/transcriptomics-learning/foundations/rna-seq-in-transcriptomics";

export const Route = createFileRoute(
  "/learn_/transcriptomics_/foundations_/rna-seq-in-transcriptomics",
)({
  head: () => ({
    meta: [
      {
        title:
          "RNA-seq در نقشه ترنسکریپتومیکس کجاست؟ | مبانی هاب‌ژن",
      },
      {
        name: "description",
        content:
          "یک درس تعاملی برای فهم جایگاه RNA-seq در ترنسکریپتومیکس و مسیر نمونه زیستی تا FASTQ، کمی‌سازی، ماتریس بیان، تحلیل و تفسیر.",
      },
    ],
  }),

  component: RnaSeqInTranscriptomicsLesson,
});
