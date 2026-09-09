import {
  BarChart3,
  Download,
  ExternalLink,
  FolderKanban,
  Search,
  Target,
  Users,
} from "lucide-react";
import { useState } from "react";

import { GdcCohortBuilderFiltersStage } from "./GdcCohortBuilderFiltersStage";
import { useGdcCohortBuilderFiltersConfig } from "./GdcCohortBuilderFiltersContext";
import { GdcCohortBuilderIntroStage } from "./GdcCohortBuilderIntroStage";
import { GdcCohortFieldGuideStage } from "./GdcCohortFieldGuideStage";
import { useGdcCohortFieldGuideConfig } from "./GdcCohortFieldGuideContext";
import type { GdcCohortBuilderIntroConfig } from "./gdc-cohort-builder-intro-config";
import type { GdcQuestionGuideConfig, GdcQuestionId } from "./gdc-question-guide-config";

const questionIcons = {
  discover: FolderKanban,
  cohort: Users,
  files: Download,
  analysis: BarChart3,
  search: Search,
} as const;

export function GdcQuestionTwoGuide({
  pageTitle,
  pageDescription,
  guideConfig,
  cohortBuilderIntroConfig,
  onSelectQuestion,
}: {
  pageTitle?: string | null;
  pageDescription?: string | null;
  guideConfig: GdcQuestionGuideConfig;
  cohortBuilderIntroConfig: GdcCohortBuilderIntroConfig;
  onSelectQuestion: (questionId: GdcQuestionId) => void;
}) {
  const [stage, setStage] = useState(0);
  const cohortBuilderFiltersConfig = useGdcCohortBuilderFiltersConfig();
  const cohortFieldGuideConfig = useGdcCohortFieldGuideConfig();
  const stageTitles = [
    "ورود به Cohort Builder",
    cohortBuilderFiltersConfig.title,
    cohortFieldGuideConfig.title,
  ];

  return (
    <main dir="rtl" className="min-h-screen bg-slate-50 text-slate-900">
      <section className="border-b bg-white">
        <div className="mx-auto max-w-[1500px] px-5 py-7 sm:px-8 lg:px-10">
          <a href="/resources" className="text-sm font-bold text-slate-500">بازگشت به منابع داده</a>
          <div className="mt-5 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div className="max-w-4xl">
              <span className="rounded-full bg-teal-100 px-3 py-1 text-xs font-black text-teal-800">آموزش سؤال‌محور GDC</span>
              <h1 className="mt-3 text-3xl font-black sm:text-4xl">{pageTitle || "آموزش پرتال GDC"}</h1>
              <p className="mt-3 text-sm leading-8 text-slate-600 sm:text-base">{pageDescription}</p>
            </div>
            <a href="https://portal.gdc.cancer.gov/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-black text-white">
              GDC واقعی <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1500px] px-5 py-7 sm:px-8 lg:px-10">
        <div className="rounded-3xl border bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-black text-teal-700">
            <Target className="h-4 w-4" /> برای چه کاری وارد GDC شده‌اید؟
          </div>
          <div className="mt-4 grid gap-3 lg:grid-cols-5">
            {guideConfig.questions.map((question) => {
              const Icon = questionIcons[question.id];
              return (
                <button
                  key={question.id}
                  onClick={() => onSelectQuestion(question.id)}
                  className={`rounded-2xl border p-4 text-right ${question.id === "cohort" ? "border-teal-300 bg-teal-50" : "border-slate-200"}`}
                >
                  <Icon className="h-5 w-5 text-teal-700" />
                  <div className="mt-3 text-sm font-black leading-6">{question.title}</div>
                  <div className="mt-2 text-xs leading-5 text-slate-500">{question.subtitle}</div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
          {stageTitles.map((title, index) => (
            <button
              key={`${title}-${index}`}
              type="button"
              onClick={() => setStage(index)}
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-black ${stage === index ? "bg-teal-700 text-white" : "bg-white text-slate-500 ring-1 ring-slate-200"}`}
            >
              {index + 1}. {title}
            </button>
          ))}
        </div>

        {stage === 0 ? (
          <GdcCohortBuilderIntroStage
            config={cohortBuilderIntroConfig}
            stageNumber={1}
            stageTotal={stageTitles.length}
            onContinue={() => setStage(1)}
          />
        ) : stage === 1 ? (
          <GdcCohortBuilderFiltersStage
            config={cohortBuilderFiltersConfig}
            stageNumber={2}
            stageTotal={stageTitles.length}
            onPrevious={() => setStage(0)}
            onContinue={() => setStage(2)}
          />
        ) : (
          <GdcCohortFieldGuideStage
            config={cohortFieldGuideConfig}
            fallbackImageUrl={cohortBuilderFiltersConfig.imageUrl}
            stageNumber={3}
            stageTotal={stageTitles.length}
            onPrevious={() => setStage(1)}
          />
        )}
      </section>
    </main>
  );
}
