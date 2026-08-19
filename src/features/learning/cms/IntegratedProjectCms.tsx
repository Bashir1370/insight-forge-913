import { useEffect, useMemo, useState, type ChangeEvent, type ReactNode } from "react";
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

import { LearningMediaBlocks } from "@/features/learning/cms/GuidedLessonCms";
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

export type ProjectMissionContent = {
  title: string;
  lessonRef: string;
  prompt: string;
  context: string;
  options: string[];
  correctIndex: number;
  correctFeedback: string;
  incorrectFeedback: string;
  deliverable: string;
  media?: LearningMedia[];
};

export type IntegratedProjectCmsDocument = {
  version: 1;
  title: string;
  subtitle: string;
  missions: ProjectMissionContent[];
};

export function useIntegratedProjectCms({
  pageKey,
  title,
  subtitle,
  missions,
}: {
  pageKey: string;
  title: string;
  subtitle: string;
  missions: ProjectMissionContent[];
}) {
  const fallback = useMemo<IntegratedProjectCmsDocument>(
    () => ({
      version: 1,
      title,
      subtitle,
      missions: missions.map((mission) => ({
        ...mission,
        options: [...mission.options],
        media: mission.media?.map((item) => ({ ...item })) ?? [],
      })),
    }),
    [missions, subtitle, title],
  );
  const { document: published, reload } =
    usePublishedLearningDocument<IntegratedProjectCmsDocument>(pageKey);
  const { isAdmin } = useLearningAdminAccess();
  const [preview, setPreview] = useState<IntegratedProjectCmsDocument | null>(null);

  const publishedSource = useMemo(
    () => sanitizeProjectDocument(published, fallback),
    [fallback, published],
  );
  const effective = useMemo(
    () => sanitizeProjectDocument(preview, publishedSource),
    [preview, publishedSource],
  );

  return {
    pageKey,
    title: effective.title,
    subtitle: effective.subtitle,
    missions: effective.missions,
    document: publishedSource,
    isAdmin,
    setPreviewDocument: setPreview,
    reloadPublished: reload,
  };
}

export function IntegratedProjectCmsAdmin({
  pageKey,
  document,
  currentMissionIndex,
  onPreview,
  onPublished,
}: {
  pageKey: string;
  document: IntegratedProjectCmsDocument;
  currentMissionIndex: number;
  onPreview: (document: IntegratedProjectCmsDocument | null) => void;
  onPublished: () => Promise<void> | void;
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(() => clone(document));
  const [missionIndex, setMissionIndex] = useState(currentMissionIndex);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewing, setPreviewing] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [revisions, setRevisions] = useState<
    LearningContentRevision<IntegratedProjectCmsDocument>[]
  >([]);

  useEffect(() => {
    if (!open) return;
    let mounted = true;

    async function hydrate() {
      setLoading(true);
      try {
        const [savedDraft, savedRevisions] = await Promise.all([
          loadLearningDraft<IntegratedProjectCmsDocument>(pageKey),
          loadLearningRevisions<IntegratedProjectCmsDocument>(pageKey),
        ]);
        if (!mounted) return;
        setDraft(clone(savedDraft ?? document));
        setRevisions(savedRevisions);
        setMissionIndex(currentMissionIndex);
      } catch (error) {
        console.error(error);
        toast.error("دریافت پیش‌نویس پروژه انجام نشد.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    void hydrate();
    return () => {
      mounted = false;
    };
  }, [open, pageKey]);

  const mission = draft.missions[missionIndex];

  function updateMission(patch: Partial<ProjectMissionContent>) {
    setDraft((current) => ({
      ...current,
      missions: current.missions.map((item, index) =>
        index === missionIndex ? { ...item, ...patch } : item,
      ),
    }));
  }

  async function saveDraft() {
    setSaving(true);
    try {
      await saveLearningDraft(pageKey, draft);
      toast.success("پیش‌نویس پروژه ذخیره شد.");
    } catch (error) {
      console.error(error);
      toast.error("ذخیره پیش‌نویس انجام نشد.");
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
      setRevisions(
        await loadLearningRevisions<IntegratedProjectCmsDocument>(pageKey),
      );
      toast.success("نسخه جدید پروژه منتشر شد.");
    } catch (error) {
      console.error(error);
      toast.error("انتشار پروژه انجام نشد.");
    } finally {
      setPublishing(false);
    }
  }

  function togglePreview() {
    if (previewing) {
      onPreview(null);
      setPreviewing(false);
    } else {
      onPreview(clone(draft));
      setPreviewing(true);
    }
  }

  async function restoreRevision(
    revision: LearningContentRevision<IntegratedProjectCmsDocument>,
  ) {
    const restored = clone(revision.content);
    setDraft(restored);
    setMissionIndex(0);
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

  async function uploadMedia(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !mission) return;

    setUploading(true);
    try {
      const media = await uploadLearningMedia(pageKey, file);
      updateMission({ media: [...(mission.media ?? []), media] });
      toast.success("رسانه آپلود شد؛ پیش‌نویس را ذخیره کنید.");
    } catch (error) {
      console.error(error);
      toast.error("آپلود رسانه انجام نشد.");
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
          <p className="text-xs font-black text-violet-800">حالت مدیر محتوا — پروژه یکپارچه</p>
          <p className="mt-1 text-xs leading-6 text-violet-700">
            متن مأموریت‌ها، پاسخ‌ها، بازخوردها و رسانه‌های پروژه بدون تغییر کد قابل ویرایش‌اند.
          </p>
        </div>
        <div className="flex gap-2">
          <a
            href="/admin/content"
            className="inline-flex min-h-10 items-center rounded-xl border border-violet-200 bg-white px-4 text-xs font-bold text-violet-800"
          >
            مرکز محتوا
          </a>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-violet-700 px-4 text-xs font-black text-white"
          >
            <Pencil className="size-4" /> ویرایش پروژه
          </button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-[100] bg-slate-950/50" dir="rtl">
          <div className="absolute inset-y-0 left-0 flex w-full max-w-4xl flex-col bg-slate-50 shadow-2xl">
            <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-5 py-4">
              <div>
                <p className="text-xs font-black text-violet-700">ویرایشگر پروژه یکپارچه</p>
                <p className="mt-1 text-sm font-black text-slate-950">{draft.title}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <ToolbarButton onClick={() => setHistoryOpen((value) => !value)}>
                  <FileClock className="size-4" /> تاریخچه
                </ToolbarButton>
                <ToolbarButton onClick={togglePreview} tone="sky">
                  <Eye className="size-4" /> {previewing ? "پایان پیش‌نمایش" : "پیش‌نمایش"}
                </ToolbarButton>
                <ToolbarButton onClick={() => void saveDraft()} disabled={saving} tone="emerald">
                  {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                  ذخیره
                </ToolbarButton>
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
                  onClick={closeEditor}
                  className="inline-flex size-10 items-center justify-center rounded-xl border border-slate-200 bg-white"
                  aria-label="بستن"
                >
                  <X className="size-4" />
                </button>
              </div>
            </header>

            <div className="flex-1 overflow-y-auto p-5 sm:p-6">
              {loading ? (
                <div className="flex min-h-64 items-center justify-center gap-2 text-sm font-bold text-slate-500">
                  <Loader2 className="size-5 animate-spin" /> در حال آماده‌سازی…
                </div>
              ) : (
                <div className="space-y-6">
                  {historyOpen && (
                    <ProjectHistory revisions={revisions} onRestore={restoreRevision} />
                  )}

                  <EditorGroup title="اطلاعات کلی پروژه">
                    <TextField
                      label="عنوان"
                      value={draft.title}
                      onChange={(title) => setDraft((current) => ({ ...current, title }))}
                    />
                    <TextArea
                      label="زیرعنوان"
                      value={draft.subtitle}
                      rows={4}
                      onChange={(subtitle) => setDraft((current) => ({ ...current, subtitle }))}
                    />
                  </EditorGroup>

                  <EditorGroup title="مأموریت در حال ویرایش">
                    <select
                      value={missionIndex}
                      onChange={(event) => setMissionIndex(Number(event.target.value))}
                      className="min-h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold"
                    >
                      {draft.missions.map((item, index) => (
                        <option value={index} key={`${item.title}-${index}`}>
                          {(index + 1).toLocaleString("fa-IR")}. {item.title}
                        </option>
                      ))}
                    </select>

                    {mission && (
                      <div className="grid gap-4">
                        <TextField label="عنوان مأموریت" value={mission.title} onChange={(title) => updateMission({ title })} />
                        <TextField label="ارجاع به درس" value={mission.lessonRef} onChange={(lessonRef) => updateMission({ lessonRef })} />
                        <TextArea label="زمینه مأموریت" value={mission.context} rows={5} onChange={(context) => updateMission({ context })} />
                        <TextArea label="سؤال تصمیم" value={mission.prompt} rows={3} onChange={(prompt) => updateMission({ prompt })} />

                        <div className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                          <p className="text-xs font-black text-slate-600">گزینه‌ها و پاسخ درست</p>
                          {mission.options.map((option, index) => (
                            <div key={index} className="flex items-start gap-2">
                              <input
                                type="radio"
                                name={`mission-correct-${missionIndex}`}
                                checked={mission.correctIndex === index}
                                onChange={() => updateMission({ correctIndex: index })}
                                className="mt-3"
                              />
                              <textarea
                                value={option}
                                rows={2}
                                onChange={(event) =>
                                  updateMission({
                                    options: mission.options.map((item, itemIndex) =>
                                      itemIndex === index ? event.target.value : item,
                                    ),
                                  })
                                }
                                className="min-h-16 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm leading-7 outline-none focus:border-teal-400"
                              />
                              {mission.options.length > 2 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const options = mission.options.filter((_, itemIndex) => itemIndex !== index);
                                    const correctIndex = Math.min(
                                      mission.correctIndex > index ? mission.correctIndex - 1 : mission.correctIndex,
                                      options.length - 1,
                                    );
                                    updateMission({ options, correctIndex });
                                  }}
                                  className="mt-2 text-rose-700"
                                >
                                  <Trash2 className="size-4" />
                                </button>
                              )}
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => updateMission({ options: [...mission.options, "گزینه جدید"] })}
                            className="inline-flex min-h-10 w-fit items-center gap-2 rounded-xl border border-dashed border-slate-300 bg-white px-3 text-xs font-black"
                          >
                            <Plus className="size-4" /> افزودن گزینه
                          </button>
                        </div>

                        <TextArea label="بازخورد پاسخ درست" value={mission.correctFeedback} rows={3} onChange={(correctFeedback) => updateMission({ correctFeedback })} />
                        <TextArea label="بازخورد پاسخ نادرست" value={mission.incorrectFeedback} rows={3} onChange={(incorrectFeedback) => updateMission({ incorrectFeedback })} />
                        <TextArea label="ثبت در دفترچه تصمیم‌ها" value={mission.deliverable} rows={3} onChange={(deliverable) => updateMission({ deliverable })} />

                        <ProjectMediaEditor
                          media={mission.media ?? []}
                          uploading={uploading}
                          onUpload={uploadMedia}
                          onChange={(media) => updateMission({ media })}
                        />
                      </div>
                    )}
                  </EditorGroup>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function ProjectMissionMedia({ mission }: { mission: ProjectMissionContent }) {
  return <LearningMediaBlocks items={mission.media} />;
}

function ProjectMediaEditor({
  media,
  uploading,
  onUpload,
  onChange,
}: {
  media: LearningMedia[];
  uploading: boolean;
  onUpload: (event: ChangeEvent<HTMLInputElement>) => void;
  onChange: (media: LearningMedia[]) => void;
}) {
  return (
    <div className="grid gap-3 rounded-2xl border border-teal-200 bg-teal-50/60 p-4">
      <p className="text-xs font-black text-teal-800">تصویر و ویدیو این مأموریت</p>
      <label className="inline-flex min-h-11 w-fit cursor-pointer items-center gap-2 rounded-xl border border-dashed border-teal-300 bg-white px-4 text-xs font-black text-teal-800">
        {uploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
        آپلود رسانه
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif,video/mp4,video/webm"
          disabled={uploading}
          className="hidden"
          onChange={onUpload}
        />
      </label>
      {media.map((item, index) => (
        <div key={item.id} className="rounded-xl border border-teal-100 bg-white p-3">
          <div className="flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2 text-xs font-black text-slate-700">
              {item.type === "image" ? <ImageIcon className="size-4" /> : <Video className="size-4" />}
              رسانه {(index + 1).toLocaleString("fa-IR")}
            </span>
            <button
              type="button"
              onClick={() => onChange(media.filter((_, itemIndex) => itemIndex !== index))}
              className="text-xs font-bold text-rose-700"
            >
              حذف از صفحه
            </button>
          </div>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <TextField
              label="متن جایگزین"
              value={item.alt ?? ""}
              onChange={(value) => onChange(media.map((entry, itemIndex) => itemIndex === index ? { ...entry, alt: value } : entry))}
            />
            <TextField
              label="زیرنویس"
              value={item.caption ?? ""}
              onChange={(value) => onChange(media.map((entry, itemIndex) => itemIndex === index ? { ...entry, caption: value } : entry))}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function ProjectHistory({
  revisions,
  onRestore,
}: {
  revisions: LearningContentRevision<IntegratedProjectCmsDocument>[];
  onRestore: (revision: LearningContentRevision<IntegratedProjectCmsDocument>) => void;
}) {
  return (
    <EditorGroup title="تاریخچه انتشار">
      {revisions.length === 0 ? (
        <p className="text-xs leading-6 text-slate-500">هنوز نسخه منتشرشده قبلی ثبت نشده است.</p>
      ) : (
        revisions.map((revision) => (
          <div key={revision.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3">
            <span className="text-xs font-bold text-slate-500">
              {new Date(revision.created_at).toLocaleString("fa-IR")}
            </span>
            <button type="button" onClick={() => onRestore(revision)} className="text-xs font-black text-amber-800">
              بازگردانی به پیش‌نویس
            </button>
          </div>
        ))
      )}
    </EditorGroup>
  );
}

function EditorGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-5">
      <p className="text-xs font-black text-slate-600">{title}</p>
      {children}
    </section>
  );
}

function TextField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
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
  onChange,
}: {
  label: string;
  value: string;
  rows: number;
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
    </label>
  );
}

function ToolbarButton({
  children,
  onClick,
  disabled = false,
  tone = "slate",
}: {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  tone?: "slate" | "sky" | "emerald";
}) {
  const className =
    tone === "sky"
      ? "border-sky-200 bg-sky-50 text-sky-800"
      : tone === "emerald"
        ? "border-emerald-200 bg-emerald-50 text-emerald-800"
        : "border-slate-200 bg-white text-slate-700";
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex min-h-10 items-center gap-2 rounded-xl border px-3 text-xs font-bold disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}

function sanitizeProjectDocument(
  value: IntegratedProjectCmsDocument | null,
  fallback: IntegratedProjectCmsDocument,
): IntegratedProjectCmsDocument {
  if (!value || !Array.isArray(value.missions)) return fallback;

  return {
    version: 1,
    title: typeof value.title === "string" ? value.title : fallback.title,
    subtitle: typeof value.subtitle === "string" ? value.subtitle : fallback.subtitle,
    missions: fallback.missions.map((fallbackMission, index) => {
      const incoming = value.missions[index];
      if (!incoming || typeof incoming !== "object") return fallbackMission;
      const options = Array.isArray(incoming.options) && incoming.options.length >= 2
        ? incoming.options.map(String)
        : fallbackMission.options;
      const correctIndex = Number.isInteger(incoming.correctIndex)
        ? Math.min(Math.max(incoming.correctIndex, 0), options.length - 1)
        : fallbackMission.correctIndex;

      return {
        ...fallbackMission,
        ...incoming,
        title: stringOr(incoming.title, fallbackMission.title),
        lessonRef: stringOr(incoming.lessonRef, fallbackMission.lessonRef),
        prompt: stringOr(incoming.prompt, fallbackMission.prompt),
        context: stringOr(incoming.context, fallbackMission.context),
        options,
        correctIndex,
        correctFeedback: stringOr(incoming.correctFeedback, fallbackMission.correctFeedback),
        incorrectFeedback: stringOr(incoming.incorrectFeedback, fallbackMission.incorrectFeedback),
        deliverable: stringOr(incoming.deliverable, fallbackMission.deliverable),
        media: Array.isArray(incoming.media) ? incoming.media : [],
      };
    }),
  };
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function stringOr(value: unknown, fallback: string) {
  return typeof value === "string" ? value : fallback;
}
