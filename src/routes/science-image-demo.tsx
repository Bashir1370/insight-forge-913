import { createFileRoute } from "@tanstack/react-router";
import { RnaSeqWorkflowFigure } from "@/components/learning/RnaSeqWorkflowFigure";

export const Route = createFileRoute("/science-image-demo")({
  component: ScienceImageDemo,
});

function ScienceImageDemo() {
  return (
    <main dir="rtl" className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-7xl">
        <RnaSeqWorkflowFigure />
      </div>
    </main>
  );
}
