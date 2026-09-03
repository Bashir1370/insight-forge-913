import { useEffect, useRef, useState, type ChangeEvent } from "react";

import { supabase } from "@/integrations/supabase/client";

type VisualAssetEditorProps = {
  resourceSlug: string;
  imageUrl: string;
  onSave: (imageUrl: string) => void | Promise<void>;
  title?: string;
  description?: string;
  allowRemove?: boolean;
};

const LEARNING_MEDIA_BUCKET = "learning-media";

function safeFileName(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/-+/g, "-");
}

export function VisualAssetEditor({
  resourceSlug,
  imageUrl,
  onSave,
  title = "تصویر Resource",
  description = "تصویر GDC را مستقیماً در learning-media بارگذاری کنید یا URL وارد کنید.",
  allowRemove = true,
}: VisualAssetEditorProps) {
  const [draft, setDraft] = useState(imageUrl);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setDraft(imageUrl);
  }, [imageUrl]);

  async function persist(next: string) {
    setSaving(true);
    setError(null);
    try {
      await onSave(next);
    } catch (saveError) {
      console.error(saveError);
      setError(
        saveError instanceof Error
          ? saveError.message
          : "ذخیره تصویر با خطا مواجه شد.",
      );
      throw saveError;
    } finally {
      setSaving(false);
    }
  }

  async function uploadImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("فقط فایل تصویری قابل بارگذاری است.");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const fileName = safeFileName(file.name || "resource-image.webp");
      const path = `resource-tours/${resourceSlug}/${Date.now()}-${fileName}`;
      const { error: uploadError } = await supabase.storage
        .from(LEARNING_MEDIA_BUCKET)
        .upload(path, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type,
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from(LEARNING_MEDIA_BUCKET)
        .getPublicUrl(path);

      setDraft(data.publicUrl);
      await persist(data.publicUrl);
    } catch (uploadError) {
      console.error(uploadError);
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "بارگذاری تصویر با خطا مواجه شد.",
      );
    } finally {
      setUploading(false);
    }
  }

  async function removeImage() {
    setDraft("");
    await persist("");
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-black text-slate-950">{title}</h3>
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {allowRemove && (draft || imageUrl) ? (
            <button
              type="button"
              disabled={uploading || saving}
              onClick={removeImage}
              className="rounded-xl border border-rose-200 bg-white px-4 py-2 text-sm font-bold text-rose-700 transition hover:bg-rose-50 disabled:opacity-50"
            >
              حذف تصویر
            </button>
          ) : null}
          <button
            type="button"
            disabled={uploading || saving}
            onClick={() => inputRef.current?.click()}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-teal-400 hover:text-teal-700 disabled:opacity-50"
          >
            {uploading ? "در حال بارگذاری…" : "آپلود تصویر"}
          </button>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="hidden"
        onChange={uploadImage}
      />

      <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
        <input
          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-teal-500"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Image URL"
          dir="ltr"
        />
        <button
          type="button"
          disabled={saving || uploading}
          onClick={() => persist(draft.trim())}
          className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-bold text-white transition hover:bg-teal-800 disabled:opacity-50"
        >
          {saving ? "در حال ذخیره…" : "ذخیره آدرس تصویر"}
        </button>
      </div>

      {draft ? (
        <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
          <img
            src={draft}
            alt="Resource preview"
            className="max-h-56 w-full object-contain"
          />
        </div>
      ) : (
        <div className="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-xs font-bold text-slate-400">
          تصویری انتخاب نشده است.
        </div>
      )}

      {error ? (
        <p className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>
      ) : null}
    </section>
  );
}
