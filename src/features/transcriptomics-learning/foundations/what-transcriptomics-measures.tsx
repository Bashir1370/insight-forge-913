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
  CircleDot,
  Dna,
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

type EvidenceLayer =
  | "dna"
  | "rna"
  | "protein"
  | "phenotype";

type ProjectReflection =
  | "rna"
  | "protein"
  | "phenotype"
  | "mechanism"
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
const NODE_ID = "f4-what-transcriptomics-measures";

const sceneTitles = [
  "چه چیزی می‌بینیم؟",
  "لایه‌های شواهد",
  "آزمایشگاه تفسیر",
  "زنجیره ادعا",
  "پروژه داروی X",
  "کلینیک اشتباه",
  "تسلط",
];

const layerInfo: Record<
  EvidenceLayer,
  {
    title: string;
    description: string;
    directness: string;
  }
> = {
  dna: {
    title: "DNA",
    description:
      "اطلاعات ژنتیکی و تغییرات در سطح ژنوم را بررسی می‌کند.",
    directness:
      "برای سؤال‌های مربوط به توالی DNA، جهش‌ها یا ساختار ژنومی مناسب‌تر است.",
  },
  rna: {
    title: "RNA",
    description:
      "وضعیت RNAهای موجود یا اندازه‌گیری‌شده در نمونه را بررسی می‌کند.",
    directness:
      "ترنسکریپتومیکس مستقیماً در این لایه قرار می‌گیرد.",
  },
  protein: {
    title: "پروتئین",
    description:
      "فراوانی و وضعیت پروتئین‌ها را بررسی می‌کند.",
    directness:
      "از داده RNA نمی‌توان مقدار پروتئین را به‌صورت مستقیم و قطعی نتیجه گرفت.",
  },
  phenotype: {
    title: "فنوتیپ",
    description:
      "ویژگی یا رفتار قابل مشاهده سلول، بافت یا موجود زنده را توصیف می‌کند.",
    directness:
      "برای پیوند RNA به فنوتیپ معمولاً به شواهد و طراحی‌های تکمیلی نیاز داریم.",
  },
};

const reflectionLabels: Record<ProjectReflection, string> = {
  rna: "سؤال من مستقیماً درباره تغییر RNA است",
  protein: "سؤال من مستقیماً درباره پروتئین است",
  phenotype: "سؤال من بیشتر درباره فنوتیپ یا پاسخ زیستی است",
  mechanism: "می‌خواهم درباره مکانیسم زیستی نتیجه‌گیری کنم",
  unsure: "هنوز مطمئن نیستم",
};

export function WhatTranscriptomicsMeasuresLesson() {
  const { session } = useAuth();
  const userId = session?.user?.id ?? null;

  const [scene, setScene] = useState(0);
  const [openingAnswer, setOpeningAnswer] = useState<number | null>(null);
  const [selectedLayer, setSelectedLayer] =
    useState<EvidenceLayer>("rna");
  const [interpretationAnswer, setInterpretationAnswer] =
    useState<number | null>(null);
  const [claimAnswer, setClaimAnswer] = useState<number | null>(null);
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
        console.error("Failed to load F4 progress:", error);
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

  const selectedLayerInfo = layerInfo[selectedLayer];

  const canFinish =
    masteryAnswer !== null && Boolean(confidence);

  const claimStrength = useMemo(() => {
    if (claimAnswer === null) {
      return "هنوز ادعایی انتخاب نشده است.";
    }

    if (claimAnswer === 0) {
      return "این ادعا در محدوده داده RNA باقی می‌ماند.";
    }

    if (claimAnswer === 1) {
      return "این ادعا از RNA به پروتئین می‌پرد و به شواهد مستقیم پروتئینی نیاز دارد.";
    }

    return "این ادعا به رابطه علّی درباره فنوتیپ می‌رسد و به شواهد بسیار بیشتری نیاز دارد.";
  }, [claimAnswer]);

  function goToScene(nextScene: number) {
    setScene(nextScene);

    window.setTimeout(() => {
      document.getElementById("f4-scene")?.scrollIntoView({
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
      console.error("Failed to save F4 progress:", error);
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
    setSelectedLayer("rna");
    setInterpretationAnswer(null);
    setClaimAnswer(null);
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
      foundationIndex={4}
      total={7}
      title="ترنسکریپتومیکس دقیقاً چه چیزی اندازه می‌گیرد؟"
      subtitle="در این درس بین چهار لایه DNA، RNA، پروتئین و فنوتیپ تفکیک می‌کنیم تا یاد بگیریم داده ترنسکریپتومیکس مستقیماً چه چیزی را نشان می‌دهد و کجا برای نتیجه‌گیری به شواهد بیشتری نیاز داریم."
      currentScene={scene}
      sceneCount={sceneTitles.length}
      sceneLabel={sceneTitles[scene]}
    >
      <section id="f4-scene" className="scroll-mt-6">
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
              eyebrow="شروع با یک مرز علمی"
              title="اگر RNA یک ژن بیشتر شود، دقیقاً چه چیزی را می‌توانیم بگوییم؟"
              description="این درس درباره مرز بین مشاهده مستقیم و تفسیر زیستی است."
            >
              <div className="rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white">
                <p className="text-sm font-bold text-teal-300">
                  مشاهده
                </p>

                <p className="mt-3 text-2xl font-black leading-10">
                  پس از تیمار، مقدار RNA مربوط به ژن X افزایش یافته است.
                </p>
              </div>

              <DecisionQuestion
                question="کدام جمله مستقیماً توسط همین مشاهده پشتیبانی می‌شود؟"
                options={[
                  "مقدار RNA مربوط به ژن X در شرایط تیمار بیشتر مشاهده شده است.",
                  "مقدار پروتئین X حتماً بیشتر شده است.",
                  "ژن X علت اصلی تغییر فنوتیپ است.",
                  "دارو حتماً مسیر بیماری را متوقف کرده است.",
                ]}
                selected={openingAnswer}
                correctIndex={0}
                onSelect={setOpeningAnswer}
                correctFeedback="دقیقاً. این جمله در همان لایه‌ای باقی می‌ماند که داده مستقیماً درباره آن اطلاعات دارد."
                incorrectFeedback="این نتیجه از لایه RNA فراتر می‌رود. برای پروتئین، فنوتیپ یا رابطه علّی به شواهد بیشتری نیاز داریم."
              />

              <InsightBox>
                اصل این درس: <strong>داده را در همان لایه‌ای تفسیر کن که واقعاً اندازه‌گیری شده است.</strong>
              </InsightBox>
            </SceneCard>
          )}

          {scene === 1 && (
            <SceneCard
              eyebrow="لایه‌های شواهد"
              title="DNA، RNA، پروتئین و فنوتیپ چهار سؤال یکسان نیستند."
              description="روی هر لایه کلیک کنید و ببینید ترنسکریپتومیکس در کجای این نقشه قرار می‌گیرد."
            >
              <div className="grid gap-3 md:grid-cols-4">
                {(Object.keys(layerInfo) as EvidenceLayer[]).map(
                  (layer) => (
                    <button
                      key={layer}
                      type="button"
                      onClick={() => setSelectedLayer(layer)}
                      className={[
                        "rounded-2xl border p-4 text-right transition",
                        selectedLayer === layer
                          ? "border-teal-500 bg-teal-50 shadow-sm"
                          : "border-slate-200 bg-white hover:border-teal-300",
                      ].join(" ")}
                    >
                      <p className="font-black text-slate-950">
                        {layerInfo[layer].title}
                      </p>

                      <p className="mt-2 text-xs leading-6 text-slate-500">
                        {layerInfo[layer].description}
                      </p>
                    </button>
                  ),
                )}
              </div>

              <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white">
                <div className="flex items-center gap-3">
                  <CircleDot className="size-5 text-teal-300" />
                  <p className="text-xl font-black">
                    {selectedLayerInfo.title}
                  </p>
                </div>

                <p className="mt-4 text-sm leading-8 text-slate-300">
                  {selectedLayerInfo.directness}
                </p>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-4">
                <LayerStep title="DNA" active={false} />
                <LayerStep title="RNA" active />
                <LayerStep title="پروتئین" active={false} />
                <LayerStep title="فنوتیپ" active={false} />
              </div>

              <p className="mt-4 text-xs leading-7 text-slate-500">
                این زنجیره فقط برای تفکیک لایه‌های شواهد است و به معنی یک مسیر ساده و یک‌طرفه برای همه فرایندهای زیستی نیست.
              </p>
            </SceneCard>
          )}

          {scene === 2 && (
            <SceneCard
              eyebrow="آزمایشگاه تفسیر"
              title="از یک مشاهده RNA، کدام نتیجه قابل دفاع‌تر است؟"
              description="سه ادعا را مقایسه کنید. فقط یکی در محدوده مستقیم داده RNA باقی می‌ماند."
            >
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <p className="text-xs font-bold text-teal-700">
                  داده
                </p>

                <p className="mt-2 text-lg font-black text-slate-950">
                  RNA ژن X پس از تیمار حدوداً بیشتر از گروه کنترل مشاهده شده است.
                </p>
              </div>

              <DecisionQuestion
                question="کدام تفسیر مناسب‌تر است؟"
                options={[
                  "در این مقایسه، مقدار RNA مربوط به ژن X در گروه تیمار بیشتر مشاهده شده است.",
                  "پروتئین X حتماً به همان نسبت افزایش یافته است.",
                  "ژن X ثابت کرده علت پاسخ درمانی است.",
                ]}
                selected={interpretationAnswer}
                correctIndex={0}
                onSelect={setInterpretationAnswer}
                correctFeedback="درست است. این عبارت دقیقاً در محدوده مشاهده RNA باقی می‌ماند."
                incorrectFeedback="این ادعا از داده RNA به لایه دیگری می‌پرد. برای چنین نتیجه‌ای به اندازه‌گیری یا طراحی تکمیلی نیاز داریم."
              />

              <InsightBox>
                <strong>مشاهده مستقیم</strong> و <strong>توضیح مکانیکی</strong> یک چیز نیستند.
              </InsightBox>
            </SceneCard>
          )}

          {scene === 3 && (
            <SceneCard
              eyebrow="آزمایشگاه زنجیره ادعا"
              title="هرچه ادعا از RNA دورتر شود، شواهد بیشتری لازم داریم."
              description="یک ادعا انتخاب کنید و ببینید از نظر قدرت شواهد در چه سطحی قرار می‌گیرد."
            >
              <div className="grid gap-3">
                <ClaimButton
                  active={claimAnswer === 0}
                  title="ادعای ۱"
                  text="پس از تیمار، مقدار RNA ژن X بیشتر مشاهده شده است."
                  onClick={() => setClaimAnswer(0)}
                />

                <ClaimButton
                  active={claimAnswer === 1}
                  title="ادعای ۲"
                  text="پس از تیمار، مقدار پروتئین X افزایش یافته است."
                  onClick={() => setClaimAnswer(1)}
                />

                <ClaimButton
                  active={claimAnswer === 2}
                  title="ادعای ۳"
                  text="افزایش ژن X علت اصلی تغییر فنوتیپ پس از تیمار است."
                  onClick={() => setClaimAnswer(2)}
                />
              </div>

              <div className="mt-6 rounded-3xl bg-slate-950 p-6 text-white">
                <p className="text-xs font-bold text-teal-300">
                  ارزیابی ادعا
                </p>

                <p className="mt-3 text-sm leading-8 text-slate-200">
                  {claimStrength}
                </p>
              </div>

              <div className="mt-6 grid gap-3 md:grid-cols-3">
                <EvidenceCard
                  title="RNA"
                  text="برای ادعای مربوط به مقدار RNA، داده ترنسکریپتومیکس مستقیماً مرتبط است."
                  emphasized
                />

                <EvidenceCard
                  title="پروتئین"
                  text="برای ادعای مستقیم درباره پروتئین، بهتر است اندازه‌گیری پروتئینی داشته باشیم."
                />

                <EvidenceCard
                  title="علّیت"
                  text="برای ادعای علّی درباره فنوتیپ معمولاً طراحی مداخله‌ای و اعتبارسنجی بیشتری لازم است."
                />
              </div>
            </SceneCard>
          )}

          {scene === 4 && (
            <SceneCard
              eyebrow="پروژه همراه شما"
              title="داروی X در سلول‌های سرطان پانکراس"
              description="حالا همان اصل را روی پروژه پیوسته هاب‌ژن اعمال می‌کنیم."
            >
              <div className="grid gap-4 md:grid-cols-2">
                <CaseCondition
                  title="گروه کنترل"
                  detail="مقدار RNA ژن X: پایین‌تر"
                />

                <CaseCondition
                  title="داروی X"
                  detail="مقدار RNA ژن X: بالاتر"
                  emphasized
                />
              </div>

              <DecisionQuestion
                question="با همین داده، کدام جمله علمی‌تر است؟"
                options={[
                  "داروی X قطعاً پروتئین X را افزایش داده است.",
                  "پس از داروی X، مقدار RNA ژن X در این مدل سلولی بیشتر مشاهده شده است.",
                  "ژن X علت اصلی بقای سلول‌های سرطانی است.",
                  "داروی X اثربخشی بالینی در بیمار را ثابت کرده است.",
                ]}
                selected={caseAnswer}
                correctIndex={1}
                onSelect={setCaseAnswer}
                correctFeedback="دقیقاً. این جمله از داده‌ای که داریم جلوتر نمی‌رود."
                incorrectFeedback="این ادعا به پروتئین، علّیت یا اثربخشی بالینی می‌رسد؛ در حالی که فعلاً فقط داده RNA داریم."
              />

              <div className="mt-7 rounded-3xl border border-teal-200 bg-gradient-to-br from-teal-50 via-white to-cyan-50 p-6">
                <div className="flex items-start gap-3">
                  <FlaskConical className="mt-1 size-5 shrink-0 text-teal-700" />
                  <div>
                    <p className="font-bold text-teal-950">
                      سؤال بعدی یک پژوهشگر خوب
                    </p>

                    <p className="mt-2 text-sm leading-8 text-slate-600">
                      اگر تغییر RNA برای سؤال شما مهم است، ترنسکریپتومیکس می‌تواند اطلاعات ارزشمندی بدهد. اگر هدف اصلی شما پروتئین، عملکرد سلولی یا اثبات مکانیسم است، باید به فکر شواهد تکمیلی باشید.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 border-t border-slate-100 pt-7">
                <p className="font-bold text-slate-950">
                  سؤال پروژه شما بیشتر در کدام لایه قرار می‌گیرد؟
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
                    {reflection === "rna"
                      ? "این نوع سؤال به‌طور مستقیم به لایه ترنسکریپتومیکس نزدیک است."
                      : reflection === "unsure"
                        ? "اشکالی ندارد. در درس بعد دقیق‌تر یاد می‌گیریم چه سؤال‌هایی برای ترنسکریپتومیکس مناسب‌ترند."
                        : "ترنسکریپتومیکس ممکن است بخشی از پاسخ را بدهد، اما برای سؤال اصلی شما احتمالاً به لایه‌های شواهد دیگری هم نیاز است."}
                  </InsightBox>
                )}
              </div>
            </SceneCard>
          )}

          {scene === 5 && (
            <SceneCard
              eyebrow="کلینیک اشتباه"
              title="«RNA بیشتر شده، پس پروتئین بیشتر شده و این ژن علت فنوتیپ است.»"
              description="یک زنجیره نتیجه‌گیری بیش از حد را با هم باز می‌کنیم."
            >
              <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6">
                <div className="flex items-start gap-3">
                  <Dna className="mt-1 size-5 shrink-0 text-amber-800" />
                  <p className="font-black leading-8 text-amber-950">
                    این جمله سه لایه متفاوت را بدون شواهد کافی به هم وصل می‌کند: RNA، پروتئین و فنوتیپ.
                  </p>
                </div>
              </div>

              <DecisionQuestion
                question="بهترین اصلاح این برداشت چیست؟"
                options={[
                  "داده RNA درباره RNA اطلاعات می‌دهد؛ برای پروتئین و نقش علّی باید شواهد مستقیم یا تکمیلی داشته باشیم.",
                  "اگر RNA تغییر کند، همه لایه‌های بعدی حتماً دقیقاً همان‌طور تغییر می‌کنند.",
                  "هر همبستگی بین RNA و فنوتیپ به معنی رابطه علّی است.",
                ]}
                selected={mistakeAnswer}
                correctIndex={0}
                onSelect={setMistakeAnswer}
                correctFeedback="درست است. هر لایه شواهد باید با داده متناسب خودش پشتیبانی شود."
                incorrectFeedback="RNA می‌تواند با پروتئین و فنوتیپ مرتبط باشد، اما این ارتباط به‌تنهایی برابری یا علّیت را ثابت نمی‌کند."
              />

              <InsightBox>
                اصل مهم: <strong>ارتباط ≠ علّیت</strong> و <strong>RNA ≠ پروتئین ≠ فنوتیپ</strong>.
              </InsightBox>
            </SceneCard>
          )}

          {scene === 6 && (
            <SceneCard
              eyebrow="ایستگاه تسلط"
              title="آیا می‌توانید مرز بین داده و ادعا را نگه دارید؟"
              description="سؤال نهایی روی همان مهارتی تمرکز دارد که در پژوهش واقعی بسیار مهم است."
            >
              <DecisionQuestion
                question="در یک مطالعه ترنسکریپتومیکس، مقدار RNA ژن X در گروه بیماری بیشتر از گروه کنترل است. کدام برداشت مناسب‌تر است؟"
                options={[
                  "پروتئین X حتماً بیشتر است و ژن X علت بیماری است.",
                  "در این مطالعه، مقدار RNA مربوط به ژن X در گروه بیماری بیشتر مشاهده شده است؛ برای ادعا درباره پروتئین یا علّیت به شواهد بیشتری نیاز داریم.",
                  "ژن X حتماً در DNA گروه بیماری تکثیر شده است.",
                  "این نتیجه به‌تنهایی اثربخشی یک درمان را ثابت می‌کند.",
                ]}
                selected={masteryAnswer}
                correctIndex={1}
                onSelect={setMasteryAnswer}
                correctFeedback="عالی. شما مشاهده RNA را از ادعاهای پروتئینی، علّی و بالینی جدا کرده‌اید."
                incorrectFeedback="به اصل اصلی برگردید: ترنسکریپتومیکس مستقیماً درباره لایه RNA اطلاعات می‌دهد، نه همه لایه‌های پایین‌دستی."
              />

              <div className="mt-8">
                <p className="font-bold text-slate-950">
                  این مفهوم چقدر برایتان روشن است؟
                </p>

                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  <ConfidenceButton
                    active={confidence === "unclear"}
                    title="هنوز مبهم است"
                    description="مرز بین RNA، پروتئین و فنوتیپ را دوباره مرور می‌کنم."
                    onClick={() => setConfidence("unclear")}
                  />

                  <ConfidenceButton
                    active={confidence === "developing"}
                    title="تقریباً متوجه شدم"
                    description="اصل را فهمیده‌ام ولی هنوز در تفسیر بعضی ادعاها تردید دارم."
                    onClick={() => setConfidence("developing")}
                  />

                  <ConfidenceButton
                    active={confidence === "clear"}
                    title="کاملاً روشن است"
                    description="می‌توانم بگویم داده RNA چه چیزی را مستقیم نشان می‌دهد و چه چیزی نیاز به شواهد بیشتر دارد."
                    onClick={() => setConfidence("clear")}
                  />
                </div>
              </div>

              <div className="mt-7 rounded-3xl bg-slate-950 p-6 text-white">
                <p className="text-xs font-bold text-teal-300">
                  لحظه فهم این درس
                </p>

                <p className="mt-3 text-lg font-bold leading-9">
                  ترنسکریپتومیکس مستقیماً درباره وضعیت RNA اطلاعات می‌دهد؛ برای ادعا درباره پروتئین، فنوتیپ یا مکانیسم علّی باید شواهد بیشتری داشته باشیم.
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
                    ? "ثبت تسلط درس چهارم"
                    : "پایان درس چهارم در حالت مهمان"}
                </button>

                <button
                  type="button"
                  onClick={restartLesson}
                  className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                >
                  <RotateCcw className="size-4" />
                  مرور دوباره درس چهارم
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
                    وضعیت درس چهارم در حساب شما ذخیره شد.
                  </p>

                  <p className="mt-2 text-sm leading-7 text-emerald-800">
                    {savedProgress.status === "needs_review"
                      ? "این درس برای مرور دوباره علامت خورده است."
                      : "درس چهارم با موفقیت تکمیل شده است."}
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
                  درس ۵ — چه سؤال‌هایی برای ترنسکریپتومیکس مناسب‌اند؟
                </h3>

                <p className="mt-2 text-sm leading-7 text-slate-600">
                  در درس پنجم چند سؤال واقعی را مقایسه می‌کنیم و یاد می‌گیریم چه زمانی ترنسکریپتومیکس انتخاب مناسبی است و چه زمانی باید سراغ لایه یا روش دیگری رفت.
                </p>

                <button
                  type="button"
                  disabled
                  className="mt-5 rounded-xl bg-slate-200 px-4 py-2.5 text-sm font-bold text-slate-500"
                >
                  درس پنجم در مرحله بعد ساخته می‌شود
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

function LayerStep({
  title,
  active,
}: {
  title: string;
  active: boolean;
}) {
  return (
    <div
      className={[
        "rounded-2xl border p-4 text-center text-sm font-black",
        active
          ? "border-teal-500 bg-teal-50 text-teal-900"
          : "border-slate-200 bg-white text-slate-500",
      ].join(" ")}
    >
      {title}
    </div>
  );
}

function ClaimButton({
  active,
  title,
  text,
  onClick,
}: {
  active: boolean;
  title: string;
  text: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-3xl border p-5 text-right transition",
        active
          ? "border-teal-500 bg-teal-50 shadow-sm"
          : "border-slate-200 bg-white hover:border-teal-300",
      ].join(" ")}
    >
      <p className="text-xs font-bold text-teal-700">{title}</p>
      <p className="mt-2 font-bold leading-8 text-slate-950">{text}</p>
    </button>
  );
}

function EvidenceCard({
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
        "rounded-3xl border p-5",
        emphasized
          ? "border-teal-300 bg-teal-50"
          : "border-slate-200 bg-slate-50",
      ].join(" ")}
    >
      <p className="font-black text-slate-950">{title}</p>
      <p className="mt-3 text-sm leading-7 text-slate-600">{text}</p>
    </div>
  );
}

function CaseCondition({
  title,
  detail,
  emphasized = false,
}: {
  title: string;
  detail: string;
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
      <p className="font-black text-slate-950">{title}</p>
      <p className="mt-3 text-sm leading-7 text-slate-600">{detail}</p>
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
        درس چهارم ذخیره شده
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
