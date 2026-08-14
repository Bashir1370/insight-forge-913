import { createFileRoute, Link } from "@tanstack/react-router";
import {
  useEffect,
  useMemo,
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
  ReceiptText,
  RefreshCw,
  Send,
  Users2,
  XCircle,
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
          "پیگیری پروژه، داده‌ها، پیام‌ها، مشاوره‌ها، گزارش‌ها، نتایج، پیشنهادهای قیمت و پرداخت‌ها در هاب‌ژن.",
      },
      {
        property: "og:title",
        content: "داشبورد پژوهشگر",
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

type ProjectQuoteRow = {
  id: string;
  project_id: string;
  user_id: string;
  created_by: string;
  title: string;
  scope_summary: string | null;
  deliverables: string | null;
  amount: number | string;
  currency: string;
  estimated_days: number | null;
  status: string;
  valid_until: string | null;
  admin_note: string | null;
  responded_at: string | null;
  created_at: string;
  updated_at: string;
};

type ProjectInvoiceRow = {
  id: string;
  project_id: string;
  quote_id: string;
  user_id: string;
  created_by: string;
  title: string;
  amount: number | string;
  currency: string;
  status: string;
  due_at: string | null;
  payment_instructions: string | null;
  admin_note: string | null;
  paid_at: string | null;
  payment_reference: string | null;
  created_at: string;
  updated_at: string;
};

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

const quoteStatusLabels: Record<string, string> = {
  draft: "پیش‌نویس",
  sent: "در انتظار پاسخ شما",
  accepted: "تأیید شده",
  rejected: "رد شده",
  expired: "منقضی شده",
  cancelled: "لغو شده",
};

const invoiceStatusLabels: Record<string, string> = {
  draft: "پیش‌نویس",
  issued: "در انتظار پرداخت",
  paid: "پرداخت شده",
  overdue: "سررسید گذشته",
  cancelled: "لغو شده",
};

function StageTracker({
  stage,
}: {
  stage: number;
}) {
  return (
    <div className="mt-4">
      <Progress
        value={
          (stage / projectStages.length) *
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

  const [projects, setProjects] =
    useState<ProjectRow[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [loadError, setLoadError] =
    useState<string | null>(null);

  const [active, setActive] =
    useState<string | null>(null);

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

  const [
    consultations,
    setConsultations,
  ] = useState<ConsultationRow[]>([]);

  const [
    consultationsLoading,
    setConsultationsLoading,
  ] = useState(false);

  const [
    projectQuotes,
    setProjectQuotes,
  ] = useState<ProjectQuoteRow[]>([]);

  const [
    quotesLoading,
    setQuotesLoading,
  ] = useState(false);

  const [
    respondingQuoteId,
    setRespondingQuoteId,
  ] = useState<string | null>(null);

  const [
    projectInvoices,
    setProjectInvoices,
  ] = useState<ProjectInvoiceRow[]>([]);

  const [
    invoicesLoading,
    setInvoicesLoading,
  ] = useState(false);

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

        const projectIds =
          rows.map(
            (project) =>
              project.id,
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
            fileCountResult.count ??
              0,
          );
        }

        if (!reportCountResult.error) {
          setTotalReportCount(
            reportCountResult.count ??
              0,
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

  const loadConsultations =
    async () => {
      if (!user?.id) return;

      setConsultationsLoading(
        true,
      );

      const { data, error } =
        await supabase
          .from("consultations")
          .select("*")
          .eq(
            "user_id",
            user.id,
          )
          .order("created_at", {
            ascending: false,
          });

      if (error) {
        console.error(error);

        setConsultations([]);
        setConsultationsLoading(
          false,
        );

        toast.error(
          "دریافت درخواست‌های مشاوره انجام نشد.",
        );

        return;
      }

      setConsultations(
        (data ??
          []) as ConsultationRow[],
      );

      setConsultationsLoading(
        false,
      );
    };

  useEffect(() => {
    if (!user?.id) return;

    loadConsultations();
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

  const currentConsultations =
    current
      ? consultations.filter(
          (consultation) =>
            consultation.project_id ===
              current.id ||
            consultation.project_id ===
              null,
        )
      : consultations;

  const quoteMap = useMemo(
    () =>
      new Map(
        projectQuotes.map(
          (quote) => [
            quote.id,
            quote,
          ],
        ),
      ),
    [projectQuotes],
  );

  const dataFiles =
    projectFiles.filter(
      (file) =>
        file.category === "data" ||
        file.category === "other",
    );

  const reportFiles =
    projectFiles.filter(
      (file) =>
        file.category ===
        "report",
    );

  const resultFiles =
    projectFiles.filter(
      (file) =>
        file.category ===
        "result",
    );

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
      console.error(error);

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

  const sendMessage =
    async () => {
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

            sender_id:
              user.id,

            message:
              cleanMessage,
          })
          .select("*")
          .single();

      if (error) {
        console.error(error);

        toast.error(
          "ارسال پیام انجام نشد.",
        );

        setSendingMessage(
          false,
        );

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
      console.error(error);

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

  const loadProjectQuotes =
    async (
      projectId: string,
    ) => {
      setQuotesLoading(true);

      const { data, error } =
        await supabase
          .from("project_quotes")
          .select("*")
          .eq(
            "project_id",
            projectId,
          )
          .order("created_at", {
            ascending: false,
          });

      if (error) {
        console.error(error);

        setProjectQuotes([]);
        setQuotesLoading(false);

        toast.error(
          "دریافت پیشنهادهای قیمت انجام نشد.",
        );

        return;
      }

      setProjectQuotes(
        (data ??
          []) as ProjectQuoteRow[],
      );

      setQuotesLoading(false);
    };

  const respondToQuote =
    async (
      quote: ProjectQuoteRow,
      response:
        | "accepted"
        | "rejected",
    ) => {
      if (
        quote.status !== "sent"
      ) {
        toast.error(
          "این پیشنهاد دیگر در انتظار پاسخ نیست.",
        );
        return;
      }

      if (
        isQuoteExpired(quote)
      ) {
        toast.error(
          "مهلت این پیشنهاد قیمت به پایان رسیده است.",
        );
        return;
      }

      if (
        response === "rejected"
      ) {
        const confirmed =
          window.confirm(
            "آیا از رد این پیشنهاد قیمت مطمئن هستید؟",
          );

        if (!confirmed) return;
      }

      setRespondingQuoteId(
        quote.id,
      );

      const { error } =
        await supabase.rpc(
          "respond_to_project_quote",
          {
            quote_id:
              quote.id,

            response,
          },
        );

      if (error) {
        console.error(error);

        const message =
          error.message.toLowerCase();

        if (
          message.includes(
            "expired",
          )
        ) {
          toast.error(
            "مهلت این پیشنهاد قیمت به پایان رسیده است.",
          );
        } else if (
          message.includes(
            "awaiting response",
          )
        ) {
          toast.error(
            "این پیشنهاد قبلاً پاسخ داده شده است.",
          );
        } else {
          toast.error(
            "ثبت پاسخ پیشنهاد قیمت انجام نشد.",
          );
        }

        setRespondingQuoteId(
          null,
        );

        if (current) {
          await loadProjectQuotes(
            current.id,
          );
        }

        return;
      }

      if (current) {
        await loadProjectQuotes(
          current.id,
        );
      }

      setRespondingQuoteId(
        null,
      );

      if (
        response === "accepted"
      ) {
        toast.success(
          "پیشنهاد قیمت با موفقیت تأیید شد.",
        );
      } else {
        toast.success(
          "پیشنهاد قیمت رد شد.",
        );
      }
    };

  const loadProjectInvoices =
    async (
      projectId: string,
    ) => {
      setInvoicesLoading(true);

      const { data, error } =
        await supabase
          .from("project_invoices")
          .select("*")
          .eq(
            "project_id",
            projectId,
          )
          .order("created_at", {
            ascending: false,
          });

      if (error) {
        console.error(error);

        setProjectInvoices([]);
        setInvoicesLoading(false);

        toast.error(
          "دریافت درخواست‌های پرداخت انجام نشد.",
        );

        return;
      }

      setProjectInvoices(
        (data ??
          []) as ProjectInvoiceRow[],
      );

      setInvoicesLoading(false);
    };

  const refreshFinance =
    async () => {
      if (!current) return;

      await Promise.all([
        loadProjectQuotes(
          current.id,
        ),

        loadProjectInvoices(
          current.id,
        ),
      ]);
    };

  useEffect(() => {
    if (!current?.id) {
      setProjectMessages([]);
      setProjectFiles([]);
      setProjectQuotes([]);
      setProjectInvoices([]);
      setMessageText("");
      return;
    }

    setProjectMessages([]);
    setProjectFiles([]);
    setProjectQuotes([]);
    setProjectInvoices([]);
    setMessageText("");

    loadMessages(
      current.id,
    );

    loadFiles(
      current.id,
    );

    loadProjectQuotes(
      current.id,
    );

    loadProjectInvoices(
      current.id,
    );
  }, [current?.id]);

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

          uploader_id:
            user.id,

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
        .from(
          file.bucket_id,
        )
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
        URL.createObjectURL(
          data,
        );

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
    <div
      dir="rtl"
      className="mx-auto max-w-7xl px-4 py-14 text-right"
    >
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
          value={
            consultations.length
          }
        />

        <DashboardStat
          icon={FileBarChart}
          label="گزارش‌های تحویل‌شده"
          value={
            totalReportCount
          }
        />
      </div>

      {loadError && (
        <p className="mt-6 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {loadError}
        </p>
      )}

      {loading ? (
        <div className="mt-8 flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          در حال بارگذاری پروژه‌ها…
        </div>
      ) : projects.length ===
        0 ? (
        <div className="card-elevated mt-8 p-12 text-center">
          <FolderKanban className="mx-auto size-8 text-primary" />

          <p className="mt-4 text-base font-bold text-navy">
            هنوز پروژه‌ای ثبت نکرده‌اید.
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
              dir="rtl"
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
                    برای متادیتا، CSV، Excel، ماتریس داده و
                    فایل‌های کوچک پژوهشی
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
                    <h3 className="text-sm font-bold text-navy">
                      داده‌های این پروژه
                    </h3>

                    <RefreshButton
                      loading={
                        filesLoading
                      }
                      onClick={() =>
                        current &&
                        loadFiles(
                          current.id,
                        )
                      }
                    />
                  </div>

                  <ProjectFileList
                    files={
                      dataFiles
                    }
                    loading={
                      filesLoading
                    }
                    emptyTitle="هنوز داده‌ای بارگذاری نشده است."
                    emptyDescription="اولین فایل داده پروژه را بارگذاری کنید."
                    downloadingFileId={
                      downloadingFileId
                    }
                    onDownload={
                      downloadProjectFile
                    }
                  />
                </div>
              </TabsContent>

              <TabsContent
                value="messages"
                className="mt-5"
              >
                <div className="rounded-2xl border border-border">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4">
                    <h3 className="flex items-center gap-2 text-sm font-bold text-navy">
                      <MessageSquare className="size-4 text-primary" />
                      گفت‌وگوی پروژه
                    </h3>

                    <RefreshButton
                      loading={
                        messagesLoading
                      }
                      onClick={() =>
                        current &&
                        loadMessages(
                          current.id,
                        )
                      }
                    />
                  </div>

                  <div className="min-h-[220px] bg-secondary/10 p-4">
                    {messagesLoading ? (
                      <LoadingBox text="در حال دریافت پیام‌ها…" />
                    ) : projectMessages.length ===
                      0 ? (
                      <div className="py-14 text-center text-sm text-muted-foreground">
                        هنوز پیامی ثبت نشده است.
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
                    <textarea
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
                      className="w-full resize-y rounded-2xl border border-border bg-background px-4 py-3 text-sm leading-7 text-navy outline-none focus:border-primary"
                    />

                    <div className="mt-3 flex justify-end">
                      <button
                        type="button"
                        disabled={
                          sendingMessage ||
                          !messageText.trim()
                        }
                        onClick={
                          sendMessage
                        }
                        className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground disabled:opacity-50"
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

              <TabsContent
                value="consults"
                className="mt-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <h3 className="flex items-center gap-2 text-sm font-bold text-navy">
                    <CalendarClock className="size-4 text-primary" />
                    مشاوره‌های پژوهشی
                  </h3>

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
                        درخواست جدید
                      </Link>
                    </Button>
                  </div>
                </div>

                {consultationsLoading ? (
                  <div className="mt-4">
                    <LoadingBox text="در حال دریافت مشاوره‌ها…" />
                  </div>
                ) : currentConsultations.length ===
                  0 ? (
                  <div className="mt-4 rounded-2xl border border-border p-10 text-center">
                    <CalendarClock className="mx-auto size-8 text-primary/50" />

                    <p className="mt-4 text-sm font-bold text-navy">
                      هنوز درخواست مشاوره‌ای ندارید.
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
                      (
                        consultation,
                      ) => (
                        <ConsultationCard
                          key={
                            consultation.id
                          }
                          consultation={
                            consultation
                          }
                        />
                      ),
                    )}
                  </div>
                )}
              </TabsContent>

              <TabsContent
                value="reports"
                className="mt-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="flex items-center gap-2 text-sm font-bold text-navy">
                    <FileBarChart className="size-4 text-primary" />
                    گزارش‌های پروژه
                  </h3>

                  <RefreshButton
                    loading={
                      filesLoading
                    }
                    onClick={() =>
                      current &&
                      loadFiles(
                        current.id,
                      )
                    }
                  />
                </div>

                <ProjectFileList
                  files={
                    reportFiles
                  }
                  loading={
                    filesLoading
                  }
                  emptyTitle="هنوز گزارشی تحویل نشده است."
                  emptyDescription="گزارش‌های هاب‌ژن پس از آماده‌شدن اینجا نمایش داده می‌شوند."
                  downloadingFileId={
                    downloadingFileId
                  }
                  onDownload={
                    downloadProjectFile
                  }
                  icon="report"
                />
              </TabsContent>

              <TabsContent
                value="results"
                className="mt-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="flex items-center gap-2 text-sm font-bold text-navy">
                    <Image className="size-4 text-primary" />
                    نتایج و خروجی‌های تحلیل
                  </h3>

                  <RefreshButton
                    loading={
                      filesLoading
                    }
                    onClick={() =>
                      current &&
                      loadFiles(
                        current.id,
                      )
                    }
                  />
                </div>

                <ProjectFileList
                  files={
                    resultFiles
                  }
                  loading={
                    filesLoading
                  }
                  emptyTitle="هنوز نتیجه‌ای تحویل نشده است."
                  emptyDescription="خروجی‌های تحلیل پس از آماده‌شدن اینجا قرار می‌گیرند."
                  downloadingFileId={
                    downloadingFileId
                  }
                  onDownload={
                    downloadProjectFile
                  }
                  icon="result"
                />
              </TabsContent>

              <TabsContent
                value="payments"
                className="mt-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="flex items-center gap-2 text-sm font-bold text-navy">
                      <BadgeDollarSign className="size-4 text-primary" />
                      امور مالی پروژه
                    </h3>

                    <p className="mt-1 text-xs leading-6 text-muted-foreground">
                      پیشنهادهای قیمت و درخواست‌های پرداخت این پروژه
                    </p>
                  </div>

                  <RefreshButton
                    loading={
                      quotesLoading ||
                      invoicesLoading
                    }
                    onClick={
                      refreshFinance
                    }
                  />
                </div>

                <section className="mt-5">
                  <div>
                    <h4 className="flex items-center gap-2 text-sm font-bold text-navy">
                      <ReceiptText className="size-4 text-primary" />
                      درخواست‌های پرداخت
                    </h4>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Invoiceهای صادرشده توسط هاب‌ژن
                    </p>
                  </div>

                  {invoicesLoading ? (
                    <div className="mt-4">
                      <LoadingBox text="در حال دریافت درخواست‌های پرداخت…" />
                    </div>
                  ) : projectInvoices.length ===
                    0 ? (
                    <div className="mt-4 rounded-2xl border border-border p-8 text-center">
                      <ReceiptText className="mx-auto size-7 text-primary/50" />

                      <p className="mt-3 text-sm font-bold text-navy">
                        هنوز درخواست پرداختی صادر نشده است.
                      </p>

                      <p className="mx-auto mt-2 max-w-xl text-xs leading-6 text-muted-foreground">
                        بعد از تأیید پیشنهاد قیمت و صدور Invoice توسط
                        مدیریت هاب‌ژن، اطلاعات پرداخت در این بخش نمایش
                        داده می‌شود.
                      </p>
                    </div>
                  ) : (
                    <div className="mt-4 space-y-4">
                      {projectInvoices.map(
                        (invoice) => (
                          <ResearcherInvoiceCard
                            key={
                              invoice.id
                            }
                            invoice={
                              invoice
                            }
                            quote={
                              quoteMap.get(
                                invoice.quote_id,
                              ) ??
                              null
                            }
                          />
                        ),
                      )}
                    </div>
                  )}
                </section>

                <section className="mt-8 border-t border-border pt-6">
                  <div>
                    <h4 className="flex items-center gap-2 text-sm font-bold text-navy">
                      <BadgeDollarSign className="size-4 text-primary" />
                      پیشنهادهای قیمت
                    </h4>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Scope، مبلغ و شرایط پیشنهادی هاب‌ژن
                    </p>
                  </div>

                  {quotesLoading ? (
                    <div className="mt-4">
                      <LoadingBox text="در حال دریافت پیشنهاد قیمت…" />
                    </div>
                  ) : projectQuotes.length ===
                    0 ? (
                    <div className="mt-4 rounded-2xl border border-border p-10 text-center">
                      <BadgeDollarSign className="mx-auto size-8 text-primary/50" />

                      <p className="mt-4 text-sm font-bold text-navy">
                        هنوز پیشنهاد قیمتی برای این پروژه ارسال نشده است.
                      </p>
                    </div>
                  ) : (
                    <div className="mt-4 space-y-5">
                      {projectQuotes.map(
                        (quote) => (
                          <ResearcherQuoteCard
                            key={
                              quote.id
                            }
                            quote={
                              quote
                            }
                            responding={
                              respondingQuoteId ===
                              quote.id
                            }
                            onAccept={() =>
                              respondToQuote(
                                quote,
                                "accepted",
                              )
                            }
                            onReject={() =>
                              respondToQuote(
                                quote,
                                "rejected",
                              )
                            }
                          />
                        ),
                      )}
                    </div>
                  )}
                </section>

                <div className="mt-6 rounded-2xl border border-primary/20 bg-accent/20 p-4">
                  <p className="text-xs font-bold text-navy">
                    پرداخت آنلاین
                  </p>

                  <p className="mt-1 text-xs leading-6 text-muted-foreground">
                    در نسخه فعلی، اطلاعات پرداخت از طریق درخواست پرداخت
                    رسمی هاب‌ژن نمایش داده می‌شود. درگاه پرداخت آنلاین
                    در مرحله بعد به همین Invoiceها متصل خواهد شد.
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

function ResearcherInvoiceCard({
  invoice,
  quote,
}: {
  invoice: ProjectInvoiceRow;
  quote: ProjectQuoteRow | null;
}) {
  const overdue =
    isInvoiceOverdue(
      invoice,
    );

  const effectiveStatus =
    overdue &&
    invoice.status === "issued"
      ? "overdue"
      : invoice.status;

  return (
    <article className="overflow-hidden rounded-2xl border border-primary/20">
      <div className="flex flex-wrap items-start justify-between gap-4 bg-accent/25 p-5">
        <div>
          <p className="text-xs font-semibold text-primary">
            درخواست پرداخت هاب‌ژن
          </p>

          <h5 className="mt-2 text-lg font-bold text-navy">
            {invoice.title}
          </h5>

          <p className="mt-3 text-2xl font-extrabold text-primary">
            {formatToman(
              Number(
                invoice.amount,
              ),
            )}
          </p>
        </div>

        <InvoiceStatusBadge
          status={
            effectiveStatus
          }
        />
      </div>

      <div className="p-5">
        {quote && (
          <div className="rounded-xl border border-border bg-secondary/20 p-4">
            <p className="text-[11px] text-muted-foreground">
              پیشنهاد قیمت مرتبط
            </p>

            <p className="mt-1 text-sm font-semibold text-navy">
              {quote.title}
            </p>
          </div>
        )}

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <FinanceInfo
            label="تاریخ صدور"
            value={formatDateTime(
              invoice.created_at,
            )}
          />

          <FinanceInfo
            label="مهلت پرداخت"
            value={
              invoice.due_at
                ? formatDateTime(
                    invoice.due_at,
                  )
                : "تعیین نشده"
            }
          />

          <FinanceInfo
            label="وضعیت"
            value={
              invoiceStatusLabels[
                effectiveStatus
              ] ??
              effectiveStatus
            }
          />
        </div>

        {invoice.payment_instructions && (
          <div className="mt-5 rounded-2xl border border-border bg-secondary/20 p-4">
            <p className="text-xs font-bold text-navy">
              دستور پرداخت
            </p>

            <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
              {
                invoice.payment_instructions
              }
            </p>
          </div>
        )}

        {invoice.admin_note && (
          <div className="mt-4 rounded-2xl border border-primary/20 bg-accent/30 p-4">
            <p className="text-xs font-bold text-navy">
              یادداشت تیم هاب‌ژن
            </p>

            <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
              {
                invoice.admin_note
              }
            </p>
          </div>
        )}

        {invoice.status ===
          "paid" && (
          <div className="mt-5 flex gap-3 rounded-2xl border border-primary/20 bg-accent/30 p-4">
            <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />

            <div>
              <p className="text-sm font-bold text-navy">
                پرداخت ثبت شده است
              </p>

              {invoice.paid_at && (
                <p className="mt-2 text-xs text-muted-foreground">
                  زمان پرداخت:{" "}
                  {formatDateTime(
                    invoice.paid_at,
                  )}
                </p>
              )}

              {invoice.payment_reference && (
                <p className="mt-1 text-xs text-muted-foreground">
                  کد مرجع:{" "}
                  <span
                    dir="ltr"
                    className="font-semibold text-navy"
                  >
                    {
                      invoice.payment_reference
                    }
                  </span>
                </p>
              )}
            </div>
          </div>
        )}

        {overdue &&
          invoice.status ===
            "issued" && (
            <div className="mt-5 rounded-2xl border border-destructive/20 bg-destructive/5 p-4">
              <p className="text-sm font-bold text-navy">
                مهلت پرداخت این درخواست گذشته است.
              </p>

              <p className="mt-1 text-xs leading-6 text-muted-foreground">
                برای هماهنگی یا تمدید مهلت پرداخت از بخش پیام‌های پروژه
                با تیم هاب‌ژن در ارتباط باشید.
              </p>
            </div>
          )}

        {invoice.status ===
          "cancelled" && (
          <div className="mt-5 rounded-2xl border border-border bg-secondary/30 p-4">
            <p className="text-sm font-bold text-navy">
              این درخواست پرداخت لغو شده است.
            </p>
          </div>
        )}
      </div>
    </article>
  );
}

function ResearcherQuoteCard({
  quote,
  responding,
  onAccept,
  onReject,
}: {
  quote: ProjectQuoteRow;
  responding: boolean;
  onAccept: () => void;
  onReject: () => void;
}) {
  const expired =
    isQuoteExpired(quote);

  const effectiveStatus =
    expired &&
    quote.status === "sent"
      ? "expired"
      : quote.status;

  return (
    <article className="overflow-hidden rounded-2xl border border-border">
      <div className="flex flex-wrap items-start justify-between gap-4 bg-secondary/30 p-5">
        <div>
          <p className="text-xs font-semibold text-primary">
            پیشنهاد رسمی هاب‌ژن
          </p>

          <h4 className="mt-2 text-lg font-bold text-navy">
            {quote.title}
          </h4>

          <p className="mt-3 text-2xl font-extrabold text-primary">
            {formatToman(
              Number(
                quote.amount,
              ),
            )}
          </p>
        </div>

        <QuoteStatusBadge
          status={
            effectiveStatus
          }
        />
      </div>

      <div className="p-5">
        {quote.scope_summary && (
          <QuoteTextBlock
            label="Scope پروژه"
            value={
              quote.scope_summary
            }
          />
        )}

        {quote.deliverables && (
          <div className="mt-5">
            <QuoteTextBlock
              label="خروجی‌های قابل تحویل"
              value={
                quote.deliverables
              }
            />
          </div>
        )}

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <FinanceInfo
            label="زمان تقریبی انجام"
            value={
              quote.estimated_days
                ? `${new Intl.NumberFormat(
                    "fa-IR",
                  ).format(
                    quote.estimated_days,
                  )} روز`
                : "تعیین نشده"
            }
          />

          <FinanceInfo
            label="اعتبار پیشنهاد"
            value={
              quote.valid_until
                ? formatDateTime(
                    quote.valid_until,
                  )
                : "بدون تاریخ انقضا"
            }
          />

          <FinanceInfo
            label="تاریخ پیشنهاد"
            value={formatDateTime(
              quote.created_at,
            )}
          />
        </div>

        {quote.admin_note && (
          <div className="mt-5 rounded-2xl border border-primary/20 bg-accent/30 p-4">
            <p className="text-xs font-bold text-navy">
              توضیح تیم هاب‌ژن
            </p>

            <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
              {quote.admin_note}
            </p>
          </div>
        )}

        {quote.status ===
          "accepted" && (
          <div className="mt-5 flex gap-3 rounded-2xl border border-primary/20 bg-accent/30 p-4">
            <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />

            <div>
              <p className="text-sm font-bold text-navy">
                پیشنهاد قیمت تأیید شده است
              </p>

              <p className="mt-1 text-xs leading-6 text-muted-foreground">
                پس از صدور درخواست پرداخت توسط هاب‌ژن، Invoice مربوط
                به این پیشنهاد در بالای همین صفحه نمایش داده می‌شود.
              </p>

              {quote.responded_at && (
                <p className="mt-2 text-[11px] text-muted-foreground">
                  زمان تأیید:{" "}
                  {formatDateTime(
                    quote.responded_at,
                  )}
                </p>
              )}
            </div>
          </div>
        )}

        {quote.status ===
          "rejected" && (
          <div className="mt-5 flex gap-3 rounded-2xl border border-destructive/20 bg-destructive/5 p-4">
            <XCircle className="mt-0.5 size-5 shrink-0 text-destructive" />

            <div>
              <p className="text-sm font-bold text-navy">
                این پیشنهاد رد شده است
              </p>

              <p className="mt-1 text-xs leading-6 text-muted-foreground">
                برای دریافت پیشنهاد جدید از بخش پیام‌های پروژه با تیم
                هاب‌ژن در ارتباط باشید.
              </p>
            </div>
          </div>
        )}

        {expired &&
          quote.status ===
            "sent" && (
            <div className="mt-5 rounded-2xl border border-border bg-secondary/40 p-4">
              <p className="text-sm font-bold text-navy">
                اعتبار این پیشنهاد به پایان رسیده است.
              </p>
            </div>
          )}

        {quote.status ===
          "sent" &&
          !expired && (
            <div className="mt-6 border-t border-border pt-5">
              <p className="text-sm font-bold text-navy">
                پاسخ شما به این پیشنهاد
              </p>

              <p className="mt-1 text-xs leading-6 text-muted-foreground">
                پس از تأیید یا رد، پاسخ برای مدیریت هاب‌ژن ثبت
                خواهد شد.
              </p>

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  disabled={
                    responding
                  }
                  onClick={
                    onAccept
                  }
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground disabled:opacity-50"
                >
                  {responding ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="size-4" />
                  )}

                  تأیید پیشنهاد
                </button>

                <button
                  type="button"
                  disabled={
                    responding
                  }
                  onClick={
                    onReject
                  }
                  className="inline-flex items-center gap-2 rounded-xl border border-destructive/30 px-5 py-2.5 text-sm font-bold text-destructive hover:bg-destructive/5 disabled:opacity-50"
                >
                  <XCircle className="size-4" />
                  رد پیشنهاد
                </button>
              </div>
            </div>
          )}
      </div>
    </article>
  );
}

function FinanceInfo({
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

function QuoteTextBlock({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs font-bold text-navy">
        {label}
      </p>

      <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
        {value}
      </p>
    </div>
  );
}

function QuoteStatusBadge({
  status,
}: {
  status: string;
}) {
  const label =
    quoteStatusLabels[
      status
    ] ?? status;

  const className =
    status === "accepted"
      ? "border-primary/20 bg-accent text-primary"
      : status === "rejected"
        ? "border-destructive/20 bg-destructive/5 text-destructive"
        : status === "sent"
          ? "border-primary/30 bg-primary/10 text-primary"
          : status === "expired"
            ? "border-border bg-secondary text-muted-foreground"
            : "border-border bg-background text-muted-foreground";

  return (
    <span
      className={`rounded-full border px-3 py-1.5 text-[11px] font-semibold ${className}`}
    >
      {label}
    </span>
  );
}

function InvoiceStatusBadge({
  status,
}: {
  status: string;
}) {
  const label =
    invoiceStatusLabels[
      status
    ] ?? status;

  const className =
    status === "paid"
      ? "border-primary/20 bg-accent text-primary"
      : status === "overdue"
        ? "border-destructive/20 bg-destructive/5 text-destructive"
        : status === "issued"
          ? "border-primary/30 bg-primary/10 text-primary"
          : status === "cancelled"
            ? "border-border bg-secondary text-muted-foreground"
            : "border-border bg-background text-muted-foreground";

  return (
    <span
      className={`rounded-full border px-3 py-1.5 text-[11px] font-semibold ${className}`}
    >
      {label}
    </span>
  );
}

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
          <p className="text-sm font-bold text-navy">
            {
              consultation.subject
            }
          </p>

          <p className="mt-2 text-xs text-primary">
            {typeLabel}
          </p>
        </div>

        <ConsultationStatusBadge
          status={
            consultation.status
          }
          label={
            statusText
          }
        />
      </div>

      <div className="p-5">
        {consultation.description && (
          <p className="whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
            {
              consultation.description
            }
          </p>
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
              {
                consultation.admin_note
              }
            </p>
          </div>
        )}

        {consultation.meeting_url &&
          consultation.status !==
            "cancelled" && (
            <div className="mt-5">
              <a
                href={
                  consultation.meeting_url
                }
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground"
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
  downloadingFileId:
    | string
    | null;
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
          {
            emptyDescription
          }
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4 overflow-hidden rounded-2xl border border-border">
      <ul className="divide-y divide-border">
        {files.map(
          (file) => (
            <li
              key={
                file.id
              }
              className="flex flex-wrap items-center justify-between gap-4 p-4"
            >
              <div className="min-w-0">
                <p
                  className="truncate text-sm font-semibold text-navy"
                  dir="auto"
                >
                  {
                    file.original_name
                  }
                </p>

                <p className="mt-1 text-[11px] text-muted-foreground">
                  {formatFileSize(
                    file.size_bytes,
                  )}

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
                  onDownload(
                    file,
                  )
                }
                className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-xs font-semibold text-navy hover:bg-accent disabled:opacity-50"
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
  );
}

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
      className="inline-flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-xs text-muted-foreground hover:bg-secondary disabled:opacity-50"
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

function LoadingBox({
  text,
}: {
  text: string;
}) {
  return (
    <div className="flex items-center justify-center gap-2 rounded-2xl border border-border p-10 text-sm text-muted-foreground">
      <Loader2 className="size-4 animate-spin" />
      {text}
    </div>
  );
}

function isQuoteExpired(
  quote: ProjectQuoteRow,
) {
  if (
    !quote.valid_until
  ) {
    return false;
  }

  const expiration =
    new Date(
      quote.valid_until,
    ).getTime();

  if (
    Number.isNaN(
      expiration,
    )
  ) {
    return false;
  }

  return (
    expiration <
    Date.now()
  );
}

function isInvoiceOverdue(
  invoice: ProjectInvoiceRow,
) {
  if (
    invoice.status !==
      "issued" ||
    !invoice.due_at
  ) {
    return false;
  }

  const dueTime =
    new Date(
      invoice.due_at,
    ).getTime();

  if (
    Number.isNaN(
      dueTime,
    )
  ) {
    return false;
  }

  return (
    dueTime <
    Date.now()
  );
}

function formatToman(
  amount: number,
) {
  return `${new Intl.NumberFormat(
    "fa-IR",
  ).format(amount)} تومان`;
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
