
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  CheckCircle2,
  Loader2,
  Save,
  Sparkles,
  UserRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute(
  "/_authenticated/research-profile",
)({
  head: () => ({
    meta: [
      {
        title: "پروفایل پژوهشی من | هاب‌ژن",
      },
      {
        name: "description",
        content:
          "تنظیم پروفایل پژوهشی شخصی برای پیشنهادهای آموزشی و پژوهشی دقیق‌تر در هاب‌ژن.",
      },
    ],
  }),

  component: ResearchProfilePage,
});

type CareerStage =
  | "bachelor"
  | "master"
  | "phd"
  | "postdoc"
  | "faculty"
  | "researcher"
  | "other";

type ExperienceLevel =
  | "new"
  | "basic"
  | "intermediate"
  | "advanced";

type ProgrammingLevel =
  | "none"
  | "basic"
  | "intermediate"
  | "advanced";

type ResearchLine =
  | "rna-seq"
  | "public-data"
  | "network-biology"
  | "single-cell"
  | "microbiome"
  | "unsure";

type PrimaryGoal =
  | "learn"
  | "design-project"
  | "analyze-data"
  | "solve-problem"
  | "interpret-results"
  | "publish-research"
  | "consultation"
  | "unsure";

type PreferredSupport =
  | "guided-learning"
  | "project-design"
  | "analysis-strategy"
  | "problem-solving"
  | "results-interpretation"
  | "expert-review"
  | "unsure";

type SaveState =
  | "loading"
  | "idle"
  | "saving"
  | "saved"
  | "error";

type ResearchProfileForm = {
  careerStage: CareerStage | "";
  discipline: string;
  bioinformaticsLevel: ExperienceLevel | "";
  programmingLevel: ProgrammingLevel | "";
  primaryResearchLine: ResearchLine | "";
  primaryGoal: PrimaryGoal | "";
  preferredSupport: PreferredSupport | "";
  interests: string[];
  notes: string;
};

type ResearchProfileRow = {
  career_stage: CareerStage | null;
  discipline: string | null;
  bioinformatics_level: ExperienceLevel | null;
  programming_level: ProgrammingLevel | null;
  primary_research_line: ResearchLine | null;
  primary_goal: PrimaryGoal | null;
  preferred_support: PreferredSupport | null;
  interests: string[] | null;
  notes: string | null;
};

const emptyForm: ResearchProfileForm = {
  careerStage: "",
  discipline: "",
  bioinformaticsLevel: "",
  programmingLevel: "",
  primaryResearchLine: "",
  primaryGoal: "",
  preferredSupport: "",
  interests: [],
  notes: "",
};

const careerOptions: {
  id: CareerStage;
  title: string;
  description: string;
}[] = [
  {
    id: "bachelor",
    title: "دانشجوی کارشناسی",
    description: "در حال آشنایی اولیه با پژوهش و تحلیل داده",
  },
  {
    id: "master",
    title: "دانشجوی کارشناسی ارشد",
    description: "در حال انجام پایان‌نامه یا پروژه پژوهشی",
  },
  {
    id: "phd",
    title: "دانشجوی دکتری",
    description: "پژوهش تخصصی و پروژه‌های مستقل‌تر",
  },
  {
    id: "postdoc",
    title: "پژوهشگر پسادکتری",
    description: "پژوهش تخصصی و توسعه مسیر تحقیقاتی",
  },
  {
    id: "faculty",
    title: "عضو هیئت علمی",
    description: "طراحی و هدایت پروژه‌های پژوهشی",
  },
  {
    id: "researcher",
    title: "پژوهشگر",
    description: "فعال در پروژه‌های دانشگاهی یا پژوهشی",
  },
  {
    id: "other",
    title: "سایر",
    description: "اگر جایگاه شما در گزینه‌های بالا نیست",
  },
];

const levelOptions: {
  id: ExperienceLevel;
  title: string;
}[] = [
  {
    id: "new",
    title: "تازه‌کار",
  },
  {
    id: "basic",
    title: "مقدماتی",
  },
  {
    id: "intermediate",
    title: "متوسط",
  },
  {
    id: "advanced",
    title: "پیشرفته",
  },
];

const programmingLevelOptions: {
  id: ProgrammingLevel;
  title: string;
}[] = [
  {
    id: "none",
    title: "بدون تجربه",
  },
  {
    id: "basic",
    title: "مقدماتی",
  },
  {
    id: "intermediate",
    title: "متوسط",
  },
  {
    id: "advanced",
    title: "پیشرفته",
  },
];

const researchLineOptions: {
  id: ResearchLine;
  title: string;
  englishTitle: string;
}[] = [
  {
    id: "rna-seq",
    title: "ترنسکریپتومیکس و RNA-seq",
    englishTitle: "Bulk Transcriptomics",
  },
  {
    id: "public-data",
    title: "پژوهش با داده‌های عمومی",
    englishTitle: "Public Data Research",
  },
  {
    id: "network-biology",
    title: "زیست‌شناسی شبکه‌ای و نشانگر زیستی",
    englishTitle: "Network Biology",
  },
  {
    id: "single-cell",
    title: "ترنسکریپتومیکس تک‌سلولی",
    englishTitle: "Single-cell Transcriptomics",
  },
  {
    id: "microbiome",
    title: "میکروبیوم و تحلیل 16S",
    englishTitle: "Microbiome & 16S",
  },
  {
    id: "unsure",
    title: "هنوز مطمئن نیستم",
    englishTitle: "Not Sure Yet",
  },
];

const goalOptions: {
  id: PrimaryGoal;
  title: string;
}[] = [
  {
    id: "learn",
    title: "یادگیری مفاهیم",
  },
  {
    id: "design-project",
    title: "طراحی پروژه پژوهشی",
  },
  {
    id: "analyze-data",
    title: "تحلیل داده",
  },
  {
    id: "solve-problem",
    title: "حل مشکل در تحلیل",
  },
  {
    id: "interpret-results",
    title: "تفسیر نتایج",
  },
  {
    id: "publish-research",
    title: "تقویت پروژه برای مقاله یا انتشار",
  },
  {
    id: "consultation",
    title: "دریافت مشاوره تخصصی",
  },
  {
    id: "unsure",
    title: "هنوز مشخص نیست",
  },
];

const supportOptions: {
  id: PreferredSupport;
  title: string;
  description: string;
}[] = [
  {
    id: "guided-learning",
    title: "آموزش هدایت‌شده",
    description:
      "می‌خواهم قدم‌به‌قدم مفاهیم را بفهمم و بعد وارد تصمیم‌گیری شوم.",
  },
  {
    id: "project-design",
    title: "طراحی پروژه",
    description:
      "می‌خواهم سؤال، نمونه‌ها و مسیر مطالعه را بهتر طراحی کنم.",
  },
  {
    id: "analysis-strategy",
    title: "راهبرد تحلیل",
    description:
      "می‌خواهم بفهمم برای داده و سؤال من چه تحلیلی مناسب‌تر است.",
  },
  {
    id: "problem-solving",
    title: "حل مسئله",
    description:
      "در بخشی از تحلیل گیر کرده‌ام و راهنمایی هدفمند می‌خواهم.",
  },
  {
    id: "results-interpretation",
    title: "تفسیر نتایج",
    description:
      "خروجی دارم ولی می‌خواهم از آن به یک نتیجه زیستی قابل دفاع برسم.",
  },
  {
    id: "expert-review",
    title: "بازبینی متخصص",
    description:
      "می‌خواهم یک پژوهشگر متخصص طراحی یا مسیر تحلیل را بازبینی کند.",
  },
  {
    id: "unsure",
    title: "هنوز مطمئن نیستم",
    description:
      "می‌خواهم هاب‌ژن بر اساس وضعیت من نوع حمایت مناسب را پیشنهاد دهد.",
  },
];

const interestOptions = [
  "RNA-seq",
  "داده‌های عمومی",
  "WGCNA",
  "کشف نشانگر زیستی",
  "تحلیل عملکردی",
  "GEO",
  "Single-cell",
  "میکروبیوم",
  "PCA",
  "بیان افتراقی",
];

function ResearchProfilePage() {
  const { user } = useAuth();

  const [form, setForm] =
    useState<ResearchProfileForm>(emptyForm);

  const [saveState, setSaveState] =
    useState<SaveState>("loading");

  const [errorMessage, setErrorMessage] =
    useState("");

  const completedFields = useMemo(() => {
    const values = [
      form.careerStage,
      form.discipline.trim(),
      form.bioinformaticsLevel,
      form.programmingLevel,
      form.primaryResearchLine,
      form.primaryGoal,
      form.preferredSupport,
    ];

    return values.filter(Boolean).length;
  }, [form]);

  const completeness = Math.round(
    (completedFields / 7) * 100,
  );

  useEffect(() => {
    const userId = user?.id;
    if (!userId) return;

    let cancelled = false;

    async function loadProfile() {
      setSaveState("loading");
      setErrorMessage("");

      const { data, error } = await (supabase as any)
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
            notes
          `,
        )
        .eq("user_id", userId)
        .maybeSingle();

      if (cancelled) return;

      if (error) {
        console.error(
          "Failed to load research profile:",
          error,
        );

        setSaveState("error");
        setErrorMessage(
          "بازیابی پروفایل پژوهشی انجام نشد.",
        );

        return;
      }

      if (!data) {
        setSaveState("idle");
        return;
      }

      const row =
        data as ResearchProfileRow;

      setForm({
        careerStage:
          row.career_stage ?? "",
        discipline:
          row.discipline ?? "",
        bioinformaticsLevel:
          row.bioinformatics_level ?? "",
        programmingLevel:
          row.programming_level ?? "",
        primaryResearchLine:
          row.primary_research_line ?? "",
        primaryGoal:
          row.primary_goal ?? "",
        preferredSupport:
          row.preferred_support ?? "",
        interests:
          row.interests ?? [],
        notes:
          row.notes ?? "",
      });

      setSaveState("saved");
    }

    void loadProfile();

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  function toggleInterest(
    interest: string,
  ) {
    setForm((previous) => {
      const exists =
        previous.interests.includes(
          interest,
        );

      return {
        ...previous,
        interests: exists
          ? previous.interests.filter(
              (item) =>
                item !== interest,
            )
          : [
              ...previous.interests,
              interest,
            ],
      };
    });

    if (saveState === "saved") {
      setSaveState("idle");
    }
  }

  function updateForm<
    K extends keyof ResearchProfileForm,
  >(
    key: K,
    value: ResearchProfileForm[K],
  ) {
    setForm((previous) => ({
      ...previous,
      [key]: value,
    }));

    if (saveState === "saved") {
      setSaveState("idle");
    }
  }

  async function saveProfile() {
    if (!user?.id) return;

    setSaveState("saving");
    setErrorMessage("");

    const { error } = await (supabase as any)
      .from("research_profiles")
      .upsert(
        {
          user_id: user.id,

          career_stage:
            form.careerStage || null,

          discipline:
            form.discipline.trim() ||
            null,

          bioinformatics_level:
            form.bioinformaticsLevel ||
            null,

          programming_level:
            form.programmingLevel ||
            null,

          primary_research_line:
            form.primaryResearchLine ||
            null,

          primary_goal:
            form.primaryGoal || null,

          preferred_support:
            form.preferredSupport || null,

          interests:
            form.interests,

          notes:
            form.notes.trim() || null,

          updated_at:
            new Date().toISOString(),
        },
        {
          onConflict: "user_id",
        },
      );

    if (error) {
      console.error(
        "Failed to save research profile:",
        error,
      );

      setSaveState("error");
      setErrorMessage(
        "ذخیره پروفایل پژوهشی انجام نشد. دوباره تلاش کنید.",
      );

      return;
    }

    setSaveState("saved");
  }

  if (saveState === "loading") {
    return (
      <div
        dir="rtl"
        className="mx-auto flex min-h-[60vh] max-w-6xl items-center justify-center px-4"
      >
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          در حال بازیابی پروفایل پژوهشی...
        </div>
      </div>
    );
  }

  return (
    <main
      dir="rtl"
      className="mx-auto max-w-7xl px-4 py-12 text-right sm:px-6 lg:px-8"
    >
      <section className="overflow-hidden rounded-[2rem] border border-border bg-background">
        <div className="grid gap-8 bg-gradient-to-l from-accent/70 via-background to-background p-7 sm:p-10 lg:grid-cols-[1fr_0.5fr] lg:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary">
                پروفایل پژوهشی من
              </span>

              <span
                dir="ltr"
                className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-semibold text-muted-foreground"
              >
                Research Profile
              </span>
            </div>

            <h1 className="mt-5 text-3xl font-extrabold leading-[1.5] text-navy sm:text-4xl">
              هاب‌ژن را با مسیر پژوهشی خودتان هماهنگ کنید.
            </h1>

            <p className="mt-4 max-w-3xl text-sm leading-8 text-muted-foreground sm:text-base">
              این اطلاعات کمک می‌کند پیشنهادهای آموزشی، مسیرهای پژوهشی
              و نوع حمایت هاب‌ژن با وضعیت واقعی شما هماهنگ‌تر شوند.
              لازم نیست همه گزینه‌ها را همین حالا تکمیل کنید.
            </p>
          </div>

          <div className="rounded-3xl border border-border bg-background/90 p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <UserRound className="size-5 text-primary" />

              <p className="font-bold text-navy">
                تکمیل پروفایل
              </p>
            </div>

            <p className="mt-4 text-3xl font-extrabold text-navy">
              {new Intl.NumberFormat(
                "fa-IR",
              ).format(completeness)}
              ٪
            </p>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{
                  width: `${completeness}%`,
                }}
              />
            </div>

            <p className="mt-3 text-xs leading-6 text-muted-foreground">
              هدف، جمع‌آوری اطلاعات بیشتر نیست؛ هدف پیشنهاد دقیق‌تر به
              خود شماست.
            </p>
          </div>
        </div>
      </section>

      <div className="mt-8 grid gap-8 xl:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <ProfileSection
            number="۱"
            title="جایگاه پژوهشی شما"
            description="این اطلاعات کمک می‌کند سطح توضیح و نوع پیشنهادها متناسب‌تر باشد."
          >
            <div className="grid gap-3 md:grid-cols-2">
              {careerOptions.map(
                (option) => (
                  <SelectionCard
                    key={option.id}
                    active={
                      form.careerStage ===
                      option.id
                    }
                    title={option.title}
                    description={
                      option.description
                    }
                    onClick={() =>
                      updateForm(
                        "careerStage",
                        option.id,
                      )
                    }
                  />
                ),
              )}
            </div>

            <label className="mt-6 block">
              <span className="text-sm font-bold text-navy">
                رشته یا زمینه پژوهشی
              </span>

              <span className="mt-1 block text-xs leading-6 text-muted-foreground">
                مثلاً زیست‌شناسی سرطان، ژنتیک، علوم اعصاب، میکروبیولوژی
                یا علوم پزشکی
              </span>

              <input
                value={form.discipline}
                onChange={(event) =>
                  updateForm(
                    "discipline",
                    event.target.value,
                  )
                }
                maxLength={120}
                placeholder="زمینه پژوهشی خود را بنویسید..."
                className="mt-3 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-navy outline-none transition focus:border-primary"
              />
            </label>
          </ProfileSection>

          <ProfileSection
            number="۲"
            title="سطح فعلی شما"
            description="این بخش برای تنظیم عمق توضیحات و نوع راهنمایی استفاده می‌شود."
          >
            <LevelSelector
              title="تجربه شما در بیوانفورماتیک"
              value={form.bioinformaticsLevel}
              onChange={(value) =>
                updateForm(
                  "bioinformaticsLevel",
                  value,
                )
              }
            />

            <div className="mt-6">
              <ProgrammingLevelSelector
                title="تجربه شما در برنامه‌نویسی"
                value={form.programmingLevel}
                onChange={(value) =>
                  updateForm(
                    "programmingLevel",
                    value,
                  )
                }
              />
            </div>
          </ProfileSection>

          <ProfileSection
            number="۳"
            title="حوزه پژوهشی اصلی"
            description="این انتخاب مسیر پایه شما را مشخص می‌کند؛ تمرکز پروژه‌های فعلی می‌تواند بعداً متفاوت باشد."
          >
            <div className="grid gap-3 md:grid-cols-2">
              {researchLineOptions.map(
                (option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() =>
                      updateForm(
                        "primaryResearchLine",
                        option.id,
                      )
                    }
                    className={[
                      "rounded-2xl border p-5 text-right transition",
                      form.primaryResearchLine ===
                      option.id
                        ? "border-primary bg-accent/60 shadow-sm"
                        : "border-border bg-background hover:border-primary/40 hover:bg-secondary/20",
                    ].join(" ")}
                  >
                    <p className="font-bold leading-7 text-navy">
                      {option.title}
                    </p>

                    <p
                      dir="ltr"
                      className="mt-1 text-left text-[11px] font-semibold text-primary"
                    >
                      {
                        option.englishTitle
                      }
                    </p>
                  </button>
                ),
              )}
            </div>
          </ProfileSection>

          <ProfileSection
            number="۴"
            title="هدف فعلی شما از هاب‌ژن"
            description="اگر هدف شما تغییر کند، هر زمان می‌توانید این گزینه را به‌روز کنید."
          >
            <div className="grid gap-3 sm:grid-cols-2">
              {goalOptions.map(
                (option) => (
                  <SelectionCard
                    key={option.id}
                    active={
                      form.primaryGoal ===
                      option.id
                    }
                    title={option.title}
                    onClick={() =>
                      updateForm(
                        "primaryGoal",
                        option.id,
                      )
                    }
                  />
                ),
              )}
            </div>
          </ProfileSection>

          <ProfileSection
            number="۵"
            title="چه نوع حمایتی برای شما مفیدتر است؟"
            description="این انتخاب روی نوع اقدام بعدی و پیشنهادهایی که در Dashboard می‌بینید اثر خواهد گذاشت."
          >
            <div className="grid gap-3 md:grid-cols-2">
              {supportOptions.map(
                (option) => (
                  <SelectionCard
                    key={option.id}
                    active={
                      form.preferredSupport ===
                      option.id
                    }
                    title={option.title}
                    description={
                      option.description
                    }
                    onClick={() =>
                      updateForm(
                        "preferredSupport",
                        option.id,
                      )
                    }
                  />
                ),
              )}
            </div>
          </ProfileSection>

          <ProfileSection
            number="۶"
            title="موضوعات مورد علاقه"
            description="اختیاری است. چند موضوعی را که بیشتر با پژوهش شما ارتباط دارند انتخاب کنید."
          >
            <div className="flex flex-wrap gap-2">
              {interestOptions.map(
                (interest) => {
                  const active =
                    form.interests.includes(
                      interest,
                    );

                  return (
                    <button
                      key={interest}
                      type="button"
                      onClick={() =>
                        toggleInterest(
                          interest,
                        )
                      }
                      className={[
                        "rounded-xl border px-4 py-2 text-sm font-semibold transition",
                        active
                          ? "border-primary bg-accent text-primary"
                          : "border-border bg-background text-muted-foreground hover:border-primary/40",
                      ].join(" ")}
                    >
                      {active && "✓ "}
                      {interest}
                    </button>
                  );
                },
              )}
            </div>

            <label className="mt-6 block">
              <span className="text-sm font-bold text-navy">
                توضیح اختیاری
              </span>

              <span className="mt-1 block text-xs leading-6 text-muted-foreground">
                اگر نکته‌ای درباره مسیر پژوهشی یا نیاز فعلی شما وجود دارد
                که گزینه‌های بالا پوشش نمی‌دهند، اینجا بنویسید.
              </span>

              <textarea
                value={form.notes}
                onChange={(event) =>
                  updateForm(
                    "notes",
                    event.target.value,
                  )
                }
                rows={4}
                maxLength={1200}
                placeholder="مثلاً: پایان‌نامه من روی سرطان پستان است و قصد دارم از داده‌های عمومی RNA-seq برای WGCNA استفاده کنم..."
                className="mt-3 w-full resize-y rounded-2xl border border-border bg-background px-4 py-3 text-sm leading-7 text-navy outline-none transition focus:border-primary"
              />
            </label>
          </ProfileSection>
        </div>

        <aside className="xl:sticky xl:top-6 xl:self-start">
          <div className="card-elevated p-6">
            <div className="flex items-center gap-3">
              <Sparkles className="size-5 text-primary" />

              <h2 className="font-bold text-navy">
                هاب‌ژن از این اطلاعات چه استفاده‌ای می‌کند؟
              </h2>
            </div>

            <div className="mt-5 space-y-3">
              <Benefit text="تنظیم سطح توضیحات آموزشی" />
              <Benefit text="اولویت‌بندی مسیرهای پژوهشی" />
              <Benefit text="ساخت اقدام بعدی شخصی‌تر در Dashboard" />
              <Benefit text="پیشنهاد نوع حمایت متناسب با نیاز شما" />
              <Benefit text="تفکیک علاقه کلی از تمرکز پروژه فعلی" />
            </div>

            <div className="mt-6 rounded-2xl border border-primary/20 bg-accent/30 p-4">
              <p className="text-xs font-bold text-navy">
                نکته مهم
              </p>

              <p className="mt-2 text-xs leading-6 text-muted-foreground">
                این پروفایل حکم ثابت درباره شما نیست. با تغییر مسیر
                پژوهشی، می‌توانید هر بخش را ویرایش کنید.
              </p>
            </div>

            {saveState === "error" &&
              errorMessage && (
                <div className="mt-5 rounded-2xl border border-destructive/20 bg-destructive/5 p-4 text-xs leading-6 text-destructive">
                  {errorMessage}
                </div>
              )}

            {saveState === "saved" && (
              <div className="mt-5 flex items-start gap-3 rounded-2xl border border-primary/20 bg-accent/40 p-4">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />

                <div>
                  <p className="text-sm font-bold text-navy">
                    پروفایل ذخیره شده است
                  </p>

                  <p className="mt-1 text-xs leading-6 text-muted-foreground">
                    این اطلاعات در شخصی‌سازی مراحل بعدی هاب‌ژن قابل
                    استفاده است.
                  </p>
                </div>
              </div>
            )}

            <Button
              type="button"
              variant="hero"
              className="mt-6 w-full"
              disabled={
                saveState === "saving"
              }
              onClick={() =>
                void saveProfile()
              }
            >
              {saveState === "saving" ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  در حال ذخیره...
                </>
              ) : (
                <>
                  <Save className="size-4" />
                  ذخیره پروفایل پژوهشی
                </>
              )}
            </Button>

            <Button
              asChild
              variant="outline"
              className="mt-3 w-full"
            >
              <Link to="/dashboard">
                بازگشت به داشبورد
              </Link>
            </Button>
          </div>
        </aside>
      </div>
    </main>
  );
}

function ProfileSection({
  number,
  title,
  description,
  children,
}: {
  number: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="card-elevated p-6 sm:p-8">
      <div className="flex items-start gap-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground">
          {number}
        </span>

        <div>
          <h2 className="text-xl font-bold text-navy">
            {title}
          </h2>

          <p className="mt-2 text-sm leading-7 text-muted-foreground">
            {description}
          </p>
        </div>
      </div>

      <div className="mt-6">
        {children}
      </div>
    </section>
  );
}

function SelectionCard({
  active,
  title,
  description,
  onClick,
}: {
  active: boolean;
  title: string;
  description?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-2xl border p-5 text-right transition",
        active
          ? "border-primary bg-accent/60 shadow-sm"
          : "border-border bg-background hover:border-primary/40 hover:bg-secondary/20",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="font-bold leading-7 text-navy">
          {title}
        </p>

        <span
          className={[
            "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-bold",
            active
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border text-transparent",
          ].join(" ")}
        >
          ✓
        </span>
      </div>

      {description && (
        <p className="mt-2 text-xs leading-6 text-muted-foreground">
          {description}
        </p>
      )}
    </button>
  );
}

function LevelSelector({
  title,
  value,
  onChange,
}: {
  title: string;
  value: ExperienceLevel | "";
  onChange: (
    value: ExperienceLevel,
  ) => void;
}) {
  return (
    <div>
      <p className="text-sm font-bold text-navy">
        {title}
      </p>

      <div className="mt-3 grid gap-2 sm:grid-cols-4">
        {levelOptions.map(
          (option) => (
            <button
              key={option.id}
              type="button"
              onClick={() =>
                onChange(option.id)
              }
              className={[
                "rounded-xl border px-3 py-3 text-sm font-semibold transition",
                value === option.id
                  ? "border-primary bg-accent text-primary"
                  : "border-border bg-background text-muted-foreground hover:border-primary/40",
              ].join(" ")}
            >
              {option.title}
            </button>
          ),
        )}
      </div>
    </div>
  );
}

function ProgrammingLevelSelector({
  title,
  value,
  onChange,
}: {
  title: string;
  value: ProgrammingLevel | "";
  onChange: (
    value: ProgrammingLevel,
  ) => void;
}) {
  return (
    <div>
      <p className="text-sm font-bold text-navy">
        {title}
      </p>

      <div className="mt-3 grid gap-2 sm:grid-cols-4">
        {programmingLevelOptions.map(
          (option) => (
            <button
              key={option.id}
              type="button"
              onClick={() =>
                onChange(option.id)
              }
              className={[
                "rounded-xl border px-3 py-3 text-sm font-semibold transition",
                value === option.id
                  ? "border-primary bg-accent text-primary"
                  : "border-border bg-background text-muted-foreground hover:border-primary/40",
              ].join(" ")}
            >
              {option.title}
            </button>
          ),
        )}
      </div>
    </div>
  );
}

function Benefit({
  text,
}: {
  text: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-secondary/30 p-3">
      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
        ✓
      </span>

      <p className="text-xs leading-6 text-muted-foreground">
        {text}
      </p>
    </div>
  );
}
