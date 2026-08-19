import {
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Lightbulb,
  Loader2,
  RotateCcw,
  Sparkles,
} from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { InteractiveLessonShell } from "../components/InteractiveLessonShell";
import { TranscriptomicsTechnologyVisual } from "@/components/learning/TranscriptomicsTechnologyVisual";

type Confidence = "unclear" | "developing" | "clear";

type SaveState =
  | "guest"
  | "loading"
  | "idle"
  | "saving"
  | "saved"
  | "error";

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
  "از مبانی به فناوری‌ها",
  "نقشه فناوری‌ها",
  "RNA-seq در برابر Microarray",
  "فناوری‌های دیگر کجا قرار می‌گیرند؟",
  "نوع داده چه سرنخی می‌دهد؟",
  "انتخاب فناوری بر اساس سؤال",
  "تسلط و ورود به مسیر تخصصی",
];

const technologies = [
  {
    title: "RNA-seq توده‌ای",
    description:
      "اندازه‌گیری RNA در سطح نمونه با فناوری مبتنی بر توالی‌یابی.",
    note: "مسیر تخصصی فعال هاب‌ژن",
  },
  {
    title: "Microarray",
    description:
      "اندازه‌گیری بیان با پروب‌های از پیش طراحی‌شده و شدت سیگنال.",
    note: "مسیر تخصصی آینده",
  },
  {
    title: "RNA-seq تک‌سلولی",
    description:
      "اندازه‌گیری RNA در سطح سلول‌ها برای مشاهده ناهمگنی سلولی.",
    note: "خانواده sequencing-based",
  },
  {
    title: "ترنسکریپتومیکس فضایی",
    description:
      "مطالعه RNA همراه با اطلاعات مکانی بافت؛ فناوری‌های این حوزه متنوع‌اند.",
    note: "خانواده فناوری‌های متنوع",
  },
  {
    title: "ترنسکریپتومیکس خوانش‌بلند",
    description:
      "استفاده از خوانش‌های بلندتر برای مطالعه ساختار ترنسکریپت و ایزوفرم‌ها.",
    note: "خانواده sequencing-based",
  },
  {
    title: "small RNA-seq",
    description:
      "توالی‌یابی با طراحی مناسب برای RNAهای کوچک مانند miRNA.",
    note: "خانواده sequencing-based",
  },
];

export function RnaSeqInTranscriptomicsLesson() {
  const { session } = useAuth();
  const userId = session?.user?.id ?? null;

  const [scene, setScene] = useState(0);

  const [openingAnswer, setOpeningAnswer] =
    useState<number | null>(null);
  const [mapAnswer, setMapAnswer] =
    useState<number | null>(null);
  const [pathAnswer, setPathAnswer] =
    useState<number | null>(null);
  const [familyAnswer, setFamilyAnswer] =
    useState<number | null>(null);
  const [dataAnswer, setDataAnswer] =
    useState<number | null>(null);

  const [case1, setCase1] = useState<number | null>(null);
  const [case2, setCase2] = useState<number | null>(null);
  const [case3, setCase3] = useState<number | null>(null);
  const [case4, setCase4] = useState<number | null>(null);
  const [case5, setCase5] = useState<number | null>(null);

  const [masteryAnswer, setMasteryAnswer] =
    useState<number | null>(null);
  const [confidence, setConfidence] =
    useState<Confidence | null>(null);

  const [saveState, setSaveState] =
    useState<SaveState>("guest");
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

  const canFinish =
    masteryAnswer !== null && Boolean(confidence);

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
    setMapAnswer(null);
    setPathAnswer(null);
    setFamilyAnswer(null);
    setDataAnswer(null);

    setCase1(null);
    setCase2(null);
    setCase3(null);
    setCase4(null);
    setCase5(null);

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
      title="نقشه فناوری‌های ترنسکریپتومیکس"
      subtitle="آخرین درس مبانی ترنسکریپتومیکس: از تفاوت RNA-seq و Microarray تا جایگاه تک‌سلولی، فضایی، خوانش‌بلند و small RNA-seq."
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
              eyebrow="پایان مبانی"
              title="حالا می‌توانیم از «ترنسکریپتوم چیست؟» وارد «با چه فناوری آن را اندازه بگیریم؟» شویم."
              description="در درس‌های قبلی درباره ژنوم، ترنسکریپتوم، بیان ژن، طراحی نمونه و سطح مشاهده صحبت کردیم. اینجا برای اولین بار نقشه فناوری‌ها را روی آن مدل ذهنی قرار می‌دهیم."
            >
              <div className="rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white">
                <p className="text-xs font-bold text-teal-300">
                  نقشه تصمیم
                </p>

                <div dir="rtl" className="mt-5 flex flex-wrap items-center gap-2 text-sm font-black">
                  {[
                    "سؤال پژوهشی",
                    "اطلاعات موردنیاز",
                    "سطح مشاهده",
                    "فناوری",
                    "نوع داده",
                    "تحلیل",
                  ].map((item, index, items) => (
                    <div
                      key={item}
                      className="flex items-center gap-2"
                    >
                      <span className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                        {item}
                      </span>

                      {index < items.length - 1 && (
                        <span className="text-teal-300">←</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <DecisionQuestion
                question="کدام جمله مدل ذهنی دقیق‌تری می‌سازد؟"
                options={[
                  "ترنسکریپتومیکس نام یک فناوری خاص است.",
                  "ترنسکریپتومیکس یک حوزه است و فناوری‌های مختلفی می‌توانند اطلاعات آن را اندازه‌گیری کنند.",
                  "RNA-seq تنها راه مطالعه بیان RNA است.",
                ]}
                selected={openingAnswer}
                correctIndex={1}
                onSelect={setOpeningAnswer}
                correctFeedback="دقیقاً. همین تفکیک پایه ورود به نقشه فناوری‌هاست."
                incorrectFeedback="ترنسکریپتومیکس یک حوزه علمی است؛ RNA-seq، Microarray و فناوری‌های دیگر ابزارهای مطالعه آن‌اند."
              />

              <InsightBox>
                از اینجا به بعد، «سؤال» باید قبل از «فناوری» قرار بگیرد.
              </InsightBox>
            </SceneCard>
          )}

          {scene === 1 && (
            <SceneCard
              eyebrow="نقشه فناوری‌ها"
              title="همه فناوری‌ها یک سؤال یا یک نوع اطلاعات را هدف نمی‌گیرند."
              description="این کارت‌ها قرار نیست یک طبقه‌بندی تک‌محوری بسازند؛ هدف، آشنا شدن با مسیرهای اصلی در اکوسیستم ترنسکریپتومیکس است."
            >
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {technologies.map((technology) => (
                  <TechnologyCard
                    key={technology.title}
                    title={technology.title}
                    description={technology.description}
                    note={technology.note}
                  />
                ))}
              </div>

              <DecisionQuestion
                question="چرا نباید Bulk، Single-cell، Long-read و Microarray را ساده‌سازی کنیم و همه را دقیقاً یک نوع دسته‌بندی بدانیم؟"
                options={[
                  "چون بعضی واژه‌ها درباره سطح مشاهده‌اند و بعضی درباره فناوری یا استراتژی اندازه‌گیری.",
                  "چون فقط Microarray فناوری واقعی است.",
                  "چون RNA-seq هیچ ارتباطی با ترنسکریپتومیکس ندارد.",
                ]}
                selected={mapAnswer}
                correctIndex={0}
                onSelect={setMapAnswer}
                correctFeedback="دقیقاً. نقشه فناوری‌ها چند محور مفهومی دارد و F6 زمینه همین تفکیک را ساخته بود."
                incorrectFeedback="توده‌ای و تک‌سلولی بیشتر درباره مقیاس مشاهده‌اند؛ Microarray و RNA-seq درباره منطق فناوری‌اند؛ Long-read هم استراتژی توالی‌یابی را تغییر می‌دهد."
              />
            </SceneCard>
          )}

          {scene === 2 && (
            <SceneCard
              eyebrow="مقایسه فناوری"
              title="دو منطق متفاوت برای مطالعه بیان RNA"
              description="RNA-seq و Microarray هر دو برای مطالعه بیان RNA استفاده می‌شوند، اما منطق تولید داده در آن‌ها متفاوت است."
            >
              <TranscriptomicsTechnologyVisual />

              <DecisionQuestion
                question="تفاوت بنیادی این دو فناوری چیست؟"
                options={[
                  "RNA-seq توالی مولکول‌ها را می‌خواند، اما Microarray شدت اتصال به پروب‌های از پیش طراحی‌شده را می‌سنجد.",
                  "هر دو فناوری دقیقاً با یک روش داده تولید می‌کنند.",
                  "Microarray هم مانند RNA-seq الزاماً FASTQ تولید می‌کند.",
                ]}
                selected={pathAnswer}
                correctIndex={0}
                onSelect={setPathAnswer}
                correctFeedback="دقیقاً. این همان تفاوت مفهومی اصلی بین این دو فناوری است."
                incorrectFeedback="به منطق تولید داده نگاه کنید: RNA-seq مبتنی بر توالی‌یابی است؛ Microarray مبتنی بر هیبریداسیون، پروب و شدت سیگنال."
              />

              <InsightBox>
                هدف این مقایسه انتخاب «فناوری بهتر» نیست؛ هدف فهم دو منطق متفاوت تولید داده ترنسکریپتومیکس است.
              </InsightBox>
            </SceneCard>
          )}

          {scene === 3 && (
            <SceneCard
              eyebrow="پل به فناوری‌های دیگر"
              title="فناوری‌های جدیدتر را می‌توان روی همین نقشه ذهنی بهتر فهمید."
              description="اینجا فقط جایگاه مفهومی را می‌سازیم؛ آموزش عمیق هر فناوری در مسیر تخصصی خودش انجام می‌شود."
            >
              <div className="grid gap-4 lg:grid-cols-2">
                <InfoBlock
                  title="خانواده‌های sequencing-based"
                  items={[
                    "RNA-seq توده‌ای: توالی‌یابی RNA در سطح نمونه",
                    "RNA-seq تک‌سلولی: توالی‌یابی RNA در سطح سلول",
                    "small RNA-seq: طراحی مناسب برای RNAهای کوچک",
                    "ترنسکریپتومیکس خوانش‌بلند: خوانش‌های بلندتر برای transcript و isoform",
                  ]}
                  emphasized
                />

                <InfoBlock
                  title="فناوری‌هایی با منطق متفاوت یا متنوع"
                  items={[
                    "Microarray: پروب، هیبریداسیون و شدت سیگنال",
                    "ترنسکریپتومیکس فضایی: خانواده‌ای متنوع؛ بسته به پلتفرم ممکن است از sequencing، probe-based detection، imaging یا ترکیبی از این منطق‌ها استفاده کند.",
                  ]}
                />
              </div>

              <DecisionQuestion
                question="کدام جمله درباره ترنسکریپتومیکس فضایی دقیق‌تر است؟"
                options={[
                  "تمام فناوری‌های فضایی دقیقاً یک پلتفرم و یک منطق اندازه‌گیری دارند.",
                  "ترنسکریپتومیکس فضایی یک خانواده متنوع است و پلتفرم‌های آن می‌توانند منطق‌های متفاوتی داشته باشند.",
                  "ترنسکریپتومیکس فضایی هیچ ارتباطی با RNA ندارد.",
                ]}
                selected={familyAnswer}
                correctIndex={1}
                onSelect={setFamilyAnswer}
                correctFeedback="درست است. به همین دلیل Spatial را نباید به یک فناوری واحد تقلیل داد."
                incorrectFeedback="Spatial یک خانواده از فناوری‌هاست، نه یک دستگاه یا pipeline واحد."
              />
            </SceneCard>
          )}

          {scene === 4 && (
            <SceneCard
              eyebrow="امضای داده"
              title="نوع فایل و ساختار داده می‌تواند درباره فناوری سرنخ بدهد."
              description="اما همیشه باید Metadata، روش مقاله و اطلاعات پلتفرم را هم بررسی کنیم."
            >
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <DataCard
                  title="RNA-seq"
                  description="داده خام معمولاً به‌صورت FASTQ است. بعد از کنترل کیفیت و کمی‌سازی، به مقادیر بیان ژن و در نهایت ماتریس بیان می‌رسیم."
                />

                <DataCard
                  title="Microarray"
                  description="داده از شدت سیگنال پروب‌ها به دست می‌آید. پس از پردازش و نرمال‌سازی، ماتریس بیان ژن ساخته می‌شود."
                />

                <DataCard
                  title="RNA-seq تک‌سلولی"
                  description="FASTQ نقطه شروع رایج است. پس از پردازش، یک ماتریس ژن × سلول همراه با Metadata سلولی به دست می‌آید."
                />

                <DataCard
                  title="Spatial"
                  description="داده بیان RNA با مختصات مکانی و معمولاً اطلاعات تصویری بافت همراه است؛ بنابراین فقط یک ماتریس بیان ساده نیست."
                />

                <DataCard
                  title="Long-read"
                  description="خروجی شامل خوانش‌های بلند است که برای بازسازی transcriptها و بررسی isoformها استفاده می‌شود."
                />

                <DataCard
                  title="small RNA-seq"
                  description="داده خام معمولاً FASTQ است، اما Library برای RNAهای کوچک طراحی شده و مسیر تحلیل هم متناسب با همین هدف است."
                />
              </div>

              <DecisionQuestion
                question="یک Dataset ترنسکریپتومیکس FASTQ ندارد. اولین نتیجه‌گیری درست چیست؟"
                options={[
                  "حتماً داده ناقص است.",
                  "اول فناوری تولید داده را بررسی می‌کنیم؛ ممکن است Microarray یا یک خروجی پردازش‌شده باشد.",
                  "حتماً داده DNA است.",
                ]}
                selected={dataAnswer}
                correctIndex={1}
                onSelect={setDataAnswer}
                correctFeedback="دقیقاً. نوع فایل را باید در زمینه فناوری و Metadata تفسیر کرد."
                incorrectFeedback="نبود FASTQ به‌تنهایی نشان نمی‌دهد Dataset ترنسکریپتومیکس نیست."
              />
            </SceneCard>
          )}

          {scene === 5 && (
            <SceneCard
              eyebrow="آزمایشگاه تصمیم"
              title="سؤال پژوهشی، مسیر فناوری را هدایت می‌کند."
              description="در هر سناریو دنبال «مناسب‌ترین نوع اطلاعات» باشید، نه پیچیده‌ترین فناوری."
            >
              <DecisionQuestion
                question="۱) می‌خواهم پاسخ کلی بیان ژن یک نمونه را بین کنترل و تیمار مقایسه کنم."
                options={[
                  "RNA-seq توده‌ای یا در برخی طراحی‌ها Microarray می‌تواند مناسب باشد.",
                  "حتماً باید Spatial باشد.",
                  "حتماً باید Long-read باشد.",
                ]}
                selected={case1}
                correctIndex={0}
                onSelect={setCase1}
                correctFeedback="درست است. اگر سؤال در سطح نمونه تعریف شده، فناوری توده‌ای می‌تواند کاملاً منطقی باشد."
                incorrectFeedback="جزئیات بیشتر همیشه لازم نیست؛ اول سطح سؤال را مشخص کنید."
              />

              <DecisionQuestion
                question="۲) می‌خواهم بدانم کدام زیرجمعیت سلولی به درمان پاسخ داده است."
                options={[
                  "RNA-seq تک‌سلولی",
                  "Microarray توده‌ای به‌تنهایی",
                  "فقط توالی‌یابی DNA",
                ]}
                selected={case2}
                correctIndex={0}
                onSelect={setCase2}
                correctFeedback="دقیقاً. سؤال درباره ناهمگنی و هویت سلولی است."
                incorrectFeedback="برای پاسخ مستقیم به تفاوت زیرجمعیت‌ها، سطح تک‌سلولی مناسب‌تر است."
              />

              <DecisionQuestion
                question="۳) می‌خواهم بدانم سلول‌های پاسخ‌دهنده در کدام ناحیه بافت قرار گرفته‌اند."
                options={[
                  "ترنسکریپتومیکس فضایی",
                  "Microarray توده‌ای",
                  "فقط ماتریس شمارش Bulk",
                ]}
                selected={case3}
                correctIndex={0}
                onSelect={setCase3}
                correctFeedback="بله. موقعیت در بافت بخشی از سؤال است."
                incorrectFeedback="وقتی مکان مهم است، اطلاعات فضایی باید حفظ شود."
              />

              <DecisionQuestion
                question="۴) سؤال اصلی من تفاوت ایزوفرم‌ها و ساختار transcript است."
                options={[
                  "ترنسکریپتومیکس خوانش‌بلند",
                  "Microarray ساده",
                  "فقط تعداد نمونه بیشتر",
                ]}
                selected={case4}
                correctIndex={0}
                onSelect={setCase4}
                correctFeedback="درست است. Long-read می‌تواند برای ساختار transcript و isoform اطلاعات ارزشمندی بدهد."
                incorrectFeedback="وقتی ساختار transcript سؤال اصلی است، استراتژی خوانش‌بلند اهمیت پیدا می‌کند."
              />

              <DecisionQuestion
                question="۵) می‌خواهم miRNAها و سایر RNAهای کوچک را بررسی کنم."
                options={[
                  "small RNA-seq",
                  "هر Library معمولی RNA-seq بدون تغییر",
                  "فقط Microarray پروتئینی",
                ]}
                selected={case5}
                correctIndex={0}
                onSelect={setCase5}
                correctFeedback="دقیقاً. RNAهای کوچک به طراحی مناسب Library و pipeline مرتبط نیاز دارند."
                incorrectFeedback="نوع RNA هدف روی طراحی Library و مسیر تحلیل اثر می‌گذارد."
              />

              <InsightBox>
                اصل هاب‌ژن: <strong>سؤال ← اطلاعات موردنیاز ← فناوری</strong>.
              </InsightBox>
            </SceneCard>
          )}

          {scene === 6 && (
            <SceneCard
              eyebrow="ایستگاه تسلط"
              title="مبانی ترنسکریپتومیکس کامل شد."
              description="حالا باید بتوانید حوزه، سطح مشاهده، فناوری و نوع داده را از هم تفکیک کنید."
            >
              <DecisionQuestion
                question="کدام جمله دقیق‌ترین تصویر را می‌دهد؟"
                options={[
                  "ترنسکریپتومیکس همان RNA-seq است و همه مطالعات آن باید FASTQ داشته باشند.",
                  "ترنسکریپتومیکس یک حوزه است؛ فناوری‌های مختلف با منطق‌های متفاوت می‌توانند اطلاعات آن را اندازه‌گیری کنند و انتخاب فناوری باید از سؤال پژوهشی بیاید.",
                  "Microarray، Single-cell و Spatial سه واژه هم‌معنی‌اند.",
                  "پیچیده‌ترین فناوری همیشه بهترین انتخاب است.",
                ]}
                selected={masteryAnswer}
                correctIndex={1}
                onSelect={setMasteryAnswer}
                correctFeedback="عالی. شما اکنون نقشه مفهومی لازم برای ورود به مسیرهای تخصصی را دارید."
                incorrectFeedback="به چهار مفهوم برگردید: حوزه علمی، سطح مشاهده، فناوری اندازه‌گیری و نوع داده."
              />

              <div className="mt-8">
                <p className="font-bold text-slate-950">
                  این نقشه چقدر برایتان روشن است؟
                </p>

                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  <ConfidenceButton
                    active={confidence === "unclear"}
                    title="هنوز مبهم است"
                    description="فناوری‌ها و نوع اطلاعات برایم هنوز قاطی می‌شوند."
                    onClick={() => setConfidence("unclear")}
                  />

                  <ConfidenceButton
                    active={confidence === "developing"}
                    title="تقریباً متوجه شدم"
                    description="نقشه کلی را می‌فهمم ولی در Datasetهای واقعی تمرین لازم دارم."
                    onClick={() => setConfidence("developing")}
                  />

                  <ConfidenceButton
                    active={confidence === "clear"}
                    title="کاملاً روشن است"
                    description="می‌توانم سؤال، سطح مشاهده، فناوری و نوع داده را از هم جدا کنم."
                    onClick={() => setConfidence("clear")}
                  />
                </div>
              </div>

              <div className="mt-7 rounded-3xl bg-slate-950 p-6 text-white">
                <p className="text-xs font-bold text-teal-300">
                  لحظه فهم نهایی
                </p>

                <p className="mt-3 text-lg font-bold leading-9">
                  ترنسکریپتومیکس یک حوزه است؛ فناوری‌ها راه‌های متفاوت مشاهده و اندازه‌گیری آن هستند.
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

              <div className="mt-8">
                <p className="text-xs font-bold text-teal-700">
                  مسیرهای تخصصی ترنسکریپتومیکس
                </p>

                <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  <PathCard
                    title="RNA-seq توده‌ای"
                    description="از طراحی مطالعه تا FASTQ، کمی‌سازی، بیان تفاضلی و تفسیر زیستی."
                    active
                    href="/learn/rna-seq"
                  />

                  <PathCard
                    title="Microarray"
                    description="از پلتفرم و پروب تا نرمال‌سازی و تحلیل بیان."
                  />

                  <PathCard
                    title="RNA-seq تک‌سلولی"
                    description="از طراحی نمونه تا ماتریس ژن × سلول و تحلیل جمعیت‌ها."
                  />

                  <PathCard
                    title="ترنسکریپتومیکس فضایی"
                    description="بیان RNA همراه با زمینه مکانی بافت."
                  />

                  <PathCard
                    title="ترنسکریپتومیکس خوانش‌بلند"
                    description="ساختار transcript، isoform و خوانش‌های بلند."
                  />

                  <PathCard
                    title="small RNA-seq"
                    description="طراحی و تحلیل مناسب RNAهای کوچک."
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

function TechnologyCard({
  title,
  description,
  note,
}: {
  title: string;
  description: string;
  note: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
      <p className="font-black text-slate-950">
        {title}
      </p>

      <p className="mt-3 text-sm leading-8 text-slate-600">
        {description}
      </p>

      <span className="mt-4 inline-flex rounded-full bg-white px-3 py-1 text-[11px] font-bold text-slate-500">
        {note}
      </span>
    </div>
  );
}

function InfoBlock({
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
      <p className="font-black text-slate-950">
        {title}
      </p>

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

function DataCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
      <p className="font-black text-slate-950">
        {title}
      </p>

      <p className="mt-3 text-sm leading-8 text-slate-600">
        {description}
      </p>
    </div>
  );
}

function PathCard({
  title,
  description,
  active = false,
  href,
}: {
  title: string;
  description: string;
  active?: boolean;
  href?: string;
}) {
  const card = (
    <>
      <div className="flex items-center justify-between gap-3">
        <p className="font-black text-slate-950">
          {title}
        </p>

        <span
          className={[
            "rounded-full px-3 py-1 text-[10px] font-bold",
            active
              ? "bg-teal-700 text-white"
              : "bg-slate-200 text-slate-500",
          ].join(" ")}
        >
          {active ? "فعال" : "به‌زودی"}
        </span>
      </div>

      <p className="mt-3 text-sm leading-7 text-slate-600">
        {description}
      </p>
    </>
  );

  if (active && href) {
    return (
      <a
        href={href}
        className="block rounded-3xl border border-teal-300 bg-teal-50 p-5 transition hover:border-teal-500 hover:shadow-sm"
      >
        {card}
      </a>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 opacity-80">
      {card}
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
            className={
              correct
                ? "text-sm font-bold text-emerald-900"
                : "text-sm font-bold text-amber-950"
            }
          >
            {correct
              ? "مسیر فکری درست ✓"
              : "بیایید این برداشت را دوباره بررسی کنیم"}
          </p>

          <p className="mt-2 text-sm leading-7 text-slate-700">
            {correct
              ? correctFeedback
              : incorrectFeedback}
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

      <p className="text-sm leading-8 text-teal-950">
        {children}
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
