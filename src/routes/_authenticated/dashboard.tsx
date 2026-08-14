import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  BadgeDollarSign,
  CheckCircle2,
  CloudUpload,
  Download,
  FileBarChart,
  FileText,
  FolderKanban,
  Loader2,
  MessageSquare,
  RefreshCw,
  Send,
  Users2,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import { projectStages } from "@/lib/content";
import { useAuth, useProfile } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

import {
  formatDate,
  listMyProjects,
  projectErrorMessage,
  shortId,
  statusLabel,
  statusToStage,
  type ProjectRow,
} from "@/lib/projects";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      {
        title:
          "داشبورد پژوهشگر هاب‌ژن | مدیریت پروژه‌های بیوانفورماتیک",
      },
      {
        name: "description",
        content:
          "پیگیری مراحل پروژه، بارگذاری داده، پیام‌ها، جلسات مشاوره، گزارش‌ها، نتایج و پرداخت‌ها در یک داشبورد پژوهشی.",
      },
      {
        property: "og:title",
        content: "داشبورد پژوهشگر",
      },
      {
        property: "og:description",
        content:
          "از ثبت پروژه تا تحویل نتایج، همه چیز در یک محیط قابل پیگیری.",
      },
    ],
  }),

  component: Dashboard,
});

type ProjectMessageRow = {
  id: string;
  project_id: string;
  sender_id: string;
  message: string;
  created_at: string;
};

type ProjectFileRow = {
  id: string;
  project_id: string;
  uploader_id: string;
  bucket_id: string;
  storage_path: string;
  original_name: string;
  mime_type: string | null;
  size_bytes: number;
  category: string;
  created_at: string;
};

const PROJECT_FILES_BUCKET = "project-files";

/*
 * Standard browser upload is intentionally limited
 * to 6 MB for this phase.
 * Large sequencing data will later use resumable uploads.
 */
const MAX_STANDARD_UPLOAD_BYTES =
  6 * 1024 * 1024;

function StageTracker({
  stage,
}: {
  stage: number;
}) {
  return (
    <div className="mt-4">
      <Progress
        value={
          (stage /
            projectStages.length) *
          100
        }
        className="h-1.5"
      />

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
        {projectStages.map(
          (stageName, index) => (
            <span
              key={stageName}
              className={`text-[11px] ${
                index < stage
                  ? "font-semibold text-primary"
                  : "text-muted-foreground"
              }`}
            >
              {index < stage
                ? "● "
                : "○ "}
              {stageName}
            </span>
          ),
        )}
      </div>
    </div>
  );
}

function Dashboard() {
  const { user } = useAuth();

  const profile =
    useProfile(user?.id);

  const displayName =
    profile?.full_name?.trim() ||
    user?.email ||
    "پژوهشگر";

  /*
   * Projects
   */
  const [projects, setProjects] =
    useState<ProjectRow[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [loadError, setLoadError] =
    useState<string | null>(null);

  const [active, setActive] =
    useState<string | null>(null);

  /*
   * Real messages
   */
  const [
    projectMessages,
    setProjectMessages,
  ] = useState<ProjectMessageRow[]>(
    [],
  );

  const [
    messagesLoading,
    setMessagesLoading,
  ] = useState(false);

  const [
    messageText,
    setMessageText,
  ] = useState("");

  const [
    sendingMessage,
    setSendingMessage,
  ] = useState(false);

  /*
   * Real project files
   */
  const [
    projectFiles,
    setProjectFiles,
  ] = useState<ProjectFileRow[]>([]);

  const [
    filesLoading,
    setFilesLoading,
  ] = useState(false);

  const [
    uploadingFile,
    setUploadingFile,
  ] = useState(false);

  const [
    downloadingFileId,
    setDownloadingFileId,
  ] = useState<string | null>(
    null,
  );

  const [
    totalFileCount,
    setTotalFileCount,
  ] = useState(0);

  const fileInputRef =
    useRef<HTMLInputElement | null>(
      null,
    );

  /*
   * Load real projects
   */
  useEffect(() => {
    if (!user?.id) return;

    let mounted = true;

    setLoading(true);

    listMyProjects(user.id)
      .then(async ({ data, error }) => {
        if (!mounted) return;

        if (error) {
          setLoadError(
            projectErrorMessage(
              error.message,
            ),
          );
          return;
        }

        const rows =
          (data ??
            []) as ProjectRow[];

        setLoadError(null);
        setProjects(rows);

        setActive(
          (previous) =>
            previous ??
            rows[0]?.id ??
            null,
        );

        /*
         * Count all files belonging
         * to all projects of this user.
         */
        if (rows.length === 0) {
          setTotalFileCount(0);
          return;
        }

        const projectIds =
          rows.map(
            (project) =>
              project.id,
          );

        const {
          count,
          error: countError,
        } = await supabase
          .from("project_files")
          .select("id", {
            count: "exact",
            head: true,
          })
          .in(
            "project_id",
            projectIds,
          );

        if (
          mounted &&
          !countError
        ) {
          setTotalFileCount(
            count ?? 0,
          );
        }
      })
      .catch(
        (error: unknown) => {
          if (!mounted) return;

          setLoadError(
            projectErrorMessage(
              error instanceof Error
                ? error.message
                : "",
            ),
          );
        },
      )
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [user?.id]);

  const current =
    projects.find(
      (project) =>
        project.id === active,
    ) ??
    projects[0] ??
    null;

  const activeCount =
    projects.filter(
      (project) =>
        project.status !==
          "completed" &&
        project.status !==
          "cancelled",
    ).length;

  /*
   * =========================
   * PROJECT MESSAGES
   * =========================
   */

  const loadMessages = async (
    projectId: string,
  ) => {
    setMessagesLoading(true);

    const { data, error } =
      await supabase
        .from(
          "project_messages",
        )
        .select("*")
        .eq(
          "project_id",
          projectId,
        )
        .order("created_at", {
          ascending: true,
        });

    if (error) {
      setProjectMessages([]);
      setMessagesLoading(false);

      toast.error(
        "دریافت پیام‌های پروژه انجام نشد.",
      );

      return;
    }

    setProjectMessages(
      (data ??
        []) as ProjectMessageRow[],
    );

    setMessagesLoading(false);
  };

  const sendMessage = async () => {
    if (!current || !user)
      return;

    const cleanMessage =
      messageText.trim();

    if (!cleanMessage) return;

    setSendingMessage(true);

    const { data, error } =
      await supabase
        .from(
          "project_messages",
        )
        .insert({
          project_id:
            current.id,
          sender_id: user.id,
          message: cleanMessage,
        })
        .select("*")
        .single();

    if (error) {
      toast.error(
        "ارسال پیام انجام نشد.",
      );

      setSendingMessage(false);
      return;
    }

    setProjectMessages(
      (previous) => [
        ...previous,
        data as ProjectMessageRow,
      ],
    );

    setMessageText("");
    setSendingMessage(false);

    toast.success(
      "پیام شما ارسال شد.",
    );
  };

  /*
   * =========================
   * PROJECT FILES
   * =========================
   */

  const loadFiles = async (
    projectId: string,
  ) => {
    setFilesLoading(true);

    const { data, error } =
      await supabase
        .from("project_files")
        .select("*")
        .eq(
          "project_id",
          projectId,
        )
        .order("created_at", {
          ascending: false,
        });

    if (error) {
      setProjectFiles([]);
      setFilesLoading(false);

      toast.error(
        "دریافت فایل‌های پروژه انجام نشد.",
      );

      return;
    }

    setProjectFiles(
      (data ??
        []) as ProjectFileRow[],
    );

    setFilesLoading(false);
  };

  /*
   * When selected project changes,
   * load its files and messages.
   */
  useEffect(() => {
    if (!current?.id) {
      setProjectMessages([]);
      setProjectFiles([]);
      setMessageText("");
      return;
    }

    setProjectMessages([]);
    setProjectFiles([]);
    setMessageText("");

    loadMessages(current.id);
    loadFiles(current.id);
  }, [current?.id]);

  /*
   * Upload selected file
   */
  const uploadProjectFile =
    async (file: File) => {
      if (!current || !user) {
        toast.error(
          "ابتدا وارد حساب کاربری شوید.",
        );
        return;
      }

      if (
        file.size >
        MAX_STANDARD_UPLOAD_BYTES
      ) {
        toast.error(
          "در این نسخه، آپلود مستقیم تا ۶ مگابایت پشتیبانی می‌شود. برای فایل‌های بزرگ‌تر بعداً آپلود Resumable اضافه می‌کنیم.",
        );
        return;
      }

      if (file.size <= 0) {
        toast.error(
          "فایل انتخاب‌شده خالی است.",
        );
        return;
      }

      setUploadingFile(true);

      /*
       * Keep storage name random and safe.
       * Original file name is saved separately
       * in project_files.
       */
      const extension =
        safeExtension(
          file.name,
        );

      const storagePath =
        `${current.id}/` +
        `${crypto.randomUUID()}` +
        `${extension}`;

      const {
        error: storageError,
      } = await supabase.storage
        .from(
          PROJECT_FILES_BUCKET,
        )
        .upload(
          storagePath,
          file,
          {
            cacheControl: "3600",
            upsert: false,
            contentType:
              file.type ||
              undefined,
          },
        );

      if (storageError) {
        console.error(
          storageError,
        );

        toast.error(
          "آپلود فایل انجام نشد.",
        );

        setUploadingFile(false);
        return;
      }

      const {
        data: metadata,
        error: metadataError,
      } = await supabase
        .from("project_files")
        .insert({
          project_id:
            current.id,
          uploader_id: user.id,
          bucket_id:
            PROJECT_FILES_BUCKET,
          storage_path:
            storagePath,
          original_name:
            file.name,
          mime_type:
            file.type || null,
          size_bytes:
            file.size,
          category: "data",
        })
        .select("*")
        .single();

      if (metadataError) {
        console.error(
          metadataError,
        );

        toast.error(
          "فایل آپلود شد اما ثبت اطلاعات آن با خطا مواجه شد.",
        );

        setUploadingFile(false);
        return;
      }

      setProjectFiles(
        (previous) => [
          metadata as ProjectFileRow,
          ...previous,
        ],
      );

      setTotalFileCount(
        (previous) =>
          previous + 1,
      );

      toast.success(
        "فایل با موفقیت بارگذاری شد.",
      );

      setUploadingFile(false);
    };

  const handleFileInputChange =
    async (
      event: React.ChangeEvent<HTMLInputElement>,
    ) => {
      const file =
        event.target.files?.[0];

      /*
       * Reset the input so the same
       * file can be selected again later.
       */
      event.target.value = "";

      if (!file) return;

      await uploadProjectFile(
        file,
      );
    };

  /*
   * Download a private file.
   *
   * Supabase Storage.download()
   * uses the authenticated session,
   * therefore our RLS policies still apply.
   */
  const downloadProjectFile =
    async (
      file: ProjectFileRow,
    ) => {
      setDownloadingFileId(
        file.id,
      );

      const {
        data,
        error,
      } = await supabase.storage
        .from(file.bucket_id)
        .download(
          file.storage_path,
        );

      if (error || !data) {
        console.error(error);

        toast.error(
          "دانلود فایل انجام نشد.",
        );

        setDownloadingFileId(
          null,
        );

        return;
      }

      const objectUrl =
        URL.createObjectURL(data);

      const anchor =
        document.createElement(
          "a",
        );

      anchor.href = objectUrl;
      anchor.download =
        file.original_name;

      document.body.appendChild(
        anchor,
      );

      anchor.click();

      anchor.remove();

      URL.revokeObjectURL(
        objectUrl,
      );

      setDownloadingFileId(
        null,
      );
    };

  return (
    <div className="mx-auto max-w-7xl px-4 py-14">
      {/* =========================
          HEADER
      ========================= */}

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl text-navy">
            داشبورد پژوهشگر
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            خوش آمدید،{" "}
            {displayName}
          </p>
        </div>

        <Button
          asChild
          variant="hero"
        >
          <Link to="/wizard">
            ثبت پروژه جدید
          </Link>
        </Button>
      </div>

      {/* =========================
          REAL / DEMO STATISTICS
      ========================= */}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            icon: FolderKanban,
            label:
              "پروژه‌های فعال",
            value:
              new Intl.NumberFormat(
                "fa-IR",
              ).format(
                activeCount,
              ),
          },
          {
            icon: CloudUpload,
            label:
              "فایل‌های بارگذاری‌شده",
            value:
              new Intl.NumberFormat(
                "fa-IR",
              ).format(
                totalFileCount,
              ),
          },
          {
            icon: Users2,
            label:
              "جلسات مشاوره",
            value: "۵",
          },
          {
            icon: FileBarChart,
            label:
              "گزارش‌های تحویل‌شده",
            value: "۳",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="card-elevated p-5"
          >
            <stat.icon className="size-5 text-primary" />

            <p className="mt-3 text-2xl font-extrabold text-navy">
              {stat.value}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* =========================
          ERROR
      ========================= */}

      {loadError && (
        <p className="mt-6 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {loadError}
        </p>
      )}

      {/* =========================
          PROJECT AREA
      ========================= */}

      {loading ? (
        <div className="mt-8 flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />

          در حال بارگذاری
          پروژه‌ها…
        </div>
      ) : projects.length ===
        0 ? (
        <div className="card-elevated mt-8 p-12 text-center">
          <FolderKanban className="mx-auto size-8 text-primary" />

          <p className="mt-4 text-base font-bold text-navy">
            هنوز پروژه‌ای ثبت
            نکرده‌اید.
          </p>

          <p className="mt-2 text-xs text-muted-foreground">
            با طراح پروژه پژوهشی،
            اولین پروژه بیوانفورماتیک
            خود را ثبت کنید.
          </p>

          <Button
            asChild
            variant="hero"
            className="mt-6"
          >
            <Link to="/wizard">
              ثبت پروژه جدید
            </Link>
          </Button>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 lg:grid-cols-[320px_1fr]">
          {/* =========================
              PROJECT LIST
          ========================= */}

          <aside className="card-elevated h-fit p-5">
            <h2 className="text-sm font-bold text-navy">
              پروژه‌های من
            </h2>

            <ul className="mt-4 space-y-2">
              {projects.map(
                (project) => (
                  <li
                    key={
                      project.id
                    }
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setActive(
                          project.id,
                        )
                      }
                      className={`w-full rounded-xl border p-3 text-start transition-colors ${
                        current?.id ===
                        project.id
                          ? "border-primary bg-accent/60"
                          : "border-border hover:bg-secondary"
                      }`}
                    >
                      <span
                        className="block text-[11px] text-muted-foreground"
                        dir="ltr"
                      >
                        {shortId(
                          project.id,
                        )}
                      </span>

                      <span className="mt-1 block text-sm font-semibold leading-6 text-navy">
                        {
                          project.title
                        }
                      </span>

                      <span className="mt-1 block text-[11px] text-primary">
                        {project.analysis_type ??
                          "—"}
                      </span>
                    </button>
                  </li>
                ),
              )}
            </ul>
          </aside>

          {/* =========================
              CURRENT PROJECT
          ========================= */}

          <section className="card-elevated p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-lg text-navy">
                  {current!.title}
                </h2>

                <p className="mt-1 text-xs text-muted-foreground">
                  <span dir="ltr">
                    {shortId(
                      current!.id,
                    )}
                  </span>

                  {" · "}

                  {current!
                    .analysis_type ??
                    "—"}

                  {" · ثبت "}

                  {formatDate(
                    current!
                      .created_at,
                  )}

                  {" · آخرین بروزرسانی "}

                  {formatDate(
                    current!
                      .updated_at,
                  )}
                </p>
              </div>

              <span className="rounded-full bg-accent px-3 py-1 text-[11px] font-semibold text-accent-foreground">
                {statusLabel(
                  current!.status,
                )}
              </span>
            </div>

            <StageTracker
              stage={statusToStage(
                current!.status,
              )}
            />

            <Tabs
              defaultValue="files"
              className="mt-8"
            >
              <TabsList className="flex-wrap">
                <TabsTrigger value="files">
                  داده‌ها
                </TabsTrigger>

                <TabsTrigger value="messages">
                  پیام‌ها
                </TabsTrigger>

                <TabsTrigger value="consults">
                  مشاوره‌ها
                </TabsTrigger>

                <TabsTrigger value="reports">
                  گزارش‌ها
                </TabsTrigger>

                <TabsTrigger value="results">
                  نتایج
                </TabsTrigger>

                <TabsTrigger value="payments">
                  پرداخت‌ها
                </TabsTrigger>
              </TabsList>

              {/* =================================================
                  REAL PROJECT FILES
              ================================================= */}

              <TabsContent
                value="files"
                className="mt-5"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={
                    handleFileInputChange
                  }
                />

                <div className="rounded-2xl border border-dashed border-primary/40 bg-accent/30 p-8 text-center">
                  <CloudUpload className="mx-auto size-7 text-primary" />

                  <p className="mt-3 text-sm font-semibold text-navy">
                    بارگذاری داده پروژه
                  </p>

                  <p className="mx-auto mt-1 max-w-xl text-xs leading-6 text-muted-foreground">
                    برای فایل‌های
                    متادیتا، CSV، Excel،
                    ماتریس‌های داده و
                    فایل‌های کوچک پژوهشی.
                    در این مرحله حداکثر
                    حجم آپلود مستقیم ۶
                    مگابایت است.
                  </p>

                  <Button
                    variant="soft"
                    className="mt-4"
                    disabled={
                      uploadingFile
                    }
                    onClick={() =>
                      fileInputRef.current?.click()
                    }
                  >
                    {uploadingFile ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        در حال
                        بارگذاری…
                      </>
                    ) : (
                      <>
                        <CloudUpload className="size-4" />
                        انتخاب فایل
                      </>
                    )}
                  </Button>

                  <p className="mt-3 text-[11px] text-muted-foreground">
                    برای FASTQ، BAM و
                    فایل‌های حجیم توالی‌یابی
                    مسیر آپلود جداگانه اضافه
                    خواهد شد.
                  </p>
                </div>

                <div className="mt-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-bold text-navy">
                        فایل‌های این
                        پروژه
                      </h3>

                      <p className="mt-1 text-xs text-muted-foreground">
                        فایل‌ها خصوصی
                        هستند و فقط شما و
                        مدیریت هاب‌ژن به
                        آن‌ها دسترسی دارید.
                      </p>
                    </div>

                    <button
                      type="button"
                      disabled={
                        filesLoading
                      }
                      onClick={() =>
                        current &&
                        loadFiles(
                          current.id,
                        )
                      }
                      className="inline-flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-xs text-muted-foreground transition-colors hover:bg-secondary disabled:opacity-50"
                    >
                      <RefreshCw
                        className={`size-4 ${
                          filesLoading
                            ? "animate-spin"
                            : ""
                        }`}
                      />

                      بروزرسانی
                    </button>
                  </div>

                  {filesLoading ? (
                    <div className="mt-4 flex items-center justify-center gap-2 rounded-2xl border border-border py-12 text-sm text-muted-foreground">
                      <Loader2 className="size-4 animate-spin" />

                      در حال دریافت
                      فایل‌ها…
                    </div>
                  ) : projectFiles.length ===
                    0 ? (
                    <div className="mt-4 rounded-2xl border border-border p-10 text-center">
                      <FileText className="mx-auto size-7 text-primary/60" />

                      <p className="mt-3 text-sm font-bold text-navy">
                        هنوز فایلی
                        بارگذاری نشده
                        است.
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        اولین فایل این
                        پروژه را از بخش
                        بالا بارگذاری کنید.
                      </p>
                    </div>
                  ) : (
                    <div className="mt-4 overflow-hidden rounded-2xl border border-border">
                      <ul className="divide-y divide-border">
                        {projectFiles.map(
                          (file) => (
                            <li
                              key={
                                file.id
                              }
                              className="flex flex-wrap items-center justify-between gap-4 p-4"
                            >
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <FileText className="size-4 shrink-0 text-primary" />

                                  <p
                                    className="truncate text-sm font-semibold text-navy"
                                    dir="auto"
                                  >
                                    {
                                      file.original_name
                                    }
                                  </p>
                                </div>

                                <p className="mt-1 text-[11px] text-muted-foreground">
                                  {formatFileSize(
                                    file.size_bytes,
                                  )}

                                  {" · "}

                                  {file.mime_type ||
                                    "نوع فایل نامشخص"}

                                  {" · "}

                                  {formatDateTime(
                                    file.created_at,
                                  )}
                                </p>
                              </div>

                              <button
                                type="button"
                                disabled={
                                  downloadingFileId ===
                                  file.id
                                }
                                onClick={() =>
                                  downloadProjectFile(
                                    file,
                                  )
                                }
                                className="inline-flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-xs font-semibold text-navy transition-colors hover:border-primary hover:bg-accent disabled:opacity-50"
                              >
                                {downloadingFileId ===
                                file.id ? (
                                  <Loader2 className="size-4 animate-spin" />
                                ) : (
                                  <Download className="size-4 text-primary" />
                                )}

                                دانلود
                              </button>
                            </li>
                          ),
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* =================================================
                  REAL PROJECT MESSAGES
              ================================================= */}

              <TabsContent
                value="messages"
                className="mt-5"
              >
                <div className="rounded-2xl border border-border">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4">
                    <div>
                      <h3 className="flex items-center gap-2 text-sm font-bold text-navy">
                        <MessageSquare className="size-4 text-primary" />

                        گفت‌وگوی پروژه
                      </h3>

                      <p className="mt-1 text-xs text-muted-foreground">
                        ارتباط مستقیم
                        شما با تیم هاب‌ژن
                        درباره همین پروژه
                      </p>
                    </div>

                    <button
                      type="button"
                      disabled={
                        messagesLoading
                      }
                      onClick={() =>
                        current &&
                        loadMessages(
                          current.id,
                        )
                      }
                      className="inline-flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-xs text-muted-foreground transition-colors hover:bg-secondary disabled:opacity-50"
                    >
                      <RefreshCw
                        className={`size-4 ${
                          messagesLoading
                            ? "animate-spin"
                            : ""
                        }`}
                      />

                      بروزرسانی
                    </button>
                  </div>

                  <div className="min-h-[220px] bg-secondary/10 p-4">
                    {messagesLoading ? (
                      <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
                        <Loader2 className="size-4 animate-spin" />

                        در حال دریافت
                        پیام‌ها…
                      </div>
                    ) : projectMessages.length ===
                      0 ? (
                      <div className="py-14 text-center">
                        <MessageSquare className="mx-auto size-8 text-primary/50" />

                        <p className="mt-4 text-sm font-bold text-navy">
                          هنوز پیامی ثبت
                          نشده است.
                        </p>

                        <p className="mt-2 text-xs text-muted-foreground">
                          پیام‌های مدیریت
                          هاب‌ژن درباره این
                          پروژه در این
                          قسمت نمایش داده
                          می‌شوند.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {projectMessages.map(
                          (
                            message,
                          ) => {
                            const isMine =
                              message.sender_id ===
                              user?.id;

                            return (
                              <div
                                key={
                                  message.id
                                }
                                className={`max-w-3xl rounded-2xl border p-4 ${
                                  isMine
                                    ? "mr-auto border-primary/20 bg-accent/40"
                                    : "ml-auto border-border bg-background"
                                }`}
                              >
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                  <span className="text-xs font-bold text-navy">
                                    {isMine
                                      ? "شما"
                                      : "مدیریت هاب‌ژن"}
                                  </span>

                                  <span className="text-[11px] text-muted-foreground">
                                    {formatDateTime(
                                      message.created_at,
                                    )}
                                  </span>
                                </div>

                                <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-navy-soft">
                                  {
                                    message.message
                                  }
                                </p>
                              </div>
                            );
                          },
                        )}
                      </div>
                    )}
                  </div>

                  <div className="border-t border-border p-4">
                    <label
                      htmlFor="researcher-message"
                      className="text-sm font-bold text-navy"
                    >
                      پاسخ به تیم هاب‌ژن
                    </label>

                    <p className="mt-1 text-xs text-muted-foreground">
                      پیام شما فقط در
                      همین پروژه ثبت خواهد
                      شد.
                    </p>

                    <textarea
                      id="researcher-message"
                      value={
                        messageText
                      }
                      onChange={(
                        event,
                      ) =>
                        setMessageText(
                          event
                            .target
                            .value,
                        )
                      }
                      rows={4}
                      maxLength={5000}
                      placeholder="پیام خود را درباره این پروژه بنویسید..."
                      className="mt-3 w-full resize-y rounded-2xl border border-border bg-background px-4 py-3 text-sm leading-7 text-navy outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
                    />

                    <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                      <span className="text-[11px] text-muted-foreground">
                        {new Intl.NumberFormat(
                          "fa-IR",
                        ).format(
                          messageText.length,
                        )}

                        {" / "}

                        ۵۰۰۰ کاراکتر
                      </span>

                      <button
                        type="button"
                        disabled={
                          sendingMessage ||
                          !messageText.trim()
                        }
                        onClick={
                          sendMessage
                        }
                        className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {sendingMessage ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <Send className="size-4" />
                        )}

                        ارسال پیام
                      </button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* =================================================
                  CONSULTATIONS — DEMO FOR NOW
              ================================================= */}

              <TabsContent
                value="consults"
                className="mt-5 space-y-3"
              >
                <div className="rounded-2xl border border-border p-4">
                  <p className="text-sm font-bold text-navy">
                    مشاوره طراحی پژوهش
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    ۹۰ دقیقه · برگزار
                    شده · سند طرح مطالعه
                    تحویل شد
                  </p>
                </div>

                <div className="rounded-2xl border border-border p-4">
                  <p className="text-sm font-bold text-navy">
                    جلسه تفسیر نتایج
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    ۴۵ دقیقه · در انتظار
                    زمان‌بندی
                  </p>
                </div>

                <Button
                  asChild
                  variant="outline"
                >
                  <Link to="/consultation">
                    رزرو جلسه جدید
                  </Link>
                </Button>
              </TabsContent>

              {/* =================================================
                  REPORTS — DEMO FOR NOW
              ================================================= */}

              <TabsContent
                value="reports"
                className="mt-5 space-y-3"
              >
                {[
                  "گزارش کنترل کیفیت داده",
                  "گزارش تحلیل بیان افتراقی",
                  "گزارش غنی‌سازی مسیرها",
                ].map(
                  (report) => (
                    <div
                      key={
                        report
                      }
                      className="flex items-center justify-between rounded-2xl border border-border p-4"
                    >
                      <span className="flex items-center gap-2 text-sm text-navy">
                        <FileBarChart className="size-4 text-primary" />

                        {
                          report
                        }
                      </span>

                      <Button
                        variant="ghost"
                        size="sm"
                      >
                        دانلود PDF
                      </Button>
                    </div>
                  ),
                )}
              </TabsContent>

              {/* =================================================
                  RESULTS — DEMO FOR NOW
              ================================================= */}

              <TabsContent
                value="results"
                className="mt-5"
              >
                <div className="grid gap-4 sm:grid-cols-3">
                  {[
                    "Volcano plot",
                    "PCA نمونه‌ها",
                    "Heatmap ۵۰ ژن برتر",
                  ].map(
                    (result) => (
                      <div
                        key={
                          result
                        }
                        className="rounded-2xl border border-border p-4"
                      >
                        <div className="h-24 rounded-xl bg-[image:var(--gradient-primary)] opacity-25" />

                        <p className="mt-3 text-sm font-semibold text-navy">
                          {
                            result
                          }
                        </p>

                        <p className="mt-1 text-[11px] text-muted-foreground">
                          خروجی وکتور،
                          آماده انتشار
                        </p>
                      </div>
                    ),
                  )}
                </div>
              </TabsContent>

              {/* =================================================
                  PAYMENTS — DEMO FOR NOW
              ================================================= */}

              <TabsContent
                value="payments"
                className="mt-5 space-y-3"
              >
                {[
                  [
                    "فاز طراحی مطالعه",
                    "تسویه شده",
                  ],
                  [
                    "فاز تحلیل اولیه",
                    "تسویه شده",
                  ],
                  [
                    "فاز تفسیر و مصورسازی",
                    "در انتظار پرداخت",
                  ],
                ].map(
                  ([
                    title,
                    status,
                  ]) => (
                    <div
                      key={
                        title
                      }
                      className="flex items-center justify-between rounded-2xl border border-border p-4"
                    >
                      <span className="flex items-center gap-2 text-sm text-navy">
                        <BadgeDollarSign className="size-4 text-primary" />

                        {
                          title
                        }
                      </span>

                      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        {status ===
                          "تسویه شده" && (
                          <CheckCircle2 className="size-4 text-primary" />
                        )}

                        {
                          status
                        }
                      </span>
                    </div>
                  ),
                )}
              </TabsContent>
            </Tabs>
          </section>
        </div>
      )}
    </div>
  );
}

function formatDateTime(
  iso: string,
) {
  try {
    return new Intl.DateTimeFormat(
      "fa-IR",
      {
        dateStyle: "medium",
        timeStyle: "short",
      },
    ).format(
      new Date(iso),
    );
  } catch {
    return iso;
  }
}

function formatFileSize(
  bytes: number,
) {
  if (
    !Number.isFinite(bytes) ||
    bytes <= 0
  ) {
    return "۰ بایت";
  }

  const units = [
    "بایت",
    "کیلوبایت",
    "مگابایت",
    "گیگابایت",
  ];

  let value = bytes;
  let unitIndex = 0;

  while (
    value >= 1024 &&
    unitIndex <
      units.length - 1
  ) {
    value /= 1024;
    unitIndex += 1;
  }

  const formatted =
    new Intl.NumberFormat(
      "fa-IR",
      {
        maximumFractionDigits:
          unitIndex === 0
            ? 0
            : 1,
      },
    ).format(value);

  return `${formatted} ${units[unitIndex]}`;
}

function safeExtension(
  fileName: string,
) {
  const lastDot =
    fileName.lastIndexOf(".");

  if (
    lastDot <= 0 ||
    lastDot ===
      fileName.length - 1
  ) {
    return "";
  }

  const rawExtension =
    fileName
      .slice(lastDot + 1)
      .toLowerCase()
      .replace(
        /[^a-z0-9]/g,
        "",
      )
      .slice(0, 12);

  return rawExtension
    ? `.${rawExtension}`
    : "";
}
