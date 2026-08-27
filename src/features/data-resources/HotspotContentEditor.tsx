import { useEffect, useState } from "react";
import { BookOpenCheck, ChevronDown, Save } from "lucide-react";

import type { EditableResourceHotspot } from "./resource-tour-model";

type HotspotContentEditorProps = {
  hotspots: EditableResourceHotspot[];
  onSave: (items: EditableResourceHotspot[]) => void | Promise<void>;
};

const fieldClass =
  "mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm leading-6 text-slate-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100";

export function HotspotContentEditor({ hotspots, onSave }: HotspotContentEditorProps) {
  const [items, setItems] = useState(hotspots);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setItems(hotspots);
  }, [hotspots]);

  function update(key: string, field: keyof EditableResourceHotspot, value: string) {
    setItems((current) =>
      current.map((item) => (item.key === key ? { ...item, [field]: value } : item)),
    );
  }

  async function handleSave() {
    setSaving(true);
    try {
      await onSave(items);
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-teal-700">
            <BookOpenCheck className="h-5 w-5" />
            <h2 className="text-xl font-black text-slate-950">محتوای آموزشی Hotspotها</h2>
          </div>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-500">
            عنوان هر Hotspot همان اصطلاح انگلیسی رابط اصلی GDC باقی می‌ماند. متن آموزشی فارسی را با ساختار ثابت «در یک جمله، چرا مهم است، مثال پژوهشی، اشتباه رایج، تمرین و قدم بعدی» ویرایش کنید.
          </p>
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save className="h-4 w-4" />
          {saving ? "در حال ذخیره…" : "ذخیره محتوای Hotspotها"}
        </button>
      </div>

      <div className="mt-6 space-y-3">
        {items.map((item, index) => (
          <details
            key={item.key}
            open={index === 0}
            className="group overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/60"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-4 sm:px-5">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-100 text-xs font-black text-teal-800">
                  {item.step}
                </span>
                <div className="min-w-0">
                  <div className="truncate text-base font-black text-slate-950" dir="ltr">
                    {item.title}
                  </div>
                  <div className="mt-0.5 truncate text-xs font-semibold text-slate-500">
                    {item.persianLabel}
                  </div>
                </div>
              </div>
              <ChevronDown className="h-5 w-5 shrink-0 text-slate-400 transition group-open:rotate-180" />
            </summary>

            <div className="border-t border-slate-200 bg-white p-4 sm:p-5">
              <div className="grid gap-4 lg:grid-cols-2">
                <label className="text-xs font-bold text-slate-600">
                  عنوان انگلیسی Hotspot
                  <input value={item.title} readOnly dir="ltr" className={`${fieldClass} bg-slate-50 text-slate-500`} />
                  <span className="mt-1 block text-[11px] font-normal text-slate-400">
                    برای هماهنگی با GDC اصلی، این عنوان در این ویرایشگر ثابت نگه داشته شده است.
                  </span>
                </label>

                <label className="text-xs font-bold text-slate-600">
                  معادل فارسی آموزشی
                  <input
                    value={item.persianLabel}
                    onChange={(event) => update(item.key, "persianLabel", event.target.value)}
                    className={fieldClass}
                  />
                </label>
              </div>

              <div className="mt-4 grid gap-4 xl:grid-cols-2">
                <label className="text-xs font-bold text-slate-600">
                  در یک جمله
                  <textarea
                    rows={4}
                    value={item.description}
                    onChange={(event) => update(item.key, "description", event.target.value)}
                    className={fieldClass}
                  />
                </label>

                <label className="text-xs font-bold text-slate-600">
                  چرا مهم است؟
                  <textarea
                    rows={4}
                    value={item.whyItMatters}
                    onChange={(event) => update(item.key, "whyItMatters", event.target.value)}
                    className={fieldClass}
                  />
                </label>

                <label className="text-xs font-bold text-slate-600">
                  مثال پژوهشی
                  <textarea
                    rows={4}
                    value={item.researchExample}
                    onChange={(event) => update(item.key, "researchExample", event.target.value)}
                    className={fieldClass}
                  />
                </label>

                <label className="text-xs font-bold text-slate-600">
                  اشتباه رایج
                  <textarea
                    rows={4}
                    value={item.commonMistake}
                    onChange={(event) => update(item.key, "commonMistake", event.target.value)}
                    className={fieldClass}
                  />
                </label>

                <label className="text-xs font-bold text-slate-600">
                  سؤال تمرینی
                  <textarea
                    rows={3}
                    value={item.exerciseQuestion}
                    onChange={(event) => update(item.key, "exerciseQuestion", event.target.value)}
                    className={fieldClass}
                  />
                </label>

                <label className="text-xs font-bold text-slate-600">
                  پاسخ تمرین
                  <textarea
                    rows={3}
                    value={item.exerciseAnswer}
                    onChange={(event) => update(item.key, "exerciseAnswer", event.target.value)}
                    className={fieldClass}
                  />
                </label>
              </div>

              <label className="mt-4 block text-xs font-bold text-slate-600">
                ارتباط با مرحله بعد
                <textarea
                  rows={3}
                  value={item.action}
                  onChange={(event) => update(item.key, "action", event.target.value)}
                  className={fieldClass}
                />
              </label>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
