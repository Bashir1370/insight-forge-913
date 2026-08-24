import type { ReactNode } from "react";

type Hotspot = {
  id: string;
  title: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
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
          className={
            hotspot.width && hotspot.height
              ? "absolute rounded-lg border-2 border-white/80 bg-teal-500/20 shadow-lg transition"
              : "absolute flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-teal-600 text-xs text-white shadow-lg"
          }
          style={
            hotspot.width && hotspot.height
              ? {
                  left: `${hotspot.x}%`,
                  top: `${hotspot.y}%`,
                  width: `${hotspot.width}%`,
                  height: `${hotspot.height}%`,
                }
              : { left: `${hotspot.x}%`, top: `${hotspot.y}%` }
          }
        >
          {!hotspot.width && hotspot.id}
        </button>
      ))}
    </div>
  );
}
