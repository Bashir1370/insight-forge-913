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
  Layers3,
  Lightbulb,
  Loader2,
  MapPinned,
  RotateCcw,
  Sparkles,
  UsersRound,
} from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { InteractiveLessonShell } from "../components/InteractiveLessonShell";

type Confidence = "unclear" | "developing" | "clear";
type SaveState = "guest" | "loading" | "idle" | "saving" | "saved" | "error";
type ObservationLevel = "bulk" | "single-cell" | "spatial";
type ProjectReflection = "average" | "cell-types" | "location" | "unsure";

type LearningProgressRow = {
  status: "not_started" | "in_progress" | "completed" | "needs_review";
  confidence: Confidence | null;
  selected_answer: number | null;
  is_correct: boolean | null;
  updated_at: string;
};

const RESEARCH_LINE = "transcriptomics-foundations";
const NODE_ID = "f6-bulk-single-cell-spatial";

const sceneTitles = [
  "سطح مشاهده یعنی چه؟",
  "آزمایشگاه سه نما",
  "سطح مشاهده یا فناوری؟",
  "انتخاب بر اساس سؤال",
  "نمونه با سلول فرق دارد",
  "پروژه سرطان پانکراس",
  "تسلط",
];

const levelInfo: Record<
  ObservationLevel,
  {
    title: string;
    short: string;
    description: string;
    technologyNote: string;
  }
> = {
  bulk: {
    title: "ترنسکریپتومیکس توده‌ای",
    short: "نمای ترکیبی در سطح نمونه",
    description:
      "RNA تعداد زیادی سلول در یک نمونه به‌صورت ترکیبی دیده می‌شود. سؤال اصلی در سطح نمونه تعریف می‌شود، نه در سطح هر سلول منفرد.",
    technologyNote:
      "این سطح مشاهده می‌تواند با فناوری‌هایی مانند RNA-seq یا Microarray ایجاد شود. بنابراین «توده‌ای» خودش نام یک فناوری واحد نیست.",
  },
  "single-cell": {
    title: "ترنسکریپتومیکس تک‌سلولی",
    short: "نمای سلول‌به‌سلول",
    description:
      "RNA در سطح سلول‌ها بررسی می‌شود تا ناهمگنی، زیرجمعیت‌ها و حالت‌های سلولی بهتر دیده شوند.",
    technologyNote:
      "یکی از رایج‌ترین روش‌های امروزی برای این سطح مشاهده scRNA-seq است. «تک‌سلولی» سطح مشاهده است و scRNA-seq یک فناوری رایج برای رسیدن به آن.",
  },
  spatial: {
    title: "ترنسکریپتومیکس فضایی",
    short: "RNA همراه با زمینه مکانی",
    description:
      "اطلاعات RNA همراه با موقعیت در بافت حفظ می‌شود تا بتوان بیان را به معماری بافت و نواحی مختلف مرتبط کرد.",
    technologyNote:
      "ترنسکریپتومیکس فضایی یک خانواده از فناوری‌هاست. همه پلتفرم‌ها وضوح، پوشش و منطق اندازه‌گیری یکسانی ندارند.",
  },
};

const reflectionLabels: Record<ProjectReflection, string> = {
  average: "می‌خواهم پاسخ کلی نمونه یا بافت را بدانم",
  "cell-types": "می‌خواهم تفاوت بین انواع یا حالت‌های سلولی را ببینم",
  location: "موقعیت سلول‌ها یا نواحی در بافت برایم مهم است",
  unsure: "هنوز مطمئن نیستم",
};

const tissueCells = [
  "cancer", "cancer", "immune", "stromal",
  "cancer", "immune", "immune", "stromal",
  "cancer", "cancer", "stromal", "immune",
  "stromal", "cancer", "immune", "cancer",
] as const;

function cellClass(type: string) {
  if (type === "cancer") return "bg-rose-400";
  if (type === "immune") return "bg-cyan-400";
  return "bg-amber-300";
}

export function BulkSingleCellSpatialLesson() {
  const { session } = useAuth();
  const userId = session?.user?.id ?? null;

  const [scene, setScene] = useState(0);
  const [openingAnswer, setOpeningAnswer] = useState<number | null>(null);
  const [level, setLevel] = useState<ObservationLevel>("bulk");
  const [conceptAnswer, setConceptAnswer] = useState<number | null>(null);
  const [question1, setQuestion1] = useState<number | null>(null);
  const [question2, setQuestion2] = useState<number | null>(null);
  const [question3, setQuestion3] = useState<number | null>(null);
  const [replicateAnswer, setReplicateAnswer] = useState<number | null>(null);
  const [caseAnswer, setCaseAnswer] = useState<number | null>(null);
  const [mistakeAnswer, setMistakeAnswer] = useState<number | null>(null);
  const [reflection, setReflection] = useState<ProjectReflection | null>(null);
  const [masteryAnswer, setMasteryAnswer] = useState<number | null>(null);
  const [confidence, setConfidence] = useState<Confidence | null>(null);
  const [saveState, setSaveState] = useState<SaveState>("guest");
  const [saveError, setSaveError] = useState("");
  const [savedProgress, setSavedProgress] = useState<LearningProgressRow | null>(null);

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
        .select("status, confidence, selected_answer, is_correct, updated_at")
        .eq("user_id", userId)
        .eq("research_line", RESEARCH_LINE)
        .eq("node_id", NODE_ID)
        .maybeSingle();

      if (cancelled) return;

      if (error) {
        console.error("Failed to load F6 progress:", error);
        setSaveState("error");
        setSaveError("بازیابی وضعیت قبلی این درس انجام نشد.");
        return;
      }

      if (data) {
        const row = data as LearningProgressRow;
        setSavedProgress(row);
        if (row.selected_answer !== null) setMasteryAnswer(row.selected_answer);
        if (row.confidence) setConfidence(row.confidence);
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

  const selectedInfo = levelInfo[level];
  const canFinish = masteryAnswer !== null && Boolean(confidence);

  const cellCounts = useMemo(() => {
    return tissueCells.reduce(
      (acc, type) => {
        acc[type] += 1;
        return acc;
      },
      { cancer: 0, immune: 0, stromal: 0 },
    );
  }, []);

  function goToScene(nextScene: number) {
    setScene(nextScene);
    window.setTimeout(() => {
      document.getElementById("f6-scene")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 20);
  }

  function goNext() {
    if (scene < sceneTitles.length - 1) goToScene(scene + 1);
  }

  function goPrevious() {
    if (scene > 0) goToScene(scene - 1);
  }

  async function saveMastery() {
    if (!canFinish || !userId) {
      setSaveState("guest");
      return;
    }

    const isCorrect = masteryAnswer === 1;
    const status = confidence === "unclear" || !isCorrect ? "needs_review" : "completed";

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
        { onConflict: "user_id,research_line,node_id" },
      );

    if (error) {
      console.error("Failed to save F6 progress:", error);
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
    setLevel("bulk");
    setConceptAnswer(null);
    setQuestion1(null);
    setQuestion2(null);
    setQuestion3(null);
    setReplicateAnswer(null);
    setCaseAnswer(null);
    setMistakeAnswer(null);
    setReflection(null);
    setMasteryAnswer(null);
    setConfidence(null);
    window.setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 20);
  }

  return (
    <InteractiveLessonShell
      foundationIndex={6}
      total={7}
      title="توده‌ای، تک‌سلولی یا فضایی؟"
      subtitle="در این درس سه سطح مشاهده را از هم جدا می‌کنیم. هدف این است که «سطح مشاهده» را با «فناوری اندازه‌گیری» قاطی نکنیم و روش را بر اساس سؤال پژوهشی انتخاب کنیم."
      currentScene={scene}
      sceneCount={sceneTitles.length}
      sceneLabel={sceneTitles[scene]}
    >
      <section id="f6-scene" className="scroll-mt-6">
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
              eyebrow="اول یک تفکیک مهم"
              title="«توده‌ای» و «تک‌سلولی» بیشتر درباره سطح مشاهده‌اند؛ RNA-seq و Microarray درباره فناوری اندازه‌گیری."
              description="اگر این دو مفهوم را قاطی کنیم، ممکن است ناخواسته تصور کنیم ترنسکریپتومیکس فقط RNA-seq است."
            >
              <div className="grid gap-4 lg:grid-cols-2">
                <ConceptCard
                  title="سطح مشاهده"
                  text="می‌گوید داده را در چه مقیاسی می‌بینیم: در سطح کل نمونه، در سطح سلول‌ها یا همراه با موقعیت در بافت."
                  emphasized
                />
                <ConceptCard
                  title="فناوری اندازه‌گیری"
                  text="می‌گوید RNA با چه روش فنی اندازه‌گیری شده است؛ مانند RNA-seq، Microarray یا فناوری‌های فضایی مختلف."
                />
              </div>

              <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white">
                <p className="text-xs font-bold text-teal-300">یک مثال مهم</p>
                <p className="mt-3 text-lg font-black leading-9">
                  ترنسکریپتومیکس توده‌ای می‌تواند با RNA-seq انجام شود یا با Microarray.
                </p>
              </div>

              <DecisionQuestion
                question="کدام جمله دقیق‌تر است؟"
                options={[
                  "توده‌ای خودش یک فناوری واحد مثل RNA-seq است.",
                  "توده‌ای یک سطح مشاهده است و می‌تواند با فناوری‌های مختلفی مانند RNA-seq یا Microarray ایجاد شود.",
                  "هر مطالعه توده‌ای الزاماً FASTQ دارد.",
                ]}
                selected={openingAnswer}
                correctIndex={1}
                onSelect={setOpeningAnswer}
                correctFeedback="دقیقاً. سطح مشاهده را از فناوری جدا کردید."
                incorrectFeedback="«توده‌ای» درباره مقیاس مشاهده است؛ فناوری اندازه‌گیری می‌تواند RNA-seq، Microarray یا روش دیگری باشد."
              />
            </SceneCard>
          )}

          {scene === 1 && (
            <SceneCard
              eyebrow="آزمایشگاه سه نما"
              title="یک بافت ثابت، سه نوع وضوح متفاوت"
              description="همان بافت سرطان پانکراس را از سه سطح مشاهده ببینید."
            >
              <TissueGrid />

              <div className="mt-6 grid gap-3 md:grid-cols-3">
                <LevelButton
                  active={level === "bulk"}
                  icon={<Layers3 className="size-5" />}
                  title="ترنسکریپتومیکس توده‌ای"
                  onClick={() => setLevel("bulk")}
                />
                <LevelButton
                  active={level === "single-cell"}
                  icon={<UsersRound className="size-5" />}
                  title="ترنسکریپتومیکس تک‌سلولی"
                  onClick={() => setLevel("single-cell")}
                />
                <LevelButton
                  active={level === "spatial"}
                  icon={<MapPinned className="size-5" />}
                  title="ترنسکریپتومیکس فضایی"
                  onClick={() => setLevel("spatial")}
                />
              </div>

              <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white">
                <p className="text-xs font-bold text-teal-300">{selectedInfo.short}</p>
                <h3 className="mt-2 text-2xl font-black">{selectedInfo.title}</h3>
                <p className="mt-3 text-sm leading-8 text-slate-300">{selectedInfo.description}</p>

                <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs font-bold text-cyan-300">ارتباط با فناوری</p>
                  <p className="mt-2 text-sm leading-7 text-slate-300">{selectedInfo.technologyNote}</p>
                </div>

                <div className="mt-7">
                  {level === "bulk" && <BulkView />}
                  {level === "single-cell" && <SingleCellView />}
                  {level === "spatial" && <SpatialView />}
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <LegendCard label="سلول سرطانی" count={cellCounts.cancer} dotClass="bg-rose-400" />
                <LegendCard label="سلول ایمنی" count={cellCounts.immune} dotClass="bg-cyan-400" />
                <LegendCard label="سلول استرومایی" count={cellCounts.stromal} dotClass="bg-amber-300" />
              </div>
            </SceneCard>
          )}

          {scene === 2 && (
            <SceneCard
              eyebrow="سطح مشاهده یا فناوری؟"
              title="این دو لایه را آگاهانه از هم جدا نگه دارید."
              description="این تفکیک کمک می‌کند در درس بعد جای RNA-seq و Microarray را دقیق‌تر بفهمیم."
            >
              <div className="grid gap-5 lg:grid-cols-2">
                <InfoList
                  title="سطح مشاهده"
                  items={[
                    "توده‌ای: نمای ترکیبی در سطح نمونه",
                    "تک‌سلولی: نمای سلول‌به‌سلول",
                    "فضایی: RNA همراه با زمینه مکانی",
                  ]}
                  positive
                />
                <InfoList
                  title="فناوری اندازه‌گیری"
                  items={[
                    "RNA-seq: مبتنی بر توالی‌یابی",
                    "Microarray: مبتنی بر پروب و شدت سیگنال",
                    "فناوری‌های فضایی: خانواده‌ای با منطق‌ها و وضوح‌های مختلف",
                  ]}
                />
              </div>

              <DecisionQuestion
                question="یک مطالعه از RNA بافت کامل استفاده کرده و با Microarray بیان ژن را سنجیده است. این مطالعه از نظر سطح مشاهده در کدام دسته قرار می‌گیرد؟"
                options={["توده‌ای", "تک‌سلولی", "فضایی"]}
                selected={conceptAnswer}
                correctIndex={0}
                onSelect={setConceptAnswer}
                correctFeedback="درست است. فناوری Microarray است، اما سطح مشاهده توده‌ای است."
                incorrectFeedback="چون RNA از کل نمونه بافت به‌صورت ترکیبی اندازه‌گیری شده، سطح مشاهده توده‌ای است."
              />

              <InsightBox>
                همین تفکیک باعث می‌شود بعداً با دیدن یک مجموعه‌داده بدون FASTQ فوراً نتیجه نگیریم که «این داده ترنسکریپتومیکس نیست».
              </InsightBox>
            </SceneCard>
          )}

          {scene === 3 && (
            <SceneCard
              eyebrow="آزمایشگاه تصمیم"
              title="سؤال پژوهشی تعیین می‌کند چه نوع وضوحی لازم دارید."
              description="هدف انتخاب «مناسب‌تر» است، نه بیشترین جزئیات ممکن."
            >
              <DecisionQuestion
                question="۱) می‌خواهم پاسخ کلی RNA یک بافت را بین کنترل و تیمار مقایسه کنم و ناهمگنی سلولی سؤال اصلی من نیست."
                options={[
                  "ترنسکریپتومیکس توده‌ای می‌تواند انتخاب مناسبی باشد.",
                  "حتماً باید تک‌سلولی باشد.",
                  "حتماً باید فضایی باشد.",
                ]}
                selected={question1}
                correctIndex={0}
                onSelect={setQuestion1}
                correctFeedback="درست است. اگر سؤال در سطح نمونه تعریف شده، نمای توده‌ای می‌تواند مناسب باشد."
                incorrectFeedback="وضوح بیشتر همیشه ضروری نیست. سؤال در سطح نمونه می‌تواند با طراحی توده‌ای پاسخ داده شود."
              />

              <DecisionQuestion
                question="۲) می‌خواهم بدانم کدام زیرجمعیت سلولی در تومور به داروی X پاسخ متفاوتی داده است."
                options={[
                  "ترنسکریپتومیکس توده‌ای به‌تنهایی",
                  "ترنسکریپتومیکس تک‌سلولی",
                  "فقط تعیین توالی DNA",
                ]}
                selected={question2}
                correctIndex={1}
                onSelect={setQuestion2}
                correctFeedback="بله. وقتی ناهمگنی سلولی سؤال اصلی است، سطح تک‌سلولی اطلاعات مناسب‌تری می‌دهد."
                incorrectFeedback="برای دیدن تفاوت زیرجمعیت‌های سلولی، سیگنال ترکیبی سطح توده‌ای معمولاً کافی نیست."
              />

              <DecisionQuestion
                question="۳) می‌خواهم بدانم سلول‌های پاسخ‌دهنده در کدام ناحیه تومور قرار گرفته‌اند."
                options={[
                  "ترنسکریپتومیکس فضایی",
                  "ترنسکریپتومیکس توده‌ای",
                  "فقط داده تک‌سلولی بدون اطلاعات مکانی",
                ]}
                selected={question3}
                correctIndex={0}
                onSelect={setQuestion3}
                correctFeedback="دقیقاً. خود موقعیت در بافت بخشی از سؤال است."
                incorrectFeedback="وقتی مکان در بافت مهم است، باید زمینه فضایی حفظ شود."
              />
            </SceneCard>
          )}

          {scene === 4 && (
            <SceneCard
              eyebrow="یک Guardrail مهم"
              title="هزاران سلول، هزاران تکرار زیستی نیستند."
              description="وضوح تک‌سلولی یک مسئله را حل می‌کند، اما مشکل کمبود نمونه مستقل را خودبه‌خود حل نمی‌کند."
            >
              <div className="grid gap-4 md:grid-cols-2">
                <ConceptCard
                  title="سلول"
                  text="واحد مشاهده در داده تک‌سلولی است و سلول‌های یک نمونه معمولاً از همان فرد یا همان نمونه زیستی آمده‌اند."
                />
                <ConceptCard
                  title="تکرار زیستی"
                  text="نمونه مستقل زیستی است؛ مثلاً بیمار، حیوان یا کشت مستقل، بسته به طراحی مطالعه."
                  emphasized
                />
              </div>

              <DecisionQuestion
                question="یک مطالعه از یک بیمار ۱۰٬۰۰۰ سلول گرفته است. آیا این یعنی ۱۰٬۰۰۰ تکرار زیستی مستقل داریم؟"
                options={[
                  "بله، هر سلول یک تکرار زیستی مستقل است.",
                  "خیر، تعداد زیاد سلول‌ها جای نمونه‌های زیستی مستقل را نمی‌گیرد.",
                ]}
                selected={replicateAnswer}
                correctIndex={1}
                onSelect={setReplicateAnswer}
                correctFeedback="دقیقاً. استقلال زیستی در سطح طراحی نمونه تعریف می‌شود، نه صرفاً تعداد سلول‌ها."
                incorrectFeedback="تعداد سلول با تعداد نمونه‌های مستقل یکی نیست."
              />

              <InsightBox>
                <strong>Sample ≠ Cell.</strong> وضوح بیشتر باید کنار طراحی زیستی مناسب قرار بگیرد.
              </InsightBox>
            </SceneCard>
          )}

          {scene === 5 && (
            <SceneCard
              eyebrow="پروژه همراه شما"
              title="داروی X در بافت سرطان پانکراس"
              description="حالا سؤال پروژه را با دو محور می‌خوانیم: سطح مشاهده و فناوری."
            >
              <div className="rounded-3xl border border-teal-200 bg-gradient-to-br from-teal-50 via-white to-cyan-50 p-6">
                <p className="font-black text-teal-950">سؤال پروژه</p>
                <p className="mt-3 text-sm leading-8 text-slate-600">
                  می‌خواهیم بدانیم داروی X بیشتر روی کدام نوع سلول اثر گذاشته و آیا سلول‌های پاسخ‌دهنده در ناحیه خاصی از بافت متمرکز هستند.
                </p>
              </div>

              <DecisionQuestion
                question="برای این سؤال، کدام برداشت مناسب‌تر است؟"
                options={[
                  "یک اندازه‌گیری توده‌ای به‌تنهایی هویت سلول و موقعیت را مستقیم حفظ می‌کند.",
                  "به اطلاعات سلول‌محور و فضایی نیاز داریم؛ فناوری دقیق باید بر اساس طراحی، نمونه و بودجه انتخاب شود.",
                  "فقط Microarray توده‌ای تمام این اطلاعات را مستقیم می‌دهد.",
                ]}
                selected={caseAnswer}
                correctIndex={1}
                onSelect={setCaseAnswer}
                correctFeedback="درست است. اول نوع وضوح را از سؤال استخراج می‌کنیم، بعد فناوری مناسب را انتخاب می‌کنیم."
                incorrectFeedback="نمای توده‌ای برای هویت سلول‌های منفرد و موقعیت آن‌ها کافی نیست."
              />

              <div className="mt-7 rounded-3xl border border-amber-200 bg-amber-50 p-6">
                <p className="font-black text-amber-950">کلینیک اشتباه</p>
                <p className="mt-3 text-sm leading-8 text-amber-900">
                  «تک‌سلولی همیشه از توده‌ای بهتر است، چون جزئیات بیشتری دارد.»
                </p>
              </div>

              <DecisionQuestion
                question="مشکل این جمله چیست؟"
                options={[
                  "جزئیات بیشتر همیشه طراحی بهتر را تضمین می‌کند.",
                  "روش مناسب به سؤال، طراحی، هزینه و نوع نتیجه موردنیاز بستگی دارد؛ وضوح بیشتر همیشه ضروری نیست.",
                  "ترنسکریپتومیکس توده‌ای هیچ کاربرد علمی مهمی ندارد.",
                ]}
                selected={mistakeAnswer}
                correctIndex={1}
                onSelect={setMistakeAnswer}
                correctFeedback="دقیقاً. «پر جزئیات‌تر» مترادف «مناسب‌تر برای سؤال من» نیست."
                incorrectFeedback="انتخاب باید از سؤال پژوهشی و طراحی بیاید، نه از بیشترین وضوح ممکن."
              />

              <div className="mt-8 border-t border-slate-100 pt-7">
                <p className="font-bold text-slate-950">در پروژه شما کدام نوع اطلاعات مهم‌تر است؟</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {(Object.keys(reflectionLabels) as ProjectReflection[]).map((item) => (
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
                  ))}
                </div>

                {reflection && (
                  <InsightBox>
                    {reflection === "average"
                      ? "اگر سؤال شما در سطح نمونه تعریف شده باشد، طراحی توده‌ای می‌تواند کاملاً منطقی باشد؛ فناوری می‌تواند RNA-seq یا در برخی پروژه‌ها Microarray باشد."
                      : reflection === "cell-types"
                        ? "وقتی زیرجمعیت‌های سلولی سؤال اصلی‌اند، سطح تک‌سلولی اهمیت پیدا می‌کند."
                        : reflection === "location"
                          ? "اگر مکان در بافت بخشی از سؤال است، اطلاعات فضایی اهمیت پیدا می‌کند."
                          : "اشکالی ندارد. اول نوع وضوح موردنیاز را روشن کنید؛ انتخاب فناوری مرحله بعد است."}
                  </InsightBox>
                )}
              </div>
            </SceneCard>
          )}

          {scene === 6 && (
            <SceneCard
              eyebrow="ایستگاه تسلط"
              title="آیا می‌توانید سطح مشاهده را از فناوری جدا کنید؟"
              description="این مهارت پایه ورود به درس هفتم است."
            >
              <DecisionQuestion
                question="یک مطالعه بیان ژن را از RNA کل بافت با Microarray اندازه‌گیری کرده است. کدام جمله دقیق‌تر است؟"
                options={[
                  "چون Microarray است، مطالعه دیگر توده‌ای نیست.",
                  "سطح مشاهده توده‌ای است و فناوری اندازه‌گیری Microarray.",
                  "هر مطالعه توده‌ای باید RNA-seq و FASTQ داشته باشد.",
                  "Microarray فقط برای داده تک‌سلولی استفاده می‌شود.",
                ]}
                selected={masteryAnswer}
                correctIndex={1}
                onSelect={setMasteryAnswer}
                correctFeedback="عالی. دقیقاً همان تفکیکی را انجام دادید که برای فهم نقشه ترنسکریپتومیکس لازم است."
                incorrectFeedback="به دو سؤال جدا برگردید: «در چه مقیاسی می‌بینیم؟» و «با چه فناوری اندازه می‌گیریم؟»"
              />

              <div className="mt-8">
                <p className="font-bold text-slate-950">این مفهوم چقدر برایتان روشن است؟</p>
                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  <ConfidenceButton active={confidence === "unclear"} title="هنوز مبهم است" description="سطح مشاهده و فناوری هنوز برایم قاطی می‌شوند." onClick={() => setConfidence("unclear")} />
                  <ConfidenceButton active={confidence === "developing"} title="تقریباً متوجه شدم" description="تفکیک را می‌فهمم ولی بعضی مثال‌ها هنوز نیاز به تمرین دارند." onClick={() => setConfidence("developing")} />
                  <ConfidenceButton active={confidence === "clear"} title="کاملاً روشن است" description="می‌توانم سطح مشاهده را از فناوری اندازه‌گیری جدا کنم." onClick={() => setConfidence("clear")} />
                </div>
              </div>

              <div className="mt-7 rounded-3xl bg-slate-950 p-6 text-white">
                <p className="text-xs font-bold text-teal-300">لحظه فهم این درس</p>
                <p className="mt-3 text-lg font-bold leading-9">
                  توده‌ای، تک‌سلولی و فضایی درباره نوع وضوح‌اند؛ RNA-seq و Microarray درباره فناوری اندازه‌گیری‌اند.
                </p>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  disabled={!canFinish || saveState === "saving"}
                  onClick={() => void saveMastery()}
                  className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-teal-700 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  {saveState === "saving" ? <Loader2 className="size-4 animate-spin" /> : <CheckCircle2 className="size-4" />}
                  {userId ? "ثبت تسلط درس ششم" : "پایان درس ششم در حالت مهمان"}
                </button>

                <button
                  type="button"
                  onClick={restartLesson}
                  className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                >
                  <RotateCcw className="size-4" />
                  مرور دوباره درس ششم
                </button>
              </div>

              {saveState === "error" && saveError && (
                <p className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm leading-7 text-rose-800">{saveError}</p>
              )}

              {saveState === "saved" && savedProgress && (
                <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                  <p className="font-bold text-emerald-900">وضعیت درس ششم در حساب شما ذخیره شد.</p>
                  <p className="mt-2 text-sm leading-7 text-emerald-800">
                    {savedProgress.status === "needs_review" ? "این درس برای مرور دوباره علامت خورده است." : "درس ششم با موفقیت تکمیل شده است."}
                  </p>
                </div>
              )}

              {!userId && (
                <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-7 text-amber-900">
                  در حالت مهمان می‌توانید کل درس را استفاده کنید، اما نتیجه نهایی به‌صورت دائمی ذخیره نمی‌شود.
                </div>
              )}

              <div className="mt-8 rounded-3xl border border-teal-200 bg-gradient-to-br from-teal-50 via-white to-cyan-50 p-6">
                <p className="text-xs font-bold text-teal-700">مرحله بعد</p>
                <h3 className="mt-2 text-xl font-black text-slate-950">درس ۷ — RNA-seq و Microarray در نقشه ترنسکریپتومیکس</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  در درس هفتم دو مسیر اندازه‌گیری را کنار هم می‌بینیم و یاد می‌گیریم چرا هر داده ترنسکریپتومیکس الزاماً FASTQ ندارد.
                </p>
                <a
                  href="/learn/transcriptomics/foundations/rna-seq-in-transcriptomics"
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-teal-800"
                >
                  ورود به درس هفتم
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

function SceneCard({ eyebrow, title, description, children }: { eyebrow: string; title: string; description: string; children: ReactNode }) {
  return (
    <article className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-lg shadow-slate-200/60">
      <div className="border-b border-slate-200 bg-gradient-to-l from-teal-50 via-white to-white p-6 sm:p-8">
        <p className="text-xs font-bold text-teal-700">{eyebrow}</p>
        <h2 className="mt-2 text-2xl font-black leading-10 text-slate-950 sm:text-3xl">{title}</h2>
        <p className="mt-3 max-w-3xl text-sm leading-8 text-slate-600">{description}</p>
      </div>
      <div className="p-6 sm:p-8">{children}</div>
    </article>
  );
}

function ConceptCard({ title, text, emphasized = false }: { title: string; text: string; emphasized?: boolean }) {
  return (
    <div className={["rounded-3xl border p-5", emphasized ? "border-teal-300 bg-teal-50" : "border-slate-200 bg-slate-50"].join(" ")}>
      <p className="font-black text-slate-950">{title}</p>
      <p className="mt-3 text-sm leading-8 text-slate-600">{text}</p>
    </div>
  );
}

function TissueGrid() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-950 p-5 sm:p-6">
      <div className="grid grid-cols-4 gap-3">
        {tissueCells.map((type, index) => (
          <div key={`${type}-${index}`} className="flex aspect-square items-center justify-center rounded-2xl border border-white/10 bg-white/5">
            <span className={`h-8 w-8 rounded-full ${cellClass(type)}`} />
          </div>
        ))}
      </div>
    </div>
  );
}

function LegendCard({ label, count, dotClass }: { label: string; count: number; dotClass: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-center gap-3">
        <span className={`h-3 w-3 rounded-full ${dotClass}`} />
        <span className="font-bold text-slate-900">{label}</span>
      </div>
      <p className="mt-2 text-xs text-slate-500">{new Intl.NumberFormat("fa-IR").format(count)} سلول در این شبیه‌سازی</p>
    </div>
  );
}

function LevelButton({ active, icon, title, onClick }: { active: boolean; icon: ReactNode; title: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "flex items-center gap-3 rounded-2xl border p-4 text-right transition",
        active ? "border-teal-500 bg-teal-50 text-teal-900 shadow-sm" : "border-slate-200 bg-white text-slate-700 hover:border-teal-300",
      ].join(" ")}
    >
      {icon}
      <span className="font-black">{title}</span>
    </button>
  );
}

function BulkView() {
  return (
    <div className="grid gap-5 md:grid-cols-[0.8fr_auto_1fr] md:items-center">
      <TissueMini />
      <div className="hidden text-3xl text-teal-300 md:block">←</div>
      <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
        <p className="text-sm font-bold">یک نمای ترکیبی در سطح نمونه</p>
        <div className="mt-5 space-y-4">
          <MiniBar label="ژن الف" value={72} />
          <MiniBar label="ژن ب" value={43} />
          <MiniBar label="ژن ج" value={58} />
        </div>
        <p className="mt-5 text-xs leading-6 text-slate-400">این نمای توده‌ای می‌تواند از RNA-seq یا Microarray به دست آمده باشد.</p>
      </div>
    </div>
  );
}

function SingleCellView() {
  return (
    <div>
      <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
        {tissueCells.map((type, index) => (
          <div key={`${type}-${index}`} className="rounded-2xl border border-white/10 bg-white/5 p-3 text-center">
            <span className={`mx-auto block h-6 w-6 rounded-full ${cellClass(type)}`} />
            <p className="mt-2 text-[10px] text-slate-400">سلول {new Intl.NumberFormat("fa-IR").format(index + 1)}</p>
          </div>
        ))}
      </div>
      <p className="mt-5 text-xs leading-7 text-slate-400">در این نمایش سلول‌ها جدا دیده می‌شوند. یکی از فناوری‌های رایج برای این سطح، scRNA-seq است.</p>
    </div>
  );
}

function SpatialView() {
  return (
    <div>
      <div className="grid grid-cols-4 gap-2 rounded-3xl border border-white/10 bg-white/5 p-4">
        {tissueCells.map((type, index) => (
          <div key={`${type}-${index}`} className="relative flex aspect-square items-center justify-center rounded-xl border border-white/10">
            <span className={`h-7 w-7 rounded-full ${cellClass(type)}`} />
            <span className="absolute bottom-1 left-1 text-[9px] text-slate-500">{(index % 4) + 1},{Math.floor(index / 4) + 1}</span>
          </div>
        ))}
      </div>
      <p className="mt-5 text-xs leading-7 text-slate-400">موقعیت در بافت حفظ شده است. وضوح واقعی و منطق اندازه‌گیری به فناوری فضایی مورد استفاده بستگی دارد.</p>
    </div>
  );
}

function TissueMini() {
  return (
    <div className="grid grid-cols-4 gap-2 rounded-3xl border border-white/10 bg-white/5 p-4">
      {tissueCells.map((type, index) => (
        <span key={`${type}-${index}`} className={`aspect-square rounded-full ${cellClass(type)}`} />
      ))}
    </div>
  );
}

function MiniBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-2 flex justify-between gap-3 text-xs">
        <span className="text-slate-300">{label}</span>
        <span className="text-slate-500">{new Intl.NumberFormat("fa-IR").format(value)}</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-teal-400" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function InfoList({ title, items, positive = false }: { title: string; items: string[]; positive?: boolean }) {
  return (
    <div className={["rounded-3xl border p-5", positive ? "border-emerald-200 bg-emerald-50" : "border-cyan-200 bg-cyan-50"].join(" ")}>
      <p className={positive ? "font-black text-emerald-950" : "font-black text-cyan-950"}>{title}</p>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm leading-7 text-slate-700">
            <CheckCircle2 className="mt-1 size-4 shrink-0" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function DecisionQuestion({ question, options, selected, correctIndex, onSelect, correctFeedback, incorrectFeedback }: { question: string; options: string[]; selected: number | null; correctIndex: number; onSelect: (index: number) => void; correctFeedback: string; incorrectFeedback: string }) {
  const answered = selected !== null;
  const correct = selected === correctIndex;

  return (
    <section className="mt-7 rounded-3xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-sm font-black text-white">؟</span>
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
            <button key={option} type="button" onClick={() => onSelect(index)} className={`rounded-2xl border p-4 text-right text-sm font-medium leading-7 text-slate-700 transition ${className}`}>
              {option}
            </button>
          );
        })}
      </div>
      {answered && (
        <div className={["mt-4 rounded-2xl border p-4", correct ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"].join(" ")}>
          <p className={correct ? "text-sm font-bold text-emerald-900" : "text-sm font-bold text-amber-950"}>
            {correct ? "مسیر فکری درست ✓" : "بیایید این برداشت را دوباره بررسی کنیم"}
          </p>
          <p className="mt-2 text-sm leading-7 text-slate-700">{correct ? correctFeedback : incorrectFeedback}</p>
        </div>
      )}
    </section>
  );
}

function InsightBox({ children }: { children: ReactNode }) {
  return (
    <div className="mt-6 flex items-start gap-3 rounded-2xl border border-teal-200 bg-teal-50 p-5">
      <Lightbulb className="mt-1 size-5 shrink-0 text-teal-700" />
      <p className="text-sm leading-8 text-teal-950">{children}</p>
    </div>
  );
}

function ConfidenceButton({ active, title, description, onClick }: { active: boolean; title: string; description: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className={["rounded-2xl border p-4 text-right transition", active ? "border-teal-500 bg-teal-50 shadow-sm" : "border-slate-200 bg-white hover:border-teal-300"].join(" ")}>
      <p className="font-bold text-slate-950">{title}</p>
      <p className="mt-2 text-xs leading-6 text-slate-500">{description}</p>
    </button>
  );
}

function SaveIndicator({ userId, state, savedProgress, error }: { userId: string | null; state: SaveState; savedProgress: LearningProgressRow | null; error: string }) {
  if (!userId) {
    return <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-[11px] font-semibold text-amber-800">حالت مهمان</span>;
  }
  if (state === "loading" || state === "saving") {
    return <span className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-[11px] font-semibold text-cyan-800"><Loader2 className="size-3 animate-spin" />در حال همگام‌سازی</span>;
  }
  if (state === "error") {
    return <span title={error} className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1.5 text-[11px] font-semibold text-rose-800">مشکل در همگام‌سازی</span>;
  }
  if (savedProgress) {
    return <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[11px] font-semibold text-emerald-800"><CheckCircle2 className="size-3" />درس ششم ذخیره شده</span>;
  }
  return <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-500"><Sparkles className="size-3" />آماده یادگیری</span>;
}
