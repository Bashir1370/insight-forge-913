import { createFileRoute, redirect } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  CheckCircle2,
  Eye,
  FolderKanban,
  Loader2,
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
                  const researcher = profileMap.get(
                    project.user_id,
                  );

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
                            disabled={
                              updatingId === project.id
                            }
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
                          onClick={() =>
                            setSelectedProject(project)
                          }
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

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <DetailCard
              label="پژوهشگر"
              value={
                selectedResearcher?.full_name || "پژوهشگر"
              }
            />

            <DetailCard
              label="سازمان / دانشگاه"
              value={
                selectedResearcher?.organization || "—"
              }
            />

            <DetailCard
              label="حوزه پژوهشی پروفایل"
              value={
                selectedResearcher?.research_field || "—"
              }
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
              value={labelFor(
                "stage",
                selectedWizard.stage,
              )}
            />
          </div>

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
                value={selectedProject.analysis_type || "—"}
              />
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-primary/20 bg-accent/30 p-5">
            <p className="text-sm font-bold text-navy">
              مدیریت پروژه
            </p>

            <p className="mt-1 text-xs leading-6 text-muted-foreground">
              در این مرحله می‌توانید وضعیت پروژه را از جدول
              بالا تغییر دهید. پیام‌ها، فایل‌ها، یادداشت مدیریتی
              و تخصیص تحلیل‌گر در مراحل بعد به همین صفحه اضافه
              خواهند شد.
            </p>
          </div>
        </section>
      )}
    </div>
  );
}

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
