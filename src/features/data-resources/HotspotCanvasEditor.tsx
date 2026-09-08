import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  DEFAULT_GDC_HOTSPOT_ARROW_SIZE,
  getGdcHotspotArrowPosition,
  type GdcHotspotArrowDirection,
  type GdcHotspotArrowSettings,
} from "./GdcHotspotArrow";
import type { EditableResourceHotspot } from "./resource-tour-model";

type EditableHotspot = EditableResourceHotspot & GdcHotspotArrowSettings;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function round(value: number) {
  return Math.round(value * 100) / 100;
}

function ArrowIcon({ direction, size }: { direction: GdcHotspotArrowDirection; size: number }) {
  const props = { width: size, height: size, strokeWidth: 4 };
  if (direction === "right") return <ArrowRight {...props} />;
  if (direction === "up") return <ArrowUp {...props} />;
  if (direction === "down") return <ArrowDown {...props} />;
  return <ArrowLeft {...props} />;
}

export function HotspotCanvasEditor({
  hotspots,
  imageUrl,
  onSave,
  showArrowPreview = true,
}: {
  hotspots: EditableResourceHotspot[];
  imageUrl?: string;
  onSave?: (items: EditableResourceHotspot[]) => void | Promise<void>;
  showArrowPreview?: boolean;
}) {
  const [items, setItems] = useState<EditableHotspot[]>(hotspots as EditableHotspot[]);
  const [selected, setSelected] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<{ key: string; x: number; y: number } | null>(null);
  const resizeRef = useRef<{ key: string; x: number; y: number } | null>(null);
  const arrowDragRef = useRef<{ key: string; x: number; y: number } | null>(null);

  useEffect(() => {
    setItems(hotspots as EditableHotspot[]);
  }, [hotspots]);

  const selectedItem = useMemo(
    () => items.find((item) => item.key === selected) ?? null,
    [items, selected],
  );

  function startDrag(key: string, event: React.PointerEvent<HTMLElement>) {
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = { key, x: event.clientX, y: event.clientY };
    resizeRef.current = null;
    arrowDragRef.current = null;
    setSelected(key);
  }

  function startResize(key: string, event: React.PointerEvent<HTMLSpanElement>) {
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    resizeRef.current = { key, x: event.clientX, y: event.clientY };
    dragRef.current = null;
    arrowDragRef.current = null;
    setSelected(key);
  }

  function startArrowDrag(key: string, event: React.PointerEvent<HTMLSpanElement>) {
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    arrowDragRef.current = { key, x: event.clientX, y: event.clientY };
    dragRef.current = null;
    resizeRef.current = null;
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

    if (arrowDragRef.current) {
      const dx = ((event.clientX - arrowDragRef.current.x) / rect.width) * 100;
      const dy = ((event.clientY - arrowDragRef.current.y) / rect.height) * 100;

      setItems((current) =>
        current.map((item) =>
          item.key === arrowDragRef.current?.key
            ? {
                ...item,
                arrowOffsetX: round(clamp((item.arrowOffsetX ?? 0) + dx, -50, 50)),
                arrowOffsetY: round(clamp((item.arrowOffsetY ?? 0) + dy, -50, 50)),
              }
            : item,
        ),
      );

      arrowDragRef.current.x = event.clientX;
      arrowDragRef.current.y = event.clientY;
    }
  }

  function end() {
    dragRef.current = null;
    resizeRef.current = null;
    arrowDragRef.current = null;
  }

  function updateSelectedGeometry(field: "x" | "y" | "width" | "height", value: number) {
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

  function updateSelectedArrow(patch: Partial<GdcHotspotArrowSettings>) {
    if (!selectedItem) return;
    setItems((current) =>
      current.map((item) => (item.key === selectedItem.key ? { ...item, ...patch } : item)),
    );
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-black text-slate-950">ویرایش بصری Hotspot و فلش</h3>
          <p className="mt-1 text-xs leading-6 text-slate-500">
            باکس Hotspot را Drag/Resize کنید. فلش قرمز را جداگانه بکشید تا فقط جای فلش تغییر کند؛ جهت، اندازه و Offset هم پایین تصویر قابل تنظیم است.
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

        {items.map((item) => {
          const isSelected = selected === item.key;
          const direction = item.arrowDirection ?? "left";
          const arrowSize = Math.max(28, Math.min(120, item.arrowSize ?? DEFAULT_GDC_HOTSPOT_ARROW_SIZE));
          const arrowPosition = getGdcHotspotArrowPosition({ ...item, label: item.title });

          return (
            <div key={item.key} className="contents">
              <div
                role="button"
                tabIndex={0}
                aria-label={item.title}
                onPointerDown={(event) => startDrag(item.key, event)}
                onClick={() => setSelected(item.key)}
                className={`absolute cursor-move select-none rounded-md border-2 border-dashed text-[10px] font-black shadow-sm transition ${
                  isSelected
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
                  title="تغییر اندازه Hotspot"
                />
              </div>

              {showArrowPreview && isSelected ? (
                <span
                  aria-label="جابجایی فلش قرمز"
                  title="فلش را بکشید تا فقط موقعیت خود فلش تغییر کند"
                  onPointerDown={(event) => startArrowDrag(item.key, event)}
                  data-direction={direction}
                  style={arrowPosition}
                  className="absolute z-40 cursor-move touch-none text-red-600 drop-shadow-[0_1px_1px_rgba(255,255,255,.95)]"
                >
                  <span className="gdc-hotspot-arrow-nudge block">
                    <ArrowIcon direction={direction} size={arrowSize} />
                  </span>
                </span>
              ) : null}
            </div>
          );
        })}
      </div>

      {selectedItem ? (
        <div className="mt-4 space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4" dir="ltr">
          <div className="flex items-center justify-between gap-3">
            <div className="font-black text-slate-900">{selectedItem.title}</div>
            <div className="text-xs text-slate-500">{selectedItem.key}</div>
          </div>

          <div>
            <div className="mb-2 text-right text-xs font-black text-slate-700" dir="rtl">موقعیت و اندازه Hotspot</div>
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
                    onChange={(event) => updateSelectedGeometry(field, Number(event.target.value))}
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 outline-none focus:border-teal-500"
                  />
                </label>
              ))}
            </div>
          </div>

          {showArrowPreview ? (
            <div className="rounded-xl border border-red-100 bg-white p-3">
              <div className="mb-2 text-right text-xs font-black text-red-700" dir="rtl">تنظیم مستقل فلش قرمز</div>
              <div className="grid gap-3 sm:grid-cols-4">
                <label className="text-xs font-bold text-slate-600">
                  Direction
                  <select
                    value={selectedItem.arrowDirection ?? "left"}
                    onChange={(event) => updateSelectedArrow({ arrowDirection: event.target.value as GdcHotspotArrowDirection })}
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 outline-none focus:border-red-400"
                  >
                    <option value="left">← از راست به چپ</option>
                    <option value="right">→ از چپ به راست</option>
                    <option value="down">↓ از بالا به پایین</option>
                    <option value="up">↑ از پایین به بالا</option>
                  </select>
                </label>
                <label className="text-xs font-bold text-slate-600">
                  Arrow size (px)
                  <input
                    type="number"
                    min={28}
                    max={120}
                    step={1}
                    value={selectedItem.arrowSize ?? DEFAULT_GDC_HOTSPOT_ARROW_SIZE}
                    onChange={(event) => updateSelectedArrow({ arrowSize: clamp(Number(event.target.value), 28, 120) })}
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 outline-none focus:border-red-400"
                  />
                </label>
                <label className="text-xs font-bold text-slate-600">
                  Arrow X offset %
                  <input
                    type="number"
                    min={-50}
                    max={50}
                    step={0.1}
                    value={selectedItem.arrowOffsetX ?? 0}
                    onChange={(event) => updateSelectedArrow({ arrowOffsetX: clamp(Number(event.target.value), -50, 50) })}
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 outline-none focus:border-red-400"
                  />
                </label>
                <label className="text-xs font-bold text-slate-600">
                  Arrow Y offset %
                  <input
                    type="number"
                    min={-50}
                    max={50}
                    step={0.1}
                    value={selectedItem.arrowOffsetY ?? 0}
                    onChange={(event) => updateSelectedArrow({ arrowOffsetY: clamp(Number(event.target.value), -50, 50) })}
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 outline-none focus:border-red-400"
                  />
                </label>
              </div>
              <p className="mt-2 text-right text-[11px] leading-5 text-slate-500" dir="rtl">
                برای مثال اگر می‌خواهید فلش از بالا به پایین اشاره کند، Direction را روی «↓ از بالا به پایین» بگذارید. Drag کردن خود فلش مقدار Offset را تغییر می‌دهد و Hotspot سر جای خودش می‌ماند.
              </p>
            </div>
          ) : null}
        </div>
      ) : (
        <p className="mt-3 text-sm text-slate-500">برای تنظیم دقیق Hotspot و فلش، یک Hotspot را انتخاب کنید.</p>
      )}
    </div>
  );
}
