import { createFileRoute } from "@tanstack/react-router";
import { BulkSingleCellSpatialLesson } from "@/features/transcriptomics-learning/foundations/bulk-single-cell-spatial";

export const Route = createFileRoute(
  "/learn_/transcriptomics_/foundations_/bulk-single-cell-spatial",
)({
  head: () => ({
    meta: [
      {
        title:
          "توده‌ای، تک‌سلولی یا فضایی؟ | مبانی ترنسکریپتومیکس هاب‌ژن",
      },
      {
        name: "description",
        content:
          "یک درس تعاملی برای تفکیک سطح مشاهده در ترنسکریپتومیکس از فناوری اندازه‌گیری و مقایسه نمای توده‌ای، تک‌سلولی و فضایی.",
      },
    ],
  }),

  component: BulkSingleCellSpatialLesson,
});
