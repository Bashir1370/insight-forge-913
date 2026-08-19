import { createFileRoute, redirect } from "@tanstack/react-router";
import {
  ArrowLeft,
  BookOpenCheck,
  ExternalLink,
  FileClock,
  Image,
  Pencil,
  ShieldCheck,
  Video,
} from "lucide-react";

import { supabase } from "@/integrations/supabase/client";

const lessons = [
  {
    index: 1,
    title: "از سؤال پژوهشی تا طراحی مطالعه",
    href: "/learn/transcriptomics/rna-seq/study-design",
    mode: "visual",
  },
  {
    index: 2,
    title: "از نمونه زیستی تا RNA",
    href: "/learn/transcriptomics/rna-seq/sample-to-rna",
    mode: "visual",
  },
  {
    index: 3,
    title: "آماده‌سازی کتابخانه",
    href: "/learn/transcriptomics/rna-seq/library-preparation",
    mode: "visual",
  },
  {
    index: 4,
    title: "توالی‌یابی و FASTQ",
    href: "/learn/transcriptomics/rna-seq/sequencing-fastq",
    mode: "visual",
  },
  {
    index: 5,
    title: "کنترل کیفیت داده خام",
    href: "/learn/transcriptomics/rna-seq/raw-data-qc",
    mode: "visual",
  },
  {
    index: 6,
    title: "هم‌ترازی و کمی‌سازی",
    href: "/learn/transcriptomics/rna-seq/alignment-quantification",
    mode: "visual",
  },
  {
    index: 7,
    title: "از خوانش‌ها تا ماتریس شمارش",
    href: "/learn/transcriptomics/rna-seq/count-matrix",
    mode: "visual",
  },
  {
    index: 8,
    title: "کنترل کیفیت در سطح نمونه",
    href: "/learn/transcriptomics/rna-seq/sample-level-qc",
    mode: "visual",
  },
  {
    index: 9,
    title: "نرمال‌سازی و بیان افتراقی",
    href: "/learn/transcriptomics/rna-seq/differential-expression",
    mode: "visual",
  },
  {
    index: 10,
    title: "تفسیر زیستی",
    href: "/learn/transcriptomics/rna-seq/biological-interpretation",
    mode: "visual",
  },
  {
    index: 11,
    title: "پروژه یکپارچه سرطان پانکراس",
    href: "/learn/transcriptomics/rna-seq/integrated-project",
    mode: "project",
  },
] as const;

export const Route = createFileRoute("/admin_/content")({
  ssr: false,
  beforeLoad: async () => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      throw redirect({ to: "/auth" });
    }

    const { data: role, error: roleError } = await (supabase as any)
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
      { title: "مدیریت محتوای آموزشی | هاب‌ژن" },
      {
        name: "description",
        content: "ویرایش و انتشار محتوای آموزشی هاب‌ژن بدون تغییر کد",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: LearningContentAdmin,
});

function LearningContentAdmin() {
  return (
    <main className="min-h-screen bg-slate-50" dir="rtl">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="overflow-hidden rounded-[2rem] bg-slate-950 p-6 text-white shadow-xl sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2 text-teal-300">
                <ShieldCheck className="size-5" />
                <span className="text-xs font-black">پنل مدیر محتوا</span>
              </div>
              <h1 className="mt-3 text-2xl font-black sm:text-3xl">
                مدیریت محتوای آموزشی
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-8 text-slate-300">
                درس را باز کنید و همان صفحه واقعی دانشجو را ویرایش کنید. متن، سؤال، گزینه‌ها، تصویر و ویدیو بدون تغییر کد و بدون Deploy قابل مدیریت‌اند.
              </p>
            </div>
            <a
              href="/admin"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 text-sm font-bold text-white hover:bg-white/10"
            >
              بازگشت به پنل اصلی <ArrowLeft className="size-4" />
            </a>
          </div>
        </header>

        <section className="mt-6 grid gap-4 md:grid-cols-3">
          <FeatureCard
            icon={<Pencil className="size-5" />}
            title="ویرایش روی صفحه"
            text="متن‌های اصلی، کارت‌های مفهومی، اصطلاح‌ها، سناریو و آزمون را از ویرایشگر بصری تغییر دهید."
          />
          <FeatureCard
            icon={<Image className="size-5" />}
            title="تصویر و ویدیو"
            text="رسانه را مستقیماً آپلود کنید؛ فایل در Storage هاب‌ژن نگهداری و با محتوای منتشرشده نمایش داده می‌شود."
          />
          <FeatureCard
            icon={<FileClock className="size-5" />}
            title="پیش‌نویس و تاریخچه"
            text="قبل از انتشار پیش‌نمایش بگیرید و در صورت نیاز یکی از نسخه‌های قبلی را به پیش‌نویس برگردانید."
          />
        </section>

        <section className="mt-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-black text-teal-700">اولین مجموعه قابل مدیریت</p>
              <h2 className="mt-1 text-xl font-black text-slate-950">مسیر RNA-seq</h2>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
              <BookOpenCheck className="size-4" /> ۱۱ درس
            </div>
          </div>

          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            {lessons.map((lesson) => (
              <a
                key={lesson.href}
                href={lesson.href}
                className="group flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-md"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-sm font-black text-white">
                    {lesson.index.toLocaleString("fa-IR")}
                  </span>
                  <div className="min-w-0">
                    <p className="font-black text-slate-950">{lesson.title}</p>
                    <p className="mt-1 text-xs leading-6 text-slate-500">
                      {lesson.mode === "visual"
                        ? "ویرایشگر بصری داخل خود درس فعال است"
                        : "شبیه‌ساز پروژه — ویرایشگر اختصاصی محتوا"}
                    </p>
                  </div>
                </div>
                <ExternalLink className="size-4 shrink-0 text-slate-400 transition group-hover:text-teal-700" />
              </a>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-sky-200 bg-sky-50 p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <Video className="mt-1 size-5 shrink-0 text-sky-700" />
            <div>
              <p className="font-black text-sky-950">مرز کد و محتوا حفظ می‌شود</p>
              <p className="mt-2 text-sm leading-8 text-sky-900">
                تغییر جمله، تصویر، ویدیو و سؤال از این پنل انجام می‌شود. اگر یک تعامل علمی کاملاً جدید مثل شبیه‌ساز یا نمودار تعاملی تازه لازم باشد، آن کامپوننت یک‌بار با کد ساخته می‌شود و سپس محتواهای اطرافش از همین CMS مدیریت خواهند شد.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex size-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
        {icon}
      </div>
      <p className="mt-4 font-black text-slate-950">{title}</p>
      <p className="mt-2 text-xs leading-6 text-slate-600">{text}</p>
    </div>
  );
}
