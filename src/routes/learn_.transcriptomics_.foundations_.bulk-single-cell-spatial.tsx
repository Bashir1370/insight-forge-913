import { createFileRoute } from "@tanstack/react-router";
import { BulkSingleCellSpatialLesson } from "@/features/transcriptomics-learning/foundations/bulk-single-cell-spatial";

export const Route = createFileRoute(
  "/learn_/transcriptomics_/foundations_/bulk-single-cell-spatial",
)({
  head: () => ({
    meta: [
      {
        title:
          "RNA-seq توده‌ای، تک‌سلولی یا ترنسکریپتومیکس فضایی؟ | مبانی هاب‌ژن",
      },
      {
        name: "description",
        content:
          "یک درس تعاملی برای مقایسه RNA-seq توده‌ای، تک‌سلولی و ترنسکریپتومیکس فضایی بر اساس نوع سؤال پژوهشی و وضوح موردنیاز.",
      },
    ],
  }),

  component: BulkSingleCellSpatialLesson,
});
