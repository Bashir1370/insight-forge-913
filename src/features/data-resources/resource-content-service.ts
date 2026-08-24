import { supabase } from "@/integrations/supabase/client";

export async function loadResourceContent(slug: string) {
  const { data: resource } = await supabase
    .from("resource_tours")
    .select("id, title, image_url")
    .eq("slug", slug)
    .maybeSingle();

  if (!resource) return null;

  const { data: content } = await supabase
    .from("resource_content_blocks")
    .select("key, value")
    .eq("resource_id", resource.id);

  return {
    ...resource,
    content: content ?? [],
  };
}
