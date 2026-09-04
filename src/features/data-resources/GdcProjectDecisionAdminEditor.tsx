import { Plus, Save, Trash2 } from "lucide-react";
import { useState } from "react";

import type { GdcQuestionGuideConfig } from "./gdc-question-guide-config";
import {
  getGdcProjectDecisionConfig,
  type GdcProjectDecisionAbbreviation,
  type GdcProjectDecisionConfig,
  type GdcProjectDecisionProject,
  withGdcProjectDecisionConfig,
} from "./gdc-project-decision-config";

function Input({
  label,
  value,
  onChange,
  dir,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  dir?: "rtl" | "ltr";
}) {
  return (
    <label className="block text-xs font-bold text-slate-600">
      {label}
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        dir={dir}
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
  dir,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  dir?: "rtl" | "ltr";
}) {
  return (
    <label className="block text-xs font-bold text-slate-600">
      {label}
      <textarea
        rows={rows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        dir={dir}
        className="mt-1 w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm leading-7 text-slate-950 outline-none focus:border-teal-500"
      />
    </label>
  );
}

export function GdcProjectDecisionAdminEditor({
  config,
  onChange,
  onSave,
}: {
  config: GdcQuestionGuideConfig;
  onChange: (config: GdcQuestionGuideConfig) => void;
  onSave: (config: GdcQuestionGuideConfig) => void | Promise<void>;
}) {
  const decision = getGdcProjectDecisionConfig(config);
  const [saving, setSaving] = useState(false);

  function apply(nextDecision: GdcProjectDecisionConfig) {
    const next = withGdcProjectDecisionConfig(config, nextDecision);
    onChange(next);
    return next;
  }

  function patch(patchValue: Partial<GdcProjectDecisionConfig>) {
    return apply({ ...decision, ...patchValue });
  }

  function patchProject(index: number, patchValue: Partial<GdcProjectDecisionProject>) {
    return patch({
      projects: decision.projects.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patchValue } : item,
      ),
    });
  }

  function patchAbbreviation(index: number, patchValue: Partial<GdcProjectDecisionAbbreviation>) {
    return patch({
      abbreviations: decision.abbreviations.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patchValue } : item,
      ),
    });
  }

  async function persist(next = config) {
    setSaving(true);
    try {
      await onSave(next);
    } finally {
      setSaving(false);
    }
  }

  return (
    <details className="rounded-2xl border border-sky-200 bg-sky-50/20 p-4" open>
      <summary className="cursor-pointer font-black text-sky-950">
        مرحله ۴ — ارزیابی پروژه یا پروژه‌های نهایی (ویرایش کامل بدون کدنویسی)
      </summary>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-3 rounded-2xl border border-sky-100 bg-white p-4">
        <div>
          <h3 className="font-black text-slate-950">کنترل محتوای کامل مرحله ۴</h3>
          <p className="mt-1 max-w-4xl text-xs leading-6 text-slate-500">
            عنوان مرحله، متن مقدمه، مقایسه سه پروژه، توضیح Disease Type، کارت‌های پروژه‌ها، اختصارات GDC، جمع‌بندی و متن دکمه‌ها از همین بخش قابل تغییر است.
          </p>
        </div>
        <button
          type="button"
          disabled={saving}
          onClick={() => persist()}
          className="inline-flex items-center gap-2 rounded-xl bg-sky-700 px-4 py-2.5 text-xs font-black text-white disabled:opacity-50"
        >
          <Save className="h-4 w-4" /> {saving ? "در حال ذخیره…" : "ذخیره مرحله ۴"}
        </button>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Input label="عنوان مرحله" value={decision.title} onChange={(value) => patch({ title: value })} />
        <Input label="برچسب نهایی نوار کاهش پروژه‌ها" value={decision.progressFinalLabel} onChange={(value) => patch({ progressFinalLabel: value })} />
        <Textarea label="متن مقدمه مرحله" value={decision.introBody} rows={4} onChange={(value) => patch({ introBody: value })} />
        <Textarea label="جمع‌بندی تفاوت سطح Primary Site / Disease Type / Project" value={decision.hierarchySummary} rows={4} onChange={(value) => patch({ hierarchySummary: value })} />
      </div>

      <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
        <h4 className="font-black text-slate-900">نوار کاهش تعداد پروژه‌ها</h4>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {decision.progressSteps.map((item, index) => (
            <Input
              key={index}
              label={`مقدار مرحله ${index + 1}`}
              value={item}
              dir="ltr"
              onChange={(value) => patch({
                progressSteps: decision.progressSteps.map((step, stepIndex) => stepIndex === index ? value : step),
              })}
            />
          ))}
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-violet-100 bg-violet-50/30 p-4">
        <h4 className="font-black text-violet-950">باکس مقایسه سه پروژه</h4>
        <div className="mt-3 grid gap-4 lg:grid-cols-2">
          <Input label="عنوان باکس" value={decision.comparisonTitle} onChange={(value) => patch({ comparisonTitle: value })} />
          <Input label="Disease Type مشترک" value={decision.sharedDiseaseType} dir="ltr" onChange={(value) => patch({ sharedDiseaseType: value })} />
          <div className="lg:col-span-2">
            <Textarea label="توضیح اصلی باکس" value={decision.comparisonBody} rows={5} onChange={(value) => patch({ comparisonBody: value })} />
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {decision.projects.map((project, index) => (
            <div key={`${project.id}-${index}`} className="rounded-2xl border border-violet-100 bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <b className="text-sm text-violet-950">پروژه {index + 1}</b>
                <button
                  type="button"
                  onClick={() => patch({ projects: decision.projects.filter((_, itemIndex) => itemIndex !== index) })}
                  className="inline-flex items-center gap-1 rounded-lg border border-rose-200 px-2 py-1.5 text-xs font-bold text-rose-600"
                >
                  <Trash2 className="h-3.5 w-3.5" /> حذف
                </button>
              </div>
              <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                <Input label="شناسه پروژه" value={project.id} dir="ltr" onChange={(value) => patchProject(index, { id: value })} />
                <Input label="کد کوتاه" value={project.code} dir="ltr" onChange={(value) => patchProject(index, { code: value })} />
                <Input label="نام انگلیسی" value={project.englishName} dir="ltr" onChange={(value) => patchProject(index, { englishName: value })} />
                <Input label="نام فارسی" value={project.persianName} onChange={(value) => patchProject(index, { persianName: value })} />
                <div className="md:col-span-2 xl:col-span-2">
                  <Textarea label="توضیح پروژه" value={project.explanation} rows={3} onChange={(value) => patchProject(index, { explanation: value })} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => patch({
            projects: [
              ...decision.projects,
              { id: "PROJECT-ID", code: "CODE", englishName: "Project name", persianName: "نام فارسی پروژه", explanation: "توضیح پروژه" },
            ],
          })}
          className="mt-3 inline-flex items-center gap-2 rounded-xl border border-violet-200 bg-white px-3 py-2 text-xs font-black text-violet-800"
        >
          <Plus className="h-4 w-4" /> افزودن پروژه
        </button>
      </div>

      <div className="mt-4 rounded-2xl border border-sky-100 bg-sky-50/30 p-4">
        <h4 className="font-black text-sky-950">باکس اختصارات GDC</h4>
        <div className="mt-3 grid gap-4 lg:grid-cols-2">
          <Input label="عنوان باکس اختصارات" value={decision.abbreviationsTitle} onChange={(value) => patch({ abbreviationsTitle: value })} />
          <Input label="فرمول / مثال پایین باکس" value={decision.abbreviationFormula} dir="ltr" onChange={(value) => patch({ abbreviationFormula: value })} />
          <div className="lg:col-span-2">
            <Textarea label="توضیح باکس اختصارات" value={decision.abbreviationsBody} rows={4} onChange={(value) => patch({ abbreviationsBody: value })} />
          </div>
        </div>

        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {decision.abbreviations.map((item, index) => (
            <div key={`${item.abbr}-${index}`} className="rounded-xl border border-sky-100 bg-white p-3">
              <div className="flex items-center justify-between gap-2">
                <b className="text-xs text-sky-900">اختصار {index + 1}</b>
                <button
                  type="button"
                  onClick={() => patch({ abbreviations: decision.abbreviations.filter((_, itemIndex) => itemIndex !== index) })}
                  className="rounded-lg border border-rose-200 p-2 text-rose-600"
                  aria-label="حذف اختصار"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <Input label="اختصار" value={item.abbr} dir="ltr" onChange={(value) => patchAbbreviation(index, { abbr: value })} />
                <Input label="نام کامل" value={item.full} dir="ltr" onChange={(value) => patchAbbreviation(index, { full: value })} />
                <div className="md:col-span-2">
                  <Textarea label="معنی / توضیح فارسی" value={item.meaning} rows={2} onChange={(value) => patchAbbreviation(index, { meaning: value })} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => patch({
            abbreviations: [...decision.abbreviations, { abbr: "NEW", full: "Full name", meaning: "توضیح فارسی" }],
          })}
          className="mt-3 inline-flex items-center gap-2 rounded-xl border border-sky-200 bg-white px-3 py-2 text-xs font-black text-sky-800"
        >
          <Plus className="h-4 w-4" /> افزودن اختصار
        </button>
      </div>

      <div className="mt-4 rounded-2xl border border-teal-100 bg-teal-50/30 p-4">
        <h4 className="font-black text-teal-950">باکس جمع‌بندی و تصمیم پژوهشی</h4>
        <div className="mt-3 grid gap-4 lg:grid-cols-2">
          <Input label="عنوان جمع‌بندی" value={decision.conclusionTitle} onChange={(value) => patch({ conclusionTitle: value })} />
          <div className="lg:col-span-2">
            <Textarea label="متن جمع‌بندی" value={decision.conclusionBody} rows={4} onChange={(value) => patch({ conclusionBody: value })} />
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {decision.conclusionCards.map((card, index) => (
            <div key={index} className="rounded-xl border border-teal-100 bg-white p-3">
              <Textarea
                label={`کارت نتیجه ${index + 1}`}
                value={card}
                rows={3}
                onChange={(value) => patch({
                  conclusionCards: decision.conclusionCards.map((item, itemIndex) => itemIndex === index ? value : item),
                })}
              />
              <button
                type="button"
                onClick={() => patch({ conclusionCards: decision.conclusionCards.filter((_, itemIndex) => itemIndex !== index) })}
                className="mt-2 inline-flex items-center gap-1 rounded-lg border border-rose-200 px-2 py-1.5 text-xs font-bold text-rose-600"
              >
                <Trash2 className="h-3.5 w-3.5" /> حذف کارت
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => patch({ conclusionCards: [...decision.conclusionCards, "متن کارت جدید"] })}
          className="mt-3 inline-flex items-center gap-2 rounded-xl border border-teal-200 bg-white px-3 py-2 text-xs font-black text-teal-800"
        >
          <Plus className="h-4 w-4" /> افزودن کارت نتیجه
        </button>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Input label="متن دکمه قبلی" value={decision.previousButton} onChange={(value) => patch({ previousButton: value })} />
        <Input label="متن دکمه بعدی" value={decision.nextButton} onChange={(value) => patch({ nextButton: value })} />
      </div>
    </details>
  );
}
