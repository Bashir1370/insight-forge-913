import { Crosshair, Save } from "lucide-react";

import { HotspotCanvasEditor } from "./HotspotCanvasEditor";
import { VisualAssetEditor } from "./VisualAssetEditor";
import type { GdcHotspotArrowSettings } from "./GdcHotspotArrow";
import type {
  GdcCohortBuilderIntroConfig,
  GdcCohortBuilderIntroHotspot,
} from "./gdc-cohort-builder-intro-config";
import { useGdcCohortBuilderIntroImage } from "./gdc-cohort-builder-intro-image";
import type { EditableResourceHotspot } from "./resource-tour-model";

type ArrowEditableHotspot = EditableResourceHotspot & GdcHotspotArrowSettings;

function Input({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <label className="block text-xs font-bold text-slate-600">{label}<input value={value} onChange={(event) => onChange(event.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 outline-none focus:border-teal-500" /></label>;
}

function Textarea({ label, value, onChange, rows = 3 }: { label: string; value: string; onChange: (value: string) => void; rows?: number }) {
  return <label className="block text-xs font-bold text-slate-600">{label}<textarea rows={rows} value={value} onChange={(event) => onChange(event.target.value)} className="mt-1 w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm leading-7 text-slate-950 outline-none focus:border-teal-500" /></label>;
}

function toEditable(item: GdcCohortBuilderIntroHotspot, index: number): ArrowEditableHotspot {
  return {
    key: item.key,
    step: index + 1,
    title: item.label,
    persianLabel: item.label,
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
    arrowDirection: item.arrowDirection,
    arrowSize: item.arrowSize,
    arrowOffsetX: item.arrowOffsetX,
    arrowOffsetY: item.arrowOffsetY,
  };
}

export function GdcCohortBuilderIntroAdminEditor({ config, onChange, onSave }: { config: GdcCohortBuilderIntroConfig; onChange: (config: GdcCohortBuilderIntroConfig) => void; onSave: (config: GdcCohortBuilderIntroConfig) => void | Promise<void> }) {
  const previewImage = useGdcCohortBuilderIntroImage(config.imageUrl);
  function update<K extends keyof GdcCohortBuilderIntroConfig>(key: K, value: GdcCohortBuilderIntroConfig[K]) { onChange({ ...config, [key]: value }); }

  return (
    <section className="rounded-3xl border border-emerald-200 bg-white p-6 shadow-sm" dir="rtl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-xs font-black text-emerald-700">سؤال ۲ · مرحله ۱ · ورود به Cohort Builder</div>
          <h2 className="mt-1 text-2xl font-black text-slate-950">Cohort Builder Intro Stage Editor</h2>
          <p className="mt-2 max-w-4xl text-sm leading-7 text-slate-600">متن‌های سه اسلاید، اسکرین‌شات، Hotspotها و تنظیمات مستقل فلش قرمز از همین بخش مدیریت می‌شوند.</p>
        </div>
        <button type="button" onClick={() => onSave(config)} className="inline-flex items-center gap-2 rounded-xl bg-teal-700 px-5 py-3 text-sm font-black text-white hover:bg-teal-800"><Save className="h-4 w-4" /> ذخیره سؤال ۲ · مرحله ۱</button>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
        <h3 className="font-black text-slate-900">محتوای اسلایدهای سمت راست</h3>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <Input label="عنوان اصلی مرحله" value={config.title} onChange={(value) => update("title", value)} />
          <Input label="تیتر اسلاید ۱" value={config.issueLabel} onChange={(value) => update("issueLabel", value)} />
          <Textarea label="متن اسلاید ۱" value={config.issueBody} onChange={(value) => update("issueBody", value)} />
          <Textarea label="پل ورود به Cohort Builder" value={config.entryBody} onChange={(value) => update("entryBody", value)} />
          <Input label="تیتر اسلاید ۲" value={config.cohortTitle} onChange={(value) => update("cohortTitle", value)} />
          <Textarea label="تعریف Cohort Builder" value={config.cohortBody} onChange={(value) => update("cohortBody", value)} />
          <Textarea label="نکته تفاوت Cohort و Project" value={config.cohortCaveat} onChange={(value) => update("cohortCaveat", value)} />
          <Input label="تیتر اسلاید ۳" value={config.entryTitle} onChange={(value) => update("entryTitle", value)} />
          <Textarea label="مقدمه مسیرهای ورود" value={config.entryIntro} onChange={(value) => update("entryIntro", value)} />
          <Input label="عنوان ورودی نوار بالا" value={config.topNavTitle} onChange={(value) => update("topNavTitle", value)} />
          <Textarea label="توضیح ورودی نوار بالا" value={config.topNavBody} onChange={(value) => update("topNavBody", value)} />
          <Input label="عنوان کارت Core Tools" value={config.coreToolTitle} onChange={(value) => update("coreToolTitle", value)} />
          <Textarea label="توضیح کارت Core Tools" value={config.coreToolBody} onChange={(value) => update("coreToolBody", value)} />
          <Input label="متن دکمه مرحله بعد" value={config.nextButton} onChange={(value) => update("nextButton", value)} />
        </div>
      </div>

      <div className="mt-5">
        <VisualAssetEditor resourceSlug="gdc-question-2-cohort-builder-intro" imageUrl={config.imageUrl || previewImage} title="اسکرین‌شات سؤال ۲ · مرحله ۱" description="تصویر پیش‌فرض همین اسکرین‌شات آموزشی است. هر زمان خواستید می‌توانید نسخه جدید را آپلود کنید." allowRemove={false} onSave={async (imageUrl) => { const next = { ...config, imageUrl }; onChange(next); await onSave(next); }} />
      </div>

      <div className="mt-5 rounded-2xl border border-slate-200 p-4">
        <div className="mb-3 flex items-center gap-2 text-xs font-bold text-slate-500"><Crosshair className="h-4 w-4 text-teal-700" />جایگاه Hotspot و خود فلش را Drag کنید؛ جهت و اندازه فلش هم پایین تصویر قابل تنظیم است.</div>
        {previewImage ? (
          <HotspotCanvasEditor
            imageUrl={previewImage}
            hotspots={config.hotspots.map(toEditable)}
            onSave={async (items) => {
              const nextHotspots: GdcCohortBuilderIntroHotspot[] = items.map((raw, index) => {
                const item = raw as ArrowEditableHotspot;
                return {
                  key: config.hotspots[index]?.key ?? item.key,
                  label: config.hotspots[index]?.label ?? item.title,
                  x: item.x,
                  y: item.y,
                  width: item.width,
                  height: item.height,
                  arrowDirection: item.arrowDirection ?? "left",
                  arrowSize: item.arrowSize ?? 64,
                  arrowOffsetX: item.arrowOffsetX ?? 0,
                  arrowOffsetY: item.arrowOffsetY ?? 0,
                };
              });
              const next = { ...config, hotspots: nextHotspots };
              onChange(next);
              await onSave(next);
            }}
          />
        ) : <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">تصویر مرحله هنوز بارگذاری نشده است.</div>}
      </div>
    </section>
  );
}
