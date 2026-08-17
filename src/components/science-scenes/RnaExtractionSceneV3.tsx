import { createFileRoute } from "@tanstack/react-router";
import { RnaExtractionSceneV3 } from "@/components/science-scenes/RnaExtractionSceneV3";

export const Route = createFileRoute("/science-demo-v3")({
  component: ScienceDemoV3,
});

function ScienceDemoV3() {
  return (
    <main dir="rtl" className="min-h-screen bg-slate-50 px-4 py-12">
      <div className="mx-auto max-w-7xl">
        <RnaExtractionSceneV3 />
      </div>
    </main>
  );
}
