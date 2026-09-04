import { createFileRoute, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { GdcProjectDecisionAdminEditor } from "@/features/data-resources/GdcProjectDecisionAdminEditor";
import { GdcQuestionGuideAdminEditor } from "@/features/data-resources/GdcQuestionGuideAdminEditor";
import { GdcStudyDesignAdminEditor } from "@/features/data-resources/GdcStudyDesignAdminEditor";
import { VisualAssetEditor } from "@/features/data-resources/VisualAssetEditor";
import { VisualContentEditor } from "@/features/data-resources/VisualContentEditor";
import {
  getGdcQuestionGuideConfig,
  toGdcQuestionGuideContent,
  type GdcQuestionGuideConfig,
} from "@/features/data-resources/gdc-question-guide-config";
import { upgradeGdcQuestionGuideConfig } from "@/features/data-resources/gdc-question-guide-upgrade";
import {
  loadResourceTourAdmin,
  saveResourceContent,
  saveResourceImage,
} from "@/features/data-resources/resource-tour-admin-service";
import {
  DEFAULT_GDC_CONTENT,
  DEFAULT_GDC_IMAGE_URL,
  type EditableResourceContent,
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
  const [content, setContent] = useState<EditableResourceContent[]>(
    DEFAULT_GDC_CONTENT.map((item) => ({ ...item })),
  );
  const [guideConfig, setGuideConfig] = useState<GdcQuestionGuideConfig>(() =>
    loadGuideConfig([]),
  );
  const [loading, setLoading] = useState(true);
  const [warning, setWarning] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const data = await loadResourceTourAdmin(RESOURCE_SLUG);
        if (!active) return;

        setImageUrl(data.imageUrl);
        setContent(data.content);
        setGuideConfig(loadGuideConfig(data.content));
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

  async function handleContentSave(nextContent: EditableResourceContent[]) {
    try {
      const guideBlock = toGdcQuestionGuideContent(guideConfig);
      const merged = [
        ...nextContent.filter((item) => item.key !== guideBlock.key),
        guideBlock,
      ];
      const saved = await saveResourceContent(
        RESOURCE_SLUG,
        RESOURCE_TITLE,
        imageUrl,
        merged,
      );
      setContent(saved);
      setGuideConfig(loadGuideConfig(saved));
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
      setGuideConfig(loadGuideConfig(saved));
      setWarning(null);
      toast.success("آموزش سؤال‌محور GDC ذخیره شد.");
    } catch (error) {
      console.error(error);
      toast.error("ذخیره آموزش سؤال‌محور انجام نشد.");
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
            <a href="/admin" className="text-sm font-bold text-slate-500 hover:text-teal-700">
              بازگشت به پنل مدیریت
            </a>
            <h1 className="mt-3 text-3xl font-black text-slate-950">GDC Learning Editor</h1>
            <p className="mt-2 max-w-4xl text-sm leading-7 text-slate-600">
              آموزش فعلی GDC را بدون تغییر کد مدیریت کنید: سؤال‌ها، روایت مراحل، فیلترها، پنل‌های توضیحی، تصاویر و جایگاه/ابعاد Hotspotها.
            </p>
          </div>
          <a
            href="/resources/gdc"
            target="_blank"
            rel="noreferrer"
            className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-bold text-white hover:bg-teal-800"
          >
            پیش‌نمایش صفحه GDC
          </a>
        </div>

        {warning ? (
          <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
            {warning}
          </div>
        ) : null}

        <div className="mt-6 space-y-6">
          <GdcQuestionGuideAdminEditor config={guideConfig} onSave={handleGuideSave} />

          <GdcStudyDesignAdminEditor
            config={guideConfig}
            onChange={setGuideConfig}
            onSave={handleGuideSave}
          />

          <GdcProjectDecisionAdminEditor
            config={guideConfig}
            onChange={setGuideConfig}
            onSave={handleGuideSave}
          />

          <section className="rounded-3xl border border-slate-200 bg-white p-6">
            <h2 className="text-xl font-black text-slate-950">تصویر اصلی مرحله ۱</h2>
            <p className="mt-2 text-sm text-slate-500">
              اسکرین‌شات صفحه اصلی GDC که در مرحله اول نمایش داده می‌شود.
            </p>
            <div className="mt-4">
              <VisualAssetEditor
                resourceSlug={RESOURCE_SLUG}
                imageUrl={imageUrl}
                onSave={handleImageSave}
              />
            </div>
          </section>

          <VisualContentEditor items={content.filter((item) => item.key !== "gdc_question_guide_v1")} onSave={handleContentSave} />
        </div>
      </div>
    </main>
  );
}
