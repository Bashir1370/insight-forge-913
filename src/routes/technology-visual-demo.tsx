import { createFileRoute } from "@tanstack/react-router";
import { TranscriptomicsTechnologyVisual } from "@/components/learning/TranscriptomicsTechnologyVisual";

export const Route = createFileRoute("/technology-visual-demo")({
  component: TechnologyVisualDemo,
});

function TechnologyVisualDemo() {
  return (
    <main dir="rtl" className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-7xl">
        <TranscriptomicsTechnologyVisual />
      </div>
    </main>
  );
}
