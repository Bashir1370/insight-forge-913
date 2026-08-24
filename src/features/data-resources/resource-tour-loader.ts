import { supabase } from "@/integrations/supabase/client";

export async function loadResourceTour(slug: string) {
  const { data: resource } = await supabase
    .from("resource_tours")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (!resource) return null;

  const { data: hotspots } = await supabase
    .from("resource_hotspots")
    .select("*")
    .eq("resource_id", resource.id)
    .order("step");

  const { data: content } = await supabase
    .from("resource_content_blocks")
    .select("*")
    .eq("resource_id", resource.id);

  return {
    ...resource,
    hotspots: hotspots ?? [],
    content: content ?? [],
  };
}
