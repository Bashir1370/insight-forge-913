import {
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CircleDot,
  Dna,
  FileText,
  Grid3X3,
  Layers3,
  Lightbulb,
  Loader2,
  MapPinned,
  Microscope,
  Pause,
  Play,
  RotateCcw,
  ScanLine,
  Sparkles,
  StepBack,
  StepForward,
  TestTube2,
  Waypoints,
} from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { InteractiveLessonShell } from "../components/InteractiveLessonShell";

type Confidence = "unclear" | "developing" | "clear";
type SaveState = "guest" | "loading" | "idle" | "saving" | "saved" | "error";
type AnimationTechnology = "rna-seq" | "microarray";
type TechnologyPathId =
  | "bulk-rna-seq"
  | "microarray"
  | "single-cell"
  | "spatial"
  | "long-read"
  | "small-rna";

type LearningProgressRow = {
  status: "not_started" | "in_progress" | "completed" | "needs_review";
  confidence: Confidence | null;
  selected_answer: number | null;
  is_correct: boolean | null;
  updated_at: string;
};

type AnimationStep = {
  title: string;
  short: string;
  explanation: string;
};

type TechnologyCardData = {
  id: TechnologyPathId;
  title: string;
  english: string;
  question: string;
  idea: string;
  note: string;
  family: string;
  icon: ReactNode;
};

const RESEARCH_LINE = "transcriptomics-foundations";
const NODE_ID = "f7-rna-seq-in-transcriptomics";

const sceneTitles = [
  "پایان مبانی، آغاز فناوری‌ها",
  "نقشه مسیرهای فناوری",
  "آزمایشگاه دو منطق اندازه‌گیری",
  "از این دو منطق تا فناوری‌های دیگر",
  "نوع داده چه سرنخی می‌دهد؟",
  "آزمایشگاه انتخاب مسیر",
  "تسلط و ورود به مسیر تخصصی",
];

const rnaSeqAnimationSteps: AnimationStep[] = [
  {
    title: "نمونه زیستی",
    short: "Sample",
    explanation:
      "همه‌چیز از یک نمونه زیستی و یک سؤال پژوهشی شروع می‌شود؛ فناوری قرار نیست جای سؤال را بگیرد.",
  },
  {
    title: "استخراج RNA",
    short: "RNA",
    explanation:
      "RNA از نمونه استخراج می‌شود تا مولکول‌های موردنظر برای ادامه مسیر در دسترس باشند.",
  },
  {
    title: "آماده‌سازی Library",
    short: "Library",
    explanation:
      "RNA یا cDNA برای ورود به دستگاه توالی‌یابی به یک Library مناسب تبدیل می‌شود. جزئیات Library prep به نوع پروژه بستگی دارد.",
  },
  {
    title: "توالی‌یابی",
    short: "Sequencing",
    explanation:
      "دستگاه توالی‌یابی اطلاعات توالی را به‌صورت مجموعه‌ای از خوانش‌ها تولید می‌کند.",
  },
  {
    title: "خوانش‌ها و FASTQ",
    short: "Reads / FASTQ",
    explanation:
      "در بسیاری از پروژه‌های RNA-seq، داده خام در قالب FASTQ دیده می‌شود؛ فایل شامل توالی خوانش‌ها و اطلاعات کیفیت آن‌هاست.",
  },
  {
    title: "کمی‌سازی",
    short: "Quantification",
    explanation:
      "خوانش‌ها باید به ژن‌ها یا ترنسکریپت‌ها مرتبط و سپس کمی‌سازی شوند تا بتوان مقدار بیان را برآورد کرد.",
  },
  {
    title: "ماتریس بیان",
    short: "Expression Matrix",
    explanation:
      "در نهایت به ساختاری می‌رسیم که در آن ژن‌ها یا ترنسکریپت‌ها در برابر نمونه‌ها قرار می‌گیرند و برای تحلیل آماده‌اند.",
  },
];

const microarrayAnimationSteps: AnimationStep[] = [
  {
    title: "نمونه زیستی",
    short: "Sample",
    explanation:
      "همان سؤال پژوهشی می‌تواند با فناوری دیگری بررسی شود؛ نقطه شروع همچنان نمونه و طراحی مطالعه است.",
  },
  {
    title: "استخراج RNA",
    short: "RNA",
    explanation:
      "RNA از نمونه استخراج می‌شود، اما ادامه مسیر با RNA-seq یکسان نیست.",
  },
  {
    title: "نشاندارسازی",
    short: "Labeling",
    explanation:
      "نمونه برای خوانش روی پلتفرم Microarray آماده و نشاندار می‌شود تا اتصال آن به پروب‌ها قابل آشکارسازی باشد.",
  },
  {
    title: "هیبریداسیون با پروب",
    short: "Hybridization",
    explanation:
      "مولکول‌های هدف به پروب‌های از پیش طراحی‌شده روی Chip متصل می‌شوند. اینجا خبری از تولید Reads نیست.",
  },
  {
    title: "اندازه‌گیری شدت سیگنال",
    short: "Signal Intensity",
    explanation:
      "شدت سیگنال هر Probe اندازه‌گیری می‌شود و به‌عنوان شاهدی برای فراوانی هدف مرتبط با آن Probe استفاده می‌شود.",
  },
  {
    title: "پردازش و نرمال‌سازی",
    short: "Normalization",
    explanation:
      "سیگنال‌های خام باید با روش مناسب پلتفرم پردازش و نرمال‌سازی شوند؛ این pipeline با RNA-seq متفاوت است.",
  },
  {
    title: "ماتریس بیان",
    short: "Expression Matrix",
    explanation:
      "پس از پردازش می‌توان به ماتریسی برای مقایسه بیان بین نمونه‌ها رسید، هرچند منطق تولید داده از ابتدا با RNA-seq متفاوت بوده است.",
  },
];

const technologyCards: TechnologyCardData[] = [
  {
    id: "bulk-rna-seq",
    title: "RNA-seq توده‌ای",
    english: "Bulk RNA-seq",
    question: "پاسخ کلی RNA در سطح نمونه چیست؟",
    idea: "توالی‌یابی RNA یک مجموعه سلولی به‌صورت ترکیبی",
    note: "مسیر تخصصی بعدی هاب‌ژن فعلاً برای این شاخه فعال است.",
    family: "sequencing-based",
    icon: <ScanLine className="size-5" />,
  },
  {
    id: "microarray",
    title: "Microarray",
    english: "Microarray",
    question: "بیان اهداف شناخته‌شده روی یک پلتفرم Probe-based چگونه تغییر کرده است؟",
    idea: "هیبریداسیون روی Probeهای از پیش طراحی‌شده و اندازه‌گیری شدت سیگنال",
    note: "برای بسیاری از مجموعه‌داده‌های عمومی قدیمی‌تر بسیار مهم است.",
    family: "probe / signal-based",
    icon: <Grid3X3 className="size-5" />,
  },
  {
    id: "single-cell",
    title: "RNA-seq تک‌سلولی",
    english: "scRNA-seq",
    question: "کدام سلول یا زیرجمعیت سلولی پاسخ متفاوتی دارد؟",
    idea: "استفاده از منطق sequencing-based در سطح سلول",
    note: "تعداد زیاد سلول جای تکرار زیستی مستقل را نمی‌گیرد.",
    family: "single-cell + sequencing-based",
    icon: <CircleDot className="size-5" />,
  },
  {
    id: "spatial",
    title: "ترنسکریپتومیکس فضایی",
    english: "Spatial Transcriptomics",
    question: "این الگوی RNA در کجای بافت قرار دارد؟",
    idea: "ترکیب اطلاعات RNA با زمینه مکانی",
    note: "خانواده‌ای متنوع از فناوری‌هاست و همه پلتفرم‌ها منطق یکسانی ندارند.",
    family: "spatial family",
    icon: <MapPinned className="size-5" />,
  },
  {
    id: "long-read",
    title: "ترنسکریپتومیکس با خوانش بلند",
    english: "Long-read Transcriptomics",
    question: "ساختار transcript و isoformها چگونه‌اند؟",
    idea: "توالی‌یابی با خوانش‌های بلندتر برای مشاهده بهتر ساختار transcript",
    note: "برای پرسش‌های مربوط به isoform و ساختار transcript ارزش ویژه دارد.",
    family: "sequencing-based",
    icon: <Waypoints className="size-5" />,
  },
  {
    id: "small-rna",
    title: "توالی‌یابی RNAهای کوچک",
    english: "small RNA-seq",
    question: "miRNA و سایر RNAهای کوچک چگونه تغییر کرده‌اند؟",
    idea: "Library prep و تحلیل متناسب با RNAهای کوچک",
    note: "انتخاب Library تعیین می‌کند چه بخشی از دنیای RNA را ببینیم.",
    family: "sequencing-based",
    icon: <Dna className="size-5" />,
  },
];

export function RnaSeqInTranscriptomicsLesson() {
  const { session } = useAuth();
  const userId = session?.user?.id ?? null;

  const [scene, setScene] = useState(0);
  const [openingAnswer, setOpeningAnswer] = useState<number | null>(null);
  const [selectedTechnologyPath, setSelectedTechnologyPath] =
    useState<TechnologyPathId>("bulk-rna-seq");
  const [animationTechnology, setAnimationTechnology] =
    useState<AnimationTechnology>("rna-seq");
  const [animationStep, setAnimationStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [bridgeAnswer, setBridgeAnswer] = useState<number | null>(null);
  const [dataAnswer, setDataAnswer] = useState<number | null>(null);
  const [decision1, setDecision1] = useState<number | null>(null);
  const [decision2, setDecision2] = useState<number | null>(null);
  const [decision3, setDecision3] = useState<number | null>(null);
  const [mistakeAnswer, setMistakeAnswer] = useState<number | null>(null);
  const [masteryAnswer, setMasteryAnswer] = useState<number | null>(null);
  const [confidence, setConfidence] = useState<Confidence | null>(null);
  const [saveState, setSaveState] = useState<SaveState>("guest");
  const [saveError, setSaveError] = useState("");
  const [savedProgress, setSavedProgress] =
    useState<LearningProgressRow | null>(null);

  const animationSteps =
    animationTechnology === "rna-seq"
      ? rnaSeqAnimationSteps
      : microarrayAnimationSteps;

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

  useEffect(() => {
    if (!isPlaying) return;

    const timer = window.setInterval(() => {
      setAnimationStep((current) => {
        if (current >= animationSteps.length - 1) {
          setIsPlaying(false);
          return current;
        }
        return current + 1;
      });
    }, 1800);

    return () => window.clearInterval(timer);
  }, [isPlaying, animationSteps.length]);

  const canFinish = masteryAnswer !== null && Boolean(confidence);

  function changeAnimationTechnology(next: AnimationTechnology) {
    setAnimationTechnology(next);
    setAnimationStep(0);
    setIsPlaying(false);
  }

  function goToScene(nextScene: number) {
    setScene(nextScene);
    setIsPlaying(false);

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
    setSelectedTechnologyPath("bulk-rna-seq");
    setAnimationTechnology("rna-seq");
    setAnimationStep(0);
    setIsPlaying(false);
    setBridgeAnswer(null);
    setDataAnswer(null);
    setDecision1(null);
    setDecision2(null);
    setDecision3(null);
    setMistakeAnswer(null);
    setMasteryAnswer(null);
    setConfidence(null);

    window.setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 20);
  }

  const selectedPath = technologyCards.find(
    (item) => item.id === selectedTechnologyPath,
  ) ?? technologyCards[0];

  return (
    <InteractiveLessonShell
      foundationIndex={7}
      total={7}
      title="نقشه فناوری‌های ترنسکریپتومیکس"
      subtitle="این درس، پایان مبانی ترنسکریپتومیکس و دروازه ورود به مسیرهای تخصصی است. ابتدا نقشه فناوری‌ها را می‌بینیم، سپس RNA-seq و Microarray را به‌عنوان دو منطق بسیار متفاوت تولید داده با یک آزمایشگاه انیمیشنی مقایسه می‌کنیم."
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
              eyebrow="جمع‌بندی مبانی"
              title="تا اینجا یاد گرفتیم ترنسکریپتوم چیست؛ حالا وقت انتخاب فناوری است."
              description="فناوری باید بعد از سؤال پژوهشی، نوع RNA موردنظر، سطح مشاهده و طراحی مطالعه انتخاب شود."
            >
              <div className="grid gap-4 lg:grid-cols-2">
                <ConceptCard
                  title="آنچه در مبانی ساختیم"
                  items={[
                    "ژنوم با ترنسکریپتوم یکی نیست",
                    "بیان ژن یک وضعیت پویاست",
                    "RNA فقط mRNA نیست",
                    "ترنسکریپتومیکس اندازه‌گیری مستقیم پروتئین یا فنوتیپ نیست",
                    "روش مناسب از سؤال پژوهشی می‌آید",
                    "سطح مشاهده با فناوری اندازه‌گیری فرق دارد",
                  ]}
                  emphasized
                />
                <ConceptCard
                  title="سؤال جدید"
                  items={[
                    "کدام فناوری برای سؤال من مناسب‌تر است؟",
                    "چه نوع داده خامی باید انتظار داشته باشم؟",
                    "چه چیزی در هر فناوری حفظ یا از دست می‌رود؟",
                    "بعد از انتخاب فناوری، چه pipeline تخصصی لازم دارم؟",
                  ]}
                />
              </div>

              <div className="mt-6 rounded-3xl bg-slate-950 p-6 text-white">
                <p className="text-xs font-bold text-teal-300">نقشه تصمیم</p>
                <p className="mt-3 text-lg font-black leading-9">
                  سؤال پژوهشی ← نوع اطلاعات موردنیاز ← سطح مشاهده ← فناوری ← نوع داده ← مسیر تحلیل
                </p>
              </div>

              <DecisionQuestion
                question="کدام جمله بهترین نقش این درس را توضیح می‌دهد؟"
                options={[
                  "این درس می‌خواهد ثابت کند RNA-seq بهترین فناوری ترنسکریپتومیکس است.",
                  "این درس نقشه فناوری‌ها را معرفی می‌کند و بعد ما را برای ورود به مسیرهای تخصصی آماده می‌کند.",
                  "این درس فقط درباره فایل FASTQ است.",
                ]}
                selected={openingAnswer}
                correctIndex={1}
                onSelect={setOpeningAnswer}
                correctFeedback="دقیقاً. F7 یک پل بین مبانی ترنسکریپتومیکس و مسیرهای فناوری‌محور است."
                incorrectFeedback="هدف این درس انتخاب برنده نیست؛ هدف ساختن نقشه‌ای است که بعداً فناوری مناسب را در جای درست قرار دهیم."
              />
            </SceneCard>
          )}

          {scene === 1 && (
            <SceneCard
              eyebrow="نقشه فناوری‌ها"
              title="ترنسکریپتومیکس یک فناوری واحد ندارد."
              description="این کارت‌ها مسیرهای مهمی را نشان می‌دهند که پژوهشگر ممکن است در ادامه با آن‌ها روبه‌رو شود. این فهرست یک طبقه‌بندی سخت و تک‌محوری نیست؛ بعضی نام‌ها به سطح مشاهده، بعضی به نوع RNA و بعضی به استراتژی توالی‌یابی اشاره دارند."
            >
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {technologyCards.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedTechnologyPath(item.id)}
                    className={[
                      "rounded-3xl border p-5 text-right transition",
                      selectedTechnologyPath === item.id
                        ? "border-teal-500 bg-teal-50 shadow-sm"
                        : "border-slate-200 bg-white hover:border-teal-300",
                    ].join(" ")}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-teal-300">
                        {item.icon}
                      </span>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold text-slate-500">
                        {item.family}
                      </span>
                    </div>
                    <p className="mt-4 font-black text-slate-950">{item.title}</p>
                    <p className="mt-1 text-xs font-semibold text-slate-400">{item.english}</p>
                  </button>
                ))}
              </div>

              <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white">
                <p className="text-xs font-bold text-teal-300">{selectedPath.english}</p>
                <h3 className="mt-2 text-2xl font-black">{selectedPath.title}</h3>
                <div className="mt-5 grid gap-4 md:grid-cols-3">
                  <MiniInfo title="سؤال شاخص" text={selectedPath.question} />
                  <MiniInfo title="ایده اصلی" text={selectedPath.idea} />
                  <MiniInfo title="نکته مهم" text={selectedPath.note} />
                </div>
              </div>

              <InsightBox>
                در این درس همه این فناوری‌ها را عمیق آموزش نمی‌دهیم. فقط نقشه را می‌سازیم تا بدانید هر مسیر در چه مسئله‌ای معنا پیدا می‌کند.
              </InsightBox>
            </SceneCard>
          )}

          {scene === 2 && (
            <SceneCard
              eyebrow="آزمایشگاه انیمیشنی"
              title="دو منطق متفاوت تولید داده: RNA-seq در برابر Microarray"
              description="این دو فناوری را به‌عنوان دو نمونه بسیار متفاوت کنار هم می‌گذاریم تا منطق تولید داده را ببینید. هدف انتخاب «برنده» نیست."
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <TechnologySwitch
                  active={animationTechnology === "rna-seq"}
                  title="RNA-seq"
                  subtitle="مبتنی بر توالی‌یابی"
                  onClick={() => changeAnimationTechnology("rna-seq")}
                />
                <TechnologySwitch
                  active={animationTechnology === "microarray"}
                  title="Microarray"
                  subtitle="مبتنی بر Probe و شدت سیگنال"
                  onClick={() => changeAnimationTechnology("microarray")}
                />
              </div>

              <div className="mt-6 overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-950 text-white shadow-xl">
                <div className="border-b border-white/10 p-5 sm:p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold text-teal-300">
                        مرحله {new Intl.NumberFormat("fa-IR").format(animationStep + 1)} از {new Intl.NumberFormat("fa-IR").format(animationSteps.length)}
                      </p>
                      <h3 className="mt-2 text-xl font-black">
                        {animationSteps[animationStep].title}
                      </h3>
                    </div>

                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold text-slate-300">
                      {animationSteps[animationStep].short}
                    </span>
                  </div>
                </div>

                <div className="p-5 sm:p-7">
                  <TechnologyAnimationStage
                    technology={animationTechnology}
                    step={animationStep}
                  />

                  <div className="mt-7 rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-sm leading-8 text-slate-300">
                      {animationSteps[animationStep].explanation}
                    </p>
                  </div>

                  <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={animationStep === 0}
                        onClick={() => {
                          setIsPlaying(false);
                          setAnimationStep((current) => Math.max(0, current - 1));
                        }}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
                        aria-label="مرحله قبل"
                      >
                        <StepBack className="size-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (animationStep >= animationSteps.length - 1) {
                            setAnimationStep(0);
                            setIsPlaying(true);
                            return;
                          }
                          setIsPlaying((current) => !current);
                        }}
                        className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-teal-500 px-4 py-2 text-xs font-black text-slate-950 transition hover:bg-teal-400"
                      >
                        {isPlaying ? <Pause className="size-4" /> : <Play className="size-4" />}
                        {isPlaying ? "توقف" : animationStep >= animationSteps.length - 1 ? "پخش دوباره" : "پخش خودکار"}
                      </button>

                      <button
                        type="button"
                        disabled={animationStep >= animationSteps.length - 1}
                        onClick={() => {
                          setIsPlaying(false);
                          setAnimationStep((current) =>
                            Math.min(animationSteps.length - 1, current + 1),
                          );
                        }}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
                        aria-label="مرحله بعد"
                      >
                        <StepForward className="size-4" />
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {animationSteps.map((stepItem, index) => (
                        <button
                          key={stepItem.title}
                          type="button"
                          onClick={() => {
                            setIsPlaying(false);
                            setAnimationStep(index);
                          }}
                          className={[
                            "h-2.5 rounded-full transition-all",
                            index === animationStep
                              ? "w-7 bg-teal-300"
                              : index < animationStep
                                ? "w-2.5 bg-teal-600"
                                : "w-2.5 bg-white/20",
                          ].join(" ")}
                          aria-label={`رفتن به مرحله ${index + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <ComparisonCard
                  title="RNA-seq"
                  subtitle="Sequencing-based"
                  items={[
                    "خوانش توالی تولید می‌شود",
                    "FASTQ یکی از داده‌های خام رایج است",
                    "اندازه‌گیری به Probe از پیش تعریف‌شده محدود نیست",
                    "بعد از کمی‌سازی می‌توان به ماتریس بیان رسید",
                  ]}
                  emphasized
                />
                <ComparisonCard
                  title="Microarray"
                  subtitle="Probe / signal-based"
                  items={[
                    "هدف به Probeهای از پیش طراحی‌شده متصل می‌شود",
                    "شدت سیگنال اندازه‌گیری می‌شود",
                    "FASTQ تولید نمی‌شود",
                    "بعد از پردازش و نرمال‌سازی می‌توان به ماتریس بیان رسید",
                  ]}
                />
              </div>

              <InsightBox>
                <strong>دو مسیر متفاوت، یک سؤال مشترک ممکن.</strong> تفاوت اصلی در منطق اندازه‌گیری و نوع داده‌ای است که از فناوری بیرون می‌آید.
              </InsightBox>
            </SceneCard>
          )}

          {scene === 3 && (
            <SceneCard
              eyebrow="پل به فناوری‌های دیگر"
              title="فناوری‌های دیگر را با این نقشه راحت‌تر می‌فهمیم."
              description="RNA-seq و Microarray تمام ترنسکریپتومیکس نیستند؛ مقایسه آن‌ها فقط کمک می‌کند منطق فناوری را از حوزه علمی جدا کنیم."
            >
              <div className="grid gap-4 md:grid-cols-2">
                <BridgeCard
                  title="خانواده‌های sequencing-based"
                  icon={<ScanLine className="size-5" />}
                  lines={[
                    "Bulk RNA-seq از منطق توالی‌یابی برای نمونه ترکیبی استفاده می‌کند.",
                    "scRNA-seq منطق sequencing-based را به سطح سلول می‌برد.",
                    "small RNA-seq طراحی Library و تحلیل را برای RNAهای کوچک تنظیم می‌کند.",
                    "Long-read Transcriptomics خوانش‌های بلندتر را برای transcript و isoformها به‌کار می‌گیرد.",
                  ]}
                  emphasized
                />
                <BridgeCard
                  title="خانواده‌های Probe / imaging / spatial"
                  icon={<Microscope className="size-5" />}
                  lines={[
                    "Microarray نمونه کلاسیک منطق Probe-based و شدت سیگنال است.",
                    "فناوری‌های فضایی یک خانواده متنوع‌اند و همه آن‌ها دقیقاً یک منطق فنی ندارند.",
                    "بعضی روش‌های فضایی sequencing-based هستند و بعضی از Probe، imaging یا ترکیبی از این رویکردها استفاده می‌کنند.",
                    "پس نام فناوری باید قبل از تفسیر نوع فایل و pipeline بررسی شود.",
                  ]}
                />
              </div>

              <DecisionQuestion
                question="کدام برداشت علمی‌تر است؟"
                options={[
                  "چون scRNA-seq در نامش RNA-seq دارد، دیگر سطح مشاهده اهمیتی ندارد.",
                  "فناوری‌های جدید ممکن است یک منطق اندازه‌گیری را توسعه دهند یا چند منطق را ترکیب کنند؛ باید سؤال، سطح مشاهده و فناوری را جدا بررسی کرد.",
                  "همه فناوری‌های فضایی دقیقاً همان Microarray هستند.",
                ]}
                selected={bridgeAnswer}
                correctIndex={1}
                onSelect={setBridgeAnswer}
                correctFeedback="دقیقاً. فناوری‌های واقعی همیشه در یک طبقه‌بندی ساده تک‌محوری جا نمی‌شوند."
                incorrectFeedback="برای خواندن درست فناوری‌های جدید باید چند محور را جدا کنیم: سؤال، سطح مشاهده، نوع RNA و منطق اندازه‌گیری."
              />
            </SceneCard>
          )}

          {scene === 4 && (
            <SceneCard
              eyebrow="ردپای فناوری در داده"
              title="نوع فایل می‌تواند سرنخ بدهد؛ اما Metadata تصمیم نهایی را می‌گیرد."
              description="وقتی با داده عمومی روبه‌رو می‌شوید، فقط از روی نام فایل نتیجه‌گیری نکنید. پلتفرم و روش مطالعه را هم بخوانید."
            >
              <div className="grid gap-4 lg:grid-cols-3">
                <DataSignatureCard
                  title="RNA-seq"
                  badge="FASTQ / Counts"
                  icon={<FileText className="size-5" />}
                  text="ممکن است FASTQ، BAM یا ماتریس شمارش در دسترس باشد؛ سطح پردازش Dataset تعیین می‌کند چه چیزی می‌بینید."
                />
                <DataSignatureCard
                  title="Microarray"
                  badge="Platform-specific signals"
                  icon={<Grid3X3 className="size-5" />}
                  text="ممکن است فایل خام پلتفرم یا ماتریس پردازش‌شده شدت بیان وجود داشته باشد؛ انتظار FASTQ نداریم."
                />
                <DataSignatureCard
                  title="Spatial / Single-cell"
                  badge="چند لایه داده"
                  icon={<Layers3 className="size-5" />}
                  text="ممکن است علاوه بر ماتریس بیان، بارکد سلول، مختصات فضایی، تصویر یا Metadata تخصصی لازم باشد."
                />
              </div>

              <DecisionQuestion
                question="در GEO یک مطالعه Transcriptomics پیدا کرده‌اید اما FASTQ نمی‌بینید. بهترین قدم بعدی چیست؟"
                options={[
                  "مطالعه را کنار بگذاریم چون Transcriptomics واقعی نیست.",
                  "Metadata، پلتفرم و روش تولید داده را بررسی کنیم؛ ممکن است Microarray یا داده پردازش‌شده باشد.",
                  "فرض کنیم فایل‌ها حتماً خراب شده‌اند.",
                ]}
                selected={dataAnswer}
                correctIndex={1}
                onSelect={setDataAnswer}
                correctFeedback="درست است. فناوری و سطح پردازش مشخص می‌کنند چه فایل‌هایی باید انتظار داشته باشید."
                incorrectFeedback="FASTQ فقط به بخشی از فناوری‌های sequencing-based مربوط است و نبود آن به‌تنهایی چیزی را ثابت نمی‌کند."
              />

              <InsightBox>
                <strong>نوع فایل ≠ هویت کامل فناوری.</strong> همیشه Metadata، نام پلتفرم و بخش Methods را کنار فایل‌ها بخوانید.
              </InsightBox>
            </SceneCard>
          )}

          {scene === 5 && (
            <SceneCard
              eyebrow="آزمایشگاه انتخاب مسیر"
              title="از سؤال پژوهشی به مسیر مناسب‌تر برسید."
              description="قرار نیست یک فناوری را همیشه انتخاب کنیم؛ هر سؤال نوع متفاوتی از اطلاعات می‌خواهد."
            >
              <DecisionQuestion
                question="۱) می‌خواهم اثر کلی داروی X بر بیان ژن در چند نمونه مستقل سرطان پانکراس را بررسی کنم. ناهمگنی سلولی سؤال اصلی نیست."
                options={[
                  "Bulk RNA-seq یا در بعضی طراحی‌ها Microarray می‌تواند مناسب باشد.",
                  "حتماً scRNA-seq لازم است.",
                  "فقط Spatial Transcriptomics معتبر است.",
                ]}
                selected={decision1}
                correctIndex={0}
                onSelect={setDecision1}
                correctFeedback="بله. وقتی سؤال در سطح نمونه تعریف شده، فناوری توده‌ای می‌تواند کافی باشد؛ انتخاب دقیق به طراحی و نیاز پروژه بستگی دارد."
                incorrectFeedback="جزئیات بیشتر همیشه لازم نیست. سؤال پژوهشی باید تعیین کند چه سطحی از اطلاعات لازم داریم."
              />

              <DecisionQuestion
                question="۲) می‌خواهم بدانم کدام زیرجمعیت سلولی بعد از داروی X پاسخ متفاوتی دارد."
                options={[
                  "Microarray توده‌ای به‌تنهایی",
                  "scRNA-seq یا یک طراحی سلول‌محور مناسب",
                  "فقط Long-read روی یک RNA ترکیبی",
                ]}
                selected={decision2}
                correctIndex={1}
                onSelect={setDecision2}
                correctFeedback="دقیقاً. خود هویت سلول‌ها بخشی از سؤال است، پس سطح تک‌سلولی معنا پیدا می‌کند."
                incorrectFeedback="برای دیدن پاسخ زیرجمعیت‌ها باید اطلاعات سلول‌محور حفظ شود."
              />

              <DecisionQuestion
                question="۳) سؤال اصلی درباره تغییر isoformها و ساختار transcript است. کدام مسیر ارزش بررسی بیشتری دارد؟"
                options={[
                  "Long-read Transcriptomics",
                  "آزمون مهاجرت سلولی به‌تنهایی",
                  "Microarray بدون توجه به طراحی Probeها",
                ]}
                selected={decision3}
                correctIndex={0}
                onSelect={setDecision3}
                correctFeedback="درست است. خوانش بلند برای سؤال‌های مربوط به transcript و isoform می‌تواند مزیت مهمی داشته باشد."
                incorrectFeedback="وقتی ساختار transcript سؤال اصلی است، فناوری باید بتواند آن ساختار را با وضوح مناسب مشاهده کند."
              />

              <div className="mt-7 rounded-3xl border border-amber-200 bg-amber-50 p-6">
                <p className="font-black text-amber-950">کلینیک اشتباه</p>
                <p className="mt-3 text-sm leading-8 text-amber-900">
                  «اگر یک فناوری جدیدتر و پیچیده‌تر باشد، حتماً برای پروژه من بهتر است.»
                </p>
              </div>

              <DecisionQuestion
                question="بهترین اصلاح این جمله چیست؟"
                options={[
                  "فناوری پیچیده‌تر همیشه نتیجه علمی معتبرتری می‌دهد.",
                  "مناسب بودن فناوری به سؤال، طراحی، نمونه، محدودیت‌ها و نوع نتیجه موردنیاز بستگی دارد.",
                  "پس بهتر است اصلاً از فناوری‌های جدید استفاده نکنیم.",
                ]}
                selected={mistakeAnswer}
                correctIndex={1}
                onSelect={setMistakeAnswer}
                correctFeedback="دقیقاً. قابل اجرا بودن یا جدید بودن با مناسب بودن برای سؤال یکی نیست."
                incorrectFeedback="هدف انتخاب فناوریِ متناسب است، نه بیشترین پیچیدگی ممکن."
              />

              <div className="mt-6 rounded-3xl bg-slate-950 p-6 text-white">
                <p className="text-xs font-bold text-teal-300">اصل هاب‌ژن</p>
                <p className="mt-3 text-xl font-black leading-9">
                  سؤال ← مفهوم ← تصمیم ← فناوری ← تحلیل
                </p>
              </div>
            </SceneCard>
          )}

          {scene === 6 && (
            <SceneCard
              eyebrow="ایستگاه تسلط"
              title="مبانی ترنسکریپتومیکس تمام شد؛ حالا می‌توانید وارد یک مسیر تخصصی شوید."
              description="آخرین سؤال بررسی می‌کند آیا حوزه، سطح مشاهده، فناوری و نوع داده را در جای درست قرار می‌دهید."
            >
              <DecisionQuestion
                question="کدام جمله دقیق‌ترین نقشه را توصیف می‌کند؟"
                options={[
                  "ترنسکریپتومیکس همان RNA-seq است و همه مسیرها باید FASTQ داشته باشند.",
                  "ترنسکریپتومیکس حوزه علمی است؛ فناوری‌هایی مانند RNA-seq، Microarray، scRNA-seq، Spatial، Long-read و small RNA-seq مسیرهای متفاوتی برای سؤال‌ها و انواع اطلاعات مختلف فراهم می‌کنند.",
                  "Microarray، scRNA-seq و Spatial همگی نام‌های دیگر Bulk RNA-seq هستند.",
                  "بعد از انتخاب فناوری دیگر طراحی مطالعه اهمیتی ندارد.",
                ]}
                selected={masteryAnswer}
                correctIndex={1}
                onSelect={setMasteryAnswer}
                correctFeedback="عالی. شما حالا فناوری را داخل یک نقشه بزرگ‌تر می‌بینید، نه به‌عنوان خود ترنسکریپتومیکس."
                incorrectFeedback="به نقشه برگردید: حوزه علمی گسترده‌تر است و فناوری فقط یکی از تصمیم‌های مسیر پژوهش است."
              />

              <div className="mt-8">
                <p className="font-bold text-slate-950">
                  این نقشه چقدر برایتان روشن است؟
                </p>
                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  <ConfidenceButton
                    active={confidence === "unclear"}
                    title="هنوز مبهم است"
                    description="حوزه، سطح مشاهده و فناوری هنوز برایم قاطی می‌شوند."
                    onClick={() => setConfidence("unclear")}
                  />
                  <ConfidenceButton
                    active={confidence === "developing"}
                    title="تقریباً متوجه شدم"
                    description="نقشه کلی روشن است ولی در انتخاب فناوری هنوز تمرین می‌خواهم."
                    onClick={() => setConfidence("developing")}
                  />
                  <ConfidenceButton
                    active={confidence === "clear"}
                    title="کاملاً روشن است"
                    description="می‌توانم مسیر فناوری را بر اساس سؤال و نوع اطلاعات موردنیاز توجیه کنم."
                    onClick={() => setConfidence("clear")}
                  />
                </div>
              </div>

              <div className="mt-7 rounded-3xl bg-slate-950 p-6 text-white">
                <p className="text-xs font-bold text-teal-300">
                  لحظه فهم مبانی ترنسکریپتومیکس
                </p>
                <p className="mt-3 text-lg font-bold leading-9">
                  حالا می‌دانم ترنسکریپتومیکس یک حوزه است و برای ورود به پروژه واقعی باید از سؤال پژوهشی به سطح مشاهده، فناوری، نوع داده و سپس pipeline مناسب برسم.
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
                      : "مبانی ترنسکریپتومیکس با موفقیت تکمیل شده است."}
                  </p>
                </div>
              )}

              {!userId && (
                <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-7 text-amber-900">
                  در حالت مهمان می‌توانید کل درس را استفاده کنید، اما نتیجه نهایی به‌صورت دائمی ذخیره نمی‌شود.
                </div>
              )}

              <div className="mt-8">
                <p className="text-xs font-bold text-teal-700">
                  مسیرهای تخصصی بعد از مبانی
                </p>
                <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  <GatewayCard
                    title="RNA-seq توده‌ای"
                    subtitle="Bulk RNA-seq"
                    description="از سؤال و طراحی مطالعه تا FASTQ، کنترل کیفیت، کمی‌سازی، ماتریس بیان و تفسیر."
                    active
                    href="/learn/rna-seq"
                  />
                  <GatewayCard
                    title="Microarray"
                    subtitle="Microarray"
                    description="پلتفرم، Probe، سیگنال، نرمال‌سازی و تحلیل داده‌های Microarray."
                  />
                  <GatewayCard
                    title="RNA-seq تک‌سلولی"
                    subtitle="scRNA-seq"
                    description="سلول‌ها، خوشه‌بندی، هویت سلولی و تحلیل ناهمگنی."
                  />
                  <GatewayCard
                    title="ترنسکریپتومیکس فضایی"
                    subtitle="Spatial Transcriptomics"
                    description="ترکیب الگوی RNA با جایگاه فضایی در بافت."
                  />
                  <GatewayCard
                    title="ترنسکریپتومیکس با خوانش بلند"
                    subtitle="Long-read Transcriptomics"
                    description="ساختار transcript، isoform و خوانش‌های بلندتر."
                  />
                  <GatewayCard
                    title="توالی‌یابی RNAهای کوچک"
                    subtitle="small RNA-seq"
                    description="miRNA و سایر RNAهای کوچک با Library و تحلیل متناسب."
                  />
                </div>
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
  items,
  emphasized = false,
}: {
  title: string;
  items: string[];
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
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li
            key={item}
            className="flex items-start gap-2 text-sm leading-7 text-slate-600"
          >
            <CheckCircle2 className="mt-1 size-4 shrink-0 text-teal-700" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MiniInfo({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="text-xs font-bold text-teal-300">{title}</p>
      <p className="mt-2 text-sm leading-7 text-slate-300">{text}</p>
    </div>
  );
}

function TechnologySwitch({
  active,
  title,
  subtitle,
  onClick,
}: {
  active: boolean;
  title: string;
  subtitle: string;
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
      <p className="font-black text-slate-950">{title}</p>
      <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
    </button>
  );
}

function TechnologyAnimationStage({
  technology,
  step,
}: {
  technology: AnimationTechnology;
  step: number;
}) {
  return technology === "rna-seq" ? (
    <RnaSeqAnimationStage step={step} />
  ) : (
    <MicroarrayAnimationStage step={step} />
  );
}

function StageFrame({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-[300px] rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-white/[0.03] p-5 sm:p-7">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-black text-white">{title}</p>
          <p className="mt-1 text-xs text-slate-400">{subtitle}</p>
        </div>
        <Sparkles className="size-5 text-teal-300" />
      </div>
      <div className="mt-8">{children}</div>
    </div>
  );
}

function RnaSeqAnimationStage({ step }: { step: number }) {
  if (step === 0) {
    return (
      <StageFrame title="نمونه زیستی" subtitle="شروع از نمونه، نه از دستگاه">
        <div className="mx-auto flex max-w-md items-end justify-center gap-6">
          <div className="relative flex h-40 w-28 items-end justify-center rounded-b-[2rem] rounded-t-xl border-4 border-cyan-200/30 bg-cyan-300/10 p-3">
            <div className="h-20 w-full animate-pulse rounded-b-[1.4rem] bg-rose-400/50" />
            <TestTube2 className="absolute -top-8 size-12 text-cyan-300" />
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-7 text-slate-300">
            نمونه کنترل و نمونه تیمارشده باید از یک طراحی زیستی معتبر بیایند.
          </div>
        </div>
      </StageFrame>
    );
  }

  if (step === 1) {
    return (
      <StageFrame title="استخراج RNA" subtitle="مولکول‌های RNA از نمونه جدا می‌شوند">
        <div className="flex flex-wrap items-center justify-center gap-4">
          {[0, 1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-16 w-36 animate-pulse rounded-full border-2 border-teal-300/60 bg-teal-300/10"
              style={{ transform: `rotate(${item % 2 === 0 ? -8 : 8}deg)` }}
            />
          ))}
        </div>
      </StageFrame>
    );
  }

  if (step === 2) {
    return (
      <StageFrame title="آماده‌سازی Library" subtitle="مولکول‌ها برای Sequencing آماده می‌شوند">
        <div className="grid gap-3 sm:grid-cols-4">
          {["ACTG", "TGCA", "GGTA", "CAAT", "TACC", "AGGT", "CTGA", "GTAC"].map(
            (sequence, index) => (
              <div
                key={`${sequence}-${index}`}
                className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center font-mono text-sm text-teal-200 transition-all duration-500"
              >
                {sequence}
              </div>
            ),
          )}
        </div>
        <p className="mt-5 text-center text-xs text-slate-400">
          نمایش مفهومی است؛ جزئیات واقعی Library prep به پروتکل بستگی دارد.
        </p>
      </StageFrame>
    );
  }

  if (step === 3) {
    return (
      <StageFrame title="توالی‌یابی" subtitle="Library وارد پلتفرم Sequencing می‌شود">
        <div className="mx-auto max-w-2xl rounded-3xl border border-teal-300/30 bg-teal-300/5 p-6">
          <div className="grid grid-cols-4 gap-3">
            {[0, 1, 2, 3, 4, 5, 6, 7].map((item) => (
              <div key={item} className="relative h-20 overflow-hidden rounded-xl bg-white/5">
                <div
                  className="absolute inset-x-2 top-2 h-3 animate-bounce rounded-full bg-teal-300"
                  style={{ animationDelay: `${item * 80}ms` }}
                />
                <div className="absolute inset-x-2 bottom-2 h-10 rounded-lg border border-white/10" />
              </div>
            ))}
          </div>
          <p className="mt-4 text-center text-xs text-slate-400">نمای آموزشی دستگاه توالی‌یابی</p>
        </div>
      </StageFrame>
    );
  }

  if (step === 4) {
    return (
      <StageFrame title="Reads و FASTQ" subtitle="خروجی خام sequencing-based">
        <pre
          dir="ltr"
          className="mx-auto max-w-2xl overflow-x-auto rounded-2xl border border-white/10 bg-black/30 p-5 text-left text-sm leading-8 text-teal-200"
        >{`@read001\nATCGTACGTTAC\n+\nIIIIHHHHGGFF\n\n@read002\nGGCATTAACGTA\n+\nHHHIIIIGGGFF`}</pre>
      </StageFrame>
    );
  }

  if (step === 5) {
    return (
      <StageFrame title="کمی‌سازی" subtitle="Reads به مقدار بیان تبدیل می‌شوند">
        <div className="mx-auto max-w-xl space-y-4">
          <AnimatedBar label="Gene A" value="82%" width="82%" />
          <AnimatedBar label="Gene B" value="46%" width="46%" />
          <AnimatedBar label="Gene C" value="67%" width="67%" />
          <AnimatedBar label="Gene D" value="29%" width="29%" />
        </div>
      </StageFrame>
    );
  }

  return (
    <StageFrame title="ماتریس بیان" subtitle="خروجی قابل ورود به تحلیل آماری">
      <ExpressionMatrixVisual />
    </StageFrame>
  );
}

function MicroarrayAnimationStage({ step }: { step: number }) {
  if (step === 0) {
    return (
      <StageFrame title="نمونه زیستی" subtitle="همان سؤال می‌تواند با فناوری دیگری بررسی شود">
        <div className="mx-auto flex max-w-md items-end justify-center gap-6">
          <div className="relative flex h-40 w-28 items-end justify-center rounded-b-[2rem] rounded-t-xl border-4 border-violet-200/30 bg-violet-300/10 p-3">
            <div className="h-20 w-full animate-pulse rounded-b-[1.4rem] bg-rose-400/50" />
            <TestTube2 className="absolute -top-8 size-12 text-violet-300" />
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-7 text-slate-300">
            سؤال زیستی می‌تواند مشابه باشد، اما مسیر تولید داده از اینجا متفاوت می‌شود.
          </div>
        </div>
      </StageFrame>
    );
  }

  if (step === 1) {
    return (
      <StageFrame title="استخراج RNA" subtitle="RNA از نمونه جدا می‌شود">
        <div className="flex flex-wrap items-center justify-center gap-4">
          {[0, 1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-16 w-36 animate-pulse rounded-full border-2 border-violet-300/60 bg-violet-300/10"
              style={{ transform: `rotate(${item % 2 === 0 ? -8 : 8}deg)` }}
            />
          ))}
        </div>
      </StageFrame>
    );
  }

  if (step === 2) {
    return (
      <StageFrame title="نشاندارسازی" subtitle="نمونه برای آشکارسازی سیگنال آماده می‌شود">
        <div className="flex flex-wrap items-center justify-center gap-5">
          {[0, 1, 2, 3].map((item) => (
            <div key={item} className="relative h-20 w-40 rounded-full border-2 border-violet-300/60 bg-violet-300/10">
              <span className="absolute left-4 top-3 h-3 w-3 animate-ping rounded-full bg-amber-300" />
              <span className="absolute right-8 top-8 h-3 w-3 animate-pulse rounded-full bg-amber-300" />
              <span className="absolute bottom-3 left-1/2 h-3 w-3 animate-pulse rounded-full bg-amber-300" />
            </div>
          ))}
        </div>
      </StageFrame>
    );
  }

  if (step === 3) {
    return (
      <StageFrame title="هیبریداسیون" subtitle="هدف به Probeهای از پیش طراحی‌شده متصل می‌شود">
        <div className="mx-auto max-w-2xl">
          <div className="grid grid-cols-4 gap-3 rounded-3xl border border-violet-300/20 bg-violet-300/5 p-5">
            {[0, 1, 2, 3, 4, 5, 6, 7].map((item) => (
              <div key={item} className="relative h-24 rounded-xl border border-white/10 bg-white/5">
                <div className="absolute bottom-3 left-1/2 h-12 w-1 -translate-x-1/2 rounded-full bg-violet-300/70" />
                <div
                  className="absolute left-1/2 top-3 h-8 w-8 -translate-x-1/2 animate-bounce rounded-full border-2 border-amber-300 bg-amber-300/10"
                  style={{ animationDelay: `${item * 100}ms` }}
                />
              </div>
            ))}
          </div>
          <p className="mt-4 text-center text-xs text-slate-400">هدف RNA/cDNA ← اتصال مکمل به Probe</p>
        </div>
      </StageFrame>
    );
  }

  if (step === 4) {
    const opacities = [0.2, 0.8, 0.45, 1, 0.35, 0.65, 0.9, 0.25, 0.75, 0.5, 0.3, 0.85, 0.55, 0.95, 0.4, 0.7];
    return (
      <StageFrame title="شدت سیگنال" subtitle="هر Spot شدت متفاوتی دارد">
        <div className="mx-auto max-w-lg rounded-3xl border border-violet-300/20 bg-violet-300/5 p-5">
          <div className="grid grid-cols-4 gap-3">
            {opacities.map((opacity, index) => (
              <div
                key={index}
                className="aspect-square animate-pulse rounded-xl bg-amber-300"
                style={{ opacity, animationDelay: `${index * 70}ms` }}
              />
            ))}
          </div>
          <p className="mt-4 text-center text-xs text-slate-400">روشنایی بیشتر = سیگنال بیشتر؛ نمایش صرفاً مفهومی است.</p>
        </div>
      </StageFrame>
    );
  }

  if (step === 5) {
    return (
      <StageFrame title="پردازش و نرمال‌سازی" subtitle="سیگنال خام باید قابل مقایسه شود">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs font-bold text-violet-300">قبل از نرمال‌سازی</p>
            <div className="mt-4 space-y-3">
              <AnimatedBar label="Probe A" value="92" width="92%" />
              <AnimatedBar label="Probe B" value="35" width="35%" />
              <AnimatedBar label="Probe C" value="71" width="71%" />
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs font-bold text-teal-300">پس از پردازش</p>
            <div className="mt-4 space-y-3">
              <AnimatedBar label="Probe A" value="74" width="74%" />
              <AnimatedBar label="Probe B" value="48" width="48%" />
              <AnimatedBar label="Probe C" value="66" width="66%" />
            </div>
          </div>
        </div>
      </StageFrame>
    );
  }

  return (
    <StageFrame title="ماتریس بیان" subtitle="خروجی پردازش‌شده قابل تحلیل">
      <ExpressionMatrixVisual />
    </StageFrame>
  );
}

function AnimatedBar({
  label,
  value,
  width,
}: {
  label: string;
  value: string;
  width: string;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3 text-xs">
        <span className="text-slate-300">{label}</span>
        <span className="text-slate-500">{value}</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-teal-300 transition-all duration-1000"
          style={{ width }}
        />
      </div>
    </div>
  );
}

function ExpressionMatrixVisual() {
  const values = [
    [8, 11, 5],
    [2, 4, 9],
    [14, 12, 7],
    [5, 6, 3],
  ];

  return (
    <div className="mx-auto max-w-2xl overflow-hidden rounded-2xl border border-white/10">
      <div className="grid grid-cols-4 bg-white/10 text-center text-xs font-bold text-slate-300">
        <div className="p-3">ژن</div>
        <div className="p-3">نمونه ۱</div>
        <div className="p-3">نمونه ۲</div>
        <div className="p-3">نمونه ۳</div>
      </div>
      {values.map((row, rowIndex) => (
        <div key={rowIndex} className="grid grid-cols-4 border-t border-white/10 text-center text-xs">
          <div className="p-3 font-bold text-teal-300">Gene {String.fromCharCode(65 + rowIndex)}</div>
          {row.map((value, index) => (
            <div key={`${rowIndex}-${index}`} className="p-3 text-slate-300">{value}</div>
          ))}
        </div>
      ))}
    </div>
  );
}

function ComparisonCard({
  title,
  subtitle,
  items,
  emphasized = false,
}: {
  title: string;
  subtitle: string;
  items: string[];
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
      <p className="mt-1 text-xs text-slate-400">{subtitle}</p>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm leading-7 text-slate-600">
            <CheckCircle2 className="mt-1 size-4 shrink-0 text-teal-700" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function BridgeCard({
  title,
  icon,
  lines,
  emphasized = false,
}: {
  title: string;
  icon: ReactNode;
  lines: string[];
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
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-teal-300">
          {icon}
        </span>
        <p className="font-black text-slate-950">{title}</p>
      </div>
      <div className="mt-4 space-y-3">
        {lines.map((line) => (
          <p key={line} className="text-sm leading-7 text-slate-600">
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}

function DataSignatureCard({
  title,
  badge,
  icon,
  text,
}: {
  title: string;
  badge: string;
  icon: ReactNode;
  text: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
      <div className="flex items-start justify-between gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-teal-300">
          {icon}
        </span>
        <span className="rounded-full bg-white px-3 py-1 text-[10px] font-bold text-slate-500">
          {badge}
        </span>
      </div>
      <p className="mt-4 font-black text-slate-950">{title}</p>
      <p className="mt-3 text-sm leading-8 text-slate-600">{text}</p>
    </div>
  );
}

function GatewayCard({
  title,
  subtitle,
  description,
  active = false,
  href,
}: {
  title: string;
  subtitle: string;
  description: string;
  active?: boolean;
  href?: string;
}) {
  const content = (
    <>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-black text-slate-950">{title}</p>
          <p className="mt-1 text-xs text-slate-400">{subtitle}</p>
        </div>
        <span
          className={[
            "rounded-full px-3 py-1 text-[10px] font-bold",
            active
              ? "bg-emerald-100 text-emerald-800"
              : "bg-slate-100 text-slate-500",
          ].join(" ")}
        >
          {active ? "فعال" : "مسیر آینده"}
        </span>
      </div>
      <p className="mt-4 text-sm leading-7 text-slate-600">{description}</p>
      {active && (
        <p className="mt-4 inline-flex items-center gap-2 text-xs font-black text-teal-800">
          ورود به مسیر تخصصی
          <ArrowLeft className="size-4" />
        </p>
      )}
    </>
  );

  if (active && href) {
    return (
      <a
        href={href}
        className="rounded-3xl border border-teal-300 bg-teal-50 p-5 transition hover:border-teal-500 hover:shadow-md"
      >
        {content}
      </a>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 opacity-80">
      {content}
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
            className={
              correct
                ? "text-sm font-bold text-emerald-900"
                : "text-sm font-bold text-amber-950"
            }
          >
            {correct ? "مسیر فکری درست ✓" : "بیایید این برداشت را دوباره بررسی کنیم"}
          </p>
          <p className="mt-2 text-sm leading-7 text-slate-700">
            {correct ? correctFeedback : incorrectFeedback}
          </p>
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
