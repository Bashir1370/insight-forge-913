import {
  useState,
  type ReactNode,
} from "react";
import {
  ArrowLeft,
  ArrowRight,
  Lightbulb,
} from "lucide-react";

import { SpecialistLessonShell } from "@/features/learning/components/SpecialistLessonShell";

const sceneTitles = [
  "کتابخانه یعنی چه؟",
  "انتخاب RNA هدف",
  "قطعه‌قطعه‌سازی و cDNA",
  "جهت‌داری کتابخانه",
  "آداپتور، شاخص و تکثیر",
  "سناریوی سرطان پانکراس",
  "ایستگاه تسلط",
];

export function RnaSeqLibraryPreparationLesson() {
  const [scene, setScene] = useState(0);
  const [libraryAnswer, setLibraryAnswer] = useState<number | null>(null);
  const [selectionAnswer, setSelectionAnswer] = useState<number | null>(null);
  const [fragmentAnswer, setFragmentAnswer] = useState<number | null>(null);
  const [strandAnswer, setStrandAnswer] = useState<number | null>(null);
  const [adapterAnswer, setAdapterAnswer] = useState<number | null>(null);
  const [caseAnswer, setCaseAnswer] = useState<number | null>(null);
  const [masteryAnswer, setMasteryAnswer] = useState<number | null>(null);

  function goToScene(nextScene: number) {
    setScene(nextScene);

    window.setTimeout(() => {
      document.getElementById("rna-seq-library-preparation")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 20);
  }

  return (
    <SpecialistLessonShell
      domainId="transcriptomics"
      trackId="bulk-rna-seq"
      lessonIndex={3}
      title="آماده‌سازی کتابخانه"
      subtitle="RNA استخراج‌شده هنوز مستقیماً وارد دستگاه توالی‌یابی نمی‌شود. در این درس می‌بینیم انتخاب RNA هدف، قطعه‌قطعه‌سازی، ساخت cDNA، جهت‌داری، آداپتورها و شاخص‌ها چگونه تعیین می‌کنند چه اطلاعاتی در داده نهایی قابل مشاهده باشد."
      currentScene={scene}
      sceneCount={sceneTitles.length}
      sceneLabel={sceneTitles[scene]}
    >
      <section
        id="rna-seq-library-preparation"
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
              eyebrow="پل بین RNA و توالی‌یابی"
              title="کتابخانه، نسخه‌ای آماده برای توالی‌یابی از مولکول‌های انتخاب‌شده RNA است."
              description="هدف آماده‌سازی کتابخانه فقط تبدیل RNA به cDNA نیست؛ این مرحله مشخص می‌کند کدام مولکول‌ها وارد اندازه‌گیری شوند و چگونه برای دستگاه قابل خواندن شوند."
            >
              <Flow
                items={[
                  "RNA استخراج‌شده",
                  "انتخاب RNA هدف",
                  "ساخت قطعات مناسب",
                  "cDNA",
                  "آداپتور و شاخص",
                  "کتابخانه قابل توالی‌یابی",
                ]}
              />

              <DecisionQuestion
                question="کدام جمله درباره کتابخانه RNA-seq دقیق‌تر است؟"
                options={[
                  "کتابخانه همان RNA خام استخراج‌شده از نمونه است.",
                  "کتابخانه مجموعه‌ای از مولکول‌های آماده توالی‌یابی است که از RNA هدف ساخته شده‌اند.",
                  "کتابخانه همان فایل FASTQ نهایی است.",
                ]}
                selected={libraryAnswer}
                correctIndex={1}
                onSelect={setLibraryAnswer}
                correctFeedback="دقیقاً. کتابخانه هنوز داده محاسباتی نیست؛ محصول آزمایشگاهی آماده ورود به توالی‌یابی است."
                incorrectFeedback="RNA خام، کتابخانه و FASTQ سه سطح متفاوت‌اند: ماده زیستی، محصول آماده توالی‌یابی و داده محاسباتی."
              />

              <InsightBox>
                آماده‌سازی کتابخانه یک <strong>فیلتر اندازه‌گیری</strong> است؛ هر انتخاب در این مرحله می‌تواند تعیین کند چه نوع RNA در داده بعدی دیده یا کمتر دیده شود.
              </InsightBox>
            </SceneCard>
          )}

          {scene === 1 && (
            <SceneCard
              eyebrow="انتخاب RNA هدف"
              title="غنی‌سازی mRNA و حذف rRNA دو راهبرد متفاوت‌اند، نه دو مرحله اجباری پشت سر هم."
              description="rRNA بخش بزرگی از RNA سلول را تشکیل می‌دهد. برای بسیاری از پروژه‌ها باید پیش از ساخت کتابخانه تصمیم بگیریم چه چیزی را نگه داریم و چه چیزی را کاهش دهیم."
            >
              <div className="grid gap-4 lg:grid-cols-2">
                <StrategyCard
                  title="غنی‌سازی mRNA با poly(A)"
                  badge="انتخاب مثبت"
                  items={[
                    "RNAهای دارای دُم poly(A) را غنی می‌کند.",
                    "برای بسیاری از مطالعات بیان mRNA مناسب است.",
                    "بخش زیادی از RNAهای بدون poly(A) کمتر نمایندگی می‌شوند.",
                    "در RNA بسیار تخریب‌شده می‌تواند محدودیت ایجاد کند، بسته به پروتکل و کیفیت نمونه.",
                  ]}
                />

                <StrategyCard
                  title="حذف rRNA"
                  badge="کاهش RNA غالب"
                  items={[
                    "rRNA را هدف قرار می‌دهد و کاهش می‌دهد.",
                    "می‌تواند طیف گسترده‌تری از RNAهای غیر-rRNA را حفظ کند.",
                    "برای برخی نمونه‌های تخریب‌شده یا سؤال‌های گسترده‌تر مفید است.",
                    "ترکیب دقیق RNA باقی‌مانده به کیت و طراحی آزمایش بستگی دارد.",
                  ]}
                />
              </div>

              <DecisionQuestion
                question="اگر سؤال اصلی درباره mRNAهای کدکننده در RNA با کیفیت مناسب باشد، کدام گزینه می‌تواند انتخاب منطقی باشد؟"
                options={[
                  "غنی‌سازی poly(A)، اگر با سؤال و کیفیت نمونه سازگار باشد.",
                  "انجام اجباری poly(A) و سپس حذف rRNA در همه پروژه‌ها.",
                  "هیچ انتخابی لازم نیست چون تمام RNAها به یک اندازه خوانده می‌شوند.",
                ]}
                selected={selectionAnswer}
                correctIndex={0}
                onSelect={setSelectionAnswer}
                correctFeedback="درست است. انتخاب راهبرد باید از سؤال زیستی، نوع نمونه و کیفیت RNA بیاید."
                incorrectFeedback="هیچ راهبرد واحدی برای همه RNA-seqها وجود ندارد؛ poly(A) selection و rRNA depletion دو منطق متفاوت‌اند."
              />

              <InsightBox>
                اگر پروژه به RNAهای بدون poly(A)، رونوشت‌های نابالغ یا نمونه‌های بسیار تخریب‌شده حساس باشد، راهبرد انتخاب RNA باید با دقت بیشتری بررسی شود.
              </InsightBox>
            </SceneCard>
          )}

          {scene === 2 && (
            <SceneCard
              eyebrow="اندازه قطعات و تبدیل مولکولی"
              title="RNA یا cDNA باید به قطعاتی سازگار با روش توالی‌یابی تبدیل شود؛ اما ترتیب دقیق مراحل بین پروتکل‌ها یکسان نیست."
              description="در برخی روش‌ها RNA پیش از ساخت cDNA قطعه‌قطعه می‌شود و در برخی طراحی‌ها قطعه‌قطعه‌سازی یا تولید قطعات به شکل دیگری انجام می‌شود. اصل مهم، فهم هدف این تبدیل است نه حفظ کردن یک ترتیب جهانی."
            >
              <div className="grid gap-4 md:grid-cols-3">
                <ConceptCard
                  title="قطعه‌قطعه‌سازی"
                  text="مولکول‌های بلند به قطعاتی با دامنه اندازه مناسب برای ساخت کتابخانه و توالی‌یابی تبدیل می‌شوند."
                  emphasized
                />
                <ConceptCard
                  title="رونویسی معکوس"
                  text="RNA با کمک reverse transcriptase به cDNA تبدیل می‌شود تا وارد مراحل بعدی ساخت کتابخانه شود."
                />
                <ConceptCard
                  title="انتخاب اندازه"
                  text="بسته به پروتکل، توزیع اندازه قطعات کتابخانه کنترل می‌شود تا محصول نهایی با روش توالی‌یابی سازگار باشد."
                />
              </div>

              <DecisionQuestion
                question="چرا نباید یک ترتیب واحد از fragmentation → cDNA را قانون همیشگی همه پروتکل‌ها بدانیم؟"
                options={[
                  "چون پروتکل‌ها می‌توانند در محل و روش تولید قطعات متفاوت باشند، هرچند هدف کلی مشابه است.",
                  "چون RNA-seq اصلاً به cDNA نیاز ندارد.",
                  "چون قطعه‌قطعه‌سازی فقط بعد از تولید FASTQ انجام می‌شود.",
                ]}
                selected={fragmentAnswer}
                correctIndex={0}
                onSelect={setFragmentAnswer}
                correctFeedback="دقیقاً. باید منطق مرحله را بفهمیم و سپس جزئیات کیت یا پروتکل واقعی را بخوانیم."
                incorrectFeedback="در آموزش مفهومی نباید جزئیات یک کیت خاص را به همه RNA-seqها تعمیم دهیم."
              />
            </SceneCard>
          )}

          {scene === 3 && (
            <SceneCard
              eyebrow="Strandedness"
              title="بعضی کتابخانه‌ها اطلاعات جهت رونوشت را حفظ می‌کنند و بعضی نه."
              description="در کتابخانه جهت‌دار، داده می‌تواند کمک کند تشخیص دهیم خوانش از کدام رشته رونوشت آمده است؛ این موضوع به‌ویژه در نواحی هم‌پوشان ژنی اهمیت پیدا می‌کند."
            >
              <div className="grid gap-4 md:grid-cols-2">
                <ConceptCard
                  title="کتابخانه جهت‌دار"
                  text="اطلاعات جهت رونوشت تا حدی حفظ می‌شود و در تحلیل باید قرارداد جهت‌داری همان پروتکل درست مشخص شود."
                  emphasized
                />
                <ConceptCard
                  title="کتابخانه غیرجهت‌دار"
                  text="اطلاعات منشأ رشته در خروجی قابل استفاده نیست یا برای تحلیل جهت‌دار طراحی نشده است."
                />
              </div>

              <DecisionQuestion
                question="اگر در تحلیل، جهت‌داری کتابخانه را برعکس واقعیت اعلام کنیم چه اتفاقی ممکن است بیفتد؟"
                options={[
                  "شمارش یا انتساب خوانش‌ها به ژن‌ها می‌تواند اشتباه شود.",
                  "هیچ اثری ندارد چون strandedness فقط یک نام آزمایشگاهی است.",
                  "فقط حجم FASTQ تغییر می‌کند.",
                ]}
                selected={strandAnswer}
                correctIndex={0}
                onSelect={setStrandAnswer}
                correctFeedback="درست است. strandedness بخشی از فراداده فنی مهم برای تحلیل است."
                incorrectFeedback="پارامتر جهت‌داری می‌تواند مستقیماً روی انتساب خوانش‌ها اثر بگذارد؛ باید از اطلاعات واقعی کتابخانه مشخص شود."
              />

              <InsightBox>
                «stranded» بودن به معنی کیفیت بالاتر مطلق نیست؛ یک ویژگی طراحی کتابخانه است که باید در تحلیل به‌درستی مدل شود.
              </InsightBox>
            </SceneCard>
          )}

          {scene === 4 && (
            <SceneCard
              eyebrow="آماده‌سازی برای دستگاه"
              title="آداپتورها اتصال کتابخانه به سامانه توالی‌یابی را ممکن می‌کنند و شاخص‌ها هویت نمونه‌ها را در یک استخر مشترک نگه می‌دارند."
              description="در بسیاری از پروژه‌ها چند کتابخانه با شاخص‌های متفاوت با هم pool می‌شوند و سپس در یک run توالی‌یابی می‌شوند."
            >
              <Flow
                items={[
                  "قطعه cDNA",
                  "آداپتور",
                  "شاخص نمونه",
                  "در صورت نیاز تکثیر",
                  "کنترل کیفیت کتابخانه",
                  "pool برای توالی‌یابی",
                ]}
              />

              <div className="mt-5 grid gap-4 md:grid-cols-3">
                <ConceptCard
                  title="آداپتور"
                  text="توالی‌های مهندسی‌شده‌ای که برای مراحل بعدی ساخت و خواندن کتابخانه لازم‌اند؛ جزئیات آن‌ها به پلتفرم و کیت بستگی دارد."
                />
                <ConceptCard
                  title="شاخص نمونه"
                  text="کدی برای تمایز نمونه‌ها پس از توالی‌یابی مشترک؛ در مرحله demultiplexing خوانش‌ها بر اساس شاخص به نمونه‌ها بازمی‌گردند."
                  emphasized
                />
                <ConceptCard
                  title="تکثیر"
                  text="در بسیاری از پروتکل‌ها PCR برای افزایش مقدار کتابخانه به کار می‌رود، اما می‌تواند سوگیری و duplicate ایجاد کند؛ شدت و ضرورت آن وابسته به پروتکل است."
                />
              </div>

              <DecisionQuestion
                question="نقش اصلی sample index چیست؟"
                options={[
                  "نشان دادن این‌که هر خوانش پس از pool کردن به کدام نمونه تعلق دارد.",
                  "تبدیل RNA به DNA.",
                  "اندازه‌گیری RIN نمونه.",
                ]}
                selected={adapterAnswer}
                correctIndex={0}
                onSelect={setAdapterAnswer}
                correctFeedback="دقیقاً. شاخص هویت نمونه را در توالی‌یابی چندکتابخانه‌ای حفظ می‌کند."
                incorrectFeedback="index برای ردیابی نمونه‌ها در pool مشترک استفاده می‌شود، نه برای استخراج RNA یا ساخت cDNA."
              />
            </SceneCard>
          )}

          {scene === 5 && (
            <SceneCard
              eyebrow="پروژه همراه سرطان پانکراس"
              title="کیفیت و نوع نمونه می‌تواند انتخاب راهبرد کتابخانه را عوض کند."
              description="فرض کنید بخشی از نمونه‌های سرطان پانکراس از بافت تازه منجمد و بخشی از FFPE با RNA تخریب‌شده‌تر آمده‌اند. انتخاب کتابخانه نباید مستقل از این تفاوت باشد."
            >
              <div className="grid gap-4 lg:grid-cols-2">
                <CasePanel
                  title="سناریو A — RNA با کیفیت مناسب"
                  text="تمرکز اصلی مطالعه روی بیان mRNAهای کدکننده است و نمونه‌ها RNA نسبتاً سالم دارند."
                  conclusion="poly(A) selection می‌تواند گزینه قابل بررسی باشد، اگر با هدف و پروتکل سازگار باشد."
                />
                <CasePanel
                  title="سناریو B — RNA تخریب‌شده / FFPE"
                  text="بخشی از RNAها کوتاه‌تر و تخریب‌شده‌اند و حفظ اطلاعات گسترده‌تر از RNA غیر-rRNA برای سؤال مهم است."
                  conclusion="یک راهبرد مبتنی بر rRNA depletion یا پروتکل مناسب RNA تخریب‌شده می‌تواند منطقی‌تر باشد."
                />
              </div>

              <DecisionQuestion
                question="کدام تصمیم برای مقایسه این دو نوع نمونه خطرناک است؟"
                options={[
                  "استفاده از راهبردهای کتابخانه متفاوت بین گروه زیستی کنترل و تیمار بدون درنظرگرفتن اثر فنی آن.",
                  "ثبت نوع نمونه و پروتکل کتابخانه در فراداده.",
                  "بررسی سازگاری پروتکل با کیفیت RNA پیش از ساخت کتابخانه.",
                ]}
                selected={caseAnswer}
                correctIndex={0}
                onSelect={setCaseAnswer}
                correctFeedback="درست است. اگر نوع کتابخانه با گروه زیستی هم‌جهت شود، اثر زیستی و اثر فنی می‌توانند مخدوش شوند."
                incorrectFeedback="پروتکل کتابخانه بخشی از طراحی مطالعه است و باید بین گروه‌ها تا حد ممکن متوازن و در فراداده ثبت شود."
              />

              <InsightBox>
                همان اصل درس ۱ دوباره برمی‌گردد: <strong>عامل فنی نباید با گروه زیستی کاملاً هم‌جهت شود</strong>، مگر اینکه طراحی و تفسیر مطالعه آن را صریحاً مدیریت کند.
              </InsightBox>
            </SceneCard>
          )}

          {scene === 6 && (
            <SceneCard
              eyebrow="ایستگاه تسلط"
              title="قبل از رفتن به توالی‌یابی باید بتوانید توضیح دهید کتابخانه چه چیزی را وارد اندازه‌گیری کرده است."
              description="اگر ندانیم RNA چگونه انتخاب و کتابخانه چگونه ساخته شده، تفسیر FASTQ و شمارش ژن‌ها ناقص خواهد بود."
            >
              <DecisionQuestion
                question="کدام جمله بهترین جمع‌بندی این درس است؟"
                options={[
                  "تمام RNA-seqها دقیقاً یک مسیر آماده‌سازی کتابخانه دارند.",
                  "آماده‌سازی کتابخانه مجموعه‌ای از انتخاب‌هاست که تعیین می‌کند چه RNAهایی، با چه ساختاری و چه اطلاعات فنی وارد توالی‌یابی شوند.",
                  "تا زمانی که FASTQ داریم، دانستن نوع کتابخانه اهمیتی ندارد.",
                ]}
                selected={masteryAnswer}
                correctIndex={1}
                onSelect={setMasteryAnswer}
                correctFeedback="عالی. حالا می‌توانید کتابخانه را به‌عنوان بخشی از مدل اندازه‌گیری RNA-seq ببینید، نه فقط یک مرحله آزمایشگاهی."
                incorrectFeedback="به انتخاب RNA هدف، strandedness، شاخص نمونه و اثر پروتکل روی چیزی که قابل مشاهده می‌شود برگردید."
              />

              <div className="mt-7 rounded-3xl bg-slate-950 p-6 text-white">
                <p className="text-xs font-bold text-teal-300">
                  چیزی که باید با خودتان ببرید
                </p>
                <p className="mt-3 text-lg font-bold leading-9">
                  RNA ← انتخاب مولکول‌های هدف ← ساخت کتابخانه ← توالی‌یابی ← FASTQ
                </p>
              </div>

              <InsightBox>
                درس بعدی وارد <strong>توالی‌یابی و FASTQ</strong> می‌شود: دستگاه دقیقاً چه چیزی می‌خواند و فایل FASTQ چه ساختاری دارد؟
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
        <p className="mt-3 max-w-3xl text-sm leading-8 text-slate-600">
          {description}
        </p>
      </div>
      <div className="p-6 sm:p-8">{children}</div>
    </article>
  );
}

function Flow({ items }: { items: string[] }) {
  return (
    <div
      dir="rtl"
      className="rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white"
    >
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

function StrategyCard({
  title,
  badge,
  items,
}: {
  title: string;
  badge: string;
  items: string[];
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-lg font-black text-slate-950">{title}</p>
        <span className="rounded-full bg-teal-100 px-3 py-1 text-xs font-bold text-teal-800">
          {badge}
        </span>
      </div>
      <ul className="mt-5 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-sm leading-7 text-slate-600">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-600" />
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

function CasePanel({
  title,
  text,
  conclusion,
}: {
  title: string;
  text: string;
  conclusion: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="font-black text-slate-950">{title}</p>
      <p className="mt-3 text-sm leading-8 text-slate-600">{text}</p>
      <div className="mt-4 rounded-2xl border border-teal-200 bg-teal-50 p-4">
        <p className="text-sm font-bold leading-7 text-teal-950">{conclusion}</p>
      </div>
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
