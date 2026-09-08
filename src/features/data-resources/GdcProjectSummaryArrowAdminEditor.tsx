import { Crosshair, Save } from "lucide-react";
import { useMemo, useState } from "react";

import { HotspotCanvasEditor } from "./HotspotCanvasEditor";
import type { GdcHotspotArrowSettings } from "./GdcHotspotArrow";
import type {
  GdcProjectSummaryConfig,
  GdcProjectSummaryHotspot,
} from "./gdc-project-summary-config";
import type { EditableResourceHotspot } from "./resource-tour-model";

type ArrowEditableHotspot = EditableResourceHotspot & GdcHotspotArrowSettings;
type ProjectSummaryWithArrowSettings = GdcProjectSummaryConfig & {
  hotspotArrowSettings?: Record<string, GdcHotspotArrowSettings>;
};

function toEditorHotspots(
  hotspots: GdcProjectSummaryHotspot[],
  settingsMap: Record<string, GdcHotspotArrowSettings>,
): ArrowEditableHotspot[] {
  return hotspots.map((item, index) => {
    const direct = item as GdcProjectSummaryHotspot & GdcHotspotArrowSettings;
    const settings = settingsMap[item.key] ?? {};
    return {
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
      arrowDirection: settings.arrowDirection ?? direct.arrowDirection,
      arrowSize: settings.arrowSize ?? direct.arrowSize,
      arrowOffsetX: settings.arrowOffsetX ?? direct.arrowOffsetX,
      arrowOffsetY: settings.arrowOffsetY ?? direct.arrowOffsetY,
    };
  });
}

function updateArrowSettings(items: EditableResourceHotspot[]) {
  const next: Record<string, GdcHotspotArrowSettings> = {};
  items.forEach((raw) => {
    const item = raw as ArrowEditableHotspot;
    next[item.key] = {
      arrowDirection: item.arrowDirection ?? "left",
      arrowSize: item.arrowSize ?? 64,
      arrowOffsetX: item.arrowOffsetX ?? 0,
      arrowOffsetY: item.arrowOffsetY ?? 0,
    };
  });
  return next;
}

export function GdcProjectSummaryArrowAdminEditor({
  config,
  onChange,
  onSave,
}: {
  config: GdcProjectSummaryConfig;
  onChange: (config: GdcProjectSummaryConfig) => void;
  onSave: (config: GdcProjectSummaryConfig) => void | Promise<void>;
}) {
  const managed = config as ProjectSummaryWithArrowSettings;
  const settingsMap = managed.hotspotArrowSettings ?? {};
  const [saving, setSaving] = useState(false);

  const editorHotspots = useMemo(
    () => toEditorHotspots(config.hotspots, settingsMap),
    [config.hotspots, settingsMap],
  );

  async function saveArrows(items: EditableResourceHotspot[]) {
    const geometry = new Map(items.map((item) => [item.key, item]));
    const nextHotspots = config.hotspots.map((item) => {
      const edited = geometry.get(item.key);
      return edited
        ? {
            ...item,
            x: edited.x,
            y: edited.y,
            width: edited.width,
            height: edited.height,
          }
        : item;
    });

    const next = {
      ...config,
      hotspots: nextHotspots,
      hotspotArrowSettings: updateArrowSettings(items),
    } as ProjectSummaryWithArrowSettings;

    onChange(next);
    setSaving(true);
    try {
      await onSave(next);
    } finally {
      setSaving(false);
    }
  }

  return (
    <details className="rounded-2xl border border-red-200 bg-red-50/20 p-4" open dir="rtl">
      <summary className="cursor-pointer font-black text-red-950">
        مرحله ۵ — تنظیم مستقل فلش‌های قرمز
      </summary>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-3 rounded-2xl border border-red-100 bg-white p-4">
        <div>
          <div className="flex items-center gap-2 text-sm font-black text-slate-950">
            <Crosshair className="h-4 w-4 text-red-600" />
            کنترل یکسان فلش‌ها در Editor و Project Summary
          </div>
          <p className="mt-2 max-w-4xl text-xs leading-6 text-slate-500">
            هر Hotspot را انتخاب کنید و Direction، Arrow size و X/Y offset را تغییر دهید. همین مقادیر در صفحه اصلی مرحله ۵ استفاده می‌شوند. فلش در صفحه اصلی فقط هنگام Hover/Focus روی همان ناحیه ظاهر می‌شود.
          </p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1.5 text-[10px] font-black text-red-700">
          <Save className="h-3.5 w-3.5" /> {saving ? "در حال ذخیره…" : "ذخیره از داخل Canvas"}
        </span>
      </div>

      {config.imageUrl && editorHotspots.length ? (
        <div className="mt-4">
          <HotspotCanvasEditor
            imageUrl={config.imageUrl}
            hotspots={editorHotspots}
            onSave={saveArrows}
          />
        </div>
      ) : (
        <p className="mt-4 rounded-xl bg-slate-50 p-3 text-xs leading-6 text-slate-500">
          برای تنظیم فلش‌ها ابتدا در Editor اصلی مرحله ۵ تصویر و حداقل یک Hotspot تعریف کنید.
        </p>
      )}
    </details>
  );
}
