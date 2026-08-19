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
  "سؤال قبل از فناوری",
  "مقایسه اصلی مطالعه",
  "تکرار زیستی",
  "فراداده و عوامل مداخله‌گر",
  "طراحی پروژه سرطان پانکراس",
  "ایستگاه تسلط",
];

export function RnaSeqStudyDesignLesson() {
  const [scene, setScene] = useState(0);
  const [questionAnswer, setQuestionAnswer] =
    useState<number | null>(null);
  const [comparisonAnswer, setComparisonAnswer] =
    useState<number | null>(null);
  const [replicateAnswer, setReplicateAnswer] =
    useState<number | null>(null);
  const [metadataAnswer, setMetadataAnswer] =
    useState<number | null>(null);
  const [caseAnswer, setCaseAnswer] =
    useState<number | null>(null);
  const [masteryAnswer, setMasteryAnswer] =
    useState<number | null>(null);

  function goToScene(nextScene: number) {
    setScene(nextScene);

    window.setTimeout(() => {
      document.getElementById("rna-seq-study-design")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 20);
  }

  return (
    <SpecialistLessonShell
      domainId="transcriptomics"
      trackId="bulk-rna-seq"
      lessonIndex={1}
      title="از سؤال پژوهشی تا طراحی مطالعه"
      subtitle="قبل از FASTQ، نرم‌افزار و آزمون آماری باید بدانیم چه چیزی را مقایسه می‌کنیم، واحد مستقل زیستی چیست و چه اطلاعاتی درباره نمونه‌ها لازم داریم."
      currentScene={scene}
      sceneCount={sceneTitles.length}
      sceneLabel={sceneTitles[scene]}
    >
      <section
        id="rna-seq-study-design"
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
              eyebrow="نقطه شروع واقعی"
              title="پروژه RNA-seq از FASTQ شروع نمی‌شود؛ از سؤال پژوهشی شروع می‌شود."
              description="فایل‌ها زمانی معنا پیدا می‌کنند که بدانیم کدام تفاوت زیستی را می‌خواهیم اندازه بگیریم."
            >
              <Flow
                items={[
                  "سؤال پژوهشی",
                  "گروه‌های مقایسه",
                  "نمونه‌های مستقل",
                  "تولید داده",
                  "تحلیل",
                  "تفسیر",
                ]}
              />

              <DecisionQuestion
                question="کدام شروع برای یک پروژه RNA-seq منطقی‌تر است؟"
                options={[
                  "اول نرم‌افزار تحلیل را انتخاب کنیم و بعد ببینیم چه سؤالی می‌توان پرسید.",
                  "اول سؤال زیستی و مقایسه اصلی را تعریف کنیم و بعد طراحی داده و تحلیل را بسازیم.",
                  "اول FASTQ را دانلود کنیم؛ طراحی مطالعه بعداً مشخص می‌شود.",
                ]}
                selected={questionAnswer}
                correctIndex={1}
                onSelect={setQuestionAnswer}
                correctFeedback="دقیقاً. سؤال پژوهشی جهت طراحی نمونه، نوع مقایسه و تحلیل را مشخص می‌کند."
                incorrectFeedback="ابزار و فایل باید در خدمت سؤال پژوهشی باشند، نه برعکس."
              />

              <InsightBox>
                یک سؤال خوب معمولاً مشخص می‌کند <strong>چه چیزی</strong>، بین <strong>کدام گروه‌ها</strong> و در <strong>چه زمینه زیستی</strong> مقایسه می‌شود.
              </InsightBox>
            </SceneCard>
          )}

          {scene === 1 && (
            <SceneCard
              eyebrow="مقایسه اصلی"
              title="هر تحلیل بیان افتراقی پشت سر خود یک مقایسه زیستی دارد."
              description="قبل از نوشتن مدل آماری باید گروه‌ها و تفاوت موردنظر را با زبان زیستی روشن کنیم."
            >
              <div className="grid gap-4 md:grid-cols-2">
                <ConceptCard
                  title="گروه مرجع"
                  text="شرایطی که گروه دیگر نسبت به آن تفسیر می‌شود؛ مثلاً سلول‌های بدون دارو."
                />

                <ConceptCard
                  title="گروه مورد مقایسه"
                  text="شرایطی که اثر موردنظر در آن بررسی می‌شود؛ مثلاً سلول‌های دریافت‌کننده داروی X."
                  emphasized
                />
              </div>

              <DecisionQuestion
                question="می‌خواهیم اثر داروی X را روی بیان ژن سلول‌های سرطان پانکراس بررسی کنیم. مقایسه اصلی کدام است؟"
                options={[
                  "نمونه‌های دریافت‌کننده داروی X در برابر نمونه‌های کنترل متناظر.",
                  "ژن‌های با بیان زیاد در برابر ژن‌های با بیان کم.",
                  "فایل‌های FASTQ بزرگ در برابر فایل‌های FASTQ کوچک.",
                ]}
                selected={comparisonAnswer}
                correctIndex={0}
                onSelect={setComparisonAnswer}
                correctFeedback="درست است. مقایسه باید شرایط زیستی موردنظر را بازتاب دهد."
                incorrectFeedback="واحد مقایسه در این سؤال، شرایط تیمار است؛ نه ویژگی فایل یا خود ژن‌ها."
              />
            </SceneCard>
          )}

          {scene === 2 && (
            <SceneCard
              eyebrow="استقلال زیستی"
              title="تکرار زیستی یعنی نمونه مستقل، نه تکرار خواندن یک نمونه."
              description="توان استنباط آماری از تعداد واحدهای مستقل زیستی می‌آید، نه صرفاً از تعداد زیاد خوانش‌ها."
            >
              <div className="grid gap-4 md:grid-cols-2">
                <ConceptCard
                  title="تکرار زیستی"
                  text="نمونه مستقل زیستی؛ مثلاً بیمار مستقل، حیوان مستقل یا کشت مستقل، بسته به سؤال و طراحی."
                  emphasized
                />

                <ConceptCard
                  title="تکرار فنی"
                  text="تکرار اندازه‌گیری از همان منبع زیستی؛ برای سنجش بخشی از تغییرپذیری فنی مفید است، اما جای تکرار زیستی را نمی‌گیرد."
                />
              </div>

              <DecisionQuestion
                question="سه کتابخانه از RNA یک بیمار ساخته‌ایم. آیا سه تکرار زیستی مستقل داریم؟"
                options={[
                  "بله، چون سه کتابخانه جدا ساخته شده است.",
                  "خیر، چون منبع زیستی اصلی هنوز همان یک بیمار است.",
                ]}
                selected={replicateAnswer}
                correctIndex={1}
                onSelect={setReplicateAnswer}
                correctFeedback="دقیقاً. استقلال زیستی در سطح منبع نمونه تعریف می‌شود."
                incorrectFeedback="تکرار مراحل فنی، منبع زیستی جدید ایجاد نمی‌کند."
              />

              <InsightBox>
                تعداد میلیون‌ها خوانش، تعداد تکرارهای زیستی را افزایش نمی‌دهد.
              </InsightBox>
            </SceneCard>
          )}

          {scene === 3 && (
            <SceneCard
              eyebrow="فراداده"
              title="برای هر نمونه باید بدانیم چه چیزی غیر از RNA همراه آن آمده است."
              description="سن، جنس، دسته آزمایشی، مرکز نمونه‌گیری یا زمان می‌توانند با گروه پژوهشی هم‌جهت شوند و تفسیر را مخدوش کنند."
            >
              <div className="rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white">
                <p className="text-xs font-bold text-teal-300">
                  یک جدول فراداده ساده
                </p>

                <div className="mt-5 overflow-x-auto">
                  <table className="w-full min-w-[620px] text-sm">
                    <thead className="text-slate-400">
                      <tr>
                        <th className="p-3 text-right">نمونه</th>
                        <th className="p-3 text-right">گروه</th>
                        <th className="p-3 text-right">بیمار</th>
                        <th className="p-3 text-right">دسته آزمایشی</th>
                        <th className="p-3 text-right">زمان</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-white/10">
                      <tr>
                        <td className="p-3">نمونه ۱</td>
                        <td className="p-3">کنترل</td>
                        <td className="p-3">بیمار ۱</td>
                        <td className="p-3">الف</td>
                        <td className="p-3">روز ۰</td>
                      </tr>
                      <tr>
                        <td className="p-3">نمونه ۲</td>
                        <td className="p-3">داروی X</td>
                        <td className="p-3">بیمار ۲</td>
                        <td className="p-3">ب</td>
                        <td className="p-3">روز ۰</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <DecisionQuestion
                question="اگر تمام نمونه‌های کنترل در دسته آزمایشی الف و تمام نمونه‌های تیمار در دسته آزمایشی ب باشند، مشکل چیست؟"
                options={[
                  "اثر تیمار و اثر دسته آزمایشی ممکن است از هم قابل تفکیک نباشند.",
                  "هیچ مشکلی نیست؛ نرم‌افزار همیشه این دو اثر را جدا می‌کند.",
                  "فقط تعداد ژن‌ها کمتر می‌شود.",
                ]}
                selected={metadataAnswer}
                correctIndex={0}
                onSelect={setMetadataAnswer}
                correctFeedback="درست است. وقتی دو عامل کاملاً هم‌جهت باشند، جدا کردن اثر آن‌ها می‌تواند ناممکن یا بسیار دشوار شود."
                incorrectFeedback="تحلیل آماری نمی‌تواند اطلاعاتی را که طراحی مطالعه فراهم نکرده است از هیچ ایجاد کند."
              />
            </SceneCard>
          )}

          {scene === 4 && (
            <SceneCard
              eyebrow="پروژه همراه"
              title="یک طراحی اولیه برای مطالعه داروی X در سرطان پانکراس بسازیم."
              description="فرض کنید هدف ما بررسی اثر دارو بر بیان ژن در نمونه‌های مستقل توموری است."
            >
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <MiniCard
                  title="سؤال"
                  text="داروی X چه تغییراتی در بیان ژن ایجاد می‌کند؟"
                />
                <MiniCard
                  title="مقایسه"
                  text="کنترل در برابر داروی X"
                />
                <MiniCard
                  title="واحد مستقل"
                  text="نمونه یا مدل زیستی مستقل"
                />
                <MiniCard
                  title="فراداده"
                  text="گروه، منبع نمونه، زمان، دسته آزمایشی و عوامل مرتبط"
                />
              </div>

              <DecisionQuestion
                question="قبل از سفارش توالی‌یابی، کدام مورد باید روشن باشد؟"
                options={[
                  "فقط نام ابزار نهایی تحلیل.",
                  "سؤال، گروه‌ها، واحدهای مستقل زیستی و عوامل مهم فراداده.",
                  "فقط تعداد ژن‌های مورد انتظار.",
                ]}
                selected={caseAnswer}
                correctIndex={1}
                onSelect={setCaseAnswer}
                correctFeedback="دقیقاً. این اطلاعات ستون فقرات طراحی و تحلیل بعدی هستند."
                incorrectFeedback="جزئیات فنی توالی‌یابی مهم‌اند، اما بدون طراحی زیستی روشن نمی‌توانند سؤال را نجات دهند."
              />
            </SceneCard>
          )}

          {scene === 5 && (
            <SceneCard
              eyebrow="ایستگاه تسلط"
              title="قبل از FASTQ باید بتوانید طراحی مطالعه را با زبان ساده توضیح دهید."
              description="اگر سؤال و واحدهای مستقل روشن نباشند، مرحله بعدی هنوز زود است."
            >
              <DecisionQuestion
                question="کدام جمله دقیق‌ترین جمع‌بندی این درس است؟"
                options={[
                  "هرچه عمق توالی‌یابی بیشتر باشد، تکرار زیستی دیگر اهمیت ندارد.",
                  "طراحی مطالعه مشخص می‌کند چه گروه‌هایی مقایسه می‌شوند، واحد مستقل زیستی چیست و چه فراداده‌ای باید در تحلیل در نظر گرفته شود.",
                  "طراحی مطالعه فقط بعد از تولید FASTQ اهمیت پیدا می‌کند.",
                ]}
                selected={masteryAnswer}
                correctIndex={1}
                onSelect={setMasteryAnswer}
                correctFeedback="عالی. حالا نقطه شروع یک پروژه RNA-seq را از فایل و ابزار جدا کرده‌اید."
                incorrectFeedback="به سه ستون برگردید: مقایسه زیستی، تکرار زیستی و فراداده."
              />

              <div className="mt-7 rounded-3xl bg-slate-950 p-6 text-white">
                <p className="text-xs font-bold text-teal-300">
                  چیزی که باید با خودتان ببرید
                </p>
                <p className="mt-3 text-lg font-bold leading-9">
                  سؤال پژوهشی ← طراحی مطالعه ← نمونه و داده ← تحلیل
                </p>
              </div>

              <InsightBox>
                درس بعدی مسیر به <strong>نمونه زیستی و RNA</strong> می‌پردازد؛ یعنی قبل از اینکه داده به FASTQ تبدیل شود چه اتفاقی می‌افتد.
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

function MiniCard({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-bold text-teal-700">{title}</p>
      <p className="mt-2 text-sm font-semibold leading-7 text-slate-800">
        {text}
      </p>
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
      <p className="text-sm leading-8 text-teal-950">
        {children}
      </p>
    </div>
  );
}
