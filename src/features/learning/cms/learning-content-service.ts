import { useCallback, useEffect, useState } from "react";

import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

export type LearningMedia = {
  id: string;
  type: "image" | "video";
  url: string;
  storagePath?: string;
  alt?: string;
  caption?: string;
};

export type LearningContentRevision<T> = {
  id: number;
  page_key: string;
  content: T;
  created_at: string;
  created_by: string | null;
};

export function usePublishedLearningDocument<T>(pageKey: string) {
  const [document, setDocument] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      setDocument(await loadPublishedLearningDocument<T>(pageKey));
    } catch (error) {
      console.warn("[Learning CMS] Could not load published content", error);
      setDocument(null);
    } finally {
      setLoading(false);
    }
  }, [pageKey]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { document, loading, reload };
}

export function useLearningAdminAccess() {
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    let mounted = true;
    setLoading(true);

    const table = (supabase as any).from("user_roles");
    table
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle()
      .then(({ data, error }: { data: { role?: string } | null; error: unknown }) => {
        if (!mounted) return;
        if (error) {
          console.warn("[Learning CMS] Could not verify admin role", error);
          setIsAdmin(false);
        } else {
          setIsAdmin(data?.role === "admin");
        }
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [authLoading, user]);

  return { isAdmin, loading, user };
}

export async function loadPublishedLearningDocument<T>(
  pageKey: string,
): Promise<T | null> {
  const table = (supabase as any).from("learning_content_published");
  const { data, error } = await table
    .select("content")
    .eq("page_key", pageKey)
    .maybeSingle();

  if (error) throw error;
  return (data?.content as T | undefined) ?? null;
}

export async function loadLearningDraft<T>(pageKey: string): Promise<T | null> {
  const table = (supabase as any).from("learning_content_drafts");
  const { data, error } = await table
    .select("content")
    .eq("page_key", pageKey)
    .maybeSingle();

  if (error) throw error;
  return (data?.content as T | undefined) ?? null;
}

export async function saveLearningDraft<T>(pageKey: string, content: T) {
  const user = await requireCurrentUser();
  const table = (supabase as any).from("learning_content_drafts");
  const { error } = await table.upsert(
    {
      page_key: pageKey,
      content,
      updated_by: user.id,
    },
    { onConflict: "page_key" },
  );

  if (error) throw error;
}

export async function publishLearningDocument<T>(pageKey: string, content: T) {
  const user = await requireCurrentUser();
  const publishedTable = (supabase as any).from("learning_content_published");

  const { data: current, error: currentError } = await publishedTable
    .select("content")
    .eq("page_key", pageKey)
    .maybeSingle();

  if (currentError) throw currentError;

  if (current?.content) {
    const revisionsTable = (supabase as any).from("learning_content_revisions");
    const { error: revisionError } = await revisionsTable.insert({
      page_key: pageKey,
      content: current.content,
      created_by: user.id,
    });
    if (revisionError) throw revisionError;
  }

  const { error: publishError } = await publishedTable.upsert(
    {
      page_key: pageKey,
      content,
      published_at: new Date().toISOString(),
      published_by: user.id,
    },
    { onConflict: "page_key" },
  );

  if (publishError) throw publishError;

  const draftsTable = (supabase as any).from("learning_content_drafts");
  const { error: draftDeleteError } = await draftsTable
    .delete()
    .eq("page_key", pageKey);

  if (draftDeleteError) {
    console.warn("[Learning CMS] Published but could not clear draft", draftDeleteError);
  }
}

export async function loadLearningRevisions<T = any>(pageKey: string) {
  const table = (supabase as any).from("learning_content_revisions");
  const { data, error } = await table
    .select("id, page_key, content, created_at, created_by")
    .eq("page_key", pageKey)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) throw error;
  return (data ?? []) as LearningContentRevision<T>[];
}

export async function uploadLearningMedia(pageKey: string, file: File) {
  const type: LearningMedia["type"] = file.type.startsWith("video/")
    ? "video"
    : "image";
  const extension = file.name.includes(".")
    ? `.${file.name.split(".").pop()?.toLowerCase()}`
    : "";
  const safePageKey = pageKey.replace(/[^a-zA-Z0-9_-]+/g, "-");
  const randomId =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2);
  const storagePath = `${safePageKey}/${Date.now()}-${randomId}${extension}`;
  const storage = (supabase as any).storage.from("learning-media");

  const { error } = await storage.upload(storagePath, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type,
  });

  if (error) throw error;

  const { data } = storage.getPublicUrl(storagePath);

  return {
    id: randomId,
    type,
    url: data.publicUrl as string,
    storagePath,
    alt: "",
    caption: "",
  } satisfies LearningMedia;
}

export async function deleteLearningMedia(media: LearningMedia) {
  if (!media.storagePath) return;
  const storage = (supabase as any).storage.from("learning-media");
  const { error } = await storage.remove([media.storagePath]);
  if (error) throw error;
}

async function requireCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw error ?? new Error("برای مدیریت محتوا باید وارد حساب مدیر شوید.");
  }

  return user;
}
