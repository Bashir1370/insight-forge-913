import { supabase } from "@/integrations/supabase/client";

import {
  DEFAULT_GDC_CONTENT,
  DEFAULT_GDC_HOTSPOTS,
  DEFAULT_GDC_IMAGE_URL,
  type EditableResourceContent,
  type EditableResourceHotspot,
  type ResourceTourAdminData,
} from "./resource-tour-model";

const db = supabase as any;

function numberValue(value: unknown, fallback: number) {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function normalizeHotspots(rows: any[] | null | undefined): EditableResourceHotspot[] {
  const saved = rows ?? [];

  return DEFAULT_GDC_HOTSPOTS.map((fallback) => {
    const row = saved.find(
      (item) =>
        item.hotspot_key === fallback.key ||
        (!item.hotspot_key && Number(item.step) === fallback.step),
    );

    if (!row) return { ...fallback };

    return {
      id: row.id,
      key: row.hotspot_key ?? fallback.key,
      step: numberValue(row.step, fallback.step),
      title: row.title ?? fallback.title,
      persianLabel: row.persian_label ?? fallback.persianLabel,
      description: row.description || fallback.description,
      whyItMatters: row.why_it_matters || fallback.whyItMatters,
      researchExample: row.research_example || fallback.researchExample,
      commonMistake: row.common_mistake || fallback.commonMistake,
      exerciseQuestion: row.exercise_question || fallback.exerciseQuestion,
      exerciseAnswer: row.exercise_answer || fallback.exerciseAnswer,
      action: row.action || fallback.action,
      x: numberValue(row.x, fallback.x),
      y: numberValue(row.y, fallback.y),
      width: numberValue(row.width, fallback.width),
      height: numberValue(row.height, fallback.height),
    };
  });
}

function normalizeContent(rows: any[] | null | undefined): EditableResourceContent[] {
  const saved = rows ?? [];

  return DEFAULT_GDC_CONTENT.map((fallback) => {
    const row = saved.find((item) => item.key === fallback.key);
    return row
      ? {
          key: row.key,
          label: row.label ?? fallback.label,
          value: row.value ?? fallback.value,
        }
      : { ...fallback };
  });
}

export async function loadResourceTourAdmin(slug: string): Promise<ResourceTourAdminData> {
  const { data: resource, error: resourceError } = await db
    .from("resource_tours")
    .select("id, slug, title, image_url")
    .eq("slug", slug)
    .maybeSingle();

  if (resourceError || !resource) {
    return {
      id: null,
      slug,
      title: "GDC / TCGA Guided Portal Tour",
      imageUrl: DEFAULT_GDC_IMAGE_URL,
      hotspots: DEFAULT_GDC_HOTSPOTS.map((item) => ({ ...item })),
      content: DEFAULT_GDC_CONTENT.map((item) => ({ ...item })),
      persisted: false,
      warning: resourceError?.message,
    };
  }

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

  return {
    id: resource.id,
    slug: resource.slug,
    title: resource.title,
    imageUrl: resource.image_url || DEFAULT_GDC_IMAGE_URL,
    hotspots: normalizeHotspots(hotspotResult.data),
    content: normalizeContent(contentResult.data),
    persisted: !hotspotResult.error && !contentResult.error,
    warning: hotspotResult.error?.message || contentResult.error?.message,
  };
}

async function ensureResourceTour(slug: string, title: string, imageUrl: string) {
  const { data, error } = await db
    .from("resource_tours")
    .upsert(
      {
        slug,
        title,
        image_url: imageUrl || DEFAULT_GDC_IMAGE_URL,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "slug" },
    )
    .select("id, slug, title, image_url")
    .single();

  if (error) throw error;
  return data;
}

export async function saveResourceImage(
  slug: string,
  title: string,
  imageUrl: string,
) {
  const resource = await ensureResourceTour(slug, title, imageUrl);
  return resource.image_url as string;
}

export async function saveResourceHotspots(
  slug: string,
  title: string,
  imageUrl: string,
  hotspots: EditableResourceHotspot[],
) {
  const resource = await ensureResourceTour(slug, title, imageUrl);

  const rows = hotspots.map((item) => ({
    resource_id: resource.id,
    hotspot_key: item.key,
    step: item.step,
    title: item.title,
    persian_label: item.persianLabel ?? "",
    description: item.description ?? "",
    why_it_matters: item.whyItMatters ?? "",
    research_example: item.researchExample ?? "",
    common_mistake: item.commonMistake ?? "",
    exercise_question: item.exerciseQuestion ?? "",
    exercise_answer: item.exerciseAnswer ?? "",
    action: item.action ?? "",
    x: item.x,
    y: item.y,
    width: item.width,
    height: item.height,
    updated_at: new Date().toISOString(),
  }));

  const { data, error } = await db
    .from("resource_hotspots")
    .upsert(rows, { onConflict: "resource_id,hotspot_key" })
    .select("*")
    .order("step", { ascending: true });

  if (error) throw error;
  return normalizeHotspots(data);
}

export async function saveResourceContent(
  slug: string,
  title: string,
  imageUrl: string,
  content: EditableResourceContent[],
) {
  const resource = await ensureResourceTour(slug, title, imageUrl);

  const rows = content.map((item) => ({
    resource_id: resource.id,
    key: item.key,
    label: item.label,
    value: item.value,
    updated_at: new Date().toISOString(),
  }));

  const { data, error } = await db
    .from("resource_content_blocks")
    .upsert(rows, { onConflict: "resource_id,key" })
    .select("*");

  if (error) throw error;
  return normalizeContent(data);
}
