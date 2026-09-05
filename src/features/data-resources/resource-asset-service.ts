import { supabase } from "@/integrations/supabase/client";

export async function updateResourceImage(slug: string, imageUrl: string) {
  const { data: resource, error } = await supabase
    .from("resource_tours")
    .update({ image_url: imageUrl })
    .eq("slug", slug)
    .select("id")
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!resource) {
    throw new Error(`Resource tour not found: ${slug}`);
  }

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
