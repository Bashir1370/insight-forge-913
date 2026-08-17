import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  CheckCircle2,
  Database,
  FileText,
  FlaskConical,
  Lightbulb,
  Loader2,
  RotateCcw,
  Sparkles,
} from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { InteractiveLessonShell } from "../components/InteractiveLessonShell";

type Confidence = "unclear" | "developing" | "clear";

type SaveState =
  | "guest"
  | "loading"
  | "idle"
  | "saving"
  | "saved"
  | "error";

type WorkflowStep = {
  id: string;
  title: string;
  description: string;
};

type ProjectReflection =
  | "raw-data"
  | "matrix"
  | "analysis"
  | "interpretation"
  | "unsure";

type LearningProgressRow = {
  status:
    | "not_started"
    | "in_progress"
    | "completed"
    | "needs_review";
  confidence: Confidence | null;
  selected_answer: number | null;
  is_correct: boolean | null;
  updated_at: string;
};

const RESEARCH_LINE = "transcriptomics-foundations";
const NODE_ID = "f7-rna-seq-in-transcriptomics";

const sceneTitles = [
  "جایگاه RNA-seq",
  "مسیر نمونه تا داده",
  "آزمایشگاه ساخت مسیر",
  "FASTQ یا ماتریس بیان؟",
  "توالی‌یابی پایان کار نیست",
  "پروژه سرطان پانکراس",
  "تسلط و ورود به مسیر بعدی",
];

const correctWorkflow: WorkflowStep[] = [
  {
    id: "sample",
    title: "نمونه زیستی",
    description: "سلول، بافت یا نمونه‌ای که سؤال پژوهشی روی آن تعریف شده است.",
  },
  {
    id: "rna",
    title: "استخراج RNA",
    description: "RNA از نمونه استخراج می‌شود تا ماده اولیه مناسب برای آماده‌سازی کتابخانه فراهم شود.",
  },
  {
    id: "library",
    title: "آماده‌سازی کتابخانه",
    description: "RNA به قالب مناسب برای توالی‌یابی تبدیل و برای هدف آزمایش آماده می‌شود.",
  },
  {
    id: "sequencing",
    title: "توالی‌یابی",
    description: "دستگاه توالی‌یاب خوانش‌هایی از کتابخانه تولید می‌کند.",
  },
  {
    id: "reads",
    title: "خوانش‌ها و فایل FASTQ",
    description: "یکی از خروجی‌های رایج مرحله توالی‌یابی فایل FASTQ است.",
  },
  {
    id: "quantification",
    title: "کمی‌سازی",
    description: "خوانش‌ها پردازش می‌شوند تا مقدار RNA مربوط به ژن‌ها یا ترنسکریپت‌ها برآورد شود.",
  },
  {
    id: "matrix",
    title: "ماتریس بیان",
    description: "مقادیر بیان برای ژن‌ها و نمونه‌ها در یک ساختار جدولی سازمان‌دهی می‌شوند.",
  },
  {
    id: "analysis",
    title: "تحلیل",
    description: "ساختار نمونه‌ها، تفاوت بیان و سایر سؤال‌های آماری یا زیستی بررسی می‌شوند.",
  },
  {
    id: "interpretation",
    title: "تفسیر زیستی",
    description: "نتیجه تحلیل به سؤال پژوهشی و شواهد زیستی برگردانده می‌شود.",
  },
];

const shuffledWorkflow = [
  correctWorkflow[4],
  correctWorkflow[0],
  correctWorkflow[6],
  correctWorkflow[2],
  correctWorkflow[8],
  correctWorkflow[1],
  correctWorkflow[7],
  correctWorkflow[3],
  correctWorkflow[5],
];

const reflectionLabels: Record<ProjectReflection, string> = {
  "raw-data": "بیشتر با داده خام و FASTQ درگیرم",
  matrix: "ماتریس بیان دارم و نمی‌دانم از کجا ادامه بدهم",
  analysis: "می‌خواهم مسیر تحلیل RNA-seq را بفهمم",
  interpretation: "در تفسیر زیستی نتایج مشکل دارم",
  unsure: "هنوز جای پروژه‌ام در این مسیر روشن نیست",
};

export function RnaSeqInTranscriptomicsLesson() {
  const { session } = useAuth();
  const userId = session?.user?.id ?? null;

  const [scene, setScene] = useState(0);
  const [openingAnswer, setOpeningAnswer] = useState<number | null>(null);
  const [workflowAnswer, setWorkflowAnswer] = useState<number | null>(null);

  const [builderSteps, setBuilderSteps] =
    useState<WorkflowStep[]>(shuffledWorkflow);

  const [fastqAnswer, setFastqAnswer] = useState<number | null>(null);
  const [matrixAnswer, setMatrixAnswer] = useState<number | null>(null);
  const [sequencingAnswer, setSequencingAnswer] =
    useState<number | null>(null);
  const [microarrayAnswer, setMicroarrayAnswer] =
    useState<number | null>(null);
  const [caseAnswer, setCaseAnswer] = useState<number | null>(null);
  const [reflection, setReflection] =
    useState<ProjectReflection | null>(null);

  const [masteryAnswer, setMasteryAnswer] = useState<number | null>(null);
  const [confidence, setConfidence] = useState<Confidence | null>(null);
  const [saveState, setSaveState] = useState<SaveState>("guest");
  const [saveError, setSaveError] = useState("");
  const [savedProgress, setSavedProgress] =
    useState<LearningProgressRow | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadProgress() {
      if (!userId) {
        setSaveState("guest");
        return;
      }

      setSaveState("loading");
      setSaveError("");

      const { data, error } = await (supabase as any)
        .from("learning_progress")
        .select(
          "status, confidence, selected_answer, is_correct, updated_at",
        )
        .eq("user_id", userId)
        .eq("research_line", RESEARCH_LINE)
        .eq("node_id", NODE_ID)
        .maybeSingle();

      if (cancelled) return;

      if (error) {
        console.error("Failed to load F7 progress:", error);
        setSaveState("error");
        setSaveError("بازیابی وضعیت قبلی این درس انجام نشد.");
        return;
      }

      if (data) {
        const row = data as LearningProgressRow;
        setSavedProgress(row);

        if (row.selected_answer !== null) {
          setMasteryAnswer(row.selected_answer);
        }

        if (row.confidence) {
          setConfidence(row.confidence);
        }

        setSaveState("saved");
        return;
      }

      setSaveState("idle");
    }

    void loadProgress();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  const builderCorrect = useMemo(
    () =>
      builderSteps.every(
        (step, index) => step.id === correctWorkflow[index].id,
      ),
    [builderSteps],
  );

  const canFinish =
    masteryAnswer !== null && Boolean(confidence);

  function moveStep(index: number, direction: "up" | "down") {
    setBuilderSteps((previous) => {
      const next = [...previous];
      const target = direction === "up" ? index - 1 : index + 1;

      if (target < 0 || target >= next.length) {
        return previous;
      }

      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function resetBuilder() {
    setBuilderSteps(shuffledWorkflow);
  }

  function solveBuilder() {
    setBuilderSteps(correctWorkflow);
  }

  function goToScene(nextScene: number) {
    setScene(nextScene);

    window.setTimeout(() => {
      document.getElementById("f7-scene")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 20);
  }

  function goNext() {
    if (scene < sceneTitles.length - 1) {
      goToScene(scene + 1);
    }
  }

  function goPrevious() {
    if (scene > 0) {
      goToScene(scene - 1);
    }
  }

  async function saveMastery() {
    if (!canFinish || !userId) {
      setSaveState("guest");
      return;
    }

    const isCorrect = masteryAnswer === 1;

    const status =
      confidence === "unclear" || !isCorrect
        ? "needs_review"
        : "completed";

    setSaveState("saving");
    setSaveError("");

    const { error } = await (supabase as any)
      .from("learning_progress")
      .upsert(
        {
          user_id: userId,
          research_line: RESEARCH_LINE,
          node_id: NODE_ID,
          status,
          confidence,
          selected_answer: masteryAnswer,
          is_correct: isCorrect,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id,research_line,node_id",
        },
      );

    if (error) {
      console.error("Failed to save F7 progress:", error);
      setSaveState("error");
      setSaveError("ذخیره نتیجه این درس انجام نشد.");
      return;
    }

    setSavedProgress({
      status,
      confidence,
      selected_answer: masteryAnswer,
      is_correct: isCorrect,
      updated_at: new Date().toISOString(),
    });

    setSaveState("saved");
  }

  function restartLesson() {
    setScene(0);
    setOpeningAnswer(null);
    setWorkflowAnswer(null);
    setBuilderSteps(shuffledWorkflow);
    setFastqAnswer(null);
    setMatrixAnswer(null);
    setSequencingAnswer(null);
    setMicroarrayAnswer(null);
    setCaseAnswer(null);
    setReflection(null);
    setMasteryAnswer(null);
    setConfidence(null);

    window.setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 20);
  }

  return (
    <InteractiveLessonShell
      foundationIndex={7}
      total={7}
      title="RNA-seq در نقشه ترنسکریپتومیکس کجاست؟"
      subtitle="در این درس آخر Foundations، جای RNA-seq را در نقشه علمی ترنسکریپتومیکس مشخص می‌کنیم و مسیر نمونه زیستی تا FASTQ، کمی‌سازی، ماتریس بیان، تحلیل و تفسیر را به هم متصل می‌کنیم."
      currentScene={scene}
      sceneCount={sceneTitles.length}
      sceneLabel={sceneTitles[scene]}
    >
      <section id="f7-scene" className="scroll-mt-6">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {sceneTitles.map((title, index) => (
                <button
                  key={title}
                  type="button"
                  onClick={() => goToScene(index)}
                  className={[
                    "rounded-full border px-3 py-1.5 text-xs font-semibold transition",
                    index === scene
                      ? "border-teal-600 bg-teal-600 text-white"
                      : index < scene
                        ? "border-teal-200 bg-teal-50 text-teal-700"
                        : "border-slate-200 bg-white text-slate-400",
                  ].join(" ")}
                >
                  {new Intl.NumberFormat("fa-IR").format(index + 1)}. {title}
                </button>
              ))}
            </div>

            <SaveIndicator
              userId={userId}
              state={saveState}
              savedProgress={savedProgress}
              error={saveError}
            />
          </div>

          {scene === 0 && (
            <SceneCard
              eyebrow="جایگاه RNA-seq"
              title="RNA-seq خودِ ترنسکریپتومیکس نیست؛ یکی از روش‌های اندازه‌گیری درون آن است."
              description="ترنسکریپتومیکس یک حوزه علمی است. RNA-seq یکی از روش‌هایی است که برای اندازه‌گیری RNA در این حوزه استفاده می‌شود."
            >
              <div className="grid gap-4 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
                <ConceptCard
                  title="ترنسکریپتومیکس"
                  text="حوزه‌ای برای مطالعه RNAها و الگوهای بیان در سلول، بافت یا نمونه."
                  emphasized
                />

                <div className="hidden text-3xl text-teal-600 lg:block">
                  ←
                </div>

                <ConceptCard
                  title="RNA-seq"
                  text="یک راه اندازه‌گیری مبتنی بر توالی‌یابی برای بررسی RNA و ساخت داده قابل تحلیل."
                />
              </div>

              <DecisionQuestion
                question="کدام جمله دقیق‌تر است؟"
                options={[
                  "ترنسکریپتومیکس و RNA-seq دقیقاً یک مفهوم‌اند.",
                  "RNA-seq یکی از روش‌های اندازه‌گیری در ترنسکریپتومیکس است.",
                  "RNA-seq فقط نام دیگری برای ماتریس بیان است.",
                ]}
                selected={openingAnswer}
                correctIndex={1}
                onSelect={setOpeningAnswer}
                correctFeedback="دقیقاً. حوزه علمی را از فناوری اندازه‌گیری جدا کردید."
                incorrectFeedback="ترنسکریپتومیکس یک حوزه علمی گسترده‌تر است و RNA-seq یکی از روش‌های اندازه‌گیری در آن است."
              />

              <InsightBox>
                اصل این درس: <strong>حوزه علمی ≠ فناوری ≠ فایل داده ≠ تحلیل.</strong>
              </InsightBox>
            </SceneCard>
          )}

          {scene === 1 && (
            <SceneCard
              eyebrow="مسیر نمونه تا نتیجه"
              title="RNA-seq یک زنجیره است، نه یک دکمه."
              description="قبل از تحلیل آماری، چند مرحله زیستی و فنی رخ می‌دهد. بعد از توالی‌یابی هم مسیر هنوز ادامه دارد."
            >
              <div className="grid gap-3 md:grid-cols-3">
                {correctWorkflow.map((step, index) => (
                  <WorkflowCard
                    key={step.id}
                    index={index + 1}
                    title={step.title}
                    description={step.description}
                  />
                ))}
              </div>

              <DecisionQuestion
                question="کدام ترتیب مفهومی مناسب‌تر است؟"
                options={[
                  "نمونه ← RNA ← کتابخانه ← توالی‌یابی ← FASTQ ← کمی‌سازی ← ماتریس بیان ← تحلیل ← تفسیر",
                  "نمونه ← ماتریس بیان ← FASTQ ← RNA ← تفسیر",
                  "FASTQ ← نمونه ← کتابخانه ← DNA ← ماتریس بیان",
                ]}
                selected={workflowAnswer}
                correctIndex={0}
                onSelect={setWorkflowAnswer}
                correctFeedback="درست است. حالا جای فایل خام، کمی‌سازی و تحلیل را در یک نقشه واحد می‌بینید."
                incorrectFeedback="به مسیر زیستی و فنی فکر کنید: نمونه و RNA قبل از توالی‌یابی هستند؛ ماتریس بیان بعد از پردازش خوانش‌ها ساخته می‌شود."
              />
            </SceneCard>
          )}

          {scene === 2 && (
            <SceneCard
              eyebrow="آزمایشگاه ساخت مسیر"
              title="مراحل RNA-seq را خودتان مرتب کنید."
              description="با فلش‌ها هر مرحله را بالا یا پایین ببرید تا زنجیره از نمونه زیستی تا تفسیر ساخته شود."
            >
              <div className="space-y-3">
                {builderSteps.map((step, index) => (
                  <div
                    key={step.id}
                    className={[
                      "flex items-center gap-3 rounded-2xl border p-4 transition",
                      builderCorrect
                        ? "border-emerald-200 bg-emerald-50"
                        : "border-slate-200 bg-white",
                    ].join(" ")}
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-xs font-black text-white">
                      {new Intl.NumberFormat("fa-IR").format(index + 1)}
                    </span>

                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-slate-950">{step.title}</p>
                      <p className="mt-1 text-xs leading-6 text-slate-500">
                        {step.description}
                      </p>
                    </div>

                    <div className="flex shrink-0 gap-1">
                      <button
                        type="button"
                        onClick={() => moveStep(index, "up")}
                        disabled={index === 0}
                        className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 disabled:opacity-30"
                        aria-label={`بردن ${step.title} به بالا`}
                      >
                        <ArrowUp className="size-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => moveStep(index, "down")}
                        disabled={index === builderSteps.length - 1}
                        className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 disabled:opacity-30"
                        aria-label={`بردن ${step.title} به پایین`}
                      >
                        <ArrowDown className="size-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={resetBuilder}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700"
                >
                  شروع دوباره
                </button>

                <button
                  type="button"
                  onClick={solveBuilder}
                  className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-bold text-white"
                >
                  نمایش ترتیب درست
                </button>
              </div>

              {builderCorrect && (
                <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                  <p className="font-bold text-emerald-900">
                    مسیر کامل شد ✓
                  </p>
                  <p className="mt-2 text-sm leading-7 text-emerald-800">
                    مهم‌ترین نکته این است که FASTQ هنوز «نتیجه تحلیل» نیست و ماتریس بیان هم قبل از کمی‌سازی ساخته نمی‌شود.
                  </p>
                </div>
              )}
            </SceneCard>
          )}

          {scene === 3 && (
            <SceneCard
              eyebrow="FASTQ یا ماتریس بیان؟"
              title="داده خام و داده کمی‌شده دو چیز متفاوت‌اند."
              description="یکی از مهم‌ترین مرزهای ذهنی در RNA-seq همین‌جاست."
            >
              <div className="grid gap-4 md:grid-cols-2">
                <DataCard
                  icon={<FileText className="size-5" />}
                  title="FASTQ"
                  description="فایلی شامل خوانش‌های توالی‌یابی و اطلاعات کیفیت آن‌ها؛ هنوز یک ماتریس بیان ژن نیست."
                />

                <DataCard
                  icon={<Database className="size-5" />}
                  title="ماتریس بیان"
                  description="ساختاری جدولی که مقدارهای بیان برای ژن‌ها یا ترنسکریپت‌ها در نمونه‌ها را نگه می‌دارد."
                  emphasized
                />
              </div>

              <DecisionQuestion
                question="اگر پژوهشگر فقط فایل FASTQ داشته باشد، آیا مستقیماً ماتریس بیان آماده دارد؟"
                options={[
                  "بله؛ FASTQ همان ماتریس بیان است.",
                  "خیر؛ FASTQ باید پردازش و کمی‌سازی شود تا داده بیان ساخته شود.",
                ]}
                selected={fastqAnswer}
                correctIndex={1}
                onSelect={setFastqAnswer}
                correctFeedback="دقیقاً. FASTQ داده خام خوانش‌هاست، نه جدول نهایی بیان ژن."
                incorrectFeedback="بین خوانش خام و ماتریس بیان چند مرحله پردازش و کمی‌سازی وجود دارد."
              />

              <DecisionQuestion
                question="کدام داده به‌طور مفهومی برای مقایسه مقدار بیان ژن‌ها بین نمونه‌ها نزدیک‌تر است؟"
                options={[
                  "ماتریس بیان",
                  "فایل FASTQ خام بدون پردازش",
                  "نام دستگاه توالی‌یابی",
                ]}
                selected={matrixAnswer}
                correctIndex={0}
                onSelect={setMatrixAnswer}
                correctFeedback="درست است. تحلیل بیان روی داده کمی‌شده و ساختار مناسب برای مقایسه انجام می‌شود."
                incorrectFeedback="FASTQ ورودی خام است؛ برای تحلیل بیان باید ابتدا اطلاعات خوانش‌ها به مقادیر قابل مقایسه تبدیل شوند."
              />

              <InsightBox>
                <strong>FASTQ ≠ ماتریس بیان.</strong> این تفاوت پایه فهم تمام مسیر RNA-seq است.
              </InsightBox>
            </SceneCard>
          )}

          {scene === 4 && (
            <SceneCard
              eyebrow="توالی‌یابی پایان کار نیست"
              title="دستگاه توالی‌یاب پاسخ زیستی نهایی را تحویل نمی‌دهد."
              description="توالی‌یابی فقط بخشی از زنجیره است. بعد از آن هنوز پردازش، کمی‌سازی، تحلیل آماری و تفسیر زیستی باقی مانده است."
            >
              <DecisionQuestion
                question="کدام جمله دقیق‌تر است؟"
                options={[
                  "بعد از تولید FASTQ، تحلیل RNA-seq عملاً تمام شده است.",
                  "بعد از توالی‌یابی هنوز پردازش، کمی‌سازی، ساخت داده بیان، تحلیل و تفسیر باقی مانده است.",
                  "توالی‌یابی مستقیماً ژن‌های معنی‌دار زیستی را تعیین می‌کند.",
                ]}
                selected={sequencingAnswer}
                correctIndex={1}
                onSelect={setSequencingAnswer}
                correctFeedback="دقیقاً. sequencing یک مرحله تولید داده است، نه پایان تحلیل."
                incorrectFeedback="FASTQ فقط یکی از خروجی‌های اولیه است. تبدیل آن به نتیجه زیستی نیازمند چند مرحله دیگر است."
              />

              <div className="mt-7 rounded-3xl border border-cyan-200 bg-cyan-50 p-6">
                <p className="font-black text-cyan-950">
                  RNA-seq تنها روش ترنسکریپتومیکس نیست
                </p>
                <p className="mt-3 text-sm leading-8 text-cyan-900/80">
                  روش‌هایی مانند Microarray هم برای مطالعه بیان RNA استفاده شده‌اند و در برخی زمینه‌ها همچنان در داده‌های عمومی یا مطالعات قدیمی‌تر دیده می‌شوند. این درس فقط جای RNA-seq را در نقشه مشخص می‌کند.
                </p>
              </div>

              <DecisionQuestion
                question="پس آیا «ترنسکریپتومیکس» مترادف کامل «RNA-seq» است؟"
                options={[
                  "بله، هر مطالعه ترنسکریپتومیکس الزاماً RNA-seq است.",
                  "خیر، RNA-seq یکی از روش‌های مطالعه ترنسکریپتوم است.",
                ]}
                selected={microarrayAnswer}
                correctIndex={1}
                onSelect={setMicroarrayAnswer}
                correctFeedback="درست است. حوزه علمی را نباید با یک فناوری خاص یکی دانست."
                incorrectFeedback="ترنسکریپتومیکس گسترده‌تر از یک فناوری واحد است."
              />
            </SceneCard>
          )}

          {scene === 5 && (
            <SceneCard
              eyebrow="پروژه همراه شما"
              title="داروی X در سلول‌های سرطان پانکراس"
              description="تمام هفت درس Foundations را حالا روی یک مسیر واقعی‌تر به هم وصل می‌کنیم."
            >
              <div className="grid gap-3 md:grid-cols-3">
                <CaseStep
                  number={1}
                  title="سؤال"
                  text="داروی X چه تغییری در الگوی RNA ایجاد می‌کند؟"
                />
                <CaseStep
                  number={2}
                  title="اندازه‌گیری"
                  text="RNA-seq برای اندازه‌گیری RNA در این سؤال انتخاب می‌شود."
                />
                <CaseStep
                  number={3}
                  title="تحلیل"
                  text="از FASTQ به کمی‌سازی، ماتریس بیان و مقایسه آماری می‌رسیم."
                />
              </div>

              <DecisionQuestion
                question="اگر کاربر فایل FASTQ پروژه داروی X را داشته باشد، قدم مفهومی بعدی چیست؟"
                options={[
                  "مستقیماً نتیجه‌گیری زیستی نهایی.",
                  "کنترل کیفیت و پردازش داده برای رسیدن به کمی‌سازی و ماتریس بیان.",
                  "فرض کنیم ژن‌های متفاوت از قبل مشخص‌اند.",
                ]}
                selected={caseAnswer}
                correctIndex={1}
                onSelect={setCaseAnswer}
                correctFeedback="دقیقاً. فایل خام باید وارد مسیر کنترل کیفیت و پردازش شود تا داده قابل تحلیل ساخته شود."
                incorrectFeedback="FASTQ هنوز نتیجه زیستی نیست؛ باید ابتدا کیفیت، پردازش و کمی‌سازی انجام شود."
              />

              <div className="mt-8 border-t border-slate-100 pt-7">
                <p className="font-bold text-slate-950">
                  پروژه شما الان بیشتر در کدام نقطه این مسیر قرار دارد؟
                </p>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {(Object.keys(reflectionLabels) as ProjectReflection[]).map(
                    (item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setReflection(item)}
                        className={[
                          "rounded-2xl border p-4 text-right text-sm font-semibold leading-7 transition",
                          reflection === item
                            ? "border-teal-500 bg-teal-50 text-teal-900"
                            : "border-slate-200 bg-white text-slate-700 hover:border-teal-300",
                        ].join(" ")}
                      >
                        {reflectionLabels[item]}
                      </button>
                    ),
                  )}
                </div>

                {reflection && (
                  <InsightBox>
                    {reflection === "raw-data"
                      ? "در مسیر عمیق RNA-seq، کنترل کیفیت و تبدیل داده خام به مقادیر بیان را مرحله‌به‌مرحله می‌بینید."
                      : reflection === "matrix"
                        ? "اگر ماتریس بیان دارید، احتمالاً وارد بخش‌های نرمال‌سازی، بررسی ساختار نمونه‌ها و تحلیل آماری می‌شوید."
                        : reflection === "analysis"
                          ? "مسیر عمیق RNA-seq دقیقاً برای ساخت همین نقشه تحلیل طراحی شده است."
                          : reflection === "interpretation"
                            ? "در انتهای مسیر RNA-seq دوباره به تفسیر زیستی، محدودیت ادعا و اتصال نتیجه به سؤال پژوهشی برمی‌گردیم."
                            : "اشکالی ندارد. Foundations برای همین ساخته شده بود که قبل از ابزار، نقشه کلی را بسازید."}
                  </InsightBox>
                )}
              </div>
            </SceneCard>
          )}

          {scene === 6 && (
            <SceneCard
              eyebrow="ایستگاه تسلط"
              title="نقشه Foundations کامل شد."
              description="آخرین سؤال می‌سنجد آیا جای RNA-seq، FASTQ، ماتریس بیان و تحلیل را در یک زنجیره واحد می‌بینید."
            >
              <DecisionQuestion
                question="کدام جمله بهترین تصویر از RNA-seq در ترنسکریپتومیکس است؟"
                options={[
                  "RNA-seq همان ترنسکریپتومیکس است و FASTQ همان ماتریس بیان محسوب می‌شود.",
                  "RNA-seq یک روش اندازه‌گیری در ترنسکریپتومیکس است؛ FASTQ داده خام خوانش‌هاست و پس از پردازش و کمی‌سازی می‌توان به ماتریس بیان و سپس تحلیل رسید.",
                  "بعد از توالی‌یابی نیازی به پردازش یا تحلیل آماری نیست.",
                  "هر فایل RNA-seq بدون توجه به سؤال پژوهشی برای هر نوع تحلیل مناسب است.",
                ]}
                selected={masteryAnswer}
                correctIndex={1}
                onSelect={setMasteryAnswer}
                correctFeedback="عالی. شما اکنون جای حوزه، فناوری، فایل خام، ماتریس بیان و تحلیل را از هم تفکیک می‌کنید."
                incorrectFeedback="به چهار مرز برگردید: ترنسکریپتومیکس ≠ RNA-seq، FASTQ ≠ ماتریس بیان، توالی‌یابی ≠ پایان تحلیل، و روش باید با سؤال سازگار باشد."
              />

              <div className="mt-8">
                <p className="font-bold text-slate-950">
                  این نقشه کلی چقدر برایتان روشن است؟
                </p>

                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  <ConfidenceButton
                    active={confidence === "unclear"}
                    title="هنوز مبهم است"
                    description="بعضی مراحل مسیر هنوز برایم قاطی می‌شوند."
                    onClick={() => setConfidence("unclear")}
                  />

                  <ConfidenceButton
                    active={confidence === "developing"}
                    title="تقریباً متوجه شدم"
                    description="مسیر کلی را می‌فهمم ولی جزئیات تحلیل هنوز نیاز به یادگیری دارد."
                    onClick={() => setConfidence("developing")}
                  />

                  <ConfidenceButton
                    active={confidence === "clear"}
                    title="کاملاً روشن است"
                    description="می‌توانم مسیر نمونه تا FASTQ، ماتریس بیان، تحلیل و تفسیر را توضیح بدهم."
                    onClick={() => setConfidence("clear")}
                  />
                </div>
              </div>

              <div className="mt-7 rounded-3xl bg-slate-950 p-6 text-white">
                <p className="text-xs font-bold text-teal-300">
                  لحظه فهم Foundations
                </p>

                <p className="mt-3 text-lg font-bold leading-9">
                  حالا می‌دانم RNA-seq کجای ترنسکریپتومیکس قرار می‌گیرد، داده خام چه تفاوتی با ماتریس بیان دارد و چرا تحلیل از سؤال پژوهشی شروع می‌شود، نه از ابزار.
                </p>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  disabled={!canFinish || saveState === "saving"}
                  onClick={() => void saveMastery()}
                  className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-teal-700 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  {saveState === "saving" ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="size-4" />
                  )}

                  {userId
                    ? "ثبت تسلط درس هفتم"
                    : "پایان درس هفتم در حالت مهمان"}
                </button>

                <button
                  type="button"
                  onClick={restartLesson}
                  className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                >
                  <RotateCcw className="size-4" />
                  مرور دوباره درس هفتم
                </button>
              </div>

              {saveState === "error" && saveError && (
                <p className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm leading-7 text-rose-800">
                  {saveError}
                </p>
              )}

              {saveState === "saved" && savedProgress && (
                <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                  <p className="font-bold text-emerald-900">
                    وضعیت درس هفتم در حساب شما ذخیره شد.
                  </p>

                  <p className="mt-2 text-sm leading-7 text-emerald-800">
                    {savedProgress.status === "needs_review"
                      ? "این درس برای مرور دوباره علامت خورده است."
                      : "درس هفتم با موفقیت تکمیل شده است."}
                  </p>
                </div>
              )}

              {!userId && (
                <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-7 text-amber-900">
                  در حالت مهمان می‌توانید کل درس را استفاده کنید، اما نتیجه نهایی به‌صورت دائمی ذخیره نمی‌شود.
                </div>
              )}

              <div className="mt-8 rounded-3xl border border-teal-200 bg-gradient-to-br from-teal-50 via-white to-cyan-50 p-6">
                <p className="text-xs font-bold text-teal-700">
                  Foundations کامل شد
                </p>

                <h3 className="mt-2 text-2xl font-black text-slate-950">
                  حالا وارد مسیر عمیق RNA-seq توده‌ای شوید
                </h3>

                <p className="mt-3 max-w-3xl text-sm leading-8 text-slate-600">
                  مسیر بعدی از سؤال پژوهشی و طراحی مطالعه شروع می‌شود و تا FASTQ، کنترل کیفیت، کمی‌سازی، ماتریس بیان، نرمال‌سازی، بررسی ساختار نمونه‌ها، تحلیل بیان افتراقی، تحلیل عملکردی و تفسیر زیستی ادامه پیدا می‌کند.
                </p>

                <a
                  href="/learn/rna-seq"
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-teal-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-teal-800"
                >
                  ورود به مسیر RNA-seq توده‌ای
                  <ArrowLeft className="size-4" />
                </a>
              </div>
            </SceneCard>
          )}

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              disabled={scene === 0}
              onClick={goPrevious}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowRight className="size-4" />
              بخش قبل
            </button>

            {scene < sceneTitles.length - 1 && (
              <button
                type="button"
                onClick={goNext}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800"
              >
                بخش بعد
                <ArrowLeft className="size-4" />
              </button>
            )}
          </div>
        </div>
      </section>
    </InteractiveLessonShell>
  );
}

function SceneCard({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <article className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-lg shadow-slate-200/60">
      <div className="border-b border-slate-200 bg-gradient-to-l from-teal-50 via-white to-white p-6 sm:p-8">
        <p className="text-xs font-bold text-teal-700">{eyebrow}</p>
        <h2 className="mt-2 text-2xl font-black leading-10 text-slate-950 sm:text-3xl">
          {title}
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-8 text-slate-600">
          {description}
        </p>
      </div>

      <div className="p-6 sm:p-8">{children}</div>
    </article>
  );
}

function ConceptCard({
  title,
  text,
  emphasized = false,
}: {
  title: string;
  text: string;
  emphasized?: boolean;
}) {
  return (
    <div
      className={[
        "rounded-3xl border p-6",
        emphasized
          ? "border-teal-300 bg-teal-50"
          : "border-slate-200 bg-slate-50",
      ].join(" ")}
    >
      <p className="text-xl font-black text-slate-950">{title}</p>
      <p className="mt-4 text-sm leading-8 text-slate-600">{text}</p>
    </div>
  );
}

function WorkflowCard({
  index,
  title,
  description,
}: {
  index: number;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-700 text-xs font-black text-white">
        {new Intl.NumberFormat("fa-IR").format(index)}
      </span>
      <p className="mt-4 font-black text-slate-950">{title}</p>
      <p className="mt-2 text-xs leading-6 text-slate-500">{description}</p>
    </div>
  );
}

function DataCard({
  icon,
  title,
  description,
  emphasized = false,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  emphasized?: boolean;
}) {
  return (
    <div
      className={[
        "rounded-3xl border p-6",
        emphasized
          ? "border-teal-300 bg-teal-50"
          : "border-slate-200 bg-slate-50",
      ].join(" ")}
    >
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-teal-700">
          {icon}
        </span>
        <p className="text-xl font-black text-slate-950">{title}</p>
      </div>
      <p className="mt-4 text-sm leading-8 text-slate-600">{description}</p>
    </div>
  );
}

function CaseStep({
  number,
  title,
  text,
}: {
  number: number;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-xs font-black text-white">
        {new Intl.NumberFormat("fa-IR").format(number)}
      </span>
      <p className="mt-4 font-black text-slate-950">{title}</p>
      <p className="mt-2 text-sm leading-7 text-slate-600">{text}</p>
    </div>
  );
}

function DecisionQuestion({
  question,
  options,
  selected,
  correctIndex,
  onSelect,
  correctFeedback,
  incorrectFeedback,
}: {
  question: string;
  options: string[];
  selected: number | null;
  correctIndex: number;
  onSelect: (index: number) => void;
  correctFeedback: string;
  incorrectFeedback: string;
}) {
  const answered = selected !== null;
  const correct = selected === correctIndex;

  return (
    <section className="mt-7 rounded-3xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-sm font-black text-white">
          ؟
        </span>

        <p className="font-bold leading-8 text-slate-950">{question}</p>
      </div>

      <div className="mt-5 grid gap-3">
        {options.map((option, index) => {
          const active = selected === index;

          const className = active
            ? index === correctIndex
              ? "border-emerald-500 bg-emerald-50"
              : "border-amber-400 bg-amber-50"
            : "border-slate-200 bg-white hover:border-teal-300";

          return (
            <button
              key={option}
              type="button"
              onClick={() => onSelect(index)}
              className={`rounded-2xl border p-4 text-right text-sm font-medium leading-7 text-slate-700 transition ${className}`}
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
            className={[
              "text-sm font-bold",
              correct ? "text-emerald-900" : "text-amber-950",
            ].join(" ")}
          >
            {correct
              ? "مسیر فکری درست ✓"
              : "بیایید این برداشت را دوباره بررسی کنیم"}
          </p>

          <p className="mt-2 text-sm leading-7 text-slate-700">
            {correct ? correctFeedback : incorrectFeedback}
          </p>
        </div>
      )}
    </section>
  );
}

function InsightBox({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="mt-6 flex items-start gap-3 rounded-2xl border border-teal-200 bg-teal-50 p-5">
      <Lightbulb className="mt-1 size-5 shrink-0 text-teal-700" />
      <p className="text-sm leading-8 text-teal-950">{children}</p>
    </div>
  );
}

function ConfidenceButton({
  active,
  title,
  description,
  onClick,
}: {
  active: boolean;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-2xl border p-4 text-right transition",
        active
          ? "border-teal-500 bg-teal-50 shadow-sm"
          : "border-slate-200 bg-white hover:border-teal-300",
      ].join(" ")}
    >
      <p className="font-bold text-slate-950">{title}</p>
      <p className="mt-2 text-xs leading-6 text-slate-500">{description}</p>
    </button>
  );
}

function SaveIndicator({
  userId,
  state,
  savedProgress,
  error,
}: {
  userId: string | null;
  state: SaveState;
  savedProgress: LearningProgressRow | null;
  error: string;
}) {
  if (!userId) {
    return (
      <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-[11px] font-semibold text-amber-800">
        حالت مهمان
      </span>
    );
  }

  if (state === "loading" || state === "saving") {
    return (
      <span className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-[11px] font-semibold text-cyan-800">
        <Loader2 className="size-3 animate-spin" />
        در حال همگام‌سازی
      </span>
    );
  }

  if (state === "error") {
    return (
      <span
        title={error}
        className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1.5 text-[11px] font-semibold text-rose-800"
      >
        مشکل در همگام‌سازی
      </span>
    );
  }

  if (savedProgress) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[11px] font-semibold text-emerald-800">
        <CheckCircle2 className="size-3" />
        درس هفتم ذخیره شده
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-500">
      <Sparkles className="size-3" />
      آماده یادگیری
    </span>
  );
}
