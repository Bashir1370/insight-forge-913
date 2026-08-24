import { useState } from "react";

const steps = [
  { title: "GDC Data Portal", text: "این صفحه نقطه شروع شناخت یک Data Resource است." },
  { title: "Projects", text: "پروژه‌ها ساختار اصلی سازمان‌دهی مطالعات هستند." },
  { title: "Cohort Builder", text: "برای تعریف گروه مورد مطالعه استفاده می‌شود." },
  { title: "Repository", text: "مسیر پیدا کردن فایل‌های داده است." },
];

export function GdcHomeTour() {
  const [step, setStep] = useState(0);
  const current = steps[step];

  return (
    <section dir="rtl" className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-3xl border border-slate-700 bg-slate-900 p-8 shadow-xl">
          <div className="mb-8 rounded-2xl bg-slate-800 p-8">
            <h1 className="text-3xl font-bold">GDC Data Portal Learning</h1>
            <p className="mt-3 text-slate-300">نسخه اولیه لایه آموزشی روی Portal واقعی</p>
          </div>

          <div className="grid gap-6 md:grid-cols-[1fr_320px]">
            <div className="relative aspect-video rounded-2xl border border-dashed border-slate-600 bg-slate-800 p-8">
              <div className="absolute left-10 top-10 rounded-full border-4 border-teal-400 px-5 py-3 text-teal-300">
                {step + 1}
              </div>
              <p className="mt-24 text-slate-300">GDC screenshot layer will be placed here.</p>
            </div>

            <div className="rounded-2xl bg-white p-6 text-slate-900">
              <p className="text-sm text-teal-700">Step {step + 1} / {steps.length}</p>
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
