import { useState } from "react";

type Technology = "rna-seq" | "microarray";

type Stage = {
  title: string;
  description: string;
};

const technologyContent: Record<
  Technology,
  {
    label: string;
    image: string;
    alt: string;
    principle: string;
    subtitle: string;
    stages: Stage[];
  }
> = {
  "rna-seq": {
    label: "RNA-seq",
    image: "/images/learning/rna-seq-workflow.png",
    alt: "نمای شماتیک مراحل فناوری RNA-seq",
    principle: "خواندن توالی مولکول‌ها",
    subtitle: "مبتنی بر توالی‌یابی",
    stages: [
      {
        title: "نمونه زیستی",
        description: "بافت یا سلول، منبع اولیه RNA برای آزمایش است.",
      },
      {
        title: "استخراج RNA",
        description: "RNA از نمونه جدا و برای مراحل بعدی آماده می‌شود.",
      },
      {
        title: "غنی‌سازی mRNA",
        description: "در این مسیر، سهم mRNA از RNAهای دیگر بیشتر می‌شود.",
      },
      {
        title: "قطعه‌قطعه‌سازی mRNA",
        description: "مولکول‌های mRNA به قطعات کوتاه‌تر مناسب آماده‌سازی کتابخانه تبدیل می‌شوند.",
      },
      {
        title: "سنتز cDNA",
        description: "RNA به cDNA تبدیل می‌شود تا کتابخانه قابل توالی‌یابی ساخته شود.",
      },
      {
        title: "توالی‌یابی",
        description: "کتابخانه در دستگاه توالی‌یاب خوانده می‌شود و خوانش‌ها تولید می‌شوند.",
      },
      {
        title: "تحلیل بیوانفورماتیکی",
        description: "خوانش‌ها پردازش و کمی‌سازی می‌شوند تا به نتایج بیان ژن برسیم.",
      },
    ],
  },

  microarray: {
    label: "میکروآرایه",
    image: "/images/learning/microarray-workflow.png",
    alt: "نمای شماتیک مراحل فناوری میکروآرایه",
    principle: "سنجش اتصال به پروب و شدت سیگنال",
    subtitle: "مبتنی بر پروب و سیگنال",
    stages: [
      {
        title: "نمونه زیستی",
        description: "بافت یا سلول، منبع RNA مورد بررسی است.",
      },
      {
        title: "استخراج RNA",
        description: "RNA از نمونه جدا و برای آماده‌سازی آزمایش استفاده می‌شود.",
      },
      {
        title: "آماده‌سازی و نشاندارسازی",
        description: "RNA یا cDNA حاصل با نشانگر مناسب برای شناسایی سیگنال آماده می‌شود.",
      },
      {
        title: "هیبریداسیون روی چیپ",
        description: "مولکول‌های هدف به پروب‌های مکمل از پیش طراحی‌شده روی چیپ متصل می‌شوند.",
      },
      {
        title: "اسکن چیپ",
        description: "چیپ اسکن می‌شود تا شدت سیگنال هر ناحیه اندازه‌گیری شود.",
      },
      {
        title: "شدت سیگنال",
        description: "مقدار سیگنال هر پروب به‌عنوان سرنخی از میزان بیان استفاده می‌شود.",
      },
      {
        title: "تحلیل داده",
        description: "پس از پردازش و نرمال‌سازی، داده برای مقایسه بیان ژن آماده می‌شود.",
      },
    ],
  },
};

export function TranscriptomicsTechnologyVisual() {
  const [technology, setTechnology] = useState<Technology>("rna-seq");

  const current = technologyContent[technology];

  return (
    <div dir="rtl">
      <div className="grid gap-3 sm:grid-cols-2">
        <TechnologyTab
          active={technology === "rna-seq"}
          onClick={() => setTechnology("rna-seq")}
          title="RNA-seq"
          subtitle="مبتنی بر توالی‌یابی"
        />

        <TechnologyTab
          active={technology === "microarray"}
          onClick={() => setTechnology("microarray")}
          title="میکروآرایه"
          subtitle="مبتنی بر پروب و سیگنال"
        />
      </div>

      <div className="mt-5 overflow-hidden rounded-3xl border border-slate-200 bg-white">
        <div className="overflow-x-auto bg-white">
          <img
            key={current.image}
            src={current.image}
            alt={current.alt}
            className="mx-auto block h-auto w-full min-w-[920px] object-contain md:min-w-0"
            loading="eager"
            decoding="async"
          />
        </div>
      </div>

      <div className="mt-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold text-teal-700">
              مراحل شکل
            </p>
            <p className="mt-1 text-sm text-slate-500">
              توضیح کوتاه هر مرحله از راست به چپ
            </p>
          </div>

          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-bold text-slate-500">
            {current.label}
          </span>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {current.stages.map((stage, index) => (
            <StageCard
              key={stage.title}
              number={index + 1}
              title={stage.title}
              description={stage.description}
            />
          ))}
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-teal-200 bg-teal-50 px-5 py-4">
        <p className="text-xs font-bold text-teal-700">
          اصل فناوری
        </p>

        <p className="mt-1 text-base font-black text-slate-950">
          {current.label}: {current.principle}
        </p>

        <p className="mt-1 text-xs text-slate-500">
          {current.subtitle}
        </p>
      </div>
    </div>
  );
}

function TechnologyTab({
  active,
  onClick,
  title,
  subtitle,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  subtitle: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-2xl border px-5 py-4 text-right transition",
        active
          ? "border-teal-500 bg-teal-50 shadow-sm"
          : "border-slate-200 bg-white hover:border-teal-300",
      ].join(" ")}
    >
      <span className="block text-base font-black text-slate-950">
        {title}
      </span>

      <span className="mt-1 block text-xs text-slate-500">
        {subtitle}
      </span>
    </button>
  );
}

function StageCard({
  number,
  title,
  description,
}: {
  number: number;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center gap-3">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-teal-700 text-xs font-black text-white">
          {new Intl.NumberFormat("fa-IR").format(number)}
        </span>

        <p className="font-black text-slate-950">
          {title}
        </p>
      </div>

      <p className="mt-3 text-sm leading-7 text-slate-600">
        {description}
      </p>
    </div>
  );
}
