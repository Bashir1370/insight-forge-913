import { ArrowLeft } from "lucide-react";

import "./gdc-hotspot-arrow.css";

export type GdcHotspotArrowGeometry = {
  key: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

export function GdcHotspotArrow({
  item,
  onClick,
  selected = false,
}: {
  item: GdcHotspotArrowGeometry;
  onClick?: () => void;
  selected?: boolean;
}) {
  const targetStyle = {
    left: `${item.x}%`,
    top: `${item.y}%`,
    width: `${item.width}%`,
    height: `${item.height}%`,
  };

  const arrowStyle = {
    left: `calc(${item.x + item.width}% + 6px)`,
    top: `${item.y + item.height / 2}%`,
  };

  return (
    <>
      <button
        type="button"
        aria-label={`نمایش توضیح ${item.label}`}
        onClick={onClick}
        style={targetStyle}
        className={`absolute z-10 rounded-md bg-transparent outline-none transition focus:ring-2 focus:ring-red-300/70 ${
          selected ? "cursor-pointer" : "cursor-pointer"
        }`}
      >
        <span className="sr-only">{item.label}</span>
      </button>

      <div
        aria-hidden="true"
        style={arrowStyle}
        className="pointer-events-none absolute z-20 -translate-y-1/2"
      >
        <div className="gdc-hotspot-arrow-nudge text-red-600 drop-shadow-[0_1px_1px_rgba(255,255,255,.95)]">
          <ArrowLeft className="h-10 w-10 sm:h-11 sm:w-11" strokeWidth={4} />
        </div>
      </div>
    </>
  );
}
