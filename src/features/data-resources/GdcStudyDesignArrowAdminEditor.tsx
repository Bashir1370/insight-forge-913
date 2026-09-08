import { Crosshair, Save } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { HotspotCanvasEditor } from "./HotspotCanvasEditor";
import type { GdcHotspotArrowSettings } from "./GdcHotspotArrow";
import type { GdcFacetId, GdcGuideHotspot, GdcQuestionGuideConfig } from "./gdc-question-guide-config";
import {
  getGdcStudyDesignConfig,
  type GdcStudyDesignConfig,
  withGdcStudyDesignConfig,
} from "./gdc-study-design-config";
import type { EditableResourceHotspot } from "./resource-tour-model";

const PROJECT_PARTS = Array.from(
  { length: 7 },
  (_, i) => `/images/gdc/gdc-projects-b64/${String(i + 1).padStart(2, "0")}.txt`,
);

const FALLBACK_STUDY_SCREENSHOTS = Array.from(
  { length: 5 },
  (_, i) => `/images/gdc/study-design-kidney/step-${i + 1}.txt`,
);

type ArrowEditableHotspot = EditableResourceHotspot & GdcHotspotArrowSettings;
type StudyWithArrowSettings = GdcStudyDesignConfig & {
  hotspotArrowSettings?: Record<string, GdcHotspotArrowSettings>;
};

function arrowKey(scope: string, hotspotKey: string) {
  return `${scope}:${hotspotKey}`;
}

function useBundledStudyImages() {
  const [baseline, setBaseline] = useState("");
  const [steps, setSteps] = useState<string[]>([]);

  useEffect(() => {
    let active = true;

    Promise.all(
      PROJECT_PARTS.map(async (path) => {
        const response = await fetch(path);
        if (!response.ok) throw new Error(path);
        return response.text();
      }),
    )
      .then((parts) => {
        if (active) setBaseline(`data:image/webp;base64,${parts.join("")}`);
      })
      .catch(() => active && setBaseline(""));

    Promise.all(
      FALLBACK_STUDY_SCREENSHOTS.map(async (path) => {
        const response = await fetch(path);
        if (!response.ok) throw new Error(path);
        return `data:image/webp;base64,${(await response.text()).trim()}`;
      }),
    )
      .then((images) => active && setSteps(images))
      .catch(() => active && setSteps([]));

    return () => {
      active = false;
    };
  }, []);

  return { baseline, steps };
}

function toEditorHotspots(
  hotspots: GdcGuideHotspot[],
  scope: string,
  settingsMap: Record<string, GdcHotspotArrowSettings>,
): ArrowEditableHotspot[] {
  return hotspots.map((item, index) => {
    const direct = item as GdcGuideHotspot & GdcHotspotArrowSettings;
    const settings = settingsMap[arrowKey(scope, item.key)] ?? {};
    return {
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
      arrowDirection: settings.arrowDirection ?? direct.arrowDirection,
      arrowSize: settings.arrowSize ?? direct.arrowSize,
      arrowOffsetX: settings.arrowOffsetX ?? direct.arrowOffsetX,
      arrowOffsetY: settings.arrowOffsetY ?? direct.arrowOffsetY,
    };
  });
}

function geometryFromEditor(items: EditableResourceHotspot[]): GdcGuideHotspot[] {
  return items.map((item) => ({
    key: item.key,
    title: item.title,
    x: item.x,
    y: item.y,
    width: item.width,
    height: item.height,
  }));
}

function updateArrowSettings(
  current: Record<string, GdcHotspotArrowSettings>,
  scope: string,
  items: EditableResourceHotspot[],
) {
  const next = { ...current };
  Object.keys(next).forEach((key) => {
    if (key.startsWith(`${scope}:`)) delete next[key];
  });

  items.forEach((raw) => {
    const item = raw as ArrowEditableHotspot;
    next[arrowKey(scope, item.key)] = {
      arrowDirection: item.arrowDirection ?? "left",
      arrowSize: item.arrowSize ?? 64,
      arrowOffsetX: item.arrowOffsetX ?? 0,
      arrowOffsetY: item.arrowOffsetY ?? 0,
    };
  });

  return next;
}

export function GdcStudyDesignArrowAdminEditor({
  config,
  onChange,
  onSave,
}: {
  config: GdcQuestionGuideConfig;
  onChange: (config: GdcQuestionGuideConfig) => void;
  onSave: (config: GdcQuestionGuideConfig) => void | Promise<void>;
}) {
  const bundled = useBundledStudyImages();
  const study = getGdcStudyDesignConfig(config) as StudyWithArrowSettings;
  const settingsMap = study.hotspotArrowSettings ?? {};
  const [saving, setSaving] = useState(false);

  const baselineItems = useMemo(
    () => toEditorHotspots(study.baselineHotspots, "baseline", settingsMap),
    [settingsMap, study.baselineHotspots],
  );

  async function saveBaseline(items: EditableResourceHotspot[]) {
    const nextStudy: StudyWithArrowSettings = {
      ...study,
      baselineHotspots: geometryFromEditor(items),
      hotspotArrowSettings: updateArrowSettings(settingsMap, "baseline", items),
    };
    const nextConfig = withGdcStudyDesignConfig(config, nextStudy);
    onChange(nextConfig);
    setSaving(true);
    try {
      await onSave(nextConfig);
    } finally {
      setSaving(false);
    }
  }

  async function saveTask(
    taskId: GdcFacetId,
    items: EditableResourceHotspot[],
  ) {
    const scope = taskId;
    const nextStudy: StudyWithArrowSettings = {
      ...study,
      tasks: study.tasks.map((task) =>
        task.id === taskId
          ? { ...task, hotspots: geometryFromEditor(items) }
          : task,
      ),
      hotspotArrowSettings: updateArrowSettings(settingsMap, scope, items),
    };
    const nextConfig = withGdcStudyDesignConfig(config, nextStudy);
    onChange(nextConfig);
    setSaving(true);
    try {
      await onSave(nextConfig);
    } finally {
      setSaving(false);
    }
  }

  return (
    <details className="rounded-2xl border border-red-200 bg-red-50/20 p-4" open dir="rtl">
      <summary className="cursor-pointer font-black text-red-950">
        مرحله ۳ — تنظیم مستقل فلش‌های قرمز
      </summary>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-3 rounded-2xl border border-red-100 bg-white p-4">
        <div>
          <div className="flex items-center gap-2 text-sm font-black text-slate-950">
            <Crosshair className="h-4 w-4 text-red-600" />
            کنترل یکسان فلش‌ها در Editor و صفحه اصلی
          </div>
          <p className="mt-2 max-w-4xl text-xs leading-6 text-slate-500">
            برای هر تصویر مرحله ۳، Hotspot را انتخاب کنید و Direction، Arrow size و X/Y offset را تغییر دهید. همین مقادیر مستقیماً در صفحه اصلی خوانده می‌شوند؛ دیگر اندازه ثابت CSS وجود ندارد.
          </p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1.5 text-[10px] font-black text-red-700">
          <Save className="h-3.5 w-3.5" /> {saving ? "در حال ذخیره…" : "ذخیره از داخل هر Canvas"}
        </span>
      </div>

      <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
        <h3 className="font-black text-slate-950">تصویر پایه — قبل از اولین فیلتر</h3>
        {baselineItems.length ? (
          <div className="mt-3">
            <HotspotCanvasEditor
              imageUrl={study.baselineImageUrl || bundled.baseline}
              hotspots={baselineItems}
              onSave={saveBaseline}
            />
          </div>
        ) : (
          <p className="mt-3 rounded-xl bg-slate-50 p-3 text-xs leading-6 text-slate-500">
            برای تصویر پایه هنوز Hotspot تعریف نشده است. ابتدا در بخش اصلی «مرحله ۳ — Study Design Builder» Hotspot بسازید.
          </p>
        )}
      </section>

      <div className="mt-4 space-y-4">
        {study.tasks.map((task, index) => {
          const items = toEditorHotspots(task.hotspots, task.id, settingsMap);
          const imageUrl = task.imageUrl || bundled.steps[index] || "";
          return (
            <section key={task.id} className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="text-[10px] font-black text-red-600">فیلتر {index + 1}</div>
                  <h3 className="mt-1 text-sm font-black text-slate-950" dir="ltr">{task.label}</h3>
                </div>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-500">
                  {items.length} Hotspot
                </span>
              </div>

              {items.length ? (
                <div className="mt-3">
                  <HotspotCanvasEditor
                    imageUrl={imageUrl}
                    hotspots={items}
                    onSave={(edited) => saveTask(task.id, edited)}
                  />
                </div>
              ) : (
                <p className="mt-3 rounded-xl bg-slate-50 p-3 text-xs leading-6 text-slate-500">
                  برای این تصویر Hotspot تعریف نشده است. Hotspot را در Editor اصلی مرحله ۳ اضافه کنید؛ سپس تنظیم فلش آن اینجا ظاهر می‌شود.
                </p>
              )}
            </section>
          );
        })}
      </div>
    </details>
  );
}
