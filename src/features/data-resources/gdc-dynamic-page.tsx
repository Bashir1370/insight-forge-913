import { useEffect, useState } from "react";

import { supabase } from "@/integrations/lovable/client";
import { loadResourceTour } from "./resource-tour-loader";
import { ResourceTourRenderer } from "./resource-tour-renderer";

type ResourceTourData = Awaited<ReturnType<typeof loadResourceTour>>;

export function GdcDynamicPage() {
  const [resource, setResource] = useState<ResourceTourData>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    loadResourceTour("gdc").then(setResource);

    async function checkAdmin() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: role } = await (supabase as any)
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();
      setIsAdmin(Boolean(role));
    }

    checkAdmin();
  }, []);

  return (
    <div className="relative">
      {isAdmin && (
        <a
          href="/admin_/resource-tours"
          className="fixed right-6 top-6 z-50 rounded-xl bg-black px-4 py-3 text-white shadow-lg"
        >
          ویرایش GDC
        </a>
      )}
      <ResourceTourRenderer resource={resource} />
    </div>
  );
}
