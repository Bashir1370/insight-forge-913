import { useEffect, useMemo, useRef, useState } from "react";

import type { EditableResourceHotspot } from "./resource-tour-model";

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function round(value: number) {
  return Math.round(value * 100) / 100;
}

export function HotspotCanvasEditor({
  hotspots,
  imageUrl,
  onSave,
}: {
  hotspots: EditableResourceHotspot[];
  imageUrl?: string;
  onSave?: (items: EditableResourceHotspot[]) => void | Promise<void>;
}) {
  const [items, setItems] = useState(hotspots);
  const [selected, setSelected] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<{ key: string; x: number; y: number } | null>(null);
  const resizeRef = useRef<{ key: string; x: number; y: number } | null>(null);

  useEffect(() => {
    setItems(hotspots);
  }, [hotspots]);

  const selectedItem = useMemo(
    () => items.find((item) => item.key === selected) ?? null,
    [items, selected],
  );

  function startDrag(key: string, event: React.PointerEvent<HTMLDivElement>) {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = { key, x: event.clientX, y: event.clientY };
    resizeRef.current = null;
    setSelected(key);
  }

  function startResize(key: string, event: React.PointerEvent<HTMLSpanElement>) {
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    resizeRef.current = { key, x: event.clientX, y: event.clientY };
    dragRef.current = null;
    setSelected(key);
  }

  function move(event: React.PointerEvent<HTMLDivElement>) {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect || rect.width <= 0 || rect.height <= 0) return;

    if (dragRef.current) {
      const dx = ((event.clientX - dragRef.current.x) / rect.width) * 100;
      const dy = ((event.clientY - dragRef.current.y) / rect.height) * 100;

      setItems((current) =>
        current.map((item) =>
          item.key === dragRef.current?.key
            ? {
                ...item,
                x: round(clamp(item.x + dx, 0, 100 - item.width)),
                y: round(clamp(item.y + dy, 0, 100 - item.height)),
              }
            : item,
        ),
      );

      dragRef.current.x = event.clientX;
      dragRef.current.y = event.clientY;
    }

    if (resizeRef.current) {
      const dw = ((event.clientX - resizeRef.current.x) / rect.width) * 100;
      const dh = ((event.clientY - resizeRef.current.y) / rect.height) * 100;

      setItems((current) =>
        current.map((item) =>
          item.key === resizeRef.current?.key
            ? {
                ...item,
                width: round(clamp(item.width + dw, 1, Math.max(1, 100 - item.x))),
                height: round(clamp(item.height + dh, 1, Math.max(1, 100 - item.y))),
              }
            : item,
        ),
      );

      resizeRef.current.x = event.clientX;
      resizeRef.current.y = event.clientY;
    }
  }

  function end() {
    dragRef.current = null;
    resizeRef.current = null;
  }

  function updateSelected(field: "x" | "y" | "width" | "height", value: number) {
    if (!selectedItem || !Number.isFinite(value)) return;

    setItems((current) =>
      current.map((item) => {
        if (item.key !== selectedItem.key) return item;

        const next = { ...item, [field]: round(value) };
        next.width = clamp(next.width, 1, Math.max(1, 100 - next.x));
        next.height = clamp(next.height, 1, Math.max(1, 100 - next.y));
        next.x = clamp(next.x, 0, 100 - next.width);
        next.y = clamp(next.y, 0, 100 - next.height);
        return next;
      }),
    );
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-black text-slate-950">ویرایش بصری Hotspot</h3>
          <p className="mt-1 text-xs text-slate-500">
            باکس را بکشید؛ مربع گوشه پایین راست برای تغییر اندازه است.
          </p>
        </div>
        <button
          type="button"
          className="rounded-xl bg-teal-700 px-4 py-2 font-bold text-white transition hover:bg-teal-800"
          onClick={() => onSave?.(items)}
        >
          ذخیره Hotspotها
        </button>
      </div>

      <div
        ref={canvasRef}
        className="relative mt-4 aspect-[1911/870] touch-none overflow-hidden rounded-2xl border border-slate-200 bg-slate-100"
        onPointerMove={move}
        onPointerUp={end}
        onPointerCancel={end}
        onPointerLeave={end}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Resource tour preview"
            draggable={false}
            className="pointer-events-none absolute inset-0 h-full w-full select-none object-contain"
          />
        ) : null}

        {items.map((item) => (
          <div
            key={item.key}
            role="button"
            tabIndex={0}
            aria-label={item.title}
            onPointerDown={(event) => startDrag(item.key, event)}
            onClick={() => setSelected(item.key)}
            className={`absolute cursor-move select-none rounded-md border-2 border-dashed text-[10px] font-black shadow-sm transition ${
              selected === item.key
                ? "z-20 border-teal-500 bg-teal-400/20 ring-4 ring-teal-300/50"
                : "z-10 border-sky-500 bg-sky-400/10 hover:border-teal-400"
            }`}
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
              width: `${item.width}%`,
              height: `${item.height}%`,
            }}
          >
            <span className="absolute left-1 top-1 rounded bg-slate-950/85 px-1.5 py-0.5 text-white">
              {item.step}. {item.title}
            </span>
            <span
              onPointerDown={(event) => startResize(item.key, event)}
              className="absolute bottom-0 right-0 h-4 w-4 cursor-se-resize rounded-tl bg-teal-600 shadow"
              title="تغییر اندازه"
            />
          </div>
        ))}
      </div>

      {selectedItem ? (
        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4" dir="ltr">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="font-black text-slate-900">{selectedItem.title}</div>
            <div className="text-xs text-slate-500">{selectedItem.key}</div>
          </div>
          <div className="grid gap-3 sm:grid-cols-4">
            {(["x", "y", "width", "height"] as const).map((field) => (
              <label key={field} className="text-xs font-bold text-slate-600">
                {field.toUpperCase()} %
                <input
                  type="number"
                  min={0}
                  max={100}
                  step={0.1}
                  value={selectedItem[field]}
                  onChange={(event) => updateSelected(field, Number(event.target.value))}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 outline-none focus:border-teal-500"
                />
              </label>
            ))}
          </div>
        </div>
      ) : (
        <p className="mt-3 text-sm text-slate-500">برای تنظیم دقیق عددی، یک Hotspot را انتخاب کنید.</p>
      )}
    </div>
  );
}
