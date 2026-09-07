import { useEffect } from "react";

import {
  DEFAULT_GDC_QUESTION_GUIDE,
  type GdcQuestionId,
} from "./gdc-question-guide-config";

export type GdcLegacyQuestionTarget = {
  questionId: GdcQuestionId;
  stageIndex?: number;
};

/**
 * Temporary compatibility bridge for questions that still use the legacy guide.
 * Question 1 no longer depends on this adapter.
 */
export function GdcLegacyQuestionBridge({ target }: { target: GdcLegacyQuestionTarget }) {
  useEffect(() => {
    const defaultQuestion = DEFAULT_GDC_QUESTION_GUIDE.questions.find(
      (item) => item.id === target.questionId,
    );
    let attempts = 0;

    const timer = window.setInterval(() => {
      attempts += 1;
      const buttons = Array.from(document.querySelectorAll("button"));

      if (defaultQuestion) {
        buttons.find((button) => button.textContent?.includes(defaultQuestion.title))?.click();
      }

      if (typeof target.stageIndex === "number") {
        const prefix = `${target.stageIndex + 1}.`;
        const stageButton = buttons.find((button) =>
          button.textContent?.trim().startsWith(prefix),
        );
        if (stageButton) {
          stageButton.click();
          window.clearInterval(timer);
        }
      } else if (
        defaultQuestion &&
        buttons.some((button) => button.textContent?.includes(defaultQuestion.title))
      ) {
        window.clearInterval(timer);
      }

      if (attempts > 20) window.clearInterval(timer);
    }, 60);

    return () => window.clearInterval(timer);
  }, [target]);

  return null;
}
