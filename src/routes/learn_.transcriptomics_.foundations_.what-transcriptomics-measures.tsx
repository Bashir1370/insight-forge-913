import { createFileRoute } from "@tanstack/react-router";
import { WhatTranscriptomicsMeasuresLesson } from "@/features/transcriptomics-learning/foundations/what-transcriptomics-measures";

export const Route = createFileRoute(
  "/learn_/transcriptomics_/foundations_/what-transcriptomics-measures",
)({
  head: () => ({
    meta: [
      {
        title:
          "ترنسکریپتومیکس دقیقاً چه چیزی اندازه می‌گیرد؟ | مبانی هاب‌ژن",
      },
      {
        name: "description",
        content:
          "یک درس تعاملی برای تفکیک لایه‌های DNA، RNA، پروتئین و فنوتیپ و تفسیر درست داده‌های ترنسکریپتومیکس.",
      },
    ],
  }),

  component: WhatTranscriptomicsMeasuresLesson,
});
