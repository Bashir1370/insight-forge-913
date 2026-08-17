import { createFileRoute } from "@tanstack/react-router";
import { TranscriptomicsQuestionFitLesson } from "@/features/transcriptomics-learning/foundations/transcriptomics-question-fit";

export const Route = createFileRoute(
  "/learn_/transcriptomics_/foundations_/transcriptomics-question-fit",
)({
  head: () => ({
    meta: [
      {
        title:
          "چه سؤال‌هایی برای ترنسکریپتومیکس مناسب‌اند؟ | مبانی هاب‌ژن",
      },
      {
        name: "description",
        content:
          "یک درس تعاملی برای تشخیص اینکه چه زمانی ترنسکریپتومیکس، ژنومیکس، پروتئومیکس یا آزمون فنوتیپی به سؤال پژوهشی نزدیک‌تر است.",
      },
    ],
  }),

  component: TranscriptomicsQuestionFitLesson,
});
