import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  BadgeDollarSign,
  CheckCircle2,
  CloudUpload,
  FileBarChart,
  FileText,
  FolderKanban,
  MessageSquare,
  Users2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { projectStages } from "@/lib/content";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "داشبورد پژوهشگر هاب‌ژن | مدیریت پروژه‌های بیوانفورماتیک" },
      {
        name: "description",
        content:
          "پیگیری مراحل پروژه، بارگذاری داده، پیام‌ها، جلسات مشاوره، گزارش‌ها، نتایج و پرداخت‌ها در یک داشبورد پژوهشی.",
      },
      { property: "og:title", content: "داشبورد پژوهشگر" },
      {
        property: "og:description",
        content: "از ثبت پروژه تا تحویل نتایج، همه چیز در یک محیط قابل پیگیری.",
      },
    ],
  }),
  component: Dashboard,
});

const projects = [
  {
    id: "PRJ-2418",
    title: "ترنسکریپتوم میکروگلیا در مدل التهاب عصبی",
    type: "Bulk RNA-seq",
    stage: 4,
    files: 12,
    updated: "۲ روز پیش",
  },
  {
    id: "PRJ-2391",
    title: "اطلس تک‌سلولی نفوذ لنفوسیتی در تومور",
    type: "Single-cell RNA-seq",
    stage: 2,
    files: 5,
    updated: "۶ روز پیش",
  },
  {
    id: "PRJ-2356",
    title: "متاآنالیز سه کوهورت GEO برای امضای ژنی",
    type: "Public dataset",
    stage: 6,
    files: 21,
    updated: "۳ هفته پیش",
  },
];

const files = [
  { name: "samples_metadata.csv", size: "۴۲ کیلوبایت", status: "تأیید شده" },
  { name: "counts_matrix.tsv", size: "۱۸ مگابایت", status: "در حال بررسی" },
  { name: "raw_reads_batch1.fastq.gz", size: "۲٫۴ گیگابایت", status: "بارگذاری شده" },
];

const messages = [
  { from: "تیم تحلیل", text: "متادیتای نمونه‌ها دریافت شد؛ لطفاً گروه کنترل را مشخص کنید.", time: "دیروز" },
  { from: "مشاور ارشد", text: "طرح تحلیل نهایی برای تأیید شما ارسال شد.", time: "۳ روز پیش" },
];

function StageTracker({ stage }: { stage: number }) {
  return (
    <div className="mt-4">
      <Progress value={(stage / projectStages.length) * 100} className="h-1.5" />
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
        {projectStages.map((s, i) => (
          <span
            key={s}
            className={`text-[11px] ${i < stage ? "font-semibold text-primary" : "text-muted-foreground"}`}
          >
            {i < stage ? "● " : "○ "}
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}

function Dashboard() {
  const [active, setActive] = useState(projects[0]!.id);
  const current = projects.find((p) => p.id === active)!;

  return (
    <div className="mx-auto max-w-7xl px-4 py-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl text-navy">داشبورد پژوهشگر</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            خوش آمدید، دکتر رضایی — آزمایشگاه نوروبیولوژی مولکولی
          </p>
        </div>
        <Button asChild variant="hero">
          <Link to="/wizard">ثبت پروژه جدید</Link>
        </Button>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: FolderKanban, label: "پروژه‌های فعال", value: "۲" },
          { icon: CloudUpload, label: "فایل‌های بارگذاری‌شده", value: "۳۸" },
          { icon: Users2, label: "جلسات مشاوره", value: "۵" },
          { icon: FileBarChart, label: "گزارش‌های تحویل‌شده", value: "۳" },
        ].map((s) => (
          <div key={s.label} className="card-elevated p-5">
            <s.icon className="size-5 text-primary" />
            <p className="mt-3 text-2xl font-extrabold text-navy">{s.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[320px_1fr]">
        <aside className="card-elevated h-fit p-5">
          <h2 className="text-sm font-bold text-navy">پروژه‌های من</h2>
          <ul className="mt-4 space-y-2">
            {projects.map((p) => (
              <li key={p.id}>
                <button
                  onClick={() => setActive(p.id)}
                  className={`w-full rounded-xl border p-3 text-start transition-colors ${
                    active === p.id ? "border-primary bg-accent/60" : "border-border hover:bg-secondary"
                  }`}
                >
                  <span className="block text-[11px] text-muted-foreground">{p.id}</span>
                  <span className="mt-1 block text-sm font-semibold leading-6 text-navy">{p.title}</span>
                  <span className="mt-1 block text-[11px] text-primary">{p.type}</span>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <section className="card-elevated p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-lg text-navy">{current.title}</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                {current.id} · {current.type} · آخرین بروزرسانی {current.updated}
              </p>
            </div>
            <span className="rounded-full bg-accent px-3 py-1 text-[11px] font-semibold text-accent-foreground">
              {projectStages[Math.min(current.stage, projectStages.length) - 1]}
            </span>
          </div>

          <StageTracker stage={current.stage} />

          <Tabs defaultValue="files" className="mt-8">
            <TabsList className="flex-wrap">
              <TabsTrigger value="files">داده‌ها</TabsTrigger>
              <TabsTrigger value="messages">پیام‌ها</TabsTrigger>
              <TabsTrigger value="consults">مشاوره‌ها</TabsTrigger>
              <TabsTrigger value="reports">گزارش‌ها</TabsTrigger>
              <TabsTrigger value="results">نتایج</TabsTrigger>
              <TabsTrigger value="payments">پرداخت‌ها</TabsTrigger>
            </TabsList>

            <TabsContent value="files" className="mt-5">
              <div className="rounded-2xl border border-dashed border-primary/40 bg-accent/30 p-8 text-center">
                <CloudUpload className="mx-auto size-7 text-primary" />
                <p className="mt-3 text-sm font-semibold text-navy">بارگذاری داده پروژه</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  FASTQ، ماتریس شمارش، متادیتای نمونه یا فایل نتایج قبلی
                </p>
                <Button variant="soft" className="mt-4">
                  انتخاب فایل
                </Button>
              </div>
              <ul className="mt-4 divide-y divide-border">
                {files.map((f) => (
                  <li key={f.name} className="flex items-center justify-between py-3">
                    <span className="flex items-center gap-2 text-sm text-navy" dir="ltr">
                      <FileText className="size-4 text-primary" />
                      {f.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {f.size} · {f.status}
                    </span>
                  </li>
                ))}
              </ul>
            </TabsContent>

            <TabsContent value="messages" className="mt-5 space-y-3">
              {messages.map((m) => (
                <div key={m.text} className="rounded-2xl border border-border p-4">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm font-bold text-navy">
                      <MessageSquare className="size-4 text-primary" />
                      {m.from}
                    </span>
                    <span className="text-[11px] text-muted-foreground">{m.time}</span>
                  </div>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">{m.text}</p>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="consults" className="mt-5 space-y-3">
              <div className="rounded-2xl border border-border p-4">
                <p className="text-sm font-bold text-navy">مشاوره طراحی پژوهش</p>
                <p className="mt-1 text-xs text-muted-foreground">۹۰ دقیقه · برگزار شده · سند طرح مطالعه تحویل شد</p>
              </div>
              <div className="rounded-2xl border border-border p-4">
                <p className="text-sm font-bold text-navy">جلسه تفسیر نتایج</p>
                <p className="mt-1 text-xs text-muted-foreground">۴۵ دقیقه · در انتظار زمان‌بندی</p>
              </div>
              <Button asChild variant="outline">
                <Link to="/consultation">رزرو جلسه جدید</Link>
              </Button>
            </TabsContent>

            <TabsContent value="reports" className="mt-5 space-y-3">
              {["گزارش کنترل کیفیت داده", "گزارش تحلیل بیان افتراقی", "گزارش غنی‌سازی مسیرها"].map((r) => (
                <div key={r} className="flex items-center justify-between rounded-2xl border border-border p-4">
                  <span className="flex items-center gap-2 text-sm text-navy">
                    <FileBarChart className="size-4 text-primary" />
                    {r}
                  </span>
                  <Button variant="ghost" size="sm">
                    دانلود PDF
                  </Button>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="results" className="mt-5">
              <div className="grid gap-4 sm:grid-cols-3">
                {["Volcano plot", "PCA نمونه‌ها", "Heatmap ۵۰ ژن برتر"].map((r) => (
                  <div key={r} className="rounded-2xl border border-border p-4">
                    <div className="h-24 rounded-xl bg-[image:var(--gradient-primary)] opacity-25" />
                    <p className="mt-3 text-sm font-semibold text-navy">{r}</p>
                    <p className="mt-1 text-[11px] text-muted-foreground">خروجی وکتور، آماده انتشار</p>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="payments" className="mt-5 space-y-3">
              {[
                ["فاز طراحی مطالعه", "تسویه شده"],
                ["فاز تحلیل اولیه", "تسویه شده"],
                ["فاز تفسیر و مصورسازی", "در انتظار پرداخت"],
              ].map(([t, s]) => (
                <div key={t} className="flex items-center justify-between rounded-2xl border border-border p-4">
                  <span className="flex items-center gap-2 text-sm text-navy">
                    <BadgeDollarSign className="size-4 text-primary" />
                    {t}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    {s === "تسویه شده" && <CheckCircle2 className="size-4 text-primary" />}
                    {s}
                  </span>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </section>
      </div>
    </div>
  );
}
