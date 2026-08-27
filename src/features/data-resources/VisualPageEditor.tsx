import { HotspotCanvasEditor } from "./HotspotCanvasEditor";
import type { EditableResourceHotspot } from "./resource-tour-model";

type VisualPageEditorProps = {
  title: string;
  imageUrl: string;
  hotspots: EditableResourceHotspot[];
  onSave: (items: EditableResourceHotspot[]) => void | Promise<void>;
};

export function VisualPageEditor({
  title,
  imageUrl,
  hotspots,
  onSave,
}: VisualPageEditorProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6">
      <h2 className="text-xl font-black text-slate-950">{title}</h2>
      <p className="mt-2 text-sm text-slate-500">
        ویرایش بصری جایگاه و اندازه Hotspotها بدون تغییر کد
      </p>
      <div className="mt-5">
        <HotspotCanvasEditor imageUrl={imageUrl} hotspots={hotspots} onSave={onSave} />
      </div>
    </section>
  );
}
