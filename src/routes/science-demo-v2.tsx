import { createFileRoute } from "@tanstack/react-router";
import { RnaExtractionSceneV2 } from "@/components/science-scenes/RnaExtractionSceneV2";

export const Route = createFileRoute("/science-demo-v2")({
  component: ScienceDemoV2Page,
});

function ScienceDemoV2Page() {
  return (
    <main dir="rtl" className="min-h-screen bg-slate-50 px-4 py-12">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-bold text-teal-700">نمونه آزمایشی تصویرسازی علمی هاب‌ژن</p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">استخراج RNA — نسخه دوم</h1>
        <div className="mt-7">
          <RnaExtractionSceneV2 active />
        </div>
      </div>
    </main>
  );
}
