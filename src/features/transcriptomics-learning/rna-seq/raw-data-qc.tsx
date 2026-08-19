import {
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CircleAlert,
  CircleX,
  Lightbulb,
  Microscope,
  ScanSearch,
} from "lucide-react";

import { SpecialistLessonShell } from "@/features/learning/components/SpecialistLessonShell";

const sceneTitles = [
  "QC یعنی تصمیم‌سازی",
  "کیفیت در طول خوانش",
  "آداپتور و طول قطعه",
  "GC و ترکیب بازها",
  "تکرار و توالی‌های غالب",
  "R1 و R2 را کنار هم ببین",
  "اتاق تریاژ QC",
  "ایستگاه تسلط",
];

const goodQuality = [
  36, 36, 36, 36, 35, 35, 35, 35, 35, 35,
  34, 34, 34, 34, 34, 34, 33, 33, 33, 33,
];

const tailDropQuality = [
  36, 36, 36, 35, 35, 35, 34, 34, 34, 33,
  33, 32, 31, 30, 28, 26, 23, 20, 17, 14,
];

const r2Quality = [
  35, 35, 35, 34, 34, 34, 33, 33, 32, 32,
  31, 30, 29, 27, 25, 23, 21, 19, 17, 15,
];

type TriageAction = "continue" | "inspect" | "trim";

type TriageCase = {
  id: string;
  title: string;
  subtitle: string;
  modules: Array<{
    label: string;
    status: "pass" | "warn" | "fail";
    note: string;
  }>;
  correct: TriageAction;
  explanation: string;
};

const triageCases: TriageCase[] = [
  {
    id: "a",
    title: "نمونه A",
    subtitle: "کیفیت پایدار، آداپتور ناچیز، GC قابل انتظار",
    modules: [
      { label: "کیفیت بازها", status: "pass", note: "پایدار در طول خوانش" },
      { label: "آداپتور", status: "pass", note: "سیگنال ناچیز" },
      { label: "GC", status: "pass", note: "بدون قله غیرمنتظره واضح" },
    ],
    correct: "continue",
    explanation:
      "برای این سناریوی آموزشی نشانه‌ای که الزاماً preprocessing بیشتری بخواهد دیده نمی‌شود؛ می‌توان با ثبت QC به مرحله بعد رفت.",
  },
  {
    id: "b",
    title: "نمونه B",
    subtitle: "کیفیت خوب، اما افزایش واضح آداپتور در انتهای خوانش",
    modules: [
      { label: "کیفیت بازها", status: "pass", note: "عمدتاً مناسب" },
      { label: "آداپتور", status: "fail", note: "افزایش در انتهای خوانش" },
      { label: "GC", status: "pass", note: "الگوی کلی قابل انتظار" },
    ],
    correct: "trim",
    explanation:
      "وقتی read-through آداپتور با شواهد روشن دیده می‌شود، trimming هدفمند می‌تواند منطقی باشد؛ تصمیم باید بر اساس پروتکل و ابزار پایین‌دستی ثبت شود.",
  },
  {
    id: "c",
    title: "نمونه C",
    subtitle: "هشدار در ترکیب بازهای ابتدای خوانش و چند توالی غالب",
    modules: [
      { label: "کیفیت بازها", status: "pass", note: "کیفیت کلی مناسب" },
      { label: "ترکیب بازها", status: "warn", note: "سوگیری 5′" },
      { label: "توالی‌های غالب", status: "warn", note: "نیازمند شناسایی منبع" },
    ],
    correct: "inspect",
    explanation:
      "هشدار ترکیب بازهای آغاز خوانش در برخی کتابخانه‌های RNA-seq می‌تواند با priming یا طراحی کتابخانه مرتبط باشد. قبل از trimming یا حذف داده باید منبع توالی‌های غالب و پروتکل بررسی شود.",
  },
];

export function RnaSeqRawDataQcLesson() {
  const [scene, setScene] = useState(0);
  const [qcAnswer, setQcAnswer] = useState<number | null>(null);
  const [qualityMode, setQualityMode] = useState<"good" | "tail">("tail");
  const [qualityPosition, setQualityPosition] = useState(16);
  const [qualityAnswer, setQualityAnswer] = useState<number | null>(null);
  const [adapterLevel, setAdapterLevel] = useState<"low" | "medium" | "high">("high");
  const [adapterAnswer, setAdapterAnswer] = useState<number | null>(null);
  const [compositionAnswer, setCompositionAnswer] = useState<number | null>(null);
  const [duplicationAnswer, setDuplicationAnswer] = useState<number | null>(null);
  const [pairSide, setPairSide] = useState<"r1" | "r2">("r2");
  const [pairAnswer, setPairAnswer] = useState<number | null>(null);
  const [triageAnswers, setTriageAnswers] = useState<Record<string, TriageAction>>({});
  const [masteryAnswer, setMasteryAnswer] = useState<number | null>(null);

  const qualityData = qualityMode === "good" ? goodQuality : tailDropQuality;
  const selectedQuality = qualityData[qualityPosition - 1];

  const triageScore = useMemo(
    () =>
      triageCases.filter(
        (item) => triageAnswers[item.id] === item.correct,
      ).length,
    [triageAnswers],
  );

  function goToScene(nextScene: number) {
    setScene(nextScene);

    window.setTimeout(() => {
      document.getElementById("rna-seq-raw-data-qc")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 20);
  }

  return (
    <SpecialistLessonShell
      domainId="transcriptomics"
      trackId="bulk-rna-seq"
      lessonIndex={5}
      title="کنترل کیفیت داده خام"
      subtitle="در این درس قرار نیست فقط چند چراغ سبز و زرد و قرمز را حفظ کنیم. هدف این است که از الگوی کیفیت، آداپتور، GC، ترکیب بازها و توالی‌های غالب به یک تصمیم قابل دفاع درباره داده خام برسیم."
      currentScene={scene}
      sceneCount={sceneTitles.length}
      sceneLabel={sceneTitles[scene]}
    >
      <section
        id="rna-seq-raw-data-qc"
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
              eyebrow="اصل راهنما"
              title="QC حکم نهایی درباره خوب یا بد بودن داده نیست؛ یک سامانه هشدار برای تصمیم‌گیری است."
              description="گزارش‌های QC خام معمولاً چند ماژول مستقل را کنار هم می‌گذارند. ارزش اصلی آن‌ها زمانی ظاهر می‌شود که الگوها را با نوع کتابخانه، پروتکل و سؤال زیستی تفسیر کنیم."
            >
              <div className="grid gap-4 md:grid-cols-3">
                <StatusCard
                  icon={<CheckCircle2 className="size-5" />}
                  title="Pass"
                  text="نشانه‌ای برجسته در آن ماژول دیده نشده؛ نه اینکه کل نمونه بی‌نقص باشد."
                  tone="pass"
                />
                <StatusCard
                  icon={<CircleAlert className="size-5" />}
                  title="Warning"
                  text="الگویی نیازمند تفسیر است؛ ممکن است کاملاً قابل انتظار یا نیازمند پیگیری باشد."
                  tone="warn"
                />
                <StatusCard
                  icon={<CircleX className="size-5" />}
                  title="Fail"
                  text="انحراف قابل توجه دیده شده؛ علت را پیدا می‌کنیم، نه اینکه خودکار کل داده را دور بریزیم."
                  tone="fail"
                />
              </div>

              <Flow
                items={[
                  "FASTQ",
                  "مشاهده الگوهای QC",
                  "تطبیق با پروتکل",
                  "تشخیص علت محتمل",
                  "تصمیم preprocessing",
                  "ثبت تصمیم",
                ]}
              />

              <DecisionQuestion
                question="یک ماژول QC برای نمونه شما Warning داده است. بهترین واکنش اولیه چیست؟"
                options={[
                  "نمونه را فوراً حذف کنیم.",
                  "علت هشدار را در زمینه نوع کتابخانه و سایر ماژول‌ها بررسی کنیم.",
                  "هشدار را نادیده بگیریم چون همه هشدارها بی‌اهمیت‌اند.",
                ]}
                selected={qcAnswer}
                correctIndex={1}
                onSelect={setQcAnswer}
                correctFeedback="دقیقاً. QC یک مسئله تفسیر چندنشانه‌ای است، نه خواندن یک چراغ به‌تنهایی."
                incorrectFeedback="هشدار می‌تواند مهم یا قابل انتظار باشد؛ تصمیم باید با شواهد دیگر و پروتکل پیوند بخورد."
              />

              <InsightBox>
                هدف این درس ساختن عادت <strong>مشاهده ← فرضیه ← بررسی ← تصمیم</strong> است. همین عادت بعداً در تمام QCهای سطح نمونه هم تکرار می‌شود.
              </InsightBox>
            </SceneCard>
          )}

          {scene === 1 && (
            <SceneCard
              eyebrow="Per-base quality"
              title="کیفیت را در طول خوانش ببین؛ میانگین کل فایل می‌تواند افت انتهایی را پنهان کند."
              description="در بسیاری از runها کیفیت بازخوانی در طول read تغییر می‌کند. این آزمایش کوچک اجازه می‌دهد موقعیت‌های مختلف یک پروفایل مصنوعی را لمس کنید."
            >
              <div className="grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
                <div className="rounded-3xl border border-slate-200 bg-slate-950 p-5 text-white sm:p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold text-teal-300">
                        آزمایشگاه کیفیت بازها
                      </p>
                      <p className="mt-2 text-sm text-slate-300">
                        هر ستون یک بخش از طول خوانش را نمایندگی می‌کند.
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <ModeButton
                        active={qualityMode === "good"}
                        onClick={() => setQualityMode("good")}
                      >
                        پایدار
                      </ModeButton>
                      <ModeButton
                        active={qualityMode === "tail"}
                        onClick={() => setQualityMode("tail")}
                      >
                        افت انتهایی
                      </ModeButton>
                    </div>
                  </div>

                  <div className="mt-8 flex h-48 items-end gap-1 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    {qualityData.map((value, index) => {
                      const active = index + 1 === qualityPosition;
                      return (
                        <button
                          key={`${value}-${index}`}
                          type="button"
                          aria-label={`بخش ${index + 1} کیفیت ${value}`}
                          onClick={() => setQualityPosition(index + 1)}
                          className={[
                            "min-w-0 flex-1 rounded-t-md transition",
                            active
                              ? "bg-white"
                              : value >= 30
                                ? "bg-teal-400/70 hover:bg-teal-300"
                                : value >= 20
                                  ? "bg-amber-400/75 hover:bg-amber-300"
                                  : "bg-rose-400/75 hover:bg-rose-300",
                          ].join(" ")}
                          style={{ height: `${Math.max(16, value * 4)}px` }}
                        />
                      );
                    })}
                  </div>

                  <input
                    type="range"
                    min={1}
                    max={20}
                    value={qualityPosition}
                    onChange={(event) =>
                      setQualityPosition(Number(event.target.value))
                    }
                    className="mt-5 w-full"
                  />
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-6">
                  <p className="text-xs font-bold text-slate-500">
                    نقطه انتخاب‌شده
                  </p>
                  <p className="mt-3 text-4xl font-black text-slate-950">
                    Q{new Intl.NumberFormat("fa-IR").format(selectedQuality)}
                  </p>
                  <p className="mt-2 text-sm text-slate-500">
                    بخش {new Intl.NumberFormat("fa-IR").format(qualityPosition)} از طول خوانش
                  </p>

                  <div className="mt-6 space-y-3 text-sm leading-7 text-slate-600">
                    <p>
                      {selectedQuality >= 30
                        ? "در این نقطه کیفیت بالاست و احتمال خطای base call پایین است."
                        : selectedQuality >= 20
                          ? "کیفیت نسبت به ابتدای read افت کرده و باید الگوی کلی را بررسی کنیم."
                          : "در این بخش افت واضح کیفیت دیده می‌شود؛ تصمیم درباره trimming باید با طول read، ابزار پایین‌دستی و میزان افت هماهنگ باشد."}
                    </p>
                    <p className="rounded-2xl bg-slate-50 p-4 text-xs leading-6 text-slate-500">
                      Q30 را به‌عنوان یک نقطه مرجع آموزشی ببینید، نه یک قانون جهانی برای حذف هر باز پایین‌تر از آن.
                    </p>
                  </div>
                </div>
              </div>

              <DecisionQuestion
                question="در پروفایل «افت انتهایی»، کدام برداشت دقیق‌تر است؟"
                options={[
                  "چون انتهای read افت کرده، کل نمونه حتماً غیرقابل استفاده است.",
                  "الگوی افت را باید از نظر شدت، طول بخش درگیر و اثر آن بر تحلیل پایین‌دستی ارزیابی کنیم.",
                  "کیفیت انتهای read هیچ‌وقت اهمیتی ندارد.",
                ]}
                selected={qualityAnswer}
                correctIndex={1}
                onSelect={setQualityAnswer}
                correctFeedback="درست است. QC درباره شکل الگو و پیامد آن است، نه یک آستانه جادویی."
                incorrectFeedback="افت انتهایی رایج است، اما شدت و پیامد آن باید در زمینه پروژه تفسیر شود."
              />
            </SceneCard>
          )}

          {scene === 2 && (
            <SceneCard
              eyebrow="Adapter content"
              title="وقتی قطعه واقعی کوتاه‌تر از طول خواندن باشد، دستگاه می‌تواند وارد آداپتور شود."
              description="این read-through یکی از دلایل کلاسیک افزایش سیگنال آداپتور در انتهای خوانش است. با تغییر شدت، ببینید چه‌طور تصمیم preprocessing تغییر می‌کند."
            >
              <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
                <div className="rounded-3xl border border-slate-200 bg-white p-5">
                  <p className="text-xs font-bold text-teal-700">
                    شدت آداپتور را تغییر بده
                  </p>
                  <div className="mt-4 grid gap-2">
                    <ChoiceButton
                      active={adapterLevel === "low"}
                      onClick={() => setAdapterLevel("low")}
                    >
                      بسیار کم
                    </ChoiceButton>
                    <ChoiceButton
                      active={adapterLevel === "medium"}
                      onClick={() => setAdapterLevel("medium")}
                    >
                      متوسط
                    </ChoiceButton>
                    <ChoiceButton
                      active={adapterLevel === "high"}
                      onClick={() => setAdapterLevel("high")}
                    >
                      زیاد در انتهای read
                    </ChoiceButton>
                  </div>
                </div>

                <AdapterSimulator level={adapterLevel} />
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-3">
                <ConceptCard
                  title="Insert کوتاه"
                  text="اگر قطعه زیستی از طول read کوتاه‌تر باشد، ادامه خواندن می‌تواند به توالی آداپتور برسد."
                  emphasized
                />
                <ConceptCard
                  title="نشانه در QC"
                  text="سیگنال آداپتور اغلب در بخش‌های انتهایی read افزایش پیدا می‌کند و باید با طراحی کتابخانه تطبیق داده شود."
                />
                <ConceptCard
                  title="اقدام محتمل"
                  text="در صورت وجود شواهد روشن، trimming آداپتور می‌تواند لازم باشد؛ اما trimming پیش‌فرض برای هر فایل منطقی نیست."
                />
              </div>

              <DecisionQuestion
                question="اگر آداپتور در بخش انتهایی درصد قابل توجهی از readها دیده شود، بهترین تصمیم کدام است؟"
                options={[
                  "بدون بررسی، کل نمونه حذف شود.",
                  "با توجه به پروتکل و ابزار پایین‌دستی، trimming هدفمند آداپتور بررسی و مستند شود.",
                  "آداپتور بخشی از RNA است و باید حفظ شود.",
                ]}
                selected={adapterAnswer}
                correctIndex={1}
                onSelect={setAdapterAnswer}
                correctFeedback="دقیقاً. هدف preprocessing حذف سیگنال فنی مشخص با دلیل روشن است."
                incorrectFeedback="آداپتور سیگنال زیستی هدف ما نیست؛ اما اقدام باید بر اساس شواهد و زمینه انجام شود."
              />
            </SceneCard>
          )}

          {scene === 3 && (
            <SceneCard
              eyebrow="GC و ترکیب بازها"
              title="هر انحراف از یک منحنی ایده‌آل، آلودگی نیست. بعضی سوگیری‌ها از خود روش ساخت کتابخانه می‌آیند."
              description="QC باید بین «الگوی قابل انتظار از پروتکل» و «قله یا تغییر غیرمنتظره‌ای که نیازمند پیگیری است» تفاوت بگذارد."
            >
              <div className="grid gap-5 lg:grid-cols-2">
                <CompositionPanel
                  title="سوگیری ابتدای read"
                  subtitle="نمونه آموزشی RNA-seq"
                  bars={[58, 42, 62, 38, 54, 46, 51, 49, 50, 50, 50, 50]}
                  note="در برخی کتابخانه‌های RNA-seq، priming و نحوه شروع خوانش می‌تواند چند موقعیت ابتدایی را نامتوازن کند."
                />
                <GcPanel />
              </div>

              <DecisionQuestion
                question="در یک کتابخانه RNA-seq، چند موقعیت ابتدایی ترکیب باز نامتوازن دارند ولی کیفیت خوب است و این الگو با پروتکل سازگار است. چه برداشتی بهتر است؟"
                options={[
                  "این مشاهده به‌تنهایی ثابت می‌کند نمونه آلوده است.",
                  "این می‌تواند یک سوگیری فنی قابل انتظار باشد و باید با سایر ماژول‌ها و پروتکل تفسیر شود.",
                  "باید بدون بررسی ۱۲ باز اول همه readها را حذف کنیم.",
                ]}
                selected={compositionAnswer}
                correctIndex={1}
                onSelect={setCompositionAnswer}
                correctFeedback="درست است. بعضی هشدارهای composition در RNA-seq حاصل منطق library preparation هستند و trimming کورکورانه آن‌ها را اصلاح نمی‌کند."
                incorrectFeedback="یک هشدار composition به‌تنهایی علت را مشخص نمی‌کند؛ زمینه پروتکل مهم است."
              />

              <InsightBox>
                یک قله GC غیرمنتظره یا شکل چندقله‌ای می‌تواند سرنخی برای آلودگی یا زیرجمعیت متفاوت باشد، اما برای نتیجه‌گیری باید از ماژول‌های دیگر و اطلاعات نمونه کمک بگیریم.
              </InsightBox>
            </SceneCard>
          )}

          {scene === 4 && (
            <SceneCard
              eyebrow="Duplication و overrepresented sequences"
              title="تکرار زیاد همیشه PCR artifact نیست؛ RNAهای بسیار فراوان هم می‌توانند خوانش‌های تکراری بسازند."
              description="در RNA-seq، فراوانی واقعی رونوشت‌ها ناهمگن است. بنابراین duplication و توالی‌های غالب باید با انتظار زیستی و طراحی کتابخانه تفسیر شوند."
            >
              <div className="grid gap-4 lg:grid-cols-3">
                <ReasonCard
                  title="فراوانی واقعی زیستی"
                  text="یک رونوشت بسیار پر‌بیان می‌تواند readهای بسیار مشابه ایجاد کند."
                  icon="RNA"
                />
                <ReasonCard
                  title="پیچیدگی پایین کتابخانه"
                  text="اگر مولکول‌های منحصربه‌فرد کمی وارد کتابخانه شده باشند، duplication می‌تواند بالا برود."
                  icon="LIB"
                />
                <ReasonCard
                  title="تکثیر فنی"
                  text="PCR می‌تواند برخی مولکول‌ها را بیش از دیگران تقویت کند و فراوانی مشاهده‌شده را تغییر دهد."
                  icon="PCR"
                />
              </div>

              <div className="mt-5 rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white">
                <div className="flex items-start gap-4">
                  <ScanSearch className="mt-1 size-6 shrink-0 text-teal-300" />
                  <div>
                    <p className="font-black">یک توالی غالب پیدا شد؛ سؤال بعدی چیست؟</p>
                    <p className="mt-2 text-sm leading-7 text-slate-300">
                      آیا آداپتور است؟ rRNA یا مولکول دیگری است؟ رونوشت بسیار پر‌بیان است؟ یا نشانه‌ای از library complexity پایین؟ اول هویت و زمینه را پیدا می‌کنیم.
                    </p>
                  </div>
                </div>
              </div>

              <DecisionQuestion
                question="گزارش duplication بالا است. کدام اقدام علمی‌تر است؟"
                options={[
                  "همه readهای duplicate را قبل از RNA-seq حذف کنیم.",
                  "ابتدا مشخص کنیم duplication از فراوانی زیستی، پیچیدگی کتابخانه یا فرایند فنی می‌آید و بعد درباره اقدام تصمیم بگیریم.",
                  "duplication در RNA-seq هیچ‌وقت اطلاعاتی ندارد.",
                ]}
                selected={duplicationAnswer}
                correctIndex={1}
                onSelect={setDuplicationAnswer}
                correctFeedback="دقیقاً. در RNA-seq حذف خودکار duplicateها می‌تواند سیگنال واقعی بیان را هم تغییر دهد؛ علت‌یابی مقدم است."
                incorrectFeedback="duplicate در RNA-seq می‌تواند زیستی یا فنی باشد؛ تفسیر آن بدون زمینه خطرناک است."
              />
            </SceneCard>
          )}

          {scene === 5 && (
            <SceneCard
              eyebrow="Paired-end QC"
              title="R1 و R2 دو نگاه به یک قطعه‌اند؛ QC آن‌ها را جدا می‌بینیم اما با هم تفسیر می‌کنیم."
              description="در داده paired-end، کیفیت دو mate می‌تواند یکسان نباشد. این مقایسه مصنوعی نشان می‌دهد چرا فقط دیدن R1 کافی نیست."
            >
              <div className="flex flex-wrap gap-2">
                <ModeButton
                  active={pairSide === "r1"}
                  onClick={() => setPairSide("r1")}
                >
                  مشاهده R1
                </ModeButton>
                <ModeButton
                  active={pairSide === "r2"}
                  onClick={() => setPairSide("r2")}
                >
                  مشاهده R2
                </ModeButton>
              </div>

              <div className="mt-5 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
                <MiniQualityChart
                  values={pairSide === "r1" ? goodQuality : r2Quality}
                  label={pairSide === "r1" ? "R1" : "R2"}
                />

                <div className="rounded-3xl border border-slate-200 bg-white p-6">
                  <p className="text-xs font-bold text-teal-700">
                    تفسیر فعلی
                  </p>
                  <p className="mt-3 text-lg font-black text-slate-950">
                    {pairSide === "r1"
                      ? "R1 کیفیت نسبتاً پایدار دارد."
                      : "R2 در بخش انتهایی افت بیشتری نشان می‌دهد."}
                  </p>
                  <p className="mt-3 text-sm leading-8 text-slate-600">
                    تصمیم trimming یا پارامترهای downstream باید زوج readها و نیاز تحلیل را در نظر بگیرد؛ وجود افت در R2 به معنی تبدیل paired-end به دو نمونه نیست.
                  </p>
                </div>
              </div>

              <DecisionQuestion
                question="در paired-end، R1 خوب است ولی R2 افت کیفیت انتهایی بیشتری دارد. کدام برداشت درست‌تر است؟"
                options={[
                  "چون R1 خوب است، QC روی R2 لازم نیست.",
                  "هر mate باید جدا بررسی شود و تصمیم preprocessing با حفظ منطق جفت‌شدن readها انجام شود.",
                  "R1 و R2 دو تکرار زیستی‌اند و می‌توان یکی را حذف کرد.",
                ]}
                selected={pairAnswer}
                correctIndex={1}
                onSelect={setPairAnswer}
                correctFeedback="درست است. R1 و R2 فایل‌های جدا اما متعلق به همان library و همان قطعات جفت‌شده‌اند."
                incorrectFeedback="QC paired-end باید هر دو mate را ببیند و رابطه آن‌ها را حفظ کند."
              />
            </SceneCard>
          )}

          {scene === 6 && (
            <SceneCard
              eyebrow="ماموریت تعاملی"
              title="اتاق تریاژ QC: برای هر نمونه یک تصمیم انتخاب کن."
              description="سه گزارش خلاصه‌شده روبه‌رویت هستند. قرار نیست فقط رنگ‌ها را بشماری؛ باید الگوی غالب را به یک اقدام منطقی تبدیل کنی."
            >
              <div className="grid gap-5 xl:grid-cols-3">
                {triageCases.map((item) => {
                  const selected = triageAnswers[item.id];
                  const answered = Boolean(selected);
                  const correct = selected === item.correct;

                  return (
                    <article
                      key={item.id}
                      className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-black text-slate-950">{item.title}</p>
                          <p className="mt-2 text-xs leading-6 text-slate-500">
                            {item.subtitle}
                          </p>
                        </div>
                        <Microscope className="size-5 text-teal-700" />
                      </div>

                      <div className="mt-5 space-y-2">
                        {item.modules.map((module) => (
                          <ModuleRow
                            key={module.label}
                            label={module.label}
                            note={module.note}
                            status={module.status}
                          />
                        ))}
                      </div>

                      <p className="mt-5 text-xs font-bold text-slate-500">
                        اقدام شما
                      </p>
                      <div className="mt-2 grid gap-2">
                        <TriageButton
                          active={selected === "continue"}
                          onClick={() =>
                            setTriageAnswers((current) => ({
                              ...current,
                              [item.id]: "continue",
                            }))
                          }
                        >
                          ادامه با ثبت QC
                        </TriageButton>
                        <TriageButton
                          active={selected === "inspect"}
                          onClick={() =>
                            setTriageAnswers((current) => ({
                              ...current,
                              [item.id]: "inspect",
                            }))
                          }
                        >
                          بررسی علت قبل از اقدام
                        </TriageButton>
                        <TriageButton
                          active={selected === "trim"}
                          onClick={() =>
                            setTriageAnswers((current) => ({
                              ...current,
                              [item.id]: "trim",
                            }))
                          }
                        >
                          trimming هدفمند
                        </TriageButton>
                      </div>

                      {answered && (
                        <div
                          className={[
                            "mt-4 rounded-2xl border p-4 text-sm leading-7",
                            correct
                              ? "border-emerald-200 bg-emerald-50 text-emerald-950"
                              : "border-amber-200 bg-amber-50 text-amber-950",
                          ].join(" ")}
                        >
                          <p className="font-black">
                            {correct ? "تصمیم قابل دفاع ✓" : "یک بار دیگر الگو را بخوان"}
                          </p>
                          <p className="mt-2 text-slate-700">
                            {item.explanation}
                          </p>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>

              <div className="mt-6 rounded-3xl bg-slate-950 p-6 text-white">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold text-teal-300">
                      امتیاز تریاژ
                    </p>
                    <p className="mt-2 text-2xl font-black">
                      {new Intl.NumberFormat("fa-IR").format(triageScore)} از ۳
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {[0, 1, 2].map((index) => (
                      <span
                        key={index}
                        className={[
                          "size-3 rounded-full",
                          index < triageScore
                            ? "bg-teal-300"
                            : "bg-white/15",
                        ].join(" ")}
                      />
                    ))}
                  </div>
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-300">
                  {triageScore === 3
                    ? "عالی. داری QC را به‌عنوان فرایند تصمیم‌گیری می‌بینی، نه جدول رنگی."
                    : "برای هر نمونه از خودت بپرس: نشانه چیست؟ علت محتمل چیست؟ آیا اقدام من مستقیماً آن علت را هدف می‌گیرد؟"}
                </p>
              </div>
            </SceneCard>
          )}

          {scene === 7 && (
            <SceneCard
              eyebrow="ایستگاه تسلط"
              title="قبل از ورود به هم‌ترازی و کمی‌سازی، باید بتوانی برای هر تغییر روی FASTQ دلیل بنویسی."
              description="preprocessing خوب کمترین تغییر لازم را با بیشترین توجیه انجام می‌دهد؛ نه اینکه صرفاً همه ابزارهای trimming را اجرا کند."
            >
              <DecisionQuestion
                question="کدام جمله دقیق‌ترین جمع‌بندی این درس است؟"
                options={[
                  "هر Warning یا Fail در QC یعنی نمونه باید حذف شود.",
                  "QC مجموعه‌ای از نشانه‌هاست که باید با پروتکل، نوع کتابخانه و تحلیل پایین‌دستی تفسیر شود و هر preprocessing باید دلیل مشخص داشته باشد.",
                  "بهتر است قبل از دیدن QC همه readها را با یک تنظیم ثابت trim کنیم.",
                ]}
                selected={masteryAnswer}
                correctIndex={1}
                onSelect={setMasteryAnswer}
                correctFeedback="عالی. حالا می‌توانی بین مشاهده یک هشدار و تصمیم برای تغییر داده فاصله علمی ایجاد کنی."
                incorrectFeedback="اصل درس را به یاد بیاور: مشاهده ← فرضیه ← بررسی ← تصمیم."
              />

              <div className="mt-7 grid gap-4 md:grid-cols-4">
                <TakeawayCard number="۱" title="مشاهده" text="شکل الگو را ببین، نه فقط رنگ وضعیت را." />
                <TakeawayCard number="۲" title="زمینه" text="پروتکل، نوع کتابخانه و R1/R2 را وارد تفسیر کن." />
                <TakeawayCard number="۳" title="علت" text="آداپتور، افت کیفیت، سوگیری فنی یا آلودگی را از هم جدا کن." />
                <TakeawayCard number="۴" title="اقدام" text="فقط تغییری را انجام بده که علت مشخصی را هدف بگیرد." />
              </div>

              <div className="mt-7 rounded-3xl bg-slate-950 p-6 text-white">
                <p className="text-xs font-bold text-teal-300">
                  مسیر بعدی
                </p>
                <p className="mt-3 text-lg font-black leading-9">
                  FASTQ بررسی‌شده ← ارتباط خوانش با مرجع ← کمی‌سازی بیان
                </p>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  در درس بعدی می‌بینیم خوانش‌ها چگونه به ژنوم یا رونوشت‌ها مرتبط می‌شوند و چرا نام ابزار از فهم تبدیلی که انجام می‌دهد مهم‌تر نیست.
                </p>
              </div>
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
    <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white">
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

function StatusCard({
  icon,
  title,
  text,
  tone,
}: {
  icon: ReactNode;
  title: string;
  text: string;
  tone: "pass" | "warn" | "fail";
}) {
  const classes = {
    pass: "border-emerald-200 bg-emerald-50 text-emerald-900",
    warn: "border-amber-200 bg-amber-50 text-amber-950",
    fail: "border-rose-200 bg-rose-50 text-rose-950",
  }[tone];

  return (
    <div className={`rounded-3xl border p-5 ${classes}`}>
      <div className="flex items-center gap-3">
        {icon}
        <p className="font-black">{title}</p>
      </div>
      <p className="mt-3 text-sm leading-7 text-slate-700">{text}</p>
    </div>
  );
}

function ModeButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-xl border px-3 py-2 text-xs font-bold transition",
        active
          ? "border-teal-400 bg-teal-400 text-slate-950"
          : "border-white/15 bg-white/5 text-slate-300 hover:bg-white/10",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function ChoiceButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-2xl border p-3 text-right text-sm font-bold transition",
        active
          ? "border-teal-500 bg-teal-50 text-teal-900"
          : "border-slate-200 bg-slate-50 text-slate-600 hover:border-teal-300",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function AdapterSimulator({
  level,
}: {
  level: "low" | "medium" | "high";
}) {
  const adapterWidth =
    level === "low" ? 5 : level === "medium" ? 22 : 42;
  const label =
    level === "low"
      ? "سیگنال بسیار کم"
      : level === "medium"
        ? "سیگنال متوسط"
        : "افزایش واضح در انتها";

  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white">
      <p className="text-xs font-bold text-teal-300">شبیه‌ساز read-through</p>
      <p className="mt-2 text-sm text-slate-300">{label}</p>

      <div className="mt-7 space-y-4">
        {[0, 1, 2].map((item) => (
          <div key={item} className="flex items-center gap-2">
            <span className="w-14 text-[10px] text-slate-500">read {item + 1}</span>
            <div className="flex h-7 flex-1 overflow-hidden rounded-full bg-white/10">
              <div
                className="bg-teal-400/80 transition-all"
                style={{ width: `${100 - adapterWidth}%` }}
              />
              <div
                className="bg-rose-400/80 transition-all"
                style={{ width: `${adapterWidth}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-3 text-[11px] text-slate-400">
        <span className="inline-flex items-center gap-2">
          <span className="size-2 rounded-full bg-teal-400" />
          قطعه زیستی
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="size-2 rounded-full bg-rose-400" />
          آداپتور خوانده‌شده
        </span>
      </div>
    </div>
  );
}

function CompositionPanel({
  title,
  subtitle,
  bars,
  note,
}: {
  title: string;
  subtitle: string;
  bars: number[];
  note: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5">
      <p className="text-xs font-bold text-teal-700">{subtitle}</p>
      <p className="mt-2 font-black text-slate-950">{title}</p>
      <div className="mt-5 flex h-36 items-end gap-2 rounded-2xl bg-slate-50 p-4">
        {bars.map((value, index) => (
          <div key={`${value}-${index}`} className="flex flex-1 items-end gap-0.5">
            <span
              className="w-1/2 rounded-t bg-teal-500/70"
              style={{ height: `${value}%` }}
            />
            <span
              className="w-1/2 rounded-t bg-slate-400/70"
              style={{ height: `${100 - value}%` }}
            />
          </div>
        ))}
      </div>
      <p className="mt-4 text-sm leading-7 text-slate-600">{note}</p>
    </div>
  );
}

function GcPanel() {
  const bars = [
    4, 8, 15, 28, 48, 72, 92, 100, 82, 58, 34, 18, 10, 6,
  ];

  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-950 p-5 text-white">
      <p className="text-xs font-bold text-teal-300">GC distribution</p>
      <p className="mt-2 font-black">به شکل توزیع نگاه کن، نه فقط یک عدد %GC</p>
      <div className="mt-5 flex h-36 items-end gap-1 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        {bars.map((value, index) => (
          <span
            key={`${value}-${index}`}
            className="flex-1 rounded-t bg-cyan-300/75"
            style={{ height: `${value}%` }}
          />
        ))}
      </div>
      <p className="mt-4 text-sm leading-7 text-slate-300">
        یک تغییر شکل غیرمنتظره، قله تیز یا زیرجمعیت جدا می‌تواند سرنخ باشد؛ اما تفسیر باید با نوع داده و سایر ماژول‌ها همراه شود.
      </p>
    </div>
  );
}

function ReasonCard({
  title,
  text,
  icon,
}: {
  title: string;
  text: string;
  icon: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
      <span className="inline-flex min-w-12 items-center justify-center rounded-xl bg-slate-950 px-2 py-2 text-[10px] font-black text-teal-300">
        {icon}
      </span>
      <p className="mt-4 font-black text-slate-950">{title}</p>
      <p className="mt-2 text-sm leading-7 text-slate-600">{text}</p>
    </div>
  );
}

function MiniQualityChart({
  values,
  label,
}: {
  values: number[];
  label: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-bold text-teal-300">پروفایل کیفیت</p>
        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-black">
          {label}
        </span>
      </div>
      <div className="mt-6 flex h-44 items-end gap-1">
        {values.map((value, index) => (
          <span
            key={`${label}-${index}`}
            className={[
              "flex-1 rounded-t transition-all",
              value >= 30
                ? "bg-teal-400/75"
                : value >= 20
                  ? "bg-amber-400/75"
                  : "bg-rose-400/75",
            ].join(" ")}
            style={{ height: `${Math.max(18, value * 4)}px` }}
          />
        ))}
      </div>
    </div>
  );
}

function ModuleRow({
  label,
  note,
  status,
}: {
  label: string;
  note: string;
  status: "pass" | "warn" | "fail";
}) {
  const badge = {
    pass: "bg-emerald-100 text-emerald-800",
    warn: "bg-amber-100 text-amber-900",
    fail: "bg-rose-100 text-rose-900",
  }[status];

  const word = {
    pass: "مناسب",
    warn: "هشدار",
    fail: "نیازمند اقدام",
  }[status];

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-black text-slate-800">{label}</p>
        <span className={`rounded-full px-2 py-1 text-[10px] font-black ${badge}`}>
          {word}
        </span>
      </div>
      <p className="mt-2 text-[11px] leading-5 text-slate-500">{note}</p>
    </div>
  );
}

function TriageButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-xl border px-3 py-2.5 text-right text-xs font-bold transition",
        active
          ? "border-teal-500 bg-teal-50 text-teal-900"
          : "border-slate-200 bg-white text-slate-600 hover:border-teal-300",
      ].join(" ")}
    >
      {children}
    </button>
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
            className={
              correct
                ? "text-sm font-bold text-emerald-900"
                : "text-sm font-bold text-amber-950"
            }
          >
            {correct
              ? "مسیر فکری درست ✓"
              : "این برداشت را دوباره بررسی کن"}
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

function TakeawayCard({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
      <span className="flex size-9 items-center justify-center rounded-xl bg-teal-700 text-sm font-black text-white">
        {number}
      </span>
      <p className="mt-4 font-black text-slate-950">{title}</p>
      <p className="mt-2 text-sm leading-7 text-slate-600">{text}</p>
    </div>
  );
}
