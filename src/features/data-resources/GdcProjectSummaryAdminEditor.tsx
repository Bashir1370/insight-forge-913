import { Save } from "lucide-react";
import { useState } from "react";

export function GdcProjectSummaryAdminEditor({
  title,
  intro,
  onSave,
}: {
  title: string;
  intro: string;
  onSave: (value: { title: string; intro: string }) => void | Promise<void>;
}) {
  const [saving, setSaving] = useState(false);
  const [draftTitle, setDraftTitle] = useState(title);
  const [draftIntro, setDraftIntro] = useState(intro);

  async function save() {
    setSaving(true);
    try {
      await onSave({ title: draftTitle, intro: draftIntro });
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="rounded-2xl border border-teal-200 bg-teal-50/30 p-4" dir="rtl">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-black text-slate-950">مرحله Project Summary</h3>
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-teal-700 px-4 py-2 text-xs font-bold text-white disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {saving ? "ذخیره..." : "ذخیره"}
        </button>
      </div>
      <input
        className="mt-4 w-full rounded-xl border border-slate-200 bg-white p-3"
        value={draftTitle}
        onChange={(e) => setDraftTitle(e.target.value)}
      />
      <textarea
        className="mt-3 min-h-32 w-full rounded-xl border border-slate-200 bg-white p-3"
        value={draftIntro}
        onChange={(e) => setDraftIntro(e.target.value)}
      />
    </section>
  );
}
