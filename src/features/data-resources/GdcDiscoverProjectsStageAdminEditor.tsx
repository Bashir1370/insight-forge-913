import { Crosshair, ImageIcon, Save } from "lucide-react";

import { HotspotCanvasEditor } from "./HotspotCanvasEditor";
import { VisualAssetEditor } from "./VisualAssetEditor";
import type { GdcQuestionGuideConfig } from "./gdc-question-guide-config";
import type { EditableResourceHotspot } from "./resource-tour-model";

function Input({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
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

function Textarea({
  label,
  value,
  onChange,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}) {
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

export function GdcDiscoverProjectsStageAdminEditor({
  config,
  imageUrl,
  hotspots,
  onChange,
  onGuideSave,
  onImageSave,
  onHotspotsSave,
}: {
  config: GdcQuestionGuideConfig;
  imageUrl: string;
  hotspots: EditableResourceHotspot[];
  onChange: (config: GdcQuestionGuideConfig) => void;
  onGuideSave: (config: GdcQuestionGuideConfig) => void | Promise<void>;
  onImageSave: (imageUrl: string) => void | Promise<void>;
  onHotspotsSave: (hotspots: EditableResourceHotspot[]) => void | Promise<void>;
}) {
  const projectHotspot = hotspots.find((item) => item.key === "projects");
  const intro = config.intro;

  function updateIntro<K extends keyof GdcQuestionGuideConfig["intro"]>(
    key: K,
    value: GdcQuestionGuideConfig["intro"][K],
  ) {
    onChange({
      ...config,
      intro: {
        ...config.intro,
        [key]: value,
      },
    });
  }

  return (
    <section className="rounded-3xl border border-cyan-200 bg-white p-6 shadow-sm" dir="rtl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-xs font-black text-cyan-700">سؤال ۱ · مرحله ۱ · پیدا کردن محدوده داده‌ها</div>
          <h2 className="mt-1 text-2xl font-black text-slate-950">Discover Projects Stage Editor</h2>
          <p className="mt-2 max-w-4xl text-sm leading-7 text-slate-600">
            تمام اجزای مرحله اول در یک محل مدیریت می‌شوند: متن Inspector، اسکرین‌شات واقعی GDC و محدوده قابل کلیک Projects.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onGuideSave(config)}
          className="inline-flex items-center gap-2 rounded-xl bg-teal-700 px-5 py-3 text-sm font-black text-white hover:bg-teal-800"
        >
          <Save className="h-4 w-4" /> ذخیره متن مرحله ۱
        </button>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
        <h3 className="font-black text-slate-900">محتوای Inspector</h3>
        <p className="mt-1 text-xs leading-6 text-slate-500">
          این متن‌ها همان سه بخش «چرا Projects؟»، «Project چیست؟» و «نقشه GDC» در سمت راست مرحله ۱ هستند.
        </p>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <Input
            label="عنوان اصلی مرحله"
            value={intro.title}
            onChange={(value) => updateIntro("title", value)}
          />
          <Input
            label="تیتر بخش چرا Projects؟"
            value={intro.issueLabel}
            onChange={(value) => updateIntro("issueLabel", value)}
          />
          <Textarea
            label="متن مسئله"
            value={intro.issueBody}
            onChange={(value) => updateIntro("issueBody", value)}
          />
          <Textarea
            label="پل ورود به Projects"
            value={intro.entryBody}
            onChange={(value) => updateIntro("entryBody", value)}
          />
          <Input
            label="تیتر بخش Project چیست؟"
            value={intro.projectTitle}
            onChange={(value) => updateIntro("projectTitle", value)}
          />
          <Textarea
            label="تعریف Project"
            value={intro.projectBody}
            onChange={(value) => updateIntro("projectBody", value)}
          />
          <Textarea
            label="نکته تکمیلی Project"
            value={intro.projectCaveat}
            onChange={(value) => updateIntro("projectCaveat", value)}
          />
          <Input
            label="عنوان نقشه GDC"
            value={intro.architectureTitle}
            onChange={(value) => updateIntro("architectureTitle", value)}
          />
          <Textarea
            label="مقدمه نقشه GDC"
            value={intro.architectureIntro}
            onChange={(value) => updateIntro("architectureIntro", value)}
          />
          <Textarea
            label="جمع‌بندی نقشه GDC"
            value={intro.architectureSummary}
            onChange={(value) => updateIntro("architectureSummary", value)}
          />
          <Input
            label="متن دکمه ورود به مرحله بعد"
            value={intro.nextButton}
            onChange={(value) => updateIntro("nextButton", value)}
          />
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-4">
          {intro.architectureCards.map((card, index) => (
            <div key={index} className="rounded-xl border border-slate-200 bg-white p-3">
              <Input
                label="اصطلاح"
                value={card.title}
                onChange={(value) =>
                  updateIntro(
                    "architectureCards",
                    intro.architectureCards.map((item, itemIndex) =>
                      itemIndex === index ? { ...item, title: value } : item,
                    ),
                  )
                }
              />
              <div className="mt-2">
                <Input
                  label="توضیح کوتاه"
                  value={card.subtitle}
                  onChange={(value) =>
                    updateIntro(
                      "architectureCards",
                      intro.architectureCards.map((item, itemIndex) =>
                        itemIndex === index ? { ...item, subtitle: value } : item,
                      ),
                    )
                  }
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5">
        <VisualAssetEditor
          resourceSlug="gdc-discover-projects-stage"
          imageUrl={imageUrl}
          title="اسکرین‌شات اصلی مرحله ۱"
          description="برای بهترین نتیجه، اسکرین‌شات اصلی GDC را با رزولوشن واقعی و بدون فشرده‌سازی اضافه بارگذاری کنید."
          allowRemove={false}
          onSave={onImageSave}
        />
      </div>

      <div className="mt-5 rounded-2xl border border-slate-200 p-4">
        <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-bold text-slate-500">
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1.5">
            <ImageIcon className="h-3.5 w-3.5" /> تصویر مرحله ۱
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-3 py-1.5 text-teal-700">
            <Crosshair className="h-3.5 w-3.5" /> Projects Hotspot
          </span>
        </div>

        {projectHotspot ? (
          <HotspotCanvasEditor
            imageUrl={imageUrl}
            hotspots={[projectHotspot]}
            onSave={async (editedItems) => {
              const edited = editedItems[0];
              if (!edited) return;
              const merged = hotspots.map((item) =>
                item.key === "projects" ? { ...item, ...edited } : item,
              );
              await onHotspotsSave(merged);
            }}
          />
        ) : (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-7 text-amber-900">
            Hotspot مربوط به Projects پیدا نشد. ابتدا تنظیمات Resource Tour را دوباره بارگذاری کنید.
          </div>
        )}
      </div>
    </section>
  );
}
