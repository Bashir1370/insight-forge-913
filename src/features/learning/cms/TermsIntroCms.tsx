import { useEffect, useState } from "react";
import { Eye, EyeOff, Save, Send, SlidersHorizontal } from "lucide-react";
import { toast } from "sonner";

import {
  loadLearningDraft,
  publishLearningDocument,
  saveLearningDraft,
  useLearningAdminAccess,
  usePublishedLearningDocument,
} from "@/features/learning/cms/learning-content-service";

export type TermsIntroContent = {
  version: 1;
  visible: boolean;
  title: string;
  description: string;
};

export const defaultTermsIntroContent: TermsIntroContent = {
  version: 1,
  visible: true,
  title: "اصطلاح علمی؛ اول معنی، بعد نام",
  description:
    "اصطلاح‌های دارای معادل روشن با نوشتار فارسی نمایش داده می‌شوند؛ نام‌های علمی و اختصارهای بدون معادل جاافتاده همان شکل علمی خود را حفظ می‌کنند.",
};

export function useTermsIntroContent(pageKey: string) {
  const { document, reload } =
    usePublishedLearningDocument<TermsIntroContent>(pageKey);
  const { isAdmin } = useLearningAdminAccess();
  const [preview, setPreview] = useState<TermsIntroContent | null>(null);

  const content = sanitizeTermsIntro(preview ?? document);

  return { content, isAdmin, setPreview, reload };
}

export function TermsIntroCmsControl({
  pageKey,
  content,
  onPreview,
  onPublished,
}: {
  pageKey: string;
  content: TermsIntroContent;
  onPreview: (content: TermsIntroContent | null) => void;
  onPublished: () => Promise<void> | void;
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<TermsIntroContent>(content);
  const [previewing, setPreviewing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    if (!open) return;
    let mounted = true;

    void loadLearningDraft<TermsIntroContent>(pageKey)
      .then((saved) => {
        if (mounted) setDraft(sanitizeTermsIntro(saved ?? content));
      })
      .catch((error) => {
        console.error(error);
        if (mounted) setDraft(content);
      });

    return () => {
      mounted = false;
    };
  }, [content, open, pageKey]);

  function togglePreview() {
    if (previewing) {
      onPreview(null);
      setPreviewing(false);
      return;
    }

    onPreview(draft);
    setPreviewing(true);
  }

  async function saveDraft() {
    setSaving(true);
    try {
      await saveLearningDraft(pageKey, draft);
      toast.success("تنظیمات توضیح اصطلاحات ذخیره شد.");
    } catch (error) {
      console.error(error);
      toast.error("ذخیره تنظیمات توضیح اصطلاحات انجام نشد.");
    } finally {
      setSaving(false);
    }
  }

  async function publish() {
    setPublishing(true);
    try {
      await publishLearningDocument(pageKey, draft);
      onPreview(null);
      setPreviewing(false);
      await onPublished();
      toast.success("تنظیمات توضیح اصطلاحات منتشر شد.");
    } catch (error) {
      console.error(error);
      toast.error("انتشار تنظیمات توضیح اصطلاحات انجام نشد.");
    } finally {
      setPublishing(false);
    }
  }

  return (
    <div className="mb-4 rounded-2xl border border-violet-300 bg-white p-3" dir="rtl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black text-violet-800">کنترل CMS این بلوک</p>
          <p className="mt-1 text-[11px] leading-5 text-slate-500">
            عنوان و توضیح بالای کارت‌های اصطلاح را ویرایش یا کاملاً مخفی کنید.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="inline-flex min-h-9 items-center gap-2 rounded-xl bg-violet-700 px-3 text-xs font-black text-white"
        >
          <SlidersHorizontal className="size-4" />
          {open ? "بستن تنظیمات" : "تنظیم توضیح اصطلاحات"}
        </button>
      </div>

      {open && (
        <div className="mt-4 grid gap-4 border-t border-violet-100 pt-4">
          <label className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
            <span>
              <span className="block text-xs font-black text-slate-700">
                نمایش توضیح بالای اصطلاحات
              </span>
              <span className="mt-1 block text-[11px] leading-5 text-slate-500">
                با خاموش‌کردن این گزینه فقط کارت‌های اصطلاح باقی می‌مانند.
              </span>
            </span>
            <input
              type="checkbox"
              checked={draft.visible}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  visible: event.target.checked,
                }))
              }
              className="size-4"
            />
          </label>

          <label className="grid gap-1.5">
            <span className="text-xs font-bold text-slate-600">عنوان</span>
            <input
              value={draft.title}
              onChange={(event) =>
                setDraft((current) => ({ ...current, title: event.target.value }))
              }
              disabled={!draft.visible}
              className="min-h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm disabled:opacity-50"
            />
          </label>

          <label className="grid gap-1.5">
            <span className="text-xs font-bold text-slate-600">متن توضیح</span>
            <textarea
              value={draft.description}
              rows={3}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  description: event.target.value,
                }))
              }
              disabled={!draft.visible}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm leading-7 disabled:opacity-50"
            />
          </label>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={togglePreview}
              className="inline-flex min-h-9 items-center gap-2 rounded-xl border border-sky-200 bg-sky-50 px-3 text-xs font-bold text-sky-800"
            >
              {previewing ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              {previewing ? "پایان پیش‌نمایش" : "پیش‌نمایش"}
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={() => void saveDraft()}
              className="inline-flex min-h-9 items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 text-xs font-bold text-emerald-800 disabled:opacity-50"
            >
              <Save className="size-4" /> ذخیره پیش‌نویس
            </button>
            <button
              type="button"
              disabled={publishing}
              onClick={() => void publish()}
              className="inline-flex min-h-9 items-center gap-2 rounded-xl bg-slate-950 px-3 text-xs font-black text-white disabled:opacity-50"
            >
              <Send className="size-4" /> انتشار
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function sanitizeTermsIntro(
  value: TermsIntroContent | null,
): TermsIntroContent {
  if (!value || typeof value !== "object") return defaultTermsIntroContent;

  return {
    version: 1,
    visible: typeof value.visible === "boolean" ? value.visible : true,
    title:
      typeof value.title === "string"
        ? value.title
        : defaultTermsIntroContent.title,
    description:
      typeof value.description === "string"
        ? value.description
        : defaultTermsIntroContent.description,
  };
}
