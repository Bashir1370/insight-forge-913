import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import {
  getLearningDomain,
  learningDomains,
} from "@/features/learning/learning-catalog";

export const Route = createFileRoute("/learn")({
  component: HubGeneLearnPage,
});

const interestOptions = [
  {
    id: "transcriptomics",
    title: "RNA و بیان ژن",
    description:
      "می‌خواهم بفهمم بیان ژن‌ها، RNA و پاسخ سلول یا بافت چگونه تغییر می‌کنند.",
  },
  {
    id: "proteomics",
    title: "پروتئین‌ها",
    description:
      "می‌خواهم فراوانی پروتئین‌ها یا تغییرات پروتئومی را بررسی کنم.",
  },
  {
    id: "genomics",
    title: "DNA و واریانت‌ها",
    description:
      "می‌خواهم تغییرات ژنتیکی، واریانت‌ها و ساختار ژنوم را بررسی کنم.",
  },
  {
    id: "epigenomics",
    title: "تنظیم اپی‌ژنتیکی",
    description:
      "به کروماتین، متیلاسیون و تنظیم فعالیت ژن‌ها علاقه دارم.",
  },
  {
    id: "metabolomics",
    title: "متابولیت‌ها و مسیرهای متابولیکی",
    description:
      "می‌خواهم تغییرات متابولیت‌ها و وضعیت متابولیکی را بررسی کنم.",
  },
  {
    id: "not-sure",
    title: "هنوز مطمئن نیستم",
    description:
      "می‌خواهم ابتدا پنج حوزه آموزشی را ببینم و بعد تصمیم بگیرم.",
  },
];

const purposeOptions = [
  {
    id: "learn",
    title: "فقط می‌خواهم یاد بگیرم",
  },
  {
    id: "project",
    title: "برای پایان‌نامه یا پروژه آمده‌ام",
  },
  {
    id: "data",
    title: "داده دارم ولی نمی‌دانم از کجا شروع کنم",
  },
  {
    id: "problem",
    title: "در یک تحلیل به مشکل خورده‌ام",
  },
];

const levelOptions = [
  {
    id: "beginner",
    title: "تقریباً از صفر",
  },
  {
    id: "developing",
    title: "کمی آشنا هستم",
  },
  {
    id: "experienced",
    title: "قبلاً تجربه داشته‌ام",
  },
];

function HubGeneLearnPage() {
  const [interest, setInterest] = useState("");
  const [purpose, setPurpose] = useState("");
  const [level, setLevel] = useState("");

  const hasAnswers = Boolean(interest && purpose && level);

  const recommendedDomain =
    hasAnswers && interest !== "not-sure"
      ? getLearningDomain(interest)
      : null;

  const optionClass = (active: boolean) =>
    [
      "w-full rounded-2xl border px-4 py-4 text-right transition-all duration-200",
      "focus:outline-none focus:ring-2 focus:ring-teal-500/30",
      active
        ? "border-teal-500 bg-teal-50 shadow-sm"
        : "border-slate-200 bg-white hover:border-teal-300 hover:bg-slate-50",
    ].join(" ");

  return (
    <main
      dir="rtl"
      className="min-h-screen overflow-hidden bg-slate-50 text-right text-slate-900"
    >
      <section className="relative border-b border-slate-200 bg-white">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-teal-100/70 blur-3xl" />
          <div className="absolute -left-20 top-24 h-72 w-72 rounded-full bg-cyan-100/50 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="max-w-4xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-4 py-2 text-sm font-medium text-teal-800">
              <span className="h-2 w-2 rounded-full bg-teal-500" />
              <span>آموزش هاب‌ژن</span>
            </div>

            <h1 className="max-w-4xl text-4xl font-bold leading-[1.4] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              زیست‌شناسی محاسباتی را از
              <span className="text-teal-700"> سؤال پژوهشی </span>
              یاد بگیرید، نه از فهرست ابزارها.
            </h1>

            <p className="mt-7 max-w-3xl text-lg leading-9 text-slate-600 sm:text-xl">
              ابتدا حوزه علمی و نوع سؤال را مشخص کنید؛ سپس مفاهیم،
              ساختار داده و مسیر تحلیل را مرحله‌به‌مرحله یاد بگیرید.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a
                href="#path-finder"
                className="inline-flex min-h-12 items-center justify-center rounded-xl bg-slate-950 px-6 py-3 font-semibold text-white transition hover:bg-slate-800"
              >
                مسیر مناسبم را پیدا کنم
              </a>

              <a
                href="/learn/fields"
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-800 transition hover:border-teal-400 hover:text-teal-800"
              >
                مشاهده حوزه‌های آموزشی
              </a>
            </div>

            <div className="mt-12 grid max-w-3xl gap-4 sm:grid-cols-3">
              <HeroStat value="۵" label="حوزه آموزشی اصلی" />
              <HeroStat value="سؤال‌محور" label="شروع از مسئله پژوهشی" />
              <HeroStat value="گسترش‌پذیر" label="مسیرهای آموزشی قابل توسعه" />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-3xl">
          <p className="text-sm font-semibold text-teal-700">
            معماری آموزش هاب‌ژن
          </p>

          <h2 className="mt-2 text-3xl font-bold text-slate-950">
            حوزه ← مبانی ← مسیر تخصصی
          </h2>

          <p className="mt-4 leading-8 text-slate-600">
            هر حوزه آموزشی یک خانه مستقل دارد. درون هر حوزه ابتدا مبانی
            قرار می‌گیرد و بعد می‌توان مسیرهای تخصصی جدید را بدون تغییر
            معماری اصلی اضافه کرد.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <JourneyCard
            title="۱. حوزه را انتخاب کنید"
            description="ابتدا مشخص کنید سؤال شما بیشتر به RNA، پروتئین، DNA، اپی‌ژنتیک یا متابولیت‌ها مربوط است."
          />

          <JourneyCard
            title="۲. مبانی را بسازید"
            description="واژگان، منطق اندازه‌گیری، طراحی مطالعه و نوع داده را پیش از ورود به ابزارها بفهمید."
          />

          <JourneyCard
            title="۳. وارد مسیر تخصصی شوید"
            description="پس از ساخت نقشه ذهنی، وارد فناوری یا مسیر تحلیلی متناسب با سؤال خود شوید."
          />
        </div>
      </section>

      <section
        id="path-finder"
        className="scroll-mt-8 border-y border-slate-200 bg-white"
      >
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <div className="sticky top-8">
                <span className="inline-flex rounded-full bg-teal-50 px-3 py-1 text-sm font-semibold text-teal-700">
                  راهنمای انتخاب حوزه
                </span>

                <h2 className="mt-5 text-3xl font-bold leading-tight text-slate-950">
                  هنوز نمی‌دانید از کدام حوزه شروع کنید؟
                </h2>

                <p className="mt-5 leading-8 text-slate-600">
                  سه سؤال کوتاه کمک می‌کند نقطه شروع مناسب‌تری در ساختار
                  آموزشی هاب‌ژن پیدا کنید.
                </p>

                <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <p className="font-semibold text-slate-900">
                    وضعیت انتخاب شما
                  </p>

                  <div className="mt-4 space-y-3">
                    <ProgressRow
                      done={Boolean(interest)}
                      label="موضوع مورد علاقه"
                    />

                    <ProgressRow
                      done={Boolean(purpose)}
                      label="هدف از ورود به هاب‌ژن"
                    />

                    <ProgressRow
                      done={Boolean(level)}
                      label="سطح آشنایی فعلی"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <PathFinderStep
                number="۱"
                title="بیشتر درباره چه چیزی کنجکاوید؟"
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  {interestOptions.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setInterest(option.id)}
                      className={optionClass(interest === option.id)}
                    >
                      <span className="block font-semibold text-slate-900">
                        {option.title}
                      </span>

                      <span className="mt-1 block text-sm leading-6 text-slate-500">
                        {option.description}
                      </span>
                    </button>
                  ))}
                </div>
              </PathFinderStep>

              <PathFinderStep
                number="۲"
                title="برای چه چیزی به هاب‌ژن آمده‌اید؟"
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  {purposeOptions.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setPurpose(option.id)}
                      className={optionClass(purpose === option.id)}
                    >
                      <span className="font-semibold text-slate-900">
                        {option.title}
                      </span>
                    </button>
                  ))}
                </div>
              </PathFinderStep>

              <PathFinderStep
                number="۳"
                title="سطح آشنایی فعلی شما چقدر است؟"
              >
                <div className="grid gap-3 sm:grid-cols-3">
                  {levelOptions.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setLevel(option.id)}
                      className={optionClass(level === option.id)}
                    >
                      <span className="font-semibold text-slate-900">
                        {option.title}
                      </span>
                    </button>
                  ))}
                </div>
              </PathFinderStep>

              {hasAnswers ? (
                interest === "not-sure" ? (
                  <RecommendationCard
                    title="ابتدا پنج حوزه آموزشی را ببینید"
                    description="چون هنوز حوزه مشخصی انتخاب نکرده‌اید، بهتر است ابتدا نقشه پنج حوزه اصلی را ببینید و بر اساس نوع سؤال تصمیم بگیرید."
                    href="/learn/fields"
                    buttonLabel="مشاهده حوزه‌های آموزشی"
                    active
                  />
                ) : recommendedDomain ? (
                  <RecommendationCard
                    title={recommendedDomain.title}
                    description={
                      recommendedDomain.status === "active"
                        ? `با توجه به انتخاب شما، ${recommendedDomain.title} نقطه شروع مناسبی است. این حوزه اکنون مسیر آموزشی فعال دارد.`
                        : `با توجه به انتخاب شما، ${recommendedDomain.title} به سؤال شما نزدیک است. این حوزه در معماری هاب‌ژن تعریف شده و مسیر آموزشی آن در حال توسعه است.`
                    }
                    href={
                      recommendedDomain.href ?? "/learn/fields"
                    }
                    buttonLabel={
                      recommendedDomain.status === "active"
                        ? "ورود به این حوزه"
                        : "مشاهده همه حوزه‌ها"
                    }
                    active={recommendedDomain.status === "active"}
                  />
                ) : null
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-6">
                  <p className="text-sm leading-7 text-slate-500">
                    بعد از پاسخ به هر سه سؤال، نقطه شروع پیشنهادی همین‌جا
                    نمایش داده می‌شود.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl border border-teal-200 bg-gradient-to-br from-teal-50 via-white to-cyan-50 p-8 sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <span className="text-sm font-semibold text-teal-700">
                پنج حوزه، یک معماری مشترک
              </span>

              <h2 className="mt-3 text-3xl font-bold text-slate-950">
                حوزه‌های آموزشی را در یک صفحه مستقل ببینید.
              </h2>

              <p className="mt-4 max-w-3xl leading-8 text-slate-600">
                با توسعه هاب‌ژن، هر حوزه می‌تواند مبانی، مسیرهای تخصصی،
                پروژه‌های تمرینی و زیرشاخه‌های جدید خودش را داشته باشد.
              </p>
            </div>

            <a
              href="/learn/fields"
              className="inline-flex min-h-12 items-center justify-center rounded-xl bg-teal-700 px-6 py-3 font-bold text-white transition hover:bg-teal-800"
            >
              مشاهده حوزه‌های آموزشی
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

function HeroStat({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur">
      <p className="font-bold text-slate-950">
        {value}
      </p>

      <p className="mt-1 text-sm leading-6 text-slate-500">
        {label}
      </p>
    </div>
  );
}

function JourneyCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-xl font-bold text-slate-950">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-7 text-slate-600">
        {description}
      </p>
    </div>
  );
}

function ProgressRow({
  done,
  label,
}: {
  done: boolean;
  label: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={[
          "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold",
          done
            ? "border-teal-600 bg-teal-600 text-white"
            : "border-slate-300 bg-white text-transparent",
        ].join(" ")}
      >
        ✓
      </span>

      <span
        className={[
          "text-sm",
          done
            ? "font-medium text-slate-800"
            : "text-slate-500",
        ].join(" ")}
      >
        {label}
      </span>
    </div>
  );
}

function PathFinderStep({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex items-start gap-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-950 font-bold text-white">
          {number}
        </span>

        <h3 className="pt-1 text-xl font-bold text-slate-950">
          {title}
        </h3>
      </div>

      <div className="mt-6">{children}</div>
    </section>
  );
}

function RecommendationCard({
  title,
  description,
  href,
  buttonLabel,
  active,
}: {
  title: string;
  description: string;
  href: string;
  buttonLabel: string;
  active: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-3xl border border-teal-200 bg-gradient-to-br from-teal-50 via-white to-cyan-50 shadow-sm">
      <div className="p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-teal-700 px-3 py-1 text-xs font-bold text-white">
            پیشنهاد هاب‌ژن
          </span>

          {!active && (
            <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">
              در حال توسعه
            </span>
          )}
        </div>

        <h3 className="mt-6 text-2xl font-bold text-slate-950">
          {title}
        </h3>

        <p className="mt-4 leading-8 text-slate-600">
          {description}
        </p>

        <a
          href={href}
          className="mt-7 inline-flex min-h-11 items-center justify-center rounded-xl bg-slate-950 px-5 py-2.5 font-semibold text-white transition hover:bg-slate-800"
        >
          {buttonLabel}
        </a>
      </div>
    </div>
  );
}
