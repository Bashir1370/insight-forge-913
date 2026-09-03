export const HIDDEN_GDC_LENS_IMAGE =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";

export type GdcLensImageFit = "contain" | "cover" | "fill";

export type GdcLensLayout = {
  modalMaxWidth: number;
  imageColumnWidth: number;
  imageHeight: number;
  imageFit: GdcLensImageFit;
};

export const DEFAULT_GDC_LENS_LAYOUT: GdcLensLayout = {
  modalMaxWidth: 1500,
  imageColumnWidth: 500,
  imageHeight: 0,
  imageFit: "contain",
};

function numberOrFallback(value: unknown, fallback: number, min: number, max: number) {
  const parsed = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, parsed));
}

export function getGdcLensLayout(projects: unknown): GdcLensLayout {
  const source = (projects ?? {}) as Record<string, unknown>;
  const fit = source.lensImageFit;

  return {
    modalMaxWidth: numberOrFallback(
      source.lensModalMaxWidth,
      DEFAULT_GDC_LENS_LAYOUT.modalMaxWidth,
      900,
      1900,
    ),
    imageColumnWidth: numberOrFallback(
      source.lensImageColumnWidth,
      DEFAULT_GDC_LENS_LAYOUT.imageColumnWidth,
      280,
      850,
    ),
    imageHeight: numberOrFallback(
      source.lensImageHeight,
      DEFAULT_GDC_LENS_LAYOUT.imageHeight,
      0,
      1000,
    ),
    imageFit: fit === "cover" || fit === "fill" || fit === "contain"
      ? fit
      : DEFAULT_GDC_LENS_LAYOUT.imageFit,
  };
}

export function isHiddenGdcLensImage(value?: string | null) {
  return value === HIDDEN_GDC_LENS_IMAGE;
}

export function lensImageForEditor(value?: string | null) {
  return isHiddenGdcLensImage(value) ? "" : (value ?? "");
}
