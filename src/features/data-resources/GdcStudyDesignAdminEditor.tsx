import { Plus, Save, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { HotspotCanvasEditor } from "./HotspotCanvasEditor";
import { VisualAssetEditor } from "./VisualAssetEditor";
import type { EditableResourceHotspot } from "./resource-tour-model";
import type { GdcGuideHotspot, GdcQuestionGuideConfig } from "./gdc-question-guide-config";
import {
  getGdcStudyDesignConfig,
  type GdcStudyDesignConfig,
  type GdcStudyTaskConfig,
  withGdcStudyDesignConfig,
} from "./gdc-study-design-config";

const PROJECT_PARTS = Array.from(
  { length: 7 },
  (_, i) => `/images/gdc/gdc-projects-b64/${String(i + 1).padStart(2, "0")}.txt`,
);

const FALLBACK_STUDY_SCREENSHOTS = Array.from(
  { length: 5 },
  (_, i) => `/images/gdc/study-design-kidney/step-${i + 1}.txt`,
);

function useBundledStudyImages() {
  const [baseline, setBaseline] = useState("");
  const [steps, setSteps] = useState<string[]>([]);

  useEffect(() => {
    let active = true;
    Promise.all(PROJECT_PARTS.map(async (path) => {
      const response = await fetch(path);
      if (!response.ok) throw new Error(path);
      return response.text();
    }))
      .then((parts) => {
        if (active) setBaseline(`data:image/webp;base64,${parts.join("")}`);
      })
      .catch(() => active && setBaseline(""));

    Promise.all(FALLBACK_STUDY_SCREENSHOTS.map(async (path) => {
      const response = await fetch(path);
      if (!response.ok) throw new Error(path);
      return `data:image/webp;base64,${(await response.text()).trim()}`;
    }))
      .then((images) => active && setSteps(images))
      .catch(() => active && setSteps([]));

    return () => {
      active = false;
    };
  }, []);

  return { baseline, steps };
}

function Input({ label, value, onChange, dir }: { label: string; value: string; onChange: (value: string) => void; dir?: "rtl" | "ltr" }) {
  return (
    <label className="block text-xs font-bold text-slate-600">
      {label}
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 outline-none focus:border-teal-500"
        dir={dir}
      />
    </label>
  );
}

function NumberInput({ label, value, min = 0, max = 10000, onChange }: { label: string; value: number; min?: number; max?: number; onChange: (value: number) => void }) {
  return (
    <label className="block text-xs font-bold text-slate-600">
      {label}
      <input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 outline-none focus:border-teal-500"
        dir="ltr"
      />
    </label>
  );
}

function Textarea({ label, value, onChange, rows = 3, dir }: { label: string; value: string; onChange: (value: string) => void; rows?: number; dir?: "rtl" | "ltr" }) {
  return (
    <label className="block text-xs font-bold text-slate-600">
      {label}
      <textarea
        rows={rows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm leading-7 text-slate-950 outline-none focus:border-teal-500"
        dir={dir}
      />
    </label>
  );
}

function toEditorHotspots(items: GdcGuideHotspot[]): EditableResourceHotspot[] {
  return items.map((item, index) => ({
    key: item.key,
    step: index + 1,
    title: item.title,
    persianLabel: "",
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
  }));
}

function fromEditorHotspots(items: EditableResourceHotspot[]): GdcGuideHotspot[] {
  return items.map((item) => ({
    key: item.key,
    title: item.title,
    x: item.x,
    y: item.y,
    width: item.width,
    height: item.height,
  }));
}

function splitLines(value: string) {
  return value.split(/\r?\n/).map((item) => item.trim()).filter(Boolean);
}

function HotspotManager({
  imageUrl,
  hotspots,
  onChange,
  onSave,
}: {
  imageUrl: string;
  hotspots: GdcGuideHotspot[];
  onChange: (items: GdcGuideHotspot[]) => void;
  onSave: (items: GdcGuideHotspot[]) => void | Promise<void>;
}) {
  const editorItems = useMemo(() => toEditorHotspots(hotspots), [hotspots]);

  function addHotspot() {
    const key = `hotspot-${Date.now()}`;
    onChange([
      ...hotspots,
      { key, title: "Hotspot جدید", x: 35, y: 35, width: 22, height: 14 },
    ]);
  }

  return (
    <div className="mt-4 rounded-2xl border border-sky-100 bg-sky-50/40 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h4 className="font-black text-slate-900">Hotspotهای همین تصویر</h4>
          <p className="mt-1 text-xs leading-6 text-slate-500">Hotspot اضافه کنید، عنوانش را عوض کنید و روی تصویر با Drag/Resize جای دقیق آن را تنظیم کنید.</p>
        </div>
        <button type="button" onClick={addHotspot} className="inline-flex items-center gap-2 rounded-xl border border-sky-200 bg-white px-3 py-2 text-xs font-black text-sky-800">
          <Plus className="h-4 w-4" /> افزودن Hotspot
        </button>
      </div>

      {hotspots.length ? (
        <div className="mt-3 grid gap-2 md:grid-cols-2">
          {hotspots.map((item, index) => (
            <div key={item.key} className="flex items-end gap-2 rounded-xl bg-white p-3">
              <div className="flex-1">
                <Input
                  label={`عنوان Hotspot ${index + 1}`}
                  value={item.title}
                  onChange={(value) => onChange(hotspots.map((hotspot) => hotspot.key === item.key ? { ...hotspot, title: value } : hotspot))}
                />
              </div>
              <button
                type="button"
                aria-label="حذف Hotspot"
                onClick={() => onChange(hotspots.filter((hotspot) => hotspot.key !== item.key))}
                className="mb-0.5 rounded-lg border border-rose-200 p-2.5 text-rose-600 hover:bg-rose-50"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-3 text-xs text-slate-500">هنوز Hotspotی برای این تصویر تعریف نشده است.</p>
      )}

      <div className="mt-4">
        <HotspotCanvasEditor
          imageUrl={imageUrl}
          hotspots={editorItems}
          onSave={async (items) => {
            const next = fromEditorHotspots(items).map((item) => {
              const current = hotspots.find((hotspot) => hotspot.key === item.key);
              return current ? { ...item, title: current.title } : item;
            });
            onChange(next);
            await onSave(next);
          }}
        />
      </div>
    </div>
  );
}

export function GdcStudyDesignAdminEditor({
  config,
  onChange,
  onSave,
}: {
  config: GdcQuestionGuideConfig;
  onChange: (config: GdcQuestionGuideConfig) => void;
  onSave: (config: GdcQuestionGuideConfig) => void | Promise<void>;
}) {
  const study = getGdcStudyDesignConfig(config);
  const bundled = useBundledStudyImages();
  const [saving, setSaving] = useState(false);

  function applyStudy(nextStudy: GdcStudyDesignConfig) {
    const next = withGdcStudyDesignConfig(config, nextStudy);
    onChange(next);
    return next;
  }

  function patchStudy(patch: Partial<GdcStudyDesignConfig>) {
    return applyStudy({ ...study, ...patch });
  }

  function patchTask(id: GdcStudyTaskConfig["id"], patch: Partial<GdcStudyTaskConfig>) {
    return applyStudy({
      ...study,
      tasks: study.tasks.map((task) => task.id === id ? { ...task, ...patch } : task),
    });
  }

  async function persist(next = config) {
    setSaving(true);
    try {
      await onSave(next);
    } finally {
      setSaving(false);
    }
  }

  return (
    <details className="rounded-2xl border border-violet-200 bg-violet-50/20 p-4" open>
      <summary className="cursor-pointer font-black text-violet-950">مرحله ۳ — Study Design Builder (ویرایش کامل بدون کدنویسی)</summary>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-3 rounded-2xl border border-violet-100 bg-white p-4">
        <div>
          <h3 className="font-black text-slate-950">کنترل کامل مرحله ۳</h3>
          <p className="mt-1 max-w-3xl text-xs leading-6 text-slate-500">سناریو، متن‌ها، جواب‌ها، گزینه‌ها، تعداد Projectها، تصاویر هر مرحله، Hotspotها، کاندیدهای نهایی و اندازه تصویر از همین بخش قابل تغییر است.</p>
        </div>
        <button
          type="button"
          disabled={saving}
          onClick={() => persist(config)}
          className="inline-flex items-center gap-2 rounded-xl bg-violet-700 px-4 py-2.5 text-xs font-black text-white disabled:opacity-50"
        >
          <Save className="h-4 w-4" /> {saving ? "در حال ذخیره…" : "ذخیره مرحله ۳"}
        </button>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <Input
          label="عنوان مرحله ۳"
          value={config.stageTitles[2] ?? "طراحی مطالعه و اعمال فیلترها"}
          onChange={(value) => onChange({ ...config, stageTitles: config.stageTitles.map((item, index) => index === 2 ? value : item) })}
        />
        <Input label="عنوان بالای تصویر" value={study.liveTitle} onChange={(value) => patchStudy({ liveTitle: value })} />
        <Textarea label="متن حالت قبل از اعمال فیلتر" value={study.initialCaption} onChange={(value) => patchStudy({ initialCaption: value })} />
        <Input label="برچسب سناریو" value={study.scenarioLabel} onChange={(value) => patchStudy({ scenarioLabel: value })} />
        <Textarea label="متن سناریوی پژوهش" value={study.scenarioBody} rows={4} onChange={(value) => patchStudy({ scenarioBody: value })} />
        <Textarea label="راهنمای زیر سناریو" value={study.scenarioHelp} onChange={(value) => patchStudy({ scenarioHelp: value })} />
        <Input label="نام حالت راهنمایی‌شده" value={study.guidedLabel} onChange={(value) => patchStudy({ guidedLabel: value })} />
        <Input label="نام حالت چالش" value={study.challengeLabel} onChange={(value) => patchStudy({ challengeLabel: value })} />
        <Input label="متن شروع دوباره" value={study.restartLabel} onChange={(value) => patchStudy({ restartLabel: value })} />
        <Input label="عنوان پیشرفت" value={study.progressTitle} onChange={(value) => patchStudy({ progressTitle: value })} />
        <Textarea label="نکته پژوهشی بعد از فیلترهای داده" value={study.researchNote} onChange={(value) => patchStudy({ researchNote: value })} />
        <Input label="عنوان پایان تمرین" value={study.finalTitle} onChange={(value) => patchStudy({ finalTitle: value })} />
        <Textarea label="متن پایان تمرین" value={study.finalBody} onChange={(value) => patchStudy({ finalBody: value })} />
        <Input label="سؤال میزان اطمینان" value={study.confidenceQuestion} onChange={(value) => patchStudy({ confidenceQuestion: value })} />
        <Textarea label="Feedback اطمینان کم" value={study.confidenceLowFeedback} onChange={(value) => patchStudy({ confidenceLowFeedback: value })} />
        <Textarea label="Feedback اطمینان متوسط" value={study.confidenceMediumFeedback} onChange={(value) => patchStudy({ confidenceMediumFeedback: value })} />
        <Textarea label="Feedback اطمینان زیاد" value={study.confidenceHighFeedback} onChange={(value) => patchStudy({ confidenceHighFeedback: value })} />
        <Input label="متن دکمه قبلی" value={study.previousButton} onChange={(value) => patchStudy({ previousButton: value })} />
        <Input label="متن دکمه بعدی" value={study.nextButton} onChange={(value) => patchStudy({ nextButton: value })} />
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <NumberInput label="تعداد اولیه Projectها" value={study.initialProjectCount} onChange={(value) => patchStudy({ initialProjectCount: value })} />
        <NumberInput label="ارتفاع تصویر (px؛ صفر = خودکار)" value={study.imageHeight} max={1200} onChange={(value) => patchStudy({ imageHeight: value })} />
        <label className="block text-xs font-bold text-slate-600">
          نحوه نمایش تصویر
          <select
            value={study.imageFit}
            onChange={(event) => patchStudy({ imageFit: event.target.value as GdcStudyDesignConfig["imageFit"] })}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 outline-none focus:border-teal-500"
          >
            <option value="contain">Contain — نمایش کامل</option>
            <option value="cover">Cover — پرکردن کادر</option>
            <option value="fill">Fill — کشیده شدن</option>
          </select>
        </label>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <Textarea
          label="Chipهای خلاصه (هر خط یک مورد)"
          value={study.chips.join("\n")}
          dir="ltr"
          onChange={(value) => patchStudy({ chips: splitLines(value) })}
        />
        <Textarea
          label="Projectهای کاندید نهایی (هر خط یک مورد)"
          value={study.candidateProjects.join("\n")}
          dir="ltr"
          onChange={(value) => patchStudy({ candidateProjects: splitLines(value) })}
        />
      </div>

      <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-4">
        <h3 className="font-black text-slate-950">تصویر پایه — قبل از انتخاب اولین فیلتر</h3>
        <div className="mt-3">
          <VisualAssetEditor
            resourceSlug="gdc-study-baseline"
            imageUrl={study.baselineImageUrl}
            title="تصویر اولیه مرحله ۳"
            description="اگر خالی باشد، تصویر پیش‌فرض Projects استفاده می‌شود. می‌توانید تصویر دیگری آپلود یا URL آن را جایگزین کنید."
            onSave={async (url) => {
              const next = patchStudy({ baselineImageUrl: url.trim() });
              await persist(next);
            }}
          />
        </div>
        <HotspotManager
          imageUrl={study.baselineImageUrl || bundled.baseline}
          hotspots={study.baselineHotspots}
          onChange={(items) => patchStudy({ baselineHotspots: items })}
          onSave={async (items) => {
            const next = patchStudy({ baselineHotspots: items });
            await persist(next);
          }}
        />
      </section>

      <div className="mt-5 space-y-5">
        {study.tasks.map((task, index) => {
          const fallbackImage = bundled.steps[index] ?? "";
          const previewImage = task.imageUrl || fallbackImage;
          return (
            <section key={task.id} className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-black text-violet-700">فیلتر {index + 1}</div>
                  <h3 className="mt-1 text-lg font-black text-slate-950" dir="ltr">{task.label}</h3>
                </div>
                <label className="inline-flex items-center gap-2 text-xs font-black text-slate-700">
                  <input
                    type="checkbox"
                    checked={task.enabled}
                    onChange={(event) => patchTask(task.id, { enabled: event.target.checked })}
                    className="h-4 w-4"
                  />
                  فعال در تمرین
                </label>
              </div>

              <div className="mt-4 grid gap-3 lg:grid-cols-2">
                <Input label="نام فیلتر" value={task.label} dir="ltr" onChange={(value) => patchTask(task.id, { label: value })} />
                <Input label="جواب درست" value={task.target} dir="ltr" onChange={(value) => patchTask(task.id, { target: value })} />
                <Textarea label="سؤال/Prompt" value={task.cue} onChange={(value) => patchTask(task.id, { cue: value })} />
                <Textarea
                  label="گزینه‌ها (هر خط یک گزینه)"
                  value={task.options.join("\n")}
                  dir="ltr"
                  onChange={(value) => patchTask(task.id, { options: splitLines(value) })}
                />
                <Textarea label="Hint" value={task.hint} onChange={(value) => patchTask(task.id, { hint: value })} />
                <Textarea label="توضیح پاسخ درست" value={task.rationale} onChange={(value) => patchTask(task.id, { rationale: value })} />
                <Textarea label="Feedback پاسخ اشتباه" value={task.wrongFeedback} onChange={(value) => patchTask(task.id, { wrongFeedback: value })} />
                <Textarea label="متن نتیجه بعد از اعمال این فیلتر" value={task.resultCaption} onChange={(value) => patchTask(task.id, { resultCaption: value })} />
                <NumberInput label="تعداد Project بعد از این فیلتر" value={task.projectCount} onChange={(value) => patchTask(task.id, { projectCount: value })} />
              </div>

              <div className="mt-4">
                <VisualAssetEditor
                  resourceSlug={`gdc-study-${task.id}`}
                  imageUrl={task.imageUrl}
                  title={`اسکرین‌شات نتیجه ${task.label}`}
                  description="این تصویر دقیقاً بعد از انتخاب پاسخ صحیح همین فیلتر در مرحله ۳ نمایش داده می‌شود."
                  onSave={async (url) => {
                    const next = patchTask(task.id, { imageUrl: url.trim() });
                    await persist(next);
                  }}
                />
                {!task.imageUrl ? (
                  <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-xs leading-6 text-amber-800">فعلاً تصویر داخلی تمرین به‌عنوان Fallback استفاده می‌شود. با آپلود تصویر، تصویر شما جایگزین آن می‌شود.</p>
                ) : null}
              </div>

              <HotspotManager
                imageUrl={previewImage}
                hotspots={task.hotspots}
                onChange={(items) => patchTask(task.id, { hotspots: items })}
                onSave={async (items) => {
                  const next = patchTask(task.id, { hotspots: items });
                  await persist(next);
                }}
              />
            </section>
          );
        })}
      </div>
    </details>
  );
}
