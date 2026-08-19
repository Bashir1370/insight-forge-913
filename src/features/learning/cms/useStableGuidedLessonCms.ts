import { useCallback, useMemo } from "react";

import type { GuidedLessonSection } from "@/features/learning/components/GuidedConceptLesson";
import {
  useGuidedLessonCms,
  type GuidedLessonCmsDocument,
} from "@/features/learning/cms/GuidedLessonCms";
import { usePublishedLearningDocument } from "@/features/learning/cms/learning-content-service";

export function useStableGuidedLessonCms({
  pageKey,
  title,
  subtitle,
  sections,
}: {
  pageKey: string;
  title: string;
  subtitle: string;
  sections: GuidedLessonSection[];
}) {
  const cms = useGuidedLessonCms({ pageKey, title, subtitle, sections });
  const fallbackDocument = useMemo(
    () => serializeGuidedLessonForEditor(title, subtitle, sections),
    [sections, subtitle, title],
  );
  const {
    document: publishedEditorDocument,
    reload: reloadEditorDocument,
  } = usePublishedLearningDocument<GuidedLessonCmsDocument>(pageKey);

  const editorDocument = publishedEditorDocument ?? fallbackDocument;

  const reloadPublished = useCallback(async () => {
    await Promise.all([cms.reloadPublished(), reloadEditorDocument()]);
  }, [cms.reloadPublished, reloadEditorDocument]);

  return {
    ...cms,
    document: editorDocument,
    reloadPublished,
  };
}

function serializeGuidedLessonForEditor(
  title: string,
  subtitle: string,
  sections: GuidedLessonSection[],
): GuidedLessonCmsDocument {
  return {
    version: 1,
    title,
    subtitle,
    sections: sections.map((section) => ({
      title: section.title,
      eyebrow: section.eyebrow,
      headline: section.headline,
      lead: section.lead,
      connection: section.connection ?? null,
      flow: section.flow ? [...section.flow] : null,
      concepts: section.concepts
        ? section.concepts.map((item) => ({ ...item }))
        : null,
      terms: section.terms
        ? section.terms.map((item) => ({ ...item }))
        : null,
      scenario: section.scenario
        ? {
            ...section.scenario,
            items: section.scenario.items ? [...section.scenario.items] : [],
          }
        : null,
      insightMode:
        typeof section.insight === "string"
          ? "text"
          : section.insight
            ? "code"
            : "none",
      insightText:
        typeof section.insight === "string" ? section.insight : null,
      question: {
        ...section.question,
        options: [...section.question.options],
      },
      bridge: { ...section.bridge },
      media: section.media ? section.media.map((item) => ({ ...item })) : [],
    })),
  };
}
