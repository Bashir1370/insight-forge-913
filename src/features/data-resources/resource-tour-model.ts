export type EditableResourceHotspot = {
  id?: string;
  key: string;
  step: number;
  title: string;
  description: string;
  action: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

export type EditableResourceContent = {
  key: string;
  label: string;
  value: string;
};

export type ResourceTourAdminData = {
  id: string | null;
  slug: string;
  title: string;
  imageUrl: string;
  hotspots: EditableResourceHotspot[];
  content: EditableResourceContent[];
  persisted: boolean;
  warning?: string;
};

export const DEFAULT_GDC_IMAGE_URL = "/images/gdc/gdc-home-clean.webp";

// Percent-based geometry. These values mirror the currently published GDC tour,
// so moving to database-backed editing does not shift the existing hotspots.
export const DEFAULT_GDC_HOTSPOTS: EditableResourceHotspot[] = [
  {
    key: "analysis-center",
    step: 1,
    title: "Analysis Center",
    description: "",
    action: "",
    x: 1.2,
    y: 9.6,
    width: 10.5,
    height: 5.5,
  },
  {
    key: "projects",
    step: 2,
    title: "Projects",
    description: "",
    action: "",
    x: 12.7,
    y: 9.6,
    width: 7.2,
    height: 5.5,
  },
  {
    key: "cohort-builder",
    step: 3,
    title: "Cohort Builder",
    description: "",
    action: "",
    x: 20.5,
    y: 9.6,
    width: 10.5,
    height: 5.5,
  },
  {
    key: "repository",
    step: 4,
    title: "Repository",
    description: "",
    action: "",
    x: 31.4,
    y: 9.6,
    width: 8.7,
    height: 5.5,
  },
  {
    key: "search",
    step: 5,
    title: "Search",
    description: "",
    action: "",
    x: 71.6,
    y: 9.6,
    width: 26.7,
    height: 5.5,
  },
  {
    key: "portal-summary",
    step: 6,
    title: "Data Portal Summary",
    description: "",
    action: "",
    x: 1.4,
    y: 74.2,
    width: 48.6,
    height: 16.6,
  },
  {
    key: "primary-site-chart",
    step: 7,
    title: "Cases by Major Primary Site",
    description: "",
    action: "",
    x: 69,
    y: 21.8,
    width: 28.7,
    height: 67,
  },
];

export const DEFAULT_GDC_CONTENT: EditableResourceContent[] = [
  {
    key: "title",
    label: "عنوان صفحه",
    value: "GDC / TCGA Guided Portal Tour",
  },
  {
    key: "description",
    label: "توضیح صفحه",
    value:
      "پورتال اصلی NCI برای جست‌وجو، ساخت cohort، مرور پروژه‌ها، تحلیل و دریافت داده‌های هماهنگ‌شده سرطان؛ از جمله پروژه‌های TCGA.",
  },
];
