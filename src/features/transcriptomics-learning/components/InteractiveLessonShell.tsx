import type { ReactNode } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
} from "lucide-react";

type InteractiveLessonShellProps = {
  foundationIndex: number;
  total: number;
  title: string;
  subtitle: string;
  currentScene: number;
  sceneCount: number;
  sceneLabel: string;
  children: ReactNode;
};

const foundationLessons = [
  {
    index: 1,
    href: "/learn/transcriptomics/foundations/genome-to-transcriptome",
    principle: "ژنوم ≠ ترنسکریپتوم",
  },
  {
    index: 2,
    href: "/learn/transcriptomics/foundations/what-transcriptomics-measures",
    principle: "ترنسکریپتوم، مجموعه RNAهای مشاهده‌شده در یک زمینه زیستی مشخص است.",
  },
  {
    index: 3,
    href: "/learn/transcriptomics/foundations/gene-expression",
    principle: "بیان ژن یعنی میزان RNA مشاهده‌شده از یک ژن در شرایط مشخص.",
  },
  {
    index: 4,
    href: "/learn/transcriptomics/foundations/rna-diversity",
    principle: "یک ژن می‌تواند به بیش از یک رونوشت و ایزوفرم منجر شود.",
  },
  {
    index: 5,
    href: "/learn/transcriptomics/foundations/transcriptomics-question-fit",
    principle: "فناوری باید از سؤال پژوهشی و نوع اطلاعات موردنیاز انتخاب شود.",
  },
  {
    index: 6,
    href: "/learn/transcriptomics/foundations/bulk-single-cell-spatial",
    principle: "سطح مشاهده با فناوری اندازه‌گیری یکی نیست.",
  },
  {
    index: 7,
    href: "/learn/transcriptomics/foundations/rna-seq-in-transcriptomics",
    principle: "ترنسکریپتومیکس یک حوزه است؛ فناوری‌ها راه‌های متفاوت اندازه‌گیری آن هستند.",
  },
] as const;

export function InteractiveLessonShell({
  foundationIndex,
  total,
  title,
  subtitle,
  currentScene,
  sceneCount,
  sceneLabel,
  children,
}: InteractiveLessonShellProps) {
  const faNumber = new Intl.NumberFormat("fa-IR");

  const foundationPercent = Math.round(
    (foundationIndex / total) * 100,
  );

  const lessonPercent = Math.round(
    ((currentScene + 1) / sceneCount) * 100,
  );

  const currentLesson =
    foundationLessons.find(
      (lesson) => lesson.index === foundationIndex,
    ) ?? foundationLessons[0];

  const previousLesson =
    foundationIndex > 1
      ? foundationLessons.find(
          (lesson) => lesson.index === foundationIndex - 1,
        )
      : null;

  const nextLesson =
    foundationIndex < total
      ? foundationLessons.find(
          (lesson) => lesson.index === foundationIndex + 1,
        )
      : null;

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-slate-50 text-right text-slate-900"
    >
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <a
              href="/learn"
              className="font-semibold text-teal-700 transition hover:text-teal-900"
            >
              آموزش هاب‌ژن
            </a>

            <span className="text-slate-300">/</span>

            <span className="font-semibold text-slate-700">
              ترنسکریپتومیکس
            </span>

            <span className="text-slate-300">/</span>

            <a
              href="/learn#transcriptomics-foundations"
              className="font-semibold text-slate-900 transition hover:text-teal-800"
            >
              مبانی ترنسکریپتومیکس
            </a>
          </div>

          <a
            href="/learn#transcriptomics-foundations"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-teal-300 hover:text-teal-800"
          >
            مشاهده مسیر مبانی
          </a>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-slate-200 bg-white">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-28 -top-28 h-80 w-80 rounded-full bg-teal-100/70 blur-3xl" />
          <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-cyan-100/60 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.55fr] lg:items-center">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-teal-50 px-3 py-1.5 text-xs font-bold text-teal-700">
                  مبانی ترنسکریپتومیکس
                </span>

                <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-500">
                  درس {faNumber.format(foundationIndex)} از {faNumber.format(total)}
                </span>
              </div>

              <h1 className="mt-5 text-3xl font-black leading-[1.45] text-slate-950 sm:text-5xl">
                {title}
              </h1>

              <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600 sm:text-lg">
                {subtitle}
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white shadow-xl">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs text-slate-400">
                    پیشرفت در مبانی ترنسکریپتومیکس
                  </p>

                  <p className="mt-2 text-2xl font-black">
                    {faNumber.format(foundationIndex)} از {faNumber.format(total)}
                  </p>
                </div>

                <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-300">
                  {sceneLabel}
                </span>
              </div>

              <div className="mt-5">
                <div className="mb-2 flex items-center justify-between text-[11px] text-slate-400">
                  <span>پیشرفت همین درس</span>
                  <span>{faNumber.format(lessonPercent)}٪</span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-teal-400 transition-all duration-500"
                    style={{ width: `${lessonPercent}%` }}
                  />
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-[11px] text-slate-400">
                  اصل این درس
                </p>

                <p className="mt-2 text-sm font-bold leading-7 text-white">
                  {currentLesson.principle}
                </p>
              </div>

              <div className="mt-4">
                <div className="mb-2 flex items-center justify-between text-[11px] text-slate-400">
                  <span>پیشرفت کل مبانی</span>
                  <span>{faNumber.format(foundationPercent)}٪</span>
                </div>

                <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-cyan-400/70"
                    style={{ width: `${foundationPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {children}

      <FoundationLessonNavigation
        foundationIndex={foundationIndex}
        total={total}
        previousLesson={previousLesson}
        nextLesson={nextLesson}
      />
    </main>
  );
}

function FoundationLessonNavigation({
  foundationIndex,
  total,
  previousLesson,
  nextLesson,
}: {
  foundationIndex: number;
  total: number;
  previousLesson:
    | (typeof foundationLessons)[number]
    | null
    | undefined;
  nextLesson:
    | (typeof foundationLessons)[number]
    | null
    | undefined;
}) {
  const faNumber = new Intl.NumberFormat("fa-IR");

  return (
    <section className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                <BookOpen className="size-5" />
              </span>

              <div>
                <p className="text-xs font-bold text-teal-700">
                  جابه‌جایی بین درس‌های مبانی
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  درس {faNumber.format(foundationIndex)} از {faNumber.format(total)}
                </p>
              </div>
            </div>

            <a
              href="/learn#transcriptomics-foundations"
              className="text-xs font-bold text-slate-500 transition hover:text-teal-800"
            >
              مشاهده هر ۷ درس
            </a>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div>
              {previousLesson ? (
                <a
                  href={previousLesson.href}
                  className="flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-teal-300 hover:text-teal-800"
                >
                  <ArrowRight className="size-4" />
                  درس قبلی — درس {faNumber.format(previousLesson.index)}
                </a>
              ) : (
                <a
                  href="/learn#transcriptomics-foundations"
                  className="flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-teal-300 hover:text-teal-800"
                >
                  <ArrowRight className="size-4" />
                  بازگشت به مسیر مبانی
                </a>
              )}
            </div>

            <div>
              {nextLesson ? (
                <a
                  href={nextLesson.href}
                  className="flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
                >
                  درس بعدی — درس {faNumber.format(nextLesson.index)}
                  <ArrowLeft className="size-4" />
                </a>
              ) : (
                <a
                  href="/learn/rna-seq"
                  className="flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-teal-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-teal-800"
                >
                  ورود به مسیر تخصصی RNA-seq
                  <ArrowLeft className="size-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
