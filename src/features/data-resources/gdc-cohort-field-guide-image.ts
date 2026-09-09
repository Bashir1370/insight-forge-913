const DEFAULT_FIELD_GUIDE_IMAGE = "/images/gdc/gdc-cohort-builder-filters.webp";

export function resolveGdcCohortFieldGuideImage(
  pageImageUrl?: string | null,
  fallbackImageUrl?: string | null,
) {
  const pageValue = pageImageUrl?.trim() ?? "";
  const fallbackValue = fallbackImageUrl?.trim() ?? "";

  if (!pageValue) return fallbackValue;

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
