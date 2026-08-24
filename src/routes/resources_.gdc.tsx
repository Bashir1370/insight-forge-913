import { createFileRoute } from "@tanstack/react-router";

import { GdcDynamicPage } from "@/features/data-resources/gdc-dynamic-page";

export const Route = createFileRoute("/resources/gdc")({
  component: GdcResourcePage,
});

function GdcResourcePage() {
  return <GdcDynamicPage />;
}
