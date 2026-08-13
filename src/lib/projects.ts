import { supabase } from "@/integrations/supabase/client";
import { labelFor, type WizardAnswers } from "@/lib/wizard";

export type ProjectRow = {
  id: string;
  user_id: string;
  title: string;
  analysis_type: string | null;
  research_stage: string | null;
  status: string;
  wizard_data: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
};

export const projectStatusLabels: Record<string, string> = {
  submitted: "ثبت پروژه",
  scientific_review: "بررسی اولیه",
  design_confirmation: "تأیید طراحی",
  data_received: "دریافت داده",
  qc: "کنترل کیفیت",
  analysis: "تحلیل",
  interpretation: "تفسیر زیستی",
  completed: "نتایج / تکمیل‌شده",
  cancelled: "لغوشده",
};

export function statusLabel(status: string) {
  return projectStatusLabels[status] ?? status;
}

/** Maps a DB status to the number of completed steps in the 6-stage tracker. */
export function statusToStage(status: string): number {
  switch (status) {
    case "submitted":
      return 1;
    case "scientific_review":
      return 2;
    case "design_confirmation":
      return 3;
    case "data_received":
    case "qc":
      return 4;
    case "analysis":
    case "interpretation":
      return 5;
    case "completed":
      return 6;
    default:
      return 0;
  }
}

export const analysisTypeLabels: Record<string, string> = {
  bulk: "Bulk RNA-seq",
  sc: "Single-cell RNA-seq",
  wes: "WES/WGS",
  microbiome: "Microbiome",
  public: "Public Dataset Analysis",
  unsure: "Custom",
};

export function analysisTypeFor(answers: WizardAnswers): string {
  if (answers.dataType && analysisTypeLabels[answers.dataType]) {
    if (answers.dataType === "unsure" && answers.goal === "pathway") return "Functional Analysis";
    if (answers.dataType === "unsure" && answers.goal === "target") return "Network Biology";
    return analysisTypeLabels[answers.dataType]!;
  }
  if (answers.stage === "public") return "Public Dataset Analysis";
  return "Custom";
}

export function suggestedTitle(answers: WizardAnswers): string {
  const field = labelFor("field", answers.field);
  const organism = labelFor("organism", answers.organism);
  const goal = labelFor("goal", answers.goal);
  const parts = [goal, "در", field].filter((p) => p && p !== "—");
  const base = parts.length > 1 ? parts.join(" ") : "پروژه بیوانفورماتیک";
  return organism && organism !== "—" ? `${base} (${organism})` : base;
}

export function shortId(id: string) {
  return `PRJ-${id.slice(0, 8).toUpperCase()}`;
}

export function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium" }).format(new Date(iso));
  } catch {
    return iso.slice(0, 10);
  }
}

export function projectErrorMessage(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("fetch") || m.includes("network"))
    return "ارتباط با سرور برقرار نشد؛ اتصال اینترنت را بررسی کنید.";
  if (m.includes("row-level security") || m.includes("permission") || m.includes("jwt"))
    return "دسترسی مجاز نیست؛ لطفاً دوباره وارد شوید.";
  return "خطایی رخ داد؛ لطفاً دوباره تلاش کنید.";
}

export async function createProject(input: {
  userId: string;
  title: string;
  answers: WizardAnswers;
}) {
  return supabase
    .from("projects")
    .insert({
      user_id: input.userId,
      title: input.title,
      analysis_type: analysisTypeFor(input.answers),
      research_stage: input.answers.stage ?? null,
      status: "submitted",
      wizard_data: input.answers as Record<string, string>,
    })
    .select("*")
    .single();
}

export async function listMyProjects(userId: string) {
  return supabase
    .from("projects")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
}
