import { useMemo, useState, type ReactNode } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CircleHelp,
  Dna,
  Lightbulb,
  Route,
  Sparkles,
  Target,
} from "lucide-react";

import { SpecialistLessonShell } from "@/features/learning/components/SpecialistLessonShell";

const sceneTitles = [
  "از FASTQ تا مرجع",
  "ژنوم یا ترنسکریپتوم؟",
  "آزمایشگاه نگاشت خوانش‌ها",
  "هم‌ترازی یا کمی‌سازی مستقیم؟",
  "ابهام بین ایزوفرم‌ها",
  "ژن یا رونوشت؟",
  "ماموریت سرطان پانکراس",
  "ایستگاه تسلط",
];

const mappingReads = [
  {
    id: "R-A",
    sequence: "ACUGGACCUA",
    type: "unique" as const,
    label: "نگاشت یکتا",
    hint: "این خوانش فقط با یک ناحیه سازگار است.",
  },
  {
    id: "R-B",
    sequence: "GGUAC|CUUGA",
    type: "junction" as const,
    label: "محل اتصال اگزون‌ها",
    hint: "این خوانش از یک splice junction عبور می‌کند.",
  },
  {
    id: "R-C",
    sequence: "CCAUUGGCCA",
    type: "multi" as const,
    label: "چندمکانی",
    hint: "این توالی با بیش از یک ناحیه یا رونوشت سازگار است.",
  },
  {
    id: "R-D",
    sequence: "UAACCGUGAU",
    type: "unmapped" as const,
    label: "بدون نگاشت قانع‌کننده",
    hint: "در این مرجع، تطابق قابل اتکایی پیدا نمی‌شود.",
  },
];

export function RnaSeqAlignmentQuantificationLesson() {
  const [scene, setScene] = useState(0);
  const [referenceMode, setReferenceMode] = useState<"genome" | "transcriptome">("genome");
  const [selectedRead, setSelectedRead] = useState(0);
  const [workflowMode, setWorkflowMode] = useState<"genome" | "transcript">("genome");
  const [ambiguityEvidence, setAmbiguityEvidence] = useState(50);
  const [targetLevel, setTargetLevel] = useState<"gene" | "transcript">("gene");
  const [missionReference, setMissionReference] = useState<"none" | "matched" | "mismatched">("none");
  const [missionStrategy, setMissionStrategy] = useState<"none" | "genome" | "transcript">("none");
  const [answers, setAnswers] = useState<Record<string, number | null>>({});

  const currentRead = mappingReads[selectedRead];
  const transcriptShare = useMemo(() => Math.round(35 + ambiguityEvidence * 0.45), [ambiguityEvidence]);
  const otherShare = 100 - transcriptShare;

  function goToScene(nextScene: number) {
    setScene(nextScene);
    window.setTimeout(() => {
      document.getElementById("rna-seq-alignment-quantification")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 20);
  }

  function setAnswer(key: string, value: number) {
    setAnswers((current) => ({ ...current, [key]: value }));
  }

  return (
    <SpecialistLessonShell
      domainId="transcriptomics"
      trackId="bulk-rna-seq"
      lessonIndex={6}
      title="هم‌ترازی و کمی‌سازی"
      subtitle="پس از کنترل کیفیت FASTQ، باید مشخص کنیم هر خوانش با کدام بخش از مرجع سازگار است و این شواهد چگونه به برآورد مقدار بیان تبدیل می‌شوند. این درس تفاوت مرجع ژنومی و ترنسکریپتومی، نگاشت یکتا و چندمکانی، splice junction، روش‌های هم‌ترازی و روش‌های سبک کمی‌سازی را به‌صورت تعاملی باز می‌کند."
      currentScene={scene}
      sceneCount={sceneTitles.length}
      sceneLabel={sceneTitles[scene]}
    >
      <section id="rna-seq-alignment-quantification" className="scroll-mt-6">
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
              eyebrow="ورود به تحلیل محاسباتی"
              title="FASTQ فقط می‌گوید چه خوانش‌هایی دیده‌ایم؛ هنوز نمی‌دانیم هر خوانش از کجای ترنسکریپتوم آمده است."
              description="مرحله بعدی باید بین توالی خوانش و یک مرجع ارتباط برقرار کند. این ارتباط می‌تواند به شکل هم‌ترازی دقیق یا با روش‌های سبک‌تر و مبتنی بر سازگاری با رونوشت‌ها انجام شود."
            >
              <Flow
                items={[
                  "FASTQ",
                  "مرجع + حاشیه‌نویسی",
                  "ارتباط خوانش با مرجع",
                  "شواهد برای ژن/رونوشت",
                  "برآورد بیان",
                ]}
              />

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <ConceptCard
                  title="مرجع"
                  text="ژنوم یا مجموعه رونوشت‌های مرجع که خوانش‌ها با آن مقایسه می‌شوند. نسخه و کیفیت مرجع اهمیت دارد."
                  emphasized
                />
                <ConceptCard
                  title="حاشیه‌نویسی"
                  text="تعریف ژن‌ها، اگزون‌ها و رونوشت‌ها؛ پلی که مختصات مرجع را به واحد زیستی قابل تفسیر متصل می‌کند."
                />
                <ConceptCard
                  title="کمی‌سازی"
                  text="تبدیل مجموعه شواهد خوانش‌ها به برآورد فراوانی در سطح ژن یا رونوشت، با درنظرگرفتن ابهام‌های ممکن."
                />
              </div>

              <DecisionQuestion
                question="کدام جمله دقیق‌تر است؟"
                options={[
                  "فایل FASTQ خودش مشخص می‌کند هر خوانش متعلق به کدام ژن است.",
                  "برای ربط دادن خوانش‌ها به ژن یا رونوشت به مرجع، حاشیه‌نویسی و یک روش محاسباتی نیاز داریم.",
                  "بعد از QC دیگر مرجع زیستی نقشی در تحلیل ندارد.",
                ]}
                selected={answers.start ?? null}
                correctIndex={1}
                onSelect={(value) => setAnswer("start", value)}
                correctFeedback="دقیقاً. FASTQ توالی و کیفیت را نگه می‌دارد؛ هویت زیستی خوانش در مرحله بعد استنباط می‌شود."
                incorrectFeedback="FASTQ شامل توالی است، نه برچسب ژن. ارتباط زیستی باید با استفاده از مرجع و مدل تحلیل ساخته شود."
              />
            </SceneCard>
          )}

          {scene === 1 && (
            <SceneCard
              eyebrow="انتخاب فضای مرجع"
              title="ژنوم و ترنسکریپتوم دو فضای مرجع متفاوت‌اند و سؤال‌های متفاوتی را برجسته می‌کنند."
              description="در هم‌ترازی ژنومی، splice-aware alignment باید بتواند خوانشی را که از محل اتصال دو اگزون عبور کرده به دو بخش ژنومی متصل کند. در روش‌های ترنسکریپتوم‌محور، رونوشت‌های شناخته‌شده مستقیماً فضای جست‌وجو را می‌سازند."
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <ToggleCard
                  active={referenceMode === "genome"}
                  onClick={() => setReferenceMode("genome")}
                  title="مرجع ژنومی"
                  description="مختصات ژنومی، اینترون‌ها و splice junctionها در مرکز تحلیل هستند."
                />
                <ToggleCard
                  active={referenceMode === "transcriptome"}
                  onClick={() => setReferenceMode("transcriptome")}
                  title="مرجع ترنسکریپتومی"
                  description="فهرست رونوشت‌های شناخته‌شده مستقیماً فضای ممکن را تعریف می‌کند."
                />
              </div>

              <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white">
                {referenceMode === "genome" ? (
                  <GenomeReferenceVisual />
                ) : (
                  <TranscriptomeReferenceVisual />
                )}
              </div>

              <InsightBox>
                انتخاب مرجع فقط یک گزینه نرم‌افزاری نیست. نسخه ژنوم، مجموعه رونوشت‌ها و حاشیه‌نویسی می‌توانند روی اینکه چه چیزی «قابل مشاهده» و چه چیزی «قابل شمارش» است اثر بگذارند.
              </InsightBox>

              <DecisionQuestion
                question="اگر خوانشی بخشی از اگزون ۱ و بخشی از اگزون ۲ را پوشش دهد، در فضای ژنومی چه قابلیتی لازم است؟"
                options={[
                  "هم‌ترازی آگاه از splice junction.",
                  "نادیده گرفتن حاشیه‌نویسی در همه شرایط.",
                  "تبدیل خوانش به پروتئین قبل از نگاشت.",
                ]}
                selected={answers.reference ?? null}
                correctIndex={0}
                onSelect={(value) => setAnswer("reference", value)}
                correctFeedback="درست است. خوانش‌های RNA می‌توانند از مرز اگزون‌ها عبور کنند و این ویژگی باید در مدل نگاشت دیده شود."
                incorrectFeedback="RNA-seq با ساختار spliced رونوشت‌ها سروکار دارد؛ هم‌ترازکننده ژنومی باید بتواند شکاف اینترونی را مدل کند."
              />
            </SceneCard>
          )}

          {scene === 2 && (
            <SceneCard
              eyebrow="آزمایشگاه نگاشت"
              title="هر خوانش سرنوشت یکسانی ندارد: بعضی یکتا، بعضی چندمکانی، بعضی junction-spanning و بعضی بدون نگاشت قانع‌کننده‌اند."
              description="روی خوانش‌ها کلیک کنید و ببینید چرا وضعیت نگاشت برای هرکدام متفاوت است."
            >
              <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
                <div className="space-y-3">
                  {mappingReads.map((read, index) => (
                    <button
                      key={read.id}
                      type="button"
                      onClick={() => setSelectedRead(index)}
                      className={[
                        "w-full rounded-2xl border p-4 text-right transition",
                        index === selectedRead
                          ? "border-teal-500 bg-teal-50"
                          : "border-slate-200 bg-white hover:border-teal-200",
                      ].join(" ")}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-xs font-black text-teal-700">{read.id}</span>
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600">
                          {read.label}
                        </span>
                      </div>
                      <code dir="ltr" className="mt-3 block rounded-xl bg-slate-950 px-3 py-2 text-left text-xs text-emerald-300">
                        {read.sequence}
                      </code>
                    </button>
                  ))}
                </div>

                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
                  <ReadMappingVisual type={currentRead.type} />
                  <div className="mt-5 rounded-2xl bg-white p-4 shadow-sm">
                    <p className="text-xs font-black text-teal-700">نتیجه</p>
                    <p className="mt-2 text-lg font-black text-slate-950">{currentRead.label}</p>
                    <p className="mt-2 text-sm leading-7 text-slate-600">{currentRead.hint}</p>
                  </div>
                </div>
              </div>

              <DecisionQuestion
                question="چرا یک خوانش چندمکانی را نباید بدون فکر به یک ژن واحد نسبت داد؟"
                options={[
                  "چون داده از چند محل سازگار پشتیبانی می‌کند و نسبت‌دادن قطعی می‌تواند مصنوعی باشد.",
                  "چون همه خوانش‌های چندمکانی الزاماً آداپتور هستند.",
                  "چون خوانش چندمکانی هیچ اطلاعاتی ندارد و همیشه باید حذف شود.",
                ]}
                selected={answers.multimap ?? null}
                correctIndex={0}
                onSelect={(value) => setAnswer("multimap", value)}
                correctFeedback="دقیقاً. ابهام باید مدل یا گزارش شود؛ تصمیم ساده و قطعی می‌تواند سوگیری ایجاد کند."
                incorrectFeedback="چندمکانی بودن یعنی بیش از یک توضیح سازگار وجود دارد؛ روش تحلیل باید با این ابهام برخورد تعریف‌شده داشته باشد."
              />
            </SceneCard>
          )}

          {scene === 3 && (
            <SceneCard
              eyebrow="دو خانواده مسیر تحلیل"
              title="برای رسیدن از read به فراوانی، همیشه لازم نیست یک BAM ژنومی کامل بسازیم."
              description="یک مسیر رایج از هم‌ترازی ژنومی و سپس شمارش/کمی‌سازی عبور می‌کند. مسیر دیگر مستقیماً روی مجموعه رونوشت‌ها کار می‌کند و از روش‌هایی مثل pseudoalignment، quasi-mapping یا selective alignment استفاده می‌کند. جزئیات دقیق بین ابزارها متفاوت است."
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <ToggleCard
                  active={workflowMode === "genome"}
                  onClick={() => setWorkflowMode("genome")}
                  title="مسیر ژنومی"
                  description="FASTQ → هم‌ترازی splice-aware → فایل هم‌ترازی → شمارش/کمی‌سازی"
                />
                <ToggleCard
                  active={workflowMode === "transcript"}
                  onClick={() => setWorkflowMode("transcript")}
                  title="مسیر ترنسکریپتوم‌محور"
                  description="FASTQ → سنجش سازگاری با رونوشت‌ها → برآورد فراوانی"
                />
              </div>

              <div className="mt-6">
                {workflowMode === "genome" ? (
                  <WorkflowPanel
                    title="وقتی مختصات ژنومی مهم‌اند"
                    steps={["FASTQ", "ژنوم + حاشیه‌نویسی", "هم‌ترازی splice-aware", "BAM/شواهد", "شمارش یا کمی‌سازی"]}
                    notes={[
                      "برای مشاهده محل دقیق نگاشت و رخدادهای splice مفید است.",
                      "خروجی می‌تواند برای تحلیل‌های فراتر از بیان ژن نیز کاربرد داشته باشد.",
                      "هزینه محاسباتی و ذخیره‌سازی معمولاً بیشتر از مسیرهای سبک‌تر است.",
                    ]}
                  />
                ) : (
                  <WorkflowPanel
                    title="وقتی هدف اصلی برآورد فراوانی رونوشت‌هاست"
                    steps={["FASTQ", "رونوشت‌های مرجع", "سازگاری/نگاشت سبک", "مدل ابهام", "فراوانی رونوشت"]}
                    notes={[
                      "لازم نیست همیشه هم‌ترازی سنتی base-by-base تولید شود.",
                      "روش‌های مختلف سبک یکسان نیستند و الگوریتم‌های متفاوتی دارند.",
                      "کیفیت مجموعه رونوشت‌های مرجع و مدل ابهام اهمیت زیادی دارد.",
                    ]}
                  />
                )}
              </div>

              <DecisionQuestion
                question="کدام برداشت صحیح‌تر است؟"
                options={[
                  "pseudoalignment و selective alignment دقیقاً یک الگوریتم واحد هستند.",
                  "روش‌های ترنسکریپتوم‌محور خانواده‌ای از رویکردها هستند و جزئیات الگوریتم بین ابزارها متفاوت است.",
                  "برای کمی‌سازی RNA-seq همیشه باید BAM ژنومی کامل تولید شود.",
                ]}
                selected={answers.workflow ?? null}
                correctIndex={1}
                onSelect={(value) => setAnswer("workflow", value)}
                correctFeedback="دقیقاً. هدف این درس حفظ کردن نام ابزار نیست؛ باید بفهمیم هر روش چه نوع رابطه‌ای بین read و مرجع می‌سازد."
                incorrectFeedback="روش‌های سبک ترنسکریپتومی یک خانواده‌اند، نه یک الگوریتم واحد؛ و در بسیاری از پروژه‌ها می‌توان بدون BAM ژنومی کامل به کمی‌سازی رسید."
              />
            </SceneCard>
          )}

          {scene === 4 && (
            <SceneCard
              eyebrow="مسئله ابهام"
              title="اگر دو ایزوفرم بخش زیادی از توالی را مشترک داشته باشند، بعضی خوانش‌ها به‌تنهایی نمی‌گویند از کدام ایزوفرم آمده‌اند."
              description="مدل‌های کمی‌سازی از شواهد یکتا و شواهد مبهم با هم استفاده می‌کنند. این نمایش یک شبیه‌سازی آموزشی است، نه فرمول یک ابزار خاص."
            >
              <IsoformAmbiguityVisual evidence={ambiguityEvidence} />

              <label className="mt-6 block rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-black text-slate-950">قدرت شواهد یکتا برای ایزوفرم A</span>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-teal-700 shadow-sm">
                    {new Intl.NumberFormat("fa-IR").format(ambiguityEvidence)}٪
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={ambiguityEvidence}
                  onChange={(event) => setAmbiguityEvidence(Number(event.target.value))}
                  className="mt-4 w-full"
                />
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <MiniCard title="برآورد آموزشی ایزوفرم A" text={`${new Intl.NumberFormat("fa-IR").format(transcriptShare)}٪ از شواهد مبهم`} />
                  <MiniCard title="برآورد آموزشی ایزوفرم B" text={`${new Intl.NumberFormat("fa-IR").format(otherShare)}٪ از شواهد مبهم`} />
                </div>
              </label>

              <InsightBox>
                این اسلایدر فقط ایده را نشان می‌دهد: وقتی read به چند رونوشت سازگار است، مدل می‌تواند از شواهد دیگر برای تخصیص احتمالی استفاده کند. روش واقعی به مدل آماری و پیاده‌سازی ابزار بستگی دارد.
              </InsightBox>

              <DecisionQuestion
                question="یک read مشترک بین دو ایزوفرم چه چیزی را به‌تنهایی ثابت می‌کند؟"
                options={[
                  "قطعاً از ایزوفرم A آمده است.",
                  "قطعاً از ایزوفرم B آمده است.",
                  "با هر دو ایزوفرم سازگار است و برای تخصیص دقیق‌تر به شواهد یا مدل بیشتری نیاز داریم.",
                ]}
                selected={answers.ambiguity ?? null}
                correctIndex={2}
                onSelect={(value) => setAnswer("ambiguity", value)}
                correctFeedback="درست است. ابهام ساختاری یکی از دلایل اصلی نیاز به مدل‌های کمی‌سازی رونوشت است."
                incorrectFeedback="اگر دو رونوشت بخش مشترک داشته باشند، یک read از آن بخش لزوماً هویت ایزوفرم را مشخص نمی‌کند."
              />
            </SceneCard>
          )}

          {scene === 5 && (
            <SceneCard
              eyebrow="سطح کمی‌سازی"
              title="یک سؤال مهم قبل از تحلیل آماری: می‌خواهیم فراوانی را در سطح ژن بدانیم یا رونوشت؟"
              description="سطح ژن بسیاری از ابهام‌های ایزوفرمی را تجمیع می‌کند. سطح رونوشت اطلاعات دقیق‌تری می‌دهد اما معمولاً ابهام و حساسیت بیشتری به annotation و مدل کمی‌سازی دارد."
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <ToggleCard
                  active={targetLevel === "gene"}
                  onClick={() => setTargetLevel("gene")}
                  title="سطح ژن"
                  description="شواهد چند رونوشت یک ژن در یک واحد تجمیع می‌شوند."
                />
                <ToggleCard
                  active={targetLevel === "transcript"}
                  onClick={() => setTargetLevel("transcript")}
                  title="سطح رونوشت"
                  description="ایزوفرم‌ها جداگانه برآورد می‌شوند و ابهام بین آن‌ها اهمیت بیشتری دارد."
                />
              </div>

              <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <QuantificationLevelVisual level={targetLevel} />
              </div>

              <DecisionQuestion
                question="اگر سؤال پژوهشی درباره استفاده متفاوت از ایزوفرم‌ها باشد، کدام سطح اطلاعاتی مستقیم‌تر است؟"
                options={[
                  "فقط سطح ژن، چون همه ایزوفرم‌ها باید یکی شوند.",
                  "سطح رونوشت یا تحلیلی که ساختار/استفاده ایزوفرم را حفظ کند.",
                  "FASTQ بدون هیچ مرجع و کمی‌سازی.",
                ]}
                selected={answers.level ?? null}
                correctIndex={1}
                onSelect={(value) => setAnswer("level", value)}
                correctFeedback="دقیقاً. سطح خروجی باید با سؤال زیستی هماهنگ باشد."
                incorrectFeedback="تجمیع در سطح ژن می‌تواند تفاوت‌های میان ایزوفرم‌ها را پنهان کند."
              />

              <InsightBox>
                در درس بعدی می‌بینیم این برآوردها چگونه به یک ساختار ژن × نمونه یا خروجی مناسب برای تحلیل‌های بعدی تبدیل می‌شوند؛ یعنی پل واقعی بین پردازش read و تحلیل آماری.
              </InsightBox>
            </SceneCard>
          )}

          {scene === 6 && (
            <SceneCard
              eyebrow="ماموریت پروژه"
              title="برای مطالعه RNA-seq توده‌ای سرطان پانکراس، یک مسیر محاسباتی قابل دفاع طراحی کنید."
              description="فرض کنید می‌خواهیم بیان ژن را بین نمونه‌های توموری و کنترل مقایسه کنیم و در کنار آن امکان بررسی بعضی رخدادهای splice را هم حفظ کنیم."
            >
              <div className="grid gap-4 lg:grid-cols-2">
                <MissionPanel title="۱. انتخاب مرجع">
                  <MissionChoice
                    active={missionReference === "matched"}
                    onClick={() => setMissionReference("matched")}
                    title="نسخه مشخص ژنوم + حاشیه‌نویسی سازگار"
                    text="نسخه مرجع و annotation با هم هماهنگ و در فراداده پروژه ثبت می‌شوند."
                  />
                  <MissionChoice
                    active={missionReference === "mismatched"}
                    onClick={() => setMissionReference("mismatched")}
                    title="ژنوم و annotation از نسخه‌های ناسازگار"
                    text="مختصات و شناسه‌ها ممکن است ناسازگار شوند."
                  />
                </MissionPanel>

                <MissionPanel title="۲. انتخاب مسیر">
                  <MissionChoice
                    active={missionStrategy === "genome"}
                    onClick={() => setMissionStrategy("genome")}
                    title="هم‌ترازی ژنومی splice-aware"
                    text="برای نگه‌داشتن مختصات ژنومی و بررسی شواهد splice انتخاب مناسبی است."
                  />
                  <MissionChoice
                    active={missionStrategy === "transcript"}
                    onClick={() => setMissionStrategy("transcript")}
                    title="کمی‌سازی ترنسکریپتوم‌محور"
                    text="برای تمرکز مستقیم بر فراوانی رونوشت‌ها مسیر کارآمدی است."
                  />
                </MissionPanel>
              </div>

              <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white">
                <div className="flex items-center gap-3">
                  <Target className="size-5 text-teal-300" />
                  <p className="font-black">ارزیابی تصمیم</p>
                </div>
                {missionReference === "none" || missionStrategy === "none" ? (
                  <p className="mt-3 text-sm leading-7 text-slate-300">هر دو تصمیم را انتخاب کنید تا مسیر شما ارزیابی شود.</p>
                ) : missionReference === "matched" ? (
                  <p className="mt-3 text-sm leading-8 text-slate-200">
                    مرجع شما سازگار است. {missionStrategy === "genome"
                      ? "با توجه به اینکه می‌خواهیم شواهد splice و مختصات ژنومی را هم حفظ کنیم، مسیر ژنومی انتخاب بسیار قابل دفاعی است."
                      : "این مسیر برای کمی‌سازی رونوشت‌ها مناسب است، اما اگر تحلیل splice در مختصات ژنومی هدف مهمی باشد باید مطمئن شویم خروجی انتخاب‌شده آن نیاز را پوشش می‌دهد."}
                  </p>
                ) : (
                  <p className="mt-3 text-sm leading-8 text-amber-200">
                    قبل از انتخاب ابزار، ناسازگاری نسخه ژنوم و annotation را اصلاح کنید. بهترین الگوریتم هم نمی‌تواند مختصات ناسازگار را به مرجع درست تبدیل کند.
                  </p>
                )}
              </div>

              <DecisionQuestion
                question="در این سناریو، کدام تصمیم از نام ابزار مهم‌تر است؟"
                options={[
                  "ثبت نسخه مرجع، حاشیه‌نویسی و منطق انتخاب مسیر تحلیل.",
                  "فقط انتخاب معروف‌ترین ابزار، بدون توجه به مرجع و سؤال.",
                  "حذف همه خوانش‌های چندمکانی بدون بررسی."
                ]}
                selected={answers.mission ?? null}
                correctIndex={0}
                onSelect={(value) => setAnswer("mission", value)}
                correctFeedback="دقیقاً. بازتولیدپذیری از ثبت تصمیم‌ها، نسخه‌ها و منطق تحلیل شروع می‌شود."
                incorrectFeedback="ابزار مهم است، اما بدون مرجع درست و سؤال روشن نمی‌توان مسیر تحلیل را قابل دفاع دانست."
              />
            </SceneCard>
          )}

          {scene === 7 && (
            <SceneCard
              eyebrow="ایستگاه تسلط"
              title="اگر این درس را فهمیده باشید، دیگر «mapping rate بالا» را به‌تنهایی معادل تحلیل خوب نمی‌دانید."
              description="یک تحلیل خوب باید بداند read به چه مرجعی، با چه منطق نگاشتی، در چه سطحی و با چه برخوردی با ابهام کمی‌سازی شده است."
            >
              <div className="grid gap-4 md:grid-cols-2">
                <MasteryCard
                  icon={<Dna className="size-5" />}
                  title="مرجع و annotation"
                  text="نسخه مرجع بخشی از تحلیل است، نه یک جزئیات فراموش‌شدنی."
                />
                <MasteryCard
                  icon={<Route className="size-5" />}
                  title="نوع رابطه read با مرجع"
                  text="هم‌ترازی سنتی، سازگاری ترنسکریپتومی و selective alignment مفاهیم یکسانی نیستند."
                />
                <MasteryCard
                  icon={<CircleHelp className="size-5" />}
                  title="ابهام"
                  text="read چندمکانی یا مشترک میان ایزوفرم‌ها باید با یک سیاست یا مدل مشخص مدیریت شود."
                />
                <MasteryCard
                  icon={<Target className="size-5" />}
                  title="سطح خروجی"
                  text="ژن و رونوشت دو سطح متفاوت کمی‌سازی‌اند و باید از سؤال پژوهشی انتخاب شوند."
                />
              </div>

              <DecisionQuestion
                question="کدام جمله بهترین جمع‌بندی این درس است؟"
                options={[
                  "هدف هم‌ترازی فقط تولید یک فایل بزرگ BAM است.",
                  "هم‌ترازی و کمی‌سازی فرایند ساختن رابطه‌ای قابل دفاع بین خوانش‌ها، مرجع و واحد زیستی موردنظر هستند.",
                  "هر read باید بدون ابهام به دقیقاً یک ژن تعلق داشته باشد."
                ]}
                selected={answers.mastery ?? null}
                correctIndex={1}
                onSelect={(value) => setAnswer("mastery", value)}
                correctFeedback="عالی. حالا آماده‌اید ببینید این شواهد چگونه به ماتریس ژن × نمونه تبدیل می‌شوند."
                incorrectFeedback="به سه محور برگردید: مرجع، نوع نگاشت و سطح کمی‌سازی."
              />

              <div className="mt-7 rounded-3xl bg-slate-950 p-6 text-white">
                <p className="text-xs font-bold text-teal-300">مسیر بعدی</p>
                <p className="mt-3 text-lg font-black leading-9">
                  خوانش‌ها ← شواهد نگاشت ← کمی‌سازی ← ماتریس ژن × نمونه
                </p>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  درس ۷ دقیقاً همین تبدیل را باز می‌کند: چگونه میلیون‌ها read به جدولی می‌رسند که برای تحلیل آماری قابل استفاده است.
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

function SceneCard({ eyebrow, title, description, children }: { eyebrow: string; title: string; description: string; children: ReactNode }) {
  return (
    <article className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-lg shadow-slate-200/60">
      <div className="border-b border-slate-200 bg-gradient-to-l from-teal-50 via-white to-white p-6 sm:p-8">
        <p className="text-xs font-bold text-teal-700">{eyebrow}</p>
        <h2 className="mt-2 text-2xl font-black leading-10 text-slate-950 sm:text-3xl">{title}</h2>
        <p className="mt-3 max-w-4xl text-sm leading-8 text-slate-600">{description}</p>
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
            <span className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">{item}</span>
            {index < items.length - 1 && <span className="text-teal-300">←</span>}
          </div>
        ))}
      </div>
    </div>
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

function ToggleCard({ active, onClick, title, description }: { active: boolean; onClick: () => void; title: string; description: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-3xl border p-5 text-right transition",
        active ? "border-teal-500 bg-teal-50 shadow-sm" : "border-slate-200 bg-white hover:border-teal-200",
      ].join(" ")}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="font-black text-slate-950">{title}</p>
        {active && <CheckCircle2 className="size-5 text-teal-600" />}
      </div>
      <p className="mt-2 text-sm leading-7 text-slate-600">{description}</p>
    </button>
  );
}

function GenomeReferenceVisual() {
  return (
    <div>
      <p className="text-xs font-black text-teal-300">نمایش مفهومی ژنوم</p>
      <div className="mt-5 flex items-center gap-2 overflow-x-auto pb-2">
        <span className="h-12 min-w-24 rounded-xl bg-teal-400/20 px-4 py-3 text-center text-xs font-black text-teal-100">اگزون ۱</span>
        <span className="min-w-28 border-t-2 border-dashed border-slate-500" />
        <span className="h-12 min-w-24 rounded-xl bg-teal-400/20 px-4 py-3 text-center text-xs font-black text-teal-100">اگزون ۲</span>
        <span className="min-w-24 border-t-2 border-dashed border-slate-500" />
        <span className="h-12 min-w-24 rounded-xl bg-teal-400/20 px-4 py-3 text-center text-xs font-black text-teal-100">اگزون ۳</span>
      </div>
      <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
        <p className="text-sm leading-7 text-slate-200">خوانش RNA ممکن است اگزون ۱ و ۲ را مستقیم به هم متصل کند، در حالی که روی ژنوم بین آن‌ها اینترون وجود دارد.</p>
      </div>
    </div>
  );
}

function TranscriptomeReferenceVisual() {
  return (
    <div>
      <p className="text-xs font-black text-teal-300">نمایش مفهومی ترنسکریپتوم</p>
      <div className="mt-5 space-y-4">
        <TranscriptRow label="رونوشت A" blocks={["۱", "۲", "۳"]} />
        <TranscriptRow label="رونوشت B" blocks={["۱", "۳"]} />
        <TranscriptRow label="رونوشت C" blocks={["۲", "۳"]} />
      </div>
      <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
        <p className="text-sm leading-7 text-slate-200">در این فضا، رونوشت‌های از پیش تعریف‌شده خودِ گزینه‌های ممکن برای منشأ read هستند.</p>
      </div>
    </div>
  );
}

function TranscriptRow({ label, blocks }: { label: string; blocks: string[] }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-20 shrink-0 text-xs font-black text-slate-300">{label}</span>
      <div className="flex flex-1 gap-1">
        {blocks.map((block) => (
          <span key={`${label}-${block}`} className="flex h-9 min-w-14 items-center justify-center rounded-lg bg-white/10 px-3 text-xs font-black text-white">اگزون {block}</span>
        ))}
      </div>
    </div>
  );
}

function ReadMappingVisual({ type }: { type: "unique" | "junction" | "multi" | "unmapped" }) {
  return (
    <div>
      <p className="text-xs font-black text-teal-700">نقشه ساده ژن</p>
      <div className="relative mt-6 h-40 rounded-2xl bg-white p-5 shadow-inner">
        <div className="absolute left-8 right-8 top-20 border-t-2 border-slate-300" />
        <div className="absolute left-[8%] top-[58px] h-12 w-[19%] rounded-xl bg-teal-100" />
        <div className="absolute left-[40%] top-[58px] h-12 w-[18%] rounded-xl bg-teal-100" />
        <div className="absolute left-[73%] top-[58px] h-12 w-[18%] rounded-xl bg-teal-100" />

        {type === "unique" && <ReadBar className="left-[42%] top-7 w-[14%]" label="read" />}
        {type === "junction" && (
          <>
            <ReadBar className="left-[20%] top-7 w-[11%]" label="read" />
            <div className="absolute left-[30%] top-[40px] w-[13%] border-t-2 border-dashed border-teal-500" />
            <ReadBar className="left-[43%] top-7 w-[10%]" label="" />
          </>
        )}
        {type === "multi" && (
          <>
            <ReadBar className="left-[10%] top-7 w-[14%]" label="read?" muted />
            <ReadBar className="left-[74%] top-7 w-[14%]" label="read?" muted />
          </>
        )}
        {type === "unmapped" && <ReadBar className="left-[41%] top-4 w-[18%]" label="بدون تطابق" warning />}
      </div>
    </div>
  );
}

function ReadBar({ className, label, muted = false, warning = false }: { className: string; label: string; muted?: boolean; warning?: boolean }) {
  return (
    <div className={["absolute flex h-7 items-center justify-center rounded-lg px-2 text-[10px] font-black", className, warning ? "bg-amber-200 text-amber-950" : muted ? "bg-slate-200 text-slate-600" : "bg-teal-600 text-white"].join(" ")}>
      {label}
    </div>
  );
}

function WorkflowPanel({ title, steps, notes }: { title: string; steps: string[]; notes: string[] }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
      <p className="font-black text-slate-950">{title}</p>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {steps.map((step, index) => (
          <div key={step} className="flex items-center gap-2">
            <span className="rounded-xl bg-white px-3 py-2 text-xs font-black text-slate-800 shadow-sm">{step}</span>
            {index < steps.length - 1 && <span className="text-teal-600">←</span>}
          </div>
        ))}
      </div>
      <ul className="mt-5 space-y-2">
        {notes.map((note) => (
          <li key={note} className="flex items-start gap-2 text-sm leading-7 text-slate-600">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />
            {note}
          </li>
        ))}
      </ul>
    </div>
  );
}

function IsoformAmbiguityVisual({ evidence }: { evidence: number }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white">
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <p className="text-xs font-black text-teal-300">ایزوفرم A</p>
          <div className="mt-3 flex gap-1">
            <IsoBlock label="۱" />
            <IsoBlock label="۲" emphasized />
            <IsoBlock label="۳" />
          </div>
        </div>
        <div>
          <p className="text-xs font-black text-teal-300">ایزوفرم B</p>
          <div className="mt-3 flex gap-1">
            <IsoBlock label="۱" />
            <IsoBlock label="۳" />
          </div>
        </div>
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <MiniDarkCard title="read مشترک" text="با A و B سازگار" />
        <MiniDarkCard title="read یکتای A" text={`${new Intl.NumberFormat("fa-IR").format(evidence)} واحد شواهد`} />
        <MiniDarkCard title="مدل کمی‌سازی" text="شواهد را با ابهام ترکیب می‌کند" />
      </div>
    </div>
  );
}

function IsoBlock({ label, emphasized = false }: { label: string; emphasized?: boolean }) {
  return <span className={["flex h-10 min-w-16 items-center justify-center rounded-lg px-3 text-xs font-black", emphasized ? "bg-teal-400 text-slate-950" : "bg-white/10 text-white"].join(" ")}>اگزون {label}</span>;
}

function MiniDarkCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="text-xs font-black text-teal-300">{title}</p>
      <p className="mt-2 text-sm leading-7 text-slate-200">{text}</p>
    </div>
  );
}

function QuantificationLevelVisual({ level }: { level: "gene" | "transcript" }) {
  if (level === "gene") {
    return (
      <div>
        <p className="text-xs font-black text-teal-700">تجمیع در سطح ژن</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <MiniCard title="رونوشت A" text="شواهد ۴۲" />
          <MiniCard title="رونوشت B" text="شواهد ۲۸" />
          <MiniCard title="ژن X" text="خروجی تجمیع‌شده: ۷۰" />
        </div>
      </div>
    );
  }
  return (
    <div>
      <p className="text-xs font-black text-teal-700">حفظ تفکیک رونوشت‌ها</p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <MiniCard title="رونوشت A" text="برآورد مستقل با درنظرگرفتن readهای یکتا و مبهم" />
        <MiniCard title="رونوشت B" text="برآورد مستقل با عدم‌قطعیت بیشتر در بخش‌های مشترک" />
      </div>
    </div>
  );
}

function MiniCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-bold text-teal-700">{title}</p>
      <p className="mt-2 text-sm font-semibold leading-7 text-slate-800">{text}</p>
    </div>
  );
}

function MissionPanel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
      <p className="font-black text-slate-950">{title}</p>
      <div className="mt-4 space-y-3">{children}</div>
    </div>
  );
}

function MissionChoice({ active, onClick, title, text }: { active: boolean; onClick: () => void; title: string; text: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={["w-full rounded-2xl border p-4 text-right transition", active ? "border-teal-500 bg-white shadow-sm" : "border-slate-200 bg-white/70 hover:border-teal-200"].join(" ")}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-black text-slate-950">{title}</p>
        {active && <CheckCircle2 className="size-4 text-teal-600" />}
      </div>
      <p className="mt-2 text-xs leading-6 text-slate-600">{text}</p>
    </button>
  );
}

function MasteryCard({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-teal-300">{icon}</div>
      <p className="mt-4 font-black text-slate-950">{title}</p>
      <p className="mt-2 text-sm leading-7 text-slate-600">{text}</p>
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
        <div className={["mt-4 rounded-2xl border p-4", correct ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"].join(" ")}>
          <p className={correct ? "text-sm font-bold text-emerald-900" : "text-sm font-bold text-amber-950"}>
            {correct ? "مسیر فکری درست ✓" : "این برداشت را دوباره بررسی کنید"}
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
