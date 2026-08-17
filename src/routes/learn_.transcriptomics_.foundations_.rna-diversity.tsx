import { createFileRoute } from "@tanstack/react-router";
import { RnaDiversityLesson } from "@/features/transcriptomics-learning/foundations/rna-diversity";

export const Route = createFileRoute(
  "/learn_/transcriptomics_/foundations_/rna-diversity",
)({
  head: () => ({
    meta: [
      {
        title:
          "RNA فقط mRNA نیست | مبانی ترنسکریپتومیکس هاب‌ژن",
      },
      {
        name: "description",
        content:
          "یک درس تعاملی برای فهم تنوع RNA و اثر آماده‌سازی کتابخانه بر بخشی از ترنسکریپتوم که مشاهده می‌شود.",
      },
    ],
  }),

  component: RnaDiversityLesson,
});
