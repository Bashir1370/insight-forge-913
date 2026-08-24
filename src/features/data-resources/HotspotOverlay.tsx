import type { ReactNode } from "react";

type Hotspot = {
  id: string;
  title: string;
  x: number;
  y: number;
};

export function HotspotOverlay({
  hotspots,
  children,
}: {
  hotspots: Hotspot[];
  children?: ReactNode;
}) {
  return (
    <div className="relative">
      {children}
      {hotspots.map((hotspot) => (
        <button
          key={hotspot.id}
          type="button"
          title={hotspot.title}
          className="absolute flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-teal-600 text-xs text-white shadow-lg"
          style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
        >
          {hotspot.id}
        </button>
      ))}
    </div>
  );
}
