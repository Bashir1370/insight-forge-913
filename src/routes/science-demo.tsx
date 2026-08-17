import { createFileRoute } from "@tanstack/react-router";
import { RnaExtractionScene } from "@/components/science-scenes/RnaExtractionScene";

export const Route = createFileRoute("/science-demo")({
  component: ScienceDemoPage,
});

function ScienceDemoPage() {
  return (
    <main dir="rtl" className="min-h-screen bg-slate-50 px-4 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <p className="text-sm font-bold text-teal-700">نمونه آزمایشی تصویرسازی علمی هاب‌ژن</p>
          <h1 className="mt-2 text-3xl font-black text-slate-950">
            استخراج RNA
          </h1>
        </div>

        <RnaExtractionScene active />
      </div>
    </main>
  );
}
