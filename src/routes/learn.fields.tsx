import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

import {
  learningDomains,
  type LearningDomain,
} from "@/features/learning/learning-catalog";

export const Route = createFileRoute("/learn/fields")({
  component: LearningFieldsPage,
});

function LearningFieldsPage() {
  return (
    <main
      dir="rtl"
      className="min-h-screen bg-slate-50 text-right text-slate-900"
    >
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-4xl">
            <a
              href="/learn"
              className="text-sm font-bold text-teal-700 transition hover:text-teal-900"
            >
              آموزش هاب‌ژن
            </a>

            <h1 className="mt-5 text-4xl font-black leading-tight text-slate-950 sm:text-5xl">
              حوزه‌های آموزشی هاب‌ژن
            </h1>

            <p className="mt-5 max-w-3xl text-lg leading-9 text-slate-600">
              هر حوزه یک خانه مستقل دارد و می‌تواند در آینده شامل مبانی،
              مسیرهای تخصصی، پروژه‌های تمرینی و زیرشاخه‌های جدید باشد.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-18">
        <div className="grid gap-6 lg:grid-cols-2">
          {learningDomains.map((domain) => (
            <DomainCard key={domain.id} domain={domain} />
          ))}
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
            <p className="text-sm font-bold text-teal-700">
              معماری قابل توسعه
            </p>

            <p className="mt-3 max-w-4xl leading-8 text-slate-600">
              اضافه شدن یک مسیر تخصصی جدید در آینده نیازمند ساخت دوباره
              صفحه آموزش نیست؛ مسیر جدید در خانه همان حوزه اضافه می‌شود.
              همین الگو برای پروتئومیکس، ژنومیکس، اپی‌ژنومیکس و
              متابولومیکس نیز قابل استفاده است.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

function DomainCard({
  domain,
}: {
  domain: LearningDomain;
}) {
  const active = domain.status === "active";

  return (
    <article
      className={[
        "overflow-hidden rounded-3xl border bg-white shadow-sm",
        active
          ? "border-teal-300 ring-1 ring-teal-100"
          : "border-slate-200",
      ].join(" ")}
    >
      <div className="p-7 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-black text-slate-950">
              {domain.title}
            </h2>

            <p
              dir="ltr"
              className="mt-1 text-left text-xs font-semibold text-teal-700"
            >
              {domain.englishTitle}
            </p>
          </div>

          <span
            className={[
              "rounded-full px-3 py-1.5 text-xs font-bold",
              active
                ? "bg-teal-700 text-white"
                : "bg-slate-100 text-slate-500",
            ].join(" ")}
          >
            {active ? "فعال" : "در حال توسعه"}
          </span>
        </div>

        <p className="mt-6 text-lg font-bold leading-8 text-slate-900">
          {domain.guidingQuestion}
        </p>

        <p className="mt-4 text-sm leading-8 text-slate-600">
          {domain.description}
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {domain.topics.map((topic) => (
            <span
              key={topic}
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600"
            >
              {topic}
            </span>
          ))}
        </div>

        <div className="mt-7 border-t border-slate-100 pt-6">
          {active && domain.href ? (
            <a
              href={domain.href}
              className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800"
            >
              ورود به {domain.title}
              <ArrowLeft className="size-4" />
            </a>
          ) : (
            <p className="text-sm font-semibold text-slate-400">
              ساختار این حوزه آماده توسعه در مرحله بعد است.
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
