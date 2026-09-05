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
  SlidersHorizontal,
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

type ChangeLabel = "up" | "down" | "stable";

type ProjectReflection =
  | "treatment"
  | "disease"
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
const NODE_ID = "f2-gene-expression";

const sceneTitles = [
  "کشف مفهوم",
  "آزمایشگاه سطح بیان",
  "تغییر شرایط",
  "افزایش یا کاهش؟",
  "یک لایه عمیق‌تر",
  "کلینیک اشتباه",
  "تسلط",
];

const reflectionLabels: Record<ProjectReflection, string> = {
  treatment: "بررسی اثر یک تیمار",
  disease: "مقایسه بیماری و وضعیت سالم",
  tissue: "مقایسه بافت‌ها یا انواع سلول",
  time: "بررسی تغییر در طول زمان",
  none: "هنوز پروژه مشخصی ندارم",
};

const classificationCases = [
  {
    gene: "ژن الف",
    control: 28,
    treated: 74,
    correct: "up" as ChangeLabel,
  },
  {
    gene: "ژن ب",
    control: 71,
    treated: 34,
    correct: "down" as ChangeLabel,
  },
  {
    gene: "ژن ج",
    control: 52,
    treated: 55,
    correct: "stable" as ChangeLabel,
  },
];

const changeLabels: Record<ChangeLabel, string> = {
  up: "افزایش بیان",
  down: "کاهش بیان",
  stable: "تغییر چشمگیر ندارد",
};

export function GeneExpressionLesson() {
  const { session } = useAuth();
  const userId = session?.user?.id ?? null;

  const [scene, setScene] = useState(0);
  const [openingAnswer, setOpeningAnswer] = useState<number | null>(null);

  const [geneA, setGeneA] = useState(78);
  const [geneB, setGeneB] = useState(34);
  const [geneC, setGeneC] = useState(12);

  const [drugApplied, setDrugApplied] = useState(false);
  const [conditionAnswer, setConditionAnswer] = useState<number | null>(null);

  const [classifications, setClassifications] = useState<
    Record<string, ChangeLabel | null>
  >({
    "ژن الف": null,
    "ژن ب": null,
    "ژن ج": null,
  });

  const [production, setProduction] = useState(65);
  const [degradation, setDegradation] = useState(35);
  const [deepAnswer, setDeepAnswer] = useState<number | null>(null);
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
        console.error("Failed to load F2 progress:", error);
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

  const treatedProfile = useMemo(
    () => [
      { gene: "ژن الف", control: 34, treated: drugApplied ? 76 : 34 },
      { gene: "ژن ب", control: 68, treated: drugApplied ? 41 : 68 },
      { gene: "ژن ج", control: 49, treated: drugApplied ? 52 : 49 },
    ],
    [drugApplied],
  );

  const conceptualRnaLevel = useMemo(() => {
    const score = production - degradation + 50;
    return Math.max(5, Math.min(95, score));
  }, [production, degradation]);

  const classificationScore = classificationCases.filter(
    (item) => classifications[item.gene] === item.correct,
  ).length;

  function goToScene(nextScene: number) {
    setScene(nextScene);

    window.setTimeout(() => {
      document.getElementById("f2-scene")?.scrollIntoView({
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
      console.error("Failed to save F2 progress:", error);
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
    setGeneA(78);
    setGeneB(34);
    setGeneC(12);
    setDrugApplied(false);
    setConditionAnswer(null);
    setClassifications({
      "ژن الف": null,
      "ژن ب": null,
      "ژن ج": null,
    });
    setProduction(65);
    setDegradation(35);
    setDeepAnswer(null);
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
      foundationIndex={2}
      total={7}
      title="بیان ژن یعنی چه؟"
      subtitle="وجود یک ژن در DNA فقط می‌گوید آن اطلاعات ژنتیکی وجود دارد. در این درس با دست خودتان می‌بینید که مقدار RNA مربوط به یک ژن می‌تواند بین سلول‌ها و شرایط مختلف تغییر کند."
      currentScene={scene}
      sceneCount={sceneTitles.length}
      sceneLabel={sceneTitles[scene] ?? ""}
    >
      <section id="f2-scene" className="scroll-mt-6">
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
              eyebrow="شروع با یک تفاوت مهم"
              title="یک ژن می‌تواند در DNA وجود داشته باشد، اما میزان RNA آن در همه سلول‌ها یکسان نباشد."
              description="درس قبل فهمیدیم ژنوم و ترنسکریپتوم یک چیز نیستند. حالا یک قدم جلوتر می‌رویم: بیان ژن فقط مسئله «وجود یا نبود ژن» نیست."
            >
              <div className="grid gap-4 md:grid-cols-3">
                <MiniGeneCard
                  title="ژن الف"
                  level={82}
                  note="RNA نسبتاً بیشتر"
                />
                <MiniGeneCard
                  title="ژن ب"
                  level={43}
                  note="RNA در سطح میانی"
                />
                <MiniGeneCard
                  title="ژن ج"
                  level={14}
                  note="RNA نسبتاً کمتر"
                />
              </div>

              <DecisionQuestion
                question="اگر هر سه ژن در DNA این سلول وجود داشته باشند، این تفاوت میله‌ها چه چیزی را نشان می‌دهد؟"
                options={[
                  "بعضی ژن‌ها از DNA حذف شده‌اند.",
                  "مقدار RNA مربوط به ژن‌ها می‌تواند متفاوت باشد.",
                  "ژن با RNA کمتر الزاماً جهش‌یافته است.",
                ]}
                selected={openingAnswer}
                correctIndex={1}
                onSelect={setOpeningAnswer}
                correctFeedback="دقیقاً. وجود ژن و سطح RNA مربوط به آن دو مفهوم متفاوت‌اند."
                incorrectFeedback="وجود ژن در DNA به‌تنهایی مقدار RNA آن را تعیین نمی‌کند. دوباره به تفاوت ارتفاع میله‌ها نگاه کنید."
              />

              <InsightBox>
                <strong>وجود ژن ≠ میزان بیان آن ژن.</strong>{" "}
                در ترنسکریپتومیکس معمولاً به الگوهای RNA نگاه می‌کنیم تا تفاوت وضعیت‌ها را بررسی کنیم.
              </InsightBox>
            </SceneCard>
          )}

          {scene === 1 && (
            <SceneCard
              eyebrow="آزمایشگاه تعاملی سطح بیان"
              title="خودتان یک الگوی بیان بسازید."
              description="اسلایدرها یک شبیه‌ساز مفهومی هستند و واحد واقعی آزمایشگاهی ندارند. هدف این است که ببینید «بیان» یک طیف است، نه فقط روشن یا خاموش."
            >
              <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
                <div className="space-y-4">
                  <ExpressionSlider
                    label="ژن الف"
                    value={geneA}
                    onChange={setGeneA}
                  />
                  <ExpressionSlider
                    label="ژن ب"
                    value={geneB}
                    onChange={setGeneB}
                  />
                  <ExpressionSlider
                    label="ژن ج"
                    value={geneC}
                    onChange={setGeneC}
                  />
                </div>

                <div className="rounded-3xl bg-slate-950 p-6 text-white">
                  <div className="flex items-center gap-3">
                    <SlidersHorizontal className="size-5 text-teal-300" />
                    <div>
                      <p className="font-bold">الگوی بیان ساخته‌شده</p>
                      <p className="mt-1 text-xs text-slate-400">
                        نمایش مفهومی مقدار نسبی RNA
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 space-y-5">
                    <ExpressionBar label="ژن الف" value={geneA} />
                    <ExpressionBar label="ژن ب" value={geneB} />
                    <ExpressionBar label="ژن ج" value={geneC} />
                  </div>
                </div>
              </div>

              <InsightBox>
                هر سه ژن می‌توانند در ژنوم حاضر باشند، اما سهم آن‌ها در الگوی RNA یکسان نیست. این همان چیزی است که به ما کمک می‌کند درباره <strong>الگوی بیان</strong> صحبت کنیم.
              </InsightBox>

              <div className="mt-6 rounded-2xl border border-cyan-200 bg-cyan-50 p-5">
                <p className="font-bold text-cyan-950">
                  یک دقت علمی مهم
                </p>
                <p className="mt-2 text-sm leading-8 text-cyan-900/80">
                  در این درس برای ساخت مدل ذهنی از «مقدار RNA» استفاده می‌کنیم. در RNA-seq بعداً دقیق‌تر می‌بینیم کمّی‌سازی بیان چگونه انجام می‌شود و چرا انواع مقادیر قابل جایگزینی با یکدیگر نیستند.
                </p>
              </div>
            </SceneCard>
          )}

          {scene === 2 && (
            <SceneCard
              eyebrow="تغییر شرایط"
              title="همان سلول، ژنوم مشابه؛ اما الگوی بیان می‌تواند بعد از تیمار تغییر کند."
              description="پروژه همراه ما همان مدل سرطان پانکراس است. با یک کلیک داروی X را اعمال کنید."
            >
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-5">
                <div>
                  <p className="font-black text-slate-950">
                    سلول‌های سرطان پانکراس
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    مقایسه گروه کنترل با داروی X
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setDrugApplied((previous) => !previous)}
                  className={[
                    "rounded-xl px-5 py-2.5 text-sm font-bold transition",
                    drugApplied
                      ? "bg-teal-700 text-white"
                      : "border border-slate-200 bg-white text-slate-700 hover:border-teal-300",
                  ].join(" ")}
                >
                  {drugApplied ? "داروی X اعمال شده" : "اعمال داروی X"}
                </button>
              </div>

              <div className="mt-5 rounded-3xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
                <div className="space-y-5">
                  {treatedProfile.map((item) => (
                    <ComparisonBar
                      key={item.gene}
                      gene={item.gene}
                      control={item.control}
                      treated={item.treated}
                    />
                  ))}
                </div>
              </div>

              <DecisionQuestion
                question="وقتی بعد از اعمال داروی X مقدار RNA بعضی ژن‌ها بیشتر و بعضی کمتر می‌شود، مناسب‌ترین برداشت چیست؟"
                options={[
                  "دارو الزاماً ژن‌ها را از DNA حذف یا به آن اضافه کرده است.",
                  "شرایط جدید می‌تواند الگوی بیان ژن‌ها را تغییر دهد.",
                  "هر تغییری در RNA حتماً به معنی تغییر تعداد کروموزوم‌هاست.",
                ]}
                selected={conditionAnswer}
                correctIndex={1}
                onSelect={setConditionAnswer}
                correctFeedback="درست است. یکی از سؤال‌های مهم ترنسکریپتومیکس همین مقایسه الگوهای RNA بین شرایط است."
                incorrectFeedback="برای تغییر سطح RNA لازم نیست ژن از DNA حذف یا به آن اضافه شود. وضعیت زیستی می‌تواند الگوی بیان را تغییر دهد."
              />
            </SceneCard>
          )}

          {scene === 3 && (
            <SceneCard
              eyebrow="آزمایشگاه تصمیم"
              title="افزایش، کاهش یا تقریباً بدون تغییر؟"
              description="برای هر ژن، گروه کنترل و تیمار را مقایسه کنید. هنوز وارد آمار نشده‌ایم؛ فقط جهت تغییر را تشخیص می‌دهیم."
            >
              <div className="space-y-5">
                {classificationCases.map((item) => {
                  const selected = classifications[item.gene];
                  const answered = selected !== null;
                  const correct = selected === item.correct;

                  return (
                    <div
                      key={item.gene}
                      className="rounded-3xl border border-slate-200 bg-white p-5"
                    >
                      <div className="grid gap-4 md:grid-cols-[0.55fr_1fr] md:items-center">
                        <div>
                          <p className="font-black text-slate-950">
                            {item.gene}
                          </p>

                          <p className="mt-2 text-xs leading-6 text-slate-500">
                            کنترل: {new Intl.NumberFormat("fa-IR").format(item.control)}
                            {" "}— تیمار:{" "}
                            {new Intl.NumberFormat("fa-IR").format(item.treated)}
                          </p>
                        </div>

                        <div className="space-y-3">
                          <SmallComparisonRow
                            label="گروه کنترل"
                            value={item.control}
                          />
                          <SmallComparisonRow
                            label="داروی X"
                            value={item.treated}
                            emphasized
                          />
                        </div>
                      </div>

                      <div className="mt-5 flex flex-wrap gap-2">
                        {(Object.keys(changeLabels) as ChangeLabel[]).map(
                          (option) => (
                            <button
                              key={option}
                              type="button"
                              onClick={() =>
                                setClassifications((previous) => ({
                                  ...previous,
                                  [item.gene]: option,
                                }))
                              }
                              className={[
                                "rounded-xl border px-3 py-2 text-xs font-bold transition",
                                selected === option
                                  ? option === item.correct
                                    ? "border-emerald-500 bg-emerald-50 text-emerald-900"
                                    : "border-amber-400 bg-amber-50 text-amber-900"
                                  : "border-slate-200 bg-white text-slate-600 hover:border-teal-300",
                              ].join(" ")}
                            >
                              {changeLabels[option]}
                            </button>
                          ),
                        )}
                      </div>

                      {answered && (
                        <p
                          className={[
                            "mt-4 rounded-xl p-3 text-xs font-semibold leading-6",
                            correct
                              ? "bg-emerald-50 text-emerald-900"
                              : "bg-amber-50 text-amber-900",
                          ].join(" ")}
                        >
                          {correct
                            ? "تشخیص درست است."
                            : `دوباره دو مقدار را مقایسه کنید. این مثال «${changeLabels[item.correct]}» را نشان می‌دهد.`}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              {Object.values(classifications).every(Boolean) && (
                <div className="mt-6 rounded-2xl border border-teal-200 bg-teal-50 p-5">
                  <p className="font-bold text-teal-950">
                    نتیجه شما:{" "}
                    {new Intl.NumberFormat("fa-IR").format(classificationScore)} از ۳
                  </p>
                  <p className="mt-2 text-sm leading-7 text-teal-900/80">
                    اینجا فقط جهت تغییر را تمرین کردیم. در مسیر RNA-seq بعداً می‌آموزیم که «بزرگ به‌نظررسیدن یک تغییر» به‌تنهایی برای نتیجه‌گیری آماری کافی نیست.
                  </p>
                </div>
              )}
            </SceneCard>
          )}

          {scene === 4 && (
            <SceneCard
              eyebrow="یک لایه عمیق‌تر"
              title="مقدار RNA مشاهده‌شده فقط به تولید آن وابسته نیست."
              description="این شبیه‌ساز فقط یک مدل مفهومی است؛ نه یک مدل دقیق سینتیکی. هدف این است که نقش تولید و تجزیه RNA را هم‌زمان ببینید."
            >
              <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
                <div className="space-y-4">
                  <ExpressionSlider
                    label="تولید RNA"
                    value={production}
                    onChange={setProduction}
                  />

                  <ExpressionSlider
                    label="تجزیه RNA"
                    value={degradation}
                    onChange={setDegradation}
                  />

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-bold text-slate-500">
                      برداشت مفهومی
                    </p>
                    <p className="mt-2 text-sm leading-7 text-slate-700">
                      وقتی تولید بیشتر یا تجزیه کمتر باشد، مقدار RNA موجود می‌تواند افزایش پیدا کند. برعکس، تجزیه بیشتر می‌تواند مقدار RNA مشاهده‌شده را کاهش دهد.
                    </p>
                  </div>
                </div>

                <div className="rounded-3xl bg-slate-950 p-6 text-white">
                  <p className="text-sm font-bold">
                    سطح مفهومی RNA موجود
                  </p>

                  <div className="mt-8 flex justify-center">
                    <div className="relative flex h-56 w-40 items-end overflow-hidden rounded-b-[2.5rem] rounded-t-2xl border-4 border-white/20 bg-white/5">
                      <div
                        className="w-full bg-teal-400 transition-all duration-500"
                        style={{ height: `${conceptualRnaLevel}%` }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="rounded-full bg-slate-950/75 px-3 py-1.5 text-sm font-black">
                          {new Intl.NumberFormat("fa-IR").format(conceptualRnaLevel)}٪
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="mt-5 text-center text-xs leading-6 text-slate-400">
                    این درصد فقط برای تعامل آموزشی است و واحد آزمایشگاهی واقعی نیست.
                  </p>
                </div>
              </div>

              <DecisionQuestion
                question="اگر مقدار RNA مربوط به یک ژن بیشتر شده باشد، آیا می‌توانیم فقط از همین مشاهده نتیجه بگیریم که سرعت رونویسی آن ژن حتماً بیشتر شده است؟"
                options={[
                  "بله؛ افزایش RNA فقط یک علت ممکن دارد.",
                  "خیر؛ تولید، پایداری و تجزیه RNA می‌توانند روی مقدار مشاهده‌شده اثر بگذارند.",
                ]}
                selected={deepAnswer}
                correctIndex={1}
                onSelect={setDeepAnswer}
                correctFeedback="دقیقاً. مقدار RNA مشاهده‌شده را نباید بدون شواهد بیشتر معادل مستقیم سرعت رونویسی در نظر گرفت."
                incorrectFeedback="RNA یک مولکول پویاست. هم تولید و هم پایداری یا تجزیه آن می‌توانند مقدار مشاهده‌شده را تغییر دهند."
              />
            </SceneCard>
          )}

          {scene === 5 && (
            <SceneCard
              eyebrow="کلینیک اشتباه"
              title="«RNA این ژن دو برابر شده؛ پس حتماً رونویسی آن دقیقاً دو برابر شده است.»"
              description="این جمله از یک مشاهده درست، نتیجه‌ای بیش از حد قطعی می‌گیرد."
            >
              <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6">
                <p className="font-black leading-8 text-amber-950">
                  پژوهشگر مقدار RNA بیشتری می‌بیند و بلافاصله آن را معادل افزایش دقیق سرعت رونویسی می‌داند.
                </p>
              </div>

              <DecisionQuestion
                question="بهترین اصلاح برای این برداشت چیست؟"
                options={[
                  "مقدار RNA بیشتر نشان می‌دهد RNA بیشتری مشاهده شده، اما علت دقیق آن برای نتیجه‌گیری نیاز به شواهد بیشتری دارد.",
                  "هر افزایش RNA الزاماً به معنی تکثیر ژن در DNA است.",
                  "اگر RNA بیشتر باشد، سطح پروتئین هم حتماً دقیقاً به همان نسبت بیشتر است.",
                ]}
                selected={mistakeAnswer}
                correctIndex={0}
                onSelect={setMistakeAnswer}
                correctFeedback="درست است. داده باید متناسب با چیزی که واقعاً اندازه‌گیری شده تفسیر شود."
                incorrectFeedback="از مقدار RNA به‌تنهایی نمی‌توان تکثیر DNA، سرعت دقیق رونویسی یا سطح قطعی پروتئین را نتیجه گرفت."
              />

              <InsightBox>
                اصل مهم هاب‌ژن: <strong>مشاهده را از تفسیر جدا نگه دار.</strong> اول بپرس داده مستقیماً چه چیزی را نشان می‌دهد؛ بعد سراغ توضیح زیستی برو.
              </InsightBox>

              <div className="mt-7 rounded-3xl border border-teal-200 bg-gradient-to-br from-teal-50 via-white to-cyan-50 p-6">
                <div className="flex items-start gap-3">
                  <FlaskConical className="mt-1 size-5 shrink-0 text-teal-700" />
                  <div>
                    <p className="font-bold text-teal-950">
                      پروژه سرطان پانکراس
                    </p>
                    <p className="mt-2 text-sm leading-8 text-slate-600">
                      اگر بعد از داروی X مقدار RNA ژن الف افزایش یابد، می‌توانیم درباره تغییر RNA گزارش‌شده صحبت کنیم؛ اما برای ادعای مکانیسم دقیق یا تغییر قطعی پروتئین به شواهد بیشتری نیاز داریم.
                    </p>
                  </div>
                </div>
              </div>

              <DecisionQuestion
                question="پس در پروژه داروی X، کدام جمله از نظر علمی محتاطانه‌تر است؟"
                options={[
                  "داروی X قطعاً پروتئین ژن الف را افزایش داده است.",
                  "پس از داروی X مقدار RNA مربوط به ژن الف در این مقایسه بیشتر مشاهده شده است.",
                  "داروی X ثابت کرده ژن الف علت اصلی سرطان پانکراس است.",
                ]}
                selected={caseAnswer}
                correctIndex={1}
                onSelect={setCaseAnswer}
                correctFeedback="بله. این جمله در محدوده شواهدی که واقعاً داریم باقی می‌ماند."
                incorrectFeedback="این ادعا از داده RNA فراتر می‌رود. بین مشاهده RNA و ادعای پروتئینی یا علّی فاصله وجود دارد."
              />

              <div className="mt-8 border-t border-slate-100 pt-7">
                <p className="font-bold text-slate-950">
                  بیان ژن در پروژه شما بیشتر در چه نوع مقایسه‌ای مطرح می‌شود؟
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
                      ? "اشکالی ندارد. فعلاً هدف شما فهم مفهوم بیان ژن است، نه داشتن پروژه آماده."
                      : "در چنین مقایسه‌ای، الگوی RNA می‌تواند یکی از لایه‌های اطلاعاتی مهم باشد. در درس‌های بعد یاد می‌گیریم چه زمانی ترنسکریپتومیکس واقعاً برای سؤال شما مناسب است."}
                  </InsightBox>
                )}
              </div>
            </SceneCard>
          )}

          {scene === 6 && (
            <SceneCard
              eyebrow="ایستگاه تسلط"
              title="آیا تفاوت «وجود ژن» و «مقدار RNA» برایتان روشن شده است؟"
              description="سؤال نهایی به‌جای حفظ تعریف، روی تصمیم علمی تمرکز دارد."
            >
              <DecisionQuestion
                question="ژن X در DNA هر دو گروه کنترل و تیمار وجود دارد، اما بعد از تیمار مقدار RNA آن بیشتر شده است. بهترین برداشت کدام است؟"
                options={[
                  "ژن X فقط در گروه تیمار وارد DNA شده است.",
                  "سطح RNA مربوط به ژن X بین دو شرایط متفاوت است؛ برای علت دقیق این تفاوت به بررسی بیشتری نیاز داریم.",
                  "افزایش RNA به‌تنهایی ثابت می‌کند سطح پروتئین دقیقاً به همان نسبت افزایش یافته است.",
                  "این مشاهده به‌تنهایی ثابت می‌کند ژن X علت فنوتیپ است.",
                ]}
                selected={masteryAnswer}
                correctIndex={1}
                onSelect={setMasteryAnswer}
                correctFeedback="عالی. هم تفاوت وجود ژن و سطح RNA را تشخیص داده‌اید و هم از تفسیر بیش از اندازه پرهیز کرده‌اید."
                incorrectFeedback="به دو اصل برگردید: وجود ژن با مقدار RNA یکی نیست، و مقدار RNA به‌تنهایی تمام مراحل پایین‌دستی یا علت زیستی را ثابت نمی‌کند."
              />

              <div className="mt-8">
                <p className="font-bold text-slate-950">
                  این مفهوم چقدر برایتان روشن است؟
                </p>

                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  <ConfidenceButton
                    active={confidence === "unclear"}
                    title="هنوز مبهم است"
                    description="بهتر است آزمایشگاه‌های این درس را دوباره امتحان کنم."
                    onClick={() => setConfidence("unclear")}
                  />

                  <ConfidenceButton
                    active={confidence === "developing"}
                    title="تقریباً متوجه شدم"
                    description="اصل تفاوت را فهمیده‌ام ولی هنوز جای تمرین دارد."
                    onClick={() => setConfidence("developing")}
                  />

                  <ConfidenceButton
                    active={confidence === "clear"}
                    title="کاملاً روشن است"
                    description="می‌توانم تفاوت وجود ژن، مقدار RNA و تفسیر زیستی را توضیح بدهم."
                    onClick={() => setConfidence("clear")}
                  />
                </div>
              </div>

              <div className="mt-7 rounded-3xl bg-slate-950 p-6 text-white">
                <p className="text-xs font-bold text-teal-300">
                  لحظه فهم این درس
                </p>

                <p className="mt-3 text-lg font-bold leading-9">
                  ژن می‌تواند در DNA وجود داشته باشد، اما مقدار RNA مربوط به آن بسته به نوع سلول و شرایط تغییر کند؛ و مقدار RNA مشاهده‌شده را نباید بدون شواهد بیشتر معادل مکانیسم دقیق زیستی دانست.
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
                    ? "ثبت تسلط درس دوم"
                    : "پایان درس دوم در حالت مهمان"}
                </button>

                <button
                  type="button"
                  onClick={restartLesson}
                  className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                >
                  <RotateCcw className="size-4" />
                  مرور دوباره درس دوم
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
                    وضعیت درس دوم در حساب شما ذخیره شد.
                  </p>

                  <p className="mt-2 text-sm leading-7 text-emerald-800">
                    {savedProgress.status === "needs_review"
                      ? "این درس برای مرور دوباره علامت خورده است."
                      : "درس دوم با موفقیت تکمیل شده است."}
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
                  درس ۳ — RNA فقط mRNA نیست
                </h3>

                <p className="mt-2 text-sm leading-7 text-slate-600">
                  در درس سوم می‌بینیم ترنسکریپتوم فقط به mRNA محدود نیست و انتخاب روش آزمایش روی بخشی از دنیای RNA که مشاهده می‌کنیم اثر می‌گذارد.
                </p>

                <a
                  href="/learn/transcriptomics/foundations/rna-diversity"
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-teal-800"
                >
                  ورود به درس سوم
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

function MiniGeneCard({
  title,
  level,
  note,
}: {
  title: string;
  level: number;
  note: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
      <p className="font-black text-slate-950">{title}</p>

      <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-teal-600"
          style={{ width: `${level}%` }}
        />
      </div>

      <p className="mt-3 text-xs leading-6 text-slate-500">{note}</p>
    </div>
  );
}

function ExpressionSlider({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between gap-4">
        <span className="font-bold text-slate-900">{label}</span>
        <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
          {new Intl.NumberFormat("fa-IR").format(value)}
        </span>
      </div>

      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-4 w-full accent-teal-600"
      />
    </label>
  );
}

function ExpressionBar({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3 text-xs">
        <span className="font-semibold text-slate-300">{label}</span>
        <span className="text-slate-500">
          {new Intl.NumberFormat("fa-IR").format(value)}
        </span>
      </div>

      <div className="h-3 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-teal-400 transition-all duration-300"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function ComparisonBar({
  gene,
  control,
  treated,
}: {
  gene: string;
  control: number;
  treated: number;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <p className="font-bold text-slate-950">{gene}</p>

      <div className="mt-4 space-y-3">
        <SmallComparisonRow label="گروه کنترل" value={control} />
        <SmallComparisonRow label="داروی X" value={treated} emphasized />
      </div>
    </div>
  );
}

function SmallComparisonRow({
  label,
  value,
  emphasized = false,
}: {
  label: string;
  value: number;
  emphasized?: boolean;
}) {
  return (
    <div className="grid grid-cols-[88px_1fr_34px] items-center gap-3">
      <span className="text-xs font-semibold text-slate-500">{label}</span>

      <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
        <div
          className={[
            "h-full rounded-full transition-all duration-500",
            emphasized ? "bg-teal-600" : "bg-slate-400",
          ].join(" ")}
          style={{ width: `${value}%` }}
        />
      </div>

      <span className="text-xs text-slate-400">
        {new Intl.NumberFormat("fa-IR").format(value)}
      </span>
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
        درس دوم ذخیره شده
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
