import { createFileRoute } from "@tanstack/react-router";
import { GeneExpressionLesson } from "@/features/transcriptomics-learning/foundations/gene-expression";

export const Route = createFileRoute(
  "/learn_/transcriptomics_/foundations_/gene-expression",
)({
  head: () => ({
    meta: [
      {
        title:
          "بیان ژن یعنی چه؟ | مبانی ترنسکریپتومیکس هاب‌ژن",
      },
      {
        name: "description",
        content:
          "یک درس تعاملی برای فهم تفاوت وجود ژن، مقدار RNA و تغییر بیان ژن در شرایط مختلف.",
      },
    ],
  }),

  component: GeneExpressionLesson,
});
