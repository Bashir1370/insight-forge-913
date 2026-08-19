import { useState } from "react";

type Technology = "rna-seq" | "microarray";

const technologyContent = {
  "rna-seq": {
    label: "RNA-seq",
    image: "/images/learning/rna-seq-workflow.png",
    alt: "نمای شماتیک مراحل فناوری RNA-seq",
    principle: "خواندن توالی مولکول‌ها",
    subtitle: "مبتنی بر توالی‌یابی",
  },
  microarray: {
    label: "Microarray",
    image: "/images/learning/microarray-workflow.png",
    alt: "نمای شماتیک مراحل فناوری Microarray",
    principle: "سنجش اتصال به پروب و شدت سیگنال",
    subtitle: "مبتنی بر پروب و سیگنال",
  },
} as const;

export function TranscriptomicsTechnologyVisual() {
  const [technology, setTechnology] =
    useState<Technology>("rna-seq");

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
          title="Microarray"
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

      <div className="mt-4 rounded-2xl border border-teal-200 bg-teal-50 px-5 py-4">
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
