import { RnaExtractionScene } from "./RnaExtractionScene";

export default function RnaExtractionSceneDemo() {
  return (
    <main dir="rtl" className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <p className="text-sm font-bold text-teal-700">نمونه آزمایشی سیستم تصویرسازی علمی هاب‌ژن</p>
          <h1 className="mt-2 text-3xl font-black text-slate-950">استخراج RNA</h1>
        </div>

        <RnaExtractionScene active />
      </div>
    </main>
  );
}
