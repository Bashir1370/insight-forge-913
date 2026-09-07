import { Crosshair, ImageIcon } from "lucide-react";

import { HotspotCanvasEditor } from "./HotspotCanvasEditor";
import { VisualAssetEditor } from "./VisualAssetEditor";
import type { EditableResourceHotspot } from "./resource-tour-model";

export function GdcDiscoverProjectsStageAdminEditor({
  imageUrl,
  hotspots,
  onImageSave,
  onHotspotsSave,
}: {
  imageUrl: string;
  hotspots: EditableResourceHotspot[];
  onImageSave: (imageUrl: string) => void | Promise<void>;
  onHotspotsSave: (hotspots: EditableResourceHotspot[]) => void | Promise<void>;
}) {
  const projectHotspot = hotspots.find((item) => item.key === "projects");

  return (
    <section className="rounded-3xl border border-cyan-200 bg-white p-6 shadow-sm" dir="rtl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-xs font-black text-cyan-700">مرحله ۱ · پیدا کردن محدوده داده‌ها</div>
          <h2 className="mt-1 text-2xl font-black text-slate-950">اسکرین‌شات GDC و Hotspot بخش Projects</h2>
          <p className="mt-2 max-w-4xl text-sm leading-7 text-slate-600">
            اسکرین‌شات واقعی مرحله اول و محدوده قابل کلیک Projects را از همین بخش مدیریت کنید. تصویر را می‌توانید عوض کنید و Hotspot را با Drag و Resize دقیقاً روی رابط واقعی GDC قرار دهید.
          </p>
        </div>
        <div className="flex gap-2 text-xs font-bold text-slate-500">
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1.5">
            <ImageIcon className="h-3.5 w-3.5" /> تصویر مرحله ۱
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-3 py-1.5 text-teal-700">
            <Crosshair className="h-3.5 w-3.5" /> Projects Hotspot
          </span>
        </div>
      </div>

      <div className="mt-5">
        <VisualAssetEditor
          resourceSlug="gdc-discover-projects-stage"
          imageUrl={imageUrl}
          title="اسکرین‌شات اصلی مرحله ۱"
          description="برای بهترین نتیجه، اسکرین‌شات اصلی GDC را با رزولوشن واقعی و بدون فشرده‌سازی اضافه بارگذاری کنید."
          allowRemove={false}
          onSave={onImageSave}
        />
      </div>

      <div className="mt-5">
        {projectHotspot ? (
          <HotspotCanvasEditor
            imageUrl={imageUrl}
            hotspots={[projectHotspot]}
            onSave={async (editedItems) => {
              const edited = editedItems[0];
              if (!edited) return;
              const merged = hotspots.map((item) =>
                item.key === "projects" ? { ...item, ...edited } : item,
              );
              await onHotspotsSave(merged);
            }}
          />
        ) : (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-7 text-amber-900">
            Hotspot مربوط به Projects پیدا نشد. ابتدا تنظیمات Resource Tour را دوباره بارگذاری کنید.
          </div>
        )}
      </div>
    </section>
  );
}
