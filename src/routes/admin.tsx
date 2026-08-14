import { createFileRoute, redirect } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  CheckCircle2,
  Download,
  Eye,
  FileText,
  FolderKanban,
  Loader2,
  MessageSquare,
  RefreshCw,
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

const statusOptions = [
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
      { title: "پنل مدیریت | هاب‌ژن" },
      {
        name: "description",
        content: "مدیریت پروژه‌های پژوهشی هاب‌ژن",
      },
      { name: "robots", content: "noindex" },
    ],
  }),

  component: Admin,
});

function Admin() {
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [profiles, setProfiles] = useState<ProfileRow[]>([]);
  const [loading, setLoading] = useState(true);

  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const [selectedProject, setSelectedProject] =
    useState<ProjectRow | null>(null);

  /*
   * Messages
   */
  const [messages, setMessages] = useState<ProjectMessageRow[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);

  /*
   * Files
   */
  const [projectFiles, setProjectFiles] = useState<ProjectFileRow[]>([]);
  const [filesLoading, setFilesLoading] = useState(false);
  const [downloadingFileId, setDownloadingFileId] =
    useState<string | null>(null);

  /*
   * Load projects + profiles
   */
  useEffect(() => {
    let mounted = true;

    async function loadData() {
      setLoading(true);

      const [projectsResult, profilesResult] = await Promise.all([
        supabase
          .from("projects")
          .select("*")
          .order("created_at", { ascending: false }),

        supabase
          .from("profiles")
          .select("id, full_name, organization, research_field"),
      ]);

      if (!mounted) return;

      if (projectsResult.error || profilesResult.error) {
        toast.error("دریافت اطلاعات پنل مدیریت با خطا مواجه شد.");
        setLoading(false);
        return;
      }

      setProjects((projectsResult.data ?? []) as ProjectRow[]);
      setProfiles((profilesResult.data ?? []) as ProfileRow[]);
      setLoading(false);
    }

    loadData();

    return () => {
      mounted = false;
    };
  }, []);

  const profileMap = useMemo(
    () => new Map(profiles.map((profile) => [profile.id, profile])),
    [profiles],
  );

  const activeProjects = projects.filter(
    (project) =>
      project.status !== "completed" &&
      project.status !== "cancelled",
  ).length;

  const completedProjects = projects.filter(
    (project) => project.status === "completed",
  ).length;

  const selectedResearcher = selectedProject
    ? profileMap.get(selectedProject.user_id)
    : undefined;

  const selectedWizard = (selectedProject?.wizard_data ??
    {}) as WizardAnswers;

  /*
   * =========================
   * STATUS
   * =========================
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
      toast.error("تغییر وضعیت پروژه انجام نشد.");
      setUpdatingId(null);
      return;
    }

    const updatedAt = new Date().toISOString();

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

    toast.success("وضعیت پروژه به‌روزرسانی شد.");
    setUpdatingId(null);
  };

  /*
   * =========================
   * MESSAGES
   * =========================
   */

  const loadMessages = async (projectId: string) => {
    setMessagesLoading(true);

    const { data, error } = await supabase
      .from("project_messages")
      .select("*")
      .eq("project_id", projectId)
      .order("created_at", { ascending: true });

    if (error) {
      toast.error("دریافت پیام‌های پروژه انجام نشد.");
      setMessagesLoading(false);
      return;
    }

    setMessages((data ?? []) as ProjectMessageRow[]);
    setMessagesLoading(false);
  };

  const sendMessage = async () => {
    if (!selectedProject) return;

    const cleanMessage = messageText.trim();

    if (!cleanMessage) {
      toast.error("متن پیام را وارد کنید.");
      return;
    }

    setSendingMessage(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      toast.error("نشست مدیریتی معتبر نیست؛ دوباره وارد شوید.");
      setSendingMessage(false);
      return;
    }

    const { data, error } = await supabase
      .from("project_messages")
      .insert({
        project_id: selectedProject.id,
        sender_id: user.id,
        message: cleanMessage,
      })
      .select("*")
      .single();

    if (error) {
      toast.error("ارسال پیام انجام نشد.");
      setSendingMessage(false);
      return;
    }

    setMessages((current) => [
      ...current,
      data as ProjectMessageRow,
    ]);

    setMessageText("");
    setSendingMessage(false);

    toast.success("پیام برای پژوهشگر ارسال شد.");
  };

  /*
   * =========================
   * FILES
   * =========================
   */

  const loadProjectFiles = async (projectId: string) => {
    setFilesLoading(true);

    const { data, error } = await supabase
      .from("project_files")
      .select("*")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);

      setProjectFiles([]);
      setFilesLoading(false);

      toast.error("دریافت فایل‌های پروژه انجام نشد.");
      return;
    }

    setProjectFiles((data ?? []) as ProjectFileRow[]);
    setFilesLoading(false);
  };

  const downloadProjectFile = async (file: ProjectFileRow) => {
    setDownloadingFileId(file.id);

    const { data, error } = await supabase.storage
      .from(file.bucket_id)
      .download(file.storage_path);

    if (error || !data) {
      console.error(error);

      toast.error("دانلود فایل انجام نشد.");
      setDownloadingFileId(null);
      return;
    }

    const objectUrl = URL.createObjectURL(data);

    const anchor = document.createElement("a");

    anchor.href = objectUrl;
    anchor.download = file.original_name;

    document.body.appendChild(anchor);

    anchor.click();
    anchor.remove();

    URL.revokeObjectURL(objectUrl);

    setDownloadingFileId(null);
  };

  /*
   * When admin opens a project,
   * load both messages and files.
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

    loadMessages(selectedProject.id);
    loadProjectFiles(selectedProject.id);
  }, [selectedProject?.id]);

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

  return (
    <div className="mx-auto max-w-7xl px-4 py-14">
      {/* =========================
          HEADER
      ========================= */}

      <div>
        <p className="text-sm font-semibold text-primary">
          HubGene Admin
        </p>

        <h1 className="mt-2 text-3xl text-navy">
          پنل مدیریت هاب‌ژن
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          مدیریت پروژه‌های پژوهشی و وضعیت اجرای آن‌ها
        </p>
      </div>

      {/* =========================
          STATISTICS
      ========================= */}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
          icon={CheckCircle2}
          label="پروژه‌های تکمیل‌شده"
          value={completedProjects}
        />
      </div>

      {/* =========================
          PROJECT TABLE
      ========================= */}

      <div className="card-elevated mt-8 overflow-hidden">
        <div className="border-b border-border p-5">
          <h2 className="text-lg font-bold text-navy">
            پروژه‌های پژوهشی
          </h2>

          <p className="mt-1 text-xs text-muted-foreground">
            مشاهده و مدیریت پروژه‌های ثبت‌شده
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
                  <th className="p-4 text-start">شناسه</th>
                  <th className="p-4 text-start">پروژه</th>
                  <th className="p-4 text-start">پژوهشگر</th>
                  <th className="p-4 text-start">نوع تحلیل</th>
                  <th className="p-4 text-start">تاریخ ثبت</th>
                  <th className="p-4 text-start">وضعیت</th>
                  <th className="p-4 text-start">جزئیات</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border">
                {projects.map((project) => {
                  const researcher = profileMap.get(project.user_id);

                  return (
                    <tr
                      key={project.id}
                      className="hover:bg-secondary/30"
                    >
                      <td className="p-4 text-xs" dir="ltr">
                        {shortId(project.id)}
                      </td>

                      <td className="p-4">
                        <p className="font-semibold text-navy">
                          {project.title}
                        </p>
                      </td>

                      <td className="p-4">
                        <p className="font-medium text-navy">
                          {researcher?.full_name || "پژوهشگر"}
                        </p>

                        {researcher?.organization && (
                          <p className="mt-1 text-xs text-muted-foreground">
                            {researcher.organization}
                          </p>
                        )}
                      </td>

                      <td className="p-4 text-muted-foreground">
                        {project.analysis_type ?? "—"}
                      </td>

                      <td className="p-4 text-muted-foreground">
                        {formatDate(project.created_at)}
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <select
                            value={project.status}
                            disabled={updatingId === project.id}
                            onChange={(event) =>
                              updateStatus(
                                project.id,
                                event.target.value,
                              )
                            }
                            className="rounded-xl border border-border bg-background px-3 py-2 text-xs text-navy outline-none focus:border-primary"
                          >
                            {statusOptions.map((option) => (
                              <option
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </option>
                            ))}
                          </select>

                          {updatingId === project.id && (
                            <Loader2 className="size-4 animate-spin text-primary" />
                          )}
                        </div>

                        <p className="mt-1 text-[11px] text-muted-foreground">
                          {statusLabel(project.status)}
                        </p>
                      </td>

                      <td className="p-4">
                        <button
                          onClick={() => setSelectedProject(project)}
                          className="inline-flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-xs font-semibold text-navy transition-colors hover:border-primary hover:bg-accent"
                        >
                          <Eye className="size-4 text-primary" />

                          مشاهده پروژه
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* =========================
          SELECTED PROJECT
      ========================= */}

      {selectedProject && (
        <section className="card-elevated mt-8 p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-primary">
                جزئیات پروژه
              </p>

              <h2 className="mt-2 text-xl font-bold text-navy">
                {selectedProject.title}
              </h2>

              <p
                className="mt-1 text-xs text-muted-foreground"
                dir="ltr"
              >
                {shortId(selectedProject.id)}
              </p>
            </div>

            <button
              onClick={() => setSelectedProject(null)}
              className="rounded-xl border border-border px-4 py-2 text-xs text-muted-foreground transition-colors hover:bg-secondary"
            >
              بستن
            </button>
          </div>

          {/* =========================
              PROJECT DETAILS
          ========================= */}

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <DetailCard
              label="پژوهشگر"
              value={selectedResearcher?.full_name || "پژوهشگر"}
            />

            <DetailCard
              label="سازمان / دانشگاه"
              value={selectedResearcher?.organization || "—"}
            />

            <DetailCard
              label="حوزه پژوهشی پروفایل"
              value={selectedResearcher?.research_field || "—"}
            />

            <DetailCard
              label="نوع تحلیل"
              value={selectedProject.analysis_type || "—"}
            />

            <DetailCard
              label="وضعیت پروژه"
              value={statusLabel(selectedProject.status)}
            />

            <DetailCard
              label="تاریخ ثبت"
              value={formatDate(selectedProject.created_at)}
            />

            <DetailCard
              label="آخرین به‌روزرسانی"
              value={formatDate(selectedProject.updated_at)}
            />

            <DetailCard
              label="مرحله پژوهش"
              value={labelFor("stage", selectedWizard.stage)}
            />
          </div>

          {/* =========================
              WIZARD DATA
          ========================= */}

          <div className="mt-8 border-t border-border pt-6">
            <h3 className="text-base font-bold text-navy">
              اطلاعات ثبت‌شده در طراح پروژه
            </h3>

            <p className="mt-1 text-xs text-muted-foreground">
              پاسخ‌هایی که پژوهشگر هنگام ثبت پروژه وارد کرده است.
            </p>

            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <DetailCard
                label="مرحله پژوهش"
                value={labelFor("stage", selectedWizard.stage)}
              />

              <DetailCard
                label="حوزه پژوهشی"
                value={labelFor("field", selectedWizard.field)}
              />

              <DetailCard
                label="ارگانیسم / مدل"
                value={labelFor("organism", selectedWizard.organism)}
              />

              <DetailCard
                label="نوع داده"
                value={labelFor("dataType", selectedWizard.dataType)}
              />

              <DetailCard
                label="هدف پژوهشی"
                value={labelFor("goal", selectedWizard.goal)}
              />

              <DetailCard
                label="نوع تحلیل پیشنهادی"
                value={selectedProject.analysis_type || "—"}
              />
            </div>
          </div>

          {/* =========================
              REAL PROJECT FILES
          ========================= */}

          <div className="mt-8 border-t border-border pt-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="flex items-center gap-2 text-base font-bold text-navy">
                  <FileText className="size-5 text-primary" />

                  فایل‌های پروژه
                </h3>

                <p className="mt-1 text-xs text-muted-foreground">
                  فایل‌هایی که پژوهشگر برای این پروژه بارگذاری کرده است.
                </p>
              </div>

              <button
                type="button"
                disabled={filesLoading}
                onClick={() =>
                  loadProjectFiles(selectedProject.id)
                }
                className="inline-flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-xs text-muted-foreground transition-colors hover:bg-secondary disabled:opacity-50"
              >
                <RefreshCw
                  className={`size-4 ${
                    filesLoading ? "animate-spin" : ""
                  }`}
                />

                بروزرسانی فایل‌ها
              </button>
            </div>

            {filesLoading ? (
              <div className="mt-4 flex items-center justify-center gap-2 rounded-2xl border border-border py-12 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" />

                در حال دریافت فایل‌ها…
              </div>
            ) : projectFiles.length === 0 ? (
              <div className="mt-4 rounded-2xl border border-border p-10 text-center">
                <FileText className="mx-auto size-7 text-primary/50" />

                <p className="mt-3 text-sm font-bold text-navy">
                  هنوز فایلی برای این پروژه ثبت نشده است.
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  فایل‌هایی که پژوهشگر بارگذاری کند در این بخش
                  نمایش داده می‌شوند.
                </p>
              </div>
            ) : (
              <div className="mt-4 overflow-hidden rounded-2xl border border-border">
                <div className="border-b border-border bg-secondary/30 px-4 py-3">
                  <p className="text-xs text-muted-foreground">
                    تعداد فایل‌های پروژه:{" "}
                    <span className="font-bold text-navy">
                      {new Intl.NumberFormat("fa-IR").format(
                        projectFiles.length,
                      )}
                    </span>
                  </p>
                </div>

                <ul className="divide-y divide-border">
                  {projectFiles.map((file) => (
                    <li
                      key={file.id}
                      className="flex flex-wrap items-center justify-between gap-4 p-4"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <FileText className="size-4 shrink-0 text-primary" />

                          <p
                            className="truncate text-sm font-semibold text-navy"
                            dir="auto"
                          >
                            {file.original_name}
                          </p>
                        </div>

                        <p className="mt-1 text-[11px] text-muted-foreground">
                          {formatFileSize(file.size_bytes)}

                          {" · "}

                          {file.mime_type || "نوع فایل نامشخص"}

                          {" · "}

                          {formatDateTime(file.created_at)}
                        </p>

                        <p
                          className="mt-1 max-w-xl truncate text-[10px] text-muted-foreground/70"
                          dir="ltr"
                        >
                          {file.storage_path}
                        </p>
                      </div>

                      <button
                        type="button"
                        disabled={downloadingFileId === file.id}
                        onClick={() => downloadProjectFile(file)}
                        className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-xs font-semibold text-navy transition-colors hover:border-primary hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {downloadingFileId === file.id ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <Download className="size-4 text-primary" />
                        )}

                        دانلود فایل
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* =========================
              REAL MESSAGES
          ========================= */}

          <div className="mt-8 border-t border-border pt-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="flex items-center gap-2 text-base font-bold text-navy">
                  <MessageSquare className="size-5 text-primary" />

                  پیام‌های پروژه
                </h3>

                <p className="mt-1 text-xs text-muted-foreground">
                  ارتباط مستقیم مدیریت هاب‌ژن با پژوهشگر این پروژه
                </p>
              </div>

              <button
                type="button"
                disabled={messagesLoading}
                onClick={() =>
                  loadMessages(selectedProject.id)
                }
                className="inline-flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-xs text-muted-foreground transition-colors hover:bg-secondary disabled:opacity-50"
              >
                <RefreshCw
                  className={`size-4 ${
                    messagesLoading ? "animate-spin" : ""
                  }`}
                />

                بروزرسانی پیام‌ها
              </button>
            </div>

            <div className="mt-5 rounded-2xl border border-border bg-secondary/20 p-4">
              {messagesLoading ? (
                <div className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
                  <Loader2 className="size-4 animate-spin" />

                  در حال دریافت پیام‌ها…
                </div>
              ) : messages.length === 0 ? (
                <div className="py-8 text-center">
                  <MessageSquare className="mx-auto size-7 text-primary/60" />

                  <p className="mt-3 text-sm font-semibold text-navy">
                    هنوز پیامی ثبت نشده است.
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    اولین پیام پروژه را برای پژوهشگر ارسال کنید.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {messages.map((message) => {
                    const fromResearcher =
                      message.sender_id === selectedProject.user_id;

                    return (
                      <div
                        key={message.id}
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
                            {formatDateTime(message.created_at)}
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

            {/* SEND MESSAGE */}

            <div className="mt-5">
              <label
                htmlFor="admin-project-message"
                className="text-sm font-bold text-navy"
              >
                ارسال پیام به پژوهشگر
              </label>

              <p className="mt-1 text-xs text-muted-foreground">
                پیام در داشبورد همین پروژه برای پژوهشگر نمایش داده
                خواهد شد.
              </p>

              <textarea
                id="admin-project-message"
                value={messageText}
                onChange={(event) =>
                  setMessageText(event.target.value)
                }
                rows={4}
                maxLength={5000}
                placeholder="برای مثال: متادیتای نمونه‌ها دریافت شد. لطفاً گروه کنترل را مشخص کنید."
                className="mt-3 w-full resize-y rounded-2xl border border-border bg-background px-4 py-3 text-sm leading-7 text-navy outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
              />

              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <span className="text-[11px] text-muted-foreground">
                  {new Intl.NumberFormat("fa-IR").format(
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
        </section>
      )}
    </div>
  );
}

/*
 * =========================
 * STAT CARD
 * =========================
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
        {new Intl.NumberFormat("fa-IR").format(value)}
      </p>

      <p className="mt-1 text-xs text-muted-foreground">
        {label}
      </p>
    </div>
  );
}

/*
 * =========================
 * DETAIL CARD
 * =========================
 */

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

/*
 * =========================
 * DATE + TIME
 * =========================
 */

function formatDateTime(iso: string) {
  try {
    return new Intl.DateTimeFormat("fa-IR", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

/*
 * =========================
 * FILE SIZE
 * =========================
 */

function formatFileSize(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) {
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
    unitIndex < units.length - 1
  ) {
    value /= 1024;
    unitIndex += 1;
  }

  const formatted =
    new Intl.NumberFormat("fa-IR", {
      maximumFractionDigits:
        unitIndex === 0 ? 0 : 1,
    }).format(value);

  return `${formatted} ${units[unitIndex]}`;
}
