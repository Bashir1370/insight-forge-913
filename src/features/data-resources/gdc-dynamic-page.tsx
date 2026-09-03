import { useEffect, useMemo, useState } from "react";

import { supabase } from "@/integrations/supabase/client";
import { GdcQuestionDrivenGuideV6 } from "./GdcQuestionDrivenGuideV6";
import { getGdcQuestionGuideConfig } from "./gdc-question-guide-config";
import {
  prepareGdcQuestionGuideForDisplay,
  upgradeGdcQuestionGuideConfig,
} from "./gdc-question-guide-upgrade";
import { loadResourceTour } from "./resource-tour-loader";

type ResourceTourData = Awaited<ReturnType<typeof loadResourceTour>>;

export function GdcDynamicPage() {
  const [resource, setResource] = useState<ResourceTourData>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let active = true;

    loadResourceTour("gdc").then((data) => {
      if (active) setResource(data);
    });

    async function checkAdmin() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user || !active) return;

      const { data: role } = await (supabase as any)
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (active) setIsAdmin(Boolean(role));
    }

    checkAdmin();

    return () => {
      active = false;
    };
  }, []);

  const content = useMemo(() => {
    const blocks = (resource?.content ?? []) as Array<{
      key?: string;
      value?: string;
    }>;

    const upgradedGuide = upgradeGdcQuestionGuideConfig(
      getGdcQuestionGuideConfig(blocks),
    );
    const guideConfig = prepareGdcQuestionGuideForDisplay(upgradedGuide);

    const program = guideConfig.projects.facets.find(
      (item) => item.id === "program",
    );

    const hasLegacyProgramCopy =
      program?.lensTitle === "Program یعنی چه؟" ||
      program?.sections[0]?.title === "این فهرست نام سرطان‌ها نیست" ||
      program?.sections[1]?.title === "عدد و درصد کنار Program چیست؟";

    if (program && hasLegacyProgramCopy) {
      program.lensTitle = "Program را چطور بخوانیم؟";
      program.lensSubtitle =
        "چتر پژوهشی بزرگ‌تر در GDC؛ چند Project می‌توانند زیر یک Program سازمان‌دهی شوند";
      program.sections = [
        {
          title: "Program در عمل چه چیزی را نشان می‌دهد؟",
          body: "در این فهرست، نام‌هایی مثل TCGA، MATCH، TARGET و CGCI نام Programهای پژوهشی هستند، نه نام سرطان‌ها. Program را می‌توان یک چتر پژوهشی بزرگ‌تر در GDC در نظر گرفت که چند Project را زیر خود سازمان‌دهی می‌کند. با انتخاب یک Program، فهرست Projectها به پروژه‌های متعلق به همان برنامه محدود می‌شود.",
          tone: "neutral",
        },
        {
          title: "عدد و درصد کنار هر Program را چطور بخوانیم؟",
          body: "مثلاً TCGA — 33 (35.48%) یعنی در وضعیت فعلی 33 Project به Programِ TCGA مربوط‌اند و این تعداد 35.48٪ از کل Projectهای فعلی را تشکیل می‌دهد. با تغییر فیلترهای صفحه، این اعداد هم می‌توانند تغییر کنند.",
          tone: "teal",
        },
        {
          title: "Program و Project چه رابطه‌ای با هم دارند؟",
          body: "Program سطح بزرگ‌تر سازمان‌دهی پژوهش است و Project یک واحد مطالعاتی مشخص‌تر درون آن. یک Program می‌تواند چند Project داشته باشد و هر Project، بسته به طراحی مطالعه، می‌تواند روی یک سرطان یا چند سرطان تمرکز داشته باشد. پس Program، Project و نوع سرطان سه مفهوم یکسان نیستند.",
          tone: "amber",
        },
        {
          title: "فهرست به همین چند Program محدود نیست",
          body: "مواردی که در تصویر می‌بینید فقط بخشی از فهرست هستند. با باز کردن +21 more می‌توانید Programهای بیشتری را ببینید.",
          tone: "sky",
        },
      ];
    }

    return {
      title: blocks.find((item) => item.key === "title")?.value,
      description: blocks.find((item) => item.key === "description")?.value,
      guideConfig,
    };
  }, [resource]);

  return (
    <div className="relative">
      {isAdmin ? (
        <a
          href="/admin/resource-tours"
          className="fixed right-6 top-6 z-50 rounded-xl bg-slate-950 px-4 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-teal-700"
        >
          ویرایش GDC
        </a>
      ) : null}

      <GdcQuestionDrivenGuideV6
        imageUrl={resource?.image_url}
        managedHotspots={(resource?.hotspots ?? []) as any[]}
        pageTitle={content.title}
        pageDescription={content.description}
        guideConfig={content.guideConfig}
      />
    </div>
  );
}
