import { useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, Lightbulb, Microscope } from "lucide-react";

import { SpecialistLessonShell } from "@/features/learning/components/SpecialistLessonShell";

const sceneTitles = [
  "نمونه قبل از داده",
  "نمونه دقیقاً چیست؟",
  "جمع‌آوری و نگهداری",
  "استخراج RNA",
  "کمیت، خلوص و یکپارچگی",
  "پروژه سرطان پانکراس",
  "ایستگاه تسلط",
];

export function RnaSeqSampleToRnaLesson() {
  const [scene, setScene] = useState(0);
  const [sampleAnswer, setSampleAnswer] = useState<number | null>(null);
  const [compositionAnswer, setCompositionAnswer] = useState<number | null>(null);
  const [preservationAnswer, setPreservationAnswer] = useState<number | null>(null);
  const [extractionAnswer, setExtractionAnswer] = useState<number | null>(null);
  const [qualityAnswer, setQualityAnswer] = useState<number | null>(null);
  const [caseAnswer, setCaseAnswer] = useState<number | null>(null);
  const [masteryAnswer, setMasteryAnswer] = useState<number | null>(null);

  function goToScene(nextScene: number) {
    setScene(nextScene);

    window.setTimeout(() => {
      document.getElementById("rna-seq-sample-to-rna")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 20);
  }

  return (
    <SpecialistLessonShell
      domainId="transcriptomics"
      trackId="bulk-rna-seq"
      lessonIndex={2}
      title="از نمونه زیستی تا RNA"
      subtitle="قبل از ساخت کتابخانه باید بدانیم RNA از چه نمونه‌ای آمده، نمونه چگونه جمع‌آوری و نگهداری شده و کیفیت ماده اولیه با چه ابعادی سنجیده می‌شود."
      currentScene={scene}
      sceneCount={sceneTitles.length}
      sceneLabel={sceneTitles[scene]}
    >
      <section id="rna-seq-sample-to-rna" className="scroll-mt-6">
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
              eyebrow="قبل از کتابخانه"
              title="کیفیت RNA-seq از جایی شروع می‌شود که هنوز هیچ FASTQای وجود ندارد."
              description="نمونه زیستی، زمان و شرایط نگهداری و روش استخراج می‌توانند روی RNAای اثر بگذارند که بعداً وارد ساخت کتابخانه می‌شود."
            >
              <Flow
                items={[
                  "نمونه زیستی",
                  "جمع‌آوری و پایدارسازی",
                  "استخراج RNA",
                  "کنترل کیفیت RNA",
                  "آماده‌سازی کتابخانه",
                ]}
              />

              <DecisionQuestion
                question="اگر RNA پیش از ساخت کتابخانه به‌شدت تخریب شده باشد، آیا تحلیل محاسباتی می‌تواند همیشه آن را به وضعیت اولیه برگرداند؟"
                options={[
                  "بله، چون نرم‌افزار می‌تواند مولکول‌های از دست‌رفته را بازسازی کند.",
                  "خیر، بخشی از اطلاعات ممکن است پیش از توالی‌یابی از دست رفته یا دچار سوگیری شده باشد.",
                  "فقط اگر تعداد خوانش‌ها زیاد باشد، کیفیت RNA دیگر مهم نیست.",
                ]}
                selected={sampleAnswer}
                correctIndex={1}
                onSelect={setSampleAnswer}
                correctFeedback="دقیقاً. تحلیل می‌تواند کیفیت داده را ارزیابی و برخی اثرها را مدل کند، اما اطلاعاتی را که پیش از اندازه‌گیری از دست رفته‌اند به‌طور جادویی بازنمی‌گرداند."
                incorrectFeedback="تعداد خوانش بیشتر جایگزین ماده اولیه مناسب نیست. کیفیت و تاریخچه نمونه بخشی از خود آزمایش‌اند."
              />

              <InsightBox>
                زنجیره RNA-seq از <strong>نمونه زیستی</strong> شروع می‌شود، نه از فایل خام.
              </InsightBox>
            </SceneCard>
          )}

          {scene === 1 && (
            <SceneCard
              eyebrow="هویت نمونه"
              title="در RNA-seq توده‌ای، آنچه اندازه می‌گیریم حاصل ترکیب همه سلول‌های موجود در نمونه است."
              description="بافت یک ظرف خنثی نیست. نسبت سلول‌های توموری، استروما، سلول‌های ایمنی، نکروز و سایر اجزا می‌تواند روی الگوی RNA مشاهده‌شده اثر بگذارد."
            >
              <div className="grid gap-4 md:grid-cols-3">
                <ConceptCard
                  title="منبع زیستی"
                  text="بافت، کشت سلولی، خون، نمونه منجمد یا نمونه آرشیوی هرکدام تاریخچه و محدودیت‌های متفاوتی دارند."
                  emphasized
                />
                <ConceptCard
                  title="ترکیب سلولی"
                  text="در داده توده‌ای، تغییر نسبت انواع سلول‌ها می‌تواند به‌صورت تغییر بیان ژن دیده شود."
                />
                <ConceptCard
                  title="واحد نمونه‌گیری"
                  text="بخشی که برای استخراج RNA برداشته می‌شود باید با سؤال پژوهشی و طراحی مطالعه سازگار باشد."
                />
              </div>

              <DecisionQuestion
                question="دو نمونه تومور پانکراس داریم. در نمونه دوم مقدار استروما بیشتر است. کدام برداشت دقیق‌تر است؟"
                options={[
                  "هر تفاوت بیان حتماً ناشی از تغییر داخل سلول توموری است.",
                  "بخشی از تفاوت مشاهده‌شده می‌تواند از تفاوت ترکیب سلولی دو نمونه ناشی شود.",
                  "ترکیب بافت در RNA-seq توده‌ای هیچ اثری ندارد.",
                ]}
                selected={compositionAnswer}
                correctIndex={1}
                onSelect={setCompositionAnswer}
                correctFeedback="درست است. در RNA-seq توده‌ای، ترکیب سلولی بخشی از سیگنال مشاهده‌شده است."
                incorrectFeedback="وقتی RNA همه سلول‌ها با هم اندازه‌گیری می‌شود، تغییر ترکیب سلولی می‌تواند الگوی بیان کل نمونه را تغییر دهد."
              />

              <InsightBox>
                «نمونه تومور» یک برچسب کلی است؛ برای تفسیر بهتر باید تا حد ممکن بدانیم <strong>داخل آن نمونه چه بوده است</strong>.
              </InsightBox>
            </SceneCard>
          )}

          {scene === 2 && (
            <SceneCard
              eyebrow="قبل از استخراج"
              title="فاصله بین نمونه‌گیری و پایدارشدن RNA می‌تواند بخشی از آزمایش باشد."
              description="RNA در برابر فعالیت RNase و شرایط نامناسب حساس است. زمان تا پایدارسازی، دما، روش نگهداری و چرخه‌های انجماد و ذوب باید تا حد امکان کنترل و ثبت شوند."
            >
              <div className="grid gap-4 md:grid-cols-2">
                <StepCard
                  number="۱"
                  title="نمونه‌گیری"
                  text="نمونه از بیمار، بافت یا کشت سلولی گرفته می‌شود. همین لحظه می‌تواند آغاز تغییرات پس از برداشت باشد."
                />
                <StepCard
                  number="۲"
                  title="پایدارسازی یا انجماد"
                  text="هدف این است که وضعیت RNA تا حد امکان حفظ شود و تفاوت‌های فنی میان گروه‌ها به حداقل برسد."
                />
                <StepCard
                  number="۳"
                  title="نگهداری و انتقال"
                  text="شرایط نگهداری باید با پروتکل سازگار و میان نمونه‌ها تا حد امکان یکنواخت باشد."
                />
                <StepCard
                  number="۴"
                  title="ثبت فراداده پیش‌تحلیلی"
                  text="زمان، شرایط نگهداری، مرکز، دسته نمونه‌گیری یا اطلاعات مشابه بعدها برای تفسیر کیفیت بسیار ارزشمندند."
                />
              </div>

              <DecisionQuestion
                question="اگر تمام نمونه‌های کنترل سریع منجمد شوند اما تمام نمونه‌های بیمار چند ساعت دیرتر پردازش شوند، مهم‌ترین نگرانی چیست؟"
                options={[
                  "تفاوت زیستی و تفاوت پیش‌تحلیلی ممکن است با هم مخلوط شوند.",
                  "هیچ نگرانی وجود ندارد؛ چون بعداً همه نمونه‌ها توالی‌یابی می‌شوند.",
                  "فقط نام فایل‌ها باید عوض شود.",
                ]}
                selected={preservationAnswer}
                correctIndex={0}
                onSelect={setPreservationAnswer}
                correctFeedback="دقیقاً. وقتی شرایط نگهداری با گروه زیستی هم‌جهت شود، جداکردن اثرها دشوار می‌شود."
                incorrectFeedback="توالی‌یابی، تفاوت ایجادشده در مرحله نمونه‌گیری و نگهداری را حذف نمی‌کند."
              />
            </SceneCard>
          )}

          {scene === 3 && (
            <SceneCard
              eyebrow="استخراج RNA"
              title="استخراج فقط «بیرون آوردن RNA» نیست؛ روش استخراج می‌تواند روی آنچه بازیابی می‌شود اثر بگذارد."
              description="هدف، به‌دست آوردن RNA کافی و مناسب برای کاربرد بعدی با حداقل آلودگی و با روش یکنواخت میان نمونه‌های قابل مقایسه است."
            >
              <div className="rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white">
                <div className="flex items-center gap-3">
                  <span className="flex size-11 items-center justify-center rounded-2xl bg-white/10 text-teal-300">
                    <Microscope className="size-5" />
                  </span>
                  <div>
                    <p className="text-xs font-bold text-teal-300">منطق مرحله</p>
                    <p className="mt-1 font-black">نمونه پیچیده ← جداسازی RNA ← RNA قابل ارزیابی</p>
                  </div>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  <DarkMetric title="بازده" text="چه مقدار RNA بازیابی شده است؟" />
                  <DarkMetric title="آلودگی" text="آیا DNA، نمک، فنول یا مواد دیگر باقی مانده‌اند؟" />
                  <DarkMetric title="نمایش RNA" text="آیا روش برای نوع RNA و کاربرد موردنظر مناسب است؟" />
                </div>
              </div>

              <DecisionQuestion
                question="برای مقایسه دو گروه، کدام طراحی فنی دفاع‌پذیرتر است؟"
                options={[
                  "گروه کنترل با یک روش استخراج و گروه بیمار با روشی کاملاً متفاوت پردازش شود.",
                  "تا حد امکان یک پروتکل استخراج سازگار و یکنواخت میان گروه‌ها استفاده شود و دسته استخراج ثبت شود.",
                  "روش استخراج اهمیتی ندارد چون همه RNAها در نهایت RNA هستند.",
                ]}
                selected={extractionAnswer}
                correctIndex={1}
                onSelect={setExtractionAnswer}
                correctFeedback="درست است. استانداردکردن روش و ثبت دسته استخراج کمک می‌کند اثر فنی کمتر با زیست‌شناسی مخلوط شود."
                incorrectFeedback="روش استخراج می‌تواند بازده، آلودگی و حتی نمایندگی برخی گونه‌های RNA را تغییر دهد."
              />
            </SceneCard>
          )}

          {scene === 4 && (
            <SceneCard
              eyebrow="کنترل کیفیت RNA"
              title="«RNA خوب» یک عدد واحد ندارد: کمیت، خلوص و یکپارچگی سه سؤال متفاوت‌اند."
              description="این معیارها مکمل هم‌اند و تفسیرشان به نوع نمونه، روش ساخت کتابخانه و هدف مطالعه وابسته است."
            >
              <div className="grid gap-4 md:grid-cols-3">
                <MetricCard
                  title="کمیت"
                  question="چقدر RNA داریم؟"
                  explanation="برای دانستن اینکه ماده اولیه کافی برای پروتکل بعدی وجود دارد یا نه."
                />
                <MetricCard
                  title="خلوص"
                  question="چه مواد دیگری همراه RNA هستند؟"
                  explanation="نسبت‌های جذب می‌توانند سرنخ بدهند، اما به‌تنهایی کیفیت کامل RNA را ثابت نمی‌کنند."
                />
                <MetricCard
                  title="یکپارچگی"
                  question="RNA تا چه حد تخریب شده است؟"
                  explanation="الگوی اندازه قطعات و شاخص‌هایی مانند RIN می‌توانند کمک کنند، اما هیچ آستانه جهانی برای همه نمونه‌ها و پروتکل‌ها وجود ندارد."
                  emphasized
                />
              </div>

              <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5 text-sm leading-8 text-amber-950">
                <strong>نکته مهم:</strong> برای نمونه‌های آرشیوی یا RNA تخریب‌شده، شاخص‌های دیگری مانند DV200 نیز ممکن است مفید باشند. معیار مناسب باید با نوع نمونه و روش آماده‌سازی کتابخانه هماهنگ شود.
              </div>

              <DecisionQuestion
                question="یک نمونه غلظت RNA بالایی دارد، اما شواهد نشان می‌دهد RNA به‌شدت تخریب شده است. کدام نتیجه درست‌تر است؟"
                options={[
                  "چون غلظت بالاست، کیفیت RNA حتماً عالی است.",
                  "کمیت مناسب است اما یکپارچگی مشکل دارد؛ این دو معیار یک چیز نیستند.",
                  "غلظت و یکپارچگی همیشه دقیقاً با هم تغییر می‌کنند.",
                ]}
                selected={qualityAnswer}
                correctIndex={1}
                onSelect={setQualityAnswer}
                correctFeedback="دقیقاً. یک نمونه می‌تواند RNA زیادی داشته باشد ولی RNA آن تخریب شده باشد."
                incorrectFeedback="کمیت، خلوص و یکپارچگی باید جداگانه دیده و در کنار هم تفسیر شوند."
              />
            </SceneCard>
          )}

          {scene === 5 && (
            <SceneCard
              eyebrow="سناریوی پیوسته"
              title="در سرطان پانکراس، تفاوت زیستی و تفاوت کیفیت نمونه می‌توانند کنار هم ظاهر شوند."
              description="فرض کنید می‌خواهیم تومورهای پانکراس را با بافت غیرتوموری مقایسه کنیم. قبل از کتابخانه‌سازی باید بتوانیم تاریخچه نمونه را بخوانیم."
            >
              <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
                  <div className="border-b border-slate-100 bg-slate-50 px-5 py-4">
                    <p className="font-black text-slate-900">فراداده‌ای که ارزش ثبت دارد</p>
                  </div>
                  <div className="grid gap-3 p-5 sm:grid-cols-2">
                    {[
                      "نوع بافت و محل نمونه‌گیری",
                      "درصد یا برآورد محتوای توموری در صورت دسترس",
                      "میزان نکروز یا ویژگی بافت‌شناختی مهم",
                      "زمان و روش پایدارسازی",
                      "شرایط نگهداری",
                      "دسته استخراج RNA",
                      "کمیت RNA",
                      "معیارهای خلوص و یکپارچگی",
                    ].map((item) => (
                      <div
                        key={item}
                        className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold leading-6 text-slate-700"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl border border-teal-200 bg-teal-50 p-6">
                  <p className="text-xs font-bold text-teal-700">پرسش پژوهشگر</p>
                  <p className="mt-3 text-lg font-black leading-8 text-slate-950">
                    اگر نمونه‌های تومور RNA ضعیف‌تری داشته باشند، آیا اختلاف بیان ژن فقط زیستی است؟
                  </p>
                  <p className="mt-4 text-sm leading-7 text-slate-600">
                    نه لزوماً. کیفیت RNA می‌تواند با گروه پژوهشی هم‌جهت شود و روی الگوی داده اثر بگذارد؛ بنابراین باید پیش از تفسیر نهایی بررسی شود.
                  </p>
                </div>
              </div>

              <DecisionQuestion
                question="در این مطالعه کدام کار بهترین دفاع را در برابر مخلوط‌شدن اثر فنی و زیستی ایجاد می‌کند؟"
                options={[
                  "فقط نام گروه تومور و کنترل را نگه داریم؛ بقیه اطلاعات لازم نیست.",
                  "اطلاعات پیش‌تحلیلی و کیفیت RNA را ثبت کنیم و توزیع آن‌ها را میان گروه‌ها بررسی کنیم.",
                  "نمونه‌های با کیفیت متفاوت را پنهان کنیم تا تحلیل ساده‌تر شود.",
                ]}
                selected={caseAnswer}
                correctIndex={1}
                onSelect={setCaseAnswer}
                correctFeedback="درست است. فراداده خوب کمک می‌کند بدانیم سیگنال مشاهده‌شده چه تاریخچه‌ای دارد."
                incorrectFeedback="نادیده‌گرفتن تفاوت کیفیت، آن را از داده حذف نمی‌کند."
              />
            </SceneCard>
          )}

          {scene === 6 && (
            <SceneCard
              eyebrow="ایستگاه تسلط"
              title="قبل از ورود به کتابخانه‌سازی باید بتوانید کیفیت نمونه و RNA را به‌عنوان بخشی از طراحی مطالعه ببینید."
              description="این درس قرار نیست شما را تکنسین آزمایشگاه کند؛ هدف این است که وقتی داده RNA-seq دریافت می‌کنید، منشأ زیستی و فنی آن را فراموش نکنید."
            >
              <DecisionQuestion
                question="کدام جمله جمع‌بندی دقیق‌تری از این درس است؟"
                options={[
                  "اگر FASTQ تولید شده باشد، تاریخچه نمونه دیگر اهمیتی ندارد.",
                  "کیفیت RNA فقط با غلظت آن مشخص می‌شود.",
                  "نمونه، نگهداری، استخراج و کیفیت RNA بخشی از زنجیره اندازه‌گیری‌اند و می‌توانند روی داده نهایی اثر بگذارند.",
                ]}
                selected={masteryAnswer}
                correctIndex={2}
                onSelect={setMasteryAnswer}
                correctFeedback="دقیقاً. حالا آماده‌ایم ببینیم از این RNA چگونه یک کتابخانه قابل توالی‌یابی ساخته می‌شود."
                incorrectFeedback="RNA-seq یک زنجیره اندازه‌گیری است؛ مراحل پیش از توالی‌یابی بخشی از کیفیت و تفسیر داده‌اند."
              />

              <div className="rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white">
                <p className="text-xs font-bold text-teal-300">درس بعدی</p>
                <h3 className="mt-2 text-2xl font-black">آماده‌سازی کتابخانه</h3>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
                  در مرحله بعد می‌بینیم چرا انتخاب mRNA، حذف rRNA، قطعه‌قطعه‌سازی و ساخت cDNA تعیین می‌کنند کدام RNAها فرصت تبدیل‌شدن به خوانش را پیدا کنند.
                </p>
              </div>
            </SceneCard>
          )}

          <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              disabled={scene === 0}
              onClick={() => goToScene(Math.max(0, scene - 1))}
              className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:border-teal-300 hover:text-teal-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowRight className="size-4" />
              بخش قبل
            </button>

            <button
              type="button"
              disabled={scene === sceneTitles.length - 1}
              onClick={() => goToScene(Math.min(sceneTitles.length - 1, scene + 1))}
              className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              بخش بعد
              <ArrowLeft className="size-4" />
            </button>
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
    <article className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
      <p className="text-sm font-bold text-teal-700">{eyebrow}</p>
      <h2 className="mt-3 text-2xl font-black leading-[1.55] text-slate-950 sm:text-3xl">
        {title}
      </h2>
      <p className="mt-4 max-w-4xl leading-8 text-slate-600">{description}</p>
      <div className="mt-7 space-y-6">{children}</div>
    </article>
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
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
      <p className="font-black leading-8 text-slate-950">{question}</p>
      <div className="mt-4 grid gap-3">
        {options.map((option, index) => {
          const active = selected === index;

          return (
            <button
              key={option}
              type="button"
              onClick={() => onSelect(index)}
              className={[
                "rounded-2xl border px-4 py-3 text-right text-sm font-semibold leading-7 transition",
                active
                  ? index === correctIndex
                    ? "border-teal-400 bg-teal-50 text-teal-950"
                    : "border-rose-300 bg-rose-50 text-rose-950"
                  : "border-slate-200 bg-white text-slate-700 hover:border-teal-300",
              ].join(" ")}
            >
              {option}
            </button>
          );
        })}
      </div>

      {answered && (
        <div
          className={[
            "mt-4 rounded-2xl px-4 py-3 text-sm font-semibold leading-7",
            correct
              ? "bg-teal-100 text-teal-950"
              : "bg-rose-100 text-rose-950",
          ].join(" ")}
        >
          {correct ? correctFeedback : incorrectFeedback}
        </div>
      )}
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
      <h3 className="font-black text-slate-950">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-600">{text}</p>
    </div>
  );
}

function StepCard({
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
      <div className="flex items-start gap-4">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-sm font-black text-white">
          {new Intl.NumberFormat("fa-IR").format(Number(number))}
        </span>
        <div>
          <h3 className="font-black text-slate-950">{title}</h3>
          <p className="mt-2 text-sm leading-7 text-slate-600">{text}</p>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  title,
  question,
  explanation,
  emphasized = false,
}: {
  title: string;
  question: string;
  explanation: string;
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
      <p className="text-xs font-bold text-teal-700">{question}</p>
      <h3 className="mt-2 text-xl font-black text-slate-950">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-600">{explanation}</p>
    </div>
  );
}

function DarkMetric({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
      <p className="font-black text-white">{title}</p>
      <p className="mt-2 text-sm leading-6 text-slate-300">{text}</p>
    </div>
  );
}

function Flow({ items }: { items: string[] }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white">
      <div className="flex flex-wrap items-center gap-2 text-sm font-black">
        {items.map((item, index) => (
          <div key={item} className="flex items-center gap-2">
            <span className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
              {item}
            </span>
            {index < items.length - 1 && <span className="text-teal-300">←</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

function InsightBox({ children }: { children: ReactNode }) {
  return (
    <div className="flex gap-3 rounded-3xl border border-teal-200 bg-teal-50 p-5 text-sm leading-8 text-teal-950">
      <Lightbulb className="mt-1 size-5 shrink-0 text-teal-700" />
      <div>{children}</div>
    </div>
  );
}
