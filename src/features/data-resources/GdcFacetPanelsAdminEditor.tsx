import { Plus, RotateCcw, Trash2 } from "lucide-react";

import { VisualAssetEditor } from "./VisualAssetEditor";
import {
  DEFAULT_GDC_QUESTION_GUIDE,
  type GdcFacetConfig,
  type GdcQuestionGuideConfig,
} from "./gdc-question-guide-config";
import {
  DEFAULT_GDC_LENS_LAYOUT,
  HIDDEN_GDC_LENS_IMAGE,
  getGdcLensLayout,
  lensImageForEditor,
  type GdcLensImageFit,
} from "./gdc-lens-layout";

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

function NumberInput({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block text-xs font-bold text-slate-600">
      {label}
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 outline-none focus:border-teal-500"
        dir="ltr"
      />
    </label>
  );
}

function Textarea({
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
      <textarea
        rows={3}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm leading-7 text-slate-950 outline-none focus:border-teal-500"
      />
    </label>
  );
}

function defaultFacet(id: GdcFacetConfig["id"]) {
  return DEFAULT_GDC_QUESTION_GUIDE.projects.facets.find((item) => item.id === id);
}

export function GdcFacetPanelsAdminEditor({
  config,
  onChange,
  onSave,
}: {
  config: GdcQuestionGuideConfig;
  onChange: (config: GdcQuestionGuideConfig) => void;
  onSave: (config: GdcQuestionGuideConfig) => void | Promise<void>;
}) {
  const layout = getGdcLensLayout(config.projects);

  function replaceFacet(id: GdcFacetConfig["id"], patch: Partial<GdcFacetConfig> & Record<string, unknown>) {
    const next = {
      ...config,
      projects: {
        ...config.projects,
        facets: config.projects.facets.map((facet) =>
          facet.id === id ? ({ ...facet, ...patch } as GdcFacetConfig) : facet,
        ),
      },
    };
    onChange(next);
    return next;
  }

  function updateProjectLayout(key: string, value: unknown) {
    const next = {
      ...config,
      projects: {
        ...(config.projects as GdcQuestionGuideConfig["projects"] & Record<string, unknown>),
        [key]: value,
      },
    } as GdcQuestionGuideConfig;
    onChange(next);
  }

  return (
    <details className="rounded-2xl border border-slate-200 p-4" open>
      <summary className="cursor-pointer font-black text-slate-900">
        پنل‌های موقت فیلترها — متن، تصویر و اندازه
      </summary>

      <div className="mt-4 rounded-2xl border border-teal-100 bg-teal-50/50 p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="font-black text-teal-950">چیدمان مشترک پنل‌های آموزشی</h3>
            <p className="mt-1 text-xs leading-6 text-teal-900/70">
              این تنظیمات اندازه پنجره و ستون تصویر همه Context Lensهای مرحله Projects را کنترل می‌کند.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              let next = config;
              const values: Array<[string, unknown]> = [
                ["lensModalMaxWidth", DEFAULT_GDC_LENS_LAYOUT.modalMaxWidth],
                ["lensImageColumnWidth", DEFAULT_GDC_LENS_LAYOUT.imageColumnWidth],
                ["lensImageHeight", DEFAULT_GDC_LENS_LAYOUT.imageHeight],
                ["lensImageFit", DEFAULT_GDC_LENS_LAYOUT.imageFit],
              ];
              for (const [key, value] of values) {
                next = {
                  ...next,
                  projects: { ...(next.projects as any), [key]: value },
                };
              }
              onChange(next);
            }}
            className="inline-flex items-center gap-2 rounded-xl border border-teal-200 bg-white px-3 py-2 text-xs font-black text-teal-800"
          >
            <RotateCcw className="h-4 w-4" /> بازنشانی اندازه‌ها
          </button>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <NumberInput
            label="حداکثر عرض پنجره (px)"
            value={layout.modalMaxWidth}
            min={900}
            max={1900}
            step={10}
            onChange={(value) => updateProjectLayout("lensModalMaxWidth", value)}
          />
          <NumberInput
            label="عرض ستون تصویر (px)"
            value={layout.imageColumnWidth}
            min={280}
            max={850}
            step={10}
            onChange={(value) => updateProjectLayout("lensImageColumnWidth", value)}
          />
          <NumberInput
            label="ارتفاع تصویر (px، صفر = خودکار)"
            value={layout.imageHeight}
            min={0}
            max={1000}
            step={10}
            onChange={(value) => updateProjectLayout("lensImageHeight", value)}
          />
          <label className="block text-xs font-bold text-slate-600">
            نحوه قرارگیری تصویر
            <select
              value={layout.imageFit}
              onChange={(event) => updateProjectLayout("lensImageFit", event.target.value as GdcLensImageFit)}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 outline-none focus:border-teal-500"
            >
              <option value="contain">Contain — نمایش کامل</option>
              <option value="cover">Cover — پر کردن کادر</option>
              <option value="fill">Fill — کشیده شدن در کادر</option>
            </select>
          </label>
        </div>
      </div>

      <div className="mt-5 space-y-5">
        {config.projects.facets.map((facet) => {
          const fallback = defaultFacet(facet.id);
          const editorImage = lensImageForEditor(facet.imageUrl);

          return (
            <section key={facet.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-black text-teal-700">Context Lens</div>
                  <h3 className="mt-1 text-lg font-black text-slate-950" dir="ltr">{facet.title}</h3>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    if (!fallback) return;
                    const next = replaceFacet(facet.id, {
                      imageUrl: fallback.imageUrl ?? "",
                      lensTitle: fallback.lensTitle,
                      lensSubtitle: fallback.lensSubtitle,
                      sections: fallback.sections.map((item) => ({ ...item })),
                    });
                    await onSave(next);
                  }}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-600 hover:text-teal-700"
                >
                  <RotateCcw className="h-4 w-4" /> بازگردانی محتوای پیش‌فرض
                </button>
              </div>

              <div className="mt-4 grid gap-3 lg:grid-cols-2">
                <Input
                  label="نام انگلیسی"
                  value={facet.title}
                  onChange={(value) => replaceFacet(facet.id, { title: value })}
                />
                <Input
                  label="سؤال ساده برای کاربر"
                  value={facet.prompt}
                  onChange={(value) => replaceFacet(facet.id, { prompt: value })}
                />
                <Input
                  label="عنوان پنل موقت"
                  value={facet.lensTitle}
                  onChange={(value) => replaceFacet(facet.id, { lensTitle: value })}
                />
                <Input
                  label="زیرعنوان پنل"
                  value={facet.lensSubtitle}
                  onChange={(value) => replaceFacet(facet.id, { lensSubtitle: value })}
                />
              </div>

              <div className="mt-4">
                <VisualAssetEditor
                  resourceSlug={`gdc-${facet.id}`}
                  imageUrl={editorImage}
                  title={`تصویر پنل ${facet.title}`}
                  description="تصویر را آپلود، با URL جایگزین یا حذف کنید. تغییر تصویر بلافاصله در محتوای GDC ذخیره می‌شود."
                  onSave={async (url) => {
                    const next = replaceFacet(facet.id, {
                      imageUrl: url.trim() ? url.trim() : HIDDEN_GDC_LENS_IMAGE,
                    });
                    await onSave(next);
                  }}
                />
                {!editorImage ? (
                  <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-xs leading-6 text-amber-800">
                    تصویر این پنل در سایت مخفی است. برای نمایش دوباره، تصویر جدید آپلود کنید یا URL وارد کنید.
                  </p>
                ) : null}
              </div>

              <div className="mt-4 space-y-3">
                {facet.sections.map((section, index) => (
                  <div key={index} className="rounded-xl border border-slate-200 bg-white p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="grid flex-1 gap-3 lg:grid-cols-[1fr_180px]">
                        <Input
                          label={`تیتر توضیح ${index + 1}`}
                          value={section.title}
                          onChange={(value) => replaceFacet(facet.id, {
                            sections: facet.sections.map((item, itemIndex) =>
                              itemIndex === index ? { ...item, title: value } : item,
                            ),
                          })}
                        />
                        <label className="block text-xs font-bold text-slate-600">
                          رنگ باکس
                          <select
                            value={section.tone ?? "neutral"}
                            onChange={(event) => replaceFacet(facet.id, {
                              sections: facet.sections.map((item, itemIndex) =>
                                itemIndex === index
                                  ? { ...item, tone: event.target.value as "neutral" | "teal" | "sky" | "amber" }
                                  : item,
                              ),
                            })}
                            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-teal-500"
                          >
                            <option value="neutral">خاکستری</option>
                            <option value="teal">سبز</option>
                            <option value="sky">آبی</option>
                            <option value="amber">زرد</option>
                          </select>
                        </label>
                      </div>
                      <button
                        type="button"
                        aria-label="حذف توضیح"
                        onClick={() => replaceFacet(facet.id, {
                          sections: facet.sections.filter((_, itemIndex) => itemIndex !== index),
                        })}
                        className="mt-5 rounded-lg border border-rose-200 p-2 text-rose-600 hover:bg-rose-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-2">
                      <Textarea
                        label="متن"
                        value={section.body}
                        onChange={(value) => replaceFacet(facet.id, {
                          sections: facet.sections.map((item, itemIndex) =>
                            itemIndex === index ? { ...item, body: value } : item,
                          ),
                        })}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => replaceFacet(facet.id, {
                  sections: [
                    ...facet.sections,
                    { title: "عنوان توضیح جدید", body: "متن توضیح را اینجا وارد کنید.", tone: "neutral" },
                  ],
                })}
                className="mt-3 inline-flex items-center gap-2 rounded-xl border border-teal-200 bg-white px-4 py-2 text-xs font-black text-teal-800"
              >
                <Plus className="h-4 w-4" /> افزودن باکس توضیحی
              </button>
            </section>
          );
        })}
      </div>
    </details>
  );
}
