import { useMemo, useState, type ReactNode } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpenCheck,
  CheckCircle2,
  ChevronDown,
  Lightbulb,
  LockKeyhole,
  Sparkles,
} from "lucide-react";

import { SpecialistLessonShell } from "@/features/learning/components/SpecialistLessonShell";
import {
  GuidedLessonCmsAdmin,
  LearningMediaBlocks,
} from "@/features/learning/cms/GuidedLessonCms";
import type { LearningMedia } from "@/features/learning/cms/learning-content-service";
import { useStableGuidedLessonCms } from "@/features/learning/cms/useStableGuidedLessonCms";
import { normalizeLearningText } from "@/features/learning/learning-terminology";
import { usePersistentLessonProgress } from "@/features/learning/usePersistentLessonProgress";

export type LearningTerm = {
  term: string;
  persianLabel?: string;
  explanation: string;
  example?: string;
};

export type GuidedConcept = {
  title: string;
  text: string;
  emphasized?: boolean;
};

export type GuidedQuestion = {
  question: string;
  options: string[];
  correctIndex: number;
  correctFeedback: string;
  incorrectFeedback: string;
};

export type GuidedScenario = {
  title: string;
  description: string;
  items?: string[];
};

export type ConceptBridge = {
  openQuestion: string;
  nextStep: string;
};

export type GuidedLessonSection = {
  title: string;
  eyebrow: string;
  headline: string;
  lead: string;
  connection?: string;
  flow?: string[];
  concepts?: GuidedConcept[];
  terms?: LearningTerm[];
  scenario?: GuidedScenario;
  insight?: ReactNode;
  media?: LearningMedia[];
  question: GuidedQuestion;
  bridge: ConceptBridge;
};

export function GuidedConceptLesson({
  lessonIndex,
  title,
  subtitle,
  sectionId,
  sections,
}: {
  lessonIndex: number;
  title: string;
  subtitle: string;
  sectionId: string;
  sections: GuidedLessonSection[];
}) {
  const baseSections = useMemo(
    () => sections.map(normalizeSection),
    [sections],
  );

  const cms = useStableGuidedLessonCms({
    pageKey: `guided:${sectionId}`,
    title: normalizeLearningText(title),
    subtitle: normalizeLearningText(subtitle),
    sections: baseSections,
  });

  const normalizedSections = useMemo(
    () => cms.sections.map(normalizeSection),
    [cms.sections],
  );

  const {
    currentIndex: sectionIndex,
    setCurrentIndex: setSectionIndex,
    answers,
    setAnswers,
    maxUnlocked,
    setMaxUnlocked,
    syncMode,
    syncing,
  } = usePersistentLessonProgress({
    storageId: `guided:${sectionId}`,
    itemCount: normalizedSections.length,
  });

  const section = normalizedSections[sectionIndex];
  const selected = answers[sectionIndex];
  const isCorrect = selected === section.question.correctIndex;
  const progress = Math.round(
    ((sectionIndex + 1) / normalizedSections.length) * 100,
  );

  const completedCount = normalizedSections.reduce(
    (count, current, index) =>
      answers[index] === current.question.correctIndex ? count + 1 : count,
    0,
  );

  function goToSection(nextIndex: number) {
    if (
      nextIndex < 0 ||
      nextIndex >= normalizedSections.length ||
      nextIndex > maxUnlocked
    ) {
      return;
    }

    setSectionIndex(nextIndex);
    window.setTimeout(() => {
      document.getElementById(sectionId)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 20);
  }

  function answerQuestion(optionIndex: number) {
    setAnswers((current) => ({ ...current, [sectionIndex]: optionIndex }));

    if (optionIndex === section.question.correctIndex) {
      setMaxUnlocked((current) =>
        Math.max(
          current,
          Math.min(sectionIndex + 1, normalizedSections.length - 1),
        ),
      );
    }
  }

  return (
    <SpecialistLessonShell
      domainId="transcriptomics"
      trackId="bulk-rna-seq"
      lessonIndex={lessonIndex}
      title={normalizeLearningText(cms.title)}
      subtitle={normalizeLearningText(cms.subtitle)}
      currentScene={sectionIndex}
      sceneCount={normalizedSections.length}
      sceneLabel={section.title}
    >
      <section id={sectionId} className="scroll-mt-6" dir="rtl">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          {cms.isAdmin && (
            <GuidedLessonCmsAdmin
              pageKey={cms.pageKey}
              document={cms.document}
              currentSectionIndex={sectionIndex}
              onPreview={cms.setPreviewDocument}
              onPublished={cms.reloadPublished}
            />
          )}

          <LessonProgress
            completedCount={completedCount}
            total={normalizedSections.length}
            progress={progress}
            syncMode={syncMode}
            syncing={syncing}
          />

          <SectionNavigator
            sections={normalizedSections}
            currentIndex={sectionIndex}
            maxUnlocked={maxUnlocked}
            answers={answers}
            onSelect={goToSection}
          />

          <article className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-lg shadow-slate-200/60">
            <header className="border-b border-slate-200 bg-gradient-to-l from-teal-50 via-white to-white p-6 sm:p-8">
              <p className="text-xs font-bold text-teal-700">{section.eyebrow}</p>
              <h2 className="mt-2 text-2xl font-black leading-10 text-slate-950 sm:text-3xl">
                {section.headline}
              </h2>
              <p className="mt-3 max-w-4xl text-sm leading-8 text-slate-600">
                {section.lead}
              </p>

              {section.connection && (
                <div className="mt-5 flex items-start gap-3 rounded-2xl border border-sky-200 bg-sky-50 p-4">
                  <BookOpenCheck className="mt-1 size-5 shrink-0 text-sky-700" />
                  <div>
                    <p className="text-xs font-black text-sky-800">اتصال به بخش قبل</p>
                    <p className="mt-1 text-sm leading-7 text-sky-950">
                      {section.connection}
                    </p>
                  </div>
                </div>
              )}
            </header>

            <div className="p-6 sm:p-8">
              {section.flow && <Flow items={section.flow} />}

              {section.concepts && section.concepts.length > 0 && (
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {section.concepts.map((concept) => (
                    <ConceptCard key={concept.title} {...concept} />
                  ))}
                </div>
              )}

              {section.terms && section.terms.length > 0 && (
                <TermExplorer terms={section.terms} />
              )}

              {section.scenario && <ScenarioCard scenario={section.scenario} />}

              {section.insight && (
                <div className="mt-6 flex items-start gap-3 rounded-2xl border border-teal-200 bg-teal-50 p-5">
                  <Lightbulb className="mt-1 size-5 shrink-0 text-teal-700" />
                  <div className="text-sm leading-8 text-teal-950">
                    {section.insight}
                  </div>
                </div>
              )}

              <LearningMediaBlocks items={section.media} />

              <DecisionQuestion
                question={section.question}
                selected={selected}
                onSelect={answerQuestion}
              />

              <BridgeCard bridge={section.bridge} unlocked={isCorrect} />
            </div>
          </article>

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              disabled={sectionIndex === 0}
              onClick={() => goToSection(sectionIndex - 1)}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowRight className="size-4" />
              بخش قبل
            </button>

            {sectionIndex < normalizedSections.length - 1 && (
              <button
                type="button"
                disabled={!isCorrect}
                onClick={() => goToSection(sectionIndex + 1)}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {isCorrect
                  ? "ادامه مسیر مفهومی"
                  : "برای ادامه، پاسخ درست را پیدا کنید"}
                <ArrowLeft className="size-4" />
              </button>
            )}
          </div>
        </div>
      </section>
    </SpecialistLessonShell>
  );
}

function LessonProgress({
  completedCount,
  total,
  progress,
  syncMode,
  syncing,
}: {
  completedCount: number;
  total: number;
  progress: number;
  syncMode: "account" | "device";
  syncing: boolean;
}) {
  return (
    <div className="mb-5 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold text-teal-700">مسیر مفهومی این درس</p>
          <p className="mt-1 text-sm font-semibold text-slate-700">
            {completedCount.toLocaleString("fa-IR")} از {total.toLocaleString("fa-IR")} ایستگاه مفهومی تکمیل شده
          </p>
        </div>
        <div className="text-left">
          <span className="text-xs font-black text-slate-500">
            {progress.toLocaleString("fa-IR")}٪
          </span>
          <p className="mt-1 text-[11px] font-bold text-emerald-700">
            {syncMode === "account"
              ? syncing
                ? "در حال همگام‌سازی پیشرفت…"
                : "پیشرفت با حساب کاربری همگام است"
              : "پیشرفت روی همین دستگاه ذخیره می‌شود"}
          </p>
        </div>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-teal-600 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

function SectionNavigator({
  sections,
  currentIndex,
  maxUnlocked,
  answers,
  onSelect,
}: {
  sections: GuidedLessonSection[];
  currentIndex: number;
  maxUnlocked: number;
  answers: Record<number, number>;
  onSelect: (index: number) => void;
}) {
  return (
    <div className="mb-6 flex flex-wrap gap-2">
      {sections.map((item, index) => {
        const locked = index > maxUnlocked;
        const complete = answers[index] === item.question.correctIndex;

        return (
          <button
            key={`${item.title}-${index}`}
            type="button"
            disabled={locked}
            onClick={() => onSelect(index)}
            className={[
              "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition",
              index === currentIndex
                ? "border-teal-600 bg-teal-600 text-white"
                : complete
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                  : locked
                    ? "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400"
                    : "border-slate-200 bg-white text-slate-600 hover:border-teal-300",
            ].join(" ")}
          >
            {locked ? (
              <LockKeyhole className="size-3.5" />
            ) : complete ? (
              <CheckCircle2 className="size-3.5" />
            ) : null}
            {new Intl.NumberFormat("fa-IR").format(index + 1)}. {item.title}
          </button>
        );
      })}
    </div>
  );
}

function Flow({ items }: { items: string[] }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-950 p-5 text-white sm:p-6">
      <p className="mb-4 text-xs font-bold text-teal-300">نقشه تبدیل</p>
      <div className="flex flex-wrap items-center gap-2 text-sm font-black">
        {items.map((item, index) => (
          <div key={`${item}-${index}`} className="flex items-center gap-2">
            <span className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
              {item}
            </span>
            {index < items.length - 1 && <span className="text-teal-300">←</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

function ConceptCard({ title, text, emphasized = false }: GuidedConcept) {
  return (
    <div
      className={[
        "rounded-3xl border p-5",
        emphasized
          ? "border-teal-300 bg-teal-50"
          : "border-slate-200 bg-slate-50",
      ].join(" ")}
    >
      <p className="font-black text-slate-950">{title}</p>
      <p className="mt-3 text-sm leading-8 text-slate-600">{text}</p>
    </div>
  );
}

function TermExplorer({ terms }: { terms: LearningTerm[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="mt-6 rounded-3xl border border-violet-200 bg-violet-50/60 p-5 sm:p-6">
      <div className="flex items-center gap-3">
        <Sparkles className="size-5 text-violet-700" />
        <div>
          <p className="text-xs font-black text-violet-700">
            اصطلاح علمی؛ اول معنی، بعد نام
          </p>
          <p className="mt-1 text-sm leading-7 text-violet-950">
            اصطلاح‌های دارای معادل روشن با نوشتار فارسی نمایش داده می‌شوند؛ نام‌های علمی و اختصارهای بدون معادل جاافتاده همان شکل علمی خود را حفظ می‌کنند.
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {terms.map((term, index) => {
          const open = openIndex === index;
          return (
            <button
              key={`${term.term}-${index}`}
              type="button"
              onClick={() => setOpenIndex(open ? null : index)}
              className="rounded-2xl border border-violet-200 bg-white p-4 text-right transition hover:border-violet-300"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="font-black text-slate-950">
                  {term.persianLabel ?? term.term}
                </p>
                <ChevronDown
                  className={`size-4 text-violet-600 transition ${open ? "rotate-180" : ""}`}
                />
              </div>
              {open && (
                <div className="mt-4 border-t border-violet-100 pt-4">
                  <p className="text-sm leading-8 text-slate-700">
                    {term.explanation}
                  </p>
                  {term.example && (
                    <p className="mt-2 rounded-xl bg-violet-50 px-3 py-2 text-xs leading-6 text-violet-950">
                      مثال: {term.example}
                    </p>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}

function ScenarioCard({ scenario }: { scenario: GuidedScenario }) {
  return (
    <section className="mt-6 rounded-3xl border border-amber-200 bg-amber-50 p-5 sm:p-6">
      <p className="text-xs font-black text-amber-800">سناریوی پژوهشی</p>
      <h3 className="mt-2 text-lg font-black text-amber-950">
        {scenario.title}
      </h3>
      <p className="mt-2 text-sm leading-8 text-amber-950/80">
        {scenario.description}
      </p>
      {scenario.items && (
        <div className="mt-4 grid gap-2">
          {scenario.items.map((item) => (
            <div
              key={item}
              className="rounded-xl border border-amber-200 bg-white/70 px-4 py-3 text-sm leading-7 text-slate-700"
            >
              {item}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function DecisionQuestion({
  question,
  selected,
  onSelect,
}: {
  question: GuidedQuestion;
  selected: number | undefined;
  onSelect: (index: number) => void;
}) {
  const answered = selected !== undefined;
  const correct = selected === question.correctIndex;

  return (
    <section className="mt-7 rounded-3xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-sm font-black text-white">
          ؟
        </span>
        <div>
          <p className="text-xs font-black text-slate-500">ایستگاه تصمیم</p>
          <p className="mt-1 font-bold leading-8 text-slate-950">
            {question.question}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3">
        {question.options.map((option, index) => {
          const active = selected === index;
          const style = active
            ? index === question.correctIndex
              ? "border-emerald-500 bg-emerald-50"
              : "border-amber-400 bg-amber-50"
            : "border-slate-200 bg-white hover:border-teal-300";

          return (
            <button
              key={`${option}-${index}`}
              type="button"
              onClick={() => onSelect(index)}
              className={`rounded-2xl border p-4 text-right text-sm font-medium leading-7 text-slate-700 transition ${style}`}
            >
              {option}
            </button>
          );
        })}
      </div>

      {answered && (
        <div
          className={[
            "mt-4 rounded-2xl border p-4",
            correct
              ? "border-emerald-200 bg-emerald-50"
              : "border-amber-200 bg-amber-50",
          ].join(" ")}
        >
          <p
            className={
              correct
                ? "text-sm font-black text-emerald-900"
                : "text-sm font-black text-amber-950"
            }
          >
            {correct ? "این حلقه کامل شد ✓" : "هنوز یک حلقه جا افتاده است"}
          </p>
          <p className="mt-2 text-sm leading-7 text-slate-700">
            {correct
              ? question.correctFeedback
              : question.incorrectFeedback}
          </p>
        </div>
      )}
    </section>
  );
}

function BridgeCard({
  bridge,
  unlocked,
}: {
  bridge: ConceptBridge;
  unlocked: boolean;
}) {
  return (
    <section
      className={[
        "mt-6 rounded-3xl border p-5 sm:p-6",
        unlocked
          ? "border-sky-200 bg-sky-50"
          : "border-slate-200 bg-slate-50",
      ].join(" ")}
    >
      <p
        className={
          unlocked
            ? "text-xs font-black text-sky-700"
            : "text-xs font-black text-slate-400"
        }
      >
        چرا باید بخش بعد را بخوانم؟
      </p>
      <p
        className={
          unlocked
            ? "mt-2 text-base font-black leading-8 text-sky-950"
            : "mt-2 text-base font-black leading-8 text-slate-400"
        }
      >
        {bridge.openQuestion}
      </p>
      <p
        className={
          unlocked
            ? "mt-2 text-sm leading-7 text-sky-900"
            : "mt-2 text-sm leading-7 text-slate-400"
        }
      >
        {unlocked
          ? bridge.nextStep
          : "پاسخ درست ایستگاه تصمیم را پیدا کنید تا نیاز مفهومی بخش بعد باز شود."}
      </p>
    </section>
  );
}

function normalizeSection(section: GuidedLessonSection): GuidedLessonSection {
  return {
    ...section,
    title: normalizeLearningText(section.title),
    eyebrow: normalizeLearningText(section.eyebrow),
    headline: normalizeLearningText(section.headline),
    lead: normalizeLearningText(section.lead),
    connection: section.connection
      ? normalizeLearningText(section.connection)
      : undefined,
    flow: section.flow?.map(normalizeLearningText),
    concepts: section.concepts?.map((concept) => ({
      ...concept,
      title: normalizeLearningText(concept.title),
      text: normalizeLearningText(concept.text),
    })),
    terms: section.terms?.map((term) => ({
      ...term,
      term: normalizeLearningText(term.term),
      persianLabel: term.persianLabel
        ? normalizeLearningText(term.persianLabel)
        : undefined,
      explanation: normalizeLearningText(term.explanation),
      example: term.example ? normalizeLearningText(term.example) : undefined,
    })),
    scenario: section.scenario
      ? {
          title: normalizeLearningText(section.scenario.title),
          description: normalizeLearningText(section.scenario.description),
          items: section.scenario.items?.map(normalizeLearningText),
        }
      : undefined,
    insight:
      typeof section.insight === "string"
        ? normalizeLearningText(section.insight)
        : section.insight,
    media: section.media?.map((media) => ({
      ...media,
      alt: media.alt ? normalizeLearningText(media.alt) : media.alt,
      caption: media.caption
        ? normalizeLearningText(media.caption)
        : media.caption,
    })),
    question: {
      ...section.question,
      question: normalizeLearningText(section.question.question),
      options: section.question.options.map(normalizeLearningText),
      correctFeedback: normalizeLearningText(
        section.question.correctFeedback,
      ),
      incorrectFeedback: normalizeLearningText(
        section.question.incorrectFeedback,
      ),
    },
    bridge: {
      openQuestion: normalizeLearningText(section.bridge.openQuestion),
      nextStep: normalizeLearningText(section.bridge.nextStep),
    },
  };
}
