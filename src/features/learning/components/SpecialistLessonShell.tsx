import type { ReactNode } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
} from "lucide-react";

import {
  getLearningDomain,
  getSpecialistLesson,
  getSpecialistTrack,
} from "@/features/learning/learning-catalog";

type SpecialistLessonShellProps = {
  domainId: string;
  trackId: string;
  lessonIndex: number;
  title: string;
  subtitle: string;
  currentScene: number;
  sceneCount: number;
  sceneLabel: string;
  children: ReactNode;
};

export function SpecialistLessonShell({
  domainId,
  trackId,
  lessonIndex,
  title,
  subtitle,
  currentScene,
  sceneCount,
  sceneLabel,
  children,
}: SpecialistLessonShellProps) {
  const domain = getLearningDomain(domainId);
  const track = getSpecialistTrack(domainId, trackId);
  const lesson = getSpecialistLesson(domainId, trackId, lessonIndex);
  const previousLesson = getSpecialistLesson(
    domainId,
    trackId,
    lessonIndex - 1,
  );
  const nextLesson = getSpecialistLesson(
    domainId,
    trackId,
    lessonIndex + 1,
  );

  if (!domain || !track || !lesson) {
    return <>{children}</>;
  }

  const faNumber = new Intl.NumberFormat("fa-IR");
  const scenePercent = Math.round(
    ((currentScene + 1) / sceneCount) * 100,
  );
  const trackPercent = Math.round(
    (lessonIndex / track.lessons.length) * 100,
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
            <a
              href={domain.href}
              className="font-semibold text-slate-600 transition hover:text-teal-800"
            >
              {domain.title}
            </a>
            <span className="text-slate-300">/</span>
            <a
              href={track.href}
              className="font-semibold text-slate-700 transition hover:text-teal-800"
            >
              {track.title}
            </a>
          </div>

          <a
            href={track.href}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-teal-300 hover:text-teal-800"
          >
            مشاهده نقشه مسیر
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
                  {track.title}
                </span>
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-500">
                  درس {faNumber.format(lessonIndex)} از {faNumber.format(track.lessons.length)}
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
                    پیشرفت در مسیر تخصصی
                  </p>
                  <p className="mt-2 text-2xl font-black">
                    {faNumber.format(lessonIndex)} از {faNumber.format(track.lessons.length)}
                  </p>
                </div>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-300">
                  {sceneLabel}
                </span>
              </div>

              <div className="mt-5">
                <div className="mb-2 flex items-center justify-between text-[11px] text-slate-400">
                  <span>پیشرفت همین درس</span>
                  <span>{faNumber.format(scenePercent)}٪</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-teal-400 transition-all duration-500"
                    style={{ width: `${scenePercent}%` }}
                  />
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-[11px] text-slate-400">
                  اصل این درس
                </p>
                <p className="mt-2 text-sm font-bold leading-7 text-white">
                  {lesson.principle}
                </p>
              </div>

              <div className="mt-4">
                <div className="mb-2 flex items-center justify-between text-[11px] text-slate-400">
                  <span>پیشرفت کل مسیر</span>
                  <span>{faNumber.format(trackPercent)}٪</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-cyan-400/70"
                    style={{ width: `${trackPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-3xl border border-slate-200 bg-white/90 p-4 shadow-sm backdrop-blur sm:p-5">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-bold text-slate-500">
                درس‌های مسیر
              </span>
              <div className="flex flex-wrap gap-2">
                {track.lessons.map((item) =>
                  item.href ? (
                    <a
                      key={item.slug}
                      href={item.href}
                      title={item.title}
                      className={[
                        "inline-flex min-h-9 items-center rounded-full border px-3 py-1.5 text-xs font-bold transition",
                        item.index === lessonIndex
                          ? "border-teal-600 bg-teal-600 text-white"
                          : "border-slate-200 bg-white text-slate-600 hover:border-teal-300 hover:text-teal-800",
                      ].join(" ")}
                    >
                      درس {faNumber.format(item.index)}
                    </a>
                  ) : (
                    <span
                      key={item.slug}
                      title={`${item.title} — در حال توسعه`}
                      className="inline-flex min-h-9 items-center rounded-full border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-400"
                    >
                      درس {faNumber.format(item.index)}
                    </span>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {children}

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
                    جابه‌جایی بین درس‌های مسیر
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    درس {faNumber.format(lessonIndex)} از {faNumber.format(track.lessons.length)}
                  </p>
                </div>
              </div>

              <a
                href={track.href}
                className="text-xs font-bold text-slate-500 transition hover:text-teal-800"
              >
                مشاهده نقشه مسیر
              </a>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div>
                {previousLesson?.href ? (
                  <a
                    href={previousLesson.href}
                    className="flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-teal-300 hover:text-teal-800"
                  >
                    <ArrowRight className="size-4" />
                    درس قبلی — درس {faNumber.format(previousLesson.index)}
                  </a>
                ) : (
                  <a
                    href={track.href}
                    className="flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-teal-300 hover:text-teal-800"
                  >
                    <ArrowRight className="size-4" />
                    بازگشت به نقشه مسیر
                  </a>
                )}
              </div>

              <div>
                {nextLesson?.href ? (
                  <a
                    href={nextLesson.href}
                    className="flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
                  >
                    درس بعدی — درس {faNumber.format(nextLesson.index)}
                    <ArrowLeft className="size-4" />
                  </a>
                ) : nextLesson ? (
                  <div className="flex min-h-14 items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 px-5 py-3 text-sm font-bold text-slate-400">
                    درس {faNumber.format(nextLesson.index)} در حال توسعه است
                  </div>
                ) : (
                  <a
                    href={domain.href}
                    className="flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-teal-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-teal-800"
                  >
                    بازگشت به {domain.title}
                    <ArrowLeft className="size-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
