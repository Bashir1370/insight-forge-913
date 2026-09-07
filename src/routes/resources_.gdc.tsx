import { createFileRoute } from "@tanstack/react-router";

import { GdcResourcePage } from "@/features/data-resources/GdcResourcePage";

export const Route = createFileRoute("/resources/gdc")({
  component: GdcResourcePage,
});
