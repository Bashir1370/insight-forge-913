import { Crosshair, Save } from "lucide-react";

import { HotspotCanvasEditor } from "./HotspotCanvasEditor";
import { VisualAssetEditor } from "./VisualAssetEditor";
import type {
  GdcCohortBuilderFiltersConfig,
  GdcCohortBuilderFiltersHotspot,
} from "./gdc-cohort-builder-filters-config";
import type { EditableResourceHotspot } from "./resource-tour-model";

function Input({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block text-xs font-bold text-slate-600">
      {label}
      <input value={value} onChange={(event) => onChange(event.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 outline-none focus:border-teal-500" />
    </label>
  );
}

function Textarea({ label, value, onChange, rows = 3 }: { label: string; value: string; onChange: (value: string) => void; rows?: number }) {
  return (
    <label className="block text-xs font-bold text-slate-600">
      {label}
      <textarea rows={rows} value={value} onChange={(event) => onChange(event.target.value)} className="mt-1 w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm leading-7 text-slate-950 outline-none focus:border-teal-500" />
    </label>
  );
}

function toEditable(item: GdcCohortBuilderFiltersHotspot, index: number): EditableResourceHotspot {
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

export function GdcCohortBuilderFiltersAdminEditor({
  config,
  onChange,
  onSave,
}: {
  config: GdcCohortBuilderFiltersConfig;
  onChange: (config: GdcCohortBuilderFiltersConfig) => void;
  onSave: (config: GdcCohortBuilderFiltersConfig) => void | Promise<void>;
}) {
  function update<K extends keyof GdcCohortBuilderFiltersConfig>(key: K, value: GdcCohortBuilderFiltersConfig[K]) {
    onChange({ ...config, [key]: value });
  }

  function updateSlide(index: number, patch: Partial<GdcCohortBuilderFiltersConfig["slides"][number]>) {
    onChange({
      ...config,
      slides: config.slides.map((slide, slideIndex) =>
        slideIndex === index ? { ...slide, ...patch } : slide,
      ),
    });
  }

  function updateHotspotLabel(key: string, label: string) {
    onChange({
      ...config,
      hotspots: config.hotspots.map((item) => (item.key === key ? { ...item, label } : item)),
    });
  }

  return (
    <section className="rounded-3xl border border-sky-200 bg-white p-6 shadow-sm" dir="rtl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-xs font-black text-sky-700">سؤال ۲ · مرحله ۲ · نقشه فیلترهای Cohort Builder</div>
          <h2 className="mt-1 text-2xl font-black text-slate-950">Cohort Builder Filters Stage Editor</h2>
          <p className="mt-2 max-w-4xl text-sm leading-7 text-slate-600">
            عنوان مرحله، متن هر اسلاید، اسکرین‌شات و جایگاه تمام دسته‌های ستون سمت چپ از همین بخش مدیریت می‌شوند. در صفحه آموزش فقط Hotspot مربوط به اسلاید فعال دیده می‌شود.
          </p>
        </div>
        <button type="button" onClick={() => onSave(config)} className="inline-flex items-center gap-2 rounded-xl bg-teal-700 px-5 py-3 text-sm font-black text-white hover:bg-teal-800">
          <Save className="h-4 w-4" /> ذخیره سؤال ۲ · مرحله ۲
        </button>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
        <h3 className="font-black text-slate-900">تنظیمات عمومی مرحله</h3>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <Input label="عنوان اصلی مرحله" value={config.title} onChange={(value) => update("title", value)} />
          <Input label="تیتر مقدمه" value={config.introLabel} onChange={(value) => update("introLabel", value)} />
          <Textarea label="متن مقدمه" value={config.introBody} onChange={(value) => update("introBody", value)} rows={4} />
          <Input label="متن دکمه ادامه" value={config.nextButton} onChange={(value) => update("nextButton", value)} />
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-slate-200 p-4">
        <h3 className="font-black text-slate-900">اسلایدهای آموزشی دسته‌های فیلتر</h3>
        <p className="mt-1 text-xs leading-6 text-slate-500">هر اسلاید به Hotspot هم‌نام خودش متصل است.</p>
        <div className="mt-4 space-y-4">
          {config.slides.map((slide, index) => {
            const hotspot = config.hotspots.find((item) => item.key === slide.hotspotKey);
            return (
              <div key={slide.key} className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[10px] font-black text-teal-700">اسلاید {index + 1}</div>
                    <div dir="ltr" className="text-sm font-black text-slate-950">{slide.tabLabel}</div>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-[10px] font-bold text-slate-500 ring-1 ring-slate-200">{slide.hotspotKey}</span>
                </div>
                <div className="grid gap-4 lg:grid-cols-2">
                  <Input label="نام کوتاه تب" value={slide.tabLabel} onChange={(value) => updateSlide(index, { tabLabel: value })} />
                  <Input label="عنوان اسلاید" value={slide.title} onChange={(value) => updateSlide(index, { title: value })} />
                  <Textarea label="توضیح اصلی" value={slide.body} onChange={(value) => updateSlide(index, { body: value })} rows={4} />
                  <Textarea label="کاربرد پژوهشی" value={slide.researchUse} onChange={(value) => updateSlide(index, { researchUse: value })} rows={4} />
                  <Textarea label="نکته مهم / هشدار" value={slide.caution} onChange={(value) => updateSlide(index, { caution: value })} rows={3} />
                  {hotspot ? <Input label="برچسب Hotspot" value={hotspot.label} onChange={(value) => updateHotspotLabel(hotspot.key, value)} /> : null}
                </div>
              </div>
            );
          })}
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
          <Crosshair className="h-4 w-4 text-teal-700" /> جایگاه و اندازه تمام Hotspotهای ستون فیلتر را روی تصویر Drag / Resize کنید.
        </div>
        {config.imageUrl ? (
          <HotspotCanvasEditor
            imageUrl={config.imageUrl}
            hotspots={config.hotspots.map(toEditable)}
            onSave={async (items) => {
              const nextHotspots: GdcCohortBuilderFiltersHotspot[] = items.map((item) => {
                const current = config.hotspots.find((hotspot) => hotspot.key === item.key);
                return {
                  key: item.key,
                  label: current?.label ?? item.title,
                  x: item.x,
                  y: item.y,
                  width: item.width,
                  height: item.height,
                };
              });
              const next = { ...config, hotspots: nextHotspots };
              onChange(next);
              await onSave(next);
            }}
          />
        ) : (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">ابتدا تصویر مرحله را انتخاب کنید.</div>
        )}
      </div>
    </section>
  );
}
