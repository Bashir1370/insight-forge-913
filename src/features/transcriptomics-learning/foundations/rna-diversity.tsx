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

type RnaType =
  | "mRNA"
  | "lncRNA"
  | "miRNA"
  | "rRNA"
  | "tRNA";

type Strategy =
  | "polyA"
  | "rrna-depletion"
  | "small-rna";

type ProjectReflection =
  | "coding"
  | "noncoding"
  | "small-rna"
  | "broad"
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
const NODE_ID = "f3-rna-diversity";

const sceneTitles = [
  "کشف تنوع RNA",
  "خانواده‌های RNA",
  "آزمایشگاه آماده‌سازی",
  "سؤال شما چیست؟",
  "چه چیزی دیده نمی‌شود؟",
  "کلینیک اشتباه",
  "تسلط",
];

const rnaInfo: Record<
  RnaType,
  {
    title: string;
    summary: string;
    role: string;
  }
> = {
  mRNA: {
    title: "mRNA",
    summary: "RNA پیام‌رسان",
    role: "حامل اطلاعات لازم برای ساخت بسیاری از پروتئین‌ها.",
  },
  lncRNA: {
    title: "lncRNA",
    summary: "RNA بلند غیرکُدکننده",
    role: "گروهی متنوع از RNAهای غیرکُدکننده با نقش‌های تنظیمی و ساختاری.",
  },
  miRNA: {
    title: "miRNA",
    summary: "RNA کوچک تنظیمی",
    role: "می‌تواند در تنظیم پسارونویسی بیان ژن نقش داشته باشد.",
  },
  rRNA: {
    title: "rRNA",
    summary: "RNA ریبوزومی",
    role: "یکی از اجزای اصلی ریبوزوم و بخش بزرگی از RNA کل سلول.",
  },
  tRNA: {
    title: "tRNA",
    summary: "RNA ناقل",
    role: "در ترجمه و انتقال اسیدهای آمینه به ریبوزوم نقش دارد.",
  },
};

const strategyInfo: Record<
  Strategy,
  {
    title: string;
    subtitle: string;
    description: string;
    visibility: Record<RnaType, number>;
    note: string;
  }
> = {
  polyA: {
    title: "انتخاب Poly(A)",
    subtitle: "Poly(A) selection",
    description:
      "به‌طور مفهومی RNAهای دارای دُم Poly(A) را غنی‌تر می‌کند و برای بسیاری از مطالعات mRNA رایج است.",
    visibility: {
      mRNA: 90,
      lncRNA: 55,
      miRNA: 5,
      rRNA: 8,
      tRNA: 5,
    },
    note:
      "این یک نمایش آموزشی ساده‌شده است. همه RNAهای مهم الزاماً Poly(A)دار نیستند.",
  },
  "rrna-depletion": {
    title: "کاهش rRNA",
    subtitle: "rRNA depletion",
    description:
      "rRNA را تا حد زیادی کاهش می‌دهد تا طیف گسترده‌تری از RNAهای باقی‌مانده امکان بررسی پیدا کنند.",
    visibility: {
      mRNA: 78,
      lncRNA: 82,
      miRNA: 18,
      rRNA: 12,
      tRNA: 20,
    },
    note:
      "میزان پوشش واقعی به روش، نمونه و پروتکل وابسته است؛ این نمودار فقط برای فهم مفهوم است.",
  },
  "small-rna": {
    title: "کتابخانه RNA کوچک",
    subtitle: "small RNA library",
    description:
      "برای RNAهای کوچک طراحی می‌شود و برای سؤال‌هایی مانند بررسی miRNA مناسب‌تر است.",
    visibility: {
      mRNA: 8,
      lncRNA: 6,
      miRNA: 92,
      rRNA: 22,
      tRNA: 34,
    },
    note:
      "آماده‌سازی کتابخانه RNA کوچک با RNA-seq معمول mRNA یکسان نیست.",
  },
};

const reflectionLabels: Record<ProjectReflection, string> = {
  coding: "بیشتر روی mRNA و ژن‌های کُدکننده تمرکز دارم",
  noncoding: "RNAهای غیرکُدکننده برایم مهم‌اند",
  "small-rna": "miRNA یا RNAهای کوچک برایم مهم‌اند",
  broad: "می‌خواهم دید گسترده‌تری از RNAها داشته باشم",
  unsure: "هنوز نمی‌دانم",
};

export function RnaDiversityLesson() {
  const { session } = useAuth();
  const userId = session?.user?.id ?? null;

  const [scene, setScene] = useState(0);
  const [openingAnswer, setOpeningAnswer] = useState<number | null>(null);
  const [selectedRna, setSelectedRna] = useState<RnaType>("mRNA");
  const [strategy, setStrategy] = useState<Strategy>("polyA");
  const [strategyAnswer, setStrategyAnswer] = useState<number | null>(null);
  const [questionAnswer, setQuestionAnswer] = useState<number | null>(null);
  const [blindSpotAnswer, setBlindSpotAnswer] = useState<number | null>(null);
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
        console.error("Failed to load F3 progress:", error);
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

  const selectedStrategy = strategyInfo[strategy];
  const selectedRnaInfo = rnaInfo[selectedRna];

  const visibilityRows = useMemo(
    () =>
      (Object.keys(rnaInfo) as RnaType[]).map((rna) => ({
        rna,
        value: selectedStrategy.visibility[rna],
      })),
    [selectedStrategy],
  );

  const canFinish = masteryAnswer !== null && Boolean(confidence);

  function goToScene(nextScene: number) {
    setScene(nextScene);

    window.setTimeout(() => {
      document.getElementById("f3-scene")?.scrollIntoView({
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
      console.error("Failed to save F3 progress:", error);
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
    setSelectedRna("mRNA");
    setStrategy("polyA");
    setStrategyAnswer(null);
    setQuestionAnswer(null);
    setBlindSpotAnswer(null);
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
      foundationIndex={3}
      total={7}
      title="RNA فقط mRNA نیست"
      subtitle="ترنسکریپتوم از خانواده‌های متنوع RNA تشکیل شده است. در این درس می‌بینید چرا نوع سؤال پژوهشی و روش آماده‌سازی کتابخانه روی بخشی از دنیای RNA که مشاهده می‌کنیم اثر می‌گذارد."
      currentScene={scene}
      sceneCount={sceneTitles.length}
      sceneLabel={sceneTitles[scene] ?? ""}
    >
      <section id="f3-scene" className="scroll-mt-6">
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
              eyebrow="شروع با یک سوءبرداشت رایج"
              title="وقتی می‌گوییم «RNA»، آیا فقط درباره mRNA حرف می‌زنیم؟"
              description="mRNA برای بسیاری از مطالعات مهم است، اما دنیای RNA بسیار متنوع‌تر از یک خانواده است."
            >
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                {(Object.keys(rnaInfo) as RnaType[]).map((rna) => (
                  <RnaMiniCard
                    key={rna}
                    title={rnaInfo[rna].title}
                    summary={rnaInfo[rna].summary}
                  />
                ))}
              </div>

              <DecisionQuestion
                question="کدام جمله دقیق‌تر است؟"
                options={[
                  "ترنسکریپتوم فقط از mRNA تشکیل شده است.",
                  "ترنسکریپتوم می‌تواند شامل انواع مختلف RNA باشد و روش آزمایش تعیین می‌کند کدام بخش‌ها بهتر دیده شوند.",
                  "هر نوع RNA در هر آزمایش RNA-seq دقیقاً به یک اندازه مشاهده می‌شود.",
                ]}
                selected={openingAnswer}
                correctIndex={1}
                onSelect={setOpeningAnswer}
                correctFeedback="دقیقاً. ترنسکریپتوم متنوع است و طراحی آزمایش روی چیزی که قابل مشاهده می‌شود اثر دارد."
                incorrectFeedback="mRNA فقط یکی از خانواده‌های RNA است و هیچ روش واحدی همه RNAها را با حساسیت یکسان نشان نمی‌دهد."
              />

              <InsightBox>
                اصل این درس: <strong>ترنسکریپتوم ≠ فقط mRNA.</strong>{" "}
                چیزی که در داده می‌بینیم به سؤال، نمونه و روش آماده‌سازی کتابخانه هم وابسته است.
              </InsightBox>
            </SceneCard>
          )}

          {scene === 1 && (
            <SceneCard
              eyebrow="خانواده‌های RNA"
              title="هر خانواده RNA نقش و ویژگی متفاوتی دارد."
              description="روی هر کارت کلیک کنید. هدف این بخش حفظ‌کردن نام‌ها نیست؛ فقط می‌خواهیم بفهمیم RNA یک خانواده واحد و هم‌شکل نیست."
            >
              <div className="flex flex-wrap gap-2">
                {(Object.keys(rnaInfo) as RnaType[]).map((rna) => (
                  <button
                    key={rna}
                    type="button"
                    onClick={() => setSelectedRna(rna)}
                    className={[
                      "rounded-xl border px-4 py-2 text-sm font-bold transition",
                      selectedRna === rna
                        ? "border-teal-600 bg-teal-600 text-white"
                        : "border-slate-200 bg-white text-slate-600 hover:border-teal-300",
                    ].join(" ")}
                  >
                    {rna}
                  </button>
                ))}
              </div>

              <div className="mt-5 rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white">
                <p className="text-3xl font-black">{selectedRnaInfo.title}</p>

                <p className="mt-2 text-sm font-bold text-teal-300">
                  {selectedRnaInfo.summary}
                </p>

                <p className="mt-5 max-w-3xl text-sm leading-8 text-slate-300">
                  {selectedRnaInfo.role}
                </p>
              </div>

              <div className="mt-6 rounded-2xl border border-cyan-200 bg-cyan-50 p-5">
                <p className="font-bold text-cyan-950">
                  نکته مهم
                </p>

                <p className="mt-2 text-sm leading-8 text-cyan-900/80">
                  بعضی نام‌ها مثل mRNA، miRNA، rRNA و tRNA اختصارات علمی استاندارد هستند و در هاب‌ژن به همین شکل نوشته می‌شوند.
                </p>
              </div>
            </SceneCard>
          )}

          {scene === 2 && (
            <SceneCard
              eyebrow="آزمایشگاه آماده‌سازی کتابخانه"
              title="روش آماده‌سازی را عوض کنید و ببینید کدام RNAها پررنگ‌تر می‌شوند."
              description="این نمودارها شبیه‌سازی آموزشی هستند، نه پیش‌بینی کمی یک پروتکل واقعی."
            >
              <div className="grid gap-3 md:grid-cols-3">
                {(Object.keys(strategyInfo) as Strategy[]).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setStrategy(item)}
                    className={[
                      "rounded-2xl border p-4 text-right transition",
                      strategy === item
                        ? "border-teal-500 bg-teal-50 shadow-sm"
                        : "border-slate-200 bg-white hover:border-teal-300",
                    ].join(" ")}
                  >
                    <p className="font-black text-slate-950">
                      {strategyInfo[item].title}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {strategyInfo[item].subtitle}
                    </p>
                  </button>
                ))}
              </div>

              <div className="mt-6 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
                <div className="rounded-3xl border border-slate-200 bg-white p-5">
                  <p className="font-black text-slate-950">
                    {selectedStrategy.title}
                  </p>

                  <p className="mt-3 text-sm leading-8 text-slate-600">
                    {selectedStrategy.description}
                  </p>

                  <p className="mt-5 rounded-2xl bg-amber-50 p-4 text-xs leading-7 text-amber-900">
                    {selectedStrategy.note}
                  </p>
                </div>

                <div className="rounded-3xl bg-slate-950 p-6 text-white">
                  <p className="text-sm font-bold">
                    نمایش مفهومی بخش‌های قابل مشاهده
                  </p>

                  <div className="mt-6 space-y-4">
                    {visibilityRows.map((item) => (
                      <VisibilityBar
                        key={item.rna}
                        label={item.rna}
                        value={item.value}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <DecisionQuestion
                question="این آزمایشگاه چه اصل مهمی را نشان می‌دهد؟"
                options={[
                  "هر روش آماده‌سازی دقیقاً همان RNAها را با همان نسبت نشان می‌دهد.",
                  "انتخاب روش آماده‌سازی می‌تواند روی بخشی از دنیای RNA که بهتر مشاهده می‌کنیم اثر بگذارد.",
                  "اگر RNA در داده دیده نشود، حتماً در نمونه وجود نداشته است.",
                ]}
                selected={strategyAnswer}
                correctIndex={1}
                onSelect={setStrategyAnswer}
                correctFeedback="دقیقاً. روش اندازه‌گیری بخشی از چیزی است که در نهایت به‌عنوان داده می‌بینیم."
                incorrectFeedback="ندیدن یا کم‌دیدن یک RNA می‌تواند به طراحی آزمایش و روش آماده‌سازی هم مربوط باشد؛ نه فقط به زیست‌شناسی نمونه."
              />
            </SceneCard>
          )}

          {scene === 3 && (
            <SceneCard
              eyebrow="از سؤال به روش"
              title="اول بپرسید چه RNAای برای سؤال شما مهم است."
              description="هاب‌ژن از سؤال شروع می‌کند، نه از نام تکنیک."
            >
              <div className="grid gap-4 md:grid-cols-3">
                <QuestionCard
                  title="تمرکز روی mRNA"
                  question="می‌خواهم تغییر بیان بسیاری از ژن‌های کُدکننده را بررسی کنم."
                  suggestion="انتخاب Poly(A) می‌تواند یکی از گزینه‌های رایج باشد."
                />

                <QuestionCard
                  title="دید گسترده‌تر از RNA"
                  question="RNAهای غیرکُدکننده هم برای سؤال من مهم‌اند."
                  suggestion="کاهش rRNA می‌تواند برای برخی طراحی‌ها پوشش گسترده‌تری بدهد."
                />

                <QuestionCard
                  title="تمرکز روی miRNA"
                  question="هدف اصلی من بررسی miRNAهاست."
                  suggestion="کتابخانه RNA کوچک مناسب‌تر از RNA-seq معمول mRNA است."
                />
              </div>

              <DecisionQuestion
                question="اگر سؤال اصلی پژوهش درباره miRNA باشد، کدام انتخاب از نظر مفهومی مناسب‌تر است؟"
                options={[
                  "همان RNA-seq معمول mRNA، بدون توجه به نوع کتابخانه.",
                  "یک طراحی مخصوص RNAهای کوچک.",
                  "نوع کتابخانه اهمیتی ندارد چون همه RNAها یکسان‌اند.",
                ]}
                selected={questionAnswer}
                correctIndex={1}
                onSelect={setQuestionAnswer}
                correctFeedback="درست است. نوع RNA هدف باید در طراحی آزمایش دیده شود."
                incorrectFeedback="miRNA از نظر اندازه و آماده‌سازی کتابخانه با mRNA یکسان نیست و معمولاً طراحی اختصاصی‌تری نیاز دارد."
              />

              <InsightBox>
                سؤال پژوهشی باید قبل از انتخاب روش روشن باشد. <strong>روش مناسب از هدف زیستی می‌آید، نه برعکس.</strong>
              </InsightBox>
            </SceneCard>
          )}

          {scene === 4 && (
            <SceneCard
              eyebrow="نقطه کور داده"
              title="اگر چیزی را کم ببینیم، آیا حتماً در نمونه وجود نداشته است؟"
              description="اینجا یکی از مهم‌ترین عادت‌های فکری در تحلیل داده‌های اُمیکس را تمرین می‌کنیم."
            >
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <p className="font-black text-slate-950">
                  سناریو
                </p>

                <p className="mt-3 text-sm leading-8 text-slate-600">
                  پژوهشگری از یک کتابخانه انتخاب Poly(A) استفاده کرده و در خروجی خود miRNA بسیار کمی می‌بیند.
                </p>
              </div>

              <DecisionQuestion
                question="کدام نتیجه‌گیری علمی‌تر است؟"
                options={[
                  "پس miRNA در نمونه وجود نداشته است.",
                  "این طراحی برای مشاهده miRNA بهینه نیست؛ کم‌بودن سیگنال می‌تواند به روش آماده‌سازی هم مربوط باشد.",
                  "هر نوع RNA باید در همه کتابخانه‌ها با حساسیت یکسان دیده شود.",
                ]}
                selected={blindSpotAnswer}
                correctIndex={1}
                onSelect={setBlindSpotAnswer}
                correctFeedback="دقیقاً. محدودیت اندازه‌گیری بخشی از تفسیر داده است."
                incorrectFeedback="ندیدن یک مولکول همیشه معادل نبودن آن نیست. ابتدا باید ببینید طراحی آزمایش اصلاً برای مشاهده آن مناسب بوده یا نه."
              />

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <ConceptPanel
                  title="نبودن در زیست‌شناسی"
                  text="ممکن است RNA واقعاً در سطح بسیار پایین یا غایب باشد."
                />

                <ConceptPanel
                  title="ندیدن در اندازه‌گیری"
                  text="ممکن است روش، کتابخانه یا عمق اندازه‌گیری برای مشاهده آن مناسب نبوده باشد."
                />
              </div>
            </SceneCard>
          )}

          {scene === 5 && (
            <SceneCard
              eyebrow="کلینیک اشتباه"
              title="«RNA-seq یعنی همه RNAهای سلول را کامل و یکسان می‌بینیم.»"
              description="این جمله هم تنوع RNA را نادیده می‌گیرد و هم اثر طراحی آزمایش را."
            >
              <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6">
                <p className="font-black leading-8 text-amber-950">
                  یک پژوهشگر نتیجه می‌گیرد چون داده RNA-seq دارد، پس تمام خانواده‌های RNA را به یک اندازه پوشش داده است.
                </p>
              </div>

              <DecisionQuestion
                question="بهترین اصلاح این جمله چیست؟"
                options={[
                  "نوع RNA هدف و روش آماده‌سازی کتابخانه روی آنچه مشاهده می‌شود اثر دارند.",
                  "همه RNAها از نظر اندازه و زیست‌شناسی یکسان‌اند.",
                  "اگر از RNA-seq استفاده شده باشد، دیگر لازم نیست نوع کتابخانه گزارش شود.",
                ]}
                selected={mistakeAnswer}
                correctIndex={0}
                onSelect={setMistakeAnswer}
                correctFeedback="درست است. نوع کتابخانه بخشی از Context ضروری برای تفسیر داده است."
                incorrectFeedback="برای فهم اینکه چه RNAهایی احتمالاً بهتر دیده شده‌اند، باید نوع آماده‌سازی کتابخانه را بدانیم."
              />

              <div className="mt-7 rounded-3xl border border-teal-200 bg-gradient-to-br from-teal-50 via-white to-cyan-50 p-6">
                <div className="flex items-start gap-3">
                  <FlaskConical className="mt-1 size-5 shrink-0 text-teal-700" />

                  <div>
                    <p className="font-bold text-teal-950">
                      پروژه سرطان پانکراس
                    </p>

                    <p className="mt-2 text-sm leading-8 text-slate-600">
                      فرض کنید در پروژه داروی X هدف اصلی ما تغییرات گسترده mRNA است. یک طراحی مناسب برای mRNA می‌تواند منطقی باشد؛ اما اگر سؤال اصلی درباره miRNA باشد، همان طراحی لزوماً پاسخ مناسبی نمی‌دهد.
                    </p>
                  </div>
                </div>
              </div>

              <DecisionQuestion
                question="اگر هدف پروژه داروی X بررسی تغییر miRNAها باشد، چه چیزی باید قبل از تحلیل روشن شود؟"
                options={[
                  "اینکه کتابخانه و پروتکل برای RNAهای کوچک مناسب بوده‌اند یا نه.",
                  "فقط اینکه فایل FASTQ وجود دارد یا نه.",
                  "اینکه همه ژن‌ها در DNA وجود دارند یا نه.",
                ]}
                selected={caseAnswer}
                correctIndex={0}
                onSelect={setCaseAnswer}
                correctFeedback="دقیقاً. داشتن داده کافی نیست؛ باید بدانیم داده چگونه تولید شده و برای چه هدفی مناسب است."
                incorrectFeedback="وجود FASTQ به‌تنهایی مناسب‌بودن داده برای سؤال miRNA را ثابت نمی‌کند."
              />

              <div className="mt-8 border-t border-slate-100 pt-7">
                <p className="font-bold text-slate-950">
                  در پروژه شما کدام بخش از دنیای RNA مهم‌تر است؟
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
                    {reflection === "unsure"
                      ? "اشکالی ندارد. یکی از هدف‌های همین Foundations این است که قبل از انتخاب روش، سؤال و نوع RNA هدف برایتان روشن‌تر شود."
                      : "این انتخاب باید در طراحی مطالعه و نوع کتابخانه دیده شود. در مسیر RNA-seq بعداً یاد می‌گیریم Metadata و اطلاعات تولید داده چرا برای تحلیل حیاتی‌اند."}
                  </InsightBox>
                )}
              </div>
            </SceneCard>
          )}

          {scene === 6 && (
            <SceneCard
              eyebrow="ایستگاه تسلط"
              title="آیا می‌توانید بین «نوع RNA» و «روش مشاهده» ارتباط برقرار کنید؟"
              description="سؤال نهایی این درس درباره انتخاب روش بر اساس سؤال پژوهشی است."
            >
              <DecisionQuestion
                question="یک پژوهشگر می‌خواهد اثر داروی X بر miRNAهای سلول‌های سرطان پانکراس را بررسی کند. کدام تصمیم علمی‌تر است؟"
                options={[
                  "هر نوع RNA-seq مناسب است؛ نوع کتابخانه اهمیتی ندارد.",
                  "باید بررسی شود روش آماده‌سازی کتابخانه برای RNAهای کوچک و miRNA مناسب است.",
                  "چون miRNA در DNA کُد شده، بدون اندازه‌گیری RNA هم می‌توان سطح آن را دانست.",
                  "اگر در یک کتابخانه mRNA دیده نشد، حتماً در نمونه وجود نداشته است.",
                ]}
                selected={masteryAnswer}
                correctIndex={1}
                onSelect={setMasteryAnswer}
                correctFeedback="عالی. سؤال زیستی، نوع RNA هدف و روش آماده‌سازی باید با هم سازگار باشند."
                incorrectFeedback="اصل این درس را مرور کنید: ترنسکریپتوم متنوع است و روش آزمایش تعیین می‌کند چه بخش‌هایی بهتر مشاهده شوند."
              />

              <div className="mt-8">
                <p className="font-bold text-slate-950">
                  این مفهوم چقدر برایتان روشن است؟
                </p>

                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  <ConfidenceButton
                    active={confidence === "unclear"}
                    title="هنوز مبهم است"
                    description="بهتر است آزمایشگاه آماده‌سازی را دوباره امتحان کنم."
                    onClick={() => setConfidence("unclear")}
                  />

                  <ConfidenceButton
                    active={confidence === "developing"}
                    title="تقریباً متوجه شدم"
                    description="می‌فهمم RNA متنوع است ولی هنوز انتخاب روش برایم کاملاً روشن نیست."
                    onClick={() => setConfidence("developing")}
                  />

                  <ConfidenceButton
                    active={confidence === "clear"}
                    title="کاملاً روشن است"
                    description="می‌توانم توضیح بدهم چرا نوع RNA هدف روی طراحی آزمایش اثر می‌گذارد."
                    onClick={() => setConfidence("clear")}
                  />
                </div>
              </div>

              <div className="mt-7 rounded-3xl bg-slate-950 p-6 text-white">
                <p className="text-xs font-bold text-teal-300">
                  لحظه فهم این درس
                </p>

                <p className="mt-3 text-lg font-bold leading-9">
                  ترنسکریپتوم فقط mRNA نیست؛ و آنچه در داده می‌بینیم به نوع RNA هدف و روش آماده‌سازی کتابخانه وابسته است.
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
                    ? "ثبت تسلط درس سوم"
                    : "پایان درس سوم در حالت مهمان"}
                </button>

                <button
                  type="button"
                  onClick={restartLesson}
                  className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                >
                  <RotateCcw className="size-4" />
                  مرور دوباره درس سوم
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
                    وضعیت درس سوم در حساب شما ذخیره شد.
                  </p>

                  <p className="mt-2 text-sm leading-7 text-emerald-800">
                    {savedProgress.status === "needs_review"
                      ? "این درس برای مرور دوباره علامت خورده است."
                      : "درس سوم با موفقیت تکمیل شده است."}
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
                  درس ۴ — ترنسکریپتومیکس دقیقاً چه چیزی اندازه می‌گیرد؟
                </h3>

                <p className="mt-2 text-sm leading-7 text-slate-600">
                  در درس چهارم بین لایه‌های DNA، RNA، پروتئین و فنوتیپ تفکیک می‌کنیم و یاد می‌گیریم از داده RNA چه ادعاهایی می‌توان کرد و چه ادعاهایی به شواهد بیشتری نیاز دارند.
                </p>

                <a
                  href="/learn/transcriptomics/foundations/what-transcriptomics-measures"
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-teal-800"
                >
                  ورود به درس چهارم
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

function RnaMiniCard({
  title,
  summary,
}: {
  title: string;
  summary: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
      <p className="text-xl font-black text-slate-950">{title}</p>
      <p className="mt-2 text-xs leading-6 text-slate-500">{summary}</p>
    </div>
  );
}

function VisibilityBar({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3 text-xs">
        <span className="font-bold text-slate-200">{label}</span>
        <span className="text-slate-500">
          {new Intl.NumberFormat("fa-IR").format(value)}
        </span>
      </div>

      <div className="h-3 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-teal-400 transition-all duration-500"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function QuestionCard({
  title,
  question,
  suggestion,
}: {
  title: string;
  question: string;
  suggestion: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5">
      <p className="font-black text-slate-950">{title}</p>
      <p className="mt-3 text-sm leading-7 text-slate-600">{question}</p>
      <p className="mt-4 rounded-2xl bg-teal-50 p-4 text-xs font-semibold leading-6 text-teal-900">
        {suggestion}
      </p>
    </div>
  );
}

function ConceptPanel({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
      <p className="font-black text-slate-950">{title}</p>
      <p className="mt-3 text-sm leading-8 text-slate-600">{text}</p>
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
        درس سوم ذخیره شده
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
