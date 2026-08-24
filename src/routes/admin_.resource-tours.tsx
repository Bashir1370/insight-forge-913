import { createFileRoute, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { HotspotEditor } from "@/features/data-resources/HotspotEditor";

const gdcHotspots = [
  { id: "5", title: "Search", x: 82, y: 16, width: 15, height: 6 },
  { id: "6", title: "Portal Summary", x: 5, y: 76, width: 42, height: 16 },
  { id: "7", title: "Primary Site Distribution", x: 72, y: 22, width: 22, height: 58 },
];

export const Route = createFileRoute("/admin_/resource-tours")({
  ssr: false,
  beforeLoad: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw redirect({ to: "/auth" });
    const { data: role } = await (supabase as any)
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();
    if (!role) throw redirect({ to: "/dashboard" });
  },
  component: ResourceTourAdmin,
});

function ResourceTourAdmin() {
  return (
    <main className="min-h-screen bg-slate-50 p-8" dir="rtl">
      <h1 className="text-2xl font-black">ویرایشگر تور منابع</h1>
      <p className="mt-2 text-slate-600">تنظیم Hotspotهای GDC بدون تغییر کد</p>
      <div className="mt-6">
        <HotspotEditor initialHotspots={gdcHotspots} />
      </div>
    </main>
  );
}
