import {
  Copy,
  Crosshair,
  Eye,
  EyeOff,
  Plus,
  Save,
  Trash2,
} from "lucide-react";

import { HotspotCanvasEditor } from "./HotspotCanvasEditor";
import { VisualAssetEditor } from "./VisualAssetEditor";
import type {
  GdcCohortBuilderFiltersConfig,
  GdcCohortBuilderFiltersHotspot,
} from "./gdc-cohort-builder-filters-config";
import type { EditableResourceHotspot } from "./resource-tour-model";

function Input({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block text-xs font-bold text-slate-600">
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
    <label className="block text-[11px] font-bold text-slate-500" dir="ltr">
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

function toEditable(
  item: GdcCohortBuilderFiltersHotspot,
  index: number,
): EditableResourceHotspot {
  return {
    key: item.key,
    step: index + 1,
    title: item.label,
    persianLabel: item.label,
    description: "",
    whyItMatters: "",
    researchExample: "",
    commonMistake: "",
    exerciseQuestion: "",
    exerciseAnswer: "",
    action: "",
    x: item.x,
    y: item.y,
    width: item.width,
    height: item.height,
  };
}

function nextHotspotKey(config: GdcCohortBuilderFiltersConfig, base = "hotspot") {
  let index = config.hotspots.length + 1;
  let key = `${base}-${index}`;
  while (config.hotspots.some((item) => item.key === key)) {
    index += 1;
    key = `${base}-${index}`;
  }
  return key;
}

export function GdcCohortBuilderFiltersAdminEditor({
  config,
  onChange,
  onSave,
}: {
  config: GdcCohortBuilderFiltersConfig;
  onChange: (config: GdcCohortBuilderFiltersConfig) => void;
  onSave: (config: GdcCohortBuilderFiltersConfig) => void | Promise<void>;
}) {
  function update<K extends keyof GdcCohortBuilderFiltersConfig>(
    key: K,
    value: GdcCohortBuilderFiltersConfig[K],
  ) {
    onChange({ ...config, [key]: value });
  }

  function updateSlide(
    index: number,
    patch: Partial<GdcCohortBuilderFiltersConfig["slides"][number]>,
  ) {
    onChange({
      ...config,
      slides: config.slides.map((slide, slideIndex) =>
        slideIndex === index ? { ...slide, ...patch } : slide,
      ),
    });
  }

  function updateHotspot(
    key: string,
    patch: Partial<GdcCohortBuilderFiltersHotspot>,
  ) {
    onChange({
      ...config,
      hotspots: config.hotspots.map((item) =>
        item.key === key ? { ...item, ...patch } : item,
      ),
    });
  }

  function addHotspot() {
    const key = nextHotspotKey(config);
    const firstSlideKey = config.slides[0]?.key;
    const item: GdcCohortBuilderFiltersHotspot = {
      key,
      label: "Hotspot جدید",
      x: 5,
      y: 5,
      width: 12,
      height: 6,
      enabled: true,
      slideKeys: firstSlideKey ? [firstSlideKey] : [],
    };
    onChange({ ...config, hotspots: [...config.hotspots, item] });
  }

  function duplicateHotspot(item: GdcCohortBuilderFiltersHotspot) {
    const key = nextHotspotKey(config, `${item.key}-copy`);
    const copy: GdcCohortBuilderFiltersHotspot = {
      ...item,
      key,
      label: `${item.label} - کپی`,
      x: Math.min(100 - item.width, item.x + 2),
      y: Math.min(100 - item.height, item.y + 2),
      slideKeys: [...item.slideKeys],
    };
    onChange({ ...config, hotspots: [...config.hotspots, copy] });
  }

  function removeHotspot(key: string) {
    if (!window.confirm("این Hotspot حذف شود؟")) return;
    onChange({
      ...config,
      hotspots: config.hotspots.filter((item) => item.key !== key),
    });
  }

  function toggleHotspotSlide(hotspotKey: string, slideKey: string) {
    const item = config.hotspots.find((hotspot) => hotspot.key === hotspotKey);
    if (!item) return;
    const exists = item.slideKeys.includes(slideKey);
    updateHotspot(hotspotKey, {
      slideKeys: exists
        ? item.slideKeys.filter((key) => key !== slideKey)
        : [...item.slideKeys, slideKey],
    });
  }

  return (
    <section className="rounded-3xl border border-sky-200 bg-white p-6 shadow-sm" dir="rtl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-xs font-black text-sky-700">
            سؤال ۲ · مرحله ۲ · نقشه فیلترهای Cohort Builder
          </div>
          <h2 className="mt-1 text-2xl font-black text-slate-950">
            Cohort Builder Filters Stage Editor
          </h2>
          <p className="mt-2 max-w-4xl text-sm leading-7 text-slate-600">
            علاوه بر متن و تصویر، حالا می‌توانید Hotspot جدید بسازید، حذف یا غیرفعال کنید،
            یک Hotspot را روی چند اسلاید نمایش دهید و موقعیت و اندازه آن را دقیق کنترل کنید.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onSave(config)}
          className="inline-flex items-center gap-2 rounded-xl bg-teal-700 px-5 py-3 text-sm font-black text-white hover:bg-teal-800"
        >
          <Save className="h-4 w-4" /> ذخیره سؤال ۲ · مرحله ۲
        </button>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
        <h3 className="font-black text-slate-900">تنظیمات عمومی مرحله</h3>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <Input
            label="عنوان اصلی مرحله"
            value={config.title}
            onChange={(value) => update("title", value)}
          />
          <Input
            label="تیتر مقدمه"
            value={config.introLabel}
            onChange={(value) => update("introLabel", value)}
          />
          <Textarea
            label="متن مقدمه"
            value={config.introBody}
            onChange={(value) => update("introBody", value)}
            rows={4}
          />
          <Input
            label="متن دکمه ادامه"
            value={config.nextButton}
            onChange={(value) => update("nextButton", value)}
          />
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-slate-200 p-4">
        <h3 className="font-black text-slate-900">اسلایدهای آموزشی دسته‌های فیلتر</h3>
        <p className="mt-1 text-xs leading-6 text-slate-500">
          هر اسلاید می‌تواند صفر، یک یا چند Hotspot داشته باشد. اتصال Hotspotها به اسلایدها از بخش «مدیریت Hotspotها» انجام می‌شود.
        </p>
        <div className="mt-4 space-y-4">
          {config.slides.map((slide, index) => {
            const assigned = config.hotspots.filter((item) =>
              item.slideKeys.includes(slide.key),
            );
            return (
              <div
                key={slide.key}
                className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4"
              >
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-[10px] font-black text-teal-700">
                      اسلاید {index + 1}
                    </div>
                    <div dir="ltr" className="text-sm font-black text-slate-950">
                      {slide.tabLabel}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {assigned.length ? (
                      assigned.map((item) => (
                        <span
                          key={item.key}
                          className="rounded-full bg-white px-2 py-1 text-[9px] font-bold text-slate-500 ring-1 ring-slate-200"
                        >
                          {item.label}
                        </span>
                      ))
                    ) : (
                      <span className="rounded-full bg-amber-50 px-2 py-1 text-[9px] font-bold text-amber-700">
                        بدون Hotspot
                      </span>
                    )}
                  </div>
                </div>
                <div className="grid gap-4 lg:grid-cols-2">
                  <Input
                    label="نام کوتاه تب"
                    value={slide.tabLabel}
                    onChange={(value) => updateSlide(index, { tabLabel: value })}
                  />
                  <Input
                    label="عنوان اسلاید"
                    value={slide.title}
                    onChange={(value) => updateSlide(index, { title: value })}
                  />
                  <Textarea
                    label="توضیح اصلی"
                    value={slide.body}
                    onChange={(value) => updateSlide(index, { body: value })}
                    rows={4}
                  />
                  <Textarea
                    label="کاربرد پژوهشی"
                    value={slide.researchUse}
                    onChange={(value) => updateSlide(index, { researchUse: value })}
                    rows={4}
                  />
                  <Textarea
                    label="نکته مهم / هشدار"
                    value={slide.caution}
                    onChange={(value) => updateSlide(index, { caution: value })}
                    rows={3}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-teal-200 bg-teal-50/30 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-black text-slate-900">مدیریت Hotspotها</h3>
            <p className="mt-1 text-xs leading-6 text-slate-500">
              تعداد فعلی: {config.hotspots.length} · هر Hotspot را می‌توانید روشن/خاموش، کپی، حذف و به یک یا چند اسلاید وصل کنید.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={addHotspot}
              className="inline-flex items-center gap-2 rounded-xl border border-teal-200 bg-white px-4 py-2 text-xs font-black text-teal-800 hover:bg-teal-50"
            >
              <Plus className="h-4 w-4" /> افزودن Hotspot
            </button>
            <button
              type="button"
              onClick={() => onSave(config)}
              className="inline-flex items-center gap-2 rounded-xl bg-teal-700 px-4 py-2 text-xs font-black text-white hover:bg-teal-800"
            >
              <Save className="h-4 w-4" /> ذخیره تنظیمات Hotspot
            </button>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          {config.hotspots.map((item) => (
            <details
              key={item.key}
              className="group rounded-xl border border-slate-200 bg-white"
            >
              <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-3 px-4 py-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-black text-slate-900">{item.label}</span>
                    <code className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] text-slate-500">
                      {item.key}
                    </code>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[9px] font-black ${
                        item.enabled
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {item.enabled ? "فعال" : "مخفی"}
                    </span>
                  </div>
                  <div className="mt-1 text-[10px] text-slate-400">
                    نمایش در {item.slideKeys.length} اسلاید
                  </div>
                </div>
                <div className="flex items-center gap-1" onClick={(event) => event.preventDefault()}>
                  <button
                    type="button"
                    title={item.enabled ? "مخفی کردن" : "فعال کردن"}
                    onClick={(event) => {
                      event.stopPropagation();
                      updateHotspot(item.key, { enabled: !item.enabled });
                    }}
                    className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:border-teal-200 hover:text-teal-700"
                  >
                    {item.enabled ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </button>
                  <button
                    type="button"
                    title="کپی Hotspot"
                    onClick={(event) => {
                      event.stopPropagation();
                      duplicateHotspot(item);
                    }}
                    className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:border-sky-200 hover:text-sky-700"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    title="حذف Hotspot"
                    onClick={(event) => {
                      event.stopPropagation();
                      removeHotspot(item.key);
                    }}
                    className="rounded-lg border border-rose-100 p-2 text-rose-600 hover:bg-rose-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </summary>

              <div className="border-t border-slate-100 p-4">
                <div className="grid gap-3 lg:grid-cols-[minmax(0,1.4fr)_repeat(4,minmax(0,.65fr))]">
                  <Input
                    label="برچسب Hotspot"
                    value={item.label}
                    onChange={(value) => updateHotspot(item.key, { label: value })}
                  />
                  <NumberInput
                    label="X %"
                    value={item.x}
                    onChange={(value) => updateHotspot(item.key, { x: value })}
                  />
                  <NumberInput
                    label="Y %"
                    value={item.y}
                    onChange={(value) => updateHotspot(item.key, { y: value })}
                  />
                  <NumberInput
                    label="WIDTH %"
                    value={item.width}
                    onChange={(value) => updateHotspot(item.key, { width: value })}
                  />
                  <NumberInput
                    label="HEIGHT %"
                    value={item.height}
                    onChange={(value) => updateHotspot(item.key, { height: value })}
                  />
                </div>

                <div className="mt-4">
                  <div className="text-[11px] font-black text-slate-600">
                    این Hotspot در کدام اسلایدها دیده شود؟
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {config.slides.map((slideItem) => {
                      const checked = item.slideKeys.includes(slideItem.key);
                      return (
                        <label
                          key={slideItem.key}
                          className={`inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-[10px] font-bold transition ${
                            checked
                              ? "border-teal-300 bg-teal-50 text-teal-800"
                              : "border-slate-200 bg-white text-slate-500 hover:border-teal-200"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleHotspotSlide(item.key, slideItem.key)}
                            className="accent-teal-600"
                          />
                          <span dir="ltr">{slideItem.tabLabel}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            </details>
          ))}

          {!config.hotspots.length ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-5 text-center text-sm text-slate-500">
              هیچ Hotspotی وجود ندارد. از دکمه «افزودن Hotspot» استفاده کنید.
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-5">
        <VisualAssetEditor
          resourceSlug="gdc-question-2-cohort-builder-filters"
          imageUrl={config.imageUrl}
          title="اسکرین‌شات سؤال ۲ · مرحله ۲"
          description="اسکرین‌شات واقعی Cohort Builder را از اینجا انتخاب یا جایگزین کنید."
          allowRemove={false}
          onSave={async (imageUrl) => {
            const next = { ...config, imageUrl };
            onChange(next);
            await onSave(next);
          }}
        />
      </div>

      <div className="mt-5 rounded-2xl border border-slate-200 p-4">
        <div className="mb-3 flex items-center gap-2 text-xs font-bold text-slate-500">
          <Crosshair className="h-4 w-4 text-teal-700" /> جایگاه و اندازه تمام Hotspotها را روی تصویر Drag / Resize کنید.
        </div>
        {config.imageUrl ? (
          <HotspotCanvasEditor
            imageUrl={config.imageUrl}
            hotspots={config.hotspots.map(toEditable)}
            onSave={async (items) => {
              const nextHotspots: GdcCohortBuilderFiltersHotspot[] = items.map(
                (editable) => {
                  const current = config.hotspots.find(
                    (hotspot) => hotspot.key === editable.key,
                  );
                  return {
                    key: editable.key,
                    label: current?.label ?? editable.title,
                    x: editable.x,
                    y: editable.y,
                    width: editable.width,
                    height: editable.height,
                    enabled: current?.enabled ?? true,
                    slideKeys: current ? [...current.slideKeys] : [],
                  };
                },
              );
              const next = { ...config, hotspots: nextHotspots };
              onChange(next);
              await onSave(next);
            }}
          />
        ) : (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            ابتدا تصویر مرحله را انتخاب کنید.
          </div>
        )}
      </div>
    </section>
  );
}
