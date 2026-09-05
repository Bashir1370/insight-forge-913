import { createFileRoute } from "@tanstack/react-router";
import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CircleHelp,
  Dna,
  RotateCcw,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/learn_/rna-seq_/project")({
  component: RnaSeqProjectMode,
});

type QuestionType =
  | "group-comparison"
  | "paired"
  | "time-series"
  | "exploratory"
  | "unsure";

type DataStage =
  | "planning"
  | "fastq"
  | "count-matrix"
  | "processed-matrix"
  | "public-data"
  | "unsure";

type ReplicateLevel =
  | "none"
  | "one"
  | "two"
  | "three-plus"
  | "unsure";

type MetadataLevel =
  | "clear"
  | "partial"
  | "missing"
  | "unsure";

type AnalysisGoal =
  | "differential-expression"
  | "functional"
  | "network"
  | "biomarker"
  | "explore"
  | "unsure";

type ProjectAnswers = {
  questionType?: QuestionType;
  dataStage?: DataStage;
  replicates?: ReplicateLevel;
  metadata?: MetadataLevel;
  goal?: AnalysisGoal;
};

type RecommendationLevel =
  | "learn"
  | "review"
  | "design";

type RecommendationDestination =
  | "rna-seq-foundations"
  | "differential-expression"
  | "functional-analysis"
  | "network-biology"
  | "biomarker-discovery"
  | "data-exploration";

type ProjectRecommendation = {
  level: RecommendationLevel;
  title: string;
  description: string;
  destination: RecommendationDestination;
  strengths: string[];
  concerns: string[];
  nextSteps: string[];
};

type DestinationInfo = {
  title: string;
  englishTitle: string;
  description: string;
};

type SaveState =
  | "guest"
  | "loading"
  | "saving"
  | "saved"
  | "error";

type ResearchAssessmentRow = {
  id: string;
  user_id: string;
  research_line: string;
  question_type: QuestionType | null;
  data_stage: DataStage | null;
  replicate_level: ReplicateLevel | null;
  metadata_level: MetadataLevel | null;
  analysis_goal: AnalysisGoal | null;
  recommendation_level: RecommendationLevel | null;
  recommendation_destination: RecommendationDestination | null;
  answers: ProjectAnswers | null;
  status: "active" | "completed" | "archived";
  created_at: string;
  updated_at: string;
};

const totalSteps = 5;

function RnaSeqProjectMode() {
  const { session } = useAuth();
  const userId = session?.user?.id ?? null;

  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<ProjectAnswers>({});
  const [showResult, setShowResult] = useState(false);

  const [saveState, setSaveState] =
    useState<SaveState>("guest");

  const [saveError, setSaveError] = useState("");

  const recommendation = useMemo(
    () => buildRecommendation(answers),
    [answers],
  );

  const completedAnswers =
    Object.values(answers).filter(Boolean).length;

  const progress = Math.round(
    (completedAnswers / totalSteps) * 100,
  );

  const currentStepAnswered =
    step === 1
      ? Boolean(answers.questionType)
      : step === 2
        ? Boolean(answers.dataStage)
        : step === 3
          ? Boolean(answers.replicates)
          : step === 4
            ? Boolean(answers.metadata)
            : Boolean(answers.goal);

  useEffect(() => {
    let cancelled = false;

    async function loadAssessment() {
      if (!userId) {
        setSaveState("guest");
        setSaveError("");
        return;
      }

      setSaveState("loading");
      setSaveError("");

      const { data, error } = await (supabase as any)
        .from("research_assessments")
        .select(
          `
            id,
            user_id,
            research_line,
            question_type,
            data_stage,
            replicate_level,
            metadata_level,
            analysis_goal,
            recommendation_level,
            recommendation_destination,
            answers,
            status,
            created_at,
            updated_at
          `,
        )
        .eq("user_id", userId)
        .eq("research_line", "rna-seq")
        .maybeSingle();

      if (cancelled) return;

      if (error) {
        console.error(
          "Failed to load research assessment:",
          error,
        );

        setSaveState("error");
        setSaveError(
          "بازیابی بررسی قبلی پروژه انجام نشد. می‌توانید بررسی را ادامه دهید.",
        );

        return;
      }

      if (!data) {
        setSaveState("saved");
        return;
      }

      const row = data as ResearchAssessmentRow;

      const loadedAnswers: ProjectAnswers = {
        ...(row.answers ?? {}),
      };

      if (
        !loadedAnswers.questionType &&
        row.question_type
      ) {
        loadedAnswers.questionType =
          row.question_type;
      }

      if (
        !loadedAnswers.dataStage &&
        row.data_stage
      ) {
        loadedAnswers.dataStage =
          row.data_stage;
      }

      if (
        !loadedAnswers.replicates &&
        row.replicate_level
      ) {
        loadedAnswers.replicates =
          row.replicate_level;
      }

      if (
        !loadedAnswers.metadata &&
        row.metadata_level
      ) {
        loadedAnswers.metadata =
          row.metadata_level;
      }

      if (
        !loadedAnswers.goal &&
        row.analysis_goal
      ) {
        loadedAnswers.goal =
          row.analysis_goal;
      }

      setAnswers(loadedAnswers);

      const firstIncompleteStep =
        getFirstIncompleteStep(loadedAnswers);

      if (firstIncompleteStep) {
        setStep(firstIncompleteStep);
        setShowResult(false);
      } else if (
        row.status === "completed" &&
        row.recommendation_level &&
        row.recommendation_destination
      ) {
        setStep(totalSteps);
        setShowResult(true);
      } else {
        setStep(totalSteps);
      }

      setSaveState("saved");
    }

    void loadAssessment();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  async function persistAssessment(
    nextAnswers: ProjectAnswers,
    completed = false,
  ) {
    if (!userId) return true;

    setSaveState("saving");
    setSaveError("");

    const nextRecommendation =
      buildRecommendation(nextAnswers);

    const payload = {
      user_id: userId,
      research_line: "rna-seq",

      question_type:
        nextAnswers.questionType ?? null,

      data_stage:
        nextAnswers.dataStage ?? null,

      replicate_level:
        nextAnswers.replicates ?? null,

      metadata_level:
        nextAnswers.metadata ?? null,

      analysis_goal:
        nextAnswers.goal ?? null,

      recommendation_level: completed
        ? nextRecommendation.level
        : null,

      recommendation_destination: completed
        ? nextRecommendation.destination
        : null,

      answers: nextAnswers,

      status: completed
        ? "completed"
        : "active",

      updated_at: new Date().toISOString(),
    };

    const { error } = await (supabase as any)
      .from("research_assessments")
      .upsert(payload, {
        onConflict: "user_id,research_line",
      });

    if (error) {
      console.error(
        "Failed to save research assessment:",
        error,
      );

      setSaveState("error");
      setSaveError(
        "ذخیره بررسی پروژه انجام نشد. پاسخ‌های شما فعلاً در همین صفحه باقی می‌مانند.",
      );

      return false;
    }

    setSaveState("saved");
    return true;
  }

  function updateAnswers(
    patch: Partial<ProjectAnswers>,
  ) {
    const nextAnswers = {
      ...answers,
      ...patch,
    };

    setAnswers(nextAnswers);

    if (userId) {
      void persistAssessment(nextAnswers);
    }
  }

  async function goNext() {
    if (!currentStepAnswered) return;

    if (step < totalSteps) {
      setStep((previous) => previous + 1);
      scrollToAssessment();
      return;
    }

    if (userId) {
      await persistAssessment(
        answers,
        true,
      );
    }

    setShowResult(true);

    window.setTimeout(() => {
      document
        .getElementById("project-result")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 20);
  }

  function goPrevious() {
    if (step <= 1) return;

    setStep((previous) => previous - 1);
    setShowResult(false);
    scrollToAssessment();
  }

  async function restart() {
    if (userId) {
      setSaveState("saving");
      setSaveError("");

      const { error } = await (supabase as any)
        .from("research_assessments")
        .delete()
        .eq("user_id", userId)
        .eq("research_line", "rna-seq");

      if (error) {
        console.error(
          "Failed to reset research assessment:",
          error,
        );

        setSaveState("error");
        setSaveError(
          "پاک‌کردن بررسی قبلی انجام نشد. دوباره تلاش کنید.",
        );

        return;
      }

      setSaveState("saved");
    }

    setAnswers({});
    setStep(1);
    setShowResult(false);
    scrollToAssessment();
  }

  function scrollToAssessment() {
    window.setTimeout(() => {
      document
        .getElementById("project-assessment")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 20);
  }

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-slate-50 text-right text-slate-900"
    >
      {/* HEADER */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <a
              href="/learn"
              className="font-semibold text-teal-700 hover:text-teal-900"
            >
              آموزش هاب‌ژن
            </a>

            <span className="text-slate-300">
              /
            </span>

            <a
              href="/learn/rna-seq"
              className="text-slate-500 hover:text-slate-800"
            >
              RNA-seq
            </a>

            <span className="text-slate-300">
              /
            </span>

            <span className="font-semibold text-slate-800">
              حالت پروژه
            </span>
          </div>

          <a
            href="/learn/rna-seq"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-teal-300 hover:text-teal-800"
          >
            بازگشت به بخش RNA-seq
          </a>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-white">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-teal-100/70 blur-3xl" />
          <div className="absolute -left-20 top-10 h-80 w-80 rounded-full bg-cyan-100/60 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-teal-50 px-3 py-1.5 text-sm font-semibold text-teal-700">
                  حالت پروژه
                </span>

                <span
                  dir="ltr"
                  className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-500"
                >
                  RNA-seq
                </span>
              </div>

              <h1 className="mt-6 max-w-4xl text-4xl font-bold leading-[1.4] text-slate-950 sm:text-5xl">
                حالا ببینیم RNA-seq
                <span className="text-teal-700">
                  {" "}
                  برای پروژه شما{" "}
                </span>
                چه معنایی دارد.
              </h1>

              <p className="mt-6 max-w-3xl text-lg leading-9 text-slate-600">
                چند سؤال درباره سؤال پژوهشی، داده، تکرارهای زیستی،
                فراداده و هدف تحلیل پاسخ دهید. هاب‌ژن بر اساس همین
                اطلاعات، وضعیت فعلی پروژه و قدم بعدی منطقی را توضیح
                می‌دهد.
              </p>

              <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="mt-1 size-5 shrink-0 text-amber-700" />

                  <div>
                    <p className="font-bold text-amber-950">
                      یک اصل مهم
                    </p>

                    <p className="mt-2 text-sm leading-7 text-amber-900/80">
                      اینکه یک تحلیل از نظر فنی قابل اجرا باشد، به این
                      معنی نیست که برای سؤال پژوهشی و طراحی مطالعه شما
                      انتخاب مناسبی است.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <ProjectMap />
          </div>
        </div>
      </section>

      {/* ASSESSMENT */}
      <section
        id="project-assessment"
        className="scroll-mt-6"
      >
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:px-8 xl:grid-cols-[0.72fr_1.28fr]">
          {/* SIDE */}
          <aside className="xl:sticky xl:top-6 xl:self-start">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-teal-700">
                وضعیت بررسی
              </p>

              <div className="mt-4 flex items-end justify-between gap-4">
                <p className="text-3xl font-black text-slate-950">
                  {progress}٪
                </p>

                <p className="text-sm text-slate-500">
                  {completedAnswers} از {totalSteps} بخش
                </p>
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-teal-600 transition-all duration-500"
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>

              <AssessmentSaveStatus
                userId={userId}
                state={saveState}
                error={saveError}
              />

              <div className="mt-7 space-y-3">
                <SideStep
                  number="۱"
                  title="سؤال پژوهشی"
                  englishTitle="Research Question"
                  active={step === 1}
                  done={Boolean(
                    answers.questionType,
                  )}
                />

                <SideStep
                  number="۲"
                  title="وضعیت داده"
                  englishTitle="Data Stage"
                  active={step === 2}
                  done={Boolean(
                    answers.dataStage,
                  )}
                />

                <SideStep
                  number="۳"
                  title="تکرارهای زیستی"
                  englishTitle="Biological Replicates"
                  active={step === 3}
                  done={Boolean(
                    answers.replicates,
                  )}
                />

                <SideStep
                  number="۴"
                  title="فراداده"
                  englishTitle="Metadata"
                  active={step === 4}
                  done={Boolean(
                    answers.metadata,
                  )}
                />

                <SideStep
                  number="۵"
                  title="هدف تحلیل"
                  englishTitle="Analysis Goal"
                  active={step === 5}
                  done={Boolean(answers.goal)}
                />
              </div>

              <div className="mt-7 rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-bold text-slate-700">
                  این ابزار چه کاری نمی‌کند؟
                </p>

                <p className="mt-2 text-xs leading-6 text-slate-500">
                  این بخش جای مشاوره تخصصی، بررسی کامل طراحی مطالعه یا
                  تحلیل واقعی داده را نمی‌گیرد. هدف آن مشخص‌کردن مسیر
                  اولیه و تصمیم بعدی پروژه است.
                </p>
              </div>
            </div>
          </aside>

          {/* FORM */}
          <div>
            {!showResult ? (
              <article className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-lg shadow-slate-200/50">
                <div className="border-b border-slate-200 bg-gradient-to-l from-teal-50 via-white to-white p-6 sm:p-8">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <span className="rounded-xl bg-slate-950 px-3 py-1.5 text-xs font-bold text-white">
                        مرحله{" "}
                        {toPersianNumber(step)}
                      </span>

                      <h2 className="mt-5 text-2xl font-bold text-slate-950 sm:text-3xl">
                        {stepTitle(step)}
                      </h2>

                      <p
                        dir="ltr"
                        className="mt-1 text-left text-sm font-semibold text-teal-700"
                      >
                        {stepEnglishTitle(step)}
                      </p>
                    </div>

                    <span className="rounded-xl bg-white px-3 py-2 text-sm font-semibold text-slate-500 shadow-sm">
                      {step} / {totalSteps}
                    </span>
                  </div>

                  <p className="mt-5 leading-8 text-slate-600">
                    {stepDescription(step)}
                  </p>
                </div>

                <div className="p-6 sm:p-8">
                  {step === 1 && (
                    <QuestionTypeStep
                      value={
                        answers.questionType
                      }
                      onChange={(value) =>
                        updateAnswers({
                          questionType: value,
                        })
                      }
                    />
                  )}

                  {step === 2 && (
                    <DataStageStep
                      value={answers.dataStage}
                      onChange={(value) =>
                        updateAnswers({
                          dataStage: value,
                        })
                      }
                    />
                  )}

                  {step === 3 && (
                    <ReplicateStep
                      value={answers.replicates}
                      onChange={(value) =>
                        updateAnswers({
                          replicates: value,
                        })
                      }
                    />
                  )}

                  {step === 4 && (
                    <MetadataStep
                      value={answers.metadata}
                      onChange={(value) =>
                        updateAnswers({
                          metadata: value,
                        })
                      }
                    />
                  )}

                  {step === 5 && (
                    <GoalStep
                      value={answers.goal}
                      onChange={(value) =>
                        updateAnswers({
                          goal: value,
                        })
                      }
                    />
                  )}

                  {userId &&
                    saveState ===
                      "saving" && (
                      <div className="mt-6 rounded-xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm text-cyan-800">
                        در حال ذخیره پاسخ
                        شما...
                      </div>
                    )}

                  {userId &&
                    saveState === "error" &&
                    saveError && (
                      <div className="mt-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-7 text-rose-800">
                        {saveError}
                      </div>
                    )}

                  <div className="mt-8 border-t border-slate-100 pt-6">
                    {!currentStepAnswered && (
                      <p className="mb-4 rounded-xl bg-slate-50 px-4 py-3 text-sm leading-7 text-slate-500">
                        برای ادامه، گزینه‌ای را
                        انتخاب کنید که به وضعیت
                        فعلی پروژه شما نزدیک‌تر
                        است.
                      </p>
                    )}

                    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <button
                        type="button"
                        onClick={goPrevious}
                        disabled={step === 1}
                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <ArrowRight className="size-4" />
                        مرحله قبل
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          void goNext()
                        }
                        disabled={
                          !currentStepAnswered
                        }
                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 py-2.5 font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                      >
                        {step === totalSteps
                          ? "مشاهده پیشنهاد هاب‌ژن"
                          : "مرحله بعد"}

                        <ArrowLeft className="size-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ) : (
              <ProjectResult
                recommendation={
                  recommendation
                }
                answers={answers}
                onRestart={() =>
                  void restart()
                }
              />
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

function AssessmentSaveStatus({
  userId,
  state,
  error,
}: {
  userId: string | null;
  state: SaveState;
  error: string;
}) {
  if (!userId) {
    return (
      <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4">
        <div className="flex items-start gap-3">
          <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-amber-500" />

          <div>
            <p className="text-xs font-bold text-amber-950">
              حالت مهمان
            </p>

            <p className="mt-1 text-xs leading-6 text-amber-900/70">
              بررسی پروژه بدون ثبت‌نام
              قابل استفاده است، اما برای
              بازیابی در مراجعات بعدی ذخیره
              نمی‌شود.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (state === "loading") {
    return (
      <div className="mt-5 rounded-2xl border border-cyan-200 bg-cyan-50 p-4">
        <div className="flex items-start gap-3">
          <span className="mt-1 h-2.5 w-2.5 shrink-0 animate-pulse rounded-full bg-cyan-500" />

          <div>
            <p className="text-xs font-bold text-cyan-950">
              در حال بازیابی پروژه...
            </p>

            <p className="mt-1 text-xs leading-6 text-cyan-900/70">
              بررسی قبلی شما از حساب
              هاب‌ژن دریافت می‌شود.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (state === "saving") {
    return (
      <div className="mt-5 rounded-2xl border border-cyan-200 bg-cyan-50 p-4">
        <div className="flex items-start gap-3">
          <span className="mt-1 h-2.5 w-2.5 shrink-0 animate-pulse rounded-full bg-cyan-500" />

          <div>
            <p className="text-xs font-bold text-cyan-950">
              در حال ذخیره...
            </p>

            <p className="mt-1 text-xs leading-6 text-cyan-900/70">
              وضعیت بررسی پروژه با حساب
              شما همگام می‌شود.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 p-4">
        <div className="flex items-start gap-3">
          <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-rose-500" />

          <div>
            <p className="text-xs font-bold text-rose-950">
              مشکل در همگام‌سازی
            </p>

            <p className="mt-1 text-xs leading-6 text-rose-900/70">
              {error ||
                "اطلاعات فعلاً با حساب شما همگام نشده است."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
      <div className="flex items-start gap-3">
        <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-500" />

        <div>
          <p className="text-xs font-bold text-emerald-950">
            بررسی پروژه ذخیره می‌شود
          </p>

          <p className="mt-1 text-xs leading-6 text-emerald-900/70">
            پاسخ‌ها و مسیر پیشنهادی شما
            در حساب پژوهشگر نگهداری
            می‌شوند.
          </p>
        </div>
      </div>
    </div>
  );
}

function QuestionTypeStep({
  value,
  onChange,
}: {
  value: QuestionType | undefined;
  onChange: (
    value: QuestionType,
  ) => void;
}) {
  return (
    <OptionGrid>
      <ChoiceCard
        active={
          value === "group-comparison"
        }
        onClick={() =>
          onChange("group-comparison")
        }
        title="مقایسه دو یا چند گروه"
        englishTitle="Group Comparison"
        description="مثلاً کنترل در برابر تیمار یا سالم در برابر بیمار."
      />

      <ChoiceCard
        active={value === "paired"}
        onClick={() =>
          onChange("paired")
        }
        title="نمونه‌های جفت‌شده"
        englishTitle="Paired Design"
        description="مثلاً قبل و بعد از درمان از همان فرد یا نمونه."
      />

      <ChoiceCard
        active={value === "time-series"}
        onClick={() =>
          onChange("time-series")
        }
        title="بررسی تغییرات در زمان"
        englishTitle="Time Series"
        description="چند زمان مختلف یا روند زمانی برایم مهم است."
      />

      <ChoiceCard
        active={
          value === "exploratory"
        }
        onClick={() =>
          onChange("exploratory")
        }
        title="بررسی اکتشافی"
        englishTitle="Exploratory Analysis"
        description="هنوز یک مقایسه مشخص ندارم و می‌خواهم ساختار داده را بفهمم."
      />

      <ChoiceCard
        active={value === "unsure"}
        onClick={() =>
          onChange("unsure")
        }
        title="هنوز دقیق نمی‌دانم"
        englishTitle="Not Sure Yet"
        description="سؤال کلی دارم، اما هنوز به یک مقایسه قابل تحلیل تبدیل نشده است."
      />
    </OptionGrid>
  );
}

function DataStageStep({
  value,
  onChange,
}: {
  value: DataStage | undefined;
  onChange: (value: DataStage) => void;
}) {
  return (
    <OptionGrid>
      <ChoiceCard
        active={value === "planning"}
        onClick={() =>
          onChange("planning")
        }
        title="هنوز داده تولید نکرده‌ام"
        englishTitle="Planning Stage"
        description="در مرحله طراحی پژوهش یا برنامه‌ریزی توالی‌یابی هستم."
      />

      <ChoiceCard
        active={value === "fastq"}
        onClick={() =>
          onChange("fastq")
        }
        title="فایل FASTQ دارم"
        englishTitle="Raw Sequencing Data"
        description="داده خام توالی‌یابی در اختیار من است."
      />

      <ChoiceCard
        active={
          value === "count-matrix"
        }
        onClick={() =>
          onChange("count-matrix")
        }
        title="ماتریس شمارش دارم"
        englishTitle="Count Matrix"
        description="جدول ژن × نمونه با شمارش‌های خام یا مشابه آن دارم."
      />

      <ChoiceCard
        active={
          value ===
          "processed-matrix"
        }
        onClick={() =>
          onChange("processed-matrix")
        }
        title="ماتریس پردازش‌شده دارم"
        englishTitle="Processed Expression Matrix"
        description="مثلاً TPM، FPKM یا داده تبدیل‌شده در اختیار من است."
      />

      <ChoiceCard
        active={
          value === "public-data"
        }
        onClick={() =>
          onChange("public-data")
        }
        title="از داده‌های عمومی استفاده می‌کنم"
        englishTitle="Public Dataset"
        description="داده پروژه را از GEO، SRA یا منبع عمومی دیگری می‌گیرم."
      />

      <ChoiceCard
        active={value === "unsure"}
        onClick={() =>
          onChange("unsure")
        }
        title="نوع داده‌ام را نمی‌شناسم"
        englishTitle="Unknown Data Type"
        description="فایل یا جدول دارم ولی نمی‌دانم دقیقاً در چه مرحله‌ای از مسیر قرار دارد."
      />
    </OptionGrid>
  );
}

function ReplicateStep({
  value,
  onChange,
}: {
  value: ReplicateLevel | undefined;
  onChange: (
    value: ReplicateLevel,
  ) => void;
}) {
  return (
    <OptionGrid>
      <ChoiceCard
        active={
          value === "three-plus"
        }
        onClick={() =>
          onChange("three-plus")
        }
        title="حداقل سه نمونه زیستی مستقل در هر گروه"
        englishTitle="3+ Biological Replicates"
        description="در گروه‌های اصلی چند نمونه زیستی مستقل دارم."
      />

      <ChoiceCard
        active={value === "two"}
        onClick={() =>
          onChange("two")
        }
        title="حدود دو نمونه زیستی در هر گروه"
        englishTitle="2 Biological Replicates"
        description="تعداد نمونه‌های مستقل من محدود است."
      />

      <ChoiceCard
        active={value === "one"}
        onClick={() =>
          onChange("one")
        }
        title="یک نمونه زیستی در هر گروه"
        englishTitle="Single Biological Replicate"
        description="برای هر شرایط اصلی فقط یک نمونه مستقل دارم."
      />

      <ChoiceCard
        active={value === "none"}
        onClick={() =>
          onChange("none")
        }
        title="هنوز نمونه‌گیری انجام نشده"
        englishTitle="Not Collected Yet"
        description="پروژه هنوز در مرحله طراحی است."
      />

      <ChoiceCard
        active={value === "unsure"}
        onClick={() =>
          onChange("unsure")
        }
        title="نمی‌دانم تکرار زیستی چیست"
        englishTitle="Biological Replicate"
        description="مطمئن نیستم فایل‌ها یا نمونه‌هایم تکرار زیستی محسوب می‌شوند یا نه."
      />
    </OptionGrid>
  );
}

function MetadataStep({
  value,
  onChange,
}: {
  value: MetadataLevel | undefined;
  onChange: (
    value: MetadataLevel,
  ) => void;
}) {
  return (
    <OptionGrid>
      <ChoiceCard
        active={value === "clear"}
        onClick={() =>
          onChange("clear")
        }
        title="فراداده من مشخص و منظم است"
        englishTitle="Clear Metadata"
        description="می‌دانم هر نمونه متعلق به کدام گروه است و اطلاعات طراحی مطالعه ثبت شده‌اند."
      />

      <ChoiceCard
        active={value === "partial"}
        onClick={() =>
          onChange("partial")
        }
        title="بخشی از اطلاعات را دارم"
        englishTitle="Partial Metadata"
        description="گروه‌ها مشخص‌اند اما برخی اطلاعات مانند دسته آزمایشی یا عوامل دیگر کامل نیستند."
      />

      <ChoiceCard
        active={value === "missing"}
        onClick={() =>
          onChange("missing")
        }
        title="فراداده تقریباً ندارم"
        englishTitle="Missing Metadata"
        description="فایل‌ها یا نمونه‌ها را دارم اما اطلاعات توصیفی آن‌ها بسیار محدود است."
      />

      <ChoiceCard
        active={value === "unsure"}
        onClick={() =>
          onChange("unsure")
        }
        title="مطمئن نیستم چه اطلاعاتی لازم است"
        englishTitle="Metadata Requirements"
        description="نمی‌دانم چه متغیرهایی باید برای تحلیل ثبت شده باشند."
      />
    </OptionGrid>
  );
}

function GoalStep({
  value,
  onChange,
}: {
  value: AnalysisGoal | undefined;
  onChange: (
    value: AnalysisGoal,
  ) => void;
}) {
  return (
    <OptionGrid>
      <ChoiceCard
        active={
          value ===
          "differential-expression"
        }
        onClick={() =>
          onChange(
            "differential-expression",
          )
        }
        title="تحلیل بیان افتراقی"
        englishTitle="Differential Expression"
        description="می‌خواهم ژن‌هایی را پیدا کنم که میان شرایط مورد مطالعه تغییر کرده‌اند."
      />

      <ChoiceCard
        active={
          value === "functional"
        }
        onClick={() =>
          onChange("functional")
        }
        title="تحلیل عملکردی و مسیرهای زیستی"
        englishTitle="Functional Analysis"
        description="می‌خواهم از نتایج ژنی به فرآیندها و مسیرهای زیستی برسم."
      />

      <ChoiceCard
        active={value === "network"}
        onClick={() =>
          onChange("network")
        }
        title="تحلیل شبکه و WGCNA"
        englishTitle="Network Analysis / WGCNA"
        description="می‌خواهم روابط هم‌بیانی، ماژول‌ها یا ژن‌های هاب را بررسی کنم."
      />

      <ChoiceCard
        active={
          value === "biomarker"
        }
        onClick={() =>
          onChange("biomarker")
        }
        title="کشف نشانگر زیستی"
        englishTitle="Biomarker Discovery"
        description="هدف من انتخاب ژن‌ها یا امضاهای کاندیدا برای تشخیص، پیش‌آگهی یا کاربرد مشابه است."
      />

      <ChoiceCard
        active={value === "explore"}
        onClick={() =>
          onChange("explore")
        }
        title="فعلاً فقط می‌خواهم داده را بفهمم"
        englishTitle="Data Exploration"
        description="هنوز برای انتخاب تحلیل نهایی آماده نیستم."
      />

      <ChoiceCard
        active={value === "unsure"}
        onClick={() =>
          onChange("unsure")
        }
        title="نمی‌دانم چه تحلیلی مناسب است"
        englishTitle="Analysis Strategy"
        description="می‌خواهم سؤال و داده من تعیین کنند قدم بعدی چه باشد."
      />
    </OptionGrid>
  );
}

function ProjectResult({
  recommendation,
  answers,
  onRestart,
}: {
  recommendation: ProjectRecommendation;
  answers: ProjectAnswers;
  onRestart: () => void;
}) {
  const theme =
    recommendation.level === "design"
      ? {
          border: "border-emerald-200",
          background: "bg-emerald-50",
          text: "text-emerald-800",
          icon: CheckCircle2,
        }
      : recommendation.level === "review"
        ? {
            border: "border-amber-200",
            background: "bg-amber-50",
            text: "text-amber-900",
            icon: AlertTriangle,
          }
        : {
            border: "border-cyan-200",
            background: "bg-cyan-50",
            text: "text-cyan-900",
            icon: CircleHelp,
          };

  const StatusIcon = theme.icon;

  const destination =
    getDestinationInfo(
      recommendation.destination,
    );

  return (
    <article
      id="project-result"
      className="scroll-mt-6 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-lg"
    >
      <div className="bg-slate-950 p-7 text-white sm:p-9">
        <span className="inline-flex rounded-full bg-teal-400/10 px-3 py-1.5 text-sm font-semibold text-teal-300">
          پیشنهاد اولیه هاب‌ژن
        </span>

        <h2 className="mt-5 text-3xl font-bold">
          وضعیت فعلی پروژه RNA-seq شما
        </h2>

        <p className="mt-4 max-w-3xl leading-8 text-slate-300">
          این نتیجه بر اساس پاسخ‌های شما
          ساخته شده است و جای بررسی تخصصی
          کامل طراحی پژوهش را نمی‌گیرد.
        </p>
      </div>

      <div className="space-y-8 p-6 sm:p-8">
        <section
          className={`rounded-3xl border p-6 ${theme.border} ${theme.background}`}
        >
          <div className="flex items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white">
              <StatusIcon
                className={`size-6 ${theme.text}`}
              />
            </span>

            <div>
              <p
                className={`text-sm font-bold ${theme.text}`}
              >
                وضعیت پیشنهادی
              </p>

              <h3 className="mt-1 text-2xl font-bold text-slate-950">
                {recommendation.title}
              </h3>

              <p className="mt-3 leading-8 text-slate-700">
                {
                  recommendation.description
                }
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-teal-200 bg-gradient-to-br from-teal-50 via-white to-cyan-50 p-6 sm:p-7">
          <p className="text-sm font-bold text-teal-700">
            مسیر پیشنهادی بعدی
          </p>

          <h3 className="mt-2 text-2xl font-bold text-slate-950">
            {destination.title}
          </h3>

          <p
            dir="ltr"
            className="mt-1 text-left text-sm font-semibold text-teal-700"
          >
            {destination.englishTitle}
          </p>

          <p className="mt-4 leading-8 text-slate-600">
            {destination.description}
          </p>
        </section>

        <ProjectSnapshot
          answers={answers}
        />

        {recommendation.strengths.length >
          0 && (
          <ResultSection
            title="نقاط مثبت فعلی پروژه"
            icon="✓"
            iconClass="bg-emerald-100 text-emerald-700"
          >
            {recommendation.strengths.map(
              (item) => (
                <ResultRow key={item}>
                  {item}
                </ResultRow>
              ),
            )}
          </ResultSection>
        )}

        {recommendation.concerns.length >
          0 && (
          <ResultSection
            title="مواردی که قبل از ادامه باید بررسی شوند"
            icon="!"
            iconClass="bg-amber-100 text-amber-800"
          >
            {recommendation.concerns.map(
              (item) => (
                <ResultRow key={item}>
                  {item}
                </ResultRow>
              ),
            )}
          </ResultSection>
        )}

        <ResultSection
          title="قدم‌های بعدی پیشنهادی"
          icon="→"
          iconClass="bg-teal-100 text-teal-800"
        >
          {recommendation.nextSteps.map(
            (item) => (
              <ResultRow key={item}>
                {item}
              </ResultRow>
            ),
          )}
        </ResultSection>

        {answers.goal === "network" && (
          <div className="rounded-3xl border border-violet-200 bg-violet-50 p-6">
            <p className="font-bold text-violet-950">
              چرا هاب‌ژن هنوز برای WGCNA
              چراغ سبز قطعی نمی‌دهد؟
            </p>

            <p className="mt-3 text-sm leading-8 text-violet-900/80">
              تعداد تکرارهای زیستی در هر
              گروه فقط بخشی از اطلاعات
              موردنیاز است. برای تصمیم‌گیری
              درباره WGCNA باید تعداد کل
              نمونه‌های مستقل، ساختار ماتریس
              بیان، کیفیت داده، میزان
              تغییرپذیری ژن‌ها و ویژگی‌های
              مورد بررسی نیز ارزیابی شوند.
            </p>

            <p className="mt-3 text-sm font-semibold leading-8 text-violet-950">
              بنابراین انتخاب WGCNA باید
              وارد «بررسی آمادگی تحلیل
              شبکه» شود، نه اینکه صرفاً به
              دلیل قابل اجرا بودن روش،
              مستقیماً اجرا شود.
            </p>
          </div>
        )}

        {answers.goal ===
          "biomarker" && (
          <div className="rounded-3xl border border-violet-200 bg-violet-50 p-6">
            <p className="font-bold text-violet-950">
              درباره مسیر کشف نشانگر زیستی
            </p>

            <p className="mt-3 text-sm leading-8 text-violet-900/80">
              پیدا کردن یک DEG، ژن هاب یا
              ویژگی آماری مهم به‌تنهایی
              نشانگر زیستی معتبر ایجاد
              نمی‌کند. انتخاب کاندیدا و
              اعتبارسنجی باید از ابتدا بخشی
              از طراحی پژوهش باشند.
            </p>
          </div>
        )}

        <ProjectActions
          recommendation={recommendation}
          onRestart={onRestart}
        />

        <div className="rounded-2xl bg-slate-950 p-5 text-white">
          <p className="text-sm font-bold text-teal-300">
            قابل اجرا بودن ≠ مناسب بودن
          </p>

          <p className="mt-2 text-sm leading-7 text-slate-300">
            هدف هاب‌ژن فقط این نیست که
            بگوید چه تحلیلی از نظر فنی قابل
            اجراست؛ هدف این است که کمک کند
            بفهمید چه تحلیلی برای سؤال
            پژوهشی، داده و طراحی واقعی پروژه
            شما قابل دفاع‌تر است.
          </p>
        </div>
      </div>
    </article>
  );
}

function ProjectActions({
  recommendation,
  onRestart,
}: {
  recommendation: ProjectRecommendation;
  onRestart: () => void;
}) {
  if (
    recommendation.destination ===
    "network-biology"
  ) {
    return (
      <ActionBox
        title="برای هدف شما، قدم بعدی باید شبکه‌محور باشد."
        description="به‌جای برگشت عمومی به RNA-seq، ابتدا آمادگی داده و طراحی برای WGCNA و تحلیل شبکه بررسی شود."
      >
        <a
          href="/consultation"
          className="inline-flex min-h-12 items-center justify-center rounded-xl bg-slate-950 px-5 py-3 font-bold text-white transition hover:bg-slate-800"
        >
          درخواست بازبینی آمادگی WGCNA
        </a>

        <button
          type="button"
          onClick={onRestart}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700"
        >
          <RotateCcw className="size-4" />
          بررسی دوباره پروژه
        </button>
      </ActionBox>
    );
  }

  if (
    recommendation.destination ===
    "biomarker-discovery"
  ) {
    return (
      <ActionBox
        title="مسیر بعدی شما باید بر طراحی کشف و اعتبارسنجی کاندیداها تمرکز کند."
        description="پیش از اجرای مجموعه‌ای از روش‌ها، باید تعریف نشانگر زیستی، نوع خروجی و برنامه اعتبارسنجی مشخص شود."
      >
        <a
          href="/consultation"
          className="inline-flex min-h-12 items-center justify-center rounded-xl bg-slate-950 px-5 py-3 font-bold text-white transition hover:bg-slate-800"
        >
          بازبینی راهبرد کشف نشانگر
          زیستی
        </a>

        <button
          type="button"
          onClick={onRestart}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700"
        >
          <RotateCcw className="size-4" />
          بررسی دوباره پروژه
        </button>
      </ActionBox>
    );
  }

  if (
    recommendation.destination ===
    "functional-analysis"
  ) {
    return (
      <ActionBox
        title="قدم بعدی شما طراحی تحلیل عملکردی متناسب با نوع نتیجه است."
        description="باید مشخص شود تحلیل از یک فهرست ژنی شروع می‌شود یا از رتبه‌بندی گسترده ژن‌ها و چه سؤال زیستی قرار است پاسخ داده شود."
      >
        {recommendation.level ===
        "review" ? (
          <a
            href="/consultation"
            className="inline-flex min-h-12 items-center justify-center rounded-xl bg-slate-950 px-5 py-3 font-bold text-white transition hover:bg-slate-800"
          >
            بازبینی راهبرد تحلیل عملکردی
          </a>
        ) : (
          <a
            href="/learn/rna-seq/navigator"
            className="inline-flex min-h-12 items-center justify-center rounded-xl bg-teal-700 px-5 py-3 font-bold text-white transition hover:bg-teal-800"
          >
            مرور بخش تحلیل عملکردی
          </a>
        )}

        <button
          type="button"
          onClick={onRestart}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700"
        >
          <RotateCcw className="size-4" />
          بررسی دوباره پروژه
        </button>
      </ActionBox>
    );
  }

  if (
    recommendation.destination ===
    "differential-expression"
  ) {
    return (
      <ActionBox
        title="مسیر بعدی شما تحلیل بیان افتراقی است."
        description="طراحی مطالعه، نوع داده و مقایسه آماری باید به یک طرح تحلیل مشخص تبدیل شوند."
      >
        {recommendation.level ===
        "review" ? (
          <a
            href="/consultation"
            className="inline-flex min-h-12 items-center justify-center rounded-xl bg-slate-950 px-5 py-3 font-bold text-white transition hover:bg-slate-800"
          >
            بازبینی طراحی تحلیل بیان
            افتراقی
          </a>
        ) : (
          <a
            href="/learn/rna-seq/navigator"
            className="inline-flex min-h-12 items-center justify-center rounded-xl bg-teal-700 px-5 py-3 font-bold text-white transition hover:bg-teal-800"
          >
            ادامه مسیر تحلیل بیان افتراقی
          </a>
        )}

        <button
          type="button"
          onClick={onRestart}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700"
        >
          <RotateCcw className="size-4" />
          بررسی دوباره پروژه
        </button>
      </ActionBox>
    );
  }

  if (
    recommendation.destination ===
    "data-exploration"
  ) {
    return (
      <ActionBox
        title="فعلاً بهترین قدم، شناخت ساختار داده است."
        description="قبل از انتخاب تحلیل نهایی، کنترل کیفیت، ساختار نمونه‌ها، PCA و اطلاعات فراداده را بررسی کنید."
      >
        <a
          href="/learn/rna-seq/navigator"
          className="inline-flex min-h-12 items-center justify-center rounded-xl bg-teal-700 px-5 py-3 font-bold text-white transition hover:bg-teal-800"
        >
          مرور مسیر بررسی داده RNA-seq
        </a>

        <button
          type="button"
          onClick={onRestart}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700"
        >
          <RotateCcw className="size-4" />
          بررسی دوباره پروژه
        </button>
      </ActionBox>
    );
  }

  return (
    <ActionBox
      title="قبل از انتخاب روش، چند پیش‌نیاز پایه را روشن کنید."
      description="وقتی سؤال پژوهشی، نوع داده و ساختار نمونه‌ها روشن‌تر شوند، انتخاب تحلیل معنی‌دارتر خواهد شد."
    >
      <a
        href="/learn/rna-seq/navigator"
        className="inline-flex min-h-12 items-center justify-center rounded-xl bg-slate-950 px-5 py-3 font-bold text-white transition hover:bg-slate-800"
      >
        مرور پیش‌نیازهای RNA-seq
      </a>

      <button
        type="button"
        onClick={onRestart}
        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700"
      >
        <RotateCcw className="size-4" />
        بررسی دوباره پروژه
      </button>
    </ActionBox>
  );
}

function ActionBox({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
      <p className="text-sm font-semibold text-teal-700">
        ادامه مسیر
      </p>

      <h3 className="mt-2 text-2xl font-bold text-slate-950">
        {title}
      </h3>

      <p className="mt-3 leading-8 text-slate-600">
        {description}
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {children}
      </div>
    </div>
  );
}

function buildRecommendation(
  answers: ProjectAnswers,
): ProjectRecommendation {
  const strengths: string[] = [];
  const concerns: string[] = [];
  const nextSteps: string[] = [];

  let severity = 0;

  function requireReview() {
    severity = Math.max(
      severity,
      1,
    );
  }

  function requireLearning() {
    severity = Math.max(
      severity,
      2,
    );
  }

  if (
    answers.questionType ===
      "group-comparison" ||
    answers.questionType === "paired" ||
    answers.questionType ===
      "time-series"
  ) {
    strengths.push(
      "ساختار کلی سؤال پژوهشی شما به یک طراحی قابل تحلیل نزدیک است.",
    );
  }

  if (
    answers.questionType === "unsure"
  ) {
    concerns.push(
      "سؤال پژوهشی هنوز به یک مقایسه یا هدف تحلیلی مشخص تبدیل نشده است.",
    );

    requireLearning();

    nextSteps.push(
      "ابتدا سؤال زیستی را به گروه‌ها، شرایط یا متغیر قابل بررسی تبدیل کنید.",
    );
  }

  if (
    answers.questionType ===
    "exploratory"
  ) {
    concerns.push(
      "پروژه در حال حاضر بیشتر ماهیت اکتشافی دارد و هنوز سؤال اصلی برای آزمون مشخص نشده است.",
    );

    requireReview();
  }

  if (
    answers.dataStage === "planning"
  ) {
    strengths.push(
      "هنوز فرصت دارید طراحی مطالعه را پیش از تولید داده اصلاح کنید.",
    );

    nextSteps.push(
      "پیش از توالی‌یابی، تعداد نمونه‌ها، گروه‌ها و فراداده موردنیاز را نهایی کنید.",
    );
  }

  if (
    answers.dataStage === "fastq" ||
    answers.dataStage ===
      "count-matrix"
  ) {
    strengths.push(
      "داده شما در یکی از مراحل استاندارد مسیر RNA-seq قرار دارد.",
    );
  }

  if (
    answers.dataStage ===
    "processed-matrix"
  ) {
    concerns.push(
      "قبل از انتخاب تحلیل باید مشخص شود ماتریس پردازش‌شده دقیقاً چه نوع مقادیری دارد و چگونه تولید شده است.",
    );

    requireReview();

    nextSteps.push(
      "نوع ماتریس را مشخص کنید: شمارش خام، TPM، FPKM یا داده تبدیل‌شده.",
    );
  }

  if (
    answers.dataStage === "public-data"
  ) {
    concerns.push(
      "تناسب مجموعه‌داده عمومی با سؤال پژوهشی باید پیش از اجرای تحلیل بررسی شود.",
    );

    requireReview();

    nextSteps.push(
      "طراحی مطالعه و فراداده مجموعه‌داده عمومی را با سؤال پژوهشی خود تطبیق دهید.",
    );
  }

  if (
    answers.dataStage === "unsure"
  ) {
    concerns.push(
      "نوع داده فعلی پروژه مشخص نیست؛ بنابراین انتخاب روش تحلیل هنوز زود است.",
    );

    requireLearning();

    nextSteps.push(
      "ابتدا نوع فایل یا ماتریس و مرحله فعلی داده را مشخص کنید.",
    );
  }

  if (
    answers.replicates ===
    "three-plus"
  ) {
    strengths.push(
      "برای گروه‌های اصلی چند تکرار زیستی مستقل گزارش کرده‌اید.",
    );
  }

  if (
    answers.replicates === "two"
  ) {
    concerns.push(
      "تعداد تکرارهای زیستی محدود است و توان تحلیل آماری باید با احتیاط بررسی شود.",
    );

    requireReview();

    nextSteps.push(
      "محدودیت تعداد نمونه‌های مستقل را در طراحی آماری و تفسیر نتیجه در نظر بگیرید.",
    );
  }

  if (
    answers.replicates === "one"
  ) {
    concerns.push(
      "وجود تنها یک نمونه زیستی در هر گروه محدودیت جدی برای استنباط آماری ایجاد می‌کند.",
    );

    requireReview();

    nextSteps.push(
      "قبل از تحلیل بیان افتراقی یا سایر تحلیل‌های استنباطی، طراحی مطالعه و امکان افزایش نمونه‌های مستقل را بررسی کنید.",
    );
  }

  if (
    answers.replicates === "none"
  ) {
    concerns.push(
      "تعداد تکرارهای زیستی هنوز در طراحی پروژه نهایی نشده است.",
    );

    requireReview();

    nextSteps.push(
      "تعداد تکرارهای زیستی را پیش از شروع نمونه‌گیری و توالی‌یابی تعیین کنید.",
    );
  }

  if (
    answers.replicates === "unsure"
  ) {
    concerns.push(
      "هنوز مشخص نیست کدام نمونه‌ها تکرار زیستی مستقل محسوب می‌شوند.",
    );

    requireLearning();

    nextSteps.push(
      "تفاوت تکرار زیستی و تکرار فنی را پیش از ادامه روشن کنید.",
    );
  }

  if (
    answers.metadata === "clear"
  ) {
    strengths.push(
      "اطلاعات گروه‌بندی و فراداده نمونه‌ها مشخص هستند.",
    );
  }

  if (
    answers.metadata === "partial"
  ) {
    concerns.push(
      "فراداده ناقص است و ممکن است برخی عوامل فنی یا زیستی در مدل تحلیل وارد نشوند.",
    );

    requireReview();

    nextSteps.push(
      "فراداده نمونه‌ها را پیش از ساخت مدل آماری تا حد ممکن کامل کنید.",
    );
  }

  if (
    answers.metadata === "missing"
  ) {
    concerns.push(
      "نبود فراداده می‌تواند تفسیر نمونه‌ها و تعریف مقایسه آماری را دشوار یا غیرممکن کند.",
    );

    requireReview();

    nextSteps.push(
      "اطلاعات گروه، شرایط آزمایش و عوامل مهم هر نمونه را بازیابی کنید.",
    );
  }

  if (
    answers.metadata === "unsure"
  ) {
    concerns.push(
      "هنوز مشخص نیست چه فراداده‌ای برای تحلیل پروژه لازم است.",
    );

    requireLearning();

    nextSteps.push(
      "حداقل گروه، شناسه نمونه، تکرار زیستی و عوامل احتمالی مداخله‌گر را مشخص کنید.",
    );
  }

  const destination =
    destinationFromGoal(
      answers.goal,
    );

  if (
    answers.goal ===
    "differential-expression"
  ) {
    nextSteps.push(
      "مقایسه آماری اصلی را دقیق تعریف کنید؛ مثلاً کنترل در برابر تیمار یا قبل در برابر بعد.",
    );
  }

  if (
    answers.goal === "functional"
  ) {
    nextSteps.push(
      "مشخص کنید تحلیل عملکردی قرار است از فهرست ژنی انتخاب‌شده شروع شود یا از رتبه‌بندی گسترده ژن‌ها.",
    );

    nextSteps.push(
      "سؤال زیستی مرتبط با مسیرها و فرآیندهای مورد انتظار را پیش از تفسیر مشخص کنید.",
    );
  }

  if (
    answers.goal === "network"
  ) {
    concerns.push(
      "پرسش «تعداد تکرار در هر گروه» به‌تنهایی برای تعیین آمادگی WGCNA کافی نیست؛ تعداد کل نمونه‌های مستقل و ساختار داده باید جداگانه بررسی شوند.",
    );

    concerns.push(
      "نوع ماتریس بیان، نحوه آماده‌سازی داده و فیلتر ژن‌ها می‌تواند روی تحلیل شبکه اثر جدی داشته باشد.",
    );

    requireReview();

    nextSteps.push(
      "تعداد کل نمونه‌های مستقل پروژه را مشخص کنید و کفایت آن را برای تحلیل شبکه بررسی کنید.",
    );

    nextSteps.push(
      "نوع ماتریس بیان و مراحل آماده‌سازی آن را پیش از WGCNA مشخص کنید.",
    );

    nextSteps.push(
      "ویژگی یا فنوتیپی را که قرار است با ماژول‌های شبکه مقایسه شود، از قبل تعریف کنید.",
    );
  }

  if (
    answers.goal === "biomarker"
  ) {
    concerns.push(
      "کشف نشانگر زیستی فقط با پیدا کردن DEG یا ژن هاب کامل نمی‌شود و به راهبرد اعتبارسنجی نیاز دارد.",
    );

    requireReview();

    nextSteps.push(
      "تعریف کنید نشانگر زیستی قرار است تشخیصی، پیش‌آگهی، پیش‌بینی‌کننده یا با هدف دیگری باشد.",
    );

    nextSteps.push(
      "از ابتدا مشخص کنید کاندیداها چگونه در داده مستقل یا آزمایش دیگری اعتبارسنجی خواهند شد.",
    );
  }

  if (
    answers.goal === "explore"
  ) {
    nextSteps.push(
      "با کنترل کیفیت، بررسی ساختار نمونه‌ها، PCA، همبستگی و بررسی نمونه‌های پرت شروع کنید.",
    );
  }

  if (
    answers.goal === "unsure"
  ) {
    concerns.push(
      "هدف تحلیل هنوز مشخص نشده است؛ بهتر است ابزار را پیش از روشن‌شدن سؤال انتخاب نکنید.",
    );

    requireLearning();

    nextSteps.push(
      "ابتدا مشخص کنید خروجی مورد انتظار پروژه چیست: تغییر بیان، مسیر زیستی، شبکه، نشانگر زیستی یا هدف دیگری.",
    );
  }

  if (nextSteps.length === 0) {
    nextSteps.push(
      "سؤال پژوهشی، طراحی مطالعه و نوع داده را به یک نقشه تحلیل مشخص تبدیل کنید.",
    );
  }

  const level: RecommendationLevel =
    severity >= 2
      ? "learn"
      : severity === 1
        ? "review"
        : "design";

  if (level === "learn") {
    return {
      level,
      destination,
      title:
        "قبل از انتخاب نهایی روش، چند جزء پایه پروژه را روشن کنید",
      description:
        "در وضعیت فعلی هنوز یک یا چند پیش‌نیاز اساسی برای انتخاب مسیر تحلیل مشخص نیست. روشن‌کردن این موارد از اجرای زودهنگام یک روش جلوگیری می‌کند.",
      strengths,
      concerns,
      nextSteps,
    };
  }

  if (level === "review") {
    return {
      level,
      destination,
      title:
        "مسیر علمی پروژه مشخص است، اما قبل از اجرا به بازبینی نیاز دارد",
      description:
        "هدف تحلیل قابل تشخیص است، اما یک یا چند تصمیم طراحی یا ویژگی داده می‌تواند روی اعتبار نتیجه اثر جدی بگذارد. قدم بعدی باید متناسب با همان هدف علمی انجام شود.",
      strengths,
      concerns,
      nextSteps,
    };
  }

  return {
    level,
    destination,
    title:
      "اطلاعات اولیه برای طراحی مسیر تحلیل مناسب است",
    description:
      "بر اساس پاسخ‌های فعلی، اجزای اصلی پروژه تا حد خوبی مشخص هستند. قدم بعدی تبدیل این اطلاعات به یک طرح تحلیل دقیق و قابل دفاع است.",
    strengths,
    concerns,
    nextSteps,
  };
}

function destinationFromGoal(
  goal?: AnalysisGoal,
): RecommendationDestination {
  if (
    goal ===
    "differential-expression"
  ) {
    return "differential-expression";
  }

  if (goal === "functional") {
    return "functional-analysis";
  }

  if (goal === "network") {
    return "network-biology";
  }

  if (goal === "biomarker") {
    return "biomarker-discovery";
  }

  if (goal === "explore") {
    return "data-exploration";
  }

  return "rna-seq-foundations";
}

function getDestinationInfo(
  destination: RecommendationDestination,
): DestinationInfo {
  const destinations: Record<
    RecommendationDestination,
    DestinationInfo
  > = {
    "rna-seq-foundations": {
      title:
        "روشن‌کردن پیش‌نیازهای RNA-seq",
      englishTitle:
        "RNA-seq Foundations",
      description:
        "قبل از انتخاب روش، سؤال پژوهشی، نوع داده، تکرارهای زیستی و فراداده باید روشن‌تر شوند.",
    },

    "differential-expression": {
      title:
        "طراحی تحلیل بیان افتراقی",
      englishTitle:
        "Differential Expression Analysis",
      description:
        "قدم بعدی تعریف دقیق مقایسه آماری، ساختار مدل و داده مناسب برای تحلیل بیان افتراقی است.",
    },

    "functional-analysis": {
      title:
        "تحلیل عملکردی و مسیرهای زیستی",
      englishTitle:
        "Functional Analysis",
      description:
        "قدم بعدی مشخص‌کردن نوع ورودی، روش مناسب تحلیل عملکردی و سؤال زیستی مربوط به مسیرها و فرآیندهاست.",
    },

    "network-biology": {
      title:
        "بررسی آمادگی برای تحلیل شبکه و WGCNA",
      englishTitle:
        "Network Biology / WGCNA Readiness",
      description:
        "قدم بعدی بررسی تعداد کل نمونه‌های مستقل، ساختار ماتریس بیان، ویژگی‌های مورد بررسی و مناسب بودن داده برای تحلیل هم‌بیانی است.",
    },

    "biomarker-discovery": {
      title:
        "طراحی مسیر کشف و اعتبارسنجی نشانگر زیستی",
      englishTitle:
        "Biomarker Discovery & Validation",
      description:
        "قدم بعدی تعریف دقیق هدف نشانگر زیستی، انتخاب راهبرد کشف کاندیدا و طراحی اعتبارسنجی مستقل است.",
    },

    "data-exploration": {
      title:
        "بررسی ساختار و کیفیت داده",
      englishTitle:
        "RNA-seq Data Exploration",
      description:
        "قدم بعدی شناخت رفتار کلی نمونه‌ها، کنترل کیفیت، PCA، همبستگی و شناسایی عوامل غیرعادی است.",
    },
  };

  return destinations[destination];
}

function ProjectSnapshot({
  answers,
}: {
  answers: ProjectAnswers;
}) {
  return (
    <section>
      <h3 className="font-bold text-slate-950">
        تصویر فعلی پروژه
      </h3>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <SnapshotItem
          label="نوع سؤال"
          value={questionLabel(
            answers.questionType,
          )}
        />

        <SnapshotItem
          label="وضعیت داده"
          value={dataStageLabel(
            answers.dataStage,
          )}
        />

        <SnapshotItem
          label="تکرارهای زیستی"
          value={replicateLabel(
            answers.replicates,
          )}
        />

        <SnapshotItem
          label="فراداده"
          value={metadataLabel(
            answers.metadata,
          )}
        />

        <SnapshotItem
          label="هدف تحلیل"
          value={goalLabel(
            answers.goal,
          )}
        />
      </div>
    </section>
  );
}

function ProjectMap() {
  return (
    <div className="rounded-[2rem] bg-slate-950 p-6 text-white shadow-xl sm:p-8">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-400/10">
          <Dna className="size-5 text-teal-300" />
        </span>

        <div>
          <p className="font-bold">
            نقشه تصمیم‌گیری پروژه
          </p>
        </div>
      </div>

      <div className="mt-7 space-y-3">
        <MapRow
          number="01"
          title="سؤال پژوهشی"
          text="چه چیزی را واقعاً می‌خواهید بفهمید؟"
        />

        <MapArrow />

        <MapRow
          number="02"
          title="طراحی و نمونه‌ها"
          text="آیا ساختار مطالعه اجازه پاسخ‌دادن می‌دهد؟"
        />

        <MapArrow />

        <MapRow
          number="03"
          title="داده"
          text="الان دقیقاً چه نوع داده‌ای دارید؟"
        />

        <MapArrow />

        <MapRow
          number="04"
          title="تحلیل مناسب"
          text="چه روشی با سؤال و داده سازگارتر است؟"
        />

        <MapArrow />

        <MapRow
          number="05"
          title="تصمیم"
          text="یادگیری، طراحی تحلیل یا بازبینی تخصصی؟"
        />
      </div>
    </div>
  );
}

function MapRow({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.05] p-4">
      <span
        dir="ltr"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-xs font-bold text-teal-300"
      >
        {number}
      </span>

      <div>
        <p className="font-semibold text-white">
          {title}
        </p>

        <p className="mt-1 text-xs leading-6 text-slate-400">
          {text}
        </p>
      </div>
    </div>
  );
}

function MapArrow() {
  return (
    <div className="mr-[1.1rem] h-3 border-r border-dashed border-teal-400/30" />
  );
}

function SideStep({
  number,
  title,
  englishTitle,
  active,
  done,
}: {
  number: string;
  title: string;
  englishTitle: string;
  active: boolean;
  done: boolean;
}) {
  return (
    <div
      className={[
        "flex items-center gap-3 rounded-2xl border p-3",
        active
          ? "border-teal-400 bg-teal-50"
          : "border-transparent bg-slate-50",
      ].join(" ")}
    >
      <span
        className={[
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-bold",
          done
            ? "bg-emerald-100 text-emerald-700"
            : active
              ? "bg-teal-700 text-white"
              : "bg-white text-slate-500",
        ].join(" ")}
      >
        {done ? "✓" : number}
      </span>

      <div className="min-w-0">
        <p className="text-sm font-bold text-slate-800">
          {title}
        </p>

        <p
          dir="ltr"
          className="mt-0.5 truncate text-left text-[10px] font-medium text-slate-400"
        >
          {englishTitle}
        </p>
      </div>
    </div>
  );
}

function OptionGrid({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {children}
    </div>
  );
}

function ChoiceCard({
  active,
  onClick,
  title,
  englishTitle,
  description,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  englishTitle: string;
  description: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-2xl border p-5 text-right transition-all",
        active
          ? "border-teal-500 bg-teal-50 shadow-sm ring-1 ring-teal-100"
          : "border-slate-200 bg-white hover:border-teal-300 hover:bg-slate-50",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-bold leading-7 text-slate-950">
            {title}
          </p>

          <p
            dir="ltr"
            className="mt-1 text-left text-[11px] font-semibold text-teal-700"
          >
            {englishTitle}
          </p>
        </div>

        <span
          className={[
            "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-bold",
            active
              ? "border-teal-600 bg-teal-600 text-white"
              : "border-slate-200 bg-white text-transparent",
          ].join(" ")}
        >
          ✓
        </span>
      </div>

      <p className="mt-4 text-sm leading-7 text-slate-600">
        {description}
      </p>
    </button>
  );
}

function ResultSection({
  title,
  icon,
  iconClass,
  children,
}: {
  title: string;
  icon: string;
  iconClass: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h3 className="font-bold text-slate-950">
        {title}
      </h3>

      <div className="mt-4 space-y-3">
        {Array.isArray(children)
          ? children.map(
              (child, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <span
                    className={[
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold",
                      iconClass,
                    ].join(" ")}
                  >
                    {icon}
                  </span>

                  {child}
                </div>
              ),
            )
          : children}
      </div>
    </section>
  );
}

function ResultRow({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <p className="text-sm leading-7 text-slate-700">
      {children}
    </p>
  );
}

function SnapshotItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-sm font-bold leading-7 text-slate-900">
        {value}
      </p>
    </div>
  );
}

function getFirstIncompleteStep(
  answers: ProjectAnswers,
) {
  if (!answers.questionType) return 1;
  if (!answers.dataStage) return 2;
  if (!answers.replicates) return 3;
  if (!answers.metadata) return 4;
  if (!answers.goal) return 5;

  return null;
}

function stepTitle(step: number) {
  const titles = [
    "",
    "سؤال پژوهشی شما چه ساختاری دارد؟",
    "داده پروژه الان در چه مرحله‌ای است؟",
    "چند تکرار زیستی مستقل دارید؟",
    "وضعیت فراداده نمونه‌ها چگونه است؟",
    "هدف اصلی شما از تحلیل چیست؟",
  ];

  return titles[step];
}

function stepEnglishTitle(
  step: number,
) {
  const titles = [
    "",
    "Research Question",
    "Data Stage",
    "Biological Replicates",
    "Metadata",
    "Analysis Goal",
  ];

  return titles[step];
}

function stepDescription(
  step: number,
) {
  const descriptions = [
    "",
    "نیازی نیست سؤال را با اصطلاحات آماری بیان کنید. گزینه‌ای را انتخاب کنید که به ساختار پژوهش شما نزدیک‌تر است.",
    "نوع داده تعیین می‌کند از کدام بخش مسیر RNA-seq باید شروع کنیم.",
    "تکرارهای زیستی مستقل یکی از پایه‌های مهم استنباط آماری در RNA-seq هستند.",
    "بدون دانستن اینکه هر نمونه چیست و چگونه تولید شده، تعریف یک تحلیل قابل دفاع دشوار می‌شود.",
    "انتخاب روش باید از هدف پژوهشی بیاید، نه از محبوبیت یک ابزار یا تکنیک.",
  ];

  return descriptions[step];
}

function questionLabel(
  value?: QuestionType,
) {
  const labels: Record<
    QuestionType,
    string
  > = {
    "group-comparison":
      "مقایسه دو یا چند گروه",
    paired: "طراحی جفت‌شده",
    "time-series":
      "بررسی تغییرات در زمان",
    exploratory: "بررسی اکتشافی",
    unsure: "هنوز نامشخص",
  };

  return value
    ? labels[value]
    : "—";
}

function dataStageLabel(
  value?: DataStage,
) {
  const labels: Record<
    DataStage,
    string
  > = {
    planning:
      "مرحله طراحی؛ هنوز داده تولید نشده",
    fastq: "FASTQ",
    "count-matrix":
      "ماتریس شمارش",
    "processed-matrix":
      "ماتریس بیان پردازش‌شده",
    "public-data":
      "مجموعه‌داده عمومی",
    unsure: "نوع داده نامشخص",
  };

  return value
    ? labels[value]
    : "—";
}

function replicateLabel(
  value?: ReplicateLevel,
) {
  const labels: Record<
    ReplicateLevel,
    string
  > = {
    none:
      "هنوز نمونه‌گیری نشده",
    one:
      "یک نمونه زیستی در هر گروه",
    two:
      "حدود دو نمونه زیستی در هر گروه",
    "three-plus":
      "حداقل سه نمونه زیستی مستقل",
    unsure: "نامشخص",
  };

  return value
    ? labels[value]
    : "—";
}

function metadataLabel(
  value?: MetadataLevel,
) {
  const labels: Record<
    MetadataLevel,
    string
  > = {
    clear: "مشخص و منظم",
    partial: "ناقص",
    missing:
      "تقریباً موجود نیست",
    unsure: "نیاز به بررسی",
  };

  return value
    ? labels[value]
    : "—";
}

function goalLabel(
  value?: AnalysisGoal,
) {
  const labels: Record<
    AnalysisGoal,
    string
  > = {
    "differential-expression":
      "تحلیل بیان افتراقی",
    functional: "تحلیل عملکردی",
    network:
      "تحلیل شبکه / WGCNA",
    biomarker:
      "کشف نشانگر زیستی",
    explore:
      "بررسی اکتشافی داده",
    unsure: "هنوز مشخص نیست",
  };

  return value
    ? labels[value]
    : "—";
}

function toPersianNumber(
  value: number,
) {
  return new Intl.NumberFormat(
    "fa-IR",
  ).format(value);
}
