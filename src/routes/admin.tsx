import { createFileRoute, redirect } from "@tanstack/react-router";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import {
  Activity,
  CalendarClock,
  CheckCircle2,
  CloudUpload,
  Download,
  ExternalLink,
  Eye,
  FileBarChart,
  FileText,
  FolderKanban,
  Image,
  Loader2,
  MessageSquare,
  RefreshCw,
  Save,
  Send,
  Users2,
} from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import {
  formatDate,
  shortId,
  statusLabel,
  type ProjectRow,
} from "@/lib/projects";
import { labelFor, type WizardAnswers } from "@/lib/wizard";

/*
 * =========================================================
 * TYPES
 * =========================================================
 */

type ProfileRow = {
  id: string;
  full_name: string | null;
  organization: string | null;
  research_field: string | null;
};

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

type OutputCategory = "report" | "result";

/*
 * =========================================================
 * CONSTANTS
 * =========================================================
 */

const PROJECT_FILES_BUCKET = "project-files";

const MAX_STANDARD_UPLOAD_BYTES = 6 * 1024 * 1024;

const projectStatusOptions = [
  { value: "submitted", label: "ثبت پروژه" },
  { value: "scientific_review", label: "بررسی اولیه" },
  { value: "design_confirmation", label: "تأیید طراحی" },
  { value: "data_received", label: "دریافت داده" },
  { value: "qc", label: "کنترل کیفیت" },
  { value: "analysis", label: "تحلیل" },
  { value: "interpretation", label: "تفسیر زیستی" },
  { value: "completed", label: "تکمیل‌شده" },
  { value: "cancelled", label: "لغوشده" },
];

const consultationStatusOptions = [
  {
    value: "requested",
    label: "درخواست ثبت شده",
  },
  {
    value: "reviewing",
    label: "در حال بررسی",
  },
  {
    value: "scheduled",
    label: "زمان‌بندی شده",
  },
  {
    value: "completed",
    label: "برگزار شده",
  },
  {
    value: "cancelled",
    label: "لغو شده",
  },
];

const consultationStatusLabels: Record<string, string> = {
  requested: "درخواست ثبت شده",
  reviewing: "در حال بررسی",
  scheduled: "زمان‌بندی شده",
  completed: "برگزار شده",
  cancelled: "لغو شده",
};

const consultationTypeLabels: Record<string, string> = {
  initial: "بررسی اولیه پروژه",
  research_design: "طراحی پژوهش",
  bioinformatics: "مشاوره بیوانفورماتیک",
  results_interpretation: "تفسیر نتایج",
  custom: "مشاوره سفارشی",
};

/*
 * =========================================================
 * ROUTE
 * =========================================================
 */

export const Route = createFileRoute("/admin")({
  ssr: false,

  beforeLoad: async () => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      throw redirect({ to: "/auth" });
    }

    const { data: role, error: roleError } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (roleError || !role) {
      throw redirect({ to: "/dashboard" });
    }

    return { user };
  },

  head: () => ({
    meta: [
      {
        title: "پنل مدیریت | هاب‌ژن",
      },
      {
        name: "description",
        content:
          "مدیریت پروژه‌ها، مشاوره‌ها و خروجی‌های پژوهشی هاب‌ژن",
      },
      {
        name: "robots",
        content: "noindex",
      },
    ],
  }),

  component: Admin,
});

/*
 * =========================================================
 * ADMIN PAGE
 * =========================================================
 */

function Admin() {
  /*
   * Main data
   */

  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [profiles, setProfiles] = useState<ProfileRow[]>([]);
  const [consultations, setConsultations] =
    useState<ConsultationRow[]>([]);

  const [loading, setLoading] = useState(true);

  /*
   * Project
   */

  const [updatingId, setUpdatingId] =
    useState<string | null>(null);

  const [selectedProject, setSelectedProject] =
    useState<ProjectRow | null>(null);

  /*
   * Project messages
   */

  const [messages, setMessages] =
    useState<ProjectMessageRow[]>([]);

  const [messagesLoading, setMessagesLoading] =
    useState(false);

  const [messageText, setMessageText] =
    useState("");

  const [sendingMessage, setSendingMessage] =
    useState(false);

  /*
   * Project files
   */

  const [projectFiles, setProjectFiles] =
    useState<ProjectFileRow[]>([]);

  const [filesLoading, setFilesLoading] =
    useState(false);

  const [
    downloadingFileId,
    setDownloadingFileId,
  ] = useState<string | null>(null);

  const [
    uploadingCategory,
    setUploadingCategory,
  ] = useState<OutputCategory | null>(null);

  const reportInputRef =
    useRef<HTMLInputElement | null>(null);

  const resultInputRef =
    useRef<HTMLInputElement | null>(null);

  /*
   * Consultation management
   */

  const [
    consultationsLoading,
    setConsultationsLoading,
  ] = useState(false);

  const [
    selectedConsultation,
    setSelectedConsultation,
  ] = useState<ConsultationRow | null>(null);

  const [
    consultationStatus,
    setConsultationStatus,
  ] = useState("requested");

  const [
    consultationScheduledAt,
    setConsultationScheduledAt,
  ] = useState("");

  const [
    consultationDuration,
    setConsultationDuration,
  ] = useState("");

  const [
    consultationMeetingUrl,
    setConsultationMeetingUrl,
  ] = useState("");

  const [
    consultationAdminNote,
    setConsultationAdminNote,
  ] = useState("");

  const [
    savingConsultation,
    setSavingConsultation,
  ] = useState(false);

  /*
   * =======================================================
   * INITIAL LOAD
   * =======================================================
   */

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      setLoading(true);

      const [
        projectsResult,
        profilesResult,
        consultationsResult,
      ] = await Promise.all([
        supabase
          .from("projects")
          .select("*")
          .order("created_at", {
            ascending: false,
          }),

        supabase
          .from("profiles")
          .select(
            "id, full_name, organization, research_field",
          ),

        supabase
          .from("consultations")
          .select("*")
          .order("created_at", {
            ascending: false,
          }),
      ]);

      if (!mounted) return;

      if (
        projectsResult.error ||
        profilesResult.error
      ) {
        console.error(
          projectsResult.error ||
            profilesResult.error,
        );

        toast.error(
          "دریافت اطلاعات پنل مدیریت با خطا مواجه شد.",
        );

        setLoading(false);
        return;
      }

      setProjects(
        (projectsResult.data ??
          []) as ProjectRow[],
      );

      setProfiles(
        (profilesResult.data ??
          []) as ProfileRow[],
      );

      if (consultationsResult.error) {
        console.error(
          consultationsResult.error,
        );

        toast.error(
          "دریافت درخواست‌های مشاوره انجام نشد.",
        );
      } else {
        setConsultations(
          (consultationsResult.data ??
            []) as ConsultationRow[],
        );
      }

      setLoading(false);
    }

    loadData();

    return () => {
      mounted = false;
    };
  }, []);

  /*
   * =======================================================
   * MAPS + COUNTS
   * =======================================================
   */

  const profileMap = useMemo(
    () =>
      new Map(
        profiles.map((profile) => [
          profile.id,
          profile,
        ]),
      ),
    [profiles],
  );

  const projectMap = useMemo(
    () =>
      new Map(
        projects.map((project) => [
          project.id,
          project,
        ]),
      ),
    [projects],
  );

  const activeProjects =
    projects.filter(
      (project) =>
        project.status !== "completed" &&
        project.status !== "cancelled",
    ).length;

  const completedProjects =
    projects.filter(
      (project) =>
        project.status === "completed",
    ).length;

  const activeConsultations =
    consultations.filter(
      (consultation) =>
        consultation.status !== "completed" &&
        consultation.status !== "cancelled",
    ).length;

  const selectedResearcher =
    selectedProject
      ? profileMap.get(
          selectedProject.user_id,
        )
      : undefined;

  const selectedWizard =
    (selectedProject?.wizard_data ??
      {}) as WizardAnswers;

  /*
   * File categories
   */

  const incomingFiles =
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
   * =======================================================
   * PROJECT STATUS
   * =======================================================
   */

  const updateStatus = async (
    projectId: string,
    status: string,
  ) => {
    setUpdatingId(projectId);

    const { error } = await supabase
      .from("projects")
      .update({ status })
      .eq("id", projectId);

    if (error) {
      console.error(error);

      toast.error(
        "تغییر وضعیت پروژه انجام نشد.",
      );

      setUpdatingId(null);
      return;
    }

    const updatedAt =
      new Date().toISOString();

    setProjects((current) =>
      current.map((project) =>
        project.id === projectId
          ? {
              ...project,
              status,
              updated_at: updatedAt,
            }
          : project,
      ),
    );

    setSelectedProject((current) =>
      current?.id === projectId
        ? {
            ...current,
            status,
            updated_at: updatedAt,
          }
        : current,
    );

    toast.success(
      "وضعیت پروژه به‌روزرسانی شد.",
    );

    setUpdatingId(null);
  };

  /*
   * =======================================================
   * MESSAGES
   * =======================================================
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
      console.error(error);

      setMessages([]);
      setMessagesLoading(false);

      toast.error(
        "دریافت پیام‌های پروژه انجام نشد.",
      );

      return;
    }

    setMessages(
      (data ??
        []) as ProjectMessageRow[],
    );

    setMessagesLoading(false);
  };

  const sendMessage = async () => {
    if (!selectedProject) return;

    const cleanMessage =
      messageText.trim();

    if (!cleanMessage) {
      toast.error(
        "متن پیام را وارد کنید.",
      );
      return;
    }

    setSendingMessage(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      toast.error(
        "نشست مدیریتی معتبر نیست؛ دوباره وارد شوید.",
      );

      setSendingMessage(false);
      return;
    }

    const { data, error } =
      await supabase
        .from("project_messages")
        .insert({
          project_id:
            selectedProject.id,
          sender_id: user.id,
          message: cleanMessage,
        })
        .select("*")
        .single();

    if (error) {
      console.error(error);

      toast.error(
        "ارسال پیام انجام نشد.",
      );

      setSendingMessage(false);
      return;
    }

    setMessages((current) => [
      ...current,
      data as ProjectMessageRow,
    ]);

    setMessageText("");
    setSendingMessage(false);

    toast.success(
      "پیام برای پژوهشگر ارسال شد.",
    );
  };

  /*
   * =======================================================
   * FILES
   * =======================================================
   */

  const loadProjectFiles = async (
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

      setDownloadingFileId(null);
    };

  /*
   * =======================================================
   * ADMIN OUTPUT UPLOAD
   * =======================================================
   */

  const uploadOutputFile = async (
    file: File,
    category: OutputCategory,
  ) => {
    if (!selectedProject) {
      toast.error(
        "ابتدا یک پروژه را باز کنید.",
      );
      return;
    }

    if (file.size <= 0) {
      toast.error(
        "فایل انتخاب‌شده خالی است.",
      );
      return;
    }

    if (
      file.size >
      MAX_STANDARD_UPLOAD_BYTES
    ) {
      toast.error(
        "در این مرحله حداکثر حجم آپلود مستقیم ۶ مگابایت است.",
      );
      return;
    }

    if (
      category === "report" &&
      file.type !==
        "application/pdf" &&
      !file.name
        .toLowerCase()
        .endsWith(".pdf")
    ) {
      toast.error(
        "گزارش رسمی باید فایل PDF باشد.",
      );
      return;
    }

    setUploadingCategory(category);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      toast.error(
        "نشست مدیریتی معتبر نیست؛ دوباره وارد شوید.",
      );

      setUploadingCategory(null);
      return;
    }

    const extension =
      safeExtension(file.name);

    const storagePath =
      `${selectedProject.id}/outputs/${category}/` +
      `${crypto.randomUUID()}${extension}`;

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

      setUploadingCategory(null);
      return;
    }

    const {
      data,
      error: metadataError,
    } = await supabase
      .from("project_files")
      .insert({
        project_id:
          selectedProject.id,

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

        category,
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

      setUploadingCategory(null);
      return;
    }

    setProjectFiles(
      (current) => [
        data as ProjectFileRow,
        ...current,
      ],
    );

    setUploadingCategory(null);

    toast.success(
      category === "report"
        ? "گزارش پروژه با موفقیت بارگذاری شد."
        : "نتیجه پروژه با موفقیت بارگذاری شد.",
    );
  };

  const handleOutputInputChange =
    async (
      event: ChangeEvent<HTMLInputElement>,
      category: OutputCategory,
    ) => {
      const file =
        event.target.files?.[0];

      event.target.value = "";

      if (!file) return;

      await uploadOutputFile(
        file,
        category,
      );
    };

  /*
   * Reload project data
   */

  useEffect(() => {
    if (!selectedProject) {
      setMessages([]);
      setProjectFiles([]);
      setMessageText("");
      return;
    }

    setMessages([]);
    setProjectFiles([]);
    setMessageText("");

    loadMessages(
      selectedProject.id,
    );

    loadProjectFiles(
      selectedProject.id,
    );
  }, [selectedProject?.id]);

  /*
   * =======================================================
   * CONSULTATIONS
   * =======================================================
   */

  const loadConsultations =
    async () => {
      setConsultationsLoading(
        true,
      );

      const { data, error } =
        await supabase
          .from("consultations")
          .select("*")
          .order("created_at", {
            ascending: false,
          });

      if (error) {
        console.error(error);

        toast.error(
          "دریافت درخواست‌های مشاوره انجام نشد.",
        );

        setConsultationsLoading(
          false,
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

  const openConsultation = (
    consultation: ConsultationRow,
  ) => {
    setSelectedConsultation(
      consultation,
    );

    setConsultationStatus(
      consultation.status,
    );

    setConsultationScheduledAt(
      toDateTimeLocalValue(
        consultation.scheduled_at,
      ),
    );

    setConsultationDuration(
      consultation.duration_minutes
        ? String(
            consultation.duration_minutes,
          )
        : "",
    );

    setConsultationMeetingUrl(
      consultation.meeting_url ??
        "",
    );

    setConsultationAdminNote(
      consultation.admin_note ??
        "",
    );
  };

  const saveConsultation =
    async () => {
      if (!selectedConsultation)
        return;

      if (
        consultationStatus ===
          "scheduled" &&
        !consultationScheduledAt
      ) {
        toast.error(
          "برای وضعیت «زمان‌بندی شده» تاریخ و ساعت جلسه را تعیین کنید.",
        );

        return;
      }

      let duration:
        | number
        | null = null;

      if (
        consultationDuration.trim()
      ) {
        duration = Number(
          consultationDuration,
        );

        if (
          !Number.isInteger(
            duration,
          ) ||
          duration < 15 ||
          duration > 240
        ) {
          toast.error(
            "مدت جلسه باید بین ۱۵ تا ۲۴۰ دقیقه باشد.",
          );

          return;
        }
      }

      const cleanMeetingUrl =
        consultationMeetingUrl.trim();

      if (
        cleanMeetingUrl &&
        !/^https?:\/\//i.test(
          cleanMeetingUrl,
        )
      ) {
        toast.error(
          "لینک جلسه باید با http:// یا https:// شروع شود.",
        );

        return;
      }

      let scheduledAt:
        | string
        | null = null;

      if (
        consultationScheduledAt
      ) {
        const date =
          new Date(
            consultationScheduledAt,
          );

        if (
          Number.isNaN(
            date.getTime(),
          )
        ) {
          toast.error(
            "تاریخ یا ساعت جلسه معتبر نیست.",
          );

          return;
        }

        scheduledAt =
          date.toISOString();
      }

      setSavingConsultation(
        true,
      );

      const {
        data,
        error,
      } = await supabase
        .from("consultations")
        .update({
          status:
            consultationStatus,

          scheduled_at:
            scheduledAt,

          duration_minutes:
            duration,

          meeting_url:
            cleanMeetingUrl ||
            null,

          admin_note:
            consultationAdminNote.trim() ||
            null,
        })
        .eq(
          "id",
          selectedConsultation.id,
        )
        .select("*")
        .single();

      if (error) {
        console.error(error);

        toast.error(
          "ذخیره اطلاعات مشاوره انجام نشد.",
        );

        setSavingConsultation(
          false,
        );

        return;
      }

      const updated =
        data as ConsultationRow;

      setConsultations(
        (current) =>
          current.map(
            (consultation) =>
              consultation.id ===
              updated.id
                ? updated
                : consultation,
          ),
      );

      setSelectedConsultation(
        updated,
      );

      setSavingConsultation(
        false,
      );

      toast.success(
        "اطلاعات مشاوره با موفقیت ذخیره شد.",
      );
    };

  /*
   * =======================================================
   * LOADING
   * =======================================================
   */

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center gap-2">
        <Loader2 className="size-5 animate-spin text-primary" />

        <span className="text-sm text-muted-foreground">
          در حال بارگذاری پنل مدیریت…
        </span>
      </div>
    );
  }

  /*
   * =======================================================
   * PAGE
   * =======================================================
   */

  return (
    <div className="mx-auto max-w-7xl px-4 py-14">
      {/* HEADER */}

      <div>
        <p className="text-sm font-semibold text-primary">
          HubGene Admin
        </p>

        <h1 className="mt-2 text-3xl text-navy">
          پنل مدیریت هاب‌ژن
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          مدیریت پروژه‌ها، مشاوره‌ها،
          فایل‌ها و خروجی‌های پژوهشی
        </p>
      </div>

      {/* STATISTICS */}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard
          icon={FolderKanban}
          label="کل پروژه‌ها"
          value={projects.length}
        />

        <StatCard
          icon={Activity}
          label="پروژه‌های فعال"
          value={activeProjects}
        />

        <StatCard
          icon={Users2}
          label="پژوهشگران"
          value={profiles.length}
        />

        <StatCard
          icon={CalendarClock}
          label="مشاوره‌های فعال"
          value={activeConsultations}
        />

        <StatCard
          icon={CheckCircle2}
          label="پروژه‌های تکمیل‌شده"
          value={completedProjects}
        />
      </div>

      {/* ===================================================
          CONSULTATIONS
      =================================================== */}

      <section className="card-elevated mt-8 overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-5">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-bold text-navy">
              <CalendarClock className="size-5 text-primary" />

              درخواست‌های مشاوره
            </h2>

            <p className="mt-1 text-xs text-muted-foreground">
              بررسی، زمان‌بندی و مدیریت
              جلسات پژوهشگران
            </p>
          </div>

          <button
            type="button"
            disabled={
              consultationsLoading
            }
            onClick={
              loadConsultations
            }
            className="inline-flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-xs text-muted-foreground transition-colors hover:bg-secondary disabled:opacity-50"
          >
            <RefreshCw
              className={`size-4 ${
                consultationsLoading
                  ? "animate-spin"
                  : ""
              }`}
            />

            بروزرسانی
          </button>
        </div>

        {consultationsLoading ? (
          <LoadingBox text="در حال دریافت درخواست‌های مشاوره…" />
        ) : consultations.length ===
          0 ? (
          <div className="p-12 text-center">
            <CalendarClock className="mx-auto size-8 text-primary/50" />

            <p className="mt-4 text-sm font-bold text-navy">
              هنوز درخواست مشاوره‌ای
              ثبت نشده است.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] text-sm">
              <thead className="bg-secondary/60 text-xs text-muted-foreground">
                <tr>
                  <th className="p-4 text-start">
                    پژوهشگر
                  </th>

                  <th className="p-4 text-start">
                    موضوع
                  </th>

                  <th className="p-4 text-start">
                    نوع مشاوره
                  </th>

                  <th className="p-4 text-start">
                    پروژه
                  </th>

                  <th className="p-4 text-start">
                    تاریخ درخواست
                  </th>

                  <th className="p-4 text-start">
                    وضعیت
                  </th>

                  <th className="p-4 text-start">
                    مدیریت
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border">
                {consultations.map(
                  (
                    consultation,
                  ) => {
                    const researcher =
                      profileMap.get(
                        consultation.user_id,
                      );

                    const project =
                      consultation.project_id
                        ? projectMap.get(
                            consultation.project_id,
                          )
                        : undefined;

                    return (
                      <tr
                        key={
                          consultation.id
                        }
                        className="hover:bg-secondary/30"
                      >
                        <td className="p-4">
                          <p className="font-semibold text-navy">
                            {researcher?.full_name ||
                              "پژوهشگر"}
                          </p>

                          {researcher?.organization && (
                            <p className="mt-1 text-[11px] text-muted-foreground">
                              {
                                researcher.organization
                              }
                            </p>
                          )}
                        </td>

                        <td className="p-4">
                          <p className="max-w-xs font-semibold text-navy">
                            {
                              consultation.subject
                            }
                          </p>
                        </td>

                        <td className="p-4 text-xs text-muted-foreground">
                          {consultationTypeLabels[
                            consultation
                              .consultation_type
                          ] ??
                            consultation.consultation_type}
                        </td>

                        <td className="p-4">
                          {project ? (
                            <>
                              <p className="text-xs font-semibold text-navy">
                                {
                                  project.title
                                }
                              </p>

                              <p
                                className="mt-1 text-[10px] text-muted-foreground"
                                dir="ltr"
                              >
                                {shortId(
                                  project.id,
                                )}
                              </p>
                            </>
                          ) : (
                            <span className="text-xs text-muted-foreground">
                              مشاوره عمومی
                            </span>
                          )}
                        </td>

                        <td className="p-4 text-xs text-muted-foreground">
                          {formatDateTime(
                            consultation.created_at,
                          )}
                        </td>

                        <td className="p-4">
                          <ConsultationStatusBadge
                            status={
                              consultation.status
                            }
                          />
                        </td>

                        <td className="p-4">
                          <button
                            type="button"
                            onClick={() =>
                              openConsultation(
                                consultation,
                              )
                            }
                            className="inline-flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-xs font-semibold text-navy transition-colors hover:border-primary hover:bg-accent"
                          >
                            <Eye className="size-4 text-primary" />

                            مدیریت درخواست
                          </button>
                        </td>
                      </tr>
                    );
                  },
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ===================================================
          CONSULTATION EDITOR
      =================================================== */}

      {selectedConsultation && (
        <section className="card-elevated mt-6 p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-primary">
                مدیریت مشاوره
              </p>

              <h2 className="mt-2 text-xl font-bold text-navy">
                {
                  selectedConsultation.subject
                }
              </h2>

              <p className="mt-2 text-xs text-muted-foreground">
                پژوهشگر:{" "}
                <span className="font-semibold text-navy">
                  {profileMap.get(
                    selectedConsultation.user_id,
                  )?.full_name ||
                    "پژوهشگر"}
                </span>
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setSelectedConsultation(
                  null,
                )
              }
              className="rounded-xl border border-border px-4 py-2 text-xs text-muted-foreground transition-colors hover:bg-secondary"
            >
              بستن
            </button>
          </div>

          {/* REQUEST DETAILS */}

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <DetailCard
              label="نوع مشاوره"
              value={
                consultationTypeLabels[
                  selectedConsultation
                    .consultation_type
                ] ??
                selectedConsultation.consultation_type
              }
            />

            <DetailCard
              label="تاریخ درخواست"
              value={formatDateTime(
                selectedConsultation.created_at,
              )}
            />

            <DetailCard
              label="پروژه"
              value={
                selectedConsultation.project_id
                  ? projectMap.get(
                      selectedConsultation.project_id,
                    )?.title ||
                    "پروژه"
                  : "مشاوره عمومی"
              }
            />
          </div>

          {selectedConsultation.description && (
            <div className="mt-5 rounded-2xl border border-border bg-secondary/20 p-5">
              <p className="text-xs font-bold text-navy">
                توضیحات پژوهشگر
              </p>

              <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
                {
                  selectedConsultation.description
                }
              </p>
            </div>
          )}

          {/* ADMIN FIELDS */}

          <div className="mt-7 border-t border-border pt-6">
            <h3 className="text-base font-bold text-navy">
              تنظیمات جلسه
            </h3>

            <p className="mt-1 text-xs text-muted-foreground">
              اطلاعات ذخیره‌شده در این
              قسمت مستقیماً در داشبورد
              پژوهشگر نمایش داده می‌شود.
            </p>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              {/* STATUS */}

              <div>
                <label
                  htmlFor="consultation-status"
                  className="text-sm font-bold text-navy"
                >
                  وضعیت درخواست
                </label>

                <select
                  id="consultation-status"
                  value={
                    consultationStatus
                  }
                  onChange={(event) =>
                    setConsultationStatus(
                      event.target.value,
                    )
                  }
                  className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-navy outline-none focus:border-primary"
                >
                  {consultationStatusOptions.map(
                    (option) => (
                      <option
                        key={
                          option.value
                        }
                        value={
                          option.value
                        }
                      >
                        {
                          option.label
                        }
                      </option>
                    ),
                  )}
                </select>
              </div>

              {/* DATETIME */}

              <div>
                <label
                  htmlFor="consultation-datetime"
                  className="text-sm font-bold text-navy"
                >
                  تاریخ و ساعت جلسه
                </label>

                <input
                  id="consultation-datetime"
                  type="datetime-local"
                  value={
                    consultationScheduledAt
                  }
                  onChange={(event) =>
                    setConsultationScheduledAt(
                      event.target.value,
                    )
                  }
                  className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-navy outline-none focus:border-primary"
                />
              </div>

              {/* DURATION */}

              <div>
                <label
                  htmlFor="consultation-duration"
                  className="text-sm font-bold text-navy"
                >
                  مدت جلسه
                </label>

                <div className="mt-2 flex items-center gap-2">
                  <input
                    id="consultation-duration"
                    type="number"
                    min={15}
                    max={240}
                    step={15}
                    value={
                      consultationDuration
                    }
                    onChange={(event) =>
                      setConsultationDuration(
                        event.target.value,
                      )
                    }
                    placeholder="45"
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-navy outline-none focus:border-primary"
                  />

                  <span className="shrink-0 text-xs text-muted-foreground">
                    دقیقه
                  </span>
                </div>
              </div>

              {/* MEETING URL */}

              <div>
                <label
                  htmlFor="consultation-url"
                  className="text-sm font-bold text-navy"
                >
                  لینک جلسه
                </label>

                <input
                  id="consultation-url"
                  type="url"
                  dir="ltr"
                  value={
                    consultationMeetingUrl
                  }
                  onChange={(event) =>
                    setConsultationMeetingUrl(
                      event.target.value,
                    )
                  }
                  placeholder="https://meet.google.com/..."
                  className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-navy outline-none focus:border-primary"
                />

                {consultationMeetingUrl.trim() &&
                  /^https?:\/\//i.test(
                    consultationMeetingUrl.trim(),
                  ) && (
                    <a
                      href={
                        consultationMeetingUrl
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                    >
                      <ExternalLink className="size-3.5" />
                      تست لینک جلسه
                    </a>
                  )}
              </div>
            </div>

            {/* ADMIN NOTE */}

            <div className="mt-5">
              <label
                htmlFor="consultation-note"
                className="text-sm font-bold text-navy"
              >
                یادداشت برای پژوهشگر
              </label>

              <p className="mt-1 text-xs text-muted-foreground">
                این متن برای پژوهشگر در
                Dashboard نمایش داده
                خواهد شد.
              </p>

              <textarea
                id="consultation-note"
                rows={5}
                maxLength={5000}
                value={
                  consultationAdminNote
                }
                onChange={(event) =>
                  setConsultationAdminNote(
                    event.target.value,
                  )
                }
                placeholder="مثلاً: لطفاً پیش از جلسه فایل متادیتای نمونه‌ها را در بخش داده‌های پروژه بارگذاری کنید."
                className="mt-3 w-full resize-y rounded-2xl border border-border bg-background px-4 py-3 text-sm leading-7 text-navy outline-none placeholder:text-muted-foreground focus:border-primary"
              />

              <p className="mt-2 text-[11px] text-muted-foreground">
                {new Intl.NumberFormat(
                  "fa-IR",
                ).format(
                  consultationAdminNote.length,
                )}

                {" / "}

                ۵۰۰۰ کاراکتر
              </p>
            </div>

            {/* SAVE */}

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                disabled={
                  savingConsultation
                }
                onClick={
                  saveConsultation
                }
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {savingConsultation ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Save className="size-4" />
                )}

                ذخیره اطلاعات مشاوره
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ===================================================
          PROJECT TABLE
      =================================================== */}

      <section className="card-elevated mt-8 overflow-hidden">
        <div className="border-b border-border p-5">
          <h2 className="text-lg font-bold text-navy">
            پروژه‌های پژوهشی
          </h2>

          <p className="mt-1 text-xs text-muted-foreground">
            مشاهده و مدیریت پروژه‌های
            ثبت‌شده
          </p>
        </div>

        {projects.length === 0 ? (
          <div className="p-10 text-center text-sm text-muted-foreground">
            هنوز پروژه‌ای ثبت نشده است.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] text-sm">
              <thead className="bg-secondary/60 text-xs text-muted-foreground">
                <tr>
                  <th className="p-4 text-start">
                    شناسه
                  </th>

                  <th className="p-4 text-start">
                    پروژه
                  </th>

                  <th className="p-4 text-start">
                    پژوهشگر
                  </th>

                  <th className="p-4 text-start">
                    نوع تحلیل
                  </th>

                  <th className="p-4 text-start">
                    تاریخ ثبت
                  </th>

                  <th className="p-4 text-start">
                    وضعیت
                  </th>

                  <th className="p-4 text-start">
                    جزئیات
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border">
                {projects.map(
                  (project) => {
                    const researcher =
                      profileMap.get(
                        project.user_id,
                      );

                    return (
                      <tr
                        key={project.id}
                        className="hover:bg-secondary/30"
                      >
                        <td
                          className="p-4 text-xs"
                          dir="ltr"
                        >
                          {shortId(
                            project.id,
                          )}
                        </td>

                        <td className="p-4">
                          <p className="font-semibold text-navy">
                            {
                              project.title
                            }
                          </p>
                        </td>

                        <td className="p-4">
                          <p className="font-medium text-navy">
                            {researcher?.full_name ||
                              "پژوهشگر"}
                          </p>

                          {researcher?.organization && (
                            <p className="mt-1 text-xs text-muted-foreground">
                              {
                                researcher.organization
                              }
                            </p>
                          )}
                        </td>

                        <td className="p-4 text-muted-foreground">
                          {project.analysis_type ??
                            "—"}
                        </td>

                        <td className="p-4 text-muted-foreground">
                          {formatDate(
                            project.created_at,
                          )}
                        </td>

                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <select
                              value={
                                project.status
                              }
                              disabled={
                                updatingId ===
                                project.id
                              }
                              onChange={(
                                event,
                              ) =>
                                updateStatus(
                                  project.id,
                                  event.target.value,
                                )
                              }
                              className="rounded-xl border border-border bg-background px-3 py-2 text-xs text-navy outline-none focus:border-primary"
                            >
                              {projectStatusOptions.map(
                                (
                                  option,
                                ) => (
                                  <option
                                    key={
                                      option.value
                                    }
                                    value={
                                      option.value
                                    }
                                  >
                                    {
                                      option.label
                                    }
                                  </option>
                                ),
                              )}
                            </select>

                            {updatingId ===
                              project.id && (
                              <Loader2 className="size-4 animate-spin text-primary" />
                            )}
                          </div>

                          <p className="mt-1 text-[11px] text-muted-foreground">
                            {statusLabel(
                              project.status,
                            )}
                          </p>
                        </td>

                        <td className="p-4">
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedProject(
                                project,
                              )
                            }
                            className="inline-flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-xs font-semibold text-navy transition-colors hover:border-primary hover:bg-accent"
                          >
                            <Eye className="size-4 text-primary" />

                            مشاهده پروژه
                          </button>
                        </td>
                      </tr>
                    );
                  },
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ===================================================
          SELECTED PROJECT
      =================================================== */}

      {selectedProject && (
        <section className="card-elevated mt-8 p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-primary">
                جزئیات پروژه
              </p>

              <h2 className="mt-2 text-xl font-bold text-navy">
                {
                  selectedProject.title
                }
              </h2>

              <p
                className="mt-1 text-xs text-muted-foreground"
                dir="ltr"
              >
                {shortId(
                  selectedProject.id,
                )}
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setSelectedProject(null)
              }
              className="rounded-xl border border-border px-4 py-2 text-xs text-muted-foreground transition-colors hover:bg-secondary"
            >
              بستن
            </button>
          </div>

          {/* PROJECT INFO */}

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <DetailCard
              label="پژوهشگر"
              value={
                selectedResearcher?.full_name ||
                "پژوهشگر"
              }
            />

            <DetailCard
              label="سازمان / دانشگاه"
              value={
                selectedResearcher?.organization ||
                "—"
              }
            />

            <DetailCard
              label="حوزه پژوهشی پروفایل"
              value={
                selectedResearcher?.research_field ||
                "—"
              }
            />

            <DetailCard
              label="نوع تحلیل"
              value={
                selectedProject.analysis_type ||
                "—"
              }
            />

            <DetailCard
              label="وضعیت پروژه"
              value={statusLabel(
                selectedProject.status,
              )}
            />

            <DetailCard
              label="تاریخ ثبت"
              value={formatDate(
                selectedProject.created_at,
              )}
            />

            <DetailCard
              label="آخرین به‌روزرسانی"
              value={formatDate(
                selectedProject.updated_at,
              )}
            />

            <DetailCard
              label="مرحله پژوهش"
              value={labelFor(
                "stage",
                selectedWizard.stage,
              )}
            />
          </div>

          {/* WIZARD */}

          <div className="mt-8 border-t border-border pt-6">
            <h3 className="text-base font-bold text-navy">
              اطلاعات ثبت‌شده در طراح
              پروژه
            </h3>

            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <DetailCard
                label="مرحله پژوهش"
                value={labelFor(
                  "stage",
                  selectedWizard.stage,
                )}
              />

              <DetailCard
                label="حوزه پژوهشی"
                value={labelFor(
                  "field",
                  selectedWizard.field,
                )}
              />

              <DetailCard
                label="ارگانیسم / مدل"
                value={labelFor(
                  "organism",
                  selectedWizard.organism,
                )}
              />

              <DetailCard
                label="نوع داده"
                value={labelFor(
                  "dataType",
                  selectedWizard.dataType,
                )}
              />

              <DetailCard
                label="هدف پژوهشی"
                value={labelFor(
                  "goal",
                  selectedWizard.goal,
                )}
              />

              <DetailCard
                label="نوع تحلیل پیشنهادی"
                value={
                  selectedProject.analysis_type ||
                  "—"
                }
              />
            </div>
          </div>

          {/* OUTPUT UPLOAD */}

          <div className="mt-8 border-t border-border pt-6">
            <p className="text-xs font-semibold text-primary">
              تحویل خروجی پروژه
            </p>

            <h3 className="mt-1 text-lg font-bold text-navy">
              گزارش‌ها و نتایج هاب‌ژن
            </h3>

            <input
              ref={reportInputRef}
              type="file"
              accept=".pdf,application/pdf"
              className="hidden"
              onChange={(event) =>
                handleOutputInputChange(
                  event,
                  "report",
                )
              }
            />

            <input
              ref={resultInputRef}
              type="file"
              className="hidden"
              onChange={(event) =>
                handleOutputInputChange(
                  event,
                  "result",
                )
              }
            />

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-primary/20 bg-accent/30 p-5">
                <FileBarChart className="size-5 text-primary" />

                <h4 className="mt-3 text-sm font-bold text-navy">
                  گزارش پروژه
                </h4>

                <p className="mt-1 text-xs leading-6 text-muted-foreground">
                  گزارش رسمی PDF برای
                  پژوهشگر
                </p>

                <button
                  type="button"
                  disabled={
                    uploadingCategory !==
                    null
                  }
                  onClick={() =>
                    reportInputRef.current?.click()
                  }
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground disabled:opacity-50"
                >
                  {uploadingCategory ===
                  "report" ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <CloudUpload className="size-4" />
                  )}

                  آپلود گزارش PDF
                </button>
              </div>

              <div className="rounded-2xl border border-primary/20 bg-accent/30 p-5">
                <Image className="size-5 text-primary" />

                <h4 className="mt-3 text-sm font-bold text-navy">
                  نتیجه / خروجی تحلیل
                </h4>

                <p className="mt-1 text-xs leading-6 text-muted-foreground">
                  Figure، Excel، CSV، ZIP
                  و سایر خروجی‌ها
                </p>

                <button
                  type="button"
                  disabled={
                    uploadingCategory !==
                    null
                  }
                  onClick={() =>
                    resultInputRef.current?.click()
                  }
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground disabled:opacity-50"
                >
                  {uploadingCategory ===
                  "result" ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <CloudUpload className="size-4" />
                  )}

                  آپلود نتیجه
                </button>
              </div>
            </div>
          </div>

          {/* PROJECT FILES */}

          <div className="mt-8 border-t border-border pt-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="flex items-center gap-2 text-base font-bold text-navy">
                  <FileText className="size-5 text-primary" />

                  فایل‌های پروژه
                </h3>
              </div>

              <RefreshButton
                loading={filesLoading}
                onClick={() =>
                  loadProjectFiles(
                    selectedProject.id,
                  )
                }
              />
            </div>

            {filesLoading ? (
              <LoadingBox text="در حال دریافت فایل‌ها…" />
            ) : (
              <div className="mt-5 space-y-6">
                <FileListSection
                  title="داده‌های پژوهشگر"
                  files={
                    incomingFiles
                  }
                  emptyText="هنوز داده‌ای دریافت نشده است."
                  downloadingFileId={
                    downloadingFileId
                  }
                  onDownload={
                    downloadProjectFile
                  }
                />

                <FileListSection
                  title="گزارش‌های تحویلی"
                  files={
                    reportFiles
                  }
                  emptyText="هنوز گزارشی تحویل نشده است."
                  downloadingFileId={
                    downloadingFileId
                  }
                  onDownload={
                    downloadProjectFile
                  }
                />

                <FileListSection
                  title="نتایج تحلیل"
                  files={
                    resultFiles
                  }
                  emptyText="هنوز نتیجه‌ای تحویل نشده است."
                  downloadingFileId={
                    downloadingFileId
                  }
                  onDownload={
                    downloadProjectFile
                  }
                />
              </div>
            )}
          </div>

          {/* MESSAGES */}

          <div className="mt-8 border-t border-border pt-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="flex items-center gap-2 text-base font-bold text-navy">
                  <MessageSquare className="size-5 text-primary" />

                  پیام‌های پروژه
                </h3>
              </div>

              <RefreshButton
                loading={
                  messagesLoading
                }
                onClick={() =>
                  loadMessages(
                    selectedProject.id,
                  )
                }
              />
            </div>

            <div className="mt-5 rounded-2xl border border-border bg-secondary/20 p-4">
              {messagesLoading ? (
                <LoadingBox text="در حال دریافت پیام‌ها…" />
              ) : messages.length === 0 ? (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  هنوز پیامی ثبت نشده
                  است.
                </div>
              ) : (
                <div className="space-y-3">
                  {messages.map(
                    (message) => {
                      const fromResearcher =
                        message.sender_id ===
                        selectedProject.user_id;

                      return (
                        <div
                          key={
                            message.id
                          }
                          className={`max-w-3xl rounded-2xl border p-4 ${
                            fromResearcher
                              ? "mr-auto border-border bg-background"
                              : "ml-auto border-primary/20 bg-accent/40"
                          }`}
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="text-xs font-bold text-navy">
                              {fromResearcher
                                ? selectedResearcher?.full_name ||
                                  "پژوهشگر"
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

            <div className="mt-5">
              <label
                htmlFor="admin-message"
                className="text-sm font-bold text-navy"
              >
                ارسال پیام به پژوهشگر
              </label>

              <textarea
                id="admin-message"
                value={messageText}
                onChange={(event) =>
                  setMessageText(
                    event.target.value,
                  )
                }
                rows={4}
                maxLength={5000}
                placeholder="پیام خود را بنویسید..."
                className="mt-3 w-full resize-y rounded-2xl border border-border bg-background px-4 py-3 text-sm leading-7 text-navy outline-none focus:border-primary"
              />

              <div className="mt-3 flex justify-end">
                <button
                  type="button"
                  disabled={
                    sendingMessage ||
                    !messageText.trim()
                  }
                  onClick={sendMessage}
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
        </section>
      )}
    </div>
  );
}

/*
 * =========================================================
 * COMPONENTS
 * =========================================================
 */

function StatCard({
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

function DetailCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-secondary/30 p-4">
      <p className="text-xs text-muted-foreground">
        {label}
      </p>

      <p className="mt-2 text-sm font-semibold leading-6 text-navy">
        {value || "—"}
      </p>
    </div>
  );
}

function ConsultationStatusBadge({
  status,
}: {
  status: string;
}) {
  const label =
    consultationStatusLabels[
      status
    ] ?? status;

  const className =
    status === "completed"
      ? "border-primary/20 bg-accent text-primary"
      : status === "cancelled"
        ? "border-destructive/20 bg-destructive/5 text-destructive"
        : status === "scheduled"
          ? "border-primary/30 bg-primary/10 text-primary"
          : status === "reviewing"
            ? "border-primary/20 bg-accent/50 text-navy"
            : "border-border bg-background text-muted-foreground";

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1.5 text-[11px] font-semibold ${className}`}
    >
      {label}
    </span>
  );
}

function FileListSection({
  title,
  files,
  emptyText,
  downloadingFileId,
  onDownload,
}: {
  title: string;
  files: ProjectFileRow[];
  emptyText: string;
  downloadingFileId:
    | string
    | null;
  onDownload: (
    file: ProjectFileRow,
  ) => Promise<void>;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border">
      <div className="flex items-center justify-between gap-3 border-b border-border bg-secondary/30 p-4">
        <h4 className="text-sm font-bold text-navy">
          {title}
        </h4>

        <span className="text-xs text-muted-foreground">
          {new Intl.NumberFormat(
            "fa-IR",
          ).format(files.length)}
          {" فایل"}
        </span>
      </div>

      {files.length === 0 ? (
        <div className="p-8 text-center text-xs text-muted-foreground">
          {emptyText}
        </div>
      ) : (
        <ul className="divide-y divide-border">
          {files.map((file) => (
            <li
              key={file.id}
              className="flex flex-wrap items-center justify-between gap-4 p-4"
            >
              <div className="min-w-0">
                <p
                  className="truncate text-sm font-semibold text-navy"
                  dir="auto"
                >
                  {file.original_name}
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
                  onDownload(file)
                }
                className="inline-flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-xs font-semibold text-navy hover:bg-accent disabled:opacity-50"
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
          ))}
        </ul>
      )}
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
    <div className="flex items-center justify-center gap-2 p-10 text-sm text-muted-foreground">
      <Loader2 className="size-4 animate-spin" />
      {text}
    </div>
  );
}

/*
 * =========================================================
 * HELPERS
 * =========================================================
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

function toDateTimeLocalValue(
  iso: string | null,
) {
  if (!iso) return "";

  const date = new Date(iso);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return "";
  }

  const year =
    date.getFullYear();

  const month = String(
    date.getMonth() + 1,
  ).padStart(2, "0");

  const day = String(
    date.getDate(),
  ).padStart(2, "0");

  const hour = String(
    date.getHours(),
  ).padStart(2, "0");

  const minute = String(
    date.getMinutes(),
  ).padStart(2, "0");

  return `${year}-${month}-${day}T${hour}:${minute}`;
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
