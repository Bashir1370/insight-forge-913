import type { ReactNode } from "react";

type InteractiveLessonShellProps = {
  code: string;
  total: number;
  title: string;
  englishTitle: string;
  subtitle: string;
  currentScene: number;
  sceneCount: number;
  sceneLabel: string;
  children: ReactNode;
};

export function InteractiveLessonShell({
  code,
  total,
  title,
  englishTitle,
  subtitle,
  currentScene,
  sceneCount,
  sceneLabel,
  children,
}: InteractiveLessonShellProps) {
  const foundationPercent = Math.round(
    (Number(code.replace(/\D/g, "")) / total) * 100,
  );

  const lessonPercent = Math.round(
    ((currentScene + 1) / sceneCount) * 100,
  );

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

            <span className="font-semibold text-slate-900">
              مبانی
            </span>
          </div>

          <a
            href="/learn"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-teal-300 hover:text-teal-800"
          >
            بازگشت به آموزش‌ها
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

                <span
                  dir="ltr"
                  className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-500"
                >
                  Transcriptomics Foundations
                </span>
              </div>

              <h1 className="mt-5 text-3xl font-black leading-[1.45] text-slate-950 sm:text-5xl">
                {title}
              </h1>

              <p
                dir="ltr"
                className="mt-2 text-left text-sm font-semibold text-teal-700"
              >
                {englishTitle}
              </p>

              <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600 sm:text-lg">
                {subtitle}
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white shadow-xl">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs text-slate-400">
                    جایگاه شما در Foundations
                  </p>

                  <p className="mt-2 text-2xl font-black">
                    {code} از {new Intl.NumberFormat("fa-IR").format(total)}
                  </p>
                </div>

                <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-300">
                  {sceneLabel}
                </span>
              </div>

              <div className="mt-5">
                <div className="mb-2 flex items-center justify-between text-[11px] text-slate-400">
                  <span>پیشرفت همین درس</span>
                  <span>
                    {new Intl.NumberFormat("fa-IR").format(lessonPercent)}٪
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-teal-400 transition-all duration-500"
                    style={{
                      width: `${lessonPercent}%`,
                    }}
                  />
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-[11px] text-slate-400">
                  اصل این درس
                </p>

                <p className="mt-2 text-sm font-bold leading-7 text-white">
                  Genome ≠ Transcriptome
                </p>
              </div>

              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-cyan-400/70"
                  style={{
                    width: `${foundationPercent}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {children}
    </main>
  );
}
