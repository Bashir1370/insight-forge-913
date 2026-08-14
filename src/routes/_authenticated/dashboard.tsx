import { createFileRoute, Link } from "@tanstack/react-router";
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import {
  BadgeDollarSign,
  CalendarClock,
  CheckCircle2,
  CloudUpload,
  Download,
  ExternalLink,
  FileBarChart,
  FileText,
  FolderKanban,
  Image,
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
          "پیگیری پروژه، داده‌ها، پیام‌ها، مشاوره‌ها، گزارش‌ها و نتایج در داشبورد پژوهشگر هاب‌ژن.",
      },
      {
        property: "og:title",
        content: "داشبورد پژوهشگر",
      },
    ],
  }),

  component: Dashboard,
});

/*
 * ========================================
 * TYPES
 * ========================================
 */

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

type ConsultationRow = {
  id: string;
  user_id: string;
  project_id: string | null;
  consultation_type: string;
  subject: string;
  description: string | null;
  status: string;
  scheduled_at: string | null;
  duration_minutes: number | null;
  meeting_url: string | null;
  admin_note: string | null;
  created_at: string;
  updated_at: string;
};

/*
 * ========================================
 * CONSTANTS
 * ========================================
 */

const PROJECT_FILES_BUCKET = "project-files";

const MAX_STANDARD_UPLOAD_BYTES =
  6 * 1024 * 1024;

const consultationTypeLabels: Record<string, string> = {
  initial: "بررسی اولیه پروژه",
  research_design: "طراحی پژوهش",
  bioinformatics: "مشاوره بیوانفورماتیک",
  results_interpretation: "تفسیر نتایج",
  custom: "مشاوره سفارشی",
};

const consultationStatusLabels: Record<string, string> = {
  requested: "درخواست ثبت شده",
  reviewing: "در حال بررسی",
  scheduled: "زمان‌بندی شده",
  completed: "برگزار شده",
  cancelled: "لغو شده",
};

/*
 * ========================================
 * STAGE TRACKER
 * ========================================
 */

function StageTracker({
  stage,
}: {
  stage: number;
}) {
  return (
    <div className="mt-4">
      <Progress
        value={
          (stage / projectStages.length) * 100
        }
        className="h-1.5"
      />

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
        {projectStages.map((stageName, index) => (
          <span
            key={stageName}
            className={`text-[11px] ${
              index < stage
                ? "font-semibold text-primary"
                : "text-muted-foreground"
            }`}
          >
            {index < stage ? "● " : "○ "}
            {stageName}
          </span>
        ))}
      </div>
    </div>
  );
}

/*
 * ========================================
 * DASHBOARD
 * ========================================
 */

function Dashboard() {
  const { user } = useAuth();

  const profile = useProfile(user?.id);

  const displayName =
    profile?.full_name?.trim() ||
    user?.email ||
    "پژوهشگر";

  /*
   * PROJECTS
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
   * MESSAGES
   */

  const [
    projectMessages,
    setProjectMessages,
  ] = useState<ProjectMessageRow[]>([]);

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
   * FILES
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
  ] = useState<string | null>(null);

  const [
    totalFileCount,
    setTotalFileCount,
  ] = useState(0);

  const [
    totalReportCount,
    setTotalReportCount,
  ] = useState(0);

  const fileInputRef =
    useRef<HTMLInputElement | null>(null);

  /*
   * CONSULTATIONS
   */

  const [
    consultations,
    setConsultations,
  ] = useState<ConsultationRow[]>([]);

  const [
    consultationsLoading,
    setConsultationsLoading,
  ] = useState(false);

  /*
   * ========================================
   * LOAD PROJECTS + COUNTS
   * ========================================
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
          (data ?? []) as ProjectRow[];

        setProjects(rows);
        setLoadError(null);

        setActive(
          (previous) =>
            previous ??
            rows[0]?.id ??
            null,
        );

        if (rows.length === 0) {
          setTotalFileCount(0);
          setTotalReportCount(0);
          return;
        }

        const projectIds = rows.map(
          (project) => project.id,
        );

        const [
          fileCountResult,
          reportCountResult,
        ] = await Promise.all([
          supabase
            .from("project_files")
            .select("id", {
              count: "exact",
              head: true,
            })
            .in(
              "project_id",
              projectIds,
            ),

          supabase
            .from("project_files")
            .select("id", {
              count: "exact",
              head: true,
            })
            .in(
              "project_id",
              projectIds,
            )
            .eq(
              "category",
              "report",
            ),
        ]);

        if (!mounted) return;

        if (!fileCountResult.error) {
          setTotalFileCount(
            fileCountResult.count ?? 0,
          );
        }

        if (!reportCountResult.error) {
          setTotalReportCount(
            reportCountResult.count ?? 0,
          );
        }
      })
      .catch((error: unknown) => {
        if (!mounted) return;

        setLoadError(
          projectErrorMessage(
            error instanceof Error
              ? error.message
              : "",
          ),
        );
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [user?.id]);

  /*
   * ========================================
   * LOAD ALL USER CONSULTATIONS
   * ========================================
   */

  const loadConsultations = async () => {
    if (!user?.id) return;

    setConsultationsLoading(true);

    const { data, error } = await supabase
      .from("consultations")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error(error);

      setConsultations([]);
      setConsultationsLoading(false);

      toast.error(
        "دریافت درخواست‌های مشاوره انجام نشد.",
      );

      return;
    }

    setConsultations(
      (data ?? []) as ConsultationRow[],
    );

    setConsultationsLoading(false);
  };

  useEffect(() => {
    if (!user?.id) return;

    loadConsultations();
  }, [user?.id]);

  /*
   * ========================================
   * CURRENT PROJECT
   * ========================================
   */

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
        project.status !== "completed" &&
        project.status !== "cancelled",
    ).length;

  /*
   * Consultations related to current project
   * plus general consultations.
   */

  const currentConsultations =
    current
      ? consultations.filter(
          (consultation) =>
            consultation.project_id === current.id ||
            consultation.project_id === null,
        )
      : consultations;

  /*
   * FILE CATEGORIES
   */

  const dataFiles =
    projectFiles.filter(
      (file) =>
        file.category === "data" ||
        file.category === "other",
    );

  const reportFiles =
    projectFiles.filter(
      (file) =>
        file.category === "report",
    );

  const resultFiles =
    projectFiles.filter(
      (file) =>
        file.category === "result",
    );

  /*
   * ========================================
   * MESSAGES
   * ========================================
   */

  const loadMessages = async (
    projectId: string,
  ) => {
    setMessagesLoading(true);

    const { data, error } =
      await supabase
        .from("project_messages")
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
        .from("project_messages")
        .insert({
          project_id: current.id,
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
   * ========================================
   * FILES
   * ========================================
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
   * Reload project resources when
   * selected project changes.
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
   * ========================================
   * RESEARCHER FILE UPLOAD
   * ========================================
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
          "در این نسخه، آپلود مستقیم تا ۶ مگابایت پشتیبانی می‌شود.",
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

      const extension =
        safeExtension(file.name);

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
          project_id: current.id,
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
      event: ChangeEvent<HTMLInputElement>,
    ) => {
      const file =
        event.target.files?.[0];

      event.target.value = "";

      if (!file) return;

      await uploadProjectFile(
        file,
      );
    };

  /*
   * ========================================
   * PRIVATE DOWNLOAD
   * ========================================
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
        document.createElement("a");

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

  /*
   * ========================================
   * PAGE
   * ========================================
   */

  return (
    <div className="mx-auto max-w-7xl px-4 py-14">
      {/* HEADER */}

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl text-navy">
            داشبورد پژوهشگر
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            خوش آمدید، {displayName}
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

      {/* REAL STATISTICS */}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardStat
          icon={FolderKanban}
          label="پروژه‌های فعال"
          value={activeCount}
        />

        <DashboardStat
          icon={CloudUpload}
          label="فایل‌های پروژه"
          value={totalFileCount}
        />

        <DashboardStat
          icon={Users2}
          label="درخواست‌های مشاوره"
          value={consultations.length}
        />

        <DashboardStat
          icon={FileBarChart}
          label="گزارش‌های تحویل‌شده"
          value={totalReportCount}
        />
      </div>

      {/* ERROR */}

      {loadError && (
        <p className="mt-6 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {loadError}
        </p>
      )}

      {/* PROJECTS */}

      {loading ? (
        <div className="mt-8 flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          در حال بارگذاری پروژه‌ها…
        </div>
      ) : projects.length === 0 ? (
        <div className="card-elevated mt-8 p-12 text-center">
          <FolderKanban className="mx-auto size-8 text-primary" />

          <p className="mt-4 text-base font-bold text-navy">
            هنوز پروژه‌ای ثبت نکرده‌اید.
          </p>

          <p className="mt-2 text-xs text-muted-foreground">
            با طراح پروژه پژوهشی، اولین پروژه خود را ثبت کنید.
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
          {/* PROJECT LIST */}

          <aside className="card-elevated h-fit p-5">
            <h2 className="text-sm font-bold text-navy">
              پروژه‌های من
            </h2>

            <ul className="mt-4 space-y-2">
              {projects.map((project) => (
                <li key={project.id}>
                  <button
                    type="button"
                    onClick={() =>
                      setActive(project.id)
                    }
                    className={`w-full rounded-xl border p-3 text-start transition-colors ${
                      current?.id === project.id
                        ? "border-primary bg-accent/60"
                        : "border-border hover:bg-secondary"
                    }`}
                  >
                    <span
                      className="block text-[11px] text-muted-foreground"
                      dir="ltr"
                    >
                      {shortId(project.id)}
                    </span>

                    <span className="mt-1 block text-sm font-semibold leading-6 text-navy">
                      {project.title}
                    </span>

                    <span className="mt-1 block text-[11px] text-primary">
                      {project.analysis_type ?? "—"}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          {/* CURRENT PROJECT */}

          <section className="card-elevated p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-lg text-navy">
                  {current!.title}
                </h2>

                <p className="mt-1 text-xs text-muted-foreground">
                  <span dir="ltr">
                    {shortId(current!.id)}
                  </span>

                  {" · "}

                  {current!.analysis_type ?? "—"}

                  {" · ثبت "}

                  {formatDate(current!.created_at)}

                  {" · آخرین بروزرسانی "}

                  {formatDate(current!.updated_at)}
                </p>
              </div>

              <span className="rounded-full bg-accent px-3 py-1 text-[11px] font-semibold text-accent-foreground">
                {statusLabel(current!.status)}
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

              {/* ========================================
                  DATA FILES
              ======================================== */}

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
                    برای متادیتا، CSV، Excel، ماتریس‌های داده و
                    فایل‌های کوچک پژوهشی.
                  </p>

                  <Button
                    variant="soft"
                    className="mt-4"
                    disabled={uploadingFile}
                    onClick={() =>
                      fileInputRef.current?.click()
                    }
                  >
                    {uploadingFile ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        در حال بارگذاری…
                      </>
                    ) : (
                      <>
                        <CloudUpload className="size-4" />
                        انتخاب فایل
                      </>
                    )}
                  </Button>

                  <p className="mt-3 text-[11px] text-muted-foreground">
                    حداکثر حجم فعلی: ۶ مگابایت
                  </p>
                </div>

                <div className="mt-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-bold text-navy">
                        داده‌های این پروژه
                      </h3>

                      <p className="mt-1 text-xs text-muted-foreground">
                        فایل‌هایی که برای تحلیل در اختیار هاب‌ژن
                        قرار داده‌اید.
                      </p>
                    </div>

                    <RefreshButton
                      loading={filesLoading}
                      onClick={() =>
                        current &&
                        loadFiles(current.id)
                      }
                    />
                  </div>

                  <ProjectFileList
                    files={dataFiles}
                    loading={filesLoading}
                    emptyTitle="هنوز داده‌ای بارگذاری نشده است."
                    emptyDescription="اولین فایل داده پروژه را از بخش بالا بارگذاری کنید."
                    downloadingFileId={
                      downloadingFileId
                    }
                    onDownload={
                      downloadProjectFile
                    }
                  />
                </div>
              </TabsContent>

              {/* ========================================
                  MESSAGES
              ======================================== */}

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
                        ارتباط مستقیم شما با تیم هاب‌ژن درباره
                        همین پروژه
                      </p>
                    </div>

                    <RefreshButton
                      loading={messagesLoading}
                      onClick={() =>
                        current &&
                        loadMessages(current.id)
                      }
                    />
                  </div>

                  <div className="min-h-[220px] bg-secondary/10 p-4">
                    {messagesLoading ? (
                      <LoadingBox text="در حال دریافت پیام‌ها…" />
                    ) : projectMessages.length === 0 ? (
                      <div className="py-14 text-center">
                        <MessageSquare className="mx-auto size-8 text-primary/50" />

                        <p className="mt-4 text-sm font-bold text-navy">
                          هنوز پیامی ثبت نشده است.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {projectMessages.map((message) => {
                          const isMine =
                            message.sender_id === user?.id;

                          return (
                            <div
                              key={message.id}
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
                                {message.message}
                              </p>
                            </div>
                          );
                        })}
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

                    <textarea
                      id="researcher-message"
                      value={messageText}
                      onChange={(event) =>
                        setMessageText(
                          event.target.value,
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
                        onClick={sendMessage}
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

              {/* ========================================
                  REAL CONSULTATIONS
              ======================================== */}

              <TabsContent
                value="consults"
                className="mt-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="flex items-center gap-2 text-sm font-bold text-navy">
                      <CalendarClock className="size-4 text-primary" />
                      مشاوره‌های پژوهشی
                    </h3>

                    <p className="mt-1 text-xs text-muted-foreground">
                      درخواست‌ها، زمان جلسات و اطلاعات مشاوره
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <RefreshButton
                      loading={
                        consultationsLoading
                      }
                      onClick={
                        loadConsultations
                      }
                    />

                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                    >
                      <Link to="/consultation">
                        درخواست مشاوره جدید
                      </Link>
                    </Button>
                  </div>
                </div>

                {consultationsLoading ? (
                  <div className="mt-4">
                    <LoadingBox text="در حال دریافت مشاوره‌ها…" />
                  </div>
                ) : currentConsultations.length === 0 ? (
                  <div className="mt-4 rounded-2xl border border-border p-10 text-center">
                    <CalendarClock className="mx-auto size-8 text-primary/50" />

                    <p className="mt-4 text-sm font-bold text-navy">
                      هنوز درخواست مشاوره‌ای ندارید.
                    </p>

                    <p className="mx-auto mt-2 max-w-lg text-xs leading-6 text-muted-foreground">
                      برای بررسی طراحی مطالعه، انتخاب استراتژی
                      بیوانفورماتیک یا تفسیر نتایج، یک درخواست
                      مشاوره ثبت کنید.
                    </p>

                    <Button
                      asChild
                      variant="hero"
                      className="mt-5"
                    >
                      <Link to="/consultation">
                        ثبت درخواست مشاوره
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="mt-4 space-y-4">
                    {currentConsultations.map(
                      (consultation) => (
                        <ConsultationCard
                          key={consultation.id}
                          consultation={
                            consultation
                          }
                        />
                      ),
                    )}
                  </div>
                )}
              </TabsContent>

              {/* ========================================
                  REAL REPORTS
              ======================================== */}

              <TabsContent
                value="reports"
                className="mt-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="flex items-center gap-2 text-sm font-bold text-navy">
                      <FileBarChart className="size-4 text-primary" />
                      گزارش‌های پروژه
                    </h3>

                    <p className="mt-1 text-xs text-muted-foreground">
                      گزارش‌های رسمی بارگذاری‌شده توسط تیم هاب‌ژن
                    </p>
                  </div>

                  <RefreshButton
                    loading={filesLoading}
                    onClick={() =>
                      current &&
                      loadFiles(current.id)
                    }
                  />
                </div>

                <ProjectFileList
                  files={reportFiles}
                  loading={filesLoading}
                  emptyTitle="هنوز گزارشی تحویل نشده است."
                  emptyDescription="پس از آماده‌شدن گزارش تحلیل، فایل آن در این قسمت نمایش داده می‌شود."
                  downloadingFileId={
                    downloadingFileId
                  }
                  onDownload={
                    downloadProjectFile
                  }
                  icon="report"
                />
              </TabsContent>

              {/* ========================================
                  REAL RESULTS
              ======================================== */}

              <TabsContent
                value="results"
                className="mt-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="flex items-center gap-2 text-sm font-bold text-navy">
                      <Image className="size-4 text-primary" />
                      نتایج و خروجی‌های تحلیل
                    </h3>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Figure، جدول، Excel، CSV، ZIP و سایر
                      خروجی‌های تحلیلی
                    </p>
                  </div>

                  <RefreshButton
                    loading={filesLoading}
                    onClick={() =>
                      current &&
                      loadFiles(current.id)
                    }
                  />
                </div>

                <ProjectFileList
                  files={resultFiles}
                  loading={filesLoading}
                  emptyTitle="هنوز نتیجه‌ای تحویل نشده است."
                  emptyDescription="خروجی‌های تحلیل پس از آماده‌شدن در این قسمت قرار می‌گیرند."
                  downloadingFileId={
                    downloadingFileId
                  }
                  onDownload={
                    downloadProjectFile
                  }
                  icon="result"
                />
              </TabsContent>

              {/* ========================================
                  PAYMENTS — STILL DEMO
              ======================================== */}

              <TabsContent
                value="payments"
                className="mt-5"
              >
                <div className="rounded-2xl border border-border p-8 text-center">
                  <BadgeDollarSign className="mx-auto size-7 text-primary/50" />

                  <p className="mt-3 text-sm font-bold text-navy">
                    سیستم پرداخت هنوز فعال نشده است.
                  </p>

                  <p className="mt-2 text-xs text-muted-foreground">
                    وضعیت پرداخت‌ها در مرحله بعد به سیستم واقعی
                    پروژه متصل خواهد شد.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </section>
        </div>
      )}
    </div>
  );
}

/*
 * ========================================
 * CONSULTATION CARD
 * ========================================
 */

function ConsultationCard({
  consultation,
}: {
  consultation: ConsultationRow;
}) {
  const typeLabel =
    consultationTypeLabels[
      consultation.consultation_type
    ] ??
    consultation.consultation_type;

  const statusText =
    consultationStatusLabels[
      consultation.status
    ] ??
    consultation.status;

  return (
    <article className="overflow-hidden rounded-2xl border border-border">
      <div className="flex flex-wrap items-start justify-between gap-4 bg-secondary/30 p-5">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-bold text-navy">
              {consultation.subject}
            </p>

            {!consultation.project_id && (
              <span className="rounded-full border border-border bg-background px-2.5 py-1 text-[10px] text-muted-foreground">
                مشاوره عمومی
              </span>
            )}
          </div>

          <p className="mt-2 text-xs text-primary">
            {typeLabel}
          </p>

          <p className="mt-1 text-[11px] text-muted-foreground">
            ثبت درخواست:{" "}
            {formatDateTime(
              consultation.created_at,
            )}
          </p>
        </div>

        <ConsultationStatusBadge
          status={consultation.status}
          label={statusText}
        />
      </div>

      <div className="p-5">
        {consultation.description && (
          <div>
            <p className="text-xs font-semibold text-navy">
              توضیحات درخواست
            </p>

            <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
              {consultation.description}
            </p>
          </div>
        )}

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <ConsultationInfo
            label="زمان جلسه"
            value={
              consultation.scheduled_at
                ? formatDateTime(
                    consultation.scheduled_at,
                  )
                : "هنوز تعیین نشده"
            }
          />

          <ConsultationInfo
            label="مدت جلسه"
            value={
              consultation.duration_minutes
                ? `${new Intl.NumberFormat(
                    "fa-IR",
                  ).format(
                    consultation.duration_minutes,
                  )} دقیقه`
                : "هنوز تعیین نشده"
            }
          />

          <ConsultationInfo
            label="آخرین بروزرسانی"
            value={formatDateTime(
              consultation.updated_at,
            )}
          />
        </div>

        {consultation.admin_note && (
          <div className="mt-5 rounded-2xl border border-primary/20 bg-accent/30 p-4">
            <p className="text-xs font-bold text-navy">
              یادداشت تیم هاب‌ژن
            </p>

            <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
              {consultation.admin_note}
            </p>
          </div>
        )}

        {consultation.meeting_url &&
          consultation.status !== "cancelled" && (
            <div className="mt-5">
              <a
                href={consultation.meeting_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
              >
                <ExternalLink className="size-4" />
                ورود به جلسه
              </a>
            </div>
          )}
      </div>
    </article>
  );
}

/*
 * ========================================
 * CONSULTATION STATUS
 * ========================================
 */

function ConsultationStatusBadge({
  status,
  label,
}: {
  status: string;
  label: string;
}) {
  const className =
    status === "completed"
      ? "border-primary/20 bg-accent text-primary"
      : status === "cancelled"
        ? "border-destructive/20 bg-destructive/5 text-destructive"
        : status === "scheduled"
          ? "border-primary/30 bg-primary/10 text-primary"
          : "border-border bg-background text-muted-foreground";

  return (
    <span
      className={`rounded-full border px-3 py-1.5 text-[11px] font-semibold ${className}`}
    >
      {label}
    </span>
  );
}

/*
 * ========================================
 * CONSULTATION INFO
 * ========================================
 */

function ConsultationInfo({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-secondary/20 p-3">
      <p className="text-[11px] text-muted-foreground">
        {label}
      </p>

      <p className="mt-1 text-xs font-semibold leading-6 text-navy">
        {value}
      </p>
    </div>
  );
}

/*
 * ========================================
 * DASHBOARD STAT
 * ========================================
 */

function DashboardStat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof FolderKanban;
  label: string;
  value: number;
}) {
  return (
    <div className="card-elevated p-5">
      <Icon className="size-5 text-primary" />

      <p className="mt-3 text-2xl font-extrabold text-navy">
        {new Intl.NumberFormat(
          "fa-IR",
        ).format(value)}
      </p>

      <p className="mt-1 text-xs text-muted-foreground">
        {label}
      </p>
    </div>
  );
}

/*
 * ========================================
 * PROJECT FILE LIST
 * ========================================
 */

function ProjectFileList({
  files,
  loading,
  emptyTitle,
  emptyDescription,
  downloadingFileId,
  onDownload,
  icon = "file",
}: {
  files: ProjectFileRow[];
  loading: boolean;
  emptyTitle: string;
  emptyDescription: string;
  downloadingFileId: string | null;
  onDownload: (
    file: ProjectFileRow,
  ) => Promise<void>;
  icon?:
    | "file"
    | "report"
    | "result";
}) {
  if (loading) {
    return (
      <div className="mt-4">
        <LoadingBox text="در حال دریافت فایل‌ها…" />
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="mt-4 rounded-2xl border border-border p-10 text-center">
        {icon === "report" ? (
          <FileBarChart className="mx-auto size-7 text-primary/50" />
        ) : icon === "result" ? (
          <Image className="mx-auto size-7 text-primary/50" />
        ) : (
          <FileText className="mx-auto size-7 text-primary/50" />
        )}

        <p className="mt-3 text-sm font-bold text-navy">
          {emptyTitle}
        </p>

        <p className="mt-2 text-xs leading-6 text-muted-foreground">
          {emptyDescription}
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4 overflow-hidden rounded-2xl border border-border">
      <div className="border-b border-border bg-secondary/30 px-4 py-3">
        <p className="text-xs text-muted-foreground">
          تعداد فایل‌ها:{" "}
          <span className="font-bold text-navy">
            {new Intl.NumberFormat(
              "fa-IR",
            ).format(files.length)}
          </span>
        </p>
      </div>

      <ul className="divide-y divide-border">
        {files.map((file) => (
          <li
            key={file.id}
            className="flex flex-wrap items-center justify-between gap-4 p-4"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                {icon === "report" ? (
                  <FileBarChart className="size-4 shrink-0 text-primary" />
                ) : icon === "result" ? (
                  <Image className="size-4 shrink-0 text-primary" />
                ) : (
                  <FileText className="size-4 shrink-0 text-primary" />
                )}

                <p
                  className="truncate text-sm font-semibold text-navy"
                  dir="auto"
                >
                  {file.original_name}
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
                downloadingFileId === file.id
              }
              onClick={() =>
                onDownload(file)
              }
              className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-xs font-semibold text-navy transition-colors hover:border-primary hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
            >
              {downloadingFileId === file.id ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Download className="size-4 text-primary" />
              )}

              دانلود
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/*
 * ========================================
 * REFRESH BUTTON
 * ========================================
 */

function RefreshButton({
  loading,
  onClick,
}: {
  loading: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={loading}
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-xs text-muted-foreground transition-colors hover:bg-secondary disabled:opacity-50"
    >
      <RefreshCw
        className={`size-4 ${
          loading
            ? "animate-spin"
            : ""
        }`}
      />

      بروزرسانی
    </button>
  );
}

/*
 * ========================================
 * LOADING BOX
 * ========================================
 */

function LoadingBox({
  text,
}: {
  text: string;
}) {
  return (
    <div className="flex items-center justify-center gap-2 rounded-2xl border border-border py-12 text-sm text-muted-foreground">
      <Loader2 className="size-4 animate-spin" />
      {text}
    </div>
  );
}

/*
 * ========================================
 * DATE + TIME
 * ========================================
 */

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

/*
 * ========================================
 * FILE SIZE
 * ========================================
 */

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

/*
 * ========================================
 * SAFE EXTENSION
 * ========================================
 */

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
