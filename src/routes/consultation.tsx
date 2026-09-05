import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  CalendarClock,
  CheckCircle2,
  FileText,
  Loader2,
  MessageSquareText,
  Microscope,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import {
  listMyProjects,
  shortId,
  type ProjectRow,
} from "@/lib/projects";

export const Route = createFileRoute("/consultation")({
  head: () => ({
    meta: [
      {
        title: "درخواست مشاوره بیوانفورماتیک | هاب‌ژن",
      },
      {
        name: "description",
        content:
          "درخواست مشاوره طراحی پژوهش، بیوانفورماتیک و تفسیر نتایج در هاب‌ژن.",
      },
    ],
  }),

  component: ConsultationPage,
});

type ConsultationType =
  | "initial"
  | "research_design"
  | "bioinformatics"
  | "results_interpretation"
  | "custom";

const consultationTypes: {
  value: ConsultationType;
  title: string;
  description: string;
}[] = [
  {
    value: "initial",
    title: "بررسی اولیه پروژه",
    description:
      "برای زمانی که می‌خواهید درباره امکان‌پذیری پروژه و مسیر کلی تحلیل صحبت کنید.",
  },
  {
    value: "research_design",
    title: "طراحی پژوهش",
    description:
      "بررسی طراحی مطالعه، گروه‌ها، نمونه‌ها، متغیرها و استراتژی تحلیل.",
  },
  {
    value: "bioinformatics",
    title: "مشاوره بیوانفورماتیک",
    description:
      "انتخاب روش‌ها، workflow مناسب، داده‌های موردنیاز و مسیر تحلیل.",
  },
  {
    value: "results_interpretation",
    title: "تفسیر نتایج",
    description:
      "بررسی زیستی نتایج، pathwayها، ژن‌ها، شبکه‌ها و خروجی‌های تحلیل.",
  },
  {
    value: "custom",
    title: "مشاوره سفارشی",
    description:
      "برای موضوعاتی که در دسته‌های بالا قرار نمی‌گیرند.",
  },
];

function ConsultationPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(false);

  const [projectId, setProjectId] = useState("");
  const [consultationType, setConsultationType] =
    useState<ConsultationType>("initial");

  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  /*
   * Load user's real projects
   */
  useEffect(() => {
    const userId = user?.id;
    if (!userId) {
      setProjects([]);
      return;
    }

    let mounted = true;

    async function loadProjects(currentUserId: string) {
      setProjectsLoading(true);

      const { data, error } = await listMyProjects(currentUserId);

      if (!mounted) return;

      if (error) {
        toast.error("دریافت پروژه‌های شما انجام نشد.");
        setProjectsLoading(false);
        return;
      }

      setProjects((data ?? []) as ProjectRow[]);
      setProjectsLoading(false);
    }

    void loadProjects(userId);

    return () => {
      mounted = false;
    };
  }, [user?.id]);

  /*
   * Submit real consultation request
   */
  const submitConsultation = async () => {
    if (!user) {
      toast.error("برای ثبت درخواست ابتدا وارد حساب خود شوید.");
      navigate({
        to: "/auth",
      });
      return;
    }

    const cleanSubject = subject.trim();
    const cleanDescription = description.trim();

    if (!cleanSubject) {
      toast.error("موضوع مشاوره را وارد کنید.");
      return;
    }

    if (cleanSubject.length < 5) {
      toast.error("موضوع مشاوره را کمی کامل‌تر بنویسید.");
      return;
    }

    if (!cleanDescription) {
      toast.error("لطفاً توضیح کوتاهی درباره نیاز پژوهشی خود بنویسید.");
      return;
    }

    if (cleanDescription.length < 20) {
      toast.error(
        "برای بررسی بهتر درخواست، توضیحات را کمی کامل‌تر بنویسید.",
      );
      return;
    }

    setSubmitting(true);

    const { error } = await supabase
      .from("consultations")
      .insert({
        user_id: user.id,
        project_id: projectId || null,
        consultation_type: consultationType,
        subject: cleanSubject,
        description: cleanDescription,
        status: "requested",
      });

    if (error) {
      console.error(error);

      toast.error("ثبت درخواست مشاوره انجام نشد.");
      setSubmitting(false);
      return;
    }

    setSubmitting(false);
    setSubmitted(true);

    toast.success("درخواست مشاوره با موفقیت ثبت شد.");
  };

  /*
   * Auth loading
   */
  if (authLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-5 animate-spin text-primary" />
        در حال بررسی حساب کاربری…
      </div>
    );
  }

  /*
   * Success state
   */
  if (submitted) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-20">
        <div className="card-elevated p-8 text-center sm:p-12">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-accent">
            <CheckCircle2 className="size-7 text-primary" />
          </div>

          <p className="mt-5 text-xs font-semibold text-primary">
            درخواست ثبت شد
          </p>

          <h1 className="mt-2 text-2xl font-bold text-navy">
            درخواست مشاوره شما دریافت شد
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-muted-foreground">
            تیم هاب‌ژن درخواست شما را بررسی خواهد کرد. وضعیت درخواست،
            زمان جلسه و اطلاعات جلسه از طریق داشبورد پژوهشگر در دسترس
            خواهد بود.
          </p>

          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button
              onClick={() => navigate({ to: "/dashboard" })}
              variant="hero"
            >
              رفتن به داشبورد
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setSubmitted(false);
                setProjectId("");
                setConsultationType("initial");
                setSubject("");
                setDescription("");
              }}
            >
              ثبت درخواست دیگر
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-14">
      {/* ========================================
          HEADER
      ======================================== */}

      <div className="mx-auto max-w-3xl text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-accent">
          <CalendarClock className="size-6 text-primary" />
        </div>

        <p className="mt-5 text-sm font-semibold text-primary">
          HubGene Consultation
        </p>

        <h1 className="mt-2 text-3xl font-bold text-navy">
          درخواست مشاوره پژوهشی و بیوانفورماتیک
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
          سؤال پژوهشی، طراحی مطالعه یا چالش تحلیلی خود را توضیح دهید.
          درخواست شما همراه با اطلاعات پروژه برای بررسی تیم هاب‌ژن ثبت
          می‌شود.
        </p>
      </div>

      {/* ========================================
          NOT LOGGED IN
      ======================================== */}

      {!user ? (
        <div className="card-elevated mx-auto mt-10 max-w-2xl p-8 text-center">
          <MessageSquareText className="mx-auto size-8 text-primary" />

          <h2 className="mt-4 text-lg font-bold text-navy">
            برای ثبت درخواست وارد حساب خود شوید
          </h2>

          <p className="mt-2 text-sm leading-7 text-muted-foreground">
            درخواست مشاوره به حساب پژوهشگر و پروژه‌های او متصل می‌شود تا
            بتوانید وضعیت جلسه را از داشبورد پیگیری کنید.
          </p>

          <Button
            asChild
            variant="hero"
            className="mt-6"
          >
            <Link to="/auth">
              ورود / ایجاد حساب
            </Link>
          </Button>
        </div>
      ) : (
        <div className="card-elevated mx-auto mt-10 max-w-3xl p-6 sm:p-8">
          {/* ========================================
              PROJECT
          ======================================== */}

          <div>
            <label
              htmlFor="consultation-project"
              className="text-sm font-bold text-navy"
            >
              این مشاوره مربوط به کدام پروژه است؟
            </label>

            <p className="mt-1 text-xs leading-6 text-muted-foreground">
              اگر هنوز پروژه‌ای ثبت نکرده‌اید یا مشاوره عمومی است، گزینه
              «بدون پروژه» را انتخاب کنید.
            </p>

            {projectsLoading ? (
              <div className="mt-3 flex items-center gap-2 rounded-xl border border-border px-4 py-3 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" />
                در حال دریافت پروژه‌ها…
              </div>
            ) : (
              <select
                id="consultation-project"
                value={projectId}
                onChange={(event) => setProjectId(event.target.value)}
                className="mt-3 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-navy outline-none focus:border-primary"
              >
                <option value="">
                  بدون پروژه / مشاوره اولیه
                </option>

                {projects.map((project) => (
                  <option
                    key={project.id}
                    value={project.id}
                  >
                    {project.title} — {shortId(project.id)}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* ========================================
              CONSULTATION TYPE
          ======================================== */}

          <div className="mt-8">
            <p className="text-sm font-bold text-navy">
              نوع مشاوره
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              نزدیک‌ترین گزینه به نیاز پژوهشی خود را انتخاب کنید.
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {consultationTypes.map((item) => {
                const selected = consultationType === item.value;

                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setConsultationType(item.value)}
                    className={`rounded-2xl border p-4 text-start transition-colors ${
                      selected
                        ? "border-primary bg-accent/50"
                        : "border-border hover:bg-secondary/60"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`mt-0.5 size-4 shrink-0 rounded-full border ${
                          selected
                            ? "border-primary bg-primary"
                            : "border-muted-foreground/40"
                        }`}
                      />

                      <div>
                        <p className="text-sm font-bold text-navy">
                          {item.title}
                        </p>

                        <p className="mt-1 text-xs leading-6 text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ========================================
              SUBJECT
          ======================================== */}

          <div className="mt-8">
            <label
              htmlFor="consultation-subject"
              className="text-sm font-bold text-navy"
            >
              موضوع مشاوره
            </label>

            <p className="mt-1 text-xs text-muted-foreground">
              موضوع را کوتاه و مشخص بنویسید.
            </p>

            <input
              id="consultation-subject"
              type="text"
              maxLength={200}
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              placeholder="مثلاً: طراحی تحلیل RNA-seq برای مقایسه سه گروه"
              className="mt-3 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-navy outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
            />

            <p className="mt-2 text-[11px] text-muted-foreground">
              {new Intl.NumberFormat("fa-IR").format(subject.length)}
              {" / "}
              ۲۰۰ کاراکتر
            </p>
          </div>

          {/* ========================================
              DESCRIPTION
          ======================================== */}

          <div className="mt-7">
            <label
              htmlFor="consultation-description"
              className="text-sm font-bold text-navy"
            >
              سؤال یا نیاز پژوهشی خود را توضیح دهید
            </label>

            <p className="mt-1 text-xs leading-6 text-muted-foreground">
              می‌توانید درباره طراحی مطالعه، نوع داده، گروه‌ها، هدف
              زیستی، مشکل فعلی یا خروجی مورد انتظار توضیح دهید.
            </p>

            <textarea
              id="consultation-description"
              rows={7}
              maxLength={5000}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="مثلاً: برای این مطالعه سه گروه کنترل، بیماری و درمان داریم و می‌خواهیم مشخص کنیم چه استراتژی تحلیلی برای شناسایی ژن‌ها و pathwayهای مرتبط مناسب‌تر است..."
              className="mt-3 w-full resize-y rounded-2xl border border-border bg-background px-4 py-3 text-sm leading-7 text-navy outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
            />

            <p className="mt-2 text-[11px] text-muted-foreground">
              {new Intl.NumberFormat("fa-IR").format(description.length)}
              {" / "}
              ۵۰۰۰ کاراکتر
            </p>
          </div>

          {/* ========================================
              INFORMATION BOX
          ======================================== */}

          <div className="mt-7 rounded-2xl border border-primary/20 bg-accent/30 p-5">
            <div className="flex gap-3">
              <Microscope className="mt-0.5 size-5 shrink-0 text-primary" />

              <div>
                <p className="text-sm font-bold text-navy">
                  بعد از ثبت درخواست چه اتفاقی می‌افتد؟
                </p>

                <p className="mt-2 text-xs leading-7 text-muted-foreground">
                  درخواست ابتدا توسط تیم هاب‌ژن بررسی می‌شود. سپس وضعیت،
                  زمان جلسه، مدت جلسه و در صورت نیاز لینک جلسه از طریق
                  داشبورد شما اعلام خواهد شد.
                </p>
              </div>
            </div>
          </div>

          {/* ========================================
              SUBMIT
          ======================================== */}

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <FileText className="size-4 text-primary" />

              اطلاعات درخواست به حساب شما متصل خواهد شد.
            </div>

            <Button
              type="button"
              variant="hero"
              disabled={submitting}
              onClick={submitConsultation}
            >
              {submitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  در حال ثبت…
                </>
              ) : (
                <>
                  <CalendarClock className="size-4" />
                  ثبت درخواست مشاوره
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </main>
  );
}
