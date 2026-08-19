import {
  ArrowLeft,
  BookOpen,
  CircleCheck,
  Clock3,
} from "lucide-react";

import type {
  LearningDomain,
  SpecialistLesson,
  SpecialistTrack,
} from "@/features/learning/learning-catalog";

export function SpecialistTrackHome({
  domain,
  track,
}: {
  domain: LearningDomain;
  track: SpecialistTrack;
}) {
  const activeLessons = track.lessons.filter(
    (lesson) => lesson.status === "active",
  );

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-slate-50 text-right text-slate-900"
    >
      <section className="relative overflow-hidden border-b border-slate-200 bg-white">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-28 -top-28 h-80 w-80 rounded-full bg-teal-100/70 blur-3xl" />
          <div className="absolute -left-24 top-12 h-72 w-72 rounded-full bg-cyan-100/60 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-18">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <a
              href="/learn"
              className="font-bold text-teal-700 transition hover:text-teal-900"
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
            <span className="font-bold text-slate-900">
              {track.title}
            </span>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_0.55fr] lg:items-start">
            <div>
              <span className="inline-flex rounded-full bg-teal-50 px-3 py-1.5 text-xs font-bold text-teal-700">
                مسیر تخصصی
              </span>
              <h1 className="mt-4 text-4xl font-black leading-tight text-slate-950 sm:text-5xl">
                {track.title}
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-9 text-slate-600">
                {track.description}
              </p>

              <div className="mt-7 rounded-2xl border border-teal-200 bg-teal-50 p-5">
                <p className="text-xs font-bold text-teal-700">
                  سؤال راهنمای مسیر
                </p>
                <p className="mt-2 font-bold leading-8 text-teal-950">
                  {track.guidingQuestion}
                </p>
              </div>

              {activeLessons[0]?.href && (
                <a
                  href={activeLessons[0].href}
                  className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-xl bg-slate-950 px-6 py-3 font-bold text-white transition hover:bg-slate-800"
                >
                  شروع مسیر از درس ۱
                  <ArrowLeft className="size-4" />
                </a>
              )}
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white shadow-xl">
              <p className="text-xs font-bold text-teal-300">
                نقشه مسیر
              </p>
              <p className="mt-3 text-3xl font-black">
                {new Intl.NumberFormat("fa-IR").format(track.lessons.length)} درس
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                درس‌ها به ترتیب از طراحی پژوهش تا تفسیر زیستی و پروژه یکپارچه چیده شده‌اند.
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {track.topics.map((topic) => (
                  <span
                    key={topic}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-7 flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
            <BookOpen className="size-5" />
          </span>
          <div>
            <p className="text-xs font-bold text-teal-700">
              برنامه آموزشی
            </p>
            <h2 className="mt-1 text-2xl font-black text-slate-950">
              درس‌های این مسیر
            </h2>
          </div>
        </div>

        <div className="space-y-4">
          {track.lessons.map((lesson) => (
            <LessonCard key={lesson.slug} lesson={lesson} />
          ))}
        </div>
      </section>
    </main>
  );
}

function LessonCard({ lesson }: { lesson: SpecialistLesson }) {
  const active = lesson.status === "active";
  const faNumber = new Intl.NumberFormat("fa-IR");

  return (
    <article
      className={[
        "rounded-3xl border p-5 sm:p-6",
        active
          ? "border-teal-300 bg-white shadow-sm"
          : "border-slate-200 bg-slate-100/70",
      ].join(" ")}
    >
      <div className="grid gap-5 sm:grid-cols-[auto_1fr_auto] sm:items-center">
        <span
          className={[
            "flex size-12 items-center justify-center rounded-2xl text-sm font-black",
            active
              ? "bg-slate-950 text-white"
              : "bg-slate-200 text-slate-500",
          ].join(" ")}
        >
          {faNumber.format(lesson.index)}
        </span>

        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p
              className={
                active
                  ? "text-xs font-bold text-teal-700"
                  : "text-xs font-bold text-slate-400"
              }
            >
              درس {faNumber.format(lesson.index)}
            </p>
            <span
              className={[
                "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold",
                active
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-slate-200 text-slate-500",
              ].join(" ")}
            >
              {active ? (
                <CircleCheck className="size-3" />
              ) : (
                <Clock3 className="size-3" />
              )}
              {active ? "فعال" : "در حال توسعه"}
            </span>
          </div>

          <h3
            className={[
              "mt-1 text-xl font-black",
              active ? "text-slate-950" : "text-slate-600",
            ].join(" ")}
          >
            {lesson.title}
          </h3>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            {lesson.summary}
          </p>
        </div>

        {active && lesson.href ? (
          <a
            href={lesson.href}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-teal-800"
          >
            ورود به درس
            <ArrowLeft className="size-4" />
          </a>
        ) : (
          <span className="text-center text-xs font-semibold text-slate-400">
            به‌زودی
          </span>
        )}
      </div>
    </article>
  );
}
