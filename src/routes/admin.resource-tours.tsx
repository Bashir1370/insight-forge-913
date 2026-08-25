import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/resource-tours")({
  beforeLoad: () => {
    throw redirect({ to: "/admin_/resource-tours" });
  },
  component: () => null,
});
