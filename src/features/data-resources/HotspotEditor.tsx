import React, { useState } from "react";

type Hotspot = {
  id: string;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

export function HotspotEditor({
  initialHotspots = [],
}: {
  initialHotspots?: Hotspot[];
}) {
  const [hotspots, setHotspots] = useState(initialHotspots);

  const update = (id: string, patch: Partial<Hotspot>) => {
    setHotspots((items) =>
      items.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6">
      <h2 className="text-lg font-black text-slate-950">ویرایشگر Hotspot منابع</h2>
      <p className="mt-2 text-sm text-slate-600">
        پایه اولیه برای جابه‌جایی و تنظیم باکس‌های Tour بدون تغییر کد.
      </p>
      <div className="mt-4 space-y-3">
        {hotspots.map((hotspot) => (
          <div key={hotspot.id} className="rounded-xl bg-slate-50 p-3">
            <div className="font-bold">{hotspot.title}</div>
            <div className="mt-2 grid grid-cols-4 gap-2 text-xs">
              <input className="rounded border p-2" value={hotspot.x} onChange={(e) => update(hotspot.id, { x: Number(e.target.value) })} />
              <input className="rounded border p-2" value={hotspot.y} onChange={(e) => update(hotspot.id, { y: Number(e.target.value) })} />
              <input className="rounded border p-2" value={hotspot.width} onChange={(e) => update(hotspot.id, { width: Number(e.target.value) })} />
              <input className="rounded border p-2" value={hotspot.height} onChange={(e) => update(hotspot.id, { height: Number(e.target.value) })} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
