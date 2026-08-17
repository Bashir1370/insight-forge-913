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
  Microscope,
  RotateCcw,
  ScanLine,
  Sparkles,
} from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { InteractiveLessonShell } from "../components/InteractiveLessonShell";

type Confidence = "unclear" | "developing" | "clear";
type SaveState = "guest" | "loading" | "idle" | "saving" | "saved" | "error";
type Technology = "rna-seq" | "microarray";
type ProjectReflection = "fastq" | "microarray" | "matrix" | "unsure";

type LearningProgressRow = {
  status: "not_started" | "in_progress" | "completed" | "needs_review";
  confidence: Confidence | null;
  selected_answer: number | null;
  is_correct: boolean | null;
  updated_at: string;
};

const RESEARCH_LINE = "transcriptomics-foundations";
const NODE_ID = "f7-rna-seq-in-transcriptomics";

const sceneTitles = [
  "حوزه و فناوری",
  "دو مسیر اندازه‌گیری",
  "مقایسه بصری",
  "داده خام چه شکلی است؟",
  "یک سؤال، دو فناوری",
  "کلینیک اشتباه",
  "تسلط و ورود به RNA-seq",
];

const reflectionLabels: Record<ProjectReflection, string> = {
  fastq: "FASTQ دارم",
  microarray: "داده Microarray یا فایل‌های سیگنال دارم",
  matrix: "فقط ماتریس بیان دارم",
  unsure: "هنوز نوع داده‌ام را نمی‌دانم",
};

export function RnaSeqInTranscriptomicsLesson() {
  const { session } = useAuth();
  const userId = session?.user?.id ?? null;

  const [scene, setScene] = useState(0);
  const [openingAnswer, setOpeningAnswer] = useState<number | null>(null);
  const [pathAnswer, setPathAnswer] = useState<number | null>(null);
  const [technology, setTechnology] = useState<Technology>("rna-seq");
  const [rawDataAnswer, setRawDataAnswer] = useState<number | null>(null);
  const [sameQuestionAnswer, setSameQuestionAnswer] = useState<number | null>(null);
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
        console.error("Failed to load F7 progress:", error);
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

  const canFinish = masteryAnswer !== null && Boolean(confidence);

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
    setPathAnswer(null);
    setTechnology("rna-seq");
    setRawDataAnswer(null);
    setSameQuestionAnswer(null);
    setMistakeAnswer(null);
    setReflection(null);
    setMasteryAnswer(null);
    setConfidence(null);
    window.setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 20);
  }

  return (
    <InteractiveLessonShell
      foundationIndex={7}
      total={7}
      title="RNA-seq و Microarray در نقشه ترنسکریپتومیکس کجا هستند؟"
      subtitle="در آخرین درس مبانی ترنسکریپتومیکس، دو فناوری مهم اندازه‌گیری را کنار هم می‌بینیم تا روشن شود ترنسکریپتومیکس یک حوزه است و هر داده ترنسکریپتومیکس الزاماً FASTQ ندارد."
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

            <SaveIndicator userId={userId} state={saveState} savedProgress={savedProgress} error={saveError} />
          </div>

          {scene === 0 && (
            <SceneCard
              eyebrow="نقشه علمی"
              title="ترنسکریپتومیکس یک حوزه است؛ RNA-seq و Microarray دو فناوری اندازه‌گیری درون آن‌اند."
              description="این تفکیک جلوی یکی از مهم‌ترین خطاهای ذهنی را می‌گیرد: برابر دانستن ترنسکریپتومیکس با RNA-seq."
            >
              <div className="rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white">
                <p className="text-xs font-bold text-teal-300">ترنسکریپتومیکس</p>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <TechnologySummary title="RNA-seq" subtitle="مبتنی بر توالی‌یابی" icon={<ScanLine className="size-5" />} />
                  <TechnologySummary title="Microarray" subtitle="مبتنی بر پروب و شدت سیگنال" icon={<Microscope className="size-5" />} />
                </div>
              </div>

              <DecisionQuestion
                question="کدام جمله دقیق‌تر است؟"
                options={[
                  "ترنسکریپتومیکس و RNA-seq دقیقاً یک مفهوم‌اند.",
                  "RNA-seq و Microarray هر دو می‌توانند برای مطالعه ترنسکریپتوم استفاده شوند.",
                  "اگر داده FASTQ نداشته باشد، ترنسکریپتومیکس نیست.",
                ]}
                selected={openingAnswer}
                correctIndex={1}
                onSelect={setOpeningAnswer}
                correctFeedback="دقیقاً. حوزه علمی را از فناوری اندازه‌گیری جدا کردید."
                incorrectFeedback="ترنسکریپتومیکس گسترده‌تر از یک فناوری واحد است و Microarray هم می‌تواند داده بیان ژن تولید کند."
              />

              <InsightBox>
                اصل این درس: <strong>ترنسکریپتومیکس ≠ RNA-seq.</strong>
              </InsightBox>
            </SceneCard>
          )}

          {scene === 1 && (
            <SceneCard
              eyebrow="دو مسیر اندازه‌گیری"
              title="یک سؤال زیستی می‌تواند با دو مسیر فنی متفاوت بررسی شود."
              description="هر دو مسیر می‌توانند در نهایت به یک ماتریس بیان برسند، اما داده خام و منطق اندازه‌گیری یکسان نیست."
            >
              <div className="grid gap-5 lg:grid-cols-2">
                <TechnologyPath
                  title="مسیر RNA-seq"
                  subtitle="توالی‌یابی"
                  steps={["نمونه", "RNA", "کتابخانه", "توالی‌یابی", "FASTQ", "کمی‌سازی", "ماتریس بیان"]}
                  emphasized
                />
                <TechnologyPath
                  title="مسیر Microarray"
                  subtitle="پروب و شدت سیگنال"
                  steps={["نمونه", "RNA", "نمونه نشاندار", "هیبریداسیون روی چیپ", "شدت سیگنال", "نرمال‌سازی", "ماتریس بیان"]}
                />
              </div>

              <DecisionQuestion
                question="کدام نکته از این دو مسیر مهم‌تر است؟"
                options={[
                  "هر دو فناوری باید FASTQ تولید کنند.",
                  "مسیر فنی متفاوت است، اما هر دو می‌توانند به داده بیان قابل تحلیل برسند.",
                  "Microarray چون توالی‌یابی ندارد، داده بیان تولید نمی‌کند.",
                ]}
                selected={pathAnswer}
                correctIndex={1}
                onSelect={setPathAnswer}
                correctFeedback="دقیقاً. خروجی تحلیلی می‌تواند شبیه باشد، اما منطق تولید داده متفاوت است."
                incorrectFeedback="Microarray با توالی‌یابی کار نمی‌کند، اما می‌تواند با شدت سیگنال پروب‌ها داده بیان تولید کند."
              />
            </SceneCard>
          )}

          {scene === 2 && (
            <SceneCard
              eyebrow="مقایسه بصری"
              title="همان سؤال، دو فناوری"
              description="بین RNA-seq و Microarray جابه‌جا شوید و ببینید داخل هر مسیر چه چیزی تغییر می‌کند."
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <TechnologyButton active={technology === "rna-seq"} title="RNA-seq" subtitle="مبتنی بر توالی‌یابی" onClick={() => setTechnology("rna-seq")} />
                <TechnologyButton active={technology === "microarray"} title="Microarray" subtitle="مبتنی بر پروب و شدت سیگنال" onClick={() => setTechnology("microarray")} />
              </div>

              <div className="mt-6 rounded-3xl bg-slate-950 p-6 text-white">
                {technology === "rna-seq" ? <RnaSeqVisual /> : <MicroarrayVisual />}
              </div>

              <div className="mt-6 grid gap-3 md:grid-cols-2">
                <ComparisonCard
                  title="RNA-seq"
                  items={[
                    "خوانش توالی تولید می‌کند",
                    "داده خام رایج: FASTQ",
                    "به پروب از پیش طراحی‌شده وابسته نیست",
                    "برای کشف ترنسکریپت‌های جدید انعطاف بیشتری دارد",
                  ]}
                  emphasized
                />
                <ComparisonCard
                  title="Microarray"
                  items={[
                    "شدت اتصال به پروب‌ها را اندازه می‌گیرد",
                    "FASTQ ندارد",
                    "به پروب‌های از پیش طراحی‌شده وابسته است",
                    "در بسیاری از مجموعه‌داده‌های عمومی قدیمی‌تر بسیار رایج است",
                  ]}
                />
              </div>
            </SceneCard>
          )}

          {scene === 3 && (
            <SceneCard
              eyebrow="داده خام چه شکلی است؟"
              title="FASTQ فقط یکی از شکل‌های داده خام در ترنسکریپتومیکس است."
              description="این بخش برای جلوگیری از خطای رایج هنگام کار با GEO و داده‌های عمومی مهم است."
            >
              <div className="grid gap-5 lg:grid-cols-2">
                <RawDataCard
                  title="نمونه داده خام RNA-seq"
                  badge="FASTQ"
                  content={["@read001", "ATCGTACGTTAC...", "+", "IIIIHHHHGGFF..."]}
                  emphasized
                />
                <RawDataCard
                  title="نمای ساده‌شده Microarray"
                  badge="شدت سیگنال"
                  content={["Probe_001   8.21", "Probe_002   5.47", "Probe_003   10.02", "Probe_004   7.33"]}
                />
              </div>

              <DecisionQuestion
                question="اگر یک مجموعه‌داده ترنسکریپتومیکس FASTQ نداشته باشد، بهترین واکنش چیست؟"
                options={[
                  "حتماً داده ناقص یا غیرترنسکریپتومیک است.",
                  "اول بررسی کنیم فناوری تولید داده چه بوده؛ ممکن است Microarray باشد.",
                  "بدون FASTQ هیچ ماتریس بیان معتبری وجود ندارد.",
                ]}
                selected={rawDataAnswer}
                correctIndex={1}
                onSelect={setRawDataAnswer}
                correctFeedback="دقیقاً. نوع فناوری تعیین می‌کند چه فایل‌ها و خروجی‌هایی انتظار داریم."
                incorrectFeedback="FASTQ مربوط به فناوری‌های مبتنی بر توالی‌یابی است؛ Microarray منطق و فایل‌های متفاوتی دارد."
              />

              <InsightBox>
                <strong>هر داده ترنسکریپتومیکس الزاماً FASTQ ندارد.</strong>
              </InsightBox>
            </SceneCard>
          )}

          {scene === 4 && (
            <SceneCard
              eyebrow="یک سؤال، دو فناوری"
              title="داروی X در سلول‌های سرطان پانکراس"
              description="سؤال زیستی ثابت است؛ چیزی که عوض می‌شود مسیر فنی اندازه‌گیری است."
            >
              <div className="rounded-3xl border border-teal-200 bg-gradient-to-br from-teal-50 via-white to-cyan-50 p-6">
                <p className="font-black text-teal-950">سؤال پژوهشی</p>
                <p className="mt-3 text-sm leading-8 text-slate-600">داروی X چه تغییری در الگوی بیان ژن سلول‌های سرطان پانکراس ایجاد می‌کند؟</p>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <CaseTechnologyCard
                  title="اگر RNA-seq انتخاب شود"
                  lines={[
                    "کتابخانه ساخته می‌شود",
                    "توالی‌یابی انجام می‌شود",
                    "FASTQ تولید می‌شود",
                    "بعد به کمی‌سازی و ماتریس بیان می‌رسیم",
                  ]}
                  emphasized
                />
                <CaseTechnologyCard
                  title="اگر Microarray انتخاب شود"
                  lines={[
                    "RNA روی پروب‌های از پیش تعریف‌شده سنجیده می‌شود",
                    "شدت سیگنال اندازه‌گیری می‌شود",
                    "FASTQ وجود ندارد",
                    "بعد از پردازش و نرمال‌سازی به ماتریس بیان می‌رسیم",
                  ]}
                />
              </div>

              <DecisionQuestion
                question="کدام جمله دقیق‌تر است؟"
                options={[
                  "چون سؤال یکسان است، داده خام دو فناوری هم باید یکسان باشد.",
                  "سؤال زیستی می‌تواند یکسان باشد، اما نوع داده خام و مسیر پردازش به فناوری بستگی دارد.",
                  "Microarray فقط برای سؤال‌های DNA استفاده می‌شود.",
                ]}
                selected={sameQuestionAnswer}
                correctIndex={1}
                onSelect={setSameQuestionAnswer}
                correctFeedback="درست است. سؤال، فناوری و مسیر پردازش سه چیز متفاوت‌اند."
                incorrectFeedback="دو فناوری می‌توانند یک سؤال بیان ژن را بررسی کنند، اما داده خام و مسیر پردازش آن‌ها متفاوت است."
              />

              <div className="mt-8 border-t border-slate-100 pt-7">
                <p className="font-bold text-slate-950">شما الان چه نوع داده‌ای دارید؟</p>
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
                    {reflection === "fastq"
                      ? "احتمالاً با یک مسیر مبتنی بر توالی‌یابی مانند RNA-seq روبه‌رو هستید."
                      : reflection === "microarray"
                        ? "باید اطلاعات پلتفرم، نوع پروب، فایل‌های خام یا ماتریس پردازش‌شده را بررسی کنید."
                        : reflection === "matrix"
                          ? "فقط از روی ماتریس همیشه نمی‌توان فناوری را قطعی تشخیص داد؛ Metadata مطالعه مهم است."
                          : "اول Metadata و بخش روش‌های مقاله یا صفحه مجموعه‌داده را بررسی کنید."}
                  </InsightBox>
                )}
              </div>
            </SceneCard>
          )}

          {scene === 5 && (
            <SceneCard
              eyebrow="کلینیک اشتباه"
              title="«هر مطالعه ترنسکریپتومیکس باید FASTQ داشته باشد.»"
              description="این یکی از خطاهایی است که مخصوصاً هنگام کار با داده‌های عمومی باعث سردرگمی می‌شود."
            >
              <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6">
                <p className="font-black leading-8 text-amber-950">
                  پژوهشگر وارد GEO می‌شود، FASTQ پیدا نمی‌کند و نتیجه می‌گیرد مطالعه ترنسکریپتومیکس نیست.
                </p>
              </div>

              <DecisionQuestion
                question="بهترین اصلاح این برداشت چیست؟"
                options={[
                  "درست است؛ بدون FASTQ هیچ مطالعه ترنسکریپتومیکس وجود ندارد.",
                  "اول باید فناوری را بررسی کنیم؛ Microarray معمولاً FASTQ ندارد و می‌تواند همچنان یک مطالعه ترنسکریپتومیکس باشد.",
                  "هر مجموعه‌داده بدون FASTQ حتماً داده پروتئومیکس است.",
                ]}
                selected={mistakeAnswer}
                correctIndex={1}
                onSelect={setMistakeAnswer}
                correctFeedback="دقیقاً. فایل مورد انتظار باید با فناوری تولید داده سازگار باشد."
                incorrectFeedback="Microarray یک مثال مهم از داده ترنسکریپتومیکس بدون FASTQ است."
              />

              <div className="mt-7 rounded-3xl border border-cyan-200 bg-cyan-50 p-6">
                <p className="font-black text-cyan-950">حالا چرا مسیر عمیق بعدی RNA-seq است؟</p>
                <p className="mt-3 text-sm leading-8 text-cyan-900/80">
                  چون در هاب‌ژن فعلاً مسیر عمیق بعدی را برای RNA-seq توده‌ای ساخته‌ایم. این انتخاب به معنی برابر بودن RNA-seq با کل ترنسکریپتومیکس نیست. Microarray بعداً مسیر آموزشی مستقل خودش را خواهد داشت.
                </p>
              </div>
            </SceneCard>
          )}

          {scene === 6 && (
            <SceneCard
              eyebrow="ایستگاه تسلط"
              title="نقشه مبانی ترنسکریپتومیکس کامل شد."
              description="آخرین سؤال بررسی می‌کند آیا حوزه، سطح مشاهده، فناوری و نوع داده را از هم جدا می‌کنید."
            >
              <DecisionQuestion
                question="کدام جمله دقیق‌ترین تصویر را می‌دهد؟"
                options={[
                  "ترنسکریپتومیکس همان RNA-seq است و هر داده ترنسکریپتومیکس باید FASTQ داشته باشد.",
                  "ترنسکریپتومیکس یک حوزه است؛ RNA-seq و Microarray دو فناوری اندازه‌گیری‌اند و نوع داده خام و مسیر پردازش آن‌ها متفاوت است.",
                  "Microarray فقط برای DNA است و به بیان ژن ارتباطی ندارد.",
                  "توده‌ای، RNA-seq و Microarray سه واژه هم‌معنی هستند.",
                ]}
                selected={masteryAnswer}
                correctIndex={1}
                onSelect={setMasteryAnswer}
                correctFeedback="عالی. شما اکنون حوزه، سطح مشاهده، فناوری و داده خام را از هم تفکیک می‌کنید."
                incorrectFeedback="به چهار مفهوم برگردید: حوزه علمی، سطح مشاهده، فناوری اندازه‌گیری و نوع داده."
              />

              <div className="mt-8">
                <p className="font-bold text-slate-950">این نقشه چقدر برایتان روشن است؟</p>
                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  <ConfidenceButton active={confidence === "unclear"} title="هنوز مبهم است" description="هنوز فناوری و نوع داده برایم قاطی می‌شوند." onClick={() => setConfidence("unclear")} />
                  <ConfidenceButton active={confidence === "developing"} title="تقریباً متوجه شدم" description="نقشه کلی را می‌فهمم ولی در مجموعه‌داده‌های واقعی هنوز تمرین لازم دارم." onClick={() => setConfidence("developing")} />
                  <ConfidenceButton active={confidence === "clear"} title="کاملاً روشن است" description="می‌توانم RNA-seq، Microarray، FASTQ و ماتریس بیان را در جای درست قرار دهم." onClick={() => setConfidence("clear")} />
                </div>
              </div>

              <div className="mt-7 rounded-3xl bg-slate-950 p-6 text-white">
                <p className="text-xs font-bold text-teal-300">لحظه فهم مبانی ترنسکریپتومیکس</p>
                <p className="mt-3 text-lg font-bold leading-9">
                  حالا می‌دانم ترنسکریپتومیکس یک حوزه است، سطح مشاهده با فناوری فرق دارد، و RNA-seq و Microarray مسیرهای متفاوتی برای رسیدن به داده بیان هستند.
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
                  {userId ? "ثبت تسلط درس هفتم" : "پایان درس هفتم در حالت مهمان"}
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
                <p className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm leading-7 text-rose-800">{saveError}</p>
              )}

              {saveState === "saved" && savedProgress && (
                <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                  <p className="font-bold text-emerald-900">وضعیت درس هفتم در حساب شما ذخیره شد.</p>
                  <p className="mt-2 text-sm leading-7 text-emerald-800">
                    {savedProgress.status === "needs_review" ? "این درس برای مرور دوباره علامت خورده است." : "درس هفتم با موفقیت تکمیل شده است."}
                  </p>
                </div>
              )}

              {!userId && (
                <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-7 text-amber-900">
                  در حالت مهمان می‌توانید کل درس را استفاده کنید، اما نتیجه نهایی به‌صورت دائمی ذخیره نمی‌شود.
                </div>
              )}

              <div className="mt-8 rounded-3xl border border-teal-200 bg-gradient-to-br from-teal-50 via-white to-cyan-50 p-6">
                <p className="text-xs font-bold text-teal-700">مسیر عمیق بعدی</p>
                <h3 className="mt-2 text-2xl font-black text-slate-950">RNA-seq توده‌ای</h3>
                <p className="mt-3 max-w-3xl text-sm leading-8 text-slate-600">
                  از اینجا وارد مسیر عمیق RNA-seq می‌شویم؛ از سؤال پژوهشی و طراحی مطالعه تا FASTQ، کنترل کیفیت، کمی‌سازی، ماتریس بیان، نرمال‌سازی، تحلیل بیان افتراقی و تفسیر زیستی.
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

function TechnologySummary({ title, subtitle, icon }: { title: string; subtitle: string; icon: ReactNode }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-400/10 text-teal-300">{icon}</span>
        <div>
          <p className="font-black">{title}</p>
          <p className="mt-1 text-xs text-slate-400">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}

function TechnologyPath({ title, subtitle, steps, emphasized = false }: { title: string; subtitle: string; steps: string[]; emphasized?: boolean }) {
  return (
    <div className={["rounded-3xl border p-5", emphasized ? "border-teal-300 bg-teal-50" : "border-slate-200 bg-slate-50"].join(" ")}>
      <p className="font-black text-slate-950">{title}</p>
      <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
      <div className="mt-5 flex flex-wrap items-center gap-2 text-xs font-bold text-slate-700">
        {steps.map((step, index) => (
          <div key={`${step}-${index}`} className="flex items-center gap-2">
            <span className="rounded-xl bg-white px-3 py-2">{step}</span>
            {index < steps.length - 1 && <span className="text-teal-700">←</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

function TechnologyButton({ active, title, subtitle, onClick }: { active: boolean; title: string; subtitle: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-2xl border p-4 text-right transition",
        active ? "border-teal-500 bg-teal-50 shadow-sm" : "border-slate-200 bg-white",
      ].join(" ")}
    >
      <p className="font-black text-slate-950">{title}</p>
      <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
    </button>
  );
}

function RnaSeqVisual() {
  return (
    <div>
      <p className="text-xs font-bold text-teal-300">RNA-seq چگونه «می‌بیند»؟</p>
      <div className="mt-6 grid gap-4 md:grid-cols-4">
        <VisualBox title="RNA" symbol="≈≈≈" />
        <VisualBox title="کتابخانه" symbol="≋ ≋ ≋" />
        <VisualBox title="خوانش‌ها" symbol="▰ ▰ ▰" />
        <VisualBox title="FASTQ" symbol="@ A T C G" />
      </div>
      <p className="mt-6 text-sm leading-8 text-slate-300">منطق اصلی مبتنی بر تولید خوانش‌های توالی و سپس کمی‌سازی آن‌هاست.</p>
    </div>
  );
}

function MicroarrayVisual() {
  const spots = [0.25, 0.7, 0.45, 0.9, 0.4, 0.2, 0.8, 0.55, 0.75, 0.35, 0.6, 0.18, 0.5, 0.82, 0.3, 0.68];

  return (
    <div>
      <p className="text-xs font-bold text-teal-300">Microarray چگونه «می‌بیند»؟</p>
      <div className="mt-6 grid gap-6 md:grid-cols-[0.85fr_1.15fr] md:items-center">
        <div className="space-y-3">
          <VisualBox title="RNA" symbol="≈≈≈" />
          <VisualBox title="نمونه نشاندار" symbol="✦ RNA ✦" />
          <VisualBox title="هیبریداسیون" symbol="RNA ↔ Probe" />
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <p className="text-xs text-slate-400">نمای مفهومی Chip</p>
          <div className="mt-4 grid grid-cols-4 gap-3">
            {spots.map((opacity, index) => (
              <div key={index} className="aspect-square rounded-xl bg-teal-300" style={{ opacity }} />
            ))}
          </div>
          <p className="mt-4 text-xs leading-6 text-slate-400">روشنایی بیشتر یعنی سیگنال بیشتر؛ این فقط یک شبیه‌سازی آموزشی است.</p>
        </div>
      </div>
      <p className="mt-6 text-sm leading-8 text-slate-300">منطق اصلی مبتنی بر اتصال به پروب‌های از پیش طراحی‌شده و اندازه‌گیری شدت سیگنال است.</p>
    </div>
  );
}

function VisualBox({ title, symbol }: { title: string; symbol: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
      <p className="text-2xl font-black text-teal-300">{symbol}</p>
      <p className="mt-3 text-xs font-bold text-slate-200">{title}</p>
    </div>
  );
}

function ComparisonCard({ title, items, emphasized = false }: { title: string; items: string[]; emphasized?: boolean }) {
  return (
    <div className={["rounded-3xl border p-5", emphasized ? "border-teal-300 bg-teal-50" : "border-slate-200 bg-slate-50"].join(" ")}>
      <p className="font-black text-slate-950">{title}</p>
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

function RawDataCard({ title, badge, content, emphasized = false }: { title: string; badge: string; content: string[]; emphasized?: boolean }) {
  return (
    <div className={["rounded-3xl border p-5", emphasized ? "border-teal-300 bg-teal-50" : "border-slate-200 bg-slate-50"].join(" ")}>
      <div className="flex items-center justify-between gap-3">
        <p className="font-black text-slate-950">{title}</p>
        <span className="rounded-full bg-white px-3 py-1 text-[11px] font-bold text-slate-600">{badge}</span>
      </div>
      <pre dir="ltr" className="mt-5 overflow-x-auto rounded-2xl bg-slate-950 p-4 text-left text-xs leading-7 text-slate-200">{content.join("\n")}</pre>
    </div>
  );
}

function CaseTechnologyCard({ title, lines, emphasized = false }: { title: string; lines: string[]; emphasized?: boolean }) {
  return (
    <div className={["rounded-3xl border p-5", emphasized ? "border-teal-300 bg-teal-50" : "border-slate-200 bg-slate-50"].join(" ")}>
      <p className="font-black text-slate-950">{title}</p>
      <div className="mt-4 space-y-3">
        {lines.map((line) => (
          <div key={line} className="flex items-start gap-2 text-sm leading-7 text-slate-600">
            <CheckCircle2 className="mt-1 size-4 shrink-0 text-teal-700" />
            <span>{line}</span>
          </div>
        ))}
      </div>
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
          <p className={correct ? "text-sm font-bold text-emerald-900" : "text-sm font-bold text-amber-950"}>{correct ? "مسیر فکری درست ✓" : "بیایید این برداشت را دوباره بررسی کنیم"}</p>
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
    return <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[11px] font-semibold text-emerald-800"><CheckCircle2 className="size-3" />درس هفتم ذخیره شده</span>;
  }
  return <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-500"><Sparkles className="size-3" />آماده یادگیری</span>;
}
