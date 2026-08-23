import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowLeft,
  Database,
  Layers3,
  Search,
  Sparkles,
} from "lucide-react";
import { useMemo, useState } from "react";

import {
  dataResources,
  domainLabels,
  resourceTypeLabels,
  type OmicsDomain,
  type ResourceType,
} from "@/features/data-resources/resource-catalog";

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: "منابع داده زیستی | هاب‌ژن" },
      {
        name: "description",
        content:
          "راهنمای تعاملی هاب‌ژن برای یادگیری پایگاه‌های داده، مخازن، پورتال‌ها و مرورگرهای مهم علوم زیستی.",
      },
    ],
  }),
  component: DataResourcesPage,
});

const domainOptions: Array<{ value: "all" | OmicsDomain; label: string }> = [
  { value: "all", label: "همه حوزه‌ها" },
  { value: "transcriptomics", label: "ترنسکریپتومیکس" },
  { value: "genomics", label: "ژنومیکس" },
  { value: "proteomics", label: "پروتئومیکس" },
  { value: "epigenomics", label: "اپی‌ژنومیکس" },
  { value: "metabolomics", label: "متابولومیکس" },
  { value: "cross-omics", label: "چندحوزه‌ای" },
];

const typeOptions: Array<{ value: "all" | ResourceType; label: string }> = [
  { value: "all", label: "همه انواع" },
  { value: "data-portal", label: "پورتال داده" },
  { value: "repository", label: "مخزن داده" },
  { value: "archive", label: "آرشیو" },
  { value: "browser", label: "مرورگر داده" },
  { value: "knowledgebase", label: "دانش‌پایه" },
  { value: "database", label: "پایگاه داده" },
];

function DataResourcesPage() {
  const [query, setQuery] = useState("");
  const [domain, setDomain] = useState<"all" | OmicsDomain>("all");
  const [resourceType, setResourceType] = useState<"all" | ResourceType>("all");

  const filteredResources = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();

    return dataResources.filter((resource) => {
      const matchesDomain = domain === "all" || resource.domains.includes(domain);
      const matchesType = resourceType === "all" || resource.resourceType === resourceType;
      const haystack = [
        resource.title,
        resource.shortTitle,
        resource.organization,
        resource.description,
        ...resource.topics,
        ...resource.modalities,
      ]
        .join(" ")
        .toLocaleLowerCase();
      const matchesQuery = !normalizedQuery || haystack.includes(normalizedQuery);

      return matchesDomain && matchesType && matchesQuery;
    });
  }, [domain, query, resourceType]);

  const activeCount = dataResources.filter((resource) => resource.status === "active").length;

  return (
    <main dir="rtl" className="min-h-screen bg-slate-50 text-right text-slate-900">
      <section className="relative overflow-hidden border-b border-slate-200 bg-white">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-24 -top-28 h-80 w-80 rounded-full bg-teal-100/70 blur-3xl" />
          <div className="absolute -left-24 top-14 h-72 w-72 rounded-full bg-sky-100/70 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-4 py-2 text-sm font-bold text-teal-800">
              <Database className="size-4" />
              Data Resources
            </div>

            <h1 className="mt-6 text-4xl font-black leading-[1.35] text-slate-950 sm:text-5xl">
              پایگاه داده را فقط پیدا نکنید؛
              <span className="text-teal-700"> یاد بگیرید چطور از آن استفاده کنید.</span>
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-9 text-slate-600">
              این بخش خانه مستقل پورتال‌ها، مخازن، آرشیوها، مرورگرها و دانش‌پایه‌های مهم علوم زیستی است.
              هر منبع یک‌بار آموزش داده می‌شود و از مسیرهای Transcriptomics، Genomics، Proteomics و سایر حوزه‌ها به آن وصل می‌شویم.
            </p>

            <div className="mt-9 grid max-w-3xl gap-3 sm:grid-cols-3">
              <Metric value={String(dataResources.length)} label="منبع در نقشه اولیه" />
              <Metric value={String(activeCount)} label="تور تعاملی فعال" />
              <Metric value="Reusable" label="یک موتور برای همه Omics" />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          <ArchitectureCard
            icon={<Layers3 className="size-5" />}
            title="یک محل اصلی"
            description="هر Resource فقط یک محتوای مرجع دارد؛ آموزش در چند مسیر کپی نمی‌شود."
          />
          <ArchitectureCard
            icon={<Sparkles className="size-5" />}
            title="چند مسیر ورود"
            description="همان GDC می‌تواند از RNA-seq، Genomics و Cancer Research پیشنهاد شود."
          />
          <ArchitectureCard
            icon={<Database className="size-5" />}
            title="آموزش کارمحور"
            description="هدف معرفی دکمه‌ها نیست؛ کاربر برای یک سؤال واقعی یاد می‌گیرد کجا کلیک کند و چرا."
          />
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-bold text-teal-700">Resource Explorer</p>
              <h2 className="mt-2 text-3xl font-black text-slate-950">
                منبع مناسب را بر اساس نیاز پژوهش پیدا کنید
              </h2>
            </div>

            <div className="grid w-full gap-3 sm:grid-cols-3 lg:max-w-3xl">
              <label className="relative block">
                <span className="sr-only">جست‌وجو</span>
                <Search className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="مثلاً RNA-seq یا Cancer"
                  className="h-11 w-full rounded-xl border border-slate-300 bg-white pr-10 pl-3 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/15"
                />
              </label>

              <select
                value={domain}
                onChange={(event) => setDomain(event.target.value as "all" | OmicsDomain)}
                className="h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/15"
              >
                {domainOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <select
                value={resourceType}
                onChange={(event) => setResourceType(event.target.value as "all" | ResourceType)}
                className="h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/15"
              >
                {typeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-5 flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-slate-600">
            {filteredResources.length} منبع مطابق فیلتر فعلی
          </p>
          <p className="text-xs text-slate-400">Active = دارای آموزش تعاملی هاب‌ژن</p>
        </div>

        {filteredResources.length ? (
          <div className="grid gap-5 lg:grid-cols-2">
            {filteredResources.map((resource) => (
              <article
                key={resource.id}
                className="flex flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-7"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                        {resourceTypeLabels[resource.resourceType]}
                      </span>
                      <span
                        className={[
                          "rounded-full px-3 py-1 text-xs font-bold",
                          resource.status === "active"
                            ? "bg-teal-700 text-white"
                            : "bg-amber-50 text-amber-800",
                        ].join(" ")}
                      >
                        {resource.status === "active" ? "آموزش فعال" : "در صف توسعه"}
                      </span>
                    </div>

                    <h3 className="mt-4 text-2xl font-black text-slate-950">
                      {resource.shortTitle}
                    </h3>
                    <p dir="ltr" className="mt-1 text-left text-xs font-semibold text-slate-500">
                      {resource.title}
                    </p>
                  </div>

                  <span className="text-xs font-semibold text-slate-400">
                    {resource.organization}
                  </span>
                </div>

                <p className="mt-5 text-sm leading-8 text-slate-600">
                  {resource.description}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {resource.domains.map((item) => (
                    <span
                      key={item}
                      className="rounded-lg border border-teal-100 bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-800"
                    >
                      {domainLabels[item]}
                    </span>
                  ))}
                  {resource.modalities.slice(0, 3).map((item) => (
                    <span
                      key={item}
                      className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-600"
                    >
                      {item}
                    </span>
                  ))}
                </div>

                <div className="mt-auto border-t border-slate-100 pt-6">
                  {resource.status === "active" ? (
                    <a
                      href={`/resources/${resource.slug}`}
                      className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-bold text-white transition hover:bg-slate-800"
                    >
                      ورود به آموزش {resource.shortTitle}
                      <ArrowLeft className="size-4" />
                    </a>
                  ) : (
                    <p className="text-sm font-semibold text-slate-400">
                      این Resource با همان موتور GDC در مراحل بعدی فعال می‌شود.
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <p className="font-bold text-slate-800">منبعی با این فیلتر پیدا نشد.</p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setDomain("all");
                setResourceType("all");
              }}
              className="mt-4 text-sm font-bold text-teal-700 hover:text-teal-900"
            >
              پاک کردن فیلترها
            </button>
          </div>
        )}
      </section>
    </main>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 backdrop-blur">
      <p className="text-lg font-black text-slate-950">{value}</p>
      <p className="mt-1 text-xs font-semibold text-slate-500">{label}</p>
    </div>
  );
}

function ArchitectureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex size-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
        {icon}
      </div>
      <h2 className="mt-4 text-lg font-black text-slate-950">{title}</h2>
      <p className="mt-2 text-sm leading-7 text-slate-600">{description}</p>
    </div>
  );
}
