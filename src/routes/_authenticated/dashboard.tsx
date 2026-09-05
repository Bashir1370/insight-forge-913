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
  BookOpen,
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
  Sparkles,
  Target,
  UserRound,
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

type LearningProgressRow = {
  node_id: string;
  status:
    | "not_started"
    | "in_progress"
    | "completed"
    | "needs_review";
  confidence:
    | "unclear"
    | "developing"
    | "clear"
    | null;
  selected_answer: number | null;
  is_correct: boolean | null;
  updated_at: string;
};

type ResearchAssessmentRow = {
  id: string;
  user_id: string;
  research_line: string;
  question_type: string | null;
  data_stage: string | null;
  replicate_level: string | null;
  metadata_level: string | null;
  analysis_goal: string | null;
  recommendation_level:
    | "learn"
    | "review"
    | "design"
    | null;
  recommendation_destination: string | null;
  answers: Record<string, unknown> | null;
  status: "active" | "completed" | "archived";
  created_at: string;
  updated_at: string;
};

type ResearchProfileRow = {
  career_stage:
    | "bachelor"
    | "master"
    | "phd"
    | "postdoc"
    | "faculty"
    | "researcher"
    | "other"
    | null;
  discipline: string | null;
  bioinformatics_level:
    | "new"
    | "basic"
    | "intermediate"
    | "advanced"
    | null;
  programming_level:
    | "none"
    | "basic"
    | "intermediate"
    | "advanced"
    | null;
  primary_research_line:
    | "rna-seq"
    | "public-data"
    | "network-biology"
    | "single-cell"
    | "microbiome"
    | "unsure"
    | null;
  primary_goal:
    | "learn"
    | "design-project"
    | "analyze-data"
    | "solve-problem"
    | "interpret-results"
    | "publish-research"
    | "consultation"
    | "unsure"
    | null;
  preferred_support:
    | "guided-learning"
    | "project-design"
    | "analysis-strategy"
    | "problem-solving"
    | "results-interpretation"
    | "expert-review"
    | "unsure"
    | null;
  interests: string[] | null;
  notes: string | null;
  updated_at: string;
};

type ResearcherContext = {
  title: string;
  summary: string;
  strategyNote: string;
  badges: string[];
};

type PersonalizedGuidance = {
  title: string;
  description: string;
  focusNodes: string[];
  focusNodeIds: string[];
  actionHref: string;
  actionLabel: string;
};

type NextBestAction = {
  stage: "learn" | "design" | "consult";
  eyebrow: string;
  title: string;
  description: string;
  reason: string;
  actionHref: string;
  actionLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

type PersonalPlanStep = {
  state: "done" | "current" | "next";
  title: string;
  description: string;
  href?: string;
  actionLabel?: string;
};

type PersonalResearchPlan = {
  title: string;
  description: string;
  steps: PersonalPlanStep[];
};

const RNA_SEQ_TOTAL_NODES = 12;

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

  const [
    learningProgress,
    setLearningProgress,
  ] = useState<LearningProgressRow[]>([]);

  const [
    learningLoading,
    setLearningLoading,
  ] = useState(false);

  const [
    learningError,
    setLearningError,
  ] = useState<string | null>(null);

  const [
    researchAssessment,
    setResearchAssessment,
  ] = useState<ResearchAssessmentRow | null>(null);

  const [
    assessmentLoading,
    setAssessmentLoading,
  ] = useState(false);

  const [
    assessmentError,
    setAssessmentError,
  ] = useState<string | null>(null);

  const [
    researchProfile,
    setResearchProfile,
  ] = useState<ResearchProfileRow | null>(null);

  const [
    researchProfileLoading,
    setResearchProfileLoading,
  ] = useState(false);

  const [
    researchProfileError,
    setResearchProfileError,
  ] = useState<string | null>(null);

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

  const loadLearningProgress =
    async () => {
      if (!user?.id) return;

      setLearningLoading(true);
      setLearningError(null);

      const { data, error } =
        await (supabase as any)
          .from("learning_progress")
          .select(
            "node_id, status, confidence, selected_answer, is_correct, updated_at",
          )
          .eq(
            "user_id",
            user.id,
          )
          .eq(
            "research_line",
            "rna-seq",
          )
          .order(
            "updated_at",
            {
              ascending: false,
            },
          );

      if (error) {
        console.error(error);

        setLearningProgress([]);
        setLearningError(
          "دریافت پیشرفت مسیر یادگیری انجام نشد.",
        );
        setLearningLoading(false);

        return;
      }

      setLearningProgress(
        (data ??
          []) as LearningProgressRow[],
      );

      setLearningLoading(false);
    };

  useEffect(() => {
    if (!user?.id) return;

    void loadLearningProgress();
  }, [user?.id]);

  const loadResearchAssessment =
    async () => {
      if (!user?.id) return;

      setAssessmentLoading(true);
      setAssessmentError(null);

      const { data, error } =
        await (supabase as any)
          .from("research_assessments")
          .select(
            `
              id,
              user_id,
              research_line,
              question_type,
              data_stage,
              replicate_level,
              metadata_level,
              analysis_goal,
              recommendation_level,
              recommendation_destination,
              answers,
              status,
              created_at,
              updated_at
            `,
          )
          .eq(
            "user_id",
            user.id,
          )
          .eq(
            "research_line",
            "rna-seq",
          )
          .maybeSingle();

      if (error) {
        console.error(error);

        setResearchAssessment(null);
        setAssessmentError(
          "دریافت بررسی پروژه RNA-seq انجام نشد.",
        );
        setAssessmentLoading(false);

        return;
      }

      setResearchAssessment(
        data
          ? (data as ResearchAssessmentRow)
          : null,
      );

      setAssessmentLoading(false);
    };

  useEffect(() => {
    if (!user?.id) return;

    void loadResearchAssessment();
  }, [user?.id]);

  const loadResearchProfile =
    async () => {
      if (!user?.id) return;

      setResearchProfileLoading(true);
      setResearchProfileError(null);

      const { data, error } =
        await (supabase as any)
          .from("research_profiles")
          .select(
            `
              career_stage,
              discipline,
              bioinformatics_level,
              programming_level,
              primary_research_line,
              primary_goal,
              preferred_support,
              interests,
              notes,
              updated_at
            `,
          )
          .eq(
            "user_id",
            user.id,
          )
          .maybeSingle();

      if (error) {
        console.error(error);

        setResearchProfile(null);
        setResearchProfileError(
          "دریافت پروفایل پژوهشی انجام نشد.",
        );
        setResearchProfileLoading(false);

        return;
      }

      setResearchProfile(
        data
          ? (data as ResearchProfileRow)
          : null,
      );

      setResearchProfileLoading(false);
    };

  useEffect(() => {
    if (!user?.id) return;

    void loadResearchProfile();
  }, [user?.id]);

  const refreshResearchProfile =
    async () => {
      await Promise.all([
        loadResearchProfile(),
        loadLearningProgress(),
        loadResearchAssessment(),
      ]);
    };

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

  const completedLearningCount =
    learningProgress.filter(
      (row) =>
        row.selected_answer !==
          null &&
        Boolean(
          row.confidence,
        ),
    ).length;

  const learningPercent =
    Math.round(
      (Math.min(
        completedLearningCount,
        RNA_SEQ_TOTAL_NODES,
      ) /
        RNA_SEQ_TOTAL_NODES) *
        100,
    );

  const learningReviewCount =
    learningProgress.filter(
      (row) =>
        row.status ===
        "needs_review",
    ).length;

  const lastLearningUpdate =
    learningProgress[0]
      ?.updated_at ??
    null;

  const personalizedGuidance =
    buildPersonalizedGuidance(
      researchAssessment,
      learningProgress,
    );

  const baseNextBestAction =
    buildNextBestAction(
      researchAssessment,
      personalizedGuidance,
      completedLearningCount,
      learningReviewCount,
    );

  const nextBestAction =
    personalizeNextBestAction(
      baseNextBestAction,
      researchProfile,
      researchAssessment,
    );

  const basePersonalResearchPlan =
    buildPersonalResearchPlan(
      researchAssessment,
      personalizedGuidance,
      completedLearningCount,
    );

  const personalResearchPlan =
    personalizePersonalResearchPlan(
      basePersonalResearchPlan,
      researchProfile,
      researchAssessment,
      completedLearningCount,
    );

  const researcherContext =
    buildResearcherContext(
      researchProfile,
      researchAssessment,
    );

  const researchProfilePercent =
    calculateResearchProfileCompleteness(
      researchProfile,
    );

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
            ...(file.type ? { contentType: file.type } : {}),
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

      <ResearchProfileCard
        profile={researchProfile}
        context={researcherContext}
        completeness={researchProfilePercent}
        loading={researchProfileLoading}
        error={researchProfileError}
        assessment={researchAssessment}
        onRefresh={refreshResearchProfile}
      />

      <NextBestActionCard
        action={nextBestAction}
        plan={personalResearchPlan}
        loading={
          assessmentLoading ||
          learningLoading ||
          researchProfileLoading
        }
      />

      <ResearchPathCard
        assessment={
          researchAssessment
        }
        loading={
          assessmentLoading ||
          learningLoading
        }
        error={
          assessmentError
        }
        guidance={
          personalizedGuidance
        }
        learningCompleted={
          completedLearningCount
        }
        learningTotal={
          RNA_SEQ_TOTAL_NODES
        }
        onRefresh={
          refreshResearchProfile
        }
      />

      <LearningProgressCard
        loading={
          learningLoading
        }
        error={
          learningError
        }
        completed={
          completedLearningCount
        }
        total={
          RNA_SEQ_TOTAL_NODES
        }
        percent={
          learningPercent
        }
        reviewCount={
          learningReviewCount
        }
        lastUpdated={
          lastLearningUpdate
        }
        onRefresh={
          loadLearningProgress
        }
      />

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


function ResearchProfileCard({
  profile,
  context,
  completeness,
  loading,
  error,
  assessment,
  onRefresh,
}: {
  profile: ResearchProfileRow | null;
  context: ResearcherContext;
  completeness: number;
  loading: boolean;
  error: string | null;
  assessment: ResearchAssessmentRow | null;
  onRefresh: () => Promise<void>;
}) {
  return (
    <section className="card-elevated mt-8 overflow-hidden">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border bg-gradient-to-l from-primary/5 via-background to-background p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <UserRound className="size-5" />
          </span>

          <div>
            <p className="text-xs font-semibold text-primary">
              پروفایل پژوهشی من
            </p>

            <h2 className="mt-1 text-lg font-bold text-navy">
              تصویر پژوهشی شما
            </h2>

            <p
              dir="ltr"
              className="mt-0.5 text-left text-[11px] font-semibold text-muted-foreground"
            >
              Research Profile
            </p>
          </div>
        </div>

        <button
          type="button"
          disabled={loading}
          onClick={() => {
            void onRefresh();
          }}
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-xs text-muted-foreground transition hover:bg-secondary disabled:opacity-50"
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
      </div>

      <div className="p-5 sm:p-6">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            در حال ساخت تصویر پژوهشی شما…
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-5">
            <p className="text-sm font-bold text-navy">
              پروفایل پژوهشی فعلاً دریافت نشد.
            </p>

            <p className="mt-2 text-xs leading-6 text-muted-foreground">
              {error}
            </p>

            <button
              type="button"
              onClick={() => {
                void onRefresh();
              }}
              className="mt-4 inline-flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2 text-xs font-semibold text-navy hover:bg-secondary"
            >
              <RefreshCw className="size-4 text-primary" />
              تلاش دوباره
            </button>
          </div>
        ) : !profile ? (
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-base font-bold text-navy">
                هنوز پروفایل پژوهشی خود را نساخته‌اید.
              </p>

              <p className="mt-2 max-w-3xl text-sm leading-7 text-muted-foreground">
                با ثبت جایگاه پژوهشی، سطح بیوانفورماتیک، حوزه اصلی و
                هدف فعلی، هاب‌ژن می‌تواند اقدام بعدی و توضیحات داشبورد
                را متناسب‌تر با خود شما تنظیم کند.
              </p>
            </div>

            <Button
              asChild
              variant="hero"
            >
              <a href="/research-profile">
                ساخت پروفایل پژوهشی
              </a>
            </Button>
          </div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-[1fr_290px]">
            <div>
              <div className="rounded-2xl border border-primary/20 bg-accent/25 p-5 sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold text-primary">
                      هاب‌ژن شما را این‌طور می‌شناسد
                    </p>

                    <h3 className="mt-2 text-xl font-extrabold leading-8 text-navy">
                      {context.title}
                    </h3>
                  </div>

                  <span className="rounded-full border border-primary/20 bg-background px-3 py-1.5 text-[11px] font-bold text-primary">
                    {new Intl.NumberFormat("fa-IR").format(
                      completeness,
                    )}
                    ٪ تکمیل
                  </span>
                </div>

                <p className="mt-4 text-sm leading-7 text-muted-foreground">
                  {context.summary}
                </p>

                {context.badges.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {context.badges.map((badge) => (
                      <span
                        key={badge}
                        className="rounded-lg border border-border bg-background px-3 py-1.5 text-[11px] font-semibold text-navy"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-4 rounded-2xl border border-cyan-200 bg-cyan-50/60 p-5">
                <p className="text-xs font-bold text-cyan-900">
                  این پروفایل چه تغییری در هاب‌ژن ایجاد می‌کند؟
                </p>

                <p className="mt-2 text-sm leading-7 text-cyan-900/80">
                  {context.strategyNote}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <ResearchMetric
                label="حوزه پایه"
                value={researchLineLabel(
                  profile.primary_research_line,
                )}
              />

              <ResearchMetric
                label="هدف فعلی"
                value={primaryGoalLabel(
                  profile.primary_goal,
                )}
              />

              <ResearchMetric
                label="نوع حمایت ترجیحی"
                value={preferredSupportLabel(
                  profile.preferred_support,
                )}
              />

              <ResearchMetric
                label="تمرکز پروژه فعلی"
                value={
                  assessment
                    ? assessmentGoalLabel(
                        assessment.analysis_goal,
                      )
                    : "هنوز پروژه‌ای ارزیابی نشده"
                }
              />

              <Button
                asChild
                variant="outline"
                className="w-full"
              >
                <a href="/research-profile">
                  ویرایش پروفایل پژوهشی
                </a>
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function calculateResearchProfileCompleteness(
  profile: ResearchProfileRow | null,
) {
  if (!profile) return 0;

  const values = [
    profile.career_stage,
    profile.discipline?.trim(),
    profile.bioinformatics_level,
    profile.programming_level,
    profile.primary_research_line,
    profile.primary_goal,
    profile.preferred_support,
  ];

  const completed =
    values.filter(Boolean).length;

  return Math.round(
    (completed / values.length) * 100,
  );
}

function buildResearcherContext(
  profile: ResearchProfileRow | null,
  assessment: ResearchAssessmentRow | null,
): ResearcherContext {
  if (!profile) {
    return {
      title: "پروفایل پژوهشی هنوز ساخته نشده است",
      summary:
        "با تکمیل پروفایل، هاب‌ژن می‌تواند بین علاقه کلی شما، سطح تجربه و تمرکز پروژه فعلی تفاوت قائل شود.",
      strategyNote:
        "تا زمانی که پروفایل پژوهشی کامل نشده باشد، پیشنهادهای Dashboard بیشتر بر رفتار یادگیری و ارزیابی پروژه تکیه می‌کنند.",
      badges: [],
    };
  }

  const career =
    careerStageLabel(
      profile.career_stage,
    );

  const discipline =
    profile.discipline?.trim();

  const primaryLine =
    researchLineLabel(
      profile.primary_research_line,
    );

  const primaryGoal =
    primaryGoalLabel(
      profile.primary_goal,
    );

  const currentFocus =
    assessment
      ? assessmentGoalLabel(
          assessment.analysis_goal,
        )
      : null;

  const title =
    discipline
      ? `${career} در ${discipline}`
      : career;

  const summaryParts = [
    `حوزه پایه شما «${primaryLine}» است.`,
    `هدف فعلی ثبت‌شده در هاب‌ژن «${primaryGoal}» است.`,
  ];

  if (currentFocus) {
    summaryParts.push(
      `در پروژه فعلی، تمرکز شما روی «${currentFocus}» قرار گرفته است.`,
    );
  }

  const lowBioinformatics =
    profile.bioinformatics_level ===
      "new" ||
    profile.bioinformatics_level ===
      "basic";

  const lowProgramming =
    profile.programming_level ===
      "none" ||
    profile.programming_level ===
      "basic";

  const advancedBioinformatics =
    profile.bioinformatics_level ===
      "advanced";

  let strategyNote =
    "هاب‌ژن از این اطلاعات برای اولویت‌بندی پیشنهادهای آموزشی، طراحی پروژه و نوع حمایت بعدی استفاده می‌کند.";

  if (
    lowBioinformatics ||
    lowProgramming
  ) {
    strategyNote =
      "با توجه به سطح فعلی ثبت‌شده، هاب‌ژن توضیح مفهومی، تصمیم‌گیری پژوهشی و مسیر مرحله‌به‌مرحله را قبل از جزئیات برنامه‌نویسی و ابزارها در اولویت می‌گذارد.";
  } else if (
    advancedBioinformatics
  ) {
    strategyNote =
      "با توجه به سطح پیشرفته‌تر ثبت‌شده، هاب‌ژن می‌تواند سریع‌تر از مرور مفاهیم پایه عبور کند و روی طراحی تحلیل، محدودیت‌های روش و تصمیم‌های پروژه‌محور تمرکز بیشتری بگذارد.";
  }

  const badges = [
    career,
    profile.bioinformatics_level
      ? `بیوانفورماتیک: ${experienceLevelLabel(
          profile.bioinformatics_level,
        )}`
      : null,
    profile.programming_level
      ? `برنامه‌نویسی: ${experienceLevelLabel(
          profile.programming_level,
        )}`
      : null,
    profile.primary_research_line
      ? primaryLine
      : null,
  ].filter(
    (value): value is string =>
      Boolean(value),
  );

  return {
    title,
    summary:
      summaryParts.join(" "),
    strategyNote,
    badges,
  };
}

function personalizeNextBestAction(
  baseAction: NextBestAction,
  profile: ResearchProfileRow | null,
  assessment: ResearchAssessmentRow | null,
): NextBestAction {
  if (!profile) {
    return baseAction;
  }

  if (
    !assessment &&
    profile.primary_research_line &&
    profile.primary_research_line !==
      "rna-seq" &&
    profile.primary_research_line !==
      "unsure"
  ) {
    return {
      stage: "learn",
      eyebrow: "اقدام بعدی پیشنهادی",
      title: `حوزه اصلی شما «${researchLineLabel(
        profile.primary_research_line,
      )}» ثبت شده است`,
      description:
        "این ترجیح در پروفایل شما حفظ شده است. در نسخه فعلی، مسیر تعاملی RNA-seq کامل‌تر است؛ از بخش آموزش می‌توانید مسیرهای موجود را ببینید و بدون تغییر حوزه اصلی خود، محتوای مناسب را انتخاب کنید.",
      reason:
        "هاب‌ژن بین «حوزه پایه پژوهشگر» و «پروژه فعلی» تفاوت قائل می‌شود و شما را صرفاً به دلیل فعال بودن یک ابزار به مسیر نامرتبط هدایت نمی‌کند.",
      actionHref: "/learn",
      actionLabel: "مشاهده مسیرهای آموزشی",
      secondaryHref: "/research-profile",
      secondaryLabel: "ویرایش پروفایل پژوهشی",
    };
  }

  if (
    !assessment &&
    profile.primary_goal === "learn"
  ) {
    return {
      stage: "learn",
      eyebrow: "اقدام بعدی پیشنهادی",
      title: "مسیر RNA-seq را متناسب با سطح فعلی‌تان ادامه دهید",
      description:
        "چون هدف فعلی شما در پروفایل «یادگیری مفاهیم» ثبت شده، فعلاً یادگیری هدایت‌شده بر ورود مستقیم به طراحی پروژه اولویت دارد.",
      reason:
        profile.bioinformatics_level ===
          "new" ||
        profile.bioinformatics_level ===
          "basic"
          ? "سطح بیوانفورماتیک شما تازه‌کار یا مقدماتی ثبت شده است؛ بنابراین هاب‌ژن ابتدا نقشه ذهنی و تصمیم‌های پایه را تقویت می‌کند."
          : "هدف صریح شما یادگیری است؛ هاب‌ژن این ترجیح را از اقدام‌های پروژه‌محور جدا نگه می‌دارد.",
      actionHref: "/learn/rna-seq/navigator",
      actionLabel: "ادامه مسیر یادگیری",
      secondaryHref: "/learn/rna-seq/project",
      secondaryLabel: "بررسی پروژه واقعی",
    };
  }

  if (
    !assessment &&
    profile.primary_goal ===
      "consultation"
  ) {
    return {
      stage: "consult",
      eyebrow: "اقدام بعدی پیشنهادی",
      title: "نیاز پژوهشی خود را برای مشاوره ثبت کنید",
      description:
        "در پروفایل شما «دریافت مشاوره تخصصی» به‌عنوان هدف فعلی ثبت شده است. می‌توانید موضوع و مسئله اصلی را مستقیماً برای بازبینی تخصصی ارسال کنید.",
      reason:
        "این اقدام مستقیماً از هدفی که خودتان در پروفایل پژوهشی انتخاب کرده‌اید گرفته شده است.",
      actionHref: "/consultation",
      actionLabel: "ثبت درخواست مشاوره",
      secondaryHref: "/learn/rna-seq/project",
      secondaryLabel: "ابتدا پروژه را ارزیابی کنم",
    };
  }

  let reason =
    baseAction.reason;

  const lowBioinformatics =
    profile.bioinformatics_level ===
      "new" ||
    profile.bioinformatics_level ===
      "basic";

  const lowProgramming =
    profile.programming_level ===
      "none" ||
    profile.programming_level ===
      "basic";

  if (
    baseAction.stage === "learn" &&
    (lowBioinformatics ||
      lowProgramming)
  ) {
    reason +=
      " همچنین سطح فعلی شما در پروفایل نشان می‌دهد که توضیح مفهومی و مسیر مرحله‌به‌مرحله باید قبل از جزئیات برنامه‌نویسی در اولویت بماند.";
  } else if (
    baseAction.stage ===
      "consult" &&
    profile.preferred_support ===
      "expert-review"
  ) {
    reason +=
      " این مرحله با ترجیح ثبت‌شده شما برای «بازبینی متخصص» نیز هم‌راستا است.";
  } else if (
    baseAction.stage ===
      "design" &&
    profile.primary_goal ===
      "design-project"
  ) {
    reason +=
      " این مرحله با هدف فعلی شما برای «طراحی پروژه پژوهشی» هم‌راستا است.";
  }

  return {
    ...baseAction,
    reason,
  };
}

function personalizePersonalResearchPlan(
  basePlan: PersonalResearchPlan,
  profile: ResearchProfileRow | null,
  assessment: ResearchAssessmentRow | null,
  learningCompleted: number,
): PersonalResearchPlan {
  if (!profile) {
    return basePlan;
  }

  if (
    !assessment &&
    profile.primary_goal === "learn"
  ) {
    return {
      title: "برنامه شخصی ۳ قدمی",
      description:
        "این برنامه از هدف «یادگیری مفاهیم» در پروفایل شما شروع می‌شود و بعد به پروژه واقعی متصل خواهد شد.",
      steps: [
        {
          state: "current",
          title:
            learningCompleted > 0
              ? "مسیر یادگیری RNA-seq را ادامه دهید"
              : "نقشه ذهنی RNA-seq را بسازید",
          description:
            learningCompleted > 0
              ? `${new Intl.NumberFormat(
                  "fa-IR",
                ).format(
                  learningCompleted,
                )} مرحله را تا اینجا مرور کرده‌اید؛ قدم فعلی ادامه همان مسیر است.`
              : "قبل از طراحی پروژه، ساختار کلی مسیر تحلیل را به‌صورت تعاملی مرور کنید.",
          href: "/learn/rna-seq/navigator",
          actionLabel:
            learningCompleted > 0
              ? "ادامه یادگیری"
              : "شروع یادگیری",
        },
        {
          state: "next",
          title: "دانش را به پروژه واقعی متصل کنید",
          description:
            "وقتی نقشه ذهنی اولیه شکل گرفت، Project Mode وضعیت پروژه واقعی شما را بررسی می‌کند.",
          href: "/learn/rna-seq/project",
          actionLabel: "بررسی پروژه",
        },
        {
          state: "next",
          title: "مسیر پژوهشی اختصاصی دریافت کنید",
          description:
            "Dashboard هدف پروژه، یادگیری و پروفایل شما را کنار هم قرار می‌دهد و قدم بعدی را دوباره محاسبه می‌کند.",
        },
      ],
    };
  }

  if (
    !assessment &&
    profile.primary_goal ===
      "consultation"
  ) {
    return {
      title: "برنامه شخصی ۳ قدمی",
      description:
        "این برنامه از هدف فعلی شما برای دریافت مشاوره تخصصی ساخته شده است.",
      steps: [
        {
          state: "current",
          title: "موضوع مشاوره را ثبت کنید",
          description:
            "مسئله اصلی، سؤال یا تصمیمی را که نیاز به بازبینی تخصصی دارد مشخص کنید.",
          href: "/consultation",
          actionLabel: "ثبت درخواست",
        },
        {
          state: "next",
          title: "در صورت نیاز، پروژه را ساختاربندی کنید",
          description:
            "اگر مسئله شما به یک پروژه RNA-seq مربوط باشد، Project Mode می‌تواند داده و هدف تحلیل را دقیق‌تر مشخص کند.",
          href: "/learn/rna-seq/project",
          actionLabel: "بررسی پروژه",
        },
        {
          state: "next",
          title: "پیشنهادهای بعدی با نتیجه بازبینی هماهنگ می‌شوند",
          description:
            "پس از ثبت اطلاعات بیشتر، Dashboard دوباره مسیر پژوهشی و اقدام بعدی را محاسبه می‌کند.",
        },
      ],
    };
  }

  return {
    ...basePlan,
    description:
      `این برنامه با هدف «${primaryGoalLabel(
        profile.primary_goal,
      )}» در پروفایل و وضعیت واقعی پروژه شما هماهنگ شده است.`,
  };
}

function careerStageLabel(
  value: ResearchProfileRow["career_stage"],
) {
  const labels: Record<string, string> = {
    bachelor: "دانشجوی کارشناسی",
    master: "دانشجوی کارشناسی ارشد",
    phd: "دانشجوی دکتری",
    postdoc: "پژوهشگر پسادکتری",
    faculty: "عضو هیئت علمی",
    researcher: "پژوهشگر",
    other: "پژوهشگر",
  };

  return value
    ? labels[value] ?? "پژوهشگر"
    : "پژوهشگر";
}

function experienceLevelLabel(
  value:
    | ResearchProfileRow["bioinformatics_level"]
    | ResearchProfileRow["programming_level"],
) {
  const labels: Record<string, string> = {
    none: "بدون تجربه",
    new: "تازه‌کار",
    basic: "مقدماتی",
    intermediate: "متوسط",
    advanced: "پیشرفته",
  };

  return value
    ? labels[value] ?? value
    : "مشخص نشده";
}

function researchLineLabel(
  value: ResearchProfileRow["primary_research_line"],
) {
  const labels: Record<string, string> = {
    "rna-seq": "ترنسکریپتومیکس و RNA-seq",
    "public-data": "پژوهش با داده‌های عمومی",
    "network-biology": "زیست‌شناسی شبکه‌ای و نشانگر زیستی",
    "single-cell": "ترنسکریپتومیکس تک‌سلولی",
    microbiome: "میکروبیوم و تحلیل 16S",
    unsure: "هنوز مشخص نشده",
  };

  return value
    ? labels[value] ?? value
    : "هنوز مشخص نشده";
}

function primaryGoalLabel(
  value: ResearchProfileRow["primary_goal"],
) {
  const labels: Record<string, string> = {
    learn: "یادگیری مفاهیم",
    "design-project": "طراحی پروژه پژوهشی",
    "analyze-data": "تحلیل داده",
    "solve-problem": "حل مشکل در تحلیل",
    "interpret-results": "تفسیر نتایج",
    "publish-research": "تقویت پروژه برای مقاله یا انتشار",
    consultation: "دریافت مشاوره تخصصی",
    unsure: "هنوز مشخص نشده",
  };

  return value
    ? labels[value] ?? value
    : "هنوز مشخص نشده";
}

function preferredSupportLabel(
  value: ResearchProfileRow["preferred_support"],
) {
  const labels: Record<string, string> = {
    "guided-learning": "آموزش هدایت‌شده",
    "project-design": "طراحی پروژه",
    "analysis-strategy": "راهبرد تحلیل",
    "problem-solving": "حل مسئله",
    "results-interpretation": "تفسیر نتایج",
    "expert-review": "بازبینی متخصص",
    unsure: "هنوز مشخص نشده",
  };

  return value
    ? labels[value] ?? value
    : "هنوز مشخص نشده";
}

function buildNextBestAction(
  assessment: ResearchAssessmentRow | null,
  guidance: PersonalizedGuidance,
  learningCompleted: number,
  learningReviewCount: number,
): NextBestAction {
  if (!assessment) {
    return {
      stage: "design",
      eyebrow: "اقدام بعدی پیشنهادی",
      title: "وضعیت پروژه RNA-seq خود را مشخص کنید",
      description:
        "با پنج سؤال کوتاه، هدف تحلیل، وضعیت داده و محدودیت‌های اصلی پروژه مشخص می‌شوند تا پیشنهادهای بعدی هاب‌ژن واقعاً برای پروژه شما شخصی شوند.",
      reason:
        learningCompleted > 0
          ? `شما ${new Intl.NumberFormat("fa-IR").format(learningCompleted)} مرحله از مسیر یادگیری را طی کرده‌اید؛ حالا بهتر است این دانش را به پروژه واقعی خودتان متصل کنید.`
          : "بدون شناخت پروژه واقعی شما، هاب‌ژن فقط می‌تواند پیشنهادهای عمومی ارائه کند.",
      actionHref: "/learn/rna-seq/project",
      actionLabel: "بررسی پروژه RNA-seq من",
      secondaryHref: "/learn/rna-seq/navigator",
      secondaryLabel: "ادامه مسیر یادگیری",
    };
  }

  if (assessment.status !== "completed") {
    return {
      stage: "design",
      eyebrow: "اقدام بعدی پیشنهادی",
      title: "بررسی نیمه‌کاره پروژه را کامل کنید",
      description:
        "پاسخ‌های قبلی شما ذخیره شده‌اند. با تکمیل بررسی پروژه، هاب‌ژن می‌تواند مسیر علمی و قدم بعدی مناسب را دقیق‌تر تعیین کند.",
      reason:
        "تا زمانی که هدف تحلیل و وضعیت پروژه کامل نشده باشند، پیشنهاد شخصی نهایی ساخته نمی‌شود.",
      actionHref: "/learn/rna-seq/project",
      actionLabel: "ادامه بررسی پروژه",
      secondaryHref: "/learn/rna-seq/navigator",
      secondaryLabel: "مرور مسیر RNA-seq",
    };
  }

  if (guidance.focusNodes.length > 0) {
    const firstFocus = guidance.focusNodes[0];
    const remaining = guidance.focusNodes.length - 1;

    return {
      stage: "learn",
      eyebrow: "اقدام بعدی پیشنهادی",
      title: `اول «${firstFocus}» را تقویت کنید`,
      description:
        remaining > 0
          ? `برای هدف فعلی پروژه شما، این مفهوم و ${new Intl.NumberFormat("fa-IR").format(remaining)} بخش مرتبط دیگر هنوز نیاز به تکمیل یا مرور دارند.`
          : "برای هدف فعلی پروژه شما، این مفهوم هنوز نیاز به تکمیل یا مرور دارد.",
      reason:
        `این پیشنهاد از ترکیب هدف «${assessmentGoalLabel(assessment.analysis_goal)}» با پیشرفت واقعی شما در Navigator ساخته شده است.`,
      actionHref: guidance.actionHref,
      actionLabel: guidance.actionLabel,
      secondaryHref: "/learn/rna-seq/project",
      secondaryLabel: "مشاهده بررسی پروژه",
    };
  }

  if (
    assessment.recommendation_destination ===
      "network-biology" ||
    assessment.recommendation_destination ===
      "biomarker-discovery" ||
    assessment.recommendation_level === "review"
  ) {
    return {
      stage: "consult",
      eyebrow: "اقدام بعدی پیشنهادی",
      title: guidance.title,
      description: guidance.description,
      reason:
        learningReviewCount > 0
          ? `پیش‌نیازهای اصلی پوشش داده شده‌اند، اما ${new Intl.NumberFormat("fa-IR").format(learningReviewCount)} مرحله از مسیر یادگیری هنوز برای مرور علامت خورده است. بازبینی تخصصی می‌تواند تصمیم پروژه را دقیق‌تر کند.`
          : "پیش‌نیازهای آموزشی مرتبط تا حد خوبی پوشش داده شده‌اند و مسئله اصلی حالا به تصمیم‌های پروژه‌محور نزدیک شده است.",
      actionHref: guidance.actionHref,
      actionLabel: guidance.actionLabel,
      secondaryHref: "/learn/rna-seq/project",
      secondaryLabel: "مشاهده بررسی پروژه",
    };
  }

  return {
    stage: "design",
    eyebrow: "اقدام بعدی پیشنهادی",
    title: guidance.title,
    description: guidance.description,
    reason:
      "بر اساس وضعیت فعلی یادگیری و ارزیابی پروژه، قدم بعدی شما بیشتر به طراحی مسیر تحلیل مربوط است تا یادگیری عمومی.",
    actionHref: guidance.actionHref,
    actionLabel: guidance.actionLabel,
    secondaryHref: "/learn/rna-seq/navigator",
    secondaryLabel: "مرور مسیر یادگیری",
  };
}

function buildPersonalResearchPlan(
  assessment: ResearchAssessmentRow | null,
  guidance: PersonalizedGuidance,
  learningCompleted: number,
): PersonalResearchPlan {
  if (!assessment) {
    return {
      title: "برنامه شخصی ۳ قدمی",
      description:
        "این برنامه با شناخت بیشتر هاب‌ژن از پروژه شما به‌صورت زنده تغییر می‌کند.",
      steps: [
        {
          state:
            learningCompleted > 0
              ? "done"
              : "next",
          title:
            learningCompleted > 0
              ? "یادگیری RNA-seq را شروع کرده‌اید"
              : "آشنایی با مسیر RNA-seq",
          description:
            learningCompleted > 0
              ? `${new Intl.NumberFormat("fa-IR").format(learningCompleted)} مرحله از مسیر یادگیری را تا اینجا طی کرده‌اید.`
              : "برای ساختن نقشه ذهنی اولیه می‌توانید مسیر تعاملی RNA-seq را شروع کنید.",
          ...(learningCompleted > 0
            ? {}
            : {
                href: "/learn/rna-seq/navigator",
                actionLabel: "شروع یادگیری",
              }),
        },
        {
          state: "current",
          title: "پروژه RNA-seq خود را بررسی کنید",
          description:
            "پنج سؤال کوتاه کمک می‌کنند هدف تحلیل، وضعیت داده و محدودیت‌های پروژه مشخص شوند.",
          href: "/learn/rna-seq/project",
          actionLabel: "بررسی پروژه",
        },
        {
          state: "next",
          title: "مسیر پژوهشی اختصاصی دریافت کنید",
          description:
            "بعد از بررسی پروژه، هاب‌ژن مسیر یادگیری، طراحی یا بازبینی مناسب را بر اساس پاسخ‌های شما فعال می‌کند.",
        },
      ],
    };
  }

  if (assessment.status !== "completed") {
    return {
      title: "برنامه شخصی ۳ قدمی",
      description:
        "پاسخ‌های فعلی شما ذخیره شده‌اند و برنامه با تکمیل بررسی دقیق‌تر می‌شود.",
      steps: [
        {
          state: "done",
          title: "بررسی پروژه را شروع کرده‌اید",
          description:
            "هاب‌ژن بخشی از اطلاعات پروژه شما را دریافت و در حساب پژوهشگر ذخیره کرده است.",
        },
        {
          state: "current",
          title: "بررسی پروژه را کامل کنید",
          description:
            "هدف تحلیل و وضعیت پروژه را کامل کنید تا مسیر علمی بعدی قابل تعیین باشد.",
          href: "/learn/rna-seq/project",
          actionLabel: "ادامه بررسی",
        },
        {
          state: "next",
          title: "پیشنهاد شخصی پروژه را دریافت کنید",
          description:
            "پس از تکمیل بررسی، Dashboard قدم بعدی را از روی پروژه واقعی شما تعیین می‌کند.",
        },
      ],
    };
  }

  if (guidance.focusNodes.length > 0) {
    const firstFocus = guidance.focusNodes[0];
    const remaining = guidance.focusNodes.length - 1;

    return {
      title: "برنامه شخصی ۳ قدمی",
      description:
        `این برنامه برای هدف «${assessmentGoalLabel(assessment.analysis_goal)}» ساخته شده است.`,
      steps: [
        {
          state: "done",
          title: "بررسی پروژه تکمیل شد",
          description:
            `تمرکز فعلی پروژه شما «${assessmentGoalLabel(assessment.analysis_goal)}» تشخیص داده شده است.`,
        },
        {
          state: "current",
          title: `«${firstFocus}» را تقویت کنید`,
          description:
            remaining > 0
              ? `این مفهوم و ${new Intl.NumberFormat("fa-IR").format(remaining)} بخش مرتبط دیگر برای هدف فعلی شما هنوز نیاز به تکمیل یا مرور دارند.`
              : "این مفهوم برای هدف فعلی پروژه شما هنوز نیاز به تکمیل یا مرور دارد.",
          href: guidance.actionHref,
          actionLabel: guidance.actionLabel,
        },
        {
          state: "next",
          title: assessmentDestinationLabel(
            assessment.recommendation_destination,
          ),
          description:
            "بعد از پوشش پیش‌نیازهای فعلی، این مرحله به اقدام اصلی شما تبدیل می‌شود.",
        },
      ],
    };
  }

  return {
    title: "برنامه شخصی ۳ قدمی",
    description:
      `پیش‌نیازهای اصلی مرتبط با «${assessmentGoalLabel(assessment.analysis_goal)}» تا حد خوبی پوشش داده شده‌اند.`,
    steps: [
      {
        state: "done",
        title: "بررسی پروژه تکمیل شد",
        description:
          `هدف پروژه شما «${assessmentGoalLabel(assessment.analysis_goal)}» ثبت شده است.`,
      },
      {
        state: "done",
        title: "پیش‌نیازهای آموزشی اصلی پوشش داده شد",
        description:
          "مفاهیم کلیدی مرتبط با هدف فعلی در Navigator تکمیل شده‌اند یا نیاز فوری به مرور ندارند.",
      },
      {
        state: "current",
        title: guidance.title,
        description: guidance.description,
        href: guidance.actionHref,
        actionLabel: guidance.actionLabel,
      },
    ],
  };
}

function NextBestActionCard({
  action,
  plan,
  loading,
}: {
  action: NextBestAction;
  plan: PersonalResearchPlan;
  loading: boolean;
}) {
  const doneSteps = plan.steps.filter(
    (step) => step.state === "done",
  ).length;

  return (
    <section className="card-elevated mt-8 overflow-hidden border-primary/20">
      <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
        <div className="p-5 sm:p-7">
          <div className="flex items-start gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
              <Sparkles className="size-5" />
            </span>

            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-primary">
                {action.eyebrow}
              </p>

              {loading ? (
                <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="size-4 animate-spin" />
                  در حال تعیین بهترین قدم بعدی…
                </div>
              ) : (
                <>
                  <h2 className="mt-2 text-xl font-extrabold leading-8 text-navy sm:text-2xl">
                    {action.title}
                  </h2>

                  <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">
                    {action.description}
                  </p>

                  <div className="mt-5 rounded-2xl border border-primary/15 bg-accent/25 p-4">
                    <p className="text-[11px] font-bold text-primary">
                      چرا این قدم؟
                    </p>

                    <p className="mt-1 text-xs leading-6 text-muted-foreground">
                      {action.reason}
                    </p>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <Button
                      asChild
                      variant="hero"
                    >
                      <a href={action.actionHref}>
                        {action.actionLabel}
                      </a>
                    </Button>

                    {action.secondaryHref &&
                      action.secondaryLabel && (
                        <Button
                          asChild
                          variant="outline"
                        >
                          <Link
                            to={action.secondaryHref as any}
                          >
                            {action.secondaryLabel}
                          </Link>
                        </Button>
                      )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-border bg-secondary/20 p-5 sm:p-6 lg:border-r lg:border-t-0">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-navy">
                {plan.title}
              </p>

              <p className="mt-1 max-w-md text-[11px] leading-6 text-muted-foreground">
                {plan.description}
              </p>
            </div>

            <span className="rounded-full border border-border bg-background px-3 py-1 text-[10px] font-semibold text-muted-foreground">
              {new Intl.NumberFormat("fa-IR").format(doneSteps)} از ۳ انجام شده
            </span>
          </div>

          <div className="mt-5 space-y-3">
            {plan.steps.map((step, index) => {
              const done = step.state === "done";
              const current = step.state === "current";

              return (
                <div
                  key={`${step.title}-${index}`}
                  className={`rounded-2xl border p-4 transition ${
                    current
                      ? "border-primary/30 bg-accent/50 shadow-sm"
                      : done
                        ? "border-primary/15 bg-background"
                        : "border-border bg-background/70"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`flex size-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                        done
                          ? "bg-primary/10 text-primary"
                          : current
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {done
                        ? "✓"
                        : new Intl.NumberFormat("fa-IR").format(
                            index + 1,
                          )}
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p
                          className={`text-xs font-bold leading-6 ${
                            current
                              ? "text-primary"
                              : "text-navy"
                          }`}
                        >
                          {step.title}
                        </p>

                        {current && (
                          <span className="rounded-full bg-primary/10 px-2 py-1 text-[9px] font-bold text-primary">
                            الان
                          </span>
                        )}
                      </div>

                      <p className="mt-1 text-[10px] leading-5 text-muted-foreground">
                        {step.description}
                      </p>

                      {step.href &&
                        step.actionLabel &&
                        !done && (
                          <a
                            href={step.href}
                            className="mt-3 inline-flex items-center rounded-lg border border-primary/20 bg-background px-3 py-1.5 text-[10px] font-bold text-primary transition hover:bg-accent"
                          >
                            {step.actionLabel}
                            <span className="mr-1">←</span>
                          </a>
                        )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="mt-4 text-[10px] leading-5 text-muted-foreground">
            با تکمیل هر تعامل مهم، این سه قدم دوباره محاسبه می‌شوند.
          </p>
        </div>
      </div>
    </section>
  );
}

function ResearchPathCard({
  assessment,
  loading,
  error,
  guidance,
  learningCompleted,
  learningTotal,
  onRefresh,
}: {
  assessment: ResearchAssessmentRow | null;
  loading: boolean;
  error: string | null;
  guidance: PersonalizedGuidance;
  learningCompleted: number;
  learningTotal: number;
  onRefresh: () => Promise<void>;
}) {
  const assessmentFinished =
    assessment?.status === "completed";

  return (
    <section className="card-elevated mt-8 overflow-hidden">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border bg-gradient-to-l from-accent/40 via-background to-background p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Target className="size-5" />
          </span>

          <div>
            <p className="text-xs font-semibold text-primary">
              مسیر پژوهشی من
            </p>

            <h2 className="mt-1 text-lg font-bold text-navy">
              مرکز شخصی RNA-seq
            </h2>

            <p className="mt-1 max-w-2xl text-xs leading-6 text-muted-foreground">
              هاب‌ژن از وضعیت یادگیری و بررسی پروژه شما برای پیشنهاد قدم بعدی استفاده می‌کند.
            </p>
          </div>
        </div>

        <button
          type="button"
          disabled={loading}
          onClick={() => {
            void onRefresh();
          }}
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-xs text-muted-foreground transition hover:bg-secondary disabled:opacity-50"
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
      </div>

      <div className="p-5 sm:p-6">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            در حال ساخت تصویر شخصی مسیر پژوهشی…
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-5">
            <p className="text-sm font-bold text-navy">
              مسیر پژوهشی فعلاً کامل دریافت نشد.
            </p>

            <p className="mt-2 text-xs leading-6 text-muted-foreground">
              {error}
            </p>

            <button
              type="button"
              onClick={() => {
                void onRefresh();
              }}
              className="mt-4 inline-flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2 text-xs font-semibold text-navy hover:bg-secondary"
            >
              <RefreshCw className="size-4 text-primary" />
              تلاش دوباره
            </button>
          </div>
        ) : !assessment ? (
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-base font-bold text-navy">
                هنوز وضعیت پروژه RNA-seq خود را بررسی نکرده‌اید.
              </p>

              <p className="mt-2 max-w-3xl text-sm leading-7 text-muted-foreground">
                با پاسخ به پنج سؤال کوتاه، هاب‌ژن می‌تواند هدف تحلیلی، وضعیت داده و مسیر مناسب بعدی را برای پروژه شما مشخص کند. این اطلاعات بعداً برای شخصی‌سازی همین داشبورد استفاده می‌شوند.
              </p>
            </div>

            <Button
              asChild
              variant="hero"
            >
              <Link to="/learn/rna-seq/project">
                بررسی پروژه RNA-seq من
              </Link>
            </Button>
          </div>
        ) : !assessmentFinished ? (
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <span className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-semibold text-amber-800">
                بررسی نیمه‌کاره
              </span>

              <p className="mt-4 text-base font-bold text-navy">
                بررسی پروژه RNA-seq شما هنوز کامل نشده است.
              </p>

              <p className="mt-2 max-w-3xl text-sm leading-7 text-muted-foreground">
                پاسخ‌های قبلی ذخیره شده‌اند. از همان جایی که متوقف شده‌اید ادامه دهید تا هاب‌ژن بتواند مسیر پژوهشی شخصی شما را کامل‌تر پیشنهاد دهد.
              </p>
            </div>

            <Button
              asChild
              variant="hero"
            >
              <Link to="/learn/rna-seq/project">
                ادامه بررسی پروژه
              </Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="rounded-2xl border border-primary/20 bg-accent/20 p-5 sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold text-primary">
                      تمرکز پژوهشی فعلی شما
                    </p>

                    <h3 className="mt-2 text-xl font-bold text-navy">
                      {assessmentGoalLabel(
                        assessment.analysis_goal,
                      )}
                    </h3>

                    <p
                      dir="ltr"
                      className="mt-1 text-left text-[11px] font-semibold text-muted-foreground"
                    >
                      {assessmentGoalEnglishLabel(
                        assessment.analysis_goal,
                      )}
                    </p>
                  </div>

                  <RecommendationBadge
                    level={
                      assessment.recommendation_level
                    }
                  />
                </div>

                <div className="mt-5 rounded-xl border border-border bg-background/80 p-4">
                  <p className="text-[11px] text-muted-foreground">
                    مسیر پیشنهادی بعدی
                  </p>

                  <p className="mt-1 text-sm font-bold leading-7 text-navy">
                    {assessmentDestinationLabel(
                      assessment.recommendation_destination,
                    )}
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                <ResearchMetric
                  label="وضعیت داده"
                  value={assessmentDataStageLabel(
                    assessment.data_stage,
                  )}
                />

                <ResearchMetric
                  label="یادگیری RNA-seq"
                  value={`${new Intl.NumberFormat(
                    "fa-IR",
                  ).format(
                    Math.min(
                      learningCompleted,
                      learningTotal,
                    ),
                  )} از ${new Intl.NumberFormat(
                    "fa-IR",
                  ).format(
                    learningTotal,
                  )} مرحله`}
                />

                <ResearchMetric
                  label="آخرین بررسی پروژه"
                  value={formatDateTime(
                    assessment.updated_at,
                  )}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-teal-200 bg-teal-50/70 p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white text-teal-700 shadow-sm">
                  <Sparkles className="size-4" />
                </span>

                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-teal-800">
                    پیشنهاد شخصی هاب‌ژن
                  </p>

                  <h3 className="mt-2 text-lg font-bold leading-8 text-navy">
                    {guidance.title}
                  </h3>

                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    {guidance.description}
                  </p>

                  {guidance.focusNodes.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {guidance.focusNodes.map(
                        (node, index) => {
                          const nodeId =
                            guidance.focusNodeIds[
                              index
                            ];

                          const goalQuery =
                            assessment.analysis_goal ??
                            "unsure";

                          const href = nodeId
                            ? `/learn/rna-seq/navigator?node=${encodeURIComponent(
                                nodeId,
                              )}&source=dashboard&goal=${encodeURIComponent(
                                goalQuery,
                              )}`
                            : guidance.actionHref;

                          return (
                            <a
                              key={`${node}-${nodeId ?? index}`}
                              href={href}
                              className="rounded-lg border border-teal-200 bg-background px-3 py-1.5 text-xs font-semibold text-teal-800 transition hover:border-primary hover:bg-accent"
                            >
                              {node}
                              <span className="mr-1">
                                ←
                              </span>
                            </a>
                          );
                        },
                      )}
                    </div>
                  )}

                  <div className="mt-5 flex flex-wrap gap-2">
                    <Button
                      asChild
                      variant="hero"
                    >
                      <a href={guidance.actionHref}>
                        {guidance.actionLabel}
                      </a>
                    </Button>

                    <Button
                      asChild
                      variant="outline"
                    >
                      <Link to="/learn/rna-seq/project">
                        مشاهده بررسی پروژه
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function RecommendationBadge({
  level,
}: {
  level: ResearchAssessmentRow["recommendation_level"];
}) {
  const label =
    level === "design"
      ? "آماده طراحی مسیر"
      : level === "review"
        ? "نیازمند بازبینی"
        : level === "learn"
          ? "نیازمند تکمیل پیش‌نیازها"
          : "در حال بررسی";

  const className =
    level === "design"
      ? "border-primary/20 bg-accent text-primary"
      : level === "review"
        ? "border-amber-200 bg-amber-50 text-amber-800"
        : level === "learn"
          ? "border-cyan-200 bg-cyan-50 text-cyan-800"
          : "border-border bg-background text-muted-foreground";

  return (
    <span
      className={`rounded-full border px-3 py-1.5 text-[11px] font-semibold ${className}`}
    >
      {label}
    </span>
  );
}

function ResearchMetric({
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

      <p className="mt-1 text-xs font-bold leading-6 text-navy">
        {value}
      </p>
    </div>
  );
}

function buildPersonalizedGuidance(
  assessment: ResearchAssessmentRow | null,
  learningProgress: LearningProgressRow[],
): PersonalizedGuidance {
  if (!assessment) {
    return {
      title: "ابتدا پروژه خود را بررسی کنید",
      description:
        "بعد از بررسی پروژه، هاب‌ژن می‌تواند یادگیری و تصمیم‌های بعدی را بر اساس هدف واقعی شما شخصی‌سازی کند.",
      focusNodes: [],
      focusNodeIds: [],
      actionHref: "/learn/rna-seq/project",
      actionLabel: "بررسی پروژه من",
    };
  }

  if (assessment.status !== "completed") {
    return {
      title: "بررسی پروژه را کامل کنید",
      description:
        "پاسخ‌های شما ذخیره شده‌اند، اما هنوز اطلاعات کافی برای ساخت پیشنهاد شخصی کامل وجود ندارد.",
      focusNodes: [],
      focusNodeIds: [],
      actionHref: "/learn/rna-seq/project",
      actionLabel: "ادامه بررسی پروژه",
    };
  }

  const completedNodeIds = new Set(
    learningProgress
      .filter(
        (row) =>
          row.selected_answer !== null &&
          Boolean(row.confidence) &&
          row.status !== "needs_review",
      )
      .map((row) => row.node_id),
  );

  const reviewNodeIds = new Set(
    learningProgress
      .filter(
        (row) =>
          row.status === "needs_review",
      )
      .map((row) => row.node_id),
  );

  const nodeTitles: Record<string, string> = {
    "research-question": "سؤال پژوهشی",
    "study-design": "طراحی مطالعه",
    sequencing: "از نمونه تا FASTQ",
    "quality-control": "کنترل کیفیت",
    quantification: "کمی‌سازی بیان",
    "expression-matrix": "ماتریس بیان",
    normalization: "نرمال‌سازی داده",
    "sample-exploration": "بررسی ساختار نمونه‌ها",
    "differential-expression": "تحلیل بیان افتراقی",
    visualization: "نمایش نتایج",
    "functional-analysis": "تحلیل عملکردی",
    interpretation: "تفسیر زیستی",
  };

  const goalRequirements: Record<string, string[]> = {
    network: [
      "study-design",
      "expression-matrix",
      "normalization",
      "sample-exploration",
    ],
    biomarker: [
      "study-design",
      "differential-expression",
      "functional-analysis",
      "interpretation",
    ],
    functional: [
      "differential-expression",
      "functional-analysis",
      "interpretation",
    ],
    "differential-expression": [
      "study-design",
      "expression-matrix",
      "normalization",
      "sample-exploration",
      "differential-expression",
    ],
    explore: [
      "quality-control",
      "sample-exploration",
    ],
    unsure: [
      "research-question",
      "study-design",
      "expression-matrix",
    ],
  };

  const required =
    goalRequirements[
      assessment.analysis_goal ?? "unsure"
    ] ?? goalRequirements["unsure"] ?? [];

  const needsAttention = required.filter(
    (nodeId) =>
      !completedNodeIds.has(nodeId) ||
      reviewNodeIds.has(nodeId),
  );

  const focusNodeIds =
    needsAttention.slice(0, 3);

  const focusNodes = focusNodeIds.map(
    (nodeId) =>
      nodeTitles[nodeId] ?? nodeId,
  );

  if (focusNodes.length > 0) {
    const goal = assessmentGoalLabel(
      assessment.analysis_goal,
    );

    const firstFocusId =
      focusNodeIds[0] ?? "research-question";

    const firstFocusTitle =
      focusNodes[0] ??
      nodeTitles[firstFocusId] ??
      firstFocusId;

    const goalQuery =
      assessment.analysis_goal ??
      "unsure";

    return {
      title: `قبل از ادامه ${goal}، این بخش‌ها را تقویت کنید`,
      description:
        "این پیشنهاد از ترکیب هدف پروژه شما با وضعیت واقعی مسیر یادگیری ساخته شده است. بخش‌های زیر هنوز تکمیل نشده‌اند یا برای مرور دوباره علامت خورده‌اند.",
      focusNodes,
      focusNodeIds,
      actionHref:
        `/learn/rna-seq/navigator?node=${encodeURIComponent(
          firstFocusId,
        )}&source=dashboard&goal=${encodeURIComponent(
          goalQuery,
        )}`,
      actionLabel:
        `رفتن به «${firstFocusTitle}»`,
    };
  }

  if (
    assessment.recommendation_destination ===
    "network-biology"
  ) {
    return {
      title: "پیش‌نیازهای آموزشی اصلی WGCNA را پوشش داده‌اید",
      description:
        "قدم بعدی، بررسی آمادگی واقعی داده برای تحلیل شبکه است؛ به‌ویژه تعداد کل نمونه‌های مستقل، نوع ماتریس بیان و ویژگی‌هایی که قرار است با ماژول‌ها مقایسه شوند.",
      focusNodes: [],
      focusNodeIds: [],
      actionHref: "/consultation",
      actionLabel: "بازبینی آمادگی WGCNA",
    };
  }

  if (
    assessment.recommendation_destination ===
    "biomarker-discovery"
  ) {
    return {
      title: "حالا روی راهبرد کشف و اعتبارسنجی نشانگر تمرکز کنید",
      description:
        "پیش‌نیازهای آموزشی مرتبط تا حد خوبی پوشش داده شده‌اند. قدم بعدی تعریف هدف نشانگر، روش انتخاب کاندیدا و برنامه اعتبارسنجی مستقل است.",
      focusNodes: [],
      focusNodeIds: [],
      actionHref: "/consultation",
      actionLabel: "بازبینی راهبرد نشانگر زیستی",
    };
  }

  if (
    assessment.recommendation_level === "review"
  ) {
    return {
      title: "یادگیری مرتبط خوب پیش رفته؛ حالا طراحی پروژه را بازبینی کنید",
      description:
        "بر اساس ارزیابی پروژه، مسئله اصلی دیگر صرفاً آموزشی نیست و بهتر است تصمیم‌های طراحی یا تحلیل متناسب با پروژه واقعی شما بررسی شوند.",
      focusNodes: [],
      focusNodeIds: [],
      actionHref: "/consultation",
      actionLabel: "درخواست بازبینی تخصصی",
    };
  }

  return {
    title: "برای تبدیل این مسیر به یک طرح تحلیل آماده‌اید",
    description:
      "پیش‌نیازهای آموزشی مرتبط با هدف فعلی شما پوشش داده شده‌اند. قدم بعدی تبدیل سؤال، داده و طراحی مطالعه به یک نقشه تحلیل دقیق است.",
    focusNodes: [],
    focusNodeIds: [],
    actionHref: "/learn/rna-seq/project",
    actionLabel: "ادامه طراحی پروژه",
  };
}

function assessmentGoalLabel(
  value: string | null,
) {
  const labels: Record<string, string> = {
    "differential-expression":
      "تحلیل بیان افتراقی",
    functional:
      "تحلیل عملکردی و مسیرهای زیستی",
    network:
      "تحلیل شبکه و WGCNA",
    biomarker:
      "کشف نشانگر زیستی",
    explore:
      "بررسی اکتشافی داده",
    unsure:
      "تعیین راهبرد تحلیل",
  };

  return value
    ? labels[value] ?? value
    : "هنوز مشخص نشده";
}

function assessmentGoalEnglishLabel(
  value: string | null,
) {
  const labels: Record<string, string> = {
    "differential-expression":
      "Differential Expression Analysis",
    functional:
      "Functional Analysis",
    network:
      "Network Analysis / WGCNA",
    biomarker:
      "Biomarker Discovery",
    explore:
      "Data Exploration",
    unsure:
      "Analysis Strategy",
  };

  return value
    ? labels[value] ?? "RNA-seq"
    : "RNA-seq";
}

function assessmentDestinationLabel(
  value: string | null,
) {
  const labels: Record<string, string> = {
    "rna-seq-foundations":
      "روشن‌کردن پیش‌نیازهای RNA-seq",
    "differential-expression":
      "طراحی تحلیل بیان افتراقی",
    "functional-analysis":
      "تحلیل عملکردی و مسیرهای زیستی",
    "network-biology":
      "بررسی آمادگی برای تحلیل شبکه و WGCNA",
    "biomarker-discovery":
      "طراحی مسیر کشف و اعتبارسنجی نشانگر زیستی",
    "data-exploration":
      "بررسی ساختار و کیفیت داده",
  };

  return value
    ? labels[value] ?? value
    : "در حال تعیین مسیر";
}

function assessmentDataStageLabel(
  value: string | null,
) {
  const labels: Record<string, string> = {
    planning:
      "در مرحله طراحی",
    fastq:
      "داده خام FASTQ",
    "count-matrix":
      "ماتریس شمارش",
    "processed-matrix":
      "ماتریس بیان پردازش‌شده",
    "public-data":
      "مجموعه‌داده عمومی",
    unsure:
      "نیازمند تعیین نوع داده",
  };

  return value
    ? labels[value] ?? value
    : "—";
}

function LearningProgressCard({
  loading,
  error,
  completed,
  total,
  percent,
  reviewCount,
  lastUpdated,
  onRefresh,
}: {
  loading: boolean;
  error: string | null;
  completed: number;
  total: number;
  percent: number;
  reviewCount: number;
  lastUpdated: string | null;
  onRefresh: () => Promise<void>;
}) {
  const hasProgress =
    completed > 0;

  const finished =
    completed >= total;

  return (
    <section className="card-elevated mt-8 overflow-hidden">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border bg-accent/20 p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <BookOpen className="size-5" />
          </span>

          <div>
            <p className="text-xs font-semibold text-primary">
              یادگیری من
            </p>

            <h2 className="mt-1 text-lg font-bold text-navy">
              مسیر یادگیری RNA-seq
            </h2>

            <p
              dir="ltr"
              className="mt-0.5 text-left text-[11px] font-semibold text-muted-foreground"
            >
              RNA-seq Learning Navigator
            </p>
          </div>
        </div>

        <button
          type="button"
          disabled={loading}
          onClick={() => {
            void onRefresh();
          }}
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-xs text-muted-foreground transition hover:bg-secondary disabled:opacity-50"
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
      </div>

      <div className="p-5 sm:p-6">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            در حال دریافت پیشرفت یادگیری…
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-5">
            <p className="text-sm font-bold text-navy">
              پیشرفت یادگیری فعلاً دریافت نشد.
            </p>

            <p className="mt-2 text-xs leading-6 text-muted-foreground">
              {error}
            </p>

            <button
              type="button"
              onClick={() => {
                void onRefresh();
              }}
              className="mt-4 inline-flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2 text-xs font-semibold text-navy hover:bg-secondary"
            >
              <RefreshCw className="size-4 text-primary" />
              تلاش دوباره
            </button>
          </div>
        ) : !hasProgress ? (
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-base font-bold text-navy">
                هنوز مسیر یادگیری RNA-seq را شروع نکرده‌اید.
              </p>

              <p className="mt-2 max-w-3xl text-sm leading-7 text-muted-foreground">
                در این مسیر، ساختار RNA-seq را از سؤال پژوهشی و طراحی
                مطالعه تا FASTQ، کنترل کیفیت، تحلیل بیان افتراقی و
                تفسیر زیستی مرحله‌به‌مرحله یاد می‌گیرید.
              </p>
            </div>

            <Button
              asChild
              variant="hero"
            >
              <Link
                    to="/learn/rna-seq/navigator"
                    search={{
                      node: undefined,
                      source: undefined,
                      goal: undefined,
                    }}
                  >
                شروع یادگیری RNA-seq
              </Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-navy">
                      {finished
                        ? "مسیر کامل شده است"
                        : "مسیر در حال یادگیری است"}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {new Intl.NumberFormat(
                        "fa-IR",
                      ).format(
                        Math.min(
                          completed,
                          total,
                        ),
                      )}{" "}
                      از{" "}
                      {new Intl.NumberFormat(
                        "fa-IR",
                      ).format(
                        total,
                      )}{" "}
                      مرحله مرور شده
                    </p>
                  </div>

                  <p className="text-2xl font-extrabold text-primary">
                    {new Intl.NumberFormat(
                      "fa-IR",
                    ).format(
                      percent,
                    )}
                    ٪
                  </p>
                </div>

                <Progress
                  value={percent}
                  className="mt-4 h-2"
                />

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <LearningMetric
                    label="مراحل مرورشده"
                    value={`${new Intl.NumberFormat(
                      "fa-IR",
                    ).format(
                      Math.min(
                        completed,
                        total,
                      ),
                    )} از ${new Intl.NumberFormat(
                      "fa-IR",
                    ).format(
                      total,
                    )}`}
                  />

                  <LearningMetric
                    label="نیازمند مرور دوباره"
                    value={new Intl.NumberFormat(
                      "fa-IR",
                    ).format(
                      reviewCount,
                    )}
                  />

                  <LearningMetric
                    label="آخرین فعالیت"
                    value={
                      lastUpdated
                        ? formatDateTime(
                            lastUpdated,
                          )
                        : "—"
                    }
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Button
                  asChild
                  variant="hero"
                >
                  <Link
                    to="/learn/rna-seq/navigator"
                    search={{
                      node: undefined,
                      source: undefined,
                      goal: undefined,
                    }}
                  >
                    {finished
                      ? "مرور دوباره مسیر"
                      : "ادامه مسیر یادگیری"}
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  size="sm"
                >
                  <Link to="/learn">
                    مشاهده بخش آموزش
                  </Link>
                </Button>
              </div>
            </div>

            {reviewCount > 0 && (
              <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                <p className="text-sm font-bold text-amber-950">
                  چند مفهوم ارزش مرور دوباره دارند.
                </p>

                <p className="mt-1 text-xs leading-6 text-amber-900/80">
                  {new Intl.NumberFormat(
                    "fa-IR",
                  ).format(
                    reviewCount,
                  )}{" "}
                  مرحله بر اساس پاسخ یا میزان اطمینان شما برای مرور
                  بیشتر علامت‌گذاری شده است. این یک نمره یا ارزیابی
                  رسمی نیست.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

function LearningMetric({
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

      <p className="mt-1 text-sm font-bold leading-6 text-navy">
        {value}
      </p>
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
