import { HotspotCanvasEditor } from "./HotspotCanvasEditor";

type VisualPageEditorProps = {
  title: string;
  imageUrl: string;
  hotspots: Array<{
    id: string;
    title: string;
    x: number;
    y: number;
    width: number;
    height: number;
  }>;
  onSave: (items: VisualPageEditorProps["hotspots"]) => void;
};

export function VisualPageEditor({ title, imageUrl, hotspots, onSave }: VisualPageEditorProps) {
  return (
    <section className="rounded-3xl border bg-white p-6">
      <h2 className="text-xl font-black">{title}</h2>
      <p className="mt-2 text-sm text-slate-500">
        ویرایش بصری صفحه بدون تغییر کد
      </p>
      <div className="mt-5">
        <HotspotCanvasEditor imageUrl={imageUrl} hotspots={hotspots} onSave={onSave} />
      </div>
    </section>
  );
}
