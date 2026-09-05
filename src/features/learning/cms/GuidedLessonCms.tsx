import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
} from "react";
import {
  Eye,
  FileClock,
  Image as ImageIcon,
  Loader2,
  Pencil,
  Plus,
  Save,
  Send,
  Trash2,
  Upload,
  Video,
  X,
} from "lucide-react";
import { toast } from "sonner";

import type {
  ConceptBridge,
  GuidedConcept,
  GuidedLessonSection,
  GuidedQuestion,
  GuidedScenario,
  LearningTerm,
} from "@/features/learning/components/GuidedConceptLesson";
import {
  loadLearningDraft,
  loadLearningRevisions,
  publishLearningDocument,
  saveLearningDraft,
  uploadLearningMedia,
  useLearningAdminAccess,
  usePublishedLearningDocument,
  type LearningContentRevision,
  type LearningMedia,
} from "@/features/learning/cms/learning-content-service";

export type GuidedLessonCmsSection = {
  title: string;
  eyebrow: string;
  headline: string;
  lead: string;
  connection: string | null;
  flow: string[] | null;
  concepts: GuidedConcept[] | null;
  terms: LearningTerm[] | null;
  scenario: GuidedScenario | null;
  insightMode: "none" | "text" | "code";
  insightText: string | null;
  question: GuidedQuestion;
  bridge: ConceptBridge;
  media: LearningMedia[];
};

export type GuidedLessonCmsDocument = {
  version: 1;
  title: string;
  subtitle: string;
  sections: GuidedLessonCmsSection[];
};

export function useGuidedLessonCms({
  pageKey,
  title,
  subtitle,
  sections,
}: {
  pageKey: string;
  title: string;
  subtitle: string;
  sections: GuidedLessonSection[];
}) {
  const fallbackDocument = useMemo(
    () => serializeGuidedLesson(title, subtitle, sections),
    [sections, subtitle, title],
  );
  const { document: publishedDocument, reload } =
    usePublishedLearningDocument<GuidedLessonCmsDocument>(pageKey);
  const { isAdmin } = useLearningAdminAccess();
  const [previewDocument, setPreviewDocument] =
    useState<GuidedLessonCmsDocument | null>(null);

  const sourceDocument = useMemo(
    () =>
      sanitizeGuidedDocument(
        previewDocument ?? publishedDocument,
        fallbackDocument,
      ),
    [fallbackDocument, previewDocument, publishedDocument],
  );

  const effectiveSections = useMemo(
    () => applyGuidedDocument(sections, sourceDocument),
    [sections, sourceDocument],
  );

  return {
    pageKey,
    title: sourceDocument.title,
    subtitle: sourceDocument.subtitle,
    sections: effectiveSections,
    document: sourceDocument,
    isAdmin,
    setPreviewDocument,
    reloadPublished: reload,
  };
}

export function GuidedLessonCmsAdmin({
  pageKey,
  document,
  currentSectionIndex,
  onPreview,
  onPublished,
}: {
  pageKey: string;
  document: GuidedLessonCmsDocument;
  currentSectionIndex: number;
  onPreview: (document: GuidedLessonCmsDocument | null) => void;
  onPublished: () => Promise<void> | void;
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<GuidedLessonCmsDocument>(() =>
    cloneDocument(document),
  );
  const [sectionIndex, setSectionIndex] = useState(currentSectionIndex);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewing, setPreviewing] = useState(false);
  const [revisions, setRevisions] = useState<
    LearningContentRevision<GuidedLessonCmsDocument>[]
  >([]);
  const [historyOpen, setHistoryOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    let mounted = true;

    async function hydrateEditor() {
      setLoading(true);
      try {
        const [savedDraft, savedRevisions] = await Promise.all([
          loadLearningDraft<GuidedLessonCmsDocument>(pageKey),
          loadLearningRevisions<GuidedLessonCmsDocument>(pageKey),
        ]);
        if (!mounted) return;
        setDraft(cloneDocument(savedDraft ?? document));
        setRevisions(savedRevisions);
        setSectionIndex(currentSectionIndex);
      } catch (error) {
        console.error(error);
        toast.error("دریافت پیش‌نویس مدیریت محتوا انجام نشد.");
        setDraft(cloneDocument(document));
      } finally {
        if (mounted) setLoading(false);
      }
    }

    void hydrateEditor();
    return () => {
      mounted = false;
    };
  }, [currentSectionIndex, document, open, pageKey]);

  const section = draft.sections[sectionIndex];

  function updateSection(patch: Partial<GuidedLessonCmsSection>) {
    setDraft((current) => ({
      ...current,
      sections: current.sections.map((item, index) =>
        index === sectionIndex ? { ...item, ...patch } : item,
      ),
    }));
  }

  async function saveDraft() {
    setSaving(true);
    try {
      await saveLearningDraft(pageKey, draft);
      toast.success("پیش‌نویس ذخیره شد.");
    } catch (error) {
      console.error(error);
      toast.error("ذخیره پیش‌نویس با خطا مواجه شد.");
    } finally {
      setSaving(false);
    }
  }

  async function publish() {
    setPublishing(true);
    try {
      await publishLearningDocument(pageKey, draft);
      onPreview(null);
      setPreviewing(false);
      await onPublished();
      setRevisions(await loadLearningRevisions(pageKey));
      toast.success("نسخه جدید منتشر شد.");
    } catch (error) {
      console.error(error);
      toast.error("انتشار محتوا انجام نشد.");
    } finally {
      setPublishing(false);
    }
  }

  function togglePreview() {
    if (previewing) {
      onPreview(null);
      setPreviewing(false);
    } else {
      onPreview(cloneDocument(draft));
      setPreviewing(true);
    }
  }

  async function restoreRevision(
    revision: LearningContentRevision<GuidedLessonCmsDocument>,
  ) {
    const restored = cloneDocument(revision.content);
    setDraft(restored);
    setSectionIndex(0);
    try {
      await saveLearningDraft(pageKey, restored);
      onPreview(restored);
      setPreviewing(true);
      toast.success("نسخه انتخاب‌شده به پیش‌نویس برگردانده شد.");
    } catch (error) {
      console.error(error);
      toast.error("بازگردانی نسخه انجام نشد.");
    }
  }

  async function handleMediaUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !section) return;

    setUploading(true);
    try {
      const media = await uploadLearningMedia(pageKey, file);
      updateSection({ media: [...section.media, media] });
      toast.success("رسانه آپلود شد؛ برای ثبت نهایی پیش‌نویس را ذخیره کنید.");
    } catch (error) {
      console.error(error);
      toast.error("آپلود تصویر یا ویدیو انجام نشد.");
    } finally {
      setUploading(false);
    }
  }

  function closeEditor() {
    if (previewing) onPreview(null);
    setPreviewing(false);
    setOpen(false);
  }

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-violet-200 bg-violet-50 p-3" dir="rtl">
        <div>
          <p className="text-xs font-black text-violet-800">حالت مدیر محتوا</p>
          <p className="mt-1 text-xs leading-6 text-violet-700">
            متن، سؤال، تصویر و ویدیو را بدون تغییر کد و بدون Deploy ویرایش کنید.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a
            href="/admin/content"
            className="inline-flex min-h-10 items-center justify-center rounded-xl border border-violet-200 bg-white px-4 text-xs font-bold text-violet-800"
          >
            مرکز محتوا
          </a>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-violet-700 px-4 text-xs font-black text-white hover:bg-violet-800"
          >
            <Pencil className="size-4" /> ویرایش همین صفحه
          </button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-[100] bg-slate-950/50" dir="rtl">
          <div className="absolute inset-y-0 left-0 flex w-full max-w-4xl flex-col bg-slate-50 shadow-2xl">
            <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-5 py-4">
              <div>
                <p className="text-xs font-black text-violet-700">ویرایشگر محتوای آموزشی</p>
                <p className="mt-1 text-sm font-black text-slate-950">{draft.title}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setHistoryOpen((value) => !value)}
                  className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700"
                >
                  <FileClock className="size-4" /> تاریخچه
                </button>
                <button
                  type="button"
                  onClick={togglePreview}
                  className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-sky-200 bg-sky-50 px-3 text-xs font-bold text-sky-800"
                >
                  <Eye className="size-4" />
                  {previewing ? "پایان پیش‌نمایش" : "پیش‌نمایش"}
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => void saveDraft()}
                  className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 text-xs font-bold text-emerald-800 disabled:opacity-50"
                >
                  {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                  ذخیره پیش‌نویس
                </button>
                <button
                  type="button"
                  disabled={publishing}
                  onClick={() => void publish()}
                  className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-slate-950 px-4 text-xs font-black text-white disabled:opacity-50"
                >
                  {publishing ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
                  انتشار
                </button>
                <button
                  type="button"
                  aria-label="بستن ویرایشگر"
                  onClick={closeEditor}
                  className="inline-flex size-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600"
                >
                  <X className="size-4" />
                </button>
              </div>
            </header>

            <div className="flex-1 overflow-y-auto p-5 sm:p-6">
              {loading ? (
                <div className="flex min-h-64 items-center justify-center gap-3 text-sm font-bold text-slate-500">
                  <Loader2 className="size-5 animate-spin" /> در حال آماده‌سازی ویرایشگر…
                </div>
              ) : (
                <div className="space-y-6">
                  {historyOpen && (
                    <HistoryPanel revisions={revisions} onRestore={restoreRevision} />
                  )}

                  <section className="rounded-3xl border border-slate-200 bg-white p-5">
                    <p className="text-xs font-black text-slate-500">اطلاعات کلی درس</p>
                    <div className="mt-4 grid gap-4">
                      <TextField
                        label="عنوان درس"
                        value={draft.title}
                        onChange={(value) => setDraft((current) => ({ ...current, title: value }))}
                      />
                      <TextArea
                        label="زیرعنوان درس"
                        value={draft.subtitle}
                        rows={3}
                        onChange={(value) => setDraft((current) => ({ ...current, subtitle: value }))}
                      />
                    </div>
                  </section>

                  <section className="rounded-3xl border border-slate-200 bg-white p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-black text-teal-700">بخش در حال ویرایش</p>
                        <p className="mt-1 text-sm font-black text-slate-950">
                          {(sectionIndex + 1).toLocaleString("fa-IR")} از {draft.sections.length.toLocaleString("fa-IR")}
                        </p>
                      </div>
                      <select
                        value={sectionIndex}
                        onChange={(event) => setSectionIndex(Number(event.target.value))}
                        className="min-h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700"
                      >
                        {draft.sections.map((item, index) => (
                          <option key={`${item.title}-${index}`} value={index}>
                            {(index + 1).toLocaleString("fa-IR")}. {item.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    {section && (
                      <div className="mt-5 space-y-6">
                        <BasicSectionFields section={section} onUpdate={updateSection} />
                        <ConceptsEditor section={section} onUpdate={updateSection} />
                        <TermsEditor section={section} onUpdate={updateSection} />
                        <ScenarioEditor section={section} onUpdate={updateSection} />
                        <InsightEditor section={section} onUpdate={updateSection} />
                        <QuestionEditor section={section} onUpdate={updateSection} />
                        <BridgeEditor section={section} onUpdate={updateSection} />
                        <MediaEditor
                          section={section}
                          uploading={uploading}
                          onUpload={handleMediaUpload}
                          onUpdate={updateSection}
                        />
                      </div>
                    )}
                  </section>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function LearningMediaBlocks({
  items,
}: {
  items?: LearningMedia[] | undefined;
}) {
  if (!items?.length) return null;

  return (
    <section className="mt-6 grid gap-4">
      {items.map((item) => (
        <figure
          key={item.id}
          className="overflow-hidden rounded-3xl border border-slate-200 bg-white"
        >
          {item.type === "image" ? (
            <img
              src={item.url}
              alt={item.alt || item.caption || "تصویر آموزشی"}
              loading="lazy"
              className="max-h-[620px] w-full object-contain"
            />
          ) : (
            <video
              src={item.url}
              controls
              preload="metadata"
              className="max-h-[620px] w-full bg-slate-950"
            />
          )}
          {item.caption && (
            <figcaption className="border-t border-slate-100 px-4 py-3 text-xs leading-6 text-slate-600">
              {item.caption}
            </figcaption>
          )}
        </figure>
      ))}
    </section>
  );
}

function BasicSectionFields({
  section,
  onUpdate,
}: {
  section: GuidedLessonCmsSection;
  onUpdate: (patch: Partial<GuidedLessonCmsSection>) => void;
}) {
  return (
    <EditorGroup title="متن اصلی بخش">
      <TextField label="نام کوتاه بخش" value={section.title} onChange={(title) => onUpdate({ title })} />
      <TextField label="برچسب بالای عنوان" value={section.eyebrow} onChange={(eyebrow) => onUpdate({ eyebrow })} />
      <TextArea label="عنوان اصلی" value={section.headline} rows={2} onChange={(headline) => onUpdate({ headline })} />
      <TextArea label="متن معرفی" value={section.lead} rows={5} onChange={(lead) => onUpdate({ lead })} />
      <TextArea
        label="اتصال به بخش قبل"
        value={section.connection ?? ""}
        rows={3}
        hint="خالی بگذارید تا این بلوک نمایش داده نشود."
        onChange={(connection) => onUpdate({ connection: connection.trim() ? connection : null })}
      />
      <TextArea
        label="نقشه تبدیل — هر خط یک مرحله"
        value={(section.flow ?? []).join("\n")}
        rows={4}
        onChange={(value) =>
          onUpdate({
            flow: value.trim()
              ? value.split("\n").map((item) => item.trim()).filter(Boolean)
              : null,
          })
        }
      />
    </EditorGroup>
  );
}

function ConceptsEditor({ section, onUpdate }: EditorSectionProps) {
  const concepts = section.concepts ?? [];
  return (
    <EditorGroup title="کارت‌های مفهومی">
      {concepts.map((concept, index) => (
        <div key={index} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-black text-slate-500">کارت {(index + 1).toLocaleString("fa-IR")}</p>
            <button
              type="button"
              onClick={() => onUpdate({ concepts: concepts.filter((_, itemIndex) => itemIndex !== index) || null })}
              className="text-xs font-bold text-rose-700"
            >
              حذف
            </button>
          </div>
          <div className="mt-3 grid gap-3">
            <TextField
              label="عنوان"
              value={concept.title}
              onChange={(title) =>
                onUpdate({ concepts: concepts.map((item, itemIndex) => itemIndex === index ? { ...item, title } : item) })
              }
            />
            <TextArea
              label="متن"
              value={concept.text}
              rows={4}
              onChange={(text) =>
                onUpdate({ concepts: concepts.map((item, itemIndex) => itemIndex === index ? { ...item, text } : item) })
              }
            />
            <label className="inline-flex items-center gap-2 text-xs font-bold text-slate-600">
              <input
                type="checkbox"
                checked={Boolean(concept.emphasized)}
                onChange={(event) =>
                  onUpdate({ concepts: concepts.map((item, itemIndex) => itemIndex === index ? { ...item, emphasized: event.target.checked } : item) })
                }
              />
              نمایش به‌صورت کارت تأکیدی
            </label>
          </div>
        </div>
      ))}
      <AddButton
        label="افزودن کارت مفهومی"
        onClick={() => onUpdate({ concepts: [...concepts, { title: "عنوان جدید", text: "متن جدید" }] })}
      />
    </EditorGroup>
  );
}

function TermsEditor({ section, onUpdate }: EditorSectionProps) {
  const terms = section.terms ?? [];
  return (
    <EditorGroup title="اصطلاح‌های علمی">
      {terms.map((term, index) => (
        <div key={index} className="rounded-2xl border border-violet-100 bg-violet-50/50 p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-black text-violet-700">اصطلاح {(index + 1).toLocaleString("fa-IR")}</p>
            <button
              type="button"
              onClick={() => onUpdate({ terms: terms.filter((_, itemIndex) => itemIndex !== index) || null })}
              className="text-xs font-bold text-rose-700"
            >
              حذف
            </button>
          </div>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <TextField
              label="نام علمی"
              value={term.term}
              onChange={(value) => onUpdate({ terms: terms.map((item, itemIndex) => itemIndex === index ? { ...item, term: value } : item) })}
            />
            <TextField
              label="برچسب فارسی"
              value={term.persianLabel ?? ""}
              onChange={(value) => onUpdate({ terms: terms.map((item, itemIndex) => itemIndex === index ? { ...item, persianLabel: value || undefined } : item) })}
            />
          </div>
          <div className="mt-3 grid gap-3">
            <TextArea
              label="توضیح"
              value={term.explanation}
              rows={4}
              onChange={(value) => onUpdate({ terms: terms.map((item, itemIndex) => itemIndex === index ? { ...item, explanation: value } : item) })}
            />
            <TextArea
              label="مثال"
              value={term.example ?? ""}
              rows={2}
              onChange={(value) => onUpdate({ terms: terms.map((item, itemIndex) => itemIndex === index ? { ...item, example: value || undefined } : item) })}
            />
          </div>
        </div>
      ))}
      <AddButton
        label="افزودن اصطلاح"
        onClick={() => onUpdate({ terms: [...terms, { term: "New term", persianLabel: "", explanation: "توضیح اصطلاح" }] })}
      />
    </EditorGroup>
  );
}

function ScenarioEditor({ section, onUpdate }: EditorSectionProps) {
  if (!section.scenario) {
    return (
      <EditorGroup title="سناریوی پژوهشی">
        <AddButton
          label="افزودن سناریو"
          onClick={() => onUpdate({ scenario: { title: "سناریوی جدید", description: "توضیح سناریو", items: [] } })}
        />
      </EditorGroup>
    );
  }

  return (
    <EditorGroup title="سناریوی پژوهشی">
      <div className="flex justify-end">
        <button type="button" onClick={() => onUpdate({ scenario: null })} className="text-xs font-bold text-rose-700">
          حذف سناریو
        </button>
      </div>
      <TextField
        label="عنوان سناریو"
        value={section.scenario.title}
        onChange={(title) => onUpdate({ scenario: { ...section.scenario!, title } })}
      />
      <TextArea
        label="توضیح"
        value={section.scenario.description}
        rows={4}
        onChange={(description) => onUpdate({ scenario: { ...section.scenario!, description } })}
      />
      <TextArea
        label="موارد سناریو — هر خط یک مورد"
        value={(section.scenario.items ?? []).join("\n")}
        rows={4}
        onChange={(value) =>
          onUpdate({
            scenario: {
              ...section.scenario!,
              items: value.trim() ? value.split("\n").map((item) => item.trim()).filter(Boolean) : [],
            },
          })
        }
      />
    </EditorGroup>
  );
}

function InsightEditor({ section, onUpdate }: EditorSectionProps) {
  return (
    <EditorGroup title="نکته یا بلوک تعاملی">
      {section.insightMode === "code" ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs leading-6 text-amber-950">
          این قسمت یک بلوک تعاملی کدنویسی‌شده است. ساختار تعامل از پنل حذف یا تغییر نمی‌کند؛ متن‌های معمولی، سؤال‌ها و رسانه‌های اطراف آن قابل ویرایش‌اند.
        </div>
      ) : (
        <TextArea
          label="متن نکته"
          value={section.insightText ?? ""}
          rows={4}
          hint="خالی بگذارید تا نکته متنی نمایش داده نشود."
          onChange={(value) =>
            onUpdate({
              insightMode: value.trim() ? "text" : "none",
              insightText: value.trim() ? value : null,
            })
          }
        />
      )}
    </EditorGroup>
  );
}

function QuestionEditor({ section, onUpdate }: EditorSectionProps) {
  const question = section.question;
  return (
    <EditorGroup title="ایستگاه تصمیم">
      <TextArea
        label="متن سؤال"
        value={question.question}
        rows={3}
        onChange={(value) => onUpdate({ question: { ...question, question: value } })}
      />
      <div className="grid gap-3">
        {question.options.map((option, index) => (
          <div key={index} className="flex items-start gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-3">
            <input
              type="radio"
              name={`correct-${section.title}`}
              checked={question.correctIndex === index}
              onChange={() => onUpdate({ question: { ...question, correctIndex: index } })}
              className="mt-3"
              aria-label="انتخاب پاسخ درست"
            />
            <textarea
              value={option}
              onChange={(event) =>
                onUpdate({
                  question: {
                    ...question,
                    options: question.options.map((item, itemIndex) => itemIndex === index ? event.target.value : item),
                  },
                })
              }
              rows={2}
              className="min-h-16 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm leading-7 outline-none focus:border-teal-400"
            />
            {question.options.length > 2 && (
              <button
                type="button"
                onClick={() => {
                  const options = question.options.filter((_, itemIndex) => itemIndex !== index);
                  const correctIndex = Math.min(
                    question.correctIndex > index ? question.correctIndex - 1 : question.correctIndex,
                    options.length - 1,
                  );
                  onUpdate({ question: { ...question, options, correctIndex } });
                }}
                className="mt-2 text-rose-700"
                aria-label="حذف گزینه"
              >
                <Trash2 className="size-4" />
              </button>
            )}
          </div>
        ))}
      </div>
      <AddButton
        label="افزودن گزینه"
        onClick={() => onUpdate({ question: { ...question, options: [...question.options, "گزینه جدید"] } })}
      />
      <TextArea
        label="بازخورد پاسخ درست"
        value={question.correctFeedback}
        rows={3}
        onChange={(value) => onUpdate({ question: { ...question, correctFeedback: value } })}
      />
      <TextArea
        label="بازخورد پاسخ نادرست"
        value={question.incorrectFeedback}
        rows={3}
        onChange={(value) => onUpdate({ question: { ...question, incorrectFeedback: value } })}
      />
    </EditorGroup>
  );
}

function BridgeEditor({ section, onUpdate }: EditorSectionProps) {
  return (
    <EditorGroup title="پل مفهومی به بخش بعد">
      <TextArea
        label="سؤال باز"
        value={section.bridge.openQuestion}
        rows={2}
        onChange={(value) => onUpdate({ bridge: { ...section.bridge, openQuestion: value } })}
      />
      <TextArea
        label="گام بعد"
        value={section.bridge.nextStep}
        rows={3}
        onChange={(value) => onUpdate({ bridge: { ...section.bridge, nextStep: value } })}
      />
    </EditorGroup>
  );
}

function MediaEditor({
  section,
  uploading,
  onUpload,
  onUpdate,
}: EditorSectionProps & {
  uploading: boolean;
  onUpload: (event: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <EditorGroup title="تصویر و ویدیو">
      <label className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border border-dashed border-teal-300 bg-teal-50 px-4 text-sm font-black text-teal-800">
        {uploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
        آپلود تصویر یا ویدیو
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif,video/mp4,video/webm"
          className="hidden"
          disabled={uploading}
          onChange={onUpload}
        />
      </label>
      <p className="text-xs leading-6 text-slate-500">
        تصویر و ویدیو در Storage هاب‌ژن نگهداری می‌شوند. رسانه‌ها در این نسخه بعد از محتوای آموزشی بخش و قبل از سؤال نمایش داده می‌شوند.
      </p>
      <div className="grid gap-3">
        {section.media.map((media, index) => (
          <div key={media.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="inline-flex items-center gap-2 text-xs font-black text-slate-700">
                {media.type === "image" ? <ImageIcon className="size-4" /> : <Video className="size-4" />}
                رسانه {(index + 1).toLocaleString("fa-IR")}
              </div>
              <button
                type="button"
                onClick={() => onUpdate({ media: section.media.filter((_, itemIndex) => itemIndex !== index) })}
                className="inline-flex items-center gap-1 text-xs font-bold text-rose-700"
              >
                <Trash2 className="size-3.5" /> حذف از صفحه
              </button>
            </div>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <TextField
                label="متن جایگزین تصویر"
                value={media.alt ?? ""}
                onChange={(value) =>
                  onUpdate({ media: section.media.map((item, itemIndex) => itemIndex === index ? { ...item, alt: value } : item) })
                }
              />
              <TextField
                label="زیرنویس"
                value={media.caption ?? ""}
                onChange={(value) =>
                  onUpdate({ media: section.media.map((item, itemIndex) => itemIndex === index ? { ...item, caption: value } : item) })
                }
              />
            </div>
          </div>
        ))}
      </div>
    </EditorGroup>
  );
}

function HistoryPanel({
  revisions,
  onRestore,
}: {
  revisions: LearningContentRevision<GuidedLessonCmsDocument>[];
  onRestore: (revision: LearningContentRevision<GuidedLessonCmsDocument>) => void;
}) {
  return (
    <section className="rounded-3xl border border-amber-200 bg-amber-50 p-5">
      <p className="text-xs font-black text-amber-800">تاریخچه انتشار</p>
      {revisions.length === 0 ? (
        <p className="mt-3 text-xs leading-6 text-amber-900/70">
          هنوز نسخه منتشرشده قبلی برای بازگردانی ثبت نشده است. از انتشار دوم به بعد نسخه قبلی اینجا نگهداری می‌شود.
        </p>
      ) : (
        <div className="mt-3 grid gap-2">
          {revisions.map((revision) => (
            <div key={revision.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-200 bg-white p-3">
              <span className="text-xs font-bold text-slate-600">
                {new Date(revision.created_at).toLocaleString("fa-IR")}
              </span>
              <button
                type="button"
                onClick={() => onRestore(revision)}
                className="text-xs font-black text-amber-800"
              >
                بازگردانی به پیش‌نویس
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

type EditorSectionProps = {
  section: GuidedLessonCmsSection;
  onUpdate: (patch: Partial<GuidedLessonCmsSection>) => void;
};

function EditorGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-4 rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
      <p className="text-xs font-black text-slate-600">{title}</p>
      {children}
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-1.5">
      <span className="text-xs font-bold text-slate-600">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-teal-400"
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  rows,
  hint,
  onChange,
}: {
  label: string;
  value: string;
  rows: number;
  hint?: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-1.5">
      <span className="text-xs font-bold text-slate-600">{label}</span>
      <textarea
        value={value}
        rows={rows}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm leading-7 outline-none focus:border-teal-400"
      />
      {hint && <span className="text-[11px] leading-5 text-slate-400">{hint}</span>}
    </label>
  );
}

function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex min-h-10 w-fit items-center gap-2 rounded-xl border border-dashed border-slate-300 bg-white px-3 text-xs font-black text-slate-700"
    >
      <Plus className="size-4" /> {label}
    </button>
  );
}

function serializeGuidedLesson(
  title: string,
  subtitle: string,
  sections: GuidedLessonSection[],
): GuidedLessonCmsDocument {
  return {
    version: 1,
    title,
    subtitle,
    sections: sections.map((section) => ({
      title: section.title,
      eyebrow: section.eyebrow,
      headline: section.headline,
      lead: section.lead,
      connection: section.connection ?? null,
      flow: section.flow ? [...section.flow] : null,
      concepts: section.concepts ? section.concepts.map((item) => ({ ...item })) : null,
      terms: section.terms ? section.terms.map((item) => ({ ...item })) : null,
      scenario: section.scenario
        ? {
            ...section.scenario,
            items: section.scenario.items ? [...section.scenario.items] : [],
          }
        : null,
      insightMode:
        typeof section.insight === "string"
          ? "text"
          : section.insight
            ? "code"
            : "none",
      insightText: typeof section.insight === "string" ? section.insight : null,
      question: {
        ...section.question,
        options: [...section.question.options],
      },
      bridge: { ...section.bridge },
      media: section.media ? section.media.map((item) => ({ ...item })) : [],
    })),
  };
}

function sanitizeGuidedDocument(
  value: GuidedLessonCmsDocument | null,
  fallback: GuidedLessonCmsDocument,
): GuidedLessonCmsDocument {
  if (!value || !Array.isArray(value.sections)) return fallback;

  return {
    version: 1,
    title: typeof value.title === "string" ? value.title : fallback.title,
    subtitle: typeof value.subtitle === "string" ? value.subtitle : fallback.subtitle,
    sections: fallback.sections.map((fallbackSection, index) => {
      const incoming = value.sections[index];
      if (!incoming || typeof incoming !== "object") return fallbackSection;
      const options = Array.isArray(incoming.question?.options) && incoming.question.options.length >= 2
        ? incoming.question.options.map(String)
        : fallbackSection.question.options;
      const correctIndex = Number.isInteger(incoming.question?.correctIndex)
        ? Math.min(Math.max(incoming.question.correctIndex, 0), options.length - 1)
        : fallbackSection.question.correctIndex;

      return {
        ...fallbackSection,
        ...incoming,
        title: stringOr(incoming.title, fallbackSection.title),
        eyebrow: stringOr(incoming.eyebrow, fallbackSection.eyebrow),
        headline: stringOr(incoming.headline, fallbackSection.headline),
        lead: stringOr(incoming.lead, fallbackSection.lead),
        connection: incoming.connection === null ? null : stringOr(incoming.connection, fallbackSection.connection ?? ""),
        flow: Array.isArray(incoming.flow) ? incoming.flow.map(String) : incoming.flow === null ? null : fallbackSection.flow,
        concepts: Array.isArray(incoming.concepts) ? incoming.concepts : incoming.concepts === null ? null : fallbackSection.concepts,
        terms: Array.isArray(incoming.terms) ? incoming.terms : incoming.terms === null ? null : fallbackSection.terms,
        scenario: incoming.scenario === null || typeof incoming.scenario === "object" ? incoming.scenario : fallbackSection.scenario,
        insightMode: ["none", "text", "code"].includes(incoming.insightMode) ? incoming.insightMode : fallbackSection.insightMode,
        insightText: typeof incoming.insightText === "string" ? incoming.insightText : null,
        question: {
          question: stringOr(incoming.question?.question, fallbackSection.question.question),
          options,
          correctIndex,
          correctFeedback: stringOr(incoming.question?.correctFeedback, fallbackSection.question.correctFeedback),
          incorrectFeedback: stringOr(incoming.question?.incorrectFeedback, fallbackSection.question.incorrectFeedback),
        },
        bridge: {
          openQuestion: stringOr(incoming.bridge?.openQuestion, fallbackSection.bridge.openQuestion),
          nextStep: stringOr(incoming.bridge?.nextStep, fallbackSection.bridge.nextStep),
        },
        media: Array.isArray(incoming.media) ? incoming.media : [],
      };
    }),
  };
}

function applyGuidedDocument(
  defaults: GuidedLessonSection[],
  document: GuidedLessonCmsDocument,
): GuidedLessonSection[] {
  return defaults.map((defaultSection, index) => {
    const content = document.sections[index];
    if (!content) return defaultSection;

    return {
      ...defaultSection,
      title: content.title,
      eyebrow: content.eyebrow,
      headline: content.headline,
      lead: content.lead,
      connection: content.connection ?? undefined,
      flow: content.flow ?? undefined,
      concepts: content.concepts ?? undefined,
      terms: content.terms ?? undefined,
      scenario: content.scenario ?? undefined,
      insight:
        content.insightMode === "code"
          ? defaultSection.insight
          : content.insightMode === "text"
            ? content.insightText ?? undefined
            : undefined,
      question: content.question,
      bridge: content.bridge,
      media: content.media,
    };
  });
}

function cloneDocument<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function stringOr(value: unknown, fallback: string) {
  return typeof value === "string" ? value : fallback;
}
