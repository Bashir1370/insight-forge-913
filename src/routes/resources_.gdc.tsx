import { createFileRoute } from "@tanstack/react-router";

import { GdcHomeTour } from "@/features/data-resources/gdc-home";

export const Route = createFileRoute("/resources/gdc")({
  component: GdcResourcePage,
});

function GdcResourcePage() {
  return <GdcHomeTour />;
}
