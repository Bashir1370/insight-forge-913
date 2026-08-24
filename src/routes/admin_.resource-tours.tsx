import { createFileRoute, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { VisualPageEditor } from "@/features/data-resources/VisualPageEditor";
import { VisualContentEditor } from "@/features/data-resources/VisualContentEditor";

const gdcImage = "/images/gdc/gdc-home-clean.webp";

const fallbackHotspots = [
  { id: "5", title: "Search", x: 82, y: 16, width: 15, height: 6 },
  { id: "6", title: "Portal Summary", x: 5, y: 76, width: 42, height: 16 },
  { id: "7", title: "Primary Site Distribution", x: 72, y: 22, width: 22, height: 58 },
];

const fallbackContent = [
  { key: "title", label: "عنوان صفحه", value: "GDC Resource Tour" },
  { key: "description", label: "توضیحات", value: "Explore GDC data resources" },
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

async function saveHotspots(items: typeof fallbackHotspots) {
  const { data: resource } = await supabase
    .from("resource_tours")
    .upsert({ slug: "gdc", title: "GDC Resource Tour", image_url: gdcImage }, { onConflict: "slug" })
    .select("id")
    .single();

  if (!resource) return;

  await supabase.from("resource_hotspots").delete().eq("resource_id", resource.id);
  await supabase.from("resource_hotspots").insert(items.map((item) => ({
    resource_id: resource.id,
    step: Number(item.id),
    title: item.title,
    x: item.x,
    y: item.y,
    width: item.width,
    height: item.height,
  })));
}

async function saveContent(items: typeof fallbackContent) {
  const { data: resource } = await supabase
    .from("resource_tours")
    .upsert({ slug: "gdc", title: "GDC Resource Tour", image_url: gdcImage }, { onConflict: "slug" })
    .select("id")
    .single();

  if (!resource) return;

  await supabase.from("resource_content_blocks").delete().eq("resource_id", resource.id);
  await supabase.from("resource_content_blocks").insert(items.map((item) => ({
    resource_id: resource.id,
    key: item.key,
    label: item.label,
    value: item.value,
  })));
}

function ResourceTourAdmin() {
  const [hotspots, setHotspots] = useState(fallbackHotspots);
  const [content, setContent] = useState(fallbackContent);

  useEffect(() => {
    async function load() {
      const { data: resource } = await supabase.from("resource_tours").select("id").eq("slug", "gdc").maybeSingle();
      if (!resource) return;

      const { data: hs } = await supabase.from("resource_hotspots").select("step,title,x,y,width,height").eq("resource_id", resource.id).order("step");
      if (hs?.length) setHotspots(hs.map((h) => ({ id: String(h.step), title: h.title, x: h.x, y: h.y, width: h.width, height: h.height })));

      const { data: blocks } = await supabase.from("resource_content_blocks").select("key,label,value").eq("resource_id", resource.id);
      if (blocks?.length) setContent(blocks);
    }
    load();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 p-8" dir="rtl">
      <h1 className="text-2xl font-black">Visual CMS - GDC</h1>
      <p className="mt-2 text-slate-600">ویرایش صفحه بدون تغییر کد</p>
      <div className="mt-6 space-y-6">
        <VisualPageEditor title="GDC Resource Tour" imageUrl={gdcImage} hotspots={hotspots} onSave={(items) => { setHotspots(items); saveHotspots(items); }} />
        <VisualContentEditor items={content} onSave={(items) => { setContent(items); saveContent(items); }} />
      </div>
    </main>
  );
}
