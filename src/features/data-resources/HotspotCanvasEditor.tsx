import { useRef, useState } from "react";

type Hotspot = {
  id: string;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

export function HotspotCanvasEditor({
  hotspots,
}: {
  hotspots: Hotspot[];
}) {
  const [items, setItems] = useState(hotspots);
  const [selected, setSelected] = useState<string | null>(null);
  const dragRef = useRef<{ id: string; x: number; y: number } | null>(null);

  function startDrag(id: string, e: React.PointerEvent) {
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = { id, x: e.clientX, y: e.clientY };
    setSelected(id);
  }

  function moveDrag(e: React.PointerEvent) {
    if (!dragRef.current) return;

    const dx = (e.clientX - dragRef.current.x) / 8;
    const dy = (e.clientY - dragRef.current.y) / 8;

    setItems((current) =>
      current.map((item) =>
        item.id === dragRef.current?.id
          ? {
              ...item,
              x: Math.max(0, Math.min(100 - item.width, item.x + dx)),
              y: Math.max(0, Math.min(100 - item.height, item.y + dy)),
            }
          : item,
      ),
    );

    dragRef.current.x = e.clientX;
    dragRef.current.y = e.clientY;
  }

  function endDrag() {
    dragRef.current = null;
  }

  return (
    <div className="rounded-3xl border bg-white p-5">
      <h3 className="font-black">ویرایش بصری Hotspot</h3>
      <div
        className="relative mt-4 aspect-video overflow-hidden rounded-2xl bg-slate-100"
        onPointerMove={moveDrag}
        onPointerUp={endDrag}
      >
        {items.map((item) => (
          <button
            key={item.id}
            onPointerDown={(e) => startDrag(item.id, e)}
            className={`absolute border-2 border-dashed border-teal-500 bg-teal-500/10 text-xs font-bold cursor-move ${selected === item.id ? "ring-4 ring-teal-300" : ""}`}
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
              width: `${item.width}%`,
              height: `${item.height}%`,
            }}
          >
            {item.title}
          </button>
        ))}
      </div>
    </div>
  );
}
