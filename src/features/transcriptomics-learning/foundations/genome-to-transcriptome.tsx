import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
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

type CellType = "neuron" | "liver";

type ProjectReflection =
  | "condition"
  | "treatment"
  | "tissue"
  | "time"
  | "none";

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
const NODE_ID = "f1-genome-transcriptome";

const sceneTitles = [
  "کشف مسئله",
  "مدل ذهنی",
  "آزمایشگاه بیان ژن",
  "تغییر شرایط",
  "کلینیک اشتباه",
  "مطالعه موردی",
  "تسلط",
];

const expressionProfiles = {
  neuron: {
    title: "نورون",
    values: [
      { gene: "ژن الف", value: 88 },
      { gene: "ژن ب", value: 22 },
      { gene: "ژن ج", value: 67 },
      { gene: "ژن د", value: 16 },
      { gene: "ژن هـ", value: 54 },
    ],
  },
  liver: {
    title: "سلول کبدی",
    values: [
      { gene: "ژن الف", value: 24 },
      { gene: "ژن ب", value: 82 },
      { gene: "ژن ج", value: 18 },
      { gene: "ژن د", value: 90 },
      { gene: "ژن هـ", value: 38 },
    ],
  },
};

const reflectionLabels: Record<ProjectReflection, string> = {
  condition: "مقایسه دو وضعیت زیستی یا بیماری",
  treatment: "بررسی اثر یک تیمار",
  tissue: "مقایسه بافت‌ها یا انواع سلول",
  time: "بررسی تغییر در طول زمان",
  none: "هنوز پروژه مشخصی ندارم",
};

export function GenomeToTranscriptomeLesson() {
  const { session } = useAuth();
  const userId = session?.user?.id ?? null;

  const [scene, setScene] = useState(0);
  const [openingAnswer, setOpeningAnswer] = useState<number | null>(null);
  const [genePresenceAnswer, setGenePresenceAnswer] = useState<number | null>(null);
  const [selectedCell, setSelectedCell] = useState<CellType>("neuron");
  const [drugApplied, setDrugApplied] = useState(false);
  const [drugAnswer, setDrugAnswer] = useState<number | null>(null);
  const [mistakeAnswer, setMistakeAnswer] = useState<number | null>(null);
  const [caseAnswer, setCaseAnswer] = useState<number | null>(null);
  const [reflection, setReflection] = useState<ProjectReflection | null>(null);
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
        console.error("Failed to load lesson progress:", error);
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

  const canFinish = masteryAnswer !== null && Boolean(confidence);
  const profile = expressionProfiles[selectedCell];

  const displayedGenes = useMemo(() => {
    if (!drugApplied) {
      return profile.values;
    }

    return profile.values.map((item, index) => {
      const adjustments = [16, 0, -24, 12, -8];

      return {
        ...item,
        value: Math.max(
          4,
          Math.min(100, item.value + adjustments[index]),
        ),
      };
    });
  }, [drugApplied, profile.values]);

  function goToScene(nextScene: number) {
    setScene(nextScene);

    window.setTimeout(() => {
      document.getElementById("f1-scene")?.scrollIntoView({
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
      console.error("Failed to save lesson progress:", error);
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
    setGenePresenceAnswer(null);
    setSelectedCell("neuron");
    setDrugApplied(false);
    setDrugAnswer(null);
    setMistakeAnswer(null);
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
      foundationIndex={1}
      total={7}
      title="از ژنوم تا ترنسکریپتوم"
      subtitle="این درس با تعریف شروع نمی‌شود. ابتدا یک مسئله زیستی را کشف می‌کنید و بعد با چند تعامل ساده می‌بینید چرا داشتن یک ژن با بیان آن ژن یک چیز نیست."
      currentScene={scene}
      sceneCount={sceneTitles.length}
      sceneLabel={sceneTitles[scene]}
    >
      <section id="f1-scene" className="scroll-mt-6">
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
              eyebrow="شروع با یک سؤال"
              title="اگر ژنوم تقریباً یکسان است، چرا سلول‌ها این‌قدر متفاوت‌اند؟"
              description="به‌جای حفظ تعریف ترنسکریپتوم، ابتدا مسئله‌ای را می‌بینیم که اصلاً ما را به ترنسکریپتومیکس می‌رساند."
            >
              <div className="grid gap-4 md:grid-cols-3">
                <CellIdentityCard
                  title="نورون"
                  role="انتقال پیام عصبی"
                />

                <CellIdentityCard
                  title="سلول کبدی"
                  role="متابولیسم و پردازش مواد"
                />

                <CellIdentityCard
                  title="سلول عضلانی"
                  role="انقباض و تولید نیرو"
                />
              </div>

              <DecisionQuestion
                question="اگر بسیاری از سلول‌های بدن یک فرد ژنوم بسیار مشابهی دارند، کدام توضیح برای تفاوت عملکرد آن‌ها مناسب‌تر است؟"
                options={[
                  "DNA هر نوع سلول کاملاً متفاوت است.",
                  "ژن‌های متفاوتی می‌توانند در هر نوع سلول فعال‌تر یا کم‌فعال‌تر باشند.",
                  "هر نوع سلول الزاماً تعداد متفاوتی کروموزوم دارد.",
                ]}
                selected={openingAnswer}
                correctIndex={1}
                onSelect={setOpeningAnswer}
                correctFeedback="دقیقاً. تفاوت مهم فقط در این نیست که چه ژن‌هایی وجود دارند؛ الگوی استفاده از اطلاعات ژنتیکی هم متفاوت است."
                incorrectFeedback="این توضیح نمی‌تواند تفاوت گسترده عملکرد سلول‌ها را به‌خوبی توضیح دهد. دوباره به این فکر کنید که یک ژن می‌تواند وجود داشته باشد اما در یک سلول بسیار کمتر بیان شود."
              />

              {openingAnswer === 1 && (
                <InsightBox>
                  اولین ایده کلیدی همین‌جاست:
                  <strong>
                    {" "}
                    داشتن ژنوم مشابه به معنی داشتن الگوی RNA مشابه نیست.
                  </strong>
                </InsightBox>
              )}
            </SceneCard>
          )}

          {scene === 1 && (
            <SceneCard
              eyebrow="مدل ذهنی"
              title="ژنوم ظرفیت را نشان می‌دهد؛ ترنسکریپتوم وضعیت فعلی را."
              description="این یک مدل ذهنی ساده است. در درس‌های بعد محدودیت‌ها و جزئیات آن را دقیق‌تر می‌کنیم."
            >
              <div className="grid gap-4 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
                <ConceptPanel
                  label="ژنوم"
                  text="مجموعه اطلاعات ژنتیکی موجود در DNA یک سلول."
                  footer="چه اطلاعات ژنتیکی در اختیار سیستم هستند؟"
                />

                <div className="hidden text-center text-3xl text-teal-600 lg:block">
                  ←
                </div>

                <ConceptPanel
                  label="ترنسکریپتوم"
                  text="مجموعه RNA‌هایی که در یک سلول، بافت یا نمونه و در یک زمان یا شرایط مشخص قابل مشاهده‌اند."
                  footer="در این شرایط، چه الگوهایی در سطح RNA دیده می‌شوند؟"
                />
              </div>

              <div className="mt-6 rounded-3xl border border-cyan-200 bg-cyan-50 p-5">
                <p className="text-xs font-bold text-cyan-900">
                  عبارت کلیدی
                </p>

                <p className="mt-2 text-lg font-black leading-9 text-cyan-950">
                  در یک زمان و شرایط مشخص
                </p>

                <p className="mt-2 text-sm leading-7 text-cyan-900/80">
                  همین عبارت بعداً پایه فهم تیمار، بیماری، مطالعه زمانی و تحلیل بیان افتراقی خواهد شد.
                </p>
              </div>

              <DecisionQuestion
                question="اگر ژن X در DNA دو سلول وجود داشته باشد، آیا مقدار RNA مربوط به آن حتماً در هر دو سلول یکسان است؟"
                options={[
                  "بله، چون ژن X در ژنوم هر دو سلول وجود دارد.",
                  "خیر، وجود ژن و میزان بیان آن دو مفهوم متفاوت‌اند.",
                ]}
                selected={genePresenceAnswer}
                correctIndex={1}
                onSelect={setGenePresenceAnswer}
                correctFeedback="درست است. وجود یک ژن با بیان بالای آن ژن یک چیز نیست."
                incorrectFeedback="وجود یک ژن در DNA فقط به معنی وجود آن اطلاعات ژنتیکی است؛ مقدار RNA آن می‌تواند بین سلول‌ها و شرایط متفاوت باشد."
              />
            </SceneCard>
          )}

          {scene === 2 && (
            <SceneCard
              eyebrow="آزمایشگاه تعاملی"
              title="یک ژنوم مشابه، چند الگوی بیان متفاوت"
              description="نوع سلول را عوض کنید و فقط به الگوی نسبی میله‌ها نگاه کنید. هدف این آزمایشگاه فهم مفهوم است، نه تحلیل داده واقعی."
            >
              <div className="flex flex-wrap gap-2">
                {(["neuron", "liver"] as CellType[]).map((cell) => (
                  <button
                    key={cell}
                    type="button"
                    onClick={() => setSelectedCell(cell)}
                    className={[
                      "rounded-xl border px-4 py-2 text-sm font-bold transition",
                      selectedCell === cell
                        ? "border-teal-600 bg-teal-600 text-white"
                        : "border-slate-200 bg-white text-slate-600 hover:border-teal-300",
                    ].join(" ")}
                  >
                    {expressionProfiles[cell].title}
                  </button>
                ))}
              </div>

              <div className="mt-5 rounded-3xl border border-slate-200 bg-slate-950 p-5 text-white sm:p-6">
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold">
                      {profile.title}
                    </p>
                  </div>

                  <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] text-slate-300">
                    الگوی بیان
                  </span>
                </div>

                <div className="mt-6 space-y-4">
                  {displayedGenes.map((item) => (
                    <ExpressionBar
                      key={item.gene}
                      gene={item.gene}
                      value={item.value}
                    />
                  ))}
                </div>
              </div>

              <InsightBox>
                ژنوم را عوض نکردیم؛ فقط نوع سلول را عوض کردیم و
                <strong> الگوی بیان ژن‌ها تغییر کرد.</strong>
              </InsightBox>

              <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
                <p className="text-sm font-bold text-slate-950">
                  یک لایه عمیق‌تر
                </p>

                <p className="mt-2 text-sm leading-8 text-slate-600">
                  وقتی می‌گوییم یک ژن «بیان» می‌شود، منظورمان این نیست که ژن تازه ایجاد شده است. ژن از قبل در DNA وجود دارد. تولید RNA از روی DNA یکی از مراحل مهم بیان ژن است.
                </p>

                <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-sm font-bold">
                  <span className="rounded-xl bg-slate-100 px-4 py-2">
                    DNA
                  </span>
                  <span>←</span>
                  <span className="rounded-xl bg-cyan-100 px-4 py-2 text-cyan-900">
                    رونویسی
                  </span>
                  <span>←</span>
                  <span className="rounded-xl bg-teal-100 px-4 py-2 text-teal-900">
                    RNA
                  </span>
                </div>
              </div>
            </SceneCard>
          )}

          {scene === 3 && (
            <SceneCard
              eyebrow="اگر شرایط عوض شود"
              title="با تغییر شرایط، ترنسکریپتوم هم می‌تواند تغییر کند."
              description="همان نوع سلول را نگه می‌داریم و فقط یک تیمار فرضی اضافه می‌کنیم."
            >
              <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="font-bold text-slate-950">
                      وضعیت آزمایش
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      نورون — همان نوع سلول
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setDrugApplied((previous) => !previous)}
                    className={[
                      "rounded-xl px-4 py-2 text-sm font-bold transition",
                      drugApplied
                        ? "bg-teal-700 text-white"
                        : "border border-slate-200 bg-white text-slate-700",
                    ].join(" ")}
                  >
                    {drugApplied
                      ? "داروی X اعمال شده"
                      : "اعمال داروی X"}
                  </button>
                </div>

                <div className="mt-5 space-y-4">
                  {displayedGenes.map((item) => (
                    <ExpressionBar
                      key={item.gene}
                      gene={item.gene}
                      value={item.value}
                      light
                    />
                  ))}
                </div>
              </div>

              <DecisionQuestion
                question="آیا برای تغییر ترنسکریپتوم حتماً باید نوع سلول عوض شود؟"
                options={[
                  "بله؛ ترنسکریپتوم فقط با تغییر نوع سلول عوض می‌شود.",
                  "خیر؛ تیمار، بیماری، محیط یا زمان هم می‌توانند الگوی RNA را تغییر دهند.",
                ]}
                selected={drugAnswer}
                correctIndex={1}
                onSelect={setDrugAnswer}
                correctFeedback="دقیقاً. ترنسکریپتوم یک تصویر وابسته به وضعیت است."
                incorrectFeedback="نوع سلول مهم است، اما شرایط زیستی و آزمایشی نیز می‌توانند الگوی بیان را تغییر دهند."
              />

              {drugApplied && (
                <div className="mt-5 grid gap-3 sm:grid-cols-4">
                  {["تیمار", "بیماری", "محیط", "زمان"].map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-teal-100 bg-teal-50 p-4 text-center text-xs font-bold text-teal-800"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              )}
            </SceneCard>
          )}

          {scene === 4 && (
            <SceneCard
              eyebrow="کلینیک اشتباه"
              title="«ترنسکریپتوم یعنی فهرست همه ژن‌های ژنوم.»"
              description="یک برداشت رایج را با هم بررسی کنیم."
            >
              <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6">
                <p className="text-sm font-bold text-amber-950">
                  یک دانشجو می‌گوید:
                </p>

                <p className="mt-3 text-lg font-black leading-9 text-amber-950">
                  «ترنسکریپتوم یعنی فهرست تمام ژن‌هایی که در ژنوم وجود دارند.»
                </p>
              </div>

              <DecisionQuestion
                question="مشکل اصلی این جمله چیست؟"
                options={[
                  "هیچ مشکلی ندارد؛ ژنوم و ترنسکریپتوم یک مفهوم‌اند.",
                  "ترنسکریپتوم به RNA‌های مشاهده‌شده در یک وضعیت مشخص مربوط است، نه صرفاً فهرست ژن‌های DNA.",
                  "ترنسکریپتوم فقط نام دیگری برای تعداد کروموزوم‌هاست.",
                ]}
                selected={mistakeAnswer}
                correctIndex={1}
                onSelect={setMistakeAnswer}
                correctFeedback="درست است. ژنوم درباره اطلاعات ژنتیکی موجود است؛ ترنسکریپتوم درباره وضعیت RNA در یک زمینه مشخص."
                incorrectFeedback="دوباره تفاوت «وجود اطلاعات در DNA» و «مشاهده RNA در یک وضعیت» را مرور کنید."
              />

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <ConceptPanel
                  label="وجود ژن"
                  text="این اطلاعات ژنتیکی در DNA وجود دارد."
                  footer="گزاره در سطح ژنوم"
                />

                <ConceptPanel
                  label="بیان ژن"
                  text="RNA مربوط به آن ژن در وضعیت مورد بررسی قابل مشاهده است."
                  footer="گزاره در سطح ترنسکریپتوم"
                />
              </div>
            </SceneCard>
          )}

          {scene === 5 && (
            <SceneCard
              eyebrow="مطالعه موردی"
              title="پروژه همراه شما: داروی X در سلول‌های سرطان پانکراس"
              description="از اینجا این پروژه در مبانی و بعداً در مسیر RNA-seq همراه ما خواهد بود."
            >
              <div className="grid gap-4 md:grid-cols-2">
                <ConditionCard
                  title="گروه کنترل"
                  description="سلول‌های سرطان پانکراس بدون دریافت داروی X"
                />

                <ConditionCard
                  title="داروی X"
                  description="همان مدل زیستی پس از دریافت تیمار"
                  emphasized
                />
              </div>

              <DecisionQuestion
                question="اگر ژنوم سلول‌ها تفاوت عمده‌ای نداشته باشد، بعد از تیمار چه چیزی می‌تواند تغییر کند و برای سؤال ما مهم باشد؟"
                options={[
                  "ترنسکریپتوم و الگوی RNA‌ها",
                  "وجود تمام ژن‌ها در DNA باید حذف و دوباره ساخته شود.",
                  "تعداد کروموزوم‌ها الزاماً تغییر می‌کند.",
                ]}
                selected={caseAnswer}
                correctIndex={0}
                onSelect={setCaseAnswer}
                correctFeedback="دقیقاً. این همان جایی است که ترنسکریپتومیکس به یک سؤال زیستی واقعی متصل می‌شود."
                incorrectFeedback="تیمار می‌تواند وضعیت RNA را تغییر دهد بدون اینکه لازم باشد ژنوم به‌طور عمده عوض شود."
              />

              <div className="mt-6 rounded-3xl border border-teal-200 bg-gradient-to-br from-teal-50 via-white to-cyan-50 p-6">
                <div className="flex items-start gap-3">
                  <FlaskConical className="mt-1 size-5 shrink-0 text-teal-700" />

                  <div>
                    <p className="text-sm font-bold text-teal-900">
                      هنوز سراغ ابزار نرفته‌ایم
                    </p>

                    <p className="mt-2 text-sm leading-8 text-slate-600">
                      فعلاً فقط فهمیده‌ایم سؤال ما درباره تغییرات ترنسکریپتوم است. در درس‌های بعد تصمیم می‌گیریم چه نوع ترنسکریپتومیکس و چه روش اندازه‌گیری برای سؤال مناسب‌تر است.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 border-t border-slate-100 pt-7">
                <p className="font-bold text-slate-950">
                  این مفهوم به پژوهش شما چطور وصل می‌شود؟
                </p>

                <p className="mt-2 text-sm leading-7 text-slate-500">
                  این پاسخ فعلاً فقط در همین صفحه نگه داشته می‌شود.
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
                    {reflection === "none"
                      ? "اشکالی ندارد. فعلاً هدف شما ساختن مدل ذهنی ترنسکریپتومیکس است."
                      : "این نوع سؤال می‌تواند با تغییرات ترنسکریپتوم ارتباط داشته باشد؛ در درس پنجم یاد می‌گیریم دقیق‌تر تشخیص دهیم چه زمانی ترنسکریپتومیکس واقعاً انتخاب مناسبی است."}
                  </InsightBox>
                )}
              </div>
            </SceneCard>
          )}

          {scene === 6 && (
            <SceneCard
              eyebrow="ایستگاه تسلط"
              title="حالا ببینیم مدل ذهنی اصلی شکل گرفته یا نه."
              description="این آزمون رسمی نیست. فقط قرار است مشخص کند آیا مفهوم اصلی درس اول برایتان روشن شده است."
            >
              <DecisionQuestion
                question="دو نمونه از یک نوع سلول، یکی قبل و دیگری بعد از تیمار گرفته شده‌اند. ژنوم آن‌ها تفاوت عمده‌ای ندارد، اما مقدار RNA بسیاری از ژن‌ها متفاوت است. کدام توضیح مناسب‌تر است؟"
                options={[
                  "ژنوم جدیدی ایجاد شده است.",
                  "ترنسکریپتوم در پاسخ به شرایط تغییر کرده است.",
                  "ژن‌هایی که RNA کمتری دارند از DNA حذف شده‌اند.",
                  "تعداد کروموزوم‌ها الزاماً تغییر کرده است.",
                ]}
                selected={masteryAnswer}
                correctIndex={1}
                onSelect={setMasteryAnswer}
                correctFeedback="عالی. این دقیقاً مفهوم اصلی درس اول است: ژنوم و ترنسکریپتوم یک چیز نیستند و ترنسکریپتوم می‌تواند وابسته به شرایط تغییر کند."
                incorrectFeedback="مفهوم اصلی درس اول را دوباره مرور کنید: تغییر RNA الزاماً به معنی تغییر عمده ژنوم نیست."
              />

              <div className="mt-8">
                <p className="font-bold text-slate-950">
                  این مفهوم چقدر برایتان روشن است؟
                </p>

                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  <ConfidenceButton
                    active={confidence === "unclear"}
                    title="هنوز مبهم است"
                    description="بهتر است یک بار دیگر این درس را مرور کنم."
                    onClick={() => setConfidence("unclear")}
                  />

                  <ConfidenceButton
                    active={confidence === "developing"}
                    title="تقریباً متوجه شدم"
                    description="مدل اصلی را گرفته‌ام ولی هنوز جای تمرین دارد."
                    onClick={() => setConfidence("developing")}
                  />

                  <ConfidenceButton
                    active={confidence === "clear"}
                    title="کاملاً روشن است"
                    description="می‌توانم تفاوت ژنوم و ترنسکریپتوم را توضیح بدهم."
                    onClick={() => setConfidence("clear")}
                  />
                </div>
              </div>

              <div className="mt-7 rounded-3xl bg-slate-950 p-6 text-white">
                <p className="text-xs font-bold text-teal-300">
                  لحظه فهم این درس
                </p>

                <p className="mt-3 text-lg font-bold leading-9">
                  ژنوم بیشتر می‌گوید چه اطلاعات ژنتیکی وجود دارد؛ ترنسکریپتوم نشان می‌دهد در یک وضعیت مشخص چه الگوهایی در سطح RNA مشاهده می‌شوند.
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
                    ? "ثبت تسلط درس اول"
                    : "پایان درس اول در حالت مهمان"}
                </button>

                <button
                  type="button"
                  onClick={restartLesson}
                  className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                >
                  <RotateCcw className="size-4" />
                  مرور دوباره درس اول
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
                    وضعیت درس اول در حساب شما ذخیره شد.
                  </p>

                  <p className="mt-2 text-sm leading-7 text-emerald-800">
                    {savedProgress.status === "needs_review"
                      ? "این درس برای مرور دوباره علامت خورده است."
                      : "درس اول با موفقیت تکمیل شده است."}
                  </p>
                </div>
              )}

              {!userId && (
                <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-7 text-amber-900">
                  در حالت مهمان می‌توانید کل درس را استفاده کنید، اما نتیجه نهایی به‌صورت دائمی ذخیره نمی‌شود.
                </div>
              )}

              <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <p className="text-xs font-bold text-teal-700">
                  مرحله بعد
                </p>

                <h3 className="mt-2 text-xl font-black text-slate-950">
                  درس ۲ — بیان ژن یعنی چه؟
                </h3>

                <p className="mt-2 text-sm leading-7 text-slate-600">
                  در درس دوم از مدل ذهنی ژنوم و ترنسکریپتوم وارد مفهوم سطح بیان، تغییر بیان و تفاوت «وجود ژن» با «میزان بیان» می‌شویم.
                </p>

                <a
                  href="/learn/transcriptomics/foundations/gene-expression"
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-teal-800"
                >
                  ورود به درس دوم
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
        <p className="text-xs font-bold text-teal-700">
          {eyebrow}
        </p>

        <h2 className="mt-2 text-2xl font-black leading-10 text-slate-950 sm:text-3xl">
          {title}
        </h2>

        <p className="mt-3 max-w-3xl text-sm leading-8 text-slate-600">
          {description}
        </p>
      </div>

      <div className="p-6 sm:p-8">
        {children}
      </div>
    </article>
  );
}

function CellIdentityCard({
  title,
  role,
}: {
  title: string;
  role: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
      <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-cyan-100 to-teal-100 shadow-sm">
        <span className="h-6 w-6 rounded-full bg-teal-600/70" />
      </div>

      <p className="mt-4 font-black text-slate-950">
        {title}
      </p>

      <p className="mt-3 text-xs leading-6 text-slate-500">
        {role}
      </p>
    </div>
  );
}

function ConceptPanel({
  label,
  text,
  footer,
}: {
  label: string;
  text: string;
  footer: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
      <p className="text-xl font-black text-slate-950">
        {label}
      </p>

      <p className="mt-4 text-sm leading-8 text-slate-600">
        {text}
      </p>

      <p className="mt-5 rounded-xl bg-white px-3 py-2 text-xs font-semibold text-slate-500">
        {footer}
      </p>
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

        <p className="font-bold leading-8 text-slate-950">
          {question}
        </p>
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
              correct
                ? "text-emerald-900"
                : "text-amber-950",
            ].join(" ")}
          >
            {correct
              ? "مسیر فکری درست ✓"
              : "بیایید پیامد این برداشت را بررسی کنیم"}
          </p>

          <p className="mt-2 text-sm leading-7 text-slate-700">
            {correct ? correctFeedback : incorrectFeedback}
          </p>
        </div>
      )}
    </section>
  );
}

function ExpressionBar({
  gene,
  value,
  light = false,
}: {
  gene: string;
  value: number;
  light?: boolean;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-3 text-xs">
        <span
          className={
            light
              ? "font-semibold text-slate-700"
              : "font-semibold text-slate-300"
          }
        >
          {gene}
        </span>

        <span
          className={
            light
              ? "text-slate-400"
              : "text-slate-500"
          }
        >
          {new Intl.NumberFormat("fa-IR").format(value)}
        </span>
      </div>

      <div
        className={[
          "h-3 overflow-hidden rounded-full",
          light ? "bg-slate-100" : "bg-white/10",
        ].join(" ")}
      >
        <div
          className={[
            "h-full rounded-full transition-all duration-500",
            light ? "bg-teal-600" : "bg-teal-400",
          ].join(" ")}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
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

      <p className="text-sm leading-8 text-teal-950">
        {children}
      </p>
    </div>
  );
}

function ConditionCard({
  title,
  description,
  emphasized = false,
}: {
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
        <span
          className={[
            "flex h-10 w-10 items-center justify-center rounded-xl",
            emphasized
              ? "bg-teal-700 text-white"
              : "bg-white text-slate-600",
          ].join(" ")}
        >
          <FlaskConical className="size-5" />
        </span>

        <p className="font-black">
          {title}
        </p>
      </div>

      <p className="mt-4 text-sm leading-7 text-slate-600">
        {description}
      </p>
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
      <p className="font-bold text-slate-950">
        {title}
      </p>

      <p className="mt-2 text-xs leading-6 text-slate-500">
        {description}
      </p>
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
        درس اول ذخیره شده
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
