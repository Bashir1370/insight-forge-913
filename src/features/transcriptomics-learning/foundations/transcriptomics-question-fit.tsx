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
  Compass,
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

type QuestionDomain =
  | "transcriptomics"
  | "genomics"
  | "proteomics"
  | "phenotype";

type ScenarioId =
  | "drug-expression"
  | "germline-variant"
  | "protein-abundance"
  | "cell-migration";

type ProjectReflection =
  | "expression"
  | "variant"
  | "protein"
  | "phenotype"
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
const NODE_ID = "f5-transcriptomics-question-fit";

const sceneTitles = [
  "سؤال مناسب چیست؟",
  "چه لایه‌ای را می‌خواهید؟",
  "آزمایشگاه انتخاب حوزه",
  "سؤال‌های مرزی",
  "پروژه داروی X",
  "کلینیک اشتباه",
  "تسلط",
];

const domainInfo: Record<
  QuestionDomain,
  {
    title: string;
    description: string;
    example: string;
  }
> = {
  transcriptomics: {
    title: "ترنسکریپتومیکس",
    description:
      "وقتی سؤال اصلی درباره الگوی RNA و تغییر بیان در یک وضعیت زیستی است.",
    example:
      "بعد از تیمار، کدام ژن‌ها در سطح RNA تغییر کرده‌اند؟",
  },
  genomics: {
    title: "ژنومیکس",
    description:
      "وقتی سؤال اصلی درباره توالی DNA، واریانت‌ها یا تغییرات ژنومی است.",
    example:
      "آیا یک واریانت ژنتیکی در بیماران وجود دارد؟",
  },
  proteomics: {
    title: "پروتئومیکس",
    description:
      "وقتی سؤال اصلی مستقیماً درباره فراوانی یا وضعیت پروتئین‌هاست.",
    example:
      "سطح پروتئین X بعد از تیمار چقدر تغییر کرده است؟",
  },
  phenotype: {
    title: "آزمون فنوتیپی",
    description:
      "وقتی سؤال اصلی درباره رفتار یا عملکرد قابل مشاهده سلول، بافت یا موجود زنده است.",
    example:
      "آیا مهاجرت یا زنده‌مانی سلول بعد از تیمار تغییر کرده است؟",
  },
};

const scenarios: Array<{
  id: ScenarioId;
  question: string;
  correct: QuestionDomain;
  explanation: string;
}> = [
  {
    id: "drug-expression",
    question:
      "می‌خواهم بدانم داروی X چه تغییراتی در الگوی RNA سلول‌های سرطان پانکراس ایجاد می‌کند.",
    correct: "transcriptomics",
    explanation:
      "سؤال مستقیماً درباره تغییرات RNA است، بنابراین ترنسکریپتومیکس انتخاب طبیعی‌تری است.",
  },
  {
    id: "germline-variant",
    question:
      "می‌خواهم یک واریانت ارثی DNA مرتبط با خطر بیماری را پیدا کنم.",
    correct: "genomics",
    explanation:
      "سؤال درباره تغییر در سطح DNA است، نه RNA.",
  },
  {
    id: "protein-abundance",
    question:
      "می‌خواهم مقدار پروتئین X را بعد از تیمار به‌صورت مستقیم اندازه بگیرم.",
    correct: "proteomics",
    explanation:
      "اگر هدف مستقیم مقدار پروتئین است، اندازه‌گیری پروتئینی مناسب‌تر است.",
  },
  {
    id: "cell-migration",
    question:
      "می‌خواهم بدانم داروی X مهاجرت سلول‌های سرطانی را کاهش می‌دهد یا نه.",
    correct: "phenotype",
    explanation:
      "سؤال اصلی درباره رفتار سلول است و به یک آزمون فنوتیپی مستقیم نیاز دارد؛ ترنسکریپتومیکس می‌تواند اطلاعات تکمیلی بدهد.",
  },
];

const reflectionLabels: Record<ProjectReflection, string> = {
  expression: "سؤال اصلی من درباره تغییر بیان ژن است",
  variant: "سؤال اصلی من درباره DNA یا واریانت‌هاست",
  protein: "سؤال اصلی من درباره پروتئین است",
  phenotype: "سؤال اصلی من درباره رفتار یا فنوتیپ است",
  unsure: "هنوز سؤال اصلی پروژه‌ام روشن نیست",
};

export function TranscriptomicsQuestionFitLesson() {
  const { session } = useAuth();
  const userId = session?.user?.id ?? null;

  const [scene, setScene] = useState(0);
  const [openingAnswer, setOpeningAnswer] = useState<number | null>(null);
  const [selectedDomain, setSelectedDomain] =
    useState<QuestionDomain>("transcriptomics");

  const [scenarioAnswers, setScenarioAnswers] = useState<
    Record<ScenarioId, QuestionDomain | null>
  >({
    "drug-expression": null,
    "germline-variant": null,
    "protein-abundance": null,
    "cell-migration": null,
  });

  const [borderlineAnswer, setBorderlineAnswer] = useState<number | null>(null);
  const [caseAnswer, setCaseAnswer] = useState<number | null>(null);
  const [mistakeAnswer, setMistakeAnswer] = useState<number | null>(null);
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
        console.error("Failed to load F5 progress:", error);
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

  const selectedDomainInfo = domainInfo[selectedDomain];

  const scenarioScore = useMemo(
    () =>
      scenarios.filter(
        (scenario) => scenarioAnswers[scenario.id] === scenario.correct,
      ).length,
    [scenarioAnswers],
  );

  const canFinish =
    masteryAnswer !== null && Boolean(confidence);

  function goToScene(nextScene: number) {
    setScene(nextScene);

    window.setTimeout(() => {
      document.getElementById("f5-scene")?.scrollIntoView({
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
      console.error("Failed to save F5 progress:", error);
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
    setSelectedDomain("transcriptomics");
    setScenarioAnswers({
      "drug-expression": null,
      "germline-variant": null,
      "protein-abundance": null,
      "cell-migration": null,
    });
    setBorderlineAnswer(null);
    setCaseAnswer(null);
    setMistakeAnswer(null);
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
      foundationIndex={5}
      total={7}
      title="چه سؤال‌هایی برای ترنسکریپتومیکس مناسب‌اند؟"
      subtitle="در این درس به‌جای شروع از ابزار، از خود سؤال پژوهشی شروع می‌کنیم و یاد می‌گیریم چه زمانی ترنسکریپتومیکس انتخاب مناسبی است و چه زمانی باید سراغ لایه یا روش دیگری رفت."
      currentScene={scene}
      sceneCount={sceneTitles.length}
      sceneLabel={sceneTitles[scene]}
    >
      <section id="f5-scene" className="scroll-mt-6">
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
              eyebrow="شروع از سؤال"
              title="هر سؤالی که درباره «ژن» باشد، سؤال ترنسکریپتومیکس نیست."
              description="اول باید مشخص کنیم سؤال اصلی در کدام لایه زیستی قرار دارد."
            >
              <DecisionQuestion
                question="کدام سؤال مستقیماً به ترنسکریپتومیکس نزدیک‌تر است؟"
                options={[
                  "آیا واریانت ارثی خاصی در DNA بیماران وجود دارد؟",
                  "بعد از تیمار، الگوی RNA سلول چگونه تغییر می‌کند؟",
                  "مقدار پروتئین X چقدر است؟",
                  "آیا مهاجرت سلول کاهش یافته است؟",
                ]}
                selected={openingAnswer}
                correctIndex={1}
                onSelect={setOpeningAnswer}
                correctFeedback="دقیقاً. سؤال مستقیماً درباره تغییرات RNA است."
                incorrectFeedback="این سؤال ممکن است مهم باشد، اما لایه اصلی آن DNA، پروتئین یا فنوتیپ است؛ نه RNA."
              />

              <InsightBox>
                اصل این درس: <strong>اول سؤال را در لایه درست قرار بده، بعد روش را انتخاب کن.</strong>
              </InsightBox>
            </SceneCard>
          )}

          {scene === 1 && (
            <SceneCard
              eyebrow="نقشه سؤال"
              title="چه چیزی را واقعاً می‌خواهید بدانید؟"
              description="روی هر حوزه کلیک کنید و نمونه سؤال مناسب آن را ببینید."
            >
              <div className="grid gap-3 md:grid-cols-4">
                {(Object.keys(domainInfo) as QuestionDomain[]).map(
                  (domain) => (
                    <button
                      key={domain}
                      type="button"
                      onClick={() => setSelectedDomain(domain)}
                      className={[
                        "rounded-2xl border p-4 text-right transition",
                        selectedDomain === domain
                          ? "border-teal-500 bg-teal-50 shadow-sm"
                          : "border-slate-200 bg-white hover:border-teal-300",
                      ].join(" ")}
                    >
                      <p className="font-black text-slate-950">
                        {domainInfo[domain].title}
                      </p>
                      <p className="mt-2 text-xs leading-6 text-slate-500">
                        {domainInfo[domain].description}
                      </p>
                    </button>
                  ),
                )}
              </div>

              <div className="mt-6 rounded-3xl bg-slate-950 p-6 text-white">
                <div className="flex items-center gap-3">
                  <Compass className="size-5 text-teal-300" />
                  <p className="text-xl font-black">
                    {selectedDomainInfo.title}
                  </p>
                </div>

                <p className="mt-4 text-sm leading-8 text-slate-300">
                  {selectedDomainInfo.example}
                </p>
              </div>
            </SceneCard>
          )}

          {scene === 2 && (
            <SceneCard
              eyebrow="آزمایشگاه انتخاب حوزه"
              title="برای هر سؤال، لایه مناسب‌تر را انتخاب کنید."
              description="گاهی چند نوع داده می‌توانند مکمل هم باشند؛ اینجا فقط می‌خواهیم لایه اصلی سؤال را تشخیص دهیم."
            >
              <div className="space-y-5">
                {scenarios.map((scenario) => {
                  const selected = scenarioAnswers[scenario.id];
                  const answered = selected !== null;
                  const correct = selected === scenario.correct;

                  return (
                    <div
                      key={scenario.id}
                      className="rounded-3xl border border-slate-200 bg-white p-5"
                    >
                      <p className="font-bold leading-8 text-slate-950">
                        {scenario.question}
                      </p>

                      <div className="mt-5 flex flex-wrap gap-2">
                        {(Object.keys(domainInfo) as QuestionDomain[]).map(
                          (domain) => (
                            <button
                              key={domain}
                              type="button"
                              onClick={() =>
                                setScenarioAnswers((previous) => ({
                                  ...previous,
                                  [scenario.id]: domain,
                                }))
                              }
                              className={[
                                "rounded-xl border px-3 py-2 text-xs font-bold transition",
                                selected === domain
                                  ? domain === scenario.correct
                                    ? "border-emerald-500 bg-emerald-50 text-emerald-900"
                                    : "border-amber-400 bg-amber-50 text-amber-900"
                                  : "border-slate-200 bg-white text-slate-600 hover:border-teal-300",
                              ].join(" ")}
                            >
                              {domainInfo[domain].title}
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
                            ? scenario.explanation
                            : `لایه اصلی این سؤال «${domainInfo[scenario.correct].title}» است.`}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              {Object.values(scenarioAnswers).every(Boolean) && (
                <div className="mt-6 rounded-2xl border border-teal-200 bg-teal-50 p-5">
                  <p className="font-bold text-teal-950">
                    نتیجه شما:{" "}
                    {new Intl.NumberFormat("fa-IR").format(scenarioScore)} از ۴
                  </p>
                  <p className="mt-2 text-sm leading-7 text-teal-900/80">
                    هدف این آزمایشگاه این نیست که همه پروژه‌ها فقط یک نوع داده داشته باشند؛ هدف این است که «سؤال اصلی» را از ابزار جدا کنیم.
                  </p>
                </div>
              )}
            </SceneCard>
          )}

          {scene === 3 && (
            <SceneCard
              eyebrow="سؤال‌های مرزی"
              title="گاهی ترنسکریپتومیکس بخشی از پاسخ است، نه تمام پاسخ."
              description="علوم زیستی همیشه مرزهای کاملاً جدا ندارند. مهم این است که بدانیم کدام ادعا به کدام داده نیاز دارد."
            >
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <p className="font-black text-slate-950">
                  سناریو
                </p>
                <p className="mt-3 text-sm leading-8 text-slate-600">
                  پژوهشگری می‌خواهد بفهمد داروی X چرا مهاجرت سلول‌های سرطان پانکراس را کاهش داده است.
                </p>
              </div>

              <DecisionQuestion
                question="کدام طراحی فکری مناسب‌تر است؟"
                options={[
                  "فقط RNA-seq کافی است و به هیچ آزمون دیگری نیاز نیست.",
                  "آزمون مهاجرت برای فنوتیپ لازم است و ترنسکریپتومیکس می‌تواند برای بررسی تغییرات RNA به‌عنوان لایه مکمل استفاده شود.",
                  "چون مهاجرت یک فنوتیپ است، داده RNA هیچ ارزشی ندارد.",
                ]}
                selected={borderlineAnswer}
                correctIndex={1}
                onSelect={setBorderlineAnswer}
                correctFeedback="دقیقاً. ترنسکریپتومیکس می‌تواند بخشی از داستان باشد، اما سؤال فنوتیپی به اندازه‌گیری مستقیم فنوتیپ هم نیاز دارد."
                incorrectFeedback="برای پاسخ کامل باید بین اندازه‌گیری مستقیم فنوتیپ و داده‌های مولکولی مکمل تفکیک کنیم."
              />

              <InsightBox>
                <strong>مناسب بودن یک روش به سؤال بستگی دارد.</strong> یک روش می‌تواند مفید باشد بدون اینکه به‌تنهایی برای پاسخ کامل کافی باشد.
              </InsightBox>
            </SceneCard>
          )}

          {scene === 4 && (
            <SceneCard
              eyebrow="پروژه همراه شما"
              title="داروی X در سلول‌های سرطان پانکراس"
              description="حالا سؤال پروژه را دقیق‌تر می‌کنیم تا ببینیم چه زمانی ترنسکریپتومیکس در مرکز طراحی قرار می‌گیرد."
            >
              <div className="grid gap-4 md:grid-cols-2">
                <CaseCard
                  title="سؤال ۱"
                  text="داروی X چه تغییراتی در الگوی RNA سلول ایجاد می‌کند؟"
                  badge="ترنسکریپتومیکس"
                  emphasized
                />

                <CaseCard
                  title="سؤال ۲"
                  text="داروی X آیا مهاجرت سلول را کاهش می‌دهد؟"
                  badge="آزمون فنوتیپی"
                />
              </div>

              <DecisionQuestion
                question="اگر سؤال اصلی پروژه «تغییر الگوی RNA پس از داروی X» باشد، کدام انتخاب منطقی‌تر است؟"
                options={[
                  "ترنسکریپتومیکس باید یکی از لایه‌های اصلی طراحی باشد.",
                  "فقط اندازه‌گیری پروتئین کافی است.",
                  "فقط تعیین توالی DNA کافی است.",
                  "هیچ داده مولکولی لازم نیست.",
                ]}
                selected={caseAnswer}
                correctIndex={0}
                onSelect={setCaseAnswer}
                correctFeedback="درست است. سؤال مستقیماً در لایه RNA تعریف شده است."
                incorrectFeedback="وقتی سؤال اصلی درباره الگوی RNA است، ترنسکریپتومیکس باید در طراحی دیده شود."
              />

              <div className="mt-7 rounded-3xl border border-teal-200 bg-gradient-to-br from-teal-50 via-white to-cyan-50 p-6">
                <div className="flex items-start gap-3">
                  <FlaskConical className="mt-1 size-5 shrink-0 text-teal-700" />

                  <div>
                    <p className="font-bold text-teal-950">
                      تفاوت مهم
                    </p>

                    <p className="mt-2 text-sm leading-8 text-slate-600">
                      «می‌توان RNA-seq انجام داد» با «RNA-seq برای سؤال من انتخاب مناسبی است» یک چیز نیست.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 border-t border-slate-100 pt-7">
                <p className="font-bold text-slate-950">
                  سؤال اصلی پروژه شما بیشتر به کدام دسته نزدیک است؟
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
                    {reflection === "expression"
                      ? "سؤال شما به‌طور مستقیم به ترنسکریپتومیکس نزدیک است."
                      : reflection === "unsure"
                        ? "اشکالی ندارد. قبل از انتخاب فناوری، روشن‌کردن سؤال اصلی یکی از مهم‌ترین قدم‌های طراحی پروژه است."
                        : "ترنسکریپتومیکس ممکن است اطلاعات مکمل بدهد، اما لایه اصلی سؤال شما احتمالاً چیز دیگری است."}
                  </InsightBox>
                )}
              </div>
            </SceneCard>
          )}

          {scene === 5 && (
            <SceneCard
              eyebrow="کلینیک اشتباه"
              title="«هر پروژه زیستی را می‌توان با RNA-seq شروع کرد.»"
              description="در دسترس بودن یک فناوری دلیل کافی برای مناسب بودن آن نیست."
            >
              <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6">
                <p className="font-black leading-8 text-amber-950">
                  پژوهشگر قبل از تعریف سؤال، تصمیم گرفته RNA-seq انجام دهد و بعد دنبال سؤال مناسب برای داده می‌گردد.
                </p>
              </div>

              <DecisionQuestion
                question="بهترین اصلاح این رویکرد چیست؟"
                options={[
                  "اول سؤال پژوهشی و لایه زیستی موردنظر را مشخص کنیم، بعد روش را انتخاب کنیم.",
                  "اگر بودجه کافی باشد، RNA-seq همیشه بهترین انتخاب است.",
                  "نوع سؤال اهمیتی ندارد؛ فقط حجم داده مهم است.",
                ]}
                selected={mistakeAnswer}
                correctIndex={0}
                onSelect={setMistakeAnswer}
                correctFeedback="دقیقاً. طراحی باید از سؤال شروع شود."
                incorrectFeedback="ابزار بیشتر یا داده بیشتر الزاماً پاسخ مناسب‌تر تولید نمی‌کند؛ تناسب روش با سؤال مهم است."
              />

              <InsightBox>
                اصل هاب‌ژن: <strong>سؤال → مفهوم → تصمیم → ابزار</strong>.
              </InsightBox>
            </SceneCard>
          )}

          {scene === 6 && (
            <SceneCard
              eyebrow="ایستگاه تسلط"
              title="آیا می‌توانید تشخیص دهید چه زمانی ترنسکریپتومیکس انتخاب مناسبی است؟"
              description="سؤال نهایی از شما می‌خواهد لایه اصلی سؤال را تشخیص دهید."
            >
              <DecisionQuestion
                question="یک پژوهشگر می‌خواهد بداند پس از داروی X کدام ژن‌ها در سطح RNA در سلول‌های سرطان پانکراس تغییر کرده‌اند. کدام انتخاب مناسب‌تر است؟"
                options={[
                  "یک آزمون فنوتیپی به‌تنهایی.",
                  "ترنسکریپتومیکس، چون سؤال اصلی مستقیماً درباره تغییرات RNA است.",
                  "ژنومیکس به‌تنهایی، چون همه ژن‌ها در DNA قرار دارند.",
                  "پروتئومیکس به‌تنهایی، چون RNA و پروتئین همیشه یکسان‌اند.",
                ]}
                selected={masteryAnswer}
                correctIndex={1}
                onSelect={setMasteryAnswer}
                correctFeedback="عالی. شما سؤال را در لایه RNA قرار داده‌اید و روش را بر اساس سؤال انتخاب کرده‌اید."
                incorrectFeedback="دوباره بپرسید: متغیر اصلی که پژوهشگر می‌خواهد مستقیماً اندازه بگیرد چیست؟ پاسخ اینجا RNA است."
              />

              <div className="mt-8">
                <p className="font-bold text-slate-950">
                  این مفهوم چقدر برایتان روشن است؟
                </p>

                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  <ConfidenceButton
                    active={confidence === "unclear"}
                    title="هنوز مبهم است"
                    description="تشخیص لایه اصلی سؤال را دوباره تمرین می‌کنم."
                    onClick={() => setConfidence("unclear")}
                  />

                  <ConfidenceButton
                    active={confidence === "developing"}
                    title="تقریباً متوجه شدم"
                    description="می‌توانم بیشتر سؤال‌ها را دسته‌بندی کنم ولی بعضی موارد مرزی هنوز سخت‌اند."
                    onClick={() => setConfidence("developing")}
                  />

                  <ConfidenceButton
                    active={confidence === "clear"}
                    title="کاملاً روشن است"
                    description="می‌توانم قبل از انتخاب ابزار، سؤال را در لایه مناسب قرار دهم."
                    onClick={() => setConfidence("clear")}
                  />
                </div>
              </div>

              <div className="mt-7 rounded-3xl bg-slate-950 p-6 text-white">
                <p className="text-xs font-bold text-teal-300">
                  لحظه فهم این درس
                </p>

                <p className="mt-3 text-lg font-bold leading-9">
                  ترنسکریپتومیکس زمانی انتخاب مناسبی است که سؤال اصلی درباره وضعیت یا تغییرات RNA باشد؛ نه صرفاً چون RNA-seq یک فناوری قدرتمند و در دسترس است.
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
                    ? "ثبت تسلط درس پنجم"
                    : "پایان درس پنجم در حالت مهمان"}
                </button>

                <button
                  type="button"
                  onClick={restartLesson}
                  className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                >
                  <RotateCcw className="size-4" />
                  مرور دوباره درس پنجم
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
                    وضعیت درس پنجم در حساب شما ذخیره شد.
                  </p>

                  <p className="mt-2 text-sm leading-7 text-emerald-800">
                    {savedProgress.status === "needs_review"
                      ? "این درس برای مرور دوباره علامت خورده است."
                      : "درس پنجم با موفقیت تکمیل شده است."}
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
                  درس ۶ — Bulk، Single-cell یا Spatial؟
                </h3>

                <p className="mt-2 text-sm leading-7 text-slate-600">
                  در درس ششم یک بافت ناهمگن را از سه زاویه می‌بینیم و یاد می‌گیریم چرا وضوح بیشتر همیشه به معنی انتخاب بهتر نیست.
                </p>

                <button
                  type="button"
                  disabled
                  className="mt-5 rounded-xl bg-slate-200 px-4 py-2.5 text-sm font-bold text-slate-500"
                >
                  درس ششم در مرحله بعد ساخته می‌شود
                </button>
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

function CaseCard({
  title,
  text,
  badge,
  emphasized = false,
}: {
  title: string;
  text: string;
  badge: string;
  emphasized?: boolean;
}) {
  return (
    <div
      className={[
        "rounded-3xl border p-5",
        emphasized
          ? "border-teal-300 bg-teal-50"
          : "border-slate-200 bg-slate-50",
      ].join(" ")}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="font-black text-slate-950">{title}</p>
        <span className="rounded-full bg-white px-3 py-1 text-[11px] font-bold text-slate-600">
          {badge}
        </span>
      </div>

      <p className="mt-4 text-sm leading-8 text-slate-600">{text}</p>
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
        درس پنجم ذخیره شده
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
