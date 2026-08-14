import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, type ReactNode } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CircleHelp,
  Dna,
  FlaskConical,
  RotateCcw,
} from "lucide-react";

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

type ProjectRecommendation = {
  level: RecommendationLevel;
  title: string;
  englishTitle: string;
  description: string;
  strengths: string[];
  concerns: string[];
  nextSteps: string[];
};

const totalSteps = 5;

function RnaSeqProjectMode() {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<ProjectAnswers>({});
  const [showResult, setShowResult] = useState(false);

  const recommendation = useMemo(
    () => buildRecommendation(answers),
    [answers],
  );

  const completedAnswers = Object.values(answers).filter(Boolean).length;

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

  function goNext() {
    if (!currentStepAnswered) return;

    if (step < totalSteps) {
      setStep((previous) => previous + 1);
      scrollToAssessment();
      return;
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

  function restart() {
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

            <span className="text-slate-300">/</span>

            <a
              href="/learn/rna-seq"
              className="text-slate-500 hover:text-slate-800"
            >
              RNA-seq
            </a>

            <span className="text-slate-300">/</span>

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
                  RNA-seq Project Mode
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
                      اصل مهم این بخش
                    </p>

                    <p className="mt-2 text-sm leading-7 text-amber-900/80">
                      هر تحلیلی که از نظر فنی قابل اجرا باشد، الزاماً
                      تحلیل مناسبی برای سؤال یا طراحی مطالعه شما نیست.
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

              <div className="mt-7 space-y-3">
                <SideStep
                  number="۱"
                  title="سؤال پژوهشی"
                  englishTitle="Research Question"
                  active={step === 1}
                  done={Boolean(answers.questionType)}
                />

                <SideStep
                  number="۲"
                  title="وضعیت داده"
                  englishTitle="Data Stage"
                  active={step === 2}
                  done={Boolean(answers.dataStage)}
                />

                <SideStep
                  number="۳"
                  title="تکرارهای زیستی"
                  englishTitle="Biological Replicates"
                  active={step === 3}
                  done={Boolean(answers.replicates)}
                />

                <SideStep
                  number="۴"
                  title="فراداده"
                  englishTitle="Metadata"
                  active={step === 4}
                  done={Boolean(answers.metadata)}
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
                  این بخش جای مشاوره تخصصی، بررسی کامل پروتکل یا تحلیل
                  واقعی داده را نمی‌گیرد. هدف آن مشخص‌کردن مسیر اولیه
                  پروژه است.
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
                        مرحله {toPersianNumber(step)}
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
                      value={answers.questionType}
                      onChange={(value) =>
                        setAnswers((previous) => ({
                          ...previous,
                          questionType: value,
                        }))
                      }
                    />
                  )}

                  {step === 2 && (
                    <DataStageStep
                      value={answers.dataStage}
                      onChange={(value) =>
                        setAnswers((previous) => ({
                          ...previous,
                          dataStage: value,
                        }))
                      }
                    />
                  )}

                  {step === 3 && (
                    <ReplicateStep
                      value={answers.replicates}
                      onChange={(value) =>
                        setAnswers((previous) => ({
                          ...previous,
                          replicates: value,
                        }))
                      }
                    />
                  )}

                  {step === 4 && (
                    <MetadataStep
                      value={answers.metadata}
                      onChange={(value) =>
                        setAnswers((previous) => ({
                          ...previous,
                          metadata: value,
                        }))
                      }
                    />
                  )}

                  {step === 5 && (
                    <GoalStep
                      value={answers.goal}
                      onChange={(value) =>
                        setAnswers((previous) => ({
                          ...previous,
                          goal: value,
                        }))
                      }
                    />
                  )}

                  <div className="mt-8 border-t border-slate-100 pt-6">
                    {!currentStepAnswered && (
                      <p className="mb-4 rounded-xl bg-slate-50 px-4 py-3 text-sm leading-7 text-slate-500">
                        برای ادامه، گزینه‌ای را انتخاب کنید که به وضعیت
                        فعلی پروژه شما نزدیک‌تر است.
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
                        onClick={goNext}
                        disabled={!currentStepAnswered}
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
                recommendation={recommendation}
                answers={answers}
                onRestart={restart}
              />
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

function QuestionTypeStep({
  value,
  onChange,
}: {
  value?: QuestionType;
  onChange: (value: QuestionType) => void;
}) {
  return (
    <OptionGrid>
      <ChoiceCard
        active={value === "group-comparison"}
        onClick={() => onChange("group-comparison")}
        title="مقایسه دو یا چند گروه"
        englishTitle="Group Comparison"
        description="مثلاً کنترل در برابر تیمار یا سالم در برابر بیمار."
      />

      <ChoiceCard
        active={value === "paired"}
        onClick={() => onChange("paired")}
        title="نمونه‌های جفت‌شده"
        englishTitle="Paired Design"
        description="مثلاً قبل و بعد از درمان از همان فرد یا نمونه."
      />

      <ChoiceCard
        active={value === "time-series"}
        onClick={() => onChange("time-series")}
        title="بررسی تغییرات در زمان"
        englishTitle="Time Series"
        description="چند زمان مختلف یا روند زمانی برایم مهم است."
      />

      <ChoiceCard
        active={value === "exploratory"}
        onClick={() => onChange("exploratory")}
        title="بررسی اکتشافی"
        englishTitle="Exploratory"
        description="هنوز یک مقایسه مشخص ندارم و می‌خواهم ساختار داده را بفهمم."
      />

      <ChoiceCard
        active={value === "unsure"}
        onClick={() => onChange("unsure")}
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
  value?: DataStage;
  onChange: (value: DataStage) => void;
}) {
  return (
    <OptionGrid>
      <ChoiceCard
        active={value === "planning"}
        onClick={() => onChange("planning")}
        title="هنوز داده تولید نکرده‌ام"
        englishTitle="Planning Stage"
        description="در مرحله طراحی پژوهش یا برنامه‌ریزی توالی‌یابی هستم."
      />

      <ChoiceCard
        active={value === "fastq"}
        onClick={() => onChange("fastq")}
        title="فایل FASTQ دارم"
        englishTitle="Raw Sequencing Data"
        description="داده خام توالی‌یابی در اختیار من است."
      />

      <ChoiceCard
        active={value === "count-matrix"}
        onClick={() => onChange("count-matrix")}
        title="ماتریس شمارش دارم"
        englishTitle="Count Matrix"
        description="جدول ژن × نمونه با شمارش‌های خام یا مشابه آن دارم."
      />

      <ChoiceCard
        active={value === "processed-matrix"}
        onClick={() => onChange("processed-matrix")}
        title="ماتریس پردازش‌شده دارم"
        englishTitle="Processed Expression Matrix"
        description="مثلاً TPM، FPKM یا داده تبدیل‌شده در اختیار من است."
      />

      <ChoiceCard
        active={value === "public-data"}
        onClick={() => onChange("public-data")}
        title="از داده‌های عمومی استفاده می‌کنم"
        englishTitle="Public Dataset"
        description="داده پروژه را از GEO، SRA یا منبع عمومی دیگری می‌گیرم."
      />

      <ChoiceCard
        active={value === "unsure"}
        onClick={() => onChange("unsure")}
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
  value?: ReplicateLevel;
  onChange: (value: ReplicateLevel) => void;
}) {
  return (
    <OptionGrid>
      <ChoiceCard
        active={value === "three-plus"}
        onClick={() => onChange("three-plus")}
        title="حداقل سه نمونه زیستی مستقل در هر گروه"
        englishTitle="3+ Biological Replicates"
        description="در گروه‌های اصلی چند نمونه زیستی مستقل دارم."
      />

      <ChoiceCard
        active={value === "two"}
        onClick={() => onChange("two")}
        title="حدود دو نمونه زیستی در هر گروه"
        englishTitle="2 Biological Replicates"
        description="تعداد نمونه‌های مستقل من محدود است."
      />

      <ChoiceCard
        active={value === "one"}
        onClick={() => onChange("one")}
        title="یک نمونه زیستی در هر گروه"
        englishTitle="Single Biological Replicate"
        description="برای هر شرایط اصلی فقط یک نمونه مستقل دارم."
      />

      <ChoiceCard
        active={value === "none"}
        onClick={() => onChange("none")}
        title="هنوز نمونه‌گیری انجام نشده"
        englishTitle="Not Collected Yet"
        description="پروژه هنوز در مرحله طراحی است."
      />

      <ChoiceCard
        active={value === "unsure"}
        onClick={() => onChange("unsure")}
        title="نمی‌دانم تکرار زیستی چیست"
        englishTitle="Not Sure"
        description="مطمئن نیستم فایل‌ها یا نمونه‌هایم تکرار زیستی محسوب می‌شوند یا نه."
      />
    </OptionGrid>
  );
}

function MetadataStep({
  value,
  onChange,
}: {
  value?: MetadataLevel;
  onChange: (value: MetadataLevel) => void;
}) {
  return (
    <OptionGrid>
      <ChoiceCard
        active={value === "clear"}
        onClick={() => onChange("clear")}
        title="فراداده من مشخص و منظم است"
        englishTitle="Clear Metadata"
        description="می‌دانم هر نمونه متعلق به کدام گروه است و اطلاعات طراحی مطالعه ثبت شده‌اند."
      />

      <ChoiceCard
        active={value === "partial"}
        onClick={() => onChange("partial")}
        title="بخشی از اطلاعات را دارم"
        englishTitle="Partial Metadata"
        description="گروه‌ها مشخص‌اند اما برخی اطلاعات مانند دسته آزمایشی یا عوامل دیگر کامل نیستند."
      />

      <ChoiceCard
        active={value === "missing"}
        onClick={() => onChange("missing")}
        title="فراداده تقریباً ندارم"
        englishTitle="Missing Metadata"
        description="فایل‌ها یا نمونه‌ها را دارم اما اطلاعات توصیفی آن‌ها بسیار محدود است."
      />

      <ChoiceCard
        active={value === "unsure"}
        onClick={() => onChange("unsure")}
        title="مطمئن نیستم چه اطلاعاتی لازم است"
        englishTitle="Not Sure"
        description="نمی‌دانم چه متغیرهایی باید برای تحلیل ثبت شده باشند."
      />
    </OptionGrid>
  );
}

function GoalStep({
  value,
  onChange,
}: {
  value?: AnalysisGoal;
  onChange: (value: AnalysisGoal) => void;
}) {
  return (
    <OptionGrid>
      <ChoiceCard
        active={value === "differential-expression"}
        onClick={() => onChange("differential-expression")}
        title="تحلیل بیان افتراقی"
        englishTitle="Differential Expression"
        description="می‌خواهم ژن‌هایی را پیدا کنم که میان شرایط مورد مطالعه تغییر کرده‌اند."
      />

      <ChoiceCard
        active={value === "functional"}
        onClick={() => onChange("functional")}
        title="تحلیل عملکردی و مسیرهای زیستی"
        englishTitle="Functional Analysis"
        description="می‌خواهم از نتایج ژنی به فرآیندها و مسیرهای زیستی برسم."
      />

      <ChoiceCard
        active={value === "network"}
        onClick={() => onChange("network")}
        title="تحلیل شبکه و WGCNA"
        englishTitle="Network Analysis"
        description="می‌خواهم روابط هم‌بیانی، ماژول‌ها یا ژن‌های هاب را بررسی کنم."
      />

      <ChoiceCard
        active={value === "biomarker"}
        onClick={() => onChange("biomarker")}
        title="کشف نشانگر زیستی"
        englishTitle="Biomarker Discovery"
        description="هدف من انتخاب ژن‌ها یا امضاهای کاندیدا برای تشخیص، پیش‌آگهی یا کاربرد مشابه است."
      />

      <ChoiceCard
        active={value === "explore"}
        onClick={() => onChange("explore")}
        title="فعلاً فقط می‌خواهم داده را بفهمم"
        englishTitle="Data Exploration"
        description="هنوز برای انتخاب تحلیل نهایی آماده نیستم."
      />

      <ChoiceCard
        active={value === "unsure"}
        onClick={() => onChange("unsure")}
        title="نمی‌دانم چه تحلیلی مناسب است"
        englishTitle="Not Sure"
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
          این نتیجه بر اساس پاسخ‌های شما ساخته شده است و جای بررسی
          تخصصی کامل طراحی پژوهش را نمی‌گیرد.
        </p>
      </div>

      <div className="space-y-8 p-6 sm:p-8">
        <section
          className={`rounded-3xl border p-6 ${theme.border} ${theme.background}`}
        >
          <div className="flex items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white">
              <StatusIcon className={`size-6 ${theme.text}`} />
            </span>

            <div>
              <p className={`text-sm font-bold ${theme.text}`}>
                {recommendation.englishTitle}
              </p>

              <h3 className="mt-1 text-2xl font-bold text-slate-950">
                {recommendation.title}
              </h3>

              <p className="mt-3 leading-8 text-slate-700">
                {recommendation.description}
              </p>
            </div>
          </div>
        </section>

        <ProjectSnapshot answers={answers} />

        {recommendation.strengths.length > 0 && (
          <ResultSection
            title="نقاط مثبت فعلی پروژه"
            icon="✓"
            iconClass="bg-emerald-100 text-emerald-700"
          >
            {recommendation.strengths.map((item) => (
              <ResultRow key={item}>{item}</ResultRow>
            ))}
          </ResultSection>
        )}

        {recommendation.concerns.length > 0 && (
          <ResultSection
            title="مواردی که قبل از ادامه باید بررسی شوند"
            icon="!"
            iconClass="bg-amber-100 text-amber-800"
          >
            {recommendation.concerns.map((item) => (
              <ResultRow key={item}>{item}</ResultRow>
            ))}
          </ResultSection>
        )}

        <ResultSection
          title="قدم‌های بعدی پیشنهادی"
          icon="→"
          iconClass="bg-teal-100 text-teal-800"
        >
          {recommendation.nextSteps.map((item) => (
            <ResultRow key={item}>{item}</ResultRow>
          ))}
        </ResultSection>

        {(answers.goal === "network" ||
          answers.goal === "biomarker") && (
          <div className="rounded-3xl border border-violet-200 bg-violet-50 p-6">
            <p className="font-bold text-violet-950">
              درباره هدف پیشرفته شما
            </p>

            <p className="mt-3 text-sm leading-8 text-violet-900/80">
              انتخاب تحلیل شبکه، WGCNA یا مسیر کشف نشانگر زیستی نباید
              فقط به دلیل رایج بودن این روش‌ها انجام شود. تعداد
              نمونه‌های مستقل، ساختار داده، سؤال زیستی و برنامه
              اعتبارسنجی باید ابتدا بررسی شوند.
            </p>
          </div>
        )}

        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
          <p className="text-sm font-semibold text-teal-700">
            ادامه مسیر
          </p>

          <h3 className="mt-2 text-2xl font-bold text-slate-950">
            حالا بر اساس وضعیت پروژه تصمیم بگیرید.
          </h3>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {recommendation.level === "learn" ? (
              <>
                <a
                  href="/learn/rna-seq/navigator"
                  className="inline-flex min-h-12 items-center justify-center rounded-xl bg-slate-950 px-5 py-3 font-bold text-white transition hover:bg-slate-800"
                >
                  مرور مسیر یادگیری RNA-seq
                </a>

                <button
                  type="button"
                  onClick={onRestart}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700"
                >
                  <RotateCcw className="size-4" />
                  بررسی دوباره پروژه
                </button>
              </>
            ) : recommendation.level === "review" ? (
              <>
                <a
                  href="/consultation"
                  className="inline-flex min-h-12 items-center justify-center rounded-xl bg-slate-950 px-5 py-3 font-bold text-white transition hover:bg-slate-800"
                >
                  درخواست بازبینی تخصصی
                </a>

                <a
                  href="/learn/rna-seq/navigator"
                  className="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700"
                >
                  مرور مفاهیم RNA-seq
                </a>
              </>
            ) : (
              <>
                <a
                  href="/consultation"
                  className="inline-flex min-h-12 items-center justify-center rounded-xl bg-teal-700 px-5 py-3 font-bold text-white transition hover:bg-teal-800"
                >
                  طراحی تحلیل با متخصص
                </a>

                <button
                  type="button"
                  onClick={onRestart}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700"
                >
                  <RotateCcw className="size-4" />
                  بررسی پروژه دیگر
                </button>
              </>
            )}
          </div>
        </div>

        <div className="rounded-2xl bg-slate-950 p-5 text-white">
          <p className="text-sm font-bold text-teal-300">
            Can run ≠ Should run
          </p>

          <p className="mt-2 text-sm leading-7 text-slate-300">
            هدف هاب‌ژن این نیست که فقط نشان دهد چه تحلیلی قابل اجراست؛
            هدف این است که کمک کند بفهمید چه تحلیلی برای سؤال و طراحی
            واقعی پروژه شما قابل دفاع‌تر است.
          </p>
        </div>
      </div>
    </article>
  );
}

function buildRecommendation(
  answers: ProjectAnswers,
): ProjectRecommendation {
  const strengths: string[] = [];
  const concerns: string[] = [];
  const nextSteps: string[] = [];

  let level: RecommendationLevel = "design";

  if (
    answers.questionType === "group-comparison" ||
    answers.questionType === "paired" ||
    answers.questionType === "time-series"
  ) {
    strengths.push(
      "ساختار کلی سؤال پژوهشی شما به یک طراحی قابل تحلیل نزدیک است.",
    );
  }

  if (answers.questionType === "unsure") {
    concerns.push(
      "سؤال پژوهشی هنوز به یک مقایسه یا هدف تحلیلی مشخص تبدیل نشده است.",
    );
    level = "learn";

    nextSteps.push(
      "ابتدا سؤال زیستی را به گروه‌ها، شرایط یا متغیر قابل مقایسه تبدیل کنید.",
    );
  }

  if (answers.questionType === "exploratory") {
    concerns.push(
      "پروژه در حال حاضر بیشتر ماهیت اکتشافی دارد و هنوز سؤال اصلی برای آزمون مشخص نشده است.",
    );

    if (level !== "learn") {
      level = "review";
    }
  }

  if (answers.dataStage === "planning") {
    strengths.push(
      "هنوز فرصت دارید طراحی مطالعه را پیش از تولید داده اصلاح کنید.",
    );

    nextSteps.push(
      "پیش از توالی‌یابی، تعداد نمونه‌ها، گروه‌ها و فراداده موردنیاز را نهایی کنید.",
    );
  }

  if (
    answers.dataStage === "fastq" ||
    answers.dataStage === "count-matrix"
  ) {
    strengths.push(
      "داده شما در یکی از مراحل استاندارد مسیر RNA-seq قرار دارد.",
    );
  }

  if (answers.dataStage === "processed-matrix") {
    concerns.push(
      "قبل از انتخاب تحلیل باید مشخص شود ماتریس پردازش‌شده دقیقاً چه نوع مقادیری دارد و چگونه تولید شده است.",
    );

    if (level === "design") {
      level = "review";
    }

    nextSteps.push(
      "نوع ماتریس را مشخص کنید: شمارش خام، TPM، FPKM یا داده تبدیل‌شده.",
    );
  }

  if (answers.dataStage === "public-data") {
    concerns.push(
      "تناسب مجموعه‌داده عمومی با سؤال پژوهشی باید پیش از اجرای تحلیل بررسی شود.",
    );

    nextSteps.push(
      "طراحی مطالعه و فراداده مجموعه‌داده عمومی را با سؤال خود تطبیق دهید.",
    );
  }

  if (answers.dataStage === "unsure") {
    concerns.push(
      "نوع داده فعلی پروژه مشخص نیست؛ بنابراین انتخاب روش تحلیل هنوز زود است.",
    );

    level = "learn";

    nextSteps.push(
      "ابتدا نوع فایل یا ماتریس و مرحله فعلی داده را مشخص کنید.",
    );
  }

  if (answers.replicates === "three-plus") {
    strengths.push(
      "برای گروه‌های اصلی چند تکرار زیستی مستقل گزارش کرده‌اید.",
    );
  }

  if (answers.replicates === "two") {
    concerns.push(
      "تعداد تکرارهای زیستی محدود است و توان تحلیل آماری باید با احتیاط بررسی شود.",
    );

    if (level === "design") {
      level = "review";
    }

    nextSteps.push(
      "قبل از نتیجه‌گیری، محدودیت تعداد نمونه‌های مستقل را در طراحی آماری لحاظ کنید.",
    );
  }

  if (answers.replicates === "one") {
    concerns.push(
      "وجود تنها یک نمونه زیستی در هر گروه محدودیت جدی برای استنباط آماری ایجاد می‌کند.",
    );

    level = "review";

    nextSteps.push(
      "قبل از اجرای تحلیل بیان افتراقی، طراحی مطالعه و امکان افزایش تکرارهای زیستی را بررسی کنید.",
    );
  }

  if (answers.replicates === "none") {
    nextSteps.push(
      "تعداد تکرارهای زیستی را پیش از شروع نمونه‌گیری و توالی‌یابی تعیین کنید.",
    );

    if (level === "design") {
      level = "review";
    }
  }

  if (answers.replicates === "unsure") {
    concerns.push(
      "هنوز مشخص نیست کدام نمونه‌ها تکرار زیستی مستقل محسوب می‌شوند.",
    );

    level = "learn";

    nextSteps.push(
      "تفاوت تکرار زیستی و تکرار فنی را پیش از ادامه مرور کنید.",
    );
  }

  if (answers.metadata === "clear") {
    strengths.push(
      "اطلاعات گروه‌بندی و فراداده نمونه‌ها مشخص هستند.",
    );
  }

  if (answers.metadata === "partial") {
    concerns.push(
      "فراداده ناقص است و ممکن است برخی عوامل فنی یا زیستی در مدل تحلیل وارد نشوند.",
    );

    if (level === "design") {
      level = "review";
    }

    nextSteps.push(
      "فراداده نمونه‌ها را قبل از ساخت مدل آماری کامل کنید.",
    );
  }

  if (answers.metadata === "missing") {
    concerns.push(
      "نبود فراداده می‌تواند تفسیر نمونه‌ها و تعریف مقایسه آماری را دشوار یا غیرممکن کند.",
    );

    level = "review";

    nextSteps.push(
      "اطلاعات گروه، شرایط آزمایش و عوامل مهم هر نمونه را بازیابی کنید.",
    );
  }

  if (answers.metadata === "unsure") {
    concerns.push(
      "هنوز مشخص نیست چه فراداده‌ای برای تحلیل پروژه لازم است.",
    );

    if (level === "design") {
      level = "learn";
    }

    nextSteps.push(
      "حداقل گروه، شناسه نمونه، تکرار زیستی و عوامل احتمالی مداخله‌گر را مشخص کنید.",
    );
  }

  if (answers.goal === "differential-expression") {
    nextSteps.push(
      "مقایسه آماری اصلی را به‌صورت دقیق تعریف کنید.",
    );
  }

  if (answers.goal === "functional") {
    nextSteps.push(
      "ابتدا مشخص کنید ورودی تحلیل عملکردی فهرست ژنی است یا رتبه‌بندی گسترده ژن‌ها.",
    );
  }

  if (answers.goal === "network") {
    nextSteps.push(
      "قبل از WGCNA یا تحلیل شبکه، مناسب بودن تعداد نمونه‌ها و ساختار ماتریس بیان را جداگانه بررسی کنید.",
    );

    if (
      answers.replicates === "one" ||
      answers.replicates === "two" ||
      answers.replicates === "unsure"
    ) {
      concerns.push(
        "با تعداد نمونه محدود، انتخاب تحلیل شبکه نیاز به بازبینی جدی دارد.",
      );

      level = "review";
    }
  }

  if (answers.goal === "biomarker") {
    concerns.push(
      "کشف نشانگر زیستی فقط با پیدا کردن DEG یا ژن هاب کامل نمی‌شود و به برنامه اعتبارسنجی نیاز دارد.",
    );

    nextSteps.push(
      "از همین ابتدا مشخص کنید کاندیداها چگونه در داده مستقل یا آزمایش دیگری اعتبارسنجی خواهند شد.",
    );

    if (level === "design") {
      level = "review";
    }
  }

  if (answers.goal === "explore") {
    nextSteps.push(
      "با بررسی ساختار نمونه‌ها، PCA، همبستگی و کنترل کیفیت از داده شروع کنید.",
    );
  }

  if (answers.goal === "unsure") {
    concerns.push(
      "هدف تحلیل هنوز مشخص نشده است؛ بهتر است ابزار را قبل از روشن‌شدن سؤال انتخاب نکنید.",
    );

    if (level === "design") {
      level = "learn";
    }

    nextSteps.push(
      "ابتدا مشخص کنید خروجی مورد انتظار پروژه چیست: تغییر بیان، مسیر زیستی، شبکه یا هدف دیگری.",
    );
  }

  if (nextSteps.length === 0) {
    nextSteps.push(
      "سؤال پژوهشی، طراحی مطالعه و مقایسه آماری را به یک نقشه تحلیل مشخص تبدیل کنید.",
    );
  }

  if (level === "learn") {
    return {
      level,
      title: "ابتدا چند مفهوم یا بخش از طراحی را روشن کنید",
      englishTitle: "Learn More",
      description:
        "در وضعیت فعلی هنوز یک یا چند جزء پایه برای انتخاب مسیر تحلیل مشخص نیست. بهتر است قبل از ورود به اجرای تحلیل، همان بخش‌ها را روشن کنید.",
      strengths,
      concerns,
      nextSteps,
    };
  }

  if (level === "review") {
    return {
      level,
      title: "پروژه شما قبل از تحلیل به بازبینی نیاز دارد",
      englishTitle: "Expert Review Recommended",
      description:
        "مسیر کلی پروژه قابل تشخیص است، اما یک یا چند تصمیم طراحی می‌تواند روی اعتبار نتیجه اثر جدی بگذارد. اجرای تحلیل بدون بررسی این موارد توصیه نمی‌شود.",
      strengths,
      concerns,
      nextSteps,
    };
  }

  return {
    level,
    title: "اطلاعات اولیه برای طراحی مسیر تحلیل مناسب است",
    englishTitle: "Ready to Design",
    description:
      "بر اساس پاسخ‌های فعلی، اجزای اصلی پروژه تا حد خوبی مشخص هستند. قدم بعدی تبدیل این اطلاعات به یک طرح تحلیل دقیق و قابل دفاع است.",
    strengths,
    concerns,
    nextSteps,
  };
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
          value={questionLabel(answers.questionType)}
        />

        <SnapshotItem
          label="وضعیت داده"
          value={dataStageLabel(answers.dataStage)}
        />

        <SnapshotItem
          label="تکرارهای زیستی"
          value={replicateLabel(answers.replicates)}
        />

        <SnapshotItem
          label="فراداده"
          value={metadataLabel(answers.metadata)}
        />

        <SnapshotItem
          label="هدف تحلیل"
          value={goalLabel(answers.goal)}
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

          <p
            dir="ltr"
            className="mt-0.5 text-left text-xs text-slate-500"
          >
            Project Decision Map
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
          ? children.map((child, index) => (
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
            ))
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

function stepEnglishTitle(step: number) {
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

function stepDescription(step: number) {
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

function questionLabel(value?: QuestionType) {
  const labels: Record<QuestionType, string> = {
    "group-comparison": "مقایسه دو یا چند گروه",
    paired: "طراحی جفت‌شده",
    "time-series": "بررسی تغییرات در زمان",
    exploratory: "بررسی اکتشافی",
    unsure: "هنوز نامشخص",
  };

  return value ? labels[value] : "—";
}

function dataStageLabel(value?: DataStage) {
  const labels: Record<DataStage, string> = {
    planning: "مرحله طراحی؛ هنوز داده تولید نشده",
    fastq: "FASTQ",
    "count-matrix": "ماتریس شمارش",
    "processed-matrix": "ماتریس بیان پردازش‌شده",
    "public-data": "مجموعه‌داده عمومی",
    unsure: "نوع داده نامشخص",
  };

  return value ? labels[value] : "—";
}

function replicateLabel(value?: ReplicateLevel) {
  const labels: Record<ReplicateLevel, string> = {
    none: "هنوز نمونه‌گیری نشده",
    one: "یک نمونه زیستی در هر گروه",
    two: "حدود دو نمونه زیستی در هر گروه",
    "three-plus": "حداقل سه نمونه زیستی مستقل",
    unsure: "نامشخص",
  };

  return value ? labels[value] : "—";
}

function metadataLabel(value?: MetadataLevel) {
  const labels: Record<MetadataLevel, string> = {
    clear: "مشخص و منظم",
    partial: "ناقص",
    missing: "تقریباً موجود نیست",
    unsure: "نیاز به بررسی",
  };

  return value ? labels[value] : "—";
}

function goalLabel(value?: AnalysisGoal) {
  const labels: Record<AnalysisGoal, string> = {
    "differential-expression": "تحلیل بیان افتراقی",
    functional: "تحلیل عملکردی",
    network: "تحلیل شبکه / WGCNA",
    biomarker: "کشف نشانگر زیستی",
    explore: "بررسی اکتشافی داده",
    unsure: "هنوز مشخص نیست",
  };

  return value ? labels[value] : "—";
}

function toPersianNumber(value: number) {
  return new Intl.NumberFormat("fa-IR").format(value);
}
