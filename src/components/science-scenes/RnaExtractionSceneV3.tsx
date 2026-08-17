import { useState } from "react";

type AssetKey =
  | "cellCulture"
  | "pipette"
  | "microtube"
  | "rna";

const ASSETS: Record<AssetKey, string> = {
  cellCulture:
    "https://raw.githubusercontent.com/duerrsimon/bioicons/refs/heads/main/static/icons/cc-by-3.0/Microbiology/Servier/cell-culture-equipment.svg",
  pipette:
    "https://raw.githubusercontent.com/duerrsimon/bioicons/refs/heads/main/static/icons/cc-0/Lab_apparatus/James-Lloyd/Pipette.svg",
  microtube:
    "https://raw.githubusercontent.com/duerrsimon/bioicons/refs/heads/main/static/icons/cc-by-3.0/Microbiology/Servier/microtube-open-translucent.svg",
  rna:
    "https://raw.githubusercontent.com/duerrsimon/bioicons/refs/heads/main/static/icons/cc-by-4.0/Nucleic_acids/DBCLS/RNA_bulge.svg",
};

export function RnaExtractionSceneV3() {
  return (
    <section
      dir="rtl"
      className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white"
    >
      <div className="border-b border-slate-100 px-6 py-5 sm:px-8">
        <p className="text-xs font-bold text-teal-700">
          نمونه آزمایشی سیستم تصویرسازی علمی
        </p>
        <h2 className="mt-2 text-2xl font-black text-slate-950">
          استخراج RNA
        </h2>
      </div>

      <div className="px-5 py-8 sm:px-8 lg:px-12 lg:py-12">
        <div className="relative mx-auto max-w-5xl">
          <div className="grid items-center gap-5 lg:grid-cols-[1fr_auto_1fr_auto_1fr]">
            <Stage
              title="نمونه زیستی"
              note="ورودی زیستی"
            >
              <ScientificAsset
                src={ASSETS.cellCulture}
                alt="نمای شماتیک نمونه کشت سلولی"
                className="h-40 w-40 sm:h-48 sm:w-48"
              />
            </Stage>

            <FlowArrow />

            <Stage
              title="استخراج RNA"
              note="فرآوری نمونه"
              active
            >
              <div className="relative h-48 w-56">
                <ScientificAsset
                  src={ASSETS.microtube}
                  alt="میکروتیوب آزمایشگاهی"
                  className="absolute bottom-0 right-5 h-32 w-32"
                />

                <ScientificAsset
                  src={ASSETS.pipette}
                  alt="میکروپیپت آزمایشگاهی"
                  className="absolute left-4 top-0 h-40 w-32 -rotate-[12deg]"
                />

                <div className="absolute bottom-8 left-5 h-2 w-2 rounded-full bg-teal-500/70" />
                <div className="absolute bottom-12 left-9 h-1.5 w-1.5 rounded-full bg-cyan-500/50" />
              </div>
            </Stage>

            <FlowArrow />

            <Stage
              title="RNA خالص"
              note="آماده برای مراحل بعدی"
            >
              <div className="flex items-center gap-3">
                <ScientificAsset
                  src={ASSETS.microtube}
                  alt="میکروتیوب حاوی RNA خالص"
                  className="h-36 w-32"
                />

                <div className="flex h-28 w-28 items-center justify-center rounded-full border border-teal-200 bg-teal-50">
                  <ScientificAsset
                    src={ASSETS.rna}
                    alt="نمای شماتیک RNA"
                    className="h-20 w-20"
                  />
                </div>
              </div>
            </Stage>
          </div>

          <div className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-center">
            <p className="text-xs leading-7 text-slate-500">
              نمایش شماتیک آموزشی است؛ جزئیات پروتکل استخراج به نوع نمونه و روش آزمایشگاهی وابسته است.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stage({
  title,
  note,
  active = false,
  children,
}: {
  title: string;
  note: string;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[280px] flex-col items-center justify-center text-center">
      <div
        className={[
          "flex min-h-[210px] w-full items-center justify-center rounded-3xl border px-4 py-5 transition",
          active
            ? "border-teal-300 bg-teal-50/40"
            : "border-transparent bg-white",
        ].join(" ")}
      >
        {children}
      </div>

      <h3 className="mt-4 text-lg font-black text-slate-950">
        {title}
      </h3>

      <p className="mt-1 text-xs text-slate-400">
        {note}
      </p>
    </div>
  );
}

function FlowArrow() {
  return (
    <div className="hidden items-center justify-center lg:flex">
      <svg
        viewBox="0 0 110 30"
        className="h-8 w-24 overflow-visible"
        aria-hidden="true"
      >
        <defs>
          <marker
            id="rna-flow-arrow"
            markerWidth="8"
            markerHeight="8"
            refX="4"
            refY="4"
            orient="auto"
          >
            <path d="M0,0 L8,4 L0,8 z" fill="currentColor" />
          </marker>
        </defs>

        <line
          x1="100"
          y1="15"
          x2="10"
          y2="15"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          markerEnd="url(#rna-flow-arrow)"
          className="text-teal-700"
        />
      </svg>
    </div>
  );
}

function ScientificAsset({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={[
          "flex items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-xs text-slate-400",
          className ?? "",
        ].join(" ")}
      >
        بارگذاری تصویر انجام نشد
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="eager"
      decoding="async"
      onError={() => setFailed(true)}
      className={["object-contain", className ?? ""].join(" ")}
    />
  );
}
