import type { GdcGuideHotspot } from "./gdc-question-guide-config";

export type GdcProjectSummaryStageConfig = {
  imageUrl: string;
  title: string;
  intro: string;
  hotspots: GdcGuideHotspot[];
};

export const DEFAULT_PROJECT_SUMMARY_STAGE: GdcProjectSummaryStageConfig = {
  imageUrl: "",
  title: "Project Summary را بخوانیم",
  intro:
    "در این مرحله خلاصه Project را بررسی می‌کنیم تا قبل از انتخاب Cohort و فایل‌ها، محدوده مطالعه و نوع داده را بهتر بشناسیم.",
  hotspots: [
    { key: "cohort", title: "Save New Cohort", x: 10, y: 10, width: 20, height: 8 },
    { key: "biospecimen", title: "Biospecimen", x: 10, y: 22, width: 20, height: 8 },
    { key: "clinical", title: "Clinical", x: 10, y: 34, width: 20, height: 8 },
    { key: "manifest", title: "Manifest", x: 10, y: 46, width: 20, height: 8 },
    { key: "cases", title: "Cases", x: 55, y: 20, width: 20, height: 8 },
    { key: "files", title: "Files", x: 55, y: 32, width: 20, height: 8 },
    { key: "data-category", title: "Data Category", x: 55, y: 44, width: 20, height: 8 },
    {
      key: "experimental-strategy",
      title: "Experimental Strategy",
      x: 55,
      y: 56,
      width: 25,
      height: 8,
    },
  ],
};
