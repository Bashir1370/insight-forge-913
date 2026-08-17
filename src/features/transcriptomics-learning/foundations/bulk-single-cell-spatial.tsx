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
  Grid3X3,
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

type SaveState =
  | "guest"
  | "loading"
  | "idle"
  | "saving"
  | "saved"
  | "error";

type Modality =
  | "bulk"
  | "single-cell"
  | "spatial";

type ProjectReflection =
  | "average"
  | "cell-types"
  | "location"
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
const NODE_ID = "f6-bulk-single-cell-spatial";

const sceneTitles = [
  "بافت ناهمگن",
  "آزمایشگاه سه نما",
  "چه چیزی حفظ می‌شود؟",
  "انتخاب بر اساس سؤال",
  "هزینه وضوح بیشتر",
  "پروژه سرطان پانکراس",
  "تسلط",
];

const modalityInfo: Record<
  Modality,
  {
    title: string;
    short: string;
    description: string;
    keeps: string[];
    loses: string[];
  }
> = {
  bulk: {
    title: "RNA-seq توده‌ای",
    short: "نمای میانگین/ترکیبی نمونه",
    description:
      "سیگنال RNA تعداد زیادی سلول در یک نمونه با هم اندازه‌گیری می‌شود. برای بسیاری از مقایسه‌های نمونه‌محور بسیار مفید است.",
    keeps: [
      "تصویر کلی RNA در سطح نمونه",
      "مقایسه نمونه‌های مستقل",
      "پیاده‌سازی و تحلیل ساده‌تر نسبت به روش‌های تک‌سلولی",
    ],
    loses: [
      "هویت RNA هر سلول منفرد",
      "تفکیک مستقیم زیرجمعیت‌های سلولی",
      "اطلاعات مکانی درون بافت",
    ],
  },
  "single-cell": {
    title: "RNA-seq تک‌سلولی",
    short: "نمای سلول‌به‌سلول",
    description:
      "RNA در سطح سلول‌های منفرد یا نزدیک به آن بررسی می‌شود و ناهمگنی سلولی بهتر قابل مشاهده است.",
    keeps: [
      "تفاوت بین سلول‌ها",
      "زیرجمعیت‌ها و حالت‌های سلولی",
      "بررسی اینکه کدام سلول‌ها پاسخ متفاوتی دارند",
    ],
    loses: [
      "اطلاعات مکانی اصلی بافت در بسیاری از طراحی‌ها",
      "سادگی تحلیل و هزینه پایین‌تر",
      "این تصور غلط که هر سلول یک تکرار زیستی مستقل است",
    ],
  },
  spatial: {
    title: "ترنسکریپتومیکس فضایی",
    short: "RNA همراه با موقعیت در بافت",
    description:
      "اطلاعات RNA همراه با مختصات یا جایگاه مکانی در بافت حفظ می‌شود؛ وضوح دقیق به فناوری بستگی دارد.",
    keeps: [
      "زمینه مکانی بافت",
      "نزدیکی و سازمان فضایی نواحی مختلف",
      "پیوند بیان RNA با معماری بافت",
    ],
    loses: [
      "سادگی و هزینه پایین",
      "یکسان‌بودن وضوح در همه فناوری‌ها",
      "این فرض که هر نقطه فضایی الزاماً یک سلول منفرد است",
    ],
  },
};

const reflectionLabels: Record<ProjectReflection, string> = {
  average: "می‌خواهم پاسخ کلی نمونه یا بافت را بدانم",
  "cell-types": "می‌خواهم تفاوت بین انواع یا حالت‌های سلولی را ببینم",
  location: "موقعیت سلول‌ها یا نواحی در بافت برایم مهم است",
  unsure: "هنوز مطمئن نیستم",
};

const tissueCells = [
  { id: 1, type: "cancer", x: 1, y: 1 },
  { id: 2, type: "cancer", x: 2, y: 1 },
  { id: 3, type: "immune", x: 3, y: 1 },
  { id: 4, type: "stromal", x: 4, y: 1 },
  { id: 5, type: "cancer", x: 1, y: 2 },
  { id: 6, type: "immune", x: 2, y: 2 },
  { id: 7, type: "immune", x: 3, y: 2 },
  { id: 8, type: "stromal", x: 4, y: 2 },
  { id: 9, type: "cancer", x: 1, y: 3 },
  { id: 10, type: "cancer", x: 2, y: 3 },
  { id: 11, type: "stromal", x: 3, y: 3 },
  { id: 12, type: "immune", x: 4, y: 3 },
  { id: 13, type: "stromal", x: 1, y: 4 },
  { id: 14, type: "cancer", x: 2, y: 4 },
  { id: 15, type: "immune", x: 3, y: 4 },
  { id: 16, type: "cancer", x: 4, y: 4 },
] as const;

function cellLabel(type: string) {
  if (type === "cancer") return "سلول سرطانی";
  if (type === "immune") return "سلول ایمنی";
  return "سلول استرومایی";
}

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
  const [modality, setModality] = useState<Modality>("bulk");
  const [preservationAnswer, setPreservationAnswer] = useState<number | null>(null);
  const [question1, setQuestion1] = useState<number | null>(null);
  const [question2, setQuestion2] = useState<number | null>(null);
  const [question3, setQuestion3] = useState<number | null>(null);
  const [replicateAnswer, setReplicateAnswer] = useState<number | null>(null);
  const [mistakeAnswer, setMistakeAnswer] = useState<number | null>(null);
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
        console.error("Failed to load F6 progress:", error);
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

  const selectedInfo = modalityInfo[modality];
  const canFinish = masteryAnswer !== null && Boolean(confidence);

  const cellCounts = useMemo(() => {
    return tissueCells.reduce(
      (acc, cell) => {
        acc[cell.type] += 1;
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
    setModality("bulk");
    setPreservationAnswer(null);
    setQuestion1(null);
    setQuestion2(null);
    setQuestion3(null);
    setReplicateAnswer(null);
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
      foundationIndex={6}
      total={7}
      title="RNA-seq توده‌ای، تک‌سلولی یا ترنسکریپتومیکس فضایی؟"
      subtitle="هر روش نمای متفاوتی از یک سیستم زیستی می‌دهد. در این درس یک بافت ناهمگن را از سه زاویه بررسی می‌کنیم و یاد می‌گیریم وضوح بیشتر همیشه به معنی انتخاب بهتر نیست."
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
              eyebrow="یک بافت، چند نوع سلول"
              title="اگر نمونه ما مخلوطی از چند نوع سلول باشد، یک عدد «میانگین» چه چیزی را پنهان می‌کند؟"
              description="بافت تومور فقط از سلول‌های سرطانی تشکیل نشده است. سلول‌های ایمنی و استرومایی هم بخشی از محیط بافت هستند."
            >
              <TissueGrid />

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <LegendCard
                  label="سلول سرطانی"
                  count={cellCounts.cancer}
                  dotClass="bg-rose-400"
                />
                <LegendCard
                  label="سلول ایمنی"
                  count={cellCounts.immune}
                  dotClass="bg-cyan-400"
                />
                <LegendCard
                  label="سلول استرومایی"
                  count={cellCounts.stromal}
                  dotClass="bg-amber-300"
                />
              </div>

              <DecisionQuestion
                question="اگر RNA همه این سلول‌ها با هم اندازه‌گیری شود، چه اتفاقی می‌افتد؟"
                options={[
                  "هویت RNA هر سلول منفرد به‌صورت کامل حفظ می‌شود.",
                  "سیگنال سلول‌ها در یک نمای ترکیبی در سطح نمونه دیده می‌شود.",
                  "اطلاعات مکانی بافت دقیق‌تر می‌شود.",
                ]}
                selected={openingAnswer}
                correctIndex={1}
                onSelect={setOpeningAnswer}
                correctFeedback="دقیقاً. در RNA-seq توده‌ای سیگنال مجموعه سلول‌ها در سطح نمونه با هم دیده می‌شود."
                incorrectFeedback="وقتی RNA سلول‌ها با هم اندازه‌گیری شود، هویت هر سلول منفرد و مکان آن به‌طور مستقیم حفظ نمی‌شود."
              />

              <InsightBox>
                سؤال کلیدی این درس این نیست که «کدام فناوری پیشرفته‌تر است؟»؛ سؤال این است که <strong>برای سؤال من چه نوع وضوحی لازم است؟</strong>
              </InsightBox>
            </SceneCard>
          )}

          {scene === 1 && (
            <SceneCard
              eyebrow="آزمایشگاه سه نما"
              title="یک بافت را با سه روش مختلف ببینید."
              description="بین سه روش جابه‌جا شوید. همان بافت ثابت است؛ فقط نوع اطلاعاتی که از آن حفظ می‌کنیم تغییر می‌کند."
            >
              <div className="grid gap-3 md:grid-cols-3">
                <ModalityButton
                  active={modality === "bulk"}
                  icon={<Layers3 className="size-5" />}
                  title="RNA-seq توده‌ای"
                  onClick={() => setModality("bulk")}
                />
                <ModalityButton
                  active={modality === "single-cell"}
                  icon={<UsersRound className="size-5" />}
                  title="RNA-seq تک‌سلولی"
                  onClick={() => setModality("single-cell")}
                />
                <ModalityButton
                  active={modality === "spatial"}
                  icon={<MapPinned className="size-5" />}
                  title="ترنسکریپتومیکس فضایی"
                  onClick={() => setModality("spatial")}
                />
              </div>

              <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white">
                <p className="text-xs font-bold text-teal-300">
                  {selectedInfo.short}
                </p>

                <h3 className="mt-2 text-2xl font-black">
                  {selectedInfo.title}
                </h3>

                <p className="mt-3 text-sm leading-8 text-slate-300">
                  {selectedInfo.description}
                </p>

                <div className="mt-7">
                  {modality === "bulk" && <BulkView />}
                  {modality === "single-cell" && <SingleCellView />}
                  {modality === "spatial" && <SpatialView />}
                </div>
              </div>
            </SceneCard>
          )}

          {scene === 2 && (
            <SceneCard
              eyebrow="چه چیزی حفظ می‌شود؟"
              title="هر روش بخشی از اطلاعات را حفظ می‌کند و بخشی را از دست می‌دهد."
              description="به‌جای پرسیدن «کدام بهتر است؟»، بپرسید «کدام اطلاعات برای سؤال من حیاتی است؟»"
            >
              <div className="grid gap-5 lg:grid-cols-2">
                <InfoList
                  title="چه چیزی بهتر حفظ می‌شود؟"
                  items={selectedInfo.keeps}
                  positive
                />

                <InfoList
                  title="چه چیزی محدود یا از دست می‌رود؟"
                  items={selectedInfo.loses}
                />
              </div>

              <DecisionQuestion
                question="اگر موقعیت سلول‌ها در بافت برای سؤال شما حیاتی باشد، کدام روش به‌طور مفهومی مناسب‌تر است؟"
                options={[
                  "RNA-seq توده‌ای",
                  "RNA-seq تک‌سلولی استاندارد",
                  "ترنسکریپتومیکس فضایی",
                ]}
                selected={preservationAnswer}
                correctIndex={2}
                onSelect={setPreservationAnswer}
                correctFeedback="دقیقاً. ترنسکریپتومیکس فضایی اطلاعات RNA را به زمینه مکانی بافت متصل می‌کند."
                incorrectFeedback="اگر جایگاه سلول یا ناحیه در بافت بخشی از سؤال است، روش فضایی برای حفظ این Context مناسب‌تر است."
              />

              <p className="mt-5 text-xs leading-7 text-slate-500">
                وضوح دقیق ترنسکریپتومیکس فضایی بین فناوری‌ها متفاوت است؛ هر نقطه فضایی را نباید بدون بررسی فناوری معادل یک سلول منفرد در نظر گرفت.
              </p>
            </SceneCard>
          )}

          {scene === 3 && (
            <SceneCard
              eyebrow="آزمایشگاه تصمیم"
              title="سؤال پژوهشی را بخوانید و روش مناسب‌تر را انتخاب کنید."
              description="اینجا هدف انتخاب «مناسب‌تر» است، نه ادعای اینکه فقط یک روش ممکن است."
            >
              <DecisionQuestion
                question="۱) می‌خواهم پاسخ کلی RNA یک بافت را بین گروه کنترل و تیمار مقایسه کنم و ناهمگنی سلولی سؤال اصلی من نیست."
                options={[
                  "RNA-seq توده‌ای می‌تواند انتخاب مناسبی باشد.",
                  "حتماً باید تک‌سلولی باشد.",
                  "حتماً باید فضایی باشد.",
                ]}
                selected={question1}
                correctIndex={0}
                onSelect={setQuestion1}
                correctFeedback="درست است. اگر سؤال در سطح نمونه تعریف شده، RNA-seq توده‌ای می‌تواند کاملاً مناسب باشد."
                incorrectFeedback="وضوح بیشتر الزاماً لازم نیست؛ اگر سؤال در سطح نمونه است، روش توده‌ای می‌تواند پاسخ مناسب‌تری از نظر طراحی و هزینه باشد."
              />

              <DecisionQuestion
                question="۲) می‌خواهم بدانم کدام زیرجمعیت سلولی در تومور به داروی X پاسخ متفاوتی داده است."
                options={[
                  "RNA-seq توده‌ای به‌تنهایی",
                  "RNA-seq تک‌سلولی",
                  "فقط تعیین توالی DNA",
                ]}
                selected={question2}
                correctIndex={1}
                onSelect={setQuestion2}
                correctFeedback="بله. وقتی تفاوت بین سلول‌ها یا زیرجمعیت‌ها سؤال اصلی است، تک‌سلولی اطلاعات مناسب‌تری می‌دهد."
                incorrectFeedback="برای دیدن تفاوت زیرجمعیت‌های سلولی، سیگنال ترکیبی RNA-seq توده‌ای معمولاً کافی نیست."
              />

              <DecisionQuestion
                question="۳) می‌خواهم بدانم سلول‌های پاسخ‌دهنده به دارو در کدام ناحیه تومور قرار گرفته‌اند."
                options={[
                  "ترنسکریپتومیکس فضایی",
                  "RNA-seq توده‌ای",
                  "فقط RNA-seq تک‌سلولی بدون اطلاعات مکانی",
                ]}
                selected={question3}
                correctIndex={0}
                onSelect={setQuestion3}
                correctFeedback="دقیقاً. خود موقعیت در بافت بخشی از سؤال است."
                incorrectFeedback="وقتی مکان سلول یا ناحیه مهم است، باید روشی انتخاب شود که Context فضایی را حفظ کند."
              />
            </SceneCard>
          )}

          {scene === 4 && (
            <SceneCard
              eyebrow="هزینه وضوح بیشتر"
              title="هزاران سلول، هزاران تکرار زیستی نیستند."
              description="یکی از مهم‌ترین سوءبرداشت‌ها در مطالعات تک‌سلولی این است که تعداد زیاد سلول‌ها را جای تعداد نمونه‌های مستقل بگذاریم."
            >
              <div className="grid gap-4 md:grid-cols-2">
                <ConceptCard
                  title="سلول"
                  text="واحد مشاهده در داده تک‌سلولی است؛ سلول‌های یک نمونه معمولاً از همان فرد یا همان نمونه زیستی آمده‌اند."
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
                  "خیر، تعداد سلول زیاد جای نمونه‌های زیستی مستقل را نمی‌گیرد.",
                ]}
                selected={replicateAnswer}
                correctIndex={1}
                onSelect={setReplicateAnswer}
                correctFeedback="دقیقاً. سلول‌ها داخل یک نمونه ساختار وابسته دارند و نباید به‌سادگی مانند تکرارهای مستقل زیستی رفتار شوند."
                incorrectFeedback="تعداد سلول با تعداد نمونه‌های مستقل یکی نیست. استقلال زیستی در سطح طراحی مطالعه تعریف می‌شود."
              />

              <InsightBox>
                <strong>Sample ≠ Cell.</strong> تعداد زیاد سلول‌ها یک طراحی ضعیف در سطح نمونه‌های مستقل را خودبه‌خود جبران نمی‌کند.
              </InsightBox>

              <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <p className="font-bold text-slate-950">
                  وضوح بیشتر، هزینه و پیچیدگی بیشتری هم دارد
                </p>
                <p className="mt-2 text-sm leading-8 text-slate-600">
                  تک‌سلولی و فضایی می‌توانند اطلاعات بسیار ارزشمندی بدهند، اما معمولاً هزینه، پیچیدگی طراحی، کنترل کیفیت و تحلیل بیشتری دارند. انتخاب آن‌ها باید از سؤال پژوهشی بیاید، نه از جذابیت فناوری.
                </p>
              </div>
            </SceneCard>
          )}

          {scene === 5 && (
            <SceneCard
              eyebrow="پروژه همراه شما"
              title="داروی X در بافت سرطان پانکراس"
              description="حالا فرض کنید نمونه ما واقعاً مخلوطی از سلول‌های سرطانی، ایمنی و استرومایی است."
            >
              <div className="rounded-3xl border border-teal-200 bg-gradient-to-br from-teal-50 via-white to-cyan-50 p-6">
                <p className="font-black text-teal-950">
                  سؤال پروژه
                </p>
                <p className="mt-3 text-sm leading-8 text-slate-600">
                  می‌خواهیم بدانیم داروی X بیشتر روی کدام نوع سلول در تومور اثر گذاشته و آیا سلول‌های پاسخ‌دهنده در یک ناحیه خاص از بافت متمرکز هستند.
                </p>
              </div>

              <DecisionQuestion
                question="برای این سؤال، کدام مسیر اطلاعاتی مناسب‌تر است؟"
                options={[
                  "RNA-seq توده‌ای به‌تنهایی، چون هم نوع سلول و هم موقعیت را مستقیم حفظ می‌کند.",
                  "ترکیبی از اطلاعات تک‌سلولی/سلول‌محور و اطلاعات فضایی می‌تواند برای چنین سؤال پیچیده‌ای مناسب‌تر باشد.",
                  "فقط توالی DNA، چون سؤال درباره مکان و پاسخ RNA است.",
                ]}
                selected={caseAnswer}
                correctIndex={1}
                onSelect={setCaseAnswer}
                correctFeedback="درست است. چون هم هویت سلولی و هم مکان در سؤال وجود دارد، ممکن است به بیش از یک نوع اطلاعات نیاز داشته باشیم."
                incorrectFeedback="RNA-seq توده‌ای سیگنال کلی نمونه را می‌دهد اما به‌تنهایی هویت سلول‌های منفرد و موقعیت آن‌ها را حفظ نمی‌کند."
              />

              <div className="mt-7 rounded-3xl border border-amber-200 bg-amber-50 p-6">
                <p className="font-black text-amber-950">
                  کلینیک اشتباه
                </p>
                <p className="mt-3 text-sm leading-8 text-amber-900">
                  «Single-cell همیشه از Bulk بهتر است، چون جزئیات بیشتری دارد.»
                </p>
              </div>

              <DecisionQuestion
                question="مشکل این جمله چیست؟"
                options={[
                  "جزئیات بیشتر همیشه طراحی بهتر را تضمین می‌کند.",
                  "روش مناسب به سؤال، طراحی، هزینه، نمونه‌ها و نوع نتیجه موردنیاز بستگی دارد؛ وضوح بیشتر همیشه ضروری نیست.",
                  "RNA-seq توده‌ای هیچ کاربرد علمی مهمی ندارد.",
                ]}
                selected={mistakeAnswer}
                correctIndex={1}
                onSelect={setMistakeAnswer}
                correctFeedback="دقیقاً. «پیشرفته‌تر» یا «پر جزئیات‌تر» مترادف «مناسب‌تر برای سؤال من» نیست."
                incorrectFeedback="یک روش باید بر اساس سؤال پژوهشی و محدودیت‌های طراحی انتخاب شود، نه صرفاً بیشترین وضوح ممکن."
              />

              <div className="mt-8 border-t border-slate-100 pt-7">
                <p className="font-bold text-slate-950">
                  در پروژه شما کدام نوع اطلاعات مهم‌تر است؟
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
                    {reflection === "average"
                      ? "اگر سؤال شما در سطح نمونه تعریف شده باشد، RNA-seq توده‌ای می‌تواند کاملاً منطقی باشد."
                      : reflection === "cell-types"
                        ? "وقتی ناهمگنی و زیرجمعیت‌های سلولی سؤال اصلی‌اند، روش تک‌سلولی جذاب‌تر می‌شود."
                        : reflection === "location"
                          ? "اگر مکان در بافت بخشی از سؤال است، اطلاعات فضایی اهمیت پیدا می‌کند."
                          : "اشکالی ندارد. اصل مهم این است که قبل از انتخاب فناوری، نوع وضوح موردنیاز سؤال را مشخص کنید."}
                  </InsightBox>
                )}
              </div>
            </SceneCard>
          )}

          {scene === 6 && (
            <SceneCard
              eyebrow="ایستگاه تسلط"
              title="آیا می‌توانید روش را بر اساس نوع وضوح موردنیاز انتخاب کنید؟"
              description="سؤال نهایی سه اصل را هم‌زمان می‌سنجد: سطح نمونه، هویت سلولی و موقعیت فضایی."
            >
              <DecisionQuestion
                question="پژوهشگری می‌خواهد بداند کدام زیرجمعیت سلولی در تومور پاسخ داده و این سلول‌ها در کدام ناحیه بافت قرار دارند. بهترین برداشت کدام است؟"
                options={[
                  "RNA-seq توده‌ای به‌تنهایی تمام این اطلاعات را مستقیم حفظ می‌کند.",
                  "برای هویت سلولی و موقعیت بافتی احتمالاً به اطلاعات تک‌سلولی/سلول‌محور و فضایی نیاز داریم؛ انتخاب دقیق به طراحی و فناوری بستگی دارد.",
                  "چون تعداد سلول‌ها زیاد است، دیگر نیازی به نمونه‌های زیستی مستقل نیست.",
                  "همیشه باید گران‌ترین و پرجزئیات‌ترین فناوری را انتخاب کرد.",
                ]}
                selected={masteryAnswer}
                correctIndex={1}
                onSelect={setMasteryAnswer}
                correctFeedback="عالی. هم نوع وضوح موردنیاز را تشخیص داده‌اید و هم از ساده‌سازی بیش از حد پرهیز کرده‌اید."
                incorrectFeedback="به سؤال برگردید: هم هویت سلولی و هم موقعیت در بافت مهم‌اند؛ همچنین تعداد سلول جای تکرار زیستی مستقل را نمی‌گیرد."
              />

              <div className="mt-8">
                <p className="font-bold text-slate-950">
                  این مفهوم چقدر برایتان روشن است؟
                </p>

                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  <ConfidenceButton
                    active={confidence === "unclear"}
                    title="هنوز مبهم است"
                    description="تفاوت سه نوع وضوح را دوباره مرور می‌کنم."
                    onClick={() => setConfidence("unclear")}
                  />

                  <ConfidenceButton
                    active={confidence === "developing"}
                    title="تقریباً متوجه شدم"
                    description="در بیشتر سؤال‌ها می‌توانم روش مناسب‌تر را تشخیص بدهم."
                    onClick={() => setConfidence("developing")}
                  />

                  <ConfidenceButton
                    active={confidence === "clear"}
                    title="کاملاً روشن است"
                    description="می‌توانم بر اساس سؤال بین نمای توده‌ای، تک‌سلولی و فضایی تفاوت بگذارم."
                    onClick={() => setConfidence("clear")}
                  />
                </div>
              </div>

              <div className="mt-7 rounded-3xl bg-slate-950 p-6 text-white">
                <p className="text-xs font-bold text-teal-300">
                  لحظه فهم این درس
                </p>

                <p className="mt-3 text-lg font-bold leading-9">
                  RNA-seq توده‌ای، تک‌سلولی و ترنسکریپتومیکس فضایی رقیب‌هایی برای انتخاب «بهترین فناوری» نیستند؛ هرکدام نوع متفاوتی از وضوح را برای یک سؤال متفاوت فراهم می‌کنند.
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
                    ? "ثبت تسلط درس ششم"
                    : "پایان درس ششم در حالت مهمان"}
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
                <p className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm leading-7 text-rose-800">
                  {saveError}
                </p>
              )}

              {saveState === "saved" && savedProgress && (
                <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                  <p className="font-bold text-emerald-900">
                    وضعیت درس ششم در حساب شما ذخیره شد.
                  </p>

                  <p className="mt-2 text-sm leading-7 text-emerald-800">
                    {savedProgress.status === "needs_review"
                      ? "این درس برای مرور دوباره علامت خورده است."
                      : "درس ششم با موفقیت تکمیل شده است."}
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
                  درس ۷ — RNA-seq در این نقشه کجاست؟
                </h3>

                <p className="mt-2 text-sm leading-7 text-slate-600">
                  در درس آخر Foundations مسیر نمونه زیستی تا RNA، کتابخانه، توالی‌یابی، خوانش‌ها، کمی‌سازی و ماتریس بیان را می‌سازیم و آماده ورود به مسیر عمیق RNA-seq توده‌ای می‌شویم.
                </p>

                <button
                  type="button"
                  disabled
                  className="mt-5 rounded-xl bg-slate-200 px-4 py-2.5 text-sm font-bold text-slate-500"
                >
                  درس هفتم در مرحله بعد ساخته می‌شود
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

function TissueGrid() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-950 p-5 sm:p-6">
      <div className="grid grid-cols-4 gap-3">
        {tissueCells.map((cell) => (
          <div
            key={cell.id}
            title={cellLabel(cell.type)}
            className="flex aspect-square items-center justify-center rounded-2xl border border-white/10 bg-white/5"
          >
            <span
              className={`h-8 w-8 rounded-full ${cellClass(cell.type)}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function LegendCard({
  label,
  count,
  dotClass,
}: {
  label: string;
  count: number;
  dotClass: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-center gap-3">
        <span className={`h-3 w-3 rounded-full ${dotClass}`} />
        <span className="font-bold text-slate-900">{label}</span>
      </div>
      <p className="mt-2 text-xs text-slate-500">
        {new Intl.NumberFormat("fa-IR").format(count)} سلول در این شبیه‌سازی
      </p>
    </div>
  );
}

function ModalityButton({
  active,
  icon,
  title,
  onClick,
}: {
  active: boolean;
  icon: ReactNode;
  title: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "flex items-center gap-3 rounded-2xl border p-4 text-right transition",
        active
          ? "border-teal-500 bg-teal-50 text-teal-900 shadow-sm"
          : "border-slate-200 bg-white text-slate-700 hover:border-teal-300",
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
      </div>
    </div>
  );
}

function SingleCellView() {
  return (
    <div>
      <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
        {tissueCells.map((cell) => (
          <div
            key={cell.id}
            className="rounded-2xl border border-white/10 bg-white/5 p-3 text-center"
          >
            <span
              className={`mx-auto block h-6 w-6 rounded-full ${cellClass(cell.type)}`}
            />
            <p className="mt-2 text-[10px] text-slate-400">
              سلول {new Intl.NumberFormat("fa-IR").format(cell.id)}
            </p>
          </div>
        ))}
      </div>
      <p className="mt-5 text-xs leading-7 text-slate-400">
        در این نمایش، سلول‌ها جدا دیده می‌شوند؛ اما موقعیت اصلی آن‌ها در بافت را عمداً حذف کرده‌ایم تا مفهوم روشن شود.
      </p>
    </div>
  );
}

function SpatialView() {
  return (
    <div>
      <div className="grid grid-cols-4 gap-2 rounded-3xl border border-white/10 bg-white/5 p-4">
        {tissueCells.map((cell) => (
          <div
            key={cell.id}
            className="relative flex aspect-square items-center justify-center rounded-xl border border-white/10"
          >
            <span
              className={`h-7 w-7 rounded-full ${cellClass(cell.type)}`}
            />
            <span className="absolute bottom-1 left-1 text-[9px] text-slate-500">
              {cell.x},{cell.y}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-5 text-xs leading-7 text-slate-400">
        موقعیت هر نقطه در بافت حفظ شده است. این فقط یک شبیه‌سازی مفهومی است و وضوح واقعی به فناوری فضایی بستگی دارد.
      </p>
    </div>
  );
}

function TissueMini() {
  return (
    <div className="grid grid-cols-4 gap-2 rounded-3xl border border-white/10 bg-white/5 p-4">
      {tissueCells.map((cell) => (
        <span
          key={cell.id}
          className={`aspect-square rounded-full ${cellClass(cell.type)}`}
        />
      ))}
    </div>
  );
}

function MiniBar({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div>
      <div className="mb-2 flex justify-between gap-3 text-xs">
        <span className="text-slate-300">{label}</span>
        <span className="text-slate-500">
          {new Intl.NumberFormat("fa-IR").format(value)}
        </span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-teal-400"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function InfoList({
  title,
  items,
  positive = false,
}: {
  title: string;
  items: string[];
  positive?: boolean;
}) {
  return (
    <div
      className={[
        "rounded-3xl border p-5",
        positive
          ? "border-emerald-200 bg-emerald-50"
          : "border-amber-200 bg-amber-50",
      ].join(" ")}
    >
      <p
        className={[
          "font-black",
          positive ? "text-emerald-950" : "text-amber-950",
        ].join(" ")}
      >
        {title}
      </p>

      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li
            key={item}
            className="flex items-start gap-2 text-sm leading-7 text-slate-700"
          >
            <CheckCircle2 className="mt-1 size-4 shrink-0" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
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
        "rounded-3xl border p-5",
        emphasized
          ? "border-teal-300 bg-teal-50"
          : "border-slate-200 bg-slate-50",
      ].join(" ")}
    >
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
        درس ششم ذخیره شده
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
