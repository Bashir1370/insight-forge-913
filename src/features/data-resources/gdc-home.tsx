import { useState } from "react";

const steps = [
  {
    id: "identity",
    title: "GDC Data Portal",
    text: "این صفحه نقطه شروع شناخت یک Data Resource است.",
    x: "8%",
    y: "8%",
  },
  {
    id: "projects",
    title: "Projects",
    text: "پروژه‌ها ساختار اصلی سازمان‌دهی مطالعات هستند.",
    x: "28%",
    y: "8%",
  },
  {
    id: "cohort",
    title: "Cohort Builder",
    text: "برای تعریف گروه مورد مطالعه استفاده می‌شود.",
    x: "42%",
    y: "8%",
  },
  {
    id: "repository",
    title: "Repository",
    text: "مسیر پیدا کردن فایل‌های داده است.",
    x: "55%",
    y: "8%",
  },
];

export function GdcHomeTour() {
  const [step, setStep] = useState(0);
  const current = steps[step];

  return (
    <section dir="rtl" className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-3xl border border-slate-700 bg-slate-900 p-8 shadow-xl">
          <h1 className="text-3xl font-bold">GDC Data Portal Learning</h1>
          <p className="mt-3 text-slate-300">
            Guided Portal Tour - نسخه اولیه
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-[1fr_320px]">
            <div className="relative aspect-video overflow-hidden rounded-2xl border border-slate-700 bg-slate-800">
              {steps.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => setStep(index)}
                  className={`absolute h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 font-bold transition ${
                    index === step
                      ? "border-teal-300 bg-teal-600 text-white"
                      : "border-white bg-slate-700"
                  }`}
                  style={{ left: item.x, top: item.y }}
                  aria-label={item.title}
                >
                  {index + 1}
                </button>
              ))}

              <div className="p-8 text-slate-300">
                Screenshot واقعی GDC در این لایه قرار می‌گیرد.
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 text-slate-900">
              <p className="text-sm text-teal-700">
                Step {step + 1} / {steps.length}
              </p>
              <h2 className="mt-3 text-xl font-bold">{current.title}</h2>
              <p className="mt-4 leading-8">{current.text}</p>
              <button
                className="mt-8 rounded-xl bg-teal-700 px-5 py-3 text-white"
                onClick={() => setStep((step + 1) % steps.length)}
              >
                مرحله بعد
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
