import {
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Dna,
  FileText,
  Gauge,
  Lightbulb,
  MousePointerClick,
} from "lucide-react";

import { SpecialistLessonShell } from "@/features/learning/components/SpecialistLessonShell";

const sceneTitles = [
  "از کتابخانه تا خوانش",
  "تک‌انتها یا جفت‌انتها؟",
  "Base calling و کیفیت",
  "کالبدشکافی FASTQ",
  "خواندن Phred با چشم",
  "فایل‌های R1 و R2",
  "چالش کنترل کیفیت",
  "ایستگاه تسلط",
];

const demoSequence = "ACGTTGCAACGT";
const demoQuality = "IIIII?5+&&&&";
const demoScores = [40, 40, 40, 40, 40, 30, 20, 10, 5, 5, 5, 5];

const fastqLines = [
  {
    label: "خط ۱",
    value: "@read_000001",
    title: "شناسه خوانش",
    explanation:
      "هر رکورد FASTQ با یک شناسه شروع می‌شود. قالب دقیق شناسه به دستگاه و نرم‌افزار تولیدکننده داده بستگی دارد؛ بنابراین نباید یک شکل خاص را قانون همیشگی بدانیم.",
  },
  {
    label: "خط ۲",
    value: demoSequence,
    title: "توالی بازها",
    explanation:
      "رشته‌ای از A، C، G، T و گاهی N که نتیجه base calling برای این خوانش است. این رشته یک خوانش است، نه کل RNA و نه کل رونوشت.",
  },
  {
    label: "خط ۳",
    value: "+",
    title: "جداکننده",
    explanation:
      "خط سوم با علامت + آغاز می‌شود و بخش توالی را از رشته کیفیت جدا می‌کند. در برخی فایل‌ها اطلاعات بیشتری هم ممکن است در این خط دیده شود.",
  },
  {
    label: "خط ۴",
    value: demoQuality,
    title: "کیفیت هر باز",
    explanation:
      "هر نویسه به یک مقدار کیفیت برای باز متناظر در خط دوم کد می‌شود. طول خط کیفیت باید با طول توالی همان رکورد برابر باشد.",
  },
];

export function RnaSeqSequencingFastqLesson() {
  const [scene, setScene] = useState(0);
  const [flowAnswer, setFlowAnswer] = useState<number | null>(null);
  const [mode, setMode] = useState<"single" | "paired">("paired");
  const [modeAnswer, setModeAnswer] = useState<number | null>(null);
  const [cycle, setCycle] = useState(0);
  const [qualityAnswer, setQualityAnswer] = useState<number | null>(null);
  const [fastqLine, setFastqLine] = useState(1);
  const [fastqAnswer, setFastqAnswer] = useState<number | null>(null);
  const [selectedBase, setSelectedBase] = useState(5);
  const [phredAnswer, setPhredAnswer] = useState<number | null>(null);
  const [pairAnswer, setPairAnswer] = useState<number | null>(null);
  const [challengeRead, setChallengeRead] = useState<number | null>(null);
  const [masteryAnswer, setMasteryAnswer] = useState<number | null>(null);

  const currentBase = demoSequence[cycle];
  const currentScore = demoScores[selectedBase];
  const estimatedError = useMemo(
    () => Math.pow(10, -currentScore / 10) * 100,
    [currentScore],
  );

  function goToScene(nextScene: number) {
    setScene(nextScene);

    window.setTimeout(() => {
      document.getElementById("rna-seq-sequencing-fastq")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 20);
  }

  return (
    <SpecialistLessonShell
      domainId="transcriptomics"
      trackId="bulk-rna-seq"
      lessonIndex={4}
      title="توالی‌یابی و FASTQ"
      subtitle="در این درس کتابخانه آزمایشگاهی به داده محاسباتی تبدیل می‌شود: از تولید خوانش و تفاوت تک‌انتها/جفت‌انتها تا base calling، امتیاز Phred و چهار خط یک رکورد FASTQ."
      currentScene={scene}
      sceneCount={sceneTitles.length}
      sceneLabel={sceneTitles[scene]}
    >
      <section
        id="rna-seq-sequencing-fastq"
        className="scroll-mt-6"
      >
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-wrap gap-2">
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

          {scene === 0 && (
            <SceneCard
              eyebrow="لحظه تبدیل آزمایش به داده"
              title="دستگاه توالی‌یاب خودِ RNA را به جدول بیان تبدیل نمی‌کند؛ ابتدا میلیون‌ها خوانش تولید می‌کند."
              description="در پایان آماده‌سازی کتابخانه، مولکول‌هایی داریم که برای خوانده‌شدن آماده‌اند. توالی‌یابی از این مولکول‌ها سیگنال می‌گیرد، بازها را فراخوانی می‌کند و در نهایت داده‌ای تولید می‌شود که می‌تواند به FASTQ تبدیل شود."
            >
              <Flow
                items={[
                  "کتابخانه",
                  "توالی‌یابی",
                  "سیگنال",
                  "Base calling",
                  "خوانش + کیفیت",
                  "FASTQ",
                ]}
              />

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <ConceptCard
                  icon={<Dna className="size-5" />}
                  title="مولکول کتابخانه"
                  text="محصول فیزیکی آزمایشگاهی است که از RNA هدف ساخته شده و هنوز فایل محاسباتی نیست."
                />
                <ConceptCard
                  icon={<Gauge className="size-5" />}
                  title="خوانش"
                  text="توالی کوتاه یا بلند بازهاست که دستگاه از بخشی از یک مولکول کتابخانه گزارش می‌کند."
                  emphasized
                />
                <ConceptCard
                  icon={<FileText className="size-5" />}
                  title="FASTQ"
                  text="نمایش متنی رکوردهای خوانش به‌همراه کیفیت بازهاست؛ نه ماتریس بیان ژن."
                />
              </div>

              <DecisionQuestion
                question="کدام زنجیره از نظر مفهومی درست‌تر است؟"
                options={[
                  "کتابخانه ← FASTQ ← توالی‌یابی ← ماتریس بیان",
                  "کتابخانه ← توالی‌یابی ← خوانش و کیفیت ← FASTQ",
                  "FASTQ ← RNA استخراج‌شده ← کتابخانه",
                ]}
                selected={flowAnswer}
                correctIndex={1}
                onSelect={setFlowAnswer}
                correctFeedback="دقیقاً. FASTQ نتیجه تبدیل خوانش‌ها و کیفیت‌های تولیدشده به یک قالب داده است."
                incorrectFeedback="ترتیب را از ماده آزمایشگاهی به داده محاسباتی دنبال کنید: کتابخانه، توالی‌یابی، خوانش، سپس FASTQ."
              />

              <InsightBox>
                از این لحظه به بعد وارد بخش محاسباتی پروژه شده‌ایم؛ اما منشأ هر خط داده هنوز به تصمیم‌های آزمایشگاهی درس‌های قبلی متصل است.
              </InsightBox>
            </SceneCard>
          )}

          {scene === 1 && (
            <SceneCard
              eyebrow="شیوه خواندن قطعه"
              title="در تک‌انتها یک سر قطعه را می‌خوانیم؛ در جفت‌انتها هر دو سر همان قطعه اطلاعات می‌دهند."
              description="paired-end دو نمونه یا دو تکرار زیستی نیست. دو خوانش به یک قطعه کتابخانه‌ای مربوط‌اند و معمولاً اطلاعات بیشتری درباره جایگاه یا ساختار آن قطعه می‌دهند."
            >
              <div className="rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white">
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setMode("single")}
                    className={[
                      "rounded-xl px-4 py-2 text-sm font-bold transition",
                      mode === "single"
                        ? "bg-teal-500 text-slate-950"
                        : "bg-white/10 text-slate-300",
                    ].join(" ")}
                  >
                    تک‌انتها
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode("paired")}
                    className={[
                      "rounded-xl px-4 py-2 text-sm font-bold transition",
                      mode === "paired"
                        ? "bg-teal-500 text-slate-950"
                        : "bg-white/10 text-slate-300",
                    ].join(" ")}
                  >
                    جفت‌انتها
                  </button>
                </div>

                <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                  <div className="mx-auto max-w-3xl">
                    <div className="relative h-20 rounded-2xl border border-cyan-300/30 bg-cyan-300/10">
                      <div className="absolute inset-x-8 top-1/2 h-2 -translate-y-1/2 rounded-full bg-white/25" />
                      <div className="absolute right-8 top-1/2 h-3 w-28 -translate-y-1/2 rounded-full bg-teal-300" />
                      <span className="absolute right-8 top-3 text-[11px] font-bold text-teal-200">
                        R1 ←
                      </span>

                      {mode === "paired" && (
                        <>
                          <div className="absolute left-8 top-1/2 h-3 w-28 -translate-y-1/2 rounded-full bg-cyan-300" />
                          <span className="absolute left-8 top-3 text-[11px] font-bold text-cyan-200">
                            → R2
                          </span>
                        </>
                      )}
                    </div>

                    <p className="mt-4 text-center text-sm leading-7 text-slate-300">
                      {mode === "single"
                        ? "یک خوانش از یک سمت قطعه گزارش می‌شود."
                        : "دو خوانش از دو سر یک قطعه گزارش می‌شوند و باید به‌عنوان یک جفت شناخته شوند."}
                    </p>
                  </div>
                </div>
              </div>

              <DecisionQuestion
                question="اگر یک نمونه paired-end باشد، کدام جمله درست است؟"
                options={[
                  "یعنی دو تکرار زیستی مستقل از همان نمونه داریم.",
                  "برای هر قطعه می‌توان اطلاعات خواندن از دو سر را داشت؛ این موضوع با تعداد نمونه‌های زیستی فرق دارد.",
                  "یعنی FASTQ دیگر کیفیت بازها را نگه نمی‌دارد.",
                ]}
                selected={modeAnswer}
                correctIndex={1}
                onSelect={setModeAnswer}
                correctFeedback="دقیقاً. paired-end ویژگی راهبرد توالی‌یابی است، نه تعریف تکرار زیستی."
                incorrectFeedback="تعداد readها یا جهت‌های خواندن را با تعداد واحدهای مستقل زیستی یکی ندانید."
              />
            </SceneCard>
          )}

          {scene === 2 && (
            <SceneCard
              eyebrow="از سیگنال تا حرف"
              title="Base calling یعنی تبدیل سیگنال دستگاه به یک باز گزارش‌شده همراه با برآورد اطمینان."
              description="دستگاه مستقیماً یک رشته بی‌خطا از حروف تحویل نمی‌دهد. الگوریتم base calling از سیگنال مشاهده‌شده برای هر چرخه یک باز را انتخاب می‌کند و کیفیتی برای آن گزارش می‌شود."
            >
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold text-teal-700">
                      شبیه‌ساز چرخه توالی‌یابی
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      روی چرخه‌ها بزنید و ببینید رشته خوانش چگونه قدم‌به‌قدم ساخته می‌شود.
                    </p>
                  </div>
                  <MousePointerClick className="size-5 text-slate-400" />
                </div>

                <div className="mt-6 grid grid-cols-6 gap-2 sm:grid-cols-12">
                  {demoSequence.split("").map((base, index) => (
                    <button
                      key={`${base}-${index}`}
                      type="button"
                      onClick={() => setCycle(index)}
                      className={[
                        "flex aspect-square items-center justify-center rounded-xl border font-mono text-sm font-black transition",
                        cycle === index
                          ? "border-teal-600 bg-teal-600 text-white"
                          : index < cycle
                            ? "border-teal-200 bg-teal-50 text-teal-800"
                            : "border-slate-200 bg-slate-50 text-slate-500",
                      ].join(" ")}
                    >
                      {index <= cycle ? base : "?"}
                    </button>
                  ))}
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <MetricCard label="چرخه" value={String(cycle + 1)} />
                  <MetricCard label="باز فراخوانی‌شده" value={currentBase} />
                  <MetricCard label="کیفیت نمونه" value={`Q${demoScores[cycle]}`} />
                </div>
              </div>

              <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white">
                <p className="text-sm font-black">Phred چه می‌گوید؟</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <DarkMetric label="Q10" value="≈ ۱۰٪ احتمال خطا" />
                  <DarkMetric label="Q20" value="≈ ۱٪ احتمال خطا" />
                  <DarkMetric label="Q30" value="≈ ۰٫۱٪ احتمال خطا" />
                </div>
                <p className="mt-4 text-xs leading-6 text-slate-400">
                  این‌ها برآورد احتمالی خطای base call هستند؛ کیفیت بالا تضمین مطلق درستی یک باز نیست.
                </p>
              </div>

              <DecisionQuestion
                question="Q30 تقریباً چه برداشتی می‌دهد؟"
                options={[
                  "احتمال خطای برآوردشده حدود ۰٫۱٪ برای آن base call است.",
                  "یعنی آن باز قطعاً بدون خطاست.",
                  "یعنی ۳۰٪ از خوانش خراب است.",
                ]}
                selected={qualityAnswer}
                correctIndex={0}
                onSelect={setQualityAnswer}
                correctFeedback="درست است. Phred یک مقیاس لگاریتمی از احتمال خطای برآوردشده است."
                incorrectFeedback="Q30 را به‌عنوان احتمال خطای تقریبی ۱ در ۱۰۰۰ برای آن base call تفسیر کنید، نه تضمین مطلق."
              />
            </SceneCard>
          )}

          {scene === 3 && (
            <SceneCard
              eyebrow="چهار خط که باید برای همیشه بشناسید"
              title="هر رکورد FASTQ معمولاً چهار خط دارد: شناسه، توالی، جداکننده و کیفیت."
              description="روی هر خط کلیک کنید. هدف این نیست که FASTQ را حفظ کنید؛ باید بتوانید وقتی یک فایل واقعی باز می‌کنید، فوراً بدانید هر بخش چه نقشی دارد."
            >
              <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
                <div dir="ltr" className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-950 p-4 font-mono text-sm text-white sm:p-6">
                  {fastqLines.map((line, index) => (
                    <button
                      key={line.label}
                      type="button"
                      onClick={() => setFastqLine(index)}
                      className={[
                        "mb-2 block w-full rounded-xl border px-4 py-3 text-left transition last:mb-0",
                        fastqLine === index
                          ? "border-teal-400 bg-teal-400/10"
                          : "border-white/10 bg-white/[0.03] hover:border-white/20",
                      ].join(" ")}
                    >
                      <span className="mr-4 inline-block w-12 text-[10px] text-slate-500">
                        {index + 1}
                      </span>
                      {line.value}
                    </button>
                  ))}
                </div>

                <div className="rounded-3xl border border-teal-200 bg-teal-50 p-6">
                  <p className="text-xs font-bold text-teal-700">
                    {fastqLines[fastqLine].label}
                  </p>
                  <h3 className="mt-2 text-xl font-black text-slate-950">
                    {fastqLines[fastqLine].title}
                  </h3>
                  <p className="mt-3 text-sm leading-8 text-slate-700">
                    {fastqLines[fastqLine].explanation}
                  </p>
                </div>
              </div>

              <DecisionQuestion
                question="اگر طول خط توالی ۱۵۰ باز باشد، درباره خط کیفیت همان رکورد چه انتظاری داریم؟"
                options={[
                  "باید ۱۵۰ نویسه کیفیت متناظر داشته باشد.",
                  "می‌تواند هر طولی داشته باشد چون کیفیت مستقل از توالی است.",
                  "فقط یک عدد کیفیت برای کل خوانش کافی است.",
                ]}
                selected={fastqAnswer}
                correctIndex={0}
                onSelect={setFastqAnswer}
                correctFeedback="دقیقاً. هر موقعیت توالی یک نویسه کیفیت متناظر دارد."
                incorrectFeedback="در FASTQ، کیفیت در سطح باز ذخیره می‌شود؛ بنابراین طول توالی و رشته کیفیت باید متناظر باشند."
              />
            </SceneCard>
          )}

          {scene === 4 && (
            <SceneCard
              eyebrow="کیفیت فقط یک رشته عجیب نیست"
              title="هر نویسه در خط چهارم نماینده یک امتیاز کیفیت برای همان موقعیت در خط دوم است."
              description="در FASTQهای رایج امروزی، امتیاز Phred با کد ASCII و offset متداول ۳۳ نمایش داده می‌شود. لازم نیست جدول ASCII را حفظ کنید؛ مهم این است که ارتباط موقعیت‌به‌موقعیت توالی و کیفیت را بفهمید."
            >
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="overflow-x-auto">
                  <div dir="ltr" className="min-w-[720px]">
                    <div className="grid grid-cols-12 gap-2">
                      {demoSequence.split("").map((base, index) => (
                        <button
                          key={`base-${index}`}
                          type="button"
                          onClick={() => setSelectedBase(index)}
                          className={[
                            "rounded-xl border p-3 text-center font-mono transition",
                            selectedBase === index
                              ? "border-teal-600 bg-teal-50"
                              : "border-slate-200 bg-slate-50 hover:border-teal-300",
                          ].join(" ")}
                        >
                          <span className="block text-base font-black text-slate-950">
                            {base}
                          </span>
                          <span className="mt-1 block text-xs text-slate-400">
                            {demoQuality[index]}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-4">
                  <MetricCard label="موقعیت" value={String(selectedBase + 1)} />
                  <MetricCard label="باز" value={demoSequence[selectedBase]} />
                  <MetricCard label="نویسه کیفیت" value={demoQuality[selectedBase]} />
                  <MetricCard label="Phred" value={`Q${currentScore}`} />
                </div>

                <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">
                    احتمال خطای برآوردشده برای این base call
                  </p>
                  <p className="mt-2 text-lg font-black text-slate-950">
                    حدود {formatPercent(estimatedError)}٪
                  </p>
                </div>
              </div>

              <DecisionQuestion
                question="در رشته کیفیت بالا، نویسه‌های انتهایی ضعیف‌تر چه مفهومی دارند؟"
                options={[
                  "اطمینان base calling در آن موقعیت‌ها کمتر برآورد شده است.",
                  "یعنی آن بازها حتماً متعلق به آداپتور هستند.",
                  "یعنی نمونه زیستی دیگری به فایل اضافه شده است.",
                ]}
                selected={phredAnswer}
                correctIndex={0}
                onSelect={setPhredAnswer}
                correctFeedback="درست است. کیفیت پایین فقط می‌گوید اعتماد به base call کمتر است؛ علت باید در کنترل کیفیت بررسی شود."
                incorrectFeedback="Phred درباره اعتماد به فراخوانی باز صحبت می‌کند، نه اینکه مستقیماً علت مشکل را مشخص کند."
              />
            </SceneCard>
          )}

          {scene === 5 && (
            <SceneCard
              eyebrow="وقتی paired-end را در پوشه می‌بینید"
              title="در داده paired-end معمولاً برای یک نمونه، خوانش‌های R1 و R2 در فایل‌های متناظر نگه‌داری می‌شوند."
              description="نام‌گذاری دقیق فایل‌ها می‌تواند بین مراکز و مسیرهای پردازش متفاوت باشد، اما الگوی R1/R2 بسیار رایج است. مهم‌تر از نام فایل، حفظ رابطه جفت‌ها و فراداده نمونه است."
            >
              <div className="grid gap-4 md:grid-cols-2">
                <FileCard
                  badge="Read 1"
                  name="PDAC01_R1.fastq.gz"
                  text="خوانش از یک سمت قطعات کتابخانه‌ای نمونه PDAC01"
                  emphasized
                />
                <FileCard
                  badge="Read 2"
                  name="PDAC01_R2.fastq.gz"
                  text="خوانش متناظر از سمت دیگر همان جفت قطعات"
                />
              </div>

              <div className="mt-5 rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white">
                <p className="text-xs font-bold text-teal-300">
                  چیزی که نباید قاطی شود
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-2 text-sm font-black">
                  <span className="rounded-xl bg-white/10 px-3 py-2">R1 + R2</span>
                  <span className="text-slate-500">≠</span>
                  <span className="rounded-xl bg-white/10 px-3 py-2">دو نمونه زیستی</span>
                  <span className="text-slate-500">≠</span>
                  <span className="rounded-xl bg-white/10 px-3 py-2">دو تکرار زیستی</span>
                </div>
              </div>

              <DecisionQuestion
                question="اگر PDAC01_R1.fastq.gz و PDAC01_R2.fastq.gz داشته باشیم، دقیق‌ترین برداشت چیست؟"
                options={[
                  "دو بیمار مستقل داریم.",
                  "احتمالاً دو فایل خوانش جفت‌انتها برای یک نمونه داریم و باید آن‌ها را در تحلیل به‌عنوان pair نگه داریم.",
                  "دو ماتریس بیان آماده داریم.",
                ]}
                selected={pairAnswer}
                correctIndex={1}
                onSelect={setPairAnswer}
                correctFeedback="دقیقاً. R1/R2 درباره جفت خوانش‌هاست؛ هویت نمونه باید از فراداده و نام‌گذاری معتبر مشخص شود."
                incorrectFeedback="R1 و R2 را با تعداد نمونه یا تکرار زیستی اشتباه نگیرید."
              />

              <InsightBox>
                فایل‌های <strong>.fastq.gz</strong> معمولاً FASTQ فشرده‌شده‌اند. فشرده بودن فایل ماهیت داده را تغییر نمی‌دهد؛ فقط فضای ذخیره‌سازی را کاهش می‌دهد.
              </InsightBox>
            </SceneCard>
          )}

          {scene === 6 && (
            <SceneCard
              eyebrow="قبل از اینکه FastQC را باز کنیم"
              title="آیا می‌توانید فقط با نگاه به چند خوانش، یک هشدار اولیه درباره کیفیت بسازید؟"
              description="این یک کنترل کیفیت واقعی نیست؛ یک تمرین ذهنی است تا یاد بگیرید کیفیت بازها در FASTQ کجا زندگی می‌کند. درس بعدی همین ایده را در مقیاس میلیون‌ها خوانش بررسی می‌کند."
            >
              <div className="grid gap-4 lg:grid-cols-3">
                <ReadChallengeCard
                  index={0}
                  selected={challengeRead === 0}
                  onSelect={() => setChallengeRead(0)}
                  title="خوانش A"
                  sequence="ACGTTGCAACGT"
                  quality="IIIIIIIIIIII"
                  note="کیفیت یکنواخت بالا در این مثال آموزشی"
                />
                <ReadChallengeCard
                  index={1}
                  selected={challengeRead === 1}
                  onSelect={() => setChallengeRead(1)}
                  title="خوانش B"
                  sequence="ACGTTGCAACGT"
                  quality="IIIII?5+&&&&"
                  note="افت محسوس کیفیت در انتهای خوانش"
                />
                <ReadChallengeCard
                  index={2}
                  selected={challengeRead === 2}
                  onSelect={() => setChallengeRead(2)}
                  title="خوانش C"
                  sequence="ACGTTGCAACGT"
                  quality="????????????"
                  note="کیفیت متوسط و تقریباً یکنواخت در این مثال"
                />
              </div>

              {challengeRead !== null && (
                <div
                  className={[
                    "mt-5 rounded-2xl border p-5",
                    challengeRead === 1
                      ? "border-emerald-200 bg-emerald-50"
                      : "border-amber-200 bg-amber-50",
                  ].join(" ")}
                >
                  <p className="font-black text-slate-950">
                    {challengeRead === 1
                      ? "انتخاب خوبی برای بررسی بیشتر ✓"
                      : "یک بار دیگر رشته کیفیت‌ها را مقایسه کنید"}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-slate-700">
                    {challengeRead === 1
                      ? "در خوانش B افت کیفیت انتهایی واضح‌تر است. اما از یک یا چند خوانش نمی‌توان درباره کیفیت کل فایل نتیجه‌گیری کرد؛ باید توزیع میلیون‌ها خوانش را بررسی کنیم."
                      : "هدف تمرین پیدا کردن خوانشی است که در انتهای آن اعتماد base calling افت آشکارتری دارد."}
                  </p>
                </div>
              )}

              <InsightBox>
                درس بعدی از «یک رکورد FASTQ» به «الگوهای کل فایل» می‌رود: کیفیت بر حسب موقعیت، آداپتور، GC، طول خوانش و سایر نشانه‌ها.
              </InsightBox>
            </SceneCard>
          )}

          {scene === 7 && (
            <SceneCard
              eyebrow="ایستگاه تسلط"
              title="اگر یک FASTQ واقعی جلوی شما باز شود، باید بتوانید بدون ترس ساختارش را بخوانید."
              description="پیش از ورود به کنترل کیفیت داده خام، مطمئن شویم مرز بین نمونه، کتابخانه، خوانش و FASTQ کاملاً روشن است."
            >
              <DecisionQuestion
                question="کدام جمله دقیق‌ترین جمع‌بندی این درس است؟"
                options={[
                  "FASTQ یک جدول ژن × نمونه است که بیان ژن را مستقیماً نشان می‌دهد.",
                  "FASTQ رکوردهای خوانش را به‌همراه کیفیت بازها نگه می‌دارد؛ در paired-end خوانش‌های دو سر قطعه نیز باید به‌صورت جفت مدیریت شوند.",
                  "هر فایل R1 و R2 دو تکرار زیستی مستقل محسوب می‌شوند.",
                ]}
                selected={masteryAnswer}
                correctIndex={1}
                onSelect={setMasteryAnswer}
                correctFeedback="عالی. حالا FASTQ برای شما یک فایل ناشناخته نیست؛ می‌دانید چه داده‌ای در آن وجود دارد و چه چیزی هنوز وجود ندارد."
                incorrectFeedback="به سه مرز برگردید: FASTQ ≠ ماتریس بیان، paired-end ≠ تکرار زیستی، کیفیت ≠ تضمین مطلق."
              />

              <div className="mt-7 rounded-3xl bg-slate-950 p-6 text-white">
                <p className="text-xs font-bold text-teal-300">
                  نقشه‌ای که باید با خودتان ببرید
                </p>
                <div dir="rtl" className="mt-4 flex flex-wrap items-center gap-2 text-sm font-black">
                  {[
                    "کتابخانه",
                    "توالی‌یابی",
                    "خوانش",
                    "Base + Phred",
                    "FASTQ",
                    "کنترل کیفیت",
                  ].map((item, index, items) => (
                    <div key={item} className="flex items-center gap-2">
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

              <InsightBox>
                درس ۵ وارد <strong>کنترل کیفیت داده خام</strong> می‌شود؛ جایی که دیگر یک خوانش را نگاه نمی‌کنیم و رفتار میلیون‌ها خوانش را به‌صورت جمعی می‌سنجیم.
              </InsightBox>
            </SceneCard>
          )}

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              disabled={scene === 0}
              onClick={() => goToScene(scene - 1)}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowRight className="size-4" />
              بخش قبل
            </button>

            {scene < sceneTitles.length - 1 && (
              <button
                type="button"
                onClick={() => goToScene(scene + 1)}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800"
              >
                بخش بعد
                <ArrowLeft className="size-4" />
              </button>
            )}
          </div>
        </div>
      </section>
    </SpecialistLessonShell>
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
        <p className="mt-3 max-w-4xl text-sm leading-8 text-slate-600">
          {description}
        </p>
      </div>
      <div className="p-6 sm:p-8">{children}</div>
    </article>
  );
}

function Flow({ items }: { items: string[] }) {
  return (
    <div dir="rtl" className="rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white">
      <div className="flex flex-wrap items-center gap-2 text-sm font-black">
        {items.map((item, index) => (
          <div key={item} className="flex items-center gap-2">
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
  );
}

function ConceptCard({
  icon,
  title,
  text,
  emphasized = false,
}: {
  icon: ReactNode;
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
      <div className="flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-xl bg-white text-teal-700 shadow-sm">
          {icon}
        </span>
        <p className="font-black text-slate-950">{title}</p>
      </div>
      <p className="mt-4 text-sm leading-8 text-slate-600">{text}</p>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p dir="ltr" className="mt-2 text-lg font-black text-slate-950">
        {value}
      </p>
    </div>
  );
}

function DarkMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
      <p dir="ltr" className="text-lg font-black text-teal-300">{label}</p>
      <p className="mt-2 text-xs leading-6 text-slate-300">{value}</p>
    </div>
  );
}

function FileCard({
  badge,
  name,
  text,
  emphasized = false,
}: {
  badge: string;
  name: string;
  text: string;
  emphasized?: boolean;
}) {
  return (
    <div
      className={[
        "rounded-3xl border p-5",
        emphasized
          ? "border-teal-300 bg-teal-50"
          : "border-slate-200 bg-white",
      ].join(" ")}
    >
      <span className="rounded-full bg-slate-950 px-3 py-1 text-[11px] font-bold text-white">
        {badge}
      </span>
      <p dir="ltr" className="mt-4 break-all font-mono text-sm font-black text-slate-950">
        {name}
      </p>
      <p className="mt-3 text-sm leading-7 text-slate-600">{text}</p>
    </div>
  );
}

function ReadChallengeCard({
  selected,
  onSelect,
  title,
  sequence,
  quality,
  note,
}: {
  index: number;
  selected: boolean;
  onSelect: () => void;
  title: string;
  sequence: string;
  quality: string;
  note: string;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={[
        "rounded-3xl border p-5 text-right transition",
        selected
          ? "border-teal-500 bg-teal-50 shadow-md"
          : "border-slate-200 bg-white hover:border-teal-300",
      ].join(" ")}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="font-black text-slate-950">{title}</p>
        {selected && <CheckCircle2 className="size-5 text-teal-700" />}
      </div>
      <div dir="ltr" className="mt-4 rounded-2xl bg-slate-950 p-4 font-mono text-xs text-white">
        <p>{sequence}</p>
        <p className="mt-2 text-teal-300">{quality}</p>
      </div>
      <p className="mt-3 text-xs leading-6 text-slate-500">{note}</p>
    </button>
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
            {correct
              ? "مسیر فکری درست ✓"
              : "این برداشت را دوباره بررسی کنید"}
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

function formatPercent(value: number) {
  if (value >= 10) return value.toFixed(1);
  if (value >= 1) return value.toFixed(2);
  return value.toFixed(3);
}
