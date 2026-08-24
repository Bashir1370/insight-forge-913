import { supabase } from "@/integrations/supabase/client";

export async function updateResourceImage(slug: string, imageUrl: string) {
  const { data: resource } = await supabase
    .from("resource_tours")
    .upsert({ slug, image_url: imageUrl }, { onConflict: "slug" })
    .select("id")
    .single();

  return resource;
}

export async function getResourceImage(slug: string) {
  const { data } = await supabase
    .from("resource_tours")
    .select("image_url")
    .eq("slug", slug)
    .maybeSingle();

  return data?.image_url ?? null;
}
