import { useEffect, useRef, useState, type ChangeEvent } from "react";

import { supabase } from "@/integrations/supabase/client";

type VisualAssetEditorProps = {
  resourceSlug: string;
  imageUrl: string;
  onSave: (imageUrl: string) => void | Promise<void>;
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
}: VisualAssetEditorProps) {
  const [draft, setDraft] = useState(imageUrl);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setDraft(imageUrl);
  }, [imageUrl]);

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
      await onSave(data.publicUrl);
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

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-black text-slate-950">تصویر Resource</h3>
          <p className="mt-1 text-sm text-slate-500">
            تصویر GDC را مستقیماً در learning-media بارگذاری کنید یا URL وارد کنید.
          </p>
        </div>
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-teal-400 hover:text-teal-700 disabled:opacity-50"
        >
          {uploading ? "در حال بارگذاری…" : "آپلود تصویر"}
        </button>
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
          onClick={() => onSave(draft.trim())}
          className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-bold text-white transition hover:bg-teal-800"
        >
          ذخیره آدرس تصویر
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
      ) : null}

      {error ? (
        <p className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>
      ) : null}
    </section>
  );
}
