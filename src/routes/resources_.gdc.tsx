import { createFileRoute } from "@tanstack/react-router";

import { GdcHomeTour } from "@/features/data-resources/gdc-home";
import { loadResourceTour } from "@/features/data-resources/resource-tour-loader";

export const Route = createFileRoute("/resources/gdc")({
  component: GdcResourcePage,
  loader: async () => loadResourceTour("gdc"),
});

function GdcResourcePage() {
  return <GdcHomeTour />;
}
