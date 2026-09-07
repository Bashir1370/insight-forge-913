import { Plus, Save, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { HotspotCanvasEditor } from "./HotspotCanvasEditor";
import { VisualAssetEditor } from "./VisualAssetEditor";
import type {
  GdcProjectSummaryConfig,
  GdcProjectSummaryHotspot,
} from "./gdc-project-summary-config";
import type { EditableResourceHotspot } from "./resource-tour-model";

function toCanvasHotspots(items: GdcProjectSummaryHotspot[]): EditableResourceHotspot[] {
  return items.map((item, index) => ({
    key: item.key,
    step: index + 1,
    title: item.label,
    persianLabel: item.short,
    description: item.body,
    whyItMatters: item.researchUse,
    researchExample: "",
    commonMistake: item.caution ?? "",
    exerciseQuestion: "",
    exerciseAnswer: "",
    action: "",
    x: item.x,
    y: item.y,
    width: item.width,
    height: item.height,
  }));
}

export function GdcProjectSummaryAdminEditor({
  config,
  onChange,
  onSave,
}: {
  config: GdcProjectSummaryConfig;
  onChange?: (value: GdcProjectSummaryConfig) => void;
  onSave: (value: GdcProjectSummaryConfig) => void | Promise<void>;
}) {
  const [draft, setDraft] = useState(config);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setDraft(config);
  }, [config]);

  const canvasHotspots = useMemo(() => toCanvasHotspots(draft.hotspots), [draft.hotspots]);

  function update(next: GdcProjectSummaryConfig) {
    setDraft(next);
    onChange?.(next);
  }

  function patch<K extends keyof GdcProjectSummaryConfig>(key: K, value: GdcProjectSummaryConfig[K]) {
    update({ ...draft, [key]: value });
  }

  function updateHotspot(index: number, patchValue: Partial<GdcProjectSummaryHotspot>) {
    patch(
      "hotspots",
      draft.hotspots.map((item, i) => (i === index ? { ...item, ...patchValue } : item)),
    );
  }

  function addHotspot() {
    const nextIndex = draft.hotspots.length + 1;
    patch("hotspots", [
      ...draft.hotspots,
      {
        key: `summary-hotspot-${Date.now()}`,
        label: `Hotspot ${nextIndex}`,
        short: "",
        body: "",
        researchUse: "",
        caution: "",
        x: 45,
        y: 45,
        width: 12,
        height: 8,
      },
    ]);
  }

  async function save(value = draft) {
    setSaving(true);
    try {
      await onSave(value);
    } finally {
      setSaving(false);
    }
  }

  async function saveImage(imageUrl: string) {
    const next = { ...draft, imageUrl };
    update(next);
    await save(next);
  }

  async function saveCanvas(items: EditableResourceHotspot[]) {
    const geometry = new Map(items.map((item) => [item.key, item]));
    const next = {
      ...draft,
      hotspots: draft.hotspots.map((item) => {
        const found = geometry.get(item.key);
        return found
          ? {
              ...item,
              x: found.x,
              y: found.y,
              width: found.width,
              height: found.height,
            }
          : item;
      }),
    };
    update(next);
    await save(next);
  }

  return (
    <section className="rounded-3xl border border-teal-200 bg-white p-5 shadow-sm sm:p-6" dir="rtl">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-slate-950">مرحله ۵ · خواندن اطلاعات پروژه</h2>
          <p className="mt-2 max-w-4xl text-sm leading-7 text-slate-500">
            تمام محتوای این مرحله از همین بخش قابل مدیریت است: عنوان، متن‌ها، تصویر Project Summary، متن هر Hotspot و موقعیت/اندازه آن روی تصویر.
          </p>
        </div>
        <button
          type="button"
          onClick={() => save()}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-teal-700 px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {saving ? "در حال ذخیره…" : "ذخیره مرحله ۵"}
        </button>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <label className="text-xs font-bold text-slate-600">
          عنوان مرحله
          <input
            value={draft.title}
            onChange={(event) => patch("title", event.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-sm"
          />
        </label>
        <label className="text-xs font-bold text-slate-600">
          Badge روی تصویر
          <input
            value={draft.badge}
            onChange={(event) => patch("badge", event.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-sm"
          />
        </label>
        <label className="text-xs font-bold text-slate-600">
          تیتر بالای تصویر
          <input
            value={draft.mapEyebrow}
            onChange={(event) => patch("mapEyebrow", event.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-sm"
          />
        </label>
        <label className="text-xs font-bold text-slate-600">
          راهنمای کلیک روی تصویر
          <input
            value={draft.mapInstruction}
            onChange={(event) => patch("mapInstruction", event.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-sm"
          />
        </label>
      </div>

      <label className="mt-4 block text-xs font-bold text-slate-600">
        متن معرفی مرحله
        <textarea
          value={draft.intro}
          onChange={(event) => patch("intro", event.target.value)}
          className="mt-1 min-h-28 w-full rounded-xl border border-slate-200 p-3 text-sm leading-7"
        />
      </label>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <label className="text-xs font-bold text-slate-600">
          عنوان باکس هدف
          <input
            value={draft.goalTitle}
            onChange={(event) => patch("goalTitle", event.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-sm"
          />
        </label>
        <label className="text-xs font-bold text-slate-600 lg:row-span-2">
          متن باکس هدف
          <textarea
            value={draft.goalBody}
            onChange={(event) => patch("goalBody", event.target.value)}
            className="mt-1 min-h-28 w-full rounded-xl border border-slate-200 p-3 text-sm leading-7"
          />
        </label>
      </div>

      <div className="mt-6">
        <VisualAssetEditor
          resourceSlug="gdc-project-summary-stage"
          imageUrl={draft.imageUrl}
          onSave={saveImage}
          title="تصویر مرحله ۵"
          description="اسکرین‌شات Project Summary را آپلود کنید یا URL تصویر را وارد کنید. تصویر جدید بلافاصله با تنظیمات مرحله ۵ ذخیره می‌شود."
          allowRemove
        />
      </div>

      <div className="mt-6">
        <HotspotCanvasEditor
          hotspots={canvasHotspots}
          imageUrl={draft.imageUrl}
          onSave={saveCanvas}
        />
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-black text-slate-950">محتوای Hotspotها</h3>
          <p className="mt-1 text-xs text-slate-500">Hotspot جدید اضافه کنید، متنش را عوض کنید یا حذفش کنید.</p>
        </div>
        <button
          type="button"
          onClick={addHotspot}
          className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2 text-sm font-bold text-white"
        >
          <Plus className="h-4 w-4" /> افزودن Hotspot
        </button>
      </div>

      <div className="mt-4 space-y-4">
        {draft.hotspots.map((spot, index) => (
          <div key={spot.key} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="font-black text-slate-900">{index + 1}. {spot.label}</div>
              <button
                type="button"
                onClick={() => patch("hotspots", draft.hotspots.filter((_, i) => i !== index))}
                className="rounded-lg border border-rose-200 bg-white p-2 text-rose-600"
                aria-label="حذف Hotspot"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <label className="text-xs font-bold text-slate-600">
                شناسه داخلی
                <input
                  value={spot.key}
                  onChange={(event) => updateHotspot(index, { key: event.target.value })}
                  className="mt-1 w-full rounded-lg border bg-white p-2 text-sm"
                  dir="ltr"
                />
              </label>
              <label className="text-xs font-bold text-slate-600">
                عنوان Hotspot
                <input
                  value={spot.label}
                  onChange={(event) => updateHotspot(index, { label: event.target.value })}
                  className="mt-1 w-full rounded-lg border bg-white p-2 text-sm"
                />
              </label>
              <label className="text-xs font-bold text-slate-600 md:col-span-2">
                زیرعنوان کوتاه
                <input
                  value={spot.short}
                  onChange={(event) => updateHotspot(index, { short: event.target.value })}
                  className="mt-1 w-full rounded-lg border bg-white p-2 text-sm"
                />
              </label>
              <label className="text-xs font-bold text-slate-600 md:col-span-2">
                توضیح اصلی
                <textarea
                  value={spot.body}
                  onChange={(event) => updateHotspot(index, { body: event.target.value })}
                  className="mt-1 min-h-24 w-full rounded-lg border bg-white p-2 text-sm leading-7"
                />
              </label>
              <label className="text-xs font-bold text-slate-600 md:col-span-2">
                کاربرد پژوهشی
                <textarea
                  value={spot.researchUse}
                  onChange={(event) => updateHotspot(index, { researchUse: event.target.value })}
                  className="mt-1 min-h-20 w-full rounded-lg border bg-white p-2 text-sm leading-7"
                />
              </label>
              <label className="text-xs font-bold text-slate-600 md:col-span-2">
                اشتباه رایج / هشدار
                <textarea
                  value={spot.caution ?? ""}
                  onChange={(event) => updateHotspot(index, { caution: event.target.value })}
                  className="mt-1 min-h-20 w-full rounded-lg border bg-white p-2 text-sm leading-7"
                />
              </label>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 p-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-black text-slate-950">چک‌لیست سریع</h3>
          <button
            type="button"
            onClick={() => patch("quickChecks", [...draft.quickChecks, { title: "آیتم جدید", body: "" }])}
            className="rounded-lg border px-3 py-2 text-xs font-bold"
          >
            + افزودن آیتم
          </button>
        </div>
        <input
          value={draft.quickChecksTitle}
          onChange={(event) => patch("quickChecksTitle", event.target.value)}
          className="mt-3 w-full rounded-lg border p-2 text-sm"
          placeholder="عنوان چک‌لیست"
        />
        <div className="mt-3 space-y-3">
          {draft.quickChecks.map((item, index) => (
            <div key={index} className="grid gap-2 rounded-xl bg-slate-50 p-3 md:grid-cols-[1fr_2fr_auto]">
              <input
                value={item.title}
                onChange={(event) => patch("quickChecks", draft.quickChecks.map((row, i) => i === index ? { ...row, title: event.target.value } : row))}
                className="rounded-lg border bg-white p-2 text-sm"
              />
              <input
                value={item.body}
                onChange={(event) => patch("quickChecks", draft.quickChecks.map((row, i) => i === index ? { ...row, body: event.target.value } : row))}
                className="rounded-lg border bg-white p-2 text-sm"
              />
              <button
                type="button"
                onClick={() => patch("quickChecks", draft.quickChecks.filter((_, i) => i !== index))}
                className="rounded-lg border border-rose-200 bg-white px-3 text-rose-600"
              >
                حذف
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <label className="text-xs font-bold text-slate-600">
          عنوان خودآزمایی
          <input value={draft.quizTitle} onChange={(event) => patch("quizTitle", event.target.value)} className="mt-1 w-full rounded-xl border p-3 text-sm" />
        </label>
        <label className="text-xs font-bold text-slate-600">
          متن دکمه پاسخ
          <input value={draft.quizButtonLabel} onChange={(event) => patch("quizButtonLabel", event.target.value)} className="mt-1 w-full rounded-xl border p-3 text-sm" />
        </label>
        <label className="text-xs font-bold text-slate-600 lg:col-span-2">
          سؤال
          <textarea value={draft.quizQuestion} onChange={(event) => patch("quizQuestion", event.target.value)} className="mt-1 min-h-20 w-full rounded-xl border p-3 text-sm leading-7" />
        </label>
        <label className="text-xs font-bold text-slate-600 lg:col-span-2">
          پاسخ
          <textarea value={draft.quizAnswer} onChange={(event) => patch("quizAnswer", event.target.value)} className="mt-1 min-h-24 w-full rounded-xl border p-3 text-sm leading-7" />
        </label>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <label className="text-xs font-bold text-slate-600">
          عنوان نکته پایانی
          <input value={draft.numbersTitle} onChange={(event) => patch("numbersTitle", event.target.value)} className="mt-1 w-full rounded-xl border p-3 text-sm" />
        </label>
        <label className="text-xs font-bold text-slate-600 lg:row-span-2">
          متن نکته پایانی
          <textarea value={draft.numbersBody} onChange={(event) => patch("numbersBody", event.target.value)} className="mt-1 min-h-24 w-full rounded-xl border p-3 text-sm leading-7" />
        </label>
      </div>

      <button
        type="button"
        onClick={() => save()}
        disabled={saving}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 py-3 text-sm font-black text-white disabled:opacity-50"
      >
        <Save className="h-4 w-4" />
        {saving ? "در حال ذخیره…" : "ذخیره همه تغییرات مرحله ۵"}
      </button>
    </section>
  );
}
