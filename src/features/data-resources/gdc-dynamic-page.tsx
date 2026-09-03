import { useEffect, useMemo, useState } from "react";

import { supabase } from "@/integrations/supabase/client";
import { GdcHomeTour } from "./gdc-home";
import { GdcQuestionDrivenGuide } from "./GdcQuestionDrivenGuide";
import { loadResourceTour } from "./resource-tour-loader";

type ResourceTourData = Awaited<ReturnType<typeof loadResourceTour>>;

type LearningMode = "question" | "legacy";

export function GdcDynamicPage() {
  const [resource, setResource] = useState<ResourceTourData>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [mode, setMode] = useState<LearningMode>("question");

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

    return {
      title: blocks.find((item) => item.key === "title")?.value,
      description: blocks.find((item) => item.key === "description")?.value,
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

      {mode === "question" ? (
        <GdcQuestionDrivenGuide
          imageUrl={resource?.image_url}
          managedHotspots={(resource?.hotspots ?? []) as any[]}
          pageTitle={content.title}
          pageDescription={content.description}
          onOpenLegacyTour={() => setMode("legacy")}
        />
      ) : (
        <>
          <button
            type="button"
            onClick={() => setMode("question")}
            className="fixed bottom-6 left-6 z-50 rounded-xl bg-teal-700 px-4 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-teal-800"
          >
            بازگشت به آموزش سؤال‌محور
          </button>
          <GdcHomeTour
            imageUrl={resource?.image_url}
            managedHotspots={(resource?.hotspots ?? []) as any[]}
            pageTitle={content.title}
            pageDescription={content.description}
          />
        </>
      )}
    </div>
  );
}
