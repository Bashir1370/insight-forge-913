import { createFileRoute, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { VisualPageEditor } from "@/features/data-resources/VisualPageEditor";
import { VisualContentEditor } from "@/features/data-resources/VisualContentEditor";

const gdcHotspots = [
  { id: "5", title: "Search", x: 82, y: 16, width: 15, height: 6 },
  { id: "6", title: "Portal Summary", x: 5, y: 76, width: 42, height: 16 },
  { id: "7", title: "Primary Site Distribution", x: 72, y: 22, width: 22, height: 58 },
];

const gdcImage = "/images/gdc/gdc-home-clean.webp";

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
  const saveHotspots = async (items: typeof gdcHotspots) => {
    const { data: resource } = await supabase
      .from("resource_tours")
      .upsert({ slug: "gdc", title: "GDC Resource Tour", image_url: gdcImage }, { onConflict: "slug" })
      .select("id")
      .single();

    if (!resource) return;

    await supabase.from("resource_hotspots").delete().eq("resource_id", resource.id);
    await supabase.from("resource_hotspots").insert(items.map((item, index) => ({
      resource_id: resource.id,
      step: Number(item.id) || index + 1,
      title: item.title,
      x: item.x,
      y: item.y,
      width: item.width,
      height: item.height,
    })));
  };

  return (
    <main className="min-h-screen bg-slate-50 p-8" dir="rtl">
      <h1 className="text-2xl font-black">Visual CMS - Resource Tours</h1>
      <p className="mt-2 text-slate-600">ویرایش GDC بدون تغییر کد</p>
      <div className="mt-6 space-y-6">
        <VisualPageEditor
          title="GDC Visual Editor"
          imageUrl={gdcImage}
          hotspots={gdcHotspots}
          onSave={saveHotspots}
        />
        <VisualContentEditor resourceSlug="gdc" />
      </div>
    </main>
  );
}
