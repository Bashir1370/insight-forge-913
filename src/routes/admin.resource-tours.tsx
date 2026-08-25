import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/resource-tours")({
  beforeLoad: async () => {
    throw redirect({ to: "/admin_/resource-tours" });
  },
});
