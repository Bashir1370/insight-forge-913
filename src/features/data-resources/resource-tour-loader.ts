import { supabase } from "@/integrations/supabase/client";

const db = supabase as any;

export async function loadResourceTour(slug: string) {
  const { data: resource, error: resourceError } = await db
    .from("resource_tours")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (resourceError || !resource) return null;

  const [hotspotResult, contentResult] = await Promise.all([
    db
      .from("resource_hotspots")
      .select("*")
      .eq("resource_id", resource.id)
      .order("step", { ascending: true }),
    db
      .from("resource_content_blocks")
      .select("*")
      .eq("resource_id", resource.id)
      .order("created_at", { ascending: true }),
  ]);

  if (hotspotResult.error || contentResult.error) {
    console.warn(
      "[ResourceTour] Falling back to static GDC data:",
      hotspotResult.error || contentResult.error,
    );
    return null;
  }

  return {
    ...resource,
    hotspots: hotspotResult.data ?? [],
    content: contentResult.data ?? [],
  };
}
