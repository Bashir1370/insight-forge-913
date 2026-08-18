import { useState } from "react";

type Technology = "rna-seq" | "microarray";

const technologyContent = {
  "rna-seq": {
    label: "RNA-seq",
    image: "/images/learning/rna-seq-workflow.png",
    alt: "نمای شماتیک مراحل فناوری RNA-seq",
    principle: "خواندن توالی مولکول‌ها",
  },
  microarray: {
    label: "Microarray",
    image: "/images/learning/microarray-workflow.png",
    alt: "نمای شماتیک مراحل فناوری Microarray",
    principle: "سنجش اتصال به پروب و شدت سیگنال",
  },
} as const;

export function TranscriptomicsTechnologyVisual() {
  const [technology, setTechnology] =
    useState<Technology>("rna-seq");

  const current = technologyContent[technology];

  return (
    <section
      dir="rtl"
      className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white"
    >
      <div className="border-b border-slate-100 px-5 py-5 sm:px-7">
        <p className="text-xs font-bold text-teal-700">
          مقایسه فناوری
        </p>

        <h3 className="mt-1 text-2xl font-black text-slate-950">
          دو منطق متفاوت برای مطالعه بیان RNA
        </h3>

        <p className="mt-2 text-sm leading-7 text-slate-500">
          فناوری را انتخاب کنید و نمای شماتیک مسیر تولید داده را ببینید.
        </p>
      </div>

      <div className="p-4 sm:p-6">
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
            title="Microarray"
            subtitle="مبتنی بر پروب و سیگنال"
          />
        </div>

        <div className="mt-5 overflow-hidden rounded-3xl border border-slate-200 bg-white">
          <TechnologyImage
            key={technology}
            src={current.image}
            alt={current.alt}
            technology={technology}
          />
        </div>

        <div className="mt-4 rounded-2xl border border-teal-200 bg-teal-50 px-5 py-4">
          <p className="text-xs font-bold text-teal-700">
            اصل فناوری
          </p>

          <p className="mt-1 text-base font-black text-slate-950">
            {current.label}: {current.principle}
          </p>
        </div>
      </div>
    </section>
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

function TechnologyImage({
  src,
  alt,
  technology,
}: {
  src: string;
  alt: string;
  technology: Technology;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="flex min-h-[420px] items-center justify-center bg-slate-50 px-6 py-12 text-center">
        <div>
          <p className="text-lg font-black text-slate-800">
            {technology === "microarray"
              ? "تصویر Microarray هنوز اضافه نشده است."
              : "تصویر این فناوری بارگذاری نشد."}
          </p>

          {technology === "microarray" && (
            <p className="mt-2 text-sm leading-7 text-slate-500">
              بعد از آماده‌شدن تصویر Corel، فایل را با نام
              <span dir="ltr" className="mx-1 font-semibold">
                microarray-workflow.png
              </span>
              در همان پوشه تصاویر آموزشی قرار می‌دهیم.
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white">
      <img
        src={src}
        alt={alt}
        onError={() => setFailed(true)}
        className="mx-auto block h-auto w-full min-w-[920px] object-contain md:min-w-0"
        loading="eager"
        decoding="async"
      />
    </div>
  );
}
