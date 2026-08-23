import { createFileRoute, notFound } from "@tanstack/react-router";
import {
  ArrowLeft,
  BookOpenCheck,
  ExternalLink,
  Route as RouteIcon,
  Target,
  Workflow,
} from "lucide-react";

import { GuidedPortalTour } from "@/features/data-resources/GuidedPortalTour";
import {
  domainLabels,
  getDataResource,
  resourceTypeLabels,
} from "@/features/data-resources/resource-catalog";

export const Route = createFileRoute("/resources/$slug")({
  loader: ({ params }) => {
    const resource = getDataResource(params.slug);
    if (!resource) throw notFound();

    return {
      title: resource.title,
      description: resource.description,
    };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "منبع داده یافت نشد | هاب‌ژن" },
          { name: "robots", content: "noindex" },
        ],
      };
    }

    return {
      meta: [
        { title: `${loaderData.title} | منابع داده هاب‌ژن` },
        { name: "description", content: loaderData.description },
      ],
    };
  },
  component: DataResourceDetailPage,
});

function DataResourceDetailPage() {
  const { slug } = Route.useParams();
  const resource = getDataResource(slug)!;
  const firstScreen = resource.screens?.[0];
  const guidedSteps = resource.guidedSteps?.filter(
    (step) => step.screenId === firstScreen?.id,
  );

  return (
    <main dir="rtl" className="min-h-screen bg-slate-50 text-right text-slate-900">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-18">
          <a
            href="/resources"
            className="inline-flex items-center gap-2 text-sm font-bold text-teal-700 transition hover:text-teal-900"
          >
            منابع داده هاب‌ژن
            <ArrowLeft className="size-4 rotate-180" />
          </a>

          <div className="mt-7 grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
            <div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-teal-50 px-3 py-1.5 text-xs font-bold text-teal-800">
                  {resourceTypeLabels[resource.resourceType]}
                </span>
                <span
                  className={[
                    "rounded-full px-3 py-1.5 text-xs font-bold",
                    resource.status === "active"
                      ? "bg-slate-950 text-white"
                      : "bg-amber-50 text-amber-800",
                  ].join(" ")}
                >
                  {resource.status === "active" ? "آموزش فعال" : "در صف توسعه"}
                </span>
              </div>

              <h1 className="mt-5 text-4xl font-black leading-tight text-slate-950 sm:text-5xl">
                {resource.shortTitle}
              </h1>
              <p dir="ltr" className="mt-2 text-left text-sm font-bold text-teal-700">
                {resource.title}
              </p>
              <p className="mt-6 max-w-3xl text-lg leading-9 text-slate-600">
                {resource.description}
              </p>

              <div className="mt-7 flex flex-wrap gap-2">
                {resource.domains.map((domain) => (
                  <span
                    key={domain}
                    className="rounded-lg border border-teal-100 bg-teal-50 px-3 py-1.5 text-xs font-bold text-teal-800"
                  >
                    {domainLabels[domain]}
                  </span>
                ))}
                {resource.topics.map((topic) => (
                  <span
                    key={topic}
                    className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>

            <aside className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <p className="text-xs font-black text-slate-500">ارائه‌دهنده</p>
              <p className="mt-2 font-bold text-slate-900">{resource.organization}</p>

              <div className="mt-5 border-t border-slate-200 pt-5">
                <p className="text-xs font-black text-slate-500">نوع داده / فناوری مرتبط</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {resource.modalities.map((modality) => (
                    <span
                      key={modality}
                      className="rounded-lg bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 shadow-sm"
                    >
                      {modality}
                    </span>
                  ))}
                </div>
              </div>

              <a
                href={resource.externalUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-bold text-white transition hover:bg-slate-800"
              >
                ورود به منبع اصلی
                <ExternalLink className="size-4" />
              </a>
            </aside>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-2">
          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                <Target className="size-5" />
              </div>
              <h2 className="text-xl font-black text-slate-950">این منبع برای چه کاری مناسب است؟</h2>
            </div>
            <ul className="mt-5 space-y-3">
              {resource.bestFor.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm leading-7 text-slate-600">
                  <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-teal-600" />
                  {item}
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
                <RouteIcon className="size-5" />
              </div>
              <h2 className="text-xl font-black text-slate-950">این آموزش کجای هاب‌ژن استفاده می‌شود؟</h2>
            </div>

            {resource.relatedLearning.length ? (
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {resource.relatedLearning.map((relation) => (
                  <a
                    key={`${relation.href}-${relation.label}`}
                    href={relation.href}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-bold text-slate-800 transition hover:border-teal-300 hover:bg-teal-50"
                  >
                    {relation.label}
                  </a>
                ))}
              </div>
            ) : (
              <p className="mt-5 text-sm leading-7 text-slate-500">
                اتصال این Resource به مسیرهای آموزشی در مرحله توسعه محتوای آن مشخص می‌شود.
              </p>
            )}
          </article>
        </div>
      </section>

      {firstScreen && guidedSteps?.length ? (
        <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
          <GuidedPortalTour
            resourceTitle={resource.shortTitle}
            externalUrl={resource.externalUrl}
            screen={firstScreen}
            steps={guidedSteps}
          />
        </section>
      ) : (
        <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center">
            <BookOpenCheck className="mx-auto size-7 text-slate-400" />
            <h2 className="mt-4 text-xl font-black text-slate-900">تور تعاملی این منبع هنوز منتشر نشده است.</h2>
            <p className="mx-auto mt-2 max-w-2xl text-sm leading-7 text-slate-500">
              ساختار صفحه آماده است و محتوا با همان Resource Learning Engine اضافه خواهد شد.
            </p>
          </div>
        </section>
      )}

      {resource.guidedTasks?.length ? (
        <section className="border-y border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="mb-7 max-w-3xl">
              <p className="text-sm font-bold text-teal-700">Guided Tasks</p>
              <h2 className="mt-2 text-3xl font-black text-slate-950">
                یادگیری با یک مأموریت واقعی
              </h2>
              <p className="mt-3 text-sm leading-8 text-slate-600">
                بعد از شناخت رابط، آموزش از «این دکمه چیست؟» به «برای حل این مسئله چه مسیری را باید طی کنم؟» تغییر می‌کند.
              </p>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              {resource.guidedTasks.map((task) => (
                <article key={task.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-6 sm:p-7">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-slate-950 text-white">
                      <Workflow className="size-5" />
                    </div>
                    <h3 className="text-xl font-black text-slate-950">{task.title}</h3>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-slate-600">{task.description}</p>

                  <ol className="mt-5 space-y-3">
                    {task.steps.map((step, index) => (
                      <li key={step} className="flex items-start gap-3 text-sm leading-7 text-slate-700">
                        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-white text-xs font-black text-teal-700 shadow-sm">
                          {index + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>

                  <div className="mt-6 rounded-2xl border border-teal-100 bg-teal-50 p-4">
                    <p className="text-xs font-black text-teal-900">خروجی یادگیری</p>
                    <p className="mt-2 text-sm leading-7 text-teal-950/80">{task.outcome}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-slate-950 p-7 text-white sm:p-9">
          <p className="text-sm font-bold text-teal-300">اصل معماری</p>
          <h2 className="mt-3 text-2xl font-black">یک Resource، یک مرجع آموزشی، چند اتصال علمی</h2>
          <p className="mt-4 max-w-4xl text-sm leading-8 text-slate-300">
            محتوای {resource.shortTitle} در همین صفحه مرجع نگهداری می‌شود. مسیرهای RNA-seq، Genomics، Proteomics یا سایر حوزه‌ها فقط به بخش مناسب این Resource ارجاع می‌دهند؛ بنابراین محتوای تکراری و نسخه‌های ناسازگار ایجاد نمی‌شود.
          </p>
        </div>
      </section>
    </main>
  );
}
