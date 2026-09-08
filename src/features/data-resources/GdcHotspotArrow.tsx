import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from "lucide-react";

import "./gdc-hotspot-arrow.css";

export type GdcHotspotArrowDirection = "left" | "right" | "up" | "down";

export type GdcHotspotArrowSettings = {
  arrowDirection?: GdcHotspotArrowDirection;
  arrowSize?: number;
  arrowOffsetX?: number;
  arrowOffsetY?: number;
};

export type GdcHotspotArrowGeometry = GdcHotspotArrowSettings & {
  key: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

export const DEFAULT_GDC_HOTSPOT_ARROW_SIZE = 64;

export function getGdcHotspotArrowPosition(item: GdcHotspotArrowGeometry) {
  const direction = item.arrowDirection ?? "left";
  const offsetX = item.arrowOffsetX ?? 0;
  const offsetY = item.arrowOffsetY ?? 0;
  const centerX = item.x + item.width / 2 + offsetX;
  const centerY = item.y + item.height / 2 + offsetY;

  if (direction === "right") {
    return {
      left: `${item.x + offsetX}%`,
      top: `${centerY}%`,
      transform: "translate(-100%, -50%)",
    };
  }

  if (direction === "up") {
    return {
      left: `${centerX}%`,
      top: `${item.y + item.height + offsetY}%`,
      transform: "translate(-50%, 0)",
    };
  }

  if (direction === "down") {
    return {
      left: `${centerX}%`,
      top: `${item.y + offsetY}%`,
      transform: "translate(-50%, -100%)",
    };
  }

  return {
    left: `${item.x + item.width + offsetX}%`,
    top: `${centerY}%`,
    transform: "translate(0, -50%)",
  };
}

function ArrowIcon({ direction, size }: { direction: GdcHotspotArrowDirection; size: number }) {
  const props = { width: size, height: size, strokeWidth: 4 };
  if (direction === "right") return <ArrowRight {...props} />;
  if (direction === "up") return <ArrowUp {...props} />;
  if (direction === "down") return <ArrowDown {...props} />;
  return <ArrowLeft {...props} />;
}

export function GdcHotspotArrow({
  item,
  onClick,
  showArrow = true,
}: {
  item: GdcHotspotArrowGeometry;
  onClick?: () => void;
  showArrow?: boolean;
}) {
  const direction = item.arrowDirection ?? "left";
  const size = Math.max(28, Math.min(120, item.arrowSize ?? DEFAULT_GDC_HOTSPOT_ARROW_SIZE));
  const targetStyle = {
    left: `${item.x}%`,
    top: `${item.y}%`,
    width: `${item.width}%`,
    height: `${item.height}%`,
  };

  return (
    <>
      <button
        type="button"
        aria-label={`نمایش توضیح ${item.label}`}
        onClick={onClick}
        style={targetStyle}
        className="absolute z-10 cursor-pointer rounded-md bg-transparent outline-none transition focus:ring-2 focus:ring-red-300/70"
      >
        <span className="sr-only">{item.label}</span>
      </button>

      {showArrow ? (
        <div
          aria-hidden="true"
          data-direction={direction}
          style={getGdcHotspotArrowPosition(item)}
          className="pointer-events-none absolute z-20"
        >
          <div className="gdc-hotspot-arrow-nudge text-red-600 drop-shadow-[0_1px_1px_rgba(255,255,255,.95)]">
            <ArrowIcon direction={direction} size={size} />
          </div>
        </div>
      ) : null}
    </>
  );
}
