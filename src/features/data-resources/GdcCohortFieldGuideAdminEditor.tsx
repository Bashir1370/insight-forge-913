import { Crosshair, Plus, Save, Trash2 } from "lucide-react";

import { HotspotCanvasEditor } from "./HotspotCanvasEditor";
import { VisualAssetEditor } from "./VisualAssetEditor";
import type {
  GdcCohortFieldGuideConfig,
  GdcCohortFieldGuideField,
  GdcCohortFieldGuidePage,
  GdcCohortFieldGuideTab,
} from "./gdc-cohort-field-guide-config";
import type { EditableResourceHotspot } from "./resource-tour-model";

function Input({
  label,
  value,
  onChange,
  dir,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  dir?: "rtl" | "ltr";
}) {
  return (
    <label className="block text-xs font-bold text-slate-600" dir={dir}>
      {label}
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 outline-none focus:border-teal-500"
      />
    </label>
  );
}

function Textarea({
  label,
  value,
  onChange,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}) {
  return (
    <label className="block text-xs font-bold text-slate-600">
      {label}
      <textarea
        rows={rows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm leading-7 text-slate-950 outline-none focus:border-teal-500"
      />
    </label>
  );
}

function NumberInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block text-[10px] font-bold text-slate-500" dir="ltr">
      {label}
      <input
        type="number"
        min={0}
        max={100}
        step={0.1}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2 py-2 text-xs text-slate-900 outline-none focus:border-teal-500"
      />
    </label>
  );
}

function pageHotspots(page: GdcCohortFieldGuidePage): EditableResourceHotspot[] {
  return page.fields.map((field, index) => ({
    key: field.key,
    step: index + 1,
    title: field.label,
    persianLabel: field.label,
    description: field.description,
    whyItMatters: "",
    researchExample: "",
    commonMistake: "",
    exerciseQuestion: "",
    exerciseAnswer: "",
    action: "",
    x: field.x,
    y: field.y,
    width: field.width,
    height: field.height,
  }));
}

function uniqueKey(existing: string[], base: string) {
  let index = existing.length + 1;
  let key = `${base}-${index}`;
  while (existing.includes(key)) {
    index += 1;
    key = `${base}-${index}`;
  }
  return key;
}

export function GdcCohortFieldGuideAdminEditor({
  config,
  onChange,
  onSave,
}: {
  config: GdcCohortFieldGuideConfig;
  onChange: (config: GdcCohortFieldGuideConfig) => void;
  onSave: (config: GdcCohortFieldGuideConfig) => void | Promise<void>;
}) {
  function patchConfig(patch: Partial<GdcCohortFieldGuideConfig>) {
    const next = { ...config, ...patch };
    onChange(next);
    return next;
  }

  function patchTab(tabKey: string, patch: Partial<GdcCohortFieldGuideTab>) {
    const next = {
      ...config,
      tabs: config.tabs.map((tab) => (tab.key === tabKey ? { ...tab, ...patch } : tab)),
    };
    onChange(next);
    return next;
  }

  function patchPage(tabKey: string, pageKey: string, patch: Partial<GdcCohortFieldGuidePage>) {
    const next = {
      ...config,
      tabs: config.tabs.map((tab) =>
        tab.key === tabKey
          ? {
              ...tab,
              pages: tab.pages.map((page) =>
                page.key === pageKey ? { ...page, ...patch } : page,
              ),
            }
          : tab,
      ),
    };
    onChange(next);
    return next;
  }

  function patchField(
    tabKey: string,
    pageKey: string,
    fieldKey: string,
    patch: Partial<GdcCohortFieldGuideField>,
  ) {
    const tab = config.tabs.find((item) => item.key === tabKey);
    const page = tab?.pages.find((item) => item.key === pageKey);
    if (!tab || !page) return config;
    return patchPage(tabKey, pageKey, {
      fields: page.fields.map((field) =>
        field.key === fieldKey ? { ...field, ...patch } : field,
      ),
    });
  }

  function addPage(tab: GdcCohortFieldGuideTab) {
    const pageKey = uniqueKey(tab.pages.map((page) => page.key), `${tab.key}-page`);
    patchTab(tab.key, {
      pages: [
        ...tab.pages,
        { key: pageKey, imageUrl: "", fields: [], spotlightFieldKey: "" },
      ],
    });
  }

  function removePage(tab: GdcCohortFieldGuideTab, pageKey: string) {
    if (tab.pages.length <= 1) return;
    if (!window.confirm("این صفحه و تمام فیلترهای داخل آن حذف شود؟")) return;
    patchTab(tab.key, { pages: tab.pages.filter((page) => page.key !== pageKey) });
  }

  function addField(tab: GdcCohortFieldGuideTab, page: GdcCohortFieldGuidePage) {
    const key = uniqueKey(page.fields.map((item) => item.key), "filter");
    const nextField: GdcCohortFieldGuideField = {
      key,
      label: "Filter جدید",
      description: "توضیح کوتاه این فیلتر را وارد کنید.",
      x: 10,
      y: 10,
      width: 15,
      height: 5,
      panelX: 10,
      panelY: 10,
      panelWidth: 18,
      panelHeight: 20,
    };
    patchPage(tab.key, page.key, {
      fields: [...page.fields, nextField],
      spotlightFieldKey: page.spotlightFieldKey || key,
    });
  }

  function removeField(tabKey: string, page: GdcCohortFieldGuidePage, fieldKey: string) {
    if (!window.confirm("این فیلتر حذف شود؟")) return;
    const fields = page.fields.filter((item) => item.key !== fieldKey);
    patchPage(tabKey, page.key, {
      fields,
      spotlightFieldKey:
        page.spotlightFieldKey === fieldKey ? fields[0]?.key ?? "" : page.spotlightFieldKey,
    });
  }

  return (
    <section className="rounded-3xl border border-amber-200 bg-white p-6 shadow-sm" dir="rtl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-xs font-black text-amber-700">سؤال ۲ · مرحله ۳ · معرفی فیلترهای داخل هر دسته</div>
          <h2 className="mt-1 text-2xl font-black text-slate-950">Cohort Field Guide Editor</h2>
          <p className="mt-2 max-w-4xl text-sm leading-7 text-slate-600">
            برای هر تب می‌توانید یک یا چند اسکرین‌شات زیر هم قرار دهید، عنوان‌های قابل Hover/Click بسازید، توضیح کوتاه هر فیلتر را عوض کنید و محدوده Spotlight آموزشی را کنترل کنید.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onSave(config)}
          className="inline-flex items-center gap-2 rounded-xl bg-teal-700 px-5 py-3 text-sm font-black text-white hover:bg-teal-800"
        >
          <Save className="h-4 w-4" /> ذخیره مرحله ۳ سؤال ۲
        </button>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Input label="عنوان مرحله" value={config.title} onChange={(value) => patchConfig({ title: value })} />
        <Input label="متن دکمه ادامه" value={config.nextButton} onChange={(value) => patchConfig({ nextButton: value })} />
        <Textarea label="مقدمه مرحله" value={config.intro} onChange={(value) => patchConfig({ intro: value })} rows={4} />
        <Textarea label="پیام راهنمای ۲ ثانیه‌ای" value={config.instruction} onChange={(value) => patchConfig({ instruction: value })} rows={3} />
        <Input label="تیتر بالای Popover" value={config.tooltipHint} onChange={(value) => patchConfig({ tooltipHint: value })} />
      </div>

      <div className="mt-6 space-y-5">
        {config.tabs.map((tab) => (
          <details key={tab.key} className="rounded-2xl border border-slate-200 bg-slate-50/30 p-4" open={tab.key === "general"}>
            <summary className="cursor-pointer list-none">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-black text-teal-700" dir="ltr">{tab.label}</div>
                  <div className="mt-1 text-[11px] text-slate-500">{tab.pages.length} صفحه · {tab.pages.reduce((sum, page) => sum + page.fields.length, 0)} فیلتر</div>
                </div>
                <button
                  type="button"
                  onClick={(event) => {
                    event.preventDefault();
                    addPage(tab);
                  }}
                  className="inline-flex items-center gap-1 rounded-lg border border-teal-200 bg-white px-3 py-2 text-[10px] font-black text-teal-700"
                >
                  <Plus className="h-3.5 w-3.5" /> افزودن صفحه
                </button>
              </div>
            </summary>

            <div className="mt-4">
              <Input label="توضیح کوتاه تب" value={tab.helper} onChange={(value) => patchTab(tab.key, { helper: value })} />
            </div>

            <div className="mt-4 space-y-5">
              {tab.pages.map((page, pageIndex) => (
                <section key={page.key} className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="text-[10px] font-black text-amber-700">صفحه {pageIndex + 1}</div>
                      <code className="text-[10px] text-slate-400">{page.key}</code>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => addField(tab, page)}
                        className="inline-flex items-center gap-1 rounded-lg border border-teal-200 px-3 py-2 text-[10px] font-black text-teal-700"
                      >
                        <Plus className="h-3.5 w-3.5" /> افزودن فیلتر
                      </button>
                      {tab.pages.length > 1 ? (
                        <button
                          type="button"
                          onClick={() => removePage(tab, page.key)}
                          className="rounded-lg border border-rose-100 p-2 text-rose-600"
                          title="حذف صفحه"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      ) : null}
                    </div>
                  </div>

                  <div className="mt-4">
                    <VisualAssetEditor
                      resourceSlug={`gdc-q2-field-guide-${tab.key}-${page.key}`}
                      imageUrl={page.imageUrl}
                      title={`اسکرین‌شات ${tab.label} · صفحه ${pageIndex + 1}`}
                      description="اسکرین‌شات واقعی همان دسته در Cohort Builder. برای دسته‌های شلوغ می‌توانید صفحه دوم هم اضافه کنید تا زیر صفحه اول نمایش داده شود."
                      onSave={async (imageUrl) => {
                        const next = patchPage(tab.key, page.key, { imageUrl });
                        await onSave(next);
                      }}
                    />
                  </div>

                  <div className="mt-4 space-y-3">
                    {page.fields.map((field) => (
                      <details key={field.key} className="rounded-xl border border-slate-200 bg-slate-50/50 p-3">
                        <summary className="cursor-pointer list-none">
                          <div className="flex items-center justify-between gap-3">
                            <div className="text-xs font-black text-slate-900" dir="ltr">{field.label}</div>
                            <button
                              type="button"
                              onClick={(event) => {
                                event.preventDefault();
                                removeField(tab.key, page, field.key);
                              }}
                              className="rounded-lg border border-rose-100 p-1.5 text-rose-600"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </summary>

                        <div className="mt-3 grid gap-3 lg:grid-cols-2">
                          <Input label="عنوان فیلتر" value={field.label} dir="ltr" onChange={(value) => patchField(tab.key, page.key, field.key, { label: value })} />
                          <Textarea label="توضیح کوتاه Popover" value={field.description} onChange={(value) => patchField(tab.key, page.key, field.key, { description: value })} rows={3} />
                        </div>

                        <div className="mt-3 rounded-xl border border-amber-100 bg-amber-50/50 p-3">
                          <label className="inline-flex items-center gap-2 text-[11px] font-black text-amber-900">
                            <input
                              type="radio"
                              name={`spotlight-${tab.key}-${page.key}`}
                              checked={page.spotlightFieldKey === field.key}
                              onChange={() => patchPage(tab.key, page.key, { spotlightFieldKey: field.key })}
                              className="accent-amber-600"
                            />
                            این فیلتر اولین Spotlight آموزشی این صفحه باشد
                          </label>
                          <div className="mt-3 grid gap-2 sm:grid-cols-4">
                            <NumberInput label="Spotlight X %" value={field.panelX} onChange={(value) => patchField(tab.key, page.key, field.key, { panelX: value })} />
                            <NumberInput label="Spotlight Y %" value={field.panelY} onChange={(value) => patchField(tab.key, page.key, field.key, { panelY: value })} />
                            <NumberInput label="Spotlight W %" value={field.panelWidth} onChange={(value) => patchField(tab.key, page.key, field.key, { panelWidth: value })} />
                            <NumberInput label="Spotlight H %" value={field.panelHeight} onChange={(value) => patchField(tab.key, page.key, field.key, { panelHeight: value })} />
                          </div>
                        </div>
                      </details>
                    ))}
                  </div>

                  {page.imageUrl && page.fields.length ? (
                    <div className="mt-4">
                      <div className="mb-2 flex items-center gap-2 text-[11px] font-black text-slate-600">
                        <Crosshair className="h-4 w-4 text-teal-600" /> جای عنوان‌های قابل Hover/Click را روی تصویر Drag / Resize کنید.
                      </div>
                      <HotspotCanvasEditor
                        imageUrl={page.imageUrl}
                        hotspots={pageHotspots(page)}
                        showArrowPreview={false}
                        onSave={async (items) => {
                          const fields = page.fields.map((field) => {
                            const edited = items.find((item) => item.key === field.key);
                            return edited
                              ? {
                                  ...field,
                                  x: edited.x,
                                  y: edited.y,
                                  width: edited.width,
                                  height: edited.height,
                                }
                              : field;
                          });
                          const next = patchPage(tab.key, page.key, { fields });
                          await onSave(next);
                        }}
                      />
                    </div>
                  ) : null}
                </section>
              ))}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
