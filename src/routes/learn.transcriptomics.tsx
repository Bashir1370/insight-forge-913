import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowLeft,
  BookOpen,
  Layers3,
} from "lucide-react";

import {
  transcriptomicsFoundationLessons,
  transcriptomicsSpecialistTracks,
} from "@/features/learning/learning-catalog";

export const Route = createFileRoute("/learn/transcriptomics")({
  component: TranscriptomicsLearningHub,
});

function TranscriptomicsLearningHub() {
  return (
    <main
      dir="rtl"
      className="min-h-screen bg-slate-50 text-right text-slate-900"
    >
      <section className="relative overflow-hidden border-b border-slate-200 bg-white">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-28 -top-28 h-80 w-80 rounded-full bg-teal-100/70 blur-3xl" />
          <div className="absolute -left-20 top-16 h-72 w-72 rounded-full bg-cyan-100/50 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-4xl">
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <a
                href="/learn"
                className="font-bold text-teal-700 transition hover:text-teal-900"
              >
                آموزش هاب‌ژن
              </a>

              <span className="text-slate-300">/</span>

              <a
                href="/learn/fields"
                className="font-semibold text-slate-500 transition hover:text-teal-800"
              >
                حوزه‌های آموزشی
              </a>

              <span className="text-slate-300">/</span>

              <span className="font-bold text-slate-900">
                ترنسکریپتومیکس
              </span>
            </div>

            <span className="mt-7 inline-flex rounded-full bg-teal-50 px-3 py-1.5 text-xs font-bold text-teal-700">
              حوزه آموزشی فعال
            </span>

            <h1 className="mt-4 text-4xl font-black leading-tight text-slate-950 sm:text-5xl">
              ترنسکریپتومیکس
            </h1>

            <p className="mt-5 max-w-3xl text-lg leading-9 text-slate-600">
              ابتدا مبانی را بسازید؛ سپس بر اساس سؤال پژوهشی وارد مسیر
              تخصصی مناسب شوید. این صفحه خانه همه آموزش‌های
              ترنسکریپتومیکس هاب‌ژن است.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-18">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                <BookOpen className="size-5" />
              </span>

              <div>
                <p className="text-sm font-bold text-teal-700">
                  نقطه شروع
                </p>

                <h2 className="mt-1 text-3xl font-black text-slate-950">
                  مبانی ترنسکریپتومیکس
                </h2>
              </div>
            </div>

            <p className="mt-5 leading-8 text-slate-600">
              هفت درس به‌ترتیب طراحی شده‌اند تا قبل از ورود به
              فناوری‌ها و تحلیل تخصصی، یک نقشه ذهنی منسجم بسازید.
            </p>
          </div>

          <a
            href={transcriptomicsFoundationLessons[0].href}
            className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-teal-700 px-6 py-3 font-bold text-white transition hover:bg-teal-800"
          >
            شروع از درس ۱
            <ArrowLeft className="size-4" />
          </a>
        </div>

        <div className="mt-9 space-y-4">
          {transcriptomicsFoundationLessons.map((lesson) => (
            <FoundationLessonCard
              key={lesson.slug}
              index={lesson.index}
              title={lesson.title}
              summary={lesson.summary}
              href={lesson.href}
            />
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-18">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-2xl bg-slate-950 text-white">
                <Layers3 className="size-5" />
              </span>

              <div>
                <p className="text-sm font-bold text-teal-700">
                  بعد از مبانی
                </p>

                <h2 className="mt-1 text-3xl font-black text-slate-950">
                  مسیرهای تخصصی ترنسکریپتومیکس
                </h2>
              </div>
            </div>

            <p className="mt-5 leading-8 text-slate-600">
              هر مسیر تخصصی می‌تواند در آینده مجموعه درس‌ها، تمرین‌ها،
              پروژه‌ها و زیرشاخه‌های مستقل خودش را داشته باشد.
            </p>
          </div>

          <div className="mt-9 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {transcriptomicsSpecialistTracks.map((track) => (
              <SpecialistTrackCard
                key={track.id}
                title={track.title}
                description={track.description}
                status={track.status}
                href={track.href}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <a
          href="/learn/fields"
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 transition hover:text-teal-800"
        >
          <span>بازگشت به حوزه‌های آموزشی</span>
        </a>
      </section>
    </main>
  );
}

function FoundationLessonCard({
  index,
  title,
  summary,
  href,
}: {
  index: number;
  title: string;
  summary: string;
  href: string;
}) {
  const faNumber = new Intl.NumberFormat("fa-IR");

  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-teal-300 sm:p-6">
      <div className="grid gap-5 sm:grid-cols-[auto_1fr_auto] sm:items-center">
        <span className="flex size-12 items-center justify-center rounded-2xl bg-slate-950 text-sm font-black text-white">
          {faNumber.format(index)}
        </span>

        <div>
          <p className="text-xs font-bold text-teal-700">
            درس {faNumber.format(index)}
          </p>

          <h3 className="mt-1 text-xl font-black text-slate-950">
            {title}
          </h3>

          <p className="mt-2 text-sm leading-7 text-slate-600">
            {summary}
          </p>
        </div>

        <a
          href={href}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-teal-300 hover:text-teal-800"
        >
          ورود به درس
          <ArrowLeft className="size-4" />
        </a>
      </div>
    </article>
  );
}

function SpecialistTrackCard({
  title,
  description,
  status,
  href,
}: {
  title: string;
  description: string;
  status: "active" | "developing";
  href?: string;
}) {
  const active = status === "active";

  return (
    <article
      className={[
        "rounded-3xl border p-6",
        active
          ? "border-teal-300 bg-teal-50"
          : "border-slate-200 bg-slate-50",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-black text-slate-950">
          {title}
        </h3>

        <span
          className={[
            "shrink-0 rounded-full px-3 py-1 text-[11px] font-bold",
            active
              ? "bg-teal-700 text-white"
              : "bg-slate-200 text-slate-500",
          ].join(" ")}
        >
          {active ? "فعال" : "در حال توسعه"}
        </span>
      </div>

      <p className="mt-4 text-sm leading-7 text-slate-600">
        {description}
      </p>

      {active && href && (
        <a
          href={href}
          className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800"
        >
          ورود به مسیر
          <ArrowLeft className="size-4" />
        </a>
      )}
    </article>
  );
}
