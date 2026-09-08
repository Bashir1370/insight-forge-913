import { createFileRoute, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { GdcCohortBuilderFiltersAdminEditor } from "@/features/data-resources/GdcCohortBuilderFiltersAdminEditor";
import { GdcCohortBuilderIntroAdminEditor } from "@/features/data-resources/GdcCohortBuilderIntroAdminEditor";
import { GdcDiscoverProjectsStageAdminEditor } from "@/features/data-resources/GdcDiscoverProjectsStageAdminEditor";
import { GdcProjectDecisionAdminEditor } from "@/features/data-resources/GdcProjectDecisionAdminEditor";
import { GdcProjectSummaryAdminEditor } from "@/features/data-resources/GdcProjectSummaryAdminEditor";
import { GdcProjectSummaryArrowAdminEditor } from "@/features/data-resources/GdcProjectSummaryArrowAdminEditor";
import { GdcQuestionGuideAdminEditor } from "@/features/data-resources/GdcQuestionGuideAdminEditor";
import { GdcStudyDesignAdminEditor } from "@/features/data-resources/GdcStudyDesignAdminEditor";
import { GdcStudyDesignArrowAdminEditor } from "@/features/data-resources/GdcStudyDesignArrowAdminEditor";
import { VisualContentEditor } from "@/features/data-resources/VisualContentEditor";
import {
  GDC_COHORT_BUILDER_FILTERS_CONTENT_KEY,
  getGdcCohortBuilderFiltersConfig,
  toGdcCohortBuilderFiltersContent,
  type GdcCohortBuilderFiltersConfig,
} from "@/features/data-resources/gdc-cohort-builder-filters-config";
import {
  GDC_COHORT_BUILDER_INTRO_CONTENT_KEY,
  getGdcCohortBuilderIntroConfig,
  toGdcCohortBuilderIntroContent,
  type GdcCohortBuilderIntroConfig,
} from "@/features/data-resources/gdc-cohort-builder-intro-config";
import {
  GDC_PROJECT_SUMMARY_CONTENT_KEY,
  getGdcProjectSummaryConfig,
  toGdcProjectSummaryContent,
  type GdcProjectSummaryConfig,
} from "@/features/data-resources/gdc-project-summary-config";
import {
  GDC_QUESTION_GUIDE_CONTENT_KEY,
  getGdcQuestionGuideConfig,
  toGdcQuestionGuideContent,
  type GdcQuestionGuideConfig,
} from "@/features/data-resources/gdc-question-guide-config";
import { upgradeGdcQuestionGuideConfig } from "@/features/data-resources/gdc-question-guide-upgrade";
import {
  loadResourceTourAdmin,
  saveResourceContent,
  saveResourceHotspots,
  saveResourceImage,
} from "@/features/data-resources/resource-tour-admin-service";
import {
  DEFAULT_GDC_CONTENT,
  DEFAULT_GDC_HOTSPOTS,
  DEFAULT_GDC_IMAGE_URL,
  type EditableResourceContent,
  type EditableResourceHotspot,
} from "@/features/data-resources/resource-tour-model";
import { supabase } from "@/integrations/supabase/client";

const RESOURCE_SLUG = "gdc";
const RESOURCE_TITLE = "GDC / TCGA Guided Portal Tour";

export const Route = createFileRoute("/admin_/resource-tours")({
  ssr: false,
  beforeLoad: async () => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      throw redirect({ to: "/auth" });
    }

    const { data: role, error: roleError } = await (supabase as any)
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (roleError || !role) {
      throw redirect({ to: "/dashboard" });
    }

    return { user };
  },
  head: () => ({
    meta: [
      { title: "ویرایشگر GDC | هاب‌ژن" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResourceToursAdmin,
});

function loadGuideConfig(items: EditableResourceContent[]) {
  return upgradeGdcQuestionGuideConfig(getGdcQuestionGuideConfig(items));
}

function ResourceToursAdmin() {
  const [imageUrl, setImageUrl] = useState(DEFAULT_GDC_IMAGE_URL);
  const [hotspots, setHotspots] = useState<EditableResourceHotspot[]>(
    DEFAULT_GDC_HOTSPOTS.map((item) => ({ ...item })),
  );
  const [content, setContent] = useState<EditableResourceContent[]>(
    DEFAULT_GDC_CONTENT.map((item) => ({ ...item })),
  );
  const [guideConfig, setGuideConfig] = useState<GdcQuestionGuideConfig>(() =>
    loadGuideConfig([]),
  );
  const [projectSummaryConfig, setProjectSummaryConfig] = useState<GdcProjectSummaryConfig>(() =>
    getGdcProjectSummaryConfig([]),
  );
  const [cohortBuilderIntroConfig, setCohortBuilderIntroConfig] = useState<GdcCohortBuilderIntroConfig>(() =>
    getGdcCohortBuilderIntroConfig([]),
  );
  const [cohortBuilderFiltersConfig, setCohortBuilderFiltersConfig] = useState<GdcCohortBuilderFiltersConfig>(() =>
    getGdcCohortBuilderFiltersConfig([]),
  );
  const [loading, setLoading] = useState(true);
  const [warning, setWarning] = useState<string | null>(null);

  function syncManagedConfigs(saved: EditableResourceContent[]) {
    setGuideConfig(loadGuideConfig(saved));
    setProjectSummaryConfig(getGdcProjectSummaryConfig(saved));
    setCohortBuilderIntroConfig(getGdcCohortBuilderIntroConfig(saved));
    setCohortBuilderFiltersConfig(getGdcCohortBuilderFiltersConfig(saved));
  }

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const data = await loadResourceTourAdmin(RESOURCE_SLUG);
        if (!active) return;

        setImageUrl(data.imageUrl);
        setHotspots(data.hotspots);
        setContent(data.content);
        syncManagedConfigs(data.content);
        setWarning(
          data.persisted
            ? null
            : data.warning ||
                "داده‌های Resource Tour هنوز در Supabase آماده نیستند؛ مقادیر پیش‌فرض نمایش داده می‌شوند.",
        );
      } catch (error) {
        console.error(error);
        if (!active) return;
        setWarning("بارگذاری تنظیمات Supabase انجام نشد؛ Editor با مقادیر پیش‌فرض باز شد.");
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  async function handleImageSave(nextImageUrl: string) {
    try {
      const saved = await saveResourceImage(
        RESOURCE_SLUG,
        RESOURCE_TITLE,
        nextImageUrl || DEFAULT_GDC_IMAGE_URL,
      );
      setImageUrl(saved);
      setWarning(null);
      toast.success("تصویر مرحله اول GDC ذخیره شد.");
    } catch (error) {
      console.error(error);
      toast.error("ذخیره تصویر GDC انجام نشد.");
      throw error;
    }
  }

  async function handleHotspotsSave(nextHotspots: EditableResourceHotspot[]) {
    try {
      const saved = await saveResourceHotspots(
        RESOURCE_SLUG,
        RESOURCE_TITLE,
        imageUrl,
        nextHotspots,
      );
      setHotspots(saved);
      setWarning(null);
      toast.success("نقطه تمرکز Projects در مرحله ۱ ذخیره شد.");
    } catch (error) {
      console.error(error);
      toast.error("ذخیره Hotspot مرحله ۱ انجام نشد.");
      throw error;
    }
  }

  async function handleContentSave(nextContent: EditableResourceContent[]) {
    try {
      const guideBlock = toGdcQuestionGuideContent(guideConfig);
      const projectSummaryBlock = toGdcProjectSummaryContent(projectSummaryConfig);
      const cohortBuilderIntroBlock = toGdcCohortBuilderIntroContent(cohortBuilderIntroConfig);
      const cohortBuilderFiltersBlock = toGdcCohortBuilderFiltersContent(cohortBuilderFiltersConfig);
      const managedKeys = [
        guideBlock.key,
        projectSummaryBlock.key,
        cohortBuilderIntroBlock.key,
        cohortBuilderFiltersBlock.key,
      ];
      const merged = [
        ...nextContent.filter((item) => !managedKeys.includes(item.key)),
        guideBlock,
        projectSummaryBlock,
        cohortBuilderIntroBlock,
        cohortBuilderFiltersBlock,
      ];
      const saved = await saveResourceContent(
        RESOURCE_SLUG,
        RESOURCE_TITLE,
        imageUrl,
        merged,
      );
      setContent(saved);
      syncManagedConfigs(saved);
      setWarning(null);
      toast.success("محتوای عمومی صفحه GDC ذخیره شد.");
    } catch (error) {
      console.error(error);
      toast.error("ذخیره محتوای GDC انجام نشد.");
      throw error;
    }
  }

  async function handleGuideSave(nextConfig: GdcQuestionGuideConfig) {
    try {
      const upgraded = upgradeGdcQuestionGuideConfig(nextConfig);
      const guideBlock = toGdcQuestionGuideContent(upgraded);
      const merged = [
        ...content.filter((item) => item.key !== guideBlock.key),
        guideBlock,
      ];
      const saved = await saveResourceContent(
        RESOURCE_SLUG,
        RESOURCE_TITLE,
        imageUrl,
        merged,
      );
      setContent(saved);
      syncManagedConfigs(saved);
      setWarning(null);
      toast.success("آموزش سؤال‌محور GDC ذخیره شد.");
    } catch (error) {
      console.error(error);
      toast.error("ذخیره آموزش سؤال‌محور انجام نشد.");
      throw error;
    }
  }

  async function handleProjectSummarySave(nextConfig: GdcProjectSummaryConfig) {
    try {
      const summaryBlock = toGdcProjectSummaryContent(nextConfig);
      const merged = [
        ...content.filter((item) => item.key !== summaryBlock.key),
        summaryBlock,
      ];
      const saved = await saveResourceContent(
        RESOURCE_SLUG,
        RESOURCE_TITLE,
        imageUrl,
        merged,
      );
      setContent(saved);
      syncManagedConfigs(saved);
      setWarning(null);
      toast.success("مرحله ۵ و Project Summary ذخیره شد.");
    } catch (error) {
      console.error(error);
      toast.error("ذخیره مرحله ۵ انجام نشد.");
      throw error;
    }
  }

  async function handleCohortBuilderIntroSave(nextConfig: GdcCohortBuilderIntroConfig) {
    try {
      const cohortBlock = toGdcCohortBuilderIntroContent(nextConfig);
      const merged = [
        ...content.filter((item) => item.key !== cohortBlock.key),
        cohortBlock,
      ];
      const saved = await saveResourceContent(
        RESOURCE_SLUG,
        RESOURCE_TITLE,
        imageUrl,
        merged,
      );
      setContent(saved);
      syncManagedConfigs(saved);
      setWarning(null);
      toast.success("سؤال ۲ · مرحله ۱ ذخیره شد.");
    } catch (error) {
      console.error(error);
      toast.error("ذخیره سؤال ۲ · مرحله ۱ انجام نشد.");
      throw error;
    }
  }

  async function handleCohortBuilderFiltersSave(nextConfig: GdcCohortBuilderFiltersConfig) {
    try {
      const filtersBlock = toGdcCohortBuilderFiltersContent(nextConfig);
      const merged = [
        ...content.filter((item) => item.key !== filtersBlock.key),
        filtersBlock,
      ];
      const saved = await saveResourceContent(
        RESOURCE_SLUG,
        RESOURCE_TITLE,
        imageUrl,
        merged,
      );
      setContent(saved);
      syncManagedConfigs(saved);
      setWarning(null);
      toast.success("سؤال ۲ · مرحله ۲ ذخیره شد.");
    } catch (error) {
      console.error(error);
      toast.error("ذخیره سؤال ۲ · مرحله ۲ انجام نشد.");
      throw error;
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center gap-2 bg-slate-50" dir="rtl">
        <Loader2 className="h-5 w-5 animate-spin text-teal-700" />
        <span className="text-sm font-semibold text-slate-600">در حال بارگذاری GDC Editor…</span>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-8 sm:px-8" dir="rtl">
      <div className="mx-auto max-w-[1500px]">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <a href="/admin" className="text-sm font-bold text-slate-500 hover:text-teal-700">بازگشت به پنل مدیریت</a>
            <h1 className="mt-3 text-3xl font-black text-slate-950">GDC Learning Editor</h1>
            <p className="mt-2 max-w-4xl text-sm leading-7 text-slate-600">آموزش فعلی GDC را بدون تغییر کد مدیریت کنید: سؤال‌ها، روایت مراحل، فیلترها، پنل‌های توضیحی، تصاویر و جایگاه/ابعاد Hotspotها.</p>
          </div>
          <a href="/resources/gdc" target="_blank" rel="noreferrer" className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-bold text-white hover:bg-teal-800">پیش‌نمایش صفحه GDC</a>
        </div>

        {warning ? <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">{warning}</div> : null}

        <div className="mt-6 space-y-6">
          <GdcDiscoverProjectsStageAdminEditor
            config={guideConfig}
            imageUrl={imageUrl}
            hotspots={hotspots}
            onChange={setGuideConfig}
            onGuideSave={handleGuideSave}
            onImageSave={handleImageSave}
            onHotspotsSave={handleHotspotsSave}
          />

          <GdcQuestionGuideAdminEditor config={guideConfig} onSave={handleGuideSave} />

          <GdcStudyDesignAdminEditor config={guideConfig} onChange={setGuideConfig} onSave={handleGuideSave} />

          <GdcStudyDesignArrowAdminEditor config={guideConfig} onChange={setGuideConfig} onSave={handleGuideSave} />

          <GdcProjectDecisionAdminEditor config={guideConfig} onChange={setGuideConfig} onSave={handleGuideSave} />

          <GdcProjectSummaryAdminEditor config={projectSummaryConfig} onChange={setProjectSummaryConfig} onSave={handleProjectSummarySave} />

          <GdcProjectSummaryArrowAdminEditor config={projectSummaryConfig} onChange={setProjectSummaryConfig} onSave={handleProjectSummarySave} />

          <GdcCohortBuilderIntroAdminEditor config={cohortBuilderIntroConfig} onChange={setCohortBuilderIntroConfig} onSave={handleCohortBuilderIntroSave} />

          <GdcCohortBuilderFiltersAdminEditor config={cohortBuilderFiltersConfig} onChange={setCohortBuilderFiltersConfig} onSave={handleCohortBuilderFiltersSave} />

          <VisualContentEditor
            items={content.filter(
              (item) =>
                item.key !== GDC_QUESTION_GUIDE_CONTENT_KEY &&
                item.key !== GDC_PROJECT_SUMMARY_CONTENT_KEY &&
                item.key !== GDC_COHORT_BUILDER_INTRO_CONTENT_KEY &&
                item.key !== GDC_COHORT_BUILDER_FILTERS_CONTENT_KEY,
            )}
            onSave={handleContentSave}
          />
        </div>
      </div>
    </main>
  );
}
