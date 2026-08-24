import { useState } from "react";

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

  function move(id: string, dx: number, dy: number) {
    setItems((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, x: item.x + dx, y: item.y + dy }
          : item,
      ),
    );
  }

  return (
    <div className="rounded-3xl border bg-white p-5">
      <h3 className="font-black">ویرایش بصری Hotspot</h3>
      <div className="relative mt-4 aspect-video overflow-hidden rounded-2xl bg-slate-100">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setSelected(item.id);
              move(item.id, 0, 0);
            }}
            className={`absolute border-2 border-dashed border-teal-500 bg-teal-500/10 text-xs font-bold ${selected === item.id ? "ring-4 ring-teal-300" : ""}`}
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
              width: `${item.width}%`,
              height: `${item.height}%`,
            }}
            title="برای جابه‌جایی در نسخه بعدی Drag فعال می‌شود"
          >
            {item.title}
          </button>
        ))}
      </div>
    </div>
  );
}
