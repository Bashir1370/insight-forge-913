import { useEffect, useMemo, useState } from "react";
import { Save } from "lucide-react";

import { GdcFacetPanelsAdminEditor } from "./GdcFacetPanelsAdminEditor";
import { HotspotCanvasEditor } from "./HotspotCanvasEditor";
import { VisualAssetEditor } from "./VisualAssetEditor";
import type { EditableResourceHotspot } from "./resource-tour-model";
import {
  type GdcFacetConfig,
  type GdcQuestionGuideConfig,
  type GdcGuideHotspot,
} from "./gdc-question-guide-config";

const PROJECT_PARTS = Array.from(
  { length: 7 },
  (_, i) => `/images/gdc/gdc-projects-b64/${String(i + 1).padStart(2, "0")}.txt`,
);

function useBundledProjectsImage() {
  const [src, setSrc] = useState("");
  useEffect(() => {
    let active = true;
    Promise.all(PROJECT_PARTS.map(async (path) => {
      const response = await fetch(path);
      if (!response.ok) throw new Error(path);
      return response.text();
    }))
      .then((parts) => {
        if (active) setSrc(`data:image/webp;base64,${parts.join("")}`);
      })
      .catch(() => {
        if (active) setSrc("");
      });
    return () => {
      active = false;
    };
  }, []);
  return src;
}

function Input({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block text-xs font-bold text-slate-600">
      {label}
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 outline-none focus:border-teal-500"
      />
    </label>
  );
}

function Textarea({ label, value, onChange, rows = 3 }: { label: string; value: string; onChange: (value: string) => void; rows?: number }) {
  return (
    <label className="block text-xs font-bold text-slate-600">
      {label}
      <textarea
        rows={rows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm leading-7 text-slate-950 outline-none focus:border-teal-500"
      />
    </label>
  );
}

function toEditorHotspots(items: GdcGuideHotspot[]): EditableResourceHotspot[] {
  return items.map((item, index) => ({
    key: item.key,
    step: index + 1,
    title: item.title,
    persianLabel: "",
    description: "",
    whyItMatters: "",
    researchExample: "",
    commonMistake: "",
    exerciseQuestion: "",
    exerciseAnswer: "",
    action: "",
    x: item.x,
    y: item.y,
    width: item.width,
    height: item.height,
  }));
}

function fromEditorHotspots(current: GdcGuideHotspot[], items: EditableResourceHotspot[]): GdcGuideHotspot[] {
  return current.map((hotspot) => {
    const edited = items.find((item) => item.key === hotspot.key);
    return edited
      ? {
          ...hotspot,
          x: edited.x,
          y: edited.y,
          width: edited.width,
          height: edited.height,
        }
      : hotspot;
  });
}

export function GdcQuestionGuideAdminEditor({
  config,
  onSave,
}: {
  config: GdcQuestionGuideConfig;
  onSave: (config: GdcQuestionGuideConfig) => void | Promise<void>;
}) {
  const [draft, setDraft] = useState(config);
  const [saving, setSaving] = useState(false);
  const bundledProjectsImage = useBundledProjectsImage();

  useEffect(() => setDraft(config), [config]);

  const projectsImage = draft.projects.imageUrl || bundledProjectsImage;
  const editorHotspots = useMemo(
    () => toEditorHotspots(draft.projects.hotspots),
    [draft.projects.hotspots],
  );

  function updateIntro<K extends keyof GdcQuestionGuideConfig["intro"]>(key: K, value: GdcQuestionGuideConfig["intro"][K]) {
    setDraft((current) => ({ ...current, intro: { ...current.intro, [key]: value } }));
  }

  function updateProjects<K extends keyof GdcQuestionGuideConfig["projects"]>(key: K, value: GdcQuestionGuideConfig["projects"][K]) {
    setDraft((current) => ({ ...current, projects: { ...current.projects, [key]: value } }));
  }

  function updateFacet(id: GdcFacetConfig["id"], patch: Partial<GdcFacetConfig>) {
    setDraft((current) => ({
      ...current,
      projects: {
        ...current.projects,
        facets: current.projects.facets.map((facet) => facet.id === id ? { ...facet, ...patch } : facet),
      },
    }));
  }

  async function saveAll(next = draft) {
    setSaving(true);
    try {
      await onSave(next);
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="rounded-3xl border border-teal-200 bg-white p-6 shadow-sm" dir="rtl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-xs font-black text-teal-700">ویرایشگر آموزش سؤال‌محور</div>
          <h2 className="mt-1 text-2xl font-black text-slate-950">GDC Question Guide</h2>
          <p className="mt-2 max-w-4xl text-sm leading-7 text-slate-600">
            متن مراحل، سؤال‌های مادر، محتوای فیلترها، پنل‌های توضیحی، تصاویر و جایگاه/ابعاد Hotspotهای صفحه Projects از همین بخش قابل ویرایش است.
          </p>
        </div>
        <button
          type="button"
          disabled={saving}
          onClick={() => saveAll()}
          className="inline-flex items-center gap-2 rounded-xl bg-teal-700 px-5 py-3 text-sm font-black text-white disabled:opacity-50"
        >
          <Save className="h-4 w-4" /> {saving ? "در حال ذخیره…" : "ذخیره همه تغییرات"}
        </button>
      </div>

      <div className="mt-6 space-y-5">
        <details className="rounded-2xl border border-slate-200 p-4" open>
          <summary className="cursor-pointer font-black text-slate-900">سؤال‌های مادر و عنوان مراحل</summary>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            {draft.questions.map((question, index) => (
              <div key={question.id} className="rounded-xl bg-slate-50 p-3">
                <Input
                  label={`سؤال مادر ${index + 1}`}
                  value={question.title}
                  onChange={(value) => setDraft((current) => ({
                    ...current,
                    questions: current.questions.map((item) => item.id === question.id ? { ...item, title: value } : item),
                  }))}
                />
                <div className="mt-2">
                  <Textarea
                    label="توضیح کوتاه کارت"
                    value={question.subtitle}
                    rows={2}
                    onChange={(value) => setDraft((current) => ({
                      ...current,
                      questions: current.questions.map((item) => item.id === question.id ? { ...item, subtitle: value } : item),
                    }))}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {draft.stageTitles.map((title, index) => (
              <Input
                key={index}
                label={`عنوان مرحله ${index + 1}`}
                value={title}
                onChange={(value) => setDraft((current) => ({
                  ...current,
                  stageTitles: current.stageTitles.map((item, itemIndex) => itemIndex === index ? value : item),
                }))}
              />
            ))}
          </div>
        </details>

        <details className="rounded-2xl border border-slate-200 p-4" open>
          <summary className="cursor-pointer font-black text-slate-900">مرحله ۱ — روایت ورود به Projects</summary>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <Input label="عنوان مرحله" value={draft.intro.title} onChange={(value) => updateIntro("title", value)} />
            <Input label="تیتر مسئله" value={draft.intro.issueLabel} onChange={(value) => updateIntro("issueLabel", value)} />
            <Textarea label="بیان مسئله" value={draft.intro.issueBody} onChange={(value) => updateIntro("issueBody", value)} />
            <Textarea label="پل ورود به Projects" value={draft.intro.entryBody} onChange={(value) => updateIntro("entryBody", value)} />
            <Input label="عنوان تعریف Project" value={draft.intro.projectTitle} onChange={(value) => updateIntro("projectTitle", value)} />
            <Textarea label="تعریف Project" value={draft.intro.projectBody} onChange={(value) => updateIntro("projectBody", value)} />
            <Textarea label="نکته درباره یک یا چند سرطان" value={draft.intro.projectCaveat} onChange={(value) => updateIntro("projectCaveat", value)} />
            <Input label="عنوان معماری GDC" value={draft.intro.architectureTitle} onChange={(value) => updateIntro("architectureTitle", value)} />
            <Textarea label="مقدمه اصطلاحات" value={draft.intro.architectureIntro} onChange={(value) => updateIntro("architectureIntro", value)} />
            <Textarea label="جمع‌بندی معماری" value={draft.intro.architectureSummary} onChange={(value) => updateIntro("architectureSummary", value)} />
            <Input label="عنوان مأموریت" value={draft.intro.missionTitle} onChange={(value) => updateIntro("missionTitle", value)} />
            <Textarea label="متن مأموریت" value={draft.intro.missionBody} onChange={(value) => updateIntro("missionBody", value)} />
            <Input label="متن دکمه بعدی" value={draft.intro.nextButton} onChange={(value) => updateIntro("nextButton", value)} />
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-4">
            {draft.intro.architectureCards.map((card, index) => (
              <div key={index} className="rounded-xl bg-slate-50 p-3">
                <Input
                  label="اصطلاح"
                  value={card.title}
                  onChange={(value) => updateIntro("architectureCards", draft.intro.architectureCards.map((item, itemIndex) => itemIndex === index ? { ...item, title: value } : item))}
                />
                <div className="mt-2">
                  <Input
                    label="توضیح کوتاه"
                    value={card.subtitle}
                    onChange={(value) => updateIntro("architectureCards", draft.intro.architectureCards.map((item, itemIndex) => itemIndex === index ? { ...item, subtitle: value } : item))}
                  />
                </div>
              </div>
            ))}
          </div>
        </details>

        <details className="rounded-2xl border border-slate-200 p-4" open>
          <summary className="cursor-pointer font-black text-slate-900">مرحله ۲ — نقشه صفحه Projects</summary>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <Input label="عنوان مرحله" value={draft.projects.title} onChange={(value) => updateProjects("title", value)} />
            <Input label="عنوان جهت‌یابی" value={draft.projects.orientationTitle} onChange={(value) => updateProjects("orientationTitle", value)} />
            <Textarea label="متن جهت‌یابی" value={draft.projects.orientationBody} onChange={(value) => updateProjects("orientationBody", value)} />
            <Textarea label="توضیح سمت چپ / Filters" value={draft.projects.filtersBody} onChange={(value) => updateProjects("filtersBody", value)} />
            <Textarea label="توضیح سمت راست / Table" value={draft.projects.tableBody} onChange={(value) => updateProjects("tableBody", value)} />
            <Input label="عنوان معرفی فیلترها" value={draft.projects.facetIntroTitle} onChange={(value) => updateProjects("facetIntroTitle", value)} />
            <Textarea label="متن معرفی فیلترها" value={draft.projects.facetIntroBody} onChange={(value) => updateProjects("facetIntroBody", value)} />
            <Input label="عنوان خواندن جدول" value={draft.projects.tableReadTitle} onChange={(value) => updateProjects("tableReadTitle", value)} />
            <Textarea label="متن خواندن جدول" value={draft.projects.tableReadBody} onChange={(value) => updateProjects("tableReadBody", value)} />
            <Input label="عنوان ادامه داستان" value={draft.projects.transitionTitle} onChange={(value) => updateProjects("transitionTitle", value)} />
            <Textarea label="متن ادامه داستان" value={draft.projects.transitionBody} onChange={(value) => updateProjects("transitionBody", value)} />
            <Input label="برچسب روی Filters" value={draft.projects.filtersOverlayLabel} onChange={(value) => updateProjects("filtersOverlayLabel", value)} />
            <Input label="برچسب روی جدول" value={draft.projects.tableOverlayLabel} onChange={(value) => updateProjects("tableOverlayLabel", value)} />
          </div>

          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="font-black text-slate-900">تصویر صفحه Projects</h3>
            <p className="mt-1 text-xs leading-6 text-slate-500">اگر تصویر جدید آپلود نکنید، همان اسکرین‌شات فعلی سایت استفاده می‌شود.</p>
            <div className="mt-3">
              <VisualAssetEditor
                resourceSlug="gdc-projects"
                imageUrl={draft.projects.imageUrl}
                onSave={async (url) => {
                  const next = { ...draft, projects: { ...draft.projects, imageUrl: url } };
                  setDraft(next);
                  await saveAll(next);
                }}
              />
            </div>
          </div>

          <div className="mt-5">
            <HotspotCanvasEditor
              imageUrl={projectsImage}
              hotspots={editorHotspots}
              onSave={async (items) => {
                const next = {
                  ...draft,
                  projects: {
                    ...draft.projects,
                    hotspots: fromEditorHotspots(draft.projects.hotspots, items),
                  },
                };
                setDraft(next);
                await saveAll(next);
              }}
            />
          </div>
        </details>

        <GdcFacetPanelsAdminEditor
          config={draft}
          onChange={setDraft}
          onSave={saveAll}
        />
      </div>
    </section>
  );
}
