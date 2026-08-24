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
  const resizeRef = useRef<{ id: string; x: number; y: number } | null>(null);

  function startDrag(id: string, e: React.PointerEvent) {
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = { id, x: e.clientX, y: e.clientY };
    setSelected(id);
  }

  function startResize(id: string, e: React.PointerEvent) {
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    resizeRef.current = { id, x: e.clientX, y: e.clientY };
    setSelected(id);
  }

  function move(e: React.PointerEvent) {
    if (dragRef.current) {
      const dx = (e.clientX - dragRef.current.x) / 8;
      const dy = (e.clientY - dragRef.current.y) / 8;
      setItems((current) => current.map((item) => item.id === dragRef.current?.id ? {
        ...item,
        x: Math.max(0, Math.min(100 - item.width, item.x + dx)),
        y: Math.max(0, Math.min(100 - item.height, item.y + dy)),
      } : item));
      dragRef.current.x = e.clientX;
      dragRef.current.y = e.clientY;
    }

    if (resizeRef.current) {
      const dw = (e.clientX - resizeRef.current.x) / 8;
      const dh = (e.clientY - resizeRef.current.y) / 8;
      setItems((current) => current.map((item) => item.id === resizeRef.current?.id ? {
        ...item,
        width: Math.max(3, Math.min(80, item.width + dw)),
        height: Math.max(3, Math.min(80, item.height + dh)),
      } : item));
      resizeRef.current.x = e.clientX;
      resizeRef.current.y = e.clientY;
    }
  }

  function end() {
    dragRef.current = null;
    resizeRef.current = null;
  }

  return (
    <div className="rounded-3xl border bg-white p-5">
      <h3 className="font-black">ویرایش بصری Hotspot</h3>
      <div className="relative mt-4 aspect-video overflow-hidden rounded-2xl bg-slate-100" onPointerMove={move} onPointerUp={end}>
        {items.map((item) => (
          <button key={item.id} onPointerDown={(e) => startDrag(item.id, e)} className={`absolute border-2 border-dashed border-teal-500 bg-teal-500/10 text-xs font-bold cursor-move ${selected === item.id ? "ring-4 ring-teal-300" : ""}`} style={{left:`${item.x}%`,top:`${item.y}%`,width:`${item.width}%`,height:`${item.height}%`}}>
            {item.title}
            <span onPointerDown={(e)=>startResize(item.id,e)} className="absolute right-0 bottom-0 h-3 w-3 cursor-se-resize bg-teal-500" />
          </button>
        ))}
      </div>
    </div>
  );
}
