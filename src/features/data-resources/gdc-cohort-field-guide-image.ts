const DEFAULT_FIELD_GUIDE_IMAGE = "/images/gdc/gdc-cohort-builder-filters.webp";

export function resolveGdcCohortFieldGuideImage(
  pageImageUrl?: string | null,
  fallbackImageUrl?: string | null,
) {
  const pageValue = pageImageUrl?.trim() ?? "";
  const fallbackValue = fallbackImageUrl?.trim() ?? "";

  // Empty pages belong to tabs that do not have their own screenshot yet.
  // Do not silently reuse the General screenshot there, otherwise the selected
  // tab changes while the left-hand image still looks like General.
  if (!pageValue) return "";

  // The original General page intentionally points at the shared/default
  // Cohort Builder image. When a managed Stage 2 screenshot exists, reuse it
  // for General only so both stages stay visually consistent.
  if (
    pageValue === DEFAULT_FIELD_GUIDE_IMAGE &&
    fallbackValue &&
    fallbackValue !== pageValue
  ) {
    return fallbackValue;
  }

  return pageValue;
}

export function isDefaultGdcCohortFieldGuideImage(value?: string | null) {
  return (value?.trim() ?? "") === DEFAULT_FIELD_GUIDE_IMAGE;
}
